/**
 * Unit tests for `gobbi project list` — enumerates `.gobbi/projects/`
 * and marks the active project from `settings.json`.
 *
 * Covers:
 *   - Empty `.gobbi/` — emits "no projects", exit 0.
 *   - Single project, no active marker in settings — row without asterisk.
 *   - Multiple projects, one active — exactly one asterisk on the
 *     matching row.
 *   - Alphabetical sort.
 *   - `--help` returns usage on stdout.
 *
 * Tests use scratch repo roots in the OS temp dir and stdout/stderr
 * capture via the same pattern as `wipe-legacy-sessions.test.ts`.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runProjectListWithOptions } from '../list.js';

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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-project-list-'));
  scratchDirs.push(dir);
  return dir;
}

function makeProject(repo: string, name: string): void {
  mkdirSync(join(repo, '.gobbi', 'projects', name), { recursive: true });
}

function writeWorkspaceSettings(
  repo: string,
  projects: { active: string | null; known: readonly string[] },
): void {
  mkdirSync(join(repo, '.gobbi'), { recursive: true });
  const body = {
    schemaVersion: 1,
    projects: { active: projects.active, known: [...projects.known] },
  };
  writeFileSync(
    join(repo, '.gobbi', 'settings.json'),
    JSON.stringify(body, null, 2),
    'utf8',
  );
}

// ===========================================================================

describe('gobbi project list', () => {
  test('empty .gobbi/projects/ → "no projects" on stdout, exit 0', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectListWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('no projects\n');
  });

  test('single project, no active marker set → row prefixed with space', async () => {
    const repo = makeRepo();
    makeProject(repo, 'gobbi');
    // No settings.json at all — `resolveSettings` returns DEFAULTS which
    // has `projects.active: null`, so no project gets the marker.

    await captureExit(() =>
      runProjectListWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe(' \tgobbi\n');
  });

  test('active project (basename(repoRoot)) gets an asterisk marker', async () => {
    // PR-FIN-1c: the marker fires for the project whose name matches
    // `basename(repoRoot)`. We create a project under the basename so
    // the marker lights up; a second project (different name) carries
    // the space marker.
    const repo = makeRepo();
    const repoBase = require('node:path').basename(repo) as string;
    makeProject(repo, repoBase);
    makeProject(repo, 'aother');

    await captureExit(() =>
      runProjectListWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    // Alphabetical sort. The basename (which starts with `gobbi-...`
    // from mkdtempSync) sorts AFTER 'aother'. The basename row carries
    // the `*` marker.
    const rows = captured.stdout.trimEnd().split('\n');
    const activeRow = rows.find((r) => r.startsWith('*\t'));
    expect(activeRow).toBe(`*\t${repoBase}`);
  });

  test('ignores non-directory entries under .gobbi/projects/', async () => {
    const repo = makeRepo();
    makeProject(repo, 'real');
    // A stray file at the projects-root level must not appear as a row.
    mkdirSync(join(repo, '.gobbi', 'projects'), { recursive: true });
    writeFileSync(join(repo, '.gobbi', 'projects', 'stray.txt'), 'x', 'utf8');

    await captureExit(() =>
      runProjectListWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe(' \treal\n');
  });

  test('sorts output alphabetically', async () => {
    const repo = makeRepo();
    makeProject(repo, 'zulu');
    makeProject(repo, 'alpha');
    makeProject(repo, 'mike');

    await captureExit(() =>
      runProjectListWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    // Split on \n but keep internal whitespace so the leading-space
    // marker survives the split. `trim()` would strip the first row's
    // leading space.
    const rows = captured.stdout.split('\n').filter((r) => r.length > 0);
    expect(rows).toEqual([' \talpha', ' \tmike', ' \tzulu']);
  });

  test('--help prints usage on stdout and exits 0', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectListWithOptions(['--help'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Usage: gobbi project list');
  });

  test('settings.json with parse error degrades to unmarked list', async () => {
    const repo = makeRepo();
    makeProject(repo, 'foo');
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    // Deliberately malformed JSON — `resolveSettings` will throw,
    // and `list` should fall through to no-marker rendering.
    writeFileSync(join(repo, '.gobbi', 'settings.json'), '{ not json', 'utf8');

    await captureExit(() =>
      runProjectListWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe(' \tfoo\n');
  });
});
