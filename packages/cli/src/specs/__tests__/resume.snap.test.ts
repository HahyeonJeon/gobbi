/**
 * Snapshot tests for `compileResumePrompt` — five pathways + cache-stability
 * invariants.
 *
 * Each per-pathway test constructs a deterministic in-memory event store
 * seeded with the evidence `detectPathway` needs to classify the target
 * variant, then invokes `compileResumePrompt(state, store, { targetStep })`.
 * The fixture uses fixed ISO timestamps + fixed tool-call IDs so the store
 * assigns stable seqs in insertion order — snapshots are byte-stable
 * across runs on the same machine.
 *
 * Per-pathway snapshots assert:
 *
 *   - `prompt.text`                                   (rendered prompt).
 *   - `prompt.staticPrefixHash`                       (cache-prefix lock).
 *   - `prompt.sections.map(s => ({ id, kind }))`      (section layout).
 *
 * Cache-stability asserts (CP §3.2 invariants):
 *
 *   - Same pathway + same target → byte-identical `staticPrefixHash` + text.
 *   - Same pathway + different target → identical shared-role first-static
 *     `contentHash` (STATIC_ROLE_RESUME_RECOVERY is byte-stable) and
 *     identical overall `staticPrefixHash` (the pathway-specific preamble
 *     also does not reference the target — the target goes in the dynamic
 *     recap). Swapping the target step does NOT invalidate the cached
 *     prefix; only the dynamic recap changes.
 *   - All 5 resume pathways share the first-static `contentHash` — a single
 *     resume-surface cache bucket, distinct from the error-state bucket.
 *   - `options.targetStep` absent → compiler reads the most recent
 *     `workflow.resume` event's `data.targetStep`.
 *   - Both sources missing → compilation throws.
 */

import { describe, test, expect } from 'bun:test';

import { EventStore } from '../../workflow/store.js';
import { initialState } from '../../workflow/state.js';
import type { WorkflowState } from '../../workflow/state.js';
import { WORKFLOW_EVENTS } from '../../workflow/events/workflow.js';
import { DECISION_EVENTS } from '../../workflow/events/decision.js';

import { compileResumePrompt } from '../errors.js';

// ---------------------------------------------------------------------------
// Fixture helpers — deterministic event seeding (fixed ISO timestamps +
// fixed tool-call IDs). Mirrors the convention from `errors.test.ts` so
// the detector's classification logic is exercised via the same event
// shapes in snapshot + unit tests.
// ---------------------------------------------------------------------------

const SESSION_ID = 'resume-snap-test';

function errorState(overrides: Partial<WorkflowState> = {}): WorkflowState {
  return {
    ...initialState(SESSION_ID),
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
      sessionId: SESSION_ID,
      timestamp: '2026-01-01T00:00:00.000Z',
    }),
    actor: 'cli',
    parent_seq: null,
    idempotencyKind: 'tool-call',
    toolCallId,
    sessionId: SESSION_ID,
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
    sessionId: SESSION_ID,
  });
}

function seedInvalidTransition(
  store: EventStore,
  rejectedEventType = 'workflow.step.exit',
  stepAtRejection = 'plan',
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
      reducerMessage: 'Cannot exit plan before plan_eval decision',
      timestamp: ts,
    }),
    actor: 'cli',
    parent_seq: null,
    idempotencyKind: 'tool-call',
    toolCallId,
    sessionId: SESSION_ID,
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
    sessionId: SESSION_ID,
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
    sessionId: SESSION_ID,
  });
}

// ---------------------------------------------------------------------------
// Per-pathway fixtures — each seeds the evidence `detectPathway` needs to
// classify the target variant. `compileResumePrompt` calls `detectPathway`
// internally, so each fixture drives the compiler through the matching
// resume-branch of the visitor dispatch.
// ---------------------------------------------------------------------------

/**
 * Crash fixture — store has events (a start), but none trigger a specific
 * pathway probe: no timeout, no invalid-transition, no feedback-cap state.
 * `detectPathway` falls through to Crash. `stepAtCrash` derives from
 * `state.completedSteps` tail.
 */
function crashFixture(): { state: WorkflowState; store: EventStore } {
  const store = new EventStore(':memory:');
  seedStart(store);
  return {
    state: errorState({ completedSteps: ['ideation', 'plan'] }),
    store,
  };
}

/**
 * Timeout fixture — a `workflow.step.timeout` event with no newer resume
 * classifies Timeout.
 */
function timeoutFixture(): { state: WorkflowState; store: EventStore } {
  const store = new EventStore(':memory:');
  seedStart(store);
  seedTimeout(store, 'execution');
  return {
    state: errorState({ completedSteps: ['ideation', 'plan'] }),
    store,
  };
}

/**
 * FeedbackCap fixture — state at cap with trailing revise verdict +
 * a `decision.eval.verdict` event in the store. `detectPathway` classifies
 * FeedbackCap.
 */
function feedbackCapFixture(): {
  state: WorkflowState;
  store: EventStore;
} {
  const store = new EventStore(':memory:');
  seedStart(store);
  seedVerdict(store, 'revise', 'tc-v1', '2026-01-01T00:05:00.000Z');
  seedVerdict(store, 'revise', 'tc-v2', '2026-01-01T00:10:00.000Z');
  seedVerdict(store, 'revise', 'tc-v3', '2026-01-01T00:15:00.000Z');
  return {
    state: errorState({
      feedbackRound: 3,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: 'revise',
      completedSteps: ['ideation', 'plan'],
      evalConfig: { ideation: true, plan: false },
    }),
    store,
  };
}

/**
 * InvalidTransition fixture — a `workflow.invalid_transition` audit event
 * with no newer resume classifies InvalidTransition.
 */
function invalidTransitionFixture(): {
  state: WorkflowState;
  store: EventStore;
} {
  const store = new EventStore(':memory:');
  seedStart(store);
  seedInvalidTransition(store);
  return {
    state: errorState({ completedSteps: ['ideation'] }),
    store,
  };
}

/**
 * Unknown fixture — empty store → `detectPathway` returns Unknown with
 * `reason: 'empty-store'`. An explicit `targetStep` is mandatory because
 * no workflow.resume event is seeded.
 */
function unknownFixture(): { state: WorkflowState; store: EventStore } {
  return {
    state: errorState(),
    store: new EventStore(':memory:'),
  };
}

// ===========================================================================
// Per-pathway snapshot tests
// ===========================================================================

describe('resume — pathway-compiler snapshots', () => {
  test('crash resume compiles to a stable prompt', () => {
    const { state, store } = crashFixture();
    using s = store;
    const prompt = compileResumePrompt(state, s, { targetStep: 'plan' });
    expect(prompt.text).toMatchSnapshot();
    expect(prompt.staticPrefixHash).toMatchSnapshot();
    expect(prompt.sections.map((x) => ({ id: x.id, kind: x.kind }))).toMatchSnapshot();
  });

  test('timeout resume compiles to a stable prompt', () => {
    const { state, store } = timeoutFixture();
    using s = store;
    const prompt = compileResumePrompt(state, s, { targetStep: 'execution' });
    expect(prompt.text).toMatchSnapshot();
    expect(prompt.staticPrefixHash).toMatchSnapshot();
    expect(prompt.sections.map((x) => ({ id: x.id, kind: x.kind }))).toMatchSnapshot();
  });

  test('feedbackCap resume compiles to a stable prompt', () => {
    const { state, store } = feedbackCapFixture();
    using s = store;
    const prompt = compileResumePrompt(state, s, {
      targetStep: 'memorization',
    });
    expect(prompt.text).toMatchSnapshot();
    expect(prompt.staticPrefixHash).toMatchSnapshot();
    expect(prompt.sections.map((x) => ({ id: x.id, kind: x.kind }))).toMatchSnapshot();
  });

  test('invalidTransition resume compiles to a stable prompt', () => {
    const { state, store } = invalidTransitionFixture();
    using s = store;
    const prompt = compileResumePrompt(state, s, { targetStep: 'plan' });
    expect(prompt.text).toMatchSnapshot();
    expect(prompt.staticPrefixHash).toMatchSnapshot();
    expect(prompt.sections.map((x) => ({ id: x.id, kind: x.kind }))).toMatchSnapshot();
  });

  test('unknown resume compiles to a stable prompt', () => {
    const { state, store } = unknownFixture();
    using s = store;
    const prompt = compileResumePrompt(state, s, { targetStep: 'plan' });
    expect(prompt.text).toMatchSnapshot();
    expect(prompt.staticPrefixHash).toMatchSnapshot();
    expect(prompt.sections.map((x) => ({ id: x.id, kind: x.kind }))).toMatchSnapshot();
  });
});

// ===========================================================================
// Cache-stability invariants
// ===========================================================================

describe('resume — cache-stability invariants', () => {
  test('same pathway + same target → identical staticPrefixHash + text', () => {
    const { state, store } = timeoutFixture();
    using s = store;
    const a = compileResumePrompt(state, s, { targetStep: 'execution' });
    const b = compileResumePrompt(state, s, { targetStep: 'execution' });
    expect(a.staticPrefixHash).toBe(b.staticPrefixHash);
    expect(a.text).toBe(b.text);
  });

  test(
    'same pathway + different target → identical staticPrefixHash, divergent dynamic recap',
    () => {
      const { state, store } = timeoutFixture();
      using s = store;
      const a = compileResumePrompt(state, s, { targetStep: 'execution' });
      const b = compileResumePrompt(state, s, { targetStep: 'memorization' });

      const firstA = a.sections[0];
      const firstB = b.sections[0];
      if (firstA === undefined || firstB === undefined) {
        throw new Error('prompt has no sections');
      }
      // The shared role block is the first static of every resume prompt.
      // Its contentHash must be byte-stable across any target-step change.
      expect(firstA.kind).toBe('static');
      expect(firstA.id).toBe('resume.role');
      expect(firstB.id).toBe('resume.role');
      expect(firstA.contentHash).toBe(firstB.contentHash);

      // The overall staticPrefixHash is identical too — every static
      // section is target-agnostic (the target goes in the dynamic recap).
      // Load-bearing for cache efficiency: swapping the target step does
      // NOT invalidate the cached prefix.
      expect(a.staticPrefixHash).toBe(b.staticPrefixHash);

      // The dynamic recap (last section) differs — the target-entry
      // framing cites the specific target.
      expect(a.text).not.toBe(b.text);
      expect(a.text).toContain('transitioning from error into execution');
      expect(b.text).toContain('transitioning from error into memorization');
    },
  );

  test(
    'all 5 resume pathways share the first-static contentHash (shared role cache prefix)',
    () => {
      const crash = crashFixture();
      const timeout = timeoutFixture();
      const fc = feedbackCapFixture();
      const inv = invalidTransitionFixture();
      const unk = unknownFixture();

      using sCrash = crash.store;
      using sTimeout = timeout.store;
      using sFc = fc.store;
      using sInv = inv.store;
      using sUnk = unk.store;

      const prompts = [
        compileResumePrompt(crash.state, sCrash, { targetStep: 'plan' }),
        compileResumePrompt(timeout.state, sTimeout, {
          targetStep: 'execution',
        }),
        compileResumePrompt(fc.state, sFc, { targetStep: 'memorization' }),
        compileResumePrompt(inv.state, sInv, { targetStep: 'plan' }),
        compileResumePrompt(unk.state, sUnk, { targetStep: 'plan' }),
      ];

      const firstHashes = prompts.map((p) => {
        const first = p.sections[0];
        if (first === undefined) {
          throw new Error('prompt has no sections');
        }
        expect(first.kind).toBe('static');
        expect(first.id).toBe('resume.role');
        return first.contentHash;
      });

      expect(new Set(firstHashes).size).toBe(1);

      // Overall staticPrefixHash differs per pathway (role + pathway-
      // specific preamble) — same pattern as the error-state invariant
      // test in errors.snap.test.ts.
      const staticPrefixHashes = new Set(prompts.map((p) => p.staticPrefixHash));
      expect(staticPrefixHashes.size).toBe(prompts.length);
    },
  );

  test(
    'targetStep falls back to most recent workflow.resume event when option absent',
    () => {
      // Seed a crash-classified store (start event only) PLUS a resume
      // event carrying target='plan'. Because the resume seq > every
      // other seq, the detector's pathway probes each find their
      // evidence's seq <= resumeBoundary and fall through to Crash —
      // but the detector ALSO consumes the resume event's targetStep
      // via `compileResumePrompt`'s store-fallback path when
      // `options.targetStep` is absent.
      const store = new EventStore(':memory:');
      seedStart(store);
      seedResume(store, 'plan');
      using s = store;
      const state = errorState({ completedSteps: ['ideation', 'plan'] });
      const prompt = compileResumePrompt(state, s);
      expect(prompt.text).toContain('transitioning from error into plan');
    },
  );

  test('compileResumePrompt throws when targetStep missing and no resume event', () => {
    const state = errorState();
    using store = new EventStore(':memory:');
    expect(() => compileResumePrompt(state, store)).toThrow(
      /targetStep missing/,
    );
  });
});
