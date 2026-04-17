/**
 * Snapshot tests for the 5 error-state pathway compilers.
 *
 * Each test constructs a deterministic pathway fixture + WorkflowState +
 * in-memory EventStore, compiles via the per-pathway compiler, and snapshots:
 *
 *   - `prompt.text`                                      (rendered prompt).
 *   - `prompt.staticPrefixHash`                          (cache-prefix lock).
 *   - `prompt.sections.map(s => ({ id, kind }))`         (section layout).
 *
 * A cross-pathway invariant test locks the shared-role cache prefix: the
 * first `StaticSection`'s `contentHash` must be identical across all 5
 * compiled prompts, because every compiler puts `STATIC_ROLE_ERROR_RECOVERY`
 * first.
 *
 * Fixtures are deterministic (fixed ISO timestamps; no `new Date()`) so the
 * snapshot output is byte-stable across runs. The store is in-memory —
 * compilers never read from it today (the current pathway compilers derive
 * all text from the pathway + state), but the parameter is wired through
 * because D.3's dispatcher passes it and because future compiler bodies
 * may consume additional store data without a signature change.
 */

import { describe, test, expect } from 'bun:test';

import { EventStore } from '../../workflow/store.js';
import { initialState } from '../../workflow/state.js';
import type { WorkflowState } from '../../workflow/state.js';

import type {
  ErrorPathwayCrash,
  ErrorPathwayTimeout,
  ErrorPathwayFeedbackCap,
  ErrorPathwayInvalidTransition,
  ErrorPathwayUnknown,
} from '../errors.js';
import {
  compileCrashPrompt,
  compileTimeoutPrompt,
  compileFeedbackCapPrompt,
  compileInvalidTransitionPrompt,
  compileUnknownPrompt,
} from '../errors.pathway-compilers.js';

// ---------------------------------------------------------------------------
// Shared state + store fixture factories
// ---------------------------------------------------------------------------

function errorState(overrides: Partial<WorkflowState> = {}): WorkflowState {
  return {
    ...initialState('errors-snap-test'),
    currentStep: 'error',
    ...overrides,
  };
}

function emptyStore(): EventStore {
  // In-memory SQLite — no fixture seeding; current compilers do not consume
  // store rows. Tests that want store-derived evidence build their pathway
  // fixture directly and pass the empty store in.
  return new EventStore(':memory:');
}

// ---------------------------------------------------------------------------
// Per-pathway fixtures — deterministic payloads. The pathway fields are what
// `detectPathway` would emit for the seeded scenario; each test constructs
// them directly rather than running the detector so the snapshot captures
// the compiler output alone.
// ---------------------------------------------------------------------------

const CRASH_PATHWAY: ErrorPathwayCrash = {
  kind: 'crash',
  stepAtCrash: 'execution',
  lastEventSeqs: [42, 41, 40, 39, 38],
  heartbeatEventSeq: 37,
};

const CRASH_STATE: WorkflowState = errorState({
  completedSteps: ['ideation', 'plan'],
});

const TIMEOUT_PATHWAY: ErrorPathwayTimeout = {
  kind: 'timeout',
  timedOutStep: 'execution',
  elapsedMs: 300_000,
  configuredTimeoutMs: 120_000,
  timeoutEventSeq: 17,
  inProgressArtifacts: ['subtasks/01-foundation.json', 'execution.md'],
};

const TIMEOUT_STATE: WorkflowState = errorState({
  completedSteps: ['ideation', 'plan'],
});

const FEEDBACK_CAP_PATHWAY: ErrorPathwayFeedbackCap = {
  kind: 'feedbackCap',
  feedbackRound: 3,
  maxFeedbackRounds: 3,
  verdictHistory: [
    {
      round: 1,
      verdict: 'revise',
      verdictSeq: 12,
      loopTarget: 'execution',
      evaluatorId: 'eval-project',
    },
    {
      round: 2,
      verdict: 'revise',
      verdictSeq: 18,
      loopTarget: 'execution',
      evaluatorId: 'eval-project',
    },
    {
      round: 3,
      verdict: 'revise',
      verdictSeq: 24,
      loopTarget: 'execution',
      evaluatorId: 'eval-overall',
    },
  ],
  finalRoundArtifacts: ['execution.md', 'execution/subtasks/01-final.json'],
};

const FEEDBACK_CAP_STATE: WorkflowState = errorState({
  feedbackRound: 3,
  maxFeedbackRounds: 3,
  lastVerdictOutcome: 'revise',
  completedSteps: ['ideation', 'plan'],
  evalConfig: { ideation: true, plan: false },
});

const INVALID_TRANSITION_PATHWAY: ErrorPathwayInvalidTransition = {
  kind: 'invalidTransition',
  rejectedEventType: 'workflow.step.exit',
  rejectedEventSeq: null,
  stepAtRejection: 'plan',
  reducerMessage: 'Cannot exit plan before plan_eval decision',
  invalidTransitionEventSeq: 31,
};

const INVALID_TRANSITION_STATE: WorkflowState = errorState({
  completedSteps: ['ideation'],
});

const UNKNOWN_PATHWAY: ErrorPathwayUnknown = {
  kind: 'unknown',
  reason: 'empty-store',
  diagnosticHint:
    'The event store is empty — state.json appears to have been manually written into the error step without any triggering event.',
};

const UNKNOWN_STATE: WorkflowState = errorState();

// ===========================================================================
// Per-pathway snapshot tests
// ===========================================================================

describe('errors — pathway-compiler snapshots', () => {
  test('crash pathway compiles to a stable prompt', () => {
    using store = emptyStore();
    const prompt = compileCrashPrompt(CRASH_PATHWAY, CRASH_STATE, store);
    expect(prompt.text).toMatchSnapshot();
    expect(prompt.staticPrefixHash).toMatchSnapshot();
    expect(prompt.sections.map((s) => ({ id: s.id, kind: s.kind }))).toMatchSnapshot();
  });

  test('timeout pathway compiles to a stable prompt', () => {
    using store = emptyStore();
    const prompt = compileTimeoutPrompt(TIMEOUT_PATHWAY, TIMEOUT_STATE, store);
    expect(prompt.text).toMatchSnapshot();
    expect(prompt.staticPrefixHash).toMatchSnapshot();
    expect(prompt.sections.map((s) => ({ id: s.id, kind: s.kind }))).toMatchSnapshot();
  });

  test('feedbackCap pathway compiles to a stable prompt', () => {
    using store = emptyStore();
    const prompt = compileFeedbackCapPrompt(
      FEEDBACK_CAP_PATHWAY,
      FEEDBACK_CAP_STATE,
      store,
    );
    expect(prompt.text).toMatchSnapshot();
    expect(prompt.staticPrefixHash).toMatchSnapshot();
    expect(prompt.sections.map((s) => ({ id: s.id, kind: s.kind }))).toMatchSnapshot();
  });

  test('invalidTransition pathway compiles to a stable prompt', () => {
    using store = emptyStore();
    const prompt = compileInvalidTransitionPrompt(
      INVALID_TRANSITION_PATHWAY,
      INVALID_TRANSITION_STATE,
      store,
    );
    expect(prompt.text).toMatchSnapshot();
    expect(prompt.staticPrefixHash).toMatchSnapshot();
    expect(prompt.sections.map((s) => ({ id: s.id, kind: s.kind }))).toMatchSnapshot();
  });

  test('unknown pathway compiles to a stable prompt', () => {
    using store = emptyStore();
    const prompt = compileUnknownPrompt(UNKNOWN_PATHWAY, UNKNOWN_STATE, store);
    expect(prompt.text).toMatchSnapshot();
    expect(prompt.staticPrefixHash).toMatchSnapshot();
    expect(prompt.sections.map((s) => ({ id: s.id, kind: s.kind }))).toMatchSnapshot();
  });
});

// ===========================================================================
// Cross-pathway cache-prefix invariant
// ===========================================================================

describe('errors — cross-pathway invariants', () => {
  test('all 5 compilers emit the same first-static contentHash (shared role cache prefix)', () => {
    using store = emptyStore();
    const prompts = [
      compileCrashPrompt(CRASH_PATHWAY, CRASH_STATE, store),
      compileTimeoutPrompt(TIMEOUT_PATHWAY, TIMEOUT_STATE, store),
      compileFeedbackCapPrompt(
        FEEDBACK_CAP_PATHWAY,
        FEEDBACK_CAP_STATE,
        store,
      ),
      compileInvalidTransitionPrompt(
        INVALID_TRANSITION_PATHWAY,
        INVALID_TRANSITION_STATE,
        store,
      ),
      compileUnknownPrompt(UNKNOWN_PATHWAY, UNKNOWN_STATE, store),
    ];

    // Every compiler places STATIC_ROLE_ERROR_RECOVERY first; that first
    // static section's contentHash must be identical across all 5 prompts.
    const firstStaticHashes = prompts.map((p) => {
      const first = p.sections[0];
      if (first === undefined) {
        throw new Error('prompt has no sections');
      }
      expect(first.kind).toBe('static');
      expect(first.id).toBe('error.role');
      return first.contentHash;
    });

    const uniqueHashes = new Set(firstStaticHashes);
    expect(uniqueHashes.size).toBe(1);

    // Each pathway ALSO has a distinct static prefix overall (role + per-
    // pathway preamble), so `staticPrefixHash` differs between pathways.
    const staticPrefixHashes = new Set(prompts.map((p) => p.staticPrefixHash));
    expect(staticPrefixHashes.size).toBe(prompts.length);
  });
});
