import { describe, it, expect } from 'bun:test';
import { mkdtempSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  SIGKILL_GRACE_MS,
  SyncScheduler,
  type VerificationTask,
} from '../verification-scheduler.js';

// ---------------------------------------------------------------------------
// Test utilities
// ---------------------------------------------------------------------------

/**
 * Build a VerificationTask with sensible defaults. Individual tests override
 * `command` + `timeoutMs` + whatever else matters for the case under test.
 */
function makeTask(overrides: Partial<VerificationTask> = {}): VerificationTask {
  return {
    subagentId: 'sub-test',
    command: 'true',
    commandKind: 'custom',
    cwd: process.cwd(),
    timeoutMs: 30_000,
    policy: 'gate',
    ...overrides,
  };
}

/**
 * Return true iff the given PID is visible to `ps -p` (i.e. the process is
 * still alive or is a zombie that hasn't been reaped). `ps -p <pid>` exits 0
 * when the process exists and 1 when it does not.
 */
async function pidExists(pid: number): Promise<boolean> {
  const proc = Bun.spawn({
    cmd: ['ps', '-p', String(pid)],
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  const code = await proc.exited;
  return code === 0;
}

/** Wait N ms — tests need breathing room for kernel signal delivery. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// SyncScheduler.run — happy paths
// ---------------------------------------------------------------------------

describe('SyncScheduler.run — natural exit', () => {
  it('captures stdout and returns exitCode 0 on success', async () => {
    const scheduler = new SyncScheduler();
    const outcome = await scheduler.run(
      makeTask({ command: "printf 'hello world'" }),
      new AbortController().signal,
    );

    expect(outcome.exitCode).toBe(0);
    expect(outcome.timedOut).toBe(false);
    expect(outcome.stdoutBytes.toString('utf8')).toBe('hello world');
    expect(outcome.stderrBytes.length).toBe(0);
    expect(outcome.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('captures stderr and returns the non-zero exit code on failure', async () => {
    const scheduler = new SyncScheduler();
    const outcome = await scheduler.run(
      makeTask({ command: "printf 'bad input' >&2; exit 7" }),
      new AbortController().signal,
    );

    expect(outcome.exitCode).toBe(7);
    expect(outcome.timedOut).toBe(false);
    expect(outcome.stdoutBytes.length).toBe(0);
    expect(outcome.stderrBytes.toString('utf8')).toBe('bad input');
  });

  it('runs in the task-provided cwd, not the process cwd', async () => {
    const scheduler = new SyncScheduler();
    const tmp = mkdtempSync(join(tmpdir(), 'gobbi-sched-cwd-'));
    try {
      const outcome = await scheduler.run(
        makeTask({ command: 'pwd', cwd: tmp }),
        new AbortController().signal,
      );
      // macOS resolves /var/folders → /private/var/folders, so fall back to
      // endsWith to stay portable without sacrificing the invariant.
      const reported = outcome.stdoutBytes.toString('utf8').trim();
      expect(reported.endsWith(tmp) || reported === tmp).toBe(true);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});

// ---------------------------------------------------------------------------
// SyncScheduler.run — timeout ladder
// ---------------------------------------------------------------------------

describe('SyncScheduler.run — timeout escalation', () => {
  it('SIGTERM on timeout maps to exitCode -1 and timedOut=true', async () => {
    const scheduler = new SyncScheduler();
    const start = Date.now();
    const outcome = await scheduler.run(
      makeTask({ command: 'sleep 10', timeoutMs: 100 }),
      new AbortController().signal,
    );
    const elapsed = Date.now() - start;

    expect(outcome.exitCode).toBe(-1);
    expect(outcome.timedOut).toBe(true);
    // Should return well under timeoutMs + SIGKILL_GRACE_MS — sleep respects SIGTERM.
    expect(elapsed).toBeLessThan(100 + SIGKILL_GRACE_MS);
  });

  it('SIGKILL escalates when the child traps SIGTERM, mapping exitCode to -2', async () => {
    const scheduler = new SyncScheduler();
    // trap '' TERM -> install empty handler; sh ignores SIGTERM. The 2s grace
    // then fires SIGKILL, which cannot be caught. Keep the sleep small so the
    // test budget is timeoutMs (100) + SIGKILL_GRACE_MS (2000) + headroom.
    const start = Date.now();
    const outcome = await scheduler.run(
      makeTask({
        command: "trap '' TERM; sleep 10",
        timeoutMs: 100,
      }),
      new AbortController().signal,
    );
    const elapsed = Date.now() - start;

    expect(outcome.exitCode).toBe(-2);
    expect(outcome.timedOut).toBe(true);
    // Must have taken at least the SIGKILL grace (minus a little slack for the
    // setTimeout resolution), and must return before a raw `sleep 10` would.
    expect(elapsed).toBeGreaterThanOrEqual(SIGKILL_GRACE_MS);
    expect(elapsed).toBeLessThan(SIGKILL_GRACE_MS + 3_000);
  });

  it('kills grandchildren via process-group kill (no orphan descendants)', async () => {
    const scheduler = new SyncScheduler();
    const tmp = mkdtempSync(join(tmpdir(), 'gobbi-sched-pg-'));
    const pidFile = join(tmp, 'grandchild.pid');
    try {
      // The sh parent backgrounds a sleep, records its PID, then `wait`s so
      // the parent stays alive until the sleep exits (or is killed). Without
      // detached + process-group kill, SIGTERM to the shell would leave the
      // sleep orphaned under init. With the ladder, PGID kill reaps both.
      const outcomePromise = scheduler.run(
        makeTask({
          command: `sh -c 'sleep 60 & echo $! > "${pidFile}"; wait'`,
          timeoutMs: 200,
        }),
        new AbortController().signal,
      );

      // Wait for the pid-file to be written before racing the timeout.
      for (let i = 0; i < 50; i++) {
        if (existsSync(pidFile)) break;
        await sleep(20);
      }
      expect(existsSync(pidFile)).toBe(true);
      const grandchildPid = Number(readFileSync(pidFile, 'utf8').trim());
      expect(grandchildPid).toBeGreaterThan(0);
      expect(await pidExists(grandchildPid)).toBe(true);

      const outcome = await outcomePromise;
      expect(outcome.timedOut).toBe(true);

      // Kernel signal delivery + zombie reaping is not instantaneous.
      // Poll briefly — if the grandchild is gone within ~1s we call the
      // invariant satisfied.
      let gone = false;
      for (let i = 0; i < 50; i++) {
        if (!(await pidExists(grandchildPid))) {
          gone = true;
          break;
        }
        await sleep(20);
      }
      expect(gone).toBe(true);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});

// ---------------------------------------------------------------------------
// SyncScheduler.run — AbortSignal
// ---------------------------------------------------------------------------

describe('SyncScheduler.run — abort signal', () => {
  it('pre-aborted signal returns fast-path cancelled outcome without spawning', async () => {
    const scheduler = new SyncScheduler();
    const controller = new AbortController();
    controller.abort();

    const start = Date.now();
    const outcome = await scheduler.run(
      makeTask({ command: 'sleep 10', timeoutMs: 60_000 }),
      controller.signal,
    );
    const elapsed = Date.now() - start;

    expect(outcome.exitCode).toBe(-1);
    expect(outcome.timedOut).toBe(true);
    expect(outcome.durationMs).toBe(0);
    expect(outcome.stdoutBytes.length).toBe(0);
    expect(outcome.stderrBytes.length).toBe(0);
    // Fast-path must not take anywhere near a real spawn.
    expect(elapsed).toBeLessThan(100);
  });

  it('mid-flight abort kills the child via SIGTERM', async () => {
    const scheduler = new SyncScheduler();
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 100);

    const start = Date.now();
    const outcome = await scheduler.run(
      makeTask({ command: 'sleep 10', timeoutMs: 60_000 }),
      controller.signal,
    );
    const elapsed = Date.now() - start;

    expect(outcome.exitCode).toBe(-1);
    expect(outcome.timedOut).toBe(true);
    // Must return well before the 60s timeout — caller abort short-circuits.
    expect(elapsed).toBeLessThan(SIGKILL_GRACE_MS);
  });
});

// ---------------------------------------------------------------------------
// SyncScheduler.runAll
// ---------------------------------------------------------------------------

describe('SyncScheduler.runAll', () => {
  it('executes tasks sequentially and returns outcomes in input order', async () => {
    const scheduler = new SyncScheduler();
    const tasks: VerificationTask[] = [
      makeTask({ command: "printf 'first'" }),
      makeTask({ command: "printf 'second'" }),
      makeTask({ command: "printf 'third'" }),
    ];

    const outcomes = await scheduler.runAll(tasks, new AbortController().signal);

    expect(outcomes).toHaveLength(3);
    expect(outcomes[0]!.stdoutBytes.toString('utf8')).toBe('first');
    expect(outcomes[1]!.stdoutBytes.toString('utf8')).toBe('second');
    expect(outcomes[2]!.stdoutBytes.toString('utf8')).toBe('third');
    for (const outcome of outcomes) {
      expect(outcome.exitCode).toBe(0);
      expect(outcome.timedOut).toBe(false);
    }
  });

  it('does NOT short-circuit on gate failure — scheduler runs every task (runner owns fail-fast)', async () => {
    const scheduler = new SyncScheduler();
    const tasks: VerificationTask[] = [
      makeTask({ command: 'exit 1', policy: 'gate' }),
      makeTask({ command: "printf 'ran-anyway'", policy: 'gate' }),
    ];

    const outcomes = await scheduler.runAll(tasks, new AbortController().signal);

    expect(outcomes).toHaveLength(2);
    expect(outcomes[0]!.exitCode).toBe(1);
    expect(outcomes[1]!.exitCode).toBe(0);
    expect(outcomes[1]!.stdoutBytes.toString('utf8')).toBe('ran-anyway');
  });

  it('propagates a mid-flight abort — in-flight task killed, remaining tasks short-circuit', async () => {
    const scheduler = new SyncScheduler();
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 100);

    const tasks: VerificationTask[] = [
      makeTask({ command: 'sleep 10', timeoutMs: 60_000 }),
      makeTask({ command: 'sleep 10', timeoutMs: 60_000 }),
    ];

    const start = Date.now();
    const outcomes = await scheduler.runAll(tasks, controller.signal);
    const elapsed = Date.now() - start;

    expect(outcomes).toHaveLength(2);
    // First task: killed mid-flight by abort.
    expect(outcomes[0]!.exitCode).toBe(-1);
    expect(outcomes[0]!.timedOut).toBe(true);
    // Second task: entered run() with signal already aborted → fast-path.
    expect(outcomes[1]!.exitCode).toBe(-1);
    expect(outcomes[1]!.timedOut).toBe(true);
    expect(outcomes[1]!.durationMs).toBe(0);
    // Whole batch must return well before a single 60s task would.
    expect(elapsed).toBeLessThan(SIGKILL_GRACE_MS);
  });
});
