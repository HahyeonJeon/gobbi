/**
 * Per-step README.md writer — fires on `workflow.step.exit` events.
 *
 * When the engine's `appendEventAndUpdateState` commits a STEP_EXIT for a
 * productive step (ideation / planning / execution / evaluation /
 * memorization), this module derives step metadata from the transition
 * (pre-state + effective timestamp + post-state) and writes a markdown
 * README to `<sessionDir>/<step>/README.md`.
 *
 * The file is auto-generated at STEP_EXIT time as a navigation aid. It
 * is NOT the authoritative artifact for the step (those are the per-step
 * synthesis files like `ideation.md` / `plan.md` / `execution.md`); it is
 * a CLI-maintained snapshot that mirrors information already present in
 * `WorkflowState` at exit time and the per-step `artifacts/` directory.
 *
 * ## Discipline
 *
 *   - Pure markdown generation lives in {@link generateStepReadme}
 *     (no I/O, easy to unit-test).
 *   - {@link writeStepReadme} is the fs wrapper the engine calls
 *     post-commit.
 *   - Idempotent by construction — a second STEP_EXIT for the same step
 *     (feedback-loop rewind, manual transition replay) overwrites the
 *     file. `writeFileSync` replaces existing content; no append logic.
 *   - Out-of-scope step values (`idle`, `*_eval`, `done`, `error`) are
 *     silently ignored — the lazy `ensureSessionStepDir` helper only
 *     knows productive step names.
 *
 * @see ../../../../../.gobbi/sessions/35742566-2697-4318-bb06-558346b77b4a/plan/plan.md
 *      §W5.1 (contract + frontmatter fields).
 */

import { writeFileSync } from 'node:fs';
import { join, sep } from 'node:path';

import { ensureSessionStepDir } from '../lib/session-dirs.js';
import type { StepId } from '../specs/artifact-selector.js';
import type { WorkflowState } from './state-derivation.js';

// ---------------------------------------------------------------------------
// Productive-step narrowing
// ---------------------------------------------------------------------------

const PRODUCTIVE_STEPS: ReadonlySet<string> = new Set<string>([
  'ideation',
  'planning',
  'execution',
  'evaluation',
  'memorization',
]);

/**
 * Narrow a `WorkflowState.currentStep` string (the wider `WorkflowStep`
 * union) to the `StepId` subset that maps to a per-step directory under
 * the session root. Returns `null` for `idle`, `done`, `error`, and the
 * `*_eval` variants — none of those materialise a per-step README.
 */
export function asProductiveStepId(step: string): StepId | null {
  return PRODUCTIVE_STEPS.has(step) ? (step as StepId) : null;
}

// ---------------------------------------------------------------------------
// generateStepReadme — pure markdown synthesis
// ---------------------------------------------------------------------------

/**
 * Input for {@link generateStepReadme} and {@link writeStepReadme}. Fields
 * mirror the frontmatter output.
 */
export interface StepReadmeArgs {
  /** Session UUID (matches `WorkflowState.sessionId`). */
  readonly sessionId: string;
  /** Project name (derived from the session dir path segment). */
  readonly projectName: string;
  /** The productive step that just exited. */
  readonly step: StepId;
  /** ISO-8601 timestamp when the step was entered (pre-transition `stepStartedAt`). */
  readonly enteredAt: string | null;
  /** ISO-8601 timestamp when the step was exited (the STEP_EXIT event's `ts`). */
  readonly exitedAt: string;
  /** Most recent evaluation verdict for this step, or `null` if none fired. */
  readonly verdictOutcome: 'pass' | 'revise' | null;
  /** Artifact filenames recorded against this step. */
  readonly artifacts: readonly string[];
  /**
   * Count of subagents still active (not yet COMPLETE/FAIL) at
   * STEP_EXIT. The reducer removes completed/failed subagents from
   * `activeSubagents`, so this reflects outstanding work at exit —
   * typically 0 on a clean finish. Not a total-spawned count.
   */
  readonly subagentsActiveAtExit: number;
  /** Feedback-loop round at exit time. */
  readonly feedbackRound: number;
  /** Step the workflow transitions to next (post-reduction `currentStep`). */
  readonly nextStep: string;
}

/**
 * Produce the markdown body of a per-step README. Pure — callers with a
 * fully-resolved {@link StepReadmeArgs} can snapshot the string for
 * inspection without touching the filesystem.
 */
export function generateStepReadme(args: StepReadmeArgs): string {
  const frontmatter = [
    '---',
    `sessionId: ${args.sessionId}`,
    `projectName: ${args.projectName}`,
    `step: ${args.step}`,
    `enteredAt: ${args.enteredAt ?? 'null'}`,
    `exitedAt: ${args.exitedAt}`,
    `verdictOutcome: ${args.verdictOutcome ?? 'null'}`,
    `feedbackRound: ${args.feedbackRound}`,
    `nextStep: ${args.nextStep}`,
    `subagentsActiveAtExit: ${args.subagentsActiveAtExit}`,
    'artifacts:',
    ...(args.artifacts.length === 0
      ? ['  []']
      : args.artifacts.map((name) => `  - ${name}`)),
    '---',
  ].join('\n');

  const body = [
    '',
    `# ${capitalize(args.step)} — session ${args.sessionId}`,
    '',
    'This README was auto-generated at `workflow.step.exit` from events in `gobbi.db`.',
    `The authoritative artifacts for this step live alongside this file under \`${args.step}/\` —`,
    `see \`rawdata/\` for subagent captures and the per-step synthesis file (e.g. \`${args.step}.md\`).`,
    '',
    `Next step: \`${args.nextStep}\`.`,
    '',
  ].join('\n');

  return `${frontmatter}${body}`;
}

function capitalize(value: string): string {
  return value.length === 0 ? value : value.charAt(0).toUpperCase() + value.slice(1);
}

// ---------------------------------------------------------------------------
// writeStepReadme — fs wrapper called by the engine
// ---------------------------------------------------------------------------

/**
 * Arguments for {@link writeStepReadmeForExit}. The engine composes these
 * from the pre-state, the reduced post-state, and the effective timestamp
 * of the event it just committed.
 */
export interface StepExitWriteArgs {
  readonly sessionDir: string;
  readonly prevState: WorkflowState;
  readonly nextState: WorkflowState;
  readonly exitedStep: string;
  readonly exitedAt: string;
}

/**
 * Generate and write `<sessionDir>/<step>/README.md` for a committed
 * `workflow.step.exit` event.
 *
 * Returns `null` when the exited step is not a productive step (no
 * per-step directory exists); returns the absolute file path on success.
 *
 * Idempotent: overwrites existing `README.md` for the same step — the
 * regenerated version reflects the newer state. Uses `writeFileSync`
 * (not an atomic rename) because the README is non-authoritative
 * metadata; a partial write from a crashed Bun process is acceptable
 * and will be replaced by the next STEP_EXIT.
 */
export function writeStepReadmeForExit(args: StepExitWriteArgs): string | null {
  const step = asProductiveStepId(args.exitedStep);
  if (step === null) return null;

  const stepDir = ensureSessionStepDir(args.sessionDir, step);
  const projectName = projectNameFromSessionDir(args.sessionDir);

  const subagentsActiveAtExit = args.prevState.activeSubagents.filter(
    (agent) => agent.step === step,
  ).length;

  const readmeArgs: StepReadmeArgs = {
    sessionId: args.prevState.sessionId,
    projectName,
    step,
    enteredAt: args.prevState.stepStartedAt,
    exitedAt: args.exitedAt,
    verdictOutcome: args.prevState.lastVerdictOutcome,
    artifacts: args.prevState.artifacts[step] ?? [],
    subagentsActiveAtExit,
    feedbackRound: args.nextState.feedbackRound,
    nextStep: args.nextState.currentStep,
  };

  const filePath = join(stepDir, 'README.md');
  writeFileSync(filePath, generateStepReadme(readmeArgs), 'utf8');
  return filePath;
}

/**
 * Derive the project name from a session directory path of the shape
 * `<...>/.gobbi/projects/<projectName>/sessions/<sessionId>`. Returns the
 * fallback `'gobbi'` when the expected segments are absent — the same
 * fallback `settings-io.ts::resolveProjectName` uses during the
 * transition period.
 *
 * Extracting from the path keeps this module free of a settings-io
 * dependency: the engine already holds an absolute `sessionDir` that by
 * construction (via `workspace-paths.ts::sessionDir`) encodes the
 * project name. Re-reading `.gobbi/settings.json` would duplicate work
 * the caller already did.
 */
function projectNameFromSessionDir(sessionDir: string): string {
  const parts = sessionDir.split(sep).filter((segment) => segment.length > 0);
  // Expected tail: `projects`, `<projectName>`, `sessions`, `<sessionId>`.
  const sessionsIdx = parts.lastIndexOf('sessions');
  if (sessionsIdx >= 2 && parts[sessionsIdx - 2] === 'projects') {
    const name = parts[sessionsIdx - 1];
    if (name !== undefined && name.length > 0) return name;
  }
  return 'gobbi';
}
