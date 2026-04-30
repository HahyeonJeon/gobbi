/**
 * Unit tests for `gobbi maintenance wipe-legacy-sessions` — the registry
 * wiring, subcommand dispatch, and the command body itself.
 *
 * Covers:
 *   - Top-level registry: `maintenance` appears in `COMMAND_ORDER` and
 *     `COMMANDS_BY_NAME`.
 *   - Subcommand registry: `wipe-legacy-sessions` appears in
 *     `MAINTENANCE_COMMANDS`.
 *   - Dispatcher: `--help` lists subcommands; unknown subcommand exits 1.
 *   - Happy path: every legacy session is deleted; `.gobbi/projects/`
 *     is never touched, even when a per-project session exists there.
 *   - `--dry-run`: prints the plan and deletes nothing.
 *   - Summary line: `"N session(s) wiped"`.
 *
 * Post-PR-FIN-2a-i T-2a.1.5: the active-session guard was removed.
 * The wipe is now an unconditional `rm -rf .gobbi/sessions/<id>/` for
 * every legacy directory; tests that asserted the refusal path were
 * deleted alongside the helpers.
 *
 * All tests operate against scratch directories in the OS temp dir.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { COMMAND_ORDER, COMMANDS_BY_NAME } from '../../../cli.js';
import {
  MAINTENANCE_COMMANDS,
  runMaintenanceWithRegistry,
  type MaintenanceCommand,
} from '../../maintenance.js';
import {
  isLegacyPerProjectSession,
  renderSummary,
  runWipeLegacySessionsWithOptions,
} from '../wipe-legacy-sessions.js';

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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-wipe-legacy-'));
  scratchDirs.push(dir);
  return dir;
}

/** Seed a legacy session directory; the contents do not matter for the
 *  unconditional wipe (T-2a.1.5 dropped the state.json reads). A marker
 *  file is written so each scratch directory is non-empty and the
 *  recursive delete has something tangible to remove. */
function seedLegacy(repo: string, sessionId: string): string {
  const dir = join(repo, '.gobbi', 'sessions', sessionId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'marker'), sessionId, 'utf8');
  return dir;
}

function seedProject(
  repo: string,
  projectName: string,
  sessionId: string,
): string {
  const dir = join(
    repo,
    '.gobbi',
    'projects',
    projectName,
    'sessions',
    sessionId,
  );
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'marker'), sessionId, 'utf8');
  return dir;
}

// ===========================================================================
// Registry presence
// ===========================================================================

describe('top-level registry', () => {
  test('`maintenance` is registered in COMMAND_ORDER and COMMANDS_BY_NAME', () => {
    expect(COMMAND_ORDER).toContain('maintenance');
    expect(COMMANDS_BY_NAME.maintenance.name).toBe('maintenance');
    expect(COMMANDS_BY_NAME.maintenance.summary.length).toBeGreaterThan(0);
  });
});

describe('MAINTENANCE_COMMANDS', () => {
  test('exposes `wipe-legacy-sessions` with a non-empty summary', () => {
    const names = MAINTENANCE_COMMANDS.map((c) => c.name);
    expect(names).toContain('wipe-legacy-sessions');
    for (const cmd of MAINTENANCE_COMMANDS) {
      expect(cmd.name.length).toBeGreaterThan(0);
      expect(cmd.summary.length).toBeGreaterThan(0);
    }
  });
});

// ===========================================================================
// Dispatcher
// ===========================================================================

describe('runMaintenanceWithRegistry — help', () => {
  test('--help lists every registered subcommand', async () => {
    const registry: MaintenanceCommand[] = [
      {
        name: 'alpha',
        summary: 'stub alpha',
        run: async (): Promise<void> => undefined,
      },
      {
        name: 'beta',
        summary: 'stub beta',
        run: async (): Promise<void> => undefined,
      },
    ];
    await captureExit(() => runMaintenanceWithRegistry(['--help'], registry));
    expect(captured.stdout).toContain('alpha');
    expect(captured.stdout).toContain('stub alpha');
    expect(captured.stdout).toContain('beta');
  });

  test('empty args produces help output', async () => {
    await captureExit(() =>
      runMaintenanceWithRegistry([], MAINTENANCE_COMMANDS),
    );
    expect(captured.stdout).toContain('Usage: gobbi maintenance');
    expect(captured.stdout).toContain('wipe-legacy-sessions');
  });
});

describe('runMaintenanceWithRegistry — dispatch', () => {
  test('unknown subcommand exits 1 with error line on stderr', async () => {
    await captureExit(() =>
      runMaintenanceWithRegistry(['nope'], MAINTENANCE_COMMANDS),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('Unknown subcommand: nope');
    expect(captured.stderr).toContain('wipe-legacy-sessions');
  });

  test('routes to matching registry entry and forwards trailing args', async () => {
    const state: { ran?: boolean; args?: string[] } = {};
    const registry: MaintenanceCommand[] = [
      {
        name: 'foo',
        summary: 'stub',
        run: async (args: string[]): Promise<void> => {
          state.ran = true;
          state.args = args;
        },
      },
    ];
    await captureExit(() =>
      runMaintenanceWithRegistry(['foo', '--x', '1'], registry),
    );
    expect(state.ran).toBe(true);
    expect(state.args).toEqual(['--x', '1']);
  });
});

// ===========================================================================
// Happy path: deletes every legacy session unconditionally
// ===========================================================================

describe('runWipeLegacySessions — deletes every legacy session', () => {
  test('deletes every legacy session and reports N wiped', async () => {
    const repo = makeRepo();
    const a = seedLegacy(repo, 'one');
    const b = seedLegacy(repo, 'two');
    const c = seedLegacy(repo, 'three');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(a)).toBe(false);
    expect(existsSync(b)).toBe(false);
    expect(existsSync(c)).toBe(false);

    // Summary reflects the 3 deletions.
    expect(captured.stdout).toContain('3 sessions wiped');
  });

  test('does NOT touch .gobbi/projects/ even when it contains sessions', async () => {
    const repo = makeRepo();
    seedLegacy(repo, 'legacy');
    const projectSession = seedProject(repo, 'foo', 'live');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(join(repo, '.gobbi', 'sessions', 'legacy'))).toBe(false);
    // Per-project session still present — out of scope for this command,
    // intentionally.
    expect(existsSync(projectSession)).toBe(true);
  });

  test('no legacy sessions on disk → exits 0 with zero wiped summary', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('0 sessions wiped');
  });

  test('singular pluralization for exactly one session', async () => {
    const repo = makeRepo();
    seedLegacy(repo, 'only');
    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('1 session wiped');
  });

  test('wipes regardless of state.json contents (no guard post-T-2a.1.5)', async () => {
    // Seed a session whose state.json claims it is mid-flight; under the
    // pre-T-2a.1.5 design this would have blocked the wipe. After dropping
    // the active-sessions helpers, the wipe deletes it unconditionally.
    const repo = makeRepo();
    const dir = seedLegacy(repo, 'mid-flight');
    writeFileSync(
      join(dir, 'state.json'),
      JSON.stringify({ currentStep: 'execution' }),
      'utf8',
    );

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(dir)).toBe(false);
  });
});

// ===========================================================================
// --dry-run
// ===========================================================================

describe('runWipeLegacySessions — --dry-run', () => {
  test('prints planned deletions but deletes nothing', async () => {
    const repo = makeRepo();
    const a = seedLegacy(repo, 'one');
    const b = seedLegacy(repo, 'two');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions(['--dry-run'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Would wipe');
    expect(captured.stdout).toContain('one');
    expect(captured.stdout).toContain('two');
    expect(captured.stdout).toContain('[dry-run]');
    expect(captured.stdout).toContain('2 sessions wiped');

    // Nothing deleted.
    expect(existsSync(a)).toBe(true);
    expect(existsSync(b)).toBe(true);
  });
});

// ===========================================================================
// Helpers (renderers)
// ===========================================================================

describe('renderSummary', () => {
  test('singular form when wiped is 1', () => {
    const out = renderSummary({ wiped: 1, dryRun: false });
    expect(out).toBe('1 session wiped\n');
  });

  test('plural form when wiped is not 1', () => {
    const out = renderSummary({ wiped: 0, dryRun: false });
    expect(out).toBe('0 sessions wiped\n');
  });

  test('dry-run prefix', () => {
    const out = renderSummary({ wiped: 3, dryRun: true });
    expect(out.startsWith('[dry-run] ')).toBe(true);
  });

  test('combined form when artifactsWiped > 0 (singular)', () => {
    const out = renderSummary({
      wiped: 1,
      artifactsWiped: 1,
      dryRun: false,
    });
    expect(out).toBe('1 flat-layout session + 1 legacy artifact wiped\n');
  });

  test('combined form when artifactsWiped > 0 (plural)', () => {
    const out = renderSummary({
      wiped: 2,
      artifactsWiped: 5,
      dryRun: true,
    });
    expect(out).toBe(
      '[dry-run] 2 flat-layout sessions + 5 legacy artifacts wiped\n',
    );
  });
});

// ===========================================================================
// Per-project legacy sweep — predicate + active-session probe + deletion
// ===========================================================================

/**
 * Seed a per-project session directory with a hand-picked subset of the
 * five legacy artifacts. Every created file's content is the artifact
 * name (small but non-empty so `existsSync` and `statSync.size > 0` both
 * report truthy).
 *
 * @param artifacts subset of `'gobbi.db' | 'state.json' | 'state.json.backup' | 'metadata.json' | 'artifacts'`
 */
function seedPerProjectLegacy(
  repo: string,
  projectName: string,
  sessionId: string,
  artifacts: ReadonlyArray<
    'gobbi.db' | 'state.json' | 'state.json.backup' | 'metadata.json' | 'artifacts'
  >,
): string {
  const dir = join(
    repo,
    '.gobbi',
    'projects',
    projectName,
    'sessions',
    sessionId,
  );
  mkdirSync(dir, { recursive: true });
  for (const artifact of artifacts) {
    if (artifact === 'artifacts') {
      const artifactsDir = join(dir, 'artifacts');
      mkdirSync(artifactsDir, { recursive: true });
      writeFileSync(join(artifactsDir, 'a.txt'), 'a', 'utf8');
      writeFileSync(join(artifactsDir, 'b.txt'), 'b', 'utf8');
      // A nested subdir to verify recursive removal.
      mkdirSync(join(artifactsDir, 'nested'), { recursive: true });
      writeFileSync(join(artifactsDir, 'nested', 'c.txt'), 'c', 'utf8');
    } else {
      writeFileSync(join(dir, artifact), artifact, 'utf8');
    }
  }
  return dir;
}

/**
 * Seed a per-project session that already has the post-pivot
 * `session.json` marker. Optionally add a per-step subdir to verify it
 * is preserved.
 */
function seedPostPivot(
  repo: string,
  projectName: string,
  sessionId: string,
  opts: {
    readonly withStepSubdir?: boolean;
    readonly withLegacyAlongside?: ReadonlyArray<
      | 'gobbi.db'
      | 'state.json'
      | 'state.json.backup'
      | 'metadata.json'
      | 'artifacts'
    >;
  } = {},
): string {
  const dir = join(
    repo,
    '.gobbi',
    'projects',
    projectName,
    'sessions',
    sessionId,
  );
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'session.json'),
    JSON.stringify({ schemaVersion: 1, sessionId }),
    'utf8',
  );
  if (opts.withStepSubdir === true) {
    mkdirSync(join(dir, 'ideation'), { recursive: true });
    writeFileSync(join(dir, 'ideation', 'README.md'), '# ideation', 'utf8');
  }
  if (opts.withLegacyAlongside !== undefined) {
    for (const artifact of opts.withLegacyAlongside) {
      if (artifact === 'artifacts') {
        mkdirSync(join(dir, 'artifacts'), { recursive: true });
      } else {
        writeFileSync(join(dir, artifact), artifact, 'utf8');
      }
    }
  }
  return dir;
}

/**
 * Create a workspace `state.db` at `<repo>/.gobbi/state.db` with a
 * minimum-viable `events` table. The shape mirrors the v5+ event-store
 * schema's relevant columns; we only need (session_id, project_id, type)
 * for the active-session probe to function. `idempotency_key` is
 * required by the column constraint, so we generate a unique value per
 * row.
 */
function makeStateDb(
  repo: string,
  rows: ReadonlyArray<{
    readonly sessionId: string;
    readonly projectId: string;
    readonly type: string;
  }>,
): void {
  const gobbiDir = join(repo, '.gobbi');
  mkdirSync(gobbiDir, { recursive: true });
  const dbPath = join(gobbiDir, 'state.db');
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
      `INSERT INTO events (ts, schema_version, type, actor, idempotency_key, session_id, project_id)
       VALUES ($ts, 5, $type, 'test', $key, $sessionId, $projectId)`,
    );
    let seq = 0;
    for (const row of rows) {
      seq += 1;
      stmt.run({
        ts: '2026-04-29T00:00:00.000Z',
        type: row.type,
        key: `${row.sessionId}:${seq}:${row.type}`,
        sessionId: row.sessionId,
        projectId: row.projectId,
      });
    }
  } finally {
    db.close();
  }
}

describe('isLegacyPerProjectSession (predicate)', () => {
  test('returns true when any of the 5 legacy artifacts exists and session.json is absent', () => {
    const repo = makeRepo();
    const dir = seedPerProjectLegacy(repo, 'p', 's', ['gobbi.db']);
    expect(isLegacyPerProjectSession(dir)).toBe(true);
  });

  test('returns true for each of the 5 legacy artifacts individually', () => {
    const repo = makeRepo();
    for (const artifact of [
      'gobbi.db',
      'state.json',
      'state.json.backup',
      'metadata.json',
      'artifacts',
    ] as const) {
      const dir = seedPerProjectLegacy(repo, 'p', `s-${artifact}`, [artifact]);
      expect(isLegacyPerProjectSession(dir)).toBe(true);
    }
  });

  test('returns false when session.json is present (post-pivot, even with stray legacy)', () => {
    const repo = makeRepo();
    const dir = seedPostPivot(repo, 'p', 's', {
      withLegacyAlongside: ['gobbi.db'],
    });
    expect(isLegacyPerProjectSession(dir)).toBe(false);
  });

  test('returns false when none of the 5 legacy artifacts exist', () => {
    const repo = makeRepo();
    const dir = join(
      repo,
      '.gobbi',
      'projects',
      'p',
      'sessions',
      'native',
    );
    mkdirSync(dir, { recursive: true });
    // Only a per-step subdir, no legacy artifacts and no session.json.
    mkdirSync(join(dir, 'ideation'), { recursive: true });
    expect(isLegacyPerProjectSession(dir)).toBe(false);
  });
});

describe('runWipeLegacySessions — per-project legacy sweep', () => {
  test('1. wipes all 5 legacy artifacts; preserves per-step subdirs', async () => {
    const repo = makeRepo();
    const sessionDir = seedPerProjectLegacy(repo, 'gobbi', 'legacy-1', [
      'gobbi.db',
      'state.json',
      'state.json.backup',
      'metadata.json',
      'artifacts',
    ]);
    // Per-step subdir that must be preserved.
    mkdirSync(join(sessionDir, 'ideation'), { recursive: true });
    writeFileSync(
      join(sessionDir, 'ideation', 'README.md'),
      '# ideation',
      'utf8',
    );

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(join(sessionDir, 'gobbi.db'))).toBe(false);
    expect(existsSync(join(sessionDir, 'state.json'))).toBe(false);
    expect(existsSync(join(sessionDir, 'state.json.backup'))).toBe(false);
    expect(existsSync(join(sessionDir, 'metadata.json'))).toBe(false);
    expect(existsSync(join(sessionDir, 'artifacts'))).toBe(false);
    // Per-step subdir untouched.
    expect(existsSync(join(sessionDir, 'ideation', 'README.md'))).toBe(true);
    // Session dir itself preserved.
    expect(existsSync(sessionDir)).toBe(true);
    expect(captured.stdout).toContain('5 legacy artifacts wiped');
  });

  test('2. per-project session with no legacy artifacts is a no-op (idempotent first run)', async () => {
    const repo = makeRepo();
    const sessionDir = join(
      repo,
      '.gobbi',
      'projects',
      'gobbi',
      'sessions',
      'native',
    );
    mkdirSync(sessionDir, { recursive: true });
    writeFileSync(
      join(sessionDir, 'session.json'),
      JSON.stringify({ schemaVersion: 1, sessionId: 'native' }),
      'utf8',
    );
    mkdirSync(join(sessionDir, 'ideation'), { recursive: true });

    const before = readdirSync(sessionDir).sort();

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    const after = readdirSync(sessionDir).sort();
    expect(after).toEqual(before);
    // No artifacts wiped — falls back to the legacy single-counter
    // form (`0 sessions wiped`).
    expect(captured.stdout).toContain('0 sessions wiped');
  });

  test('3. artifacts/ directory with files and nested dirs is wiped recursively', async () => {
    const repo = makeRepo();
    const sessionDir = seedPerProjectLegacy(repo, 'gobbi', 's3', [
      'artifacts',
    ]);
    // Sanity-check seed shape.
    expect(existsSync(join(sessionDir, 'artifacts', 'a.txt'))).toBe(true);
    expect(
      existsSync(join(sessionDir, 'artifacts', 'nested', 'c.txt')),
    ).toBe(true);

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(join(sessionDir, 'artifacts'))).toBe(false);
    expect(existsSync(sessionDir)).toBe(true);
  });

  test('4. mixed workspace — flat + per-project legacy + per-project clean', async () => {
    const repo = makeRepo();
    const flatDir = seedLegacy(repo, 'flat-1');
    const perProjectLegacy = seedPerProjectLegacy(
      repo,
      'gobbi',
      'pp-legacy',
      ['gobbi.db', 'state.json', 'metadata.json'],
    );
    // Preserve a step subdir on the per-project legacy session.
    mkdirSync(join(perProjectLegacy, 'planning'), { recursive: true });
    const perProjectClean = seedPostPivot(repo, 'gobbi', 'pp-clean', {
      withStepSubdir: true,
    });

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    // Flat layout: whole-tree wiped.
    expect(existsSync(flatDir)).toBe(false);
    // Per-project legacy: artifacts wiped, dir + step subdir preserved.
    expect(existsSync(perProjectLegacy)).toBe(true);
    expect(existsSync(join(perProjectLegacy, 'gobbi.db'))).toBe(false);
    expect(existsSync(join(perProjectLegacy, 'state.json'))).toBe(false);
    expect(existsSync(join(perProjectLegacy, 'metadata.json'))).toBe(false);
    expect(existsSync(join(perProjectLegacy, 'planning'))).toBe(true);
    // Per-project clean: untouched (session.json + step subdir intact).
    expect(existsSync(join(perProjectClean, 'session.json'))).toBe(true);
    expect(existsSync(join(perProjectClean, 'ideation', 'README.md'))).toBe(
      true,
    );
    // Combined summary form fires when artifactsWiped > 0.
    expect(captured.stdout).toContain('1 flat-layout session');
    expect(captured.stdout).toContain('legacy artifacts wiped');
  });

  test('5. idempotent — running a second time produces the same on-disk state', async () => {
    const repo = makeRepo();
    seedLegacy(repo, 'flat');
    const perProject = seedPerProjectLegacy(repo, 'gobbi', 'pp', [
      'gobbi.db',
      'state.json',
      'state.json.backup',
      'metadata.json',
      'artifacts',
    ]);
    mkdirSync(join(perProject, 'execution'), { recursive: true });

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );
    const firstRunExit = captured.exitCode;

    // Reset capture so the second run is observed in isolation.
    captured = { stdout: '', stderr: '', exitCode: null };

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(firstRunExit).toBeNull();
    expect(captured.exitCode).toBeNull();
    // Second run: nothing to wipe, falls back to `0 sessions wiped`.
    expect(captured.stdout).toContain('0 sessions wiped');
    // Final state matches the first-run end state.
    expect(existsSync(join(repo, '.gobbi', 'sessions', 'flat'))).toBe(false);
    expect(existsSync(perProject)).toBe(true);
    expect(existsSync(join(perProject, 'gobbi.db'))).toBe(false);
    expect(existsSync(join(perProject, 'execution'))).toBe(true);
  });

  test('dry-run prints the deletion list and deletes nothing', async () => {
    const repo = makeRepo();
    seedLegacy(repo, 'flat-dry');
    const perProject = seedPerProjectLegacy(repo, 'gobbi', 'pp-dry', [
      'gobbi.db',
      'metadata.json',
    ]);

    await captureExit(() =>
      runWipeLegacySessionsWithOptions(['--dry-run'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    // Flat layout shows the legacy "Would wipe:" line.
    expect(captured.stdout).toContain('Would wipe:');
    expect(captured.stdout).toContain('flat-dry');
    // Per-project shows the per-artifact line with the new wording.
    expect(captured.stdout).toContain('Would remove legacy artifact:');
    expect(captured.stdout).toContain(join(perProject, 'gobbi.db'));
    expect(captured.stdout).toContain(join(perProject, 'metadata.json'));
    // Combined dry-run summary.
    expect(captured.stdout).toContain('[dry-run]');
    expect(captured.stdout).toContain('1 flat-layout session');
    expect(captured.stdout).toContain('2 legacy artifacts wiped');
    // Nothing actually deleted.
    expect(existsSync(join(repo, '.gobbi', 'sessions', 'flat-dry'))).toBe(
      true,
    );
    expect(existsSync(join(perProject, 'gobbi.db'))).toBe(true);
    expect(existsSync(join(perProject, 'metadata.json'))).toBe(true);
  });
});

describe('runWipeLegacySessions — active-session probe', () => {
  test('skips a per-project session whose state.db has events but no terminal event', async () => {
    const repo = makeRepo();
    const active = seedPerProjectLegacy(repo, 'gobbi', 'active', [
      'gobbi.db',
      'state.json',
    ]);
    // state.db has a workflow.start but no workflow.finish/abort —
    // the partition is "active."
    makeStateDb(repo, [
      {
        sessionId: 'active',
        projectId: 'gobbi',
        type: 'workflow.start',
      },
    ]);

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    // Active session left untouched.
    expect(existsSync(join(active, 'gobbi.db'))).toBe(true);
    expect(existsSync(join(active, 'state.json'))).toBe(true);
    // Skip notice on stderr.
    expect(captured.stderr).toContain('Skipping active session');
    expect(captured.stderr).toContain(active);
    // No artifacts counted.
    expect(captured.stdout).toContain('0 sessions wiped');
  });

  test('wipes a per-project session whose state.db has a workflow.finish event', async () => {
    const repo = makeRepo();
    const finished = seedPerProjectLegacy(repo, 'gobbi', 'finished', [
      'gobbi.db',
      'state.json',
    ]);
    makeStateDb(repo, [
      {
        sessionId: 'finished',
        projectId: 'gobbi',
        type: 'workflow.start',
      },
      {
        sessionId: 'finished',
        projectId: 'gobbi',
        type: 'workflow.finish',
      },
    ]);

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(join(finished, 'gobbi.db'))).toBe(false);
    expect(existsSync(join(finished, 'state.json'))).toBe(false);
    expect(existsSync(finished)).toBe(true);
    expect(captured.stdout).toContain('legacy artifacts wiped');
  });

  test('wipes a per-project session when state.db has zero events for the partition', async () => {
    const repo = makeRepo();
    const noEvents = seedPerProjectLegacy(repo, 'gobbi', 'no-events', [
      'gobbi.db',
    ]);
    // state.db exists but has events for an UNRELATED partition.
    makeStateDb(repo, [
      {
        sessionId: 'someone-else',
        projectId: 'other-project',
        type: 'workflow.start',
      },
    ]);

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(join(noEvents, 'gobbi.db'))).toBe(false);
    expect(existsSync(noEvents)).toBe(true);
  });

  test('wipes when state.db is missing entirely (fresh workspace)', async () => {
    const repo = makeRepo();
    const fresh = seedPerProjectLegacy(repo, 'gobbi', 'fresh', [
      'gobbi.db',
      'metadata.json',
    ]);
    // No state.db at all.
    expect(existsSync(join(repo, '.gobbi', 'state.db'))).toBe(false);

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(join(fresh, 'gobbi.db'))).toBe(false);
    expect(existsSync(join(fresh, 'metadata.json'))).toBe(false);
  });
});
