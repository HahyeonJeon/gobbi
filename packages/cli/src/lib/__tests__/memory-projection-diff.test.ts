/**
 * Tests for `lib/memory-projection-diff.ts` — the pure divergence
 * detector consumed by PR-CFM-C's `verify-state-projections` command
 * and (later) PR-B's `gobbi memory check`.
 *
 * Test surface (8) per PR-CFM-C ideation §4.5:
 *
 *   1. Empty divergences when memory matches events.
 *   2. `row-missing` when start+finish events exist but no project.json row.
 *   3. `finishedAt` when finish event committed but row finishedAt is null.
 *   4. `task` when row task differs from workflow.start payload task.
 *   5. `memory: null` treated as empty sessions[] (no crash).
 *   6. `reduceFn` throwing surfaces `events.replay_threw` divergence.
 *   7. `events.empty` info-level divergence when project.json row exists
 *      with no event rows.
 *   8. Mid-flight session yields zero divergences.
 *
 * Fixture shape mirrors `lib/__tests__/json-memory.test.ts`'s
 * `FakeReadStore` (lines 84-122) — a pure in-memory `ReadStore` impl is
 * the simplest way to fixture an event stream without driving the full
 * `EventStore` partition surface or a session-by-session SQLite open.
 */

import { describe, expect, test } from 'bun:test';

import { memoryProjectionDiff } from '../memory-projection-diff.js';
import type {
  MemoryDivergence,
  MemoryProjectionDiffResult,
} from '../memory-projection-diff.js';
import type { ProjectJson, ProjectJsonSession } from '../json-memory.js';
import { reduce } from '../../workflow/reducer.js';
import type { ReadStore, CostAggregateRow } from '../../workflow/store.js';
import type { ReduceFn, ReducerResult } from '../../workflow/types.js';
import type { EventRow } from '../../workflow/migrations.js';

// ---------------------------------------------------------------------------
// FakeReadStore — multi-session in-memory event store. Mirrors the helper
// in `json-memory.test.ts` (the production EventStore is partition-bound
// to one session per open, so a multi-session diff needs a fake).
// ---------------------------------------------------------------------------

class FakeReadStore implements ReadStore {
  private readonly rows: readonly EventRow[];

  constructor(rows: readonly EventRow[]) {
    this.rows = rows;
  }

  replayAll(): EventRow[] {
    return [...this.rows];
  }
  byType(type: string): EventRow[] {
    return this.rows.filter((r) => r.type === type);
  }
  byStep(step: string, type?: string): EventRow[] {
    return this.rows.filter(
      (r) => r.step === step && (type === undefined || r.type === type),
    );
  }
  since(seq: number): EventRow[] {
    return this.rows.filter((r) => r.seq > seq);
  }
  last(type: string): EventRow | null {
    const filtered = this.rows.filter((r) => r.type === type);
    return filtered.length === 0 ? null : (filtered[filtered.length - 1] ?? null);
  }
  lastN(type: string, n: number): readonly EventRow[] {
    const filtered = this.rows.filter((r) => r.type === type);
    return filtered.slice(-n);
  }
  lastNAny(n: number): readonly EventRow[] {
    return this.rows.slice(-n);
  }
  eventCount(): number {
    return this.rows.length;
  }
  aggregateDelegationCosts(): readonly CostAggregateRow[] {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Row + project.json fixture factories
// ---------------------------------------------------------------------------

let rowCounter = 0;
function nextSeq(): number {
  rowCounter += 1;
  return rowCounter;
}

interface MakeRowArgs {
  readonly type: string;
  readonly sessionId: string;
  readonly ts?: string;
  readonly step?: string | null;
  readonly data?: Record<string, unknown>;
}

function makeRow(args: MakeRowArgs): EventRow {
  const seq = nextSeq();
  return {
    seq,
    ts: args.ts ?? '2026-04-29T10:00:00.000Z',
    schema_version: 7,
    type: args.type,
    step: args.step ?? null,
    data: JSON.stringify(args.data ?? { sessionId: args.sessionId, timestamp: args.ts ?? '2026-04-29T10:00:00.000Z' }),
    actor: 'orchestrator',
    parent_seq: null,
    idempotency_key: `key-${seq}-${args.sessionId}`,
    session_id: args.sessionId,
    project_id: 'gobbi',
  };
}

/**
 * Build the full event stream that drives a session from `idle` through
 * every productive step to `done`, using event types and step values that
 * the production reducer accepts. Each STEP_EXIT carries the `step` field
 * the reducer requires (`event.data.step` must match `state.currentStep`).
 *
 * Sequence (eval gates default to disabled because `evalConfig` stays
 * `null` — no `workflow.eval.decide` event in this stream — and the
 * `evalIdeationDisabled` / `evalPlanningDisabled` / `evalMemorizationDisabled`
 * predicates short-circuit `null?.x !== true` to `true`):
 *
 *   idle → ideation                    via workflow.start
 *   ideation → planning                via step.exit (eval disabled)
 *   planning → execution               via step.exit (eval disabled)
 *   execution → execution_eval         via step.exit (always — no condition)
 *   execution_eval → memorization      via decision.eval.verdict (verdict='pass')
 *   memorization → handoff             via step.exit (eval disabled)
 *   handoff → done                     via workflow.finish
 */
function buildDoneStream(sessionId: string): readonly EventRow[] {
  return [
    makeRow({ type: 'workflow.start', sessionId }),
    makeRow({ type: 'workflow.step.exit', sessionId, step: 'ideation', data: { step: 'ideation' } }),
    makeRow({ type: 'workflow.step.exit', sessionId, step: 'planning', data: { step: 'planning' } }),
    makeRow({ type: 'workflow.step.exit', sessionId, step: 'execution', data: { step: 'execution' } }),
    makeRow({ type: 'decision.eval.verdict', sessionId, step: 'execution_eval', data: { verdict: 'pass' } }),
    makeRow({ type: 'workflow.step.exit', sessionId, step: 'memorization', data: { step: 'memorization' } }),
    makeRow({ type: 'workflow.finish', sessionId, ts: '2026-04-29T11:00:00.000Z', data: {} }),
  ];
}

function makeProjectJson(sessions: readonly ProjectJsonSession[]): ProjectJson {
  return {
    schemaVersion: 1,
    projectName: 'gobbi',
    projectId: 'gobbi',
    sessions,
    gotchas: [],
    decisions: [],
    learnings: [],
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('memoryProjectionDiff', () => {
  test('1 — empty divergences when memory matches events (happy path)', () => {
    const sessionId = 'sess-happy';
    const rows = buildDoneStream(sessionId);
    const store = new FakeReadStore(rows);
    const memory = makeProjectJson([
      {
        sessionId,
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: '2026-04-29T11:00:00.000Z',
        task: 'demo',
      },
    ]);

    const result: MemoryProjectionDiffResult = memoryProjectionDiff({
      store,
      memory,
      reduceFn: reduce,
    });

    expect(result.divergences).toEqual([]);
    expect(result.sessionsChecked).toBe(1);
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
  });

  test('2 — row-missing when start+finish events exist but no project.json row', () => {
    const sessionId = 'sess-orphan';
    const store = new FakeReadStore(buildDoneStream(sessionId));
    const memory = makeProjectJson([]); // empty sessions[]

    const result = memoryProjectionDiff({ store, memory, reduceFn: reduce });

    expect(result.divergences).toHaveLength(1);
    const div = result.divergences[0] as MemoryDivergence;
    expect(div.sessionId).toBe(sessionId);
    expect(div.field).toBe('row-missing');
    expect(div.fromMemory).toBeNull();
    // fromEvents carries a workflow.finish witness when the finish event
    // is on the stream — guard against silent regression.
    expect(div.fromEvents).toContain('workflow.finish');
  });

  test('3 — finishedAt divergence when finish event committed but row finishedAt is null', () => {
    const sessionId = 'sess-finish-null';
    const store = new FakeReadStore(buildDoneStream(sessionId));
    const memory = makeProjectJson([
      {
        sessionId,
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: null, // ← the divergence
        task: 'demo',
      },
    ]);

    const result = memoryProjectionDiff({ store, memory, reduceFn: reduce });

    expect(result.divergences).toHaveLength(1);
    const div = result.divergences[0] as MemoryDivergence;
    expect(div.field).toBe('finishedAt');
    expect(div.sessionId).toBe(sessionId);
    expect(div.fromEvents).toContain('workflow.finish');
    expect(div.fromMemory).toBeNull();
  });

  test('4 — task divergence when row task differs from workflow.start payload task', () => {
    const sessionId = 'sess-task-drift';
    // Override the start row to embed a `task` field in its payload —
    // the wire-format does not declare `task` today, but the diff logic
    // surfaces drift when a fixture (or a future emitter) does carry one.
    const baseRows = buildDoneStream(sessionId);
    const rows: readonly EventRow[] = baseRows.map((row) =>
      row.type === 'workflow.start'
        ? {
            ...row,
            data: JSON.stringify({
              sessionId,
              timestamp: row.ts,
              task: 'event-side task',
            }),
          }
        : row,
    );
    const store = new FakeReadStore(rows);
    const memory = makeProjectJson([
      {
        sessionId,
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: '2026-04-29T11:00:00.000Z',
        task: 'memory-side task', // ← differs
      },
    ]);

    const result = memoryProjectionDiff({ store, memory, reduceFn: reduce });

    const taskDivs = result.divergences.filter((d) => d.field === 'task');
    expect(taskDivs).toHaveLength(1);
    const div = taskDivs[0] as MemoryDivergence;
    expect(div.fromEvents).toBe('event-side task');
    expect(div.fromMemory).toBe('memory-side task');
  });

  test('5 — memory: null treated as empty sessions[] (no crash)', () => {
    const sessionId = 'sess-no-memory';
    const store = new FakeReadStore(buildDoneStream(sessionId));

    const result = memoryProjectionDiff({
      store,
      memory: null,
      reduceFn: reduce,
    });

    // No memory + finished session → row-missing (the same kind we'd see
    // when memory was present-but-empty).
    expect(result.divergences).toHaveLength(1);
    const div = result.divergences[0] as MemoryDivergence;
    expect(div.field).toBe('row-missing');
    expect(div.sessionId).toBe(sessionId);
  });

  test('6 — reduceFn throwing surfaces events.replay_threw (not a library throw)', () => {
    const sessionId = 'sess-bad-reducer';
    const store = new FakeReadStore(buildDoneStream(sessionId));
    const throwingReduce: ReduceFn = (): ReducerResult => {
      throw new Error('synthetic reducer crash');
    };

    // The library MUST NOT propagate the throw — it surfaces a divergence.
    const result = memoryProjectionDiff({
      store,
      memory: null,
      reduceFn: throwingReduce,
    });

    expect(result.divergences).toHaveLength(1);
    const div = result.divergences[0] as MemoryDivergence;
    expect(div.field).toBe('events.replay_threw');
    expect(div.sessionId).toBe(sessionId);
    expect(div.note).toContain('synthetic reducer crash');
  });

  test('7 — events.empty info-level divergence when project.json row exists with no event rows', () => {
    const store = new FakeReadStore([]); // no events at all
    const memory = makeProjectJson([
      {
        sessionId: 'sess-only-in-memory',
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: null,
        task: 'demo',
      },
    ]);

    const result = memoryProjectionDiff({ store, memory, reduceFn: reduce });

    expect(result.divergences).toHaveLength(1);
    const div = result.divergences[0] as MemoryDivergence;
    expect(div.field).toBe('events.empty');
    expect(div.sessionId).toBe('sess-only-in-memory');
    // `note` is the field that distinguishes info-level from error-level
    // without introducing a severity bucket.
    expect(div.note).toContain('no events');
  });

  test('8 — mid-flight session yields zero divergences', () => {
    // Mid-flight = workflow.start + step.exit (memorization upserted the
    // session row mid-run) + NO workflow.finish. The §4 check matrix says
    // this is OK — memorization legitimately upserts the row before the
    // finish event lands.
    const sessionId = 'sess-mid-flight';
    const rows: readonly EventRow[] = [
      makeRow({ type: 'workflow.start', sessionId }),
      makeRow({ type: 'workflow.step.exit', sessionId, step: 'ideation', data: { step: 'ideation' } }),
      makeRow({ type: 'workflow.step.exit', sessionId, step: 'planning', data: { step: 'planning' } }),
      // currently in execution; no finish event.
    ];
    const store = new FakeReadStore(rows);
    const memory = makeProjectJson([
      {
        sessionId,
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: null, // mid-flight; legitimately null
        task: 'demo',
      },
    ]);

    const result = memoryProjectionDiff({ store, memory, reduceFn: reduce });

    expect(result.divergences).toEqual([]);
    expect(result.sessionsChecked).toBe(1);
  });
});
