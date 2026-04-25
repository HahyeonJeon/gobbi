/**
 * Section types — symbol-keyed brand fields, factory-only construction,
 * content-hash, optional `minTokens`, and a variadic-tuple type helper that
 * statically enforces cache-ordered section layout (all statics first,
 * then all sessions, then all dynamics).
 *
 * Cache-prefix integrity is risk #1 for v0.5.0's prompt compiler: Anthropic
 * prompt caching is byte-level prefix stable. Placing a per-call section
 * before a byte-stable section invalidates the prefix cache on every call.
 * The types in this module are the first line of defense — ordering
 * violations are compile errors, not runtime assertions.
 *
 * Three section kinds per `v050-prompts.md` §Cache-Aware Prompt Ordering:
 *
 * - `StaticSection` — bytes identical across every invocation of the step.
 * - `SessionSection` — bytes stable within a session but changing when the
 *   session advances to a new step. Partial cache hits possible.
 * - `DynamicSection` — bytes change on every invocation. No cache benefit.
 *
 * The three brand constants (`staticSymbol`, `sessionSymbol`, `dynamicSymbol`)
 * are module-private `unique symbol`s. They are NOT exported. External code
 * cannot reach the symbols and therefore cannot author an object that matches
 * any section shape — the factory functions are the sole construction path.
 */

// ---------------------------------------------------------------------------
// Module-private brand symbols
//
// Only this module holds references to these symbols. The section interfaces
// below expose their TYPEOF via computed property keys, but consumers cannot
// name the symbol itself. That asymmetry is what makes the brand truly nominal
// (forgery-resistant) rather than merely structural.
// ---------------------------------------------------------------------------

const staticSymbol: unique symbol = Symbol('section.static');
const sessionSymbol: unique symbol = Symbol('section.session');
const dynamicSymbol: unique symbol = Symbol('section.dynamic');

// ---------------------------------------------------------------------------
// Section interfaces — branded, readonly, factory-constructed only
// ---------------------------------------------------------------------------

/**
 * A section whose rendered bytes are identical across every invocation of
 * the same step on the same codebase revision. Static sections form the
 * prompt's cache prefix; their contents feed Anthropic's prefix-hash cache.
 */
export interface StaticSection {
  readonly [staticSymbol]: true;
  readonly id: string;
  readonly content: string;
  readonly contentHash: string;
  readonly minTokens?: number;
}

/**
 * A section whose rendered bytes are stable within a single session but
 * change when the session advances to a new step. Session sections carry
 * per-session context (workflow state, evaluation configuration, completed
 * step list, session ID) and sit between the static prefix and the dynamic
 * tail — partial cache hits are possible across invocations within the
 * same step of the same session.
 */
export interface SessionSection {
  readonly [sessionSymbol]: true;
  readonly id: string;
  readonly content: string;
  readonly contentHash: string;
  readonly minTokens?: number;
}

/**
 * A section whose rendered bytes vary per call (per-invocation artifacts,
 * active subagent counts, timestamps). Dynamic sections always come after
 * the static prefix AND the session section; they are not expected to be
 * cache hits.
 */
export interface DynamicSection {
  readonly [dynamicSymbol]: true;
  readonly id: string;
  readonly content: string;
  readonly contentHash: string;
  readonly minTokens?: number;
}

// ---------------------------------------------------------------------------
// Content hash — sha256 over the rendered content, 64 lowercase hex chars
//
// Using Bun's built-in `Bun.CryptoHasher` for consistency with the Bun-native
// runtime (see packages/cli/package.json `engines.bun`). Hashing happens at
// section construction, not lazily — the hash becomes part of the section's
// identity and must be captured before any caller can observe the section.
// ---------------------------------------------------------------------------

function computeContentHash(content: string): string {
  const hasher = new Bun.CryptoHasher('sha256');
  hasher.update(content);
  return hasher.digest('hex');
}

// ---------------------------------------------------------------------------
// Factory functions — the sole construction path
//
// `exactOptionalPropertyTypes: true` means we must NOT set `minTokens: undefined`
// when the caller omits it. The conditional spread keeps the field absent from
// the literal when not provided.
// ---------------------------------------------------------------------------

export interface SectionInput {
  readonly id: string;
  readonly content: string;
  readonly minTokens?: number;
}

export function makeStatic(input: SectionInput): StaticSection {
  const base = {
    [staticSymbol]: true as const,
    id: input.id,
    content: input.content,
    contentHash: computeContentHash(input.content),
  };
  return input.minTokens === undefined
    ? base
    : { ...base, minTokens: input.minTokens };
}

export function makeSession(input: SectionInput): SessionSection {
  const base = {
    [sessionSymbol]: true as const,
    id: input.id,
    content: input.content,
    contentHash: computeContentHash(input.content),
  };
  return input.minTokens === undefined
    ? base
    : { ...base, minTokens: input.minTokens };
}

export function makeDynamic(input: SectionInput): DynamicSection {
  const base = {
    [dynamicSymbol]: true as const,
    id: input.id,
    content: input.content,
    contentHash: computeContentHash(input.content),
  };
  return input.minTokens === undefined
    ? base
    : { ...base, minTokens: input.minTokens };
}

// ---------------------------------------------------------------------------
// Variadic-tuple type helper — compile-time cache-order guard
//
// Peels the tuple one element at a time and enforces the strict three-kind
// ordering from `v050-prompts.md` §Cache-Aware Prompt Ordering:
//
//     Static*  Session*  Dynamic*
//
// Any StaticSection must precede every SessionSection, and any SessionSection
// must precede every DynamicSection. A SessionSection before a StaticSection,
// a DynamicSection before a SessionSection, or a StaticSection after a
// DynamicSection all collapse the type to `never`, which at a call site
// produces a `Type ... is not assignable to 'never'` error.
//
// A.4's `compile()` consumes this helper as `T & CacheOrderedSections<T>` on
// a `<const T extends readonly Section[]>` parameter. The `const T` modifier
// preserves tuple positions from the call site.
// ---------------------------------------------------------------------------

type Section = StaticSection | SessionSection | DynamicSection;

/**
 * `OnlySessionOrDynamic<T>` — T must be a tuple in which every element is
 * a SessionSection or DynamicSection, internally ordered Session → Dynamic
 * (a DynamicSection followed by a SessionSection is rejected). Used by the
 * main helper after the first SessionSection has been peeled.
 */
type OnlySessionOrDynamic<T extends readonly Section[]> =
  T extends readonly []
    ? T
    : T extends readonly [infer Head, ...infer Rest]
      ? Head extends SessionSection
        ? Rest extends readonly Section[]
          ? OnlySessionOrDynamic<Rest> extends never
            ? never
            : T
          : never
        : Head extends DynamicSection
          ? Rest extends readonly DynamicSection[]
            ? T
            : never
          : never
      : never;

export type CacheOrderedSections<T extends readonly Section[]> =
  T extends readonly []
    ? T
    : T extends readonly [infer Head, ...infer Rest]
      ? Head extends StaticSection
        ? Rest extends readonly Section[]
          ? CacheOrderedSections<Rest> extends never
            ? never
            : T
          : never
        : Head extends SessionSection
          ? Rest extends readonly Section[]
            ? OnlySessionOrDynamic<Rest> extends never
              ? never
              : T
            : never
          : Head extends DynamicSection
            ? Rest extends readonly DynamicSection[]
              ? T
              : never
            : never
      : never;
