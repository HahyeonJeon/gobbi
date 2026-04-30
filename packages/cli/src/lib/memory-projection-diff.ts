/**
 * Pure divergence detector between event-derived workflow state and the
 * `project.json` handoff projection — single source of truth shared by
 * future PR-B `gobbi memory check` and PR-C's `verify-state-projections`
 * maintenance command.
 *
 * # Contract
 *
 * `memoryProjectionDiff()` is synchronous and pure: it does NO I/O and
 * NEVER throws on per-session corruption. All discovered drift is
 * surfaced as `MemoryDivergence` rows in the result. The library
 * throwing is reserved for "the library could not run at all" (e.g. the
 * caller passed `undefined` where a `ReadStore` was required).
 *
 * The caller is responsible for I/O:
 *
 *   - Read `project.json` (or pass `null` for an empty memory).
 *   - Open a `ReadStore` against the workspace `.gobbi/state.db` (or
 *     per-session `gobbi.db`).
 *   - Inject the production `reduce` function — the lib stays free of
 *     the lib→workflow circular import that broke `engine.ts` apart in
 *     Wave A.1. Mirrors `state-derivation.ts::deriveState`'s injection
 *     pattern.
 *
 * # Critical type-import (Architecture eval F2)
 *
 * `ReduceFn` is imported from `'../workflow/types.js'`, NOT from
 * `'../workflow/state-derivation.js'`. The latter pulls
 * `lib/settings.js` through its `ResolvedSettings` import which would
 * close a type-graph cycle for any `lib/`-side consumer. `types.ts` is
 * the dedicated cycle-free home for `ReduceFn` and `ReducerResult`.
 *
 * # Divergence kinds (5)
 *
 *   - `row-missing`         — `workflow.start`+`workflow.finish` exist
 *                             but the session has no row in
 *                             `project.json.sessions[]`.
 *   - `finishedAt`          — finish event committed but the row's
 *                             `finishedAt` is `null`.
 *   - `task`                — the row's `task` differs from
 *                             `workflow.start.data.task` (when the
 *                             event payload carries one).
 *   - `events.replay_threw` — `reduceFn` threw while replaying the
 *                             session's events (corrupt event stream).
 *   - `events.empty`        — info-level — `project.json` has a row
 *                             for this session but no events for it
 *                             exist in the store. Legitimate edge
 *                             (post-init, pre-event-append) that
 *                             operators should still see.
 *
 * # Walk shape
 *
 * The function unions two session sources:
 *
 *   1. Every `sessionId` referenced by `memory.sessions[]`.
 *   2. Every distinct `session_id` (or partition-derived id) found in
 *      the events returned by `store.replayAll()`.
 *
 * For each session it then runs the §4 ground-truth check matrix from
 * the PR-CFM-C ideation doc.
 */

import type { ReadStore } from '../workflow/store.js';
import type { ReduceFn } from '../workflow/types.js';
import type { EventRow } from '../workflow/migrations.js';
import { rowToEvent, initialState } from '../workflow/state-derivation.js';
import type { ProjectJson, ProjectJsonSession } from './json-memory.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Closed union of divergence kinds. Adding a kind extends the union (no
 * severity bucket bookkeeping). Severity model deferred — a flat list
 * scales; severity is a sort/filter axis the consumer command applies
 * as policy.
 */
export type DivergenceField =
  | 'row-missing'
  | 'finishedAt'
  | 'task'
  | 'events.replay_threw'
  | 'events.empty';

/**
 * One divergence row. `fromEvents` and `fromMemory` carry the human-
 * readable witness on each side (typically a string, sometimes `null`).
 * `note` is an optional free-text field used by info-level kinds (e.g.
 * `events.empty`) and by `events.replay_threw` to describe the throw.
 */
export interface MemoryDivergence {
  readonly sessionId: string;
  readonly field: DivergenceField;
  readonly fromEvents: string | null;
  readonly fromMemory: string | null;
  readonly note?: string;
}

export interface MemoryProjectionDiffArgs {
  readonly store: ReadStore;
  /** `null` is treated as an empty `sessions[]` (no crash). */
  readonly memory: ProjectJson | null;
  /**
   * Injected reducer — typically `reduce` from `workflow/reducer.js`.
   * Keeping this a parameter avoids the lib→workflow circular import
   * (mirror `state-derivation.ts::deriveState`).
   */
  readonly reduceFn: ReduceFn;
  /** Test seam for `elapsedMs`. Defaults to `Date.now`. */
  readonly now?: () => number;
}

export interface MemoryProjectionDiffResult {
  readonly divergences: readonly MemoryDivergence[];
  readonly sessionsChecked: number;
  readonly elapsedMs: number;
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

const TERMINAL_STEP = 'done' as const;

/**
 * Compute drift between event-derived state and the `project.json`
 * projection. See module docblock for contract.
 */
export function memoryProjectionDiff(
  args: MemoryProjectionDiffArgs,
): MemoryProjectionDiffResult {
  const { store, memory, reduceFn } = args;
  const now = args.now ?? Date.now;
  const startMs = now();

  // 1. Read every event row once. Group by sessionId.
  const allRows = store.replayAll();
  const rowsBySession = groupRowsBySession(allRows);

  // 2. Build the union of session ids: project.json rows ∪ event sessionIds.
  const memorySessionMap = new Map<string, ProjectJsonSession>();
  if (memory !== null) {
    for (const row of memory.sessions) {
      memorySessionMap.set(row.sessionId, row);
    }
  }

  const sessionIds = new Set<string>();
  for (const sessionId of memorySessionMap.keys()) sessionIds.add(sessionId);
  for (const sessionId of rowsBySession.keys()) sessionIds.add(sessionId);

  // 3. Walk each session, applying the check matrix.
  const divergences: MemoryDivergence[] = [];
  for (const sessionId of sessionIds) {
    const sessionRows = rowsBySession.get(sessionId) ?? [];
    const memoryRow = memorySessionMap.get(sessionId) ?? null;
    diffOneSession(sessionId, sessionRows, memoryRow, reduceFn, divergences);
  }

  const elapsedMs = Math.max(0, now() - startMs);

  return {
    divergences,
    sessionsChecked: sessionIds.size,
    elapsedMs,
  };
}

// ---------------------------------------------------------------------------
// Per-session diff
// ---------------------------------------------------------------------------

function diffOneSession(
  sessionId: string,
  rows: readonly EventRow[],
  memoryRow: ProjectJsonSession | null,
  reduceFn: ReduceFn,
  out: MemoryDivergence[],
): void {
  // Edge: project.json carries this session but the store has no events.
  // Info-level — legitimate post-init / pre-append window.
  if (rows.length === 0 && memoryRow !== null) {
    out.push({
      sessionId,
      field: 'events.empty',
      fromEvents: null,
      fromMemory: sessionId,
      note: 'project.json row exists with no events',
    });
    return;
  }

  // Edge: no rows AND no memory row — should not happen because the
  // sessionId would not be in the union. Defensive no-op.
  if (rows.length === 0) return;

  // Replay through the reducer. If the reducer throws on any event we
  // surface a single `events.replay_threw` divergence and stop checking
  // this session — downstream invariants depend on a coherent state.
  const replay = safeReplay(sessionId, rows, reduceFn);
  if (!replay.ok) {
    out.push({
      sessionId,
      field: 'events.replay_threw',
      fromEvents: null,
      fromMemory: memoryRow !== null ? sessionId : null,
      note: `reducer threw during replay: ${replay.error}`,
    });
    return;
  }

  const derivedStep = replay.currentStep;

  // Find the workflow.finish row (if any) for `finishedAt` and
  // `row-missing` checks.
  const finishRow = rows.find((r) => r.type === 'workflow.finish') ?? null;
  const startRow = rows.find((r) => r.type === 'workflow.start') ?? null;

  // Check 1: terminal-step invariants.
  if (derivedStep === TERMINAL_STEP) {
    if (memoryRow === null) {
      out.push({
        sessionId,
        field: 'row-missing',
        fromEvents:
          finishRow !== null
            ? `workflow.finish at ${finishRow.ts}`
            : 'currentStep=done',
        fromMemory: null,
      });
      // Without a memory row there's nothing else to compare. Bail.
      return;
    }
    if (memoryRow.finishedAt === null) {
      out.push({
        sessionId,
        field: 'finishedAt',
        fromEvents:
          finishRow !== null
            ? `workflow.finish at ${finishRow.ts}`
            : 'currentStep=done',
        fromMemory: null,
      });
    }
  }

  // Check 2: task-field drift. Only fires when BOTH sides carry a value.
  // The wire-format `WorkflowStartData` does not include `task` today,
  // so the comparison is silent for production sessions; the kind exists
  // to surface hand-edits or memorization-writer bugs that stamp a
  // mismatched task into the row.
  if (memoryRow !== null && startRow !== null) {
    const startTask = readStartTask(startRow);
    if (startTask !== null && memoryRow.task !== startTask) {
      out.push({
        sessionId,
        field: 'task',
        fromEvents: startTask,
        fromMemory: memoryRow.task,
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Group every row by its session id. Rows whose `session_id` column is
 * `null` (legacy v4 rows or unpartitioned in-memory test stores) are
 * tolerated by reading the event payload's `sessionId` field on the
 * `workflow.start` event for the partition they belong to. When neither
 * exists the row is dropped — there is no session to associate it with.
 *
 * Production stores always stamp `session_id` per
 * `EventStore::computeIdempotencyKey`, so this fallback fires only in
 * test fixtures using the in-memory store without explicit partition
 * keys.
 */
function groupRowsBySession(
  rows: readonly EventRow[],
): ReadonlyMap<string, readonly EventRow[]> {
  // First pass: prefer the row column.
  const out = new Map<string, EventRow[]>();
  const orphaned: EventRow[] = [];
  for (const row of rows) {
    const sid = row.session_id;
    if (sid !== null && sid !== '') {
      pushRow(out, sid, row);
      continue;
    }
    orphaned.push(row);
  }

  // Second pass: when every row lacks `session_id`, attempt to recover
  // a sessionId from a `workflow.start` payload in the orphan list.
  if (orphaned.length > 0) {
    const recovered = recoverSessionIdFromOrphans(orphaned);
    if (recovered !== null) {
      for (const row of orphaned) {
        pushRow(out, recovered, row);
      }
    }
    // If recovery fails, orphan rows are silently skipped — a session
    // with no detectable id has nothing to compare against.
  }

  return out;
}

function pushRow(
  acc: Map<string, EventRow[]>,
  sessionId: string,
  row: EventRow,
): void {
  const current = acc.get(sessionId);
  if (current === undefined) {
    acc.set(sessionId, [row]);
  } else {
    current.push(row);
  }
}

function recoverSessionIdFromOrphans(
  rows: readonly EventRow[],
): string | null {
  for (const row of rows) {
    if (row.type !== 'workflow.start') continue;
    try {
      const parsed: unknown = JSON.parse(row.data);
      if (parsed === null || typeof parsed !== 'object') continue;
      const candidate = (parsed as { sessionId?: unknown }).sessionId;
      if (typeof candidate === 'string' && candidate !== '') return candidate;
    } catch {
      // skip
    }
  }
  return null;
}

interface ReplayOk {
  readonly ok: true;
  readonly currentStep: string;
}
interface ReplayErr {
  readonly ok: false;
  readonly error: string;
}

/**
 * Replay rows through `reduceFn`, returning the final `currentStep`.
 * Catches any throw and returns a structured error so the caller can
 * surface a divergence instead of crashing the whole walk.
 *
 * Differs from `deriveState` in that we do NOT swallow reducer errors —
 * the diff library wants to surface "the reducer threw" as a divergence
 * row, while `deriveState` is a happy-path projection that skips bad
 * events for resume robustness.
 */
function safeReplay(
  sessionId: string,
  rows: readonly EventRow[],
  reduceFn: ReduceFn,
): ReplayOk | ReplayErr {
  try {
    let state = initialState(sessionId);
    for (const row of rows) {
      const event = rowToEvent(row);
      if (event === null) continue;
      const result = reduceFn(state, event, row.ts);
      if (result.ok) {
        state = result.state;
      }
      // Reducer-rejected events do NOT become divergences — they are
      // a routine outcome (engine writes `workflow.invalid_transition`
      // audit and rolls the row back). Replay-threw is reserved for
      // unhandled exceptions inside the reducer.
    }
    return { ok: true, currentStep: state.currentStep };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}

/**
 * Read the `task` field from a `workflow.start` row's data payload, if
 * present. Returns `null` when absent or when the payload is not parseable
 * — both are silent (no divergence emitted).
 *
 * The wire-format `WorkflowStartData` does not declare a `task` field
 * today; this check only fires when a future emitter (or a fixture)
 * adds one. The kind is wired now so PR-B's `gobbi memory check` can
 * surface task-field hand-edits without another lib touch.
 */
function readStartTask(row: EventRow): string | null {
  try {
    const parsed: unknown = JSON.parse(row.data);
    if (parsed === null || typeof parsed !== 'object') return null;
    const candidate = (parsed as { task?: unknown }).task;
    return typeof candidate === 'string' ? candidate : null;
  } catch {
    return null;
  }
}
