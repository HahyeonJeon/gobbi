/**
 * Unit tests for `gobbi maintenance migrate-state-db` — registry wiring,
 * dispatcher routing, and the migration body itself.
 *
 * Covers:
 *   - Subcommand registry: `migrate-state-db` appears in
 *     {@link MAINTENANCE_COMMANDS} alongside `wipe-legacy-sessions`.
 *   - Dispatcher: `--help` lists the new subcommand; routing the new
 *     name reaches the body via the registry.
 *   - Happy path: migrating a v5-shape db creates every v6 table and
 *     index; the schema_meta row is stamped at v6.
 *   - Idempotency: re-running on an already-v6 db is a no-op other than
 *     refreshing the migrated_at stamp; rows touched stays 1.
 *   - Error path: missing db file exits 1 with a clear message; nothing
 *     is created at the requested path.
 *   - `--json` shape: the JSON object carries the documented contract
 *     (path, previousVersion, newVersion, rowsTouched, elapsedMs).
 *
 * Tests operate against scratch directories in the OS temp dir. The
 * dispatcher tests use a deterministic clock via the test override path
 * so the JSON output is stable.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  MAINTENANCE_COMMANDS,
  runMaintenanceWithRegistry,
} from '../../maintenance.js';
import {
  migrateStateDbAt,
  renderPretty,
  runMigrateStateDbWithOptions,
  type MigrateStateDbResult,
} from '../migrate-state-db.js';
import {
  CURRENT_SCHEMA_VERSION,
  SCHEMA_V6_INDICES,
  SCHEMA_V6_TABLES,
  getIndexNames,
  getTableNames,
} from '../../../workflow/migrations.js';

// ---------------------------------------------------------------------------
// stdout/stderr capture + process.exit trap
// ---------------------------------------------------------------------------

interface Captured {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

class ExitCalled extends Error {
  constructor(readonly code: number) {
    super(`process.exit(${code})`);
  }
}

let captured: Captured;
let origStdoutWrite: typeof process.stdout.write;
let origStderrWrite: typeof process.stderr.write;
let origLog: typeof console.log;
let origExit: typeof process.exit;

beforeEach(() => {
  captured = { stdout: '', stderr: '', exitCode: null };
  origStdoutWrite = process.stdout.write;
  origStderrWrite = process.stderr.write;
  origLog = console.log;
  origExit = process.exit;

  process.stdout.write = ((chunk: string | Uint8Array): boolean => {
    captured.stdout +=
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as typeof process.stdout.write;
  process.stderr.write = ((chunk: string | Uint8Array): boolean => {
    captured.stderr +=
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as typeof process.stderr.write;
  console.log = (...args: unknown[]): void => {
    captured.stdout += args.map(String).join(' ') + '\n';
  };
  process.exit = ((code?: number | string | null): never => {
    captured.exitCode = typeof code === 'number' ? code : 0;
    throw new ExitCalled(captured.exitCode);
  }) as typeof process.exit;
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
  console.log = origLog;
  process.exit = origExit;
});

async function captureExit(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    if (err instanceof ExitCalled) return;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Scratch repo helpers
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

function makeRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-migrate-state-db-'));
  scratchDirs.push(dir);
  return dir;
}

/**
 * Build a v5-shape `state.db` at `<repo>/.gobbi/state.db`. Mirrors the
 * shape used by `migrations.test.ts::buildV5Db` so the migration's
 * happy path runs against a realistic events-table schema.
 */
function seedV5StateDb(repo: string): string {
  const gobbiDir = join(repo, '.gobbi');
  mkdirSync(gobbiDir, { recursive: true });
  const dbPath = join(gobbiDir, 'state.db');
  const db = new Database(dbPath);
  try {
    db.run(`
      CREATE TABLE events (
        seq INTEGER PRIMARY KEY,
        ts TEXT NOT NULL,
        schema_version INTEGER NOT NULL,
        type TEXT NOT NULL,
        step TEXT,
        data TEXT NOT NULL DEFAULT '{}',
        actor TEXT NOT NULL,
        parent_seq INTEGER REFERENCES events(seq),
        idempotency_key TEXT NOT NULL UNIQUE,
        session_id TEXT,
        project_id TEXT
      )
    `);
  } finally {
    db.close();
  }
  return dbPath;
}

// ===========================================================================
// Registry presence
// ===========================================================================

describe('MAINTENANCE_COMMANDS — registry includes migrate-state-db', () => {
  test('exposes `migrate-state-db` with a non-empty summary', () => {
    const names = MAINTENANCE_COMMANDS.map((c) => c.name);
    expect(names).toContain('migrate-state-db');
    const entry = MAINTENANCE_COMMANDS.find(
      (c) => c.name === 'migrate-state-db',
    );
    expect(entry).toBeDefined();
    expect(entry?.summary.length).toBeGreaterThan(0);
  });
});

describe('runMaintenanceWithRegistry — migrate-state-db wiring', () => {
  test('--help lists migrate-state-db alongside wipe-legacy-sessions', async () => {
    await captureExit(() =>
      runMaintenanceWithRegistry(['--help'], MAINTENANCE_COMMANDS),
    );
    expect(captured.stdout).toContain('migrate-state-db');
    expect(captured.stdout).toContain('wipe-legacy-sessions');
  });

  test('migrate-state-db --help prints command-specific usage', async () => {
    await captureExit(() =>
      runMaintenanceWithRegistry(
        ['migrate-state-db', '--help'],
        MAINTENANCE_COMMANDS,
      ),
    );
    expect(captured.stdout).toContain(
      'Usage: gobbi maintenance migrate-state-db',
    );
    expect(captured.stdout).toContain('--db');
    expect(captured.stdout).toContain('--json');
  });

  test('unknown maintenance subcommand still exits 1 with stderr error', async () => {
    await captureExit(() =>
      runMaintenanceWithRegistry(['nope'], MAINTENANCE_COMMANDS),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('Unknown subcommand: nope');
    // Both registered subcommands should appear in the help dump.
    expect(captured.stderr).toContain('migrate-state-db');
    expect(captured.stderr).toContain('wipe-legacy-sessions');
  });
});

// ===========================================================================
// Happy path — fresh v5 db migrates cleanly to v6
// ===========================================================================

describe('runMigrateStateDb — fresh v5 db', () => {
  test('creates every v6 table and index; stamps schema_meta at v6', async () => {
    const repo = makeRepo();
    const dbPath = seedV5StateDb(repo);

    const fixedNow = 1745000000000;
    await captureExit(() =>
      runMigrateStateDbWithOptions([], {
        repoRoot: repo,
        now: () => fixedNow,
      }),
    );

    expect(captured.exitCode).toBeNull();

    // Verify every v6 table + index landed.
    const verify = new Database(dbPath);
    try {
      const tables = getTableNames(verify);
      for (const t of SCHEMA_V6_TABLES) {
        expect(tables.has(t)).toBe(true);
      }
      const indices = getIndexNames(verify);
      for (const idx of SCHEMA_V6_INDICES) {
        expect(indices.has(idx)).toBe(true);
      }

      // schema_meta row is stamped at the current version.
      interface MetaRow {
        readonly schema_version: number;
        readonly migrated_at: number;
      }
      const row = verify
        .query<MetaRow, [string]>(
          'SELECT schema_version, migrated_at FROM schema_meta WHERE id = ?',
        )
        .get('state_db');
      expect(row).not.toBeNull();
      expect(row?.schema_version).toBe(CURRENT_SCHEMA_VERSION);
      expect(row?.migrated_at).toBe(fixedNow);
    } finally {
      verify.close();
    }

    // Pretty output reports the version transition.
    expect(captured.stdout).toContain('previous schema_version: (unstamped)');
    expect(captured.stdout).toContain(
      `new schema_version: ${CURRENT_SCHEMA_VERSION}`,
    );
    expect(captured.stdout).toContain('rows touched: 1');
  });

  test('--db flag selects an explicit path outside .gobbi/', async () => {
    const repo = makeRepo();
    // Seed a v5 db at an unconventional location.
    const customDir = join(repo, 'custom');
    mkdirSync(customDir, { recursive: true });
    const customPath = join(customDir, 'alt.db');
    const seed = new Database(customPath);
    try {
      seed.run(`
        CREATE TABLE events (
          seq INTEGER PRIMARY KEY,
          ts TEXT NOT NULL,
          schema_version INTEGER NOT NULL,
          type TEXT NOT NULL,
          step TEXT,
          data TEXT NOT NULL DEFAULT '{}',
          actor TEXT NOT NULL,
          parent_seq INTEGER REFERENCES events(seq),
          idempotency_key TEXT NOT NULL UNIQUE,
          session_id TEXT,
          project_id TEXT
        )
      `);
    } finally {
      seed.close();
    }

    await captureExit(() =>
      runMigrateStateDbWithOptions(['--db', customPath], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain(`path: ${customPath}`);

    // The default-path file should NOT have been created — the flag
    // routes the migration to the explicit path only.
    expect(existsSync(join(repo, '.gobbi', 'state.db'))).toBe(false);
  });
});

// ===========================================================================
// Idempotency — running twice is a no-op other than the migrated_at refresh
// ===========================================================================

describe('runMigrateStateDb — idempotency', () => {
  test('second run on a v6 db succeeds and refreshes migrated_at', async () => {
    const repo = makeRepo();
    const dbPath = seedV5StateDb(repo);

    const t0 = 1745000000000;
    const t1 = 1745000999000;

    // First run — fresh stamp at t0.
    await captureExit(() =>
      runMigrateStateDbWithOptions([], {
        repoRoot: repo,
        now: () => t0,
      }),
    );
    expect(captured.exitCode).toBeNull();

    // Reset capture between runs — only the second run's output matters.
    captured.stdout = '';
    captured.stderr = '';
    captured.exitCode = null;

    // Second run — same db, t1 stamp.
    await captureExit(() =>
      runMigrateStateDbWithOptions([], {
        repoRoot: repo,
        now: () => t1,
      }),
    );
    expect(captured.exitCode).toBeNull();

    const verify = new Database(dbPath);
    try {
      interface MetaRow {
        readonly schema_version: number;
        readonly migrated_at: number;
      }
      const row = verify
        .query<MetaRow, [string]>(
          'SELECT schema_version, migrated_at FROM schema_meta WHERE id = ?',
        )
        .get('state_db');
      expect(row?.schema_version).toBe(CURRENT_SCHEMA_VERSION);
      expect(row?.migrated_at).toBe(t1);

      // Single-row invariant — re-runs do not append history.
      const count = verify
        .query<{ cnt: number }, []>(
          'SELECT count(*) as cnt FROM schema_meta',
        )
        .get();
      expect(count?.cnt).toBe(1);
    } finally {
      verify.close();
    }

    // Second-run pretty output reports the previous version as 6.
    expect(captured.stdout).toContain(
      `previous schema_version: ${CURRENT_SCHEMA_VERSION}`,
    );
    expect(captured.stdout).toContain(
      `new schema_version: ${CURRENT_SCHEMA_VERSION}`,
    );
  });
});

// ===========================================================================
// Error path — missing db file exits 1
// ===========================================================================

describe('runMigrateStateDb — missing db file', () => {
  test('exits 1 with a clear stderr message; no file created at the path', async () => {
    const repo = makeRepo();
    const missingPath = join(repo, '.gobbi', 'state.db');
    // Sanity — no .gobbi/ at all.
    expect(existsSync(join(repo, '.gobbi'))).toBe(false);

    await captureExit(() =>
      runMigrateStateDbWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('db file not found');
    expect(captured.stderr).toContain(missingPath);
    // The command must not have created the file as a side effect.
    expect(existsSync(missingPath)).toBe(false);
  });

  test('explicit --db pointing at a non-existent path also exits 1', async () => {
    const repo = makeRepo();
    const fake = join(repo, 'no-such-dir', 'no-such.db');

    await captureExit(() =>
      runMigrateStateDbWithOptions(['--db', fake], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('db file not found');
    expect(captured.stderr).toContain(fake);
    expect(existsSync(fake)).toBe(false);
  });
});

// ===========================================================================
// --json output contract
// ===========================================================================

describe('runMigrateStateDb — --json output', () => {
  test('emits the documented JSON object shape on a fresh v5 db', async () => {
    const repo = makeRepo();
    const dbPath = seedV5StateDb(repo);

    const fixedNow = 1745000000000;
    await captureExit(() =>
      runMigrateStateDbWithOptions(['--json'], {
        repoRoot: repo,
        now: () => fixedNow,
      }),
    );

    expect(captured.exitCode).toBeNull();
    // Output should be exactly one JSON line plus a trailing newline.
    const trimmed = captured.stdout.trim();
    const parsed: unknown = JSON.parse(trimmed);
    expect(typeof parsed === 'object' && parsed !== null).toBe(true);
    const obj = parsed as Record<string, unknown>;

    expect(obj['path']).toBe(dbPath);
    expect(obj['previousVersion']).toBeNull();
    expect(obj['newVersion']).toBe(CURRENT_SCHEMA_VERSION);
    expect(obj['rowsTouched']).toBe(1);
    expect(typeof obj['elapsedMs']).toBe('number');
    expect((obj['elapsedMs'] as number) >= 0).toBe(true);
  });

  test('--json on a v6 db reports previousVersion as 6', async () => {
    const repo = makeRepo();
    seedV5StateDb(repo);

    // First run to bring the db to v6 — no JSON.
    await captureExit(() =>
      runMigrateStateDbWithOptions([], {
        repoRoot: repo,
        now: () => 1,
      }),
    );
    captured.stdout = '';
    captured.stderr = '';
    captured.exitCode = null;

    // Second run with --json — previousVersion is 6 now.
    await captureExit(() =>
      runMigrateStateDbWithOptions(['--json'], {
        repoRoot: repo,
        now: () => 2,
      }),
    );
    const parsed = JSON.parse(captured.stdout.trim()) as Record<
      string,
      unknown
    >;
    expect(parsed['previousVersion']).toBe(CURRENT_SCHEMA_VERSION);
    expect(parsed['newVersion']).toBe(CURRENT_SCHEMA_VERSION);
  });
});

// ===========================================================================
// --json error envelope (R2 — System F-1 remediation)
//
// Failure paths under `--json` emit a structured envelope to stderr instead
// of the legacy plain-text `gobbi maintenance migrate-state-db: <msg>`. The
// envelope shape is `{status, code, message, path?}`; consumers piping to
// `jq` get the same structured surface on success and failure paths.
// ===========================================================================

describe('runMigrateStateDb — --json error envelope', () => {
  test('DB_MISSING — default path under --json emits structured stderr envelope', async () => {
    const repo = makeRepo();
    const missingPath = join(repo, '.gobbi', 'state.db');
    expect(existsSync(missingPath)).toBe(false);

    await captureExit(() =>
      runMigrateStateDbWithOptions(['--json'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBe(1);
    // stderr must contain a single JSON line — no legacy prose preamble.
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed: unknown = JSON.parse(lines[0] as string);
    expect(typeof parsed === 'object' && parsed !== null).toBe(true);
    const obj = parsed as Record<string, unknown>;
    expect(obj['status']).toBe('error');
    expect(obj['code']).toBe('DB_MISSING');
    expect(typeof obj['message']).toBe('string');
    expect(obj['message']).toContain('db file not found');
    expect(obj['path']).toBe(missingPath);

    // stdout stays clean on the failure path so a `--json` consumer sees
    // either a success object or an error envelope, never both.
    expect(captured.stdout).toBe('');
  });

  test('DB_MISSING — explicit --db with non-existent path emits envelope', async () => {
    const repo = makeRepo();
    const fake = join(repo, 'no-such-dir', 'no-such.db');

    await captureExit(() =>
      runMigrateStateDbWithOptions(['--json', '--db', fake], {
        repoRoot: repo,
      }),
    );

    expect(captured.exitCode).toBe(1);
    const parsed = JSON.parse(captured.stderr.trim()) as Record<
      string,
      unknown
    >;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('DB_MISSING');
    expect(parsed['path']).toBe(fake);
  });

  test('MIGRATE_FAILED — corrupt db under --json emits envelope', async () => {
    const repo = makeRepo();
    const gobbiDir = join(repo, '.gobbi');
    mkdirSync(gobbiDir, { recursive: true });
    const dbPath = join(gobbiDir, 'state.db');
    // Write garbage bytes that bun:sqlite will reject when ALTER /
    // PRAGMA runs. Using a non-empty file ensures the existsSync
    // pre-flight passes and the failure surfaces inside migrateStateDbAt.
    Bun.write(dbPath, 'not a sqlite database — synthetic test garbage');
    // Sanity — the pre-flight should have seen the file.
    expect(existsSync(dbPath)).toBe(true);

    await captureExit(() =>
      runMigrateStateDbWithOptions(['--json'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBe(1);
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<
      string,
      unknown
    >;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('MIGRATE_FAILED');
    expect(typeof parsed['message']).toBe('string');
    expect((parsed['message'] as string).length).toBeGreaterThan(0);
    expect(parsed['path']).toBe(dbPath);
    expect(captured.stdout).toBe('');
  });

  test('PARSE_ARGS — unknown flag under --json emits envelope without USAGE', async () => {
    const repo = makeRepo();

    await captureExit(() =>
      runMigrateStateDbWithOptions(['--json', '--no-such-flag'], {
        repoRoot: repo,
      }),
    );

    expect(captured.exitCode).toBe(2);
    // The JSON failure path must NOT dump the prose USAGE block — the
    // pretty path keeps it for terminal users.
    expect(captured.stderr).not.toContain(
      'Usage: gobbi maintenance migrate-state-db',
    );
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<
      string,
      unknown
    >;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('PARSE_ARGS');
    expect(typeof parsed['message']).toBe('string');
    // path is not yet resolved at parseArgs failure time — must be absent.
    expect('path' in parsed).toBe(false);
  });

  test('default (pretty) form preserves the legacy stderr error shape', async () => {
    // Regression — the JSON path must NOT have changed the pretty path.
    const repo = makeRepo();
    const missingPath = join(repo, '.gobbi', 'state.db');

    await captureExit(() =>
      runMigrateStateDbWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain(
      'gobbi maintenance migrate-state-db: db file not found:',
    );
    expect(captured.stderr).toContain(missingPath);
    // No JSON envelope under pretty form.
    expect(captured.stderr).not.toContain('"status"');
    expect(captured.stderr).not.toContain('"code"');
  });
});

// ===========================================================================
// Downgrade preflight (PR-CFM-B #190 — `--target-version` + `--force`)
//
// `migrate-state-db` must refuse a downgrade attempt at the command level
// (BEFORE any schema writes) when the live `events.schema_version` exceeds
// the requested target. The preflight bypasses with `--force` and emits a
// stderr warning. The per-row throw at `migrations.ts::migrateEvent`
// remains as the data-level second-line safety net regardless of `--force`.
// ===========================================================================

/**
 * Seed an `events` row at the given `schema_version` so the preflight has
 * a concrete value to inspect via `MAX(schema_version)`. The seed predates
 * the migrate run; the migration's idempotent v6 + v7 chain runs against
 * the same db as long as preflight passes.
 */
function seedEventRow(dbPath: string, schemaVersion: number): void {
  const db = new Database(dbPath);
  try {
    db.run(
      `INSERT INTO events
         (ts, schema_version, type, step, data, actor, idempotency_key)
       VALUES (?, ?, ?, NULL, ?, ?, ?)`,
      [
        '2026-05-01T00:00:00.000Z',
        schemaVersion,
        'workflow.start',
        '{}',
        'test',
        `idem-v${schemaVersion}-${Math.random()}`,
      ],
    );
  } finally {
    db.close();
  }
}

describe('runMigrateStateDb — downgrade preflight (#190)', () => {
  test('--target-version 6 against v7 row, no --force → exit 1, DOWNGRADE_BLOCKED envelope carries liveMaxVersion + targetVersion', async () => {
    const repo = makeRepo();
    const dbPath = seedV5StateDb(repo);
    seedEventRow(dbPath, 7);

    await captureExit(() =>
      runMigrateStateDbWithOptions(
        ['--json', '--target-version', '6'],
        { repoRoot: repo },
      ),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stdout).toBe('');
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<
      string,
      unknown
    >;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('DOWNGRADE_BLOCKED');
    expect(parsed['liveMaxVersion']).toBe(7);
    expect(parsed['targetVersion']).toBe(6);
    expect(parsed['path']).toBe(dbPath);
    expect(typeof parsed['message']).toBe('string');
    // Operator-actionable: message names the escape hatch.
    expect((parsed['message'] as string)).toContain('restore-state-db');

    // Sanity — `schema_meta` was NOT stamped (preflight ran before
    // any schema writes).
    const verify = new Database(dbPath);
    try {
      const tableExists = verify
        .query<{ name: string }, [string]>(
          "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
        )
        .get('schema_meta');
      expect(tableExists).toBeNull();
    } finally {
      verify.close();
    }
  });

  test('--target-version 6 --force succeeds; ensure-chain runs to CURRENT_SCHEMA_VERSION (--force only opens preflight gate)', async () => {
    const repo = makeRepo();
    const dbPath = seedV5StateDb(repo);
    seedEventRow(dbPath, 7);

    const fixedNow = 1745000000000;
    await captureExit(() =>
      runMigrateStateDbWithOptions(
        ['--target-version', '6', '--force'],
        { repoRoot: repo, now: () => fixedNow },
      ),
    );

    expect(captured.exitCode).toBeNull();
    // The stderr warning is the operator-visible bypass marker.
    expect(captured.stderr).toContain('warning: --force bypassing downgrade preflight');
    expect(captured.stderr).toContain('v7 rows will throw');
    expect(captured.stderr).toContain('under v6');

    // Even with --force, the chain runs ensureSchemaV5 + V6 + V7 (the
    // chain is idempotent and additive — `--target-version` gates the
    // preflight, not the schema-ensure chain itself). schema_meta is
    // stamped at CURRENT_SCHEMA_VERSION (7) because the chain runs to
    // completion regardless of the requested target version. The
    // preflight's job is "refuse downgrade unless --force"; it does
    // not partially apply migrations or roll back the chain.
    const verify = new Database(dbPath);
    try {
      interface MetaRow {
        readonly schema_version: number;
      }
      const row = verify
        .query<MetaRow, [string]>(
          'SELECT schema_version FROM schema_meta WHERE id = ?',
        )
        .get('state_db');
      expect(row).not.toBeNull();
      expect(row?.schema_version).toBe(CURRENT_SCHEMA_VERSION);
    } finally {
      verify.close();
    }
  });

  test('--target-version 7 against v6 row (forward direction) → exit 0, no preflight block', async () => {
    const repo = makeRepo();
    const dbPath = seedV5StateDb(repo);
    seedEventRow(dbPath, 6);

    await captureExit(() =>
      runMigrateStateDbWithOptions(
        ['--target-version', '7'],
        { repoRoot: repo, now: () => 1 },
      ),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toBe('');
    expect(captured.stdout).toContain('new schema_version: 7');
  });

  test('--target-version 7 against v7 row (no-op direction) → exit 0; preflight maxLive=7=target', async () => {
    const repo = makeRepo();
    const dbPath = seedV5StateDb(repo);
    seedEventRow(dbPath, 7);

    await captureExit(() =>
      runMigrateStateDbWithOptions(
        ['--target-version', '7'],
        { repoRoot: repo, now: () => 1 },
      ),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toBe('');
    // Schema chain still runs idempotently to stamp schema_meta.
    expect(captured.stdout).toContain(
      `new schema_version: ${CURRENT_SCHEMA_VERSION}`,
    );
  });

  test('empty events table + --target-version 6 → exit 0; MAX returns null, no preflight block', async () => {
    const repo = makeRepo();
    seedV5StateDb(repo);
    // No event rows — preflight queries MAX(schema_version) which
    // returns NULL on an empty table; the preflight must NOT block.

    await captureExit(() =>
      runMigrateStateDbWithOptions(
        ['--target-version', '6'],
        { repoRoot: repo, now: () => 1 },
      ),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toBe('');
    // Chain proceeds; schema_meta gets stamped at CURRENT_SCHEMA_VERSION.
    expect(captured.stdout).toContain(
      `new schema_version: ${CURRENT_SCHEMA_VERSION}`,
    );
  });
});

// ===========================================================================
// Pure helper — migrateStateDbAt
// ===========================================================================

describe('migrateStateDbAt', () => {
  test('returns the structured result without writing to stdout', async () => {
    const repo = makeRepo();
    const dbPath = seedV5StateDb(repo);

    const result: MigrateStateDbResult = migrateStateDbAt(
      dbPath,
      () => 1745000000000,
    );

    expect(result.path).toBe(dbPath);
    expect(result.previousVersion).toBeNull();
    expect(result.newVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(result.rowsTouched).toBe(1);
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);

    // No stdout/stderr from the pure helper itself.
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
  });
});

// ===========================================================================
// renderPretty
// ===========================================================================

describe('renderPretty', () => {
  test('formats a stamped previous version as a digit', () => {
    const out = renderPretty({
      path: '/tmp/state.db',
      previousVersion: 5,
      newVersion: 6,
      rowsTouched: 1,
      elapsedMs: 7,
    });
    expect(out).toContain('previous schema_version: 5');
    expect(out).toContain('new schema_version: 6');
    expect(out).toContain('rows touched: 1');
    expect(out).toContain('elapsed: 7 ms');
    expect(out).toContain('path: /tmp/state.db');
  });

  test('formats an unstamped previous version as the literal "(unstamped)"', () => {
    const out = renderPretty({
      path: '/tmp/state.db',
      previousVersion: null,
      newVersion: 6,
      rowsTouched: 1,
      elapsedMs: 0,
    });
    expect(out).toContain('previous schema_version: (unstamped)');
  });
});
