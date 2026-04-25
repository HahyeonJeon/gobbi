/**
 * Unit tests for B.3's runtime predicate-reference validators:
 *
 *   - `collectSpecPredicateReferences`
 *   - `validateSpecPredicateReferences`
 *   - `validateGraphPredicateReferences`
 *
 * These cover the runtime half of the two-layer cross-check. The
 * compile-time half (`defaultPredicates satisfies Record<PredicateName,
 * Predicate>`) is exercised implicitly by typecheck; here we verify that
 * the validators catch missing registrations for specs and graphs loaded
 * dynamically from disk (or constructed in memory).
 */

import { describe, test, expect } from 'bun:test';

import {
  collectSpecPredicateReferences,
  validateSpecPredicateReferences,
  validateGraphPredicateReferences,
} from '../assembly.js';
import { loadGraph } from '../graph.js';
import type { StepSpec } from '../types.js';
import type { WorkflowGraph } from '../graph.js';
import { defaultPredicates } from '../../workflow/predicates.js';

// ---------------------------------------------------------------------------
// A minimal StepSpec that references a handful of predicates — small enough
// to keep assertions readable.
// ---------------------------------------------------------------------------

function fixtureSpec(overrides?: Partial<StepSpec>): StepSpec {
  const base: StepSpec = {
    $schema: 'https://gobbi.dev/schemas/step-spec/v1.json',
    version: 1,
    meta: {
      description: 'fixture',
      allowedAgentTypes: [],
      maxParallelAgents: 0,
      requiredSkills: [],
      optionalSkills: [],
      expectedArtifacts: [],
      completionSignal: 'Stop',
    },
    transitions: [
      { to: 'next', condition: 'evalIdeationEnabled', label: 'go' },
    ],
    delegation: { agents: [] },
    tokenBudget: {
      staticPrefix: 0.4,
      session: 0.2,
      instructions: 0.2,
      artifacts: 0.1,
      materials: 0.1,
    },
    blocks: {
      static: [{ id: 'role', content: 'role' }],
      conditional: [
        { id: 'c1', content: 'block 1', when: 'feedbackRoundActive' },
      ],
      delegation: {},
      synthesis: [],
      completion: { instruction: 'done', criteria: [] },
    },
  };
  return { ...base, ...overrides };
}

// ===========================================================================
// collectSpecPredicateReferences
// ===========================================================================

describe('collectSpecPredicateReferences', () => {
  test('extracts predicates from transitions and conditional blocks', () => {
    const spec = fixtureSpec();
    const refs = [...collectSpecPredicateReferences(spec)].sort();
    expect(refs).toEqual(['evalIdeationEnabled', 'feedbackRoundActive']);
  });

  test('deduplicates repeated references', () => {
    const spec = fixtureSpec({
      transitions: [
        { to: 'a', condition: 'evalIdeationEnabled' },
        { to: 'b', condition: 'evalIdeationEnabled' },
      ],
      blocks: {
        static: [],
        conditional: [
          { id: 'c1', content: 'c1', when: 'feedbackRoundActive' },
          { id: 'c2', content: 'c2', when: 'feedbackRoundActive' },
        ],
        delegation: {},
        synthesis: [],
        completion: { instruction: 'x', criteria: [] },
      },
    });
    const refs = [...collectSpecPredicateReferences(spec)].sort();
    expect(refs).toEqual(['evalIdeationEnabled', 'feedbackRoundActive']);
  });

  test('returns an empty array when no predicates are referenced', () => {
    const spec = fixtureSpec({
      transitions: [],
      blocks: {
        static: [{ id: 'role', content: 'role' }],
        conditional: [],
        delegation: {},
        synthesis: [],
        completion: { instruction: 'x', criteria: [] },
      },
    });
    expect(collectSpecPredicateReferences(spec)).toEqual([]);
  });
});

// ===========================================================================
// validateSpecPredicateReferences
// ===========================================================================

describe('validateSpecPredicateReferences', () => {
  test('returns no errors when every reference is registered', () => {
    const errors = validateSpecPredicateReferences(fixtureSpec(), defaultPredicates);
    expect(errors).toEqual([]);
  });

  test('emits one error per unknown predicate in transitions', () => {
    const spec = fixtureSpec({
      transitions: [
        { to: 'next', condition: 'notARealPredicate', label: 'bogus' },
      ],
    });
    const errors = validateSpecPredicateReferences(spec, defaultPredicates, 'fixture-spec');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('fixture-spec');
    expect(errors[0]).toContain('notARealPredicate');
    expect(errors[0]).toContain('-> next');
  });

  test('emits one error per unknown predicate in conditional blocks', () => {
    const spec = fixtureSpec({
      blocks: {
        static: [],
        conditional: [
          { id: 'broken-block', content: 'x', when: 'anotherBogusPredicate' },
        ],
        delegation: {},
        synthesis: [],
        completion: { instruction: 'x', criteria: [] },
      },
    });
    const errors = validateSpecPredicateReferences(spec, defaultPredicates);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('broken-block');
    expect(errors[0]).toContain('anotherBogusPredicate');
  });

  test('uses the supplied label in every error message', () => {
    const spec = fixtureSpec({
      transitions: [{ to: 'a', condition: 'missingOne' }],
      blocks: {
        static: [],
        conditional: [{ id: 'c1', content: 'c1', when: 'missingTwo' }],
        delegation: {},
        synthesis: [],
        completion: { instruction: 'x', criteria: [] },
      },
    });
    const errors = validateSpecPredicateReferences(spec, defaultPredicates, 'my-step/spec.json');
    expect(errors).toHaveLength(2);
    for (const e of errors) {
      expect(e.startsWith('my-step/spec.json:')).toBe(true);
    }
  });

  test('treats the registry as a string-keyed lookup — shape-independent', () => {
    // The registry argument is typed `Readonly<Record<string, unknown>>`
    // specifically so callers can pass the default registry, a typed
    // subset, or a test stub. Here we hand in a bare object keyed only
    // with the names the fixture uses.
    const stub = {
      evalIdeationEnabled: () => true,
      feedbackRoundActive: () => false,
    };
    const errors = validateSpecPredicateReferences(fixtureSpec(), stub);
    expect(errors).toEqual([]);
  });
});

// ===========================================================================
// validateGraphPredicateReferences
// ===========================================================================

describe('validateGraphPredicateReferences', () => {
  test('returns no errors when every graph-edge predicate is registered', async () => {
    const graph = await loadGraph();
    const errors = validateGraphPredicateReferences(graph, defaultPredicates);
    expect(errors).toEqual([]);
  });

  test('canonical committed graph references only registered predicates', async () => {
    // End-to-end assertion that closes the loop between the codegen
    // (scans the spec library) and the registry (registers everything
    // the codegen saw) — the real `index.json` must validate against
    // `defaultPredicates` on the merged surface.
    const graph = await loadGraph();
    const errors = validateGraphPredicateReferences(
      graph,
      defaultPredicates,
      'specs/index.json',
    );
    expect(errors).toEqual([]);
  });

  test('emits one error per unknown predicate in a graph edge', () => {
    const graph: WorkflowGraph = {
      version: 1,
      entry: 'a',
      terminal: ['b'],
      steps: [
        { id: 'a', spec: './a/spec.json' },
        { id: 'b', spec: './b/spec.json' },
      ],
      transitions: [
        { from: 'a', to: 'b', condition: 'knownPredicate' },
        { from: 'b', to: 'a', condition: 'madeUpPredicate', feedback: true },
      ],
    };
    const registry = { knownPredicate: () => true };
    const errors = validateGraphPredicateReferences(graph, registry);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('madeUpPredicate');
    expect(errors[0]).toContain('b -> a');
  });

  test('uses the supplied label in graph error messages', () => {
    const graph: WorkflowGraph = {
      version: 1,
      entry: 'a',
      terminal: [],
      steps: [{ id: 'a', spec: './a.json' }],
      transitions: [{ from: 'a', to: 'b', condition: 'undefined' }],
    };
    const errors = validateGraphPredicateReferences(graph, {}, 'custom.json');
    expect(errors).toHaveLength(1);
    expect(errors[0]?.startsWith('custom.json:')).toBe(true);
  });
});
