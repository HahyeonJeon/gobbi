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
import { fileURLToPath } from 'node:url';

import { compile, type CompileInput } from '../../specs/assembly.js';
import { compileErrorPrompt } from '../../specs/errors.js';
import { getStepById, loadGraph, type WorkflowGraph } from '../../specs/graph.js';
import { applyOverlay, validateOverlay } from '../../specs/overlay.js';
import { validateStepSpec } from '../../specs/_schema/v1.js';
import type { StepSpec } from '../../specs/types.js';
import { resolveWorkflowState } from '../../workflow/engine.js';
import { defaultPredicates } from '../../workflow/predicates.js';
import type { WorkflowState } from '../../workflow/state.js';
import { EventStore } from '../../workflow/store.js';
import { runVerification } from '../../workflow/verification-runner.js';
import { resolveSessionDir } from '../session.js';

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
// Default spec directory — module-relative for cwd independence.
// ---------------------------------------------------------------------------

const THIS_DIR = dirname(fileURLToPath(import.meta.url));

/** Absolute path to the committed `packages/cli/src/specs/` directory. */
export const DEFAULT_SPECS_DIR: string = resolve(
  THIS_DIR,
  '..',
  '..',
  'specs',
);

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
  const store = new EventStore(dbPath);
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
 * Post-compile, the verification runner (E.3) fires against
 * `state.activeSubagents`, writes `verification.result` events through
 * {@link appendEventAndUpdateState}, and advances `state.verificationResults`
 * for the E.8 verification-block consumer on the NEXT `next` invocation.
 * The compiled prompt returned from THIS call reflects the state captured
 * at compile time — verification feeds the following round-trip.
 *
 * Exported so tests can drive the compile pipeline from constructed
 * fixtures without rebuilding the CLI surface. `sessionDir` + `sessionId`
 * are required because the verification runner writes events scoped to
 * the session.
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

  // E.8 ZONE: verification-block dynamic section insertion (if verificationResults has entries)

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

  const specPath = resolveSpecPath(graphPath, stepDef.spec);
  const baseSpec = loadSpec(specPath);

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

  const prompt = compile(input);

  // Post-compile verification runner (E.3 ZONE). Runs the project's
  // `runAfterSubagentStop` commands for each active subagent and writes
  // `verification.result` events via `appendEventAndUpdateState`. The
  // emissions advance `state.verificationResults`, which the NEXT `next`
  // invocation's compile pass will fold into its prompt via E.8's
  // verification-block dynamic section.
  //
  // Verification runs with no caller abort signal here — `next` is not
  // cancellable at the CLI surface. A future wrapper that ties SIGINT to
  // cancellation would thread its controller.signal through this call.
  await runVerification(sessionDir, store, state, sessionId);

  // Re-resolve state after verification writes so any subsequent reads
  // below (none today, but defensive against future edits that consume
  // verificationResults in this same function) see the advanced state.
  // The compiled prompt above has already been built and does not change.
  void resolveWorkflowState(sessionDir, store, sessionId);

  return prompt.text;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveDir(dir: string): string {
  return isAbsolute(dir) ? dir : resolve(process.cwd(), dir);
}

function resolveSpecPath(graphPath: string, stepSpec: string): string {
  if (isAbsolute(stepSpec)) return stepSpec;
  return resolve(dirname(graphPath), stepSpec);
}

function loadSpec(path: string): StepSpec {
  const raw: unknown = JSON.parse(readFileSync(path, 'utf8'));
  const result = validateStepSpec(raw);
  if (!result.ok) {
    throw new Error(
      `gobbi workflow next: spec ${path} failed validation: ${JSON.stringify(result.errors)}`,
    );
  }
  return result.value;
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
