/**
 * Section types — symbol-keyed brand fields, factory-only construction,
 * content-hash, optional `minTokens`, and a variadic-tuple type helper that
 * statically enforces cache-ordered section layout (all statics first,
 * all dynamics after).
 *
 * Cache-prefix integrity is risk #1 for v0.5.0's prompt compiler: Anthropic
 * prompt caching is byte-level prefix stable. Placing a per-call section
 * before a byte-stable section invalidates the prefix cache on every call.
 * The types in this module are the first line of defense — ordering
 * violations are compile errors, not runtime assertions.
 *
 * The two brand constants (`staticSymbol`, `dynamicSymbol`) are module-private
 * `unique symbol`s. They are NOT exported. External code cannot reach the
 * symbol and therefore cannot author an object that matches the `StaticSection`
 * or `DynamicSection` shape — the factory functions are the sole construction
 * path.
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
 * A section whose rendered bytes vary per call (session state, artifacts,
 * per-invocation timestamps, etc.). Dynamic sections always come after the
 * static prefix; they are not expected to be cache hits.
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
// Peels the tuple one element at a time. Once any element is a DynamicSection,
// every subsequent element must be a DynamicSection — a StaticSection after a
// DynamicSection collapses the whole type to `never`, which at a call site
// produces a `Type ... is not assignable to 'never'` error.
//
// A.4's `compile()` consumes this helper as `T & CacheOrderedSections<T>` on
// a `<const T extends readonly (StaticSection | DynamicSection)[]>` parameter.
// The `const T` modifier preserves tuple positions from the call site.
// ---------------------------------------------------------------------------

export type CacheOrderedSections<
  T extends readonly (StaticSection | DynamicSection)[],
> = T extends readonly []
  ? T
  : T extends readonly [infer Head, ...infer Rest]
    ? Head extends StaticSection
      ? Rest extends readonly (StaticSection | DynamicSection)[]
        ? CacheOrderedSections<Rest> extends never
          ? never
          : T
        : never
      : Head extends DynamicSection
        ? Rest extends readonly DynamicSection[]
          ? T
          : never
        : never
    : never;
