/**
 * Memorization spec — end-to-end snapshot tests (B.1).
 *
 * Mirrors the Ideation A.7 capstone shape. Memorization is orchestrator-
 * authored and terminal — its single transition routes to `done` on the
 * `always` predicate. The fixtures model three session-completion shapes
 * the memorization prompt must handle.
 *
 * Three fixtures:
 *
 *   1. first-entry                — clean session completion: ideation,
 *                                   plan, execution, and execution_eval all
 *                                   passed on the first round. No
 *                                   conditionals fire.
 *   2. post-feedback-convergence — the session hit at least one feedback
 *                                   round but converged before the cap.
 *                                   `feedbackRound = 2 < maxFeedbackRounds`
 *                                   — the force-memorization conditional
 *                                   stays out.
 *   3. force-memorization        — the session hit the feedback cap
 *                                   (`feedbackRound == maxFeedbackRounds`)
 *                                   and the user invoked
 *                                   `gobbi workflow resume --force-memorization`
 *                                   to persist partial work. The
 *                                   `force-memorization-context` conditional
 *                                   fires.
 *
 * Snapshot files land in `./__snapshots__/snapshot.test.ts.snap` next to
 * this file and are committed — they ARE the assertion. Re-generate
 * intentional changes with `bun test --update-snapshots`.
 */

import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  compile,
  type CompileInput,
  type CompilePredicateRegistry,
  type DynamicContext,
} from '../../assembly.js';
import { defaultBudgetAllocator } from '../../budget.js';
import { validateStepSpec } from '../../_schema/v1.js';
import { initialState } from '../../../workflow/state-derivation.js';
import type { WorkflowState } from '../../../workflow/state-derivation.js';
import { defaultPredicates } from '../../../workflow/predicates.js';
import type { StepSpec } from '../../types.js';

// ---------------------------------------------------------------------------
// Spec loading — read the JSON file at test-start, validate once, reuse.
// ---------------------------------------------------------------------------

const HERE = dirname(fileURLToPath(import.meta.url));
const SPEC_PATH = resolve(HERE, '..', 'spec.json');

function loadSpec(): StepSpec {
  const raw: unknown = JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
  const result = validateStepSpec(raw);
  if (!result.ok) {
    throw new Error(
      `spec.json failed validation: ${JSON.stringify(result.errors, null, 2)}`,
    );
  }
  return result.value;
}

const predicates: CompilePredicateRegistry = defaultPredicates;

// ---------------------------------------------------------------------------
// Fixture constructors
//
// Memorization is orchestrator-only — `activeAgent` is always `null`.
// ---------------------------------------------------------------------------

const FIXED_TIMESTAMP = '2026-04-16T12:00:00.000Z';

function firstEntryFixture(spec: StepSpec): CompileInput {
  // Clean completion: every prior step completed on round 0.
  const state: WorkflowState = {
    ...initialState('session-memo-first'),
    currentStep: 'memorization',
    evalConfig: { ideation: false, planning: false },
    completedSteps: ['ideation', 'planning', 'execution', 'execution_eval'],
    artifacts: {
      ideation: ['innovative.md', 'best.md', 'ideation.md'],
      planning: ['plan.md'],
      execution: ['execution.md'],
      execution_eval: ['project.md', 'overall.md', 'evaluation.md'],
    },
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [
      {
        name: 'evaluation.md',
        content:
          'Verdict: pass. No critical or major findings; three minor notes deferred to the next session.',
      },
    ],
  };
  return { spec, state, dynamic, predicates, activeAgent: null };
}

function postFeedbackConvergenceFixture(spec: StepSpec): CompileInput {
  // Session converged after two feedback rounds but before the cap.
  // `feedbackRound < maxFeedbackRounds` keeps the force-memorization
  // conditional OUT — this is a clean memorization after a bumpy session.
  const state: WorkflowState = {
    ...initialState('session-memo-converged'),
    currentStep: 'memorization',
    evalConfig: { ideation: false, planning: false },
    completedSteps: ['ideation', 'planning', 'execution', 'execution_eval'],
    feedbackRound: 2,
    artifacts: {
      ideation: ['ideation.md'],
      planning: ['plan.md'],
      execution: ['execution.md'],
      execution_eval: ['project.md', 'overall.md', 'evaluation.md'],
    },
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [
      {
        name: 'evaluation.md',
        content:
          'Verdict: pass on round 2. Round 0 revise targeted plan; round 1 revise targeted execution; round 2 converged.',
      },
    ],
  };
  return { spec, state, dynamic, predicates, activeAgent: null };
}

function forceMemorizationFixture(spec: StepSpec): CompileInput {
  // `feedbackRound == maxFeedbackRounds` fires `feedbackCapExceeded`, which
  // gates the force-memorization conditional. Session entered memorization
  // via `gobbi workflow resume --force-memorization`.
  const state: WorkflowState = {
    ...initialState('session-memo-forced'),
    currentStep: 'memorization',
    evalConfig: { ideation: false, planning: false },
    completedSteps: [
      'ideation',
      'planning',
      'execution',
      'execution_eval',
      'error',
    ],
    feedbackRound: 3,
    maxFeedbackRounds: 3,
    artifacts: {
      ideation: ['ideation.md'],
      planning: ['plan.md'],
      execution: ['execution.md'],
      execution_eval: ['project.md', 'overall.md', 'evaluation.md'],
    },
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [
      {
        name: 'evaluation.md',
        content:
          'Verdict: revise on round 3 (cap). loopTarget: execution. Feedback cap exceeded; workflow routed to error; user force-memorized.',
      },
    ],
  };
  return { spec, state, dynamic, predicates, activeAgent: null };
}

// ---------------------------------------------------------------------------
// Compile helper — generous window, default allocator
// ---------------------------------------------------------------------------

const GENEROUS_WINDOW = 200_000;

function compileGenerous(input: CompileInput): string {
  const prompt = compile(input, {
    allocator: defaultBudgetAllocator,
    contextWindowTokens: GENEROUS_WINDOW,
  });
  return prompt.text;
}

// ===========================================================================
// Spec validity — A.6's `validateStepSpec` must accept this file
// ===========================================================================

describe('memorization/spec.json — validation', () => {
  test('passes validateStepSpec (structural + cross-reference)', () => {
    const raw: unknown = JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
    const result = validateStepSpec(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.version).toBe(1);
      expect(result.value.meta.expectedArtifacts).toEqual(['memorization.md']);
      // Orchestrator-only: no delegated agents.
      expect(result.value.delegation.agents).toHaveLength(0);
      expect(result.value.meta.allowedAgentTypes).toEqual([]);
    }
  });

  test('tokenBudget proportions sum to 1.0 within tolerance', () => {
    const spec = loadSpec();
    const { staticPrefix, session, instructions, artifacts, materials } =
      spec.tokenBudget;
    const sum =
      staticPrefix + session + instructions + artifacts + materials;
    expect(Math.abs(sum - 1)).toBeLessThan(1e-6);
  });

  test('blocks.delegation is empty — orchestrator-only step', () => {
    const spec = loadSpec();
    expect(Object.keys(spec.blocks.delegation)).toEqual([]);
  });

  test('completion signal is Stop — no subagent owns the completion event', () => {
    const spec = loadSpec();
    expect(spec.meta.completionSignal).toBe('Stop');
  });

  test('transitions include exactly one always-routing exit to handoff', () => {
    const spec = loadSpec();
    expect(spec.transitions).toHaveLength(1);
    const transition = spec.transitions[0];
    // Wave A.1.5 promoted handoff to a true state-machine step; memorization
    // now exits to handoff (which itself exits to done via workflow.finish).
    expect(transition?.to).toBe('handoff');
    expect(transition?.condition).toBe('always');
  });
});

// ===========================================================================
// Three-fixture snapshots — the PR B memorization pipeline lock
// ===========================================================================

describe('memorization — compile snapshots', () => {
  test('first-entry — clean session completion, no feedback rounds', () => {
    const spec = loadSpec();
    const input = firstEntryFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-checks: force-memorization conditional stays out.
    expect(text).not.toContain('Force-memorization recovery context');
    // Role block DOES appear.
    expect(text).toContain('You are the orchestrator of the Memorization step');
  });

  test('post-feedback-convergence — session bumped through feedback rounds but converged before cap', () => {
    const spec = loadSpec();
    const input = postFeedbackConvergenceFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-check: force-memorization conditional stays out because
    // `feedbackRound < maxFeedbackRounds`.
    expect(text).not.toContain('Force-memorization recovery context');
  });

  test('force-memorization — session hit the feedback cap and user force-memorized partial work', () => {
    const spec = loadSpec();
    const input = forceMemorizationFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-check: the force-memorization conditional fires.
    expect(text).toContain('Force-memorization recovery context');
    expect(text).toContain('partial record');
  });
});

// ===========================================================================
// Byte-level stability — two compiles must produce identical output
// ===========================================================================

describe('memorization — compile stability', () => {
  test('first-entry fixture compiles to identical output twice', () => {
    const spec = loadSpec();
    const a = compileGenerous(firstEntryFixture(spec));
    const b = compileGenerous(firstEntryFixture(spec));
    expect(a).toBe(b);
  });

  test('contentHash and staticPrefixHash are stable across repeat compiles', () => {
    const spec = loadSpec();
    const input = firstEntryFixture(spec);
    const a = compile(input, {
      allocator: defaultBudgetAllocator,
      contextWindowTokens: GENEROUS_WINDOW,
    });
    const b = compile(input, {
      allocator: defaultBudgetAllocator,
      contextWindowTokens: GENEROUS_WINDOW,
    });
    expect(a.contentHash).toBe(b.contentHash);
    expect(a.staticPrefixHash).toBe(b.staticPrefixHash);
    expect(a.contentHash).toMatch(/^[0-9a-f]{64}$/);
    expect(a.staticPrefixHash).toMatch(/^[0-9a-f]{64}$/);
  });
});
