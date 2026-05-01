/**
 * Unit tests for `gobbi workflow stop` — the Stop hook handler.
 *
 * Coverage:
 *   - Registry presence — `stop` is registered in WORKFLOW_COMMANDS.
 *   - Reentrance guard — `stop_hook_active: true` → no-op (no events,
 *     empty stdout, exit 0). MUST be the first branch.
 *   - Happy path — heartbeat event lands with 'counter' idempotency and
 *     `seq` advances.
 *   - Same-millisecond double-invocation — both heartbeats persist with
 *     distinct `counter` values (`0` and `1`); both pass the UNIQUE
 *     constraint on `idempotency_key`.
 *   - Missing session → silent exit, no crash, no events.
 *   - Response contract: exit 0, no permissionDecision, empty stdout.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import { runInitWithOptions } from '../init.js';
import { makeConformingTmpRepo } from '../../../__tests__/helpers/conforming-tmpdir.js';
import { runStopWithOptions, DEFAULT_SPECS_DIR } from '../stop.js';
import { WORKFLOW_COMMANDS } from '../../workflow.js';
import { sessionDir as sessionDirForProject } from '../../../lib/workspace-paths.js';
import { EventStore } from '../../../workflow/store.js';
import {
  appendEventAndUpdateState,
  resolveWorkflowState,
} from '../../../workflow/engine.js';
import {
  createStepExit,
  createStepTimeout,
  createResume,
} from '../../../workflow/events/workflow.js';

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
  const dir = makeConformingTmpRepo('gobbi-stop');
  scratchDirs.push(dir);
  return dir;
}

async function initScratchSession(
  sessionId: string,
): Promise<{ sessionDir: string; repo: string; projectId: string }> {
  const repo = makeScratchRepo();
  const projectId = basename(repo);
  await captureExit(() =>
    runInitWithOptions(
      ['--session-id', sessionId, '--task', 'stop-test'],
      { repoRoot: repo },
    ),
  );
  const sessionDir = sessionDirForProject(repo, projectId, sessionId);
  captured = { stdout: '', stderr: '', exitCode: null };
  return { sessionDir, repo, projectId };
}

/**
 * Open the per-session event store with explicit partition keys
 * (PR-FIN-2a-ii / T-2a.9.unified Option α). Tests that previously
 * called `new EventStore(<sessionDir>/gobbi.db)` relied on the now-
 * retired `metadata.json` reader to fill in `project_id`; with that
 * fallback gone, every read filters `WHERE project_id IS NULL` and
 * returns zero rows. Pass the same `(sessionId, projectId)` init
 * stamped at write time.
 */
function openStore(
  sessionDir: string,
  sessionId: string,
  projectId: string,
): EventStore {
  return new EventStore(join(sessionDir, 'gobbi.db'), {
    sessionId,
    projectId,
  });
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

describe('WORKFLOW_COMMANDS registration', () => {
  test('exposes `stop` as a subcommand', () => {
    const names = WORKFLOW_COMMANDS.map((c) => c.name);
    expect(names).toContain('stop');
  });
});

// ---------------------------------------------------------------------------
// Reentrance guard
// ---------------------------------------------------------------------------

describe('runStop — stop_hook_active', () => {
  test('stop_hook_active: true → no heartbeat, empty stdout, exit 0', async () => {
    const { sessionDir, projectId } = await initScratchSession('stop-reentrant');

    const beforeCount = countHeartbeats(sessionDir, 'stop-reentrant', projectId);

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        payload: {
          session_id: 'stop-reentrant',
          stop_hook_active: true,
        },
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');

    // No heartbeat written — reentrance branch runs before any store open.
    expect(countHeartbeats(sessionDir, 'stop-reentrant', projectId)).toBe(
      beforeCount,
    );
  });
});

// ---------------------------------------------------------------------------
// Happy path — heartbeat event lands
// ---------------------------------------------------------------------------

describe('runStop — heartbeat emission', () => {
  test('writes a session.heartbeat event via counter idempotency (counter=0)', async () => {
    const { sessionDir, projectId } = await initScratchSession('stop-happy');
    const frozen = new Date('2026-04-16T10:00:00.000Z');

    const store0 = openStore(sessionDir, 'stop-happy', projectId);
    const lastSeqBefore = store0.eventCount();
    store0.close();

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        payload: { session_id: 'stop-happy' },
        now: () => frozen,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe(''); // observational — no JSON response

    const store = openStore(sessionDir, 'stop-happy', projectId);
    try {
      const heartbeats = store.byType('session.heartbeat');
      expect(heartbeats).toHaveLength(1);
      const row = heartbeats[0]!;
      expect(row.actor).toBe('hook');
      expect(row.seq).toBe(lastSeqBefore + 1);

      // Counter idempotency key shape: sess:ms:type:counter
      const expectedMs = frozen.getTime();
      expect(row.idempotency_key).toBe(
        `stop-happy:${expectedMs}:session.heartbeat:0`,
      );

      // Data carries the ISO timestamp from the factory.
      const data = JSON.parse(row.data) as { readonly timestamp: string };
      expect(data.timestamp).toBe(frozen.toISOString());
    } finally {
      store.close();
    }
  });

  test('heartbeat does NOT mutate state — currentStep unchanged', async () => {
    const { sessionDir, projectId } = await initScratchSession('stop-nomutate');

    // PR-FIN-2a-ii (T-2a.9.unified) retired `state.json`; derive state
    // by replay over the partition-filtered event stream instead. The
    // invariant under test is that `runStop` writes only a heartbeat
    // event — the reducer must not transition currentStep.
    const stepBefore = (() => {
      const store = openStore(sessionDir, 'stop-nomutate', projectId);
      try {
        return resolveWorkflowState(sessionDir, store, 'stop-nomutate').currentStep;
      } finally {
        store.close();
      }
    })();

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        payload: { session_id: 'stop-nomutate' },
      }),
    );

    const stepAfter = (() => {
      const store = openStore(sessionDir, 'stop-nomutate', projectId);
      try {
        return resolveWorkflowState(sessionDir, store, 'stop-nomutate').currentStep;
      } finally {
        store.close();
      }
    })();

    expect(stepAfter).toBe(stepBefore);
  });
});

// ---------------------------------------------------------------------------
// Same-millisecond disambiguation via counter
// ---------------------------------------------------------------------------

describe('runStop — same-millisecond collisions', () => {
  test('two invocations at the same ms both persist with counter 0 and 1', async () => {
    const { sessionDir, projectId } = await initScratchSession('stop-collide');
    const frozen = new Date('2026-04-16T11:22:33.456Z');

    // Fire twice with the identical clock — the counter must
    // disambiguate or the UNIQUE constraint would drop the second.
    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        payload: { session_id: 'stop-collide' },
        now: () => frozen,
      }),
    );
    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        payload: { session_id: 'stop-collide' },
        now: () => frozen,
      }),
    );

    const store = openStore(sessionDir, 'stop-collide', projectId);
    try {
      const heartbeats = store.byType('session.heartbeat');
      expect(heartbeats).toHaveLength(2);

      const expectedMs = frozen.getTime();
      expect(heartbeats[0]!.idempotency_key).toBe(
        `stop-collide:${expectedMs}:session.heartbeat:0`,
      );
      expect(heartbeats[1]!.idempotency_key).toBe(
        `stop-collide:${expectedMs}:session.heartbeat:1`,
      );
    } finally {
      store.close();
    }
  });

  test('second invocation at a later ms resets the counter bucket to 0', async () => {
    const { sessionDir, projectId } = await initScratchSession('stop-newms');

    const t1 = new Date('2026-04-16T11:22:33.456Z');
    const t2 = new Date('2026-04-16T11:22:34.789Z');

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        payload: { session_id: 'stop-newms' },
        now: () => t1,
      }),
    );
    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        payload: { session_id: 'stop-newms' },
        now: () => t2,
      }),
    );

    const store = openStore(sessionDir, 'stop-newms', projectId);
    try {
      const heartbeats = store.byType('session.heartbeat');
      expect(heartbeats).toHaveLength(2);

      // Both start a fresh bucket — counter 0 in each.
      expect(heartbeats[0]!.idempotency_key).toBe(
        `stop-newms:${t1.getTime()}:session.heartbeat:0`,
      );
      expect(heartbeats[1]!.idempotency_key).toBe(
        `stop-newms:${t2.getTime()}:session.heartbeat:0`,
      );
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// Bounded tail-scan — heartbeat counter must not materialise full history
// ---------------------------------------------------------------------------

describe('runStop — bounded heartbeat tail-scan', () => {
  test('resolves same-ms counter against a 200-heartbeat history without scanning the full stream', async () => {
    const { sessionDir, projectId } = await initScratchSession('stop-bound');

    // Seed 200 heartbeats across distinct milliseconds so the stop
    // handler has a long prior stream to walk. The final seeded row
    // shares the `frozen` bucket to force a same-ms collision at the
    // tail — the bounded scan must still find counter=0 and assign 1.
    const frozen = new Date('2026-04-16T12:00:00.000Z');
    const seedStore = openStore(sessionDir, 'stop-bound', projectId);
    try {
      seedStore.transaction(() => {
        for (let i = 0; i < 199; i += 1) {
          // Unique ms per seeded heartbeat so none collide with each
          // other (each gets counter=0 in its own bucket).
          const msOffset = i + 1; // offset into the past
          const rowTs = new Date(frozen.getTime() - msOffset).toISOString();
          seedStore.append({
            ts: rowTs,
            type: 'session.heartbeat',
            step: null,
            data: JSON.stringify({ timestamp: rowTs }),
            actor: 'hook',
            parent_seq: null,
            idempotencyKind: 'counter',
            counter: 0,
            sessionId: 'stop-bound',
          });
        }
        // One heartbeat sharing the exact `frozen` ms so the next
        // invocation collides and must pick counter=1.
        const rowTs = frozen.toISOString();
        seedStore.append({
          ts: rowTs,
          type: 'session.heartbeat',
          step: null,
          data: JSON.stringify({ timestamp: rowTs }),
          actor: 'hook',
          parent_seq: null,
          idempotencyKind: 'counter',
          counter: 0,
          sessionId: 'stop-bound',
        });
      });
    } finally {
      seedStore.close();
    }

    // Sanity — history is 200 rows deep before the stop fires.
    const before = openStore(sessionDir, 'stop-bound', projectId);
    const beforeCount = before.byType('session.heartbeat').length;
    before.close();
    expect(beforeCount).toBe(200);

    // Fire Stop at the same ms as the tail — counter should resolve to
    // 1 (the tail already has counter=0 in this bucket). If the scan
    // walked the full 200-row stream and somehow miscounted, this
    // assertion would fail.
    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        payload: { session_id: 'stop-bound' },
        now: () => frozen,
      }),
    );

    const after = openStore(sessionDir, 'stop-bound', projectId);
    try {
      const heartbeats = after.byType('session.heartbeat');
      expect(heartbeats).toHaveLength(201);
      const last = heartbeats[heartbeats.length - 1]!;
      const expectedMs = frozen.getTime();
      expect(last.idempotency_key).toBe(
        `stop-bound:${expectedMs}:session.heartbeat:1`,
      );
    } finally {
      after.close();
    }
  });
});

// ---------------------------------------------------------------------------
// Missing session
// ---------------------------------------------------------------------------

describe('runStop — missing session', () => {
  test('session dir does not exist → silent exit, no crash', async () => {
    const repo = makeScratchRepo();
    const fakeDir = sessionDirForProject(repo, basename(repo), 'ghost');
    expect(existsSync(fakeDir)).toBe(false);

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir: fakeDir,
        payload: { session_id: 'ghost' },
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
  });

  test('session dir exists but gobbi.db is missing → silent exit', async () => {
    const repo = makeScratchRepo();
    const sessionDir = sessionDirForProject(repo, basename(repo), 'no-db');
    const { mkdirSync } = await import('node:fs');
    mkdirSync(sessionDir, { recursive: true });

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        payload: { session_id: 'no-db' },
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
  });
});

// ---------------------------------------------------------------------------
// E.11 — meta.timeoutMs detection
//
// Exercises the timeout-detection branch added to the stop handler. The
// tests construct a scratch specs directory containing a minimal graph
// that declares an `ideation` step whose spec carries `meta.timeoutMs`.
// The session's state.json is mutated in place (via writeState) to stamp
// `stepStartedAt` so the handler's elapsed computation has a real
// reference point.
// ---------------------------------------------------------------------------

describe('runStop — meta.timeoutMs detection (E.11)', () => {
  test('no timeout event emitted when spec.meta.timeoutMs is unset', async () => {
    const sessionId = 'stop-tm-unset';
    const { sessionDir, projectId } = await initScratchSession(sessionId);
    // Scratch specs dir whose ideation spec omits timeoutMs entirely.
    const specsDir = makeTimeoutSpecsDir({
      omitTimeout: true,
    });

    // Drive state.stepStartedAt 60s before `frozen` so elapsed would be
    // 60000 ms — irrelevant here, since the spec has no timeout.
    const frozen = new Date('2026-04-16T10:00:00.000Z');
    await stampStepStartedAt(
      sessionDir,
      sessionId,
      projectId,
      new Date(frozen.getTime() - 60_000),
    );
    // `stampStepStartedAt` emits one synthetic STEP_TIMEOUT to flip the
    // session into `error` so RESUME can target ideation. Snapshot the
    // post-stamp baseline so the assertions below measure the production
    // stop handler's emit, not the helper's.
    const baselineTimeouts = countTimeoutEvents(sessionDir, sessionId, projectId);

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        specsDir,
        payload: { session_id: sessionId },
        now: () => frozen,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(countTimeoutEvents(sessionDir, sessionId, projectId)).toBe(
      baselineTimeouts,
    );
  });

  test('no timeout event emitted when elapsedMs <= meta.timeoutMs', async () => {
    const sessionId = 'stop-tm-under';
    const { sessionDir, projectId } = await initScratchSession(sessionId);
    const specsDir = makeTimeoutSpecsDir({ timeoutMs: 60_000 });

    // 30s elapsed — strictly under 60s budget.
    const frozen = new Date('2026-04-16T10:00:30.000Z');
    await stampStepStartedAt(
      sessionDir,
      sessionId,
      projectId,
      new Date(frozen.getTime() - 30_000),
    );
    const baselineTimeouts = countTimeoutEvents(sessionDir, sessionId, projectId);

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        specsDir,
        payload: { session_id: sessionId },
        now: () => frozen,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(countTimeoutEvents(sessionDir, sessionId, projectId)).toBe(
      baselineTimeouts,
    );
    // State remains on the active step — no transition to error.
    expect(readCurrentStep(sessionDir, sessionId, projectId)).toBe('ideation');
  });

  test('emits workflow.step.timeout once when elapsedMs > meta.timeoutMs', async () => {
    const sessionId = 'stop-tm-over';
    const { sessionDir, projectId } = await initScratchSession(sessionId);
    const specsDir = makeTimeoutSpecsDir({ timeoutMs: 60_000 });

    // 90s elapsed — over the 60s budget.
    const frozen = new Date('2026-04-16T10:01:30.000Z');
    await stampStepStartedAt(
      sessionDir,
      sessionId,
      projectId,
      new Date(frozen.getTime() - 90_000),
    );

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        specsDir,
        payload: { session_id: sessionId },
        now: () => frozen,
      }),
    );

    expect(captured.exitCode).toBeNull();

    // The production stop handler emits a timeout row whose
    // `idempotency_key` is `${sessionId}:${ms}:workflow.step.timeout`
    // with `ms` derived from `frozen`. Filter to that key so the
    // synthetic stamp event (which has `step: 'planning'` and a
    // different ms) is excluded.
    const expectedKey = `${sessionId}:${frozen.getTime()}:workflow.step.timeout`;
    const store = openStore(sessionDir, sessionId, projectId);
    try {
      const timeouts = store
        .byType('workflow.step.timeout')
        .filter((row) => row.idempotency_key === expectedKey);
      expect(timeouts).toHaveLength(1);

      const row = timeouts[0]!;
      expect(row.actor).toBe('hook');
      expect(row.step).toBe('ideation');

      const data = JSON.parse(row.data) as {
        readonly step: string;
        readonly elapsedMs: number;
        readonly configuredTimeoutMs: number;
      };
      expect(data.step).toBe('ideation');
      expect(data.elapsedMs).toBe(90_000);
      expect(data.configuredTimeoutMs).toBe(60_000);
    } finally {
      store.close();
    }

    // Reducer consumed the event — active step → error.
    expect(readCurrentStep(sessionDir, sessionId, projectId)).toBe('error');
  });

  test('idempotent: two stop invocations at the same ms emit exactly one timeout event', async () => {
    const sessionId = 'stop-tm-idem';
    const { sessionDir, projectId } = await initScratchSession(sessionId);
    const specsDir = makeTimeoutSpecsDir({ timeoutMs: 60_000 });

    const frozen = new Date('2026-04-16T10:01:30.000Z');
    await stampStepStartedAt(
      sessionDir,
      sessionId,
      projectId,
      new Date(frozen.getTime() - 90_000),
    );

    // Fire twice at the identical clock. The first invocation flips the
    // step to `error` (not an active step), so the second short-circuits
    // on the isActiveStep guard. Even if the second had re-reached the
    // emit branch, the `'system'` kind's (sessionId, ts-ms, type) UNIQUE
    // key would dedup at the storage layer.
    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        specsDir,
        payload: { session_id: sessionId },
        now: () => frozen,
      }),
    );
    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        specsDir,
        payload: { session_id: sessionId },
        now: () => frozen,
      }),
    );

    // Filter to the production handler's idempotency key — the synthetic
    // stamp also produces a STEP_TIMEOUT row with a different key, so a
    // raw `byType` count would conflate the two.
    const expectedKey = `${sessionId}:${frozen.getTime()}:workflow.step.timeout`;
    const store = openStore(sessionDir, sessionId, projectId);
    try {
      const productionTimeouts = store
        .byType('workflow.step.timeout')
        .filter((row) => row.idempotency_key === expectedKey);
      expect(productionTimeouts).toHaveLength(1);
    } finally {
      store.close();
    }
  });

  test('no crash, no event when state.stepStartedAt is null', async () => {
    const sessionId = 'stop-tm-null';
    const { sessionDir, projectId } = await initScratchSession(sessionId);
    const specsDir = makeTimeoutSpecsDir({ timeoutMs: 60_000 });

    // Fresh init leaves stepStartedAt === null. Don't stamp it. Verify
    // via the partition-filtered event stream (PR-FIN-2a-ii: no
    // state.json projection on disk).
    {
      const store = openStore(sessionDir, sessionId, projectId);
      try {
        const pre = resolveWorkflowState(sessionDir, store, sessionId);
        expect(pre.stepStartedAt).toBeNull();
      } finally {
        store.close();
      }
    }

    const frozen = new Date('2026-04-16T10:00:00.000Z');

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        specsDir,
        payload: { session_id: sessionId },
        now: () => frozen,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(countTimeoutEvents(sessionDir, sessionId, projectId)).toBe(0);
    // heartbeat still fires
    expect(countHeartbeats(sessionDir, sessionId, projectId)).toBe(1);
  });

  test('clock skew: stepStartedAt in the future does not emit a timeout event', async () => {
    // Regression lock for the explicit `elapsedMs < 0` guard in
    // `detectAndEmitTimeout`. A future-stamped `stepStartedAt` (clock
    // drift between machines, ntp slew, or synthetic fixtures) yields a
    // negative elapsed and must NOT trigger a spurious timeout — even
    // if a future refactor flips the `<=` boundary to `<`.
    const sessionId = 'stop-tm-skew';
    const { sessionDir, projectId } = await initScratchSession(sessionId);
    const specsDir = makeTimeoutSpecsDir({ timeoutMs: 60_000 });

    const frozen = new Date('2026-04-16T10:00:00.000Z');
    // Stamp 5 minutes AFTER `frozen` → elapsedMs = -300_000.
    await stampStepStartedAt(
      sessionDir,
      sessionId,
      projectId,
      new Date(frozen.getTime() + 300_000),
    );
    const baselineTimeouts = countTimeoutEvents(sessionDir, sessionId, projectId);

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        specsDir,
        payload: { session_id: sessionId },
        now: () => frozen,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(countTimeoutEvents(sessionDir, sessionId, projectId)).toBe(
      baselineTimeouts,
    );
    // State remains on the active step — no transition to error.
    expect(readCurrentStep(sessionDir, sessionId, projectId)).toBe('ideation');
  });

  test('regression: default specsDir path leaves heartbeat-only behavior unchanged', async () => {
    // This test pins the regression guarantee from the plan: when the
    // committed specs dir (no step declares meta.timeoutMs today) is
    // used, the stop handler emits only the heartbeat and no timeout
    // event — even if stepStartedAt is stamped. Protects against a
    // future accidental timeoutMs addition to a committed spec.
    const sessionId = 'stop-tm-default';
    const { sessionDir, projectId } = await initScratchSession(sessionId);

    const frozen = new Date('2026-04-16T10:00:00.000Z');
    await stampStepStartedAt(
      sessionDir,
      sessionId,
      projectId,
      new Date(frozen.getTime() - 3_600_000),
    );
    const baselineTimeouts = countTimeoutEvents(sessionDir, sessionId, projectId);

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        payload: { session_id: sessionId },
        now: () => frozen,
        // No specsDir override — uses DEFAULT_SPECS_DIR (committed specs).
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(countTimeoutEvents(sessionDir, sessionId, projectId)).toBe(
      baselineTimeouts,
    );
    expect(countHeartbeats(sessionDir, sessionId, projectId)).toBe(1);
    // Sanity — state still on the active step.
    expect(readCurrentStep(sessionDir, sessionId, projectId)).toBe('ideation');
    // DEFAULT_SPECS_DIR export is an absolute path — quick sanity so the
    // import is load-bearing.
    expect(DEFAULT_SPECS_DIR.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function countHeartbeats(
  sessionDir: string,
  sessionId: string,
  projectId: string,
): number {
  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) return 0;
  const store = openStore(sessionDir, sessionId, projectId);
  try {
    return store.byType('session.heartbeat').length;
  } finally {
    store.close();
  }
}

function countTimeoutEvents(
  sessionDir: string,
  sessionId: string,
  projectId: string,
): number {
  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) return 0;
  const store = openStore(sessionDir, sessionId, projectId);
  try {
    return store.byType('workflow.step.timeout').length;
  } finally {
    store.close();
  }
}

/**
 * Read the current step from the partition-filtered event stream. Used
 * in lieu of `readState(sessionDir)?.currentStep` after the JSON memory
 * pivot — `state.json` is no longer materialised on disk.
 */
function readCurrentStep(
  sessionDir: string,
  sessionId: string,
  projectId: string,
): string {
  const store = openStore(sessionDir, sessionId, projectId);
  try {
    return resolveWorkflowState(sessionDir, store, sessionId).currentStep;
  } finally {
    store.close();
  }
}

/**
 * Drive the session's `state.stepStartedAt` to a specific timestamp via
 * the event log. PR-FIN-2a-ii (T-2a.9.unified) retired the on-disk
 * `state.json` projection — `resolveWorkflowState` now derives state
 * purely by replaying the partition-filtered event stream, so a state
 * field can only be set by appending events that the reducer translates
 * into the desired shape.
 *
 * The path: STEP_EXIT(ideation→planning) lands the session at planning
 * with `stepStartedAt = ts`; STEP_TIMEOUT transitions to error;
 * RESUME(target=ideation, ts=startedAt) brings the session back to
 * ideation while the reducer's RESUME case stamps
 * `stepStartedAt: ts ?? state.stepStartedAt` (per
 * `workflow/reducer.ts:281`). Net result: currentStep === 'ideation'
 * and stepStartedAt === startedAt.toISOString().
 *
 * The intermediate STEP_EXIT carries a placeholder ts ahead of the
 * `startedAt` value so the synthetic timestamps stay monotonic — the
 * reducer's audit gate doesn't enforce monotonic ts but the convention
 * keeps fixture inspection straightforward.
 */
async function stampStepStartedAt(
  sessionDir: string,
  sessionId: string,
  projectId: string,
  startedAt: Date,
): Promise<void> {
  const store = openStore(sessionDir, sessionId, projectId);
  try {
    const state = resolveWorkflowState(sessionDir, store, sessionId);
    // Step 1 — exit ideation → planning. Reducer stamps stepStartedAt
    // from the engine-supplied ts; we use a synthetic past timestamp
    // (1ms before `startedAt`) so the chain stays monotonic.
    const exitTs = new Date(startedAt.getTime() - 1).toISOString();
    const afterExit = await appendEventAndUpdateState(
      store,
      sessionDir,
      state,
      createStepExit({ step: 'ideation' }),
      'cli',
      sessionId,
      'system',
      undefined,
      null,
      undefined,
      exitTs,
    );
    // Step 2 — STEP_TIMEOUT lands at error. ts unused by the reducer
    // for STEP_TIMEOUT but supplied for idempotency-key disambiguation.
    const timeoutTs = new Date(startedAt.getTime()).toISOString();
    const afterTimeout = await appendEventAndUpdateState(
      store,
      sessionDir,
      afterExit.state,
      createStepTimeout({
        step: afterExit.state.currentStep,
        elapsedMs: 0,
        configuredTimeoutMs: 0,
      }),
      'cli',
      sessionId,
      'tool-call',
      'tc-stamp-timeout',
      null,
      undefined,
      timeoutTs,
    );
    // Step 3 — RESUME back to ideation, ts = startedAt. The reducer
    // stamps stepStartedAt on RESUME (per `workflow/reducer.ts:281`),
    // so this is the timestamp the timeout-detection branch reads.
    await appendEventAndUpdateState(
      store,
      sessionDir,
      afterTimeout.state,
      createResume({ targetStep: 'ideation', fromError: true }),
      'cli',
      sessionId,
      'tool-call',
      'tc-stamp-resume',
      null,
      undefined,
      startedAt.toISOString(),
    );
  } finally {
    store.close();
  }
}

/**
 * Build a scratch specs directory whose `ideation` step's spec.json
 * declares the given `timeoutMs`, or omits it entirely when
 * `omitTimeout` is set. The graph exposes ONLY the `ideation` step —
 * the stop handler's timeout branch only ever looks up
 * `state.currentStep`, so a one-step graph is sufficient for these
 * tests.
 */
interface MakeTimeoutSpecsOptions {
  readonly timeoutMs?: number;
  readonly omitTimeout?: boolean;
}

function makeTimeoutSpecsDir(options: MakeTimeoutSpecsOptions): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-stop-specs-'));
  scratchDirs.push(dir);

  // Minimal graph — one step, one self-looping transition (kept simple
  // so `loadGraph` accepts the shape without any real workflow logic).
  const graph = {
    $schema: 'https://gobbi.dev/schemas/workflow-graph/v1.json',
    version: 1,
    entry: 'ideation',
    terminal: ['ideation'],
    steps: [{ id: 'ideation', spec: './ideation/spec.json' }],
    transitions: [],
  };
  writeFileSync(
    join(dir, 'index.json'),
    `${JSON.stringify(graph, null, 2)}\n`,
    'utf8',
  );

  // Minimal spec — copies the delegation / token-budget shape the
  // schema validator requires. Only `meta.timeoutMs` matters for E.11.
  const meta: Record<string, unknown> = {
    description: 'Ideation test spec',
    allowedAgentTypes: ['__pi'],
    maxParallelAgents: 1,
    requiredSkills: [],
    optionalSkills: [],
    expectedArtifacts: ['ideation.md'],
    completionSignal: 'SubagentStop',
  };
  if (options.omitTimeout !== true && options.timeoutMs !== undefined) {
    meta.timeoutMs = options.timeoutMs;
  }

  const spec = {
    $schema: 'https://gobbi.dev/schemas/step-spec/v1.json',
    version: 1,
    meta,
    transitions: [],
    delegation: {
      agents: [
        {
          role: 'ideator',
          modelTier: 'opus',
          effort: 'max',
          skills: [],
          artifactTarget: 'ideation.md',
          blockRef: 'ideator',
        },
      ],
    },
    tokenBudget: {
      staticPrefix: 0.3,
      session: 0.1,
      instructions: 0.2,
      artifacts: 0.25,
      materials: 0.15,
    },
    blocks: {
      static: [{ id: 'role', content: 'ideator role' }],
      conditional: [],
      delegation: {
        ideator: { id: 'ideator', content: 'ideator prompt' },
      },
      synthesis: [{ id: 'synthesis', content: 'synthesis' }],
      completion: {
        instruction: 'emit',
        criteria: ['ideation.md is written'],
      },
      footer: 'Step completion protocol — run gobbi workflow transition COMPLETE.',
    },
  };

  const specDir = join(dir, 'ideation');
  mkdirSync(specDir, { recursive: true });
  writeFileSync(
    join(specDir, 'spec.json'),
    `${JSON.stringify(spec, null, 2)}\n`,
    'utf8',
  );

  return dir;
}
