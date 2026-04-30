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
import { initialState } from '../../workflow/state-derivation.js';
import type { WorkflowState } from '../../workflow/state-derivation.js';
import { WORKFLOW_EVENTS } from '../../workflow/events/workflow.js';
import { DECISION_EVENTS } from '../../workflow/events/decision.js';
import { SESSION_EVENTS } from '../../workflow/events/session.js';

import {
  compileResumePrompt,
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

// ===========================================================================
// compileResumePrompt — targetStep fallback path (L10 criterion 11)
//
// `compileResumePrompt(state, store, options)` uses `options.targetStep`
// when present and otherwise falls back to the most recent
// `workflow.resume` event's `data.targetStep` via
// `store.lastN('workflow.resume', 1)`. `resume.ts` always passes an
// explicit target, so the fallback path is only exercised by tests —
// these three cases document the branch's contract: success, missing
// resume event, and malformed event data.
// ===========================================================================

describe('compileResumePrompt — targetStep fallback', () => {
  it('reads targetStep from the most recent workflow.resume event when options.targetStep is undefined', () => {
    // Store has a crash-classifiable event trail (just start) plus a
    // resume event carrying targetStep='plan'. Caller passes
    // { targetStep: undefined } — the compiler must fall back to the
    // store event's data.targetStep and render the target block for
    // 'plan'.
    using store = new EventStore(':memory:');
    seedStart(store);
    seedResume(store, 'plan');

    const state = errorState({ completedSteps: ['ideation'] });
    const prompt = compileResumePrompt(state, store, { targetStep: undefined });

    expect(prompt.text).toContain('transitioning from error into plan');
  });

  it('throws a descriptive error when options.targetStep is undefined and no workflow.resume event exists in store', () => {
    // No resume event seeded and no explicit override — the fallback
    // has nothing to read. The compiler throws a caller-wiring-bug
    // message naming both recovery paths.
    using store = new EventStore(':memory:');

    expect(() => compileResumePrompt(errorState(), store, { targetStep: undefined })).toThrow(
      /compileResumePrompt: targetStep missing/,
    );
  });

  it('throws when a workflow.resume event exists but its data.targetStep is missing (malformed event)', () => {
    // Malformed fallback payload — a resume event whose data object
    // omits the `targetStep` field entirely (simulating an older
    // schema version or a faulty producer). The compiler falls through
    // past the string-length guard and throws the same descriptive
    // error as the missing-event case.
    using store = new EventStore(':memory:');
    seedStart(store);
    // Deliberate exception to the research §E.12 recommendation "Do NOT use
    // raw `store.append`; use `appendEventAndUpdateState` or existing seed
    // helpers." This test's purpose IS to simulate a corrupted/malformed
    // `workflow.resume` event reaching the store — precisely the case the
    // reducer-validating `appendEventAndUpdateState` path would reject
    // before it could be written. Raw `store.append` is the only seeder
    // that can deposit a payload the reducer would refuse, so the
    // resolveResumeTargetStep fallback guard can be exercised against it.
    // Do not "clean this up" by routing through the validating wrapper.
    store.append({
      ts: '2026-01-01T00:20:00.000Z',
      type: WORKFLOW_EVENTS.RESUME,
      step: null,
      // Intentionally omit targetStep; fromError stays so the payload
      // round-trips as valid JSON but fails the typeof+length guard
      // inside resolveResumeTargetStep.
      data: JSON.stringify({ fromError: true }),
      actor: 'cli',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-resume-malformed',
      sessionId: 'detect-pathway-test',
    });

    expect(() => compileResumePrompt(errorState(), store, { targetStep: undefined })).toThrow(
      /compileResumePrompt: targetStep missing/,
    );
  });
});

// ===========================================================================
// compileResumePrompt — class-specific diagnostic messages (#94)
//
// `resolveResumeTargetStep` distinguishes six failure classes so operators
// can root-cause without attaching a debugger:
//
//   - Options-empty: caller passed `options.targetStep: ''`.
//   - Class A: no workflow.resume event AND no options.targetStep override.
//   - Class B: event exists, `data.targetStep` field is absent.
//   - Class C: event exists, `data.targetStep` is not a string.
//   - Class D: event exists, `data.targetStep` is `''`.
//   - Class E: event exists, `data` is not valid JSON.
//
// Every class's message starts with `compileResumePrompt: targetStep missing`
// so the pre-existing regex tests in the "targetStep fallback" suite above
// still match (backward-compatible with fallback assertions) — the suffix
// after the em-dash discriminates the class.
// ===========================================================================

describe('compileResumePrompt — class-specific diagnostic messages (#94)', () => {
  it('Class A: throws a no-event diagnostic when store has no workflow.resume event and options.targetStep is undefined', () => {
    using store = new EventStore(':memory:');

    expect(() => compileResumePrompt(errorState(), store, { targetStep: undefined })).toThrow(
      /no workflow\.resume event found in store; append one or pass options\.targetStep/,
    );
  });

  it('Class B: throws a missing-field diagnostic when workflow.resume event data omits targetStep', () => {
    using store = new EventStore(':memory:');
    seedStart(store);
    // Raw store.append bypasses the validating reducer path to deposit a
    // payload the normal pipeline would refuse — the same approach the
    // existing malformed-event fallback test uses. See comment at
    // resolveResumeTargetStep for why the deliberate bypass is necessary.
    store.append({
      ts: '2026-01-01T00:20:00.000Z',
      type: WORKFLOW_EVENTS.RESUME,
      step: null,
      // targetStep intentionally omitted — payload is valid JSON, shape
      // exercises Class B.
      data: JSON.stringify({ fromError: true }),
      actor: 'cli',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-resume-class-b',
      sessionId: 'detect-pathway-test',
    });

    expect(() => compileResumePrompt(errorState(), store, { targetStep: undefined })).toThrow(
      /workflow\.resume event is missing the targetStep field/,
    );
  });

  it('Class C: throws a non-string diagnostic naming the observed type when targetStep is the wrong type', () => {
    using store = new EventStore(':memory:');
    seedStart(store);
    store.append({
      ts: '2026-01-01T00:20:00.000Z',
      type: WORKFLOW_EVENTS.RESUME,
      step: null,
      // targetStep is a number — simulates a producer that forgot to
      // serialize a step enum as its canonical string form.
      data: JSON.stringify({ targetStep: 42, fromError: true }),
      actor: 'cli',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-resume-class-c',
      sessionId: 'detect-pathway-test',
    });

    expect(() => compileResumePrompt(errorState(), store, { targetStep: undefined })).toThrow(
      /workflow\.resume event targetStep must be a string \(got number\)/,
    );
  });

  it('Class D: throws an empty-string diagnostic when targetStep is the empty string', () => {
    using store = new EventStore(':memory:');
    seedStart(store);
    store.append({
      ts: '2026-01-01T00:20:00.000Z',
      type: WORKFLOW_EVENTS.RESUME,
      step: null,
      data: JSON.stringify({ targetStep: '', fromError: true }),
      actor: 'cli',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-resume-class-d',
      sessionId: 'detect-pathway-test',
    });

    expect(() => compileResumePrompt(errorState(), store, { targetStep: undefined })).toThrow(
      /workflow\.resume event targetStep is an empty string/,
    );
  });

  it('Class E: throws a malformed-JSON diagnostic when the resume event data column is not valid JSON', () => {
    using store = new EventStore(':memory:');
    seedStart(store);
    store.append({
      ts: '2026-01-01T00:20:00.000Z',
      type: WORKFLOW_EVENTS.RESUME,
      step: null,
      // Not valid JSON — a corrupted/hand-edited row. The reducer path
      // would never emit this (factories use JSON.stringify), but raw
      // store.append is unchecked, which is the point of exercising this
      // class distinctly from class A.
      data: 'this is not valid json {',
      actor: 'cli',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-resume-class-e',
      sessionId: 'detect-pathway-test',
    });

    expect(() => compileResumePrompt(errorState(), store, { targetStep: undefined })).toThrow(
      /workflow\.resume event data is not valid JSON/,
    );
  });

  it('Options-empty: throws an options-is-empty-string diagnostic when the caller passes options.targetStep = ""', () => {
    // Symmetric with class D on the store path. The caller-supplied
    // override is honored as-is for non-empty strings (no store lookup),
    // so this case would otherwise slip past into the prompt body.
    using store = new EventStore(':memory:');

    expect(() => compileResumePrompt(errorState(), store, { targetStep: '' })).toThrow(
      /options\.targetStep is an empty string/,
    );
  });

  it('discriminates classes: each class produces a distinct suffix after the shared "targetStep missing" prefix', () => {
    // Meta-assertion: the six malformed-input classes must produce six
    // distinct diagnostic strings. If a future refactor collapses any
    // two, this test fails before the downstream per-class tests do.
    const collect = (thunk: () => void): string => {
      try {
        thunk();
      } catch (err) {
        return err instanceof Error ? err.message : String(err);
      }
      throw new Error('expected thunk to throw');
    };

    using storeA = new EventStore(':memory:');
    const msgA = collect(() =>
      compileResumePrompt(errorState(), storeA, { targetStep: undefined }),
    );

    using storeB = new EventStore(':memory:');
    seedStart(storeB);
    storeB.append({
      ts: '2026-01-01T00:20:00.000Z',
      type: WORKFLOW_EVENTS.RESUME,
      step: null,
      data: JSON.stringify({ fromError: true }),
      actor: 'cli',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-meta-b',
      sessionId: 'detect-pathway-test',
    });
    const msgB = collect(() =>
      compileResumePrompt(errorState(), storeB, { targetStep: undefined }),
    );

    using storeC = new EventStore(':memory:');
    seedStart(storeC);
    storeC.append({
      ts: '2026-01-01T00:20:00.000Z',
      type: WORKFLOW_EVENTS.RESUME,
      step: null,
      data: JSON.stringify({ targetStep: 7, fromError: true }),
      actor: 'cli',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-meta-c',
      sessionId: 'detect-pathway-test',
    });
    const msgC = collect(() =>
      compileResumePrompt(errorState(), storeC, { targetStep: undefined }),
    );

    using storeD = new EventStore(':memory:');
    seedStart(storeD);
    storeD.append({
      ts: '2026-01-01T00:20:00.000Z',
      type: WORKFLOW_EVENTS.RESUME,
      step: null,
      data: JSON.stringify({ targetStep: '', fromError: true }),
      actor: 'cli',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-meta-d',
      sessionId: 'detect-pathway-test',
    });
    const msgD = collect(() =>
      compileResumePrompt(errorState(), storeD, { targetStep: undefined }),
    );

    using storeE = new EventStore(':memory:');
    seedStart(storeE);
    storeE.append({
      ts: '2026-01-01T00:20:00.000Z',
      type: WORKFLOW_EVENTS.RESUME,
      step: null,
      data: '}{ not json',
      actor: 'cli',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: 'tc-meta-e',
      sessionId: 'detect-pathway-test',
    });
    const msgE = collect(() =>
      compileResumePrompt(errorState(), storeE, { targetStep: undefined }),
    );

    using storeOpts = new EventStore(':memory:');
    const msgOpts = collect(() =>
      compileResumePrompt(errorState(), storeOpts, { targetStep: '' }),
    );

    const messages = [msgA, msgB, msgC, msgD, msgE, msgOpts];

    // All six must share the orientation prefix so the existing
    // `/compileResumePrompt: targetStep missing/` regexes still match.
    for (const m of messages) {
      expect(m).toMatch(/^compileResumePrompt: targetStep missing/);
    }

    // All six must be pairwise distinct — no silent collapse.
    const unique = new Set(messages);
    expect(unique.size).toBe(messages.length);
  });
});
