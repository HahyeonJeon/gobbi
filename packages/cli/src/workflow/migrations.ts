/**
 * Lazy event schema migration pipeline.
 *
 * Events are stored with a schema_version. When the application's
 * CURRENT_SCHEMA_VERSION advances, older events are migrated on read
 * by walking the migration chain from their stored version to the target.
 *
 * ## Version history
 *
 * - v1 — initial release (PR A).
 * - v2 — adds `guard.warn` event type and the state fields
 *   `lastVerdictOutcome` + `GuardViolationRecord.severity`. Event *data*
 *   shape is identical across v1→v2, so the registered v1 migration is an
 *   identity. New v2-only fields on state are normalised on read, not
 *   written retroactively (Greg Young discipline — see `v050-session.md`).
 * - v3 — PR D. Adds `workflow.invalid_transition` event type and the
 *   optional `EvalSkipData.priorError` field (CP11 reversibility — carries
 *   a full `ErrorPathway` snapshot on `resume --force-memorization` skip
 *   events). Event *data* payloads are wire-compatible across v2→v3: the
 *   new `priorError` field is strictly additive and optional, so existing
 *   v2 events parse cleanly under v3 and a v3 event without `priorError`
 *   is indistinguishable from a v2 one. The registered v2 migration is an
 *   identity on event data; `initialState().schemaVersion` bumps 2→3 in
 *   lockstep so newly-initialised sessions advertise v3.
 * - v4 — PR E. Adds the `verification.result` event type, the
 *   `verificationResults` state field, and the optional
 *   `DelegationCompleteData.sizeProxyBytes` field. Event *data* payloads
 *   are wire-compatible across v3→v4: `sizeProxyBytes` is strictly
 *   additive and optional on `delegation.complete`, so existing v3
 *   events parse cleanly under v4. The registered v3 migration is an
 *   identity on event data; `initialState().schemaVersion` bumps 3→4 in
 *   lockstep so newly-initialised sessions advertise v4. The new
 *   `verificationResults` state field is absent on v3 on-disk shapes and
 *   is normalised in on read (empty record), mirroring the Greg Young
 *   discipline applied for `lastVerdictOutcome` at the v1→v2 bump.
 * - v5 — gobbi-memory Pass 2 (issue #118). Adds two new columns to the
 *   `events` TABLE — `session_id TEXT` and `project_id TEXT` — which
 *   make the per-row session + project partition keys explicit rather
 *   than implicit-in-`idempotency_key`. See DRIFT-3 in
 *   `.claude/project/gobbi/design/v050-features/gobbi-memory/review.md`.
 *   Event *data* payloads are unchanged v4→v5; the change is purely at
 *   the row level. The registered v4 migration is an identity on event
 *   data. The schema ALTER + row backfill run inside the event store's
 *   open path — {@link ensureSchemaV5} adds the columns when missing;
 *   {@link backfillSessionAndProjectIds} populates NULL slots on pre-v5
 *   rows using the store's known `sessionId` + `projectRootBasename`.
 */

import type { Database } from 'bun:sqlite';

// ---------------------------------------------------------------------------
// Row type — must match the SQLite row shape from EventStore
// ---------------------------------------------------------------------------

export interface EventRow {
  readonly seq: number;
  readonly ts: string;
  readonly schema_version: number;
  readonly type: string;
  readonly step: string | null;
  readonly data: string;
  readonly actor: string;
  readonly parent_seq: number | null;
  readonly idempotency_key: string;
  /**
   * Session partition key — the `sessionId` that authored the row.
   * Present on every row written under schema v5+. Legacy v4 rows
   * carry `null` until {@link backfillSessionAndProjectIds} writes the
   * known sessionId in. Distinct from the idempotency-key's embedded
   * session prefix so downstream queries can partition without parsing.
   */
  readonly session_id: string | null;
  /**
   * Project partition key — `basename(metadata.projectRoot)` at the
   * time the row was written. `null` when `metadata.json` is absent
   * or malformed, and on legacy v4 rows until backfill runs. Distinct
   * from session_id so cross-session queries can still scope by repo.
   */
  readonly project_id: string | null;
}

// ---------------------------------------------------------------------------
// Schema version tracking
// ---------------------------------------------------------------------------

export const CURRENT_SCHEMA_VERSION = 5;

// ---------------------------------------------------------------------------
// Migration registry
// ---------------------------------------------------------------------------

type MigrationFn = (eventData: unknown) => unknown;

/**
 * Maps schema_version N to the function that transforms event data
 * from version N to version N+1.
 *
 * All registered hops are explicit identities:
 *
 * - v1→v2: new event types (`guard.warn`) + new state fields, not payload
 *   transforms.
 * - v2→v3 (PR D): adds `workflow.invalid_transition` event type + an
 *   optional `EvalSkipData.priorError` field. `priorError` is strictly
 *   additive on the existing `eval.skip` payload, so an absent field on a
 *   v2 row is indistinguishable from a v3 row that happens not to carry
 *   a snapshot. No payload transform.
 * - v3→v4 (PR E): adds `verification.result` event type + an optional
 *   `DelegationCompleteData.sizeProxyBytes` field. `sizeProxyBytes` is
 *   strictly additive on the existing `delegation.complete` payload, so
 *   an absent field on a v3 row is indistinguishable from a v4 row that
 *   happens not to carry a proxy count. No payload transform.
 * - v4→v5 (gobbi-memory Pass 2): adds `session_id` + `project_id`
 *   COLUMNS on the `events` table. Row shape changes; event *data*
 *   payloads do not. Registered as an identity on event data so the
 *   walk path still exercises the composition plumbing.
 *
 * Declaring each identity registers the hop so the composition walks the
 * full chain (v1→v2→v3→v4→v5) rather than short-circuiting — the walk
 * path is what a future v6 migration will extend.
 */
const migrations: Readonly<Record<number, MigrationFn>> = {
  1: (data) => data,
  2: (data) => data,
  3: (data) => data,
  4: (data) => data,
};

// ---------------------------------------------------------------------------
// Migration function
// ---------------------------------------------------------------------------

/**
 * Migrate an event row from its stored schema_version to the target version.
 *
 * Returns the original row unchanged if already at target version.
 * Throws if a migration step is missing in the chain.
 */
export function migrateEvent(
  event: EventRow,
  targetVersion: number = CURRENT_SCHEMA_VERSION,
): EventRow {
  let { schema_version } = event;

  if (schema_version === targetVersion) {
    return event;
  }

  if (schema_version > targetVersion) {
    throw new Error(
      `Event schema_version ${schema_version} is newer than target ${targetVersion} — downgrade migrations are not supported`,
    );
  }

  let parsedData: unknown = JSON.parse(event.data);

  while (schema_version < targetVersion) {
    const migrator = migrations[schema_version];
    if (migrator === undefined) {
      throw new Error(
        `No migration from schema v${schema_version} to v${schema_version + 1}`,
      );
    }
    parsedData = migrator(parsedData);
    schema_version++;
  }

  return { ...event, schema_version, data: JSON.stringify(parsedData) };
}

// ---------------------------------------------------------------------------
// Row-level schema migration (v4 → v5) — ADD COLUMN + backfill
// ---------------------------------------------------------------------------

/**
 * Shape of a single row returned by `PRAGMA table_info(events)`. Only the
 * `name` field is consulted here; the rest are named for readability when
 * the query results are inspected during debugging.
 */
interface PragmaTableInfoRow {
  readonly cid: number;
  readonly name: string;
  readonly type: string;
  readonly notnull: number;
  readonly dflt_value: string | null;
  readonly pk: number;
}

/**
 * Return the set of column names currently present on the `events` table.
 *
 * `PRAGMA table_info` is the canonical sqlite introspection surface — it
 * returns one row per column with `name` at index 1. Used by
 * {@link ensureSchemaV5} to decide whether the v4→v5 ALTER has already
 * been applied (idempotent re-open behaviour) and by the store-level
 * tests to assert column presence.
 */
export function getEventsColumnNames(db: Database): ReadonlySet<string> {
  const rows = db
    .query<PragmaTableInfoRow, []>('PRAGMA table_info(events)')
    .all();
  return new Set(rows.map((r) => r.name));
}

/**
 * Ensure the `events` table carries the v5 columns (`session_id` +
 * `project_id`). Idempotent: if either column already exists, the
 * matching ALTER is skipped. The columns are added without `NOT NULL`
 * so legacy v4 rows can coexist with NULL values until
 * {@link backfillSessionAndProjectIds} writes them in.
 *
 * Caller is responsible for running this before any v5 INSERT — every
 * `EventStore` construction calls it once through `initSchema`.
 */
export function ensureSchemaV5(db: Database): void {
  const columns = getEventsColumnNames(db);
  if (!columns.has('session_id')) {
    db.run('ALTER TABLE events ADD COLUMN session_id TEXT');
  }
  if (!columns.has('project_id')) {
    db.run('ALTER TABLE events ADD COLUMN project_id TEXT');
  }
}

/**
 * Backfill the v5 partition columns on legacy v4 rows that still carry
 * `NULL` in `session_id` / `project_id`. Idempotent by the `WHERE … IS
 * NULL` guard — rows that already carry a value (v5 fresh-writes, or an
 * earlier backfill pass) are untouched.
 *
 * `projectRootBasename` may be `null` when `metadata.json` is missing or
 * malformed at store-open time; in that case `project_id` is left NULL
 * rather than stamped with a sentinel, keeping the absence of metadata
 * distinguishable at query time.
 *
 * Runs silently when the events table has no legacy rows — the UPDATE
 * returns zero affected rows but does not throw.
 */
export function backfillSessionAndProjectIds(
  db: Database,
  sessionId: string,
  projectRootBasename: string | null,
): void {
  db.run(
    'UPDATE events SET session_id = ? WHERE session_id IS NULL',
    [sessionId],
  );
  if (projectRootBasename !== null) {
    db.run(
      'UPDATE events SET project_id = ? WHERE project_id IS NULL',
      [projectRootBasename],
    );
  }
}
