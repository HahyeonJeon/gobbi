/**
 * gobbi maintenance migrate-state-db — bring a state.db file's schema up
 * to the current workspace-level version (currently v7).
 *
 * ## Context (v0.5.0 Wave C.1.2 — issue #156; originally Wave A.1.4 — issue #146)
 *
 * Wave A.1 added schema v6 to the event-store DB: four new workspace-
 * partitioned tables (`state_snapshots`, `tool_calls`, `config_changes`,
 * `schema_meta`) plus their indices. Wave C.1.2 added schema v7: the
 * `prompt_patches` workspace-partitioned audit table for prompts-as-data
 * RFC 6902 patch records. The `EventStore.initSchema` path auto-applies
 * migrations when an `EventStore` opens, so most sessions never need to
 * invoke this command. It exists for two cases the auto-apply does not cover:
 *
 *   1. An on-disk `state.db` that has not yet been opened by an
 *      `EventStore` since the v7 bump — running this command stamps
 *      the schema_meta row and creates the new tables ahead of the
 *      first session-opening.
 *   2. Operator wants a deterministic, reportable migration step —
 *      e.g., before a snapshot/backup, or as part of a Flyway-style
 *      "baseline-on-migrate" handoff (orchestration README §3.5).
 *
 * ## Audit tables: empty until later waves
 *
 * Three of the four v6 tables (`state_snapshots`, `tool_calls`,
 * `config_changes`) ship with their schema locked but no production
 * writers yet. The v7 `prompt_patches` table writer landed in Wave C.1.6
 * alongside `gobbi prompt patch`.
 *
 *   - `state_snapshots` — Wave E.1 (Inner-mode safety net) wires the
 *     writer that records per-(session, seq) state snapshots and emits
 *     the missed-advancement escalation marks.
 *   - `tool_calls` — the hooks waves wire Pre/PostToolUse capture into
 *     this table; until then it stays empty.
 *   - `config_changes` — `gobbi config set` audit; the writer lands with
 *     the config-management wave.
 *   - `prompt_patches` — active since Wave C.1.6; stores one row per
 *     applied RFC 6902 patch, keyed by `(prompt_id, patch_id)`.
 *
 * `schema_meta` is the only table this command itself writes to —
 * every successful run stamps the sentinel row. Operators running this
 * command and finding `state_snapshots`, `tool_calls`, or `config_changes`
 * empty are seeing the intended state, not a half-applied migration.
 *
 * The command is intentionally narrow:
 *
 *   - It opens the supplied `state.db` directly (no `EventStore`
 *     wrapper) so it can run on any pre-v6 file without depending on
 *     the EventStore constructor's partition-key resolution.
 *   - It runs `ensureSchemaV5(db)`, `ensureSchemaV6(db)`, then
 *     `ensureSchemaV7(db)` — all idempotent — so the chain catches up
 *     regardless of starting version, and re-running on an already-v7
 *     file is a no-op other than refreshing the `migrated_at` stamp.
 *   - It reports previous-vs-new schema version, rows touched (always
 *     1 — the single `schema_meta` row), and elapsed wall-clock ms.
 *
 * ## Default DB path
 *
 * When `--db` is omitted, the command defaults to
 * `<repoRoot>/.gobbi/state.db`. Wave A.1's workspace re-scope locks
 * this path (orchestration README §3.3). The fallback uses
 * {@link getRepoRoot} via {@link workspaceRoot}, mirroring the path
 * resolution used by sibling commands like `wipe-legacy-sessions.ts`.
 *
 * ## Exit codes
 *
 *   - `0` — migration succeeded (or was a no-op on an already-v7 db).
 *   - `1` — migration failed (db file missing, schema-violation,
 *           SQLite open error). Error message printed to stderr.
 *   - `2` — argument parse error.
 *
 * ## Output
 *
 * Pretty form (default):
 *
 *     gobbi maintenance migrate-state-db
 *     path: /repo/.gobbi/state.db
 *     previous schema_version: 6
 *     new schema_version: 7
 *     rows touched: 1
 *     elapsed: 4 ms
 *
 * Structured form (`--json`):
 *
 *     {"path": "...", "previousVersion": 6, "newVersion": 7,
 *      "rowsTouched": 1, "elapsedMs": 4}
 *
 * @see `packages/cli/src/workflow/migrations.ts` — `ensureSchemaV7`,
 *      `SCHEMA_V7_TABLES`, `getTableNames`,
 *      `getIndexNames`, `CURRENT_SCHEMA_VERSION`.
 * @see `commands/maintenance/wipe-legacy-sessions.ts` — sibling
 *      command (mirrors flag-parsing / overrides / exit-code shape).
 */

import { Database } from 'bun:sqlite';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { getRepoRoot } from '../../lib/repo.js';
import { workspaceRoot } from '../../lib/workspace-paths.js';
import {
  CURRENT_SCHEMA_VERSION,
  ensureSchemaV5,
  ensureSchemaV6,
  ensureSchemaV7,
} from '../../workflow/migrations.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi maintenance migrate-state-db [options]

Migrate a state.db file's schema in place to the current workspace-level
version (v${CURRENT_SCHEMA_VERSION}). Idempotent — re-running on an already-current db is
a no-op other than refreshing the schema_meta migrated_at stamp.

Re-runnable on partial failure: every CREATE inside ensureSchemaV7 uses
IF NOT EXISTS, and the chain runs inside a single
db.transaction(...).immediate() so a mid-chain failure rolls back any
partial schema rather than leaving the DB half-applied.

Schema v6 reserves four tables: state_snapshots, tool_calls,
config_changes, and schema_meta. Schema v7 adds prompt_patches — one
row per applied RFC 6902 patch (keyed by prompt_id + patch_id). Writers
for state_snapshots arrive in Wave E.1; tool_calls + config_changes ship
with the hooks / config-management waves. prompt_patches is populated by
gobbi prompt patch (Wave C.1.6). schema_meta is the only one this
command itself writes to.

Options:
  --db <path>   Path to state.db (default: <repoRoot>/.gobbi/state.db)
  --json        Emit a JSON object instead of the human-readable summary.
                Under --json, error paths emit a structured envelope of
                shape {"status":"error","code":"<code>","message":"..."}
                to stderr instead of plain text.
  --help, -h    Show this help message`;

// ---------------------------------------------------------------------------
// Overrides (for tests)
// ---------------------------------------------------------------------------

/**
 * Test-time overrides. Production callers pass `{}`; tests thread a
 * deterministic clock or scratch repo root through these so that
 * `migrated_at` and the default path are predictable.
 */
export interface MigrateStateDbOverrides {
  /** Override repo root (defaults to `getRepoRoot()`). */
  readonly repoRoot?: string;
  /**
   * Override `Date.now()` for the migration stamp. When omitted, the
   * command uses the actual wall clock. Tests pass a fixed value so
   * the JSON output and `schema_meta.migrated_at` are deterministic.
   */
  readonly now?: () => number;
}

// ---------------------------------------------------------------------------
// Result shape
// ---------------------------------------------------------------------------

/**
 * Structured result emitted under `--json`. Also returned from the
 * pure-ish helper {@link migrateStateDbAt} so tests can assert without
 * parsing stdout.
 */
export interface MigrateStateDbResult {
  readonly path: string;
  /**
   * `schema_version` read from the `schema_meta` row before the
   * migration ran. `null` when the row was absent (pre-v6 db that was
   * never stamped). Pretty-printed as the literal string
   * `'(unstamped)'` in human output.
   */
  readonly previousVersion: number | null;
  readonly newVersion: number;
  /**
   * Number of `schema_meta` rows touched by this run. Always `1` under
   * the current single-sentinel-row design — present so the field can
   * widen later if multi-row meta is introduced without breaking the
   * JSON contract.
   */
  readonly rowsTouched: number;
  readonly elapsedMs: number;
}

/**
 * Stable error code surface for the `--json` failure path. The set is
 * deliberately small — operators piping to `jq` need a discriminator,
 * not a verbose taxonomy. New codes are additive only; renames break the
 * wire format and require a major-version note.
 *
 *   - `DB_MISSING`     — pre-flight `existsSync` returned false for the
 *                        target path.
 *   - `MIGRATE_FAILED` — `migrateStateDbAt` threw (corrupt db, permission
 *                        denied at open time, transaction rollback after
 *                        a CREATE failure, …).
 *   - `PARSE_ARGS`     — `parseArgs` rejected the supplied flags. Maps to
 *                        exit code 2 (argv error) rather than 1.
 */
export type MigrateStateDbErrorCode =
  | 'DB_MISSING'
  | 'MIGRATE_FAILED'
  | 'PARSE_ARGS';

/**
 * Structured error envelope emitted on stderr under `--json` when the
 * command fails. Mirrors the success-side {@link MigrateStateDbResult}
 * shape: a single line of well-formed JSON with a fixed key set so
 * `jq -e '.status == "error"'` is reliable.
 */
export interface MigrateStateDbErrorEnvelope {
  readonly status: 'error';
  readonly code: MigrateStateDbErrorCode;
  readonly message: string;
  /**
   * The target path, when known at the failure point. Absent on
   * `PARSE_ARGS` (the path is not yet resolved when argv parsing fails)
   * and present on `DB_MISSING` / `MIGRATE_FAILED`.
   */
  readonly path?: string;
}

/**
 * Emit an error to stderr in the shape demanded by `jsonFlag`.
 *
 * Under `--json` the envelope is a single line of JSON, `{"status":
 * "error", "code":..., "message":..., "path"?:...}` — operators piping
 * to `jq` get the same structured surface on success and failure paths.
 * Under the default (pretty) form the legacy
 * `gobbi maintenance migrate-state-db: <message>\n` shape is preserved
 * so existing terminal output is unchanged.
 *
 * The path is only included in the JSON envelope when the caller passes
 * it — `PARSE_ARGS` failures fire before the path is resolved and pass
 * `undefined`. Object spread in JSON.stringify omits absent fields, so
 * the wire format stays clean either way.
 */
function writeErrorEnvelope(
  jsonFlag: boolean,
  code: MigrateStateDbErrorCode,
  message: string,
  path: string | undefined,
): void {
  if (jsonFlag) {
    const envelope: MigrateStateDbErrorEnvelope =
      path !== undefined
        ? { status: 'error', code, message, path }
        : { status: 'error', code, message };
    process.stderr.write(`${JSON.stringify(envelope)}\n`);
    return;
  }
  process.stderr.write(
    `gobbi maintenance migrate-state-db: ${message}\n`,
  );
}

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

export async function runMigrateStateDb(args: string[]): Promise<void> {
  await runMigrateStateDbWithOptions(args, {});
}

export async function runMigrateStateDbWithOptions(
  args: string[],
  overrides: MigrateStateDbOverrides,
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // Detect `--json` ahead of `parseArgs` so the failure-path envelope is
  // available even when argv parsing itself throws. Cheap heuristic:
  // either `--json` (boolean) or `--json=true`. False-positive risk is
  // minimal — `--json` is not used as a value elsewhere in this command,
  // and parseArgs would reject any malformed shape on the next line.
  const jsonFlag =
    args.includes('--json') || args.some((a) => a.startsWith('--json='));

  // --- 1. Parse flags ----------------------------------------------------
  let dbFlag: string | undefined;
  try {
    const { values } = parseArgs({
      args,
      allowPositionals: false,
      options: {
        db: { type: 'string' },
        json: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
    dbFlag = values.db;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    writeErrorEnvelope(jsonFlag, 'PARSE_ARGS', message, undefined);
    if (!jsonFlag) {
      // Pretty form keeps the legacy USAGE dump after the error line.
      // The JSON form omits it — structured consumers parse the envelope
      // and would have to strip the trailing prose to use the result.
      process.stderr.write(`${USAGE}\n`);
    }
    process.exit(2);
  }

  // --- 2. Resolve target db path ----------------------------------------
  const repoRoot = overrides.repoRoot ?? getRepoRoot();
  const dbPath = dbFlag ?? join(workspaceRoot(repoRoot), 'state.db');

  // --- 3. Pre-flight: file must exist -----------------------------------
  if (!existsSync(dbPath)) {
    writeErrorEnvelope(
      jsonFlag,
      'DB_MISSING',
      `db file not found: ${dbPath}`,
      dbPath,
    );
    process.exit(1);
  }

  // --- 4. Run migration --------------------------------------------------
  let result: MigrateStateDbResult;
  try {
    result = migrateStateDbAt(dbPath, overrides.now);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    writeErrorEnvelope(jsonFlag, 'MIGRATE_FAILED', message, dbPath);
    process.exit(1);
  }

  // --- 5. Render --------------------------------------------------------
  if (jsonFlag) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
    return;
  }
  process.stdout.write(renderPretty(result));
}

// ---------------------------------------------------------------------------
// Migration core (pure-ish — no argv, no process.exit, no stdout)
// ---------------------------------------------------------------------------

/**
 * Open `dbPath`, run the v5 + v6 + v7 schema-ensure chain, and return the
 * structured result. Throws on SQLite-level errors — the caller handles
 * exit-code mapping.
 *
 * The function is exported for tests so they can assert the result
 * shape without re-running the argv parsing path. Production callers go
 * through {@link runMigrateStateDbWithOptions}.
 *
 * `now` defaults to `Date.now`; tests pass a fixed clock so the
 * `schema_meta.migrated_at` stamp is deterministic in JSON snapshots.
 */
export function migrateStateDbAt(
  dbPath: string,
  now: (() => number) | undefined = undefined,
): MigrateStateDbResult {
  const clock = now ?? Date.now;
  const startMs = clock();
  const db = new Database(dbPath);
  try {
    const previousVersion = readSchemaMetaVersion(db);
    // The v5 chain is a column-add on the `events` table. The bare
    // event-store CREATE TABLE is owned by `EventStore.initSchema` and
    // not reproduced here — this command only operates on already-
    // existing event-store files.
    ensureSchemaV5(db);
    // Stamp v6 with the supplied `now` so the JSON output is
    // deterministic under a fixed clock.
    ensureSchemaV6(db, clock());
    // v7 — Wave C.1.2 — additive `prompt_patches` table. Stamp with the
    // same clock so the operator-visible `migrated_at` is the v7 stamp,
    // matching the schema_meta.schema_version that this run advertises.
    ensureSchemaV7(db, clock());
    const elapsedMs = clock() - startMs;
    return {
      path: dbPath,
      previousVersion,
      newVersion: CURRENT_SCHEMA_VERSION,
      // Single `schema_meta` row is the only meta-table mutation
      // v5, v6, or v7 perform. The final INSERT OR REPLACE (v7's stamp)
      // always touches exactly that row.
      rowsTouched: 1,
      elapsedMs,
    };
  } finally {
    db.close();
  }
}

// ---------------------------------------------------------------------------
// schema_meta probe — pre-migration version read
// ---------------------------------------------------------------------------

/**
 * Read the current `schema_meta.schema_version` for the sentinel
 * `'state_db'` row. Returns `null` when the table does not exist (db
 * predates v6) or when the sentinel row has not been written yet.
 *
 * The probe MUST tolerate the missing-table case — running the command
 * against a pre-v6 file is the primary use case, and SQLite's "no such
 * table" error is the expected signal that no prior version stamp
 * exists.
 */
function readSchemaMetaVersion(db: Database): number | null {
  // `sqlite_master` is always present — checking it avoids relying on
  // try/catch around the `schema_meta` read for the missing-table case.
  const tableExists = db
    .query<{ name: string }, [string]>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    )
    .get('schema_meta');
  if (tableExists === null) return null;

  interface MetaRow {
    readonly schema_version: number;
  }
  const row = db
    .query<MetaRow, [string]>(
      'SELECT schema_version FROM schema_meta WHERE id = ?',
    )
    .get('state_db');
  return row === null ? null : row.schema_version;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

export function renderPretty(result: MigrateStateDbResult): string {
  const prevText =
    result.previousVersion === null
      ? '(unstamped)'
      : String(result.previousVersion);
  return [
    'gobbi maintenance migrate-state-db',
    `path: ${result.path}`,
    `previous schema_version: ${prevText}`,
    `new schema_version: ${result.newVersion}`,
    `rows touched: ${result.rowsTouched}`,
    `elapsed: ${result.elapsedMs} ms`,
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Exports for tests
// ---------------------------------------------------------------------------

export { USAGE as MIGRATE_STATE_DB_USAGE };
