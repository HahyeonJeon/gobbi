/**
 * `detectPathway` unit tests + `visitPathway` exhaustiveness gate.
 *
 * D.1 scope:
 *
 *   - 5 pathway fixtures (Crash, Timeout, FeedbackCap, InvalidTransition,
 *     Unknown).
 *   - Edge cases (pre-condition violation, timeout buried by resume, store
 *     with events but no triggering evidence).
 *   - Determinism assertion (two calls on identical inputs return the
 *     same pathway).
 *   - `visitPathway` exhaustiveness — a visitor missing a key is a `tsc`
 *     error proved via `@ts-expect-error`.
 *
 * D.2 populates `errors.snap.test.ts` with full compile-snapshot tests per
 * pathway; this file covers detector logic only.
 */

import { describe, it, expect } from 'bun:test';

import { EventStore } from '../../workflow/store.js';
import { initialState } from '../../workflow/state.js';
import type { WorkflowState } from '../../workflow/state.js';
import { WORKFLOW_EVENTS } from '../../workflow/events/workflow.js';
import { DECISION_EVENTS } from '../../workflow/events/decision.js';
import { SESSION_EVENTS } from '../../workflow/events/session.js';

import {
  detectPathway,
  visitPathway,
  type ErrorPathway,
  type PathwayVisitor,
} from '../errors.js';

// ---------------------------------------------------------------------------
// Fixture helpers — direct `store.append` seeding so fixtures stay
// deterministic (no `new Date()`, fixed ISO timestamps). The pathway
// detector is the system under test; we're constructing event trails the
// detector must classify correctly.
// ---------------------------------------------------------------------------

function errorState(overrides: Partial<WorkflowState> = {}): WorkflowState {
  return {
    ...initialState('detect-pathway-test'),
    currentStep: 'error',
    ...overrides,
  };
}

function seedStart(store: EventStore, toolCallId = 'tc-start'): void {
  store.append({
    ts: '2026-01-01T00:00:00.000Z',
    type: WORKFLOW_EVENTS.START,
    step: null,
    data: JSON.stringify({
      sessionId: 'detect-pathway-test',
      timestamp: '2026-01-01T00:00:00.000Z',
    }),
    actor: 'cli',
    parent_seq: null,
    idempotencyKind: 'tool-call',
    toolCallId,
    sessionId: 'detect-pathway-test',
  });
}

function seedTimeout(
  store: EventStore,
  step: string,
  toolCallId = 'tc-timeout',
  ts = '2026-01-01T00:05:00.000Z',
): void {
  store.append({
    ts,
    type: WORKFLOW_EVENTS.STEP_TIMEOUT,
    step,
    data: JSON.stringify({
      step,
      elapsedMs: 300_000,
      configuredTimeoutMs: 120_000,
    }),
    actor: 'hook',
    parent_seq: null,
    idempotencyKind: 'tool-call',
    toolCallId,
    sessionId: 'detect-pathway-test',
  });
}

function seedInvalidTransition(
  store: EventStore,
  rejectedEventType = 'workflow.abort',
  stepAtRejection = 'ideation',
  toolCallId = 'tc-invalid',
  ts = '2026-01-01T00:10:00.000Z',
): void {
  store.append({
    ts,
    type: WORKFLOW_EVENTS.INVALID_TRANSITION,
    step: stepAtRejection,
    data: JSON.stringify({
      rejectedEventType,
      rejectedEventSeq: null,
      stepAtRejection,
      reducerMessage: `Reducer rejected event ${rejectedEventType}`,
      timestamp: ts,
    }),
    actor: 'cli',
    parent_seq: null,
    idempotencyKind: 'tool-call',
    toolCallId,
    sessionId: 'detect-pathway-test',
  });
}

function seedResume(
  store: EventStore,
  targetStep: string,
  toolCallId = 'tc-resume',
  ts = '2026-01-01T00:20:00.000Z',
): void {
  store.append({
    ts,
    type: WORKFLOW_EVENTS.RESUME,
    step: null,
    data: JSON.stringify({ targetStep, fromError: true }),
    actor: 'cli',
    parent_seq: null,
    idempotencyKind: 'tool-call',
    toolCallId,
    sessionId: 'detect-pathway-test',
  });
}

function seedVerdict(
  store: EventStore,
  verdict: 'pass' | 'revise' | 'escalate',
  toolCallId: string,
  ts = '2026-01-01T00:15:00.000Z',
  loopTarget: string | null = 'execution',
): void {
  store.append({
    ts,
    type: DECISION_EVENTS.EVAL_VERDICT,
    step: 'execution_eval',
    data: JSON.stringify(
      loopTarget !== null
        ? { verdict, loopTarget, evaluatorId: 'eval-1' }
        : { verdict, evaluatorId: 'eval-1' },
    ),
    actor: 'subagent',
    parent_seq: null,
    idempotencyKind: 'tool-call',
    toolCallId,
    sessionId: 'detect-pathway-test',
  });
}

function seedHeartbeat(
  store: EventStore,
  ts = '2026-01-01T00:04:00.000Z',
  counter = 0,
): void {
  store.append({
    ts,
    type: SESSION_EVENTS.HEARTBEAT,
    step: null,
    data: JSON.stringify({ timestamp: ts }),
    actor: 'hook',
    parent_seq: null,
    idempotencyKind: 'counter',
    counter,
    sessionId: 'detect-pathway-test',
  });
}

// ===========================================================================
// Pre-condition
// ===========================================================================

describe('detectPathway — pre-condition', () => {
  it('throws when called from a non-error step', () => {
    using store = new EventStore(':memory:');
    const state: WorkflowState = {
      ...initialState('detect-pathway-test'),
      currentStep: 'ideation',
    };
    expect(() => detectPathway(state, store)).toThrow(/must be 'error'/);
  });

  it('throws when called from idle', () => {
    using store = new EventStore(':memory:');
    const state = initialState('detect-pathway-test');
    expect(() => detectPathway(state, store)).toThrow(/must be 'error'/);
  });
});

// ===========================================================================
// Timeout
// ===========================================================================

describe('detectPathway — Timeout', () => {
  it('classifies as Timeout when a step.timeout event is the most recent evidence', () => {
    using store = new EventStore(':memory:');
    seedStart(store);
    seedTimeout(store, 'execution');

    const pathway = detectPathway(errorState(), store);
    expect(pathway.kind).toBe('timeout');
    if (pathway.kind !== 'timeout') return;
    expect(pathway.timedOutStep).toBe('execution');
    expect(pathway.elapsedMs).toBe(300_000);
    expect(pathway.configuredTimeoutMs).toBe(120_000);
    expect(typeof pathway.timeoutEventSeq).toBe('number');
    expect(pathway.inProgressArtifacts).toEqual([]);
  });

  it('falls through to the next probe when the timeout is buried by a resume', () => {
    using store = new EventStore(':memory:');
    seedStart(store);
    seedTimeout(store, 'execution');
    seedResume(store, 'execution');
    // State returned to error after resume — but no new triggering evidence.
    const pathway = detectPathway(errorState(), store);
    // Timeout was recovered from; no other evidence → Crash.
    expect(pathway.kind).toBe('crash');
  });
});

// ===========================================================================
// InvalidTransition
// ===========================================================================

describe('detectPathway — InvalidTransition', () => {
  it('classifies as InvalidTransition when the audit event is the most recent evidence', () => {
    using store = new EventStore(':memory:');
    seedStart(store);
    seedInvalidTransition(store, 'workflow.abort', 'ideation');

    const pathway = detectPathway(errorState(), store);
    expect(pathway.kind).toBe('invalidTransition');
    if (pathway.kind !== 'invalidTransition') return;
    expect(pathway.rejectedEventType).toBe('workflow.abort');
    expect(pathway.stepAtRejection).toBe('ideation');
    expect(pathway.rejectedEventSeq).toBeNull();
    expect(typeof pathway.invalidTransitionEventSeq).toBe('number');
  });

  it('Timeout takes priority when both exist AND neither is buried (timeout listed first in probe order)', () => {
    using store = new EventStore(':memory:');
    seedStart(store);
    // Both evidence events land; timeout probed first regardless of seq.
    seedTimeout(store, 'execution');
    seedInvalidTransition(store, 'workflow.abort', 'execution');

    const pathway = detectPathway(errorState(), store);
    expect(pathway.kind).toBe('timeout');
  });
});

// ===========================================================================
// FeedbackCap
// ===========================================================================

describe('detectPathway — FeedbackCap', () => {
  it('classifies as FeedbackCap when state has cap + revise and verdict exists', () => {
    using store = new EventStore(':memory:');
    seedStart(store);
    seedVerdict(store, 'revise', 'tc-v1', '2026-01-01T00:10:00.000Z');
    seedVerdict(store, 'revise', 'tc-v2', '2026-01-01T00:11:00.000Z');
    seedVerdict(store, 'revise', 'tc-v3', '2026-01-01T00:12:00.000Z');

    const state = errorState({
      feedbackRound: 3,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: 'revise',
    });
    const pathway = detectPathway(state, store);
    expect(pathway.kind).toBe('feedbackCap');
    if (pathway.kind !== 'feedbackCap') return;
    expect(pathway.feedbackRound).toBe(3);
    expect(pathway.maxFeedbackRounds).toBe(3);
    expect(pathway.verdictHistory).toHaveLength(3);
    // All revise in the window.
    for (const h of pathway.verdictHistory) {
      expect(h.verdict).toBe('revise');
    }
  });

  it('falls through to Crash when the state predicate matches but no verdict exists', () => {
    using store = new EventStore(':memory:');
    seedStart(store);
    // No verdict events.

    const state = errorState({
      feedbackRound: 3,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: 'revise',
    });
    const pathway = detectPathway(state, store);
    expect(pathway.kind).toBe('crash');
  });
});

// ===========================================================================
// Crash
// ===========================================================================

describe('detectPathway — Crash', () => {
  it('classifies as Crash when state is error + events exist + no triggering evidence', () => {
    using store = new EventStore(':memory:');
    seedStart(store);
    seedHeartbeat(store);

    const state = errorState({
      completedSteps: ['ideation'],
    });
    const pathway = detectPathway(state, store);
    expect(pathway.kind).toBe('crash');
    if (pathway.kind !== 'crash') return;
    expect(pathway.stepAtCrash).toBe('ideation');
    expect(pathway.lastEventSeqs.length).toBeGreaterThan(0);
    expect(pathway.heartbeatEventSeq).not.toBeNull();
  });

  it('defaults stepAtCrash to "idle" when completedSteps is empty', () => {
    using store = new EventStore(':memory:');
    seedStart(store);

    const pathway = detectPathway(errorState(), store);
    expect(pathway.kind).toBe('crash');
    if (pathway.kind !== 'crash') return;
    expect(pathway.stepAtCrash).toBe('idle');
  });
});

// ===========================================================================
// Unknown
// ===========================================================================

describe('detectPathway — Unknown', () => {
  it('classifies as Unknown with empty-store reason when no events exist', () => {
    using store = new EventStore(':memory:');
    // Nothing seeded.
    const pathway = detectPathway(errorState(), store);
    expect(pathway.kind).toBe('unknown');
    if (pathway.kind !== 'unknown') return;
    expect(pathway.reason).toBe('empty-store');
    expect(pathway.diagnosticHint.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// Determinism
// ===========================================================================

describe('detectPathway — determinism', () => {
  it('two calls on the same (state, store) produce structurally equal pathways', () => {
    using store = new EventStore(':memory:');
    seedStart(store);
    seedTimeout(store, 'plan');

    const first = detectPathway(errorState(), store);
    const second = detectPathway(errorState(), store);
    expect(first).toEqual(second);
  });

  it('accepts an injectable clock without affecting output (detector is clock-free)', () => {
    using store = new EventStore(':memory:');
    seedStart(store);

    const now1 = (): number => 1_000;
    const now2 = (): number => 2_000_000;
    const state = errorState();
    const first = detectPathway(state, store, { now: now1 });
    const second = detectPathway(state, store, { now: now2 });
    expect(first).toEqual(second);
  });
});

// ===========================================================================
// visitPathway — runtime + compile-time exhaustiveness
// ===========================================================================

describe('visitPathway', () => {
  const crashSample: ErrorPathway = {
    kind: 'crash',
    stepAtCrash: 'ideation',
    lastEventSeqs: [1, 2, 3],
    heartbeatEventSeq: 2,
  };
  const unknownSample: ErrorPathway = {
    kind: 'unknown',
    reason: 'empty-store',
    diagnosticHint: 'hint',
  };

  it('dispatches to the matching visitor handler', () => {
    const result = visitPathway(crashSample, {
      crash: (p) => `crash@${p.stepAtCrash}`,
      timeout: () => 'timeout',
      feedbackCap: () => 'feedbackCap',
      invalidTransition: () => 'invalidTransition',
      unknown: () => 'unknown',
    });
    expect(result).toBe('crash@ideation');
  });

  it('narrows each handler parameter to the matching variant', () => {
    // Compile-time: if narrowing were lost, accessing `.reason` on the
    // unknown branch would fail tsc because `ErrorPathway` does not have
    // it.
    const result = visitPathway(unknownSample, {
      crash: () => 'never',
      timeout: () => 'never',
      feedbackCap: () => 'never',
      invalidTransition: () => 'never',
      unknown: (p) => p.reason,
    });
    expect(result).toBe('empty-store');
  });

  it('a visitor missing one key is a tsc error (@ts-expect-error)', () => {
    // @ts-expect-error — missing `unknown` key; the mapped-type visitor
    // requires every pathway kind. If this error disappears, the visitor's
    // exhaustiveness gate has regressed.
    const incomplete: PathwayVisitor<string> = {
      crash: () => 'c',
      timeout: () => 't',
      feedbackCap: () => 'f',
      invalidTransition: () => 'i',
      // unknown intentionally missing
    };
    // Keep the unused-var diagnostic silent without actually calling it.
    void incomplete;
    // A runtime assertion so the test body remains meaningful.
    expect(true).toBe(true);
  });
});
