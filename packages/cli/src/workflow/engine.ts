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

import { EventStore } from './store.js';
import type { AppendInput } from './store.js';
import { reduce } from './reducer.js';
import type { ReducerResult } from './reducer.js';
import {
  writeState,
  backupState,
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
 * If the reducer rejects the event, the transaction rolls back —
 * the SQLite insert, state.json write, and jsonl append are all undone
 * (SQLite rolls back; state.json is restored from backup; jsonl line
 * is the only non-transactional artifact, which is acceptable since
 * it's a diagnostic log, not a source of truth).
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
): AppendResult {
  return store.transaction(() => {
    // 1. Backup current state
    backupState(dir);

    // 2. Append event to SQLite store
    const ts = new Date().toISOString();
    const input: AppendInput = {
      ts,
      type: event.type,
      step: state.currentStep,
      data: JSON.stringify(event.data),
      actor,
      idempotencyKind,
      sessionId,
      toolCallId,
    };
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

    return { state: result.state, persisted: true };
  });
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
