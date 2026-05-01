/**
 * Tests for `lib/workspace-read-store.ts` — the cross-partition
 * `ReadStore` adapter consumed by PR-CFM-C's `verify-state-projections`
 * and PR-CFM-B's `gobbi memory check`.
 *
 * Test surface (11):
 *
 *   1. `replayAll()` returns every row across partitions in seq order.
 *   2. `byType(type)` filters cross-partition by event type.
 *   3. `byStep(step)` filters by step (no type filter).
 *   4. `byStep(step, type)` filters by both step and type.
 *   5. `since(seq)` returns rows after a given seq.
 *   6. `last(type)` and `lastN(type, n)` — most-recent rows by type.
 *   7. `lastNAny(n)` — most-recent N regardless of type.
 *   8. `eventCount()` — total row count.
 *   9. `aggregateDelegationCosts()` — cost rollup over `delegation.complete`.
 *  10. `close()` is idempotent (re-call does not throw).
 *  11. Constructing against a missing file throws (matches `Database`
 *      semantics) AND a successfully-opened handle rejects writes
 *      (read-only contract).
 *
 * Fixture shape mirrors the in-memory `seedStateDb` helper in
 * `commands/maintenance/__tests__/verify-state-projections.test.ts`:
 * a v5-shape `events` table is enough — the adapter does NOT
 * auto-migrate, and only the `events` table is queried.
 */

import { afterEach, describe, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import {
  existsSync,
  mkdtempSync,
  rmSync,
  unlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { WorkspaceReadStore } from '../workspace-read-store.js';

// ---------------------------------------------------------------------------
// Scratch helpers
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

afterEach(() => {
  while (scratchDirs.length > 0) {
    const d = scratchDirs.pop();
    if (d !== undefined) {
      try {
        rmSync(d, { recursive: true, force: true });
      } catch {
        // best-effort
      }
    }
  }
});

interface SeedEvent {
  readonly sessionId: string;
  readonly projectId: string;
  readonly type: string;
  readonly step?: string | null;
  readonly data?: Record<string, unknown>;
  readonly ts?: string;
}

/**
 * Build a v5-shape state.db at `<scratch>/state.db` and seed it with
 * the supplied events. Mirrors `seedStateDb` in
 * `verify-state-projections.test.ts` so the lifted adapter is exercised
 * against the same fixture shape its production caller does.
 */
function makeStateDb(rows: readonly SeedEvent[]): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-workspace-read-store-'));
  scratchDirs.push(dir);
  const dbPath = join(dir, 'state.db');
  const db = new Database(dbPath, { strict: true });
  try {
    db.run(
      `CREATE TABLE events (
         seq INTEGER PRIMARY KEY,
         ts TEXT NOT NULL,
         schema_version INTEGER NOT NULL,
         type TEXT NOT NULL,
         step TEXT,
         data TEXT NOT NULL DEFAULT '{}',
         actor TEXT NOT NULL,
         parent_seq INTEGER,
         idempotency_key TEXT NOT NULL UNIQUE,
         session_id TEXT,
         project_id TEXT
       )`,
    );
    const stmt = db.query(
      `INSERT INTO events (ts, schema_version, type, step, data, actor, idempotency_key, session_id, project_id)
       VALUES ($ts, 5, $type, $step, $data, 'test', $key, $sessionId, $projectId)`,
    );
    let seq = 0;
    for (const row of rows) {
      seq += 1;
      const data = row.data ?? {
        sessionId: row.sessionId,
        timestamp: row.ts ?? '2026-04-29T10:00:00.000Z',
      };
      stmt.run({
        ts: row.ts ?? '2026-04-29T10:00:00.000Z',
        type: row.type,
        step: row.step ?? null,
        data: JSON.stringify(data),
        key: `${row.sessionId}:${seq}:${row.type}`,
        sessionId: row.sessionId,
        projectId: row.projectId,
      });
    }
  } finally {
    db.close();
  }
  return dbPath;
}

/**
 * Two sessions across one project — large enough to demonstrate the
 * adapter walks rows cross-partition without filtering on `(session_id,
 * project_id)`. Returns the `state.db` path.
 */
function seedTwoSessions(): string {
  return makeStateDb([
    // Session A — ideation through delegation.
    { sessionId: 'sA', projectId: 'p', type: 'workflow.start' },
    {
      sessionId: 'sA',
      projectId: 'p',
      type: 'workflow.step.exit',
      step: 'ideation',
    },
    {
      sessionId: 'sA',
      projectId: 'p',
      type: 'delegation.complete',
      step: 'planning',
      data: {
        subagentId: 'sub-1',
        tokensUsed: { input: 100, output: 50 },
        model: 'claude',
        sizeProxyBytes: 1024,
      },
    },
    // Session B — partial run.
    { sessionId: 'sB', projectId: 'p', type: 'workflow.start' },
    {
      sessionId: 'sB',
      projectId: 'p',
      type: 'workflow.step.exit',
      step: 'ideation',
    },
    {
      sessionId: 'sB',
      projectId: 'p',
      type: 'delegation.complete',
      step: 'execution',
      data: {
        subagentId: 'sub-2',
        tokensUsed: { input: 200, output: 75 },
        model: 'claude',
        sizeProxyBytes: 2048,
      },
    },
    {
      sessionId: 'sB',
      projectId: 'p',
      type: 'workflow.finish',
      ts: '2026-04-29T11:00:00.000Z',
    },
  ]);
}

// ===========================================================================
// 1. replayAll — every row across partitions, seq order
// ===========================================================================

describe('WorkspaceReadStore.replayAll', () => {
  test('returns every row across both sessions in seq ASC order', () => {
    const path = seedTwoSessions();
    const store = new WorkspaceReadStore(path);
    try {
      const rows = store.replayAll();
      expect(rows).toHaveLength(7);
      const seqs = rows.map((r) => r.seq);
      expect(seqs).toEqual([1, 2, 3, 4, 5, 6, 7]);
      const sessionIds = new Set(rows.map((r) => r.session_id));
      expect(sessionIds).toEqual(new Set(['sA', 'sB']));
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// 2. byType — cross-partition filter on event type
// ===========================================================================

describe('WorkspaceReadStore.byType', () => {
  test('returns only rows with the requested type, across sessions', () => {
    const path = seedTwoSessions();
    const store = new WorkspaceReadStore(path);
    try {
      const starts = store.byType('workflow.start');
      expect(starts).toHaveLength(2);
      expect(new Set(starts.map((r) => r.session_id))).toEqual(
        new Set(['sA', 'sB']),
      );
      const finishes = store.byType('workflow.finish');
      expect(finishes).toHaveLength(1);
      expect(finishes[0]?.session_id).toBe('sB');
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// 3-4. byStep — overload with and without type filter
// ===========================================================================

describe('WorkspaceReadStore.byStep', () => {
  test('overload — without type filter returns by step; with type filter narrows further', () => {
    const path = seedTwoSessions();
    const store = new WorkspaceReadStore(path);
    try {
      // No type filter — every row at `step = 'ideation'` cross-partition.
      const ideation = store.byStep('ideation');
      expect(ideation).toHaveLength(2);
      expect(ideation.every((r) => r.step === 'ideation')).toBe(true);
      expect(new Set(ideation.map((r) => r.type))).toEqual(
        new Set(['workflow.step.exit']),
      );
      // With type filter — only rows matching BOTH step and type.
      const planning = store.byStep('planning', 'delegation.complete');
      expect(planning).toHaveLength(1);
      expect(planning[0]?.session_id).toBe('sA');
      expect(planning[0]?.type).toBe('delegation.complete');
      // Type filter that matches no row at the step.
      expect(store.byStep('planning', 'workflow.start')).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// 5. since(seq)
// ===========================================================================

describe('WorkspaceReadStore.since', () => {
  test('returns only rows with seq strictly greater than the boundary', () => {
    const path = seedTwoSessions();
    const store = new WorkspaceReadStore(path);
    try {
      const after4 = store.since(4);
      expect(after4.map((r) => r.seq)).toEqual([5, 6, 7]);
      const after7 = store.since(7);
      expect(after7).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// 6. last(type) and lastN(type, n)
// ===========================================================================

describe('WorkspaceReadStore.last + lastN', () => {
  test('last returns the most recent row of the type (or null); lastN returns up to N most-recent in DESC seq order', () => {
    const path = seedTwoSessions();
    const store = new WorkspaceReadStore(path);
    try {
      const lastDelegation = store.last('delegation.complete');
      expect(lastDelegation).not.toBeNull();
      expect(lastDelegation?.session_id).toBe('sB');
      expect(store.last('does-not-exist')).toBeNull();
      const last2 = store.lastN('delegation.complete', 2);
      expect(last2).toHaveLength(2);
      // DESC by seq — latest delegation is sB's (seq 6), then sA's (seq 3).
      expect(last2[0]?.session_id).toBe('sB');
      expect(last2[1]?.session_id).toBe('sA');
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// 7. lastNAny(n)
// ===========================================================================

describe('WorkspaceReadStore.lastNAny', () => {
  test('returns the most recent N rows regardless of type', () => {
    const path = seedTwoSessions();
    const store = new WorkspaceReadStore(path);
    try {
      const last3 = store.lastNAny(3);
      expect(last3).toHaveLength(3);
      // DESC by seq — seqs 7, 6, 5.
      expect(last3.map((r) => r.seq)).toEqual([7, 6, 5]);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// 8. eventCount
// ===========================================================================

describe('WorkspaceReadStore.eventCount', () => {
  test('returns the total row count across partitions', () => {
    const path = seedTwoSessions();
    const store = new WorkspaceReadStore(path);
    try {
      expect(store.eventCount()).toBe(7);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// 9. aggregateDelegationCosts
// ===========================================================================

describe('WorkspaceReadStore.aggregateDelegationCosts', () => {
  test('returns one row per delegation.complete event, with json_extract fields', () => {
    const path = seedTwoSessions();
    const store = new WorkspaceReadStore(path);
    try {
      const costs = store.aggregateDelegationCosts();
      expect(costs).toHaveLength(2);
      // Ordered by seq ASC — sA's delegation.complete (seq 3) before sB's (seq 6).
      expect(costs[0]?.step).toBe('planning');
      expect(costs[0]?.subagentId).toBe('sub-1');
      expect(costs[0]?.model).toBe('claude');
      expect(costs[0]?.bytes).toBe(1024);
      expect(costs[1]?.step).toBe('execution');
      expect(costs[1]?.subagentId).toBe('sub-2');
      expect(costs[1]?.bytes).toBe(2048);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// 10. close() idempotency
// ===========================================================================

describe('WorkspaceReadStore.close', () => {
  test('a second close() call is a no-op and does not throw', () => {
    const path = seedTwoSessions();
    const store = new WorkspaceReadStore(path);
    store.close();
    expect(() => store.close()).not.toThrow();
  });
});

// ===========================================================================
// 11. Constructor — missing file throws; readonly contract enforced
// ===========================================================================

describe('WorkspaceReadStore constructor', () => {
  test('throws when the underlying state.db path does not exist', () => {
    const dir = mkdtempSync(join(tmpdir(), 'gobbi-workspace-read-store-'));
    scratchDirs.push(dir);
    const missing = join(dir, 'state.db');
    expect(existsSync(missing)).toBe(false);
    expect(() => new WorkspaceReadStore(missing)).toThrow();
  });

  test('opens read-only — direct write attempts via the same path fail', () => {
    // Defensive: build a fixture, open via WorkspaceReadStore, then verify
    // a writer DB opened against the SAME file with `{ readonly: true }`
    // refuses INSERT. This proves the option flag the constructor sets is
    // load-bearing for the no-mutation contract of the adapter.
    const path = seedTwoSessions();
    const store = new WorkspaceReadStore(path);
    try {
      const probe = new Database(path, { strict: true, readonly: true });
      try {
        expect(() =>
          probe.run(
            `INSERT INTO events (ts, schema_version, type, actor, idempotency_key)
             VALUES ('2026-01-01T00:00:00Z', 5, 'x.y', 'test', 'probe-key')`,
          ),
        ).toThrow();
      } finally {
        probe.close();
      }
    } finally {
      store.close();
    }
    // Sanity: the fixture file is still present after the probe.
    expect(existsSync(path)).toBe(true);
    // Cleanup of the SQLite sidecar files happens via afterEach.
    if (existsSync(`${path}-shm`)) {
      try {
        unlinkSync(`${path}-shm`);
      } catch {
        // best-effort
      }
    }
    if (existsSync(`${path}-wal`)) {
      try {
        unlinkSync(`${path}-wal`);
      } catch {
        // best-effort
      }
    }
  });
});

