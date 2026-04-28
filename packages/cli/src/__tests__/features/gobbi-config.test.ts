/**
 * Feature-level integration tests for gobbi-config — Pass 3 finalization (Wave D.2).
 *
 * Ports the original 13 Gherkin scenarios (CFG-*) from the Pass-3 SQLite +
 * provenance era to the unified `settings.json` three-level cascade:
 *
 *   workspace → `.gobbi/settings.json`
 *   project   → `.gobbi/projects/<projectName>/settings.json`
 *   session   → `.gobbi/projects/<projectName>/sessions/<id>/settings.json`
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
import { basename, join } from 'node:path';

import {
  projectDir as projectDirForName,
  sessionDir as sessionDirForProject,
} from '../../lib/workspace-paths.js';

// PR-FIN-1c: `runConfig` / `resolveSettings` resolve the project name to
// `basename(repoRoot)` when no `--project` flag is supplied. The scratch
// repo's basename is dynamic (mkdtempSync), so most tests resolve it at
// runtime via `basename(scratchRepo)` rather than a static literal.

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
    // PR-FIN-1c: project name resolves silently to basename(repoRoot);
    // no warning fires.
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
    // git.pr.open has a DEFAULT of true. With --level, we read only the
    // workspace file (which does not exist), so the result is
    // "missing at this level" → exit 1. No cascade fallthrough.
    await captureExit(async () => {
      await runConfig(['get', 'git.pr.open', '--level', 'workspace']);
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

    const filePath = join(
      sessionDirForProject(repo, basename(repo), 'cfg-4-session'),
      'settings.json',
    );
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
    writeJson(join(projectDirForName(repo, basename(repo)), 'settings.json'), {
      schemaVersion: 1,
      workflow: {
        execution: { discuss: { mode: 'skip' } },
      },
    });
    // Session: overrides same key to agent
    writeJson(
      join(
        sessionDirForProject(repo, basename(repo), 'sess-5'),
        'settings.json',
      ),
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
    writeJson(join(projectDirForName(repo, basename(repo)), 'settings.json'), {
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
  test('CFG-7: project git.baseBranch=null overrides workspace "main"', () => {
    const repo = makeScratchRepo();
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      git: { baseBranch: 'main', pr: { open: false } },
    });
    writeJson(join(projectDirForName(repo, basename(repo)), 'settings.json'), {
      schemaVersion: 1,
      git: { baseBranch: null },
    });

    const resolved = resolveSettings({ repoRoot: repo });
    // null wins as a leaf (no delegation to workspace 'main').
    expect(resolved.git?.baseBranch).toBeNull();
    // Sibling pr.open retained from workspace.
    expect(resolved.git?.pr?.open).toBe(false);
  });
});

// ===========================================================================
// CFG-8: absent key delegates to the next-wider level
// ===========================================================================

describe("CFG-8: absent keys delegate through the cascade to DEFAULTS", () => {
  test('CFG-8: project sets git only; workflow.*.discuss.mode falls to DEFAULTS', () => {
    const repo = makeScratchRepo();
    writeJson(join(projectDirForName(repo, basename(repo)), 'settings.json'), {
      schemaVersion: 1,
      git: { baseBranch: 'develop', pr: { open: true } },
    });

    const resolved = resolveSettings({ repoRoot: repo });
    // Project-set values land.
    expect(resolved.git?.pr?.open).toBe(true);
    expect(resolved.git?.baseBranch).toBe('develop');
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

    // PR-FIN-1c: upgrader resolves the project slot via
    // `--project flag → basename(repoRoot)`. With no flag, the slot is
    // the scratch repo's basename.
    const newProjectPath = join(projectDirForName(repo, basename(repo)), 'settings.json');
    expect(existsSync(newProjectPath)).toBe(true);
    const upgraded = JSON.parse(readFileSync(newProjectPath, 'utf8')) as Settings;

    // PR-FIN-1c: legacy `git.mode === 'worktree-pr'` migrates to
    // `git.pr.open: true`; baseBranch moves to top of git.
    expect(upgraded.git?.pr?.open).toBe(true);
    expect(upgraded.git?.baseBranch).toBe('develop');

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
    // Post-#138: the upgrader's idempotency probe checks the resolved
    // project slot (basename(repoRoot) when no `projects.active` is
    // seeded), so the pre-existing fixture must land at the same slot.
    const slotName = basename(repo);
    mkdirSync(projectDirForName(repo, slotName), { recursive: true });

    // Pre-existing new-shape doc at the target path. `projects` is a
    // required field after the gobbi-memory Pass 2 schema extension;
    // the fresh-install {active:null, known:[]} pair keeps the fixture
    // shape minimal.
    const preExisting: Settings = {
      schemaVersion: 1,
      workflow: { ideation: { evaluate: { mode: 'skip' } } },
    };
    writeJson(join(projectDirForName(repo, slotName), 'settings.json'), preExisting);

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
      readFileSync(join(projectDirForName(repo, slotName), 'settings.json'), 'utf8'),
    ) as Settings;
    expect(stillThere.workflow?.ideation?.evaluate?.mode).toBe('skip');
  });
});

// ===========================================================================
// CFG-10b: explicit projectName routes T2-v1 upgrade to the right slot
// ===========================================================================
//
// PR-FIN-1c removed the `projects.active` registry. The upgrade target
// is now resolved as `--project flag → basename(repoRoot)`. This test
// asserts the explicit `projectName` argument to `ensureSettingsCascade`
// directs the legacy upgrade to the matching project slot.

describe('CFG-10b: explicit projectName routes the upgrade to the matching slot', () => {
  test('explicit projectName argument lands the upgrade at projects/<name>/', async () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });

    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify(
        { version: 1, git: { mode: 'direct-commit' } },
        null,
        2,
      ),
      'utf8',
    );

    const origErr = process.stderr.write;
    process.stderr.write = ((): boolean => true) as typeof process.stderr.write;
    try {
      await ensureSettingsCascade(repo, 'bar');
    } finally {
      process.stderr.write = origErr;
    }

    expect(existsSync(join(projectDirForName(repo, 'bar'), 'settings.json'))).toBe(true);
    expect(existsSync(join(projectDirForName(repo, 'foo'), 'settings.json'))).toBe(false);
    // basename(repo) slot is also empty — explicit projectName wins.
    expect(existsSync(join(projectDirForName(repo, basename(repo)), 'settings.json'))).toBe(false);
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
    mkdirSync(projectDirForName(repo, basename(repo)), { recursive: true });
    writeFileSync(
      join(projectDirForName(repo, basename(repo)), 'settings.json'),
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
// CFG-14 (PR-FIN-1c cross-field check): pr.open=true + null baseBranch → parse error
// ===========================================================================
//
// PR-FIN-1c reshaped the cross-field invariant: instead of the legacy
// `git.workflow.mode === 'worktree-pr'` check, the new check is
// `git.pr.open === true` requires `git.baseBranch !== null`. A repo
// without a target branch must set `pr.open: false`.

describe("CFG-14: cross-field — pr.open=true requires a non-null baseBranch", () => {
  test('CFG-14: cascade resolves git.pr.open=true + baseBranch=null → parse error', () => {
    const repo = makeScratchRepo();
    writeJson(join(projectDirForName(repo, basename(repo)), 'settings.json'), {
      schemaVersion: 1,
      git: { baseBranch: null, pr: { open: true } },
    });

    try {
      resolveSettings({ repoRoot: repo });
      throw new Error('expected ConfigCascadeError');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.message).toMatch(/pr\.open/);
        expect(err.message).toMatch(/baseBranch/);
      }
    }
  });
});

// ===========================================================================
// CFG-15 (PR-FIN-1c): T2-v1 upgrader maps legacy git fields to new shape
// ===========================================================================

describe('CFG-15: T2-v1 upgrader applies the PR-FIN-1c reshape end-to-end', () => {
  test('legacy git.{mode,cleanup} migrates to new shape; projects dropped', async () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project-config.json'),
      JSON.stringify(
        {
          version: 1,
          git: {
            mode: 'worktree-pr',
            baseBranch: 'develop',
            pr: { draft: true },
            cleanup: { worktree: false, branch: false },
          },
        },
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

    const upgradedPath = join(projectDirForName(repo, basename(repo)), 'settings.json');
    const upgraded = JSON.parse(readFileSync(upgradedPath, 'utf8')) as Settings;

    expect(upgraded.git?.baseBranch).toBe('develop');
    expect(upgraded.git?.pr?.open).toBe(true);
    expect(upgraded.git?.pr?.draft).toBe(true);
    expect(upgraded.git?.worktree?.autoRemove).toBe(false);
    expect(upgraded.git?.branch?.autoRemove).toBe(false);
    // No `projects` block anywhere.
    expect((upgraded as unknown as Record<string, unknown>)['projects']).toBeUndefined();
  });
});

// ===========================================================================
// CFG-16 (PR-FIN-1c): DEFAULTS-exempt cross-field check
// ===========================================================================
//
// `DEFAULTS.git.pr.open` is `true` and `DEFAULTS.git.baseBranch` is `null`.
// A fresh repo where both values come from DEFAULTS must NOT trip the
// cross-field invariant — only an *explicit* user-set `pr.open=true`
// without a non-null `baseBranch` is a misconfiguration. This is the
// most subtle semantic of the PR-FIN-1c cross-field check.

describe("CFG-16: DEFAULTS-exempt — fresh repo with no user settings does not throw", () => {
  test('CFG-16: empty repo (no user settings files) resolves without throwing', () => {
    const repo = makeScratchRepo();
    const resolved = resolveSettings({ repoRoot: repo });
    // Both values come from DEFAULTS; the cross-field check must be
    // skipped because the user has not chosen `pr.open=true` themselves.
    expect(resolved.git?.pr?.open).toBe(true);
    expect(resolved.git?.baseBranch).toBe(null);
  });

  test('CFG-16: explicit user pr.open=true with absent baseBranch throws', () => {
    const repo = makeScratchRepo();
    // User explicitly opts in to PR opening but never sets baseBranch —
    // the resolved baseBranch comes from DEFAULTS (null) and the check
    // must fire because the user *did* explicitly set pr.open.
    writeJson(join(projectDirForName(repo, basename(repo)), 'settings.json'), {
      schemaVersion: 1,
      git: { pr: { open: true } },
    });
    try {
      resolveSettings({ repoRoot: repo });
      throw new Error('expected ConfigCascadeError');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.message).toMatch(/pr\.open/);
        expect(err.message).toMatch(/baseBranch/);
      }
    }
  });

  test('CFG-16: user-set baseBranch alone (DEFAULTS pr.open) does not throw', () => {
    const repo = makeScratchRepo();
    // User sets only baseBranch; pr.open comes from DEFAULTS (true) but
    // since the *user* did not explicitly opt in, the check is skipped.
    writeJson(join(projectDirForName(repo, basename(repo)), 'settings.json'), {
      schemaVersion: 1,
      git: { baseBranch: 'main' },
    });
    const resolved = resolveSettings({ repoRoot: repo });
    expect(resolved.git?.baseBranch).toBe('main');
    expect(resolved.git?.pr?.open).toBe(true);
  });
});

// ===========================================================================
// CFG-17 (PR-FIN-1c): Pass-3 current-shape in-place upgrade
// ===========================================================================
//
// `ensureSettingsCascade` Step 4 (`upgradeFileInPlace` +
// `needsCurrentShapeUpgrade`) detects Pass-3-current files (with
// `git.workflow.*`, `projects.*`, or `git.cleanup.*`) and rewrites them
// in place to the PR-FIN-1c shape. Idempotent on re-run.

describe('CFG-17: Pass-3 current-shape in-place upgrade by ensureSettingsCascade', () => {
  test('CFG-17: project-level Pass-3 shape is upgraded in place', async () => {
    const repo = makeScratchRepo();
    mkdirSync(projectDirForName(repo, basename(repo)), { recursive: true });
    // Seed a Pass-3 shape file (with `git.workflow.*`, `projects.*`).
    writeJson(join(projectDirForName(repo, basename(repo)), 'settings.json'), {
      schemaVersion: 1,
      projects: { active: null, known: [] },
      git: { workflow: { mode: 'worktree-pr', baseBranch: 'main' }, cleanup: { branch: false } },
    });

    const origErr = process.stderr.write;
    process.stderr.write = ((): boolean => true) as typeof process.stderr.write;
    try {
      await ensureSettingsCascade(repo);
    } finally {
      process.stderr.write = origErr;
    }

    const upgradedPath = join(projectDirForName(repo, basename(repo)), 'settings.json');
    const upgraded = JSON.parse(readFileSync(upgradedPath, 'utf8')) as Settings;
    expect(upgraded.git?.baseBranch).toBe('main');
    expect(upgraded.git?.pr?.open).toBe(true);
    expect(upgraded.git?.branch?.autoRemove).toBe(false);
    expect((upgraded as unknown as Record<string, unknown>)['projects']).toBeUndefined();
    // Legacy git.workflow / git.cleanup blocks must be gone.
    const onDiskGit = upgraded.git as unknown as Record<string, unknown>;
    expect(onDiskGit['workflow']).toBeUndefined();
    expect(onDiskGit['cleanup']).toBeUndefined();
  });

  test('CFG-17: re-running ensureSettingsCascade is idempotent on already-upgraded file', async () => {
    const repo = makeScratchRepo();
    mkdirSync(projectDirForName(repo, basename(repo)), { recursive: true });
    writeJson(join(projectDirForName(repo, basename(repo)), 'settings.json'), {
      schemaVersion: 1,
      projects: { active: null, known: [] },
      git: { workflow: { mode: 'worktree-pr', baseBranch: 'main' } },
    });

    const origErr = process.stderr.write;
    process.stderr.write = ((): boolean => true) as typeof process.stderr.write;
    try {
      await ensureSettingsCascade(repo);
      const upgradedPath = join(projectDirForName(repo, basename(repo)), 'settings.json');
      const firstPass = readFileSync(upgradedPath, 'utf8');
      // Second run must not modify the (already-upgraded) file.
      await ensureSettingsCascade(repo);
      const secondPass = readFileSync(upgradedPath, 'utf8');
      expect(secondPass).toBe(firstPass);
    } finally {
      process.stderr.write = origErr;
    }
  });

  test('CFG-17: workspace-level Pass-3 shape is upgraded in place', async () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    // Workspace-level Pass-3 shape — `git.workflow` triggers the upgrader.
    writeJson(join(repo, '.gobbi', 'settings.json'), {
      schemaVersion: 1,
      git: { workflow: { mode: 'direct-commit', baseBranch: 'main' } },
    });

    const origErr = process.stderr.write;
    process.stderr.write = ((): boolean => true) as typeof process.stderr.write;
    try {
      await ensureSettingsCascade(repo);
    } finally {
      process.stderr.write = origErr;
    }

    const upgradedPath = join(repo, '.gobbi', 'settings.json');
    const upgraded = JSON.parse(readFileSync(upgradedPath, 'utf8')) as Settings;
    expect(upgraded.git?.baseBranch).toBe('main');
    expect(upgraded.git?.pr?.open).toBe(false);
    const onDiskGit = upgraded.git as unknown as Record<string, unknown>;
    expect(onDiskGit['workflow']).toBeUndefined();
  });
});

// ===========================================================================
// CFG-18 (PR-FIN-1c): `gobbi project list` filesystem scan
// ===========================================================================
//
// `gobbi project list` reads `.gobbi/projects/` directory entries via
// `readdirSync` rather than consulting the (removed) `projects.known`
// registry. The active marker (`*`) fires for the entry whose name
// matches `basename(repoRoot)`.

describe('CFG-18: gobbi project list — filesystem scan replaces registry', () => {
  test('CFG-18: lists every directory under .gobbi/projects/ sorted alphabetically', async () => {
    const repo = makeScratchRepo();
    // Create three project directories — none of them match
    // basename(scratchRepo) (which is `gobbi-cfg-feat-XXXXXX`).
    mkdirSync(join(repo, '.gobbi', 'projects', 'alpha'), { recursive: true });
    mkdirSync(join(repo, '.gobbi', 'projects', 'beta'), { recursive: true });
    mkdirSync(join(repo, '.gobbi', 'projects', 'gobbi'), { recursive: true });

    // Lazy import — `runProjectListWithOptions` is in a sibling module
    // and we want to keep the test file's static-import surface focused.
    const { runProjectListWithOptions } = await import('../../commands/project/list.js');
    await runProjectListWithOptions([], { repoRoot: repo });

    const stdout = captured.stdout;
    // Sorted alphabetically: alpha, beta, gobbi.
    const rows = stdout.split('\n').filter((r) => r.length > 0);
    expect(rows).toEqual([' \talpha', ' \tbeta', ' \tgobbi']);
  });

  test('CFG-18: active marker fires for basename(repoRoot) match', async () => {
    const repo = makeScratchRepo();
    const repoBase = basename(repo);
    mkdirSync(join(repo, '.gobbi', 'projects', repoBase), { recursive: true });
    mkdirSync(join(repo, '.gobbi', 'projects', 'sibling'), { recursive: true });

    const { runProjectListWithOptions } = await import('../../commands/project/list.js');
    await runProjectListWithOptions([], { repoRoot: repo });

    const rows = captured.stdout.split('\n').filter((r) => r.length > 0);
    const active = rows.find((r) => r.startsWith('*\t'));
    expect(active).toBe(`*\t${repoBase}`);
  });
});
