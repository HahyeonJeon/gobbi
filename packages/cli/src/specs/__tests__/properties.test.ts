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
import { compileVerificationBlock } from '../verification-block.js';
import type { StepSpec } from '../types.js';
import { initialState } from '../../workflow/state.js';
import type { WorkflowState } from '../../workflow/state.js';
import { EventStore } from '../../workflow/store.js';
import {
  aggregateCost,
  COST_EMPTY_SESSION_MESSAGE,
} from '../../commands/workflow/status.js';
import type {
  VerificationCommandKind,
  VerificationResultData,
} from '../../workflow/events/verification.js';

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

// ===========================================================================
// E.7 properties (per plan §E.7 and research `e7-properties-and-e2e-patterns.md`)
//
// Three additional properties exercising PR E cross-cutting surface:
//
//   5. Cost-query NULL-safety — for any arbitrary mix of
//      `delegation.complete` events (tokensUsed present/absent,
//      sizeProxyBytes present/absent), the aggregator's source counters
//      fit within the total row count and the cumulative USD is a finite
//      non-negative number.
//   6. `loadProjectConfig` default completeness — for any valid partial
//      config (including `{version:1}`), the returned config is fully
//      populated with defaults at every nested field.
//   7. Verification-block chronological-ordering preservation — for any
//      insertion order of `VerificationResultData` entries, the rendered
//      block lists commands in the compiler's canonical enum order.
// ===========================================================================

// ---------------------------------------------------------------------------
// Property 5 — cost-query NULL-safety.
//
// Seeds an in-memory EventStore with an arbitrary mix of delegation.complete
// events, then invokes `aggregateCost(store)` — the same entry point the
// CLI uses — and asserts:
//   (a) sources.tokens + sources.proxy <= totalRows
//   (b) every per-step bucket's delegation count <= totalRows
//   (c) cumulativeUsd is a finite non-negative number (no NaN/Infinity
//       from null arithmetic leaks)
// Row cap is small (≤ 8) to keep the property fast despite the SQLite
// bookkeeping overhead per row.
// ---------------------------------------------------------------------------

interface ArbitraryCostRowShape {
  readonly subagentId: string;
  readonly step: string;
  readonly tokensKind: 'opus' | 'sonnet' | 'unknown-model' | 'absent';
  readonly bytes: number | null;
}

function arbitraryCostRows(): fc.Arbitrary<
  readonly ArbitraryCostRowShape[]
> {
  return fc.array(
    fc.record({
      subagentId: fc.uuid(),
      step: fc.constantFrom(
        'ideation',
        'plan',
        'execution',
        'memorization',
      ),
      tokensKind: fc.constantFrom(
        'opus' as const,
        'sonnet' as const,
        'unknown-model' as const,
        'absent' as const,
      ),
      // null models the "no sizeProxyBytes recorded" branch; small
      // positive integers exercise proxyCost. Skip zero so the proxy
      // branch's >0 guard lets the row count.
      bytes: fc.option(fc.integer({ min: 1, max: 100_000 }), { nil: null }),
    }),
    { minLength: 0, maxLength: 8 },
  );
}

function seedCostRow(
  store: EventStore,
  row: ArbitraryCostRowShape,
  index: number,
  sessionId: string,
): void {
  const data: Record<string, unknown> = { subagentId: row.subagentId };
  if (row.tokensKind === 'opus') {
    data['model'] = 'claude-opus-4-7';
    data['tokensUsed'] = {
      input_tokens: 1000,
      output_tokens: 500,
      cache_read_input_tokens: 0,
      cache_creation_input_tokens: 0,
    };
  } else if (row.tokensKind === 'sonnet') {
    data['model'] = 'claude-sonnet-4-5';
    data['tokensUsed'] = {
      input_tokens: 1000,
      output_tokens: 500,
      cache_read_input_tokens: 0,
      cache_creation_input_tokens: 0,
    };
  } else if (row.tokensKind === 'unknown-model') {
    data['model'] = 'claude-future-99';
    data['tokensUsed'] = {
      input_tokens: 1000,
      output_tokens: 500,
      cache_read_input_tokens: 0,
      cache_creation_input_tokens: 0,
    };
  }
  // When tokensKind === 'absent', no model/tokensUsed — the proxy path
  // or zero path applies.
  if (row.bytes !== null) {
    data['sizeProxyBytes'] = row.bytes;
  }
  store.append({
    ts: `2026-04-18T10:00:${String(index).padStart(2, '0')}.000Z`,
    type: 'delegation.complete',
    step: row.step,
    data: JSON.stringify(data),
    actor: 'orchestrator',
    parent_seq: null,
    idempotencyKind: 'tool-call',
    toolCallId: `tc-prop-${index}`,
    sessionId,
  });
}

describe('properties: cost-query NULL-safety', () => {
  it('sources.tokens + sources.proxy is bounded by totalRows and cumulativeUsd is finite', () => {
    fc.assert(
      fc.property(arbitraryCostRows(), (rows) => {
        const store = new EventStore(':memory:');
        try {
          rows.forEach((row, i) => {
            seedCostRow(store, row, i, 'prop-cost');
          });
          const rollup = aggregateCost(store);
          if (rows.length === 0) {
            expect(rollup.message).toBe(COST_EMPTY_SESSION_MESSAGE);
            expect(rollup.cumulativeUsd).toBe(0);
            return;
          }
          // Invariant 1: source counters fit within the row total.
          expect(
            rollup.sources.tokens + rollup.sources.proxy,
          ).toBeLessThanOrEqual(rows.length);
          // Invariant 2: cumulativeUsd is finite and non-negative.
          expect(Number.isFinite(rollup.cumulativeUsd)).toBe(true);
          expect(rollup.cumulativeUsd).toBeGreaterThanOrEqual(0);
          // Invariant 3: per-step delegation counts also fit within
          // the row total (no step row count can exceed the total).
          for (const bucket of Object.values(rollup.perStep)) {
            expect(bucket.delegations).toBeLessThanOrEqual(rows.length);
            expect(Number.isFinite(bucket.usd)).toBe(true);
            expect(bucket.usd).toBeGreaterThanOrEqual(0);
          }
        } finally {
          store.close();
        }
      }),
      { numRuns: 30 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 6 (loadProjectConfig default completeness) was removed in Pass 3
// finalize — the `loadProjectConfig` function and its Pass-3 shape were
// replaced by `resolveSettings` in `lib/settings-io.ts` under a different
// contract (no `verification` / `cost` sections; no default-hydration
// contract to property-test). Cascade coverage is exercised end-to-end by
// the `gobbi-config` feature tests instead.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Property 7 — verification-block chronological ordering preservation.
//
// The compiler defines COMMAND_KIND_ORDER = ['lint','typecheck','test',
// 'build','format','custom']. Regardless of the insertion order of
// entries into `state.verificationResults`, the rendered block must list
// the commands in canonical order. Present indices in the render must be
// monotonically non-decreasing in the canonical order.
// ---------------------------------------------------------------------------

const ALL_COMMAND_KINDS: readonly VerificationCommandKind[] = [
  'lint',
  'typecheck',
  'test',
  'build',
  'format',
  'custom',
];

function makeResultFixture(
  subagentId: string,
  commandKind: VerificationCommandKind,
): VerificationResultData {
  return {
    subagentId,
    command: `run-${commandKind}`,
    commandKind,
    exitCode: 0,
    durationMs: 100,
    policy: 'inform',
    timedOut: false,
    stdoutDigest:
      '0000000000000000000000000000000000000000000000000000000000000000',
    stderrDigest:
      '1111111111111111111111111111111111111111111111111111111111111111',
    timestamp: '2026-04-18T10:00:00.000Z',
  };
}

function stateWithResultsInInsertOrder(
  sessionId: string,
  subagentId: string,
  kinds: readonly VerificationCommandKind[],
): WorkflowState {
  const verificationResults: Record<string, VerificationResultData> = {};
  for (const k of kinds) {
    verificationResults[`${subagentId}:${k}`] = makeResultFixture(
      subagentId,
      k,
    );
  }
  return {
    ...initialState(sessionId),
    verificationResults,
  };
}

describe('properties: verification-block canonical ordering', () => {
  it('renders commands in canonical order regardless of insertion order', () => {
    // `fc.shuffledSubarray` returns a shuffled subarray of the source,
    // covering both "all kinds" and "any subset" orderings.
    fc.assert(
      fc.property(
        // `fc.shuffledSubarray` expects a mutable source; pass a copy
        // so the readonly `ALL_COMMAND_KINDS` constant stays immutable.
        fc.shuffledSubarray([...ALL_COMMAND_KINDS], {
          minLength: 1,
          maxLength: ALL_COMMAND_KINDS.length,
        }),
        (insertOrder) => {
          const state = stateWithResultsInInsertOrder(
            'prop-order',
            'sub-order',
            insertOrder,
          );
          const prompt = compileVerificationBlock(state, 'sub-order');
          // For each canonical kind present in the insert order, find
          // its index in the rendered text. Absent kinds are filtered.
          const present = insertOrder.slice().sort((a, b) => {
            const ia = ALL_COMMAND_KINDS.indexOf(a);
            const ib = ALL_COMMAND_KINDS.indexOf(b);
            return ia - ib;
          });
          const indices: number[] = [];
          for (const kind of present) {
            // Rendered row label starts with the command-kind identifier
            // padded to 10 chars; `indexOf` finds its position in the
            // final compiled prompt text.
            const marker = `  ${kind.padEnd(10, ' ')}`;
            const idx = prompt.text.indexOf(marker);
            expect(idx).toBeGreaterThanOrEqual(0);
            indices.push(idx);
          }
          // Monotonic non-decreasing — equivalent to "already sorted
          // ascending" which is the canonical order invariant.
          const sorted = [...indices].sort((a, b) => a - b);
          expect(indices).toEqual(sorted);
        },
      ),
      { numRuns: 50 },
    );
  });
});
