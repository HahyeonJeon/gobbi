// ---------------------------------------------------------------------------
// verification-scheduler.ts
//
// VerificationScheduler contract (locked by plan L8 + research.md §E.4) and the
// SyncScheduler implementation. SyncScheduler spawns one command at a time via
// Bun.spawn, runs a SIGTERM to 2s-grace to SIGKILL ladder against the child's
// process group (detached + negative-PID kill) so descendants — `bun test`
// workers, `bunx tsc` subprocesses, user-custom `&`-backgrounded shells — do
// not orphan the host process.
//
// Scope: pure process-spawn. This module does NOT read project-config (E.5),
// write events (E.3), or know about `appendEventAndUpdateState`. The runner
// (E.3) composes project-config lookup, scheduler invocation, and event
// emission; the scheduler does one thing — spawn a command and return the
// raw outcome.
// ---------------------------------------------------------------------------

export type VerificationCommandKind =
  | 'lint'
  | 'test'
  | 'typecheck'
  | 'build'
  | 'format'
  | 'custom';

export type VerificationPolicy = 'inform' | 'gate';

export interface VerificationTask {
  readonly subagentId: string;
  /** Full command line — parsed by `sh -c` (e.g. "bun test", "bunx tsc --noEmit"). */
  readonly command: string;
  readonly commandKind: VerificationCommandKind;
  readonly cwd: string;
  readonly timeoutMs: number;
  readonly policy: VerificationPolicy;
}

export interface VerificationOutcome {
  /**
   * Exit code with signal-termination sentinels:
   * - `0` — natural success
   * - `>0` — natural failure (Bun.spawn's `exited` value)
   * - `-1` — killed by SIGTERM (timeout or caller abort, honored the 2s grace)
   * - `-2` — killed by SIGKILL (timeout or caller abort, ignored the 2s grace)
   */
  readonly exitCode: number;
  readonly durationMs: number;
  /** Raw bytes; digest (sha-256) is the caller's concern per ideation §2. */
  readonly stdoutBytes: Buffer;
  readonly stderrBytes: Buffer;
  readonly timedOut: boolean;
}

export interface VerificationScheduler {
  run(task: VerificationTask, signal: AbortSignal): Promise<VerificationOutcome>;
  runAll(
    tasks: readonly VerificationTask[],
    signal: AbortSignal,
  ): Promise<readonly VerificationOutcome[]>;
}

// ---------------------------------------------------------------------------
// Grace between SIGTERM and SIGKILL. Exported so tests can reason about it
// without depending on a magic number.
// ---------------------------------------------------------------------------
export const SIGKILL_GRACE_MS = 2_000;

// ---------------------------------------------------------------------------
// Helper — drain a Bun.spawn stdout/stderr ReadableStream into a Node Buffer.
// `new Response(stream).arrayBuffer()` is the Bun-idiomatic drain; wrapping it
// as a Buffer keeps the outcome interface shape stable regardless of whether
// callers use `Buffer.from`, `Uint8Array`, or hash directly.
// ---------------------------------------------------------------------------
async function drainToBuffer(
  stream: ReadableStream<Uint8Array> | number | undefined,
): Promise<Buffer> {
  if (!stream || typeof stream === 'number') {
    return Buffer.alloc(0);
  }
  const arrayBuffer = await new Response(stream).arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// ---------------------------------------------------------------------------
// Map Bun's `exited` Promise resolution into our sentinel exit-code space.
//
// Bun resolves `subprocess.exited` to:
// - `0` — natural exit 0
// - `N` (positive) — natural exit N
// - `128 + signal` — terminated by signal (143 SIGTERM, 137 SIGKILL, ...)
//
// `subprocess.signalCode` is the symbolic name ("SIGTERM" / "SIGKILL" / null).
// The outcome contract says negatives encode signals: -1 = SIGTERM, -2 = SIGKILL.
// We use signalCode first (symbolic) and fall back to the numeric 128+N convention
// for any other signal ("SIGINT", "SIGHUP", etc.) so an unexpected signal is still
// observable (-signalNum) rather than masquerading as a 138-esque natural exit.
// ---------------------------------------------------------------------------
function normalizeExitCode(
  exited: number,
  signalCode: NodeJS.Signals | null,
): number {
  if (signalCode === 'SIGTERM') return -1;
  if (signalCode === 'SIGKILL') return -2;
  if (signalCode !== null) {
    // Unexpected signal — encode as negative of the resolved 128+N value's delta.
    // E.g. SIGINT (2) → exited = 130 → -2 here would collide with SIGKILL, so
    // we only short-circuit SIGTERM / SIGKILL and pass the raw exited code through
    // otherwise. Downstream treats exitCode !== 0 as failure regardless.
    return exited;
  }
  return exited;
}

// ---------------------------------------------------------------------------
// Process-group kill. `detached: true` makes `subprocess.pid` the session
// leader and its own PGID; `process.kill(-pid, sig)` then delivers to every
// descendant in the group, which is the entire point of the ladder.
//
// The try/catch swallows ESRCH — "no such process" fires when the child has
// already reaped itself between our decision to kill and the syscall. That
// race is benign and must not throw.
// ---------------------------------------------------------------------------
function killGroup(pid: number, signal: NodeJS.Signals): void {
  try {
    process.kill(-pid, signal);
  } catch {
    // ESRCH / EPERM — the process group is already gone. No-op.
  }
}

export class SyncScheduler implements VerificationScheduler {
  async run(
    task: VerificationTask,
    signal: AbortSignal,
  ): Promise<VerificationOutcome> {
    const start = Date.now();

    // Fast-path: caller already cancelled before we spawned. Return a zero-duration
    // outcome with the SIGTERM sentinel so the runner sees it as "cancelled, not run"
    // without paying the spawn cost.
    if (signal.aborted) {
      return {
        exitCode: -1,
        durationMs: 0,
        stdoutBytes: Buffer.alloc(0),
        stderrBytes: Buffer.alloc(0),
        timedOut: true,
      };
    }

    // Spawn detached so `pid === pgid`. Without this, Linux does NOT propagate
    // SIGTERM from the parent-shell to its descendants (Bun docs note this
    // explicitly) and `bun test` / `bunx tsc` workers orphan.
    const child = Bun.spawn({
      cmd: ['sh', '-c', task.command],
      cwd: task.cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
      detached: true,
    });

    // Internal flag set when WE kill the child (timeout or caller abort).
    // Distinguishes "natural non-zero exit" from "signal we delivered".
    let killedByUs = false;
    let sigkillTimer: ReturnType<typeof setTimeout> | null = null;

    const escalate = (): void => {
      killedByUs = true;
      killGroup(child.pid, 'SIGTERM');
      sigkillTimer = setTimeout(() => {
        killGroup(child.pid, 'SIGKILL');
      }, SIGKILL_GRACE_MS);
      // Don't keep the event loop alive just for the SIGKILL fallback —
      // if the process exits naturally before the grace elapses we'll
      // clearTimeout in the finally block.
      sigkillTimer.unref?.();
    };

    const sigtermTimer = setTimeout(escalate, task.timeoutMs);
    sigtermTimer.unref?.();

    const onAbort = (): void => {
      // Caller cancelled mid-flight — run the same ladder. `killedByUs` guards
      // against double-escalation if the abort races with the timeout.
      if (killedByUs) return;
      clearTimeout(sigtermTimer);
      escalate();
    };

    if (signal.aborted) {
      // Raced between the initial check and the spawn returning — escalate now.
      onAbort();
    } else {
      signal.addEventListener('abort', onAbort, { once: true });
    }

    try {
      // Drain stdout/stderr in parallel with the exit wait. Bun's streams stall
      // once their internal buffer fills if nothing reads them, which would
      // keep a child alive past its natural exit point.
      const [stdoutBytes, stderrBytes, exited] = await Promise.all([
        drainToBuffer(child.stdout),
        drainToBuffer(child.stderr),
        child.exited,
      ]);

      return {
        exitCode: normalizeExitCode(exited, child.signalCode),
        durationMs: Date.now() - start,
        stdoutBytes,
        stderrBytes,
        timedOut: killedByUs,
      };
    } finally {
      clearTimeout(sigtermTimer);
      if (sigkillTimer !== null) clearTimeout(sigkillTimer);
      signal.removeEventListener('abort', onAbort);
    }
  }

  // -------------------------------------------------------------------------
  // runAll — sequential execution in input order. Does NOT short-circuit on
  // gate failure (per briefing L17: fail-fast is the RUNNER's concern, not
  // the scheduler's). The scheduler just spawns every task it is asked to
  // spawn.
  //
  // If the caller-provided AbortSignal is already aborted when we reach a
  // given task, that task's `run` returns the zero-duration cancelled outcome
  // via its fast-path. The returned array stays 1:1 with `tasks` so callers
  // can zip outcomes with task metadata without reasoning about lengths.
  // -------------------------------------------------------------------------
  async runAll(
    tasks: readonly VerificationTask[],
    signal: AbortSignal,
  ): Promise<readonly VerificationOutcome[]> {
    const outcomes: VerificationOutcome[] = [];
    for (const task of tasks) {
      outcomes.push(await this.run(task, signal));
    }
    return outcomes;
  }
}
