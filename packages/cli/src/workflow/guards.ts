/**
 * Guard specifications + pre-computed matcher for the PreToolUse hotpath.
 *
 * ## Authoring model
 *
 * Guards are declarative TypeScript data. The {@link GUARDS} registry is a
 * `readonly Guard[]` typed with `satisfies` so new entries are checked at
 * `tsc` time: matcher shape, predicate name, effect literal, and the
 * warn-requires-code invariant are all compile-time errors when malformed.
 *
 * ### Why TypeScript, not JSON
 *
 * `v050-state-machine.md` §Guard Specification describes guards as
 * "declarative JSON data." For Phase 2 we deliberately narrow the authoring
 * surface to TypeScript-only — plugin authors cannot ship JSON guard files
 * yet. The blockers are:
 *
 *   1. Runtime schema validation for untrusted JSON needs its own review
 *      (predicate-name gating, matcher-shape coercion, code-family checks).
 *   2. Plugin trust model is outside Phase 2 scope — guards gate tool calls
 *      and can therefore deny or leak; the trust story has to catch up first.
 *
 * JSON authoring is deferred past Phase 2. The compile-time `satisfies` gate
 * plus `workflow validate` cover the first-party author surface until then.
 *
 * ## Forward compatibility
 *
 * C.12 (next wave) widens the secret-pattern guard allowlist but does NOT
 * add regex libraries — secret-pattern regexes land alongside PR F's hook
 * registration. {@link GUARDS} stays empty through C.5; entries arrive as
 * later waves implement their enforcement rules.
 *
 * ## Hotpath discipline
 *
 * The {@link GuardMatcher} built by {@link buildGuardMatcher} pre-computes a
 * `Map<"${step}|${tool}", Guard[]>` at module load. Lookup is O(1); wildcard
 * guards (`'*'` for step, tool, or both) are expanded into every applicable
 * bucket at build time so the hotpath never walks the full guard list. The
 * map is built once per process (guard-hook invocation is a fresh process,
 * but the build is only performed on first use within that process).
 *
 * @see `.claude/project/gobbi/design/v050-state-machine.md` §Guard Specification
 * @see `.claude/project/gobbi/design/v050-hooks.md` §Guard Hook Mechanics
 * @see .claude/project/gobbi/note/20260416-2225-…/research/results/05-guard-hotpath.md
 * @see .claude/project/gobbi/note/20260416-2225-…/research/results/c5-guard-hotpath-budget.md
 */

import type { DiagnosticCode } from './diagnostics.js';
import type { PredicateName } from './predicates.generated.js';
import type { VerdictPredicateName } from './predicates.js';
import type { WorkflowStep } from './state.js';

// ---------------------------------------------------------------------------
// Guard type
// ---------------------------------------------------------------------------

/**
 * Matcher for the fast-path filter. `'*'` is the wildcard literal — a
 * readonly array of specific values matches only those values. Using
 * `readonly` arrays (not just `string[]`) makes the `satisfies` gate in
 * {@link GUARDS} treat literal-form entries as deeply immutable.
 */
export interface GuardMatch {
  readonly step: readonly WorkflowStep[] | '*';
  readonly tool: readonly string[] | '*';
}

/**
 * Predicate names usable as a guard condition. Verdict predicates
 * (`verdictPass` / `verdictRevise`) are excluded for the same reason they
 * are excluded from `TransitionRule.condition`: verdict routing is
 * authoritative via `rule.verdict` matched against the event payload, not
 * via predicate evaluation against state. Mirrors the narrowing pattern in
 * `workflow/transitions.ts::ConditionPredicateName`.
 */
export type GuardPredicateName = Exclude<PredicateName, VerdictPredicateName>;

/**
 * Shared fields present on every guard variant, regardless of effect. The
 * `Guard` union below refines on `effect` to make `code` required for
 * `warn` (the `guard.warn` event requires it) and optional for `deny` /
 * `allow`.
 */
interface GuardBase {
  readonly id: string;
  readonly matcher: GuardMatch;
  readonly predicate: GuardPredicateName;
  readonly reason: string;
}

/**
 * A guard specification. Discriminated on `effect`:
 *
 *   - `deny`  — short-circuits evaluation, emits a `guard.violation` event,
 *               and returns `permissionDecision: 'deny'` to Claude Code.
 *   - `warn`  — accumulates `additionalContext`, emits a `guard.warn` event,
 *               and lets lower-priority guards continue evaluating. `code`
 *               is REQUIRED — the event payload needs it for diagnostic
 *               family routing.
 *   - `allow` — short-circuits evaluation with an explicit
 *               `permissionDecision: 'allow'`, overriding any later deny
 *               guards that would have matched.
 */
export type Guard =
  | (GuardBase & { readonly effect: 'deny'; readonly code?: DiagnosticCode })
  | (GuardBase & { readonly effect: 'warn'; readonly code: DiagnosticCode })
  | (GuardBase & { readonly effect: 'allow'; readonly code?: DiagnosticCode });

/**
 * Canonical guard registry — read at {@link buildGuardMatcher} construction
 * time. Empty through Wave 6 (C.5): the machinery lands now, the rules are
 * populated in later waves / PRs (C.12 widens allowlist data; PR F ships
 * the secret-pattern regexes). The `satisfies readonly Guard[]` gate means
 * any future entry is type-checked for matcher shape, predicate name, and
 * the warn-requires-code invariant.
 */
export const GUARDS = [] as const satisfies readonly Guard[];

// ---------------------------------------------------------------------------
// Pre-computed matcher map
// ---------------------------------------------------------------------------

/**
 * Bucket key format: `${step}|${tool}`. `*` in either position represents
 * the wildcard; the build-time expansion writes a guard into every concrete
 * key it covers, PLUS the `*|*` fall-through bucket for guards that match
 * everything. The hotpath performs two lookups per invocation: the exact
 * `"${step}|${tool}"` key and the `"*|*"` fall-through bucket.
 *
 * Rationale for the two-lookup shape:
 *
 *   - Exact-key lookup covers the common case (`step: ['execution']`,
 *     `tool: ['Write']`) in one map read.
 *   - Step-wildcard entries (`step: '*'`, `tool: ['Write']`) are expanded
 *     across every concrete step so they appear in the exact key.
 *   - Tool-wildcard entries (`step: ['execution']`, `tool: '*'`) are NOT
 *     expanded across every possible tool name (the tool namespace is
 *     unbounded — Claude Code ships tools plus MCP plugins add more). They
 *     live in a per-step `${step}|*` bucket consulted as a second lookup.
 *   - Full-wildcard entries (`step: '*'`, `tool: '*'`) live in the
 *     `*|*` bucket consulted as a third lookup.
 *
 * At invocation time the matcher reads three buckets and concatenates in
 * insertion order. That order matches {@link GUARDS} array order, preserving
 * deterministic deny-first short-circuit for callers.
 */
type BucketKey = `${string}|${string}`;

const FULL_WILDCARD: BucketKey = '*|*';

function stepWildcardKey(tool: string): BucketKey {
  return `*|${tool}`;
}

function toolWildcardKey(step: string): BucketKey {
  return `${step}|*`;
}

function exactKey(step: string, tool: string): BucketKey {
  return `${step}|${tool}`;
}

/**
 * The pre-computed matcher. Construction is linear in the guard count; the
 * {@link match} hotpath is three map reads plus a concat — no allocation
 * proportional to the guard registry size on the hotpath.
 */
export interface GuardMatcher {
  /**
   * Return every guard whose `matcher` admits the given `(step, tool)`
   * pair, preserving the original {@link GUARDS} array order. The returned
   * array MAY be empty; callers must handle that as the "no applicable
   * guard" case.
   */
  match(step: WorkflowStep, tool: string): readonly Guard[];
}

/**
 * Build a {@link GuardMatcher} from a guard list.
 *
 * The returned matcher captures the input list — subsequent mutations to
 * the input do NOT reflect in lookup results. Call once per process, at
 * module load, and reuse across every hook invocation.
 */
export function buildGuardMatcher(guards: readonly Guard[]): GuardMatcher {
  // Three disjoint bucket families — see the BucketKey docblock for the
  // lookup sequence on the hotpath.
  const exact = new Map<BucketKey, Guard[]>();
  const stepWild = new Map<BucketKey, Guard[]>();
  const toolWild = new Map<BucketKey, Guard[]>();
  const fullWild: Guard[] = [];

  for (const guard of guards) {
    const { step, tool } = guard.matcher;

    const stepWildcard = step === '*';
    const toolWildcard = tool === '*';

    if (stepWildcard && toolWildcard) {
      fullWild.push(guard);
      continue;
    }

    if (stepWildcard) {
      // `step: '*', tool: [...]` — one bucket per concrete tool.
      for (const t of tool as readonly string[]) {
        const key = stepWildcardKey(t);
        let bucket = stepWild.get(key);
        if (bucket === undefined) {
          bucket = [];
          stepWild.set(key, bucket);
        }
        bucket.push(guard);
      }
      continue;
    }

    if (toolWildcard) {
      // `step: [...], tool: '*'` — one bucket per concrete step.
      for (const s of step as readonly WorkflowStep[]) {
        const key = toolWildcardKey(s);
        let bucket = toolWild.get(key);
        if (bucket === undefined) {
          bucket = [];
          toolWild.set(key, bucket);
        }
        bucket.push(guard);
      }
      continue;
    }

    // Both concrete — cartesian product of step x tool into exact buckets.
    for (const s of step as readonly WorkflowStep[]) {
      for (const t of tool as readonly string[]) {
        const key = exactKey(s, t);
        let bucket = exact.get(key);
        if (bucket === undefined) {
          bucket = [];
          exact.set(key, bucket);
        }
        bucket.push(guard);
      }
    }
  }

  return {
    match(step, tool) {
      const out: Guard[] = [];
      const exactBucket = exact.get(exactKey(step, tool));
      if (exactBucket !== undefined) out.push(...exactBucket);
      const stepWildBucket = stepWild.get(stepWildcardKey(tool));
      if (stepWildBucket !== undefined) out.push(...stepWildBucket);
      const toolWildBucket = toolWild.get(toolWildcardKey(step));
      if (toolWildBucket !== undefined) out.push(...toolWildBucket);
      if (fullWild.length > 0) out.push(...fullWild);
      return out;
    },
  };
}

/**
 * Process-wide singleton matcher built over {@link GUARDS}. The guard
 * command reads this once per invocation — a fresh process pays the build
 * cost once on first access, which is still the only access.
 */
export const DEFAULT_MATCHER: GuardMatcher = buildGuardMatcher(GUARDS);

/**
 * Build the human-readable `permissionDecisionReason` string for a deny
 * guard. Extracted so tests can assert the shape without coupling to the
 * command's error path.
 *
 * Shape: `"${reason} (guard: ${id}, step: ${step})"`. The guard id and step
 * are appended so the hook recipient can correlate the denial with the
 * `guard.violation` event without reaching into the event store.
 */
export function buildReason(guard: Guard, step: WorkflowStep): string {
  return `${guard.reason} (guard: ${guard.id}, step: ${step})`;
}

// `FULL_WILDCARD` is exported for tests that want to inspect the fall-
// through bucket contract. Keeping it an internal constant at runtime.
export const __TEST_FULL_WILDCARD: BucketKey = FULL_WILDCARD;
