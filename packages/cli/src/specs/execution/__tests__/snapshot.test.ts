/**
 * Execution spec — end-to-end snapshot tests (B.1).
 *
 * Mirrors the Ideation A.7 capstone shape: each test compiles `../spec.json`
 * against a distinct `WorkflowState` + `DynamicContext` + predicate registry
 * and captures the resulting `CompiledPrompt` via bun:test's
 * `toMatchSnapshot()`.
 *
 * Three fixtures:
 *
 *   1. first-entry        — brand new session entering execution with a plan
 *                           in hand. No conditionals fire. `activeAgent` is
 *                           null (orchestrator view — not a per-task delegate
 *                           dispatch).
 *   2. executor-dispatch  — orchestrator is about to dispatch one task to the
 *                           `__executor` subagent. `activeAgent` is set to
 *                           `'executor'` so the delegation block is inlined.
 *   3. skill-injection    — the PR B folded Overall C1 finding. The compile
 *                           input includes `skillSections: [_gotcha section,
 *                           _execution section]`; the compiled prompt's
 *                           static prefix must include the injected content
 *                           before the spec-derived role block. This fixture
 *                           lives in the Execution dir because executors
 *                           load project skills before working — the seam is
 *                           exercised in its most natural place.
 *
 * Also verifies:
 *
 *   - The spec passes A.6's `validateStepSpec()` — structural + cross-ref.
 *   - Two compiles with identical inputs produce byte-identical output
 *     (static-prefix stability for the Anthropic cache).
 *   - Skill sections contribute to `staticPrefixHash` and participate in the
 *     content linter on the same footing as block-derived static content.
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
import { makeStatic, type StaticSection } from '../../sections.js';
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

function firstEntryFixture(spec: StepSpec): CompileInput {
  // Execution has entered fresh after plan. No feedback loop-back yet.
  // `feedbackRound = 0` keeps both conditional blocks out.
  const state: WorkflowState = {
    ...initialState('session-exec-first'),
    currentStep: 'execution',
    evalConfig: { ideation: false, planning: false },
    completedSteps: ['ideation', 'planning'],
    artifacts: {
      ideation: ['innovative.md', 'best.md', 'ideation.md'],
      planning: ['plan.md'],
    },
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [
      {
        name: 'plan.md',
        content:
          'Direction: author four step specs. Tasks: [1] plan spec, [2] execution spec, [3] evaluation spec, [4] memorization spec. Verification: ajv passes + snapshots locked.',
      },
    ],
  };
  return { spec, state, dynamic, predicates, activeAgent: null };
}

function executorDispatchFixture(spec: StepSpec): CompileInput {
  // Orchestrator is about to dispatch task #2 (Execution spec authoring) to
  // the `__executor` subagent. One active subagent is registered.
  // `activeAgent: 'executor'` inlines the delegation block.
  const state: WorkflowState = {
    ...initialState('session-exec-dispatch'),
    currentStep: 'execution',
    evalConfig: { ideation: false, planning: false },
    completedSteps: ['ideation', 'planning'],
    activeSubagents: [
      {
        subagentId: 'subagent-executor-task-2',
        agentType: '__executor',
        step: 'execution',
        spawnedAt: FIXED_TIMESTAMP,
      },
    ],
    artifacts: {
      ideation: ['innovative.md', 'best.md', 'ideation.md'],
      planning: ['plan.md'],
    },
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 1,
    artifacts: [],
  };
  return { spec, state, dynamic, predicates, activeAgent: 'executor' };
}

// Skill sections used by the skill-injection fixture. They model what
// `specs/skills.ts::loadSkills` emits for `_gotcha` and `_execution`. The
// content is deliberately short and marker-heavy so the snapshot is readable
// and easy to eyeball when intentional changes land.
//
// IMPORTANT: the content must not trigger the static-content linter. The
// linter catches ISO timestamps, UUIDs, absolute paths, PIDs, and session
// folder ids. These fixture bodies are hand-written to stay clean.
const GOTCHA_SKILL_FIXTURE: StaticSection = makeStatic({
  id: 'skills._gotcha',
  content:
    'skills._gotcha fixture: check project gotchas before acting. If you repeat a recorded mistake, the correction was recorded for a reason.',
});

const EXECUTION_SKILL_FIXTURE: StaticSection = makeStatic({
  id: 'skills._execution',
  content:
    'skills._execution fixture: study before acting, plan before coding, verify before reporting done. One task, one focus.',
});

function skillInjectionFixture(spec: StepSpec): CompileInput {
  // Same state shape as first-entry, but the compile input carries
  // `skillSections: [_gotcha, _execution]`. The fixture validates that the
  // skillSections seam actually flows through `compile()`: the injected
  // skill content appears BEFORE the role block in the static prefix, and
  // the per-skill section ids survive into `prompt.sections`.
  const state: WorkflowState = {
    ...initialState('session-exec-skills'),
    currentStep: 'execution',
    evalConfig: { ideation: false, planning: false },
    completedSteps: ['ideation', 'planning'],
    artifacts: {
      ideation: ['innovative.md', 'best.md', 'ideation.md'],
      planning: ['plan.md'],
    },
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [],
  };
  return {
    spec,
    state,
    dynamic,
    predicates,
    activeAgent: null,
    skillSections: [GOTCHA_SKILL_FIXTURE, EXECUTION_SKILL_FIXTURE],
  };
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

describe('execution/spec.json — validation', () => {
  test('passes validateStepSpec (structural + cross-reference)', () => {
    const raw: unknown = JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
    const result = validateStepSpec(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.version).toBe(1);
      expect(result.value.meta.allowedAgentTypes).toEqual(['__executor']);
      expect(result.value.meta.maxParallelAgents).toBe(1);
      expect(result.value.delegation.agents).toHaveLength(1);
      const first = result.value.delegation.agents[0];
      expect(first?.blockRef).toBe('executor');
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

  test('completion signal is SubagentStop — the executor subagent owns the completion event', () => {
    const spec = loadSpec();
    expect(spec.meta.completionSignal).toBe('SubagentStop');
  });
});

// ===========================================================================
// Three-fixture snapshots — the PR B execution pipeline lock
// ===========================================================================

describe('execution — compile snapshots', () => {
  test('first-entry — brand new session entering execution with a plan in hand', () => {
    const spec = loadSpec();
    const input = firstEntryFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-checks: neither conditional fires on a fresh entry.
    expect(text).not.toContain('Feedback round context');
    expect(text).not.toContain('Pre-cap warning');
    // Role block DOES appear.
    expect(text).toContain('You are the orchestrator of the Execution step');
    // Delegation block is NOT included — activeAgent is null.
    expect(text).not.toContain('You are an executor subagent');
  });

  test('executor-dispatch — orchestrator is about to dispatch one task', () => {
    const spec = loadSpec();
    const input = executorDispatchFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-check: the executor delegation block is inlined because
    // activeAgent === 'executor'.
    expect(text).toContain('You are an executor subagent');
    // No conditionals fire on a fresh dispatch.
    expect(text).not.toContain('Feedback round context');
    expect(text).not.toContain('Pre-cap warning');
  });

  test('skill-injection — folded Overall C1 seam: CompileInput.skillSections flows through compile()', () => {
    const spec = loadSpec();
    const input = skillInjectionFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // The fixture's intent-level assertions — if any of these regress, the
    // skillSections seam is broken regardless of snapshot text.
    const gotchaIdx = text.indexOf('skills._gotcha fixture');
    const executionIdx = text.indexOf('skills._execution fixture');
    const roleIdx = text.indexOf('You are the orchestrator of the Execution step');
    // Both skill sections appear, in caller-provided order, before the role.
    expect(gotchaIdx).toBeGreaterThanOrEqual(0);
    expect(executionIdx).toBeGreaterThan(gotchaIdx);
    expect(roleIdx).toBeGreaterThan(executionIdx);
  });
});

// ===========================================================================
// Byte-level stability — two compiles must produce identical output
// ===========================================================================

describe('execution — compile stability', () => {
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

// ===========================================================================
// Skill-injection seam validation — beyond the snapshot, assert the
// semantic contract the skillSections input must preserve.
// ===========================================================================

describe('execution — skill-injection seam validation', () => {
  test('skill sections appear in CompiledPrompt.sections as static-kind summaries', () => {
    const spec = loadSpec();
    const input = skillInjectionFixture(spec);
    const prompt = compile(input, {
      allocator: defaultBudgetAllocator,
      contextWindowTokens: GENEROUS_WINDOW,
    });
    const gotcha = prompt.sections.find((s) => s.id === 'skills._gotcha');
    const execSkill = prompt.sections.find((s) => s.id === 'skills._execution');
    expect(gotcha).toBeDefined();
    expect(gotcha?.kind).toBe('static');
    expect(execSkill).toBeDefined();
    expect(execSkill?.kind).toBe('static');
  });

  test('skill sections contribute to staticPrefixHash', () => {
    const spec = loadSpec();
    const withoutSkills = compile(firstEntryFixture(spec), {
      allocator: defaultBudgetAllocator,
      contextWindowTokens: GENEROUS_WINDOW,
    });
    const withSkills = compile(skillInjectionFixture(spec), {
      allocator: defaultBudgetAllocator,
      contextWindowTokens: GENEROUS_WINDOW,
    });
    // Different static prefix → different staticPrefixHash.
    expect(withoutSkills.staticPrefixHash).not.toBe(withSkills.staticPrefixHash);
  });

  test('omitting skillSections yields byte-identical output to an empty skillSections array', () => {
    // Verifies the backwards-compatibility guarantee documented in
    // CompileInput.skillSections JSDoc — the two shapes must be
    // byte-equivalent so existing callers do not regress.
    const spec = loadSpec();
    const omitted = firstEntryFixture(spec);
    const emptyArray: CompileInput = { ...omitted, skillSections: [] };
    const a = compile(omitted, {
      allocator: defaultBudgetAllocator,
      contextWindowTokens: GENEROUS_WINDOW,
    });
    const b = compile(emptyArray, {
      allocator: defaultBudgetAllocator,
      contextWindowTokens: GENEROUS_WINDOW,
    });
    expect(a.text).toBe(b.text);
    expect(a.contentHash).toBe(b.contentHash);
    expect(a.staticPrefixHash).toBe(b.staticPrefixHash);
  });
});
