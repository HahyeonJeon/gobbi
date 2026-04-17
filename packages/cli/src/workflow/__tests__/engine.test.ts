/**
 * Engine-level tests for `resolveWorkflowState` — covers the state.json
 * fast path and the three-level fallback chain.
 *
 * Performance invariant: when state.json is present and valid, the
 * resolution path MUST NOT call `store.replayAll()`. Every hook (guard,
 * stop, capture-*) pays the cost of this function on every invocation,
 * so a full-table scan on the warm path would accumulate. A spy on
 * `replayAll` asserts the invariant explicitly.
 */

import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import fc from 'fast-check';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  resolveWorkflowState,
  appendEventAndUpdateState,
  ReducerRejectionError,
} from '../engine.js';
import { EventStore } from '../store.js';
import {
  backupState,
  initialState,
  writeState,
} from '../state.js';
import type { WorkflowState, WorkflowStep } from '../state.js';
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

function seedStartEvent(store: EventStore, dir: string, sessionId: string): WorkflowState {
  const event: Event = {
    type: WORKFLOW_EVENTS.START,
    data: { sessionId, timestamp: '2026-01-01T00:00:00.000Z' },
  };
  const result = appendEventAndUpdateState(
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
// Fast path — state.json valid
// ===========================================================================

describe('resolveWorkflowState — state.json fast path', () => {
  it('returns state.json without calling store.replayAll when state is valid', () => {
    using store = new EventStore(':memory:');
    const sessionId = 'engine-fast';

    // Seed one event so replayAll would have something non-trivial if
    // it were called. appendEventAndUpdateState internally uses the
    // transaction + state.json write path — the state.json on disk is
    // the authoritative fast-path source.
    seedStartEvent(store, testDir, sessionId);
    expect(existsSync(join(testDir, 'state.json'))).toBe(true);

    const spied = instrumentReplayAll(store);
    const state = resolveWorkflowState(testDir, spied.store, sessionId);

    // Fast path must not have triggered replayAll even once.
    expect(spied.count()).toBe(0);
    expect(state.sessionId).toBe(sessionId);
    expect(state.currentStep).toBe('ideation');
  });

  it('returns the exact state that was written to state.json', () => {
    using store = new EventStore(':memory:');
    const sessionId = 'engine-exact';

    // Write state.json directly (no events) — confirms readState is the
    // only source on the fast path, not deriveState.
    const written: WorkflowState = {
      ...initialState(sessionId),
      currentStep: 'plan',
      feedbackRound: 2,
    };
    writeState(testDir, written);

    const state = resolveWorkflowState(testDir, store, sessionId);
    expect(state.currentStep).toBe('plan');
    expect(state.feedbackRound).toBe(2);
  });
});

// ===========================================================================
// Fallback — state.json missing → replay
// ===========================================================================

describe('resolveWorkflowState — state.json missing', () => {
  it('falls through to replayAll when state.json is absent and no backup exists', () => {
    using store = new EventStore(':memory:');
    const sessionId = 'engine-missing';

    // Seed an event then delete state.json (and any backup) so only the
    // SQLite store can answer.
    seedStartEvent(store, testDir, sessionId);
    const statePath = join(testDir, 'state.json');
    const backupPath = join(testDir, 'state.json.backup');
    if (existsSync(statePath)) rmSync(statePath);
    if (existsSync(backupPath)) rmSync(backupPath);

    const spied = instrumentReplayAll(store);
    const state = resolveWorkflowState(testDir, spied.store, sessionId);

    // Replay was the only route to a valid state.
    expect(spied.count()).toBe(1);
    expect(state.currentStep).toBe('ideation');
    expect(state.sessionId).toBe(sessionId);
  });

  it('does not call replayAll when backup covers the missing state.json', () => {
    using store = new EventStore(':memory:');
    const sessionId = 'engine-backup';

    // Seed → snapshot state.json to backup → delete state.json.
    seedStartEvent(store, testDir, sessionId);
    backupState(testDir);
    rmSync(join(testDir, 'state.json'));

    const spied = instrumentReplayAll(store);
    const state = resolveWorkflowState(testDir, spied.store, sessionId);

    // Backup is a disk read — replay should still be skipped.
    expect(spied.count()).toBe(0);
    expect(state.currentStep).toBe('ideation');
  });
});

// ===========================================================================
// Fallback — state.json corrupt → replay
// ===========================================================================

describe('resolveWorkflowState — state.json corrupt', () => {
  it('falls through to replayAll when state.json is unparseable and backup missing', () => {
    using store = new EventStore(':memory:');
    const sessionId = 'engine-corrupt';

    seedStartEvent(store, testDir, sessionId);
    // Corrupt state.json to force readState → null; drop backup so the
    // middle fallback cannot rescue the resolution.
    writeFileSync(join(testDir, 'state.json'), '{not json', 'utf8');
    const backupPath = join(testDir, 'state.json.backup');
    if (existsSync(backupPath)) rmSync(backupPath);

    const spied = instrumentReplayAll(store);
    const state = resolveWorkflowState(testDir, spied.store, sessionId);

    expect(spied.count()).toBe(1);
    expect(state.currentStep).toBe('ideation');
  });

  it('prefers backup over replay when state.json is corrupt but backup is valid', () => {
    using store = new EventStore(':memory:');
    const sessionId = 'engine-corrupt-with-backup';

    // Seed an event so the backup captures a valid state, then corrupt
    // the primary.
    seedStartEvent(store, testDir, sessionId);
    backupState(testDir);
    writeFileSync(join(testDir, 'state.json'), 'corrupt', 'utf8');

    const spied = instrumentReplayAll(store);
    const state = resolveWorkflowState(testDir, spied.store, sessionId);

    // Backup is still a file read — replay should not fire.
    expect(spied.count()).toBe(0);
    expect(state.currentStep).toBe('ideation');
  });

  it('falls through to replayAll when state.json has the wrong schema shape', () => {
    using store = new EventStore(':memory:');
    const sessionId = 'engine-wrong-shape';

    seedStartEvent(store, testDir, sessionId);
    // Parseable JSON, but missing required fields → isValidState false.
    writeFileSync(
      join(testDir, 'state.json'),
      JSON.stringify({ note: 'not a WorkflowState' }),
      'utf8',
    );
    const backupPath = join(testDir, 'state.json.backup');
    if (existsSync(backupPath)) rmSync(backupPath);

    const spied = instrumentReplayAll(store);
    const state = resolveWorkflowState(testDir, spied.store, sessionId);

    expect(spied.count()).toBe(1);
    expect(state.currentStep).toBe('ideation');
  });

  it('does not leave the primary state.json content unchanged — resolveWorkflowState is read-only', () => {
    using store = new EventStore(':memory:');
    const sessionId = 'engine-read-only';

    // Confirm state.json content is untouched by resolveWorkflowState
    // even when it falls through to replay. Greg-Young discipline:
    // never rewrite on-disk state during a read.
    seedStartEvent(store, testDir, sessionId);
    const corrupt = '{corrupt';
    writeFileSync(join(testDir, 'state.json'), corrupt, 'utf8');
    const backupPath = join(testDir, 'state.json.backup');
    if (existsSync(backupPath)) rmSync(backupPath);

    resolveWorkflowState(testDir, store, sessionId);

    expect(readFileSync(join(testDir, 'state.json'), 'utf8')).toBe(corrupt);
  });
});

// ===========================================================================
// appendEventAndUpdateState — audit-emit-on-rejection (PR D.1)
// ===========================================================================

describe('appendEventAndUpdateState — reducer rejection audit', () => {
  it('emits workflow.invalid_transition AND re-throws the original error', () => {
    using store = new EventStore(':memory:');
    const sessionId = 'audit-emit-basic';

    // Seed a valid start so the session is in `ideation`.
    seedStartEvent(store, testDir, sessionId);

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

    expect(() =>
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
    ).toThrow(ReducerRejectionError);

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

  it('state on disk is unchanged after a rejection (backup restore)', () => {
    using store = new EventStore(':memory:');
    const sessionId = 'audit-emit-state';

    seedStartEvent(store, testDir, sessionId);
    const before = resolveWorkflowState(testDir, store, sessionId);

    const rejected: Event = {
      type: WORKFLOW_EVENTS.ABORT,
      data: {},
    };
    try {
      appendEventAndUpdateState(
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

    const after = resolveWorkflowState(testDir, store, sessionId);
    // Every field preserved.
    expect(after).toEqual(before);
  });

  it('filesystem-only failures do NOT emit an audit event', () => {
    using store = new EventStore(':memory:');
    const sessionId = 'audit-emit-fs';

    seedStartEvent(store, testDir, sessionId);
    const before = resolveWorkflowState(testDir, store, sessionId);

    // Force writeState to fail by making testDir a non-writable path.
    // Approach: instrument the store to replicate the FS-failure path by
    // replacing the event data with an object that JSON-serialises but
    // triggers `writeState` to throw via a tampered state directory.
    //
    // Simpler approach: pass a dir that does not exist and is not
    // creatable — the mkdirSync call inside writeState throws with an
    // EACCES/ENOENT surface. We simulate by pointing at a path under a
    // file (writing through a file path returns ENOTDIR).
    const blockedFile = join(testDir, 'not-a-dir-file');
    writeFileSync(blockedFile, 'block');
    const blockedDir = join(blockedFile, 'subpath'); // writeState → ENOTDIR

    // Valid event — reducer accepts, but FS write fails.
    const validEvent: Event = {
      type: WORKFLOW_EVENTS.STEP_EXIT,
      data: { step: 'ideation' },
    };
    expect(() =>
      appendEventAndUpdateState(
        store,
        blockedDir,
        { ...before, evalConfig: { ideation: false, plan: false } },
        validEvent,
        'cli',
        sessionId,
        'tool-call',
        'tc-fs-fail',
      ),
    ).toThrow();

    // No audit emitted — this was a FS failure, not a reducer rejection.
    const audits = store.byType(WORKFLOW_EVENTS.INVALID_TRANSITION);
    expect(audits).toHaveLength(0);
  });

  it('property test: reducer rejections always produce exactly one audit + original error', () => {
    const arbActiveStep = fc.constantFrom<WorkflowStep>(
      'ideation',
      'plan',
      'execution',
      'memorization',
    );
    const arbTs = fc
      .date({ noInvalidDate: true })
      .map((d) => d.toISOString());

    fc.assert(
      fc.property(arbActiveStep, arbTs, (step, ts) => {
        const store = new EventStore(':memory:');
        try {
          const sessionId = `prop-${step}`;
          const dir = mkdtempSync(join(tmpdir(), `gobbi-prop-${step}-`));
          try {
            seedStartEvent(store, dir, sessionId);

            // Fabricate a state where `workflow.abort` is invalid (any
            // non-error active step triggers rejection).
            const state: WorkflowState = {
              ...initialState(sessionId),
              currentStep: step,
            };
            // Overwrite state.json so the engine's backup matches our
            // synthetic state, keeping the assertion about "state
            // unchanged post-rejection" meaningful.
            writeState(dir, state);

            const rejected: Event = {
              type: WORKFLOW_EVENTS.ABORT,
              data: {},
            };

            let thrown: unknown = null;
            try {
              appendEventAndUpdateState(
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

            // (a) state unchanged — resolveWorkflowState returns the same
            // record.
            const resolved = resolveWorkflowState(dir, store, sessionId);
            if (resolved.currentStep !== step) {
              throw new Error(
                `state mutated: expected ${step}, got ${resolved.currentStep}`,
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
