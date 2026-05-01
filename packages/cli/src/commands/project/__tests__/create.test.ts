/**
 * Unit tests for `gobbi project create <name>` — name validation,
 * scaffold-directory creation, settings.json update, and idempotency /
 * conflict handling.
 *
 * Covers:
 *   - Valid name → scaffold directory tree created, `projects.known`
 *     updated, `projects.active` unchanged.
 *   - Name validation: rejects empty, uppercase, path separators, dots,
 *     leading/trailing hyphens, reserved `.` / `..`.
 *   - Existing project → exit 1 with a clear diagnostic.
 *   - Missing name argument → exit 2.
 *   - `--help` → usage on stdout, exit 0.
 *
 * Scratch repos in the OS temp dir; stdout/stderr capture matches the
 * sibling `list.test.ts` template.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  runProjectCreateWithOptions,
  SCAFFOLD_DIRS,
  SCAFFOLD_GITIGNORED_DIRS,
} from '../create.js';

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
      try {
        rmSync(d, { recursive: true, force: true });
      } catch {
        // best-effort
      }
    }
  }
});

function makeRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-project-create-'));
  scratchDirs.push(dir);
  return dir;
}

function readWorkspaceSettings(repo: string): unknown {
  const raw = readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8');
  return JSON.parse(raw);
}

// ===========================================================================
// runProjectCreate — happy path
// ===========================================================================

describe('gobbi project create — happy path', () => {
  test('creates scaffold dirs (PR-FIN-1c: no settings.json mutation)', async () => {
    const repo = makeRepo();

    await captureExit(() =>
      runProjectCreateWithOptions(['foo'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();

    const projectRoot = join(repo, '.gobbi', 'projects', 'foo');
    expect(existsSync(projectRoot)).toBe(true);
    for (const dir of SCAFFOLD_DIRS) {
      expect(existsSync(join(projectRoot, dir))).toBe(true);
    }

    // PR-FIN-1c: settings.json is NOT touched by create. The directory
    // tree is the source of truth for project existence.
    expect(existsSync(join(repo, '.gobbi', 'settings.json'))).toBe(false);
  });

  test('scaffolds the full PR-FIN-2 taxonomy (14 tracked + 3 runtime)', async () => {
    const repo = makeRepo();

    await captureExit(() =>
      runProjectCreateWithOptions(['foo'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    const projectRoot = join(repo, '.gobbi', 'projects', 'foo');

    // 12 narrative dirs.
    const narrative = [
      'backlogs',
      'checklists',
      'decisions',
      'design',
      'gotchas',
      'learnings',
      'notes',
      'playbooks',
      'references',
      'reviews',
      'rules',
      'scenarios',
    ];
    // 2 farm dirs (rules already in narrative; counts once).
    const farm = ['agents', 'skills'];
    // 3 gitignored runtime dirs.
    const runtime = ['sessions', 'tmp', 'worktrees'];

    for (const dir of [...narrative, ...farm, ...runtime]) {
      expect(existsSync(join(projectRoot, dir))).toBe(true);
    }

    // SCAFFOLD_DIRS is the public source of truth — the union of the
    // three buckets above must equal it (modulo ordering).
    const expectedSet = new Set([...narrative, ...farm, ...runtime]);
    expect(new Set(SCAFFOLD_DIRS)).toEqual(expectedSet);
    expect(SCAFFOLD_DIRS.length).toBe(expectedSet.size); // no dup
    // 14 tracked + 3 runtime = 17 unique entries.
    expect(SCAFFOLD_DIRS.length).toBe(17);

    // SCAFFOLD_GITIGNORED_DIRS exposes exactly the runtime trio.
    expect(SCAFFOLD_GITIGNORED_DIRS).toEqual(new Set(runtime));
  });

  test('writes .gitkeep into every empty git-tracked scaffold dir, never into runtime dirs', async () => {
    const repo = makeRepo();

    await captureExit(() =>
      runProjectCreateWithOptions(['foo'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    const projectRoot = join(repo, '.gobbi', 'projects', 'foo');

    for (const dir of SCAFFOLD_DIRS) {
      const dirPath = join(projectRoot, dir);
      const gitkeep = join(dirPath, '.gitkeep');

      if (SCAFFOLD_GITIGNORED_DIRS.has(dir)) {
        // Runtime dirs (sessions, tmp, worktrees) are gitignored — we
        // do not put a .gitkeep there because git would not track it.
        expect(existsSync(gitkeep)).toBe(false);
        continue;
      }

      // Tracked dir contract: either the seed populated it with real
      // content (no .gitkeep needed), or the dir is empty and a
      // .gitkeep is present so git records the slot. Empty .gitkeep
      // alone counts as the marker case (length === 1).
      const entries = readdirSync(dirPath);
      const isEmptyAfterMarker =
        entries.length === 1 && entries[0] === '.gitkeep';
      const isPopulated = entries.length > 0 && !isEmptyAfterMarker;
      expect(isEmptyAfterMarker || isPopulated).toBe(true);
      if (isEmptyAfterMarker) {
        // .gitkeep is conventionally empty.
        expect(readFileSync(gitkeep, 'utf8')).toBe('');
      }
    }
  });

  test('does not touch existing settings.json (PR-FIN-1c)', async () => {
    const repo = makeRepo();
    // Pre-seed settings with arbitrary user content; the registry was
    // removed but workflow / notify / git settings remain.
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'settings.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          workflow: { ideation: { discuss: { mode: 'agent' } } },
        },
        null,
        2,
      ),
      'utf8',
    );

    await captureExit(() =>
      runProjectCreateWithOptions(['foo'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    // settings.json is unchanged by create.
    const settings = readWorkspaceSettings(repo) as {
      schemaVersion: number;
      workflow: { ideation: { discuss: { mode: string } } };
    };
    expect(settings.schemaVersion).toBe(1);
    expect(settings.workflow.ideation.discuss.mode).toBe('agent');
  });

  test('seeds templates from install module when the helper is exported', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectCreateWithOptions(['foo'], { repoRoot: repo }),
    );
    // Post-W5-eval-remediation: `install.ts` exports
    // `seedProjectFromTemplates`, so `project create` successfully
    // seeds the new project from the template bundle. The harness
    // runs inside the repo worktree, so the default template-root
    // walk finds `.gobbi/projects/gobbi/`.
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Seeded');
    expect(captured.stdout).toContain('template file');
    // PR-FIN-2a-i T-2a.3: no manifest is written by the seed helper.
    const manifestPath = join(
      repo,
      '.gobbi',
      'projects',
      'foo',
      '.install-manifest.json',
    );
    expect(existsSync(manifestPath)).toBe(false);
    // The "run gobbi install" fallback warning must NOT fire when the
    // helper is wired correctly.
    expect(captured.stderr).not.toContain('install templates unavailable');
  });
});

// ===========================================================================
// runProjectCreate — name validation
// ===========================================================================

describe('gobbi project create — name validation', () => {
  test('rejects invalid name with exit 1', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectCreateWithOptions(['Foo-Bar'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('name must be lowercase');
    expect(existsSync(join(repo, '.gobbi', 'projects', 'Foo-Bar'))).toBe(false);
  });

  test('rejects path-separator name', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectCreateWithOptions(['foo/bar'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('name must be');
    // Critical: no directory traversal materialised the name anywhere.
    expect(existsSync(join(repo, '.gobbi', 'projects', 'foo'))).toBe(false);
    expect(existsSync(join(repo, '.gobbi', 'projects', 'bar'))).toBe(false);
  });
});

// ===========================================================================
// runProjectCreate — already-exists conflict
// ===========================================================================

describe('gobbi project create — already exists', () => {
  test('refuses when .gobbi/projects/<name>/ already exists', async () => {
    const repo = makeRepo();
    mkdirSync(join(repo, '.gobbi', 'projects', 'existing'), { recursive: true });

    await captureExit(() =>
      runProjectCreateWithOptions(['existing'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('project already exists');
    // No settings.json was created — command aborted before any writes.
    expect(existsSync(join(repo, '.gobbi', 'settings.json'))).toBe(false);
  });
});

// ===========================================================================
// runProjectCreate — argument parsing
// ===========================================================================

describe('gobbi project create — argument parsing', () => {
  test('missing name → exit 2', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectCreateWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('missing <name>');
  });

  test('extra arguments → exit 2', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectCreateWithOptions(['foo', 'bar'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('unexpected extra arguments');
  });

  test('--help → usage on stdout, exit 0', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectCreateWithOptions(['--help'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Usage: gobbi project create');
  });
});
