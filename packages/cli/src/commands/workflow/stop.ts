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
 *      `meta.timeoutMs` and `now - stepStartedAt > timeoutMs`, emit
 *      `workflow.step.timeout`. TODO (PR E) — the current spec library
 *      does not populate `meta.timeoutMs`, and `WorkflowState` does not
 *      carry `stepStartedAt` yet. The branch short-circuits until both
 *      land.
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

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { readStdin } from '../../lib/stdin.js';
import { isRecord, isString } from '../../lib/guards.js';
import { EventStore } from '../../workflow/store.js';
import {
  appendEventAndUpdateState,
  resolveWorkflowState,
} from '../../workflow/engine.js';
import { createSessionHeartbeat } from '../../workflow/events/session.js';
import type { WorkflowState } from '../../workflow/state.js';
import { resolveSessionDir } from '../session.js';

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
    overrides.payload !== undefined ? overrides.payload : await readJsonStdin();
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
  let store: EventStore;
  try {
    store = new EventStore(dbPath);
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
    emitHeartbeat(store, sessionDir, state, sessionId, now);

    // --- 6. Timeout detection (PR E) -----------------------------------
    // TODO(PR E): wire `meta.timeoutMs` detection. The step-spec schema
    // reserves `meta.timeoutMs?: number`, but the committed specs do NOT
    // populate it today, and `WorkflowState` does not carry a
    // `stepStartedAt` timestamp — both are PR E work. Until they land,
    // the heartbeat is the only Stop-driven event.
    //
    // When implemented:
    //   - load the graph + spec for `state.currentStep`
    //   - compute `elapsedMs = now - state.stepStartedAt`
    //   - if `timeoutMs !== undefined && elapsedMs > timeoutMs`:
    //       emit `workflow.step.timeout` via `createStepTimeout`
    //       with idempotency kind `'system'` (one timeout per step-ms)
    //
    // The observational contract (no permissionDecision, exit 0) applies
    // to the timeout branch too — the reducer will flip the step to
    // `error` and the orchestrator's `next` compile will pick up the
    // error pathway.
  } finally {
    store.close();
  }

  // Observational hook — no permissionDecision, minimal stdout. We do
  // not emit a JSON response because PostToolUse/Stop hooks do not
  // consume one (see `v050-hooks.md:133` for the parallel capture-plan
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
function emitHeartbeat(
  store: EventStore,
  sessionDir: string,
  state: WorkflowState,
  sessionId: string,
  now: Date,
): void {
  const timestamp = now.toISOString();
  const counter = computeHeartbeatCounter(store, now.getTime());

  const event = createSessionHeartbeat({ timestamp });
  try {
    appendEventAndUpdateState(
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
function computeHeartbeatCounter(store: EventStore, nowMs: number): number {
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
// Stdin helpers
// ---------------------------------------------------------------------------

async function readJsonStdin(): Promise<unknown> {
  const raw = await readStdin();
  if (raw === null || raw.trim() === '') return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
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
