import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { mkdtempSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
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
  appendJsonl,
  rowToEvent,
  deriveState,
  resolveState,
} from '../state.js';
import type { WorkflowState, ReduceFn } from '../state.js';
import { EventStore } from '../store.js';
import type { AppendInput } from '../store.js';
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

function makeAppendInput(overrides: Partial<AppendInput> = {}): AppendInput {
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
      schemaVersion: 1,
      sessionId: 'sess-1',
      currentStep: 'execution',
      currentSubstate: null,
      completedSteps: ['ideation', 'plan'],
      evalConfig: { ideation: true, plan: false },
      activeSubagents: [
        { subagentId: 'a1', agentType: 'executor', step: 'execution', spawnedAt: '2026-01-01T00:00:00Z' },
      ],
      artifacts: { execution: ['file1.md', 'file2.md'] },
      violations: [
        { guardId: 'g1', toolName: 'Write', reason: 'scope', step: 'execution', timestamp: '2026-01-01T00:00:00Z' },
      ],
      feedbackRound: 1,
      maxFeedbackRounds: 3,
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
    const bad = { ...initialState('s1'), evalConfig: { ideation: 'yes', plan: false } };
    expect(isValidState(bad)).toBe(false);
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
    const state = makeState({ currentStep: 'plan', feedbackRound: 1 });
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
// appendJsonl
// ===========================================================================

describe('appendJsonl', () => {
  it('appends 5 events and produces 5 valid JSON lines', () => {
    for (let i = 0; i < 5; i++) {
      appendJsonl(testDir, { seq: i + 1, type: `event.${i}` });
    }

    const raw = readFileSync(join(testDir, 'events.jsonl'), 'utf8');
    const lines = raw.trim().split('\n');
    expect(lines).toHaveLength(5);

    for (let i = 0; i < 5; i++) {
      const parsed = JSON.parse(lines[i]!) as { seq: number; type: string };
      expect(parsed.seq).toBe(i + 1);
      expect(parsed.type).toBe(`event.${i}`);
    }
  });

  it('creates directory if it does not exist', () => {
    const nested = join(testDir, 'sub', 'dir');
    appendJsonl(nested, { seq: 1 });
    const raw = readFileSync(join(nested, 'events.jsonl'), 'utf8');
    expect(raw.trim()).not.toBe('');
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
      step: 'plan',
      data: JSON.stringify({ step: 'plan' }),
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
    expect(state.completedSteps).toEqual(['ideation', 'plan']);
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
    const backupStateObj = makeState({ currentStep: 'plan' });
    writeState(testDir, backupStateObj);
    backupState(testDir);
    writeFileSync(join(testDir, 'state.json'), 'corrupt', 'utf8');

    store.append(makeAppendInput({ toolCallId: 'tc-1' }));
    const events = store.replayAll();

    const resolved = resolveState(testDir, events, 'test-session', reduce);
    expect(resolved.currentStep).toBe('plan');
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
  it('returns persisted=false and unchanged state on duplicate', () => {
    using store = new EventStore(':memory:');

    const state = makeState({ currentStep: 'idle' });
    const event: Event = {
      type: WORKFLOW_EVENTS.START,
      data: { sessionId: 'test-session', timestamp: '2026-01-01T00:00:00Z' },
    };

    // First append
    const result1 = appendEventAndUpdateState(
      store, testDir, state, event, 'cli', 'test-session', 'tool-call', 'tc-dedup',
    );
    expect(result1.persisted).toBe(true);
    expect(result1.state.currentStep).toBe('ideation');

    // Second append with same idempotency key
    const result2 = appendEventAndUpdateState(
      store, testDir, result1.state, event, 'cli', 'test-session', 'tool-call', 'tc-dedup',
    );
    expect(result2.persisted).toBe(false);
    expect(result2.state).toEqual(result1.state);

    // Only 1 event in the store
    expect(store.eventCount()).toBe(1);

    // Only 1 line in jsonl
    const jsonl = readFileSync(join(testDir, 'events.jsonl'), 'utf8').trim().split('\n');
    expect(jsonl).toHaveLength(1);
  });
});

// ===========================================================================
// restoreStateFromBackup
// ===========================================================================

describe('restoreStateFromBackup', () => {
  it('copies backup back to state.json', () => {
    const original = makeState({ currentStep: 'plan' });
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
// Engine: crash-safety — state.json restored on filesystem failure
// ===========================================================================

describe('appendEventAndUpdateState crash-safety', () => {
  it('restores state.json from backup when appendJsonl throws', () => {
    using store = new EventStore(':memory:');

    const state = makeState({ currentStep: 'idle' });
    const event: Event = {
      type: WORKFLOW_EVENTS.START,
      data: { sessionId: 'test-session', timestamp: '2026-01-01T00:00:00Z' },
    };

    // Write initial state so backupState has something to copy
    writeState(testDir, state);

    // Create events.jsonl as a directory so appendFileSync throws EISDIR
    mkdirSync(join(testDir, 'events.jsonl'), { recursive: true });

    // The transaction should throw because appendJsonl fails
    expect(() =>
      appendEventAndUpdateState(
        store, testDir, state, event, 'cli', 'test-session', 'tool-call', 'tc-crash',
      ),
    ).toThrow();

    // state.json should be restored to the pre-operation state (idle),
    // not advanced to ideation
    const restored = readState(testDir);
    expect(restored).not.toBeNull();
    expect(restored!.currentStep).toBe('idle');

    // SQLite transaction should have rolled back — no events persisted
    expect(store.eventCount()).toBe(0);
  });
});
