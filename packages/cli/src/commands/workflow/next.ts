/**
 * gobbi workflow next — emit the compiled prompt for the current workflow step.
 *
 * Reads the active session's state via `resolveWorkflowState`, resolves the
 * current step's `StepSpec` via the graph loader, applies the substate
 * overlay when `state.currentSubstate !== null`, compiles via
 * `specs/assembly.ts::compile`, and writes `CompiledPrompt.text` to stdout.
 *
 * `next` is a thin wrapper — the compile pipeline is PR A's.
 *
 * ## Error branch
 *
 * When `state.currentStep === 'error'`, `next` dispatches to
 * `compileErrorPrompt(state, store)`, which runs the pathway detector and
 * emits a pathway-specific error-state prompt (crash / timeout /
 * feedbackCap / invalidTransition / unknown).
 *
 * ## Scope (PR C)
 *
 * - Session resolution mirrors `status` — `--session-id`, `CLAUDE_SESSION_ID`,
 *   or the single-session fallback under `.gobbi/sessions/`.
 * - The default workflow graph + spec directory is the committed
 *   `packages/cli/src/specs/` tree; callers can point at a different
 *   directory via `--dir <path>` (matches the `validate` convention).
 * - `next` emits ONE compiled prompt per invocation. It does not advance
 *   state; `gobbi workflow transition` (PR C wave 5) owns that.
 */

import { parseArgs } from 'node:util';
import { existsSync, readFileSync } from 'node:fs';
import {
  dirname,
  isAbsolute,
  join,
  resolve,
} from 'node:path';

import { compile, type CompileInput, type CompileOptions } from '../../specs/assembly.js';
import { compileErrorPrompt } from '../../specs/errors.js';
import { getStepById, loadGraph, type WorkflowGraph } from '../../specs/graph.js';
import { getSpecsDir } from '../../specs/paths.js';
import { applyOverlay, validateOverlay } from '../../specs/overlay.js';
import {
  loadSpecForRuntime,
  type AgentOriginal,
} from '../../specs/spec-loader.js';
import type { StepSpec } from '../../specs/types.js';
import {
  compileVerificationBlock,
  hasVerificationResultsFor,
} from '../../specs/verification-block.js';
import { getRepoRoot } from '../../lib/repo.js';
import { resolveSettings } from '../../lib/settings-io.js';
import { resolveWorkflowState } from '../../workflow/engine.js';
import { defaultPredicates } from '../../workflow/predicates.js';
import type { WorkflowState, WorkflowStep } from '../../workflow/state-derivation.js';
import { EventStore } from '../../workflow/store.js';
import { resolvePartitionKeys, resolveSessionDir } from '../session.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi workflow next [options]

Compile and emit the prompt for the current workflow step.

Options:
  --session-id <id>   Override the active session id (defaults to
                      CLAUDE_SESSION_ID or the single session under
                      .gobbi/sessions/ if only one exists)
  --dir <path>        Spec directory (defaults to the committed
                      packages/cli/src/specs/)
  --help, -h          Show this help message

Exits 1 when no active session can be resolved or the event store is
missing. When the workflow is in the \`error\` step, emits a pathway-specific
error-state prompt (crash / timeout / feedbackCap / invalidTransition /
unknown).`;

const PARSE_OPTIONS = {
  help: { type: 'boolean', short: 'h', default: false },
  'session-id': { type: 'string' },
  dir: { type: 'string' },
} as const;

// ---------------------------------------------------------------------------
// Default spec directory — delegated to `specs/paths.ts` so source-mode and
// bundled-mode resolution share one fallback chain (see paths.ts JSDoc).
// ---------------------------------------------------------------------------

/** Absolute path to the canonical specs directory. */
export const DEFAULT_SPECS_DIR: string = getSpecsDir();

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Overrides consumed by {@link runNextWithOptions}. Exposed for tests only;
 * the CLI entry point {@link runNext} never passes overrides.
 */
export interface NextOverrides {
  /** Override the session directory; when set, --session-id / env are ignored. */
  readonly sessionDir?: string;
  /** Override the spec directory; when set, --dir is ignored. */
  readonly specsDir?: string;
}

export async function runNext(args: string[]): Promise<void> {
  await runNextWithOptions(args);
}

/**
 * Testable entry point — accepts an override for `sessionDir` and
 * `specsDir` so tests can point `next` at a tmpdir without mutating
 * `process.cwd()` or git's global state.
 */
export async function runNextWithOptions(
  args: string[],
  overrides: NextOverrides = {},
): Promise<void> {
  let values: ReturnType<typeof parseArgs>['values'];
  try {
    const parsed = parseArgs({
      args,
      options: PARSE_OPTIONS,
      allowPositionals: false,
    });
    values = parsed.values;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi workflow next: ${message}\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  if (values.help === true) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  const sessionDir =
    overrides.sessionDir ??
    resolveSessionDir(
      typeof values['session-id'] === 'string' ? values['session-id'] : undefined,
    );
  if (sessionDir === null) {
    process.stderr.write(
      `gobbi workflow next: could not resolve an active session directory. ` +
        `Set CLAUDE_SESSION_ID or pass --session-id.\n`,
    );
    process.exit(1);
  }

  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) {
    process.stderr.write(`gobbi workflow next: no event store at ${dbPath}\n`);
    process.exit(1);
  }

  const specsDir =
    overrides.specsDir ??
    (typeof values.dir === 'string' ? resolveDir(values.dir) : DEFAULT_SPECS_DIR);

  const sessionId = sessionDirName(sessionDir);
  const partitionKeys = resolvePartitionKeys(sessionDir);
  const store = new EventStore(dbPath, partitionKeys);
  try {
    const state = resolveWorkflowState(sessionDir, store, sessionId);
    const text = await compileCurrentStep(
      state,
      store,
      specsDir,
      sessionDir,
      sessionId,
    );
    process.stdout.write(text);
    if (!text.endsWith('\n')) process.stdout.write('\n');
  } finally {
    store.close();
  }
}

// ---------------------------------------------------------------------------
// Compile pipeline — exported for tests
// ---------------------------------------------------------------------------

/**
 * Branch on `state.currentStep`:
 *
 *   - `error` → call {@link compileErrorPrompt} (pathway detector +
 *     per-pathway compiler) and return the compiled prompt text directly.
 *   - Anything else → resolve the step's spec, apply the substate overlay
 *     when present, compile, and return `CompiledPrompt.text`.
 *
 * Post-compile, if any active subagent has `verification.result` entries on
 * `state.verificationResults` (emitted out-of-band by hooks outside this
 * command), {@link compileVerificationBlock} appends per-subagent blocks
 * via SECTION_SEPARATOR parity with `specs/assembly.ts::compile`.
 *
 * Exported so tests can drive the compile pipeline from constructed
 * fixtures without rebuilding the CLI surface. `sessionDir` + `sessionId`
 * remain on the signature because future wiring (e.g. post-compile
 * emitters) may scope events to the session.
 */
export async function compileCurrentStep(
  state: WorkflowState,
  store: EventStore,
  specsDir: string,
  sessionDir: string,
  sessionId: string,
): Promise<string> {
  if (state.currentStep === 'error') {
    // Early-return the pathway-specific prompt. The dispatcher runs
    // `detectPathway` + `visitPathway` against the five pathway compilers
    // under `specs/errors.pathway-compilers.ts`.
    const prompt = compileErrorPrompt(state, store);
    return prompt.text;
  }

  const graphPath = join(specsDir, 'index.json');
  // Suppress the graph loader's best-effort missing-spec warnings — they
  // are expected during partial rollouts; `next` is not a validator and
  // should not noise-up stdout-adjacent streams.
  const graph = await loadGraphQuietly(graphPath);

  const stepDef = getStepById(graph, state.currentStep);
  if (stepDef === undefined) {
    throw new Error(
      `gobbi workflow next: current step "${state.currentStep}" is not declared in ${graphPath}`,
    );
  }

  // Resolve the settings cascade once per invocation so the spec loader can
  // overlay `workflow.<step>.{agent,evaluate.agent}.{model,effort}` onto
  // every entry of `spec.delegation.agents[*]` per the step-driven mapping
  // (see `spec-loader.ts::loadSpecForRuntime` JSDoc + PR-FIN-1e ideation
  // §2.3.1). `resolvePartitionKeys` (see `commands/session.ts`) extracts
  // `(sessionId, projectId)` purely from the session-dir path segments —
  // post-PR-FIN-2a-ii there is no per-session `metadata.json` to read.
  // When `projectId` is null (legacy-flat session layout) the cascade
  // falls back to `basename(repoRoot)` inside `resolveSettings`.
  const repoRoot = getRepoRoot();
  const partitionKeys = resolvePartitionKeys(sessionDir);
  const resolvedSettings = resolveSettings({
    repoRoot,
    sessionId,
    ...(partitionKeys.projectId !== null
      ? { projectName: partitionKeys.projectId }
      : {}),
  });

  const specPath = resolveSpecPath(graphPath, stepDef.spec);
  const { spec: baseSpec, originals } = loadSpecForRuntime(
    specPath,
    resolvedSettings,
    state.currentStep,
  );

  let spec: StepSpec = baseSpec;
  if (state.currentSubstate !== null) {
    const overlayPath = join(dirname(specPath), `${state.currentSubstate}.overlay.json`);
    if (existsSync(overlayPath)) {
      spec = applySubstateOverlay(baseSpec, overlayPath);
    }
    // No overlay file is not fatal — substate may be valid without one
    // (e.g. spec author chose not to specialize the prompt). In that case
    // the base spec is emitted as-is.
  }

  const input: CompileInput = {
    spec,
    state,
    dynamic: {
      timestamp: new Date().toISOString(),
      activeSubagentCount: state.activeSubagents.length,
      artifacts: [],
    },
    predicates: defaultPredicates,
    activeAgent: null,
  };

  // Build compile options, threading the agent-routing decoration only
  // when settings produced a non-empty `originals` map. The decoration
  // surfaces the per-agent (model, effort) + provenance suffix in the
  // rendered prompt — orchestrator reads it to drive `Agent()` spawn.
  const slotHint = slotHintForStep(state.currentStep);
  const compileOptions: CompileOptions = buildCompileOptions(originals, slotHint);
  const prompt = compile(input, compileOptions);

  // Verification-block rendering (E.8). Emits one block per active subagent
  // whose `verification.result` entries landed in `state.verificationResults`
  // via an out-of-band emitter (e.g. a post-SubagentStop hook). Blocks
  // concatenate onto the main compiled prompt via SECTION_SEPARATOR parity
  // with `specs/assembly.ts::compile` (double newline). Subagents with no
  // verification output emit no block.
  //
  // The in-process verification helper that previously wrote these events
  // from within `next` was decommissioned in Pass 3 finalize — executors
  // self-verify per `_delegation`'s Study → Plan → Execute → Verify
  // lifecycle. Events from external emitters still render here.
  const verificationSections: string[] = [];
  for (const agent of state.activeSubagents) {
    if (!hasVerificationResultsFor(state, agent.subagentId)) continue;
    const block = compileVerificationBlock(state, agent.subagentId);
    verificationSections.push(block.text);
  }
  if (verificationSections.length === 0) return prompt.text;
  return [prompt.text, ...verificationSections].join('\n\n');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveDir(dir: string): string {
  return isAbsolute(dir) ? dir : resolve(process.cwd(), dir);
}

/**
 * Map a {@link WorkflowStep} to the dotted-path that names the active
 * settings slot (used by the agent-routing block as the override
 * provenance suffix). Mirrors `spec-loader.ts::pickSettingsSlot`'s
 * step-driven mapping.
 *
 * Returns `null` for steps that do not consume a settings slot
 * (`idle`, `done`, `error`, `memorization`, `handoff`) — the renderer
 * skips the block entirely for empty `delegation.agents` anyway, so the
 * `null` return is the symmetric safe default.
 */
function slotHintForStep(step: WorkflowStep): string | null {
  switch (step) {
    case 'ideation':
      return 'workflow.ideation.agent';
    case 'planning':
      return 'workflow.planning.agent';
    case 'execution':
      return 'workflow.execution.agent';
    case 'ideation_eval':
      return 'workflow.ideation.evaluate.agent';
    case 'planning_eval':
      return 'workflow.planning.evaluate.agent';
    case 'execution_eval':
      return 'workflow.execution.evaluate.agent';
    default:
      return null;
  }
}

/**
 * Assemble the {@link CompileOptions} bag for `compile()`. Builds
 * `originals` and `slotHint` fields conditionally so the spread never
 * sets a value of `undefined` explicitly (incompatible with
 * `exactOptionalPropertyTypes: true` — both fields are declared as
 * pure-optional, not `T | undefined`).
 */
function buildCompileOptions(
  originals: Readonly<Record<string, AgentOriginal>>,
  slotHint: string | null,
): CompileOptions {
  // The originals map is always populated by `loadSpecForRuntime` (one
  // entry per spec.delegation.agents[*]); empty only when the spec has no
  // agents (planning, memorization, handoff). Forward an empty map and
  // let `renderAgentRoutingBlock` skip emission internally — the block
  // gating on `delegation.agents.length === 0` is the canonical guard.
  return { originals, slotHint };
}

function resolveSpecPath(graphPath: string, stepSpec: string): string {
  if (isAbsolute(stepSpec)) return stepSpec;
  return resolve(dirname(graphPath), stepSpec);
}

function applySubstateOverlay(base: StepSpec, overlayPath: string): StepSpec {
  const raw: unknown = JSON.parse(readFileSync(overlayPath, 'utf8'));
  const guarded = validateOverlay(raw);
  if (!guarded.ok) {
    throw new Error(
      `gobbi workflow next: overlay ${overlayPath} failed validation: ${guarded.errors.join('; ')}`,
    );
  }
  return applyOverlay(base, guarded.value);
}

async function loadGraphQuietly(path: string): Promise<WorkflowGraph> {
  const origWarn = console.warn;
  console.warn = (): void => {};
  try {
    return await loadGraph(path);
  } finally {
    console.warn = origWarn;
  }
}

function sessionDirName(dir: string): string {
  const parts = dir.split(/[\\/]+/);
  return parts[parts.length - 1] ?? dir;
}
