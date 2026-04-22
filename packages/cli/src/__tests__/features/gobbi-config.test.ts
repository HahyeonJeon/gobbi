/**
 * Feature-level integration tests for gobbi-config — Pass 3 finalization (Wave D.2).
 *
 * Ports the original 13 Gherkin scenarios (CFG-*) from the Pass-3 SQLite +
 * provenance era to the unified `settings.json` three-level cascade:
 *
 *   workspace → `.gobbi/settings.json`
 *   project   → `.gobbi/project/settings.json`
 *   session   → `.gobbi/sessions/<id>/settings.json`
 *
 * Scenario mapping:
 *
 *   CFG-1..CFG-4   — CLI verbs (`gobbi config get` / `set`) + exit codes.
 *   CFG-5..CFG-8   — cascade semantics (narrower wins, arrays replace, null
 *                    is an explicit leaf, absent delegates).
 *   CFG-9..CFG-10  — T2-v1 upgrader inside `ensureSettingsCascade`.
 *   CFG-11..CFG-12 — legacy cleanup (`config.db`, `.claude/gobbi.json`).
 *   CFG-13         — malformed JSON at any level → ConfigCascadeError('parse').
 *
 * Scenarios retired (and why):
 *
 *   - The three Pass-3 provenance-specific scenarios (CFG-H-02 / CFG-H-03 /
 *     CFG-H-04 provenance=* assertions, CFG-E-03 raw T3 passthrough)
 *     retired with the provenance feature decommission (backlog #124
 *     closed). Cascade ordering is still covered by the value-win
 *     assertions in CFG-5..CFG-8; provenance tracking was removed.
 *   - Verification.* scenarios retired with the in-process verification
 *     helper decommission (Wave B); the schema no longer carries a
 *     verification section.
 *
 * Repo memoization: `lib/repo.ts::getRepoRoot` memoises the first
 * `git rev-parse --show-toplevel` result, so all tests in this file share
 * one scratch repo (`beforeAll` + `chdir`) and reset `.gobbi/` between
 * tests (`beforeEach`). Pattern mirrors `commands/__tests__/config.test.ts`.
 *
 * Env hygiene: `CLAUDE_SESSION_ID` / `CLAUDE_PROJECT_DIR` are set explicitly
 * in `beforeEach` and cleared in `afterEach` per the `cli-vs-skill-session-id`
 * gotcha so sibling tests never leak a stale id into the CLI process env.
 */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Override getRepoRoot BEFORE importing anything that captures it — the
// module-level memoization in `lib/repo.ts` is shared across every test
// file in a single `bun test` invocation. Without the mock, the first
// test file to call `getRepoRoot()` caches its tmpdir path, and all
// subsequent files get that stale path even after their own `beforeAll`
// runs. `mock.module` rewires the binding so every call dispatches to a
// `globalThis`-scoped mutable pointer that each feature test file
// re-installs when its `beforeAll` runs. Files that do NOT install a
// pointer (e.g. `commands/__tests__/config.test.ts`) see the real
// behaviour via the fallback branch below.
interface ScratchState {
  readonly root: string | null;
}
const GLOBAL_KEY = '__gobbiConfigScratchRoot__';
function setGlobalScratch(root: string | null): void {
  (globalThis as unknown as Record<string, ScratchState>)[GLOBAL_KEY] = { root };
}
function getGlobalScratch(): string | null {
  const entry = (globalThis as unknown as Record<string, ScratchState | undefined>)[GLOBAL_KEY];
  return entry?.root ?? null;
}
mock.module('../../lib/repo.js', () => ({
  getRepoRoot: () => {
    const scratch = getGlobalScratch();
    if (scratch !== null) return scratch;
    // Fallback — real git rev-parse, same semantics as the un-mocked
    // module. Required so sibling test files that never set the
    // globalThis pointer keep seeing the real repo root.
    try {
      return execSync('git rev-parse --show-toplevel', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
    } catch {
      return process.cwd();
    }
  },
  getClaudeDir: () => {
    const scratch = getGlobalScratch();
    const root = scratch ?? (() => {
      try {
        return execSync('git rev-parse --show-toplevel', {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();
      } catch {
        return process.cwd();
      }
    })();
    return join(root, '.claude');
  },
}));

import { runConfig } from '../../commands/config.js';
import { ensureSettingsCascade } from '../../lib/ensure-settings-cascade.js';
import {
  ConfigCascadeError,
  type Settings,
} from '../../lib/settings.js';
import {
  resolveSettings,
} from '../../lib/settings-io.js';

// ---------------------------------------------------------------------------
// stdout / stderr / process.exit capture — matches C.1's config.test.ts
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

let captured: Captured = { stdout: '', stderr: '', exitCode: null };
let origStdoutWrite: typeof process.stdout.write;
let origStderrWrite: typeof process.stderr.write;
let origExit: typeof process.exit;

async function captureExit(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    if (err instanceof ExitCalled) return;
    throw err;
  }
}

function resetCapture(): void {
  captured = { stdout: '', stderr: '', exitCode: null };
}

// ---------------------------------------------------------------------------
// Shared scratch repo — one tmpdir per test FILE, `.gobbi/` rm between tests.
// Required because `getRepoRoot()` memoises the first git rev-parse result.
// ---------------------------------------------------------------------------

let scratchRepo: string | null = null;
let origCwd: string | null = null;
const ORIG_ENV_SESSION_ID = process.env['CLAUDE_SESSION_ID'];
const ORIG_ENV_PROJECT_DIR = process.env['CLAUDE_PROJECT_DIR'];

beforeAll(() => {
  origCwd = process.cwd();
  scratchRepo = mkdtempSync(join(tmpdir(), 'gobbi-cfg-feat-'));
  execSync('git init -q', { cwd: scratchRepo });
  process.chdir(scratchRepo);
  // Point the mocked getRepoRoot at this file's scratch dir.
  setGlobalScratch(scratchRepo);
});

afterAll(() => {
  // Release the pointer so sibling test files see either their own
  // scratch or the real-git fallback.
  setGlobalScratch(null);
  if (origCwd !== null) {
    try {
      process.chdir(origCwd);
    } catch {
      // best-effort
    }
  }
  if (scratchRepo !== null) {
    try {
      rmSync(scratchRepo, { recursive: true, force: true });
    } catch {
      // best-effort
    }
  }
});

function makeScratchRepo(): string {
  if (scratchRepo === null) {
    throw new Error('beforeAll did not initialise scratchRepo');
  }
  const gobbiDir = join(scratchRepo, '.gobbi');
  if (existsSync(gobbiDir)) {
    rmSync(gobbiDir, { recursive: true, force: true });
  }
  const legacyClaudeGobbi = join(scratchRepo, '.claude', 'gobbi.json');
  if (existsSync(legacyClaudeGobbi)) {
    rmSync(legacyClaudeGobbi, { force: true });
  }
  if (process.cwd() !== scratchRepo) {
    process.chdir(scratchRepo);
  }
  // Re-affirm the pointer in case a sibling test file cleared it.
  setGlobalScratch(scratchRepo);
  return scratchRepo;
}

function writeJson(filePath: string, value: unknown): void {
  mkdirSync(join(filePath, '..'), { recursive: true });
  writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

beforeEach(() => {
  resetCapture();
  origStdoutWrite = process.stdout.write;
  origStderrWrite = process.stderr.write;
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
  process.exit = ((code?: number | string | null): never => {
    captured.exitCode = typeof code === 'number' ? code : 0;
    throw new ExitCalled(captured.exitCode);
  }) as typeof process.exit;

  // Env hygiene — clear so each test starts from a known state. Tests that
  // need a session id set it explicitly below.
  delete process.env['CLAUDE_SESSION_ID'];
  delete process.env['CLAUDE_PROJECT_DIR'];
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
  process.exit = origExit;

  // Restore original env — prevents leakage into sibling tests.
  if (ORIG_ENV_SESSION_ID !== undefined) {
    process.env['CLAUDE_SESSION_ID'] = ORIG_ENV_SESSION_ID;
  } else {
    delete process.env['CLAUDE_SESSION_ID'];
  }
  if (ORIG_ENV_PROJECT_DIR !== undefined) {
    process.env['CLAUDE_PROJECT_DIR'] = ORIG_ENV_PROJECT_DIR;
  } else {
    delete process.env['CLAUDE_PROJECT_DIR'];
  }
});

// ===========================================================================
// CFG-1: CLI `get` verb basic path + cascade resolution
// ===========================================================================

describe("CFG-1: gobbi config get returns cascade-resolved value", () => {
  test('CFG-1: absent workspace/project/session cascade returns the DEFAULT leaf', async () => {
    makeScratchRepo();
    await captureExit(async () => {
      await runConfig(['get', 'workflow.ideation.discuss.mode']);
    });
    // DEFAULTS.workflow.ideation.discuss.mode === 'user'.
    expect(captured.stdout).toBe('"user"\n');
    expect(captured.stderr).toBe('');
    expect(captured.exitCode).toBeNull();
  });

  test('CFG-1: cascade miss at a deep path exits 1 silently', async () => {
    makeScratchRepo();
    await captureExit(async () => {
      await runConfig(['get', 'nonexistent.deep.nested.key']);
    });
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
    expect(captured.exitCode).toBe(1);
  });
});

// ===========================================================================
// CFG-2: CLI `set` verb basic path — write + round-trip
// ===========================================================================

describe("CFG-2: gobbi config set writes + round-trips through AJV", () => {
  test('CFG-2: workspace set + get round-trip lands the value on disk', async () => {
    const repo = makeScratchRepo();
    await captureExit(async () => {
      await runConfig([
        'set',
        'workflow.planning.discuss.mode',
        'user',
        '--level',
        'workspace',
      ]);
    });
    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toBe('');

    const filePath = join(repo, '.gobbi', 'settings.json');
    expect(existsSync(filePath)).toBe(true);
    const onDisk = JSON.parse(readFileSync(filePath, 'utf8')) as unknown;
    expect(onDisk).toEqual({
      schemaVersion: 1,
      workflow: { planning: { discuss: { mode: 'user' } } },
    });

    resetCapture();
    await captureExit(async () => {
      await runConfig([
        'get',
        'workflow.planning.discuss.mode',
        '--level',
        'workspace',
      ]);
    });
    expect(captured.stdout).toBe('"user"\n');
    expect(captured.exitCode).toBeNull();
  });
});

// ===========================================================================
// CFG-3: CLI exit code discipline
// ===========================================================================

describe("CFG-3: exit codes — 0 success, 1 missing key, 2 validation/IO/argv", () => {
  test('CFG-3a: get on a missing key (cascade) exits 1, stdout silent', async () => {
    makeScratchRepo();
    await captureExit(async () => {
      await runConfig(['get', 'notify.slack.nosuch']);
    });
    expect(captured.stdout).toBe('');
    expect(captured.exitCode).toBe(1);
  });

  test('CFG-3b: set with invalid enum value exits 2 with AJV diagnostic', async () => {
    makeScratchRepo();
    await captureExit(async () => {
      await runConfig([
        'set',
        'workflow.ideation.evaluate.mode',
        'NOT_A_MODE',
        '--level',
        'workspace',
      ]);
    });
    expect(captured.stderr).toContain('validation failed');
    expect(captured.exitCode).toBe(2);
  });

  test('CFG-3c: --level session without a session id exits 2', async () => {
    makeScratchRepo();
    // Default write target is session; with no env and no --session-id flag
    // the CLI must exit 2 rather than fall through to a bogus directory.
    await captureExit(async () => {
      await runConfig(['set', 'workflow.planning.discuss.mode', 'user']);
    });
    expect(captured.stderr).toContain(
      'requires CLAUDE_SESSION_ID env or --session-id',
    );
    expect(captured.exitCode).toBe(2);
  });
});

// ===========================================================================
// CFG-4: --level flag scopes the read/write to a single file
// ===========================================================================

describe("CFG-4: --level flag reads/writes ONLY that level's file", () => {
  test('CFG-4: --level workspace on a fresh repo exits 1 silently even if DEFAULTS has the key', async () => {
    makeScratchRepo();
    // git.workflow.mode has a DEFAULT of 'direct-commit'. With --level, we
    // read only the workspace file (which does not exist), so the result
    // is "missing at this level" → exit 1. No cascade fallthrough.
    await captureExit(async () => {
      await runConfig(['get', 'git.workflow.mode', '--level', 'workspace']);
    });
    expect(captured.stdout).toBe('');
    expect(captured.exitCode).toBe(1);
  });

  test('CFG-4: session-level writes land at .gobbi/sessions/<id>/settings.json', async () => {
    const repo = makeScratchRepo();
    process.env['CLAUDE_SESSION_ID'] = 'cfg-4-session';
    await captureExit(async () => {
      await runConfig(['set', 'workflow.ideation.discuss.mode', 'agent']);
    });
    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toBe('');

    const filePath = join(repo, '.gobbi', 'sessions', 'cfg-4-session', 'settings.json');
    expect(existsSync(filePath)).toBe(true);
    const onDisk = JSON.parse(readFileSync(filePath, 'utf8')) as {
      readonly workflow: { readonly ideation: { readonly discuss: { readonly mode: string } } };
    };
    expect(onDisk.workflow.ideation.discuss.mode).toBe('agent');
  });
});

// ===========================================================================
// CFG-5: cascade order — narrower wins (session > project > workspace > default)
// ===========================================================================

describe("CFG-5: cascade order — narrower level wins", () => {
  test('CFG-5: session > project > workspace > default for the same key', () => {
    const repo = makeScratchRepo();

    // Workspace: mode=user, mode at execution.discuss
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      workflow: {
        execution: { discuss: { mode: 'user' } },
      },
    });
    // Project: overrides same key to skip
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      schemaVersion: 1,
      workflow: {
        execution: { discuss: { mode: 'skip' } },
      },
    });
    // Session: overrides same key to agent
    writeJson(
      join(repo, '.gobbi', 'sessions', 'sess-5', 'settings.json'),
      {
        schemaVersion: 1,
        workflow: {
          execution: { discuss: { mode: 'agent' } },
        },
      },
    );

    const resolved = resolveSettings({ repoRoot: repo, sessionId: 'sess-5' });
    expect(resolved.workflow?.execution?.discuss?.mode).toBe('agent');

    // Now resolve without a session id — project wins (session skipped).
    const noSession = resolveSettings({ repoRoot: repo });
    expect(noSession.workflow?.execution?.discuss?.mode).toBe('skip');
  });
});

// ===========================================================================
// CFG-6: arrays replace (no concat, no dedup)
// ===========================================================================

describe("CFG-6: arrays replace on overlay", () => {
  test('CFG-6: project notify.slack.events replaces workspace array entirely', () => {
    const repo = makeScratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      notify: {
        slack: { events: ['workflow.start', 'workflow.complete', 'error'] },
      },
    });
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      schemaVersion: 1,
      notify: {
        slack: { events: ['step.start'] },
      },
    });

    const resolved = resolveSettings({ repoRoot: repo });
    // The narrower level's array wins wholesale — no concat.
    expect(resolved.notify?.slack?.events).toEqual(['step.start']);
  });
});

// ===========================================================================
// CFG-7: null at a narrower level is an explicit leaf (terminates delegation)
// ===========================================================================

describe("CFG-7: null is an explicit leaf, overrides wider non-null value", () => {
  test('CFG-7: project git.workflow.baseBranch=null overrides workspace "main"', () => {
    const repo = makeScratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      git: { workflow: { mode: 'direct-commit', baseBranch: 'main' } },
    });
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      schemaVersion: 1,
      git: { workflow: { baseBranch: null } },
    });

    const resolved = resolveSettings({ repoRoot: repo });
    // null wins as a leaf (no delegation to workspace 'main').
    expect(resolved.git?.workflow?.baseBranch).toBeNull();
    // Sibling workflow.mode retained from workspace.
    expect(resolved.git?.workflow?.mode).toBe('direct-commit');
  });
});

// ===========================================================================
// CFG-8: absent key delegates to the next-wider level
// ===========================================================================

describe("CFG-8: absent keys delegate through the cascade to DEFAULTS", () => {
  test('CFG-8: project sets git only; workflow.*.discuss.mode falls to DEFAULTS', () => {
    const repo = makeScratchRepo();
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      schemaVersion: 1,
      git: { workflow: { mode: 'worktree-pr', baseBranch: 'develop' } },
    });

    const resolved = resolveSettings({ repoRoot: repo });
    // Project-set values land.
    expect(resolved.git?.workflow?.mode).toBe('worktree-pr');
    expect(resolved.git?.workflow?.baseBranch).toBe('develop');
    // Unset keys delegate to DEFAULTS.
    expect(resolved.workflow?.ideation?.discuss?.mode).toBe('user');
    expect(resolved.workflow?.planning?.evaluate?.mode).toBe('always');
  });
});

// ===========================================================================
// CFG-9: T2-v1 → new-shape upgrader inside ensureSettingsCascade
// ===========================================================================

describe("CFG-9: T2-v1 legacy upgrader writes new-shape settings.json", () => {
  test('CFG-9: legacy git.mode + eval.* boolean upgrades to workflow/git enum shape', async () => {
    const repo = makeScratchRepo();
    // Legacy T2-v1 payload — the Pass-3 shape.
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify(
        {
          version: 1,
          git: { mode: 'worktree-pr', baseBranch: 'develop' },
          eval: { ideation: true, plan: false, execution: true },
          // Dropped sections in the new shape — must be stripped silently.
          cost: { rateTable: {} },
          ui: { verbosity: 'verbose' },
          trivialRange: 'read-only',
          verification: { commands: [] },
        },
        null,
        2,
      ),
      'utf8',
    );

    // Silence the ensure-settings-cascade stderr line.
    const origErr = process.stderr.write;
    process.stderr.write = ((): boolean => true) as typeof process.stderr.write;
    try {
      await ensureSettingsCascade(repo);
    } finally {
      process.stderr.write = origErr;
    }

    const newProjectPath = join(repo, '.gobbi', 'project', 'settings.json');
    expect(existsSync(newProjectPath)).toBe(true);
    const upgraded = JSON.parse(readFileSync(newProjectPath, 'utf8')) as Settings;

    // Git: mode + baseBranch moved under git.workflow
    expect(upgraded.git?.workflow?.mode).toBe('worktree-pr');
    expect(upgraded.git?.workflow?.baseBranch).toBe('develop');

    // Eval booleans → evaluate.mode enums.
    expect(upgraded.workflow?.ideation?.evaluate?.mode).toBe('always');
    expect(upgraded.workflow?.planning?.evaluate?.mode).toBe('ask');
    expect(upgraded.workflow?.execution?.evaluate?.mode).toBe('always');

    // Dropped sections: not present on the upgraded doc.
    const asRecord = upgraded as unknown as Record<string, unknown>;
    expect(asRecord['cost']).toBeUndefined();
    expect(asRecord['ui']).toBeUndefined();
    expect(asRecord['trivialRange']).toBeUndefined();
    expect(asRecord['verification']).toBeUndefined();
  });
});

// ===========================================================================
// CFG-10: idempotent — T2-v1 upgrader skips when new-shape file already exists
// ===========================================================================

describe("CFG-10: T2-v1 upgrader is a no-op when project/settings.json already exists", () => {
  test('CFG-10: new-shape file is preserved even if legacy file is also present', async () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi', 'project'), { recursive: true });

    // Pre-existing new-shape doc at the target path.
    const preExisting: Settings = {
      schemaVersion: 1,
      workflow: { ideation: { evaluate: { mode: 'skip' } } },
    };
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), preExisting);

    // Also drop a legacy v1 file beside it. Upgrader must skip the rewrite.
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify(
        { version: 1, eval: { ideation: true, plan: true, execution: true } },
        null,
        2,
      ),
      'utf8',
    );

    const origErr = process.stderr.write;
    process.stderr.write = ((): boolean => true) as typeof process.stderr.write;
    try {
      await ensureSettingsCascade(repo);
    } finally {
      process.stderr.write = origErr;
    }

    // New-shape file preserved verbatim.
    const stillThere = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'project', 'settings.json'), 'utf8'),
    ) as Settings;
    expect(stillThere.workflow?.ideation?.evaluate?.mode).toBe('skip');
  });
});

// ===========================================================================
// CFG-11: legacy `.gobbi/config.db` deleted by ensureSettingsCascade
// ===========================================================================

describe("CFG-11: legacy .gobbi/config.db is deleted on ensureSettingsCascade", () => {
  test('CFG-11: stale SQLite file removed; no crash on malformed content', async () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    // Any content — the deletion does not parse; existence is the trigger.
    writeFileSync(
      join(repo, '.gobbi', 'config.db'),
      'not a real sqlite database',
      'utf8',
    );
    expect(existsSync(join(repo, '.gobbi', 'config.db'))).toBe(true);

    const origErr = process.stderr.write;
    process.stderr.write = ((): boolean => true) as typeof process.stderr.write;
    try {
      await ensureSettingsCascade(repo);
    } finally {
      process.stderr.write = origErr;
    }

    expect(existsSync(join(repo, '.gobbi', 'config.db'))).toBe(false);
  });
});

// ===========================================================================
// CFG-12: legacy `.claude/gobbi.json` deleted by ensureSettingsCascade
// ===========================================================================

describe("CFG-12: legacy .claude/gobbi.json is deleted on ensureSettingsCascade", () => {
  test('CFG-12: stale JSON file removed', async () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.claude'), { recursive: true });
    writeFileSync(
      join(repo, '.claude', 'gobbi.json'),
      JSON.stringify({ legacy: true }, null, 2),
      'utf8',
    );
    expect(existsSync(join(repo, '.claude', 'gobbi.json'))).toBe(true);

    const origErr = process.stderr.write;
    process.stderr.write = ((): boolean => true) as typeof process.stderr.write;
    try {
      await ensureSettingsCascade(repo);
    } finally {
      process.stderr.write = origErr;
    }

    expect(existsSync(join(repo, '.claude', 'gobbi.json'))).toBe(false);
  });
});

// ===========================================================================
// CFG-13: malformed JSON surfaces as ConfigCascadeError('parse', tier)
// ===========================================================================

describe("CFG-13: malformed JSON at any level → ConfigCascadeError('parse')", () => {
  test('CFG-13a: workspace settings.json malformed → parse error tagged workspace', () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'settings.json'),
      '{ not-a-valid-json',
      'utf8',
    );

    try {
      resolveSettings({ repoRoot: repo });
      throw new Error('expected ConfigCascadeError');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.tier).toBe('workspace');
        expect(err.path).toContain('settings.json');
      }
    }
  });

  test('CFG-13b: project settings.json malformed → parse error tagged project', () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi', 'project'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project', 'settings.json'),
      '{ still-not-json',
      'utf8',
    );

    try {
      resolveSettings({ repoRoot: repo });
      throw new Error('expected ConfigCascadeError');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.tier).toBe('project');
      }
    }
  });

  test('CFG-13c: schema violation (unknown key) → parse error with AJV message', () => {
    const repo = makeScratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      notARealSection: { foo: 'bar' },
    });

    try {
      resolveSettings({ repoRoot: repo });
      throw new Error('expected ConfigCascadeError');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.tier).toBe('workspace');
        // AJV message surfaces additionalProperties rejection.
        expect(err.message).toMatch(/additional|notARealSection|property/i);
      }
    }
  });
});

// ===========================================================================
// CFG-14 (new, cross-field check): worktree-pr + null baseBranch → parse error
// ===========================================================================
//
// Added to preserve coverage of the cross-field invariant that the Pass-3
// provenance-era scenarios implicitly exercised through their worktree-pr
// fixtures. This consolidation keeps the cross-field check explicit even
// though the original provenance assertions retired with backlog #124.

describe("CFG-14: cross-field — worktree-pr requires a non-null baseBranch", () => {
  test('CFG-14: cascade resolves git.workflow.mode=worktree-pr + baseBranch=null → parse error', () => {
    const repo = makeScratchRepo();
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      schemaVersion: 1,
      git: { workflow: { mode: 'worktree-pr', baseBranch: null } },
    });

    try {
      resolveSettings({ repoRoot: repo });
      throw new Error('expected ConfigCascadeError');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.message).toMatch(/worktree-pr/);
      }
    }
  });
});
