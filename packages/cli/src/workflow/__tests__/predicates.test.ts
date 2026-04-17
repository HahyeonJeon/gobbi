/**
 * Unit tests for `workflow/predicates.ts`'s `defaultPredicates` registry.
 *
 * These tests lock the registered predicate NAMES and their runtime semantics
 * against `WorkflowState` field reads. Snapshot tests in
 * `specs/ideation/__tests__/snapshot.test.ts` exercise the end-to-end compile
 * pipeline with the same registry; this file is the direct unit cover.
 *
 * Post-C2: the three Ideation-step predicates — `feedbackRoundActive`,
 * `ideationSynthesized`, `piAgentsToSpawn` — MUST be present in the
 * registry. An absent predicate causes every conditional block in
 * `ideation/spec.json` to silently drop its content at compile time (by
 * `assembly.ts`'s `if (pred === undefined) continue;` policy). These tests
 * fail fast if anyone removes one of the registered names.
 */

import { describe, test, expect } from 'bun:test';

import { defaultPredicates } from '../predicates.js';
import { initialState } from '../state.js';
import type { WorkflowState } from '../state.js';

function baseState(): WorkflowState {
  return initialState('test-session-predicates');
}

// ---------------------------------------------------------------------------
// Registry presence — the names referenced in spec.json files must exist
// ---------------------------------------------------------------------------

describe('defaultPredicates — registered predicate names', () => {
  test('includes every predicate referenced by ideation/spec.json', () => {
    // The three Ideation conditional-block predicates. If any of these is
    // absent, ideation/spec.json's conditional blocks silently render empty.
    expect(defaultPredicates['feedbackRoundActive']).toBeDefined();
    expect(defaultPredicates['ideationSynthesized']).toBeDefined();
    expect(defaultPredicates['piAgentsToSpawn']).toBeDefined();
  });

  test('includes every predicate referenced by ideation step transitions', () => {
    expect(defaultPredicates['evalIdeationEnabled']).toBeDefined();
    expect(defaultPredicates['evalIdeationDisabled']).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// feedbackRoundActive — state.feedbackRound > 0
// ---------------------------------------------------------------------------

describe('feedbackRoundActive', () => {
  const pred = defaultPredicates['feedbackRoundActive'];
  if (pred === undefined) throw new Error('feedbackRoundActive not registered');

  test('false on a fresh session (feedbackRound === 0)', () => {
    expect(pred(baseState())).toBe(false);
  });

  test('true when feedbackRound has advanced', () => {
    const state: WorkflowState = { ...baseState(), feedbackRound: 1 };
    expect(pred(state)).toBe(true);
  });

  test('true when feedbackRound has advanced multiple rounds', () => {
    const state: WorkflowState = { ...baseState(), feedbackRound: 3 };
    expect(pred(state)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// ideationSynthesized — ideation.md present under the `ideation` step
// ---------------------------------------------------------------------------

describe('ideationSynthesized', () => {
  const pred = defaultPredicates['ideationSynthesized'];
  if (pred === undefined) throw new Error('ideationSynthesized not registered');

  test('false when no ideation artifacts have been written', () => {
    expect(pred(baseState())).toBe(false);
  });

  test('false when only PI-agent artifacts have been written', () => {
    const state: WorkflowState = {
      ...baseState(),
      artifacts: { ideation: ['innovative.md', 'best.md'] },
    };
    expect(pred(state)).toBe(false);
  });

  test('true when ideation.md has been written', () => {
    const state: WorkflowState = {
      ...baseState(),
      artifacts: {
        ideation: ['innovative.md', 'best.md', 'ideation.md'],
      },
    };
    expect(pred(state)).toBe(true);
  });

  test('ignores artifacts under non-ideation step keys', () => {
    const state: WorkflowState = {
      ...baseState(),
      artifacts: { plan: ['ideation.md'] },
    };
    expect(pred(state)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// piAgentsToSpawn — at least one `__pi` active-subagent entry
// ---------------------------------------------------------------------------

describe('piAgentsToSpawn', () => {
  const pred = defaultPredicates['piAgentsToSpawn'];
  if (pred === undefined) throw new Error('piAgentsToSpawn not registered');

  test('false when no subagents are active', () => {
    expect(pred(baseState())).toBe(false);
  });

  test('false when active subagents are of other types', () => {
    const state: WorkflowState = {
      ...baseState(),
      activeSubagents: [
        {
          subagentId: 'researcher-1',
          agentType: '__researcher',
          step: 'research',
          spawnedAt: '2026-04-16T12:00:00.000Z',
        },
      ],
    };
    expect(pred(state)).toBe(false);
  });

  test('true when at least one __pi agent is active', () => {
    const state: WorkflowState = {
      ...baseState(),
      activeSubagents: [
        {
          subagentId: 'pi-innovative-1',
          agentType: '__pi',
          step: 'ideation',
          spawnedAt: '2026-04-16T12:00:00.000Z',
        },
      ],
    };
    expect(pred(state)).toBe(true);
  });

  test('true when multiple __pi agents are active', () => {
    const state: WorkflowState = {
      ...baseState(),
      activeSubagents: [
        {
          subagentId: 'pi-innovative-1',
          agentType: '__pi',
          step: 'ideation',
          spawnedAt: '2026-04-16T12:00:00.000Z',
        },
        {
          subagentId: 'pi-best-1',
          agentType: '__pi',
          step: 'ideation',
          spawnedAt: '2026-04-16T12:00:00.000Z',
        },
      ],
    };
    expect(pred(state)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// verdictPass / verdictRevise — read state.lastVerdictOutcome (C.3-c)
// ---------------------------------------------------------------------------

describe('verdictPass', () => {
  const pred = defaultPredicates['verdictPass'];
  if (pred === undefined) throw new Error('verdictPass not registered');

  test('true when lastVerdictOutcome is "pass"', () => {
    const state: WorkflowState = { ...baseState(), lastVerdictOutcome: 'pass' };
    expect(pred(state)).toBe(true);
  });

  test('false when lastVerdictOutcome is "revise"', () => {
    const state: WorkflowState = { ...baseState(), lastVerdictOutcome: 'revise' };
    expect(pred(state)).toBe(false);
  });

  test('false when lastVerdictOutcome is null (no verdict recorded yet)', () => {
    const state: WorkflowState = { ...baseState(), lastVerdictOutcome: null };
    expect(pred(state)).toBe(false);
  });

  test('false on a fresh session (initialState)', () => {
    expect(pred(baseState())).toBe(false);
  });
});

describe('verdictRevise', () => {
  const pred = defaultPredicates['verdictRevise'];
  if (pred === undefined) throw new Error('verdictRevise not registered');

  test('true when lastVerdictOutcome is "revise"', () => {
    const state: WorkflowState = { ...baseState(), lastVerdictOutcome: 'revise' };
    expect(pred(state)).toBe(true);
  });

  test('false when lastVerdictOutcome is "pass"', () => {
    const state: WorkflowState = { ...baseState(), lastVerdictOutcome: 'pass' };
    expect(pred(state)).toBe(false);
  });

  test('false when lastVerdictOutcome is null', () => {
    const state: WorkflowState = { ...baseState(), lastVerdictOutcome: null };
    expect(pred(state)).toBe(false);
  });

  test('ignores feedbackRound — the old heuristic is gone', () => {
    // Prior behaviour returned true for feedbackRound > 0. The C.3-c rewrite
    // drops that coupling: only lastVerdictOutcome drives the result.
    const state: WorkflowState = {
      ...baseState(),
      feedbackRound: 2,
      lastVerdictOutcome: null,
    };
    expect(pred(state)).toBe(false);
  });
});
