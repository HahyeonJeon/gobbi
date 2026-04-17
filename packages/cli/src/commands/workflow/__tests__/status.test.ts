/**
 * Unit tests for `gobbi workflow status` — read-only state projection.
 *
 * Coverage:
 *   - buildSnapshot pure lib form preserves state fields correctly
 *   - countViolationsByFamily buckets by letter prefix, sorted alphabetically
 *   - runStatusWithOptions against a real init'd session produces human +
 *     JSON output; JSON mode passes shape validation
 *   - missing event store exits 1
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runInitWithOptions } from '../init.js';
import {
  buildSnapshot,
  countViolationsByFamily,
  runStatusWithOptions,
  type StatusSnapshot,
} from '../status.js';
import { initialState } from '../../../workflow/state.js';
import type { GuardViolationRecord } from '../../../workflow/state.js';

// ---------------------------------------------------------------------------
// capture helpers
// ---------------------------------------------------------------------------

let captured: { stdout: string; stderr: string; exitCode: number | null };
let origStdoutWrite: typeof process.stdout.write;
let origStderrWrite: typeof process.stderr.write;
let origExit: typeof process.exit;

class ExitCalled extends Error {
  constructor(readonly code: number) {
    super(`process.exit(${code})`);
  }
}

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
// scratch dirs
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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-status-test-'));
  scratchDirs.push(dir);
  return dir;
}

// ===========================================================================
// countViolationsByFamily — pure
// ===========================================================================

describe('countViolationsByFamily', () => {
  test('groups records by DiagnosticCode family letter', () => {
    const v = (code: string | undefined): GuardViolationRecord =>
      ({
        guardId: 'g',
        toolName: 't',
        reason: 'r',
        step: 's',
        timestamp: '2026-01-01T00:00:00.000Z',
        severity: 'warning',
        ...(code !== undefined ? { code } : {}),
      }) as unknown as GuardViolationRecord;

    const counts = countViolationsByFamily([
      v('W001_GUARD_WARN_GENERIC'),
      v('W001_GUARD_WARN_GENERIC'),
      v('E001_INVALID_SCHEMA'),
      v(undefined),
    ]);

    expect(counts['W']).toBe(2);
    expect(counts['E']).toBe(1);
    expect(counts['untagged']).toBe(1);
  });

  test('keys are sorted alphabetically for stable output', () => {
    const v = (code: string): GuardViolationRecord =>
      ({
        guardId: 'g',
        toolName: 't',
        reason: 'r',
        step: 's',
        timestamp: '2026-01-01T00:00:00.000Z',
        severity: 'warning',
        code,
      }) as unknown as GuardViolationRecord;
    const counts = countViolationsByFamily([
      v('X001'),
      v('E001_INVALID_SCHEMA'),
      v('W001_GUARD_WARN_GENERIC'),
    ]);
    expect(Object.keys(counts)).toEqual(['E', 'W', 'X']);
  });
});

// ===========================================================================
// buildSnapshot — pure
// ===========================================================================

describe('buildSnapshot', () => {
  test('preserves core state fields', () => {
    const snap = buildSnapshot(initialState('sess-1'));
    expect(snap.sessionId).toBe('sess-1');
    expect(snap.schemaVersion).toBe(2);
    expect(snap.currentStep).toBe('idle');
    expect(snap.lastVerdictOutcome).toBeNull();
    expect(snap.violationsTotal).toBe(0);
    expect(snap.violationsByFamily).toEqual({});
  });
});

// ===========================================================================
// runStatusWithOptions — integration against a real init'd session
// ===========================================================================

describe('runStatusWithOptions', () => {
  test('human output reports step, session, and violations=none', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'status-happy', '--task', 'demo', '--eval-plan'],
        { repoRoot: repo },
      ),
    );

    const sessionDir = join(repo, '.gobbi', 'sessions', 'status-happy');
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() => runStatusWithOptions([], { sessionDir }));

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Session: status-happy');
    expect(captured.stdout).toContain('Schema: v2');
    // workflow.start + workflow.eval.decide transitions to ideation/discussing.
    expect(captured.stdout).toContain('Step: ideation');
    expect(captured.stdout).toContain('Violations: none');
  });

  test('--json emits a valid StatusSnapshot', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'status-json', '--task', 'demo'], {
        repoRoot: repo,
      }),
    );
    const sessionDir = join(repo, '.gobbi', 'sessions', 'status-json');
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() => runStatusWithOptions(['--json'], { sessionDir }));

    expect(captured.exitCode).toBeNull();
    const snapshot = JSON.parse(captured.stdout) as StatusSnapshot;
    expect(snapshot.sessionId).toBe('status-json');
    expect(snapshot.schemaVersion).toBe(2);
    expect(snapshot.currentStep).toBe('ideation');
    expect(snapshot.violationsTotal).toBe(0);
    expect(snapshot.evalConfig).toEqual({ ideation: false, plan: false });
  });

  test('missing event store exits 1', async () => {
    const repo = makeScratchRepo();
    const sessionDir = join(repo, '.gobbi', 'sessions', 'absent');
    // deliberately do not init
    await captureExit(() => runStatusWithOptions([], { sessionDir }));
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('no event store');
  });
});
