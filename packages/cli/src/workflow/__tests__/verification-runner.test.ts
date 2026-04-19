/**
 * Tests for the E.3 `runVerification` orchestrator and its companion
 * `reduceVerification` sub-reducer.
 *
 * The runner integrates project-config loading (E.5), the SyncScheduler
 * (E.4), digest computation, and the engine's compound append helper into
 * one entry point called from `compileCurrentStep`. These tests exercise
 * the full pipeline against a real tmp-dir session + real `sh -c` spawns —
 * the scheduler is not mocked, so we stay 1:1 with production behaviour.
 *
 * Coverage:
 *   - Single command pass → event recorded, verificationResults advanced.
 *   - Gate fail short-circuits subsequent commands (any policy) for the
 *     same subagent.
 *   - Inform fail does NOT short-circuit.
 *   - Mixed-policy list exercises L17 — gate before inform stops both when
 *     the gate fails.
 *   - All-pass mixed-policy list runs every command.
 *   - Timeout sets `timedOut: true` and encodes the signal as -1 / -2 per
 *     the scheduler contract.
 *   - Idempotency: re-invoking the runner for the same subagent+kind pair
 *     deduplicates at the store layer.
 *   - Multi-kind: different commandKinds from one subagent each persist.
 *   - Reducer rejection: a hand-crafted event for an unknown subagentId
 *     surfaces `ReducerRejectionError`.
 *   - Empty runAfterSubagentStop → empty outcomes, no side-effects.
 *   - Digest shape — pass is hash-only, fail carries the 4KB slice suffix.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  appendEventAndUpdateState,
  ReducerRejectionError,
  resolveWorkflowState,
} from '../engine.js';
import { EventStore } from '../store.js';
import { reduce } from '../reducer.js';
import { initialState } from '../state.js';
import type { WorkflowState } from '../state.js';
import {
  createVerificationResult,
  VERIFICATION_EVENTS,
  type VerificationResultData,
} from '../events/verification.js';
import { DELEGATION_EVENTS } from '../events/delegation.js';
import { WORKFLOW_EVENTS } from '../events/workflow.js';
import type { Event } from '../events/index.js';
import { runVerification } from '../verification-runner.js';
import { DEFAULT_CONFIG } from '../../lib/project-config.js';

// ---------------------------------------------------------------------------
// Scratch fixture — real repoRoot with `.gobbi/sessions/<id>/` layout, a
// real project-config.json, and a real SQLite store. The runner derives
// repoRoot deterministically from sessionDir so the layout must match.
// ---------------------------------------------------------------------------

interface Scratch {
  readonly repoRoot: string;
  readonly sessionDir: string;
  readonly sessionId: string;
  readonly store: EventStore;
}

const scratches: Scratch[] = [];

function cleanupAll(): void {
  while (scratches.length > 0) {
    const s = scratches.pop();
    if (s === undefined) continue;
    try {
      s.store.close();
    } catch {
      // best-effort
    }
    try {
      rmSync(s.repoRoot, { recursive: true, force: true });
    } catch {
      // best-effort
    }
  }
}

afterEach(cleanupAll);

/**
 * Build a tmp repoRoot with `.gobbi/sessions/<id>/` underneath, a
 * project-config.json containing the supplied `runAfterSubagentStop` +
 * `commands` map, and an open EventStore. Returns the full fixture bundle.
 */
function buildScratch(args: {
  readonly sessionId?: string;
  readonly runAfterSubagentStop: readonly string[];
  readonly commands: Record<string, { command: string; policy: 'gate' | 'inform'; timeoutMs: number } | null>;
}): Scratch {
  const sessionId = args.sessionId ?? `sess-${Math.random().toString(36).slice(2, 8)}`;
  const repoRoot = mkdtempSync(join(tmpdir(), 'gobbi-verif-runner-'));
  const sessionDir = join(repoRoot, '.gobbi', 'sessions', sessionId);
  mkdirSync(sessionDir, { recursive: true });

  // Project config — merge with DEFAULT_CONFIG.commands so keys we don't
  // care about still have valid slots.
  const configPath = join(repoRoot, '.gobbi', 'project-config.json');
  const commands = {
    ...DEFAULT_CONFIG.verification.commands,
    ...args.commands,
  };
  const config = {
    version: 1,
    verification: {
      commands,
      runAfterSubagentStop: args.runAfterSubagentStop,
    },
    cost: DEFAULT_CONFIG.cost,
  };
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');

  const store = new EventStore(join(sessionDir, 'gobbi.db'));
  const scratch: Scratch = { repoRoot, sessionDir, sessionId, store };
  scratches.push(scratch);
  return scratch;
}

/**
 * Seed the session into a state with one active subagent. Returns the
 * WorkflowState after the spawn event.
 */
function seedSessionWithSubagent(
  scratch: Scratch,
  subagentId: string = 'sub-A',
): WorkflowState {
  const start: Event = {
    type: WORKFLOW_EVENTS.START,
    data: { sessionId: scratch.sessionId, timestamp: '2026-04-18T00:00:00.000Z' },
  };
  const afterStart = appendEventAndUpdateState(
    scratch.store,
    scratch.sessionDir,
    initialState(scratch.sessionId),
    start,
    'cli',
    scratch.sessionId,
    'system',
  );

  const spawn: Event = {
    type: DELEGATION_EVENTS.SPAWN,
    data: {
      subagentId,
      agentType: 'executor',
      step: afterStart.state.currentStep,
      timestamp: '2026-04-18T00:01:00.000Z',
    },
  };
  const afterSpawn = appendEventAndUpdateState(
    scratch.store,
    scratch.sessionDir,
    afterStart.state,
    spawn,
    'cli',
    scratch.sessionId,
    'tool-call',
    `tc-spawn-${subagentId}`,
  );
  return afterSpawn.state;
}

// ===========================================================================
// Happy path — single pass
// ===========================================================================

describe('runVerification — single command pass', () => {
  test('emits a verification.result event and advances verificationResults', async () => {
    const scratch = buildScratch({
      runAfterSubagentStop: ['typecheck'],
      commands: {
        typecheck: { command: 'true', policy: 'gate', timeoutMs: 10_000 },
      },
    });
    const state = seedSessionWithSubagent(scratch, 'sub-pass');

    const outcomes = await runVerification(
      scratch.sessionDir,
      scratch.store,
      state,
      scratch.sessionId,
    );

    expect(outcomes).toHaveLength(1);
    expect(outcomes[0]?.exitCode).toBe(0);
    expect(outcomes[0]?.timedOut).toBe(false);

    const after = resolveWorkflowState(
      scratch.sessionDir,
      scratch.store,
      scratch.sessionId,
    );
    const key = 'sub-pass:typecheck';
    expect(after.verificationResults[key]).toBeDefined();
    expect(after.verificationResults[key]?.exitCode).toBe(0);
    expect(after.verificationResults[key]?.policy).toBe('gate');
    expect(after.verificationResults[key]?.command).toBe('true');
    expect(after.verificationResults[key]?.timedOut).toBe(false);
    // Pass-path digest is hash-only — no semicolon slice suffix.
    expect(after.verificationResults[key]?.stdoutDigest).toMatch(/^sha256:[0-9a-f]{64}$/);
    expect(after.verificationResults[key]?.stdoutDigest).not.toContain(';slice:');
  });
});

// ===========================================================================
// L17 fail-fast — gate failure halts subsequent commands regardless of kind
// ===========================================================================

describe('runVerification — L17 fail-fast', () => {
  test('gate failure skips all subsequent commands for the same subagent', async () => {
    const scratch = buildScratch({
      runAfterSubagentStop: ['typecheck', 'test', 'lint'],
      commands: {
        typecheck: { command: 'exit 17', policy: 'gate', timeoutMs: 10_000 },
        test: { command: 'true', policy: 'gate', timeoutMs: 10_000 },
        lint: { command: 'true', policy: 'inform', timeoutMs: 10_000 },
      },
    });
    const state = seedSessionWithSubagent(scratch, 'sub-gate-fail');

    const outcomes = await runVerification(
      scratch.sessionDir,
      scratch.store,
      state,
      scratch.sessionId,
    );

    // Only typecheck actually ran — test and lint were skipped by fail-fast.
    expect(outcomes).toHaveLength(1);
    expect(outcomes[0]?.exitCode).toBe(17);

    const after = resolveWorkflowState(
      scratch.sessionDir,
      scratch.store,
      scratch.sessionId,
    );
    expect(after.verificationResults['sub-gate-fail:typecheck']).toBeDefined();
    expect(after.verificationResults['sub-gate-fail:test']).toBeUndefined();
    expect(after.verificationResults['sub-gate-fail:lint']).toBeUndefined();
  });

  test('inform failure does NOT short-circuit subsequent commands', async () => {
    const scratch = buildScratch({
      runAfterSubagentStop: ['lint', 'test'],
      commands: {
        lint: { command: 'exit 3', policy: 'inform', timeoutMs: 10_000 },
        test: { command: 'true', policy: 'gate', timeoutMs: 10_000 },
      },
    });
    const state = seedSessionWithSubagent(scratch, 'sub-inform-fail');

    const outcomes = await runVerification(
      scratch.sessionDir,
      scratch.store,
      state,
      scratch.sessionId,
    );

    expect(outcomes).toHaveLength(2);
    expect(outcomes[0]?.exitCode).toBe(3);
    expect(outcomes[1]?.exitCode).toBe(0);

    const after = resolveWorkflowState(
      scratch.sessionDir,
      scratch.store,
      scratch.sessionId,
    );
    expect(after.verificationResults['sub-inform-fail:lint']?.exitCode).toBe(3);
    expect(after.verificationResults['sub-inform-fail:test']?.exitCode).toBe(0);
  });

  test('all-pass mixed-policy list runs every command end-to-end', async () => {
    const scratch = buildScratch({
      runAfterSubagentStop: ['typecheck', 'test', 'lint'],
      commands: {
        typecheck: { command: 'true', policy: 'gate', timeoutMs: 10_000 },
        test: { command: 'true', policy: 'gate', timeoutMs: 10_000 },
        lint: { command: 'true', policy: 'inform', timeoutMs: 10_000 },
      },
    });
    const state = seedSessionWithSubagent(scratch, 'sub-all-pass');

    const outcomes = await runVerification(
      scratch.sessionDir,
      scratch.store,
      state,
      scratch.sessionId,
    );

    expect(outcomes).toHaveLength(3);
    for (const outcome of outcomes) {
      expect(outcome.exitCode).toBe(0);
      expect(outcome.timedOut).toBe(false);
    }

    const after = resolveWorkflowState(
      scratch.sessionDir,
      scratch.store,
      scratch.sessionId,
    );
    expect(after.verificationResults['sub-all-pass:typecheck']).toBeDefined();
    expect(after.verificationResults['sub-all-pass:test']).toBeDefined();
    expect(after.verificationResults['sub-all-pass:lint']).toBeDefined();
  });
});

// ===========================================================================
// Timeout — signal sentinel in exitCode
// ===========================================================================

describe('runVerification — timeout', () => {
  test('records timedOut=true with the scheduler signal sentinel exitCode', async () => {
    const scratch = buildScratch({
      runAfterSubagentStop: ['test'],
      commands: {
        test: { command: 'sleep 5', policy: 'gate', timeoutMs: 100 },
      },
    });
    const state = seedSessionWithSubagent(scratch, 'sub-timeout');

    const outcomes = await runVerification(
      scratch.sessionDir,
      scratch.store,
      state,
      scratch.sessionId,
    );

    expect(outcomes).toHaveLength(1);
    const firstOutcome = outcomes[0];
    if (firstOutcome === undefined) throw new Error('expected one outcome');
    expect(firstOutcome.timedOut).toBe(true);
    // -1 = SIGTERM (graceful), -2 = SIGKILL (after 2s grace). Either is
    // acceptable — the sleep dies before the SIGKILL fires in practice.
    expect([-1, -2]).toContain(firstOutcome.exitCode);

    const after = resolveWorkflowState(
      scratch.sessionDir,
      scratch.store,
      scratch.sessionId,
    );
    const stored = after.verificationResults['sub-timeout:test'];
    expect(stored).toBeDefined();
    if (stored === undefined) return;
    expect(stored.timedOut).toBe(true);
    expect([-1, -2]).toContain(stored.exitCode);
  }, 15_000);
});

// ===========================================================================
// Idempotency
// ===========================================================================

describe('runVerification — idempotency', () => {
  test('re-invocation for the same subagent:kind deduplicates at the store', async () => {
    const scratch = buildScratch({
      runAfterSubagentStop: ['lint'],
      commands: {
        lint: { command: 'true', policy: 'inform', timeoutMs: 10_000 },
      },
    });
    const state = seedSessionWithSubagent(scratch, 'sub-idem');

    await runVerification(
      scratch.sessionDir,
      scratch.store,
      state,
      scratch.sessionId,
    );
    const firstCount = scratch.store.eventCount();

    // Second invocation against the same subagent + kind. The scheduler
    // will re-spawn (no memoisation at that layer) but the event-store
    // `ON CONFLICT DO NOTHING` on the composite idempotency key drops
    // the second insert, so eventCount stays put.
    const afterFirst = resolveWorkflowState(
      scratch.sessionDir,
      scratch.store,
      scratch.sessionId,
    );
    await runVerification(
      scratch.sessionDir,
      scratch.store,
      afterFirst,
      scratch.sessionId,
    );

    expect(scratch.store.eventCount()).toBe(firstCount);
  });
});

// ===========================================================================
// Multi-kind — distinct composite keys persist side-by-side
// ===========================================================================

describe('runVerification — multi-kind', () => {
  test('lint + test from one subagent persist as independent entries', async () => {
    const scratch = buildScratch({
      runAfterSubagentStop: ['lint', 'test'],
      commands: {
        lint: { command: 'true', policy: 'inform', timeoutMs: 10_000 },
        test: { command: 'true', policy: 'gate', timeoutMs: 10_000 },
      },
    });
    const state = seedSessionWithSubagent(scratch, 'sub-multi');

    const outcomes = await runVerification(
      scratch.sessionDir,
      scratch.store,
      state,
      scratch.sessionId,
    );
    expect(outcomes).toHaveLength(2);

    const after = resolveWorkflowState(
      scratch.sessionDir,
      scratch.store,
      scratch.sessionId,
    );
    expect(after.verificationResults['sub-multi:lint']).toBeDefined();
    expect(after.verificationResults['sub-multi:test']).toBeDefined();
    expect(after.verificationResults['sub-multi:lint']?.commandKind).toBe('lint');
    expect(after.verificationResults['sub-multi:test']?.commandKind).toBe('test');
  });
});

// ===========================================================================
// Empty runAfterSubagentStop → no-op
// ===========================================================================

describe('runVerification — empty command list', () => {
  test('returns [] without touching the event store', async () => {
    const scratch = buildScratch({
      runAfterSubagentStop: [],
      commands: {},
    });
    const state = seedSessionWithSubagent(scratch, 'sub-empty');
    const priorCount = scratch.store.eventCount();

    const outcomes = await runVerification(
      scratch.sessionDir,
      scratch.store,
      state,
      scratch.sessionId,
    );

    expect(outcomes).toEqual([]);
    expect(scratch.store.eventCount()).toBe(priorCount);
  });

  test('returns [] when there are no active subagents', async () => {
    const scratch = buildScratch({
      runAfterSubagentStop: ['typecheck'],
      commands: {
        typecheck: { command: 'true', policy: 'gate', timeoutMs: 10_000 },
      },
    });
    // Seed a start event only — no spawn, so activeSubagents stays empty.
    const start: Event = {
      type: WORKFLOW_EVENTS.START,
      data: {
        sessionId: scratch.sessionId,
        timestamp: '2026-04-18T00:00:00.000Z',
      },
    };
    const afterStart = appendEventAndUpdateState(
      scratch.store,
      scratch.sessionDir,
      initialState(scratch.sessionId),
      start,
      'cli',
      scratch.sessionId,
      'system',
    );
    const priorCount = scratch.store.eventCount();

    const outcomes = await runVerification(
      scratch.sessionDir,
      scratch.store,
      afterStart.state,
      scratch.sessionId,
    );

    expect(outcomes).toEqual([]);
    expect(scratch.store.eventCount()).toBe(priorCount);
  });
});

// ===========================================================================
// Digest shape — fail carries the 4KB stream slice
// ===========================================================================

describe('runVerification — digest shape', () => {
  test('on fail, stderrDigest embeds sha256 hash + utf-8 slice of the stream', async () => {
    const scratch = buildScratch({
      runAfterSubagentStop: ['lint'],
      commands: {
        // stderr contains a known marker; exit non-zero so the fail path
        // populates the digest slice.
        lint: {
          command: "printf 'LINTFAIL-MARKER' >&2; exit 2",
          policy: 'inform',
          timeoutMs: 10_000,
        },
      },
    });
    const state = seedSessionWithSubagent(scratch, 'sub-digest');

    await runVerification(
      scratch.sessionDir,
      scratch.store,
      state,
      scratch.sessionId,
    );

    const after = resolveWorkflowState(
      scratch.sessionDir,
      scratch.store,
      scratch.sessionId,
    );
    const stored = after.verificationResults['sub-digest:lint'];
    expect(stored).toBeDefined();
    expect(stored?.exitCode).toBe(2);
    // Fail-path digest has hash + semicolon + slice of the stream.
    expect(stored?.stderrDigest).toMatch(/^sha256:[0-9a-f]{64};slice:/);
    expect(stored?.stderrDigest).toContain('LINTFAIL-MARKER');
    // stdout is empty on this command — hash covers an empty buffer but the
    // failure flag still appends the (empty) slice suffix.
    expect(stored?.stdoutDigest).toMatch(/^sha256:[0-9a-f]{64};slice:/);
  });
});

// ===========================================================================
// Reducer rejection — event whose subagentId is not active
// ===========================================================================

describe('reduceVerification — rejection path', () => {
  test('reduce returns ok:false when subagentId is not in activeSubagents', () => {
    const base = initialState('rejection-session');
    // No subagents active — any verification.result is a rejection.
    const data: VerificationResultData = {
      subagentId: 'sub-ghost',
      command: 'true',
      commandKind: 'typecheck',
      exitCode: 0,
      durationMs: 12,
      policy: 'gate',
      timedOut: false,
      stdoutDigest: `sha256:${'0'.repeat(64)}`,
      stderrDigest: `sha256:${'0'.repeat(64)}`,
      timestamp: '2026-04-18T00:00:00.000Z',
    };
    const event = createVerificationResult(data);

    const result = reduce(
      { ...base, currentStep: 'execution' },
      event,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('sub-ghost');
      expect(result.error).toContain('not an active subagent');
    }
  });

  test('appendEventAndUpdateState surfaces ReducerRejectionError for unknown subagentId', () => {
    const scratch = buildScratch({
      runAfterSubagentStop: [],
      commands: {},
    });
    // Seed into execution with no spawn — activeSubagents stays empty.
    const start: Event = {
      type: WORKFLOW_EVENTS.START,
      data: {
        sessionId: scratch.sessionId,
        timestamp: '2026-04-18T00:00:00.000Z',
      },
    };
    const afterStart = appendEventAndUpdateState(
      scratch.store,
      scratch.sessionDir,
      initialState(scratch.sessionId),
      start,
      'cli',
      scratch.sessionId,
      'system',
    );

    const data: VerificationResultData = {
      subagentId: 'sub-nowhere',
      command: 'true',
      commandKind: 'test',
      exitCode: 0,
      durationMs: 4,
      policy: 'gate',
      timedOut: false,
      stdoutDigest: `sha256:${'0'.repeat(64)}`,
      stderrDigest: `sha256:${'0'.repeat(64)}`,
      timestamp: '2026-04-18T00:00:00.000Z',
    };
    const event = createVerificationResult(data);

    expect(() =>
      appendEventAndUpdateState(
        scratch.store,
        scratch.sessionDir,
        afterStart.state,
        event,
        'hook',
        scratch.sessionId,
        'tool-call',
        'sub-nowhere:test',
      ),
    ).toThrow(ReducerRejectionError);
  });

  test('reduce returns ok:false when subagentId contains a colon (composite-key collision guard)', () => {
    // A subagentId containing `:` would let a sibling subagent whose id is
    // a prefix of this one silently steal its verification rows — the E.8
    // compiler and the in-reducer key construction both rely on `:` being
    // the sole separator between the two segments. The reducer rejects at
    // the single write site so every downstream reader can trust the
    // invariant.
    const base = initialState('colon-guard-session');
    const withSubagent: WorkflowState = {
      ...base,
      currentStep: 'execution',
      activeSubagents: [
        {
          subagentId: 'agent:v2',
          agentType: 'executor',
          step: 'execution',
          spawnedAt: '2026-04-18T00:00:00.000Z',
        },
      ],
    };
    const data: VerificationResultData = {
      subagentId: 'agent:v2',
      command: 'true',
      commandKind: 'lint',
      exitCode: 0,
      durationMs: 10,
      policy: 'gate',
      timedOut: false,
      stdoutDigest: `sha256:${'0'.repeat(64)}`,
      stderrDigest: `sha256:${'0'.repeat(64)}`,
      timestamp: '2026-04-18T00:00:00.000Z',
    };
    const event = createVerificationResult(data);

    const result = reduce(withSubagent, event);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("subagentId must not contain ':'");
      expect(result.error).toContain('agent:v2:lint');
      expect(result.error).toContain('depends on colon as separator');
    }
  });
});

// ===========================================================================
// Reducer happy path — composite-key persistence + immutability
// ===========================================================================

describe('reduceVerification — happy path', () => {
  test('stores the event data under the composite subagentId:commandKind key', () => {
    const base = initialState('happy-session');
    const withSubagent: WorkflowState = {
      ...base,
      currentStep: 'execution',
      activeSubagents: [
        {
          subagentId: 'sub-happy',
          agentType: 'executor',
          step: 'execution',
          spawnedAt: '2026-04-18T00:00:00.000Z',
        },
      ],
    };
    const data: VerificationResultData = {
      subagentId: 'sub-happy',
      command: 'bunx tsc --noEmit',
      commandKind: 'typecheck',
      exitCode: 0,
      durationMs: 999,
      policy: 'gate',
      timedOut: false,
      stdoutDigest: `sha256:${'a'.repeat(64)}`,
      stderrDigest: `sha256:${'b'.repeat(64)}`,
      timestamp: '2026-04-18T00:05:00.000Z',
    };
    const event = createVerificationResult(data);

    const result = reduce(withSubagent, event);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.state.verificationResults['sub-happy:typecheck']).toEqual(data);
    // Immutability — original state not mutated.
    expect(withSubagent.verificationResults).toEqual({});
    // Active subagents unchanged.
    expect(result.state.activeSubagents).toEqual(withSubagent.activeSubagents);
  });

  test('verification.result event type matches the VERIFICATION_EVENTS.RESULT constant', () => {
    const event = createVerificationResult({
      subagentId: 'sub-type',
      command: 'true',
      commandKind: 'lint',
      exitCode: 0,
      durationMs: 0,
      policy: 'inform',
      timedOut: false,
      stdoutDigest: `sha256:${'0'.repeat(64)}`,
      stderrDigest: `sha256:${'0'.repeat(64)}`,
      timestamp: '2026-04-18T00:00:00.000Z',
    });
    expect(event.type).toBe(VERIFICATION_EVENTS.RESULT);
  });
});

// ===========================================================================
// Skip unrecognised / null command slots
// ===========================================================================

describe('runVerification — config filtering', () => {
  test('skips commandKinds whose slot is null', async () => {
    const scratch = buildScratch({
      runAfterSubagentStop: ['custom'],
      commands: {
        // `custom` defaults to null; the runner must skip it without
        // throwing and return an empty outcomes list.
        custom: null,
      },
    });
    const state = seedSessionWithSubagent(scratch, 'sub-null');

    const outcomes = await runVerification(
      scratch.sessionDir,
      scratch.store,
      state,
      scratch.sessionId,
    );

    expect(outcomes).toEqual([]);
  });
});
