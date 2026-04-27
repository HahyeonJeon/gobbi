/**
 * Handoff spec — validation + compile-stability tests (#146 A.1.5).
 *
 * Mirrors the shape of `memorization/__tests__/snapshot.test.ts` but limited
 * to:
 *
 *   1. `validateStepSpec` accepts the new spec.
 *   2. The orchestrator-only contract is locked (no delegated agents,
 *      `allowedAgentTypes: []`, `Stop` completion signal).
 *   3. The single transition routes to `done` on `always` — handoff is a
 *      lifecycle terminal step.
 *   4. Compile output is byte-stable across repeat invocations.
 *
 * No prose-level snapshot is committed in A.1.5. The handoff prose is still
 * settling (Wave A.2 reconciles cross-doc terminology); a snapshot now would
 * churn on every prose tweak. A snapshot pass lands when the prose
 * reconciliation closes.
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
// Fixture — a clean handoff entry. The runtime currentStep is still typed as
// the pre-Pass-4 `WorkflowStep` literal union (which omits 'handoff'); the
// `WorkflowStep` widening lands in Wave B.1. Until then, fixtures stage the
// session in `currentStep: 'memorization'` and treat the compile as the
// post-step-exit prompt for handoff.
// ---------------------------------------------------------------------------

const FIXED_TIMESTAMP = '2026-04-25T12:00:00.000Z';

function cleanHandoffFixture(spec: StepSpec): CompileInput {
  const state: WorkflowState = {
    ...initialState('session-handoff-clean'),
    // Pre-B.1 the runtime literal union does not include 'handoff'; staging
    // at memorization is faithful to the just-finished step. Wave B.1 widens
    // the type and updates this fixture.
    currentStep: 'memorization',
    evalConfig: { ideation: false, planning: false },
    completedSteps: [
      'ideation',
      'planning',
      'execution',
      'execution_eval',
      'memorization',
    ],
    artifacts: {
      ideation: ['ideation.md'],
      planning: ['plan.md'],
      execution: ['execution.md'],
      execution_eval: ['evaluation.md'],
      memorization: ['memorization.md'],
    },
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [
      {
        name: 'memorization.md',
        content:
          'Summary: shipped feature X. Decisions: chose A over B. State at completion: PR #N open. Open questions: none. Gotchas recorded: g-1.md, g-2.md. Pointers: ideation.md, plan.md, execution.md, evaluation.md.',
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
// Spec validity — `validateStepSpec` must accept this file
// ===========================================================================

describe('handoff/spec.json — validation', () => {
  test('passes validateStepSpec (structural + cross-reference)', () => {
    const raw: unknown = JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
    const result = validateStepSpec(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.version).toBe(1);
      expect(result.value.meta.expectedArtifacts).toEqual(['handoff.md']);
      // Orchestrator-only: no delegated agents.
      expect(result.value.delegation.agents).toHaveLength(0);
      expect(result.value.meta.allowedAgentTypes).toEqual([]);
      expect(result.value.meta.maxParallelAgents).toBe(0);
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

  test('blocks.conditional is empty — handoff has no conditional gates', () => {
    const spec = loadSpec();
    expect(spec.blocks.conditional).toEqual([]);
  });

  test('completion signal is Stop — no subagent owns the completion event', () => {
    const spec = loadSpec();
    expect(spec.meta.completionSignal).toBe('Stop');
  });

  test('transitions include exactly one always-routing exit to done', () => {
    const spec = loadSpec();
    expect(spec.transitions).toHaveLength(1);
    const transition = spec.transitions[0];
    expect(transition?.to).toBe('done');
    expect(transition?.condition).toBe('always');
  });

  test('required skills include _project — handoff reads project context', () => {
    const spec = loadSpec();
    expect(spec.meta.requiredSkills).toContain('_project');
  });

  // CV-10 / issue #188 regression — pre-fix the handoff footer named
  // `gobbi workflow transition COMPLETE` but the runtime drives
  // `handoff → done` only via `workflow.finish` (FINISH). The footer
  // and the transition graph must agree at the spec-file level so any
  // future edit re-introducing COMPLETE fails fast at unit-test time
  // rather than wedging an in-flight session.
  test('footer instructs `gobbi workflow transition FINISH`, not COMPLETE', () => {
    const spec = loadSpec();
    const footer = spec.blocks.footer;
    expect(footer).toContain('gobbi workflow transition FINISH');
    expect(footer).not.toContain('gobbi workflow transition COMPLETE');
  });
});

// ===========================================================================
// Compile stability — two compiles must produce byte-identical output
// ===========================================================================

describe('handoff — compile stability', () => {
  test('clean-handoff fixture compiles to identical output twice', () => {
    const spec = loadSpec();
    const a = compileGenerous(cleanHandoffFixture(spec));
    const b = compileGenerous(cleanHandoffFixture(spec));
    expect(a).toBe(b);
  });

  test('contentHash and staticPrefixHash are stable across repeat compiles', () => {
    const spec = loadSpec();
    const input = cleanHandoffFixture(spec);
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

  test('compiled prompt contains the role and artifact-shape blocks', () => {
    const spec = loadSpec();
    const text = compileGenerous(cleanHandoffFixture(spec));
    expect(text).toContain('You are the orchestrator of the Handoff step');
    expect(text).toContain('Handoff artifact shape');
    expect(text).toContain('handoff.md');
  });
});
