/**
 * Unit + integration tests for `gobbi workflow resume`.
 *
 * Coverage:
 *   - Missing `--target` exits 2 with usage on stderr.
 *   - Unknown flag exits 2 with usage on stderr.
 *   - `--target error` is explicitly rejected (exit 1).
 *   - Non-active-step target (e.g. `done`) exits 1.
 *   - Resume from non-error state exits 1.
 *   - `--target plan` from error state appends workflow.resume, emits
 *     the resume prompt on stdout, exits 0.
 *   - `--force-memorization` atomically appends BOTH decision.eval.skip
 *     (carrying priorError) AND workflow.resume under one transaction,
 *     emits the resume prompt targeting memorization, exits 0.
 *   - CP11 reversibility: the priorError snapshot round-trips through the
 *     event store — read it back, parse, and assert the pathway structure
 *     matches the freshly-detected pathway on the error state (modulo
 *     `capturedAt`).
 *   - WORKFLOW_COMMANDS registers the `resume` subcommand.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import { runInitWithOptions } from '../init.js';
import { runResumeWithOptions } from '../resume.js';
import { WORKFLOW_COMMANDS } from '../../workflow.js';
import { sessionDir as sessionDirForProject } from '../../../lib/workspace-paths.js';
import {
  appendEventAndUpdateState,
  resolveWorkflowState,
} from '../../../workflow/engine.js';
import {
  createStepExit,
  createStepTimeout,
} from '../../../workflow/events/workflow.js';
import { EventStore } from '../../../workflow/store.js';
import { detectPathway } from '../../../specs/errors.js';
import type { ErrorPathway } from '../../../specs/errors.js';

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
  const sessionDir = sessionDirForProject(repo, basename(repo), sessionId);
  captured = { stdout: '', stderr: '', exitCode: null };
  return { sessionDir, repo };
}

/**
 * Drive a freshly-initialised session into the `error` state by firing a
 * `workflow.step.timeout` event against the ideation step. The reducer
 * transitions `ideation → error` on STEP_TIMEOUT for any active step.
 */
async function driveToErrorState(
  sessionDir: string,
  sessionId: string,
): Promise<void> {
  const store = new EventStore(join(sessionDir, 'gobbi.db'));
  try {
    const state = resolveWorkflowState(sessionDir, store, sessionId);
    appendEventAndUpdateState(
      store,
      sessionDir,
      state,
      createStepTimeout({
        step: state.currentStep,
        elapsedMs: 300_000,
        configuredTimeoutMs: 120_000,
      }),
      'hook',
      sessionId,
      'tool-call',
      'tc-drive-timeout',
    );
  } finally {
    store.close();
  }
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
    expect(captured.stderr).toContain('gobbi workflow resume');
  });
});

// ===========================================================================
// Target validation — pre-reducer gates
// ===========================================================================

describe('runResumeWithOptions — target validation', () => {
  test('--target error is explicitly rejected (exit 1)', async () => {
    const { sessionDir } = await initScratchSession('resume-target-error');
    await driveToErrorState(sessionDir, 'resume-target-error');

    await captureExit(() =>
      runResumeWithOptions(['--target', 'error'], { sessionDir }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('invalid --target');
  });

  test('non-active-step target (e.g. done) exits 1', async () => {
    const { sessionDir } = await initScratchSession('resume-target-done');
    await driveToErrorState(sessionDir, 'resume-target-done');

    await captureExit(() =>
      runResumeWithOptions(['--target', 'done'], { sessionDir }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('invalid --target');
  });

  test('resume from non-error state exits 1', async () => {
    const { sessionDir } = await initScratchSession('resume-nonerror');
    // No driveToErrorState — fresh init sits at ideation/discussing.

    await captureExit(() =>
      runResumeWithOptions(['--target', 'planning'], { sessionDir }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('non-error state');
  });
});

// ===========================================================================
// Normal resume path — exit 0 + workflow.resume event
// ===========================================================================

describe('runResumeWithOptions — default resume', () => {
  test('--target planning from error state appends workflow.resume and emits the resume prompt', async () => {
    const sessionId = 'resume-plan';
    const { sessionDir } = await initScratchSession(sessionId);
    await driveToErrorState(sessionDir, sessionId);

    await captureExit(() =>
      runResumeWithOptions(['--target', 'planning'], { sessionDir }),
    );

    expect(captured.exitCode).toBeNull();

    // Resume prompt surface landed on stdout. The compiled prompt's
    // dynamic block cites the detected pathway's recap for the selected
    // target — 'Timeout recap:' fires because the session was driven to
    // error via a STEP_TIMEOUT event.
    expect(captured.stdout).toContain('Timeout recap:');
    // Target-entry framing names the target step.
    expect(captured.stdout).toContain('planning');

    // One workflow.resume event is persisted.
    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const resumeRows = store.byType('workflow.resume');
      expect(resumeRows.length).toBe(1);
      const row = resumeRows[0];
      const parsed = JSON.parse(row!.data) as {
        readonly targetStep: string;
        readonly fromError: boolean;
      };
      expect(parsed.targetStep).toBe('planning');
      expect(parsed.fromError).toBe(true);

      // No decision.eval.skip on the non-force path.
      expect(store.byType('decision.eval.skip').length).toBe(0);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// Force-memorization — atomic two-event transaction
// ===========================================================================

describe('runResumeWithOptions — --force-memorization', () => {
  test('atomically appends decision.eval.skip (with priorError) AND workflow.resume', async () => {
    const sessionId = 'resume-force';
    const { sessionDir } = await initScratchSession(sessionId);
    await driveToErrorState(sessionDir, sessionId);

    await captureExit(() =>
      runResumeWithOptions(
        ['--target', 'memorization', '--force-memorization'],
        { sessionDir },
      ),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Timeout recap:');

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const skipRows = store.byType('decision.eval.skip');
      const resumeRows = store.byType('workflow.resume');

      // Both events landed.
      expect(skipRows.length).toBe(1);
      expect(resumeRows.length).toBe(1);

      // Atomicity check: the two events bracket a contiguous seq range.
      // The skip always precedes the resume (append order) — assert by
      // seq ordering. Same-millisecond idempotency keys differ because
      // the 'system' formula encodes `eventType` per the store's
      // computeIdempotencyKey; so both always persist.
      const skipSeq = skipRows[0]!.seq;
      const resumeSeq = resumeRows[0]!.seq;
      expect(skipSeq).toBeLessThan(resumeSeq);

      // priorError is present on the skip event's data.
      const skipData = JSON.parse(skipRows[0]!.data) as {
        readonly step: string;
        readonly priorError?: {
          readonly pathway: ErrorPathway;
          readonly capturedAt: string;
          readonly stepAtError: string;
          readonly witnessEventSeqs: readonly number[];
        };
      };
      expect(skipData.step).toBe('memorization');
      expect(skipData.priorError).toBeDefined();
      expect(skipData.priorError!.stepAtError).toBe('error');
      expect(skipData.priorError!.pathway.kind).toBe('timeout');
      expect(skipData.priorError!.witnessEventSeqs.length).toBeGreaterThan(0);
    } finally {
      store.close();
    }
  });

  test('CP11 reversibility — priorError snapshot round-trips through the event store', async () => {
    const sessionId = 'resume-cp11';
    const { sessionDir } = await initScratchSession(sessionId);
    await driveToErrorState(sessionDir, sessionId);

    // Snapshot the pathway detected BEFORE the resume — this is the
    // baseline the CP11 reversibility gate asserts against.
    let baselinePathway: ErrorPathway;
    {
      const store = new EventStore(join(sessionDir, 'gobbi.db'));
      try {
        const state = resolveWorkflowState(sessionDir, store, sessionId);
        baselinePathway = detectPathway(state, store);
      } finally {
        store.close();
      }
    }

    await captureExit(() =>
      runResumeWithOptions(
        ['--target', 'memorization', '--force-memorization'],
        { sessionDir },
      ),
    );
    expect(captured.exitCode).toBeNull();

    // Read the skip event back and reconstruct the pathway snapshot.
    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const skipRows = store.byType('decision.eval.skip');
      expect(skipRows.length).toBe(1);
      const skipData = JSON.parse(skipRows[0]!.data) as {
        readonly priorError: {
          readonly pathway: ErrorPathway;
          readonly capturedAt: string;
          readonly stepAtError: string;
          readonly witnessEventSeqs: readonly number[];
        };
      };
      const reconstructed = skipData.priorError.pathway;

      // Structural equality on the pathway variant — this is the CP11
      // gate. `capturedAt` is stamped by the resume path, not by
      // `detectPathway`, so it is NOT part of the baseline; it lives on
      // the PriorErrorSnapshot envelope rather than the pathway itself.
      expect(reconstructed).toEqual(baselinePathway);
    } finally {
      store.close();
    }
  });

  // CV-9 regression — issue #163. The pre-fix `--force-memorization`
  // branch appended events via raw `store.transaction(...)` and never
  // wrote `state.json`. `resolveWorkflowState`'s fast path read the
  // stale state.json and returned the pre-resume `error` step on every
  // subsequent invocation — events said `memorization`, state.json
  // disagreed. The fix derives state via `deriveWorkflowState` and
  // explicitly calls `writeState` after the transaction commits.
  //
  // This test asserts the on-disk state.json content directly, NOT the
  // event-store rows (the pre-existing tests above already cover those).
  test('writes state.json with currentStep=memorization after --force-memorization (issue #163)', async () => {
    const sessionId = 'resume-force-statefile';
    const { sessionDir } = await initScratchSession(sessionId);
    await driveToErrorState(sessionDir, sessionId);

    // Sanity baseline: state.json reflects the error state pre-resume.
    {
      const raw = readFileSync(join(sessionDir, 'state.json'), 'utf8');
      const before = JSON.parse(raw) as { readonly currentStep: string };
      expect(before.currentStep).toBe('error');
    }

    await captureExit(() =>
      runResumeWithOptions(
        ['--target', 'memorization', '--force-memorization'],
        { sessionDir },
      ),
    );
    expect(captured.exitCode).toBeNull();

    // The actual regression assertion — state.json materialised the
    // post-resume state, not just the event-store rows.
    const raw = readFileSync(join(sessionDir, 'state.json'), 'utf8');
    const after = JSON.parse(raw) as {
      readonly currentStep: string;
      readonly schemaVersion: number;
    };
    expect(after.currentStep).toBe('memorization');
    // The fast-path readers (`resolveWorkflowState`) accept the file by
    // schemaVersion gate — confirm the persisted shape passes that gate
    // so downstream guard / status / next reads see the fresh state.
    expect(after.schemaVersion).toBeGreaterThanOrEqual(4);

    // Cross-check via the same code path the runtime uses — fast-path
    // readState → resolveWorkflowState. Pre-fix, this returned 'error'
    // because state.json was stale.
    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const resolved = resolveWorkflowState(sessionDir, store, sessionId);
      expect(resolved.currentStep).toBe('memorization');
    } finally {
      store.close();
    }

    // Backup invariant — `state.json.backup` must trail `state.json` by
    // at most one state write. The `--force-memorization` branch calls
    // `backupState` immediately before `writeState`, so the backup
    // captures the pre-resume `error` state that lived in `state.json`
    // before the explicit post-transaction projection. This mirrors the
    // discipline in `appendEventAndUpdateState` (engine.ts).
    const backupRaw = readFileSync(
      join(sessionDir, 'state.json.backup'),
      'utf8',
    );
    const backup = JSON.parse(backupRaw) as { readonly currentStep: string };
    expect(backup.currentStep).toBe('error');
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
