/**
 * Unit tests for `specs/budget.ts` — two-pass floor-then-proportional
 * allocator, whole-section inclusion, ordering preservation, determinism,
 * edge cases, and both public surfaces:
 *
 *   1. `allocate()` — direct call with explicit (section, slot) tagging.
 *   2. `BudgetAllocator.allocate()` — the interface A.4's `compile()`
 *      consumes, which infers the slot from each section's `id`.
 *
 * Tests map 1:1 to the acceptance criteria listed in the A.5 briefing.
 */

import { describe, test, expect } from 'bun:test';

import {
  allocate,
  estimateTokens,
  createAllocator,
  defaultBudgetAllocator,
  inferSlot,
  BudgetOverflowError,
  InvalidTokenBudgetError,
  SLOTS,
  type BudgetInput,
  type BudgetInputEntry,
  type Slot,
} from '../budget.js';
import {
  makeStatic,
  makeSession,
  makeDynamic,
} from '../sections.js';
import type { CompiledSectionLike, TokenBudget } from '../types.js';

// ===========================================================================
// Shared helpers
// ===========================================================================

/**
 * Build a content string of approximately `targetTokens` tokens under the
 * default `estimateTokens` heuristic (`ceil(length / 4)`). We use `length
 * = targetTokens * 4` which produces exactly `targetTokens` tokens per the
 * heuristic — handy for predictable budget arithmetic in tests.
 */
function contentOfTokens(targetTokens: number): string {
  return 'x'.repeat(targetTokens * 4);
}

/**
 * Even-proportion budget helper. All five slots receive 0.2. Useful for
 * tests that need a well-formed budget but do not care about the shape.
 */
const EVEN_BUDGET: TokenBudget = {
  staticPrefix: 0.2,
  session: 0.2,
  instructions: 0.2,
  artifacts: 0.2,
  materials: 0.2,
};

/**
 * Factory for `(section, slot)` entries. Keeps test call sites readable.
 */
function entry(
  section: BudgetInputEntry['section'],
  slot: Slot,
): BudgetInputEntry {
  return { section, slot };
}

/**
 * Map a list of sections to their ids — used repeatedly in assertions.
 */
function ids(list: readonly CompiledSectionLike[]): string[] {
  return list.map((s) => s.id);
}

// ===========================================================================
// estimateTokens
// ===========================================================================

describe('estimateTokens', () => {
  test('returns 0 for an empty string (no phantom unit)', () => {
    expect(estimateTokens('')).toBe(0);
  });

  test('uses ceil(length / 4)', () => {
    expect(estimateTokens('a')).toBe(1);
    expect(estimateTokens('ab')).toBe(1);
    expect(estimateTokens('abc')).toBe(1);
    expect(estimateTokens('abcd')).toBe(1);
    expect(estimateTokens('abcde')).toBe(2);
    expect(estimateTokens('abcdefgh')).toBe(2);
    expect(estimateTokens('abcdefghi')).toBe(3);
  });

  test('is deterministic across calls', () => {
    const s = 'hello world '.repeat(17);
    const a = estimateTokens(s);
    const b = estimateTokens(s);
    expect(a).toBe(b);
  });
});

// ===========================================================================
// SLOTS constant
// ===========================================================================

describe('SLOTS', () => {
  test('covers every TokenBudget field exactly once', () => {
    // If someone adds a TokenBudget field without updating SLOTS, this
    // test fails: the spread of EVEN_BUDGET must cover exactly SLOTS.
    const budgetKeys: string[] = Object.keys(EVEN_BUDGET).sort();
    const slotNames: string[] = [...SLOTS].map((s) => s).sort();
    expect(slotNames).toEqual(budgetKeys);
  });
});

// ===========================================================================
// inferSlot — id-prefix based mapping for the BudgetAllocator path
// ===========================================================================

describe('inferSlot', () => {
  test('blocks.static maps to staticPrefix', () => {
    expect(inferSlot({ id: 'blocks.static', content: '', contentHash: 'x' })).toBe(
      'staticPrefix',
    );
  });

  test('skills.* maps to staticPrefix', () => {
    expect(inferSlot({ id: 'skills.gotcha', content: '', contentHash: 'x' })).toBe(
      'staticPrefix',
    );
  });

  test('session.state and session.* map to session', () => {
    expect(inferSlot({ id: 'session.state', content: '', contentHash: 'x' })).toBe(
      'session',
    );
    expect(inferSlot({ id: 'session.meta', content: '', contentHash: 'x' })).toBe(
      'session',
    );
  });

  test('dynamic.context maps to artifacts', () => {
    expect(
      inferSlot({ id: 'dynamic.context', content: '', contentHash: 'x' }),
    ).toBe('artifacts');
  });

  test('blocks.conditional.*, blocks.synthesis, blocks.completion, blocks.delegation.* map to instructions', () => {
    const check = (id: string): Slot =>
      inferSlot({ id, content: '', contentHash: 'x' });
    expect(check('blocks.conditional.loop-back')).toBe('instructions');
    expect(check('blocks.synthesis')).toBe('instructions');
    expect(check('blocks.completion')).toBe('instructions');
    expect(check('blocks.delegation.pi.innovative')).toBe('instructions');
  });

  test('blocks.footer maps to instructions (peer to blocks.completion)', () => {
    // The JIT step-completion footer is load-bearing for workflow
    // advancement — the agent reads it to learn the exact `gobbi workflow
    // transition <VERB>` command to run. Mapping to `instructions` keeps it
    // from being evicted as low-priority `materials` under context pressure.
    expect(
      inferSlot({ id: 'blocks.footer', content: '', contentHash: 'x' }),
    ).toBe('instructions');
  });

  test('materials.* and dynamic.* (non-context) and unknown prefixes map to materials', () => {
    const check = (id: string): Slot =>
      inferSlot({ id, content: '', contentHash: 'x' });
    expect(check('materials.gotcha-guard')).toBe('materials');
    expect(check('dynamic.violations')).toBe('materials');
    expect(check('totally-unknown-prefix.x')).toBe('materials');
  });
});

// ===========================================================================
// Pass 1 — Floor-respecting behaviour
// ===========================================================================

describe('allocate — Pass 1 (floors)', () => {
  test('throws BudgetOverflowError when minTokens sum exceeds the context window', () => {
    // Two sections, each requiring 600 tokens minimum, but the context
    // window is only 1000 tokens. Sum of floors = 1200 > 1000 → throw.
    const a = makeStatic({
      id: 'a',
      content: contentOfTokens(600),
      minTokens: 600,
    });
    const b = makeStatic({
      id: 'b',
      content: contentOfTokens(600),
      minTokens: 600,
    });
    const input: BudgetInput = [
      entry(a, 'staticPrefix'),
      entry(b, 'staticPrefix'),
    ];

    expect(() => allocate(input, 1000, EVEN_BUDGET)).toThrow(BudgetOverflowError);
  });

  test('BudgetOverflowError message lists contributing sections', () => {
    const a = makeStatic({
      id: 'static.role',
      content: contentOfTokens(400),
      minTokens: 400,
    });
    const b = makeStatic({
      id: 'static.gotchas',
      content: contentOfTokens(500),
      minTokens: 500,
    });
    const input: BudgetInput = [
      entry(a, 'staticPrefix'),
      entry(b, 'materials'),
    ];

    try {
      allocate(input, 800, EVEN_BUDGET);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(BudgetOverflowError);
      if (err instanceof BudgetOverflowError) {
        expect(err.floorTotal).toBe(900);
        expect(err.contextWindowTokens).toBe(800);
        expect(err.overflow).toBe(100);
        expect(err.contributors).toHaveLength(2);
        expect(err.message).toContain('static.role');
        expect(err.message).toContain('static.gotchas');
        expect(err.message).toContain('overflow by 100');
      }
    }
  });

  test('grants each section its declared minTokens when budget permits', () => {
    // Section `a` carries minTokens=500 and has 500 tokens of content.
    // Context window is plenty large (10_000). `a` must be included.
    const a = makeStatic({
      id: 'a',
      content: contentOfTokens(500),
      minTokens: 500,
    });
    const input: BudgetInput = [entry(a, 'staticPrefix')];
    const result = allocate(input, 10_000, EVEN_BUDGET);

    expect(result.included).toHaveLength(1);
    expect(result.included[0]?.id).toBe('a');
    expect(result.dropped).toHaveLength(0);
  });

  test('floor-protected section is included even when slot share alone is too small', () => {
    // Slot shares are tiny (1% each for four slots, 96% for materials).
    // Without the floor, the 800-token section in staticPrefix (share
    // 1% * 10_000 = 100 tokens) would never fit. The 600-token floor
    // overrides the slot share and secures inclusion.
    const starving: TokenBudget = {
      staticPrefix: 0.01,
      session: 0.01,
      instructions: 0.01,
      artifacts: 0.01,
      materials: 0.96,
    };
    const a = makeStatic({
      id: 'big.static',
      content: contentOfTokens(800),
      minTokens: 600,
    });
    const input: BudgetInput = [entry(a, 'staticPrefix')];
    const result = allocate(input, 10_000, starving);

    expect(result.included).toHaveLength(1);
    expect(result.included[0]?.id).toBe('big.static');
  });

  test('sections without minTokens are not floor-protected', () => {
    // A section with no `minTokens` larger than its slot's share is
    // dropped. Only floor-tagged sections override the proportional pass.
    const tiny: TokenBudget = {
      staticPrefix: 0.01,
      session: 0.01,
      instructions: 0.01,
      artifacts: 0.01,
      materials: 0.96,
    };
    const a = makeStatic({
      id: 'big.static',
      content: contentOfTokens(800),
      // no minTokens
    });
    const input: BudgetInput = [entry(a, 'staticPrefix')];
    const result = allocate(input, 10_000, tiny);

    expect(result.included).toHaveLength(0);
    expect(result.dropped).toHaveLength(1);
    expect(result.dropped[0]?.id).toBe('big.static');
  });
});

// ===========================================================================
// Pass 2 — Proportional inclusion order
// ===========================================================================

describe('allocate — Pass 2 (proportional)', () => {
  test('within a slot, sections are admitted in input order', () => {
    // `instructions` slot gets 20% of 2000 = 400 tokens. Three sections
    // each cost 150 tokens → only the first two fit (300 total); the
    // third exceeds remaining 100 and is dropped.
    const a = makeStatic({ id: 'ins.a', content: contentOfTokens(150) });
    const b = makeStatic({ id: 'ins.b', content: contentOfTokens(150) });
    const c = makeStatic({ id: 'ins.c', content: contentOfTokens(150) });
    const input: BudgetInput = [
      entry(a, 'instructions'),
      entry(b, 'instructions'),
      entry(c, 'instructions'),
    ];
    const result = allocate(input, 2000, EVEN_BUDGET);

    expect(ids(result.included)).toEqual(['ins.a', 'ins.b']);
    expect(ids(result.dropped)).toEqual(['ins.c']);
  });

  test('exhausted slot does not borrow from other slots', () => {
    // `instructions` slot = 20% of 1000 = 200 tokens. A 300-token
    // instructions section does not fit, and is NOT rescued by the
    // materials slot sitting idle with its own 200 tokens.
    const overflowSec = makeStatic({
      id: 'ins.overflow',
      content: contentOfTokens(300),
    });
    const input: BudgetInput = [entry(overflowSec, 'instructions')];
    const result = allocate(input, 1000, EVEN_BUDGET);

    expect(result.included).toHaveLength(0);
    expect(result.dropped).toHaveLength(1);
  });

  test('distributes across multiple slots respecting each slot share', () => {
    // Context 2000 tokens. Budget puts 40% (800) into staticPrefix,
    // 20% (400) into instructions, 20% (400) into artifacts, 10% (200)
    // session, 10% (200) materials.
    //
    //   staticPrefix gets one 700-token section (fits in 800 share).
    //   session gets one 150-token section (fits in 200 share).
    //   instructions gets one 500-token section (does NOT fit in 400 share).
    //   artifacts gets one 350-token section (fits in 400 share).
    //   materials gets one 100-token section (fits in 200 share).
    const budget: TokenBudget = {
      staticPrefix: 0.4,
      session: 0.1,
      instructions: 0.2,
      artifacts: 0.2,
      materials: 0.1,
    };
    const staticSec = makeStatic({ id: 's', content: contentOfTokens(700) });
    const sessionSec = makeSession({ id: 'se', content: contentOfTokens(150) });
    const instrSec = makeStatic({ id: 'i', content: contentOfTokens(500) });
    const artifactSec = makeDynamic({ id: 'a', content: contentOfTokens(350) });
    const materialSec = makeStatic({ id: 'm', content: contentOfTokens(100) });
    const input: BudgetInput = [
      entry(staticSec, 'staticPrefix'),
      entry(sessionSec, 'session'),
      entry(instrSec, 'instructions'),
      entry(artifactSec, 'artifacts'),
      entry(materialSec, 'materials'),
    ];
    const result = allocate(input, 2000, budget);

    expect(ids(result.included)).toEqual(['s', 'se', 'a', 'm']);
    expect(ids(result.dropped)).toEqual(['i']);
  });
});

// ===========================================================================
// Whole-section inclusion — the critical invariant
// ===========================================================================

describe('allocate — whole-section inclusion only', () => {
  test('a section that would partially fit is dropped entirely', () => {
    // Budget = 2000. EVEN_BUDGET → 400 per slot. Two instructions each
    // 300 tokens. First fits (400-300=100 left). Second does NOT fit
    // (300 > 100 remaining) — must be dropped wholesale, not truncated.
    const a = makeStatic({ id: 'i.a', content: contentOfTokens(300) });
    const b = makeStatic({ id: 'i.b', content: contentOfTokens(300) });
    const input: BudgetInput = [
      entry(a, 'instructions'),
      entry(b, 'instructions'),
    ];
    const result = allocate(input, 2000, EVEN_BUDGET);

    expect(result.included).toHaveLength(1);
    expect(result.included[0]?.id).toBe('i.a');
    expect(result.dropped).toHaveLength(1);
    expect(result.dropped[0]?.id).toBe('i.b');
    // Ensure no content was shortened — the included section is
    // byte-for-byte identical to its input.
    expect(result.included[0]?.content).toBe(a.content);
    // And the dropped section likewise is unchanged.
    expect(result.dropped[0]?.content).toBe(b.content);
  });
});

// ===========================================================================
// Ordering preservation — cache prefix stability
// ===========================================================================

describe('allocate — ordering preservation', () => {
  test('included preserves original input order across slots', () => {
    // Input order: static.a, session.b, static.c, dynamic.d, material.e.
    // Slots differ; included must preserve the ORIGINAL index order, not
    // be re-grouped by slot.
    const staticA = makeStatic({ id: 'static.a', content: contentOfTokens(50) });
    const sessionB = makeSession({ id: 'session.b', content: contentOfTokens(50) });
    const staticC = makeStatic({ id: 'static.c', content: contentOfTokens(50) });
    const dynamicD = makeDynamic({ id: 'dynamic.d', content: contentOfTokens(50) });
    const materialE = makeStatic({ id: 'material.e', content: contentOfTokens(50) });
    const input: BudgetInput = [
      entry(staticA, 'staticPrefix'),
      entry(sessionB, 'session'),
      entry(staticC, 'staticPrefix'),
      entry(dynamicD, 'artifacts'),
      entry(materialE, 'materials'),
    ];
    const result = allocate(input, 10_000, EVEN_BUDGET);

    expect(result.included).toHaveLength(5);
    expect(ids(result.included)).toEqual([
      'static.a',
      'session.b',
      'static.c',
      'dynamic.d',
      'material.e',
    ]);
  });

  test('dropped preserves original input order', () => {
    const a = makeStatic({ id: 'a', content: contentOfTokens(400) });
    const b = makeStatic({ id: 'b', content: contentOfTokens(400) });
    const c = makeStatic({ id: 'c', content: contentOfTokens(400) });
    const input: BudgetInput = [
      entry(a, 'instructions'),
      entry(b, 'instructions'),
      entry(c, 'instructions'),
    ];
    // instructions slot = 20% of 2000 = 400 → only one of three fits.
    const result = allocate(input, 2000, EVEN_BUDGET);

    expect(ids(result.included)).toEqual(['a']);
    expect(ids(result.dropped)).toEqual(['b', 'c']);
  });
});

// ===========================================================================
// Determinism
// ===========================================================================

describe('allocate — determinism', () => {
  test('same inputs produce same AllocationResult across calls', () => {
    const a = makeStatic({ id: 'a', content: contentOfTokens(150) });
    const b = makeStatic({
      id: 'b',
      content: contentOfTokens(500),
      minTokens: 300,
    });
    const c = makeDynamic({ id: 'c', content: contentOfTokens(120) });
    const input: BudgetInput = [
      entry(a, 'staticPrefix'),
      entry(b, 'instructions'),
      entry(c, 'artifacts'),
    ];
    const r1 = allocate(input, 3000, EVEN_BUDGET);
    const r2 = allocate(input, 3000, EVEN_BUDGET);
    const r3 = allocate(input, 3000, EVEN_BUDGET);

    expect(ids(r1.included)).toEqual(ids(r2.included));
    expect(ids(r2.included)).toEqual(ids(r3.included));
    expect(ids(r1.dropped)).toEqual(ids(r2.dropped));
    expect(ids(r2.dropped)).toEqual(ids(r3.dropped));
  });
});

// ===========================================================================
// Edge cases
// ===========================================================================

describe('allocate — edge cases', () => {
  test('empty sections list produces an empty result', () => {
    const result = allocate([], 1000, EVEN_BUDGET);
    expect(result.included).toEqual([]);
    expect(result.dropped).toEqual([]);
  });

  test('context window of 0 drops every section without minTokens', () => {
    const a = makeStatic({ id: 'a', content: contentOfTokens(100) });
    const input: BudgetInput = [entry(a, 'staticPrefix')];
    const result = allocate(input, 0, EVEN_BUDGET);

    expect(result.included).toHaveLength(0);
    expect(result.dropped).toHaveLength(1);
  });

  test('all sections exceed their slot share → all dropped', () => {
    const a = makeStatic({ id: 'a', content: contentOfTokens(500) });
    const b = makeDynamic({ id: 'b', content: contentOfTokens(500) });
    const c = makeSession({ id: 'c', content: contentOfTokens(500) });
    const input: BudgetInput = [
      entry(a, 'staticPrefix'),
      entry(b, 'artifacts'),
      entry(c, 'session'),
    ];
    // EVEN_BUDGET with 1000-token window → 200 per slot. Each section
    // needs 500, no slot can take any. All drop.
    const result = allocate(input, 1000, EVEN_BUDGET);

    expect(result.included).toHaveLength(0);
    expect(result.dropped).toHaveLength(3);
    expect(ids(result.dropped)).toEqual(['a', 'b', 'c']);
  });

  test('zero-proportion slot excludes every section routed to it', () => {
    const zeroArtifacts: TokenBudget = {
      staticPrefix: 0.4,
      session: 0.2,
      instructions: 0.2,
      artifacts: 0.0,
      materials: 0.2,
    };
    const a = makeStatic({ id: 'keep', content: contentOfTokens(100) });
    const b = makeDynamic({ id: 'drop', content: contentOfTokens(100) });
    const input: BudgetInput = [
      entry(a, 'staticPrefix'),
      entry(b, 'artifacts'),
    ];
    const result = allocate(input, 2000, zeroArtifacts);

    expect(ids(result.included)).toEqual(['keep']);
    expect(ids(result.dropped)).toEqual(['drop']);
  });

  test('zero-cost (empty content) section is always included', () => {
    const a = makeStatic({ id: 'empty', content: '' });
    const input: BudgetInput = [entry(a, 'staticPrefix')];
    const result = allocate(input, 0, EVEN_BUDGET);
    expect(ids(result.included)).toEqual(['empty']);
  });

  test('minTokens larger than the section tokens is clamped to tokens', () => {
    // A section with 100 tokens of content but minTokens=500 should only
    // demand a 100-token floor (its whole cost). This prevents a floor
    // requirement that exceeds the section's own size from inflating
    // the floor-sum diagnostic.
    const a = makeStatic({
      id: 'clamped',
      content: contentOfTokens(100),
      minTokens: 500,
    });
    const input: BudgetInput = [entry(a, 'staticPrefix')];
    // Window 150 > 100-token size; would overflow if floor were 500,
    // but floor clamps to 100 → fits.
    const result = allocate(input, 150, EVEN_BUDGET);
    expect(ids(result.included)).toEqual(['clamped']);
  });
});

// ===========================================================================
// Argument validation
// ===========================================================================

describe('allocate — argument validation', () => {
  test('throws InvalidTokenBudgetError when proportions do not sum to 1', () => {
    const bad: TokenBudget = {
      staticPrefix: 0.5,
      session: 0.5,
      instructions: 0.5,
      artifacts: 0,
      materials: 0,
    };
    expect(() => allocate([], 1000, bad)).toThrow(InvalidTokenBudgetError);
  });

  test('throws InvalidTokenBudgetError when a proportion is negative', () => {
    const bad: TokenBudget = {
      staticPrefix: 1.1,
      session: -0.1,
      instructions: 0,
      artifacts: 0,
      materials: 0,
    };
    expect(() => allocate([], 1000, bad)).toThrow(InvalidTokenBudgetError);
  });

  test('throws InvalidTokenBudgetError when a proportion is not finite', () => {
    const bad: TokenBudget = {
      staticPrefix: Number.NaN,
      session: 0,
      instructions: 0,
      artifacts: 0,
      materials: 0,
    };
    expect(() => allocate([], 1000, bad)).toThrow(InvalidTokenBudgetError);
  });

  test('throws InvalidTokenBudgetError when contextWindowTokens is negative', () => {
    expect(() => allocate([], -1, EVEN_BUDGET)).toThrow(InvalidTokenBudgetError);
  });

  test('throws InvalidTokenBudgetError when contextWindowTokens is NaN', () => {
    expect(() => allocate([], Number.NaN, EVEN_BUDGET)).toThrow(
      InvalidTokenBudgetError,
    );
  });
});

// ===========================================================================
// Non-strict floor mode
// ===========================================================================

describe('allocate — non-strict floor mode', () => {
  test('strictFloors: false drops unsatisfiable floors instead of throwing', () => {
    const a = makeStatic({
      id: 'a',
      content: contentOfTokens(600),
      minTokens: 600,
    });
    const b = makeStatic({
      id: 'b',
      content: contentOfTokens(600),
      minTokens: 600,
    });
    const input: BudgetInput = [
      entry(a, 'staticPrefix'),
      entry(b, 'staticPrefix'),
    ];
    const result = allocate(input, 1000, EVEN_BUDGET, { strictFloors: false });

    // `a` wins the floor; `b` cannot because 600 + 600 > 1000.
    expect(ids(result.included)).toEqual(['a']);
    expect(ids(result.dropped)).toEqual(['b']);
  });
});

// ===========================================================================
// Custom token counter (Phase 3 swap path)
// ===========================================================================

describe('allocate — custom token counter', () => {
  test('options.tokenCounter replaces estimateTokens for this call', () => {
    // Counter that always returns 0 → everything "fits".
    const zero: () => number = () => 0;
    const a = makeStatic({ id: 'a', content: contentOfTokens(10_000) });
    const input: BudgetInput = [entry(a, 'staticPrefix')];
    const result = allocate(input, 100, EVEN_BUDGET, { tokenCounter: zero });

    expect(result.included).toHaveLength(1);
  });

  test('custom counter affects floor computations as well', () => {
    // Counter that returns exactly 10 for any content. A section with
    // minTokens=50 but content that the counter calls 10 gets its floor
    // clamped to 10 (whole-section cost), not 50.
    const constTen: () => number = () => 10;
    const a = makeStatic({
      id: 'a',
      content: 'anything',
      minTokens: 50,
    });
    const input: BudgetInput = [entry(a, 'staticPrefix')];
    const result = allocate(input, 20, EVEN_BUDGET, {
      tokenCounter: constTen,
    });

    expect(ids(result.included)).toEqual(['a']);
  });
});

// ===========================================================================
// BudgetAllocator surface — the A.4-compile() contract
//
// The BudgetAllocator interface takes flat `CompiledSectionLike[]` (no
// slot tags) and infers the slot from each section's `id`. These tests
// exercise the id-prefix inference alongside the allocation algorithm.
// ===========================================================================

describe('BudgetAllocator — default instance', () => {
  test('defaultBudgetAllocator routes sections via inferSlot', () => {
    // 2000-token window, EVEN_BUDGET → 400 per slot.
    //
    //   'blocks.static'   → staticPrefix (slot share 400)  — 100-token
    //                       section fits.
    //   'session.state'   → session (slot share 400)       — 100-token
    //                       section fits.
    //   'dynamic.context' → artifacts (slot share 400)     — 100-token
    //                       section fits.
    //   'blocks.synthesis'→ instructions (slot share 400)  — 100-token
    //                       section fits.
    //   'materials.notes' → materials (slot share 400)     — 100-token
    //                       section fits.
    const s1 = makeStatic({ id: 'blocks.static', content: contentOfTokens(100) });
    const s2 = makeSession({ id: 'session.state', content: contentOfTokens(100) });
    const s3 = makeDynamic({ id: 'dynamic.context', content: contentOfTokens(100) });
    const s4 = makeStatic({ id: 'blocks.synthesis', content: contentOfTokens(100) });
    const s5 = makeStatic({ id: 'materials.notes', content: contentOfTokens(100) });
    const sections: readonly CompiledSectionLike[] = [s1, s2, s3, s4, s5];

    const result = defaultBudgetAllocator.allocate(sections, 2000, EVEN_BUDGET);

    expect(ids(result.included)).toEqual([
      'blocks.static',
      'session.state',
      'dynamic.context',
      'blocks.synthesis',
      'materials.notes',
    ]);
    expect(result.dropped).toHaveLength(0);
  });

  test('defaultBudgetAllocator drops when a slot is starved', () => {
    // All three sections routed to `instructions` (combined) but the
    // slot's share is only 20% of 2000 = 400 tokens. Two 250-token
    // sections exceed that: first fits (400-250=150), second does not
    // (250 > 150). Third is a `blocks.static` and goes to staticPrefix.
    const cond = makeStatic({
      id: 'blocks.conditional.loop',
      content: contentOfTokens(250),
    });
    const syn = makeStatic({
      id: 'blocks.synthesis',
      content: contentOfTokens(250),
    });
    const stat = makeStatic({
      id: 'blocks.static',
      content: contentOfTokens(100),
    });
    const sections: readonly CompiledSectionLike[] = [cond, syn, stat];

    const result = defaultBudgetAllocator.allocate(sections, 2000, EVEN_BUDGET);

    expect(ids(result.included)).toEqual([
      'blocks.conditional.loop',
      'blocks.static',
    ]);
    expect(ids(result.dropped)).toEqual(['blocks.synthesis']);
  });

  test('defaultBudgetAllocator throws BudgetOverflowError on floor sum overflow', () => {
    // Two floor-tagged sections in combination demand 1200 tokens; window
    // is 1000. The default strict-floors behavior throws.
    const a = makeStatic({
      id: 'blocks.static',
      content: contentOfTokens(600),
      minTokens: 600,
    });
    const b = makeStatic({
      id: 'skills.gotcha',
      content: contentOfTokens(600),
      minTokens: 600,
    });
    const sections: readonly CompiledSectionLike[] = [a, b];
    expect(() =>
      defaultBudgetAllocator.allocate(sections, 1000, EVEN_BUDGET),
    ).toThrow(BudgetOverflowError);
  });
});

describe('BudgetAllocator — createAllocator factory', () => {
  test('slotOf option replaces the default inferSlot', () => {
    // A bespoke slotOf that routes every section to 'instructions' no
    // matter its id. Slot share for instructions at 20% * 1000 = 200
    // tokens. One 150-token section fits; the second does not.
    const allocator = createAllocator({
      slotOf: () => 'instructions',
    });
    const a = makeStatic({ id: 'alpha', content: contentOfTokens(150) });
    const b = makeStatic({ id: 'beta', content: contentOfTokens(150) });
    const result = allocator.allocate([a, b], 1000, EVEN_BUDGET);

    expect(ids(result.included)).toEqual(['alpha']);
    expect(ids(result.dropped)).toEqual(['beta']);
  });

  test('tokenCounter option is applied to every call', () => {
    const allocator = createAllocator({ tokenCounter: () => 0 });
    const a = makeStatic({ id: 'blocks.static', content: contentOfTokens(10_000) });
    const result = allocator.allocate([a], 100, EVEN_BUDGET);
    expect(ids(result.included)).toEqual(['blocks.static']);
  });

  test('strictFloors option is applied to every call', () => {
    const lenient = createAllocator({ strictFloors: false });
    const a = makeStatic({
      id: 'blocks.static',
      content: contentOfTokens(600),
      minTokens: 600,
    });
    const b = makeStatic({
      id: 'skills.gotcha',
      content: contentOfTokens(600),
      minTokens: 600,
    });
    expect(() => lenient.allocate([a, b], 1000, EVEN_BUDGET)).not.toThrow();
  });
});
