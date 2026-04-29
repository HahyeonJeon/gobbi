/**
 * Unit tests for `assembly.ts::renderAgentRoutingBlock` plus the
 * `compile()` backward-compat path when no `originals` is supplied.
 *
 * Pins the four locked behaviours from PR-FIN-1e ideation §2.4 and from
 * the renderer's `(auto > override > default)` provenance precedence:
 *
 *   1. all-default rendering — every agent's resolved values match
 *      `originals[role]` and no `'auto'` is present, so every line carries
 *      `(default)`.
 *   2. mixed default+override rendering — one agent matches, one differs;
 *      the differing agent gets `(override: <slotHint>)` while the
 *      matching agent retains `(default)`.
 *   3. `'auto'` rendering — when the resolved value is `'auto'`, the
 *      provenance suffix is `(auto: resolve via _gobbi-rule Model Selection)`
 *      regardless of `originals`.
 *   4. empty `delegation.agents` returns null, AND `compile()` without
 *      `originals` does not emit the agent-routing block (the
 *      `originals === undefined` short-circuit preserves backward compat
 *      for spec-authoring callers like `prompt render` / `prompt patch`).
 *
 * Fixtures are inline `StepSpec` objects so each case isolates one
 * behaviour from on-disk concrete spec values.
 */

import { describe, it, expect } from 'bun:test';

import {
  compile,
  renderAgentRoutingBlock,
  type CompileInput,
  type CompilePredicateRegistry,
  type DynamicContext,
} from '../assembly.js';
import type { AgentOriginal } from '../spec-loader.js';
import { initialState } from '../../workflow/state.js';
import type { WorkflowState } from '../../workflow/state.js';
import type { AgentConfig, StepSpec } from '../types.js';

// ---------------------------------------------------------------------------
// Fixture helpers — minimal but valid StepSpec; agents list driven by case
// ---------------------------------------------------------------------------

function makeSpec(agents: readonly AgentConfig[]): StepSpec {
  return {
    $schema: 'https://gobbi.dev/schemas/step-spec/v1',
    version: 1,
    meta: {
      description: 'Agent-routing fixture step',
      allowedAgentTypes: ['__pi'],
      maxParallelAgents: 2,
      requiredSkills: ['_gotcha'],
      optionalSkills: [],
      expectedArtifacts: ['fixture.md'],
      completionSignal: 'SubagentStop',
    },
    transitions: [{ to: 'done', condition: '' }],
    delegation: { agents },
    tokenBudget: {
      staticPrefix: 0.4,
      session: 0.1,
      instructions: 0.2,
      artifacts: 0.2,
      materials: 0.1,
    },
    blocks: {
      static: [{ id: 'role', content: 'Fixture orchestrator role.' }],
      conditional: [],
      delegation: {},
      synthesis: [{ id: 'synth', content: 'Fixture synthesis.' }],
      completion: {
        instruction: 'Emit completion signal.',
        criteria: ['fixture criterion'],
      },
      footer: 'Step completion protocol — run gobbi workflow transition COMPLETE.',
    },
  };
}

function baseDynamic(): DynamicContext {
  return {
    timestamp: '2026-04-29T00:00:00Z',
    activeSubagentCount: 0,
    artifacts: [],
  };
}

function baseState(): WorkflowState {
  return initialState('agent-routing-test');
}

const EMPTY_REGISTRY: CompilePredicateRegistry = {};

function baseInput(spec: StepSpec): CompileInput {
  return {
    spec,
    state: baseState(),
    dynamic: baseDynamic(),
    predicates: EMPTY_REGISTRY,
    activeAgent: null,
  };
}

// Two-agent fixture used by cases 1 + 2 — same `originals` shape; cases
// vary which agents diverge from their originals.
const innovativeAgent: AgentConfig = {
  role: 'innovative',
  stance: 'innovative',
  modelTier: 'opus',
  effort: 'max',
  skills: [],
  artifactTarget: 'innovative.md',
  blockRef: 'pi.innovative',
};

const bestAgent: AgentConfig = {
  role: 'best',
  stance: 'best-practice',
  modelTier: 'opus',
  effort: 'max',
  skills: [],
  artifactTarget: 'best.md',
  blockRef: 'pi.best',
};

// ===========================================================================
// renderAgentRoutingBlock — 4 cases per ideation §2.4
// ===========================================================================

describe('renderAgentRoutingBlock — provenance suffixing', () => {
  it('renders (default) for every agent when resolved values match originals', () => {
    const spec = makeSpec([innovativeAgent, bestAgent]);
    const originals: Readonly<Record<string, AgentOriginal>> = {
      innovative: { modelTier: 'opus', effort: 'max' },
      best: { modelTier: 'opus', effort: 'max' },
    };

    const section = renderAgentRoutingBlock(spec, originals);
    expect(section).not.toBeNull();
    if (section === null) throw new Error('precondition failed');

    expect(section.id).toBe('blocks.agent-routing');

    const lines = section.content.split('\n');
    expect(lines[0]).toBe(
      'Agent routing for this step (resolved from settings cascade):',
    );
    // One body line per agent — both terminate in `(default)`.
    expect(lines.length).toBe(3);
    expect(lines[1]).toMatch(/^\s+- role=innovative\s+model=opus\s+effort=max\s+\(default\)$/);
    expect(lines[2]).toMatch(/^\s+- role=best\s+model=opus\s+effort=max\s+\(default\)$/);
  });

  it('mixes (default) and (override: <slotHint>) when one agent diverges', () => {
    // `best` was overridden from opus → haiku via settings; `innovative`
    // still matches its original.
    const spec = makeSpec([
      innovativeAgent,
      { ...bestAgent, modelTier: 'haiku' },
    ]);
    const originals: Readonly<Record<string, AgentOriginal>> = {
      innovative: { modelTier: 'opus', effort: 'max' },
      best: { modelTier: 'opus', effort: 'max' },
    };

    const section = renderAgentRoutingBlock(
      spec,
      originals,
      'workflow.execution.agent',
    );
    expect(section).not.toBeNull();
    if (section === null) throw new Error('precondition failed');

    const lines = section.content.split('\n');
    expect(lines.length).toBe(3);
    // Innovative line — unchanged → (default).
    expect(lines[1]).toMatch(/^\s+- role=innovative\s+model=opus\s+effort=max\s+\(default\)$/);
    // Best line — diverged from original → (override: workflow.execution.agent).
    expect(lines[2]).toMatch(
      /^\s+- role=best\s+model=haiku\s+effort=max\s+\(override: workflow\.execution\.agent\)$/,
    );
  });

  it("renders (auto: resolve via _gobbi-rule Model Selection) when modelTier is 'auto'", () => {
    // `'auto'` precedence > override > default — even though the resolved
    // value differs from `originals` the auto branch wins.
    const spec = makeSpec([{ ...innovativeAgent, modelTier: 'auto' }]);
    const originals: Readonly<Record<string, AgentOriginal>> = {
      innovative: { modelTier: 'opus', effort: 'max' },
    };

    const section = renderAgentRoutingBlock(
      spec,
      originals,
      'workflow.ideation.agent',
    );
    expect(section).not.toBeNull();
    if (section === null) throw new Error('precondition failed');

    const lines = section.content.split('\n');
    expect(lines.length).toBe(2);
    expect(lines[1]).toMatch(
      /^\s+- role=innovative\s+model=auto\s+effort=max\s+\(auto: resolve via _gobbi-rule Model Selection\)$/,
    );
  });

  it('returns null for empty delegation.agents AND compile() without originals emits no agent-routing section', () => {
    const spec = makeSpec([]);
    const originals: Readonly<Record<string, AgentOriginal>> = {};

    // Direct call: empty agents → null, regardless of originals.
    expect(renderAgentRoutingBlock(spec, originals)).toBeNull();
    // Even with non-empty originals, empty agents short-circuits to null
    // (the renderer guards on `agents.length === 0` before consulting
    // originals).
    expect(
      renderAgentRoutingBlock(makeSpec([]), {
        ghost: { modelTier: 'opus', effort: 'max' },
      }),
    ).toBeNull();

    // Backward-compat path: `compile()` called WITHOUT `originals` (the
    // pre-PR-FIN-1e behaviour preserved for spec-authoring tools and
    // existing test fixtures) must emit no `blocks.agent-routing` section
    // even when delegation.agents is non-empty.
    const specWithAgent = makeSpec([innovativeAgent]);
    const compiled = compile(baseInput(specWithAgent), {});
    const ids = compiled.sections.map((s) => s.id);
    expect(ids).not.toContain('blocks.agent-routing');
  });
});
