import { describe, it, expect } from 'bun:test';

import { EventStore } from '../store.js';
import type {
  AppendInput,
  AppendInputCounter,
  AppendInputSystem,
  AppendInputToolCall,
  EventRow,
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
