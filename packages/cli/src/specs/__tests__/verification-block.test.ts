/**
 * Snapshot + cache-stability tests for `compileVerificationBlock`.
 *
 * Covers the five plan §E.8 test matrix rows plus a dedicated cache-prefix
 * stability assertion:
 *
 *   1. No verification entries for the subagent → "no verification results"
 *      empty-state render.
 *   2. All-pass → compact success table.
 *   3. Mixed pass/fail → detailed failure-details block spliced after the
 *      pass table.
 *   4. Timeout → "timed out after Xms" marker on the timed-out row.
 *   5. Gate-vs-inform policy differentiation → each row shows `[gate]` or
 *      `[inform]` adjacent to the command kind.
 *   6. Cache-prefix stability → two invocations with different results for
 *      the same state produce a byte-identical `staticPrefixHash`.
 *
 * Fixtures are deterministic (fixed ISO timestamps, canned digests) so the
 * snapshot output is byte-stable across runs. The verification-block
 * compiler does not read from the event store, so the tests pass raw
 * `WorkflowState` fixtures directly — no `EventStore` needed.
 */

import { describe, test, expect } from 'bun:test';

import { initialState } from '../../workflow/state.js';
import type { WorkflowState } from '../../workflow/state.js';
import type {
  VerificationCommandKind,
  VerificationPolicy,
  VerificationResultData,
} from '../../workflow/events/verification.js';

import { compileVerificationBlock } from '../verification-block.js';

// ---------------------------------------------------------------------------
// Fixture factory — builds a `VerificationResultData` with sensible defaults
// so the per-test overrides stay concise.
// ---------------------------------------------------------------------------

function resultFixture(
  overrides: Partial<VerificationResultData> & {
    readonly subagentId: string;
    readonly commandKind: VerificationCommandKind;
  },
): VerificationResultData {
  return {
    command: `run-${overrides.commandKind}`,
    exitCode: 0,
    durationMs: 1000,
    policy: 'inform',
    timedOut: false,
    stdoutDigest:
      '7c8e40000000000000000000000000000000000000000000000000000000abcd',
    stderrDigest:
      '3f2a1b000000000000000000000000000000000000000000000000000000dcba',
    timestamp: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

/**
 * Seed a `WorkflowState` whose `verificationResults` map carries one entry
 * per supplied fixture, keyed by `${subagentId}:${commandKind}`. Other
 * state fields use `initialState` defaults.
 */
function stateWithResults(
  sessionId: string,
  entries: readonly VerificationResultData[],
): WorkflowState {
  const verificationResults: Record<string, VerificationResultData> = {};
  for (const e of entries) {
    verificationResults[`${e.subagentId}:${e.commandKind}`] = e;
  }
  return {
    ...initialState(sessionId),
    verificationResults,
  };
}

// ---------------------------------------------------------------------------
// 1. Empty — no entries for the subagent
// ---------------------------------------------------------------------------

describe('compileVerificationBlock — empty', () => {
  test('no verification entries renders an explicit "no verification results" section', () => {
    const state = stateWithResults('vb-empty', []);
    const prompt = compileVerificationBlock(state, 'sub-missing');
    expect(prompt.text).toMatchSnapshot();
    expect(
      prompt.sections.map((s) => ({ id: s.id, kind: s.kind })),
    ).toMatchSnapshot();
  });
});

// ---------------------------------------------------------------------------
// 2. All-pass — compact success table
// ---------------------------------------------------------------------------

describe('compileVerificationBlock — all pass', () => {
  test('every command passing renders a compact success table', () => {
    const state = stateWithResults('vb-all-pass', [
      resultFixture({
        subagentId: 'sub-1',
        commandKind: 'lint',
        policy: 'inform',
        durationMs: 2413,
      }),
      resultFixture({
        subagentId: 'sub-1',
        commandKind: 'typecheck',
        policy: 'gate',
        durationMs: 18902,
      }),
      resultFixture({
        subagentId: 'sub-1',
        commandKind: 'test',
        policy: 'gate',
        durationMs: 45230,
      }),
    ]);
    const prompt = compileVerificationBlock(state, 'sub-1');
    expect(prompt.text).toMatchSnapshot();
  });
});

// ---------------------------------------------------------------------------
// 3. Mixed pass/fail — failure-details block present
// ---------------------------------------------------------------------------

describe('compileVerificationBlock — mixed pass/fail', () => {
  test('mixed outcomes render a failure-details block after the pass table', () => {
    const state = stateWithResults('vb-mixed', [
      resultFixture({
        subagentId: 'sub-2',
        commandKind: 'lint',
        policy: 'inform',
        durationMs: 2413,
      }),
      resultFixture({
        subagentId: 'sub-2',
        commandKind: 'typecheck',
        policy: 'gate',
        durationMs: 18902,
      }),
      resultFixture({
        subagentId: 'sub-2',
        commandKind: 'test',
        policy: 'gate',
        exitCode: 1,
        durationMs: 45230,
      }),
    ]);
    const prompt = compileVerificationBlock(state, 'sub-2');
    expect(prompt.text).toMatchSnapshot();
    // Confirm the failure-details block was appended (dynamic section #2).
    const dynamicSections = prompt.sections.filter((s) => s.kind === 'dynamic');
    expect(dynamicSections.length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// 4. Timeout — "timed out after Xms" marker
// ---------------------------------------------------------------------------

describe('compileVerificationBlock — timeout', () => {
  test('timed-out command renders the "timed out after Xms" marker', () => {
    const state = stateWithResults('vb-timeout', [
      resultFixture({
        subagentId: 'sub-3',
        commandKind: 'lint',
        policy: 'inform',
        durationMs: 2413,
      }),
      resultFixture({
        subagentId: 'sub-3',
        commandKind: 'build',
        policy: 'gate',
        exitCode: -1,
        timedOut: true,
        durationMs: 60000,
      }),
    ]);
    const prompt = compileVerificationBlock(state, 'sub-3');
    expect(prompt.text).toMatchSnapshot();
  });
});

// ---------------------------------------------------------------------------
// 5. Gate-vs-inform differentiation
// ---------------------------------------------------------------------------

describe('compileVerificationBlock — gate vs inform', () => {
  test('policy tag visibly distinguishes gate from inform rows', () => {
    const state = stateWithResults('vb-policy', [
      resultFixture({
        subagentId: 'sub-4',
        commandKind: 'lint',
        policy: 'inform',
        durationMs: 1000,
      }),
      resultFixture({
        subagentId: 'sub-4',
        commandKind: 'typecheck',
        policy: 'gate',
        durationMs: 2000,
      }),
      resultFixture({
        subagentId: 'sub-4',
        commandKind: 'test',
        policy: 'inform',
        durationMs: 3000,
      }),
      resultFixture({
        subagentId: 'sub-4',
        commandKind: 'build',
        policy: 'gate',
        durationMs: 4000,
      }),
    ]);
    const prompt = compileVerificationBlock(state, 'sub-4');
    expect(prompt.text).toContain('[gate]');
    expect(prompt.text).toContain('[inform]');
    expect(prompt.text).toMatchSnapshot();
  });
});

// ---------------------------------------------------------------------------
// 6. Cache-prefix stability — staticPrefixHash identical across different
//    dynamic payloads for the same subagent.
// ---------------------------------------------------------------------------

describe('compileVerificationBlock — cache-prefix stability', () => {
  test('staticPrefixHash is byte-stable across different result payloads', () => {
    const policies: readonly VerificationPolicy[] = ['inform', 'gate'];
    const sessionA: WorkflowState = stateWithResults('vb-cache-a', [
      resultFixture({
        subagentId: 'sub-5',
        commandKind: 'lint',
        policy: policies[0]!,
        durationMs: 100,
      }),
    ]);
    const sessionB: WorkflowState = stateWithResults('vb-cache-b', [
      resultFixture({
        subagentId: 'sub-5',
        commandKind: 'lint',
        policy: policies[1]!,
        durationMs: 200,
      }),
      resultFixture({
        subagentId: 'sub-5',
        commandKind: 'test',
        policy: policies[1]!,
        exitCode: 1,
        durationMs: 500,
      }),
    ]);
    const promptA = compileVerificationBlock(sessionA, 'sub-5');
    const promptB = compileVerificationBlock(sessionB, 'sub-5');
    expect(promptA.staticPrefixHash).toBe(promptB.staticPrefixHash);
    expect(promptA.contentHash).not.toBe(promptB.contentHash);
  });
});
