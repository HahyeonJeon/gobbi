/**
 * Wave C.2 — `evalConfig.execution` optional slot coverage.
 *
 * Locks the additive extension of `EvalConfig` / `EvalDecideData` with the
 * optional `execution?: boolean` field. Covers:
 *
 *   1. Legacy 2-field EVAL_DECIDE (`{ideation, plan}`) — state's `execution`
 *      slot stays absent.
 *   2. New 3-field EVAL_DECIDE (`{ideation, plan, execution}`) — state gains
 *      the execution value.
 *   3. Predicate registrations for `evalExecutionEnabled` /
 *      `evalExecutionDisabled`.
 *   4. Mixed merges — first EVAL_DECIDE sets ideation/plan; second sets
 *      execution; ideation/plan stay locked.
 *   5. `renderSessionSummary` output — includes `execution=<bool>` when set,
 *      omits the segment when absent.
 *
 * See ideation §6.5 (settings-evaluation-mode translation) and the Wave C.2
 * briefing for the scope boundary: `execution_eval` is still unconditionally
 * reached via the graph — the slot is observational today.
 */

import { describe, it, test, expect } from 'bun:test';

import { reduce } from '../reducer.js';
import type { ReducerResult } from '../reducer.js';
import { initialState } from '../state.js';
import type { WorkflowState } from '../state.js';
import { defaultPredicates } from '../predicates.js';
import type { Event } from '../events/index.js';
import { WORKFLOW_EVENTS } from '../events/workflow.js';

import { renderSessionSummary } from '../../specs/assembly.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function baseState(): WorkflowState {
  return { ...initialState('wave-c2-session'), currentStep: 'ideation' };
}

function expectOk(result: ReducerResult): WorkflowState {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error('Expected ok reducer result');
  return result.state;
}

function evalDecide2Field(ideation: boolean, plan: boolean): Event {
  return {
    type: WORKFLOW_EVENTS.EVAL_DECIDE,
    data: { ideation, plan },
  };
}

function evalDecide3Field(
  ideation: boolean,
  plan: boolean,
  execution: boolean,
): Event {
  return {
    type: WORKFLOW_EVENTS.EVAL_DECIDE,
    data: { ideation, plan, execution },
  };
}

// ---------------------------------------------------------------------------
// Reducer — EVAL_DECIDE legacy vs. new shape
// ---------------------------------------------------------------------------

describe('EVAL_DECIDE — legacy 2-field payload', () => {
  it('leaves the execution slot absent on state.evalConfig', () => {
    const next = expectOk(reduce(baseState(), evalDecide2Field(true, false)));
    expect(next.evalConfig).toEqual({ ideation: true, planning: false });
    // `exactOptionalPropertyTypes` — absent means the key is not on the
    // record. `in` checks the presence of the key directly.
    expect(next.evalConfig !== null && 'execution' in next.evalConfig).toBe(false);
  });
});

describe('EVAL_DECIDE — new 3-field payload', () => {
  it('writes the execution boolean into state.evalConfig.execution', () => {
    const next = expectOk(
      reduce(baseState(), evalDecide3Field(false, false, true)),
    );
    expect(next.evalConfig).toEqual({
      ideation: false,
      planning: false,
      execution: true,
    });
  });

  it('preserves the `false` execution value verbatim', () => {
    const next = expectOk(
      reduce(baseState(), evalDecide3Field(true, true, false)),
    );
    expect(next.evalConfig?.execution).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Reducer — mixed merges
// ---------------------------------------------------------------------------

describe('EVAL_DECIDE — mixed merge sequences', () => {
  it('first 2-field + second 3-field: merges execution, preserves ideation/plan', () => {
    const afterFirst = expectOk(
      reduce(baseState(), evalDecide2Field(true, false)),
    );
    // Second call carries execution=true; ideation/plan in the payload are
    // legally required by the type but SHOULD be ignored because evalConfig
    // is already set (write-once semantics for those two fields).
    const afterSecond = expectOk(
      reduce(afterFirst, evalDecide3Field(false, true, true)),
    );
    expect(afterSecond.evalConfig).toEqual({
      ideation: true, // unchanged from first call
      planning: false, // unchanged from first call
      execution: true, // merged from second call
    });
  });

  it('first 3-field + second 2-field: execution stays, ideation/plan locked', () => {
    const afterFirst = expectOk(
      reduce(baseState(), evalDecide3Field(true, false, false)),
    );
    const afterSecond = expectOk(
      reduce(afterFirst, evalDecide2Field(false, true)),
    );
    expect(afterSecond.evalConfig).toEqual({
      ideation: true,
      planning: false,
      execution: false,
    });
  });

  it('second 3-field when execution already set is a no-op on the slot', () => {
    const afterFirst = expectOk(
      reduce(baseState(), evalDecide3Field(true, false, false)),
    );
    const afterSecond = expectOk(
      reduce(afterFirst, evalDecide3Field(false, true, true)),
    );
    // Slot write-once: execution stays at false from the first call.
    expect(afterSecond.evalConfig?.execution).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Predicates — evalExecutionEnabled / evalExecutionDisabled
// ---------------------------------------------------------------------------

describe('evalExecutionEnabled / evalExecutionDisabled predicates', () => {
  const enabled = defaultPredicates['evalExecutionEnabled'];
  const disabled = defaultPredicates['evalExecutionDisabled'];
  if (enabled === undefined) {
    throw new Error('evalExecutionEnabled predicate not registered');
  }
  if (disabled === undefined) {
    throw new Error('evalExecutionDisabled predicate not registered');
  }

  test('both predicates are functions', () => {
    expect(typeof enabled).toBe('function');
    expect(typeof disabled).toBe('function');
  });

  test('enabled=false / disabled=true when evalConfig is null', () => {
    const s: WorkflowState = { ...baseState(), evalConfig: null };
    expect(enabled(s)).toBe(false);
    expect(disabled(s)).toBe(true);
  });

  test('enabled=false / disabled=true when execution slot absent', () => {
    const s: WorkflowState = {
      ...baseState(),
      evalConfig: { ideation: true, planning: true },
    };
    expect(enabled(s)).toBe(false);
    expect(disabled(s)).toBe(true);
  });

  test('enabled=false / disabled=true when execution=false', () => {
    const s: WorkflowState = {
      ...baseState(),
      evalConfig: { ideation: false, planning: false, execution: false },
    };
    expect(enabled(s)).toBe(false);
    expect(disabled(s)).toBe(true);
  });

  test('enabled=true / disabled=false when execution=true', () => {
    const s: WorkflowState = {
      ...baseState(),
      evalConfig: { ideation: false, planning: false, execution: true },
    };
    expect(enabled(s)).toBe(true);
    expect(disabled(s)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// renderSessionSummary — execution rendering
// ---------------------------------------------------------------------------

describe('renderSessionSummary — evalConfig.execution rendering', () => {
  test('omits the execution segment when the slot is absent', () => {
    const s: WorkflowState = {
      ...baseState(),
      evalConfig: { ideation: true, planning: false },
    };
    const out = renderSessionSummary(s);
    expect(out).toContain('session.evalConfig=ideation=true,planning=false');
    expect(out).not.toContain('execution=');
  });

  test('appends execution=true when set', () => {
    const s: WorkflowState = {
      ...baseState(),
      evalConfig: { ideation: true, planning: false, execution: true },
    };
    const out = renderSessionSummary(s);
    expect(out).toContain(
      'session.evalConfig=ideation=true,planning=false,execution=true',
    );
  });

  test('appends execution=false when explicitly disabled', () => {
    const s: WorkflowState = {
      ...baseState(),
      evalConfig: { ideation: false, planning: false, execution: false },
    };
    const out = renderSessionSummary(s);
    expect(out).toContain(
      'session.evalConfig=ideation=false,planning=false,execution=false',
    );
  });

  test('renders null evalConfig unchanged', () => {
    const s: WorkflowState = { ...baseState(), evalConfig: null };
    expect(renderSessionSummary(s)).toContain('session.evalConfig=null');
  });
});
