/**
 * Unit tests for `gobbi workflow resume` — PR C flag-parsing skeleton.
 *
 * Coverage:
 *   - Missing `--target` exits 2 with usage on stderr.
 *   - Unknown flag exits 2 with usage on stderr.
 *   - Valid flags reach the deferred body which throws a
 *     ResumePendingError whose code is `X001_RESUME_PR_D_PENDING`.
 *   - CODE_SEVERITY reflects `X001_RESUME_PR_D_PENDING` as 'error' severity.
 *   - WORKFLOW_COMMANDS registers the `resume` subcommand.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runInitWithOptions } from '../init.js';
import {
  ResumePendingError,
  runResumeWithOptions,
} from '../resume.js';
import { WORKFLOW_COMMANDS } from '../../workflow.js';
import { CODE_SEVERITY } from '../../../workflow/diagnostics.js';

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
// Scratch dirs
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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-resume-test-'));
  scratchDirs.push(dir);
  return dir;
}

async function initScratchSession(
  sessionId: string,
): Promise<{ sessionDir: string; repo: string }> {
  const repo = makeScratchRepo();
  await captureExit(() =>
    runInitWithOptions(
      ['--session-id', sessionId, '--task', 'resume-test'],
      { repoRoot: repo },
    ),
  );
  const sessionDir = join(repo, '.gobbi', 'sessions', sessionId);
  captured = { stdout: '', stderr: '', exitCode: null };
  return { sessionDir, repo };
}

// ===========================================================================
// Flag parsing — failure paths
// ===========================================================================

describe('runResumeWithOptions — argv parsing', () => {
  test('missing --target exits 2 with a helpful stderr message', async () => {
    const { sessionDir } = await initScratchSession('resume-miss-target');

    await captureExit(() =>
      runResumeWithOptions([], { sessionDir }),
    );

    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('missing required flag --target');
  });

  test('unknown flag exits 2 with usage on stderr', async () => {
    const { sessionDir } = await initScratchSession('resume-unknown-flag');

    await captureExit(() =>
      runResumeWithOptions(
        ['--target', 'ideation', '--nonsense'],
        { sessionDir },
      ),
    );

    expect(captured.exitCode).toBe(2);
    // parseArgs surfaces "Unknown option" with the offending flag name.
    expect(captured.stderr).toContain('gobbi workflow resume');
  });
});

// ===========================================================================
// Body — deferred throw with the X001 sentinel
// ===========================================================================

describe('runResumeWithOptions — body throws ResumePendingError', () => {
  test('valid flags reach the body which throws X001_RESUME_PR_D_PENDING', async () => {
    const { sessionDir } = await initScratchSession('resume-throw');

    let caught: unknown;
    try {
      await runResumeWithOptions(
        ['--target', 'ideation'],
        { sessionDir },
      );
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ResumePendingError);
    expect((caught as ResumePendingError).code).toBe(
      'X001_RESUME_PR_D_PENDING',
    );
    expect((caught as ResumePendingError).message).toContain('PR D');
  });

  test('--force-memorization is accepted and still reaches the pending throw', async () => {
    const { sessionDir } = await initScratchSession('resume-force');

    let caught: unknown;
    try {
      await runResumeWithOptions(
        ['--target', 'memorization', '--force-memorization'],
        { sessionDir },
      );
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ResumePendingError);
    expect((caught as ResumePendingError).code).toBe(
      'X001_RESUME_PR_D_PENDING',
    );
  });
});

// ===========================================================================
// Diagnostic code registration — X001 participates in CODE_SEVERITY
// ===========================================================================

describe('CODE_SEVERITY — X001 registration', () => {
  test('X001_RESUME_PR_D_PENDING is declared as error severity', () => {
    expect(CODE_SEVERITY['X001_RESUME_PR_D_PENDING']).toBe('error');
  });
});

// ===========================================================================
// Dispatcher integration
// ===========================================================================

describe('WORKFLOW_COMMANDS — resume registration', () => {
  test('registers the resume subcommand', () => {
    const entry = WORKFLOW_COMMANDS.find((c) => c.name === 'resume');
    expect(entry).toBeDefined();
    expect(entry!.summary.length).toBeGreaterThan(0);
  });
});
