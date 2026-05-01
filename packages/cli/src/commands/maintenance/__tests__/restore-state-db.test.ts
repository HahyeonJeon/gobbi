/**
 * Unit tests for `gobbi maintenance restore-state-db` — registry wiring,
 * dispatcher routing, and the rename-aside + EXDEV-fallback restore body.
 *
 * Covers (12 tests, per ideation §6.7):
 *   1. Subcommand registry: `restore-state-db` appears in
 *      {@link MAINTENANCE_COMMANDS} alongside the existing entries.
 *   2. Dispatcher: `gobbi maintenance --help` lists `restore-state-db`.
 *   3. Dispatcher: `gobbi maintenance restore-state-db --help` exits 0
 *      with the command-specific usage block.
 *   4. Dispatcher: this command's name is recognised (no
 *      "Unknown subcommand" path).
 *   5. Happy path — target absent: backup present, target absent,
 *      restore writes target and exits 0.
 *   6. `BACKUP_MISSING` — backup path does not exist; exit 1 with the
 *      `code: 'BACKUP_MISSING'` envelope under `--json`.
 *   7. `TARGET_EXISTS` without `--force` — both files present; exit 1
 *      with the `code: 'TARGET_EXISTS'` envelope and the operator-actionable
 *      stderr message.
 *   8. `--force` rename-aside — both files present and `--force` passed;
 *      exit 0; the target is replaced; a `<target>.pre-restore.<ts>`
 *      sibling exists holding the pre-restore data.
 *   9. `--json` envelope shape — success result has all documented
 *      fields; `preRestorePath` is present only when `--force` triggered.
 *  10. Idempotency — running twice on the same backup: first succeeds,
 *      second fails with `BACKUP_MISSING` (the backup was consumed).
 *  11. Pure-core helper — `restoreStateDbAt(backupPath, targetPath, ...)`
 *      callable directly; assert the result shape without argv parsing.
 *  12. EXDEV cross-fs fallback — inject a `renameSyncImpl` that throws
 *      `EXDEV`; verify the fallback (copyFile + fsync + unlink) runs and
 *      produces the expected target file.
 *
 * Tests operate against scratch directories in the OS temp dir. The
 * dispatcher tests use a deterministic clock through the test override
 * path so JSON output and pre-restore filenames stay stable.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  MAINTENANCE_COMMANDS,
  runMaintenanceWithRegistry,
} from '../../maintenance.js';
import {
  restoreStateDbAt,
  runRestoreStateDbWithOptions,
  type RestoreStateDbResult,
} from '../restore-state-db.js';
import {
  CURRENT_SCHEMA_VERSION,
  ensureSchemaV5,
  ensureSchemaV6,
  ensureSchemaV7,
} from '../../../workflow/migrations.js';

// ---------------------------------------------------------------------------
// stdout/stderr capture + process.exit trap (mirrors migrate-state-db.test.ts)
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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-restore-state-db-'));
  scratchDirs.push(dir);
  return dir;
}

/**
 * Build a fully-stamped state.db at the supplied path. Used as the
 * "backup" file in restore tests so the sanity-read sees a real
 * `schema_meta.schema_version` row.
 */
function seedStampedDb(path: string, marker: string): void {
  const dir = path.substring(0, path.lastIndexOf('/'));
  mkdirSync(dir, { recursive: true });
  const db = new Database(path);
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
    ensureSchemaV5(db);
    ensureSchemaV6(db, 1700000000000);
    ensureSchemaV7(db, 1700000000000);
    // Tag the file with a marker row so tests can prove which db
    // (backup vs target vs pre-restore sibling) ended up at which path.
    db.run('CREATE TABLE marker (label TEXT NOT NULL)');
    const stmt = db.query<unknown, [string]>(
      'INSERT INTO marker (label) VALUES (?)',
    );
    stmt.run(marker);
  } finally {
    db.close();
  }
}

function readMarker(path: string): string | null {
  const db = new Database(path, { readonly: true });
  try {
    const row = db
      .query<{ label: string }, []>('SELECT label FROM marker LIMIT 1')
      .get();
    return row === null ? null : row.label;
  } catch {
    return null;
  } finally {
    db.close();
  }
}

// ===========================================================================
// 1. Registry presence
// ===========================================================================

describe('MAINTENANCE_COMMANDS — registry includes restore-state-db', () => {
  test('exposes `restore-state-db` with a non-empty summary', () => {
    const names = MAINTENANCE_COMMANDS.map((c) => c.name);
    expect(names).toContain('restore-state-db');
    const entry = MAINTENANCE_COMMANDS.find(
      (c) => c.name === 'restore-state-db',
    );
    expect(entry).toBeDefined();
    expect(entry?.summary.length).toBeGreaterThan(0);
    // The summary should mention the rename-aside semantics so operators
    // browsing `gobbi maintenance --help` see the safety story up front.
    expect(entry?.summary).toContain('--force');
  });
});

// ===========================================================================
// 2-4. Dispatcher wiring
// ===========================================================================

describe('runMaintenanceWithRegistry — restore-state-db wiring', () => {
  test('--help lists restore-state-db alongside other maintenance commands', async () => {
    await captureExit(() =>
      runMaintenanceWithRegistry(['--help'], MAINTENANCE_COMMANDS),
    );
    expect(captured.stdout).toContain('restore-state-db');
    // Sibling entries should still appear — adding the new command must
    // not have shadowed the pre-existing registry.
    expect(captured.stdout).toContain('migrate-state-db');
    expect(captured.stdout).toContain('wipe-legacy-sessions');
  });

  test('restore-state-db --help prints command-specific usage', async () => {
    await captureExit(() =>
      runMaintenanceWithRegistry(
        ['restore-state-db', '--help'],
        MAINTENANCE_COMMANDS,
      ),
    );
    expect(captured.stdout).toContain(
      'Usage: gobbi maintenance restore-state-db',
    );
    expect(captured.stdout).toContain('--backup');
    expect(captured.stdout).toContain('--force');
    expect(captured.stdout).toContain('--json');
  });

  test('the restore-state-db name is a recognised subcommand', async () => {
    // Asserts the restore-state-db handler is reachable through dispatch
    // (no "Unknown subcommand: restore-state-db" path). We invoke with
    // `--help` so the handler exits cleanly without needing a real db.
    await captureExit(() =>
      runMaintenanceWithRegistry(
        ['restore-state-db', '--help'],
        MAINTENANCE_COMMANDS,
      ),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).not.toContain('Unknown subcommand');
  });
});

// ===========================================================================
// 5. Happy path — target absent
// ===========================================================================

describe('runRestoreStateDb — happy path (target absent)', () => {
  test('writes target from backup; exits 0; backup is consumed', async () => {
    const repo = makeRepo();
    const backupPath = join(repo, 'state.db.pre-v7');
    seedStampedDb(backupPath, 'BACKUP-FILE');

    // Default target path: <repoRoot>/.gobbi/state.db. The .gobbi dir
    // does not yet exist — the restore must tolerate that (both rename
    // and copy paths require the parent dir to exist).
    const gobbiDir = join(repo, '.gobbi');
    mkdirSync(gobbiDir, { recursive: true });
    const targetPath = join(gobbiDir, 'state.db');

    await captureExit(() =>
      runRestoreStateDbWithOptions(['--backup', backupPath], {
        repoRoot: repo,
        now: () => 1745000000000,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(targetPath)).toBe(true);
    expect(existsSync(backupPath)).toBe(false);
    expect(readMarker(targetPath)).toBe('BACKUP-FILE');

    // Pretty output reports the version transition + paths.
    expect(captured.stdout).toContain(`backup: ${backupPath}`);
    expect(captured.stdout).toContain(`target: ${targetPath}`);
    expect(captured.stdout).toContain(
      `restored schema_version: ${CURRENT_SCHEMA_VERSION}`,
    );
    // No pre-restore sibling when the target was absent.
    expect(captured.stdout).not.toContain('pre-restore sibling:');
  });
});

// ===========================================================================
// 6. BACKUP_MISSING
// ===========================================================================

describe('runRestoreStateDb — BACKUP_MISSING error envelope', () => {
  test('exit 1 with code: BACKUP_MISSING under --json when backup is absent', async () => {
    const repo = makeRepo();
    const fakeBackup = join(repo, 'no-such.db');
    expect(existsSync(fakeBackup)).toBe(false);

    await captureExit(() =>
      runRestoreStateDbWithOptions(['--json', '--backup', fakeBackup], {
        repoRoot: repo,
      }),
    );

    expect(captured.exitCode).toBe(1);
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<string, unknown>;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('BACKUP_MISSING');
    expect(typeof parsed['message']).toBe('string');
    expect(parsed['message']).toContain('backup file not found');
    expect(parsed['backupPath']).toBe(fakeBackup);
    // stdout stays clean on the failure path.
    expect(captured.stdout).toBe('');
  });
});

// ===========================================================================
// 7. TARGET_EXISTS without --force
// ===========================================================================

describe('runRestoreStateDb — TARGET_EXISTS without --force', () => {
  test('exit 1 with operator-actionable message; target untouched', async () => {
    const repo = makeRepo();
    const backupPath = join(repo, 'state.db.bak');
    const gobbiDir = join(repo, '.gobbi');
    mkdirSync(gobbiDir, { recursive: true });
    const targetPath = join(gobbiDir, 'state.db');

    seedStampedDb(backupPath, 'BACKUP-FILE');
    seedStampedDb(targetPath, 'EXISTING-TARGET');

    await captureExit(() =>
      runRestoreStateDbWithOptions(['--json', '--backup', backupPath], {
        repoRoot: repo,
      }),
    );

    expect(captured.exitCode).toBe(1);
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<string, unknown>;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('TARGET_EXISTS');
    // Operator-actionable: must point at --force as the resolution path.
    expect(parsed['message']).toContain('--force');
    expect(parsed['message']).toContain('pre-restore');
    expect(parsed['targetPath']).toBe(targetPath);

    // Both files still in their original places — refuse-by-default
    // means no side effects.
    expect(existsSync(backupPath)).toBe(true);
    expect(readMarker(targetPath)).toBe('EXISTING-TARGET');
  });
});

// ===========================================================================
// 8. --force rename-aside
// ===========================================================================

describe('runRestoreStateDb — --force rename-aside', () => {
  test('renames existing target to pre-restore.<ts> and swaps in backup', async () => {
    const repo = makeRepo();
    const backupPath = join(repo, 'state.db.bak');
    const gobbiDir = join(repo, '.gobbi');
    mkdirSync(gobbiDir, { recursive: true });
    const targetPath = join(gobbiDir, 'state.db');

    seedStampedDb(backupPath, 'BACKUP-FILE');
    seedStampedDb(targetPath, 'EXISTING-TARGET');

    const fixedNow = 1745000000000;
    await captureExit(() =>
      runRestoreStateDbWithOptions(
        ['--backup', backupPath, '--force'],
        { repoRoot: repo, now: () => fixedNow },
      ),
    );

    expect(captured.exitCode).toBeNull();

    // Target now holds the backup's data.
    expect(existsSync(targetPath)).toBe(true);
    expect(readMarker(targetPath)).toBe('BACKUP-FILE');
    // Backup was consumed by the rename.
    expect(existsSync(backupPath)).toBe(false);
    // The pre-existing target is preserved at the timestamped sibling.
    const preRestorePath = `${targetPath}.pre-restore.${fixedNow}`;
    expect(existsSync(preRestorePath)).toBe(true);
    expect(readMarker(preRestorePath)).toBe('EXISTING-TARGET');

    expect(captured.stdout).toContain(`pre-restore sibling: ${preRestorePath}`);
  });
});

// ===========================================================================
// 9. --json envelope shape
// ===========================================================================

describe('runRestoreStateDb — --json output shape', () => {
  test('success result carries all documented fields; preRestorePath only on --force', async () => {
    const repo = makeRepo();
    const backupPath = join(repo, 'state.db.bak');
    seedStampedDb(backupPath, 'BACKUP-FILE');
    const gobbiDir = join(repo, '.gobbi');
    mkdirSync(gobbiDir, { recursive: true });
    const targetPath = join(gobbiDir, 'state.db');

    // Variant A: target absent — no preRestorePath in the envelope.
    await captureExit(() =>
      runRestoreStateDbWithOptions(
        ['--json', '--backup', backupPath],
        { repoRoot: repo, now: () => 1745000000000 },
      ),
    );

    expect(captured.exitCode).toBeNull();
    // Strip stderr trace; stdout is a single JSON line.
    const trimmed = captured.stdout.trim();
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    expect(parsed['backupPath']).toBe(backupPath);
    expect(parsed['targetPath']).toBe(targetPath);
    expect(parsed['restoredVersion']).toBe(CURRENT_SCHEMA_VERSION);
    expect(typeof parsed['elapsedMs']).toBe('number');
    expect((parsed['elapsedMs'] as number) >= 0).toBe(true);
    // preRestorePath is OMITTED (not undefined) when target was absent.
    expect('preRestorePath' in parsed).toBe(false);

    // Variant B: target present, --force passed — preRestorePath set.
    captured.stdout = '';
    captured.stderr = '';
    captured.exitCode = null;
    const backupPath2 = join(repo, 'state.db.bak2');
    seedStampedDb(backupPath2, 'BACKUP-FILE-2');
    // After variant A, target was created from backup. Reuse it.

    await captureExit(() =>
      runRestoreStateDbWithOptions(
        ['--json', '--backup', backupPath2, '--force'],
        { repoRoot: repo, now: () => 1745000111111 },
      ),
    );
    expect(captured.exitCode).toBeNull();
    const parsed2 = JSON.parse(captured.stdout.trim()) as Record<
      string,
      unknown
    >;
    expect(parsed2['preRestorePath']).toBe(
      `${targetPath}.pre-restore.1745000111111`,
    );
  });
});

// ===========================================================================
// 10. Idempotency — second invocation fails BACKUP_MISSING
// ===========================================================================

describe('runRestoreStateDb — idempotency', () => {
  test('second run on the same backup fails with BACKUP_MISSING (backup consumed)', async () => {
    const repo = makeRepo();
    const backupPath = join(repo, 'state.db.bak');
    seedStampedDb(backupPath, 'BACKUP-FILE');
    mkdirSync(join(repo, '.gobbi'), { recursive: true });

    // First run — succeeds.
    await captureExit(() =>
      runRestoreStateDbWithOptions(['--backup', backupPath], {
        repoRoot: repo,
        now: () => 1,
      }),
    );
    expect(captured.exitCode).toBeNull();

    // Reassign `captured` to a fresh record so subsequent expectations
    // re-widen the type inference for `exitCode`. Mutating the existing
    // object's fields would leave control-flow analysis narrowed to
    // `null` on the field read.
    captured = { stdout: '', stderr: '', exitCode: null };

    // Second run — backup file is gone. Must fail BACKUP_MISSING; must
    // not fall through to TARGET_EXISTS (the pre-flight is ordered:
    // BACKUP_MISSING is checked before TARGET_EXISTS).
    await captureExit(() =>
      runRestoreStateDbWithOptions(['--json', '--backup', backupPath], {
        repoRoot: repo,
      }),
    );

    expect(captured.exitCode).toBe(1);
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<string, unknown>;
    expect(parsed['code']).toBe('BACKUP_MISSING');
  });
});

// ===========================================================================
// 11. Pure-core helper — restoreStateDbAt
// ===========================================================================

describe('restoreStateDbAt', () => {
  test('returns the structured result without writing to stdout', async () => {
    const repo = makeRepo();
    const backupPath = join(repo, 'state.db.bak');
    seedStampedDb(backupPath, 'BACKUP-FILE');
    const targetPath = join(repo, 'restored.db');

    const result: RestoreStateDbResult = restoreStateDbAt(
      backupPath,
      targetPath,
      { force: false },
      () => 1745000000000,
    );

    expect(result.backupPath).toBe(backupPath);
    expect(result.targetPath).toBe(targetPath);
    expect(result.restoredVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(result.preRestorePath).toBeUndefined();
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);

    // Pure core writes the file but emits ONLY the schema_version
    // sanity trace to stderr (per ideation §6.3 step 4). No stdout.
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toContain('schema_version=');

    // Side-effect contract — file moved.
    expect(existsSync(targetPath)).toBe(true);
    expect(existsSync(backupPath)).toBe(false);
  });
});

// ===========================================================================
// 12. EXDEV cross-fs fallback
// ===========================================================================

describe('runRestoreStateDb — EXDEV cross-filesystem fallback', () => {
  test('copyFile + fsync + unlink runs end-to-end when renameSync throws EXDEV', async () => {
    const repo = makeRepo();
    const backupPath = join(repo, 'state.db.bak');
    seedStampedDb(backupPath, 'CROSS-FS-BACKUP');
    const gobbiDir = join(repo, '.gobbi');
    mkdirSync(gobbiDir, { recursive: true });
    const targetPath = join(gobbiDir, 'state.db');

    // Capture original bytes BEFORE the rename — the EXDEV fallback uses
    // copyFileSync, so the post-restore target must be byte-identical
    // to the pre-restore backup.
    const originalBytes = readFileSync(backupPath);

    // Mock renameSync to throw EXDEV exactly once. Subsequent calls are
    // unreachable in the no-pre-existing-target branch (only one rename
    // happens); subsequent --force tests would need a richer stub.
    const exdevError = Object.assign(new Error('EXDEV: cross-device link'), {
      code: 'EXDEV',
    });
    let renameCalls = 0;
    const mockedRename = (_oldPath: string, _newPath: string): void => {
      renameCalls += 1;
      throw exdevError;
    };

    await captureExit(() =>
      runRestoreStateDbWithOptions(['--backup', backupPath], {
        repoRoot: repo,
        now: () => 1745000000000,
        renameSyncImpl: mockedRename,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(renameCalls).toBe(1);

    // The fallback path must have produced a target file …
    expect(existsSync(targetPath)).toBe(true);
    // … byte-identical to the source …
    const restoredBytes = readFileSync(targetPath);
    expect(Buffer.compare(originalBytes, restoredBytes)).toBe(0);
    // … and the backup must have been unlinked (no two-copy residue).
    expect(existsSync(backupPath)).toBe(false);

    // The marker survives the copyFile path (proves the SQLite payload
    // came across intact, not just any same-size byte stream).
    expect(readMarker(targetPath)).toBe('CROSS-FS-BACKUP');
  });
});
