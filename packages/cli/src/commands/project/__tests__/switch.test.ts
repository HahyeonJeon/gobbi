/**
 * Unit tests for `gobbi project switch <name>` — PR-FIN-1c reduced this
 * command to a deprecated no-op. The previous farm-rotation +
 * `projects.active` mutation logic was retired with the registry removal.
 *
 * Coverage:
 *   - `--help` prints usage on stdout, exit 0.
 *   - With a positional name, prints a deprecation note on stderr and
 *     exits 0 without touching the filesystem.
 *   - Without a name, prints the deprecation note (a generic placeholder)
 *     and exits 0.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runProjectSwitchWithOptions } from '../switch.js';

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
let origExit: typeof process.exit;

beforeEach(() => {
  captured = { stdout: '', stderr: '', exitCode: null };
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
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
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
// Scratch repo helper
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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-project-switch-'));
  scratchDirs.push(dir);
  return dir;
}

// ===========================================================================

describe('gobbi project switch (PR-FIN-1c deprecated)', () => {
  test('--help prints usage on stdout', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectSwitchWithOptions(['--help'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Usage: gobbi project switch');
    expect(captured.stdout).toContain('DEPRECATED');
  });

  test('prints deprecation note on stderr when given a name; exit 0', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectSwitchWithOptions(['foo'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toContain('deprecated');
    expect(captured.stderr).toContain('--project foo');
    // Filesystem untouched — no .gobbi/.claude side effects.
    expect(existsSync(join(repo, '.gobbi'))).toBe(false);
    expect(existsSync(join(repo, '.claude'))).toBe(false);
  });

  test('prints deprecation note even with no positional name', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runProjectSwitchWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toContain('deprecated');
  });
});
