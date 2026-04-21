/**
 * Pass-3 Task T2 — migration orchestrator tests.
 *
 * Exercises `ensureConfigCascade(repoRoot)` across the full migration
 * matrix: fresh repo, legacy-project-config rename (Step 1), legacy-
 * sessions-shape archive (Step 2), T1 fresh init (Step 3), and `.gitignore`
 * append (Step 4). Also covers idempotency and the false-positive guard
 * for hand-written T1 files that don't match the sessions-shape.
 *
 * Uses bun:test + tmpdir scratch repos. Each test creates a distinct
 * sandbox so state never bleeds across cases. No network.
 */

import { afterEach, describe, expect, test } from 'bun:test';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  DEFAULT_CONFIG,
  DEFAULT_USER_SETTINGS,
  ensureConfigCascade,
} from '../project-config.js';
import { openConfigStore } from '../config-store.js';

// ---------------------------------------------------------------------------
// Scratch repo lifecycle
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

function scratchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-t2-mig-'));
  scratchDirs.push(dir);
  return dir;
}

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

// ---------------------------------------------------------------------------
// stderr capture
// ---------------------------------------------------------------------------

function captureStderr<T>(fn: () => T): { result: T; stderr: string } {
  let captured = '';
  const orig = process.stderr.write;
  process.stderr.write = ((chunk: string | Uint8Array): boolean => {
    captured += typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as typeof process.stderr.write;
  try {
    const result = fn();
    return { result, stderr: captured };
  } finally {
    process.stderr.write = orig;
  }
}

// ===========================================================================
// ensureConfigCascade — Step-by-step behavior
// ===========================================================================

describe('ensureConfigCascade — fresh repo', () => {
  test('creates config.db and writes DEFAULT_USER_SETTINGS', () => {
    const repo = scratchRepo();
    const { stderr } = captureStderr(() => ensureConfigCascade(repo));

    // Step 0 — config.db created (openConfigStore side-effect).
    expect(existsSync(join(repo, '.gobbi', 'config.db'))).toBe(true);

    // Step 3 — T1 settings.json written with default shape.
    const settingsPath = join(repo, '.gobbi', 'settings.json');
    expect(existsSync(settingsPath)).toBe(true);
    const settings = JSON.parse(readFileSync(settingsPath, 'utf8')) as unknown;
    expect(settings).toEqual(DEFAULT_USER_SETTINGS);

    // Step 4 — .gitignore does NOT get auto-created on a fresh repo when
    // called in isolation (ensureProjectConfig is the entry point that
    // also writes .gitignore from the GITIGNORE_CONTENT template). The
    // append-if-exists contract keeps operator-owned .gitignore files
    // safe and avoids a competing authority over its contents.
    expect(existsSync(join(repo, '.gobbi', '.gitignore'))).toBe(false);

    // stderr reflects Step 3 (Steps 1, 2 skip; Step 4 is a no-op here).
    expect(stderr).toContain('created .gobbi/settings.json with defaults');
  });

  test('appends settings.json to an existing .gitignore on first invocation', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', '.gitignore'),
      'sessions/\nworktrees/\n',
      'utf8',
    );
    captureStderr(() => ensureConfigCascade(repo));

    const gi = readFileSync(join(repo, '.gobbi', '.gitignore'), 'utf8');
    const lines = gi.split(/\r?\n/).map((l) => l.trim());
    expect(lines).toContain('settings.json');
    // Existing entries preserved.
    expect(lines).toContain('sessions/');
    expect(lines).toContain('worktrees/');
  });
});

describe('ensureConfigCascade — Step 1 legacy project-config rename', () => {
  test('renames .gobbi/project-config.json to .gobbi/project/settings.json', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    // Seed the legacy location with a valid v1-shape payload.
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      `${JSON.stringify({ version: 1 }, null, 2)}\n`,
      'utf8',
    );

    const { stderr } = captureStderr(() => ensureConfigCascade(repo));

    // Source gone, destination present.
    expect(existsSync(join(repo, '.gobbi', 'project-config.json'))).toBe(false);
    expect(existsSync(join(repo, '.gobbi', 'project', 'settings.json'))).toBe(true);
    // Payload preserved.
    const moved = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'project', 'settings.json'), 'utf8'),
    ) as unknown;
    expect(moved).toEqual({ version: 1 });

    expect(stderr).toContain(
      'migrated: .gobbi/project-config.json → .gobbi/project/settings.json',
    );
  });

  test('skips rename when v2 location already exists (pre-seeded)', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi', 'project'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project', 'settings.json'),
      `${JSON.stringify(DEFAULT_CONFIG, null, 2)}\n`,
      'utf8',
    );
    // A stray legacy file — should NOT be renamed over the existing v2 file.
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      `${JSON.stringify({ version: 1 }, null, 2)}\n`,
      'utf8',
    );

    const { stderr } = captureStderr(() => ensureConfigCascade(repo));

    // Both files still exist — the rename was skipped.
    expect(existsSync(join(repo, '.gobbi', 'project-config.json'))).toBe(true);
    expect(existsSync(join(repo, '.gobbi', 'project', 'settings.json'))).toBe(true);
    expect(stderr).not.toContain('migrated:');
  });
});

describe('ensureConfigCascade — Step 2 legacy settings.json archive', () => {
  test('archives sessions-shape settings.json after Step 0 migrates it', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    const legacySettings = {
      version: '0.4.5',
      architecture: 'claude-source',
      sessions: {
        'legacy-sess-1': {
          trivialRange: 'read-only',
          evaluationMode: 'ask-each-time',
          gitWorkflow: 'direct-commit',
          baseBranch: null,
          notify: { slack: false, telegram: false },
          createdAt: '2026-01-01T00:00:00Z',
          lastAccessedAt: '2026-01-01T00:00:00Z',
        },
      },
    };
    writeFileSync(
      join(repo, '.gobbi', 'settings.json'),
      JSON.stringify(legacySettings, null, 2),
      'utf8',
    );

    const { stderr } = captureStderr(() => ensureConfigCascade(repo));

    // Source archived, new T1 file written in its place.
    expect(existsSync(join(repo, '.gobbi', 'settings.json'))).toBe(true);
    expect(existsSync(join(repo, '.gobbi', 'settings.legacy.json'))).toBe(true);

    // New settings.json has DEFAULT_USER_SETTINGS shape (not the legacy one).
    const currentSettings = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8'),
    ) as unknown;
    expect(currentSettings).toEqual(DEFAULT_USER_SETTINGS);

    // Archive preserves original legacy contents.
    const archive = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.legacy.json'), 'utf8'),
    ) as unknown;
    expect(archive).toEqual(legacySettings);

    // config.db has the legacy session (copied by Step 0 / openConfigStore).
    {
      using store = openConfigStore(repo);
      const session = store.getSession('legacy-sess-1');
      expect(session).not.toBeNull();
      expect(session?.trivialRange).toBe('read-only');
    }

    // stderr reflects both the archive and the fresh T1 write.
    expect(stderr).toContain('archived legacy settings.json → settings.legacy.json');
    expect(stderr).toContain('created .gobbi/settings.json with defaults');
  });

  test('false-positive guard — hand-written settings.json with sessions: [] is NOT archived', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    // Hand-written T1 with a top-level `sessions` array (not the record shape).
    // This does NOT match the strict legacy guard — leave it alone.
    const t1File = {
      notify: { slack: false, telegram: false, discord: false },
      sessions: [],
    };
    writeFileSync(
      join(repo, '.gobbi', 'settings.json'),
      JSON.stringify(t1File, null, 2),
      'utf8',
    );

    const { stderr } = captureStderr(() => ensureConfigCascade(repo));

    // Not archived — file still at original path.
    expect(existsSync(join(repo, '.gobbi', 'settings.legacy.json'))).toBe(false);
    // Original hand-written payload preserved.
    const preserved = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8'),
    ) as unknown;
    expect(preserved).toEqual(t1File);

    expect(stderr).not.toContain('archived legacy');
    expect(stderr).not.toContain('created .gobbi/settings.json');
  });

  test('false-positive guard — settings.json missing architecture is NOT archived', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    const partialLegacy = {
      version: '0.4.5',
      // `architecture` omitted — doesn't satisfy strict guard.
      sessions: {},
    };
    writeFileSync(
      join(repo, '.gobbi', 'settings.json'),
      JSON.stringify(partialLegacy, null, 2),
      'utf8',
    );

    captureStderr(() => ensureConfigCascade(repo));

    expect(existsSync(join(repo, '.gobbi', 'settings.legacy.json'))).toBe(false);
    const preserved = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8'),
    ) as unknown;
    expect(preserved).toEqual(partialLegacy);
  });
});

describe('ensureConfigCascade — idempotency', () => {
  test('second invocation emits zero stderr when all state is settled', () => {
    const repo = scratchRepo();
    // First invocation — expected to emit stderr (Step 3 fresh init).
    captureStderr(() => ensureConfigCascade(repo));

    // Second invocation — every step detects its target state and skips.
    const { stderr } = captureStderr(() => ensureConfigCascade(repo));
    expect(stderr).toBe('');
  });

  test('.gitignore append is idempotent — no duplicate settings.json line', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    const initialGitignore =
      '# existing header\nsessions/\nworktrees/\nsettings.json\n';
    writeFileSync(join(repo, '.gobbi', '.gitignore'), initialGitignore, 'utf8');

    captureStderr(() => ensureConfigCascade(repo));

    const gi = readFileSync(join(repo, '.gobbi', '.gitignore'), 'utf8');
    // Count occurrences of exactly the settings.json line.
    const occurrences = gi
      .split(/\r?\n/)
      .filter((line) => line.trim() === 'settings.json').length;
    expect(occurrences).toBe(1);
    // Preserved operator header.
    expect(gi).toContain('# existing header');
  });

  test('.gitignore append preserves missing trailing newline', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    // No trailing newline on existing gitignore.
    writeFileSync(join(repo, '.gobbi', '.gitignore'), 'sessions/\nworktrees/', 'utf8');

    captureStderr(() => ensureConfigCascade(repo));

    const gi = readFileSync(join(repo, '.gobbi', '.gitignore'), 'utf8');
    expect(gi).toContain('settings.json');
    // settings.json on its own line (not glued to `worktrees`).
    expect(gi).not.toContain('worktreessettings.json');
  });
});

describe('ensureConfigCascade — combined flow', () => {
  test('legacy repo with both project-config.json AND sessions-shape settings.json', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    // Pre-Pass-3 state: old project-config + legacy sessions file.
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      `${JSON.stringify({ version: 1 }, null, 2)}\n`,
      'utf8',
    );
    writeFileSync(
      join(repo, '.gobbi', 'settings.json'),
      JSON.stringify({
        version: '0.4.5',
        architecture: 'claude-source',
        sessions: {
          's1': {
            trivialRange: 'read-only',
            evaluationMode: 'ask-each-time',
            gitWorkflow: 'direct-commit',
            baseBranch: null,
            notify: { slack: false, telegram: false },
            createdAt: '2026-01-01T00:00:00Z',
            lastAccessedAt: '2026-01-01T00:00:00Z',
          },
        },
      }),
      'utf8',
    );

    const { stderr } = captureStderr(() => ensureConfigCascade(repo));

    // Step 1 — rename happened.
    expect(existsSync(join(repo, '.gobbi', 'project-config.json'))).toBe(false);
    expect(existsSync(join(repo, '.gobbi', 'project', 'settings.json'))).toBe(true);
    // Step 2 — archive happened.
    expect(existsSync(join(repo, '.gobbi', 'settings.legacy.json'))).toBe(true);
    // Step 3 — fresh T1 wrote after archive.
    expect(existsSync(join(repo, '.gobbi', 'settings.json'))).toBe(true);
    const t1 = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8'),
    ) as unknown;
    expect(t1).toEqual(DEFAULT_USER_SETTINGS);
    // Step 0 — config.db has the migrated session.
    {
      using store = openConfigStore(repo);
      expect(store.getSession('s1')).not.toBeNull();
    }

    // stderr reflects all three transitions.
    expect(stderr).toContain('migrated: .gobbi/project-config.json');
    expect(stderr).toContain('archived legacy settings.json');
    expect(stderr).toContain('created .gobbi/settings.json');
  });
});
