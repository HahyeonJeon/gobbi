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
 * - v6 — Wave A.1.3 / orchestration Pass 4 (issue #146). Adds four new
 *   workspace-partitioned tables to the event store DB:
 *
 *     - `state_snapshots` — per-(session, seq) snapshot rows powering
 *       fast resume + replay-storm prevention + missed-advancement
 *       escalation (orchestration README §3.3).
 *     - `tool_calls` — Pre/PostToolUse audit trail (table-only — not a
 *       new event category).
 *     - `config_changes` — `gobbi config set` audit (table-only).
 *     - `schema_meta` — workspace-level migration version + last-completed
 *       timestamp tracking, separate from the per-event `schema_version`
 *       column. Single-row table keyed on a sentinel `'state_db'`.
 *
 *   v6 also adds the `step.advancement.observed` audit-only event type
 *   (see `events/step-advancement.ts`). Event *data* payloads remain
 *   wire-compatible: the new event is strictly additive, and the
 *   registered v5 migration is an identity. New tables are workspace-
 *   partitioned by `session_id` (all four) and `project_id` (where the
 *   row originates from a project-scoped action) so cross-session and
 *   cross-project queries are direct projections per the workspace re-
 *   scope locked in orchestration README §3.1. The schema CREATE
 *   statements run inside the event store's open path — {@link
 *   ensureSchemaV6} runs after {@link ensureSchemaV5} and is idempotent
 *   (CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS).
 *
 *   Note: `prompt_patches` is intentionally NOT in v6 — Wave C.1's
 *   prompts-as-data feature owns it via a future v7. See
 *   orchestration review DRIFT-9 for the rationale.
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

export const CURRENT_SCHEMA_VERSION = 6;

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
 * - v5→v6 (Wave A.1.3, issue #146): adds four workspace-partitioned
 *   tables (`state_snapshots`, `tool_calls`, `config_changes`,
 *   `schema_meta`) and the `step.advancement.observed` audit-only event
 *   type. No transform on existing event data — the new event type and
 *   the new tables are strictly additive. Registered as an identity on
 *   event data so the walk path stays composable for a future v7.
 *
 * Declaring each identity registers the hop so the composition walks the
 * full chain (v1→v2→v3→v4→v5→v6) rather than short-circuiting — the walk
 * path is what a future v7 migration will extend.
 */
const migrations: Readonly<Record<number, MigrationFn>> = {
  1: (data) => data,
  2: (data) => data,
  3: (data) => data,
  4: (data) => data,
  5: (data) => data,
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

// ---------------------------------------------------------------------------
// Schema v6 — workspace-partitioned audit + meta tables (Wave A.1.3)
// ---------------------------------------------------------------------------

/**
 * Names of every table introduced in schema v6. Exported so tests and
 * post-migration verification can iterate without duplicating the literal.
 *
 * The order is the create order: tables that other tables may reference
 * (none today, but reserved for FK extensions) come first.
 */
export const SCHEMA_V6_TABLES = [
  'state_snapshots',
  'tool_calls',
  'config_changes',
  'schema_meta',
] as const;

export type SchemaV6TableName = typeof SCHEMA_V6_TABLES[number];

/**
 * Names of every index introduced in schema v6. Exported so tests can
 * assert presence without duplicating the literal.
 */
export const SCHEMA_V6_INDICES = [
  'idx_state_snapshots_session_created',
  'idx_state_snapshots_session_seq',
  'idx_tool_calls_session_ts',
  'idx_tool_calls_tool_call',
  'idx_config_changes_session_ts',
] as const;

export type SchemaV6IndexName = typeof SCHEMA_V6_INDICES[number];

/**
 * `state_snapshots` — one row per (session_id, last_event_seq).
 *
 * Powers fast resume + replay-storm prevention. Per orchestration README
 * §3.3 / §6 the table also receives "missed-advancement escalation"
 * marks from the Stop hook at the 5-turn threshold (Wave E.1 owner) — a
 * Wave A.1 caller writes a snapshot row whenever it materialises state
 * derivation, so repeated calls within the same turn project from the
 * cached row instead of replaying from the event log.
 *
 * Columns:
 *   - session_id      TEXT  — workspace partition key (every snapshot is
 *                             scoped to a single session).
 *   - project_id      TEXT  — project partition key, NULL when the
 *                             session has no resolvable project root.
 *   - last_event_seq  INTEGER — the `events.seq` the snapshot reflects.
 *                               Forms the dedupe key with `session_id`.
 *   - state_json      TEXT  — serialised `WorkflowState` at that seq.
 *   - created_at      INTEGER — UNIX-ms wall clock at write time.
 */
const SQL_CREATE_STATE_SNAPSHOTS = `
CREATE TABLE IF NOT EXISTS state_snapshots (
  session_id     TEXT NOT NULL,
  project_id     TEXT,
  last_event_seq INTEGER NOT NULL,
  state_json     TEXT NOT NULL,
  created_at     INTEGER NOT NULL,
  PRIMARY KEY (session_id, last_event_seq)
)`;

const SQL_CREATE_INDEX_STATE_SNAPSHOTS_SESSION_CREATED = `
CREATE INDEX IF NOT EXISTS idx_state_snapshots_session_created
  ON state_snapshots (session_id, created_at)`;

const SQL_CREATE_INDEX_STATE_SNAPSHOTS_SESSION_SEQ = `
CREATE INDEX IF NOT EXISTS idx_state_snapshots_session_seq
  ON state_snapshots (session_id, last_event_seq)`;

/**
 * `tool_calls` — Pre/PostToolUse audit trail. Table-only (NOT a new event
 * category).
 *
 * One row per observed `(tool_call_id, phase)` pair: PreToolUse captures
 * the input on the way in, PostToolUse captures the output on the way
 * out. The pair allows debugging slow / failed tool invocations without
 * inflating the `events` table.
 *
 * Columns:
 *   - session_id     TEXT  — workspace partition key.
 *   - project_id     TEXT  — project partition key (nullable).
 *   - tool_call_id   TEXT  — the Claude Code-supplied identifier.
 *   - tool_name      TEXT  — e.g. `'Bash'`, `'Edit'`, `'Write'`.
 *   - phase          TEXT  — `'pre'` for PreToolUse, `'post'` for
 *                            PostToolUse. CHECK-constrained.
 *   - timestamp      INTEGER — UNIX-ms wall clock at hook fire.
 *   - input_json     TEXT  — the tool input payload (always populated).
 *   - output_json    TEXT  — the tool output payload, NULL on PreToolUse
 *                            rows (output not yet available).
 *
 * Composite primary key `(tool_call_id, phase)` deduplicates across hook
 * retries while keeping pre/post rows distinct.
 */
const SQL_CREATE_TOOL_CALLS = `
CREATE TABLE IF NOT EXISTS tool_calls (
  session_id   TEXT NOT NULL,
  project_id   TEXT,
  tool_call_id TEXT NOT NULL,
  tool_name    TEXT NOT NULL,
  phase        TEXT NOT NULL CHECK (phase IN ('pre', 'post')),
  timestamp    INTEGER NOT NULL,
  input_json   TEXT NOT NULL,
  output_json  TEXT,
  PRIMARY KEY (tool_call_id, phase)
)`;

const SQL_CREATE_INDEX_TOOL_CALLS_SESSION_TS = `
CREATE INDEX IF NOT EXISTS idx_tool_calls_session_ts
  ON tool_calls (session_id, timestamp)`;

const SQL_CREATE_INDEX_TOOL_CALLS_TOOL_CALL = `
CREATE INDEX IF NOT EXISTS idx_tool_calls_tool_call
  ON tool_calls (tool_call_id)`;

/**
 * `config_changes` — `gobbi config set` audit. Table-only.
 *
 * One row per applied configuration change. Records the layer the
 * change was written to (project / workspace / user) and the before/after
 * value pair so the change history is replayable without parsing
 * `.gobbi/config.toml` deltas.
 *
 * Columns:
 *   - session_id   TEXT  — workspace partition key (the session that
 *                          ran the `gobbi config set` command).
 *   - project_id   TEXT  — project partition key (nullable).
 *   - key          TEXT  — the dotted config path being changed.
 *   - layer        TEXT  — `'project' | 'workspace' | 'user'`.
 *                          CHECK-constrained.
 *   - old_value    TEXT  — the prior JSON-encoded value, or NULL when
 *                          the key was unset.
 *   - new_value    TEXT  — the JSON-encoded new value, or NULL when the
 *                          change is a deletion.
 *   - timestamp    INTEGER — UNIX-ms wall clock at write time.
 *
 * No primary key — `config_changes` is a pure log; the natural key is
 * `(timestamp, key, layer)` but allowing duplicates keeps the writer
 * implementation simple. Partition queries scope by `session_id`.
 */
const SQL_CREATE_CONFIG_CHANGES = `
CREATE TABLE IF NOT EXISTS config_changes (
  session_id TEXT NOT NULL,
  project_id TEXT,
  key        TEXT NOT NULL,
  layer      TEXT NOT NULL CHECK (layer IN ('project', 'workspace', 'user')),
  old_value  TEXT,
  new_value  TEXT,
  timestamp  INTEGER NOT NULL
)`;

const SQL_CREATE_INDEX_CONFIG_CHANGES_SESSION_TS = `
CREATE INDEX IF NOT EXISTS idx_config_changes_session_ts
  ON config_changes (session_id, timestamp)`;

/**
 * `schema_meta` — workspace-level migration tracking.
 *
 * Augments the per-event `schema_version` column on `events` with a
 * single-row table that records the DB-as-a-whole migration version and
 * the last-completed timestamp. Wave A.1.4's `gobbi maintenance migrate-state-db`
 * reads this row to decide whether to run a pending migration; v0.5.0
 * Phase 2's pre-event `metadata.json::schemaVersion` will eventually
 * source from this row instead.
 *
 * Single-row design: the `id` column is a constant sentinel
 * (`'state_db'`) so an INSERT OR REPLACE always rewrites the same row.
 * No history kept here — historical version transitions are reconstructible
 * from the event stream's `schema_version` distribution.
 *
 * Columns:
 *   - id              TEXT     — sentinel `'state_db'`. PRIMARY KEY.
 *   - schema_version  INTEGER — the DB-as-a-whole version (matches
 *                                CURRENT_SCHEMA_VERSION at write time).
 *   - migrated_at     INTEGER — UNIX-ms wall clock when the migration
 *                                completed.
 */
const SQL_CREATE_SCHEMA_META = `
CREATE TABLE IF NOT EXISTS schema_meta (
  id             TEXT PRIMARY KEY,
  schema_version INTEGER NOT NULL,
  migrated_at    INTEGER NOT NULL
)`;

/**
 * Stamp the `schema_meta` row at v6.
 *
 * Idempotent via INSERT OR REPLACE — re-running the migration is a no-op
 * other than refreshing `migrated_at`, which is the desired semantic
 * (operators can grep `schema_meta` to confirm the most recent migration).
 *
 * Bind parameters are positional `?` placeholders so the statement runs
 * unchanged regardless of whether the caller's `Database` was opened in
 * `strict: true` (event-store path) or default mode (test fixtures and
 * the future maintenance command that opens a raw `Database` for the
 * one-shot migrate-state-db run).
 */
const SQL_STAMP_SCHEMA_META_V6 = `
INSERT OR REPLACE INTO schema_meta (id, schema_version, migrated_at)
VALUES ('state_db', ?, ?)`;

/**
 * Return the set of table names currently present in the database.
 *
 * Mirrors {@link getEventsColumnNames} for v5 — gives tests and the
 * migration runner a cheap idempotency check without throwing on
 * already-applied CREATEs.
 */
export function getTableNames(db: Database): ReadonlySet<string> {
  const rows = db
    .query<{ name: string }, []>(
      "SELECT name FROM sqlite_master WHERE type = 'table'",
    )
    .all();
  return new Set(rows.map((r) => r.name));
}

/**
 * Return the set of index names currently present in the database.
 */
export function getIndexNames(db: Database): ReadonlySet<string> {
  const rows = db
    .query<{ name: string }, []>(
      "SELECT name FROM sqlite_master WHERE type = 'index' AND name NOT LIKE 'sqlite_autoindex_%'",
    )
    .all();
  return new Set(rows.map((r) => r.name));
}

/**
 * Ensure the schema-v6 tables and indices exist.
 *
 * Idempotent: every CREATE uses `IF NOT EXISTS`, so re-running this on a
 * v6-or-later DB is a no-op. Running it on a pre-v6 DB after
 * {@link ensureSchemaV5} brings the DB to v6 in one pass.
 *
 * Caller is responsible for sequencing — the `EventStore` constructor
 * runs `ensureSchemaV5(db)` and then `ensureSchemaV6(db)` inside
 * `initSchema`.
 *
 * Stamps the `schema_meta` row at v6 with the current wall-clock; the
 * caller can pass an explicit `now` to make tests deterministic.
 *
 * ## Atomicity
 *
 * The CREATE chain runs inside a single `db.transaction(...).immediate()`
 * so a mid-chain failure rolls back any partial v6 schema rather than
 * leaving the DB half-applied. SQLite would otherwise auto-commit each
 * `db.run()` independently — a thrown error after the first CREATE TABLE
 * landed but before `schema_meta` stamped would leave the operator with
 * a non-trivial recovery problem (some v6 tables present, no `schema_meta`
 * row, no migration record). `.immediate()` acquires the write lock
 * upfront, matching the pattern used elsewhere in the codebase
 * (`commands/workflow/init.ts`, `lib/config-store.ts`) for write-first
 * transactions.
 */
export function ensureSchemaV6(
  db: Database,
  now: number = Date.now(),
): void {
  db.transaction(() => {
    db.run(SQL_CREATE_STATE_SNAPSHOTS);
    db.run(SQL_CREATE_INDEX_STATE_SNAPSHOTS_SESSION_CREATED);
    db.run(SQL_CREATE_INDEX_STATE_SNAPSHOTS_SESSION_SEQ);

    db.run(SQL_CREATE_TOOL_CALLS);
    db.run(SQL_CREATE_INDEX_TOOL_CALLS_SESSION_TS);
    db.run(SQL_CREATE_INDEX_TOOL_CALLS_TOOL_CALL);

    db.run(SQL_CREATE_CONFIG_CHANGES);
    db.run(SQL_CREATE_INDEX_CONFIG_CHANGES_SESSION_TS);

    db.run(SQL_CREATE_SCHEMA_META);

    db.run(SQL_STAMP_SCHEMA_META_V6, [CURRENT_SCHEMA_VERSION, now]);
  }).immediate();
}
