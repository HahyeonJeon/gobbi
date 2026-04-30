/**
 * Compound workflow operations — the bridge between state.ts and reducer.ts.
 *
 * This is the ONLY module that imports from both state.ts and reducer.ts,
 * preventing circular dependencies. All compound operations that need
 * both persistence and reduction go through this module.
 *
 * The core SQLite mutation runs inside a synchronous `store.transaction(...)`
 * envelope — bun:sqlite transactions cannot await — so the mutation half of
 * `appendEventAndUpdateState` is sync-by-construction. The function itself
 * is `async` because the post-commit dispatch awaits the memorization
 * `session.json` writer (T-2a.8.2): the writer walks per-subagent JSONL
 * transcripts via `aggregateSessionJson`, which is async. The post-commit
 * dispatch fires AFTER the transaction has committed, so the await landing
 * outside the SQL boundary preserves the bun:sqlite invariant while still
 * giving callers a single composable Promise to await.
 *
 * Callers that compose multiple appends across an outer atomic boundary
 * (init's two-event pair) must drop the outer `store.transaction(...)` wrap
 * because the bun:sqlite transaction callback cannot await the inner async
 * function. The two-event atomicity guarantee downgrades from "both rolls
 * back together" to "each commits or rolls back independently" — acceptable
 * for the SessionStart hook's idempotent re-run semantics.
 */

import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

import { EventStore } from './store.js';
import type { AppendInput, ReadStore } from './store.js';
import { reduce } from './reducer.js';
import type { ReducerResult } from './reducer.js';
import {
  writeState,
  backupState,
  restoreStateFromBackup,
  readState,
  restoreBackup,
  deriveState,
} from './state.js';
import type { WorkflowState } from './state.js';
import type { Event } from './events/index.js';
import {
  WORKFLOW_EVENTS,
  createWorkflowInvalidTransition,
} from './events/workflow.js';
import { writeStepReadmeForExit } from './step-readme-writer.js';
import { writeSessionJsonAtMemorizationExit } from './session-json-writer.js';

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
// ReducerRejectionError — typed discriminator for the audit-emit branch
//
// The engine's `appendEventAndUpdateState` wraps its compound transaction
// in a try-catch. Inside, the reducer can throw when it returns
// `{ok: false}`. Filesystem-write failures (writeState) can also throw.
// Both surface at the same catch. To emit the
// `workflow.invalid_transition` audit event ONLY for reducer rejections
// (not FS failures), the catch needs a typed discriminator.
//
// A dedicated class is preferred over a message-prefix check — matches
// the codebase's `extends Error` precedent and gives downstream tooling
// a stable `.code` for dispatch without fragile string matching.
// ---------------------------------------------------------------------------

export class ReducerRejectionError extends Error {
  readonly code = 'REDUCER_REJECTION' as const;
  readonly rejectedEvent: Event;
  readonly stateAtRejection: WorkflowState;
  readonly reducerMessage: string;

  constructor(reducerMessage: string, event: Event, state: WorkflowState) {
    super(`Reducer rejected event ${event.type}: ${reducerMessage}`);
    this.name = 'ReducerRejectionError';
    this.rejectedEvent = event;
    this.stateAtRejection = state;
    this.reducerMessage = reducerMessage;
  }
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
 *
 * If the reducer rejects the event or a filesystem write fails, the
 * transaction rolls back — the SQLite insert is undone by the
 * transaction rollback, and state.json is restored from backup via
 * restoreStateFromBackup().
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
export async function appendEventAndUpdateState(
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
): Promise<AppendResult> {
  // Compute the effective timestamp ONCE — the same wall-clock reading is
  // used for (a) the rejected event's idempotency key (system/counter kinds
  // hash the ms) and (b) the audit-emit payload + audit idempotency key, so
  // the two events share the same millisecond bucket when a rejection
  // fires. Callers that pass an explicit `ts` keep full determinism.
  const effectiveTs = ts ?? new Date().toISOString();

  // ---------------------------------------------------------------------
  // Outer try/catch WRAPS `store.transaction(...)`.
  //
  // CRITICAL structural rule (research §Area 1; bun:sqlite docs): calling
  // `store.transaction(...)` from INSIDE a failing callback creates a
  // SQLite SAVEPOINT that rolls back WITH the outer transaction. Opening
  // a fresh independent transaction requires placing the call OUTSIDE the
  // rolled-back outer. The try-catch below lives at the outer scope and
  // runs its audit-emit branch after the outer transaction has fully
  // rolled back.
  // ---------------------------------------------------------------------
  let appendResult: AppendResult;
  try {
    appendResult = store.transaction(() => {
      // Track whether state.json existed before the operation. When this
      // is the first event ever, there is no state.json and therefore no
      // backup — the catch block needs to know so it can delete state.json
      // instead of restoring from a non-existent backup.
      const hadPriorState = existsSync(join(dir, 'state.json'));

      // 1. Backup current state
      backupState(dir);

      // 2. Append event to SQLite store
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

      // 3. Reduce to get new state. On rejection, throw a typed
      //    ReducerRejectionError — the OUTER catch distinguishes this
      //    from filesystem failures and fires the audit-emit branch.
      //    `effectiveTs` is passed as the event's wall-clock timestamp so
      //    the reducer can stamp `stepStartedAt` on STEP_EXIT / RESUME
      //    per L13 — the same ms that keyed the store-layer idempotency.
      const result: ReducerResult = reduce(state, event, effectiveTs);
      if (!result.ok) {
        throw new ReducerRejectionError(result.error, event, state);
      }

      // 4. Write new state.json (synchronous atomic write) — wrapped in
      // try/catch so that a filesystem failure restores the backup before
      // re-throwing, keeping state.json consistent with the SQLite rollback.
      try {
        writeState(dir, result.state);
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
  } catch (outerError: unknown) {
    // Outer transaction has ROLLED BACK. SQLite is in a no-active-
    // transaction state; the next `store.transaction(...)` opens a fresh
    // top-level transaction, NOT a savepoint of the rolled-back one.
    //
    // Only emit the `workflow.invalid_transition` audit for reducer
    // rejections — filesystem failures (writeState) also land here but
    // those are not "invalid transition" events; auditing them here
    // would misattribute disk errors as reducer bugs.
    if (outerError instanceof ReducerRejectionError) {
      // Best-effort audit-append. If this inner transaction itself
      // throws (disk full, WAL lock, SQLite busy), swallow the audit
      // failure with a stderr log — NEVER mask the original reducer
      // error, which is what callers need to see for their exit code.
      try {
        store.transaction(() => {
          const auditEvent = createWorkflowInvalidTransition({
            rejectedEventType: outerError.rejectedEvent.type,
            rejectedEventSeq: null,
            stepAtRejection: outerError.stateAtRejection.currentStep,
            reducerMessage: outerError.reducerMessage,
            timestamp: effectiveTs,
          });
          const auditInput: AppendInput = buildAppendInput({
            ts: effectiveTs,
            type: auditEvent.type,
            step: outerError.stateAtRejection.currentStep,
            data: JSON.stringify(auditEvent.data),
            actor: 'cli',
            sessionId,
            idempotencyKind: 'system',
            toolCallId: undefined,
            parentSeq: null,
            counter: undefined,
          });
          store.append(auditInput);
        });
      } catch (auditError: unknown) {
        const msg =
          auditError instanceof Error
            ? auditError.message
            : String(auditError);
        process.stderr.write(
          `gobbi: failed to record ${WORKFLOW_EVENTS.INVALID_TRANSITION} audit — ${msg}\n`,
        );
      }
    }
    // Always re-throw the ORIGINAL error — callers (CLI commands, hooks)
    // rely on the error surface for their exit codes and diagnostics.
    throw outerError;
  }

  // Post-commit side effect: per-step README writer (W5.1).
  //
  // Fires AFTER the core transaction has committed — the README is a
  // non-authoritative navigation aid that mirrors info already in
  // gobbi.db + state.json. Running it outside the transaction means a
  // filesystem error on README write cannot corrupt the event store,
  // and deduplicated (`persisted: false`) events skip the write entirely.
  //
  // Only productive-step STEP_EXIT events produce a README; other event
  // types and `*_eval` / terminal steps are filtered inside
  // `writeStepReadmeForExit`. Failures are swallowed with a stderr log —
  // per the plan's "best-effort" contract, the side effect must never
  // mask an accepted state transition.
  if (
    appendResult.persisted &&
    event.type === WORKFLOW_EVENTS.STEP_EXIT
  ) {
    try {
      writeStepReadmeForExit({
        sessionDir: dir,
        prevState: state,
        nextState: appendResult.state,
        exitedStep: event.data.step,
        exitedAt: effectiveTs,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(
        `gobbi: per-step README write failed — ${msg}\n`,
      );
    }
  }

  // Post-commit side effect: memorization-step `session.json` writer
  // (T-2a.8.2 / PR-FIN-2a-ii).
  //
  // Fires only on a committed `workflow.step.exit` whose payload reports
  // `step === 'memorization'`. The writer reads the init-time stub for the
  // 6 carry-forward fields, runs the JSONL-walking aggregator, and atomically
  // replaces `session.json` with the populated shape; it also upserts the
  // matching `project.json.sessions[]` row.
  //
  // Same best-effort contract as the README writer: failures emit a
  // single-line stderr and never propagate. The transaction has already
  // committed; an aggregator throw cannot corrupt the event store. The
  // stderr message names the writer so operators can distinguish a JSONL
  // walk failure from the README path.
  if (
    appendResult.persisted &&
    event.type === WORKFLOW_EVENTS.STEP_EXIT &&
    event.data.step === 'memorization'
  ) {
    try {
      await writeSessionJsonAtMemorizationExit({
        sessionDir: dir,
        store,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(
        `gobbi: session.json memorization write failed — ${msg}\n`,
      );
    }
  }

  return appendResult;
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
    case 'content': {
      // Wave C.1.3 (issue #156) — `'content'` is the new audit-only
      // dedup kind for `prompt.patch.applied`. Audit-only events bypass
      // `appendEventAndUpdateState` (synthesis §6 + the runtime fence
      // at `reducer.ts:691`); they commit via `store.append()` directly.
      // Reaching this branch through the engine means a caller wired
      // a content-addressed event into the reducer-routed path — that is
      // a contract violation, not a runtime failure to handle. Fail
      // loudly so the misuse surfaces during development rather than
      // silently producing a non-functional event row.
      throw new Error(
        "appendEventAndUpdateState: 'content' idempotency kind is reserved for audit-only events that commit via store.append() directly; reducer-routed events must use 'tool-call', 'system', or 'counter'",
      );
    }
  }
}

// ---------------------------------------------------------------------------
// State resolution — using concrete reduce function
// ---------------------------------------------------------------------------

/**
 * Resolve workflow state from disk with full fallback chain.
 *
 * Warm-path optimisation: state.json is the primary source on every
 * guard / stop / capture hook invocation. When it exists and parses to
 * a valid `WorkflowState`, return it directly — skipping the full SQLite
 * event replay. The replay only materialises on the cold fallback path
 * (state.json missing or corrupt), preserving PR A's crash-safety
 * invariants: backup restoration and event-sourced derivation still
 * cover any state.json that fails validation.
 *
 * Avoiding `store.replayAll()` on the happy path saves ~5–10 ms per
 * guard / stop / capture hook invocation at ~500-event scale and scales
 * linearly with event count thereafter.
 */
export function resolveWorkflowState(
  dir: string,
  store: ReadStore,
  sessionId: string,
): WorkflowState {
  // Fast path — valid state.json short-circuits the replay.
  const primary = readState(dir);
  if (primary !== null) return primary;

  // First fallback — on-disk backup (used when state.json was mid-write
  // during a crash, or corrupted after write). Still no replay needed.
  const backup = restoreBackup(dir);
  if (backup !== null) return backup;

  // Cold fallback — derive from the full event stream. This is the only
  // branch that pays the replayAll cost.
  const events = store.replayAll();
  return deriveState(sessionId, events, reduce);
}

/**
 * Derive workflow state from full event replay.
 *
 * Wraps state.ts deriveState() with the concrete reduce function.
 */
export function deriveWorkflowState(
  sessionId: string,
  store: ReadStore,
): WorkflowState {
  const events = store.replayAll();
  return deriveState(sessionId, events, reduce);
}
