/**
 * Evaluation spec — end-to-end snapshot tests (B.1).
 *
 * Mirrors the Ideation A.7 capstone shape. The evaluation spec is reused
 * across `ideation_eval`, `plan_eval`, and `execution_eval` via index.json's
 * `evalFor` indirection — the spec content is step-agnostic, the fixtures
 * here model distinct preceding-step scenarios to prove the compile pipeline
 * renders the correct orchestrator prompt regardless of which eval step is
 * active.
 *
 * Three fixtures:
 *
 *   1. ideation-eval-first-entry — `currentStep = 'ideation_eval'`, first
 *                                  evaluation round, `feedbackRound = 0`.
 *                                  No conditionals fire. activeAgent is
 *                                  null (orchestrator framing view).
 *   2. project-evaluator-dispatch — orchestrator is about to dispatch the
 *                                   Project evaluator subagent for an
 *                                   `execution_eval` assessment. activeAgent
 *                                   = 'evaluator.project' inlines that
 *                                   delegation block.
 *   3. feedback-round-eval        — a later evaluation round on the same
 *                                   step. `feedbackRound = 1` fires the
 *                                   feedback-context conditional that tells
 *                                   each evaluator to compare against prior
 *                                   findings, not just the current state.
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
import { initialState } from '../../../workflow/state.js';
import type { WorkflowState } from '../../../workflow/state.js';
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
// ---------------------------------------------------------------------------

const FIXED_TIMESTAMP = '2026-04-16T12:00:00.000Z';

function ideationEvalFirstEntryFixture(spec: StepSpec): CompileInput {
  // currentStep is `ideation_eval`. Ideation completed; eval was enabled;
  // the workflow transitioned into ideation_eval. First round.
  const state: WorkflowState = {
    ...initialState('session-ideation-eval-first'),
    currentStep: 'ideation_eval',
    evalConfig: { ideation: true, plan: false },
    completedSteps: ['ideation'],
    artifacts: {
      ideation: ['innovative.md', 'best.md', 'ideation.md'],
    },
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [
      {
        name: 'ideation.md',
        content:
          'Direction: adopt the proven-pattern decomposition with one novel exit: cache-aware prompt assembly.',
      },
    ],
  };
  return { spec, state, dynamic, predicates, activeAgent: null };
}

function projectEvaluatorDispatchFixture(spec: StepSpec): CompileInput {
  // Orchestrator is in execution_eval and about to dispatch the Project
  // evaluator for the execution artifacts. Both evaluators are registered
  // in activeSubagents so the eval dispatch wave is visible.
  const state: WorkflowState = {
    ...initialState('session-exec-eval-dispatch'),
    currentStep: 'execution_eval',
    evalConfig: { ideation: false, plan: false },
    completedSteps: ['ideation', 'plan', 'execution'],
    activeSubagents: [
      {
        subagentId: 'subagent-project-eval',
        agentType: '_project-evaluator',
        step: 'execution_eval',
        spawnedAt: FIXED_TIMESTAMP,
      },
      {
        subagentId: 'subagent-overall-eval',
        agentType: '_project-evaluator',
        step: 'execution_eval',
        spawnedAt: FIXED_TIMESTAMP,
      },
    ],
    artifacts: {
      ideation: ['ideation.md'],
      plan: ['plan.md'],
      execution: ['execution.md'],
    },
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 2,
    artifacts: [],
  };
  return {
    spec,
    state,
    dynamic,
    predicates,
    activeAgent: 'evaluator.project',
  };
}

function feedbackRoundEvalFixture(spec: StepSpec): CompileInput {
  // Later evaluation round: the preceding step was revised after round 0,
  // and this evaluation must compare the revision against the prior round's
  // findings. `feedbackRound = 1` fires the feedback-context conditional.
  const state: WorkflowState = {
    ...initialState('session-plan-eval-round2'),
    currentStep: 'plan_eval',
    evalConfig: { ideation: false, plan: true },
    feedbackRound: 1,
    completedSteps: ['ideation', 'plan', 'plan_eval'],
    artifacts: {
      ideation: ['ideation.md'],
      plan: ['plan.md'],
      plan_eval: ['project.md', 'overall.md', 'evaluation.md'],
    },
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [
      {
        name: 'plan.md',
        content:
          'Direction: revised four-task decomposition with verification criteria tightened per prior-round evaluator feedback.',
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

describe('evaluation/spec.json — validation', () => {
  test('passes validateStepSpec (structural + cross-reference)', () => {
    const raw: unknown = JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
    const result = validateStepSpec(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.version).toBe(1);
      expect(result.value.delegation.agents).toHaveLength(2);
      expect(result.value.meta.maxParallelAgents).toBe(5);
      // Two minimum perspectives — Project and Overall.
      const roles = result.value.delegation.agents.map((a) => a.role);
      expect(roles).toEqual(['project', 'overall']);
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

  test('every AgentConfig.blockRef resolves to a blocks.delegation key', () => {
    const spec = loadSpec();
    const keys = new Set(Object.keys(spec.blocks.delegation));
    for (const agent of spec.delegation.agents) {
      expect(keys.has(agent.blockRef)).toBe(true);
    }
  });

  test('every expectedArtifact has a source: either an agent target or the synthesis output', () => {
    const spec = loadSpec();
    const agentTargets = new Set(
      spec.delegation.agents.map((a) => a.artifactTarget),
    );
    for (const artifact of spec.meta.expectedArtifacts) {
      const expected =
        agentTargets.has(artifact) || artifact === 'evaluation.md';
      expect(expected).toBe(true);
    }
  });

  test('completion signal is SubagentStop — evaluator subagents own the completion event', () => {
    const spec = loadSpec();
    expect(spec.meta.completionSignal).toBe('SubagentStop');
  });
});

// ===========================================================================
// Three-fixture snapshots — the PR B evaluation pipeline lock
// ===========================================================================

describe('evaluation — compile snapshots', () => {
  test('ideation-eval-first-entry — first evaluation of ideation artifacts', () => {
    const spec = loadSpec();
    const input = ideationEvalFirstEntryFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-checks: no conditional fires on a fresh first-round evaluation.
    expect(text).not.toContain('Feedback round context');
    // Role block DOES appear.
    expect(text).toContain('You are the orchestrator of an Evaluation step');
    // Delegation blocks are NOT included — activeAgent is null.
    expect(text).not.toContain('You are an evaluator working the Project');
    expect(text).not.toContain('You are an evaluator working the Overall');
  });

  test('project-evaluator-dispatch — orchestrator is about to dispatch the Project evaluator', () => {
    const spec = loadSpec();
    const input = projectEvaluatorDispatchFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-check: only the Project evaluator delegation block is inlined.
    expect(text).toContain('You are an evaluator working the Project perspective');
    // The Overall delegation block is NOT included in the same compile —
    // each evaluator is dispatched in its own compile call.
    expect(text).not.toContain('You are an evaluator working the Overall perspective');
  });

  test('feedback-round-eval — later round: compare revision against prior findings', () => {
    const spec = loadSpec();
    const input = feedbackRoundEvalFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-check: the feedback-context conditional fires with its
    // compare-against-prior-findings guidance.
    expect(text).toContain('Feedback round context');
    expect(text).toContain('did the revision actually address');
  });
});

// ===========================================================================
// Byte-level stability — two compiles must produce identical output
// ===========================================================================

describe('evaluation — compile stability', () => {
  test('ideation-eval-first-entry fixture compiles to identical output twice', () => {
    const spec = loadSpec();
    const a = compileGenerous(ideationEvalFirstEntryFixture(spec));
    const b = compileGenerous(ideationEvalFirstEntryFixture(spec));
    expect(a).toBe(b);
  });

  test('contentHash and staticPrefixHash are stable across repeat compiles', () => {
    const spec = loadSpec();
    const input = ideationEvalFirstEntryFixture(spec);
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
