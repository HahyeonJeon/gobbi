/**
 * Error-state + resume static section constants + shared section-builder
 * helper.
 *
 * This module is the shared section-constant + assembly entry point for all
 * 10 pathway compilers (5 error-state in D.2, 5 resume in D.4). It is zoned
 * for parallel edits by the two Wave 2 executors:
 *
 *  - **D.1 (this wave)** lays down the SHARED role constant, the budget
 *    defaults, and the `buildErrorCompiledPrompt` assembly helper.
 *  - **D.2 ZONE** below is reserved for D.2 — error-state preamble constants
 *    and the per-pathway `render*Evidence` / `render*RecoveryOptions`
 *    helpers.
 *  - **D.4 ZONE** below is reserved for D.4 — resume preamble constants and
 *    per-pathway `renderResume*Context` helpers.
 *
 * The zone sentinels are merge boundaries. D.2 appends INSIDE the D.2 zone,
 * D.4 appends INSIDE the D.4 zone — their diffs touch disjoint line ranges
 * so `git merge` reports no textual conflict.
 *
 * ## Cache-safety discipline
 *
 * Every `STATIC_*` constant declared here feeds the static prefix of a
 * compiled prompt (`StaticSection` via `makeStatic`). Static prefix bytes
 * must be byte-stable across every invocation — timestamps, UUIDs,
 * absolute paths, or PIDs in any `STATIC_*` constant break Anthropic's
 * prompt cache on every call. The `errors.lint.test.ts` iteration set
 * asserts this via `STATIC_LINT_RULES`.
 */

import {
  makeStatic,
  makeSession,
  makeDynamic,
  type StaticSection,
  type SessionSection,
  type DynamicSection,
} from './sections.js';
import type { CompiledPrompt, CompiledSectionSummary } from './types.js';
import {
  assertCacheOrdered,
  type KindedSection,
} from './assembly.js';
import {
  allocate,
  type BudgetInput,
  type BudgetInputEntry,
  type Slot,
} from './budget.js';

// ============================================================================
// SHARED (D.1 zone) — role constant, budget defaults, assembly helper
// ============================================================================

/**
 * Shared recovery-role preamble. Byte-stable across every pathway compiler
 * in both `compileErrorPrompt` and `compileResumePrompt`, so it anchors the
 * first StaticSection's `contentHash` — every error/resume prompt shares
 * the same cache prefix on this entry.
 */
export const STATIC_ROLE_ERROR_RECOVERY = `You are resuming a gobbi workflow that entered the error step. Do not proceed with the normal step sequence — you are in recovery mode. Inspect the pathway-specific context below and choose a recovery action that matches the evidence. When you are ready, re-enter the workflow via \`gobbi workflow resume --target <step>\` or abort via \`gobbi workflow transition --type abort\`.`;

/**
 * Default budget proportions for error-state + resume compiled prompts.
 *
 * Tuned differently from the productive-step defaults: error/resume
 * prompts emphasise the static prefix (recovery instructions) and the
 * artifact + materials slots (pathway evidence). `session` is modest —
 * the session summary is brief for error prompts. Sums to 1.0.
 */
export const ERROR_PROMPT_DEFAULT_BUDGET = {
  staticPrefix: 0.4,
  session: 0.1,
  instructions: 0.1,
  artifacts: 0.3,
  materials: 0.1,
} as const;

/**
 * Default context window used by `buildErrorCompiledPrompt` when the
 * caller does not override. Matches `assembly.ts::DEFAULT_CONTEXT_WINDOW_TOKENS`
 * (200k tokens — Claude 4 base model).
 */
export const ERROR_PROMPT_DEFAULT_CONTEXT_WINDOW_TOKENS = 200_000;

/**
 * Input bundle for {@link buildErrorCompiledPrompt}. Callers supply already-
 * built `KindedSection[]` (via `makeStatic` / `makeSession` / `makeDynamic`);
 * the helper runs the cache-order assertion, calls the slot-tagged
 * `allocate()` directly (L4 — no `inferSlot` reliance), hashes, and assembles
 * the final `CompiledPrompt`.
 */
export interface BuildErrorCompiledPromptInput {
  /** One or more static blocks, in cache-prefix order. */
  readonly staticBlocks: readonly StaticSection[];
  /** Exactly one session block (pathway compilers always emit one). */
  readonly sessionBlock: SessionSection;
  /** Zero or more dynamic blocks carrying pathway evidence. */
  readonly dynamicBlocks: readonly DynamicSection[];
  /**
   * Per-block slot overrides. Keyed by section `id`. When absent, the
   * defaults below apply:
   *   - every static block → `'staticPrefix'`
   *   - the session block → `'session'`
   *   - every dynamic block → `'artifacts'`
   *
   * D.2 and D.4 use the overrides to route specific evidence blocks into
   * the `materials` slot when appropriate (diagnostic hints, recovery
   * option lists, etc.).
   */
  readonly slotOverrides?: Readonly<Record<string, Slot>>;
  /** Optional context-window override. Defaults to {@link ERROR_PROMPT_DEFAULT_CONTEXT_WINDOW_TOKENS}. */
  readonly contextWindowTokens?: number;
}

/**
 * SECTION_SEPARATOR must match `assembly.ts` exactly — the error-state
 * prompts concatenate sections with the same separator so the compiled
 * text is indistinguishable-by-format from normal step prompts.
 */
const SECTION_SEPARATOR = '\n\n';

function sha256(content: string): string {
  const hasher = new Bun.CryptoHasher('sha256');
  hasher.update(content);
  return hasher.digest('hex');
}

/**
 * Assemble a `CompiledPrompt` from the pathway compiler's raw section
 * blocks.
 *
 * Flow:
 *
 *   1. Build the `KindedSection[]` in cache-prefix order (static → session
 *      → dynamic).
 *   2. Run `assertCacheOrdered` for belt-and-braces (compile-time ordering
 *      is implicit via the argument shape; the runtime check guards
 *      dynamic-length variations).
 *   3. Construct a `BudgetInput` with explicit per-section slot tags (L4 —
 *      the error-state IDs are NOT covered by `inferSlot`, so the compiler
 *      tags each entry directly).
 *   4. Run `allocate()` against {@link ERROR_PROMPT_DEFAULT_BUDGET}.
 *   5. Emit text + per-section summaries + sha256 hashes.
 *
 * The result is a standard `CompiledPrompt` — callers downstream of the
 * dispatchers (D.3 for error, D.4 for resume) observe no difference from
 * the productive-step `compile()` output.
 */
export function buildErrorCompiledPrompt(
  input: BuildErrorCompiledPromptInput,
): CompiledPrompt {
  const contextWindowTokens =
    input.contextWindowTokens ?? ERROR_PROMPT_DEFAULT_CONTEXT_WINDOW_TOKENS;
  const overrides = input.slotOverrides ?? {};

  // 1. Build the kinded section list in cache-prefix order.
  const kinded: KindedSection[] = [
    ...input.staticBlocks.map(
      (section): KindedSection => ({ kind: 'static', section }),
    ),
    { kind: 'session', section: input.sessionBlock },
    ...input.dynamicBlocks.map(
      (section): KindedSection => ({ kind: 'dynamic', section }),
    ),
  ];

  // 2. Runtime ordering check.
  assertCacheOrdered(kinded);

  // 3. Build the slot-tagged BudgetInput. Each entry carries its own slot
  //    per L4 — we do NOT rely on `inferSlot` because error.* IDs are
  //    outside its prefix map.
  const entries: BudgetInputEntry[] = kinded.map((k) => {
    const explicit = overrides[k.section.id];
    if (explicit !== undefined) {
      return {
        section: {
          id: k.section.id,
          content: k.section.content,
          contentHash: k.section.contentHash,
          ...(k.section.minTokens !== undefined
            ? { minTokens: k.section.minTokens }
            : {}),
        },
        slot: explicit,
      };
    }
    const slot: Slot =
      k.kind === 'static'
        ? 'staticPrefix'
        : k.kind === 'session'
          ? 'session'
          : 'artifacts';
    return {
      section: {
        id: k.section.id,
        content: k.section.content,
        contentHash: k.section.contentHash,
        ...(k.section.minTokens !== undefined
          ? { minTokens: k.section.minTokens }
          : {}),
      },
      slot,
    };
  });

  // 4. Allocate.
  const budget: BudgetInput = entries;
  const allocation = allocate(
    budget,
    contextWindowTokens,
    ERROR_PROMPT_DEFAULT_BUDGET,
  );

  // Preserve original ordering for the included list.
  const includedSet = new Set(allocation.included);
  const includedOrdered: KindedSection[] = [];
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    const kindedEntry = kinded[i];
    if (entry === undefined || kindedEntry === undefined) continue;
    if (includedSet.has(entry.section)) {
      includedOrdered.push(kindedEntry);
    }
  }

  // 5. Emit text + hashes.
  const text = includedOrdered
    .map((k) => k.section.content)
    .join(SECTION_SEPARATOR);
  const sections: CompiledSectionSummary[] = includedOrdered.map((k) => ({
    id: k.section.id,
    kind: k.kind,
    byteLength: Buffer.byteLength(k.section.content, 'utf8'),
    contentHash: k.section.contentHash,
  }));

  const contentHash = sha256(text);
  const staticPrefixHash = sha256(
    includedOrdered
      .filter((k) => k.kind === 'static')
      .map((k) => k.section.contentHash)
      .join(''),
  );

  return {
    text,
    sections,
    contentHash,
    staticPrefixHash,
  };
}

// Re-export factory helpers that pathway compilers (D.2, D.4) frequently
// use. Consumers can import them directly from `./sections.js`; the
// re-exports reduce import boilerplate at the compiler-body sites.
export { makeStatic, makeSession, makeDynamic };

// ============================================================================
// D.2 ZONE — error-state compiler constants (populated by D.2 executor)
// ============================================================================
//
// D.2 appends the following BELOW this comment and ABOVE the D.4 zone:
//
//   export const STATIC_PREAMBLE_CRASH = '...';
//   export const STATIC_PREAMBLE_TIMEOUT = '...';
//   export const STATIC_PREAMBLE_FEEDBACK_CAP = '...';
//   export const STATIC_PREAMBLE_INVALID = '...';
//   export const STATIC_PREAMBLE_UNKNOWN = '...';
//
//   export function renderCrashEvidence(pathway, state) { ... }
//   export function renderCrashRecoveryOptions(pathway) { ... }
//   (etc. for timeout / feedbackCap / invalidTransition / unknown)
//
// D.2 executor: append your constants + helpers here. Do NOT edit lines in
// the SHARED zone above or the D.4 zone below.

// ============================================================================
// D.4 ZONE — resume compiler constants (populated by D.4 executor)
// ============================================================================
//
// D.4 appends the following BELOW this comment:
//
//   export const STATIC_ROLE_RESUME_RECOVERY = '...';
//   export const STATIC_RESUME_PREAMBLE_CRASH = '...';
//   export const STATIC_RESUME_PREAMBLE_TIMEOUT = '...';
//   export const STATIC_RESUME_PREAMBLE_FEEDBACK_CAP = '...';
//   export const STATIC_RESUME_PREAMBLE_INVALID = '...';
//   export const STATIC_RESUME_PREAMBLE_UNKNOWN = '...';
//
//   export function renderResumeCrashContext(pathway, state, target) { ... }
//   (etc.)
//
// D.4 executor: append your constants + helpers here. Do NOT edit lines in
// the SHARED zone or the D.2 zone above.
