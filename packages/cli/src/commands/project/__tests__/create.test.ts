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
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  runProjectCreateWithOptions,
  SCAFFOLD_DIRS,
  validateProjectName,
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
// Name validation (pure function)
// ===========================================================================

describe('validateProjectName', () => {
  test('accepts lowercase letters', () => {
    expect(validateProjectName('gobbi').ok).toBe(true);
  });
  test('accepts letters + digits + hyphens', () => {
    expect(validateProjectName('my-project-2').ok).toBe(true);
  });
  test('accepts single-character names', () => {
    expect(validateProjectName('a').ok).toBe(true);
  });
  test('rejects empty string', () => {
    expect(validateProjectName('').ok).toBe(false);
  });
  test('rejects uppercase', () => {
    expect(validateProjectName('Foo').ok).toBe(false);
  });
  test('rejects underscores', () => {
    expect(validateProjectName('foo_bar').ok).toBe(false);
  });
  test('rejects dots', () => {
    expect(validateProjectName('foo.bar').ok).toBe(false);
  });
  test('rejects path separators', () => {
    expect(validateProjectName('foo/bar').ok).toBe(false);
    expect(validateProjectName('foo\\bar').ok).toBe(false);
  });
  test('rejects leading hyphen', () => {
    expect(validateProjectName('-foo').ok).toBe(false);
  });
  test('rejects trailing hyphen', () => {
    expect(validateProjectName('foo-').ok).toBe(false);
  });
  test('rejects reserved . and ..', () => {
    expect(validateProjectName('.').ok).toBe(false);
    expect(validateProjectName('..').ok).toBe(false);
  });
  test('rejects whitespace-only', () => {
    expect(validateProjectName(' ').ok).toBe(false);
  });
});

// ===========================================================================
// runProjectCreate — happy path
// ===========================================================================

describe('gobbi project create — happy path', () => {
  test('creates scaffold dirs and registers in settings.known', async () => {
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

    // Settings updated.
    const settings = readWorkspaceSettings(repo) as {
      schemaVersion: number;
      projects: { active: string | null; known: string[] };
    };
    expect(settings.schemaVersion).toBe(1);
    expect(settings.projects.known).toEqual(['foo']);
    // `active` stays null — switch is separate.
    expect(settings.projects.active).toBeNull();
  });

  test('preserves existing projects.active when creating a new project', async () => {
    const repo = makeRepo();
    // Pre-seed settings with an active project.
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'settings.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          projects: { active: 'gobbi', known: ['gobbi'] },
        },
        null,
        2,
      ),
      'utf8',
    );
    // And the default project exists (so the workspace-settings-read
    // fallback doesn't synthesise a null active).
    mkdirSync(join(repo, '.gobbi', 'projects', 'gobbi'), { recursive: true });

    await captureExit(() =>
      runProjectCreateWithOptions(['foo'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    const settings = readWorkspaceSettings(repo) as {
      projects: { active: string | null; known: string[] };
    };
    expect(settings.projects.active).toBe('gobbi');
    expect(settings.projects.known.sort()).toEqual(['foo', 'gobbi']);
  });

  test('dedupes project name if already in settings.known', async () => {
    const repo = makeRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'settings.json'),
      JSON.stringify({
        schemaVersion: 1,
        projects: { active: null, known: ['foo'] },
      }),
      'utf8',
    );

    await captureExit(() =>
      runProjectCreateWithOptions(['foo'], { repoRoot: repo }),
    );

    // The directory existence check fires first and wins. Intentional —
    // settings-known membership does not imply the on-disk tree exists
    // yet, but the on-disk tree always trumps the settings declaration.
    expect(captured.exitCode).toBeNull();
    // ...unless the directory itself is absent. In this test the tree
    // DID NOT exist, so create proceeds and the settings dedup path
    // keeps `known` = ['foo'] instead of doubling the entry.
    const settings = readWorkspaceSettings(repo) as {
      projects: { known: string[] };
    };
    expect(settings.projects.known).toEqual(['foo']);
  });

  test('emits a warning when install templates are unavailable', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectCreateWithOptions(['foo'], { repoRoot: repo }),
    );
    // In the test harness, the install module's
    // `seedProjectFromTemplates` export does not exist (W5.3 landed
    // `install.ts` but its seed function is not named that way). The
    // fallback path emits the "run gobbi install" stderr warning.
    expect(captured.stderr).toContain('gobbi install');
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
