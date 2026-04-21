/**
 * Pass-3 Task T3 — Cascade resolver tests.
 *
 * Coverage matrix:
 *   - {@link ConfigCascadeError}: code / tier / path / cause + literal-typed code.
 *   - {@link loadUserSettings}: absent file → null; valid minimal/full parse;
 *     malformed JSON; schema violation.
 *   - {@link deepMergeWithProvenance}: primitive replace + provenance;
 *     nested object deep-merge; array replace; `null` leaf; `undefined`
 *     skip; empty overlay no-op; null/undefined overlay no-op.
 *   - {@link resolveConfig}: defaults-only, T1-only, T2-only, T3-only,
 *     T1+T2 merge, T1+T2+T3 full cascade, missing session fall-through,
 *     provenance correctness across a mixed-tier scenario.
 *
 * Uses bun:test + tmpdir scratch repos. Each test creates a fresh sandbox
 * so state never leaks across cases.
 */

import { afterEach, describe, expect, test } from 'bun:test';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { CascadeShape } from '../cascade-shape.js';
import {
  ConfigCascadeError,
  DEFAULT_USER_SETTINGS,
  deepMergeWithProvenance,
  loadUserSettings,
  resolveConfig,
  type ResolvedConfig,
  type TierId,
  type UserSettings,
} from '../config-cascade.js';
import { openConfigStore } from '../config-store.js';
import { DEFAULT_CONFIG } from '../project-config.js';

// ---------------------------------------------------------------------------
// Scratch repo lifecycle
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

function scratchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-t3-'));
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

// ===========================================================================
// ConfigCascadeError
// ===========================================================================

describe('ConfigCascadeError', () => {
  test('constructs with code + message; tier/path absent', () => {
    const err = new ConfigCascadeError('notFound', 'missing key');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ConfigCascadeError);
    expect(err.code).toBe('notFound');
    expect(err.message).toBe('missing key');
    expect(err.name).toBe('ConfigCascadeError');
    expect(err.tier).toBeUndefined();
    expect(err.path).toBeUndefined();
  });

  test('constructs with optional tier + path', () => {
    const err = new ConfigCascadeError('parse', 'bad json', {
      tier: 'user',
      path: '/tmp/foo.json',
    });
    expect(err.code).toBe('parse');
    expect(err.tier).toBe('user');
    expect(err.path).toBe('/tmp/foo.json');
  });

  test('forwards cause to Error.cause', () => {
    const cause = new Error('inner');
    const err = new ConfigCascadeError('read', 'outer', { cause });
    // `cause` is spec-native on Error; it may be typed as unknown.
    expect((err as { cause?: unknown }).cause).toBe(cause);
  });

  test('code field is a literal union — project covers exhaustive dispatch', () => {
    // Compile-time gate: if the code field widens to `string`, this switch
    // loses its exhaustive narrowing and the `assertNever` branch will
    // accept any input — failing to compile on the `never` assertion is
    // the desired signal.
    const sample: 'read' | 'parse' | 'notFound' = new ConfigCascadeError('read', 'x').code;
    const labels: Record<'read' | 'parse' | 'notFound', string> = {
      read: 'r',
      parse: 'p',
      notFound: 'n',
    };
    expect(labels[sample]).toBe('r');
  });
});

// ===========================================================================
// loadUserSettings
// ===========================================================================

describe('loadUserSettings', () => {
  test('returns null when .gobbi/settings.json is absent', () => {
    const repo = scratchRepo();
    expect(loadUserSettings(repo)).toBeNull();
  });

  test('parses a valid minimal settings.json (only schemaVersion)', () => {
    const repo = scratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), { schemaVersion: 1 });

    const settings = loadUserSettings(repo);
    expect(settings).not.toBeNull();
    // Hydration fills missing sections from DEFAULT_USER_SETTINGS.
    expect(settings).toEqual(DEFAULT_USER_SETTINGS as UserSettings);
  });

  test('parses a full settings.json, preserving overrides', () => {
    const repo = scratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      notify: { slack: true, telegram: false, discord: false },
      git: { mode: 'worktree-pr', baseBranch: 'develop' },
      eval: { ideation: true, plan: true, execution: true },
      trivialRange: 'simple-edits',
      ui: { verbosity: 'verbose' },
    });

    const settings = loadUserSettings(repo);
    expect(settings?.notify.slack).toBe(true);
    expect(settings?.git.mode).toBe('worktree-pr');
    expect(settings?.git.baseBranch).toBe('develop');
    expect(settings?.eval.ideation).toBe(true);
    expect(settings?.trivialRange).toBe('simple-edits');
    expect(settings?.ui.verbosity).toBe('verbose');
  });

  test('hydrates missing sibling sections from DEFAULT_USER_SETTINGS', () => {
    const repo = scratchRepo();
    // Only `notify.slack` overridden — the rest must hydrate from defaults.
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      notify: { slack: true },
    });

    const settings = loadUserSettings(repo);
    expect(settings?.notify.slack).toBe(true);
    expect(settings?.notify.telegram).toBe(DEFAULT_USER_SETTINGS.notify.telegram);
    expect(settings?.notify.discord).toBe(DEFAULT_USER_SETTINGS.notify.discord);
    expect(settings?.git).toEqual(DEFAULT_USER_SETTINGS.git);
    expect(settings?.ui).toEqual(DEFAULT_USER_SETTINGS.ui);
  });

  test('throws ConfigCascadeError(parse) on malformed JSON', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(join(repo, '.gobbi', 'settings.json'), '{ not: valid json', 'utf8');

    try {
      loadUserSettings(repo);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.tier).toBe('user');
        expect(err.path).toContain('settings.json');
      }
    }
  });

  test('throws ConfigCascadeError(parse) on schema violation — wrong schemaVersion', () => {
    const repo = scratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), { schemaVersion: 99 });

    try {
      loadUserSettings(repo);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.tier).toBe('user');
      }
    }
  });

  test('throws ConfigCascadeError(parse) on unknown enum value', () => {
    const repo = scratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      git: { mode: 'not-a-real-mode' },
    });

    try {
      loadUserSettings(repo);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
      }
    }
  });
});

// ===========================================================================
// deepMergeWithProvenance
// ===========================================================================

describe('deepMergeWithProvenance', () => {
  test('primitive overlay replaces base and records provenance', () => {
    const base = { a: 1, b: 2 };
    const sources: Record<string, TierId> = {};
    const out = deepMergeWithProvenance(
      base,
      { a: 99 } as Partial<typeof base>,
      'user',
      sources,
    );
    expect(out).toEqual({ a: 99, b: 2 });
    expect(sources).toEqual({ a: 'user' });
  });

  test('nested object deep-merges recursively with per-leaf provenance', () => {
    const base = { notify: { slack: false, telegram: false, discord: false } };
    const sources: Record<string, TierId> = {};
    const out = deepMergeWithProvenance(
      base,
      { notify: { slack: true } } as Partial<typeof base>,
      'project',
      sources,
    );
    expect(out).toEqual({ notify: { slack: true, telegram: false, discord: false } });
    expect(sources).toEqual({ 'notify.slack': 'project' });
  });

  test('array overlay replaces base array (provenance on the array path, not per-element)', () => {
    const base = { items: ['x', 'y'] };
    const sources: Record<string, TierId> = {};
    const out = deepMergeWithProvenance(
      base,
      { items: ['only'] } as Partial<typeof base>,
      'session',
      sources,
    );
    expect(out.items).toEqual(['only']);
    expect(sources).toEqual({ items: 'session' });
    // No `items.0`, `items.1` provenance entries — arrays are leaves.
    expect(Object.keys(sources).filter((k) => k.startsWith('items.'))).toEqual([]);
  });

  test('null overlay value is an explicit leaf with recorded provenance', () => {
    const base = { git: { mode: 'direct-commit', baseBranch: 'main' } };
    const sources: Record<string, TierId> = {};
    const out = deepMergeWithProvenance(
      base,
      { git: { baseBranch: null } } as unknown as Partial<typeof base>,
      'user',
      sources,
    );
    expect(out.git.baseBranch).toBeNull();
    expect(out.git.mode).toBe('direct-commit');
    expect(sources).toEqual({ 'git.baseBranch': 'user' });
  });

  test('undefined overlay value is skipped — no merge, no provenance', () => {
    const base = { a: 1, b: 2 };
    const sources: Record<string, TierId> = {};
    const out = deepMergeWithProvenance(
      base,
      { a: undefined } as unknown as Partial<typeof base>,
      'user',
      sources,
    );
    expect(out).toEqual({ a: 1, b: 2 });
    expect(sources).toEqual({});
  });

  test('empty overlay — no changes, no provenance entries', () => {
    const base = { a: 1 };
    const sources: Record<string, TierId> = {};
    const out = deepMergeWithProvenance(base, {}, 'user', sources);
    expect(out).toEqual({ a: 1 });
    expect(sources).toEqual({});
  });

  test('null overlay — returns base unchanged, no provenance entries', () => {
    const base = { a: 1 };
    const sources: Record<string, TierId> = {};
    const out = deepMergeWithProvenance(base, null, 'user', sources);
    expect(out).toEqual({ a: 1 });
    expect(sources).toEqual({});
  });

  test('undefined overlay — returns base unchanged, no provenance entries', () => {
    const base = { a: 1 };
    const sources: Record<string, TierId> = {};
    const out = deepMergeWithProvenance(base, undefined, 'user', sources);
    expect(out).toEqual({ a: 1 });
    expect(sources).toEqual({});
  });
});

// ===========================================================================
// resolveConfig — tier combinations
// ===========================================================================

describe('resolveConfig — defaults-only (all tiers absent)', () => {
  test('returns CascadeShape hydrated from DEFAULT_CONFIG + DEFAULT_USER_SETTINGS.ui', () => {
    const repo = scratchRepo();
    const resolved = resolveConfig({ repoRoot: repo });

    expect(resolved.verification).toEqual(DEFAULT_CONFIG.verification);
    expect(resolved.cost).toEqual(DEFAULT_CONFIG.cost);
    expect(resolved.notify).toEqual(DEFAULT_CONFIG.notify);
    expect(resolved.git).toEqual(DEFAULT_CONFIG.git);
    expect(resolved.eval).toEqual(DEFAULT_CONFIG.eval);
    expect(resolved.trivialRange).toBe(DEFAULT_CONFIG.trivialRange);
    expect(resolved.ui).toEqual(DEFAULT_USER_SETTINGS.ui);
  });

  test('every leaf in __sources is tagged "default"', () => {
    const repo = scratchRepo();
    const resolved = resolveConfig({ repoRoot: repo });

    // Spot-check representative leaves from each section.
    expect(resolved.__sources['notify.slack']).toBe('default');
    expect(resolved.__sources['git.mode']).toBe('default');
    expect(resolved.__sources['eval.execution']).toBe('default');
    expect(resolved.__sources['trivialRange']).toBe('default');
    expect(resolved.__sources['ui.verbosity']).toBe('default');
    // Verification commands are a deep tree — at least one leaf provenance.
    expect(resolved.__sources['verification.commands.test.command']).toBe('default');
  });

  test('__sources is frozen and type-narrowed to TierId literals', () => {
    const repo = scratchRepo();
    const resolved = resolveConfig({ repoRoot: repo });
    expect(Object.isFrozen(resolved.__sources)).toBe(true);
    // Compile-time: __sources is Readonly<Record<string, TierId>>
    const sourceValue: TierId = resolved.__sources['notify.slack'] ?? 'default';
    expect(['default', 'user', 'project', 'session']).toContain(sourceValue);
  });
});

describe('resolveConfig — T1 only (user settings)', () => {
  test('T1 overrides defaults; provenance flips to user', () => {
    const repo = scratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      notify: { slack: true },
      ui: { verbosity: 'verbose' },
    });

    const resolved = resolveConfig({ repoRoot: repo });
    expect(resolved.notify.slack).toBe(true);
    // Sibling leaves not in overlay stay at defaults.
    expect(resolved.notify.telegram).toBe(false);
    expect(resolved.ui.verbosity).toBe('verbose');

    expect(resolved.__sources['notify.slack']).toBe('user');
    expect(resolved.__sources['notify.telegram']).toBe('default');
    expect(resolved.__sources['ui.verbosity']).toBe('user');
  });
});

describe('resolveConfig — T2 only (project settings)', () => {
  test('T2 overrides defaults; provenance flips to project', () => {
    const repo = scratchRepo();
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      git: { mode: 'worktree-pr', baseBranch: 'main' },
      eval: { plan: true },
    });

    const resolved = resolveConfig({ repoRoot: repo });
    expect(resolved.git.mode).toBe('worktree-pr');
    expect(resolved.git.baseBranch).toBe('main');
    expect(resolved.eval.plan).toBe(true);
    // Sibling eval leaves not overlaid stay at defaults.
    expect(resolved.eval.execution).toBe(DEFAULT_CONFIG.eval.execution);

    expect(resolved.__sources['git.mode']).toBe('project');
    expect(resolved.__sources['git.baseBranch']).toBe('project');
    expect(resolved.__sources['eval.plan']).toBe('project');
    expect(resolved.__sources['eval.execution']).toBe('default');
  });
});

describe('resolveConfig — T3 only (session projection)', () => {
  test('T3 overrides defaults; provenance flips to session', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    {
      using store = openConfigStore(repo);
      store.upsertSession('sess-1', {
        trivialRange: 'simple-edits',
        evaluationMode: 'ask-each-time',
        gitWorkflow: 'worktree-pr',
        baseBranch: 'develop',
        notify: { slack: true, telegram: false },
        createdAt: '2026-01-01T00:00:00Z',
        lastAccessedAt: '2026-01-01T00:00:00Z',
      });
    }

    const resolved = resolveConfig({ repoRoot: repo, sessionId: 'sess-1' });
    expect(resolved.trivialRange).toBe('simple-edits');
    expect(resolved.git.mode).toBe('worktree-pr');
    expect(resolved.git.baseBranch).toBe('develop');
    expect(resolved.notify.slack).toBe(true);

    expect(resolved.__sources['trivialRange']).toBe('session');
    expect(resolved.__sources['git.mode']).toBe('session');
    expect(resolved.__sources['git.baseBranch']).toBe('session');
    expect(resolved.__sources['notify.slack']).toBe('session');
    // Leaves T3 didn't touch stay at defaults (notify.discord has no T3 column
    // but the projection pins it; provenance still reflects session since
    // T3 contributed the notify object).
  });

  test('sessionId that does not exist → projection null → tier skipped', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    {
      using store = openConfigStore(repo);
      void store; // Initialises the DB; no session written.
    }

    const resolved = resolveConfig({ repoRoot: repo, sessionId: 'ghost' });
    // Falls through to defaults (no session row exists).
    expect(resolved.git.mode).toBe(DEFAULT_CONFIG.git.mode);
    expect(resolved.__sources['git.mode']).toBe('default');
  });
});

describe('resolveConfig — T1 + T2 merge', () => {
  test('T2 wins over T1 where both contribute; T1 retained elsewhere', () => {
    const repo = scratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      notify: { slack: true, telegram: true },
      git: { mode: 'direct-commit', baseBranch: 'user-branch' },
      ui: { verbosity: 'verbose' },
    });
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      git: { mode: 'worktree-pr', baseBranch: 'project-branch' },
    });

    const resolved = resolveConfig({ repoRoot: repo });
    // T2 wins on git.
    expect(resolved.git.mode).toBe('worktree-pr');
    expect(resolved.git.baseBranch).toBe('project-branch');
    expect(resolved.__sources['git.mode']).toBe('project');
    expect(resolved.__sources['git.baseBranch']).toBe('project');

    // T1 wins on notify (T2 didn't contribute).
    expect(resolved.notify.slack).toBe(true);
    expect(resolved.notify.telegram).toBe(true);
    expect(resolved.__sources['notify.slack']).toBe('user');
    expect(resolved.__sources['notify.telegram']).toBe('user');

    // T1 wins on ui (T2 has no ui section at all).
    expect(resolved.ui.verbosity).toBe('verbose');
    expect(resolved.__sources['ui.verbosity']).toBe('user');
  });
});

describe('resolveConfig — full cascade T1 + T2 + T3', () => {
  test('T3 > T2 > T1 > defaults; mixed-tier provenance map correct', () => {
    const repo = scratchRepo();
    // T1 sets notify.slack = true and ui.verbosity = verbose.
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      notify: { slack: true },
      ui: { verbosity: 'verbose' },
    });
    // T2 sets git + verification.commands.test override.
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      git: { mode: 'worktree-pr', baseBranch: 'main' },
      verification: {
        commands: {
          test: { command: 'bun test --coverage', policy: 'gate', timeoutMs: 300000 },
        },
      },
    });
    // T3 sets git.mode (wins over T2), trivialRange.
    {
      using store = openConfigStore(repo);
      store.upsertSession('live', {
        trivialRange: 'simple-edits',
        evaluationMode: 'ask-each-time',
        gitWorkflow: 'direct-commit',
        baseBranch: 'session-branch',
        notify: { slack: false, telegram: false },
        createdAt: '2026-01-01T00:00:00Z',
        lastAccessedAt: '2026-01-01T00:00:00Z',
      });
    }

    const resolved = resolveConfig({ repoRoot: repo, sessionId: 'live' });

    // T3 wins on git.mode + git.baseBranch + trivialRange + notify.slack.
    expect(resolved.git.mode).toBe('direct-commit');
    expect(resolved.git.baseBranch).toBe('session-branch');
    expect(resolved.trivialRange).toBe('simple-edits');
    expect(resolved.notify.slack).toBe(false);
    expect(resolved.__sources['git.mode']).toBe('session');
    expect(resolved.__sources['git.baseBranch']).toBe('session');
    expect(resolved.__sources['trivialRange']).toBe('session');
    expect(resolved.__sources['notify.slack']).toBe('session');

    // T2 wins on verification.commands.test.command (T3 doesn't contribute).
    expect(resolved.verification.commands.test?.command).toBe('bun test --coverage');
    expect(resolved.__sources['verification.commands.test.command']).toBe('project');

    // T1 wins on ui.verbosity (neither T2 nor T3 contribute).
    expect(resolved.ui.verbosity).toBe('verbose');
    expect(resolved.__sources['ui.verbosity']).toBe('user');

    // Defaults retained where no tier overrides (e.g. cost.rateTable).
    expect(resolved.cost.rateTable).toBe(DEFAULT_CONFIG.cost.rateTable);
    expect(resolved.__sources['cost.rateTable']).toBe('default');
  });
});

describe('resolveConfig — error propagation', () => {
  test('T1 malformed JSON → throws ConfigCascadeError(parse, user)', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(join(repo, '.gobbi', 'settings.json'), '{ bad json', 'utf8');

    try {
      resolveConfig({ repoRoot: repo });
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.tier).toBe('user');
      }
    }
  });

  test('T2 malformed JSON → throws ConfigCascadeError(parse, project)', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi', 'project'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project', 'settings.json'),
      '{ also bad json',
      'utf8',
    );

    try {
      resolveConfig({ repoRoot: repo });
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.tier).toBe('project');
      }
    }
  });
});

// ===========================================================================
// Compile-time proofs
// ===========================================================================

describe('ResolvedConfig — compile-time shape', () => {
  test('satisfies CascadeShape & __sources — structural check', () => {
    const repo = scratchRepo();
    const resolved = resolveConfig({ repoRoot: repo });

    // Assigning to `CascadeShape` proves ResolvedConfig extends it.
    const asBase: CascadeShape = resolved;
    expect(asBase.notify).toBeDefined();

    // `__sources` is present and Readonly<Record<string, TierId>>.
    const tier: TierId = resolved.__sources['git.mode'] ?? 'default';
    expect(tier).toBeDefined();

    // Satisfies gate: the full resolved value conforms to ResolvedConfig.
    const check = resolved satisfies ResolvedConfig;
    expect(check).toBe(resolved);
  });
});
