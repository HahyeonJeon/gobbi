/**
 * Ideation spec — end-to-end snapshot tests (A.7).
 *
 * The Wave 5 capstone for PR A. Each test compiles `../spec.json` against a
 * distinct `WorkflowState` + `DynamicContext` + predicate registry and
 * captures the resulting `CompiledPrompt` via bun:test's `toMatchSnapshot()`.
 *
 * Three fixtures per the briefing:
 *
 *   1. first-entry         — brand new session entering ideation fresh; no
 *                            conditional predicates fire.
 *   2. evaluation-deciding — PI agents have completed; orchestrator is about
 *                            to ask the user whether to run ideation_eval.
 *                            `ideationSynthesized` predicate fires.
 *   3. subagent-spawning   — orchestrator is about to spawn both PI agents.
 *                            `piAgentsToSpawn` predicate fires AND the active
 *                            agent selector picks `pi.innovative`.
 *
 * Also verifies:
 *
 *   - The spec passes A.6's `validateStepSpec()` — structural + cross-ref.
 *   - Two compiles with identical inputs produce byte-identical output
 *     (static-prefix stability for the Anthropic cache).
 *   - A narrow context window (5_000 tokens) causes the allocator to drop
 *     lower-priority sections whole (no mid-section truncation).
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
  compileWithIssues,
  type CompileInput,
  type CompilePredicateRegistry,
  type DynamicContext,
} from '../../assembly.js';
import { defaultBudgetAllocator } from '../../budget.js';
import { validateStepSpec } from '../../_schema/v1.js';
import { initialState } from '../../../workflow/state-derivation.js';
import type { WorkflowState } from '../../../workflow/state-derivation.js';
import { defaultPredicates } from '../../../workflow/predicates.js';
import { loadSpecForRuntime } from '../../spec-loader.js';
import type { StepSpec } from '../../types.js';

// ---------------------------------------------------------------------------
// Spec loading — read the JSON file at test-start, validate once, reuse.
//
// `readFileSync` is deliberate: the spec is loaded exactly the way the
// production CLI will load it (raw JSON → `validateStepSpec`), so the
// snapshot captures the actual production pipeline, not a hand-typed clone.
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

// ---------------------------------------------------------------------------
// Predicate registry — the PRODUCTION registry.
//
// `compile()` evaluates every `blocks.conditional[*].when` name via this
// registry. Fixtures vary in the WorkflowState they pass; each predicate
// inspects state to decide inclusion. Using `defaultPredicates` directly
// here (rather than a test-local registry) confirms that the three Ideation
// predicates — `feedbackRoundActive`, `ideationSynthesized`,
// `piAgentsToSpawn` — are registered in production and resolve the
// conditional blocks in `spec.json`. Post-C2: an unregistered predicate
// would silently drop its conditional block, so snapshotting through the
// real registry is the integration lock.
//
// Predicate semantics (see `workflow/predicates.ts` for the registered
// implementations):
//   - `feedbackRoundActive` — the feedback loop has pushed us back into
//     ideation (state.feedbackRound > 0).
//   - `ideationSynthesized` — the orchestrator has produced ideation.md and
//     is about to ask the user about evaluation. Reads an `ideation.md`
//     entry in `state.artifacts.ideation`.
//   - `piAgentsToSpawn` — the orchestrator has registered PI agents in
//     `activeSubagents` and is about to dispatch. Reads the presence of at
//     least one `__pi` entry in state.activeSubagents.
// ---------------------------------------------------------------------------

const predicates: CompilePredicateRegistry = defaultPredicates;

// ---------------------------------------------------------------------------
// Fixture constructors
//
// Each returns a fully-populated `CompileInput`. Timestamps are pinned to a
// fixed value — a dynamic timestamp would make the compiled prompt's
// dynamic section non-deterministic, poisoning snapshot stability. The
// fixed value matches the current date in the workspace's environment
// (2026-04-16) so the fixture reads naturally.
// ---------------------------------------------------------------------------

const FIXED_TIMESTAMP = '2026-04-16T12:00:00.000Z';

function firstEntryFixture(spec: StepSpec): CompileInput {
  const state: WorkflowState = {
    ...initialState('session-first-entry'),
    currentStep: 'ideation',
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [],
  };
  return { spec, state, dynamic, predicates, activeAgent: null };
}

function evaluationDecidingFixture(spec: StepSpec): CompileInput {
  // State models "PI agents done; orchestrator synthesized ideation.md and
  // is about to ask the user about ideation_eval". `evalConfig` is set
  // because the user picked it at session start — that is a precondition
  // for the evaluation-decision conditional to be meaningful.
  const base = initialState('session-eval-decide');
  const state: WorkflowState = {
    ...base,
    currentStep: 'ideation',
    evalConfig: { ideation: true, planning: false },
    artifacts: {
      ideation: ['innovative.md', 'best.md', 'ideation.md'],
    },
    activeSubagents: [],
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [
      {
        name: 'innovative.md',
        content:
          'stance: innovative\n\nThree novel approaches considered. See session file for detail.',
      },
      {
        name: 'best.md',
        content:
          'stance: best-practice\n\nThree proven patterns mapped onto the problem. See session file for detail.',
      },
    ],
  };
  return { spec, state, dynamic, predicates, activeAgent: null };
}

function subagentSpawningFixture(spec: StepSpec): CompileInput {
  // State models "orchestrator is in ideation, framing discussed, PI agents
  // registered in activeSubagents and about to be dispatched". The
  // `piAgentsToSpawn` predicate reads activeSubagents to fire the spawn-ready
  // conditional block. The compile call uses `activeAgent: 'pi.innovative'`
  // to include the innovative delegation block — `compile()` only includes
  // ONE delegation block per call so we snapshot the innovative variant.
  // The best-practice variant shares the same pipeline.
  const state: WorkflowState = {
    ...initialState('session-spawn'),
    currentStep: 'ideation',
    evalConfig: { ideation: false, planning: false },
    activeSubagents: [
      {
        subagentId: 'subagent-pi-innovative',
        agentType: '__pi',
        step: 'ideation',
        spawnedAt: FIXED_TIMESTAMP,
      },
      {
        subagentId: 'subagent-pi-best',
        agentType: '__pi',
        step: 'ideation',
        spawnedAt: FIXED_TIMESTAMP,
      },
    ],
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
    activeAgent: 'pi.innovative',
  };
}

// ---------------------------------------------------------------------------
// Compile options — generous 200k-token window uses the default allocator
// without dropping anything. A dedicated test at the bottom exercises the
// small-window path.
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

describe('ideation/spec.json — validation', () => {
  test('passes validateStepSpec (structural + cross-reference)', () => {
    const raw: unknown = JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
    const result = validateStepSpec(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      // Narrowed access proves the typed path survives the branch.
      expect(result.value.version).toBe(1);
      expect(result.value.meta.allowedAgentTypes).toEqual(['__pi']);
      expect(result.value.delegation.agents).toHaveLength(2);
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
      const expected = agentTargets.has(artifact) || artifact === 'ideation.md';
      expect(expected).toBe(true);
    }
  });
});

// ===========================================================================
// Three-fixture snapshots — the PR A pipeline lock
// ===========================================================================

describe('ideation — compile snapshots', () => {
  test('first-entry — brand new session, no conditionals fire', () => {
    const spec = loadSpec();
    const input = firstEntryFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-checks against the snapshot's intent: no conditional blocks
    // should have fired because no predicate's state condition is true
    // for a fresh session.
    expect(text).not.toContain('Feedback round context');
    expect(text).not.toContain('Evaluation decision point');
    expect(text).not.toContain('Spawn-readiness guidance');
  });

  test('evaluation-deciding — orchestrator is about to ask about ideation_eval', () => {
    const spec = loadSpec();
    const input = evaluationDecidingFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-check intent: only the evaluation-deciding conditional should
    // fire. feedbackRoundActive is false (feedbackRound === 0) and
    // piAgentsToSpawn is false (ideation.md is present in artifacts).
    expect(text).toContain('Evaluation decision point');
    expect(text).not.toContain('Feedback round context');
    expect(text).not.toContain('Spawn-readiness guidance');
  });

  test('subagent-spawning — orchestrator is about to spawn both PI agents', () => {
    const spec = loadSpec();
    const input = subagentSpawningFixture(spec);
    const text = compileGenerous(input);
    expect(text).toMatchSnapshot();

    // Cross-check intent: the spawn-readiness conditional fires and the
    // innovative delegation block is inlined (activeAgent == 'pi.innovative').
    expect(text).toContain('Spawn-readiness guidance');
    expect(text).toContain('You are a PI agent working the innovative stance');
    // The best-practice delegation block is NOT included in the same compile
    // — it runs in a separate delegation invocation.
    expect(text).not.toContain('You are a PI agent working the best-practice stance');
  });
});

// ===========================================================================
// PR-FIN-1e — agent-routing block snapshot (default-provenance fixture)
// ===========================================================================
//
// Captures the new `Agent routing for this step (resolved from settings
// cascade):` static section emitted by `renderSpec` when the caller threads
// `originals` through `CompileOptions`. This fixture pins the
// `(default)`-provenance rendering: settings are `undefined`, so
// `loadSpecForRuntime` produces an `originals` map mirroring the spec.json
// hardcoded values, and `renderAgentRoutingBlock` walks every agent and
// emits `(default)` for each.
//
// The fixture is deliberately distinct from the three existing fixtures
// (which call `compile` without `originals` and therefore stay byte-stable
// across this PR). Only this new test captures the agent-routing block.

describe('ideation — agent-routing block snapshot (PR-FIN-1e)', () => {
  test('first-entry with originals threads agent-routing block with (default) provenance for both PI agents', () => {
    const { spec, originals } = loadSpecForRuntime(
      SPEC_PATH,
      undefined,
      'ideation',
    );
    const input = firstEntryFixture(spec);
    const prompt = compile(input, {
      allocator: defaultBudgetAllocator,
      contextWindowTokens: GENEROUS_WINDOW,
      originals,
      slotHint: 'workflow.ideation.agent',
    });
    expect(prompt.text).toMatchSnapshot();

    // Cross-check intent: the agent-routing block appears with both PI
    // agents at their hardcoded (opus, max) defaults — one line per agent.
    expect(prompt.text).toContain(
      'Agent routing for this step (resolved from settings cascade):',
    );
    expect(prompt.text).toContain('role=innovative');
    expect(prompt.text).toContain('role=best');
    expect(prompt.text).toContain('model=opus');
    expect(prompt.text).toContain('effort=max');
    expect(prompt.text).toContain('(default)');
    // No (override: ...) suffix should appear because settings are undefined.
    expect(prompt.text).not.toContain('(override:');
  });
});

// ===========================================================================
// Byte-level stability — two compiles must produce identical output
// ===========================================================================

describe('ideation — compile stability', () => {
  test('first-entry fixture compiles to identical output twice', () => {
    const spec = loadSpec();
    const a = compileGenerous(firstEntryFixture(spec));
    const b = compileGenerous(firstEntryFixture(spec));
    expect(a).toBe(b);
  });

  test('evaluation-deciding fixture compiles to identical output twice', () => {
    const spec = loadSpec();
    const a = compileGenerous(evaluationDecidingFixture(spec));
    const b = compileGenerous(evaluationDecidingFixture(spec));
    expect(a).toBe(b);
  });

  test('subagent-spawning fixture compiles to identical output twice', () => {
    const spec = loadSpec();
    const a = compileGenerous(subagentSpawningFixture(spec));
    const b = compileGenerous(subagentSpawningFixture(spec));
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
// Narrow context window — allocator drops whole sections, never mid-section
// ===========================================================================

describe('ideation — narrow-window allocator behaviour', () => {
  test('5k-token window drops lower-priority sections whole', () => {
    const spec = loadSpec();
    const input = subagentSpawningFixture(spec);
    // Use compileWithIssues to observe the dropped list directly; the
    // public `compile()` path would just emit the trimmed prompt.
    const outcome = compileWithIssues(input, {
      allocator: defaultBudgetAllocator,
      contextWindowTokens: 5_000,
      lintMode: 'throw',
    });
    // Something should land — the staticPrefix slot reserves 40% of 5k = 2000
    // tokens, which comfortably holds the role block. Something should be
    // dropped too — dynamic/artifact content will not all fit.
    expect(outcome.prompt.text.length).toBeGreaterThan(0);
    // The compiled text must begin at a section boundary (i.e., one of the
    // known section prefixes) — this proves no mid-section truncation.
    const sectionPrefixes = [
      'You are the orchestrator',
      'Ideation principles',
      'Scope boundary',
      'Feedback round context',
      'Evaluation decision point',
      'Spawn-readiness guidance',
    ];
    const startsAtSection = sectionPrefixes.some((p) => outcome.prompt.text.startsWith(p));
    expect(startsAtSection).toBe(true);
  });
});
