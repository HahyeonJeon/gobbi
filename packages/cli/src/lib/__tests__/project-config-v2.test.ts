/**
 * Pass-3 Task T2 — unit tests for `parseProjectConfig` version dispatch +
 * AJV v1/v2 schema validators + `loadProjectConfig` hydration under the
 * two-schema model.
 *
 * Fixtures mirror ideation §5:
 *   - v1-minimal         {version:1}                       → V1 hydrated
 *   - v1-with-verification {version:1, verification:{...}} → V1 hydrated
 *   - v2-minimal         {version:2}                       → V2 hydrated (DEFAULT_CONFIG)
 *   - v2-full            {version:2, all sections}         → V2 hydrated (overrides respected)
 *   - v0-unknown-version {version:99}                      → throws
 *   - v1-malformed       {version:1, verification: "str"}  → AJV error
 *
 * Uses bun:test + a tmpdir-backed scratch repo. No network; no real repo.
 */

import { afterEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  DEFAULT_CONFIG,
  loadProjectConfig,
  parseProjectConfig,
  type ProjectConfigInput,
  type ProjectConfigInputV1,
  type ProjectConfigInputV2,
} from '../project-config.js';

// ---------------------------------------------------------------------------
// Scratch repo lifecycle
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

function scratchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-t2-v2-'));
  scratchDirs.push(dir);
  return dir;
}

function seedConfig(repo: string, payload: unknown): void {
  mkdirSync(join(repo, '.gobbi', 'project'), { recursive: true });
  writeFileSync(
    join(repo, '.gobbi', 'project', 'settings.json'),
    `${JSON.stringify(payload, null, 2)}\n`,
    'utf8',
  );
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

// ===========================================================================
// parseProjectConfig — version dispatch
// ===========================================================================

describe('parseProjectConfig', () => {
  test('v1-minimal {version:1} parses as V1 input', () => {
    const raw: unknown = { version: 1 };
    const parsed = parseProjectConfig(raw);
    expect(parsed.version).toBe(1);
    // Discriminated-union narrowing — V1 input never has a `notify` field.
    const v1: ProjectConfigInputV1 = parsed as ProjectConfigInputV1;
    expect(v1.version).toBe(1);
  });

  test('v1-with-verification parses as V1 input with verification retained', () => {
    const raw: unknown = {
      version: 1,
      verification: {
        commands: {
          lint: { command: 'eslint .', policy: 'gate', timeoutMs: 45000 },
        },
        runAfterSubagentStop: ['lint'],
      },
    };
    const parsed = parseProjectConfig(raw);
    expect(parsed.version).toBe(1);
    if (parsed.version !== 1) throw new Error('unreachable');
    expect(parsed.verification?.commands?.lint).toEqual({
      command: 'eslint .',
      policy: 'gate',
      timeoutMs: 45000,
    });
    expect(parsed.verification?.runAfterSubagentStop).toEqual(['lint']);
  });

  test('v2-minimal {version:2} parses as V2 input', () => {
    const raw: unknown = { version: 2 };
    const parsed: ProjectConfigInput = parseProjectConfig(raw);
    expect(parsed.version).toBe(2);
  });

  test('v2-full parses as V2 input — every optional section preserved', () => {
    const raw: unknown = {
      version: 2,
      verification: {
        commands: { lint: null },
        runAfterSubagentStop: ['typecheck'],
      },
      cost: { rateTable: '/custom/rates.json' },
      notify: { slack: true, telegram: false, discord: true },
      git: { mode: 'worktree-pr', baseBranch: 'develop' },
      eval: { ideation: true, plan: false, execution: true },
      trivialRange: 'simple-edits',
    };
    const parsed = parseProjectConfig(raw);
    expect(parsed.version).toBe(2);
    if (parsed.version !== 2) throw new Error('unreachable');
    const v2: ProjectConfigInputV2 = parsed;
    expect(v2.notify).toEqual({ slack: true, telegram: false, discord: true });
    expect(v2.git).toEqual({ mode: 'worktree-pr', baseBranch: 'develop' });
    expect(v2.eval).toEqual({ ideation: true, plan: false, execution: true });
    expect(v2.trivialRange).toBe('simple-edits');
    expect(v2.cost).toEqual({ rateTable: '/custom/rates.json' });
  });

  test('unknown version throws with a message referencing the version field', () => {
    let caught: unknown;
    try {
      parseProjectConfig({ version: 99 });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).message).toContain('version');
  });

  test('missing version throws a parse error', () => {
    let caught: unknown;
    try {
      parseProjectConfig({ verification: {} });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(Error);
  });

  test('v1-malformed (wrong nested type) surfaces AJV error', () => {
    let caught: unknown;
    try {
      parseProjectConfig({ version: 1, verification: 'not-an-object' });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(Error);
    const message = (caught as Error).message;
    expect(message).toContain('v1');
  });

  test('v2-malformed (wrong git.mode enum) surfaces AJV error', () => {
    let caught: unknown;
    try {
      parseProjectConfig({ version: 2, git: { mode: 'invalid-mode' } });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(Error);
    const message = (caught as Error).message;
    expect(message).toContain('v2');
  });

  test('non-object input throws', () => {
    expect(() => parseProjectConfig(null)).toThrow();
    expect(() => parseProjectConfig('string')).toThrow();
    expect(() => parseProjectConfig(42)).toThrow();
    expect(() => parseProjectConfig([])).toThrow();
  });
});

// ===========================================================================
// loadProjectConfig — end-to-end hydration through parseProjectConfig
// ===========================================================================

describe('loadProjectConfig under two-schema dispatch', () => {
  test('v1-minimal file hydrates to V1 ProjectConfig with defaults', () => {
    const repo = scratchRepo();
    seedConfig(repo, { version: 1 });
    const cfg = loadProjectConfig(repo);
    expect(cfg.version).toBe(1);
    if (cfg.version !== 1) throw new Error('unreachable');
    expect(cfg.verification).toEqual(DEFAULT_CONFIG.verification);
    expect(cfg.cost).toEqual(DEFAULT_CONFIG.cost);
    // V1 hydration does NOT add v2 sections.
    expect('notify' in cfg).toBe(false);
    expect('git' in cfg).toBe(false);
  });

  test('v2-minimal file hydrates to V2 ProjectConfig matching DEFAULT_CONFIG', () => {
    const repo = scratchRepo();
    seedConfig(repo, { version: 2 });
    const cfg = loadProjectConfig(repo);
    expect(cfg.version).toBe(2);
    expect(cfg).toEqual(DEFAULT_CONFIG);
  });

  test('v2-full file hydrates with all explicit overrides respected', () => {
    const repo = scratchRepo();
    const full = {
      version: 2 as const,
      verification: {
        commands: {
          lint: { command: 'eslint', policy: 'inform' as const, timeoutMs: 1000 },
        },
      },
      cost: { rateTable: '/alt/rates' },
      notify: { slack: true, telegram: true, discord: false },
      git: { mode: 'worktree-pr' as const, baseBranch: 'develop' },
      eval: { ideation: true, plan: true, execution: true },
      trivialRange: 'simple-edits' as const,
    };
    seedConfig(repo, full);
    const cfg = loadProjectConfig(repo);
    expect(cfg.version).toBe(2);
    if (cfg.version !== 2) throw new Error('unreachable');
    expect(cfg.notify).toEqual({ slack: true, telegram: true, discord: false });
    expect(cfg.git).toEqual({ mode: 'worktree-pr', baseBranch: 'develop' });
    expect(cfg.eval).toEqual({ ideation: true, plan: true, execution: true });
    expect(cfg.trivialRange).toBe('simple-edits');
    expect(cfg.cost.rateTable).toBe('/alt/rates');
    // Unspecified command slots hydrate from DEFAULT_CONFIG.
    expect(cfg.verification.commands.test).toEqual(
      DEFAULT_CONFIG.verification.commands.test,
    );
  });

  test('v0-unknown-version file surfaces an Invalid-path error at load', () => {
    const repo = scratchRepo();
    seedConfig(repo, { version: 99 });
    expect(() => loadProjectConfig(repo)).toThrow(/version/);
  });

  test('v1-malformed file surfaces an Invalid-path error at load', () => {
    const repo = scratchRepo();
    seedConfig(repo, { version: 1, verification: 'not-an-object' });
    expect(() => loadProjectConfig(repo)).toThrow(/Invalid/);
  });
});
