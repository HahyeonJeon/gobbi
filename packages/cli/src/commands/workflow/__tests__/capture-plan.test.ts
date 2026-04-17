/**
 * Unit tests for `gobbi workflow capture-plan` — the PostToolUse(ExitPlanMode)
 * hook handler.
 *
 * Coverage:
 *   - Registry presence — `capture-plan` is registered in WORKFLOW_COMMANDS.
 *   - Happy path — plan written to plan/plan.md + artifact.write event.
 *   - Re-run overwrites existing plan.md and emits a second artifact.write
 *     when invoked without a deduplicating tool_call_id.
 *   - Missing session → silent exit.
 *   - Missing / empty plan content → no events, no file written.
 *   - Response contract: exit 0, no permissionDecision in stdout.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runInitWithOptions } from '../init.js';
import { runCapturePlanWithOptions } from '../capture-plan.js';
import { WORKFLOW_COMMANDS } from '../../workflow.js';
import { EventStore } from '../../../workflow/store.js';

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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-capture-plan-'));
  scratchDirs.push(dir);
  return dir;
}

async function initScratchSession(
  sessionId: string,
): Promise<{ sessionDir: string; repo: string }> {
  const repo = makeScratchRepo();
  await captureExit(() =>
    runInitWithOptions(
      ['--session-id', sessionId, '--task', 'capture-plan-test'],
      { repoRoot: repo },
    ),
  );
  const sessionDir = join(repo, '.gobbi', 'sessions', sessionId);
  captured = { stdout: '', stderr: '', exitCode: null };
  return { sessionDir, repo };
}

function planPayload(
  sessionId: string,
  plan: string,
  overrides: Partial<{
    tool_call_id: string;
    planFilePath: string;
  }> = {},
): object {
  const toolInput: Record<string, unknown> = { plan };
  if (overrides.planFilePath !== undefined) {
    toolInput['planFilePath'] = overrides.planFilePath;
  }
  const base: Record<string, unknown> = {
    tool_name: 'ExitPlanMode',
    session_id: sessionId,
    tool_input: toolInput,
  };
  if (overrides.tool_call_id !== undefined) {
    base['tool_call_id'] = overrides.tool_call_id;
  }
  return base;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

describe('WORKFLOW_COMMANDS registration', () => {
  test('exposes `capture-plan` as a subcommand', () => {
    const names = WORKFLOW_COMMANDS.map((c) => c.name);
    expect(names).toContain('capture-plan');
  });
});

// ---------------------------------------------------------------------------
// Happy path
// ---------------------------------------------------------------------------

describe('runCapturePlan — happy path', () => {
  test('writes plan.md and emits artifact.write', async () => {
    const { sessionDir } = await initScratchSession('cap-plan-ok');

    await captureExit(() =>
      runCapturePlanWithOptions([], {
        sessionDir,
        payload: planPayload(
          'cap-plan-ok',
          '# Plan\n\n1. step one\n2. step two\n',
          { tool_call_id: 'plan-call-1' },
        ),
      }),
    );

    expect(captured.exitCode).toBeNull();
    // Observational hook — no permissionDecision on stdout.
    expect(captured.stdout).toBe('');

    const planPath = join(sessionDir, 'plan', 'plan.md');
    expect(existsSync(planPath)).toBe(true);
    expect(readFileSync(planPath, 'utf8')).toBe(
      '# Plan\n\n1. step one\n2. step two\n',
    );

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const writes = store.byType('artifact.write');
      expect(writes).toHaveLength(1);
      const data = JSON.parse(writes[0]!.data) as {
        readonly filename: string;
        readonly artifactType: string;
      };
      expect(data.filename).toBe('plan.md');
      expect(data.artifactType).toBe('plan');
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// Re-run / revision overwrites
// ---------------------------------------------------------------------------

describe('runCapturePlan — revision overwrite', () => {
  test('re-run with new plan overwrites plan.md and emits a second artifact.write', async () => {
    const { sessionDir } = await initScratchSession('cap-plan-rev');

    // First invocation — uses tool-call idempotency with one id.
    await captureExit(() =>
      runCapturePlanWithOptions([], {
        sessionDir,
        payload: planPayload('cap-plan-rev', '# Plan v1\n', {
          tool_call_id: 'plan-call-v1',
        }),
      }),
    );
    const planPath = join(sessionDir, 'plan', 'plan.md');
    expect(readFileSync(planPath, 'utf8')).toBe('# Plan v1\n');

    // Second invocation — distinct tool_call_id so the idempotency key is
    // different and the append is NOT deduplicated. Plan content changes.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runCapturePlanWithOptions([], {
        sessionDir,
        payload: planPayload(
          'cap-plan-rev',
          '# Plan v2\n\nrevised content\n',
          { tool_call_id: 'plan-call-v2' },
        ),
      }),
    );

    // File overwritten.
    expect(readFileSync(planPath, 'utf8')).toBe(
      '# Plan v2\n\nrevised content\n',
    );

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const writes = store.byType('artifact.write');
      expect(writes).toHaveLength(2);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// Missing session
// ---------------------------------------------------------------------------

describe('runCapturePlan — missing session', () => {
  test('nonexistent session dir → silent exit, no crash', async () => {
    const repo = makeScratchRepo();
    const fakeDir = join(repo, '.gobbi', 'sessions', 'not-real');
    expect(existsSync(fakeDir)).toBe(false);

    await captureExit(() =>
      runCapturePlanWithOptions([], {
        sessionDir: fakeDir,
        payload: planPayload('not-real', '# plan'),
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
    expect(existsSync(join(fakeDir, 'plan', 'plan.md'))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Missing / empty plan
// ---------------------------------------------------------------------------

describe('runCapturePlan — missing plan content', () => {
  test('payload without tool_input.plan → silent no-op (no file, no events)', async () => {
    const { sessionDir } = await initScratchSession('cap-plan-empty');

    await captureExit(() =>
      runCapturePlanWithOptions([], {
        sessionDir,
        payload: {
          tool_name: 'ExitPlanMode',
          session_id: 'cap-plan-empty',
          tool_input: {},
        },
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(join(sessionDir, 'plan', 'plan.md'))).toBe(false);

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      expect(store.byType('artifact.write')).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});
