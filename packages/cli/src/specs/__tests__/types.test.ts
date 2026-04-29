/**
 * Type-level tests for `specs/types.ts` — a minimal set of `@ts-expect-error`
 * assertions that pin the shape of `StepSpec`. The file is pure types, so
 * the runtime side of each test is incidental; the compile-time rejection
 * is the assertion.
 *
 * If a future refactor accidentally loosens a constraint, the corresponding
 * `@ts-expect-error` line will compile cleanly and `tsc --noEmit` will FAIL
 * with TS2578 (unused `@ts-expect-error`).
 */

import { describe, test, expect } from 'bun:test';

import type {
  StepSpec,
  StepMeta,
  StepTransition,
  AgentConfig,
  TokenBudget,
  BlockContent,
  ConditionalBlock,
  StepBlocks,
  ModelTier,
  EffortLevel,
} from '../types.js';

// ===========================================================================
// Helpers — minimal valid fixtures we can mutate into invalid ones
// ===========================================================================

const meta: StepMeta = {
  description: 'Ideation — explore what to do',
  allowedAgentTypes: ['__pi'],
  maxParallelAgents: 2,
  requiredSkills: ['_gotcha'],
  optionalSkills: [],
  expectedArtifacts: ['innovative.md', 'best.md'],
  completionSignal: 'SubagentStop',
};

const transition: StepTransition = {
  to: 'plan',
  condition: 'evalEnabled.ideation',
};

const agent: AgentConfig = {
  role: 'innovative',
  stance: 'innovative',
  modelTier: 'opus',
  effort: 'max',
  skills: ['_ideation'],
  artifactTarget: 'innovative.md',
  blockRef: 'pi.innovative',
};

const tokenBudget: TokenBudget = {
  staticPrefix: 0.4,
  session: 0.1,
  instructions: 0.2,
  artifacts: 0.2,
  materials: 0.1,
};

const block: BlockContent = { id: 'role', content: 'You are the orchestrator.' };

const conditional: ConditionalBlock = {
  id: 'feedback-context',
  content: 'This is feedback round N.',
  when: 'feedbackRoundActive',
};

const blocks: StepBlocks = {
  static: [block],
  conditional: [conditional],
  delegation: { 'pi.innovative': { id: 'pi.innovative', content: 'Innovative prompt.' } },
  synthesis: [{ id: 'synth', content: 'Synthesize findings.' }],
  completion: {
    instruction: 'Emit completion signal',
    criteria: ['both PI agents completed', 'synthesis written'],
  },
  footer: 'Step completion protocol — run gobbi workflow transition COMPLETE.',
};

const spec: StepSpec = {
  $schema: 'https://gobbi.dev/schemas/step-spec/v1',
  version: 1,
  meta,
  transitions: [transition],
  delegation: { agents: [agent] },
  tokenBudget,
  blocks,
};

// ===========================================================================
// Positive assertion — the fixture shape typechecks
// ===========================================================================

describe('StepSpec shape', () => {
  test('a fully populated fixture is assignable to StepSpec', () => {
    // Reference all fields so tree-shakers do not elide the fixture.
    expect(spec.meta.description).toBe('Ideation — explore what to do');
    expect(spec.transitions[0]?.to).toBe('plan');
    expect(spec.delegation.agents[0]?.modelTier).toBe('opus');
    expect(spec.tokenBudget.staticPrefix).toBe(0.4);
    expect(spec.blocks.completion.criteria.length).toBe(2);
  });

  test('version field is the literal `1`', () => {
    // @ts-expect-error — version is the literal `1`, not an arbitrary number
    const bad: StepSpec = { ...spec, version: 2 };
    // Runtime side is incidental; the compile-time rejection above is the
    // assertion. Reference `bad` to avoid an unused-variable error.
    expect(typeof bad.version).toBe('number');
  });

  test('ModelTier is a closed literal union', () => {
    // @ts-expect-error — 'claude-3' is not a valid ModelTier literal
    const bad: ModelTier = 'claude-3';
    expect(typeof bad).toBe('string');
  });

  test('EffortLevel is a closed literal union', () => {
    // PR-FIN-1e widened EffortLevel to 'low'|'medium'|'high'|'max'|'auto'.
    // `'extreme'` remains outside the union and serves as the rejection probe.
    // @ts-expect-error — 'extreme' is not a permitted EffortLevel value
    const bad: EffortLevel = 'extreme';
    expect(typeof bad).toBe('string');
  });

  test('AgentConfig rejects unknown model tiers', () => {
    // @ts-expect-error — modelTier must be one of opus|sonnet|haiku|auto
    const bad: AgentConfig = { ...agent, modelTier: 'o1' };
    expect(bad.role).toBe('innovative');
  });

  test('StepMeta requires all non-optional fields', () => {
    // @ts-expect-error — missing completionSignal
    const bad: StepMeta = {
      description: 'x',
      allowedAgentTypes: [],
      maxParallelAgents: 0,
      requiredSkills: [],
      optionalSkills: [],
      expectedArtifacts: [],
    };
    expect(bad.description).toBe('x');
  });

  test('TokenBudget requires all five sections', () => {
    // @ts-expect-error — missing `materials`
    const bad: TokenBudget = {
      staticPrefix: 0.5,
      session: 0.1,
      instructions: 0.2,
      artifacts: 0.2,
    };
    expect(bad.staticPrefix).toBe(0.5);
  });

  test('StepBlocks.completion requires both instruction and criteria', () => {
    // @ts-expect-error — missing criteria
    const bad: StepBlocks = { ...blocks, completion: { instruction: 'done' } };
    expect(bad.static.length).toBe(1);
  });

  test('StepBlocks.delegation is a string-keyed record of BlockContent', () => {
    // @ts-expect-error — delegation values must be BlockContent, not plain strings
    const bad: StepBlocks = { ...blocks, delegation: { agent1: 'raw string' } };
    expect(bad.static.length).toBe(1);
  });

  test('spec fields are readonly — tuples cannot be reassigned at compile time', () => {
    // The compile-time rejection below is the assertion; the runtime side is
    // intentionally a no-op (TypeScript's `readonly` is erased at runtime,
    // so actually performing the assignment would mutate the fixture and
    // disturb other tests).
    const check = (s: StepSpec) => {
      // @ts-expect-error — blocks.static is a readonly array
      s.blocks.static = [];
    };
    expect(typeof check).toBe('function');
  });
});
