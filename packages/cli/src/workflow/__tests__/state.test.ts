import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, existsSync, copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  initialState,
  isValidState,
  writeState,
  readState,
  backupState,
  restoreBackup,
  restoreStateFromBackup,
  rowToEvent,
  deriveState,
  resolveState,
  normaliseToLatestSchema,
} from '../state.js';
import type { WorkflowState, ReduceFn } from '../state.js';
import type { ResolvedSettings } from '../../lib/settings.js';
import { DEFAULTS } from '../../lib/settings.js';
import { EventStore } from '../store.js';
import type { AppendInput, AppendInputToolCall } from '../store.js';
import { reduce } from '../reducer.js';
import type { ReducerResult } from '../reducer.js';
import { WORKFLOW_EVENTS } from '../events/workflow.js';
import { DELEGATION_EVENTS } from '../events/delegation.js';
import { ARTIFACT_EVENTS } from '../events/artifact.js';
import type { Event } from '../events/index.js';
import { appendEventAndUpdateState } from '../engine.js';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

let testDir: string;

beforeEach(() => {
  testDir = mkdtempSync(join(tmpdir(), 'gobbi-state-test-'));
});

afterEach(() => {
  rmSync(testDir, { recursive: true, force: true });
});

function makeState(overrides: Partial<WorkflowState> = {}): WorkflowState {
  return {
    ...initialState('test-session'),
    ...overrides,
  };
}

function makeAppendInput(
  overrides: Partial<AppendInputToolCall> = {},
): AppendInput {
  return {
    ts: '2026-01-01T00:00:00.000Z',
    type: 'workflow.start',
    step: null,
    data: JSON.stringify({ sessionId: 'sess-1', timestamp: '2026-01-01T00:00:00.000Z' }),
    actor: 'orchestrator',
    parent_seq: null,
    idempotencyKind: 'tool-call',
    toolCallId: 'tc-001',
    sessionId: 'sess-1',
    ...overrides,
  };
}

// ===========================================================================
// isValidState
// ===========================================================================

describe('isValidState', () => {
  it('accepts a valid initial state', () => {
    expect(isValidState(initialState('s1'))).toBe(true);
  });

  it('accepts a state with populated fields', () => {
    const state: WorkflowState = {
      schemaVersion: 2,
      sessionId: 'sess-1',
      currentStep: 'execution',
      currentSubstate: null,
      completedSteps: ['ideation', 'planning'],
      evalConfig: { ideation: true, planning: false },
      activeSubagents: [
        { subagentId: 'a1', agentType: 'executor', step: 'execution', spawnedAt: '2026-01-01T00:00:00Z' },
      ],
      artifacts: { execution: ['file1.md', 'file2.md'] },
      violations: [
        { guardId: 'g1', toolName: 'Write', reason: 'scope', step: 'execution', timestamp: '2026-01-01T00:00:00Z' },
      ],
      feedbackRound: 1,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: null,
      verificationResults: {},
      stepStartedAt: null,
    };
    expect(isValidState(state)).toBe(true);
  });

  it('rejects null', () => {
    expect(isValidState(null)).toBe(false);
  });

  it('rejects non-object', () => {
    expect(isValidState('not an object')).toBe(false);
  });

  it('rejects missing schemaVersion', () => {
    const bad = { ...initialState('s1') } as Record<string, unknown>;
    delete bad['schemaVersion'];
    expect(isValidState(bad)).toBe(false);
  });

  it('rejects invalid currentStep', () => {
    const bad = { ...initialState('s1'), currentStep: 'invalid_step' };
    expect(isValidState(bad)).toBe(false);
  });

  it('rejects invalid currentSubstate', () => {
    const bad = { ...initialState('s1'), currentSubstate: 'invalid' };
    expect(isValidState(bad)).toBe(false);
  });

  it('rejects non-array completedSteps', () => {
    const bad = { ...initialState('s1'), completedSteps: 'not-array' };
    expect(isValidState(bad)).toBe(false);
  });

  it('rejects non-boolean evalConfig fields', () => {
    const bad = { ...initialState('s1'), evalConfig: { ideation: 'yes', planning: false } };
    expect(isValidState(bad)).toBe(false);
  });
});

// ===========================================================================
// initialState — settings-driven maxFeedbackRounds (issue #134)
// ===========================================================================

describe('initialState maxFeedbackRounds wiring', () => {
  it('falls back to 3 when settings argument is omitted', () => {
    const state = initialState('s-no-settings');
    expect(state.maxFeedbackRounds).toBe(3);
  });

  it('reads workflow.execution.maxIterations from settings', () => {
    const settings: ResolvedSettings = {
      ...DEFAULTS,
      workflow: {
        ...DEFAULTS.workflow,
        execution: { ...DEFAULTS.workflow?.execution, maxIterations: 5 },
      },
    };
    const state = initialState('s-exec-5', settings);
    expect(state.maxFeedbackRounds).toBe(5);
  });

  it('prefers execution over planning over ideation', () => {
    const settings: ResolvedSettings = {
      ...DEFAULTS,
      workflow: {
        ideation: { maxIterations: 7 },
        planning: { maxIterations: 6 },
        execution: { maxIterations: 9 },
      },
    };
    const state = initialState('s-cascade', settings);
    expect(state.maxFeedbackRounds).toBe(9);
  });

  it('falls back to planning when execution is absent', () => {
    const settings: ResolvedSettings = {
      schemaVersion: 1,
      workflow: {
        ideation: { maxIterations: 7 },
        planning: { maxIterations: 6 },
        // execution slot omitted entirely
      },
    };
    const state = initialState('s-fallback-plan', settings);
    expect(state.maxFeedbackRounds).toBe(6);
  });

  it('falls back to 3 when no step carries maxIterations', () => {
    const settings: ResolvedSettings = {
      schemaVersion: 1,
      workflow: {
        ideation: { discuss: { mode: 'user' } },
        planning: { discuss: { mode: 'user' } },
        execution: { discuss: { mode: 'agent' } },
      },
    };
    const state = initialState('s-no-iter', settings);
    expect(state.maxFeedbackRounds).toBe(3);
  });
});

// ===========================================================================
// writeState + readState
// ===========================================================================

describe('writeState + readState', () => {
  it('round-trips a state to disk and back', () => {
    const state = makeState({ currentStep: 'execution', feedbackRound: 2 });
    writeState(testDir, state);
    const read = readState(testDir);
    expect(read).toEqual(state);
  });

  it('creates the directory if it does not exist', () => {
    const nested = join(testDir, 'nested', 'deep');
    const state = makeState();
    writeState(nested, state);
    const read = readState(nested);
    expect(read).toEqual(state);
  });

  it('overwrites an existing state.json', () => {
    const state1 = makeState({ currentStep: 'idle' });
    const state2 = makeState({ currentStep: 'execution' });
    writeState(testDir, state1);
    writeState(testDir, state2);
    const read = readState(testDir);
    expect(read).toEqual(state2);
  });
});

// ===========================================================================
// readState returns null
// ===========================================================================

describe('readState returns null', () => {
  it('returns null for missing file', () => {
    expect(readState(testDir)).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    writeFileSync(join(testDir, 'state.json'), 'not-json{{{', 'utf8');
    expect(readState(testDir)).toBeNull();
  });

  it('returns null for wrong shape', () => {
    writeFileSync(join(testDir, 'state.json'), JSON.stringify({ foo: 'bar' }), 'utf8');
    expect(readState(testDir)).toBeNull();
  });
});

// ===========================================================================
// backupState + restoreBackup
// ===========================================================================

describe('backupState + restoreBackup', () => {
  it('creates a backup and restores it', () => {
    const state = makeState({ currentStep: 'planning', feedbackRound: 1 });
    writeState(testDir, state);
    backupState(testDir);

    // Corrupt the primary
    writeFileSync(join(testDir, 'state.json'), 'corrupted', 'utf8');

    const restored = restoreBackup(testDir);
    expect(restored).toEqual(state);
  });

  it('backupState is a no-op when state.json does not exist', () => {
    // Should not throw
    backupState(testDir);
    expect(restoreBackup(testDir)).toBeNull();
  });

  it('restoreBackup returns null when no backup exists', () => {
    expect(restoreBackup(testDir)).toBeNull();
  });
});

// ===========================================================================
// rowToEvent
// ===========================================================================

describe('rowToEvent', () => {
  it('converts a valid workflow.start row to an Event', () => {
    const row = {
      seq: 1,
      ts: '2026-01-01T00:00:00Z',
      schema_version: 1,
      type: 'workflow.start',
      step: null,
      data: JSON.stringify({ sessionId: 's1', timestamp: '2026-01-01T00:00:00Z' }),
      actor: 'cli',
      parent_seq: null,
      idempotency_key: 'test:1:workflow.start',
      session_id: null,
      project_id: null,
    };
    const event = rowToEvent(row);
    expect(event).not.toBeNull();
    expect(event!.type).toBe('workflow.start');
  });

  it('returns null for unknown event type', () => {
    const row = {
      seq: 1,
      ts: '2026-01-01T00:00:00Z',
      schema_version: 1,
      type: 'unknown.event',
      step: null,
      data: '{}',
      actor: 'cli',
      parent_seq: null,
      idempotency_key: 'test:1:unknown.event',
      session_id: null,
      project_id: null,
    };
    expect(rowToEvent(row)).toBeNull();
  });

  it('returns null for invalid JSON data', () => {
    const row = {
      seq: 1,
      ts: '2026-01-01T00:00:00Z',
      schema_version: 1,
      type: 'workflow.start',
      step: null,
      data: 'not-json',
      actor: 'cli',
      parent_seq: null,
      idempotency_key: 'test:1:workflow.start',
      session_id: null,
      project_id: null,
    };
    expect(rowToEvent(row)).toBeNull();
  });
});

// ===========================================================================
// deriveState
// ===========================================================================

describe('deriveState', () => {
  it('replays events to produce the correct final state', () => {
    using store = new EventStore(':memory:');

    // Build a realistic event sequence: start → enter ideation → exit ideation → enter plan
    store.append(makeAppendInput({
      toolCallId: 'tc-1',
      type: WORKFLOW_EVENTS.START,
      data: JSON.stringify({ sessionId: 'sess-1', timestamp: '2026-01-01T00:00:00Z' }),
    }));
    store.append(makeAppendInput({
      toolCallId: 'tc-2',
      type: WORKFLOW_EVENTS.EVAL_DECIDE,
      data: JSON.stringify({ ideation: false, plan: false }),
    }));
    store.append(makeAppendInput({
      toolCallId: 'tc-3',
      type: WORKFLOW_EVENTS.STEP_EXIT,
      step: 'ideation',
      data: JSON.stringify({ step: 'ideation' }),
    }));
    store.append(makeAppendInput({
      toolCallId: 'tc-4',
      type: WORKFLOW_EVENTS.STEP_EXIT,
      step: 'planning',
      data: JSON.stringify({ step: 'planning' }),
    }));
    store.append(makeAppendInput({
      toolCallId: 'tc-5',
      type: DELEGATION_EVENTS.SPAWN,
      step: 'execution',
      data: JSON.stringify({ subagentId: 'agent-1', agentType: 'executor', step: 'execution', timestamp: '2026-01-01T00:00:00Z' }),
    }));

    const events = store.replayAll();
    const state = deriveState('sess-1', events, reduce);

    expect(state.currentStep).toBe('execution');
    expect(state.completedSteps).toEqual(['ideation', 'planning']);
    expect(state.activeSubagents).toHaveLength(1);
    expect(state.activeSubagents[0]!.subagentId).toBe('agent-1');
  });

  it('skips unparseable events gracefully', () => {
    using store = new EventStore(':memory:');

    store.append(makeAppendInput({
      toolCallId: 'tc-1',
      type: WORKFLOW_EVENTS.START,
      data: JSON.stringify({ sessionId: 'sess-1', timestamp: '2026-01-01T00:00:00Z' }),
    }));

    const events = store.replayAll();
    // Add a row with bad data manually by modifying the array
    const badRow = { ...events[0]!, type: 'unknown.bad', data: '{{bad json', seq: 99 };
    const allEvents = [...events, badRow];

    const state = deriveState('sess-1', allEvents, reduce);
    // Should still produce a valid state from the good event
    expect(state.currentStep).toBe('ideation');
  });

  it('returns initial state when events array is empty', () => {
    const state = deriveState('sess-empty', [], reduce);
    expect(state.currentStep).toBe('idle');
    expect(state.sessionId).toBe('sess-empty');
  });
});

// ===========================================================================
// resolveState
// ===========================================================================

describe('resolveState', () => {
  it('prefers state.json when available', () => {
    using store = new EventStore(':memory:');

    // Write a state.json that says execution
    const diskState = makeState({ currentStep: 'execution' });
    writeState(testDir, diskState);

    // Store has a start event (which would derive to ideation)
    store.append(makeAppendInput({ toolCallId: 'tc-1' }));
    const events = store.replayAll();

    const resolved = resolveState(testDir, events, 'test-session', reduce);
    expect(resolved.currentStep).toBe('execution');
  });

  it('falls back to backup when state.json is corrupt', () => {
    using store = new EventStore(':memory:');

    // Write valid state, backup it, then corrupt primary
    const backupStateObj = makeState({ currentStep: 'planning' });
    writeState(testDir, backupStateObj);
    backupState(testDir);
    writeFileSync(join(testDir, 'state.json'), 'corrupt', 'utf8');

    store.append(makeAppendInput({ toolCallId: 'tc-1' }));
    const events = store.replayAll();

    const resolved = resolveState(testDir, events, 'test-session', reduce);
    expect(resolved.currentStep).toBe('planning');
  });

  it('falls back to event replay when both state.json and backup are missing', () => {
    using store = new EventStore(':memory:');

    store.append(makeAppendInput({
      toolCallId: 'tc-1',
      type: WORKFLOW_EVENTS.START,
      data: JSON.stringify({ sessionId: 'sess-1', timestamp: '2026-01-01T00:00:00Z' }),
    }));
    const events = store.replayAll();

    // No state.json, no backup — derive from events
    const resolved = resolveState(testDir, events, 'sess-1', reduce);
    expect(resolved.currentStep).toBe('ideation');
  });
});

// ===========================================================================
// Engine: deduplication
// ===========================================================================

describe('appendEventAndUpdateState deduplication', () => {
  it('returns persisted=false and unchanged state on duplicate', async () => {
    using store = new EventStore(':memory:');

    const state = makeState({ currentStep: 'idle' });
    const event: Event = {
      type: WORKFLOW_EVENTS.START,
      data: { sessionId: 'test-session', timestamp: '2026-01-01T00:00:00Z' },
    };

    // First append
    const result1 = await appendEventAndUpdateState(
      store, testDir, state, event, 'cli', 'test-session', 'tool-call', 'tc-dedup',
    );
    expect(result1.persisted).toBe(true);
    expect(result1.state.currentStep).toBe('ideation');

    // Second append with same idempotency key
    const result2 = await appendEventAndUpdateState(
      store, testDir, result1.state, event, 'cli', 'test-session', 'tool-call', 'tc-dedup',
    );
    expect(result2.persisted).toBe(false);
    expect(result2.state).toEqual(result1.state);

    // Only 1 event in the store
    expect(store.eventCount()).toBe(1);

    // events.jsonl is no longer written — gobbi.db is the authoritative
    // source of truth for the event log.
    expect(existsSync(join(testDir, 'events.jsonl'))).toBe(false);
  });
});

// ===========================================================================
// restoreStateFromBackup
// ===========================================================================

describe('restoreStateFromBackup', () => {
  it('copies backup back to state.json', () => {
    const original = makeState({ currentStep: 'planning' });
    writeState(testDir, original);
    backupState(testDir);

    // Advance state.json to a different step
    const advanced = makeState({ currentStep: 'execution' });
    writeState(testDir, advanced);

    // Restore from backup
    restoreStateFromBackup(testDir);

    const restored = readState(testDir);
    expect(restored).toEqual(original);
  });

  it('is a no-op when no backup exists', () => {
    const state = makeState({ currentStep: 'execution' });
    writeState(testDir, state);

    // Should not throw and should not modify state.json
    restoreStateFromBackup(testDir);

    const read = readState(testDir);
    expect(read).toEqual(state);
  });
});

// ===========================================================================
// Engine: transaction discipline — reducer rejection rolls the row back
//
// Pre-PR-FIN-2a-ii crash-safety relied on a `state.json` projection that
// `appendEventAndUpdateState` wrote inside the SQLite transaction; a
// filesystem failure on that write triggered the rollback path.
// State.json was retired in T-2a.9.unified, so the only failure mode
// inside the transaction now is a reducer rejection. The remaining
// invariant under test: a thrown reducer keeps the event log clean
// (no orphan row beyond the audit emit handled in engine.test.ts).
// ===========================================================================

describe('appendEventAndUpdateState crash-safety', () => {
  it('reducer rejection rolls back the rejected event row (only the audit row survives)', async () => {
    using store = new EventStore(':memory:');

    // Drive the session into ideation so that workflow.abort is rejected
    // by the reducer (abort requires error state).
    const sessionId = 'test-session';
    const startEvent: Event = {
      type: WORKFLOW_EVENTS.START,
      data: { sessionId, timestamp: '2026-01-01T00:00:00Z' },
    };
    await appendEventAndUpdateState(
      store,
      testDir,
      makeState({ currentStep: 'idle' }),
      startEvent,
      'cli',
      sessionId,
      'tool-call',
      'tc-start',
    );
    expect(store.eventCount()).toBe(1);

    const stateAfterStart = makeState({ currentStep: 'ideation' });
    const rejected: Event = {
      type: WORKFLOW_EVENTS.ABORT,
      data: { reason: 'invalid-from-ideation' },
    };

    await expect(
      appendEventAndUpdateState(
        store,
        testDir,
        stateAfterStart,
        rejected,
        'cli',
        sessionId,
        'tool-call',
        'tc-rejected-abort',
      ),
    ).rejects.toThrow();

    // The rejected row was rolled back — only the original start row +
    // the audit row authored on the audit-emit branch survive.
    const rows = store.replayAll();
    expect(rows).toHaveLength(2);
    expect(rows[0]?.type).toBe(WORKFLOW_EVENTS.START);
    expect(rows[1]?.type).toBe(WORKFLOW_EVENTS.INVALID_TRANSITION);
  });

  it('first-event reducer rejection leaves the store empty save the audit row', async () => {
    using store = new EventStore(':memory:');

    // No prior events — the very first call rejects (abort from idle is
    // rejected at the reducer).
    const sessionId = 'test-session';
    const state = makeState({ currentStep: 'idle' });
    const rejected: Event = {
      type: WORKFLOW_EVENTS.ABORT,
      data: { reason: 'invalid-from-idle' },
    };

    await expect(
      appendEventAndUpdateState(
        store,
        testDir,
        state,
        rejected,
        'cli',
        sessionId,
        'tool-call',
        'tc-first-reject',
      ),
    ).rejects.toThrow();

    // The audit row survives; the rejected row was rolled back.
    const rows = store.replayAll();
    expect(rows).toHaveLength(1);
    expect(rows[0]?.type).toBe(WORKFLOW_EVENTS.INVALID_TRANSITION);
  });
});

// ===========================================================================
// normaliseToLatestSchema — Wave 4 backward-compat translation
// ===========================================================================

describe('normaliseToLatestSchema', () => {
  it('translates currentStep: "plan" → "planning"', () => {
    const input = { currentStep: 'plan' };
    const result = normaliseToLatestSchema(input);
    expect(result).toEqual({ currentStep: 'planning' });
  });

  it('translates currentStep: "plan_eval" → "planning_eval"', () => {
    const input = { currentStep: 'plan_eval' };
    const result = normaliseToLatestSchema(input);
    expect(result).toEqual({ currentStep: 'planning_eval' });
  });

  it('translates completedSteps entries ["ideation", "plan"] → ["ideation", "planning"]', () => {
    const input = { completedSteps: ['ideation', 'plan'] };
    const result = normaliseToLatestSchema(input);
    expect(result).toEqual({ completedSteps: ['ideation', 'planning'] });
  });

  it('translates completedSteps mixed old/new shapes', () => {
    const input = { completedSteps: ['ideation', 'plan', 'planning', 'plan_eval'] };
    const result = normaliseToLatestSchema(input) as { completedSteps: string[] };
    expect(result.completedSteps).toEqual([
      'ideation',
      'planning',
      'planning',
      'planning_eval',
    ]);
  });

  it('moves evalConfig.plan → evalConfig.planning', () => {
    const input = { evalConfig: { ideation: false, plan: false } };
    const result = normaliseToLatestSchema(input) as {
      evalConfig: Record<string, unknown>;
    };
    expect(result.evalConfig).toEqual({ ideation: false, planning: false });
    expect('plan' in result.evalConfig).toBe(false);
  });

  it('moves evalConfig.plan when value is true', () => {
    const input = { evalConfig: { ideation: true, plan: true } };
    const result = normaliseToLatestSchema(input) as {
      evalConfig: Record<string, unknown>;
    };
    expect(result.evalConfig).toEqual({ ideation: true, planning: true });
  });

  it('preserves sibling evalConfig keys while renaming plan', () => {
    const input = {
      evalConfig: { ideation: false, plan: false, execution: true },
    };
    const result = normaliseToLatestSchema(input) as {
      evalConfig: Record<string, unknown>;
    };
    expect(result.evalConfig).toEqual({
      ideation: false,
      planning: false,
      execution: true,
    });
  });

  it('is idempotent on already-new-shape input (no double translation)', () => {
    const input = {
      currentStep: 'planning',
      completedSteps: ['ideation', 'planning'],
      evalConfig: { ideation: false, planning: false },
    };
    const result = normaliseToLatestSchema(input);
    expect(result).toEqual(input);
  });

  it('handles mixed-version state (some old literals, some new)', () => {
    const input = {
      currentStep: 'execution',
      completedSteps: ['ideation', 'plan'],
      evalConfig: { ideation: false, plan: false },
    };
    const result = normaliseToLatestSchema(input);
    expect(result).toEqual({
      currentStep: 'execution',
      completedSteps: ['ideation', 'planning'],
      evalConfig: { ideation: false, planning: false },
    });
  });

  it('returns non-record input unchanged', () => {
    expect(normaliseToLatestSchema(null)).toBeNull();
    expect(normaliseToLatestSchema(42)).toBe(42);
    expect(normaliseToLatestSchema('string')).toBe('string');
    expect(normaliseToLatestSchema([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('does not touch unrelated fields', () => {
    const input = {
      sessionId: 'abc',
      schemaVersion: 4,
      artifacts: { plan: ['file.md'] }, // `plan` as artifact key is NOT renamed
      feedbackRound: 2,
    };
    const result = normaliseToLatestSchema(input);
    expect(result).toEqual(input);
  });

  it('prefers existing planning key over legacy plan when both present', () => {
    // Defensive: if somehow both keys exist (only possible via hand-crafted
    // bad data), the post-rename key wins — we drop the legacy key silently.
    const input = {
      evalConfig: { ideation: false, plan: true, planning: false },
    };
    const result = normaliseToLatestSchema(input) as {
      evalConfig: Record<string, unknown>;
    };
    expect(result.evalConfig).toEqual({ ideation: false, planning: false });
    expect('plan' in result.evalConfig).toBe(false);
  });
});

// ===========================================================================
// readState backward-compat — legacy on-disk `plan` literals survive W4
// ===========================================================================

describe('readState backward-compat (W4 step rename)', () => {
  it('reads a legacy state.json with currentStep:"plan" + evalConfig.plan', () => {
    const legacy = {
      schemaVersion: 4,
      sessionId: 'legacy-sess-1',
      currentStep: 'plan',
      currentSubstate: null,
      completedSteps: ['ideation'],
      evalConfig: { ideation: false, plan: false },
      activeSubagents: [],
      artifacts: {},
      violations: [],
      feedbackRound: 0,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: null,
      verificationResults: {},
      stepStartedAt: null,
    };
    writeFileSync(join(testDir, 'state.json'), JSON.stringify(legacy), 'utf8');

    const resolved = readState(testDir);
    expect(resolved).not.toBeNull();
    if (resolved === null) throw new Error('unreachable');
    expect(resolved.currentStep).toBe('planning');
    expect(resolved.evalConfig).toEqual({ ideation: false, planning: false });
  });

  it('reads a state.json with completedSteps containing "plan"', () => {
    const legacy = {
      schemaVersion: 4,
      sessionId: 'legacy-sess-2',
      currentStep: 'execution',
      currentSubstate: null,
      completedSteps: ['ideation', 'plan'],
      evalConfig: { ideation: false, plan: false },
      activeSubagents: [],
      artifacts: {},
      violations: [],
      feedbackRound: 0,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: null,
      verificationResults: {},
      stepStartedAt: null,
    };
    writeFileSync(join(testDir, 'state.json'), JSON.stringify(legacy), 'utf8');

    const resolved = readState(testDir);
    expect(resolved).not.toBeNull();
    if (resolved === null) throw new Error('unreachable');
    expect(resolved.currentStep).toBe('execution');
    expect(resolved.completedSteps).toEqual(['ideation', 'planning']);
  });

  it('does not rewrite state.json (Greg Young discipline)', () => {
    const legacy = {
      schemaVersion: 4,
      sessionId: 'legacy-sess-3',
      currentStep: 'plan',
      currentSubstate: null,
      completedSteps: ['ideation'],
      evalConfig: { ideation: false, plan: false },
      activeSubagents: [],
      artifacts: {},
      violations: [],
      feedbackRound: 0,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: null,
      verificationResults: {},
      stepStartedAt: null,
    };
    const filePath = join(testDir, 'state.json');
    const raw = JSON.stringify(legacy);
    writeFileSync(filePath, raw, 'utf8');

    readState(testDir);

    // File unchanged — translation is in-memory-only.
    const after = readFileSync(filePath, 'utf8');
    expect(after).toBe(raw);
  });
});

// ===========================================================================
// deriveState backward-compat — legacy `step:"plan"` events replay cleanly
// ===========================================================================

describe('deriveState backward-compat (W4 step rename)', () => {
  it('replays mixed old/new STEP_EXIT events producing post-rename completedSteps', () => {
    // Seed an event stream that mixes legacy `step: "plan"` with post-W4
    // `step: "planning"`. The normaliser inside rowToEvent translates at
    // read time so the reducer sees a coherent `planning` literal stream.
    const events: Event[] = [];

    // Use appendEventAndUpdateState through a store to exercise the full
    // read path rather than constructing EventRow literals by hand.
    const store = new EventStore(':memory:');
    try {
      const ideationExit: AppendInput = {
        ts: '2026-04-01T00:00:00.000Z',
        type: WORKFLOW_EVENTS.STEP_EXIT,
        step: 'ideation',
        data: JSON.stringify({ step: 'ideation' }),
        actor: 'cli',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-exit-ideation',
        sessionId: 'sess-mix',
      };
      // Legacy-shape payload — step: 'plan'.
      const legacyPlanExit: AppendInput = {
        ts: '2026-04-01T00:00:01.000Z',
        type: WORKFLOW_EVENTS.STEP_EXIT,
        step: 'plan',
        data: JSON.stringify({ step: 'plan' }),
        actor: 'cli',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-exit-plan',
        sessionId: 'sess-mix',
      };
      store.append(ideationExit);
      store.append(legacyPlanExit);
      const rows = store.replayAll();

      // Drive deriveState through the fresh initial state (emulating cold-path
      // replay after readState returned null on an old file).
      // We need to craft a start event first so the reducer is happy.
      // Actually: with currentStep:'idle', STEP_EXIT requires currentStep to
      // match `step`. The first exit carries step:'ideation' but initialState
      // is 'idle', so we need to seed a workflow.start event.
      const startInput: AppendInput = {
        ts: '2026-03-31T23:59:59.000Z',
        type: WORKFLOW_EVENTS.START,
        step: null,
        data: JSON.stringify({
          sessionId: 'sess-mix',
          timestamp: '2026-03-31T23:59:59.000Z',
        }),
        actor: 'cli',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-start',
        sessionId: 'sess-mix',
      };
      const startRow = store.append(startInput);
      expect(startRow).not.toBeNull();

      const replayed = store.replayAll();
      // Reorder: we want start → ideation-exit → plan-exit.
      // SQLite seq is already ASC, so start is seq 1 only if it was inserted
      // first. We inserted ideation/plan before start; re-query in order.
      void replayed;
      void events;
    } finally {
      store.close();
    }

    // Easier: construct EventRows directly to drive deriveState and assert.
    const row0: import('../migrations.js').EventRow = {
      seq: 1,
      ts: '2026-03-31T23:59:59.000Z',
      schema_version: 5,
      type: 'workflow.start',
      step: null,
      data: JSON.stringify({
        sessionId: 'sess-mix',
        timestamp: '2026-03-31T23:59:59.000Z',
      }),
      actor: 'cli',
      parent_seq: null,
      idempotency_key: 'k-start',
      session_id: 'sess-mix',
      project_id: null,
    };
    const row1: import('../migrations.js').EventRow = {
      seq: 2,
      ts: '2026-04-01T00:00:00.000Z',
      schema_version: 5,
      type: 'workflow.step.exit',
      step: 'ideation',
      data: JSON.stringify({ step: 'ideation' }),
      actor: 'cli',
      parent_seq: null,
      idempotency_key: 'k-exit-ideation',
      session_id: 'sess-mix',
      project_id: null,
    };
    const row2: import('../migrations.js').EventRow = {
      seq: 3,
      ts: '2026-04-01T00:00:01.000Z',
      schema_version: 5,
      type: 'workflow.step.exit',
      step: 'plan',
      // Legacy event payload carries step:'plan' — rowToEvent must translate.
      data: JSON.stringify({ step: 'plan' }),
      actor: 'cli',
      parent_seq: null,
      idempotency_key: 'k-exit-plan',
      session_id: 'sess-mix',
      project_id: null,
    };
    const state = deriveState('sess-mix', [row0, row1, row2], reduce);
    expect(state.currentStep).toBe('execution');
    expect(state.completedSteps).toEqual(['ideation', 'planning']);
  });
});
