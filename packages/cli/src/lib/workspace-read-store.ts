/**
 * `WorkspaceReadStore` — read-only, cross-partition `ReadStore` adapter
 * over the workspace-scoped `state.db`. Lifted out of
 * `commands/maintenance/verify-state-projections.ts` so two independent
 * maintenance/admin commands can share a single adapter implementation:
 *
 *   1. `gobbi maintenance verify-state-projections` (PR-CFM-C #201) —
 *      detects drift between event-derived state and the
 *      `project.json` handoff projection across every session.
 *   2. `gobbi memory check <session-id>` (PR-CFM-B #236) — per-session
 *      operator-facing version of the same divergence detector.
 *
 * Both consumers walk every row in the events table without partition
 * scoping; the production `EventStore` (see
 * `workflow/store.ts:209-223`) is partition-bound by `(sessionId,
 * projectId)` by design and is the wrong shape for cross-session
 * verification work.
 *
 * This adapter mirrors `EventStore`'s read surface so the existing
 * `ReadStore` interface (`workflow/store.ts:319-329`) is satisfied
 * without conditional logic at the call site — `memoryProjectionDiff`
 * accepts any `ReadStore` and the cross-partition view drops in
 * unchanged. Today only `replayAll()` is exercised by the diff library;
 * the other methods are implemented for completeness so future callers
 * (analytics rollups, single-type filters) can adopt the adapter
 * without surprising holes in the contract.
 *
 * # Why a separate module
 *
 * This adapter intentionally does NOT auto-migrate the schema (no
 * `ensureSchemaV5/V6/V7` call): verification opens a possibly-old DB
 * and should not silently mutate it. The `events` table is the only
 * object queried; if the DB is missing entirely the constructor throws
 * (matches `Database` semantics), and the consuming command's
 * pre-flight `existsSync` check catches the common case before reaching
 * here. The class is lifted to `lib/` rather than left in the command
 * module so the no-mutation contract is loud and the dependency
 * direction is `commands/ → lib/` (not `commands/ → commands/`).
 *
 * # Read-only contract
 *
 * The internal `Database` is opened with `{ strict: true, readonly: true }`.
 * Any attempt to issue a write through this handle raises `SQLITE_READONLY`
 * at runtime. The class exposes no `INSERT` / `UPDATE` / `DELETE` paths;
 * the structural typing (`implements ReadStore`) prevents accidental
 * widening at the type level. See `_typescript` skill §"Read/write
 * interface splitting" for the broader pattern.
 *
 * @see {@link ReadStore} (`workflow/store.ts`) — the contract this class implements.
 * @see `lib/memory-projection-diff.ts` — the pure diff library that consumes this adapter.
 * @see `commands/maintenance/verify-state-projections.ts` — first consumer.
 * @see `commands/memory/check.ts` — second consumer (PR-CFM-B T4).
 */

import { Database } from 'bun:sqlite';

import type { CostAggregateRow, ReadStore } from '../workflow/store.js';
import type { EventRow } from '../workflow/migrations.js';

/**
 * Read-only `ReadStore` adapter that returns every row in the events
 * table, NOT scoped to a single `(sessionId, projectId)` partition.
 *
 * Construct against an absolute `state.db` path. The constructor opens
 * the underlying `Database` immediately; the caller MUST call
 * {@link WorkspaceReadStore.close} when done (typically inside a
 * `try/finally` mirroring `verify-state-projections.ts:357-373`).
 */
export class WorkspaceReadStore implements ReadStore {
  private readonly db: Database;

  constructor(stateDbPath: string) {
    this.db = new Database(stateDbPath, { strict: true, readonly: true });
  }

  close(): void {
    this.db.close();
  }

  replayAll(): EventRow[] {
    return this.db
      .query<EventRow, []>('SELECT * FROM events ORDER BY seq ASC')
      .all();
  }

  byType(type: string): EventRow[] {
    return this.db
      .query<EventRow, [string]>(
        'SELECT * FROM events WHERE type = ? ORDER BY seq ASC',
      )
      .all(type);
  }

  byStep(step: string, type?: string): EventRow[] {
    if (type !== undefined) {
      return this.db
        .query<EventRow, [string, string]>(
          'SELECT * FROM events WHERE step = ? AND type = ? ORDER BY seq ASC',
        )
        .all(step, type);
    }
    return this.db
      .query<EventRow, [string]>(
        'SELECT * FROM events WHERE step = ? ORDER BY seq ASC',
      )
      .all(step);
  }

  since(seq: number): EventRow[] {
    return this.db
      .query<EventRow, [number]>(
        'SELECT * FROM events WHERE seq > ? ORDER BY seq ASC',
      )
      .all(seq);
  }

  last(type: string): EventRow | null {
    return this.db
      .query<EventRow, [string]>(
        'SELECT * FROM events WHERE type = ? ORDER BY seq DESC LIMIT 1',
      )
      .get(type);
  }

  lastN(type: string, n: number): readonly EventRow[] {
    return this.db
      .query<EventRow, [string, number]>(
        'SELECT * FROM events WHERE type = ? ORDER BY seq DESC LIMIT ?',
      )
      .all(type, n);
  }

  lastNAny(n: number): readonly EventRow[] {
    return this.db
      .query<EventRow, [number]>(
        'SELECT * FROM events ORDER BY seq DESC LIMIT ?',
      )
      .all(n);
  }

  eventCount(): number {
    const row = this.db
      .query<{ cnt: number }, []>('SELECT count(*) as cnt FROM events')
      .get();
    return row?.cnt ?? 0;
  }

  aggregateDelegationCosts(): readonly CostAggregateRow[] {
    return this.db
      .query<CostAggregateRow, []>(
        `SELECT
           step                                            AS step,
           json_extract(data, '$.subagentId')              AS subagentId,
           json_extract(data, '$.tokensUsed')              AS tokensJson,
           json_extract(data, '$.model')                   AS model,
           json_extract(data, '$.sizeProxyBytes')          AS bytes
         FROM events
         WHERE type = 'delegation.complete'
         ORDER BY seq ASC`,
      )
      .all();
  }
}
