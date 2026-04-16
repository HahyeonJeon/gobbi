/**
 * Property-based tests for `specs/assembly.ts` using `fast-check`.
 *
 * Four properties (per the A.4 briefing):
 *
 *   1. Cache-ordered assembly invariant — for any shuffled ordering of
 *      sections, the runtime `assertCacheOrdered` check rejects
 *      non-conforming tuples and accepts Static→Session→Dynamic.
 *   2. Static-prefix stability — for a fixed set of static blocks and
 *      varying dynamic/session inputs, `staticPrefixHash` is invariant.
 *   3. Content-linter soundness — synthetic content built around each
 *      flagged pattern is caught by the linter.
 *   4. Idempotency — `compile(sameInputs) === compile(sameInputs)` (text,
 *      hashes, section list).
 *
 * Sample size is deliberately small (≤ 100 per property by default) to keep
 * the suite under 5 seconds. The lint-rule sweep uses `numRuns: 50`; the
 * ordering property uses `numRuns: 100`.
 *
 * This file is SEPARATE from the Phase 1 property-test file at
 * `packages/cli/src/workflow/__tests__/properties.test.ts`. A.4 must not
 * edit that file (parallel-safety requirement from the briefing).
 */

import { describe, it, test, expect } from 'bun:test';
import fc from 'fast-check';

import {
  compile,
  renderSpec,
  assertCacheOrdered,
  STATIC_LINT_RULES,
  lintSectionContent,
  CacheOrderError,
  type CompileInput,
  type CompilePredicateRegistry,
  type DynamicContext,
} from '../assembly.js';
import type { StepSpec } from '../types.js';
import { initialState } from '../../workflow/state.js';
import type { WorkflowState } from '../../workflow/state.js';

// ===========================================================================
// Fixtures — a deterministic base spec/input for properties that don't
// themselves randomize the spec.
// ===========================================================================

function baseSpec(): StepSpec {
  return {
    $schema: 'https://gobbi.dev/schemas/step-spec/v1',
    version: 1,
    meta: {
      description: 'Property-test spec',
      allowedAgentTypes: ['__pi'],
      maxParallelAgents: 2,
      requiredSkills: [],
      optionalSkills: [],
      expectedArtifacts: [],
      completionSignal: 'SubagentStop',
    },
    transitions: [{ to: 'plan', condition: 'always' }],
    delegation: { agents: [] },
    tokenBudget: {
      staticPrefix: 0.5,
      session: 0.1,
      instructions: 0.2,
      artifacts: 0.1,
      materials: 0.1,
    },
    blocks: {
      static: [
        { id: 'role', content: 'Role: orchestrator.' },
        { id: 'principles', content: 'Principle one. Principle two.' },
      ],
      conditional: [],
      delegation: {},
      synthesis: [{ id: 'synth', content: 'Synthesize the work.' }],
      completion: {
        instruction: 'Finalize.',
        criteria: ['done'],
      },
    },
  };
}

function baseState(): WorkflowState {
  return initialState('prop-test');
}

const EMPTY_REGISTRY: CompilePredicateRegistry = {};

function baseInput(overrides: Partial<CompileInput> = {}): CompileInput {
  return {
    spec: baseSpec(),
    state: baseState(),
    dynamic: {
      timestamp: '2026-04-16T00:00:00Z',
      activeSubagentCount: 0,
      artifacts: [],
    },
    predicates: EMPTY_REGISTRY,
    activeAgent: null,
    ...overrides,
  };
}

// ===========================================================================
// Arbitraries for dynamic/session variation
// ===========================================================================

function arbDynamic(): fc.Arbitrary<DynamicContext> {
  // Use an integer millisecond arbitrary and construct the Date ourselves so
  // fast-check's shrinker cannot produce an Invalid Date (which has happened
  // with fc.date() under some fast-check versions).
  const MIN_MS = Date.UTC(2020, 0, 1);
  const MAX_MS = Date.UTC(2030, 11, 31);
  return fc.record({
    timestamp: fc
      .integer({ min: MIN_MS, max: MAX_MS })
      .map((ms) => new Date(ms).toISOString()),
    activeSubagentCount: fc.integer({ min: 0, max: 10 }),
    artifacts: fc.array(
      fc.record({
        name: fc
          .string({ minLength: 1, maxLength: 20 })
          .map((s) => s.replace(/[^a-zA-Z0-9_-]/g, 'x') + '.md'),
        content: fc.string({ maxLength: 200 }),
      }),
      { maxLength: 3 },
    ),
  });
}

function arbSessionStateVariant(
  base: WorkflowState,
): fc.Arbitrary<WorkflowState> {
  return fc.record({
    currentStep: fc.constantFrom(
      'idle' as const,
      'ideation' as const,
      'plan' as const,
      'execution' as const,
      'memorization' as const,
    ),
    feedbackRound: fc.integer({ min: 0, max: 5 }),
    completedSteps: fc.array(
      fc.constantFrom('idle', 'ideation', 'plan', 'execution'),
      { maxLength: 4 },
    ),
  }).map((overrides) => ({
    ...base,
    currentStep: overrides.currentStep,
    feedbackRound: overrides.feedbackRound,
    completedSteps: overrides.completedSteps,
  }));
}

// ===========================================================================
// Property 1 — Cache-ordered assembly invariant
//
// Generate a random multiset of kinds, shuffle, and assert
// `assertCacheOrdered` accepts iff the list is actually Static* → Session*
// → Dynamic*.
// ===========================================================================

type SectionKind = 'static' | 'session' | 'dynamic';

function isCacheOrdered(kinds: readonly SectionKind[]): boolean {
  let phase = 0;
  for (const k of kinds) {
    const want = k === 'static' ? 0 : k === 'session' ? 1 : 2;
    if (want < phase) return false;
    phase = want;
  }
  return true;
}

// Use a small, realistic alphabet of kinds and a bounded length.
function arbKindMultiset(): fc.Arbitrary<readonly SectionKind[]> {
  return fc.array(
    fc.constantFrom<SectionKind>('static', 'session', 'dynamic'),
    { minLength: 0, maxLength: 8 },
  );
}

// Build a KindedSection-shaped list using real branded sections. The
// factories in sections.ts carry the module-private brand symbols we
// cannot reach from here — `assertCacheOrdered` reads only the `kind`
// field, but we still supply genuine sections so the types line up.
import { makeStatic, makeSession, makeDynamic } from '../sections.js';
import type { KindedSection } from '../assembly.js';

function synthesizeKindedList(
  kinds: readonly SectionKind[],
): readonly KindedSection[] {
  return kinds.map((k, i) => {
    const input = { id: `s${i}`, content: `c${i}` };
    if (k === 'static') return { kind: k, section: makeStatic(input) };
    if (k === 'session') return { kind: k, section: makeSession(input) };
    return { kind: k, section: makeDynamic(input) };
  });
}

describe('properties: cache-ordered assembly', () => {
  it('assertCacheOrdered accepts iff kinds form Static* → Session* → Dynamic*', () => {
    fc.assert(
      fc.property(arbKindMultiset(), (kinds) => {
        const list = synthesizeKindedList(kinds);
        const accepts = isCacheOrdered(kinds);
        if (accepts) {
          expect(() => assertCacheOrdered(list)).not.toThrow();
        } else {
          expect(() => assertCacheOrdered(list)).toThrow(CacheOrderError);
        }
        return true;
      }),
      { numRuns: 100 },
    );
  });

  it('renderSpec output always satisfies the ordering predicate', () => {
    // Run compile over varied dynamic/session to confirm the renderer
    // produces a list that passes the predicate, regardless of input.
    fc.assert(
      fc.property(arbDynamic(), (dynamic) => {
        const kinded = renderSpec(baseInput({ dynamic }));
        const kinds = kinded.map((k) => k.kind);
        return isCacheOrdered(kinds);
      }),
      { numRuns: 100 },
    );
  });
});

// ===========================================================================
// Property 2 — Static-prefix hash stability
//
// Fix the spec's static blocks; vary dynamic/session inputs; assert the
// staticPrefixHash stays constant across every variant.
// ===========================================================================

describe('properties: staticPrefixHash stability', () => {
  it('is constant across any dynamic context', () => {
    const baseline = compile(baseInput()).staticPrefixHash;

    fc.assert(
      fc.property(arbDynamic(), (dynamic) => {
        const prompt = compile(baseInput({ dynamic }));
        expect(prompt.staticPrefixHash).toBe(baseline);
      }),
      { numRuns: 100 },
    );
  });

  it('is constant across any session state variation', () => {
    const baseline = compile(baseInput()).staticPrefixHash;
    const base = baseState();

    fc.assert(
      fc.property(arbSessionStateVariant(base), (state) => {
        const prompt = compile(baseInput({ state }));
        expect(prompt.staticPrefixHash).toBe(baseline);
      }),
      { numRuns: 100 },
    );
  });
});

// ===========================================================================
// Property 3 — Content-linter soundness
//
// For each default lint rule, generate content that embeds a known-matching
// example. Assert the linter catches it.
//
// The corpus below is built manually with one or more canonical examples
// per rule (patterns a random generator would never produce reliably).
// fast-check picks examples uniformly; we also iterate every rule as a
// non-property test to keep coverage exhaustive.
// ===========================================================================

// Known-matching exemplars. Each rule-id must have at least one entry.
const LINT_EXEMPLARS: Readonly<Record<string, readonly string[]>> = {
  iso8601: [
    '2026-04-16T11:00:00Z',
    '2025-12-31T23:59:59.123+02:00',
    '2026-04-16T00:00Z',
  ],
  unixTsAdjacent: [
    'time=1710000000',
    'ts: 1710000000000',
    'epoch=1710000000',
    'timestamp 1710000000',
  ],
  uuidV4: [
    '6ba7b810-9dad-41d1-a456-00c04fd430c8',
    'c2b2e5a5-0f6a-4b6c-9f0e-1234567890ab',
  ],
  gobbiSessionId: [
    '20260416-0416-v050-phase2-0f8427c1-136d-428e-8063-510af4d2ec99',
    '20251231-2359-feature-c2b2e5a5-0f6a-4b6c-9f0e-1234567890ab',
  ],
  absolutePathPosix: [
    '/home/alice/notes.md',
    '/Users/bob/work.md',
    '$CLAUDE_PROJECT_DIR',
  ],
  pidOrCounter: [
    'pid=1234',
    'invocationCount=42',
    'callCounter = 99',
  ],
};

describe('properties: content linter soundness', () => {
  // Exhaustive coverage — every default rule has at least one exemplar that
  // the linter catches.
  test('every default rule has exemplars that the linter detects', () => {
    for (const rule of STATIC_LINT_RULES) {
      const exemplars = LINT_EXEMPLARS[rule.id];
      expect(exemplars).toBeDefined();
      if (exemplars === undefined) continue;
      for (const content of exemplars) {
        const issues = lintSectionContent('test', content, STATIC_LINT_RULES);
        const matched = issues.some((i) => i.ruleId === rule.id);
        expect(matched).toBe(true);
      }
    }
  });

  it('randomly-generated safe content is never flagged', () => {
    // Generate content from a restricted alphabet that cannot match any
    // rule pattern. The linter should return zero issues.
    const safeAlphabet = fc.string({
      minLength: 0,
      maxLength: 200,
    }).map((s) =>
      // Strip anything that could match a rule pattern; keep letters,
      // punctuation, and small integers.
      s.replace(/[0-9]{8,}/g, '').replace(/[\/\$=]/g, ' '),
    );

    fc.assert(
      fc.property(safeAlphabet, (content) => {
        const issues = lintSectionContent('safe', content, STATIC_LINT_RULES);
        // `expect` inside returns undefined; we use a boolean for fast-check's
        // predicate contract.
        return issues.length === 0;
      }),
      { numRuns: 100 },
    );
  });

  it('injecting an exemplar into arbitrary safe content still flags the rule', () => {
    // Pick a rule, pick an exemplar for it, splice into arbitrary safe text,
    // and assert the linter flags the rule.
    const ruleIds = Object.keys(LINT_EXEMPLARS);

    fc.assert(
      fc.property(
        fc.constantFrom(...ruleIds),
        fc.string({ maxLength: 50 }).map((s) => s.replace(/[0-9\/\$=]/g, ' ')),
        fc.string({ maxLength: 50 }).map((s) => s.replace(/[0-9\/\$=]/g, ' ')),
        (ruleId, prefix, suffix) => {
          const exemplars = LINT_EXEMPLARS[ruleId];
          if (exemplars === undefined || exemplars.length === 0) return true;
          const exemplar = exemplars[0] ?? '';
          const content = `${prefix} ${exemplar} ${suffix}`;
          const issues = lintSectionContent('test', content, STATIC_LINT_RULES);
          return issues.some((i) => i.ruleId === ruleId);
        },
      ),
      { numRuns: 50 },
    );
  });
});

// ===========================================================================
// Property 4 — Idempotency
//
// compile(x) and compile(x) produce identical text, contentHash,
// staticPrefixHash, and section lists.
// ===========================================================================

describe('properties: compile idempotency', () => {
  it('two calls with the same inputs produce identical output', () => {
    fc.assert(
      fc.property(arbDynamic(), (dynamic) => {
        const a = compile(baseInput({ dynamic }));
        const b = compile(baseInput({ dynamic }));
        expect(a.text).toBe(b.text);
        expect(a.contentHash).toBe(b.contentHash);
        expect(a.staticPrefixHash).toBe(b.staticPrefixHash);
        expect(a.sections.length).toBe(b.sections.length);
        for (let i = 0; i < a.sections.length; i++) {
          expect(a.sections[i]?.id).toBe(b.sections[i]?.id);
          expect(a.sections[i]?.kind).toBe(b.sections[i]?.kind);
          expect(a.sections[i]?.contentHash).toBe(b.sections[i]?.contentHash);
          expect(a.sections[i]?.byteLength).toBe(b.sections[i]?.byteLength);
        }
      }),
      { numRuns: 50 },
    );
  });

  it('varying dynamic only changes text/contentHash, never staticPrefixHash', () => {
    const base = compile(baseInput());
    fc.assert(
      fc.property(arbDynamic(), (dynamic) => {
        const result = compile(baseInput({ dynamic }));
        // Static prefix never moves.
        expect(result.staticPrefixHash).toBe(base.staticPrefixHash);
        // Two identical dynamic contexts collide → same text; otherwise differ.
        if (
          dynamic.timestamp === '2026-04-16T00:00:00Z' &&
          dynamic.activeSubagentCount === 0 &&
          dynamic.artifacts.length === 0
        ) {
          expect(result.text).toBe(base.text);
        }
      }),
      { numRuns: 100 },
    );
  });
});
