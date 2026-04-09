/**
 * gobbi prompt — render phase-specific orchestrator prompts.
 *
 * Subcommands:
 *   <phase>           Render the prompt for the given phase
 *   validate          Validate all registered prompt templates
 *   status            Show current prompt state and consistency
 *   record-outcome    Record a phase outcome and print the next command
 *
 * Options:
 *   --markdown        Output in markdown format (default: plain text)
 *   --help            Show this help message
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { error, ok, header, dim, formatTable } from '../lib/style.js';
import { isPromptPhase, isPromptTemplate, VALID_PROMPT_PHASES } from '../lib/prompt/types.js';
import type { PromptPhase } from '../lib/prompt/types.js';
import { readPromptState, resolvePromptStatePath, writePromptStateAtomic, updatePromptHistory, emptyPromptState } from '../lib/prompt/state.js';
import { resolveAllVariables, PromptResolutionError } from '../lib/prompt/variables.js';
import { renderPrompt } from '../lib/prompt/renderer.js';
import { getTemplate } from '../lib/prompt/templates/index.js';
import { getTransitionNode, getNextPhase } from '../lib/prompt/graph.js';
import { withLock } from '../lib/lockfile.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi prompt <phase> [options]

Phases:
  session-start      Initialize session (settings, project detection)
  workflow-start     Classify task and start workflow

Subcommands:
  validate                          Validate all registered prompt templates
  status                            Show current prompt state and consistency
  record-outcome <phase> <outcome>  Record a phase outcome and print next command

Options:
  --markdown         Output in markdown format (default: plain text)
  --help             Show this help message`;

// ---------------------------------------------------------------------------
// Implemented Phases
// ---------------------------------------------------------------------------

const IMPLEMENTED_PHASES: readonly PromptPhase[] = ['session-start', 'workflow-start'];

// ---------------------------------------------------------------------------
// Top-Level Router
// ---------------------------------------------------------------------------

/**
 * Top-level handler for `gobbi prompt`. Dispatches to subcommands.
 * Called from cli.ts with process.argv.slice(3).
 */
export async function runPrompt(args: string[]): Promise<void> {
  const subcommand = args[0];

  switch (subcommand) {
    case '--help':
    case undefined:
      console.log(USAGE);
      return;
    case 'validate':
      await runPromptValidate();
      return;
    case 'status':
      await runPromptStatus();
      return;
    case 'record-outcome':
      await runPromptRecordOutcome(args.slice(1));
      return;
    default:
      await runPromptRender(args);
      return;
  }
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

async function runPromptRender(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      markdown: { type: 'boolean', default: false },
    },
  });

  const phaseArg = positionals[0];
  if (phaseArg === undefined) {
    console.error(error('No phase specified'));
    console.log(USAGE);
    process.exit(1);
  }

  if (!isPromptPhase(phaseArg)) {
    console.error(error(`"${phaseArg}" is not a valid prompt phase`));
    console.error(dim(`  Valid phases: ${VALID_PROMPT_PHASES.join(', ')}`));
    process.exit(1);
  }

  const template = getTemplate(phaseArg);
  if (template === undefined) {
    console.error(error(`Phase "${phaseArg}" is not yet implemented. Available: ${IMPLEMENTED_PHASES.join(', ')}`));
    process.exit(1);
  }

  // Build runtime values
  const runtimeValues: Record<string, string> = {};

  if (phaseArg === 'workflow-start') {
    // Read project name from prompt state or use default
    const statePath = resolvePromptStatePath();
    if (statePath !== null) {
      const state = await readPromptState(statePath);
      if (state !== null && state.project.name !== '') {
        runtimeValues['projectName'] = state.project.name;
      } else {
        runtimeValues['projectName'] = 'default';
      }
    } else {
      runtimeValues['projectName'] = 'default';
    }

    // Read orchestration gotchas file
    const projectDir = process.env['CLAUDE_PROJECT_DIR'];
    if (projectDir !== undefined) {
      const gotchasPath = join(projectDir, '.claude', 'skills', '_orchestration', 'gotchas.md');
      try {
        const gotchasContent = await readFile(gotchasPath, 'utf8');
        runtimeValues['orchestrationGotchas'] = gotchasContent;
      } catch {
        runtimeValues['orchestrationGotchas'] = 'No gotchas loaded.';
      }
    } else {
      runtimeValues['orchestrationGotchas'] = 'No gotchas loaded.';
    }
  }

  // Resolve variables
  let resolved: Record<string, string>;
  try {
    resolved = await resolveAllVariables(template.variables, runtimeValues);
  } catch (err) {
    if (err instanceof PromptResolutionError) {
      console.error(error(`Variable resolution failed: ${err.message}`));
      process.exit(1);
    }
    throw err;
  }

  // Render
  const markdown = values.markdown === true;
  const output = renderPrompt(template, resolved, { markdown });
  console.log(output);

  // Update prompt state
  const statePath = resolvePromptStatePath();
  if (statePath !== null) {
    try {
      await withLock(statePath, async () => {
        const current = await readPromptState(statePath) ?? emptyPromptState();
        const updated = updatePromptHistory(current, phaseArg, 'rendered');
        const withPhase = {
          ...updated,
          workflow: {
            ...updated.workflow,
            currentPhase: phaseArg,
          },
        };
        await writePromptStateAtomic(statePath, withPhase);
      });
    } catch {
      // State update is best-effort — do not fail the render
      console.error(dim('  (Could not update prompt state)'));
    }
  }
}

// ---------------------------------------------------------------------------
// Record Outcome
// ---------------------------------------------------------------------------

async function runPromptRecordOutcome(args: string[]): Promise<void> {
  const phaseArg = args[0];
  const outcomeArg = args[1];

  if (phaseArg === undefined || outcomeArg === undefined) {
    console.error(error('Usage: gobbi prompt record-outcome <phase> <outcome-id>'));
    process.exit(1);
  }

  // Validate phase
  if (!isPromptPhase(phaseArg)) {
    console.error(error(`"${phaseArg}" is not a valid prompt phase`));
    console.error(dim(`  Valid phases: ${VALID_PROMPT_PHASES.join(', ')}`));
    process.exit(1);
  }

  // Validate outcome against the transition graph node's completion outcomes
  const node = getTransitionNode(phaseArg);
  if (node === undefined) {
    console.error(error(`No transition graph node for phase "${phaseArg}"`));
    process.exit(1);
  }

  const validOutcomeIds = node.completion.outcomes.map((o) => o.id);
  if (!validOutcomeIds.includes(outcomeArg)) {
    console.error(error(`"${outcomeArg}" is not a valid outcome for phase "${phaseArg}"`));
    console.error(dim(`  Valid outcomes: ${validOutcomeIds.join(', ')}`));
    process.exit(1);
  }

  // Update prompt state
  const statePath = resolvePromptStatePath();
  if (statePath === null) {
    console.error(error('CLAUDE_PROJECT_DIR is not set — cannot update prompt state'));
    process.exit(1);
  }

  await withLock(statePath, async () => {
    const current = await readPromptState(statePath) ?? emptyPromptState();
    const withHistory = updatePromptHistory(current, phaseArg, outcomeArg);
    const updated = {
      ...withHistory,
      workflow: {
        ...withHistory.workflow,
        currentPhase: phaseArg,
      },
    };
    await writePromptStateAtomic(statePath, updated);
  });

  // Resolve and print next phase
  const nextPhase = getNextPhase(phaseArg, { outcome: outcomeArg });

  if (nextPhase === null) {
    console.log('Terminal — no next phase');
  } else {
    console.log(`gobbi prompt ${nextPhase}`);
  }
}

// ---------------------------------------------------------------------------
// Validate
// ---------------------------------------------------------------------------

async function runPromptValidate(): Promise<void> {
  console.log(header('Prompt Template Validation'));
  console.log('');

  let allPassed = true;

  for (const phase of VALID_PROMPT_PHASES) {
    const template = getTemplate(phase);

    if (template === undefined) {
      console.log(dim(`  - ${phase}: not yet implemented`));
      continue;
    }

    // Structural validation via type guard
    if (!isPromptTemplate(template)) {
      console.log(error(`${phase}: fails structural validation`));
      allPassed = false;
      continue;
    }

    // Check schema matches phase
    const expectedSchema = `gobbi-prompt/${phase}`;
    if (template.$schema !== expectedSchema) {
      console.log(error(`${phase}: schema mismatch (expected "${expectedSchema}", got "${template.$schema}")`));
      allPassed = false;
      continue;
    }

    // Check phase field
    if (template.phase !== phase) {
      console.log(error(`${phase}: phase field mismatch (expected "${phase}", got "${template.phase}")`));
      allPassed = false;
      continue;
    }

    // Try resolving variables with mock runtime values
    const mockRuntime: Record<string, string> = {};
    for (const [name, decl] of Object.entries(template.variables)) {
      if (decl.source === 'runtime') {
        mockRuntime[decl.path] = `<mock-${name}>`;
      }
    }

    let resolved: Record<string, string>;
    try {
      // For validation, override required env/config/file variables with fallbacks
      // by creating a permissive resolution that catches errors
      resolved = await resolveAllVariablesPermissive(template.variables, mockRuntime);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(error(`${phase}: variable resolution failed: ${msg}`));
      allPassed = false;
      continue;
    }

    // Try rendering
    try {
      const output = renderPrompt(template, resolved, { markdown: false });
      const lineCount = output.split('\n').length;
      console.log(ok(`${phase}: valid (${Object.keys(template.variables).length} variables, ${template.layers.length} layers, ${lineCount} lines)`));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(error(`${phase}: render failed: ${msg}`));
      allPassed = false;
    }
  }

  console.log('');
  if (allPassed) {
    console.log(ok('All implemented templates pass validation'));
  } else {
    console.log(error('Some templates failed validation'));
    process.exit(1);
  }
}

/**
 * Permissive variable resolution for validation purposes.
 * Fills in mock values for required variables that cannot be resolved
 * from the environment (env, config, file, command, state, git sources).
 */
async function resolveAllVariablesPermissive(
  variables: Record<string, import('../lib/prompt/types.js').VariableDeclaration>,
  runtimeValues: Record<string, string>,
): Promise<Record<string, string>> {
  const resolved: Record<string, string> = {};

  for (const [name, declaration] of Object.entries(variables)) {
    // For runtime variables, use the provided mock values
    if (declaration.source === 'runtime') {
      const value = runtimeValues[declaration.path];
      resolved[name] = value ?? declaration.fallback ?? `<${name}>`;
      continue;
    }

    // For other sources, try real resolution but fall back gracefully
    try {
      const { resolveVariable } = await import('../lib/prompt/variables.js');
      const value = await resolveVariable(name, declaration, runtimeValues);
      resolved[name] = value ?? declaration.fallback ?? `<${name}>`;
    } catch {
      resolved[name] = declaration.fallback ?? `<${name}>`;
    }
  }

  return resolved;
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

async function runPromptStatus(): Promise<void> {
  const statePath = resolvePromptStatePath();

  if (statePath === null) {
    console.log(dim('No prompt state found. CLAUDE_PROJECT_DIR is not set.'));
    console.log(dim('Run `gobbi prompt session-start` inside a Claude Code session to initialize.'));
    return;
  }

  const state = await readPromptState(statePath);

  if (state === null) {
    console.log(dim('No prompt state found. Run `gobbi prompt session-start` to initialize.'));
    return;
  }

  // Display current state
  console.log(header('Prompt State'));
  console.log('');

  // Session settings
  console.log(header('Session'));
  const sessionRows: string[][] = [
    ['trivialRange', state.session.trivialRange],
    ['evaluationMode', state.session.evaluationMode],
    ['gitWorkflow', state.session.gitWorkflow],
    ['notify.slack', String(state.session.notify.slack)],
    ['notify.telegram', String(state.session.notify.telegram)],
    ['notify.discord', String(state.session.notify.discord)],
  ];
  console.log(formatTable(['Setting', 'Value'], sessionRows));
  console.log('');

  // Project context
  console.log(header('Project'));
  const projectRows: string[][] = [
    ['name', state.project.name || dim('(not set)')],
    ['noteDir', state.project.noteDir ?? dim('(none)')],
    ['projectDir', state.project.projectDir || dim('(not set)')],
    ['baseBranch', state.project.baseBranch ?? dim('(none)')],
  ];
  console.log(formatTable(['Field', 'Value'], projectRows));
  console.log('');

  // Workflow state
  console.log(header('Workflow'));
  const workflowRows: string[][] = [
    ['currentPhase', state.workflow.currentPhase ?? dim('(none)')],
    ['taskSlug', state.workflow.taskSlug ?? dim('(none)')],
    ['taskTier', state.workflow.taskTier ?? dim('(none)')],
    ['feedbackRound', String(state.workflow.feedbackRound)],
  ];
  console.log(formatTable(['Field', 'Value'], workflowRows));
  console.log('');

  // History
  if (state.history.length > 0) {
    console.log(header('History'));
    const historyRows: string[][] = state.history.map((entry) => [
      entry.phase,
      entry.outcome,
      entry.timestamp,
    ]);
    console.log(formatTable(['Phase', 'Outcome', 'Timestamp'], historyRows));
  } else {
    console.log(dim('No history entries.'));
  }

  // Consistency check
  console.log('');
  console.log(header('Consistency'));
  const currentPhase = state.workflow.currentPhase;
  if (currentPhase === null) {
    console.log(dim('  No active workflow phase.'));
  } else {
    const noteDir = state.project.noteDir;
    if (noteDir !== null) {
      console.log(ok(`Active phase: ${currentPhase}, note directory: ${noteDir}`));
    } else {
      console.log(dim(`  Active phase: ${currentPhase}, but no note directory set.`));
    }
  }
}
