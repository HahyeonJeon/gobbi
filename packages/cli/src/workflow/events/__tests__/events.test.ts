import { describe, it, expect } from 'bun:test';

import {
  // Workflow
  WORKFLOW_EVENTS,
  isWorkflowEvent,
  createWorkflowStart,
  createStepExit,
  createStepSkip,
  createStepTimeout,
  createEvalDecide,
  createFinish,
  createAbort,
  createResume,

  // Delegation
  DELEGATION_EVENTS,
  isDelegationEvent,
  createDelegationSpawn,
  createDelegationComplete,
  createDelegationFail,

  // Artifact
  ARTIFACT_EVENTS,
  isArtifactEvent,
  createArtifactWrite,
  createArtifactOverwrite,

  // Decision
  DECISION_EVENTS,
  isDecisionEvent,
  createDecisionUser,
  createEvalVerdict,
  createEvalSkip,

  // Guard
  GUARD_EVENTS,
  isGuardEvent,
  createGuardViolation,
  createGuardOverride,

  // Session
  SESSION_EVENTS,
  isSessionEvent,
  createSessionHeartbeat,

  // Top-level
  ALL_EVENT_TYPES,
  isValidEventType,
} from '../index.js';

import type { Event, EventType } from '../index.js';

// ===========================================================================
// Const object completeness
// ===========================================================================

describe('const objects', () => {
  it('WORKFLOW_EVENTS has 8 entries', () => {
    expect(Object.values(WORKFLOW_EVENTS)).toHaveLength(8);
  });

  it('DELEGATION_EVENTS has 3 entries', () => {
    expect(Object.values(DELEGATION_EVENTS)).toHaveLength(3);
  });

  it('ARTIFACT_EVENTS has 2 entries', () => {
    expect(Object.values(ARTIFACT_EVENTS)).toHaveLength(2);
  });

  it('DECISION_EVENTS has 3 entries', () => {
    expect(Object.values(DECISION_EVENTS)).toHaveLength(3);
  });

  it('GUARD_EVENTS has 3 entries', () => {
    expect(Object.values(GUARD_EVENTS)).toHaveLength(3);
  });

  it('SESSION_EVENTS has 1 entry', () => {
    expect(Object.values(SESSION_EVENTS)).toHaveLength(1);
  });
});

// ===========================================================================
// ALL_EVENT_TYPES
// ===========================================================================

describe('ALL_EVENT_TYPES', () => {
  it('contains exactly 20 entries (8 + 3 + 2 + 3 + 3 + 1)', () => {
    expect(ALL_EVENT_TYPES.size).toBe(20);
  });

  it('contains every workflow event type', () => {
    for (const value of Object.values(WORKFLOW_EVENTS)) {
      expect(ALL_EVENT_TYPES.has(value)).toBe(true);
    }
  });

  it('contains every delegation event type', () => {
    for (const value of Object.values(DELEGATION_EVENTS)) {
      expect(ALL_EVENT_TYPES.has(value)).toBe(true);
    }
  });

  it('contains every artifact event type', () => {
    for (const value of Object.values(ARTIFACT_EVENTS)) {
      expect(ALL_EVENT_TYPES.has(value)).toBe(true);
    }
  });

  it('contains every decision event type', () => {
    for (const value of Object.values(DECISION_EVENTS)) {
      expect(ALL_EVENT_TYPES.has(value)).toBe(true);
    }
  });

  it('contains every guard event type', () => {
    for (const value of Object.values(GUARD_EVENTS)) {
      expect(ALL_EVENT_TYPES.has(value)).toBe(true);
    }
  });

  it('contains every session event type', () => {
    for (const value of Object.values(SESSION_EVENTS)) {
      expect(ALL_EVENT_TYPES.has(value)).toBe(true);
    }
  });

  it('does not contain unknown event types', () => {
    expect(ALL_EVENT_TYPES.has('unknown.event')).toBe(false);
    expect(ALL_EVENT_TYPES.has('START')).toBe(false); // key, not value
  });
});

// ===========================================================================
// Cross-category exclusivity
// ===========================================================================

describe('cross-category exclusivity', () => {
  const categoryValues = [
    Object.values(WORKFLOW_EVENTS),
    Object.values(DELEGATION_EVENTS),
    Object.values(ARTIFACT_EVENTS),
    Object.values(DECISION_EVENTS),
    Object.values(GUARD_EVENTS),
    Object.values(SESSION_EVENTS),
  ];

  it('no event type string appears in more than one category', () => {
    const seen = new Map<string, number>();
    for (let i = 0; i < categoryValues.length; i++) {
      for (const value of categoryValues[i]!) {
        if (seen.has(value)) {
          throw new Error(
            `Event type "${value}" appears in category ${seen.get(value)} and category ${i}`,
          );
        }
        seen.set(value, i);
      }
    }
    // If we get here, no duplicates were found
    expect(seen.size).toBe(ALL_EVENT_TYPES.size);
  });

  it('every event type string starts with its category prefix', () => {
    const prefixMap: Array<[readonly string[], string]> = [
      [Object.values(WORKFLOW_EVENTS), 'workflow.'],
      [Object.values(DELEGATION_EVENTS), 'delegation.'],
      [Object.values(ARTIFACT_EVENTS), 'artifact.'],
      [Object.values(DECISION_EVENTS), 'decision.'],
      [Object.values(GUARD_EVENTS), 'guard.'],
      [Object.values(SESSION_EVENTS), 'session.'],
    ];

    for (const [values, prefix] of prefixMap) {
      for (const value of values) {
        expect(value.startsWith(prefix)).toBe(true);
      }
    }
  });
});

// ===========================================================================
// Type guards — each guard returns true for its category, false for others
// ===========================================================================

describe('type guards', () => {
  // Representative events from each category
  const workflowEvent = { type: 'workflow.start' };
  const delegationEvent = { type: 'delegation.spawn' };
  const artifactEvent = { type: 'artifact.write' };
  const decisionEvent = { type: 'decision.user' };
  const guardEvent = { type: 'guard.violation' };
  const sessionEvent = { type: 'session.heartbeat' };
  const unknownEvent = { type: 'unknown.event' };

  describe('isWorkflowEvent', () => {
    it('returns true for all workflow event types', () => {
      for (const value of Object.values(WORKFLOW_EVENTS)) {
        expect(isWorkflowEvent({ type: value })).toBe(true);
      }
    });

    it('returns false for non-workflow events', () => {
      expect(isWorkflowEvent(delegationEvent)).toBe(false);
      expect(isWorkflowEvent(artifactEvent)).toBe(false);
      expect(isWorkflowEvent(decisionEvent)).toBe(false);
      expect(isWorkflowEvent(guardEvent)).toBe(false);
      expect(isWorkflowEvent(sessionEvent)).toBe(false);
      expect(isWorkflowEvent(unknownEvent)).toBe(false);
    });
  });

  describe('isDelegationEvent', () => {
    it('returns true for all delegation event types', () => {
      for (const value of Object.values(DELEGATION_EVENTS)) {
        expect(isDelegationEvent({ type: value })).toBe(true);
      }
    });

    it('returns false for non-delegation events', () => {
      expect(isDelegationEvent(workflowEvent)).toBe(false);
      expect(isDelegationEvent(artifactEvent)).toBe(false);
      expect(isDelegationEvent(decisionEvent)).toBe(false);
      expect(isDelegationEvent(guardEvent)).toBe(false);
      expect(isDelegationEvent(sessionEvent)).toBe(false);
      expect(isDelegationEvent(unknownEvent)).toBe(false);
    });
  });

  describe('isArtifactEvent', () => {
    it('returns true for all artifact event types', () => {
      for (const value of Object.values(ARTIFACT_EVENTS)) {
        expect(isArtifactEvent({ type: value })).toBe(true);
      }
    });

    it('returns false for non-artifact events', () => {
      expect(isArtifactEvent(workflowEvent)).toBe(false);
      expect(isArtifactEvent(delegationEvent)).toBe(false);
      expect(isArtifactEvent(decisionEvent)).toBe(false);
      expect(isArtifactEvent(guardEvent)).toBe(false);
      expect(isArtifactEvent(sessionEvent)).toBe(false);
      expect(isArtifactEvent(unknownEvent)).toBe(false);
    });
  });

  describe('isDecisionEvent', () => {
    it('returns true for all decision event types', () => {
      for (const value of Object.values(DECISION_EVENTS)) {
        expect(isDecisionEvent({ type: value })).toBe(true);
      }
    });

    it('returns false for non-decision events', () => {
      expect(isDecisionEvent(workflowEvent)).toBe(false);
      expect(isDecisionEvent(delegationEvent)).toBe(false);
      expect(isDecisionEvent(artifactEvent)).toBe(false);
      expect(isDecisionEvent(guardEvent)).toBe(false);
      expect(isDecisionEvent(sessionEvent)).toBe(false);
      expect(isDecisionEvent(unknownEvent)).toBe(false);
    });
  });

  describe('isGuardEvent', () => {
    it('returns true for all guard event types', () => {
      for (const value of Object.values(GUARD_EVENTS)) {
        expect(isGuardEvent({ type: value })).toBe(true);
      }
    });

    it('returns false for non-guard events', () => {
      expect(isGuardEvent(workflowEvent)).toBe(false);
      expect(isGuardEvent(delegationEvent)).toBe(false);
      expect(isGuardEvent(artifactEvent)).toBe(false);
      expect(isGuardEvent(decisionEvent)).toBe(false);
      expect(isGuardEvent(sessionEvent)).toBe(false);
      expect(isGuardEvent(unknownEvent)).toBe(false);
    });
  });

  describe('isSessionEvent', () => {
    it('returns true for all session event types', () => {
      for (const value of Object.values(SESSION_EVENTS)) {
        expect(isSessionEvent({ type: value })).toBe(true);
      }
    });

    it('returns false for non-session events', () => {
      expect(isSessionEvent(workflowEvent)).toBe(false);
      expect(isSessionEvent(delegationEvent)).toBe(false);
      expect(isSessionEvent(artifactEvent)).toBe(false);
      expect(isSessionEvent(decisionEvent)).toBe(false);
      expect(isSessionEvent(guardEvent)).toBe(false);
      expect(isSessionEvent(unknownEvent)).toBe(false);
    });
  });

  describe('isValidEventType', () => {
    it('returns true for all known event types', () => {
      for (const value of ALL_EVENT_TYPES) {
        expect(isValidEventType(value)).toBe(true);
      }
    });

    it('returns false for unknown event types', () => {
      expect(isValidEventType('unknown.event')).toBe(false);
      expect(isValidEventType('START')).toBe(false);
      expect(isValidEventType('')).toBe(false);
    });
  });

  describe('type guards use Set.has (not in operator)', () => {
    it('does not match keys of the const objects', () => {
      // Keys like 'START', 'SPAWN', 'WRITE' must NOT match
      for (const key of Object.keys(WORKFLOW_EVENTS)) {
        expect(isWorkflowEvent({ type: key })).toBe(false);
      }
      for (const key of Object.keys(DELEGATION_EVENTS)) {
        expect(isDelegationEvent({ type: key })).toBe(false);
      }
      for (const key of Object.keys(ARTIFACT_EVENTS)) {
        expect(isArtifactEvent({ type: key })).toBe(false);
      }
      for (const key of Object.keys(DECISION_EVENTS)) {
        expect(isDecisionEvent({ type: key })).toBe(false);
      }
      for (const key of Object.keys(GUARD_EVENTS)) {
        expect(isGuardEvent({ type: key })).toBe(false);
      }
      for (const key of Object.keys(SESSION_EVENTS)) {
        expect(isSessionEvent({ type: key })).toBe(false);
      }
    });
  });
});

// ===========================================================================
// Factory functions — each produces correctly typed events
// ===========================================================================

describe('factory functions', () => {
  describe('workflow factories', () => {
    it('createWorkflowStart', () => {
      const event = createWorkflowStart({ sessionId: 'sess-1', timestamp: '2026-01-01T00:00:00Z' });
      expect(event.type).toBe(WORKFLOW_EVENTS.START);
      expect(event.data).toEqual({ sessionId: 'sess-1', timestamp: '2026-01-01T00:00:00Z' });
    });

    it('createStepExit', () => {
      const event = createStepExit({ step: 'plan' });
      expect(event.type).toBe(WORKFLOW_EVENTS.STEP_EXIT);
      expect(event.data).toEqual({ step: 'plan' });
    });

    it('createStepSkip', () => {
      const event = createStepSkip({ step: 'plan_eval' });
      expect(event.type).toBe(WORKFLOW_EVENTS.STEP_SKIP);
      expect(event.data).toEqual({ step: 'plan_eval' });
    });

    it('createStepTimeout', () => {
      const event = createStepTimeout({ step: 'execution', elapsedMs: 300000, configuredTimeoutMs: 250000 });
      expect(event.type).toBe(WORKFLOW_EVENTS.STEP_TIMEOUT);
      expect(event.data).toEqual({ step: 'execution', elapsedMs: 300000, configuredTimeoutMs: 250000 });
    });

    it('createEvalDecide', () => {
      const event = createEvalDecide({ ideation: true, plan: false });
      expect(event.type).toBe(WORKFLOW_EVENTS.EVAL_DECIDE);
      expect(event.data).toEqual({ ideation: true, plan: false });
    });

    it('createFinish', () => {
      const event = createFinish({});
      expect(event.type).toBe(WORKFLOW_EVENTS.FINISH);
      expect(event.data).toEqual({});
    });

    it('createAbort with reason', () => {
      const event = createAbort({ reason: 'User cancelled' });
      expect(event.type).toBe(WORKFLOW_EVENTS.ABORT);
      expect(event.data).toEqual({ reason: 'User cancelled' });
    });

    it('createAbort without reason', () => {
      const event = createAbort({});
      expect(event.type).toBe(WORKFLOW_EVENTS.ABORT);
      expect(event.data).toEqual({});
    });

    it('createResume', () => {
      const event = createResume({ targetStep: 'execution', fromError: true });
      expect(event.type).toBe(WORKFLOW_EVENTS.RESUME);
      expect(event.data).toEqual({ targetStep: 'execution', fromError: true });
    });
  });

  describe('delegation factories', () => {
    it('createDelegationSpawn', () => {
      const event = createDelegationSpawn({ agentType: 'researcher', step: 'ideation', subagentId: 'sub-1', timestamp: '2026-01-01T00:00:00Z' });
      expect(event.type).toBe(DELEGATION_EVENTS.SPAWN);
      expect(event.data).toEqual({ agentType: 'researcher', step: 'ideation', subagentId: 'sub-1', timestamp: '2026-01-01T00:00:00Z' });
    });

    it('createDelegationComplete with all optional fields', () => {
      const event = createDelegationComplete({
        subagentId: 'sub-1',
        artifactPath: '/path/to/artifact.md',
        tokensUsed: 15000,
        cacheHitRatio: 0.42,
      });
      expect(event.type).toBe(DELEGATION_EVENTS.COMPLETE);
      expect(event.data).toEqual({
        subagentId: 'sub-1',
        artifactPath: '/path/to/artifact.md',
        tokensUsed: 15000,
        cacheHitRatio: 0.42,
      });
    });

    it('createDelegationComplete without optional fields', () => {
      const event = createDelegationComplete({ subagentId: 'sub-1' });
      expect(event.type).toBe(DELEGATION_EVENTS.COMPLETE);
      expect(event.data).toEqual({ subagentId: 'sub-1' });
    });

    it('createDelegationFail', () => {
      const event = createDelegationFail({
        subagentId: 'sub-1',
        reason: 'timeout',
        transcriptPath: '/path/to/transcript.md',
      });
      expect(event.type).toBe(DELEGATION_EVENTS.FAIL);
      expect(event.data).toEqual({
        subagentId: 'sub-1',
        reason: 'timeout',
        transcriptPath: '/path/to/transcript.md',
      });
    });
  });

  describe('artifact factories', () => {
    it('createArtifactWrite', () => {
      const event = createArtifactWrite({ step: 'plan', filename: 'plan.md', artifactType: 'markdown' });
      expect(event.type).toBe(ARTIFACT_EVENTS.WRITE);
      expect(event.data).toEqual({ step: 'plan', filename: 'plan.md', artifactType: 'markdown' });
    });

    it('createArtifactOverwrite with previousFilename', () => {
      const event = createArtifactOverwrite({ step: 'plan', filename: 'plan-r2.md', previousFilename: 'plan.md' });
      expect(event.type).toBe(ARTIFACT_EVENTS.OVERWRITE);
      expect(event.data).toEqual({ step: 'plan', filename: 'plan-r2.md', previousFilename: 'plan.md' });
    });

    it('createArtifactOverwrite without previousFilename', () => {
      const event = createArtifactOverwrite({ step: 'plan', filename: 'plan.md' });
      expect(event.type).toBe(ARTIFACT_EVENTS.OVERWRITE);
      expect(event.data).toEqual({ step: 'plan', filename: 'plan.md' });
    });
  });

  describe('decision factories', () => {
    it('createDecisionUser with context', () => {
      const event = createDecisionUser({ decision: 'approve', context: 'Looks good' });
      expect(event.type).toBe(DECISION_EVENTS.USER);
      expect(event.data).toEqual({ decision: 'approve', context: 'Looks good' });
    });

    it('createDecisionUser without context', () => {
      const event = createDecisionUser({ decision: 'reject' });
      expect(event.type).toBe(DECISION_EVENTS.USER);
      expect(event.data).toEqual({ decision: 'reject' });
    });

    it('createEvalVerdict with all fields', () => {
      const event = createEvalVerdict({
        verdict: 'revise',
        loopTarget: 'plan',
        evaluatorId: 'eval-1',
      });
      expect(event.type).toBe(DECISION_EVENTS.EVAL_VERDICT);
      expect(event.data).toEqual({ verdict: 'revise', loopTarget: 'plan', evaluatorId: 'eval-1' });
    });

    it('createEvalVerdict pass with minimal fields', () => {
      const event = createEvalVerdict({ verdict: 'pass' });
      expect(event.type).toBe(DECISION_EVENTS.EVAL_VERDICT);
      expect(event.data).toEqual({ verdict: 'pass' });
    });

    it('createEvalSkip', () => {
      const event = createEvalSkip({ step: 'ideation_eval' });
      expect(event.type).toBe(DECISION_EVENTS.EVAL_SKIP);
      expect(event.data).toEqual({ step: 'ideation_eval' });
    });
  });

  describe('guard factories', () => {
    it('createGuardViolation', () => {
      const event = createGuardViolation({
        guardId: 'no-claude-writes',
        toolName: 'Write',
        reason: 'Cannot write to .claude/ during active session',
        step: 'execution',
        timestamp: '2026-01-01T00:00:00Z',
      });
      expect(event.type).toBe(GUARD_EVENTS.VIOLATION);
      expect(event.data).toEqual({
        guardId: 'no-claude-writes',
        toolName: 'Write',
        reason: 'Cannot write to .claude/ during active session',
        step: 'execution',
        timestamp: '2026-01-01T00:00:00Z',
      });
    });

    it('createGuardOverride', () => {
      const event = createGuardOverride({
        guardId: 'no-claude-writes',
        toolName: 'Write',
        reason: 'User override: emergency fix',
      });
      expect(event.type).toBe(GUARD_EVENTS.OVERRIDE);
      expect(event.data).toEqual({
        guardId: 'no-claude-writes',
        toolName: 'Write',
        reason: 'User override: emergency fix',
      });
    });
  });

  describe('session factories', () => {
    it('createSessionHeartbeat', () => {
      const event = createSessionHeartbeat({ timestamp: '2026-01-01T00:01:00Z' });
      expect(event.type).toBe(SESSION_EVENTS.HEARTBEAT);
      expect(event.data).toEqual({ timestamp: '2026-01-01T00:01:00Z' });
    });
  });
});

// ===========================================================================
// Type-level assertions (compile-time correctness)
// ===========================================================================

describe('type-level correctness', () => {
  it('factory output is assignable to the top-level Event union', () => {
    // These assignments verify at compile time that each factory return type
    // is a subtype of Event. If this file compiles, the assertion holds.
    const events: Event[] = [
      createWorkflowStart({ sessionId: 's', timestamp: 't' }),
      createStepExit({ step: 'ideation' }),
      createStepSkip({ step: 'plan' }),
      createStepTimeout({ step: 'execution', elapsedMs: 1000, configuredTimeoutMs: 500 }),
      createEvalDecide({ ideation: true, plan: false }),
      createFinish({}),
      createAbort({}),
      createResume({ targetStep: 'execution', fromError: true }),
      createDelegationSpawn({ agentType: 'executor', step: 'execution', subagentId: 'sub-1', timestamp: '2026-01-01T00:00:00Z' }),
      createDelegationComplete({ subagentId: 'sub-1' }),
      createDelegationFail({ subagentId: 'sub-1', reason: 'error' }),
      createArtifactWrite({ step: 'plan', filename: 'plan.md', artifactType: 'markdown' }),
      createArtifactOverwrite({ step: 'plan', filename: 'plan.md' }),
      createDecisionUser({ decision: 'approve' }),
      createEvalVerdict({ verdict: 'pass' }),
      createEvalSkip({ step: 'ideation_eval' }),
      createGuardViolation({ guardId: 'g1', toolName: 'Write', reason: 'blocked', step: 'execution', timestamp: '2026-01-01T00:00:00Z' }),
      createGuardOverride({ guardId: 'g1', toolName: 'Write', reason: 'allowed' }),
      createSessionHeartbeat({ timestamp: '2026-01-01T00:00:00Z' }),
    ];

    // Runtime check: every factory produced a valid event
    expect(events).toHaveLength(19);
    for (const event of events) {
      expect(isValidEventType(event.type)).toBe(true);
    }
  });

  it('discriminated union narrows correctly in switch', () => {
    const event: Event = createWorkflowStart({ sessionId: 's', timestamp: 't' });

    // Verify that type narrowing works (this is a compile-time check that
    // also validates at runtime)
    if (event.type === 'workflow.start') {
      expect(event.data.sessionId).toBe('s');
      expect(event.data.timestamp).toBe('t');
    } else {
      // Should not reach here
      expect(true).toBe(false);
    }
  });
});
