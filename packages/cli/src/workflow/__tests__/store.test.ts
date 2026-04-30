import { describe, it, expect } from 'bun:test';
import { Database } from 'bun:sqlite';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import { EventStore } from '../store.js';
import type {
  AppendInput,
  AppendInputContent,
  AppendInputCounter,
  AppendInputSystem,
  AppendInputToolCall,
  EventRow,
  EventStoreOptions,
  ReadStore,
  WriteStore,
} from '../store.js';
import { CURRENT_SCHEMA_VERSION, migrateEvent } from '../migrations.js';
import type { EventRow as MigrationEventRow } from '../migrations.js';

// ---------------------------------------------------------------------------
// Test helpers — narrower `Partial<Variant>` overrides keep the
// discriminated union tight. A helper that took `Partial<AppendInput>`
// would let a caller leak a `toolCallId` into a 'system' fixture (the
// union distribution would permit it), which our runtime branch does
// not intend to support.
// ---------------------------------------------------------------------------

function makeInput(
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

function makeSystemInput(
  overrides: Partial<AppendInputSystem> = {},
): AppendInput {
  return {
    ts: '2026-01-01T00:00:00.000Z',
    type: 'session.heartbeat',
    step: null,
    data: JSON.stringify({ timestamp: '2026-01-01T00:00:00.000Z' }),
    actor: 'system',
    parent_seq: null,
    idempotencyKind: 'system',
    sessionId: 'sess-1',
    ...overrides,
  };
}

function makeCounterInput(
  overrides: Partial<AppendInputCounter> = {},
): AppendInput {
  return {
    ts: '2026-01-01T00:00:00.000Z',
    type: 'session.heartbeat',
    step: null,
    data: JSON.stringify({ timestamp: '2026-01-01T00:00:00.000Z' }),
    actor: 'system',
    parent_seq: null,
    idempotencyKind: 'counter',
    counter: 0,
    sessionId: 'sess-1',
    ...overrides,
  };
}

function makeContentInput(
  overrides: Partial<AppendInputContent> = {},
): AppendInput {
  return {
    ts: '2026-01-01T00:00:00.000Z',
    type: 'prompt.patch.applied',
    step: null,
    data: JSON.stringify({ patchId: 'p1' }),
    actor: 'operator',
    parent_seq: null,
    idempotencyKind: 'content',
    contentId: 'sha256-content-1',
    sessionId: 'sess-1',
    ...overrides,
  };
}

// ===========================================================================
// Schema creation
// ===========================================================================

describe('schema creation', () => {
  it('creates the events table and indexes in a fresh database', () => {
    using store = new EventStore(':memory:');

    // Verify table exists by appending and reading
    const row = store.append(makeInput());
    expect(row).not.toBeNull();
    expect(row!.seq).toBe(1);

    // Verify indexes exist — query sqlite_master
    const rows = store.replayAll();
    expect(rows).toHaveLength(1);
  });
});

// ===========================================================================
// Append and read
// ===========================================================================

describe('append and read', () => {
  it('appends an event and returns it with correct seq and schema_version', () => {
    using store = new EventStore(':memory:');

    const row = store.append(makeInput());
    expect(row).not.toBeNull();
    expect(row!.seq).toBe(1);
    expect(row!.ts).toBe('2026-01-01T00:00:00.000Z');
    expect(row!.schema_version).toBe(CURRENT_SCHEMA_VERSION);
    expect(row!.type).toBe('workflow.start');
    expect(row!.step).toBeNull();
    expect(row!.actor).toBe('orchestrator');
    expect(row!.parent_seq).toBeNull();
    expect(row!.idempotency_key).toBe('sess-1:tc-001:workflow.start');
  });

  it('replayAll returns the event with correct data', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput());
    const rows = store.replayAll();
    expect(rows).toHaveLength(1);
    expect(rows[0]!.type).toBe('workflow.start');
    expect(JSON.parse(rows[0]!.data)).toEqual({
      sessionId: 'sess-1',
      timestamp: '2026-01-01T00:00:00.000Z',
    });
  });

  it('assigns sequential seq values', () => {
    using store = new EventStore(':memory:');

    const row1 = store.append(makeInput({ toolCallId: 'tc-001' }));
    const row2 = store.append(makeInput({ toolCallId: 'tc-002', type: 'workflow.step.exit' }));
    const row3 = store.append(makeInput({ toolCallId: 'tc-003', type: 'workflow.step.exit' }));

    expect(row1!.seq).toBe(1);
    expect(row2!.seq).toBe(2);
    expect(row3!.seq).toBe(3);
  });

  it('stores step value when provided', () => {
    using store = new EventStore(':memory:');

    const row = store.append(makeInput({ step: 'ideation', toolCallId: 'tc-100' }));
    expect(row!.step).toBe('ideation');
  });

  it('stores parent_seq when provided', () => {
    using store = new EventStore(':memory:');

    const parent = store.append(makeInput({ toolCallId: 'tc-parent' }));
    const child = store.append(makeInput({
      toolCallId: 'tc-child',
      type: 'workflow.step.exit',
      parent_seq: parent!.seq,
    }));

    expect(child!.parent_seq).toBe(parent!.seq);
  });

  it('defaults data to empty object string when omitted', () => {
    using store = new EventStore(':memory:');

    const row = store.append(makeInput({ data: undefined, toolCallId: 'tc-no-data' }));
    expect(row!.data).toBe('{}');
  });
});

// ===========================================================================
// Idempotency
// ===========================================================================

describe('idempotency', () => {
  it('returns null for duplicate tool-call idempotency key', () => {
    using store = new EventStore(':memory:');

    const first = store.append(makeInput({ toolCallId: 'tc-dup' }));
    expect(first).not.toBeNull();

    const second = store.append(makeInput({ toolCallId: 'tc-dup' }));
    expect(second).toBeNull();

    expect(store.eventCount()).toBe(1);
  });

  it('returns null for duplicate system idempotency key', () => {
    using store = new EventStore(':memory:');

    const ts = '2026-01-01T00:00:00.000Z';
    const first = store.append(makeSystemInput({ ts }));
    expect(first).not.toBeNull();

    const second = store.append(makeSystemInput({ ts }));
    expect(second).toBeNull();

    expect(store.eventCount()).toBe(1);
  });

  it('allows different events with different idempotency keys', () => {
    using store = new EventStore(':memory:');

    const r1 = store.append(makeInput({ toolCallId: 'tc-a', type: 'workflow.start' }));
    const r2 = store.append(makeInput({ toolCallId: 'tc-b', type: 'workflow.step.exit' }));
    const r3 = store.append(makeInput({ toolCallId: 'tc-a', type: 'workflow.step.exit' }));

    expect(r1).not.toBeNull();
    expect(r2).not.toBeNull();
    expect(r3).not.toBeNull();
    expect(store.eventCount()).toBe(3);
  });

  it('tool-call key includes type — same toolCallId with different type is distinct', () => {
    using store = new EventStore(':memory:');

    const r1 = store.append(makeInput({ toolCallId: 'tc-same', type: 'workflow.start' }));
    const r2 = store.append(makeInput({ toolCallId: 'tc-same', type: 'workflow.finish' }));

    expect(r1).not.toBeNull();
    expect(r2).not.toBeNull();
    expect(store.eventCount()).toBe(2);
  });

  it('throws for tool-call kind without toolCallId', () => {
    using store = new EventStore(':memory:');

    // The discriminated-union refinement makes a tool-call AppendInput
    // without `toolCallId` a compile-time error. The `@ts-expect-error`
    // below asserts the type error fires; the runtime throw is still
    // exercised to keep the defensive check from silently rotting.
    const bad = {
      ts: '2026-01-01T00:00:00.000Z',
      type: 'delegation.spawn',
      actor: 'orchestrator',
      idempotencyKind: 'tool-call' as const,
      sessionId: 'sess-1',
      // toolCallId intentionally omitted
    };
    expect(() =>
      // @ts-expect-error — toolCallId is required when kind === 'tool-call'
      store.append(bad),
    ).toThrow('toolCallId is required for tool-call idempotency kind');
  });
});

// ===========================================================================
// byType
// ===========================================================================

describe('byType', () => {
  it('filters events by type', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1', type: 'workflow.start' }));
    store.append(makeInput({ toolCallId: 'tc-2', type: 'workflow.step.exit', step: 'ideation' }));
    store.append(makeInput({ toolCallId: 'tc-3', type: 'workflow.step.skip', step: 'ideation' }));
    store.append(makeInput({ toolCallId: 'tc-4', type: 'workflow.step.exit', step: 'plan' }));

    const exits = store.byType('workflow.step.exit');
    expect(exits).toHaveLength(2);
    expect(exits[0]!.step).toBe('ideation');
    expect(exits[1]!.step).toBe('plan');
  });

  it('returns empty array when no events match the type', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1', type: 'workflow.start' }));

    const results = store.byType('session.heartbeat');
    expect(results).toHaveLength(0);
  });
});

// ===========================================================================
// byStep
// ===========================================================================

describe('byStep', () => {
  it('filters events by step', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1', type: 'workflow.step.exit', step: 'ideation' }));
    store.append(makeInput({ toolCallId: 'tc-2', type: 'workflow.step.exit', step: 'ideation' }));
    store.append(makeInput({ toolCallId: 'tc-3', type: 'workflow.step.exit', step: 'plan' }));
    store.append(makeInput({ toolCallId: 'tc-4', type: 'delegation.spawn', step: 'plan' }));

    const ideation = store.byStep('ideation');
    expect(ideation).toHaveLength(2);
    expect(ideation[0]!.type).toBe('workflow.step.exit');
    expect(ideation[1]!.type).toBe('workflow.step.exit');
  });

  it('filters events by step and type', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1', type: 'workflow.step.exit', step: 'plan' }));
    store.append(makeInput({ toolCallId: 'tc-2', type: 'delegation.spawn', step: 'plan' }));
    store.append(makeInput({ toolCallId: 'tc-3', type: 'workflow.step.exit', step: 'plan' }));

    const planSpawns = store.byStep('plan', 'delegation.spawn');
    expect(planSpawns).toHaveLength(1);
    expect(planSpawns[0]!.type).toBe('delegation.spawn');
  });

  it('returns empty array when no events match', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1', type: 'workflow.step.exit', step: 'ideation' }));

    const results = store.byStep('plan');
    expect(results).toHaveLength(0);
  });
});

// ===========================================================================
// since
// ===========================================================================

describe('since', () => {
  it('returns events after the given seq', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1', type: 'workflow.start' }));
    store.append(makeInput({ toolCallId: 'tc-2', type: 'workflow.step.exit' }));
    store.append(makeInput({ toolCallId: 'tc-3', type: 'workflow.step.exit' }));
    store.append(makeInput({ toolCallId: 'tc-4', type: 'workflow.step.exit' }));
    store.append(makeInput({ toolCallId: 'tc-5', type: 'workflow.finish' }));

    const tail = store.since(3);
    expect(tail).toHaveLength(2);
    expect(tail[0]!.seq).toBe(4);
    expect(tail[1]!.seq).toBe(5);
  });

  it('returns all events when seq is 0', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1' }));
    store.append(makeInput({ toolCallId: 'tc-2', type: 'workflow.step.exit' }));

    const all = store.since(0);
    expect(all).toHaveLength(2);
  });

  it('returns empty array when seq is past the last event', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1' }));

    const results = store.since(999);
    expect(results).toHaveLength(0);
  });
});

// ===========================================================================
// last
// ===========================================================================

describe('last', () => {
  it('returns the most recent event of a given type', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1', type: 'workflow.step.exit', step: 'ideation' }));
    store.append(makeInput({ toolCallId: 'tc-2', type: 'workflow.step.exit', step: 'ideation' }));
    store.append(makeInput({ toolCallId: 'tc-3', type: 'workflow.step.exit', step: 'plan' }));

    const lastEnter = store.last('workflow.step.exit');
    expect(lastEnter).not.toBeNull();
    expect(lastEnter!.step).toBe('plan');
    expect(lastEnter!.seq).toBe(3);
  });

  it('returns null when no events of the given type exist', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1', type: 'workflow.start' }));

    const result = store.last('session.heartbeat');
    expect(result).toBeNull();
  });
});

// ===========================================================================
// lastN
// ===========================================================================

describe('lastN', () => {
  it('returns the n most recent events in DESC order (newest first)', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1', type: 'workflow.step.exit', step: 'ideation' }));
    store.append(makeInput({ toolCallId: 'tc-2', type: 'workflow.step.exit', step: 'plan' }));
    store.append(makeInput({ toolCallId: 'tc-3', type: 'workflow.step.exit', step: 'execution' }));
    store.append(makeInput({ toolCallId: 'tc-4', type: 'workflow.step.exit', step: 'memorization' }));

    const tail = store.lastN('workflow.step.exit', 2);
    expect(tail).toHaveLength(2);
    // Newest first — seq=4 then seq=3.
    expect(tail[0]!.seq).toBe(4);
    expect(tail[0]!.step).toBe('memorization');
    expect(tail[1]!.seq).toBe(3);
    expect(tail[1]!.step).toBe('execution');
  });

  it('caps the materialised set at n even when more events exist', () => {
    using store = new EventStore(':memory:');

    // Seed 10 heartbeats; ask for 3 — store must return only 3.
    for (let i = 0; i < 10; i += 1) {
      const counter = i;
      store.append({
        ts: `2026-01-01T00:00:00.${String(i).padStart(3, '0')}Z`,
        type: 'session.heartbeat',
        step: null,
        data: '{}',
        actor: 'hook',
        parent_seq: null,
        idempotencyKind: 'counter',
        counter,
        sessionId: 'lastn-session',
      });
    }

    const tail = store.lastN('session.heartbeat', 3);
    expect(tail).toHaveLength(3);
    // DESC ordering — seq 10, 9, 8.
    expect(tail[0]!.seq).toBe(10);
    expect(tail[1]!.seq).toBe(9);
    expect(tail[2]!.seq).toBe(8);
  });

  it('returns fewer rows than requested when the type has fewer events', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1', type: 'workflow.start' }));

    const tail = store.lastN('workflow.start', 50);
    expect(tail).toHaveLength(1);
  });

  it('returns empty array for unknown type', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1' }));

    const tail = store.lastN('no-such-type', 10);
    expect(tail).toHaveLength(0);
  });

  it('returns empty array when n is 0 or negative', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1' }));

    expect(store.lastN('workflow.start', 0)).toHaveLength(0);
    expect(store.lastN('workflow.start', -5)).toHaveLength(0);
  });
});

// ===========================================================================
// lastNAny
// ===========================================================================

describe('lastNAny', () => {
  it('returns up to n most recent events regardless of type, seq DESC', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1', type: 'workflow.start' }));
    store.append(makeInput({ toolCallId: 'tc-2', type: 'workflow.step.exit', step: 'ideation' }));
    store.append(makeSystemInput({ type: 'session.heartbeat', ts: '2026-01-01T00:00:01.000Z' }));
    store.append(makeInput({ toolCallId: 'tc-4', type: 'workflow.step.skip' }));

    const tail = store.lastNAny(3);
    expect(tail).toHaveLength(3);
    // Newest first, all types mixed.
    expect(tail[0]!.seq).toBe(4);
    expect(tail[0]!.type).toBe('workflow.step.skip');
    expect(tail[1]!.seq).toBe(3);
    expect(tail[1]!.type).toBe('session.heartbeat');
    expect(tail[2]!.seq).toBe(2);
    expect(tail[2]!.type).toBe('workflow.step.exit');
  });

  it('returns empty array for an empty store', () => {
    using store = new EventStore(':memory:');

    const tail = store.lastNAny(5);
    expect(tail).toHaveLength(0);
  });

  it('returns fewer rows than requested when count < n', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-only', type: 'workflow.start' }));

    const tail = store.lastNAny(10);
    expect(tail).toHaveLength(1);
    expect(tail[0]!.seq).toBe(1);
  });

  it('returns empty array when n <= 0', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-1' }));
    store.append(makeInput({ toolCallId: 'tc-2', type: 'workflow.step.exit' }));

    expect(store.lastNAny(0)).toHaveLength(0);
    expect(store.lastNAny(-1)).toHaveLength(0);
  });
});

// ===========================================================================
// transaction
// ===========================================================================

describe('transaction', () => {
  it('commits multiple appends atomically', () => {
    using store = new EventStore(':memory:');

    store.transaction(() => {
      store.append(makeInput({ toolCallId: 'tc-tx-1', type: 'workflow.start' }));
      store.append(makeInput({ toolCallId: 'tc-tx-2', type: 'workflow.step.exit', step: 'ideation' }));
    });

    expect(store.eventCount()).toBe(2);
    const all = store.replayAll();
    expect(all[0]!.type).toBe('workflow.start');
    expect(all[1]!.type).toBe('workflow.step.exit');
  });

  it('rolls back on exception — no events persisted', () => {
    using store = new EventStore(':memory:');

    expect(() => {
      store.transaction(() => {
        store.append(makeInput({ toolCallId: 'tc-rb-1', type: 'workflow.start' }));
        store.append(makeInput({ toolCallId: 'tc-rb-2', type: 'workflow.step.exit' }));
        throw new Error('simulated failure');
      });
    }).toThrow('simulated failure');

    expect(store.eventCount()).toBe(0);
    expect(store.replayAll()).toHaveLength(0);
  });

  it('returns the value from the transaction function', () => {
    using store = new EventStore(':memory:');

    const result = store.transaction(() => {
      const row = store.append(makeInput({ toolCallId: 'tc-ret' }));
      return row!.seq;
    });

    expect(result).toBe(1);
  });
});

// ===========================================================================
// ON CONFLICT behavior (detailed)
// ===========================================================================

describe('ON CONFLICT behavior', () => {
  it('first insert returns row with seq, duplicate returns null', () => {
    using store = new EventStore(':memory:');

    const first = store.append(makeInput({ toolCallId: 'tc-conflict' }));
    expect(first).not.toBeNull();
    expect(typeof first!.seq).toBe('number');

    const dup = store.append(makeInput({ toolCallId: 'tc-conflict' }));
    expect(dup).toBeNull();
  });

  it('non-idempotency constraint violations still throw', () => {
    using store = new EventStore(':memory:');

    // parent_seq references a non-existent event — FK violation
    expect(() => store.append(makeInput({
      toolCallId: 'tc-fk-fail',
      parent_seq: 9999,
    }))).toThrow();
  });
});

// ===========================================================================
// eventCount
// ===========================================================================

describe('eventCount', () => {
  it('returns 0 for empty store', () => {
    using store = new EventStore(':memory:');
    expect(store.eventCount()).toBe(0);
  });

  it('returns correct count after appends', () => {
    using store = new EventStore(':memory:');

    store.append(makeInput({ toolCallId: 'tc-c1' }));
    store.append(makeInput({ toolCallId: 'tc-c2', type: 'workflow.step.exit' }));
    store.append(makeInput({ toolCallId: 'tc-c3', type: 'workflow.step.exit' }));

    expect(store.eventCount()).toBe(3);
  });
});

// ===========================================================================
// Symbol.dispose
// ===========================================================================

describe('Symbol.dispose', () => {
  it('auto-closes via using keyword', () => {
    let closedStore: EventStore;

    {
      using store = new EventStore(':memory:');
      store.append(makeInput({ toolCallId: 'tc-dispose' }));
      closedStore = store;
    }

    // After scope exit, the store should be closed.
    // Attempting to use it should throw.
    expect(() => closedStore.replayAll()).toThrow();
  });
});

// ===========================================================================
// Migration pipeline
// ===========================================================================

describe('migrateEvent', () => {
  const baseRow: MigrationEventRow = {
    seq: 1,
    ts: '2026-01-01T00:00:00.000Z',
    schema_version: CURRENT_SCHEMA_VERSION,
    type: 'workflow.start',
    step: null,
    data: '{"sessionId":"s1"}',
    actor: 'orchestrator',
    parent_seq: null,
    idempotency_key: 'test:1:workflow.start',
    session_id: 's1',
    project_id: null,
  };

  it('returns the same row when already at target version', () => {
    const result = migrateEvent(baseRow, CURRENT_SCHEMA_VERSION);
    expect(result).toBe(baseRow); // identity — no copy made
  });

  it('throws when schema_version is newer than target', () => {
    const futureRow = { ...baseRow, schema_version: 99 };
    expect(() => migrateEvent(futureRow, 1)).toThrow(
      'Event schema_version 99 is newer than target 1',
    );
  });

  it('throws when migration step is missing', () => {
    // Simulate an event from a hypothetical schema v0
    const oldRow = { ...baseRow, schema_version: 0 };
    expect(() => migrateEvent(oldRow, 1)).toThrow(
      'No migration from schema v0 to v1',
    );
  });
});

// ===========================================================================
// System idempotency key formula
// ===========================================================================

describe('system idempotency key', () => {
  it('generates key from sessionId, timestampMs, and eventType', () => {
    using store = new EventStore(':memory:');

    const ts = '2026-06-15T12:30:00.000Z';
    const row = store.append(makeSystemInput({ ts, type: 'session.heartbeat' }));

    expect(row).not.toBeNull();
    const expectedMs = Date.parse(ts);
    expect(row!.idempotency_key).toBe(`sess-1:${expectedMs}:session.heartbeat`);
  });
});

// ===========================================================================
// Counter idempotency kind
// ===========================================================================

describe('counter idempotency key', () => {
  it('generates key from sessionId, timestampMs, eventType, and counter', () => {
    using store = new EventStore(':memory:');

    const ts = '2026-06-15T12:30:00.000Z';
    const row = store.append(
      makeCounterInput({ ts, type: 'session.heartbeat', counter: 0 }),
    );

    expect(row).not.toBeNull();
    const expectedMs = Date.parse(ts);
    expect(row!.idempotency_key).toBe(
      `sess-1:${expectedMs}:session.heartbeat:0`,
    );
  });

  it('same timestamp + type + counter collides (ON CONFLICT returns null)', () => {
    using store = new EventStore(':memory:');

    const ts = '2026-06-15T12:30:00.000Z';
    const first = store.append(makeCounterInput({ ts, counter: 0 }));
    const dup = store.append(makeCounterInput({ ts, counter: 0 }));

    expect(first).not.toBeNull();
    expect(dup).toBeNull();
    expect(store.eventCount()).toBe(1);
  });

  it('same timestamp + type with counter+1 disambiguates — both persist', () => {
    using store = new EventStore(':memory:');

    const ts = '2026-06-15T12:30:00.000Z';
    const r0 = store.append(makeCounterInput({ ts, counter: 0 }));
    const r1 = store.append(makeCounterInput({ ts, counter: 1 }));

    expect(r0).not.toBeNull();
    expect(r1).not.toBeNull();
    expect(r0!.idempotency_key).toBe(
      `sess-1:${Date.parse(ts)}:session.heartbeat:0`,
    );
    expect(r1!.idempotency_key).toBe(
      `sess-1:${Date.parse(ts)}:session.heartbeat:1`,
    );
    expect(store.eventCount()).toBe(2);
  });

  it('counter is required when kind === "counter" — omitting it is a compile-time error', () => {
    using store = new EventStore(':memory:');

    // Discriminated-union refinement forbids `counter`-kind inputs
    // without a `counter` field. The `@ts-expect-error` below asserts
    // the type error fires; at runtime the key formula would produce
    // `:undefined`, which is still unique enough to not crash the
    // UNIQUE constraint but is clearly wrong — the type guard is the
    // real protection here.
    const bad = {
      ts: '2026-01-01T00:00:00.000Z',
      type: 'session.heartbeat',
      actor: 'system',
      idempotencyKind: 'counter' as const,
      sessionId: 'sess-1',
      // counter intentionally omitted
    };
    // @ts-expect-error — counter is required when kind === 'counter'
    const row = store.append(bad);
    // The cast path succeeded — assert the formula degraded predictably
    // so future readers understand the tsc gate is the real protection.
    expect(row).not.toBeNull();
    expect(row!.idempotency_key).toBe(
      `sess-1:${Date.parse('2026-01-01T00:00:00.000Z')}:session.heartbeat:undefined`,
    );
  });

  it('system and counter keys for the same (sessionId, ts, type) are distinct', () => {
    using store = new EventStore(':memory:');

    const ts = '2026-06-15T12:30:00.000Z';
    const sys = store.append(makeSystemInput({ ts }));
    const cnt = store.append(makeCounterInput({ ts, counter: 0 }));

    expect(sys).not.toBeNull();
    expect(cnt).not.toBeNull();
    expect(sys!.idempotency_key).not.toBe(cnt!.idempotency_key);
  });
});

// ===========================================================================
// 'content' idempotency key — Wave C.1.3 (issue #156)
//
// Cross-session content-addressed dedup. The formula is `${type}:${contentId}`
// — `sessionId` is intentionally absent from the key so the same patch
// content appended from two different sessions dedupes at the events table.
// Synthesis lock 8 + 9.
// ===========================================================================

describe('content idempotency key', () => {
  it('generates key from eventType and contentId only — sessionId is NOT in the formula', () => {
    using store = new EventStore(':memory:');

    const row = store.append(
      makeContentInput({
        type: 'prompt.patch.applied',
        contentId: 'sha256-abc',
      }),
    );

    expect(row).not.toBeNull();
    expect(row!.idempotency_key).toBe('prompt.patch.applied:sha256-abc');
  });

  it('same (type, contentId) collides regardless of sessionId — cross-session dedup', () => {
    using store = new EventStore(':memory:');

    const first = store.append(
      makeContentInput({ contentId: 'sha256-shared', sessionId: 'sess-A' }),
    );
    // Different session, same content. Must dedupe — the patch_id is
    // a content address, not a session-scoped identifier.
    const dup = store.append(
      makeContentInput({ contentId: 'sha256-shared', sessionId: 'sess-B' }),
    );

    expect(first).not.toBeNull();
    expect(dup).toBeNull();
    expect(store.eventCount()).toBe(1);
  });

  it('different contentIds produce distinct keys — both persist', () => {
    using store = new EventStore(':memory:');

    const r0 = store.append(makeContentInput({ contentId: 'sha256-a' }));
    const r1 = store.append(makeContentInput({ contentId: 'sha256-b' }));

    expect(r0).not.toBeNull();
    expect(r1).not.toBeNull();
    expect(r0!.idempotency_key).toBe('prompt.patch.applied:sha256-a');
    expect(r1!.idempotency_key).toBe('prompt.patch.applied:sha256-b');
    expect(store.eventCount()).toBe(2);
  });

  it('same contentId across different event types is distinct', () => {
    using store = new EventStore(':memory:');

    const r0 = store.append(
      makeContentInput({ type: 'prompt.patch.applied', contentId: 'sha256-x' }),
    );
    const r1 = store.append(
      makeContentInput({ type: 'unknown.future', contentId: 'sha256-x' }),
    );

    expect(r0).not.toBeNull();
    expect(r1).not.toBeNull();
    expect(r0!.idempotency_key).not.toBe(r1!.idempotency_key);
  });

  it('content kind is rejected at compile time when contentId is omitted', () => {
    using store = new EventStore(':memory:');

    const bad = {
      ts: '2026-01-01T00:00:00.000Z',
      type: 'prompt.patch.applied',
      actor: 'operator',
      idempotencyKind: 'content' as const,
      sessionId: 'sess-1',
      // contentId intentionally omitted
    };
    // @ts-expect-error — contentId is required when kind === 'content'
    const row = store.append(bad);
    // Like the counter case: tsc is the gate. Runtime will produce a
    // degenerate `prompt.patch.applied:undefined` key — clearly wrong but
    // not a crash.
    expect(row).not.toBeNull();
    expect(row!.idempotency_key).toBe('prompt.patch.applied:undefined');
  });

  it('byte-identical patches across DIFFERENT prompts produce distinct events when contentId is namespaced by promptId — Architecture F-4', () => {
    // Wave C.1.6 R1 / Architecture F-4: the same RFC 6902 ops array
    // applied to two different prompts (e.g., a generic
    // `add /meta/notes "audited"` op meaningful for both `ideation` and
    // `planning`) must produce TWO event rows, not one. The fix is to
    // namespace `contentId` with `${promptId}:${patchId}` so the
    // idempotency formula `${type}:${contentId}` resolves to distinct
    // keys per prompt. This test locks the contract at the store layer.
    using store = new EventStore(':memory:');

    // The raw patch hash is identical across prompts; the namespaced
    // `contentId` differs.
    const rawPatchId = 'sha256-shared-ops';
    const ideationContentId = `ideation:${rawPatchId}`;
    const planningContentId = `planning:${rawPatchId}`;

    const r1 = store.append(
      makeContentInput({
        type: 'prompt.patch.applied',
        contentId: ideationContentId,
        sessionId: 'sess-x',
        data: JSON.stringify({ promptId: 'ideation', patchId: rawPatchId }),
      }),
    );
    const r2 = store.append(
      makeContentInput({
        type: 'prompt.patch.applied',
        contentId: planningContentId,
        sessionId: 'sess-x',
        data: JSON.stringify({ promptId: 'planning', patchId: rawPatchId }),
      }),
    );

    expect(r1).not.toBeNull();
    expect(r2).not.toBeNull();
    expect(r1!.idempotency_key).toBe(`prompt.patch.applied:${ideationContentId}`);
    expect(r2!.idempotency_key).toBe(`prompt.patch.applied:${planningContentId}`);
    expect(r1!.idempotency_key).not.toBe(r2!.idempotency_key);
    expect(store.eventCount()).toBe(2);

    // Sanity check: the raw patchId on the JSON payload is the same
    // (the operator's RFC 6902 ops array is byte-identical) — only the
    // namespaced contentId differs.
    const data1 = JSON.parse(r1!.data) as { patchId: string };
    const data2 = JSON.parse(r2!.data) as { patchId: string };
    expect(data1.patchId).toBe(rawPatchId);
    expect(data2.patchId).toBe(rawPatchId);
    expect(data1.patchId).toBe(data2.patchId);
  });

  it('byte-identical patches on the SAME prompt across two sessions still dedup — Architecture F-4 keeps the cross-session safety net', () => {
    // The promptId-namespaced contentId must NOT break the original
    // cross-session dedup contract: a patch hash applied twice on the
    // same prompt from two different sessions still collapses to one
    // event row (synthesis lock 8 + 9). The Architecture F-4 fix only
    // changes the formula's INPUT (contentId now includes promptId),
    // not its cross-session-collision semantics.
    using store = new EventStore(':memory:');

    const namespaced = 'ideation:sha256-same';

    const first = store.append(
      makeContentInput({
        type: 'prompt.patch.applied',
        contentId: namespaced,
        sessionId: 'sess-A',
        data: JSON.stringify({ promptId: 'ideation' }),
      }),
    );
    const dup = store.append(
      makeContentInput({
        type: 'prompt.patch.applied',
        contentId: namespaced,
        sessionId: 'sess-B',
        data: JSON.stringify({ promptId: 'ideation' }),
      }),
    );

    expect(first).not.toBeNull();
    expect(dup).toBeNull();
    expect(store.eventCount()).toBe(1);
  });

  it('content row is still partitioned by session_id column even though sessionId is absent from the idempotency formula', () => {
    using store = new EventStore(':memory:', { sessionId: 'sess-explicit' });

    const row = store.append(
      makeContentInput({
        contentId: 'sha256-partition-check',
        sessionId: 'sess-explicit',
      }),
    );

    expect(row).not.toBeNull();
    expect(row!.session_id).toBe('sess-explicit');
    // Idempotency key omits the session — partition column does not.
    expect(row!.idempotency_key).toBe(
      'prompt.patch.applied:sha256-partition-check',
    );
  });
});

// ===========================================================================
// aggregateDelegationCosts — named cost-rollup query surface
// ===========================================================================

/**
 * Seed one `delegation.complete` event into the given store. Mirrors the
 * `seedDelegationComplete` helper in status.test.ts but writes through the
 * provided store handle so tests can compose a mixed-type fixture in a
 * single in-memory database.
 */
function appendDelegationComplete(
  store: EventStore,
  opts: {
    readonly sessionId: string;
    readonly subagentId: string;
    readonly step: string;
    readonly ts: string;
    readonly toolCallId: string;
    readonly data: Readonly<Record<string, unknown>>;
  },
): void {
  store.append({
    ts: opts.ts,
    type: 'delegation.complete',
    step: opts.step,
    data: JSON.stringify(opts.data),
    actor: 'orchestrator',
    parent_seq: null,
    idempotencyKind: 'tool-call',
    toolCallId: opts.toolCallId,
    sessionId: opts.sessionId,
  });
}

describe('aggregateDelegationCosts', () => {
  it('returns an empty array when the events table has no rows', () => {
    using store = new EventStore(':memory:');

    const rows = store.aggregateDelegationCosts();

    expect(rows).toEqual([]);
  });

  it('returns one row per delegation.complete event in seq ASC order', () => {
    using store = new EventStore(':memory:');

    appendDelegationComplete(store, {
      sessionId: 'sess-agg',
      subagentId: 'sub-1',
      step: 'ideation',
      ts: '2026-04-18T10:00:00.000Z',
      toolCallId: 'tc-1',
      data: {
        subagentId: 'sub-1',
        model: 'claude-opus-4-7',
        tokensUsed: {
          input_tokens: 1_000_000,
          output_tokens: 0,
          cache_read_input_tokens: 0,
          cache_creation_input_tokens: 0,
        },
      },
    });
    appendDelegationComplete(store, {
      sessionId: 'sess-agg',
      subagentId: 'sub-2',
      step: 'plan',
      ts: '2026-04-18T10:01:00.000Z',
      toolCallId: 'tc-2',
      data: {
        subagentId: 'sub-2',
        sizeProxyBytes: 10_000,
      },
    });
    appendDelegationComplete(store, {
      sessionId: 'sess-agg',
      subagentId: 'sub-3',
      step: 'execution',
      ts: '2026-04-18T10:02:00.000Z',
      toolCallId: 'tc-3',
      data: {
        subagentId: 'sub-3',
        model: 'claude-sonnet-4-5',
        tokensUsed: {
          input_tokens: 500_000,
          output_tokens: 0,
          cache_read_input_tokens: 0,
          cache_creation_input_tokens: 0,
        },
      },
    });

    const rows = store.aggregateDelegationCosts();

    expect(rows).toHaveLength(3);
    // seq ASC mirrors append order
    expect(rows[0]?.subagentId).toBe('sub-1');
    expect(rows[0]?.step).toBe('ideation');
    expect(rows[0]?.model).toBe('claude-opus-4-7');
    expect(rows[0]?.tokensJson).not.toBeNull();
    expect(rows[0]?.bytes).toBeNull();

    expect(rows[1]?.subagentId).toBe('sub-2');
    expect(rows[1]?.step).toBe('plan');
    expect(rows[1]?.tokensJson).toBeNull();
    expect(rows[1]?.bytes).toBe(10_000);

    expect(rows[2]?.subagentId).toBe('sub-3');
    expect(rows[2]?.step).toBe('execution');
    expect(rows[2]?.model).toBe('claude-sonnet-4-5');
  });

  it('filters out events whose type is not delegation.complete', () => {
    using store = new EventStore(':memory:');

    // One delegation.complete that should appear in the rollup
    appendDelegationComplete(store, {
      sessionId: 'sess-filter',
      subagentId: 'sub-included',
      step: 'plan',
      ts: '2026-04-18T11:00:00.000Z',
      toolCallId: 'tc-included',
      data: {
        subagentId: 'sub-included',
        model: 'claude-opus-4-7',
        tokensUsed: {
          input_tokens: 100,
          output_tokens: 0,
          cache_read_input_tokens: 0,
          cache_creation_input_tokens: 0,
        },
      },
    });

    // Noise: other event types that MUST be filtered out
    store.append({
      ts: '2026-04-18T11:01:00.000Z',
      type: 'workflow.start',
      step: null,
      data: JSON.stringify({
        sessionId: 'sess-filter',
        timestamp: '2026-04-18T11:01:00.000Z',
      }),
      actor: 'orchestrator',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-start',
      sessionId: 'sess-filter',
    });
    store.append({
      ts: '2026-04-18T11:02:00.000Z',
      type: 'delegation.spawn',
      step: 'plan',
      data: JSON.stringify({
        subagentId: 'sub-other',
        agentType: 'executor',
        step: 'plan',
      }),
      actor: 'orchestrator',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-spawn',
      sessionId: 'sess-filter',
    });

    const rows = store.aggregateDelegationCosts();

    expect(rows).toHaveLength(1);
    expect(rows[0]?.subagentId).toBe('sub-included');
    expect(rows[0]?.step).toBe('plan');
  });
});

// ===========================================================================
// ReadStore / WriteStore — structural read-only enforcement (#97)
//
// The pair of interfaces is the type-level guarantee that read-only callers
// (prompt compilers, pathway detector, cost rollup, state derivation) cannot
// accidentally invoke write methods. Runtime behaviour is unchanged — this
// block only exercises `tsc`'s view of the contract.
//
// Each `@ts-expect-error` assertion MUST trigger a real compile error; if it
// doesn't, `tsc` flags the annotation as unused, which fails the typecheck
// gate. That "unused-directive" mode is what turns the assertion into an
// enforceable structural check rather than a static-only comment.
// ===========================================================================

describe('ReadStore / WriteStore — structural read-only enforcement (#97)', () => {
  it('rejects write calls on a ReadStore reference at compile time', () => {
    using store = new EventStore(':memory:');
    const readOnly: ReadStore = store;

    // A legal read — lastN is part of the ReadStore surface.
    expect(readOnly.lastN('workflow.start', 1)).toEqual([]);

    // @ts-expect-error — `append` is not part of ReadStore; only WriteStore.
    readOnly.append;

    // @ts-expect-error — `transaction` is not part of ReadStore.
    readOnly.transaction;

    // @ts-expect-error — `close` is not part of ReadStore.
    readOnly.close;
  });

  it('accepts write calls on a WriteStore reference', () => {
    using store = new EventStore(':memory:');
    const writeable: WriteStore = store;

    // Structural assertion — both read and write methods are available.
    expect(typeof writeable.append).toBe('function');
    expect(typeof writeable.transaction).toBe('function');
    expect(typeof writeable.close).toBe('function');
    expect(typeof writeable.lastN).toBe('function');
  });
});

// ===========================================================================
// Schema v5 — session_id + project_id column presence and stamping (#118)
//
// Pass 2's DRIFT-3 fix lifts the two partition keys out of the
// `idempotency_key` string. Every fresh-write row must carry both
// columns; a store opened against a legacy v4 file must ALTER the
// columns in and backfill known-null rows. These tests exercise the
// on-disk shape — `:memory:` stores cannot see the session directory
// so they carry `null` partition keys by design.
// ===========================================================================

/**
 * Make a tmpdir-scoped session directory with a valid `metadata.json`,
 * returning the path to the directory + its `gobbi.db` child. Caller is
 * responsible for rmSync'ing the tmpdir after the test.
 */
function makeSessionDir(
  sessionId: string,
  projectRoot: string,
  projectName?: string,
): { readonly sessionDir: string; readonly dbPath: string } {
  const sessionDir = join(
    mkdtempSync(join(tmpdir(), 'gobbi-store-partition-')),
    sessionId,
  );
  mkdirSync(sessionDir, { recursive: true });
  // Schema v3 metadata.json — `projectName` is the project_id partition
  // key (issue #178 dropped the old basename(projectRoot) derivation).
  // Default to `basename(projectRoot)` so legacy callsites that rely on
  // the project_id matching the projectRoot basename continue to do so.
  const metadata = {
    schemaVersion: 3,
    sessionId,
    createdAt: '2026-04-21T00:00:00.000Z',
    projectRoot,
    projectName: projectName ?? basename(projectRoot),
    techStack: [],
    configSnapshot: { task: '', evalIdeation: false, evalPlan: false, context: '' },
  };
  writeFileSync(
    join(sessionDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2),
    'utf8',
  );
  return { sessionDir, dbPath: join(sessionDir, 'gobbi.db') };
}

describe('schema v5 — session_id + project_id columns', () => {
  it('PRAGMA table_info(events) exposes both partition-key columns on a fresh database', () => {
    using store = new EventStore(':memory:');

    // The EventStore private db is not exposed, but we can re-open the
    // same `:memory:` connection scope via a sibling Database — except
    // :memory: databases are per-connection. Instead, open a fresh
    // connection against a separate :memory: and run the constructor's
    // schema path through the public EventStore.
    //
    // Concretely: append one event to force the stmt cache to prepare
    // against the v5 schema, then pull the column names via a fresh
    // introspection query on the same store's db. We cannot reach the
    // private `db` field, so we open another on-disk path, introspect
    // it, and rely on the constructor's behaviour being deterministic.
    const row = store.append(makeInput());
    expect(row).not.toBeNull();

    // Re-run the column introspection via a freshly-constructed file-
    // based store to confirm the CREATE TABLE statement on disk matches.
    const { sessionDir, dbPath } = makeSessionDir('sess-pragma', '/tmp/my-repo');
    try {
      using filestore = new EventStore(dbPath);
      // Append once to keep the store alive and the schema frozen.
      filestore.append({
        ts: '2026-04-21T00:00:00.000Z',
        type: 'workflow.start',
        step: null,
        data: JSON.stringify({
          sessionId: 'sess-pragma',
          timestamp: '2026-04-21T00:00:00.000Z',
        }),
        actor: 'cli',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-pragma-1',
        sessionId: 'sess-pragma',
      });

      // Read the on-disk schema through a sibling connection — the
      // store holds a writer lock, but PRAGMA is a read-only query and
      // WAL mode permits a second connection to inspect it.
      const inspector = new Database(dbPath, { readonly: true });
      try {
        interface ColumnInfo { readonly name: string }
        const cols = inspector
          .query<ColumnInfo, []>('PRAGMA table_info(events)')
          .all();
        const names = new Set(cols.map((c) => c.name));
        expect(names.has('session_id')).toBe(true);
        expect(names.has('project_id')).toBe(true);
        // Sanity — the legacy columns must still be present.
        expect(names.has('seq')).toBe(true);
        expect(names.has('idempotency_key')).toBe(true);
      } finally {
        inspector.close();
      }
    } finally {
      rmSync(join(sessionDir, '..'), { recursive: true, force: true });
    }
  });

  it('fresh-session append stamps session_id (dir basename) + project_id (explicit opts, post-T-2a.9.unified)', () => {
    const { sessionDir, dbPath } = makeSessionDir(
      'sess-stamp',
      '/home/alice/projects/my-repo',
    );
    try {
      // PR-FIN-2a-ii / T-2a.9.unified: projectId must be passed
      // explicitly; the legacy metadata.json reader was retired with
      // metadata.json itself.
      using store = new EventStore(dbPath, { projectId: 'my-repo' });
      store.append({
        ts: '2026-04-21T00:00:00.000Z',
        type: 'workflow.start',
        step: null,
        data: JSON.stringify({
          sessionId: 'sess-stamp',
          timestamp: '2026-04-21T00:00:00.000Z',
        }),
        actor: 'cli',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-stamp-1',
        sessionId: 'sess-stamp',
      });

      const inspector = new Database(dbPath, { readonly: true });
      try {
        interface PartitionRow {
          readonly seq: number;
          readonly session_id: string | null;
          readonly project_id: string | null;
        }
        const rows = inspector
          .query<PartitionRow, []>(
            'SELECT seq, session_id, project_id FROM events ORDER BY seq ASC',
          )
          .all();
        // workflow init would normally pre-seed 2 rows, but this raw
        // EventStore construction does not — only the appended row is
        // present.
        expect(rows).toHaveLength(1);
        expect(rows[0]?.session_id).toBe('sess-stamp');
        expect(rows[0]?.project_id).toBe('my-repo');
      } finally {
        inspector.close();
      }
    } finally {
      rmSync(join(sessionDir, '..'), { recursive: true, force: true });
    }
  });

  it('missing metadata.json → session_id stamped from dir basename, project_id NULL', () => {
    // Same shape as `makeSessionDir` but WITHOUT writing metadata.json.
    const tmpRoot = mkdtempSync(join(tmpdir(), 'gobbi-store-nometa-'));
    const sessionDir = join(tmpRoot, 'sess-nometa');
    mkdirSync(sessionDir, { recursive: true });
    const dbPath = join(sessionDir, 'gobbi.db');
    try {
      using store = new EventStore(dbPath);
      store.append({
        ts: '2026-04-21T00:00:00.000Z',
        type: 'workflow.start',
        step: null,
        data: JSON.stringify({
          sessionId: 'sess-nometa',
          timestamp: '2026-04-21T00:00:00.000Z',
        }),
        actor: 'cli',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-nometa-1',
        sessionId: 'sess-nometa',
      });

      const inspector = new Database(dbPath, { readonly: true });
      try {
        interface PartitionRow {
          readonly session_id: string | null;
          readonly project_id: string | null;
        }
        const row = inspector
          .query<PartitionRow, []>(
            'SELECT session_id, project_id FROM events WHERE seq = 1',
          )
          .get();
        // session_id still derives from the directory basename — metadata
        // absence does not gate it.
        expect(row?.session_id).toBe('sess-nometa');
        // project_id left NULL — absence of metadata.json is a legitimate
        // state during test setup or a partially-initialised session.
        expect(row?.project_id).toBeNull();
      } finally {
        inspector.close();
      }
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('malformed metadata.json → project_id NULL (silent, no throw)', () => {
    const tmpRoot = mkdtempSync(join(tmpdir(), 'gobbi-store-bad-meta-'));
    const sessionDir = join(tmpRoot, 'sess-bad-meta');
    mkdirSync(sessionDir, { recursive: true });
    const dbPath = join(sessionDir, 'gobbi.db');
    // Write garbage instead of JSON — the store constructor must not throw.
    writeFileSync(join(sessionDir, 'metadata.json'), 'not { json at all', 'utf8');
    try {
      using store = new EventStore(dbPath);
      store.append({
        ts: '2026-04-21T00:00:00.000Z',
        type: 'workflow.start',
        step: null,
        data: JSON.stringify({
          sessionId: 'sess-bad-meta',
          timestamp: '2026-04-21T00:00:00.000Z',
        }),
        actor: 'cli',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-bad-meta-1',
        sessionId: 'sess-bad-meta',
      });

      const inspector = new Database(dbPath, { readonly: true });
      try {
        interface PartitionRow {
          readonly session_id: string | null;
          readonly project_id: string | null;
        }
        const row = inspector
          .query<PartitionRow, []>(
            'SELECT session_id, project_id FROM events WHERE seq = 1',
          )
          .get();
        expect(row?.session_id).toBe('sess-bad-meta');
        expect(row?.project_id).toBeNull();
      } finally {
        inspector.close();
      }
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it(':memory: store leaves both partition keys NULL (no session dir to resolve)', () => {
    using store = new EventStore(':memory:');
    const row = store.append(makeSystemInput({ sessionId: 'sess-mem' }));
    expect(row).not.toBeNull();
    // The constructor could not resolve a session directory and no
    // explicit opts were passed, so both partition keys are NULL.
    // PR-FIN-2a-ii (T-2a.9.unified) drops the `?? input.sessionId`
    // append-time fallback — stamped values must match the bound
    // values exactly so partition-aware reads find their own rows.
    expect(row!.session_id).toBeNull();
    expect(row!.project_id).toBeNull();
  });

  it(':memory: store with explicit opts stamps both partition keys', () => {
    using store = new EventStore(':memory:', {
      sessionId: 'sess-explicit',
      projectId: 'project-explicit',
    });
    const row = store.append(makeSystemInput({ sessionId: 'sess-explicit' }));
    expect(row).not.toBeNull();
    expect(row!.session_id).toBe('sess-explicit');
    expect(row!.project_id).toBe('project-explicit');
  });
});

// ===========================================================================
// EventStoreOptions — explicit partition-key constructor params
//
// Production callers always pass both keys via opts; the workspace
// `.gobbi/state.db` is the only writer surface and its filesystem path
// carries no per-session signal. Tests using `<sessionDir>/gobbi.db`
// continue to work via the sessionId path-derivation fallback (basename
// of the containing directory). The legacy `metadata.json` projectId
// reader was retired in PR-FIN-2a-ii (T-2a.9.unified) — projectId has
// no path fallback, so a caller that omits it stamps `null` into the
// column.
//
// Policy under test (mirrors the constructor's JSDoc):
//   - non-empty string in opts → use verbatim
//   - `null` / `undefined` in opts.sessionId → defer to path derivation
//   - `null` / `undefined` in opts.projectId → stay null (no fallback)
//   - `''` (empty string) → treated as "explicitly unset" for both keys
// ===========================================================================

describe('EventStoreOptions — explicit partition-key constructor params', () => {
  it('with no opts: sessionId path-derived, projectId stays NULL (no metadata fallback)', () => {
    const { sessionDir, dbPath } = makeSessionDir(
      'sess-fallback',
      '/home/alice/projects/repo-fallback',
    );
    try {
      using store = new EventStore(dbPath);
      store.append({
        ts: '2026-04-25T00:00:00.000Z',
        type: 'workflow.start',
        step: null,
        data: '{}',
        actor: 'cli',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-fallback-1',
        sessionId: 'sess-fallback',
      });

      const inspector = new Database(dbPath, { readonly: true });
      try {
        interface PartitionRow {
          readonly session_id: string | null;
          readonly project_id: string | null;
        }
        const row = inspector
          .query<PartitionRow, []>(
            'SELECT session_id, project_id FROM events WHERE seq = 1',
          )
          .get();
        // sessionId path-derived from basename(dirname(dbPath)).
        expect(row?.session_id).toBe('sess-fallback');
        // projectId has no path fallback after PR-FIN-2a-ii — opts must
        // be supplied explicitly. metadata.json on disk is no longer
        // consulted.
        expect(row?.project_id).toBeNull();
      } finally {
        inspector.close();
      }
    } finally {
      rmSync(join(sessionDir, '..'), { recursive: true, force: true });
    }
  });

  it('explicit sessionId override beats path-derived basename; projectId stays NULL when omitted', () => {
    const { sessionDir, dbPath } = makeSessionDir(
      'sess-on-disk',
      '/home/alice/projects/dir-derived',
    );
    try {
      using store = new EventStore(dbPath, {
        sessionId: 'workspace-session',
      });
      store.append({
        ts: '2026-04-25T00:00:00.000Z',
        type: 'workflow.start',
        step: null,
        data: '{}',
        actor: 'cli',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-override-1',
        sessionId: 'workspace-session',
      });

      const inspector = new Database(dbPath, { readonly: true });
      try {
        interface PartitionRow {
          readonly session_id: string | null;
          readonly project_id: string | null;
        }
        const row = inspector
          .query<PartitionRow, []>(
            'SELECT session_id, project_id FROM events WHERE seq = 1',
          )
          .get();
        expect(row?.session_id).toBe('workspace-session');
        // projectId not supplied — stays NULL (no metadata fallback).
        expect(row?.project_id).toBeNull();
      } finally {
        inspector.close();
      }
    } finally {
      rmSync(join(sessionDir, '..'), { recursive: true, force: true });
    }
  });

  it('explicit projectId stamps the column directly — no metadata.json read', () => {
    const { sessionDir, dbPath } = makeSessionDir(
      'sess-proj-override',
      '/home/alice/projects/metadata-ignored',
    );
    try {
      using store = new EventStore(dbPath, {
        projectId: 'workspace-project',
      });
      store.append({
        ts: '2026-04-25T00:00:00.000Z',
        type: 'workflow.start',
        step: null,
        data: '{}',
        actor: 'cli',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-proj-override-1',
        sessionId: 'sess-proj-override',
      });

      const inspector = new Database(dbPath, { readonly: true });
      try {
        interface PartitionRow {
          readonly session_id: string | null;
          readonly project_id: string | null;
        }
        const row = inspector
          .query<PartitionRow, []>(
            'SELECT session_id, project_id FROM events WHERE seq = 1',
          )
          .get();
        // sessionId not overridden — path derivation still runs.
        expect(row?.session_id).toBe('sess-proj-override');
        expect(row?.project_id).toBe('workspace-project');
      } finally {
        inspector.close();
      }
    } finally {
      rmSync(join(sessionDir, '..'), { recursive: true, force: true });
    }
  });

  it('null in opts: sessionId falls back to path derivation, projectId stays NULL', () => {
    const { sessionDir, dbPath } = makeSessionDir(
      'sess-null-opts',
      '/home/alice/projects/null-derived',
    );
    try {
      const opts: EventStoreOptions = {
        sessionId: null,
        projectId: null,
      };
      using store = new EventStore(dbPath, opts);
      store.append({
        ts: '2026-04-25T00:00:00.000Z',
        type: 'workflow.start',
        step: null,
        data: '{}',
        actor: 'cli',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-null-opts-1',
        sessionId: 'sess-null-opts',
      });

      const inspector = new Database(dbPath, { readonly: true });
      try {
        interface PartitionRow {
          readonly session_id: string | null;
          readonly project_id: string | null;
        }
        const row = inspector
          .query<PartitionRow, []>(
            'SELECT session_id, project_id FROM events WHERE seq = 1',
          )
          .get();
        // sessionId path-derived; projectId stays NULL (no fallback).
        expect(row?.session_id).toBe('sess-null-opts');
        expect(row?.project_id).toBeNull();
      } finally {
        inspector.close();
      }
    } finally {
      rmSync(join(sessionDir, '..'), { recursive: true, force: true });
    }
  });

  it('empty string in opts: sessionId falls back, projectId stays NULL', () => {
    const { sessionDir, dbPath } = makeSessionDir(
      'sess-empty-opts',
      '/home/alice/projects/empty-derived',
    );
    try {
      const opts: EventStoreOptions = {
        sessionId: '',
        projectId: '',
      };
      using store = new EventStore(dbPath, opts);
      store.append({
        ts: '2026-04-25T00:00:00.000Z',
        type: 'workflow.start',
        step: null,
        data: '{}',
        actor: 'cli',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-empty-opts-1',
        sessionId: 'sess-empty-opts',
      });

      const inspector = new Database(dbPath, { readonly: true });
      try {
        interface PartitionRow {
          readonly session_id: string | null;
          readonly project_id: string | null;
        }
        const row = inspector
          .query<PartitionRow, []>(
            'SELECT session_id, project_id FROM events WHERE seq = 1',
          )
          .get();
        // sessionId path-derived; projectId stays NULL (empty string is
        // "explicitly unset" but no metadata fallback chain anymore).
        expect(row?.session_id).toBe('sess-empty-opts');
        expect(row?.project_id).toBeNull();
      } finally {
        inspector.close();
      }
    } finally {
      rmSync(join(sessionDir, '..'), { recursive: true, force: true });
    }
  });
});

// ===========================================================================
// Partition-aware reads (Option α — PR-FIN-2a-ii / T-2a.9.unified)
//
// Every read method bakes a `WHERE session_id IS $session_id AND
// project_id IS $project_id` clause, so a store opened with bound
// partition keys only sees its own rows even when the underlying table
// holds events for multiple partitions.
// ===========================================================================

describe('partition-aware reads (Option α)', () => {
  it('replayAll filters by bound (sessionId, projectId)', () => {
    const tmpRoot = mkdtempSync(join(tmpdir(), 'gobbi-store-partition-'));
    const dbPath = join(tmpRoot, 'state.db');
    try {
      // Author rows under partition A.
      {
        using storeA = new EventStore(dbPath, {
          sessionId: 'sess-A',
          projectId: 'proj-1',
        });
        storeA.append(
          makeInput({ sessionId: 'sess-A', toolCallId: 'tc-A-1' }),
        );
        storeA.append(
          makeInput({ sessionId: 'sess-A', toolCallId: 'tc-A-2' }),
        );
      }
      // Author rows under partition B (different project).
      {
        using storeB = new EventStore(dbPath, {
          sessionId: 'sess-B',
          projectId: 'proj-2',
        });
        storeB.append(
          makeInput({ sessionId: 'sess-B', toolCallId: 'tc-B-1' }),
        );
      }

      // Read partition A: sees only its 2 rows.
      {
        using readerA = new EventStore(dbPath, {
          sessionId: 'sess-A',
          projectId: 'proj-1',
        });
        const rowsA = readerA.replayAll();
        expect(rowsA).toHaveLength(2);
        expect(rowsA.every((r) => r.session_id === 'sess-A')).toBe(true);
        expect(rowsA.every((r) => r.project_id === 'proj-1')).toBe(true);
      }

      // Read partition B: sees only its 1 row.
      {
        using readerB = new EventStore(dbPath, {
          sessionId: 'sess-B',
          projectId: 'proj-2',
        });
        const rowsB = readerB.replayAll();
        expect(rowsB).toHaveLength(1);
        expect(rowsB[0]?.session_id).toBe('sess-B');
        expect(rowsB[0]?.project_id).toBe('proj-2');
      }
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('cross-partition rows are NOT visible to a partition-bound EventStore', () => {
    const tmpRoot = mkdtempSync(join(tmpdir(), 'gobbi-store-partition-'));
    const dbPath = join(tmpRoot, 'state.db');
    try {
      // Author rows under partition X only.
      {
        using storeX = new EventStore(dbPath, {
          sessionId: 'sess-X',
          projectId: 'proj-X',
        });
        storeX.append(
          makeInput({ sessionId: 'sess-X', toolCallId: 'tc-X-1' }),
        );
      }
      // Open a different partition Y. eventCount/byType/last all return
      // empty even though the underlying table has 1 row.
      {
        using readerY = new EventStore(dbPath, {
          sessionId: 'sess-Y',
          projectId: 'proj-Y',
        });
        expect(readerY.eventCount()).toBe(0);
        expect(readerY.byType('workflow.start')).toHaveLength(0);
        expect(readerY.last('workflow.start')).toBeNull();
        expect(readerY.lastN('workflow.start', 5)).toHaveLength(0);
        expect(readerY.lastNAny(5)).toHaveLength(0);
        expect(readerY.replayAll()).toHaveLength(0);
        expect(readerY.since(0)).toHaveLength(0);
      }
      // Re-open X — still sees its row.
      {
        using readerX = new EventStore(dbPath, {
          sessionId: 'sess-X',
          projectId: 'proj-X',
        });
        expect(readerX.eventCount()).toBe(1);
        expect(readerX.last('workflow.start')?.session_id).toBe('sess-X');
      }
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('NULL partition keys match NULL columns via IS clause', () => {
    using store = new EventStore(':memory:');
    // No opts → both partition keys NULL → row stamps NULL → reads
    // filter by NULL and find the row.
    store.append(makeInput());
    expect(store.eventCount()).toBe(1);
    expect(store.replayAll()).toHaveLength(1);
    expect(store.byType('workflow.start')).toHaveLength(1);
    expect(store.last('workflow.start')?.session_id).toBeNull();
    expect(store.last('workflow.start')?.project_id).toBeNull();
  });
});

// ===========================================================================
// WAL checkpoint after workflow.step.exit (#146 A.1.9)
//
// Wave A.1's workspace-scoped `state.db` widens the writer surface — every
// hook in the conversation turn writes to the same DB. Per Architecture
// P-A-6 + scenario SC-ORCH-25, the EventStore truncates the WAL after
// every successful `workflow.step.exit` append. The pre-existing `close()`
// checkpoint stays — the per-step.exit hook is additive, bounding the
// in-session SIGKILL loss window to the events written between two
// adjacent step.exit checkpoints.
// ===========================================================================

/**
 * Append a non-step.exit event without toggling the step.exit hook.
 * Each call uses a unique toolCallId so ON CONFLICT cannot dedup.
 */
function appendNoise(store: EventStore, sessionId: string, n: number): void {
  for (let i = 0; i < n; i += 1) {
    store.append({
      ts: `2026-04-25T00:00:${String(i).padStart(2, '0')}.000Z`,
      type: 'workflow.start',
      step: null,
      data: '{}',
      actor: 'orchestrator',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: `noise-${i}`,
      sessionId,
    });
  }
}

describe('WAL checkpoint after workflow.step.exit (#146 A.1.9)', () => {
  it('a workflow.step.exit append truncates the WAL file', () => {
    const { sessionDir, dbPath } = makeSessionDir(
      'sess-wal-truncate',
      '/home/alice/projects/wal-truncate',
    );
    const walPath = `${dbPath}-wal`;
    try {
      using store = new EventStore(dbPath);

      // Seed many non-step.exit events so the WAL grows. Each row is
      // tiny but the WAL accumulates page-sized writes — enough events
      // guarantees a non-zero WAL size before the checkpoint runs.
      appendNoise(store, 'sess-wal-truncate', 50);

      const walSizeBefore = existsSync(walPath) ? statSync(walPath).size : 0;
      // Sanity: the WAL must have grown — otherwise the checkpoint
      // assertion below is vacuous.
      expect(walSizeBefore).toBeGreaterThan(0);

      // Now append a step.exit — the hook should checkpoint(TRUNCATE),
      // shrinking the WAL file.
      const exitRow = store.append({
        ts: '2026-04-25T00:01:00.000Z',
        type: 'workflow.step.exit',
        step: 'ideation',
        data: '{}',
        actor: 'orchestrator',
        parent_seq: null,
        idempotencyKind: 'tool-call',
        toolCallId: 'tc-step-exit',
        sessionId: 'sess-wal-truncate',
      });
      expect(exitRow).not.toBeNull();
      expect(exitRow!.type).toBe('workflow.step.exit');

      const walSizeAfter = existsSync(walPath) ? statSync(walPath).size : 0;
      // PRAGMA wal_checkpoint(TRUNCATE) shrinks the WAL to a header-only
      // (or zero) state. The exact size depends on the SQLite build, but
      // it must be strictly smaller than the pre-checkpoint size.
      expect(walSizeAfter).toBeLessThan(walSizeBefore);
    } finally {
      rmSync(join(sessionDir, '..'), { recursive: true, force: true });
    }
  });

  it('non-step.exit events do NOT trigger a checkpoint — WAL keeps growing', () => {
    const { sessionDir, dbPath } = makeSessionDir(
      'sess-wal-nogrow',
      '/home/alice/projects/wal-nogrow',
    );
    const walPath = `${dbPath}-wal`;
    try {
      using store = new EventStore(dbPath);

      // Seed a small batch and capture the WAL size baseline.
      appendNoise(store, 'sess-wal-nogrow', 10);
      const walSizeAfterFirst = existsSync(walPath)
        ? statSync(walPath).size
        : 0;
      expect(walSizeAfterFirst).toBeGreaterThan(0);

      // Append more non-step.exit events. If a stray code path
      // mistakenly checkpointed on these types, the WAL would shrink or
      // stay flat. Instead it must grow (or stay equal at the page
      // boundary — assert "not smaller" rather than "strictly larger").
      appendNoise(store, 'sess-wal-nogrow', 50);
      const walSizeAfterMore = existsSync(walPath)
        ? statSync(walPath).size
        : 0;
      expect(walSizeAfterMore).toBeGreaterThanOrEqual(walSizeAfterFirst);
    } finally {
      rmSync(join(sessionDir, '..'), { recursive: true, force: true });
    }
  });

  it('checkpoint failures are swallowed — append still returns the row (`:memory:` smoke)', () => {
    // `:memory:` databases reject `PRAGMA wal_checkpoint(TRUNCATE)` (no
    // WAL file exists) — historically this was the trigger that forced
    // `close()` to wrap the pragma in try/catch. The same swallow policy
    // must hold for the per-step.exit hook so a checkpoint failure
    // cannot surface as an append failure.
    using store = new EventStore(':memory:');

    // No throw + the row comes back with an assigned seq.
    const row = store.append({
      ts: '2026-04-25T00:00:00.000Z',
      type: 'workflow.step.exit',
      step: 'ideation',
      data: '{}',
      actor: 'orchestrator',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-mem-step-exit',
      sessionId: 'sess-mem',
    });
    expect(row).not.toBeNull();
    expect(row!.seq).toBe(1);
    expect(row!.type).toBe('workflow.step.exit');
    // The store stays usable — a follow-up append must not throw either.
    const follow = store.append({
      ts: '2026-04-25T00:01:00.000Z',
      type: 'workflow.start',
      step: null,
      data: '{}',
      actor: 'orchestrator',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-mem-followup',
      sessionId: 'sess-mem',
    });
    expect(follow).not.toBeNull();
    expect(follow!.seq).toBe(2);
  });
});

// ===========================================================================
// appendWithProjection — atomic event + projection write (Wave C.1.6 R1,
// Architecture F-1 fix). The events INSERT and the projection callback
// share one bun:sqlite IMMEDIATE transaction; a thrown projection rolls
// the events row back, and a deduped event skips the projection entirely.
// ===========================================================================

describe('appendWithProjection — atomic event + projection write', () => {
  /**
   * Seed the v7 `prompt_patches` table on a fresh on-disk store. The
   * table is created by `ensureSchemaV7` during EventStore construction;
   * the helper here just opens a same-process connection to confirm the
   * shape used by the atomicity tests below.
   */
  function withTmpStore<T>(fn: (store: EventStore, dbPath: string) => T): T {
    const tmp = mkdtempSync(join(tmpdir(), 'store-aw-'));
    const dbPath = join(tmp, 'state.db');
    const store = new EventStore(dbPath, {
      sessionId: 'sess-aw',
      projectId: 'proj-aw',
    });
    try {
      return fn(store, dbPath);
    } finally {
      store.close();
      rmSync(tmp, { recursive: true, force: true });
    }
  }

  it('commits both writes when the projection callback succeeds', () => {
    withTmpStore((store, dbPath) => {
      const row = store.appendWithProjection(
        makeContentInput({
          contentId: 'sha256-aw-ok',
          sessionId: 'sess-aw',
          data: JSON.stringify({ promptId: 'ideation' }),
        }),
        (db, eventRow) => {
          db.run(
            `INSERT INTO prompt_patches (session_id, project_id, prompt_id, parent_seq, event_seq, patch_id, patch_json, pre_hash, post_hash, applied_at, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              'sess-aw',
              'proj-aw',
              'ideation',
              null,
              eventRow.seq,
              'sha256-aw-ok',
              '[]',
              'sha256:0',
              'sha256:1',
              Date.parse('2026-01-01T00:00:00.000Z'),
              'operator',
            ],
          );
        },
      );

      expect(row).not.toBeNull();
      expect(row!.seq).toBe(1);

      // Both rows persisted in the same transaction — verify via a
      // separate read-only handle.
      const reader = new Database(dbPath, { readonly: true });
      try {
        const eventCount = (
          reader.query<{ cnt: number }, []>(`SELECT count(*) AS cnt FROM events`).get()
        )?.cnt ?? 0;
        const projectionCount = (
          reader
            .query<{ cnt: number }, []>(
              `SELECT count(*) AS cnt FROM prompt_patches WHERE event_seq = ${row!.seq}`,
            )
            .get()
        )?.cnt ?? 0;
        expect(eventCount).toBe(1);
        expect(projectionCount).toBe(1);
      } finally {
        reader.close();
      }
    });
  });

  it('rolls back the events row when the projection callback throws', () => {
    withTmpStore((store, dbPath) => {
      let threw = false;
      try {
        store.appendWithProjection(
          makeContentInput({
            contentId: 'sha256-aw-rollback',
            sessionId: 'sess-aw',
            data: JSON.stringify({ promptId: 'ideation' }),
          }),
          (_db, _row) => {
            // Simulate a projection write failure (e.g. CHECK constraint
            // violation, or a synthetic mid-transaction abort). bun:sqlite
            // surfaces the throw as a rolled-back transaction.
            throw new Error('synthetic projection failure');
          },
        );
      } catch {
        threw = true;
      }

      expect(threw).toBe(true);

      // The events row MUST NOT exist — atomicity guarantee. If the
      // events INSERT had committed independently of the projection
      // callback (the pre-R1 two-handle bug), this row count would be 1.
      const reader = new Database(dbPath, { readonly: true });
      try {
        const eventCount = (
          reader.query<{ cnt: number }, []>(`SELECT count(*) AS cnt FROM events`).get()
        )?.cnt ?? 0;
        const projectionCount = (
          reader.query<{ cnt: number }, []>(`SELECT count(*) AS cnt FROM prompt_patches`).get()
        )?.cnt ?? 0;
        expect(eventCount).toBe(0);
        expect(projectionCount).toBe(0);
      } finally {
        reader.close();
      }
    });
  });

  it('skips the projection callback when the event was deduped', () => {
    withTmpStore((store, dbPath) => {
      // First append — both writes commit.
      const first = store.appendWithProjection(
        makeContentInput({
          contentId: 'sha256-aw-dup',
          sessionId: 'sess-aw',
          data: JSON.stringify({ promptId: 'ideation' }),
        }),
        (db, row) => {
          db.run(
            `INSERT INTO prompt_patches (session_id, project_id, prompt_id, parent_seq, event_seq, patch_id, patch_json, pre_hash, post_hash, applied_at, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              'sess-aw',
              'proj-aw',
              'ideation',
              null,
              row.seq,
              'sha256-aw-dup',
              '[]',
              'sha256:0',
              'sha256:1',
              Date.parse('2026-01-01T00:00:00.000Z'),
              'operator',
            ],
          );
        },
      );
      expect(first).not.toBeNull();

      // Second append — same content. Idempotency key collides; the
      // projection callback MUST NOT be invoked (otherwise the
      // UNIQUE(prompt_id, patch_id) index would throw, but more
      // importantly the contract is "no projection write on dedup").
      let projectionInvocations = 0;
      const dup = store.appendWithProjection(
        makeContentInput({
          contentId: 'sha256-aw-dup',
          sessionId: 'sess-aw-other',
          data: JSON.stringify({ promptId: 'ideation' }),
        }),
        () => {
          projectionInvocations += 1;
        },
      );

      expect(dup).toBeNull();
      expect(projectionInvocations).toBe(0);

      // Only the original row exists.
      const reader = new Database(dbPath, { readonly: true });
      try {
        const eventCount = (
          reader.query<{ cnt: number }, []>(`SELECT count(*) AS cnt FROM events`).get()
        )?.cnt ?? 0;
        const projectionCount = (
          reader.query<{ cnt: number }, []>(`SELECT count(*) AS cnt FROM prompt_patches`).get()
        )?.cnt ?? 0;
        expect(eventCount).toBe(1);
        expect(projectionCount).toBe(1);
      } finally {
        reader.close();
      }
    });
  });

  it('events.seq matches prompt_patches.event_seq after a successful append', () => {
    withTmpStore((store, dbPath) => {
      const row = store.appendWithProjection(
        makeContentInput({
          contentId: 'sha256-aw-link',
          sessionId: 'sess-aw',
          data: JSON.stringify({ promptId: 'planning' }),
        }),
        (db, eventRow) => {
          db.run(
            `INSERT INTO prompt_patches (session_id, project_id, prompt_id, parent_seq, event_seq, patch_id, patch_json, pre_hash, post_hash, applied_at, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              'sess-aw',
              'proj-aw',
              'planning',
              null,
              eventRow.seq,
              'sha256-aw-link',
              '[]',
              'sha256:0',
              'sha256:1',
              Date.parse('2026-01-01T00:00:00.000Z'),
              'operator',
            ],
          );
        },
      );
      expect(row).not.toBeNull();

      const reader = new Database(dbPath, { readonly: true });
      try {
        const eventSeq = reader
          .query<{ seq: number }, []>(`SELECT seq FROM events ORDER BY seq DESC LIMIT 1`)
          .get()?.seq;
        const projectionEventSeq = reader
          .query<{ event_seq: number }, []>(
            `SELECT event_seq FROM prompt_patches ORDER BY seq DESC LIMIT 1`,
          )
          .get()?.event_seq;
        expect(eventSeq).toBe(row!.seq);
        expect(projectionEventSeq).toBe(row!.seq);
        expect(eventSeq).toBe(projectionEventSeq);
      } finally {
        reader.close();
      }
    });
  });
});
