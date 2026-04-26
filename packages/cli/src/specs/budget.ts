/**
 * Token budget allocator — two-pass floor-then-proportional across the five
 * `TokenBudget` slots (static prefix, session, instructions, artifacts,
 * materials). See `v050-prompts.md` §Token Budget Awareness for the model.
 *
 * Two invariants from the design doc drive the algorithm:
 *
 * 1. **Section minimums are floors, not soft targets.** Every section carrying
 *    a `minTokens` value must receive at least that many tokens of budget.
 *    If the sum of all minimums exceeds the context window, the allocator
 *    throws a descriptive error — it NEVER silently drops a minTokens
 *    section. (`v050-prompts.md` §Section Minimums.)
 *
 * 2. **Whole-section inclusion only.** A section that would partially fit is
 *    dropped entirely. Mid-section truncation would invalidate the
 *    Anthropic prompt cache prefix at every size change, so the allocator
 *    treats sections as atomic. (`v050-prompts.md` §Priority-Based
 *    Truncation.)
 *
 * The allocator is deterministic and pure: given the same input sections,
 * context window, proportions, and options, it produces the same
 * `AllocationResult` across any number of calls.
 *
 * ---
 *
 * ## Two public surfaces
 *
 * - {@link BudgetAllocator} (from `types.ts`) — the interface A.4's
 *   `compile()` consumes. Accepts a flat `CompiledSectionLike[]` and infers
 *   each section's {@link Slot} from its `id` prefix. This module exports
 *   {@link defaultBudgetAllocator} as the default instance for `compile()`.
 *
 * - {@link allocate} — the direct-call API. Takes a {@link BudgetInput}
 *   where each entry is explicitly tagged with its `slot`. Use this when
 *   the caller already knows the slot mapping and does not want to rely
 *   on id-prefix inference (e.g. PR D's error-pathway compiler).
 *
 * Both surfaces share the same core engine ({@link allocateEntries}) so the
 * algorithm, error types, and test coverage apply identically.
 *
 * ## Token counting — Phase 2 approximation
 *
 * A.5 uses a 4-character-per-token approximation via {@link estimateTokens}.
 * The heuristic matches what `v050-prompts.md` describes and avoids adding a
 * tokenizer production dependency. Phase 3 can swap in a real tokenizer by
 * passing a different {@link TokenCounter} via {@link AllocateOptions}.
 *
 * ## Slot tagging
 *
 * Slot mapping from section → `Slot` is either explicit (in the
 * {@link allocate} path) or inferred from the section's `id` (in the
 * {@link BudgetAllocator} path). See {@link inferSlot} for the exact
 * prefix-to-slot map — it matches the section IDs A.4's `renderSpec`
 * emits.
 *
 * ## Floor-pass priority
 *
 * Floors are granted in input order. Callers are expected to present
 * sections in cache-stable order (Static first, then Session, then Dynamic)
 * which, per `v050-prompts.md` §Token Budget Awareness, matches the design
 * doc's priority: static prefix → gotchas/materials → step instructions →
 * artifacts. No separate priority field is needed; input order IS priority.
 */

import type {
  AllocationResult,
  BudgetAllocator,
  CompiledSectionLike,
  TokenBudget,
} from './types.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * The five budget slots defined by {@link TokenBudget}. Slot names match
 * the `TokenBudget` field names one-for-one; that identity is what lets
 * the allocator map a `Slot` directly to the corresponding proportion.
 */
export type Slot = keyof TokenBudget;

/**
 * Canonical list of slots in a stable order. Useful for iteration and for
 * deriving defaults; order here has no semantic meaning (allocation is
 * independent of slot iteration order).
 */
export const SLOTS: readonly Slot[] = [
  'staticPrefix',
  'session',
  'instructions',
  'artifacts',
  'materials',
] as const;

/**
 * One (section, slot) input row. The caller tags each section with the
 * slot it belongs to when feeding {@link allocate}. The section itself
 * does not carry the slot.
 */
export interface BudgetInputEntry {
  readonly section: CompiledSectionLike;
  readonly slot: Slot;
}

/**
 * Ordered list of input entries. The allocator honours input order both
 * for floor-pass priority (first entries get floors first) and for
 * within-slot inclusion order in the proportional pass.
 */
export type BudgetInput = readonly BudgetInputEntry[];

/**
 * A token counter — takes a rendered content string and returns a
 * non-negative integer token estimate. Implementations must be pure
 * (same input → same output) so the allocator stays deterministic.
 */
export type TokenCounter = (content: string) => number;

/**
 * Options for {@link allocate}.
 *
 * - `tokenCounter` — swap the default `estimateTokens` heuristic for a
 *   precise tokenizer in tests or Phase 3. Default: {@link estimateTokens}.
 * - `strictFloors` — when `true` (default), a section with a `minTokens`
 *   that cannot be seated causes the allocator to throw. When `false`,
 *   the section is dropped and allocation continues. The design doc's
 *   spec is strict; the escape hatch exists so diagnostic callers (e.g.
 *   a dry-run budget explainer) can see what would have happened without
 *   aborting.
 */
export interface AllocateOptions {
  readonly tokenCounter?: TokenCounter;
  readonly strictFloors?: boolean;
}

/**
 * Options for the {@link BudgetAllocator} path — same shape as
 * {@link AllocateOptions} plus a `slotOf` hook that overrides the
 * default id-prefix inference.
 */
export interface BudgetAllocatorOptions extends AllocateOptions {
  readonly slotOf?: (section: CompiledSectionLike) => Slot;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/**
 * Thrown when the sum of section `minTokens` exceeds the context window.
 * Carries enough detail for the operator to diagnose: the total floor
 * demand, the context window, the overflow amount, and the contributing
 * section IDs with their floors.
 */
export class BudgetOverflowError extends Error {
  readonly floorTotal: number;
  readonly contextWindowTokens: number;
  readonly overflow: number;
  readonly contributors: readonly { id: string; minTokens: number }[];

  constructor(details: {
    floorTotal: number;
    contextWindowTokens: number;
    contributors: readonly { id: string; minTokens: number }[];
  }) {
    const overflow = details.floorTotal - details.contextWindowTokens;
    const summary = details.contributors
      .map((c) => `${c.id}=${c.minTokens}`)
      .join(', ');
    super(
      `Token budget overflow: section minimums sum to ${details.floorTotal} tokens ` +
        `but context window is ${details.contextWindowTokens} tokens ` +
        `(overflow by ${overflow}). Contributing sections: ${summary}.`,
    );
    this.name = 'BudgetOverflowError';
    this.floorTotal = details.floorTotal;
    this.contextWindowTokens = details.contextWindowTokens;
    this.overflow = overflow;
    this.contributors = details.contributors;
  }
}

/**
 * Thrown when {@link TokenBudget} proportions are invalid. Accepts any
 * non-sum-to-1 input (within a tiny tolerance) or any negative value.
 * A.6's JSON Schema will also enforce sum-to-1, but the allocator
 * re-verifies at call time so bypassing the schema still produces a
 * diagnostic rather than silent misallocation.
 */
export class InvalidTokenBudgetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTokenBudgetError';
  }
}

// ---------------------------------------------------------------------------
// Token estimation
// ---------------------------------------------------------------------------

/**
 * Approximate token count for a content string. Phase 2 uses a widely-used
 * 4-characters-per-token heuristic (`Math.ceil(content.length / 4)`); this
 * under-counts for dense tokens and over-counts for whitespace-heavy text,
 * but it is fast, deterministic, and requires no external dependencies.
 *
 * Phase 3 may swap this out for a real tokenizer (e.g. `@anthropic-ai/tokenizer`)
 * by wiring the new counter through {@link AllocateOptions}. The allocator
 * treats token counting as an interface specifically so the swap is
 * non-invasive.
 *
 * Empty string returns 0 tokens (not 1) so a zero-content section does
 * not receive a phantom unit of budget.
 */
export function estimateTokens(content: string): number {
  if (content.length === 0) return 0;
  return Math.ceil(content.length / 4);
}

// ---------------------------------------------------------------------------
// Proportion validation
// ---------------------------------------------------------------------------

const SUM_TOLERANCE = 1e-6;

function validateProportions(proportions: TokenBudget): void {
  const { staticPrefix, session, instructions, artifacts, materials } =
    proportions;
  for (const [name, value] of Object.entries({
    staticPrefix,
    session,
    instructions,
    artifacts,
    materials,
  })) {
    if (!Number.isFinite(value)) {
      throw new InvalidTokenBudgetError(
        `TokenBudget.${name} must be a finite number, got ${value}.`,
      );
    }
    if (value < 0) {
      throw new InvalidTokenBudgetError(
        `TokenBudget.${name} must be >= 0, got ${value}.`,
      );
    }
  }
  const sum =
    staticPrefix + session + instructions + artifacts + materials;
  if (Math.abs(sum - 1) > SUM_TOLERANCE) {
    throw new InvalidTokenBudgetError(
      `TokenBudget proportions must sum to 1.0 (±${SUM_TOLERANCE}), got ${sum}.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Slot inference from section id
//
// Used by the `BudgetAllocator` path (called by A.4's `compile()`), which
// does not carry explicit slot tags. The prefix map mirrors the section
// IDs emitted by `assembly.ts::renderSpec`:
//
//   `blocks.static`               → staticPrefix
//   `blocks.conditional.*`        → instructions
//   `blocks.delegation.*`         → instructions
//   `blocks.synthesis`            → instructions
//   `blocks.completion`           → instructions
//   `session.*`                   → session
//   `dynamic.context`             → artifacts (inlined prior-step artifacts)
//   `dynamic.*` (other)           → materials
//   `materials.*`                 → materials
//   `skills.*`                    → staticPrefix (injected skill content)
//   `artifacts.*`                 → artifacts
//
// A section id that does not match any prefix falls through to
// `materials` — the most forgiving bucket (small default share; does not
// poison cache prefix assumptions).
// ---------------------------------------------------------------------------

/**
 * Default slot inference for a section, keyed off its `id`. Exported so
 * callers can re-use the same logic (e.g. diagnostics, tests) or extend
 * it by delegating and overriding for their own prefixes.
 *
 * The mapping aligns with `TokenBudget`'s field documentation in
 * `types.ts`: `staticPrefix` covers `blocks.static` + skill materials;
 * `instructions` covers conditional/synthesis/completion/delegation;
 * `artifacts` covers inlined prior-step artifacts; `session` covers
 * session-state summaries; `materials` is the catch-all for
 * non-skill supplementary content (gotcha guards, etc.).
 */
export function inferSlot(section: CompiledSectionLike): Slot {
  const id = section.id;
  // Ordered prefix checks — longer/more-specific prefixes first.
  if (id === 'blocks.static' || id.startsWith('blocks.static.')) {
    return 'staticPrefix';
  }
  if (id.startsWith('skills.')) return 'staticPrefix';
  if (id === 'session.state' || id.startsWith('session.')) {
    return 'session';
  }
  if (id === 'dynamic.context') return 'artifacts';
  if (id.startsWith('artifacts.')) return 'artifacts';
  if (
    id === 'blocks.synthesis' ||
    id === 'blocks.completion' ||
    id === 'blocks.footer' ||
    id.startsWith('blocks.conditional.') ||
    id.startsWith('blocks.delegation.') ||
    id.startsWith('blocks.instructions.')
  ) {
    // `blocks.footer` is the JIT step-completion protocol — peer to
    // `blocks.completion` and load-bearing for workflow advancement.
    // Mapping it to the `instructions` slot keeps it from being evicted as
    // low-priority `materials` under context pressure.
    return 'instructions';
  }
  if (id.startsWith('materials.') || id.startsWith('dynamic.')) {
    return 'materials';
  }
  return 'materials';
}

// ---------------------------------------------------------------------------
// Helpers for per-section introspection
// ---------------------------------------------------------------------------

function getMinTokens(section: CompiledSectionLike): number {
  if (section.minTokens !== undefined && typeof section.minTokens === 'number') {
    return section.minTokens;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Core allocation engine — shared by both public surfaces
// ---------------------------------------------------------------------------

/**
 * Internal: one measured entry (input + cached token cost + clamped floor).
 * Kept inside the module so neither surface is forced to expose it.
 */
interface MeasuredEntry {
  readonly index: number;
  readonly section: CompiledSectionLike;
  readonly slot: Slot;
  readonly tokens: number;
  readonly floor: number;
}

function allocateEntries(
  input: BudgetInput,
  contextWindowTokens: number,
  proportions: TokenBudget,
  options?: AllocateOptions,
): AllocationResult {
  // --- Argument validation -------------------------------------------------
  if (!Number.isFinite(contextWindowTokens) || contextWindowTokens < 0) {
    throw new InvalidTokenBudgetError(
      `contextWindowTokens must be a non-negative finite number, got ${contextWindowTokens}.`,
    );
  }
  validateProportions(proportions);

  const counter: TokenCounter = options?.tokenCounter ?? estimateTokens;
  const strictFloors = options?.strictFloors ?? true;

  // --- Empty-input fast path ----------------------------------------------
  if (input.length === 0) {
    return { included: [], dropped: [] };
  }

  // --- Per-entry token cost + floor demand --------------------------------
  //
  // Measure each section once up-front — the counter is assumed pure, but
  // caching avoids duplicate work across the two passes. `tokens` is the
  // authoritative whole-section cost; `floor` is clamped to `tokens` so
  // a section carrying `minTokens=500` but only 200 tokens of content
  // demands a 200-token floor (not 500).

  const measured: MeasuredEntry[] = input.map((entry, index) => {
    const tokens = counter(entry.section.content);
    const declaredFloor = getMinTokens(entry.section);
    const floor = Math.min(declaredFloor, tokens);
    return {
      index,
      section: entry.section,
      slot: entry.slot,
      tokens,
      floor,
    };
  });

  // --- Pass 1: floors ------------------------------------------------------
  //
  // Every section with a nonzero floor must receive its floor allocation
  // before the proportional pass begins. If the sum of floors exceeds the
  // context window, throw with a descriptive error (per design doc); this
  // is the "rather silently truncate" policy from §Section Minimums.

  const floorContributors = measured.filter((m) => m.floor > 0);
  const floorTotal = floorContributors.reduce((acc, m) => acc + m.floor, 0);

  if (strictFloors && floorTotal > contextWindowTokens) {
    throw new BudgetOverflowError({
      floorTotal,
      contextWindowTokens,
      contributors: floorContributors.map((m) => ({
        id: m.section.id,
        minTokens: m.floor,
      })),
    });
  }

  // Decision map — keyed by input index; missing entries default to "not
  // yet decided". Any entry left undecided after both passes is dropped.
  type Decision = 'included' | 'dropped';
  const decisions = new Map<number, Decision>();

  // Per-slot remaining budget after floors are seated. Initialise from the
  // proportional share, then subtract floors as they are granted. Sections
  // that receive a floor are marked `included`; their full `tokens` cost is
  // deducted from the slot (not just the floor), because whole-section
  // inclusion means the section occupies its full size once accepted.
  //
  // `Math.floor` on the per-slot share keeps the arithmetic integer and
  // avoids drift — the residue (sum of floors after rounding) falls below
  // `contextWindowTokens` so nothing is over-committed.
  const slotBudget: Record<Slot, number> = {
    staticPrefix: Math.floor(contextWindowTokens * proportions.staticPrefix),
    session: Math.floor(contextWindowTokens * proportions.session),
    instructions: Math.floor(contextWindowTokens * proportions.instructions),
    artifacts: Math.floor(contextWindowTokens * proportions.artifacts),
    materials: Math.floor(contextWindowTokens * proportions.materials),
  };

  // A section that wins a floor but whose full tokens exceed its slot's
  // remaining budget gets temporary "overdraft" — the floor is protected,
  // so we may exceed the slot's share by up to the floor amount. We track
  // a global budget pool that floors draw against first.
  let globalRemaining = contextWindowTokens;

  for (const m of measured) {
    if (m.floor === 0) continue;

    if (m.tokens > globalRemaining) {
      // Non-strict mode: floor couldn't be seated. Strict mode already
      // threw above; we keep the guard for safety.
      decisions.set(m.index, 'dropped');
      continue;
    }
    decisions.set(m.index, 'included');
    globalRemaining -= m.tokens;
    slotBudget[m.slot] -= m.tokens;
  }

  // --- Pass 2: proportional ------------------------------------------------
  //
  // For each remaining (non-floor) section, try to include it against its
  // slot's remaining budget. Input order within a slot is preserved because
  // we iterate `measured` in index order. A section that does not fit is
  // dropped with reason 'budget'. Whole-section inclusion: never shave
  // a section's size to make it fit.
  //
  // Zero-proportion slots (e.g. `artifacts: 0`) start with `slotBudget = 0`
  // and therefore never admit any section. That is the documented behaviour
  // — a zero share means "this step does not use this slot".

  for (const m of measured) {
    if (decisions.has(m.index)) continue; // already handled by Pass 1

    if (m.tokens === 0) {
      // Zero-cost section — always include. Costs nothing against any
      // budget; keeps the `included` stream complete for consumers that
      // rely on section presence.
      decisions.set(m.index, 'included');
      continue;
    }

    if (slotBudget[m.slot] >= m.tokens && globalRemaining >= m.tokens) {
      decisions.set(m.index, 'included');
      slotBudget[m.slot] -= m.tokens;
      globalRemaining -= m.tokens;
    } else {
      decisions.set(m.index, 'dropped');
    }
  }

  // --- Assemble result -----------------------------------------------------
  //
  // Walk `measured` in index order so both `included` and `dropped`
  // preserve original input order — essential for cache-prefix stability.
  const included: CompiledSectionLike[] = [];
  const dropped: CompiledSectionLike[] = [];

  for (const m of measured) {
    const decision = decisions.get(m.index);
    if (decision === 'included') {
      included.push(m.section);
    } else {
      dropped.push(m.section);
    }
  }

  return { included, dropped };
}

// ---------------------------------------------------------------------------
// Public surface 1 — `allocate()` (slot-tagged input)
// ---------------------------------------------------------------------------

/**
 * Two-pass floor-then-proportional allocator — slot-tagged entry point.
 *
 * Pure, deterministic. See the module docstring for the full contract.
 *
 * Observable guarantees:
 *
 * - Pure function: no I/O, no shared state, no wall-clock reads.
 * - Deterministic: equal inputs always produce an equal `AllocationResult`.
 * - Never partially truncates a section; drops whole sections only.
 * - Throws {@link BudgetOverflowError} when `sum(minTokens) > contextWindowTokens`.
 * - Throws {@link InvalidTokenBudgetError} when proportions are malformed.
 * - Preserves input order in both `included` and `dropped`.
 *
 * @param input Ordered entries, each a `(section, slot)` pair. Order is
 *   the allocator's notion of priority.
 * @param contextWindowTokens Total budget available. Must be a
 *   non-negative finite integer (or 0, which simply drops everything).
 * @param proportions Budget share per slot. Must sum to `1.0` (±1e-6)
 *   and have every field `>= 0`.
 * @param options Optional. `tokenCounter` replaces the default estimator;
 *   `strictFloors` controls whether unsatisfiable floors throw or are
 *   dropped silently.
 */
export function allocate(
  input: BudgetInput,
  contextWindowTokens: number,
  proportions: TokenBudget,
  options?: AllocateOptions,
): AllocationResult {
  return allocateEntries(input, contextWindowTokens, proportions, options);
}

// ---------------------------------------------------------------------------
// Public surface 2 — `BudgetAllocator` instance for A.4's `compile()`
// ---------------------------------------------------------------------------

/**
 * Build a {@link BudgetAllocator} that matches the contract A.4's
 * `compile()` consumes: takes a flat `CompiledSectionLike[]`, infers slot
 * from each section's `id`, and runs the two-pass algorithm.
 *
 * - `options.slotOf` replaces the default {@link inferSlot} mapper.
 *   Useful when a caller owns the tagging logic (e.g. PR D's error
 *   compilers) but still wants to feed through the `BudgetAllocator`
 *   interface rather than the slot-tagged `allocate()` directly.
 * - `options.tokenCounter` swaps the token-count heuristic.
 * - `options.strictFloors` selects throw-on-floor-overflow (default) or
 *   drop-on-floor-overflow.
 *
 * Factory defaults apply on every `.allocate()` call. Per-call overrides
 * are not part of the {@link BudgetAllocator} interface (A.4's contract
 * does not pass options); callers who need per-call control should use
 * {@link allocate} directly.
 */
export function createAllocator(
  options?: BudgetAllocatorOptions,
): BudgetAllocator {
  const slotOf = options?.slotOf ?? inferSlot;
  const allocOptions: AllocateOptions = {
    ...(options?.tokenCounter !== undefined
      ? { tokenCounter: options.tokenCounter }
      : {}),
    ...(options?.strictFloors !== undefined
      ? { strictFloors: options.strictFloors }
      : {}),
  };

  return {
    allocate(sections, contextWindowTokens, proportions): AllocationResult {
      const entries: BudgetInput = sections.map((section) => ({
        section,
        slot: slotOf(section),
      }));
      return allocateEntries(
        entries,
        contextWindowTokens,
        proportions,
        allocOptions,
      );
    },
  };
}

/**
 * Default allocator — uses {@link estimateTokens}, strict floors, and
 * {@link inferSlot} for slot resolution. A.4's `compile()` takes this
 * when the caller does not inject a custom `BudgetAllocator`.
 */
export const defaultBudgetAllocator: BudgetAllocator = createAllocator();
