/**
 * Unit tests for `gobbi gotcha` — the top-level dispatcher, registry, and
 * `promote` subcommand. Covers:
 *
 *   - Registry presence: `gotcha` is registered in the top-level
 *     `COMMANDS_BY_NAME` map and `promote` is present in `GOTCHA_COMMANDS`.
 *   - Dispatch: `--help` prints usage to stdout; unknown subcommands exit 1
 *     with a diagnostic on stderr.
 *   - Promote happy path: a regular `.md` file lands at
 *     `.claude/project/<project>/gotchas/` and the source is deleted.
 *   - Promote skill-scoped: `_skill-<name>.md` lands at
 *     `.claude/skills/<name>/gotchas.md`.
 *   - `--dry-run`: prints planned moves, writes nothing, deletes nothing.
 *   - Active-session rejection: a session with a fresh heartbeat blocks
 *     promotion; the Git-style Options block appears once.
 *   - Multi-active rejection: every active session is listed individually.
 *   - Empty source: exit 0 silently.
 *   - No destination project inferable: exit 1 with diagnostic.
 *
 * All tests operate on scratch directories under the OS temp dir — no real
 * session or `.claude/` paths are touched.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
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

import { COMMANDS_BY_NAME, COMMAND_ORDER } from '../../cli.js';
import {
  GOTCHA_COMMANDS,
  runGotchaWithRegistry,
  type GotchaCommand,
} from '../gotcha.js';
import {
  runPromoteWithOptions,
  findActiveSessions,
  renderActiveSessionError,
  HEARTBEAT_TTL_MS,
} from '../gotcha/promote.js';
import { EventStore } from '../../workflow/store.js';
import { createSessionHeartbeat } from '../../workflow/events/session.js';
import {
  createWorkflowStart,
  createFinish,
} from '../../workflow/events/workflow.js';

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
// Scratch dir helpers
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

function makeScratchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-gotcha-'));
  scratchDirs.push(dir);
  return dir;
}

/**
 * Build a scratch "repo" layout:
 *   <repo>/.gobbi/project/gotchas/  — source dir
 *   <repo>/.claude/project/<name>/  — destination project dir
 */
function makeRepoLayout(projectName: string | null): {
  repo: string;
  sourceDir: string;
  claudeDir: string;
} {
  const repo = makeScratchRepo();
  const sourceDir = join(repo, '.gobbi', 'project', 'gotchas');
  mkdirSync(sourceDir, { recursive: true });
  const claudeDir = join(repo, '.claude');
  if (projectName !== null) {
    mkdirSync(join(claudeDir, 'project', projectName), { recursive: true });
  } else {
    mkdirSync(join(claudeDir), { recursive: true });
  }
  return { repo, sourceDir, claudeDir };
}

/**
 * Seed a session directory with a SQLite store containing the supplied
 * events. The events are appended in order with `system` idempotency keyed
 * off the provided timestamps.
 */
function seedSession(
  repo: string,
  sessionId: string,
  events: Array<{
    readonly type: string;
    readonly data: object;
    readonly ts: string;
    readonly step?: string;
    readonly counter?: number;
  }>,
): void {
  const sessionDir = join(repo, '.gobbi', 'sessions', sessionId);
  mkdirSync(sessionDir, { recursive: true });
  const store = new EventStore(join(sessionDir, 'gobbi.db'));
  try {
    for (const e of events) {
      if (e.type === 'session.heartbeat') {
        store.append({
          idempotencyKind: 'counter',
          sessionId,
          ts: e.ts,
          type: e.type,
          data: JSON.stringify(e.data),
          actor: 'hook',
          counter: e.counter ?? 0,
          ...(e.step !== undefined ? { step: e.step } : {}),
        });
      } else {
        store.append({
          idempotencyKind: 'system',
          sessionId,
          ts: e.ts,
          type: e.type,
          data: JSON.stringify(e.data),
          actor: 'cli',
          ...(e.step !== undefined ? { step: e.step } : {}),
        });
      }
    }
  } finally {
    store.close();
  }
}

// ===========================================================================
// Registry presence
// ===========================================================================

describe('top-level registry', () => {
  test('`gotcha` is registered in COMMAND_ORDER and COMMANDS_BY_NAME', () => {
    expect(COMMAND_ORDER).toContain('gotcha');
    expect(COMMANDS_BY_NAME.gotcha.name).toBe('gotcha');
    expect(COMMANDS_BY_NAME.gotcha.summary.length).toBeGreaterThan(0);
  });
});

describe('GOTCHA_COMMANDS', () => {
  test('exposes `promote` with a non-empty summary', () => {
    const names = GOTCHA_COMMANDS.map((c) => c.name);
    expect(names).toContain('promote');
    for (const cmd of GOTCHA_COMMANDS) {
      expect(cmd.name.length).toBeGreaterThan(0);
      expect(cmd.summary.length).toBeGreaterThan(0);
    }
  });
});

// ===========================================================================
// Dispatcher
// ===========================================================================

describe('runGotchaWithRegistry — help', () => {
  test('--help lists every registered subcommand', async () => {
    const registry: GotchaCommand[] = [
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
    await captureExit(() => runGotchaWithRegistry(['--help'], registry));
    expect(captured.stdout).toContain('alpha');
    expect(captured.stdout).toContain('stub alpha');
    expect(captured.stdout).toContain('beta');
  });

  test('empty args produces the same help output as --help', async () => {
    await captureExit(() => runGotchaWithRegistry([], GOTCHA_COMMANDS));
    expect(captured.stdout).toContain('Usage: gobbi gotcha');
    expect(captured.stdout).toContain('promote');
  });
});

describe('runGotchaWithRegistry — dispatch', () => {
  test('routes to the matching registry entry and forwards trailing args', async () => {
    const state: { ran?: boolean; args?: string[] } = {};
    const registry: GotchaCommand[] = [
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
      runGotchaWithRegistry(['foo', '--flag', 'value'], registry),
    );
    expect(state.ran).toBe(true);
    expect(state.args).toEqual(['--flag', 'value']);
  });

  test('unknown subcommand exits 1 with an error line on stderr', async () => {
    await captureExit(() =>
      runGotchaWithRegistry(['unknown'], GOTCHA_COMMANDS),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('Unknown subcommand: unknown');
    expect(captured.stderr).toContain('promote');
  });
});

// ===========================================================================
// promote — happy path
// ===========================================================================

describe('runPromote — happy path (project-scoped)', () => {
  test('appends the source file to .claude/project/<project>/gotchas/ and deletes the source', async () => {
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    const sourceFile = join(sourceDir, 'foo.md');
    const originalBody =
      '## Gotcha: foo\n\nPriority: high\n\nwhat happened.\n';
    writeFileSync(sourceFile, originalBody, 'utf8');

    await captureExit(() =>
      runPromoteWithOptions([], { repoRoot: repo, claudeDir }),
    );

    expect(captured.exitCode).toBeNull();
    const destFile = join(claudeDir, 'project', 'testproj', 'gotchas', 'foo.md');
    expect(existsSync(destFile)).toBe(true);
    expect(readFileSync(destFile, 'utf8')).toBe(originalBody);
    expect(existsSync(sourceFile)).toBe(false);
  });

  test('appends (not overwrites) when the destination already exists', async () => {
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    const destDir = join(claudeDir, 'project', 'testproj', 'gotchas');
    mkdirSync(destDir, { recursive: true });
    const existing = '## existing entry\n\nold.\n';
    writeFileSync(join(destDir, 'bar.md'), existing, 'utf8');

    const newBody = '## new entry\n\nnew.\n';
    writeFileSync(join(sourceDir, 'bar.md'), newBody, 'utf8');

    await captureExit(() =>
      runPromoteWithOptions([], { repoRoot: repo, claudeDir }),
    );

    const merged = readFileSync(join(destDir, 'bar.md'), 'utf8');
    expect(merged).toContain('existing entry');
    expect(merged).toContain('new entry');
    expect(merged.indexOf('existing entry')).toBeLessThan(
      merged.indexOf('new entry'),
    );
  });
});

describe('runPromote — happy path (skill-scoped)', () => {
  test('`_skill-_git.md` routes to .claude/skills/_git/gotchas.md', async () => {
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    const sourceFile = join(sourceDir, '_skill-_git.md');
    const body = '## Skill gotcha entry\n\nPriority: medium\n';
    writeFileSync(sourceFile, body, 'utf8');

    await captureExit(() =>
      runPromoteWithOptions([], { repoRoot: repo, claudeDir }),
    );

    const destFile = join(claudeDir, 'skills', '_git', 'gotchas.md');
    expect(existsSync(destFile)).toBe(true);
    expect(readFileSync(destFile, 'utf8')).toBe(body);
    expect(existsSync(sourceFile)).toBe(false);
  });

  test('skill-scoped entry works even when no destination project can be inferred', async () => {
    // Scratch repo with NO .claude/project/* directories — the inference
    // returns null, but since the only source file is skill-scoped the
    // promotion still succeeds (skills do not need a project name).
    const repo = makeScratchRepo();
    const sourceDir = join(repo, '.gobbi', 'project', 'gotchas');
    mkdirSync(sourceDir, { recursive: true });
    const claudeDir = join(repo, '.claude');
    mkdirSync(claudeDir, { recursive: true });

    writeFileSync(
      join(sourceDir, '_skill-_plan.md'),
      '## plan-skill entry\n',
      'utf8',
    );

    await captureExit(() =>
      runPromoteWithOptions([], { repoRoot: repo, claudeDir }),
    );

    expect(captured.exitCode).toBeNull();
    expect(
      existsSync(join(claudeDir, 'skills', '_plan', 'gotchas.md')),
    ).toBe(true);
  });
});

// ===========================================================================
// --dry-run
// ===========================================================================

describe('runPromote — --dry-run', () => {
  test('prints planned moves but writes nothing and deletes nothing', async () => {
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    writeFileSync(join(sourceDir, 'foo.md'), 'body-foo\n', 'utf8');
    writeFileSync(
      join(sourceDir, '_skill-_gotcha.md'),
      'body-skill\n',
      'utf8',
    );

    await captureExit(() =>
      runPromoteWithOptions(['--dry-run'], { repoRoot: repo, claudeDir }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Would promote');
    expect(captured.stdout).toContain('foo.md');
    expect(captured.stdout).toContain('_skill-_gotcha.md');
    expect(captured.stdout).toContain('(append');

    // Nothing created at the destinations.
    expect(
      existsSync(
        join(claudeDir, 'project', 'testproj', 'gotchas', 'foo.md'),
      ),
    ).toBe(false);
    expect(
      existsSync(join(claudeDir, 'skills', '_gotcha', 'gotchas.md')),
    ).toBe(false);

    // Nothing deleted at the source.
    expect(existsSync(join(sourceDir, 'foo.md'))).toBe(true);
    expect(existsSync(join(sourceDir, '_skill-_gotcha.md'))).toBe(true);
  });
});

// ===========================================================================
// Active-session rejection
// ===========================================================================

describe('runPromote — active-session rejection', () => {
  test('rejects when a single session has a recent heartbeat', async () => {
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    writeFileSync(join(sourceDir, 'foo.md'), 'body\n', 'utf8');

    const now = new Date('2026-04-16T10:00:00.000Z');
    const hbAt = new Date(now.getTime() - 3 * 60_000); // 3 minutes ago
    seedSession(repo, 'active-1', [
      {
        type: 'workflow.start',
        data: createWorkflowStart({
          sessionId: 'active-1',
          timestamp: hbAt.toISOString(),
        }).data,
        ts: hbAt.toISOString(),
      },
      {
        type: 'session.heartbeat',
        data: createSessionHeartbeat({ timestamp: hbAt.toISOString() }).data,
        ts: hbAt.toISOString(),
        step: 'execution',
        counter: 0,
      },
    ]);

    await captureExit(() =>
      runPromoteWithOptions([], {
        repoRoot: repo,
        claudeDir,
        now: () => now,
      }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain(
      'Cannot promote gotchas while a session is active',
    );
    expect(captured.stderr).toContain('active-1');
    expect(captured.stderr).toContain('3 minutes ago');
    expect(captured.stderr).toContain('step: execution');
    expect(captured.stderr).toContain('Options:');
    expect(captured.stderr).toContain(
      'gobbi workflow transition FINISH',
    );
    expect(captured.stderr).toContain('gobbi workflow transition ABORT');
    expect(captured.stderr).toContain('Wait for TTL to expire');

    // Source file remains.
    expect(existsSync(join(sourceDir, 'foo.md'))).toBe(true);
  });

  test('lists every active session individually but renders Options once', async () => {
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    writeFileSync(join(sourceDir, 'foo.md'), 'body\n', 'utf8');

    const now = new Date('2026-04-16T10:00:00.000Z');
    const hb1 = new Date(now.getTime() - 2 * 60_000);
    const hb2 = new Date(now.getTime() - 45 * 1000);
    seedSession(repo, 'active-1', [
      {
        type: 'session.heartbeat',
        data: createSessionHeartbeat({ timestamp: hb1.toISOString() }).data,
        ts: hb1.toISOString(),
        step: 'ideation',
        counter: 0,
      },
    ]);
    seedSession(repo, 'active-2', [
      {
        type: 'session.heartbeat',
        data: createSessionHeartbeat({ timestamp: hb2.toISOString() }).data,
        ts: hb2.toISOString(),
        step: 'plan',
        counter: 0,
      },
    ]);

    await captureExit(() =>
      runPromoteWithOptions([], {
        repoRoot: repo,
        claudeDir,
        now: () => now,
      }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('active-1');
    expect(captured.stderr).toContain('active-2');
    // Options block appears exactly once.
    const occurrences = captured.stderr.split('Options:').length - 1;
    expect(occurrences).toBe(1);
  });

  test('skips sessions with a workflow.finish event', async () => {
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    writeFileSync(join(sourceDir, 'foo.md'), 'body\n', 'utf8');

    const now = new Date('2026-04-16T10:00:00.000Z');
    const hbAt = new Date(now.getTime() - 10 * 60_000);
    const finishAt = new Date(now.getTime() - 5 * 60_000);
    seedSession(repo, 'completed-1', [
      {
        type: 'session.heartbeat',
        data: createSessionHeartbeat({ timestamp: hbAt.toISOString() }).data,
        ts: hbAt.toISOString(),
        counter: 0,
      },
      {
        type: 'workflow.finish',
        data: createFinish({} as Record<string, never>).data,
        ts: finishAt.toISOString(),
      },
    ]);

    await captureExit(() =>
      runPromoteWithOptions([], {
        repoRoot: repo,
        claudeDir,
        now: () => now,
      }),
    );

    expect(captured.exitCode).toBeNull();
    // Promotion proceeded despite the session being on disk.
    expect(
      existsSync(
        join(claudeDir, 'project', 'testproj', 'gotchas', 'foo.md'),
      ),
    ).toBe(true);
  });

  test('skips abandoned sessions (heartbeat older than 60 minutes)', async () => {
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    writeFileSync(join(sourceDir, 'foo.md'), 'body\n', 'utf8');

    const now = new Date('2026-04-16T10:00:00.000Z');
    const hbAt = new Date(now.getTime() - HEARTBEAT_TTL_MS - 1000);
    seedSession(repo, 'stale-1', [
      {
        type: 'session.heartbeat',
        data: createSessionHeartbeat({ timestamp: hbAt.toISOString() }).data,
        ts: hbAt.toISOString(),
        counter: 0,
      },
    ]);

    await captureExit(() =>
      runPromoteWithOptions([], {
        repoRoot: repo,
        claudeDir,
        now: () => now,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(
      existsSync(
        join(claudeDir, 'project', 'testproj', 'gotchas', 'foo.md'),
      ),
    ).toBe(true);
  });
});

// ===========================================================================
// Edge cases
// ===========================================================================

describe('runPromote — edge cases', () => {
  test('empty source directory exits 0 silently', async () => {
    const { repo, claudeDir } = makeRepoLayout('testproj');
    // sourceDir exists but is empty.
    await captureExit(() =>
      runPromoteWithOptions([], { repoRoot: repo, claudeDir }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
  });

  test('missing source directory exits 0 silently', async () => {
    const repo = makeScratchRepo();
    const claudeDir = join(repo, '.claude');
    mkdirSync(join(claudeDir, 'project', 'testproj'), { recursive: true });
    await captureExit(() =>
      runPromoteWithOptions([], { repoRoot: repo, claudeDir }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
  });

  test('no destination project inferable → exit 1 with diagnostic', async () => {
    const repo = makeScratchRepo();
    const sourceDir = join(repo, '.gobbi', 'project', 'gotchas');
    mkdirSync(sourceDir, { recursive: true });
    writeFileSync(join(sourceDir, 'foo.md'), 'body\n', 'utf8');
    const claudeDir = join(repo, '.claude');
    // Two project dirs → ambiguous.
    mkdirSync(join(claudeDir, 'project', 'alpha'), { recursive: true });
    mkdirSync(join(claudeDir, 'project', 'beta'), { recursive: true });

    await captureExit(() =>
      runPromoteWithOptions([], { repoRoot: repo, claudeDir }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('no destination project configured');
    // Source still present — nothing was moved.
    expect(existsSync(join(sourceDir, 'foo.md'))).toBe(true);
  });

  test('--destination-project overrides inference', async () => {
    const repo = makeScratchRepo();
    const sourceDir = join(repo, '.gobbi', 'project', 'gotchas');
    mkdirSync(sourceDir, { recursive: true });
    writeFileSync(join(sourceDir, 'foo.md'), 'body\n', 'utf8');
    const claudeDir = join(repo, '.claude');
    mkdirSync(join(claudeDir, 'project', 'alpha'), { recursive: true });
    mkdirSync(join(claudeDir, 'project', 'beta'), { recursive: true });

    await captureExit(() =>
      runPromoteWithOptions(
        ['--destination-project', 'alpha'],
        { repoRoot: repo, claudeDir },
      ),
    );

    expect(captured.exitCode).toBeNull();
    expect(
      existsSync(join(claudeDir, 'project', 'alpha', 'gotchas', 'foo.md')),
    ).toBe(true);
    expect(
      existsSync(join(claudeDir, 'project', 'beta', 'gotchas', 'foo.md')),
    ).toBe(false);
  });

  test('--source overrides the default source directory', async () => {
    const { repo, claudeDir } = makeRepoLayout('testproj');
    const altSource = join(repo, 'alt-source');
    mkdirSync(altSource, { recursive: true });
    writeFileSync(join(altSource, 'foo.md'), 'alt-body\n', 'utf8');

    await captureExit(() =>
      runPromoteWithOptions(['--source', altSource], {
        repoRoot: repo,
        claudeDir,
      }),
    );

    expect(captured.exitCode).toBeNull();
    const destFile = join(
      claudeDir,
      'project',
      'testproj',
      'gotchas',
      'foo.md',
    );
    expect(readFileSync(destFile, 'utf8')).toBe('alt-body\n');
    expect(existsSync(join(altSource, 'foo.md'))).toBe(false);
  });
});

// ===========================================================================
// findActiveSessions / renderActiveSessionError helpers
// ===========================================================================

describe('findActiveSessions', () => {
  test('returns empty when .gobbi/sessions does not exist', () => {
    const repo = makeScratchRepo();
    const result = findActiveSessions(repo, Date.now());
    expect(result).toEqual([]);
  });
});

describe('renderActiveSessionError', () => {
  test('includes one Active session block per input', () => {
    const msg = renderActiveSessionError([
      {
        sessionId: 'one',
        heartbeatTs: '2026-04-16T10:00:00.000Z',
        minutesAgo: 1,
        ttlRemainingMinutes: 59,
        step: 'ideation',
      },
      {
        sessionId: 'two',
        heartbeatTs: '2026-04-16T09:59:00.000Z',
        minutesAgo: 2,
        ttlRemainingMinutes: 58,
        step: null,
      },
    ]);
    expect(msg).toContain('Active session: one');
    expect(msg).toContain('Active session: two');
    expect(msg).toContain('step: (none)');
    // The Wait-TTL suggestion uses the smallest remaining TTL.
    expect(msg).toContain('Wait for TTL to expire (58 minutes)');
  });
});
