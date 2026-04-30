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
  createWorkflowInvalidTransition,

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

  // Verification
  VERIFICATION_EVENTS,
  isVerificationEvent,
  createVerificationResult,

  // Step advancement (audit-only)
  STEP_ADVANCEMENT_EVENTS,
  isStepAdvancementEvent,
  createStepAdvancementObserved,

  // Prompt (audit-only)
  PROMPT_EVENTS,
  isPromptPatchAppliedEvent,
  createPromptPatchApplied,

  // Top-level
  ALL_EVENT_TYPES,
  isValidEventType,
} from '../index.js';

import type {
  Event,
  EventType,
  AuditOnlyEvent,
  AuditOnlyEventType,
  AnyEventType,
} from '../index.js';

// ===========================================================================
// Const object completeness
// ===========================================================================

describe('const objects', () => {
  it('WORKFLOW_EVENTS has 9 entries', () => {
    expect(Object.values(WORKFLOW_EVENTS)).toHaveLength(9);
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

  it('VERIFICATION_EVENTS has 1 entry', () => {
    expect(Object.values(VERIFICATION_EVENTS)).toHaveLength(1);
  });

  it('STEP_ADVANCEMENT_EVENTS has 1 entry (audit-only)', () => {
    expect(Object.values(STEP_ADVANCEMENT_EVENTS)).toHaveLength(1);
  });

  it('PROMPT_EVENTS has 1 entry (audit-only)', () => {
    expect(Object.values(PROMPT_EVENTS)).toHaveLength(1);
  });
});

// ===========================================================================
// ALL_EVENT_TYPES
// ===========================================================================

describe('ALL_EVENT_TYPES', () => {
  it('contains exactly 24 entries (9 + 3 + 2 + 3 + 3 + 1 + 1 + 1 + 1) — wire-level (reducer + audit-only)', () => {
    // Wave C.1.3 (issue #156): 22 reducer-typed events + 2 audit-only
    // events (`step.advancement.observed` from Wave A.1.3 +
    // `prompt.patch.applied` from Wave C.1.3) = 24 wire-level event
    // types. Closed-enumeration discipline per orchestration README
    // §3.5 / §13 success criterion #5.
    expect(ALL_EVENT_TYPES.size).toBe(24);
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

  it('contains every verification event type', () => {
    for (const value of Object.values(VERIFICATION_EVENTS)) {
      expect(ALL_EVENT_TYPES.has(value)).toBe(true);
    }
  });

  it('contains every step-advancement (audit-only) event type', () => {
    for (const value of Object.values(STEP_ADVANCEMENT_EVENTS)) {
      expect(ALL_EVENT_TYPES.has(value)).toBe(true);
    }
  });

  it('contains step.advancement.observed (Wave A.1.3 audit-only)', () => {
    expect(ALL_EVENT_TYPES.has('step.advancement.observed')).toBe(true);
  });

  it('contains every prompt (audit-only) event type', () => {
    for (const value of Object.values(PROMPT_EVENTS)) {
      expect(ALL_EVENT_TYPES.has(value)).toBe(true);
    }
  });

  it('contains prompt.patch.applied (Wave C.1.3 audit-only)', () => {
    expect(ALL_EVENT_TYPES.has('prompt.patch.applied')).toBe(true);
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
    Object.values(VERIFICATION_EVENTS),
    Object.values(STEP_ADVANCEMENT_EVENTS),
    Object.values(PROMPT_EVENTS),
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
      [Object.values(VERIFICATION_EVENTS), 'verification.'],
      [Object.values(STEP_ADVANCEMENT_EVENTS), 'step.advancement.'],
      [Object.values(PROMPT_EVENTS), 'prompt.'],
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

  describe('isVerificationEvent', () => {
    const verificationEvent = { type: 'verification.result' };

    it('returns true for all verification event types', () => {
      for (const value of Object.values(VERIFICATION_EVENTS)) {
        expect(isVerificationEvent({ type: value })).toBe(true);
      }
    });

    it('returns false for non-verification events', () => {
      expect(isVerificationEvent(workflowEvent)).toBe(false);
      expect(isVerificationEvent(delegationEvent)).toBe(false);
      expect(isVerificationEvent(artifactEvent)).toBe(false);
      expect(isVerificationEvent(decisionEvent)).toBe(false);
      expect(isVerificationEvent(guardEvent)).toBe(false);
      expect(isVerificationEvent(sessionEvent)).toBe(false);
      expect(isVerificationEvent(unknownEvent)).toBe(false);
    });

    it('no other category guard matches a verification event', () => {
      expect(isWorkflowEvent(verificationEvent)).toBe(false);
      expect(isDelegationEvent(verificationEvent)).toBe(false);
      expect(isArtifactEvent(verificationEvent)).toBe(false);
      expect(isDecisionEvent(verificationEvent)).toBe(false);
      expect(isGuardEvent(verificationEvent)).toBe(false);
      expect(isSessionEvent(verificationEvent)).toBe(false);
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
      for (const key of Object.keys(VERIFICATION_EVENTS)) {
        expect(isVerificationEvent({ type: key })).toBe(false);
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

    it('createWorkflowInvalidTransition — round-trip through type guard', () => {
      const event = createWorkflowInvalidTransition({
        rejectedEventType: 'workflow.abort',
        rejectedEventSeq: null,
        stepAtRejection: 'ideation',
        reducerMessage:
          'workflow.abort requires error state, got ideation',
        timestamp: '2026-01-01T00:00:00.000Z',
      });
      expect(event.type).toBe(WORKFLOW_EVENTS.INVALID_TRANSITION);
      expect(event.data).toEqual({
        rejectedEventType: 'workflow.abort',
        rejectedEventSeq: null,
        stepAtRejection: 'ideation',
        reducerMessage:
          'workflow.abort requires error state, got ideation',
        timestamp: '2026-01-01T00:00:00.000Z',
      });
      // Narrows via the category type guard.
      expect(isWorkflowEvent(event)).toBe(true);
      // Round-trips through JSON.stringify (no Date, no Set, no class).
      const round = JSON.parse(JSON.stringify(event));
      expect(round).toEqual(event);
    });
  });

  describe('delegation factories', () => {
    it('createDelegationSpawn', () => {
      const event = createDelegationSpawn({ agentType: 'researcher', step: 'ideation', subagentId: 'sub-1', timestamp: '2026-01-01T00:00:00Z' });
      expect(event.type).toBe(DELEGATION_EVENTS.SPAWN);
      expect(event.data).toEqual({ agentType: 'researcher', step: 'ideation', subagentId: 'sub-1', timestamp: '2026-01-01T00:00:00Z' });
    });

    // Issue #92 — optional `claudeCodeVersion` field on DelegationSpawnData.
    // The field is schema-only until a spawn emitter lands; the factory must
    // accept it as a pass-through and the omit-branch must keep the data
    // shape identical to the pre-field behaviour.

    it('createDelegationSpawn passes claudeCodeVersion through when set (issue #92)', () => {
      const event = createDelegationSpawn({
        agentType: 'researcher',
        step: 'ideation',
        subagentId: 'sub-1',
        timestamp: '2026-01-01T00:00:00Z',
        claudeCodeVersion: '2.1.110',
      });
      expect(event.data).toEqual({
        agentType: 'researcher',
        step: 'ideation',
        subagentId: 'sub-1',
        timestamp: '2026-01-01T00:00:00Z',
        claudeCodeVersion: '2.1.110',
      });
      // Round-trips through JSON.stringify — the optional field survives
      // serialization into the event store's `data` column.
      const round = JSON.parse(JSON.stringify(event));
      expect(round).toEqual(event);
    });

    it('createDelegationSpawn omits claudeCodeVersion when caller omits it (issue #92)', () => {
      const event = createDelegationSpawn({
        agentType: 'executor',
        step: 'execution',
        subagentId: 'sub-2',
        timestamp: '2026-01-01T00:00:00Z',
      });
      expect('claudeCodeVersion' in event.data).toBe(false);
    });

    // PR-FIN-2a-ii T-2a.8.0 — additive `tool_call_id` field on
    // DelegationSpawnData. Round-trips through JSON.stringify and the
    // omit-branch keeps the event shape identical to pre-field behavior.
    it('createDelegationSpawn passes tool_call_id through when set', () => {
      const event = createDelegationSpawn({
        agentType: 'executor',
        step: 'execution',
        subagentId: 'sub-tcid',
        timestamp: '2026-04-29T00:00:00Z',
        tool_call_id: 'toolu_abc123',
      });
      expect(event.data).toEqual({
        agentType: 'executor',
        step: 'execution',
        subagentId: 'sub-tcid',
        timestamp: '2026-04-29T00:00:00Z',
        tool_call_id: 'toolu_abc123',
      });
      const round = JSON.parse(JSON.stringify(event));
      expect(round).toEqual(event);
    });

    it('createDelegationSpawn omits tool_call_id when caller omits it', () => {
      const event = createDelegationSpawn({
        agentType: 'executor',
        step: 'execution',
        subagentId: 'sub-no-tcid',
        timestamp: '2026-04-29T00:00:00Z',
      });
      expect('tool_call_id' in event.data).toBe(false);
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

    // PR-FIN-2a-ii T-2a.8.0 — additive `transcriptSha256` field on
    // DelegationCompleteData. Captured at SubagentStop time over the full
    // transcript bytes; round-trips through JSON.stringify; absence
    // preserved when caller omits it (no empty-string sentinel).
    it('createDelegationComplete passes transcriptSha256 through when set', () => {
      const event = createDelegationComplete({
        subagentId: 'sub-sha',
        artifactPath: '/path/to/artifact.md',
        transcriptSha256:
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      });
      expect(event.data).toEqual({
        subagentId: 'sub-sha',
        artifactPath: '/path/to/artifact.md',
        transcriptSha256:
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      });
      const round = JSON.parse(JSON.stringify(event));
      expect(round).toEqual(event);
    });

    it('createDelegationComplete omits transcriptSha256 when caller omits it', () => {
      const event = createDelegationComplete({ subagentId: 'sub-no-sha' });
      expect('transcriptSha256' in event.data).toBe(false);
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

    it('createEvalSkip with priorError (CP11 reversibility)', () => {
      // Schema v3 extension — the factory accepts an optional PriorErrorSnapshot
      // on top of the existing `step` field and round-trips it through
      // isDecisionEvent without mutation.
      const priorError = {
        pathway: {
          kind: 'feedbackCap' as const,
          feedbackRound: 3,
          maxFeedbackRounds: 3,
          verdictHistory: [
            {
              round: 3,
              verdict: 'revise' as const,
              verdictSeq: 15,
              loopTarget: null,
              evaluatorId: null,
            },
          ],
          finalRoundArtifacts: ['exec.md'],
        },
        capturedAt: '2026-02-01T00:00:00.000Z',
        stepAtError: 'error',
        witnessEventSeqs: [15],
      };
      const event = createEvalSkip({ step: 'memorization', priorError });
      expect(event.type).toBe(DECISION_EVENTS.EVAL_SKIP);
      expect(isDecisionEvent(event)).toBe(true);
      // Structural identity — the factory does not clone or re-shape the
      // nested snapshot.
      expect(event.data).toEqual({ step: 'memorization', priorError });
      // JSON round-trip invariant (what the event-store wire format does).
      const reparsed = JSON.parse(JSON.stringify(event.data)) as unknown;
      expect(reparsed).toEqual({ step: 'memorization', priorError });
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

  describe('verification factories', () => {
    const baseData = {
      subagentId: 'sub-1',
      command: 'bunx tsc --noEmit',
      commandKind: 'typecheck' as const,
      exitCode: 0,
      durationMs: 4321,
      policy: 'gate' as const,
      timedOut: false,
      stdoutDigest: 'sha256:abc',
      stderrDigest: 'sha256:def',
      timestamp: '2026-04-17T14:00:00.000Z',
    };

    it('createVerificationResult — round-trip through factory', () => {
      const event = createVerificationResult(baseData);
      expect(event.type).toBe(VERIFICATION_EVENTS.RESULT);
      expect(event.data).toEqual(baseData);
    });

    it('createVerificationResult — narrows via isVerificationEvent', () => {
      const event = createVerificationResult(baseData);
      expect(isVerificationEvent(event)).toBe(true);
      // Every other category guard must reject it.
      expect(isWorkflowEvent(event)).toBe(false);
      expect(isDelegationEvent(event)).toBe(false);
    });

    it('createVerificationResult — round-trips through JSON', () => {
      const event = createVerificationResult({
        ...baseData,
        exitCode: -1,
        timedOut: true,
      });
      const round = JSON.parse(JSON.stringify(event)) as unknown;
      expect(round).toEqual(event);
    });

    it('createVerificationResult — each commandKind variant typechecks', () => {
      const kinds = [
        'lint',
        'test',
        'typecheck',
        'build',
        'format',
        'custom',
      ] as const;
      for (const commandKind of kinds) {
        const event = createVerificationResult({ ...baseData, commandKind });
        expect(event.data.commandKind).toBe(commandKind);
        expect(isVerificationEvent(event)).toBe(true);
      }
    });

    it('createVerificationResult — inform vs gate policy both round-trip', () => {
      const gateEvt = createVerificationResult({ ...baseData, policy: 'gate' });
      const infoEvt = createVerificationResult({ ...baseData, policy: 'inform' });
      expect(gateEvt.data.policy).toBe('gate');
      expect(infoEvt.data.policy).toBe('inform');
    });

    it('createVerificationResult — SIGTERM / SIGKILL encoded as negative exit codes', () => {
      const sigterm = createVerificationResult({
        ...baseData,
        exitCode: -1,
        timedOut: true,
      });
      const sigkill = createVerificationResult({
        ...baseData,
        exitCode: -2,
        timedOut: true,
      });
      expect(sigterm.data.exitCode).toBe(-1);
      expect(sigterm.data.timedOut).toBe(true);
      expect(sigkill.data.exitCode).toBe(-2);
      expect(sigkill.data.timedOut).toBe(true);
    });

    it('VERIFICATION_EVENTS.RESULT matches the prefixed string', () => {
      expect(VERIFICATION_EVENTS.RESULT).toBe('verification.result');
    });
  });

  describe('step-advancement (audit-only) factories', () => {
    // Wave A.1.3 / orchestration Pass 4 — `step.advancement.observed` is an
    // audit-only event. These tests cover (a) factory shape, (b) type-guard
    // accept/reject behaviour against the eight categories, and (c) the
    // architectural fence: it must NOT be a member of `Event` (the
    // reducer-typed union) — that's enforced by a separate `isWorkflowEvent`
    // / `isVerificationEvent` cross-rejection check.

    const baseAdvancementData = {
      step: 'planning',
      toolCallId: 'tc-pa-1',
      timestamp: '2026-04-25T12:00:00.000Z',
    };

    it('createStepAdvancementObserved produces a well-formed event', () => {
      const event = createStepAdvancementObserved(baseAdvancementData);
      expect(event.type).toBe(STEP_ADVANCEMENT_EVENTS.OBSERVED);
      expect(event.data).toEqual(baseAdvancementData);
    });

    it('STEP_ADVANCEMENT_EVENTS.OBSERVED matches the prefixed string', () => {
      expect(STEP_ADVANCEMENT_EVENTS.OBSERVED).toBe(
        'step.advancement.observed',
      );
    });

    it('isStepAdvancementEvent narrows the audit-only event', () => {
      const event = createStepAdvancementObserved(baseAdvancementData);
      expect(isStepAdvancementEvent(event)).toBe(true);
    });

    it('isStepAdvancementEvent rejects every reducer-typed category', () => {
      const reducerTypedSamples = [
        { type: 'workflow.start' },
        { type: 'delegation.spawn' },
        { type: 'artifact.write' },
        { type: 'decision.user' },
        { type: 'guard.violation' },
        { type: 'session.heartbeat' },
        { type: 'verification.result' },
        { type: 'unknown.event' },
      ];
      for (const sample of reducerTypedSamples) {
        expect(isStepAdvancementEvent(sample)).toBe(false);
      }
    });

    it('audit-only event is rejected by every reducer-category guard (architectural fence)', () => {
      // The fence: an audit-only event MUST NOT pass any reducer-category
      // type guard. A failure here means a reducer category accidentally
      // claims the audit event, which would route it through the reducer
      // and silently lose it (state-db-redesign.md §1).
      const event = createStepAdvancementObserved(baseAdvancementData);
      expect(isWorkflowEvent(event)).toBe(false);
      expect(isDelegationEvent(event)).toBe(false);
      expect(isArtifactEvent(event)).toBe(false);
      expect(isDecisionEvent(event)).toBe(false);
      expect(isGuardEvent(event)).toBe(false);
      expect(isSessionEvent(event)).toBe(false);
      expect(isVerificationEvent(event)).toBe(false);
    });

    it('round-trips through JSON (wire-format invariant)', () => {
      const event = createStepAdvancementObserved(baseAdvancementData);
      const round = JSON.parse(JSON.stringify(event)) as unknown;
      expect(round).toEqual(event);
    });

    it('isValidEventType accepts the audit-only type', () => {
      expect(isValidEventType('step.advancement.observed')).toBe(true);
    });
  });

  describe('prompt (audit-only) factories', () => {
    // Wave C.1.3 / issue #156 — `prompt.patch.applied` is an audit-only
    // event committed via `store.append()` directly by the
    // `gobbi prompt patch` command (Wave C.1.6). These tests cover
    // (a) factory shape, (b) type-guard accept/reject behaviour, and
    // (c) the architectural fence: it must NOT be a member of `Event`
    // (the reducer-typed union). The runtime fence at `reducer.ts:691`
    // catches a serialise/deserialise replay before `assertNever`
    // throws.

    const basePromptData = {
      promptId: 'ideation' as const,
      patchId: 'sha256-abcdef',
      parentPatchId: null,
      preHash: 'sha256-pre',
      postHash: 'sha256-post',
      opCount: 2,
      schemaId: 'https://gobbi.dev/schemas/step-spec/v1.json',
      appliedBy: 'operator' as const,
    };

    it('createPromptPatchApplied produces a well-formed event', () => {
      const event = createPromptPatchApplied(basePromptData);
      expect(event.type).toBe(PROMPT_EVENTS.PATCH_APPLIED);
      expect(event.data).toEqual(basePromptData);
    });

    it('PROMPT_EVENTS.PATCH_APPLIED matches the prefixed string', () => {
      expect(PROMPT_EVENTS.PATCH_APPLIED).toBe('prompt.patch.applied');
    });

    it('isPromptPatchAppliedEvent narrows the audit-only event', () => {
      const event = createPromptPatchApplied(basePromptData);
      expect(isPromptPatchAppliedEvent(event)).toBe(true);
    });

    it('isPromptPatchAppliedEvent rejects every reducer-typed category', () => {
      const reducerTypedSamples = [
        { type: 'workflow.start' },
        { type: 'delegation.spawn' },
        { type: 'artifact.write' },
        { type: 'decision.user' },
        { type: 'guard.violation' },
        { type: 'session.heartbeat' },
        { type: 'verification.result' },
        { type: 'step.advancement.observed' },
        { type: 'unknown.event' },
      ];
      for (const sample of reducerTypedSamples) {
        expect(isPromptPatchAppliedEvent(sample)).toBe(false);
      }
    });

    it('audit-only event is rejected by every reducer-category guard (architectural fence)', () => {
      // Same fence as `step.advancement.observed`: an audit-only event
      // MUST NOT pass any reducer-category type guard. Synthesis §6.
      const event = createPromptPatchApplied(basePromptData);
      expect(isWorkflowEvent(event)).toBe(false);
      expect(isDelegationEvent(event)).toBe(false);
      expect(isArtifactEvent(event)).toBe(false);
      expect(isDecisionEvent(event)).toBe(false);
      expect(isGuardEvent(event)).toBe(false);
      expect(isSessionEvent(event)).toBe(false);
      expect(isVerificationEvent(event)).toBe(false);
      // And rejected by the sibling audit-only guard so the two
      // categories stay distinct.
      expect(isStepAdvancementEvent(event)).toBe(false);
    });

    it('round-trips through JSON (wire-format invariant)', () => {
      const event = createPromptPatchApplied(basePromptData);
      const round = JSON.parse(JSON.stringify(event)) as unknown;
      expect(round).toEqual(event);
    });

    it('isValidEventType accepts the audit-only type', () => {
      expect(isValidEventType('prompt.patch.applied')).toBe(true);
    });

    it('PromptId enum covers the closed prompt-id set', () => {
      const expected = [
        'ideation',
        'planning',
        'execution',
        'evaluation',
        'memorization',
        'handoff',
      ] as const;
      // The factory accepts every member; round-trip preserves them.
      for (const promptId of expected) {
        const event = createPromptPatchApplied({ ...basePromptData, promptId });
        expect(event.data.promptId).toBe(promptId);
      }
    });

    it('parentPatchId can be null (genesis row marker)', () => {
      const event = createPromptPatchApplied({
        ...basePromptData,
        parentPatchId: null,
      });
      expect(event.data.parentPatchId).toBeNull();
    });

    it('parentPatchId can be a string (chained patch)', () => {
      const event = createPromptPatchApplied({
        ...basePromptData,
        parentPatchId: 'sha256-prior',
      });
      expect(event.data.parentPatchId).toBe('sha256-prior');
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
      createWorkflowInvalidTransition({
        rejectedEventType: 'workflow.abort',
        rejectedEventSeq: null,
        stepAtRejection: 'ideation',
        reducerMessage: 'rejected',
        timestamp: '2026-01-01T00:00:00Z',
      }),
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
      createVerificationResult({
        subagentId: 'sub-1',
        command: 'bun test',
        commandKind: 'test',
        exitCode: 0,
        durationMs: 1000,
        policy: 'gate',
        timedOut: false,
        stdoutDigest: 'sha256:a',
        stderrDigest: 'sha256:b',
        timestamp: '2026-01-01T00:00:00Z',
      }),
    ];

    // Runtime check: every factory produced a valid event
    expect(events).toHaveLength(21);
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

  it('AuditOnlyEvent is structurally assignable to its own union', () => {
    // Type-level invariant — `AuditOnlyEvent` is the typed contract for
    // audit-only events. The factory's return type must be assignable to
    // it. If this file compiles, the assignment holds.
    const audit: AuditOnlyEvent = createStepAdvancementObserved({
      step: 'planning',
      toolCallId: 'tc-1',
      timestamp: '2026-04-25T12:00:00.000Z',
    });
    expect(audit.type).toBe('step.advancement.observed');
  });

  it('AuditOnlyEventType and AnyEventType cover the wire-level union', () => {
    // Compile-time discipline: every wire-level type string must be
    // representable as `AnyEventType`. The runtime check confirms the
    // closed-enumeration assertion remains in sync with the type union.
    const auditType: AuditOnlyEventType = 'step.advancement.observed';
    const reducerType: EventType = 'workflow.start';
    const anyA: AnyEventType = auditType;
    const anyR: AnyEventType = reducerType;
    expect(ALL_EVENT_TYPES.has(anyA)).toBe(true);
    expect(ALL_EVENT_TYPES.has(anyR)).toBe(true);
  });
});
