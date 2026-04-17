/**
 * Compound workflow operations — the bridge between state.ts and reducer.ts.
 *
 * This is the ONLY module that imports from both state.ts and reducer.ts,
 * preventing circular dependencies. All compound operations that need
 * both persistence and reduction go through this module.
 *
 * All operations are synchronous — they execute inside bun:sqlite
 * transactions which cannot contain async calls.
 */

import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

import { EventStore } from './store.js';
import type { AppendInput } from './store.js';
import { reduce } from './reducer.js';
import type { ReducerResult } from './reducer.js';
import {
  writeState,
  backupState,
  restoreStateFromBackup,
  appendJsonl,
  resolveState,
  deriveState,
} from './state.js';
import type { WorkflowState } from './state.js';
import type { Event } from './events/index.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Actor type — identifies who emitted the event. */
export type Actor = 'cli' | 'hook' | 'subagent';

/** Result of appendEventAndUpdateState. */
export interface AppendResult {
  readonly state: WorkflowState;
  readonly persisted: boolean;
}

// ---------------------------------------------------------------------------
// Compound operation: append + reduce + persist
// ---------------------------------------------------------------------------

/**
 * The core compound operation for workflow progression.
 *
 * Executes atomically inside a bun:sqlite IMMEDIATE transaction:
 *
 * 1. Backup current state.json
 * 2. Append event to the SQLite store (with deduplication)
 * 3. If deduplicated (null return), short-circuit — no state change
 * 4. Reduce to compute new state
 * 5. Write new state.json (synchronous atomic write)
 * 6. Append to events.jsonl (human-readable log)
 *
 * If the reducer rejects the event or a filesystem write fails, the
 * transaction rolls back — the SQLite insert is undone by the
 * transaction rollback, and state.json is restored from backup via
 * restoreStateFromBackup(). The jsonl line is the only
 * non-transactional artifact, which is acceptable since it's a
 * diagnostic log, not a source of truth.
 *
 * `parentSeq` links the new event to a prior event's `seq` — used by
 * the capture commands (C.6) to connect `delegation.complete` /
 * `delegation.fail` to the originating `delegation.spawn`. Omit or
 * pass `null` when no parent linkage applies.
 *
 * `counter` is REQUIRED when `idempotencyKind === 'counter'` and
 * FORBIDDEN otherwise. `gobbi workflow stop` supplies it for
 * same-millisecond heartbeat disambiguation; other callers leave it
 * `undefined`. The runtime check mirrors the discriminated-union
 * constraint in `AppendInput` — it is defensive against callers that
 * cast through `unknown` to bypass tsc.
 *
 * `ts` overrides the event timestamp the engine would otherwise generate
 * from `new Date().toISOString()`. This matters for the `'counter'` kind
 * because the idempotency key is computed from the timestamp-millisecond:
 * the caller scans existing heartbeats for the same ms to pick a non-
 * colliding counter, then passes the same `ts` down so the key uses the
 * same ms as the scan. When omitted, the engine uses wall-clock time.
 */
export function appendEventAndUpdateState(
  store: EventStore,
  dir: string,
  state: WorkflowState,
  event: Event,
  actor: Actor,
  sessionId: string,
  idempotencyKind: AppendInput['idempotencyKind'],
  toolCallId?: string,
  parentSeq?: number | null,
  counter?: number,
  ts?: string,
): AppendResult {
  return store.transaction(() => {
    // Track whether state.json existed before the operation. When this
    // is the first event ever, there is no state.json and therefore no
    // backup — the catch block needs to know so it can delete state.json
    // instead of restoring from a non-existent backup.
    const hadPriorState = existsSync(join(dir, 'state.json'));

    // 1. Backup current state
    backupState(dir);

    // 2. Append event to SQLite store
    const effectiveTs = ts ?? new Date().toISOString();
    const input: AppendInput = buildAppendInput({
      ts: effectiveTs,
      type: event.type,
      step: state.currentStep,
      data: JSON.stringify(event.data),
      actor,
      sessionId,
      idempotencyKind,
      toolCallId,
      parentSeq: parentSeq ?? null,
      counter,
    });
    const row = store.append(input);

    // Deduplicated — no change
    if (row === null) {
      return { state, persisted: false };
    }

    // 3. Reduce to get new state
    const result: ReducerResult = reduce(state, event);
    if (!result.ok) {
      throw new Error(`Reducer rejected event ${event.type}: ${result.error}`);
    }

    // 4–5. Write state.json and events.jsonl — wrapped in try/catch so
    // that a filesystem failure restores the backup before re-throwing,
    // keeping state.json consistent with the SQLite rollback.
    try {
      // 4. Write new state.json (synchronous atomic write)
      writeState(dir, result.state);

      // 5. Append to events.jsonl (diagnostic log)
      appendJsonl(dir, {
        seq: row.seq,
        ts: row.ts,
        type: row.type,
        step: row.step,
        data: row.data,
        actor: row.actor,
      });
    } catch (err: unknown) {
      // Restore state.json so it matches the rolled-back SQLite state.
      // Wrap in its own try/catch so a restore failure (disk full,
      // permissions) does not replace the original error.
      try {
        if (hadPriorState) {
          // Normal case: restore the backup we created in step 1.
          restoreStateFromBackup(dir);
        } else {
          // First-event edge case: no prior state.json existed, so no
          // backup was created. Delete the newly-written state.json to
          // return to the no-file state. resolveState() will fall through
          // to deriveState() which replays from the (now empty) DB.
          const statePath = join(dir, 'state.json');
          if (existsSync(statePath)) {
            unlinkSync(statePath);
          }
        }
      } catch {
        // Ignore restore/delete failure — the priority is propagating
        // the original error so the SQLite transaction rolls back.
      }
      throw err;
    }

    return { state: result.state, persisted: true };
  });
}

// ---------------------------------------------------------------------------
// AppendInput construction — maps the compound-operation parameters onto
// the discriminated-union `AppendInput`. Keeping the variant selection
// here lets the engine's positional signature stay stable for callers
// while the store type enforces the per-kind invariants.
// ---------------------------------------------------------------------------

interface BuildAppendInputArgs {
  readonly ts: string;
  readonly type: string;
  readonly step: string | null;
  readonly data: string;
  readonly actor: string;
  readonly sessionId: string;
  readonly idempotencyKind: AppendInput['idempotencyKind'];
  readonly toolCallId: string | undefined;
  readonly parentSeq: number | null;
  readonly counter: number | undefined;
}

function buildAppendInput(args: BuildAppendInputArgs): AppendInput {
  const base = {
    ts: args.ts,
    type: args.type,
    step: args.step,
    data: args.data,
    actor: args.actor,
    parent_seq: args.parentSeq,
    sessionId: args.sessionId,
  } as const;

  switch (args.idempotencyKind) {
    case 'tool-call': {
      if (args.toolCallId === undefined) {
        throw new Error(
          'appendEventAndUpdateState: toolCallId is required for tool-call idempotency kind',
        );
      }
      return {
        ...base,
        idempotencyKind: 'tool-call',
        toolCallId: args.toolCallId,
      };
    }
    case 'system': {
      return { ...base, idempotencyKind: 'system' };
    }
    case 'counter': {
      if (args.counter === undefined) {
        throw new Error(
          'appendEventAndUpdateState: counter is required for counter idempotency kind',
        );
      }
      return {
        ...base,
        idempotencyKind: 'counter',
        counter: args.counter,
      };
    }
  }
}

// ---------------------------------------------------------------------------
// State resolution — using concrete reduce function
// ---------------------------------------------------------------------------

/**
 * Resolve workflow state from disk with full fallback chain.
 *
 * Wraps state.ts resolveState() with the concrete reduce function,
 * so callers don't need to pass the reducer themselves.
 */
export function resolveWorkflowState(
  dir: string,
  store: EventStore,
  sessionId: string,
): WorkflowState {
  const events = store.replayAll();
  return resolveState(dir, events, sessionId, reduce);
}

/**
 * Derive workflow state from full event replay.
 *
 * Wraps state.ts deriveState() with the concrete reduce function.
 */
export function deriveWorkflowState(
  sessionId: string,
  store: EventStore,
): WorkflowState {
  const events = store.replayAll();
  return deriveState(sessionId, events, reduce);
}
