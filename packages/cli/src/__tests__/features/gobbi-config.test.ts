/**
 * Feature-level integration tests for gobbi-config (Pass 3 issue #120).
 *
 * Each `test()` asserts one Gherkin scenario from
 * `.gobbi/sessions/fbffbdb8-8839-449a-82fc-76ea4070712e/ideation/ideation.md
 * §4` — 13 scenarios covering the three-tier cascade (CFG-H-01..09),
 * migration (CFG-E-01..03), and the malformed-input edge (CFG-Edge-01).
 *
 * Library-level assertions (resolveConfig direct) cover all CFG-H and the
 * two migration happy paths. CFG-E-03 additionally spawns the compiled
 * (source) CLI via `Bun.spawn` to prove `gobbi config get <session-id>` is
 * untouched by the Pass-3 changes — a regression guard for the existing
 * public surface.
 *
 * Each scenario lives in its own `describe('CFG-<id>: ...')` block so the
 * scenario ID is visible in failing-test output. tmpdir sandboxes isolate
 * state between tests.
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
  ConfigCascadeError,
  resolveConfig,
  type ResolvedConfig,
} from '../../lib/config-cascade.js';
import { openConfigStore } from '../../lib/config-store.js';
import {
  DEFAULT_CONFIG,
  DEFAULT_USER_SETTINGS,
  ensureConfigCascade,
} from '../../lib/project-config.js';

// ---------------------------------------------------------------------------
// Scratch repo lifecycle — tmpdir per test; cleanup in afterEach.
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

function scratchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-cfg-feat-'));
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

function writeJson(filePath: string, value: unknown): void {
  mkdirSync(join(filePath, '..'), { recursive: true });
  writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

// ---------------------------------------------------------------------------
// CLI entry path for subprocess tests (CFG-E-03). `import.meta.dir` is
// `packages/cli/src/__tests__/features/`; the CLI entry is two hops up.
// ---------------------------------------------------------------------------

const CLI_PATH = join(import.meta.dir, '..', '..', 'cli.ts');

// ===========================================================================
// CFG-H-01 — Default resolution (no tier files present)
// ===========================================================================

describe('CFG-H-01: default resolution — all tier files absent', () => {
  // Scenario: CFG-H-01
  test('CFG-H-01: resolveConfig with no T1/T2/T3 returns DEFAULT_CONFIG shape', () => {
    const repo = scratchRepo();

    const resolved = resolveConfig({ repoRoot: repo });

    // Every leaf traces back to the default tier.
    expect(resolved.git.mode).toBe(DEFAULT_CONFIG.git.mode);
    expect(resolved.git.baseBranch).toBe(DEFAULT_CONFIG.git.baseBranch);
    expect(resolved.trivialRange).toBe(DEFAULT_CONFIG.trivialRange);
    expect(resolved.verification).toEqual(DEFAULT_CONFIG.verification);
    expect(resolved.cost).toEqual(DEFAULT_CONFIG.cost);
    expect(resolved.notify).toEqual(DEFAULT_CONFIG.notify);
    expect(resolved.eval).toEqual(DEFAULT_CONFIG.eval);
    expect(resolved.ui.verbosity).toBe(DEFAULT_USER_SETTINGS.ui.verbosity);

    // Provenance is universally 'default'.
    expect(resolved.__sources['git.mode']).toBe('default');
    expect(resolved.__sources['trivialRange']).toBe('default');
    expect(resolved.__sources['ui.verbosity']).toBe('default');
  });
});

// ===========================================================================
// CFG-H-02 — T1 only
// ===========================================================================

describe('CFG-H-02: T1 only — user value visible when T2/T3 omit key', () => {
  // Scenario: CFG-H-02
  test('CFG-H-02: user tier overrides defaults; provenance flips to "user"', () => {
    const repo = scratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      ui: { verbosity: 'verbose' },
      notify: { slack: true, telegram: false, discord: false },
    });

    const resolved = resolveConfig({ repoRoot: repo });

    expect(resolved.ui.verbosity).toBe('verbose');
    expect(resolved.notify.slack).toBe(true);
    expect(resolved.__sources['ui.verbosity']).toBe('user');
    expect(resolved.__sources['notify.slack']).toBe('user');
    // Unrelated keys remain at defaults.
    expect(resolved.__sources['trivialRange']).toBe('default');
  });
});

// ===========================================================================
// CFG-H-03 — T2 only
// ===========================================================================

describe('CFG-H-03: T2 only — project value visible when T1/T3 omit key', () => {
  // Scenario: CFG-H-03
  test('CFG-H-03: project tier overrides defaults; provenance flips to "project"', () => {
    const repo = scratchRepo();
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      git: { mode: 'worktree-pr', baseBranch: 'develop' },
      trivialRange: 'simple-edits',
    });

    const resolved = resolveConfig({ repoRoot: repo });

    expect(resolved.git.mode).toBe('worktree-pr');
    expect(resolved.git.baseBranch).toBe('develop');
    expect(resolved.trivialRange).toBe('simple-edits');
    expect(resolved.__sources['git.mode']).toBe('project');
    expect(resolved.__sources['git.baseBranch']).toBe('project');
    expect(resolved.__sources['trivialRange']).toBe('project');
  });
});

// ===========================================================================
// CFG-H-04 — T3 only
// ===========================================================================

describe('CFG-H-04: T3 only — session value visible when T1/T2 omit key', () => {
  // Scenario: CFG-H-04
  test('CFG-H-04: session tier overrides defaults; provenance flips to "session"', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    {
      using store = openConfigStore(repo);
      store.upsertSession('sess-h-04', {
        trivialRange: 'simple-edits',
        evaluationMode: 'ask-each-time',
        gitWorkflow: 'worktree-pr',
        baseBranch: 'release',
        notify: { slack: true, telegram: false },
        createdAt: '2026-01-01T00:00:00Z',
        lastAccessedAt: '2026-01-01T00:00:00Z',
      });
    }

    const resolved = resolveConfig({
      repoRoot: repo,
      sessionId: 'sess-h-04',
    });

    expect(resolved.trivialRange).toBe('simple-edits');
    expect(resolved.git.mode).toBe('worktree-pr');
    expect(resolved.git.baseBranch).toBe('release');
    expect(resolved.notify.slack).toBe(true);
    expect(resolved.__sources['trivialRange']).toBe('session');
    expect(resolved.__sources['git.mode']).toBe('session');
    expect(resolved.__sources['notify.slack']).toBe('session');
  });
});

// ===========================================================================
// CFG-H-05 — Full cascade: T3 > T2 > T1 > default
// ===========================================================================

describe('CFG-H-05: full cascade — T3 wins over T2 wins over T1', () => {
  // Scenario: CFG-H-05
  test('CFG-H-05: each narrower tier wins for the keys it contributes', () => {
    const repo = scratchRepo();
    // T1 sets git.mode='direct-commit' + notify.slack=true + ui.verbosity='verbose'.
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      git: { mode: 'direct-commit', baseBranch: 'user-branch' },
      notify: { slack: true, telegram: false, discord: false },
      ui: { verbosity: 'verbose' },
    });
    // T2 sets git.mode='worktree-pr' + trivialRange='simple-edits'.
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      git: { mode: 'worktree-pr', baseBranch: 'project-branch' },
      trivialRange: 'simple-edits',
    });
    // T3 sets git.mode='direct-commit' + baseBranch='session-branch'.
    {
      using store = openConfigStore(repo);
      store.upsertSession('sess-h-05', {
        trivialRange: 'read-only',
        evaluationMode: 'ask-each-time',
        gitWorkflow: 'direct-commit',
        baseBranch: 'session-branch',
        notify: { slack: false, telegram: false },
        createdAt: '2026-01-01T00:00:00Z',
        lastAccessedAt: '2026-01-01T00:00:00Z',
      });
    }

    const resolved = resolveConfig({
      repoRoot: repo,
      sessionId: 'sess-h-05',
    });

    // T3 wins on git, notify.slack, trivialRange (it's projected too).
    expect(resolved.git.mode).toBe('direct-commit');
    expect(resolved.git.baseBranch).toBe('session-branch');
    expect(resolved.trivialRange).toBe('read-only');
    expect(resolved.notify.slack).toBe(false);
    expect(resolved.__sources['git.mode']).toBe('session');
    expect(resolved.__sources['trivialRange']).toBe('session');
    expect(resolved.__sources['notify.slack']).toBe('session');

    // T1 wins on ui.verbosity (neither T2 nor T3 contributes).
    expect(resolved.ui.verbosity).toBe('verbose');
    expect(resolved.__sources['ui.verbosity']).toBe('user');

    // Default wins on eval.execution (no tier touches it).
    expect(resolved.eval.execution).toBe(DEFAULT_CONFIG.eval.execution);
    expect(resolved.__sources['eval.execution']).toBe('default');
  });
});

// ===========================================================================
// CFG-H-06 — Partial cascade: T3 silent, T2 wins over T1
// ===========================================================================

describe('CFG-H-06: partial cascade — T3 silent, T2 wins over T1', () => {
  // Scenario: CFG-H-06
  test('CFG-H-06: an empty/unset T3 slot delegates past, T2 wins over T1', () => {
    const repo = scratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      trivialRange: 'simple-edits',
    });
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      trivialRange: 'read-only',
    });
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    // Create the DB but do not touch the trivial_range column for this session
    // (the upsert defaults land 'read-only' from SQL side; projection yields
    // trivialRange='read-only' which matches T2 — so session overlay adds
    // trivialRange:'read-only' with tier 'session'. To exercise "T3 silent"
    // we must reference a key T3 does NOT project at all — e.g., eval.plan.
    {
      using store = openConfigStore(repo);
      store.upsertSession('sess-h-06', {
        trivialRange: 'read-only',
        evaluationMode: 'ask-each-time',
        gitWorkflow: 'direct-commit',
        baseBranch: null,
        notify: { slack: false, telegram: false },
        createdAt: '2026-01-01T00:00:00Z',
        lastAccessedAt: '2026-01-01T00:00:00Z',
      });
    }

    // Seed T1 + T2 with distinct eval.plan values (T3 never projects eval).
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      eval: { ideation: false, plan: false, execution: false },
    });
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      eval: { plan: true },
    });

    const resolved = resolveConfig({
      repoRoot: repo,
      sessionId: 'sess-h-06',
    });

    // T3 does not project eval; T2 wins over T1 for eval.plan.
    expect(resolved.eval.plan).toBe(true);
    expect(resolved.__sources['eval.plan']).toBe('project');
    // T1 wins on eval.ideation (T2/T3 silent).
    expect(resolved.eval.ideation).toBe(false);
    expect(resolved.__sources['eval.ideation']).toBe('user');
  });
});

// ===========================================================================
// CFG-H-07 — Deep merge semantics
// ===========================================================================

describe('CFG-H-07: deep-merge — T2 overrides nested leaf, T1 sibling retained', () => {
  // Scenario: CFG-H-07
  test('CFG-H-07: T1 sets {mode, baseBranch}; T2 sets only mode; baseBranch retains T1 value', () => {
    const repo = scratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      git: { mode: 'direct-commit', baseBranch: 'user-main' },
    });
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      git: { mode: 'worktree-pr' },
    });

    const resolved = resolveConfig({ repoRoot: repo });

    // Nested leaf override via deep-merge.
    expect(resolved.git.mode).toBe('worktree-pr');
    expect(resolved.__sources['git.mode']).toBe('project');
    // Sibling retained from T1.
    expect(resolved.git.baseBranch).toBe('user-main');
    expect(resolved.__sources['git.baseBranch']).toBe('user');
  });
});

// ===========================================================================
// CFG-H-08 — Arrays replace, not merge
// ===========================================================================

describe('CFG-H-08: arrays replace — narrower tier array supersedes wider', () => {
  // Scenario: CFG-H-08
  test('CFG-H-08: T2 runAfterSubagentStop=[c] fully replaces T1 [a,b]', () => {
    const repo = scratchRepo();
    // T1 only contributes eval (T1 has no verification section per shape).
    // We put the competing arrays at T2 and default layers: default provides
    // runAfterSubagentStop=['typecheck','test'] via DEFAULT_VERIFICATION;
    // T2 provides a narrower ['format']. Array-replace semantics must win.
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      verification: {
        runAfterSubagentStop: ['format'],
      },
    });

    const resolved = resolveConfig({ repoRoot: repo });

    expect(resolved.verification.runAfterSubagentStop).toEqual(['format']);
    expect(resolved.__sources['verification.runAfterSubagentStop']).toBe(
      'project',
    );
  });
});

// ===========================================================================
// CFG-H-09 — `null` at narrower tier is an explicit leaf
// ===========================================================================

describe('CFG-H-09: null at narrower tier is explicit leaf', () => {
  // Scenario: CFG-H-09
  test('CFG-H-09: T2 git.baseBranch=null overrides T1 git.baseBranch="main" with null', () => {
    const repo = scratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      git: { mode: 'direct-commit', baseBranch: 'main' },
    });
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      git: { baseBranch: null },
    });

    const resolved = resolveConfig({ repoRoot: repo });

    // `null` is a leaf — T2 wins, T1's 'main' is overwritten.
    expect(resolved.git.baseBranch).toBeNull();
    expect(resolved.__sources['git.baseBranch']).toBe('project');
    // T1's mode stays put (T2 didn't contribute).
    expect(resolved.git.mode).toBe('direct-commit');
    expect(resolved.__sources['git.mode']).toBe('user');
  });
});

// ===========================================================================
// CFG-E-01 — Migration: project-config.json → project/settings.json
// ===========================================================================

describe('CFG-E-01: migration — rename project-config.json to project/settings.json', () => {
  // Scenario: CFG-E-01
  test('CFG-E-01: ensureConfigCascade renames the flat doc; v2 payload preserved', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    const v2Payload = {
      version: 2,
      git: { mode: 'worktree-pr', baseBranch: 'main' },
      trivialRange: 'simple-edits',
    };
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify(v2Payload, null, 2),
      'utf8',
    );

    // Suppress stderr so the test runner doesn't carry migration noise.
    const origErr = process.stderr.write;
    process.stderr.write = ((): boolean => true) as typeof process.stderr.write;
    try {
      ensureConfigCascade(repo);
    } finally {
      process.stderr.write = origErr;
    }

    // Flat doc gone; new v2 location present.
    expect(existsSync(join(repo, '.gobbi', 'project-config.json'))).toBe(false);
    expect(existsSync(join(repo, '.gobbi', 'project', 'settings.json'))).toBe(
      true,
    );
    // Payload preserved byte-for-byte through renameSync.
    const moved = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'project', 'settings.json'), 'utf8'),
    ) as unknown;
    expect(moved).toEqual(v2Payload);

    // Resolver sees the renamed payload.
    const resolved = resolveConfig({ repoRoot: repo });
    expect(resolved.git.mode).toBe('worktree-pr');
    expect(resolved.trivialRange).toBe('simple-edits');
  });
});

// ===========================================================================
// CFG-E-02 — Migration: legacy settings.json sessions-shape
// ===========================================================================

describe('CFG-E-02: migration — legacy sessions-shape settings.json archived after DB migration', () => {
  // Scenario: CFG-E-02
  test('CFG-E-02: Step 0 copies sessions to config.db, then settings.json is archived + T1 freshly written', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    const legacySettings = {
      version: '0.4.5',
      architecture: 'claude-source',
      sessions: {
        'legacy-cfg-e-02': {
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

    const origErr = process.stderr.write;
    process.stderr.write = ((): boolean => true) as typeof process.stderr.write;
    try {
      ensureConfigCascade(repo);
    } finally {
      process.stderr.write = origErr;
    }

    // Sessions migrated into config.db (Step 0).
    {
      using store = openConfigStore(repo);
      const sess = store.getSession('legacy-cfg-e-02');
      expect(sess).not.toBeNull();
      expect(sess?.trivialRange).toBe('read-only');
    }

    // Source archived.
    expect(existsSync(join(repo, '.gobbi', 'settings.legacy.json'))).toBe(true);
    const archived = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.legacy.json'), 'utf8'),
    ) as unknown;
    expect(archived).toEqual(legacySettings);

    // Fresh T1 written in the archived file's place.
    expect(existsSync(join(repo, '.gobbi', 'settings.json'))).toBe(true);
    const freshT1 = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8'),
    ) as unknown;
    expect(freshT1).toEqual(DEFAULT_USER_SETTINGS);
  });
});

// ===========================================================================
// CFG-E-03 — CLI backcompat: `gobbi config get <session-id>` untouched
// ===========================================================================

describe('CFG-E-03: CLI backcompat — gobbi config get <session-id> returns raw T3 row', () => {
  // Scenario: CFG-E-03
  test(
    'CFG-E-03: `config get <id>` returns the session JSON directly (no cascade)',
    async () => {
      const repo = scratchRepo();
      mkdirSync(join(repo, '.gobbi'), { recursive: true });

      // Seed a session via the same code path a real user would.
      {
        using store = openConfigStore(repo);
        store.upsertSession('sess-e-03', {
          trivialRange: 'simple-edits',
          evaluationMode: 'ask-each-time',
          gitWorkflow: 'worktree-pr',
          baseBranch: 'feat/backcompat',
          notify: { slack: true, telegram: false },
          createdAt: '2026-01-01T00:00:00Z',
          lastAccessedAt: '2026-01-01T00:00:00Z',
        });
      }

      const childEnv: Record<string, string> = {
        ...process.env,
        CLAUDE_PROJECT_DIR: repo,
        CLAUDE_SESSION_ID: '',
        CLAUDE_TRANSCRIPT_PATH: '',
      };

      const child = Bun.spawn({
        cmd: ['bun', 'run', CLI_PATH, 'config', 'get', 'sess-e-03'],
        env: childEnv,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const [stdoutText, stderrText, exitCode] = await Promise.all([
        drainText(child.stdout),
        drainText(child.stderr),
        child.exited,
      ]);

      expect(exitCode).toBe(0);
      expect(stderrText).toBe('');
      // The raw session JSON must have the legacy shape — NOT a cascade-
      // resolved shape. `gitWorkflow` (not `git.mode`) is the tell: the raw
      // row-to-session conversion preserves the original field name.
      const parsed = JSON.parse(stdoutText) as unknown;
      expect(parsed).toMatchObject({
        trivialRange: 'simple-edits',
        evaluationMode: 'ask-each-time',
        gitWorkflow: 'worktree-pr',
        baseBranch: 'feat/backcompat',
        notify: { slack: true, telegram: false },
      });
    },
    { timeout: 30_000 },
  );
});

// ===========================================================================
// CFG-Edge-01 — Invalid JSON at any tier
// ===========================================================================

describe('CFG-Edge-01: invalid JSON at any tier throws ConfigCascadeError', () => {
  // Scenario: CFG-Edge-01 (T1 variant)
  test('CFG-Edge-01: T1 malformed JSON → ConfigCascadeError(parse, tier=user, path set)', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'settings.json'),
      '{ not-a-valid-json',
      'utf8',
    );

    try {
      resolveConfig({ repoRoot: repo });
      throw new Error('expected ConfigCascadeError');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.tier).toBe('user');
        expect(err.path).toContain('settings.json');
        expect(err.message).toMatch(/\.gobbi\/settings\.json/);
      }
    }
  });

  // Scenario: CFG-Edge-01 (T2 variant)
  test('CFG-Edge-01: T2 malformed JSON → ConfigCascadeError(parse, tier=project, path set)', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi', 'project'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project', 'settings.json'),
      '{ still-not-json',
      'utf8',
    );

    try {
      resolveConfig({ repoRoot: repo });
      throw new Error('expected ConfigCascadeError');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.tier).toBe('project');
        expect(err.path).toContain('settings.json');
        expect(err.message).toMatch(/project[\\/]+settings\.json/);
      }
    }
  });
});

// ===========================================================================
// Compile-time sanity — ResolvedConfig is assignable anywhere CascadeShape is
// ===========================================================================

// Utility — `drainToBuffer`-style narrower for `Bun.spawn` stdout/stderr
// streams. Reusing the documented pattern from
// `packages/cli/src/workflow/verification-scheduler.ts:68-76` avoids the
// TS2345 union-type trap documented in `_bun/gotchas.md`.
async function drainText(
  stream: ReadableStream<Uint8Array> | number | undefined,
): Promise<string> {
  if (stream === undefined || typeof stream === 'number') return '';
  const buf = await new Response(stream).arrayBuffer();
  return Buffer.from(buf).toString('utf8');
}

// Guard — smoke test that `ResolvedConfig` surfaces its keys as documented.
test('resolveConfig returns the documented shape surface', () => {
  const repo = scratchRepo();
  const r: ResolvedConfig = resolveConfig({ repoRoot: repo });
  expect(r.verification).toBeDefined();
  expect(r.cost).toBeDefined();
  expect(r.notify).toBeDefined();
  expect(r.git).toBeDefined();
  expect(r.eval).toBeDefined();
  expect(r.trivialRange).toBeDefined();
  expect(r.ui).toBeDefined();
  expect(r.__sources).toBeDefined();
});
