/**
 * Unit tests for `lib/project-config.ts` — schema validation + loader + init
 * helper for `.gobbi/project-config.json`.
 *
 * Coverage:
 *   - Loader returns DEFAULT_CONFIG when no file exists (non-init callers).
 *   - Loader validates valid full config and matches input shape.
 *   - Loader hydrates a valid partial config `{version: 1}` via deepMerge.
 *   - Loader throws on malformed JSON with a helpful error message.
 *   - Loader throws on schema violations (bad enum, missing required).
 *   - ensureProjectConfig writes defaults + .gitignore on a fresh repo.
 *   - ensureProjectConfig is a silent no-op on second invocation.
 *   - ensureProjectConfig preserves an operator-edited .gitignore.
 *   - deepMerge right-wins leaf semantics (arrays replace, not concat).
 *
 * Tests pass an explicit `repoRoot` (tmpdir) — they never touch the real
 * checkout's `.gobbi/` tree. Per `git-workflow.md` gotcha, this keeps the
 * worktree clean.
 */

import { afterEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  DEFAULT_CONFIG,
  deepMerge,
  ensureProjectConfig,
  loadProjectConfig,
  type ProjectConfig,
} from '../project-config.js';

// ---------------------------------------------------------------------------
// Scratch repo lifecycle — explicit `repoRoot` keeps tests isolated.
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

function scratchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-e5-'));
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
// stderr capture — ensureProjectConfig writes a notice on `created: true`.
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
// loadProjectConfig — in-memory defaults when file is missing
// ===========================================================================

describe('loadProjectConfig', () => {
  test('returns DEFAULT_CONFIG when .gobbi/project-config.json is missing', () => {
    const repo = scratchRepo();
    const cfg = loadProjectConfig(repo);
    expect(cfg).toEqual(DEFAULT_CONFIG);
  });

  test('loads and validates a full valid config unchanged', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    const full: ProjectConfig = {
      version: 1,
      verification: {
        commands: {
          lint:      { command: 'eslint .',              policy: 'inform', timeoutMs: 45000 },
          test:      { command: 'vitest run',            policy: 'gate',   timeoutMs: 240000 },
          typecheck: { command: 'tsc --noEmit',          policy: 'gate',   timeoutMs: 90000 },
          build:     { command: 'vite build',            policy: 'inform', timeoutMs: 180000 },
          format:    { command: 'prettier --check .',    policy: 'inform', timeoutMs: 20000 },
          custom:    { command: 'echo custom',           policy: 'inform', timeoutMs: 5000 },
        },
        runAfterSubagentStop: ['typecheck', 'test', 'custom'],
      },
      cost: { rateTable: '/path/to/rates.json' },
    };
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify(full, null, 2),
      'utf8',
    );

    const cfg = loadProjectConfig(repo);
    expect(cfg).toEqual(full);
  });

  test('hydrates a valid partial config {version: 1} from v1 defaults', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify({ version: 1 }),
      'utf8',
    );

    const cfg = loadProjectConfig(repo);
    // V1 files hydrate to a V1-shaped ProjectConfig (version: 1, no v2
    // cascade sections). DEFAULT_CONFIG is v2; the v1 loader uses a v1
    // slice of the defaults so the return preserves `version: 1`.
    expect(cfg.version).toBe(1);
    expect(cfg.verification).toEqual(DEFAULT_CONFIG.verification);
    expect(cfg.cost).toEqual(DEFAULT_CONFIG.cost);
  });

  test('partial override merges leaf values from user config over defaults', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify({
        version: 1,
        verification: {
          commands: {
            lint: { command: 'eslint .', policy: 'gate', timeoutMs: 90000 },
          },
        },
      }),
      'utf8',
    );

    const cfg = loadProjectConfig(repo);
    // Overridden slot takes user values.
    expect(cfg.verification.commands.lint).toEqual({
      command: 'eslint .',
      policy: 'gate',
      timeoutMs: 90000,
    });
    // Other slots preserve defaults.
    expect(cfg.verification.commands.test).toEqual(DEFAULT_CONFIG.verification.commands.test);
    expect(cfg.verification.commands.typecheck).toEqual(DEFAULT_CONFIG.verification.commands.typecheck);
    // runAfterSubagentStop default preserved.
    expect(cfg.verification.runAfterSubagentStop).toEqual(['typecheck', 'test']);
    // cost default preserved.
    expect(cfg.cost.rateTable).toBe('builtin');
  });

  test('user-supplied array replaces (not concats) the default array', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify({
        version: 1,
        verification: { runAfterSubagentStop: ['lint'] },
      }),
      'utf8',
    );

    const cfg = loadProjectConfig(repo);
    expect(cfg.verification.runAfterSubagentStop).toEqual(['lint']);
  });

  test('explicit null on a command slot is preserved (not defaulted)', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify({
        version: 1,
        verification: { commands: { lint: null } },
      }),
      'utf8',
    );

    const cfg = loadProjectConfig(repo);
    expect(cfg.verification.commands.lint).toBeNull();
    // Other slots still defaulted.
    expect(cfg.verification.commands.test).toEqual(DEFAULT_CONFIG.verification.commands.test);
  });

  test('throws on malformed JSON with a parse error message', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(join(repo, '.gobbi', 'project-config.json'), '{ not valid json', 'utf8');

    expect(() => loadProjectConfig(repo)).toThrow(/JSON parse error/);
  });

  test('throws on schema violation (bad policy enum) with instance path', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify({
        version: 1,
        verification: {
          commands: {
            test: { command: 'bun test', policy: 'xxx', timeoutMs: 1000 },
          },
        },
      }),
      'utf8',
    );

    let thrown: unknown;
    try {
      loadProjectConfig(repo);
    } catch (err) {
      thrown = err;
    }
    expect(thrown).toBeInstanceOf(Error);
    const message = (thrown as Error).message;
    expect(message).toContain('Invalid .gobbi/project-config.json');
    expect(message).toContain('/verification/commands/test/policy');
  });

  test('throws on missing required version field', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify({ verification: {} }),
      'utf8',
    );

    expect(() => loadProjectConfig(repo)).toThrow(/version/);
  });

  test('loads a minimal v2 config and hydrates defaults from DEFAULT_CONFIG', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify({ version: 2 }),
      'utf8',
    );

    const cfg = loadProjectConfig(repo);
    expect(cfg.version).toBe(2);
    // DEFAULT_CONFIG is v2 — hydration fills every v2 section.
    expect(cfg).toEqual(DEFAULT_CONFIG);
  });

  test('throws when version is neither 1 nor 2', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify({ version: 99 }),
      'utf8',
    );

    expect(() => loadProjectConfig(repo)).toThrow(/version/);
  });
});

// ===========================================================================
// ensureProjectConfig — init-time helper
// ===========================================================================

describe('ensureProjectConfig', () => {
  test('creates project config + .gitignore on a fresh repo (migrated to v2 path)', () => {
    const repo = scratchRepo();
    const { result, stderr } = captureStderr(() => ensureProjectConfig(repo));

    expect(result.created).toBe(true);
    // ensureConfigCascade renames the legacy write target to the v2 path,
    // so the returned `path` and the persisted file are at the v2 location.
    expect(result.path).toBe(join(repo, '.gobbi', 'project', 'settings.json'));
    expect(existsSync(join(repo, '.gobbi', 'project', 'settings.json'))).toBe(true);
    expect(existsSync(join(repo, '.gobbi', 'project-config.json'))).toBe(false);
    expect(existsSync(join(repo, '.gobbi', '.gitignore'))).toBe(true);
    expect(stderr).toContain('created .gobbi/project-config.json');
    expect(stderr).toContain('migrated: .gobbi/project-config.json → .gobbi/project/settings.json');

    // Written file is valid JSON of the default shape.
    const raw = readFileSync(join(repo, '.gobbi', 'project', 'settings.json'), 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    expect(parsed).toEqual(DEFAULT_CONFIG);
    expect(raw.endsWith('\n')).toBe(true);

    // .gitignore lists runtime-state subdirs + T1 settings.json.
    const gi = readFileSync(join(repo, '.gobbi', '.gitignore'), 'utf8');
    expect(gi).toContain('sessions/');
    expect(gi).toContain('worktrees/');
    expect(gi).toContain('project/note/');
    expect(gi).toContain('settings.json');
  });

  test('second invocation is a silent no-op when all state is settled', () => {
    const repo = scratchRepo();
    // First invocation seeds everything (project/settings.json + T1 settings.json + gitignore).
    captureStderr(() => ensureProjectConfig(repo));

    // Second invocation: nothing to migrate, nothing to write, stderr silent.
    const { result, stderr } = captureStderr(() => ensureProjectConfig(repo));
    expect(result.created).toBe(false);
    expect(stderr).toBe('');
    // Resolved path points at the v2 location.
    expect(result.path).toBe(join(repo, '.gobbi', 'project', 'settings.json'));
  });

  test('second invocation does not rewrite or overwrite an existing v2 config', () => {
    const repo = scratchRepo();
    // Seed an existing file at the v2 location directly.
    mkdirSync(join(repo, '.gobbi', 'project'), { recursive: true });
    const customConfig = {
      version: 1,
      verification: {
        commands: {
          lint: { command: 'custom-lint', policy: 'gate', timeoutMs: 1000 },
        },
      },
    };
    writeFileSync(
      join(repo, '.gobbi', 'project', 'settings.json'),
      JSON.stringify(customConfig, null, 2),
      'utf8',
    );

    captureStderr(() => ensureProjectConfig(repo));

    // File contents preserved — not overwritten.
    const raw = readFileSync(join(repo, '.gobbi', 'project', 'settings.json'), 'utf8');
    expect(JSON.parse(raw)).toEqual(customConfig);
  });

  test('does not overwrite a pre-existing .gitignore — only appends settings.json if missing', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    const operatorGitignore = '# operator edits\n*.tmp\nsessions/\n';
    writeFileSync(join(repo, '.gobbi', '.gitignore'), operatorGitignore, 'utf8');

    // project-config does not exist → created=true path runs.
    const { result } = captureStderr(() => ensureProjectConfig(repo));
    expect(result.created).toBe(true);

    const gi = readFileSync(join(repo, '.gobbi', '.gitignore'), 'utf8');
    // Operator's comment + rules are preserved — only a new `settings.json`
    // line is appended (ensureConfigCascade Step 4's idempotent append).
    expect(gi.startsWith(operatorGitignore)).toBe(true);
    expect(gi).toContain('settings.json');
  });
});

// ===========================================================================
// deepMerge — leaf semantics
// ===========================================================================

describe('deepMerge', () => {
  test('right wins on leaf conflicts and recurses into nested objects', () => {
    const base: Record<string, unknown> = { a: 1, b: { c: 2, d: 3 }, e: [1, 2] };
    const overlay: Record<string, unknown> = { a: 9, b: { d: 30, x: 99 } };
    const merged = deepMerge(base, overlay);
    expect(merged).toEqual({ a: 9, b: { c: 2, d: 30, x: 99 }, e: [1, 2] });
  });

  test('arrays replace rather than concat', () => {
    const base = { xs: [1, 2, 3] };
    const overlay = { xs: [9] };
    expect(deepMerge(base, overlay)).toEqual({ xs: [9] });
  });

  test('null on the overlay replaces the base value', () => {
    const base: Record<string, unknown> = { a: { b: 1 } };
    const overlay: Record<string, unknown> = { a: null };
    expect(deepMerge(base, overlay)).toEqual({ a: null });
  });

  test('undefined on the overlay does NOT replace (key skipped)', () => {
    const base = { a: 1, b: 2 };
    const overlay = { a: undefined, b: 20 };
    expect(deepMerge(base, overlay)).toEqual({ a: 1, b: 20 });
  });

  test('non-record overlay returns base unchanged', () => {
    const base = { a: 1 };
    expect(deepMerge(base, null)).toEqual(base);
    expect(deepMerge(base, 'string')).toEqual(base);
    expect(deepMerge(base, undefined)).toEqual(base);
  });
});
