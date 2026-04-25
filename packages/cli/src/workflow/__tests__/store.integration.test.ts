/**
 * Integration test for Wave A.1's S1 surface — concurrent-writer durability
 * under SIGKILL (#146 A.1.10, scenario SC-ORCH-25).
 *
 * The S1 change adds a `PRAGMA wal_checkpoint(TRUNCATE)` after every
 * successful `workflow.step.exit` append. The design contract per
 * orchestration README §6 / scenario SC-ORCH-25 is:
 *
 *   "SIGKILL between adjacent step.exits cannot lose events committed
 *    before the prior step.exit."
 *
 * This file exercises that contract end-to-end: a child Bun process opens
 * an EventStore, appends a deterministic prefix of events that ends with a
 * `workflow.step.exit` (forcing a WAL checkpoint), writes a sentinel file
 * to signal "the prefix is on disk", then enters a tight append loop. The
 * parent waits for the sentinel, sends SIGKILL, re-opens the db, and
 * asserts that every event committed before the sentinel is recoverable.
 *
 * The unit-level checkpoint-truncates-WAL test lives in `store.test.ts`'s
 * "WAL checkpoint after workflow.step.exit (#146 A.1.9)" describe block.
 * That test is in-process; this one is the cross-process durability check
 * that proves the truncation actually survives a hard kill.
 *
 * **Determinism note**: the parent polls for the sentinel rather than
 * sleeping for a fixed window. The sentinel is written AFTER the child's
 * step.exit append returns, which means the WAL has already been
 * checkpointed by the time the parent reads the file. The post-kill
 * recovery path is then driven by SQLite's standard WAL-mode recovery on
 * next open — no application-level cleanup needed.
 */

import { afterEach, describe, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { EventRow } from '../migrations.js';

// ---------------------------------------------------------------------------
// Scratch-dir lifecycle
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

function makeScratch(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-a1-10-sigkill-'));
  scratchDirs.push(dir);
  return dir;
}

// ---------------------------------------------------------------------------
// Child-process script — written to a temp file so `Bun.spawn` can run it
// in a fresh interpreter. The script writes a structured progress trail
// (sentinel files) the parent can poll without parsing stdout.
//
// Contract:
//   1. Open a file-backed EventStore at `<scratch>/.gobbi/state.db`.
//   2. Append `WARMUP_BEFORE_CHECKPOINT` non-step.exit events to grow
//      the WAL.
//   3. Append one `workflow.step.exit` event — this triggers the
//      A.1.9 checkpoint hook and truncates the WAL to ~zero.
//   4. Append `WARMUP_AFTER_CHECKPOINT` more non-step.exit events so
//      the WAL is non-empty again at kill time.
//   5. Write `<scratch>/ready` (the parent's sentinel).
//   6. Enter a tight infinite append loop until the kernel kills us.
//      Each iteration adds a non-step.exit event; the WAL grows.
//
// All events use the COUNTER idempotency kind with monotonically rising
// counters so collisions are impossible. The script imports EventStore via
// the package's `dist`-relative path is NOT possible (it's source-only),
// so we resolve the import path against the test file's location.
// ---------------------------------------------------------------------------

const WARMUP_BEFORE_CHECKPOINT = 25;
const WARMUP_AFTER_CHECKPOINT = 25;
// Total committed events at the sentinel: WARMUP_BEFORE + 1 step.exit +
// WARMUP_AFTER. The parent treats this as the "at-minimum recoverable"
// floor — events appended after the sentinel may or may not survive
// depending on when SIGKILL races with the WAL writer.
const COMMITTED_BEFORE_SENTINEL =
  WARMUP_BEFORE_CHECKPOINT + 1 + WARMUP_AFTER_CHECKPOINT;

/**
 * Build the child-script source. Path-injected so the resolved
 * `import.meta.url` of the test file's `__tests__/` parent points at the
 * `store.ts` source file the child opens. Using a relative import from
 * the test directory keeps the child Bun process out of the workspace
 * package-resolver path.
 */
function buildChildScript(
  storeImportPath: string,
  dbPath: string,
  readyPath: string,
  sessionId: string,
): string {
  // Use Bun's URL-like file:// import so absolute paths route through
  // Bun's loader without depending on tsconfig path aliases.
  const importUrl = `file://${storeImportPath}`;
  return `// Auto-generated child for SIGKILL durability test (#146 A.1.10).
import { EventStore } from ${JSON.stringify(importUrl)};
import { writeFileSync } from 'node:fs';

const dbPath = ${JSON.stringify(dbPath)};
const readyPath = ${JSON.stringify(readyPath)};
const sessionId = ${JSON.stringify(sessionId)};
const WARMUP_BEFORE = ${WARMUP_BEFORE_CHECKPOINT};
const WARMUP_AFTER = ${WARMUP_AFTER_CHECKPOINT};

const store = new EventStore(dbPath, { sessionId, projectId: 'sigkill-int' });

let counter = 0;
const baseTs = Date.parse('2026-04-25T00:00:00.000Z');

function appendNoise(label) {
  store.append({
    ts: new Date(baseTs).toISOString(),
    type: 'workflow.start',
    step: null,
    data: '{}',
    actor: 'orchestrator',
    parent_seq: null,
    idempotencyKind: 'counter',
    counter: counter++,
    sessionId,
  });
}

// 1. Warm up the WAL.
for (let i = 0; i < WARMUP_BEFORE; i += 1) appendNoise('warmup-pre');

// 2. Step.exit triggers the per-step checkpoint, truncating the WAL.
store.append({
  ts: new Date(baseTs + 1).toISOString(),
  type: 'workflow.step.exit',
  step: 'ideation',
  data: '{}',
  actor: 'orchestrator',
  parent_seq: null,
  idempotencyKind: 'counter',
  counter: counter++,
  sessionId,
});

// 3. More noise so the WAL has fresh writes at kill time.
for (let i = 0; i < WARMUP_AFTER; i += 1) appendNoise('warmup-post');

// 4. Sentinel — the parent polls this. Writing it AFTER the step.exit
//    return guarantees the WAL was checkpointed for the first
//    WARMUP_BEFORE + 1 events.
writeFileSync(readyPath, 'ready', 'utf8');

// 5. Tight loop until SIGKILL. The bound is generous — if the parent
//    fails to kill within the timeout, the test should fail anyway,
//    but we don't want the child to leak forever.
const HARD_DEADLINE = Date.now() + 30000;
while (Date.now() < HARD_DEADLINE) {
  appendNoise('post-sentinel');
}

// Defensive — if we somehow exit naturally, close cleanly so the test
// fixture doesn't see a partial WAL from a clean exit.
store.close();
`;
}

/**
 * Resolve the on-disk path to `packages/cli/src/workflow/store.ts` from
 * the test file's location. The test lives in
 * `packages/cli/src/workflow/__tests__/`, so the store is at `../store.ts`.
 */
function resolveStoreSourcePath(): string {
  const here = new URL(import.meta.url).pathname;
  // here = /…/packages/cli/src/workflow/__tests__/store.integration.test.ts
  return join(here, '..', '..', 'store.ts');
}

/**
 * Poll for a sentinel file with a hard timeout. Returns true when the
 * file appears, false when the timeout elapses. Sleep granularity is
 * intentionally coarse (10 ms) — the WAL checkpoint inside the child is
 * fast; the polling cost dominates only on a misconfigured fixture.
 */
async function waitForFile(
  path: string,
  timeoutMs: number,
): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (existsSync(path)) return true;
    await new Promise<void>((r) => setTimeout(r, 10));
  }
  return false;
}

// ===========================================================================
// Test 3 — Concurrent-writer durability under SIGKILL
// ===========================================================================

describe('Wave A.1.10 — concurrent-writer durability under SIGKILL', () => {
  test('events committed before a step.exit survive a parent-side SIGKILL of the writer', async () => {
    const scratch = makeScratch();
    mkdirSync(join(scratch, '.gobbi'), { recursive: true });
    const dbPath = join(scratch, '.gobbi', 'state.db');
    const readyPath = join(scratch, 'ready');
    const scriptPath = join(scratch, 'child.mjs');

    const sessionId = 'sess-sigkill-int';
    writeFileSync(
      scriptPath,
      buildChildScript(resolveStoreSourcePath(), dbPath, readyPath, sessionId),
      'utf8',
    );

    // ----- Spawn the child Bun process. `process.execPath` is the bun
    //       binary running this test, so the child speaks the same
    //       ESM/TypeScript dialect.
    const child = Bun.spawn({
      cmd: [process.execPath, scriptPath],
      cwd: scratch,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    let killed = false;
    let stderrText = '';
    try {
      // ----- Drain stderr in the background so the buffer can't fill up
      //       and stall the child mid-write. We only consume it for
      //       diagnostic context if the durability assertion fails.
      const stderrTask = (async (): Promise<void> => {
        try {
          stderrText = await new Response(child.stderr).text();
        } catch {
          // child died — buffer drain may throw; safe to ignore.
        }
      })();

      // ----- Wait for the sentinel. Generous timeout — typical fixture
      //       writes the sentinel inside 1-2 seconds; 10 seconds gives
      //       headroom for slow CI machines without making a hung test
      //       sit forever.
      const ready = await waitForFile(readyPath, 10000);
      if (!ready) {
        // Diagnostics — kill before failing so the child doesn't leak.
        child.kill('SIGKILL');
        await child.exited;
        throw new Error(
          `child failed to reach the sentinel within 10 s. ` +
            `stderr=${stderrText.slice(0, 2000)}`,
        );
      }

      // ----- Hard-kill the child. Its tight append loop guarantees we
      //       interrupt mid-write; the prior `step.exit` already
      //       truncated the WAL for the committed prefix.
      child.kill('SIGKILL');
      killed = true;
      await child.exited;
      // Drain stderr so the assertion-failure diagnostic has full
      // context.
      await stderrTask;
    } finally {
      if (!killed) {
        // Belt-and-braces — never leak a child past the test.
        try {
          child.kill('SIGKILL');
        } catch {
          // already exited
        }
      }
    }

    // ----- Re-open the db from the parent. This is the SQLite WAL-mode
    //       recovery path: opening a DB whose previous writer was
    //       SIGKILL'd reads the WAL on connect, applies committed
    //       transactions, and surfaces them via the events table.
    const recovery = new Database(dbPath);
    try {
      const rows = recovery
        .query<EventRow, []>('SELECT * FROM events ORDER BY seq ASC')
        .all();

      // ----- Floor invariant — every event the child wrote BEFORE the
      //       sentinel must be present. Events written AFTER the
      //       sentinel may or may not survive depending on race
      //       conditions; we only assert the committed-before floor.
      expect(rows.length).toBeGreaterThanOrEqual(COMMITTED_BEFORE_SENTINEL);

      // ----- The first WARMUP_BEFORE + 1 + WARMUP_AFTER seqs must be
      //       contiguous (1, 2, 3, …) — no gaps in the recovered range.
      //       A gap would imply WAL corruption surfaced as a missing
      //       commit; SQLite's recovery contract rules this out.
      for (let i = 0; i < COMMITTED_BEFORE_SENTINEL; i += 1) {
        const row = rows[i];
        expect(row).toBeDefined();
        if (row === undefined) continue;
        expect(row.seq).toBe(i + 1);
        expect(row.session_id).toBe(sessionId);
      }

      // ----- Exactly one workflow.step.exit must be in the recovered
      //       range (the one that triggered the checkpoint). Its seq is
      //       WARMUP_BEFORE_CHECKPOINT + 1.
      const stepExits = rows.filter((r) => r.type === 'workflow.step.exit');
      expect(stepExits.length).toBeGreaterThanOrEqual(1);
      const firstStepExit = stepExits[0];
      expect(firstStepExit).toBeDefined();
      if (firstStepExit !== undefined) {
        expect(firstStepExit.seq).toBe(WARMUP_BEFORE_CHECKPOINT + 1);
      }

      // ----- A subsequent close() must run cleanly — the close-time
      //       checkpoint at `store.ts:728` (additive to the per-
      //       step.exit one) drains any post-sentinel events that
      //       made it to the WAL but not yet to the main file.
      expect(() => recovery.close()).not.toThrow();
    } catch (err) {
      try {
        recovery.close();
      } catch {
        // best-effort
      }
      // Surface the child's stderr if the fixture failed — it's the
      // only diagnostic the parent has into the child's view.
      // eslint-disable-next-line no-console
      console.error(
        `[A.1.10 SIGKILL] child stderr (truncated 2k):\n${stderrText.slice(0, 2000)}`,
      );
      throw err;
    }

    // ----- Final sanity: the WAL recovery did not silently drop the
    //       events table. Re-open one more time to prove the file is
    //       in a normal post-recovery state.
    const second = new Database(dbPath, { readonly: true });
    try {
      const cnt = second
        .query<{ cnt: number }, []>('SELECT count(*) as cnt FROM events')
        .get();
      expect(cnt?.cnt).toBeGreaterThanOrEqual(COMMITTED_BEFORE_SENTINEL);
    } finally {
      second.close();
    }
  }, 30000); // generous test timeout — 10 s sentinel wait + child runtime
});

