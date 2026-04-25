/**
 * Unit tests for `gobbi project switch <name>` — the most complex
 * subcommand. Covers:
 *
 *   - Happy path: fresh repo with two projects, switch rotates the
 *     `.claude/{skills,agents,rules}/` farm, updates `projects.active`.
 *   - Active-session gate: refuses when a session in the current
 *     project has a non-terminal `currentStep`; `--force` bypasses.
 *   - Cross-project gate scope: a session in a DIFFERENT project does
 *     not block the switch.
 *   - Legacy-flat sessions always block regardless of current-project.
 *   - Target-missing → exit 1.
 *   - Missing-name → exit 2.
 *   - Per-file symlinks preserved: every leaf under `.claude/<kind>/`
 *     is a symlink after rotation, matching the D3 lock.
 *   - Rotation failure with unwritable `.claude/` aborts before any
 *     farm is touched, leaving the old state intact.
 *
 * Scratch repos in OS temp dir; full stdout/stderr capture.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import {
  FARM_KINDS,
  readCurrentActive,
  renderActiveSessionError,
  runProjectSwitchWithOptions,
  shouldBlockSwitch,
} from '../switch.js';

// ---------------------------------------------------------------------------
// stdout/stderr capture
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
      // Restore write permissions before removing — some tests chmod
      // directories to simulate failure conditions.
      try {
        chmodSync(d, 0o755);
      } catch {
        // best-effort
      }
      try {
        rmSync(d, { recursive: true, force: true });
      } catch {
        // best-effort
      }
    }
  }
});

function makeRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-project-switch-'));
  scratchDirs.push(dir);
  return dir;
}

/**
 * Seed a project under `.gobbi/projects/<name>/{skills,agents,rules}/`
 * with one representative file in each kind so the rotation has
 * something to symlink. Files use `<name>-<kind>.md` so tests can
 * assert which project a post-rotation symlink points at just by
 * reading the link target.
 */
function seedProjectFarm(repo: string, projectName: string): void {
  for (const kind of FARM_KINDS) {
    const dir = join(repo, '.gobbi', 'projects', projectName, kind);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, `${projectName}-${kind}.md`),
      `content-for-${projectName}-${kind}`,
      'utf8',
    );
  }
}

/**
 * Seed a nested directory tree under the `skills/` kind to exercise
 * the recursive mirror logic. Creates
 * `.gobbi/projects/<name>/skills/<skillName>/{SKILL.md,sub/nested.md}`.
 */
function seedNestedSkill(
  repo: string,
  projectName: string,
  skillName: string,
): void {
  const skillDir = join(
    repo,
    '.gobbi',
    'projects',
    projectName,
    'skills',
    skillName,
  );
  mkdirSync(join(skillDir, 'sub'), { recursive: true });
  writeFileSync(join(skillDir, 'SKILL.md'), `skill-${skillName}`, 'utf8');
  writeFileSync(join(skillDir, 'sub', 'nested.md'), `nested-${skillName}`, 'utf8');
}

function writeWorkspaceSettings(
  repo: string,
  projects: { active: string | null; known: readonly string[] },
): void {
  mkdirSync(join(repo, '.gobbi'), { recursive: true });
  writeFileSync(
    join(repo, '.gobbi', 'settings.json'),
    JSON.stringify(
      {
        schemaVersion: 1,
        projects: { active: projects.active, known: [...projects.known] },
      },
      null,
      2,
    ),
    'utf8',
  );
}

function seedSession(
  repo: string,
  projectName: string | null,
  sessionId: string,
  currentStep: string,
): string {
  const dir =
    projectName === null
      ? join(repo, '.gobbi', 'sessions', sessionId)
      : join(repo, '.gobbi', 'projects', projectName, 'sessions', sessionId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'state.json'),
    JSON.stringify({
      schemaVersion: 4,
      sessionId,
      currentStep,
      currentSubstate: null,
      completedSteps: [],
      evalConfig: { ideation: false, plan: false },
      activeSubagents: [],
      artifacts: {},
      violations: [],
      feedbackRound: 0,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: null,
      verificationResults: {},
    }),
    'utf8',
  );
  return dir;
}

// ===========================================================================
// Pure helpers
// ===========================================================================

describe('shouldBlockSwitch', () => {
  test('legacy-flat session always blocks', () => {
    expect(
      shouldBlockSwitch(
        {
          sessionId: 's',
          sessionDir: '/x',
          projectName: null,
          currentStep: 'ideation',
        },
        'gobbi',
      ),
    ).toBe(true);
  });

  test('session in the active project blocks', () => {
    expect(
      shouldBlockSwitch(
        {
          sessionId: 's',
          sessionDir: '/x',
          projectName: 'gobbi',
          currentStep: 'execution',
        },
        'gobbi',
      ),
    ).toBe(true);
  });

  test('session in a DIFFERENT project does not block', () => {
    expect(
      shouldBlockSwitch(
        {
          sessionId: 's',
          sessionDir: '/x',
          projectName: 'other',
          currentStep: 'execution',
        },
        'gobbi',
      ),
    ).toBe(false);
  });

  test('no active project → only legacy-flat blocks', () => {
    expect(
      shouldBlockSwitch(
        {
          sessionId: 's',
          sessionDir: '/x',
          projectName: 'any',
          currentStep: 'execution',
        },
        null,
      ),
    ).toBe(false);
    expect(
      shouldBlockSwitch(
        {
          sessionId: 's',
          sessionDir: '/x',
          projectName: null,
          currentStep: 'execution',
        },
        null,
      ),
    ).toBe(true);
  });
});

describe('renderActiveSessionError', () => {
  test('includes the session id, project, currentStep, and path', () => {
    const msg = renderActiveSessionError([
      {
        sessionId: 'sess-one',
        sessionDir: '/tmp/x',
        projectName: 'gobbi',
        currentStep: 'execution',
      },
    ]);
    expect(msg).toContain('sess-one');
    expect(msg).toContain('project: gobbi');
    expect(msg).toContain('currentStep: execution');
    expect(msg).toContain('path: /tmp/x');
    expect(msg).toContain('--force');
  });

  test('labels legacy-flat sessions explicitly', () => {
    const msg = renderActiveSessionError([
      {
        sessionId: 's',
        sessionDir: '/tmp/x',
        projectName: null,
        currentStep: null,
      },
    ]);
    expect(msg).toContain('project: (legacy-flat)');
    expect(msg).toContain('currentStep: (missing or malformed state.json)');
  });
});

// ===========================================================================
// readCurrentActive
// ===========================================================================

describe('readCurrentActive', () => {
  test('returns null when no settings.json exists', () => {
    const repo = makeRepo();
    expect(readCurrentActive(repo)).toBeNull();
  });

  test('returns projects.active when set', () => {
    const repo = makeRepo();
    writeWorkspaceSettings(repo, { active: 'gobbi', known: ['gobbi'] });
    expect(readCurrentActive(repo)).toBe('gobbi');
  });

  test('returns null when settings.json is malformed', () => {
    const repo = makeRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(join(repo, '.gobbi', 'settings.json'), 'not json', 'utf8');
    expect(readCurrentActive(repo)).toBeNull();
  });
});

// ===========================================================================
// Happy path
// ===========================================================================

describe('gobbi project switch — happy path', () => {
  test('rotates farm symlinks and updates projects.active', async () => {
    const repo = makeRepo();
    seedProjectFarm(repo, 'gobbi');
    seedProjectFarm(repo, 'foo');
    writeWorkspaceSettings(repo, {
      active: 'gobbi',
      known: ['foo', 'gobbi'],
    });

    await captureExit(() =>
      runProjectSwitchWithOptions(['foo'], {
        repoRoot: repo,
        tempPidTag: 'test-1',
      }),
    );

    expect(captured.exitCode).toBeNull();

    // Every kind's representative file is now a symlink pointing at
    // the `foo` project's source.
    for (const kind of FARM_KINDS) {
      const linkPath = join(repo, '.claude', kind, `foo-${kind}.md`);
      expect(existsSync(linkPath)).toBe(true);
      expect(lstatSync(linkPath).isSymbolicLink()).toBe(true);
      const target = readlinkSync(linkPath);
      // Resolve the link from its parent dir to get an absolute path.
      const resolved = resolve(join(repo, '.claude', kind), target);
      expect(resolved).toBe(
        join(repo, '.gobbi', 'projects', 'foo', kind, `foo-${kind}.md`),
      );
    }

    // settings.json carries the new active.
    const settings = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8'),
    ) as { projects: { active: string; known: string[] } };
    expect(settings.projects.active).toBe('foo');
    expect(settings.projects.known.sort()).toEqual(['foo', 'gobbi']);
  });

  test('mirrors nested directory structure as per-file symlinks (D3)', async () => {
    const repo = makeRepo();
    seedProjectFarm(repo, 'gobbi');
    seedProjectFarm(repo, 'foo');
    seedNestedSkill(repo, 'foo', '_nested-skill');
    writeWorkspaceSettings(repo, {
      active: 'gobbi',
      known: ['foo', 'gobbi'],
    });

    await captureExit(() =>
      runProjectSwitchWithOptions(['foo'], {
        repoRoot: repo,
        tempPidTag: 'test-2',
      }),
    );

    expect(captured.exitCode).toBeNull();

    // The nested directory is a REAL dir, and the leaf files are
    // symlinks — matching the D3 per-file farm lock.
    const nestedDir = join(repo, '.claude', 'skills', '_nested-skill');
    expect(lstatSync(nestedDir).isDirectory()).toBe(true);

    const leaf = join(nestedDir, 'SKILL.md');
    expect(lstatSync(leaf).isSymbolicLink()).toBe(true);

    const deepLeaf = join(nestedDir, 'sub', 'nested.md');
    expect(lstatSync(deepLeaf).isSymbolicLink()).toBe(true);
    // And the symlink points at the right content.
    expect(readFileSync(deepLeaf, 'utf8')).toBe('nested-_nested-skill');
  });

  test('switch on fresh repo (no prior .claude/) creates the farm from scratch', async () => {
    const repo = makeRepo();
    seedProjectFarm(repo, 'foo');
    // No settings.json at all — the switch has no prior active project,
    // and there is no legacy .claude/ farm to rotate out.
    // Note: the project-does-not-exist check only looks at `.gobbi/projects/`,
    // which we seeded above for 'foo'.

    await captureExit(() =>
      runProjectSwitchWithOptions(['foo'], {
        repoRoot: repo,
        tempPidTag: 'test-3',
      }),
    );

    expect(captured.exitCode).toBeNull();
    for (const kind of FARM_KINDS) {
      expect(existsSync(join(repo, '.claude', kind, `foo-${kind}.md`))).toBe(
        true,
      );
    }
  });
});

// ===========================================================================
// Active-session gate
// ===========================================================================

describe('gobbi project switch — active-session gate', () => {
  test('refuses when a session in the CURRENT project is active', async () => {
    const repo = makeRepo();
    seedProjectFarm(repo, 'gobbi');
    seedProjectFarm(repo, 'foo');
    writeWorkspaceSettings(repo, {
      active: 'gobbi',
      known: ['foo', 'gobbi'],
    });
    seedSession(repo, 'gobbi', 'live', 'execution');

    await captureExit(() =>
      runProjectSwitchWithOptions(['foo'], {
        repoRoot: repo,
        tempPidTag: 'test-4',
      }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('active');
    expect(captured.stderr).toContain('live');
    // Old farm (if any) untouched; new farm not built.
    // Since we never created any farm on disk, just assert that the
    // temp-farm root does not exist.
    expect(existsSync(join(repo, '.claude.tmp-farm-test-4'))).toBe(false);
  });

  test('does NOT refuse when only OTHER-project sessions are active', async () => {
    const repo = makeRepo();
    seedProjectFarm(repo, 'gobbi');
    seedProjectFarm(repo, 'foo');
    writeWorkspaceSettings(repo, {
      active: 'gobbi',
      known: ['foo', 'gobbi'],
    });
    // Create a third project and put an active session there.
    mkdirSync(join(repo, '.gobbi', 'projects', 'other'), { recursive: true });
    seedSession(repo, 'other', 'not-ours', 'execution');

    await captureExit(() =>
      runProjectSwitchWithOptions(['foo'], {
        repoRoot: repo,
        tempPidTag: 'test-5',
      }),
    );

    expect(captured.exitCode).toBeNull();
  });

  test('legacy-flat session always blocks', async () => {
    const repo = makeRepo();
    seedProjectFarm(repo, 'gobbi');
    seedProjectFarm(repo, 'foo');
    writeWorkspaceSettings(repo, {
      active: 'gobbi',
      known: ['foo', 'gobbi'],
    });
    seedSession(repo, null, 'legacy', 'ideation');

    await captureExit(() =>
      runProjectSwitchWithOptions(['foo'], {
        repoRoot: repo,
        tempPidTag: 'test-6',
      }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('legacy');
  });

  test('--force bypasses the gate', async () => {
    const repo = makeRepo();
    seedProjectFarm(repo, 'gobbi');
    seedProjectFarm(repo, 'foo');
    writeWorkspaceSettings(repo, {
      active: 'gobbi',
      known: ['foo', 'gobbi'],
    });
    seedSession(repo, 'gobbi', 'live', 'execution');

    await captureExit(() =>
      runProjectSwitchWithOptions(['foo', '--force'], {
        repoRoot: repo,
        tempPidTag: 'test-7',
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(
      existsSync(join(repo, '.claude', 'skills', 'foo-skills.md')),
    ).toBe(true);
  });

  test('missing state.json (protect by default) also blocks', async () => {
    const repo = makeRepo();
    seedProjectFarm(repo, 'gobbi');
    seedProjectFarm(repo, 'foo');
    writeWorkspaceSettings(repo, {
      active: 'gobbi',
      known: ['foo', 'gobbi'],
    });
    // Session dir without state.json → classified as active.
    mkdirSync(
      join(repo, '.gobbi', 'projects', 'gobbi', 'sessions', 'no-state'),
      { recursive: true },
    );

    await captureExit(() =>
      runProjectSwitchWithOptions(['foo'], {
        repoRoot: repo,
        tempPidTag: 'test-8',
      }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('no-state');
  });
});

// ===========================================================================
// Target-missing / arg parsing
// ===========================================================================

describe('gobbi project switch — argument handling', () => {
  test('target project does not exist → exit 1', async () => {
    const repo = makeRepo();
    seedProjectFarm(repo, 'gobbi');
    writeWorkspaceSettings(repo, {
      active: 'gobbi',
      known: ['gobbi'],
    });

    await captureExit(() =>
      runProjectSwitchWithOptions(['missing'], {
        repoRoot: repo,
        tempPidTag: 'test-9',
      }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('does not exist');
    expect(captured.stderr).toContain('missing');
  });

  test('missing name argument → exit 2', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectSwitchWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('missing <name>');
  });

  test('extra arguments → exit 2', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectSwitchWithOptions(['foo', 'bar'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('unexpected extra arguments');
  });

  test('--help → usage on stdout', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectSwitchWithOptions(['--help'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Usage: gobbi project switch');
  });
});

// ===========================================================================
// Rotation failure → old farm intact
// ===========================================================================

describe('gobbi project switch — rotation failure leaves old farm intact', () => {
  test('aborts without touching old .claude/ when build fails', async () => {
    const repo = makeRepo();
    seedProjectFarm(repo, 'gobbi');
    // Pre-populate a .claude/ farm so we can assert it survived.
    mkdirSync(join(repo, '.claude', 'skills'), { recursive: true });
    writeFileSync(
      join(repo, '.claude', 'skills', 'existing-sentinel.md'),
      'sentinel',
      'utf8',
    );
    writeWorkspaceSettings(repo, {
      active: 'gobbi',
      known: ['gobbi', 'broken'],
    });
    // Register a "broken" project whose directory exists but whose
    // skills dir is a file (not a directory) so `readdirSync` throws
    // inside `buildFarm`, triggering the failure path.
    const brokenRoot = join(repo, '.gobbi', 'projects', 'broken');
    mkdirSync(brokenRoot, { recursive: true });
    writeFileSync(join(brokenRoot, 'skills'), 'not-a-dir', 'utf8');

    await captureExit(() =>
      runProjectSwitchWithOptions(['broken'], {
        repoRoot: repo,
        tempPidTag: 'test-fail-1',
      }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('failed to build new farm');

    // Old farm intact.
    expect(
      existsSync(join(repo, '.claude', 'skills', 'existing-sentinel.md')),
    ).toBe(true);

    // Temp tree cleaned up.
    expect(
      existsSync(join(repo, '.claude.tmp-farm-test-fail-1')),
    ).toBe(false);

    // settings.json.active NOT updated.
    const settings = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8'),
    ) as { projects: { active: string } };
    expect(settings.projects.active).toBe('gobbi');
  });
});
