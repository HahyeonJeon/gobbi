/**
 * Plan spec — end-to-end snapshot tests (B.1).
 *
 * Mirrors the Ideation A.7 capstone shape: each test compiles `../spec.json`
 * against a distinct `WorkflowState` + `DynamicContext` + predicate registry
 * and captures the resulting `CompiledPrompt` via bun:test's
 * `toMatchSnapshot()`.
 *
 * Three fixtures:
 *
 *   1. first-entry            — brand new session entering plan fresh, eval
 *                               disabled (`evalConfig.plan = false`). No
 *                               conditionals fire.
 *   2. evaluation-enabled     — user opted into plan evaluation at session
 *                               start. The `evaluation-deciding` conditional
 *                               fires to remind the orchestrator the eval
 *                               decision is locked.
 *   3. feedback-round         — a prior `plan_eval` returned revise and the
 *                               workflow has looped back to plan. The
 *                               `feedback-context` conditional fires.
 *
 * Also verifies:
 *
 *   - The spec passes A.6's `validateStepSpec()` — structural + cross-ref.
 *     Plan has zero delegation agents, so the blockRef cross-reference is
 *     trivially satisfied.
 *   - Two compiles with identical inputs produce byte-identical output
 *     (static-prefix stability for the Anthropic cache).
 *
 * Snapshot files land in `./__snapshots__/snapshot.test.ts.snap` next to this
 * file and are committed — they ARE the assertion. Re-generate intentional
 * changes with `bun test --update-snapshots`.
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
//
// Plan is orchestrator-only — `activeAgent` is always `null` because
// `blocks.delegation` is empty. Fixed timestamp is pinned; any dynamic
// value in the compiled output would poison snapshot stability.
// ---------------------------------------------------------------------------

const FIXED_TIMESTAMP = '2026-04-16T12:00:00.000Z';

function firstEntryFixture(spec: StepSpec): CompileInput {
  // First entry: user declined plan evaluation at session start
  // (`evalConfig.plan = false`). `evalPlanEnabled` does NOT fire, so the
  // `evaluation-deciding` conditional stays out. `feedbackRound = 0` keeps
  // `feedbackRoundActive` out too.
  const state: WorkflowState = {
    ...initialState('session-plan-first'),
    currentStep: 'plan',
    evalConfig: { ideation: false, plan: false },
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
          'Direction: adopt the proven-pattern decomposition with one novel exit: use cache-aware section ordering for prompt assembly.',
      },
    ],
  };
  return { spec, state, dynamic, predicates, activeAgent: null };
}

function evaluationEnabledFixture(spec: StepSpec): CompileInput {
  // User enabled plan evaluation at session start. `evalPlanEnabled` fires
  // the pre-exit reminder conditional.
  const state: WorkflowState = {
    ...initialState('session-plan-eval'),
    currentStep: 'plan',
    evalConfig: { ideation: false, plan: true },
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
          'Direction: ship the four remaining step specs plus a skill-injection fixture per the plan-ahead evaluation guidance.',
      },
    ],
  };
  return { spec, state, dynamic, predicates, activeAgent: null };
}

function feedbackRoundFixture(spec: StepSpec): CompileInput {
  // A prior plan_eval returned revise (or an execution_eval loop-targeted
  // plan). `feedbackRoundActive` fires the feedback-context conditional.
  // Eval stays disabled here — the loop-back does not change `evalConfig`.
  const state: WorkflowState = {
    ...initialState('session-plan-feedback'),
    currentStep: 'plan',
    evalConfig: { ideation: false, plan: false },
    feedbackRound: 1,
    artifacts: {
      ideation: ['innovative.md', 'best.md', 'ideation.md'],
      plan: ['plan.md'],
    },
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [
      {
        name: 'plan.md',
        content:
          'Direction: first pass at a four-task decomposition; verification criteria still too coarse per evaluator finding.',
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

describe('plan/spec.json — validation', () => {
  test('passes validateStepSpec (structural + cross-reference)', () => {
    const raw: unknown = JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
    const result = validateStepSpec(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.version).toBe(1);
      expect(result.value.meta.expectedArtifacts).toEqual(['plan.md']);
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
});

// ===========================================================================
// Three-fixture snapshots — the PR B plan pipeline lock
// ===========================================================================

describe('plan — compile snapshots', () => {
  test('first-entry — brand new session, plan eval disabled', () => {
    const spec = loadSpec();
    const input = firstEntryFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-checks: no conditional blocks should fire.
    expect(text).not.toContain('Feedback round context');
    expect(text).not.toContain('Evaluation pre-exit check');
    // The role block DOES appear.
    expect(text).toContain('You are the orchestrator of the Plan step');
  });

  test('evaluation-enabled — user opted into plan_eval at session start', () => {
    const spec = loadSpec();
    const input = evaluationEnabledFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-check: only the evaluation-deciding conditional fires.
    expect(text).toContain('Evaluation pre-exit check');
    expect(text).not.toContain('Feedback round context');
  });

  test('feedback-round — prior plan_eval returned revise; workflow looped back', () => {
    const spec = loadSpec();
    const input = feedbackRoundFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-check: only the feedback-context conditional fires.
    expect(text).toContain('Feedback round context');
    expect(text).not.toContain('Evaluation pre-exit check');
  });
});

// ===========================================================================
// Byte-level stability — two compiles must produce identical output
// ===========================================================================

describe('plan — compile stability', () => {
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
