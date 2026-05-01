/**
 * gobbi maintenance restore-state-db — revert a workspace `state.db` file
 * from an operator-created `.bak` companion. Pure file-level rename (with
 * a cross-filesystem `EXDEV` copy fallback). Companion to
 * `migrate-state-db.ts` per the orchestration design contract at
 * `.gobbi/projects/gobbi/design/v050-features/gobbi-memory/scenarios.md:287-293`.
 *
 * ## Scope (PR-CFM-B — issue #169 narrow / Option B)
 *
 * The narrow Option B scope: this command **reverts** an operator-supplied
 * backup; it does NOT auto-create `.bak` files inside `migrate-state-db`.
 * The full SC-ORCH-21 design contract (auto-backup-on-migrate) remains
 * partially fulfilled and is acknowledged as future-PR scope (Option A
 * deferred per PR-CFM-B user lock 5). Operators take backups manually
 * before invoking migrate; see the `Manual workflow` section in `--help`
 * below.
 *
 * ## Mechanism (rename-aside under `--force`)
 *
 *   1. Pre-flight `existsSync(backupPath)` → else exit 1 with
 *      `BACKUP_MISSING`.
 *   2. Resolve the target path (default `<repoRoot>/.gobbi/state.db`).
 *   3. Pre-flight target existence:
 *
 *        - **Absent** → proceed (pure restore, simplest path).
 *        - **Present, no `--force`** → exit 1 with `TARGET_EXISTS`. The
 *          stderr message instructs the operator to re-run with `--force`
 *          if they accept the rename-aside semantics below.
 *        - **Present, `--force`** → atomically rename
 *          `<targetPath>` → `<targetPath>.pre-restore.<unix-ts>`. The
 *          existing target is **renamed**, never deleted (Postgres data-
 *          file precedent — never lose pre-restore state; the operator
 *          can purge the `.pre-restore.<ts>` sibling once confident).
 *   4. Brief sanity-read of the backup's `schema_meta.schema_version` —
 *      logged to stderr as a defensive trace, never blocking.
 *   5. **Move backup → target.** Preferred path is an atomic same-fs
 *      `renameSync`. The cross-filesystem path (catch `EXDEV`) falls back
 *      to `copyFileSync` + `fsyncSync` + `unlinkSync` so the durable
 *      target is observed before the source is consumed.
 *
 * ## "Never delete the target" semantics
 *
 * The Postgres data-file rule applies only to the **target**: the
 * pre-existing target is renamed aside, never deleted. The **backup**, on
 * the other hand, is consumed by the restore — a successful same-fs
 * rename moves the backup file to the target path, and a successful
 * EXDEV copy fallback explicitly unlinks the source backup so that the
 * operator's filesystem does not end up with two identical files. If the
 * operator wants to retain a copy of the backup beyond the restore, they
 * should `cp` it before invoking this command. Manual workflow is
 * documented in `--help`.
 *
 * ## Concurrent-writer caveat
 *
 * This command does NOT detect open `EventStore` handles via
 * `PRAGMA database_list` (per ideation §6.5: best-stance proposal not
 * selected). If another process holds the target `.db` open during the
 * rename, the rename succeeds at the filesystem layer but the holder's
 * SQLite handle now points at the renamed-aside file. Operators should
 * stop active gobbi workflow sessions before invoking restore.
 *
 * ## Default DB path
 *
 * When `--db` is omitted, the command defaults to
 * `<repoRoot>/.gobbi/state.db`. This mirrors the path resolution used by
 * the sibling `migrate-state-db.ts` command via {@link getRepoRoot} +
 * {@link workspaceRoot}.
 *
 * ## Exit codes
 *
 *   - `0` — restore succeeded (target file in place; backup consumed).
 *   - `1` — restore failed (`BACKUP_MISSING`, `TARGET_EXISTS`, or
 *           `RESTORE_FAILED`). Error message printed to stderr.
 *   - `2` — argument parse error.
 *
 * ## Output
 *
 * Pretty form (default):
 *
 *     gobbi maintenance restore-state-db
 *     backup: /repo/.gobbi/state.db.pre-v7
 *     target: /repo/.gobbi/state.db
 *     restored schema_version: 6
 *     pre-restore sibling: /repo/.gobbi/state.db.pre-restore.1745000000000
 *     elapsed: 4 ms
 *
 * Structured form (`--json`):
 *
 *     {"backupPath":"...","targetPath":"...","restoredVersion":6,
 *      "preRestorePath":"...","elapsedMs":4}
 *
 * @see `commands/maintenance/migrate-state-db.ts` — sibling command and
 *      shape template (argv shell, pure core, JSON envelope, exit codes).
 * @see `.gobbi/projects/gobbi/design/v050-features/gobbi-memory/scenarios.md:287-293`
 *      — orchestration design contract for the restore mechanism.
 */

import { Database } from 'bun:sqlite';
import {
  copyFileSync,
  closeSync,
  existsSync,
  fsyncSync,
  openSync,
  renameSync,
  unlinkSync,
} from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { getRepoRoot } from '../../lib/repo.js';
import { workspaceRoot } from '../../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi maintenance restore-state-db --backup <path> [options]

Revert a state.db file from an operator-created backup. Pure file-level
rename; does NOT data-level downgrade. Safe to run when the workspace
state.db has been corrupted or its schema has been advanced past a
version the operator wants to roll back from.

The companion command does NOT auto-create backups inside
migrate-state-db (see PR-CFM-B / Option B narrow scope). Operators
take backups manually:

  cp <repoRoot>/.gobbi/state.db <repoRoot>/.gobbi/state.db.pre-v8

Restore later:

  gobbi maintenance restore-state-db --backup <repoRoot>/.gobbi/state.db.pre-v8

When the target file already exists, the restore refuses by default. Re-
run with --force to rename the existing target to
<target>.pre-restore.<unix-ts> before swapping in the backup. The pre-
restore sibling is renamed, NEVER deleted — the operator purges it
manually once confident.

Note: the backup file itself is consumed by the restore. If you want to
retain a copy beyond the rename, cp it first.

Stop active gobbi workflow sessions before invoking restore: this
command does NOT detect open EventStore handles, so a concurrent
holder's SQLite handle would silently follow the renamed-aside file.

Options:
  --backup <path>   Path to the backup file (required).
  --db <path>       Path to the target state.db
                    (default: <repoRoot>/.gobbi/state.db).
  --force           Rename an existing target to
                    <target>.pre-restore.<unix-ts> instead of refusing.
  --json            Emit a JSON object instead of the human-readable
                    summary. Under --json, error paths emit a structured
                    envelope of shape
                    {"status":"error","code":"<code>","message":"..."}
                    to stderr instead of plain text.
  --help, -h        Show this help message`;

// ---------------------------------------------------------------------------
// Overrides (for tests)
// ---------------------------------------------------------------------------

/**
 * Test-time overrides. Production callers pass `{}`; tests thread a
 * deterministic clock or scratch repo root through these so that
 * `pre-restore.<ts>` filenames and `elapsedMs` are predictable.
 */
export interface RestoreStateDbOverrides {
  /** Override repo root (defaults to `getRepoRoot()`). */
  readonly repoRoot?: string;
  /**
   * Override `Date.now()` for the pre-restore-sibling timestamp suffix
   * and elapsed-ms accounting. When omitted, the command uses the actual
   * wall clock. Tests pass a fixed value so the JSON output and
   * sibling filename are deterministic.
   */
  readonly now?: () => number;
  /**
   * Test-only injection point for the EXDEV cross-filesystem fallback.
   * When supplied, this function replaces `renameSync` from `node:fs` at
   * the swap-in step (step 5 of the mechanism). Tests pass a function
   * that throws an `EXDEV`-coded error to exercise the copy+fsync+unlink
   * fallback branch end-to-end. Production callers omit this field.
   */
  readonly renameSyncImpl?: (oldPath: string, newPath: string) => void;
}

// ---------------------------------------------------------------------------
// Result shape
// ---------------------------------------------------------------------------

/**
 * Structured result emitted under `--json`. Also returned from the
 * pure-ish helper {@link restoreStateDbAt} so tests can assert without
 * parsing stdout.
 */
export interface RestoreStateDbResult {
  /** Original backup path (now consumed). */
  readonly backupPath: string;
  /** Final target path (post-restore). */
  readonly targetPath: string;
  /**
   * `schema_meta.schema_version` read from the backup before swap. `null`
   * when the backup predates schema_meta (pre-v6) or the table is absent.
   * Emitted as a defensive trace; not blocking.
   */
  readonly restoredVersion: number | null;
  /**
   * Path the pre-existing target was renamed to (only set when `--force`
   * triggered the rename-aside). Absent when the target was missing
   * before the restore began.
   */
  readonly preRestorePath?: string;
  readonly elapsedMs: number;
}

/**
 * Stable error code surface for the `--json` failure path. The set is
 * deliberately small — operators piping to `jq` need a discriminator,
 * not a verbose taxonomy. New codes are additive only; renames break the
 * wire format and require a major-version note.
 *
 *   - `BACKUP_MISSING`  — pre-flight `existsSync` returned false for the
 *                         supplied `--backup` path.
 *   - `TARGET_EXISTS`   — the target file is already present and
 *                         `--force` was not supplied.
 *   - `RESTORE_FAILED`  — the rename or copy-fallback threw (cross-fs
 *                         copy error, permission denied, fsync failure).
 *   - `PARSE_ARGS`      — `parseArgs` rejected the supplied flags. Maps
 *                         to exit code 2 (argv error) rather than 1.
 */
export type RestoreStateDbErrorCode =
  | 'BACKUP_MISSING'
  | 'TARGET_EXISTS'
  | 'RESTORE_FAILED'
  | 'PARSE_ARGS';

/**
 * Structured error envelope emitted on stderr under `--json` when the
 * command fails. Mirrors the success-side {@link RestoreStateDbResult}
 * shape: a single line of well-formed JSON with a fixed key set so
 * `jq -e '.status == "error"'` is reliable.
 */
export interface RestoreStateDbErrorEnvelope {
  readonly status: 'error';
  readonly code: RestoreStateDbErrorCode;
  readonly message: string;
  /** Backup path supplied via `--backup`, when known at the failure point. */
  readonly backupPath?: string;
  /** Resolved target path, when known at the failure point. */
  readonly targetPath?: string;
}

/**
 * Emit an error to stderr in the shape demanded by `jsonFlag`.
 *
 * Under `--json` the envelope is a single line of JSON with a stable
 * key set; operators piping to `jq` get the same structured surface on
 * success and failure paths. Under the pretty default form, the legacy
 * `gobbi maintenance restore-state-db: <message>\n` shape is used.
 *
 * Path fields are only included when the caller supplies them — argv-
 * parse failures fire before paths are resolved and pass `undefined`.
 */
function writeErrorEnvelope(
  jsonFlag: boolean,
  code: RestoreStateDbErrorCode,
  message: string,
  paths: { backupPath?: string; targetPath?: string },
): void {
  if (jsonFlag) {
    const envelope: RestoreStateDbErrorEnvelope = {
      status: 'error',
      code,
      message,
      ...(paths.backupPath !== undefined
        ? { backupPath: paths.backupPath }
        : {}),
      ...(paths.targetPath !== undefined
        ? { targetPath: paths.targetPath }
        : {}),
    };
    process.stderr.write(`${JSON.stringify(envelope)}\n`);
    return;
  }
  process.stderr.write(
    `gobbi maintenance restore-state-db: ${message}\n`,
  );
}

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

export async function runRestoreStateDb(args: string[]): Promise<void> {
  await runRestoreStateDbWithOptions(args, {});
}

export async function runRestoreStateDbWithOptions(
  args: string[],
  overrides: RestoreStateDbOverrides,
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // Detect `--json` ahead of `parseArgs` so the failure-path envelope is
  // available even when argv parsing itself throws (mirrors
  // `migrate-state-db.ts`).
  const jsonFlag =
    args.includes('--json') || args.some((a) => a.startsWith('--json='));

  // --- 1. Parse flags ----------------------------------------------------
  let backupFlag: string | undefined;
  let dbFlag: string | undefined;
  let forceFlag = false;
  try {
    const { values } = parseArgs({
      args,
      allowPositionals: false,
      options: {
        backup: { type: 'string' },
        db: { type: 'string' },
        force: { type: 'boolean', default: false },
        json: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
    backupFlag = values.backup;
    dbFlag = values.db;
    forceFlag = values.force === true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    writeErrorEnvelope(jsonFlag, 'PARSE_ARGS', message, {});
    if (!jsonFlag) {
      process.stderr.write(`${USAGE}\n`);
    }
    process.exit(2);
  }

  // --- 2. Require --backup ----------------------------------------------
  if (backupFlag === undefined) {
    writeErrorEnvelope(
      jsonFlag,
      'PARSE_ARGS',
      '--backup <path> is required',
      {},
    );
    if (!jsonFlag) {
      process.stderr.write(`${USAGE}\n`);
    }
    process.exit(2);
  }

  // --- 3. Resolve target path -------------------------------------------
  const repoRoot = overrides.repoRoot ?? getRepoRoot();
  const targetPath = dbFlag ?? join(workspaceRoot(repoRoot), 'state.db');

  // --- 4. Pre-flight: backup must exist ---------------------------------
  if (!existsSync(backupFlag)) {
    writeErrorEnvelope(
      jsonFlag,
      'BACKUP_MISSING',
      `backup file not found: ${backupFlag}`,
      { backupPath: backupFlag, targetPath },
    );
    process.exit(1);
  }

  // --- 5. Pre-flight: target existence + --force ------------------------
  if (existsSync(targetPath) && !forceFlag) {
    writeErrorEnvelope(
      jsonFlag,
      'TARGET_EXISTS',
      `target already exists: ${targetPath}. Use --force to rename existing target to <target>.pre-restore.<unix-ts>`,
      { backupPath: backupFlag, targetPath },
    );
    process.exit(1);
  }

  // --- 6. Run restore ---------------------------------------------------
  let result: RestoreStateDbResult;
  try {
    result = restoreStateDbAt(
      backupFlag,
      targetPath,
      { force: forceFlag },
      overrides.now,
      overrides.renameSyncImpl,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    writeErrorEnvelope(jsonFlag, 'RESTORE_FAILED', message, {
      backupPath: backupFlag,
      targetPath,
    });
    process.exit(1);
  }

  // --- 7. Render --------------------------------------------------------
  if (jsonFlag) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
    return;
  }
  process.stdout.write(renderPretty(result));
}

// ---------------------------------------------------------------------------
// Restore core (pure-ish — no argv, no process.exit, no stdout)
// ---------------------------------------------------------------------------

/**
 * Perform the rename-aside + swap restore. Throws on filesystem-level
 * failures; the caller maps to exit codes. The function assumes both
 * pre-flight checks (`backupPath` exists, `targetPath` either absent or
 * the caller authorised `--force`) have already been satisfied.
 *
 * The `renameSyncImpl` parameter is a test-only seam used to inject an
 * `EXDEV`-throwing implementation that exercises the cross-filesystem
 * fallback branch. Production callers omit it; the function falls back
 * to `node:fs::renameSync` directly.
 *
 * `now` defaults to `Date.now`; tests pass a fixed clock so the
 * `pre-restore.<ts>` filename is deterministic in JSON snapshots.
 */
export function restoreStateDbAt(
  backupPath: string,
  targetPath: string,
  options: { readonly force?: boolean } = {},
  now: (() => number) | undefined = undefined,
  renameSyncImpl: ((oldPath: string, newPath: string) => void) | undefined =
    undefined,
): RestoreStateDbResult {
  const clock = now ?? Date.now;
  const startMs = clock();
  const rename = renameSyncImpl ?? renameSync;

  // --- Step A: rename-aside under --force when the target exists -------
  let preRestorePath: string | undefined;
  if (options.force === true && existsSync(targetPath)) {
    preRestorePath = `${targetPath}.pre-restore.${clock()}`;
    // Use the SAME rename impl seam so tests that mock EXDEV on the swap
    // do not also fail on the rename-aside. In practice the rename-aside
    // is same-fs (target and the moved-aside sibling share a directory),
    // so production callers see no EXDEV here.
    rename(targetPath, preRestorePath);
  }

  // --- Step B: defensive sanity-read of backup schema_version -----------
  // Logged to stderr as a non-blocking trace per ideation §6.3 step 4.
  // Failures here MUST NOT abort the restore — the file may be a pre-
  // schema_meta legacy db.
  let restoredVersion: number | null = null;
  try {
    const probe = new Database(backupPath, { readonly: true, strict: true });
    try {
      restoredVersion = readSchemaMetaVersion(probe);
    } finally {
      probe.close();
    }
  } catch {
    // Best-effort — the read is a defensive trace. The restore proceeds
    // even on corrupt or non-sqlite backups (a corrupt rename target
    // would surface its own error from the operator's downstream usage).
    restoredVersion = null;
  }
  if (restoredVersion !== null) {
    process.stderr.write(
      `restore-state-db: backup schema_version=${restoredVersion}\n`,
    );
  } else {
    process.stderr.write(
      `restore-state-db: backup schema_version=(unstamped)\n`,
    );
  }

  // --- Step C: move backup → target with EXDEV fallback ----------------
  // The codebase has no prior precedent for the EXDEV cross-filesystem
  // pattern; this is the canonical site. The ordering — copy, fsync,
  // unlink — guarantees the durable target is observed on disk before
  // the source is consumed, so a crash mid-fallback leaves the operator
  // with both files rather than neither.
  try {
    rename(backupPath, targetPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'EXDEV') {
      throw err;
    }
    copyFileSync(backupPath, targetPath);
    const fd = openSync(targetPath, 'r');
    try {
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    unlinkSync(backupPath);
  }

  const elapsedMs = clock() - startMs;
  return {
    backupPath,
    targetPath,
    restoredVersion,
    ...(preRestorePath !== undefined ? { preRestorePath } : {}),
    elapsedMs,
  };
}

// ---------------------------------------------------------------------------
// schema_meta probe — backup version trace
// ---------------------------------------------------------------------------

/**
 * Read the current `schema_meta.schema_version` for the sentinel
 * `'state_db'` row. Returns `null` when the table does not exist (db
 * predates v6) or when the sentinel row has not been written yet.
 *
 * The probe MUST tolerate the missing-table case — a pre-v6 backup is a
 * legitimate restore target (the operator may want to roll back to
 * before schema_meta even existed).
 */
function readSchemaMetaVersion(db: Database): number | null {
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

export function renderPretty(result: RestoreStateDbResult): string {
  const versionText =
    result.restoredVersion === null
      ? '(unstamped)'
      : String(result.restoredVersion);
  const lines = [
    'gobbi maintenance restore-state-db',
    `backup: ${result.backupPath}`,
    `target: ${result.targetPath}`,
    `restored schema_version: ${versionText}`,
  ];
  if (result.preRestorePath !== undefined) {
    lines.push(`pre-restore sibling: ${result.preRestorePath}`);
  }
  lines.push(`elapsed: ${result.elapsedMs} ms`);
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Exports for tests
// ---------------------------------------------------------------------------

export { USAGE as RESTORE_STATE_DB_USAGE };
