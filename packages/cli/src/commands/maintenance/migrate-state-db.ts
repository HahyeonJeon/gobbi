/**
 * gobbi maintenance migrate-state-db — bring a state.db file's schema up
 * to the current workspace-level version (currently v6).
 *
 * ## Context (v0.5.0 Wave A.1.4 — issue #146)
 *
 * Wave A.1 adds schema v6 to the event-store DB: four new workspace-
 * partitioned tables (`state_snapshots`, `tool_calls`, `config_changes`,
 * `schema_meta`) plus their indices. The `EventStore.initSchema` path
 * auto-applies the migration when an `EventStore` opens, so most
 * sessions never need to invoke this command. It exists for two cases
 * the auto-apply does not cover:
 *
 *   1. An on-disk `state.db` that has not yet been opened by an
 *      `EventStore` since the v6 bump — running this command stamps
 *      the schema_meta row and creates the new tables ahead of the
 *      first session-opening.
 *   2. Operator wants a deterministic, reportable migration step —
 *      e.g., before a snapshot/backup, or as part of a Flyway-style
 *      "baseline-on-migrate" handoff (orchestration README §3.5).
 *
 * The command is intentionally narrow:
 *
 *   - It opens the supplied `state.db` directly (no `EventStore`
 *     wrapper) so it can run on any pre-v6 file without depending on
 *     the EventStore constructor's partition-key resolution.
 *   - It runs `ensureSchemaV5(db)` then `ensureSchemaV6(db)` — both
 *     idempotent — so the chain catches up regardless of starting
 *     version, and re-running on a v6 file is a no-op other than
 *     refreshing the `migrated_at` stamp.
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
 *   - `0` — migration succeeded (or was a no-op on an already-v6 db).
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
 *     previous schema_version: 5
 *     new schema_version: 6
 *     rows touched: 1
 *     elapsed: 4 ms
 *
 * Structured form (`--json`):
 *
 *     {"path": "...", "previousVersion": 5, "newVersion": 6,
 *      "rowsTouched": 1, "elapsedMs": 4}
 *
 * @see `packages/cli/src/workflow/migrations.ts` — `ensureSchemaV6`,
 *      `SCHEMA_V6_TABLES`, `SCHEMA_V6_INDICES`, `getTableNames`,
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
} from '../../workflow/migrations.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi maintenance migrate-state-db [options]

Migrate a state.db file's schema in place to the current workspace-level
version (v${CURRENT_SCHEMA_VERSION}). Idempotent — re-running on an already-current db is
a no-op other than refreshing the schema_meta migrated_at stamp.

Options:
  --db <path>   Path to state.db (default: <repoRoot>/.gobbi/state.db)
  --json        Emit a JSON object instead of the human-readable summary
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

  // --- 1. Parse flags ----------------------------------------------------
  let dbFlag: string | undefined;
  let jsonFlag = false;
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
    jsonFlag = values.json === true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      `gobbi maintenance migrate-state-db: ${message}\n`,
    );
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  // --- 2. Resolve target db path ----------------------------------------
  const repoRoot = overrides.repoRoot ?? getRepoRoot();
  const dbPath = dbFlag ?? join(workspaceRoot(repoRoot), 'state.db');

  // --- 3. Pre-flight: file must exist -----------------------------------
  if (!existsSync(dbPath)) {
    process.stderr.write(
      `gobbi maintenance migrate-state-db: db file not found: ${dbPath}\n`,
    );
    process.exit(1);
  }

  // --- 4. Run migration --------------------------------------------------
  let result: MigrateStateDbResult;
  try {
    result = migrateStateDbAt(dbPath, overrides.now);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      `gobbi maintenance migrate-state-db: ${message}\n`,
    );
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
 * Open `dbPath`, run the v5 + v6 schema-ensure chain, and return the
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
    const elapsedMs = clock() - startMs;
    return {
      path: dbPath,
      previousVersion,
      newVersion: CURRENT_SCHEMA_VERSION,
      // Single `schema_meta` row is the only meta-table mutation
      // either v5 or v6 performs. v6's INSERT OR REPLACE always
      // touches exactly that row.
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
