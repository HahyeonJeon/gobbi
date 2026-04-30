/**
 * gobbi workflow stop — Stop hook handler.
 *
 * Reads a Claude Code Stop hook JSON payload on stdin, resolves the active
 * session, writes a `session.heartbeat` event to the event store, and
 * (PR E) checks whether the current step has exceeded its configured
 * timeout. The hook is observational — no `permissionDecision` is emitted
 * and the command exits 0 on every path.
 *
 * ## Hook contract
 *
 * > **Observational hook — no permissionDecision, always exit 0.**
 *
 * Source: `v050-hooks.md:135–148`. Three responsibilities:
 *
 *   1. Heartbeat writing — `session.heartbeat` on every turn-end. The
 *      event drives abandoned-session detection (`v050-session.md` §Session
 *      Metadata) and is deduplicated via the `'counter'` idempotency kind
 *      so two heartbeats in the same millisecond both persist.
 *   2. Timeout detection — when the current step's spec declares
 *      `meta.timeoutMs` and `now - state.stepStartedAt > timeoutMs`, emit
 *      `workflow.step.timeout` via `createStepTimeout` under the `'system'`
 *      idempotency kind. One timeout event per step-ms — the storage-layer
 *      UNIQUE constraint dedups same-(sessionId, type, ts, step) retries.
 *      Pre-v0.5.0 sessions whose state lacks `stepStartedAt` (null) and
 *      specs without `meta.timeoutMs` both short-circuit silently.
 *   3. State flush — handled by `appendEventAndUpdateState` on every
 *      append, so there is no extra logic here beyond the heartbeat.
 *
 * ## Reentrance guard
 *
 * `stop_hook_active === true` means Claude Code is already inside another
 * Stop-class hook. Processing would cascade into an infinite loop (see
 * `v050-hooks.md:93,147`). The first branch of the handler is therefore
 * an unconditional silent exit — missing this check is how you stall a
 * session.
 *
 * ## Counter selection for same-millisecond heartbeats
 *
 * The `'counter'` idempotency kind hashes
 * `(sessionId, timestampMs, eventType, counter)` into the
 * `idempotency_key`. For each Stop firing we scan the tail of the
 * heartbeat stream for prior events whose `ts` parses to the same
 * millisecond as the new timestamp, take `maxCounter + 1` (or `0` when
 * the bucket is empty), and pass that to `appendEventAndUpdateState`.
 * Two Stop invocations in the same wall-clock millisecond therefore
 * write distinct keys (`:0` and `:1`) and both persist.
 *
 * @see `.claude/project/gobbi/design/v050-hooks.md` §Stop Hook
 * @see `.claude/project/gobbi/design/v050-session.md` §Event Store Schema
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';

import { readStdinJson } from '../../lib/stdin.js';
import { isRecord, isString } from '../../lib/guards.js';
import { EventStore } from '../../workflow/store.js';
import type { ReadStore } from '../../workflow/store.js';
import {
  appendEventAndUpdateState,
  resolveWorkflowState,
} from '../../workflow/engine.js';
import { createSessionHeartbeat } from '../../workflow/events/session.js';
import { createStepTimeout } from '../../workflow/events/workflow.js';
import type { WorkflowState } from '../../workflow/state-derivation.js';
import { isActiveStep } from '../../workflow/state-derivation.js';
import { getStepById, loadGraph } from '../../specs/graph.js';
import { getSpecsDir } from '../../specs/paths.js';
import { validateStepSpec } from '../../specs/_schema/v1.js';
import type { StepSpec } from '../../specs/types.js';
import { resolvePartitionKeys, resolveSessionDir } from '../session.js';

// ---------------------------------------------------------------------------
// Hook payload shape
// ---------------------------------------------------------------------------

/**
 * Subset of the Claude Code Stop JSON payload this command reads. Fields
 * are optional — a malformed payload still exits 0 silently.
 *
 * `reason` is a best-effort passthrough Claude Code uses on some Stop
 * variants; we accept it without asserting its presence.
 */
interface StopPayload {
  readonly session_id?: string;
  readonly stop_hook_active?: boolean;
  readonly reason?: string;
}

function asPayload(value: unknown): StopPayload {
  if (!isRecord(value)) return {};
  const out: Record<string, unknown> = {};
  const sid = value['session_id'];
  if (isString(sid)) out['session_id'] = sid;
  const reason = value['reason'];
  if (isString(reason)) out['reason'] = reason;
  if (value['stop_hook_active'] === true) out['stop_hook_active'] = true;
  return out as StopPayload;
}

// ---------------------------------------------------------------------------
// Default spec directory — delegated to `specs/paths.ts` so source-mode and
// bundled-mode resolution share one fallback chain. Mirrors `next.ts` so the
// timeout-detection branch reads the same graph + step specs as the compile
// pipeline.
// ---------------------------------------------------------------------------

/** Absolute path to the canonical specs directory. */
export const DEFAULT_SPECS_DIR: string = getSpecsDir();

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

export interface StopOverrides {
  /** Override the resolved session directory (tests-only). */
  readonly sessionDir?: string;
  /** Seed the payload directly (tests-only). */
  readonly payload?: unknown;
  /**
   * Override `Date.now()` for deterministic tests. When supplied, the
   * heartbeat `timestamp` and the same-ms counter scan use this value
   * instead of wall-clock time. Returns a Date so callers can force
   * specific ISO strings.
   */
  readonly now?: () => Date;
  /**
   * Override the spec directory used by the timeout-detection branch
   * (tests-only). When omitted, {@link DEFAULT_SPECS_DIR} is used.
   */
  readonly specsDir?: string;
}

export async function runStop(args: string[]): Promise<void> {
  await runStopWithOptions(args);
}

/**
 * Testable entry point — same behaviour as {@link runStop} but accepts
 * overrides for the session directory, stdin payload, and clock.
 */
export async function runStopWithOptions(
  args: string[],
  overrides: StopOverrides = {},
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // --- 1. Acquire payload ------------------------------------------------
  const rawPayload =
    overrides.payload !== undefined
      ? overrides.payload
      : await readStdinJson<unknown>();
  const payload = asPayload(rawPayload);

  // --- 2. Reentrance guard — MUST be the first action ------------------
  // `stop_hook_active === true` means this Stop fired inside another
  // Stop-class hook. Claude Code sets the flag to break the cascade —
  // per `v050-hooks.md:147` we exit 0 silently without writing any
  // events. Forgetting this check is how you stall a session.
  if (payload.stop_hook_active === true) {
    return;
  }

  // --- 3. Resolve session ----------------------------------------------
  const sessionDir =
    overrides.sessionDir ?? resolveSessionDir(payload.session_id);
  if (sessionDir === null) {
    return; // silent fail — no active session
  }

  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) {
    return; // silent fail — no event store
  }

  // --- 4. Open store + read state --------------------------------------
  const sessionId = payload.session_id ?? sessionDirName(sessionDir);
  const { sessionId: partitionSessionId, projectId } =
    resolvePartitionKeys(sessionDir);
  let store: EventStore;
  try {
    store = new EventStore(dbPath, {
      sessionId: partitionSessionId,
      projectId,
    });
  } catch {
    return;
  }

  try {
    let state: WorkflowState;
    try {
      state = resolveWorkflowState(sessionDir, store, sessionId);
    } catch {
      return;
    }

    // --- 5. Heartbeat ---------------------------------------------------
    const now = overrides.now === undefined ? new Date() : overrides.now();
    await emitHeartbeat(store, sessionDir, state, sessionId, now);

    // --- 6. Timeout detection (PR E) -----------------------------------
    // Read `state.stepStartedAt` (E.10) and the current step spec's
    // `meta.timeoutMs`; when `now - stepStartedAt > timeoutMs`, emit
    // `workflow.step.timeout` via `createStepTimeout` +
    // `appendEventAndUpdateState` with idempotency kind `'system'`. The
    // system kind dedups per (sessionId, type, ts, step) at the SQLite
    // UNIQUE index, so a same-ms retry from Claude Code writes at most
    // one timeout event per step-ms. Observational contract still
    // applies: any failure inside this branch swallows silently; the
    // reducer will flip the step to `error` on successful emit, and the
    // orchestrator's next `next` compile renders the timeout-pathway
    // error prompt.
    const specsDir = overrides.specsDir ?? DEFAULT_SPECS_DIR;
    await detectAndEmitTimeout(
      store,
      sessionDir,
      state,
      sessionId,
      now,
      specsDir,
    );
  } finally {
    store.close();
  }

  // Observational hook — no permissionDecision, minimal stdout. We do
  // not emit a JSON response because PostToolUse/Stop hooks do not
  // consume one (see `v050-hooks.md:133` for the parallel capture-planning
  // case). Claude Code treats any non-empty stdout on Stop as extra
  // context for the next turn; keep it empty.
}

// ---------------------------------------------------------------------------
// Heartbeat emission
// ---------------------------------------------------------------------------

/**
 * Append a `session.heartbeat` event to the store using `'counter'`
 * idempotency. The counter is derived from the tail of the heartbeat
 * stream: count how many prior heartbeats share the same
 * `timestamp-millisecond` bucket and use that count as the new counter.
 * Two Stop invocations in the same wall-clock millisecond therefore
 * write `:0` and `:1` (both persist); a single invocation writes `:0`.
 */
async function emitHeartbeat(
  store: EventStore,
  sessionDir: string,
  state: WorkflowState,
  sessionId: string,
  now: Date,
): Promise<void> {
  const timestamp = now.toISOString();
  const counter = computeHeartbeatCounter(store, now.getTime());

  const event = createSessionHeartbeat({ timestamp });
  try {
    await appendEventAndUpdateState(
      store,
      sessionDir,
      state,
      event,
      'hook',
      sessionId,
      'counter',
      undefined, // toolCallId — unused for counter kind
      null, // parentSeq — heartbeats have no parent
      counter,
      timestamp, // pin the engine's ts to the same ms used for counter scan
    );
  } catch {
    // Observational hook — never propagate a failure. The heartbeat is
    // best-effort; the next Stop will retry and the session will
    // self-heal via the abandoned-session threshold if we keep missing.
  }
}

/**
 * Bound on the heartbeat tail-scan for same-millisecond counter
 * disambiguation. 32 is a generous ceiling — realistic Stop-hook bursts
 * write one or two heartbeats per millisecond bucket, and wall-clock
 * monotonicity means older heartbeats outside the bucket terminate the
 * scan via early-exit. Raising this above 32 would gain nothing on the
 * warm path but widen the LIMIT query's materialised window.
 */
const HEARTBEAT_COUNTER_TAIL_SCAN = 32;

/**
 * Compute the next counter for a same-millisecond heartbeat. Queries
 * the most recent `HEARTBEAT_COUNTER_TAIL_SCAN` heartbeats in DESC
 * order (newest first) and stops once the event timestamp-millisecond
 * no longer matches `nowMs`. Returns `maxCounter + 1` for the matching
 * bucket, or `0` when no heartbeat has been written at this
 * millisecond yet.
 *
 * Bound — `store.lastN` caps the materialised set at the SQL layer;
 * the full heartbeat history is never loaded even on long sessions
 * (1 000+ turns). Wall-clock monotonicity means the bucket is
 * typically empty (new ms) or has one to two entries (rapid retry),
 * so the inner loop terminates at the first row whose `ts` differs.
 */
function computeHeartbeatCounter(store: ReadStore, nowMs: number): number {
  const heartbeats = store.lastN(
    'session.heartbeat',
    HEARTBEAT_COUNTER_TAIL_SCAN,
  );
  // Rows are DESC (newest first). Walk forward, stop once we leave
  // the `nowMs` bucket, keep the max counter seen inside it.
  let maxCounter = -1;
  for (const row of heartbeats) {
    const rowMs = Date.parse(row.ts);
    if (rowMs !== nowMs) break;
    const rowCounter = extractCounterFromKey(row.idempotency_key);
    if (rowCounter !== null && rowCounter > maxCounter) {
      maxCounter = rowCounter;
    }
  }
  return maxCounter + 1;
}

/**
 * Extract the trailing `:<counter>` integer from an idempotency key in
 * the shape `${sessionId}:${ts}:${type}:${counter}`. Returns null if the
 * key lacks the trailing component (e.g. it was written under the
 * `'system'` kind). The `:` separator in `sessionId` is not supported —
 * existing session ids are UUID-like without colons, matching
 * `resolveSessionDir` conventions.
 */
function extractCounterFromKey(key: string): number | null {
  const lastColon = key.lastIndexOf(':');
  if (lastColon < 0) return null;
  const tail = key.slice(lastColon + 1);
  const n = Number.parseInt(tail, 10);
  return Number.isFinite(n) && String(n) === tail ? n : null;
}

// ---------------------------------------------------------------------------
// Timeout detection (E.11)
// ---------------------------------------------------------------------------

/**
 * Emit a `workflow.step.timeout` event when the current step has exceeded
 * its configured `meta.timeoutMs` budget. Short-circuits silently when:
 *
 *   - `state.stepStartedAt` is null — pre-v0.5.0 session, or the workflow
 *     has not yet entered an active step (fresh init at `ideation` with
 *     no prior STEP_EXIT / workflow.resume wire-up).
 *   - The current step is not an active step — `idle`, `done`, `error`
 *     all skip because they have no timeout semantics.
 *   - The graph or spec cannot be loaded — the observational contract
 *     means we never throw out of the Stop hook.
 *   - The step spec does not declare `meta.timeoutMs`.
 *   - `elapsedMs <= timeoutMs` — the budget is not yet exceeded.
 *
 * When the budget IS exceeded, `appendEventAndUpdateState` runs inside
 * its own transaction. The `'system'` idempotency kind hashes
 * `(sessionId, ts, type, step)` into a UNIQUE key, so a repeat Stop at
 * the same wall-clock millisecond writes at most one timeout event. A
 * subsequent Stop at a later millisecond — after the reducer has flipped
 * the step to `error` — will skip because `error` is not an active step.
 */
async function detectAndEmitTimeout(
  store: EventStore,
  sessionDir: string,
  state: WorkflowState,
  sessionId: string,
  now: Date,
  specsDir: string,
): Promise<void> {
  // Pre-v0.5.0 session or no step entered yet — no budget to check.
  if (state.stepStartedAt === null) return;

  // Only active steps carry a timeout budget. `idle`, `done`, `error`
  // have no `meta.timeoutMs` semantics and the reducer would reject a
  // STEP_TIMEOUT for them anyway (ACTIVE_STEPS gate in reducer.ts).
  if (!isActiveStep(state.currentStep)) return;

  // Load the graph + spec for the current step. Any loader failure is
  // swallowed — the Stop hook is observational and must never propagate.
  let spec: StepSpec;
  try {
    spec = await loadStepSpec(specsDir, state.currentStep);
  } catch {
    return;
  }

  const timeoutMs = spec.meta.timeoutMs;
  // Loose-equality (`== null`) is intentional: the AJV schema declares
  // `meta.timeoutMs` as `nullable: true` (see `specs/_schema/v1.ts:101`
  // and the convention note at `_schema/v1.ts:16–20`). Codebase practice
  // is to OMIT the field rather than emit `null`, so in production the
  // TS type (`number | undefined`) is accurate — but a future
  // spec-build or migration path could emit `null` and `=== undefined`
  // alone would silently pass `null` through to the `<=` comparison.
  if (timeoutMs == null) return;

  const startedMs = Date.parse(state.stepStartedAt);
  if (!Number.isFinite(startedMs)) return;

  const elapsedMs = now.getTime() - startedMs;
  // Clock skew → treat as not-elapsed. `stepStartedAt` in the future
  // yields a negative `elapsedMs`; today the `<= timeoutMs` check
  // implicitly covers it (negative ≤ positive), but a refactor to `<`
  // or `Math.abs` would silently break that safety. Explicit guard
  // preserves the invariant regardless of the boundary-condition form.
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) return;
  if (elapsedMs <= timeoutMs) return;

  // Budget exceeded — emit. The reducer's STEP_TIMEOUT case flips the
  // active step to `error`; the next `next` invocation will compile the
  // timeout-pathway error prompt. Any append failure (SQLite busy, disk
  // full, reducer rejection) is swallowed to preserve the observational
  // contract; the next Stop will retry.
  try {
    const event = createStepTimeout({
      step: state.currentStep,
      elapsedMs,
      configuredTimeoutMs: timeoutMs,
    });
    await appendEventAndUpdateState(
      store,
      sessionDir,
      state,
      event,
      'hook',
      sessionId,
      'system',
      undefined, // toolCallId — unused for system kind
      null, // parentSeq — no parent event
      undefined, // counter — unused for system kind
      now.toISOString(),
    );
  } catch {
    // Observational — never propagate. `appendEventAndUpdateState`'s
    // own audit-emit branch will have logged a reducer-rejection case;
    // filesystem failures roll back cleanly inside the transaction.
  }
}

/**
 * Load the `StepSpec` for the given step id by mirroring the loader in
 * `next.ts`. Quiet mode — suppresses `loadGraph`'s best-effort
 * missing-spec warnings so the Stop hook's stderr stays clean. Throws on
 * genuine load failures (bad JSON, missing file, invalid spec); the
 * caller swallows those per the observational contract.
 */
async function loadStepSpec(
  specsDir: string,
  stepId: string,
): Promise<StepSpec> {
  const graphPath = join(specsDir, 'index.json');
  const origWarn = console.warn;
  console.warn = (): void => {};
  let graph;
  try {
    graph = await loadGraph(graphPath);
  } finally {
    console.warn = origWarn;
  }

  const stepDef = getStepById(graph, stepId);
  if (stepDef === undefined) {
    throw new Error(
      `gobbi workflow stop: current step "${stepId}" is not declared in ${graphPath}`,
    );
  }

  const specPath = resolveSpecPath(graphPath, stepDef.spec);
  const raw: unknown = JSON.parse(readFileSync(specPath, 'utf8'));
  const result = validateStepSpec(raw);
  if (!result.ok) {
    throw new Error(
      `gobbi workflow stop: spec ${specPath} failed validation: ${JSON.stringify(result.errors)}`,
    );
  }
  return result.value;
}

function resolveSpecPath(graphPath: string, stepSpec: string): string {
  if (isAbsolute(stepSpec)) return stepSpec;
  return resolve(dirname(graphPath), stepSpec);
}

// ---------------------------------------------------------------------------
// Misc helpers
// ---------------------------------------------------------------------------

function sessionDirName(dir: string): string {
  const parts = dir.split(/[\\/]+/);
  return parts[parts.length - 1] ?? dir;
}

// ---------------------------------------------------------------------------
// Help
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi workflow stop

Stop hook handler. Reads the Claude Code Stop payload on stdin, resolves
the active session, and writes a session.heartbeat event under the
'counter' idempotency kind so same-millisecond repeats both persist.

The reentrance guard (stop_hook_active === true) is the first action —
processing would cascade into an infinite loop otherwise.

Observational hook — writes no permissionDecision and always exits 0.`;

export { USAGE as STOP_USAGE };
