/**
 * Test infrastructure — seed events, event sequence builders, and
 * representative state snapshots for property-based and unit tests.
 *
 * Provides helpers to construct valid event sequences that reach
 * specific workflow steps, and to apply event sequences through
 * the reducer to produce final states.
 */

import { initialState } from '../state.js';
import type { WorkflowState } from '../state.js';
import { reduce } from '../reducer.js';
import type { Event } from '../events/index.js';
import { WORKFLOW_EVENTS } from '../events/workflow.js';
import { DELEGATION_EVENTS } from '../events/delegation.js';
import { ARTIFACT_EVENTS } from '../events/artifact.js';
import { DECISION_EVENTS } from '../events/decision.js';
import { GUARD_EVENTS } from '../events/guard.js';
import { SESSION_EVENTS } from '../events/session.js';

// ---------------------------------------------------------------------------
// Seed event factories — minimal typed events for building sequences
// ---------------------------------------------------------------------------

export function createStartEvent(sessionId: string): Event {
  return {
    type: WORKFLOW_EVENTS.START,
    data: { sessionId, timestamp: new Date().toISOString() },
  };
}

export function createEvalDecideEvent(
  ideation: boolean,
  plan: boolean,
): Event {
  return {
    type: WORKFLOW_EVENTS.EVAL_DECIDE,
    data: { ideation, plan },
  };
}

export function createStepExitEvent(step: string): Event {
  return { type: WORKFLOW_EVENTS.STEP_EXIT, data: { step } };
}

export function createStepSkipEvent(step: string): Event {
  return { type: WORKFLOW_EVENTS.STEP_SKIP, data: { step } };
}

export function createStepTimeoutEvent(step: string): Event {
  return {
    type: WORKFLOW_EVENTS.STEP_TIMEOUT,
    data: { step, elapsedMs: 999999, configuredTimeoutMs: 600000 },
  };
}

export function createFinishEvent(): Event {
  return { type: WORKFLOW_EVENTS.FINISH, data: {} };
}

export function createAbortEvent(reason?: string): Event {
  return {
    type: WORKFLOW_EVENTS.ABORT,
    data: reason !== undefined ? { reason } : {},
  };
}

export function createResumeEvent(targetStep: string): Event {
  return {
    type: WORKFLOW_EVENTS.RESUME,
    data: { targetStep, fromError: true },
  };
}

export function createDelegationSpawnEvent(
  subagentId: string,
  agentType: string = 'executor',
  step: string = 'execution',
  timestamp: string = '2026-01-01T00:00:00.000Z',
): Event {
  return {
    type: DELEGATION_EVENTS.SPAWN,
    data: { subagentId, agentType, step, timestamp },
  };
}

export function createDelegationCompleteEvent(subagentId: string): Event {
  return {
    type: DELEGATION_EVENTS.COMPLETE,
    data: { subagentId },
  };
}

export function createDelegationFailEvent(
  subagentId: string,
  reason: string = 'timeout',
): Event {
  return {
    type: DELEGATION_EVENTS.FAIL,
    data: { subagentId, reason },
  };
}

export function createArtifactWriteEvent(
  step: string,
  filename: string,
): Event {
  return {
    type: ARTIFACT_EVENTS.WRITE,
    data: { step, filename, artifactType: 'note' },
  };
}

export function createArtifactOverwriteEvent(
  step: string,
  filename: string,
  previousFilename?: string,
): Event {
  return {
    type: ARTIFACT_EVENTS.OVERWRITE,
    data:
      previousFilename !== undefined
        ? { step, filename, previousFilename }
        : { step, filename },
  };
}

export function createVerdictPassEvent(): Event {
  return {
    type: DECISION_EVENTS.EVAL_VERDICT,
    data: { verdict: 'pass' },
  };
}

export function createVerdictReviseEvent(loopTarget?: string): Event {
  return {
    type: DECISION_EVENTS.EVAL_VERDICT,
    data:
      loopTarget !== undefined
        ? { verdict: 'revise', loopTarget }
        : { verdict: 'revise' },
  };
}

export function createDecisionUserEvent(): Event {
  return {
    type: DECISION_EVENTS.USER,
    data: { decision: 'approve' },
  };
}

export function createEvalSkipEvent(step: string): Event {
  return {
    type: DECISION_EVENTS.EVAL_SKIP,
    data: { step },
  };
}

export function createGuardViolationEvent(
  guardId: string = 'g-1',
  step: string = 'execution',
  timestamp: string = '2026-01-01T00:00:00.000Z',
): Event {
  return {
    type: GUARD_EVENTS.VIOLATION,
    data: { guardId, toolName: 'Write', reason: 'Scope violation', step, timestamp },
  };
}

export function createGuardOverrideEvent(): Event {
  return {
    type: GUARD_EVENTS.OVERRIDE,
    data: { guardId: 'g-1', toolName: 'Write', reason: 'User approved' },
  };
}

export function createHeartbeatEvent(): Event {
  return {
    type: SESSION_EVENTS.HEARTBEAT,
    data: { timestamp: new Date().toISOString() },
  };
}

// ---------------------------------------------------------------------------
// Event sequence builders — produce minimal valid sequences to reach steps
// ---------------------------------------------------------------------------

/**
 * Returns a minimal valid sequence of events that transitions from idle
 * to the given workflow step. The sequence uses eval disabled (shortest path).
 *
 * Supported steps: idle, ideation, planning, execution, execution_eval,
 * memorization, handoff, done, error, ideation_eval, planning_eval.
 *
 * Returns an empty array for 'idle' (already there).
 *
 * Wave A.1.5 split memorization → handoff → done. To reach `done` the
 * sequence now performs `workflow.step.exit` on memorization (advances to
 * handoff) and then `workflow.finish` on handoff (advances to done).
 */
export function eventsToReach(
  step: string,
  sessionId: string = 'test-session',
): Event[] {
  const start = createStartEvent(sessionId);
  const evalOff = createEvalDecideEvent(false, false);
  const evalIdeationOn = createEvalDecideEvent(true, false);
  const evalPlanOn = createEvalDecideEvent(false, true);

  switch (step) {
    case 'idle':
      return [];

    case 'ideation':
      return [start];

    case 'ideation_eval':
      return [start, evalIdeationOn, createStepExitEvent('ideation')];

    case 'planning':
      return [start, evalOff, createStepExitEvent('ideation')];

    case 'planning_eval':
      return [start, evalPlanOn, createStepExitEvent('ideation'), createStepExitEvent('planning')];

    case 'execution':
      return [
        start,
        evalOff,
        createStepExitEvent('ideation'),
        createStepExitEvent('planning'),
      ];

    case 'execution_eval':
      return [
        start,
        evalOff,
        createStepExitEvent('ideation'),
        createStepExitEvent('planning'),
        createStepExitEvent('execution'),
      ];

    case 'memorization':
      return [
        start,
        evalOff,
        createStepExitEvent('ideation'),
        createStepExitEvent('planning'),
        createStepExitEvent('execution'),
        createVerdictPassEvent(),
      ];

    case 'handoff':
      return [
        start,
        evalOff,
        createStepExitEvent('ideation'),
        createStepExitEvent('planning'),
        createStepExitEvent('execution'),
        createVerdictPassEvent(),
        createStepExitEvent('memorization'),
      ];

    case 'done':
      return [
        start,
        evalOff,
        createStepExitEvent('ideation'),
        createStepExitEvent('planning'),
        createStepExitEvent('execution'),
        createVerdictPassEvent(),
        createStepExitEvent('memorization'),
        createFinishEvent(),
      ];

    case 'error':
      return [
        start,
        createStepTimeoutEvent('ideation'),
      ];

    default:
      throw new Error(`eventsToReach: unsupported step "${step}"`);
  }
}

// ---------------------------------------------------------------------------
// Apply helpers
// ---------------------------------------------------------------------------

/**
 * Apply a sequence of events through the reducer, starting from initial state.
 * Events that are rejected by the reducer (ok: false) are skipped.
 * Returns the final state.
 */
export function applyEvents(
  events: readonly Event[],
  sessionId: string = 'test-session',
): WorkflowState {
  let state = initialState(sessionId);
  for (const event of events) {
    const result = reduce(state, event);
    if (result.ok) {
      state = result.state;
    }
  }
  return state;
}

// ---------------------------------------------------------------------------
// Representative state snapshots
// ---------------------------------------------------------------------------

/**
 * Pre-built state snapshots at each workflow step, useful as starting
 * points in other tests. Built by replaying minimal event sequences.
 */
export const STATES = {
  idle: initialState('test'),
  ideation: applyEvents(eventsToReach('ideation'), 'test'),
  ideation_eval: applyEvents(eventsToReach('ideation_eval'), 'test'),
  planning: applyEvents(eventsToReach('planning'), 'test'),
  planning_eval: applyEvents(eventsToReach('planning_eval'), 'test'),
  execution: applyEvents(eventsToReach('execution'), 'test'),
  execution_eval: applyEvents(eventsToReach('execution_eval'), 'test'),
  memorization: applyEvents(eventsToReach('memorization'), 'test'),
  handoff: applyEvents(eventsToReach('handoff'), 'test'),
  done: applyEvents(eventsToReach('done'), 'test'),
  error: applyEvents(eventsToReach('error'), 'test'),
} as const;
