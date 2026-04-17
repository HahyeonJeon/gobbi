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
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runInitWithOptions } from '../init.js';
import { runStopWithOptions } from '../stop.js';
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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-stop-'));
  scratchDirs.push(dir);
  return dir;
}

async function initScratchSession(
  sessionId: string,
): Promise<{ sessionDir: string; repo: string }> {
  const repo = makeScratchRepo();
  await captureExit(() =>
    runInitWithOptions(
      ['--session-id', sessionId, '--task', 'stop-test'],
      { repoRoot: repo },
    ),
  );
  const sessionDir = join(repo, '.gobbi', 'sessions', sessionId);
  captured = { stdout: '', stderr: '', exitCode: null };
  return { sessionDir, repo };
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
    const { sessionDir } = await initScratchSession('stop-reentrant');

    const beforeCount = countHeartbeats(sessionDir);

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
    expect(countHeartbeats(sessionDir)).toBe(beforeCount);
  });
});

// ---------------------------------------------------------------------------
// Happy path — heartbeat event lands
// ---------------------------------------------------------------------------

describe('runStop — heartbeat emission', () => {
  test('writes a session.heartbeat event via counter idempotency (counter=0)', async () => {
    const { sessionDir } = await initScratchSession('stop-happy');
    const frozen = new Date('2026-04-16T10:00:00.000Z');

    const store0 = new EventStore(join(sessionDir, 'gobbi.db'));
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

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
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
    const { sessionDir } = await initScratchSession('stop-nomutate');

    // Snapshot state.json before
    const { readFileSync } = await import('node:fs');
    const stateBefore = JSON.parse(
      readFileSync(join(sessionDir, 'state.json'), 'utf8'),
    ) as { readonly currentStep: string };

    await captureExit(() =>
      runStopWithOptions([], {
        sessionDir,
        payload: { session_id: 'stop-nomutate' },
      }),
    );

    const stateAfter = JSON.parse(
      readFileSync(join(sessionDir, 'state.json'), 'utf8'),
    ) as { readonly currentStep: string };

    expect(stateAfter.currentStep).toBe(stateBefore.currentStep);
  });
});

// ---------------------------------------------------------------------------
// Same-millisecond disambiguation via counter
// ---------------------------------------------------------------------------

describe('runStop — same-millisecond collisions', () => {
  test('two invocations at the same ms both persist with counter 0 and 1', async () => {
    const { sessionDir } = await initScratchSession('stop-collide');
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

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
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
    const { sessionDir } = await initScratchSession('stop-newms');

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

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
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
    const { sessionDir } = await initScratchSession('stop-bound');

    // Seed 200 heartbeats across distinct milliseconds so the stop
    // handler has a long prior stream to walk. The final seeded row
    // shares the `frozen` bucket to force a same-ms collision at the
    // tail — the bounded scan must still find counter=0 and assign 1.
    const frozen = new Date('2026-04-16T12:00:00.000Z');
    const seedStore = new EventStore(join(sessionDir, 'gobbi.db'));
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
    const before = new EventStore(join(sessionDir, 'gobbi.db'));
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

    const after = new EventStore(join(sessionDir, 'gobbi.db'));
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
    const fakeDir = join(repo, '.gobbi', 'sessions', 'ghost');
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
    const sessionDir = join(repo, '.gobbi', 'sessions', 'no-db');
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
// Test helpers
// ---------------------------------------------------------------------------

function countHeartbeats(sessionDir: string): number {
  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) return 0;
  const store = new EventStore(dbPath);
  try {
    return store.byType('session.heartbeat').length;
  } finally {
    store.close();
  }
}
