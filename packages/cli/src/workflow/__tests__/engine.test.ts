/**
 * Engine-level tests for `resolveWorkflowState` and
 * `appendEventAndUpdateState`.
 *
 * Per PR-FIN-2a-ii (T-2a.9.unified) the engine no longer maintains a
 * `state.json` projection; every `resolveWorkflowState` call replays
 * the partition-filtered event stream and runs the reducer.
 * Partition-aware reads (Option α at the EventStore layer) cap the
 * replay cost at the calling session's own events.
 */

import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import fc from 'fast-check';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  resolveWorkflowState,
  appendEventAndUpdateState,
  ReducerRejectionError,
} from '../engine.js';
import { EventStore } from '../store.js';
import { initialState } from '../state-derivation.js';
import type { WorkflowState, WorkflowStep } from '../state-derivation.js';
import { WORKFLOW_EVENTS } from '../events/workflow.js';
import type { Event } from '../events/index.js';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

let testDir: string;

beforeEach(() => {
  testDir = mkdtempSync(join(tmpdir(), 'gobbi-engine-test-'));
});

afterEach(() => {
  rmSync(testDir, { recursive: true, force: true });
});

/** Wrap a store so its `replayAll` call count is observable. */
function instrumentReplayAll(store: EventStore): { store: EventStore; count: () => number } {
  let count = 0;
  const original = store.replayAll.bind(store);
  // Overwrite on the instance — the method is a class member, not a
  // prototype-frozen export, so the assignment sticks for this store.
  (store as unknown as { replayAll: () => ReturnType<typeof original> }).replayAll = () => {
    count += 1;
    return original();
  };
  return { store, count: () => count };
}

async function seedStartEvent(
  store: EventStore,
  dir: string,
  sessionId: string,
): Promise<WorkflowState> {
  const event: Event = {
    type: WORKFLOW_EVENTS.START,
    data: { sessionId, timestamp: '2026-01-01T00:00:00.000Z' },
  };
  const result = await appendEventAndUpdateState(
    store,
    dir,
    initialState(sessionId),
    event,
    'cli',
    sessionId,
    'tool-call',
    'tc-start',
  );
  return result.state;
}

// ===========================================================================
// resolveWorkflowState — pure event replay (PR-FIN-2a-ii / T-2a.9.unified)
// ===========================================================================

describe('resolveWorkflowState — pure event replay', () => {
  it('replays the event stream every call (no state.json projection)', async () => {
    using store = new EventStore(':memory:');
    const sessionId = 'engine-replay';

    await seedStartEvent(store, testDir, sessionId);

    const spied = instrumentReplayAll(store);
    const state = resolveWorkflowState(testDir, spied.store, sessionId);

    expect(spied.count()).toBe(1);
    expect(state.sessionId).toBe(sessionId);
    expect(state.currentStep).toBe('ideation');
  });

  it('initial state when the event log is empty', () => {
    using store = new EventStore(':memory:');
    const sessionId = 'engine-empty';
    const state = resolveWorkflowState(testDir, store, sessionId);
    expect(state.sessionId).toBe(sessionId);
    expect(state.currentStep).toBe('idle');
  });

  it('every call replays — no state.json fast-path skipping the store', async () => {
    using store = new EventStore(':memory:');
    const sessionId = 'engine-no-fast-path';

    await seedStartEvent(store, testDir, sessionId);

    const spied = instrumentReplayAll(store);
    resolveWorkflowState(testDir, spied.store, sessionId);
    resolveWorkflowState(testDir, spied.store, sessionId);
    resolveWorkflowState(testDir, spied.store, sessionId);
    expect(spied.count()).toBe(3);
  });
});

// ===========================================================================
// appendEventAndUpdateState — audit-emit-on-rejection (PR D.1)
// ===========================================================================

describe('appendEventAndUpdateState — reducer rejection audit', () => {
  it('emits workflow.invalid_transition AND re-throws the original error', async () => {
    using store = new EventStore(':memory:');
    const sessionId = 'audit-emit-basic';

    // Seed a valid start so the session is in `ideation`.
    await seedStartEvent(store, testDir, sessionId);

    // Resolve the current state from disk — matches how callers observe
    // state between appends.
    const before = resolveWorkflowState(testDir, store, sessionId);
    expect(before.currentStep).toBe('ideation');

    // Attempt to apply `workflow.abort` from `ideation`. The reducer
    // rejects (abort requires error state); the engine should roll back
    // the outer transaction, emit a `workflow.invalid_transition` audit
    // event in a fresh transaction, and re-throw the original error.
    const rejectedEvent: Event = {
      type: WORKFLOW_EVENTS.ABORT,
      data: { reason: 'synthetic rejection for audit test' },
    };

    await expect(
      appendEventAndUpdateState(
        store,
        testDir,
        before,
        rejectedEvent,
        'cli',
        sessionId,
        'tool-call',
        'tc-reject-abort',
        null,
        undefined,
        '2026-01-02T00:00:00.000Z',
      ),
    ).rejects.toThrow(ReducerRejectionError);

    // The audit event persisted.
    const audits = store.byType(WORKFLOW_EVENTS.INVALID_TRANSITION);
    expect(audits).toHaveLength(1);
    const audit = audits[0]!;
    const data = JSON.parse(audit.data);
    expect(data.rejectedEventType).toBe(WORKFLOW_EVENTS.ABORT);
    expect(data.rejectedEventSeq).toBeNull();
    expect(data.stepAtRejection).toBe('ideation');
    expect(typeof data.reducerMessage).toBe('string');
    expect(data.reducerMessage).toContain('workflow.abort requires error');
    expect(data.timestamp).toBe('2026-01-02T00:00:00.000Z');
  });

  it('state from the event log is unchanged after a rejection (transaction rollback)', async () => {
    using store = new EventStore(':memory:');
    const sessionId = 'audit-emit-state';

    await seedStartEvent(store, testDir, sessionId);
    const before = resolveWorkflowState(testDir, store, sessionId);

    const rejected: Event = {
      type: WORKFLOW_EVENTS.ABORT,
      data: {},
    };
    try {
      await appendEventAndUpdateState(
        store,
        testDir,
        before,
        rejected,
        'cli',
        sessionId,
        'tool-call',
        'tc-reject-state',
      );
    } catch {
      // Expected.
    }

    // Re-derive — the rejected event's row was rolled back, so the
    // replay returns the same state we observed before the attempt.
    const after = resolveWorkflowState(testDir, store, sessionId);
    expect(after).toEqual(before);
  });

  it('property test: reducer rejections always produce exactly one audit + original error', async () => {
    const arbActiveStep = fc.constantFrom<WorkflowStep>(
      'ideation',
      'planning',
      'execution',
      'memorization',
    );
    const arbTs = fc
      .date({ noInvalidDate: true })
      .map((d) => d.toISOString());

    await fc.assert(
      fc.asyncProperty(arbActiveStep, arbTs, async (step, ts) => {
        const store = new EventStore(':memory:');
        try {
          const sessionId = `prop-${step}`;
          const dir = mkdtempSync(join(tmpdir(), `gobbi-prop-${step}-`));
          try {
            // Fabricate a state where `workflow.abort` is invalid (any
            // non-error active step triggers rejection). The engine
            // reducer is now driven entirely by the in-memory `state`
            // argument — there is no state.json projection to keep in
            // sync, so the synthetic state is supplied directly.
            const state: WorkflowState = {
              ...initialState(sessionId),
              currentStep: step,
            };

            const rejected: Event = {
              type: WORKFLOW_EVENTS.ABORT,
              data: {},
            };

            let thrown: unknown = null;
            try {
              await appendEventAndUpdateState(
                store,
                dir,
                state,
                rejected,
                'cli',
                sessionId,
                'tool-call',
                `tc-prop-${step}-${ts}`,
                null,
                undefined,
                ts,
              );
            } catch (err) {
              thrown = err;
            }

            // (a) the rejected event was rolled back — the only event in
            // the store should be the audit row.
            const replayed = store.replayAll();
            if (replayed.length !== 1) {
              throw new Error(
                `expected exactly 1 row in store after rejection, got ${replayed.length}`,
              );
            }
            if (replayed[0]?.type !== WORKFLOW_EVENTS.INVALID_TRANSITION) {
              throw new Error(
                `expected single row to be the audit, got ${replayed[0]?.type ?? 'missing'}`,
              );
            }

            // (b) audit event persisted.
            const audits = store.byType(WORKFLOW_EVENTS.INVALID_TRANSITION);
            if (audits.length !== 1) {
              throw new Error(
                `expected exactly 1 audit event, got ${audits.length}`,
              );
            }

            // (c) original reducer error re-thrown.
            if (!(thrown instanceof ReducerRejectionError)) {
              throw new Error(
                `expected ReducerRejectionError, got ${String(thrown)}`,
              );
            }
          } finally {
            rmSync(dir, { recursive: true, force: true });
          }
        } finally {
          store.close();
        }
      }),
      { numRuns: 15 },
    );
  });
});
