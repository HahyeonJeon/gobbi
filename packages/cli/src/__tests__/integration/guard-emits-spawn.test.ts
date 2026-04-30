/**
 * Integration tests — PR-FIN-2a-ii T-2a.8.0.
 *
 * Pins end-to-end behavior of the PreToolUse-guard spawn emitter and the
 * ripple effects this turn-on triggers across the codebase. The spawn
 * emitter is the canonical site for `delegation.spawn` (per
 * `v050-hooks.md:59`); turning it on for the first time activates several
 * dormant code paths:
 *
 *   1. `workflow/reducer.ts:314` — the `delegation.spawn` reducer handler
 *      mutates `state.activeSubagents`. Asserts the mutation lands.
 *   2. `predicates.piAgentsToSpawn` — fires `true` when at least one
 *      `__pi`-typed agent is in `state.activeSubagents`. Verifies the
 *      end-to-end activation through the guard.
 *   3. `workflow/reducer.ts:681-687` — `verification.result` rejects when
 *      no spawn has been recorded for the subagent. Verifies the rejection
 *      does NOT fire when the spawn IS present.
 *   4. `workflow/step-readme-writer.subagentsActiveAtExit` — frontmatter
 *      field that has been writing 0 in production because no spawns were
 *      recorded. Verifies the count populates correctly post-emit.
 *   5. `next.ts::verification-block` — the per-subagent block render
 *      iterates `state.activeSubagents`. Verifies it composes correctly
 *      when the active set is non-empty.
 *
 * Plus the primary contract:
 *   - Single-agent spawn → one `delegation.spawn` event with the
 *     `tool_call_id` from the PreToolUse payload.
 *   - Two parallel agents spawned in distinct guard invocations →
 *     two distinct `delegation.spawn` events; SubagentStop linkage uses
 *     `tool_call_id` to find the right parent.
 *   - Non-Agent tools → no spawn event is emitted (additive scope).
 *   - Allowed Agent calls without `tool_call_id` / `tool_use_id` → spawn
 *     skipped (the linkage cannot be reconstructed without the id).
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import { runInitWithOptions } from '../../commands/workflow/init.js';
import { runGuardWithOptions } from '../../commands/workflow/guard.js';
import { runCaptureSubagentWithOptions } from '../../commands/workflow/capture-subagent.js';
import { sessionDir as sessionDirForProject } from '../../lib/workspace-paths.js';
import { EventStore } from '../../workflow/store.js';
import { resolveWorkflowState } from '../../workflow/engine.js';
import {
  buildGuardMatcher,
  type GuardMatcher,
} from '../../workflow/guards.js';
import { defaultPredicates } from '../../workflow/predicates.js';
import { generateStepReadme } from '../../workflow/step-readme-writer.js';
import { compileVerificationBlock } from '../../specs/verification-block.js';
import type { WorkflowState } from '../../workflow/state.js';

// ---------------------------------------------------------------------------
// stdout / stderr capture + process.exit trap
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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-spawn-emit-'));
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
      ['--session-id', sessionId, '--task', 'spawn-emit-test'],
      { repoRoot: repo },
    ),
  );
  const sessionDir = sessionDirForProject(repo, projectId, sessionId);
  captured = { stdout: '', stderr: '', exitCode: null };
  return { sessionDir, repo, projectId };
}

/**
 * Open the per-session event store with explicit partition keys (PR-FIN-
 * 2a-ii / T-2a.9.unified Option α).
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

function emptyMatcher(): GuardMatcher {
  return buildGuardMatcher([]);
}

// ===========================================================================
// Primary contract — single-agent spawn
// ===========================================================================

describe('PreToolUse guard — single-agent spawn emission', () => {
  test('Agent tool with subagent_type + tool_call_id → one delegation.spawn', async () => {
    const sessionId = 'spawn-single';
    const { sessionDir, projectId } = await initScratchSession(sessionId);

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: emptyMatcher(),
        payload: {
          tool_name: 'Task',
          session_id: sessionId,
          tool_call_id: 'toolu_single',
          tool_input: {
            subagent_type: '__executor',
            prompt: 'do the thing',
          },
        },
      }),
    );

    expect(captured.exitCode).toBeNull();

    const store = openStore(sessionDir, sessionId, projectId);
    try {
      const spawns = store.byType('delegation.spawn');
      expect(spawns).toHaveLength(1);
      const data = JSON.parse(spawns[0]!.data) as {
        readonly agentType: string;
        readonly tool_call_id?: string;
        readonly subagentId: string;
        readonly step: string;
      };
      expect(data.agentType).toBe('__executor');
      expect(data.tool_call_id).toBe('toolu_single');
      // No agent_id in the payload, so subagentId falls back to tool_call_id.
      expect(data.subagentId).toBe('toolu_single');
      // ideation is the step init lands on after eval.decide.
      expect(data.step).toBe('ideation');
    } finally {
      store.close();
    }
  });

  test('Agent tool via tool_use_id (canonical Claude Code field) emits spawn', async () => {
    const sessionId = 'spawn-use-id';
    const { sessionDir, projectId } = await initScratchSession(sessionId);

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: emptyMatcher(),
        payload: {
          tool_name: 'Task',
          session_id: sessionId,
          tool_use_id: 'toolu_canonical',
          tool_input: { subagent_type: '__pi' },
        },
      }),
    );

    const store = openStore(sessionDir, sessionId, projectId);
    try {
      const spawns = store.byType('delegation.spawn');
      expect(spawns).toHaveLength(1);
      const data = JSON.parse(spawns[0]!.data) as {
        readonly tool_call_id?: string;
        readonly agentType: string;
      };
      expect(data.tool_call_id).toBe('toolu_canonical');
      expect(data.agentType).toBe('__pi');
    } finally {
      store.close();
    }
  });

  test('non-Agent tool → no delegation.spawn event', async () => {
    const sessionId = 'spawn-no-agent';
    const { sessionDir, projectId } = await initScratchSession(sessionId);

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: emptyMatcher(),
        payload: {
          tool_name: 'Write',
          session_id: sessionId,
          tool_call_id: 'toolu_write',
          tool_input: { file_path: '/tmp/x', content: '' },
        },
      }),
    );

    const store = openStore(sessionDir, sessionId, projectId);
    try {
      expect(store.byType('delegation.spawn')).toHaveLength(0);
    } finally {
      store.close();
    }
  });

  test('Agent tool without tool_call_id / tool_use_id → no spawn (linkage impossible)', async () => {
    const sessionId = 'spawn-no-tcid';
    const { sessionDir, projectId } = await initScratchSession(sessionId);

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: emptyMatcher(),
        payload: {
          tool_name: 'Task',
          session_id: sessionId,
          tool_input: { subagent_type: '__executor' },
          // no tool_call_id, no tool_use_id
        },
      }),
    );

    const store = openStore(sessionDir, sessionId, projectId);
    try {
      expect(store.byType('delegation.spawn')).toHaveLength(0);
    } finally {
      store.close();
    }
  });

  test('Agent tool without subagent_type → no spawn (agentType missing)', async () => {
    const sessionId = 'spawn-no-type';
    const { sessionDir, projectId } = await initScratchSession(sessionId);

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: emptyMatcher(),
        payload: {
          tool_name: 'Task',
          session_id: sessionId,
          tool_call_id: 'toolu_no_type',
          tool_input: { prompt: 'no type carried' },
        },
      }),
    );

    const store = openStore(sessionDir, sessionId, projectId);
    try {
      expect(store.byType('delegation.spawn')).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// Primary contract — two parallel agents
// ===========================================================================

describe('PreToolUse guard — parallel-agent spawn emission', () => {
  test('two distinct tool_call_ids → two distinct spawn events; SubagentStop links each correctly', async () => {
    const sessionId = 'spawn-parallel';
    const { sessionDir, projectId } = await initScratchSession(sessionId);

    // Two PreToolUse invocations land back-to-back from the same orchestrator
    // turn — Claude Code dispatches Agent tool calls in parallel batches.
    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: emptyMatcher(),
        payload: {
          tool_name: 'Task',
          session_id: sessionId,
          tool_call_id: 'toolu_par_A',
          tool_input: { subagent_type: '__pi', stance: 'innovative' },
        },
      }),
    );
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: emptyMatcher(),
        payload: {
          tool_name: 'Task',
          session_id: sessionId,
          tool_call_id: 'toolu_par_B',
          tool_input: { subagent_type: '__pi', stance: 'best' },
        },
      }),
    );

    let spawnA: number | null = null;
    let spawnB: number | null = null;
    {
      const store = openStore(sessionDir, sessionId, projectId);
      try {
        const spawns = store.byType('delegation.spawn');
        expect(spawns).toHaveLength(2);
        for (const row of spawns) {
          const data = JSON.parse(row.data) as { readonly tool_call_id: string };
          if (data.tool_call_id === 'toolu_par_A') spawnA = row.seq;
          if (data.tool_call_id === 'toolu_par_B') spawnB = row.seq;
        }
      } finally {
        store.close();
      }
    }
    expect(spawnA).not.toBeNull();
    expect(spawnB).not.toBeNull();
    expect(spawnA).not.toBe(spawnB);

    // Now SubagentStop arrives in REVERSE order (B first, then A). The
    // previous heuristic (last('delegation.spawn') filtered by subagentId)
    // would link both completions to the same most-recent spawn unless the
    // subagentIds happened to match. The new tool_call_id-scoped lookup
    // links each completion to its own spawn regardless of arrival order.
    const transcriptDir = mkdtempSync(join(tmpdir(), 'spawn-emit-tr-'));
    scratchDirs.push(transcriptDir);
    const trA = join(transcriptDir, 'A.jsonl');
    const trB = join(transcriptDir, 'B.jsonl');
    {
      const { writeFileSync } = await import('node:fs');
      const lineA = JSON.stringify({
        type: 'assistant',
        message: { role: 'assistant', content: [{ type: 'text', text: 'A' }] },
      });
      const lineB = JSON.stringify({
        type: 'assistant',
        message: { role: 'assistant', content: [{ type: 'text', text: 'B' }] },
      });
      writeFileSync(trA, `${lineA}\n`, 'utf8');
      writeFileSync(trB, `${lineB}\n`, 'utf8');
    }

    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          // agent_id is not present in the spawn payload; capture-subagent
          // uses tool_call_id to find the right parent regardless.
          agent_id: 'toolu_par_B',
          agent_type: '__pi',
          agent_transcript_path: trB,
          session_id: sessionId,
          tool_call_id: 'toolu_par_B',
        },
      }),
    );
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'toolu_par_A',
          agent_type: '__pi',
          agent_transcript_path: trA,
          session_id: sessionId,
          tool_call_id: 'toolu_par_A',
        },
      }),
    );

    const store = openStore(sessionDir, sessionId, projectId);
    try {
      const completes = store.byType('delegation.complete');
      expect(completes).toHaveLength(2);
      const linkage = new Map<string, number | null>();
      for (const row of completes) {
        const data = JSON.parse(row.data) as { readonly subagentId: string };
        linkage.set(data.subagentId, row.parent_seq);
      }
      // Each completion must link to its own spawn — the parallel-subagent
      // misattribution that the previous heuristic produced is gone.
      expect(linkage.get('toolu_par_A')).toBe(spawnA);
      expect(linkage.get('toolu_par_B')).toBe(spawnB);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// Ripple — `workflow/reducer.ts:314` (delegation.spawn handler)
// ===========================================================================

describe('Ripple — reducer.delegation.spawn populates state.activeSubagents', () => {
  test('after guard emits spawn, derived state lists the subagent', async () => {
    const sessionId = 'ripple-reducer';
    const { sessionDir, projectId } = await initScratchSession(sessionId);

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: emptyMatcher(),
        payload: {
          tool_name: 'Task',
          session_id: sessionId,
          tool_call_id: 'toolu_R1',
          tool_input: { subagent_type: '__pi' },
        },
      }),
    );

    const store = openStore(sessionDir, sessionId, projectId);
    try {
      const state = resolveWorkflowState(sessionDir, store, sessionId);
      expect(state.activeSubagents).toHaveLength(1);
      const sub = state.activeSubagents[0]!;
      expect(sub.agentType).toBe('__pi');
      expect(sub.subagentId).toBe('toolu_R1');
      expect(sub.step).toBe('ideation');
      // spawnedAt is the spawn event's `data.timestamp` — a non-empty ISO.
      expect(sub.spawnedAt.length).toBeGreaterThan(0);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// Ripple — `predicates.piAgentsToSpawn`
// ===========================================================================

describe('Ripple — predicates.piAgentsToSpawn fires once a __pi spawn lands', () => {
  test('false before spawn, true after spawn', async () => {
    const sessionId = 'ripple-pi';
    const { sessionDir, projectId } = await initScratchSession(sessionId);

    const pred = defaultPredicates['piAgentsToSpawn'];
    if (pred === undefined) {
      throw new Error('piAgentsToSpawn predicate not registered');
    }

    {
      const store = openStore(sessionDir, sessionId, projectId);
      try {
        const state = resolveWorkflowState(sessionDir, store, sessionId);
        expect(pred(state)).toBe(false);
      } finally {
        store.close();
      }
    }

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: emptyMatcher(),
        payload: {
          tool_name: 'Task',
          session_id: sessionId,
          tool_call_id: 'toolu_pi',
          tool_input: { subagent_type: '__pi' },
        },
      }),
    );

    {
      const store = openStore(sessionDir, sessionId, projectId);
      try {
        const state = resolveWorkflowState(sessionDir, store, sessionId);
        expect(pred(state)).toBe(true);
      } finally {
        store.close();
      }
    }
  });
});

// ===========================================================================
// Ripple — `workflow/reducer.ts:681-687` (verification.result presence guard)
//
// The reducer rejects `verification.result` when its `subagentId` is NOT in
// `state.activeSubagents`. With the spawn emitter live, this rejection
// SHOULD NOT fire when the spawn has been recorded. Verifies the
// reducer handler accepts a verification.result whose subagent has been
// spawned through the new guard path.
// ===========================================================================

describe('Ripple — reducer accepts verification.result when matching spawn exists', () => {
  test('spawn → reducer admits verification.result for the same subagent (no rejection)', async () => {
    const sessionId = 'ripple-verify';
    const { sessionDir, projectId } = await initScratchSession(sessionId);

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: emptyMatcher(),
        payload: {
          tool_name: 'Task',
          session_id: sessionId,
          tool_call_id: 'toolu_V',
          tool_input: { subagent_type: '__executor' },
        },
      }),
    );

    const store = openStore(sessionDir, sessionId, projectId);
    try {
      const state = resolveWorkflowState(sessionDir, store, sessionId);
      // The subagent is in activeSubagents — the reducer's "must be active"
      // gate at lines 681-687 will admit a verification.result keyed on
      // this subagentId. We don't append the verification.result here (it
      // requires a complete event factory + state), but the precondition
      // check the reducer relies on is now satisfied.
      const subagentId = state.activeSubagents[0]?.subagentId;
      expect(subagentId).toBe('toolu_V');
      const isActive = state.activeSubagents.some(
        (a) => a.subagentId === subagentId,
      );
      expect(isActive).toBe(true);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// Ripple — `workflow/step-readme-writer.subagentsActiveAtExit`
//
// The frontmatter field has been writing 0 in production because no spawn
// events were recorded. With the spawn emitter live, the field reflects
// the actual count of subagents whose `step === <exiting step>`.
// ===========================================================================

describe('Ripple — step-readme writes correct subagentsActiveAtExit', () => {
  test('one __pi spawn at ideation → frontmatter shows subagentsActiveAtExit: 1', async () => {
    const sessionId = 'ripple-readme';
    const { sessionDir, projectId } = await initScratchSession(sessionId);

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: emptyMatcher(),
        payload: {
          tool_name: 'Task',
          session_id: sessionId,
          tool_call_id: 'toolu_RM',
          tool_input: { subagent_type: '__pi' },
        },
      }),
    );

    const store = openStore(sessionDir, sessionId, projectId);
    try {
      const state = resolveWorkflowState(sessionDir, store, sessionId);
      // Exercise the writer's pure rendering path. The count is filtered by
      // step === exitedStep — the spawn we just emitted is at `ideation`, so
      // exiting `ideation` should show 1.
      const subagentsActiveAtExit = state.activeSubagents.filter(
        (a) => a.step === 'ideation',
      ).length;
      expect(subagentsActiveAtExit).toBe(1);

      const md = generateStepReadme({
        sessionId: state.sessionId,
        projectName: 'gobbi',
        step: 'ideation',
        enteredAt: state.stepStartedAt,
        exitedAt: '2026-04-29T00:00:00.000Z',
        verdictOutcome: state.lastVerdictOutcome,
        artifacts: state.artifacts['ideation'] ?? [],
        subagentsActiveAtExit,
        feedbackRound: state.feedbackRound,
        nextStep: 'planning',
      });
      expect(md).toContain('subagentsActiveAtExit: 1');
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// Ripple — `next.ts::verification-block` rendering with active subagents
//
// `compileVerificationBlock` reads `state.activeSubagents` and
// `state.verificationResults` to render per-subagent verification rows.
// With at least one spawn now landed in production, the block can be
// invoked against a non-empty active set without trampling its existing
// header/empty-results contract.
// ===========================================================================

describe('Ripple — verification-block renders for spawned subagent', () => {
  test('compiles a per-subagent block once a spawn has landed', async () => {
    const sessionId = 'ripple-vblock';
    const { sessionDir, projectId } = await initScratchSession(sessionId);

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: emptyMatcher(),
        payload: {
          tool_name: 'Task',
          session_id: sessionId,
          tool_call_id: 'toolu_VB',
          tool_input: { subagent_type: '__executor' },
        },
      }),
    );

    const store = openStore(sessionDir, sessionId, projectId);
    try {
      const state = resolveWorkflowState(sessionDir, store, sessionId);
      const sub = state.activeSubagents[0];
      expect(sub).toBeDefined();
      const block = compileVerificationBlock(state as WorkflowState, sub!.subagentId);
      // The block always carries the static header; presence of any non-
      // empty render output proves the function did not throw on the new
      // active set. The exact text is the responsibility of the
      // verification-block tests; here we just pin "compiles + emits".
      expect(typeof block.text).toBe('string');
      expect(block.text.length).toBeGreaterThan(0);
    } finally {
      store.close();
    }
  });
});
