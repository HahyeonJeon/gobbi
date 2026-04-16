/**
 * Prompt assembly — `compile()` entry point and cache-ordered section
 * assembly.
 *
 * This module turns a `StepSpec` plus session/dynamic inputs into a
 * `CompiledPrompt`. It does four things in order:
 *
 *   1. Render `StepSpec.blocks` into a typed section tuple using the
 *      factories from `sections.ts` (`makeStatic`, `makeSession`,
 *      `makeDynamic`).
 *   2. Lint every `StaticSection.content` for patterns that would break
 *      cache-prefix stability (ISO timestamps, UUIDs, absolute paths, …).
 *      See `STATIC_LINT_RULES`.
 *   3. Feed the section list through a `BudgetAllocator` (A.5's
 *      `defaultBudgetAllocator` by default; `NOOP_ALLOCATOR` available as
 *      an opt-in bypass) to decide which sections survive.
 *   4. Emit a `CompiledPrompt` with text, per-section summaries, and both
 *      aggregate and static-prefix-only content hashes.
 *
 * The cache-order invariant (Static* → Session* → Dynamic*) is enforced at
 * the type level via `CacheOrderedSections<T>` (`sections.ts`) AND at runtime
 * (`assertCacheOrdered`) — belt-and-braces because misordering here breaks
 * Anthropic prompt caching on every call.
 *
 * @see `v050-prompts.md` §Cache-Aware Prompt Ordering
 * @see `v050-prompts.md` §Spec Schema
 * @see `v050-prompts.md` §Token Budget Awareness
 */

import {
  makeStatic,
  makeSession,
  makeDynamic,
  type StaticSection,
  type SessionSection,
  type DynamicSection,
  type CacheOrderedSections,
} from './sections.js';
import type {
  StepSpec,
  BlockContent,
  CompiledPrompt,
  CompiledSectionSummary,
  CompiledSectionLike,
  AllocationResult,
  BudgetAllocator,
  TokenBudget,
} from './types.js';
import { defaultBudgetAllocator } from './budget.js';
import type { WorkflowState } from '../workflow/state.js';

// Note: `CompiledPrompt`, `CompiledSectionSummary`, `CompiledSectionLike`,
// `AllocationResult`, and `BudgetAllocator` live in `types.ts` (re-exported
// by `specs/index.ts` via `export * from './types.js'`). They are not
// re-exported from this module to avoid duplicate-export errors in the
// barrel (`Module './types.js' has already exported …`).

// ---------------------------------------------------------------------------
// Section separator — a double newline between sections
//
// Chosen over a single newline because many spec blocks end with their own
// trailing newline; the separator needs to create a visible paragraph break
// that is stable across all blocks. This constant is part of the cache
// prefix's byte-level identity — do NOT localize or make it dynamic.
// ---------------------------------------------------------------------------

const SECTION_SEPARATOR = '\n\n';

// ---------------------------------------------------------------------------
// Compile inputs — all data `compile()` needs
// ---------------------------------------------------------------------------

/**
 * The active-agent selector. When the step's `blocks.delegation` has more
 * than one entry, the caller tells `compile()` which agent's block to
 * include. `null` means "no delegation block this call" — used by
 * orchestrator-only steps and by the synthesis-only compile pass.
 */
export type ActiveAgentSelector = string | null;

/**
 * Per-invocation dynamic context — everything that varies per call and must
 * end up in `DynamicSection`s (NOT in the cache-prefix-stable static/session
 * tail).
 *
 * The caller constructs this from the CLI's runtime state:
 *   - `timestamp` at invocation (ISO 8601)
 *   - `activeSubagentCount` read from state
 *   - `artifacts` — the prior-step artifacts A.9 will select; in A.4 the
 *     caller supplies them as `{ name, content }[]`
 *   - `pid` and `invocationCounter` are optional but common in diagnostics
 */
export interface DynamicContext {
  readonly timestamp: string;
  readonly activeSubagentCount: number;
  readonly artifacts: readonly { readonly name: string; readonly content: string }[];
  readonly pid?: number;
  readonly invocationCounter?: number;
}

/**
 * Predicate signature — matches `workflow/predicates.ts`'s
 * `(state) => boolean`. Kept local to avoid a hard dep on that module; A.4
 * does not need the registry's full surface, just the evaluation contract.
 */
export type CompilePredicate = (state: WorkflowState) => boolean;

export type CompilePredicateRegistry = Readonly<Record<string, CompilePredicate>>;

/**
 * Inputs to `compile()`. Bundled into one record so the caller passes a
 * single object — this keeps the signature readable as the compile pipeline
 * grows across PR B (skills injection) and PR D (resume integration).
 *
 * `predicates` evaluates both `blocks.conditional[i].when` and (in future)
 * transition conditions. Unknown predicate names in `conditional.when` are
 * treated as false — `gobbi workflow validate` (A.10/B.3) catches the name
 * mismatch separately; `compile()` must not throw on missing predicates
 * because that would break the validate-before-compile ordering.
 *
 * `activeAgent` selects which `blocks.delegation[blockRef]` entry is
 * included (null → none). The delegation block is rendered as a
 * `StaticSection` because its content is byte-identical per (step, agent)
 * pair across all invocations.
 *
 * `skillSections` is the caller-supplied seam for the skills loader
 * (`specs/skills.ts::loadSkills`). When present, each entry is emitted as a
 * `StaticSection` at the FRONT of the static prefix — before the
 * block-derived sections — because skill content is byte-stable across
 * every invocation of any step that requires the skill, which is the
 * highest cache-stability tier. Skill sections participate in the
 * content linter on the same footing as block content: if a `SKILL.md`
 * contains a timestamp / absolute path / UUID, the linter catches it.
 * Omit the field (or pass `undefined`) when the caller has no skills to
 * inject — `compile()` behaves identically to the pre-M1 path.
 *
 * @see `.claude/project/gobbi/design/v050-prompts.md` §Skills Boundary
 * @see `.claude/project/gobbi/design/v050-prompts.md` §Cache-Aware Prompt Ordering
 */
export interface CompileInput {
  readonly spec: StepSpec;
  readonly state: WorkflowState;
  readonly dynamic: DynamicContext;
  readonly predicates: CompilePredicateRegistry;
  readonly activeAgent: ActiveAgentSelector;
  readonly skillSections?: readonly StaticSection[];
}

// ---------------------------------------------------------------------------
// Content linter — regex rules that flag cache-prefix-poisoning content
//
// The linter scans ONLY `StaticSection.content`. Session and dynamic
// sections are expected to contain per-session / per-call data — that is
// their job. Static sections must be byte-stable across invocations, so any
// timestamp, UUID, absolute path, or PID in their content indicates a bug
// (or a mis-classified section) and must be surfaced.
//
// The rule list is deliberately a simple array so:
//   a) downstream PRs (B.1 validate, E.1 workflow status) can import and
//      reuse the same rules;
//   b) new rules are a one-line addition.
// ---------------------------------------------------------------------------

/**
 * A single content-lint rule. `pattern` runs against a section's `content`;
 * any match produces one `ContentLintIssue` per match.
 */
export interface ContentLintRule {
  readonly id: string;
  readonly description: string;
  readonly pattern: RegExp;
  readonly severity: 'error' | 'warn';
}

/**
 * A detected lint issue — returned by `lintStaticContent()` and by default
 * thrown (as a `ContentLintError`) from `compile()`.
 */
export interface ContentLintIssue {
  readonly ruleId: string;
  readonly sectionId: string;
  readonly severity: 'error' | 'warn';
  readonly description: string;
  /** The substring from the section's `content` that matched `rule.pattern`. */
  readonly match: string;
}

/**
 * The default rule set. Every rule has severity `error` — content that
 * matches is a bug, not a style lint. If a future caller needs warn-severity
 * rules (style guidance only), they can append to `STATIC_LINT_RULES` or
 * pass their own via `CompileOptions.lintRules`.
 *
 * Regex notes:
 *   - `iso8601` catches `YYYY-MM-DDTHH:MM` with optional seconds/zone. Hits
 *     the common `new Date().toISOString()` output.
 *   - `unixTsAdjacent` is keyed off "time", "ts", "epoch", "timestamp"
 *     adjacency to reduce false positives on arbitrary 10/13-digit IDs.
 *   - `uuidV4` catches the canonical UUID v4 pattern.
 *   - `gobbiSessionId` catches the `YYYYMMDD-HHMM-…-{uuid}` session-folder
 *     form from `v050-session.md` §Session Directory Structure.
 *   - `absolutePathPosix` catches `/home/...`, `/Users/...` (macOS), and the
 *     literal `$CLAUDE_PROJECT_DIR` placeholder when substituted.
 *   - `pidOrCounter` catches lines like `pid=12345` or `invocationCount=42`.
 */
export const STATIC_LINT_RULES: readonly ContentLintRule[] = [
  {
    id: 'iso8601',
    description: 'ISO 8601 timestamp — belongs in a DynamicSection',
    pattern: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?/,
    severity: 'error',
  },
  {
    id: 'unixTsAdjacent',
    description:
      'Unix timestamp (10- or 13-digit number adjacent to a time-ish label) — belongs in a DynamicSection',
    pattern: /\b(?:time|ts|epoch|timestamp)\s*[:=]?\s*\d{10}(?:\d{3})?\b/i,
    severity: 'error',
  },
  {
    id: 'uuidV4',
    description: 'UUID v4 — belongs in a SessionSection (session ID) or DynamicSection',
    pattern:
      /\b[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i,
    severity: 'error',
  },
  {
    id: 'gobbiSessionId',
    description:
      'Gobbi session folder id (YYYYMMDD-HHMM-…-uuid) — belongs in a SessionSection',
    pattern:
      /\b\d{8}-\d{4}-[a-z0-9-]+-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
    severity: 'error',
  },
  {
    id: 'absolutePathPosix',
    description:
      'Absolute filesystem path (/home, /Users, or substituted $CLAUDE_PROJECT_DIR) — belongs in a DynamicSection',
    pattern: /(?:\/home\/[A-Za-z0-9._-]+|\/Users\/[A-Za-z0-9._-]+|\$CLAUDE_PROJECT_DIR)/,
    severity: 'error',
  },
  {
    id: 'pidOrCounter',
    description:
      'Per-invocation process counter or PID — belongs in a DynamicSection',
    pattern: /\b(?:pid|invocationCount(?:er)?|callCount(?:er)?)\s*[:=]\s*\d+\b/i,
    severity: 'error',
  },
];

/**
 * Run the lint rules over one section's content. Returns every issue found;
 * callers decide whether to throw or collect.
 */
export function lintSectionContent(
  sectionId: string,
  content: string,
  rules: readonly ContentLintRule[] = STATIC_LINT_RULES,
): readonly ContentLintIssue[] {
  const issues: ContentLintIssue[] = [];
  for (const rule of rules) {
    // Use a fresh regex with the global flag so we can surface every match,
    // not just the first. Cloning avoids mutating the shared rule's regex
    // state across `compile()` calls.
    const globalRe = new RegExp(rule.pattern.source, `${rule.pattern.flags.replace('g', '')}g`);
    let m: RegExpExecArray | null;
    while ((m = globalRe.exec(content)) !== null) {
      issues.push({
        ruleId: rule.id,
        sectionId,
        severity: rule.severity,
        description: rule.description,
        match: m[0],
      });
      // Guard against zero-width matches looping forever.
      if (m.index === globalRe.lastIndex) globalRe.lastIndex++;
    }
  }
  return issues;
}

/**
 * Run the lint rules over every static section in the given `KindedSection`
 * list. Session and dynamic sections are intentionally NOT linted — they
 * carry per-call data by design.
 *
 * Callers pass a `KindedSection[]` (usually the output of `renderSpec`) so
 * the kind is read directly from the tuple rather than from a module-global
 * lookup. This keeps the function pure: no cross-invocation state.
 */
export function lintStaticContent(
  sections: readonly KindedSection[],
  rules: readonly ContentLintRule[] = STATIC_LINT_RULES,
): readonly ContentLintIssue[] {
  const issues: ContentLintIssue[] = [];
  for (const k of sections) {
    if (k.kind !== 'static') continue;
    const sectionIssues = lintSectionContent(k.section.id, k.section.content, rules);
    for (const i of sectionIssues) issues.push(i);
  }
  return issues;
}

/**
 * Thrown from `compile()` when the linter finds any error-severity issue.
 * Callers that need warn-only behavior can pass `CompileOptions.lintMode:
 * 'collect'` and inspect the returned issues on the `CompiledPrompt` (see
 * `compileWithIssues` below).
 */
export class ContentLintError extends Error {
  readonly issues: readonly ContentLintIssue[];
  constructor(issues: readonly ContentLintIssue[]) {
    super(
      `Content linter found ${issues.length} issue(s): ` +
        issues.map((i) => `[${i.ruleId}] ${i.sectionId}: ${i.match}`).join('; '),
    );
    this.name = 'ContentLintError';
    this.issues = issues;
  }
}

// ---------------------------------------------------------------------------
// Kinded-section pairing — the authoritative kind channel
//
// `sections.ts` keeps its brand symbols module-private, so external code
// (including this module) cannot name them to write a runtime type guard.
// Instead of inspecting brands at runtime, this module threads a parallel
// `kind` tag alongside every section produced by the factories.
//
// `renderSpec` returns `readonly KindedSection[]` — every consumer that
// needs to know whether a section is static/session/dynamic reads the tuple
// rather than interrogating a module-global registry. This keeps `compile()`
// pure and re-entrant: no state survives between invocations.
//
// Rationale for avoiding a module-level `WeakMap<AnySection, SectionKind>`
// (the previous design): a long-lived process that calls `compile()`
// repeatedly would accumulate entries in the map, and a GC'd section's
// address being reused would cause its kind lookup to return the wrong
// answer (or fall through to a defensive default, silently skipping the
// static-content linter). Threading the kind through the tuple removes both
// hazards.
// ---------------------------------------------------------------------------

type SectionKind = 'static' | 'session' | 'dynamic';

type AnySection = StaticSection | SessionSection | DynamicSection;

/**
 * Pair a section with its kind so downstream assembly steps (linter,
 * allocator) know which bucket each section came from without having to
 * re-query the brand. Exported because `assertCacheOrdered` and
 * `renderSpec` surface this type on their public signatures.
 */
export interface KindedSection {
  readonly kind: SectionKind;
  readonly section: AnySection;
}

export type { SectionKind };

function staticKinded(section: StaticSection): KindedSection {
  return { kind: 'static', section };
}
function sessionKinded(section: SessionSection): KindedSection {
  return { kind: 'session', section };
}
function dynamicKinded(section: DynamicSection): KindedSection {
  return { kind: 'dynamic', section };
}

// ---------------------------------------------------------------------------
// Cache-order runtime assertion
//
// The `CacheOrderedSections<T>` type helper catches ordering bugs at the
// call site (when the caller builds a literal tuple). For dynamic-length
// arrays built programmatically, the type system alone cannot prove the
// ordering, so we assert at runtime too.
// ---------------------------------------------------------------------------

/**
 * Thrown when an assembled section list violates Static* → Session* →
 * Dynamic*. This is a programming error, not user input — the type system
 * catches this at the call site when sections are a literal tuple. The
 * runtime check exists for the dynamic-length path.
 */
export class CacheOrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CacheOrderError';
  }
}

/**
 * Runtime guard for the Static* → Session* → Dynamic* invariant, run over a
 * tagged `KindedSection` list. Throws `CacheOrderError` on the first out-of-
 * phase entry.
 *
 * Exported so property tests and downstream callers that build their own
 * section lists can run the same check.
 */
export function assertCacheOrdered(sections: readonly KindedSection[]): void {
  // Walk the list tracking which "phase" we're in (0 = static, 1 = session,
  // 2 = dynamic). Any kind that would rewind the phase is an error.
  let phase = 0;
  for (let i = 0; i < sections.length; i++) {
    const k = sections[i]?.kind;
    if (k === undefined) continue;
    const want = k === 'static' ? 0 : k === 'session' ? 1 : 2;
    if (want < phase) {
      throw new CacheOrderError(
        `Cache-order violation at index ${i}: ${k} after phase ${phase}. ` +
          `Required ordering: static* → session* → dynamic*.`,
      );
    }
    phase = want;
  }
}

// ---------------------------------------------------------------------------
// Block → Section rendering
//
// Input: the step's `StepSpec.blocks` plus the CompileInput context.
// Output: a flat `KindedSection[]` in cache-prefix order.
//
// Mapping (from A.3b's handoff, adjusted):
//   - `blocks.static`                      → ONE StaticSection (concatenated)
//   - `blocks.conditional[i]` where
//     `predicates[when](state) === true`   → ONE StaticSection each
//   - `blocks.delegation[activeAgent]`     → ONE StaticSection (when set)
//   - `blocks.synthesis`                   → ONE StaticSection (concatenated)
//   - `blocks.completion`                  → ONE StaticSection
//   - session-state summary                → ONE SessionSection
//   - dynamic context (timestamps, count,
//     artifacts)                           → ONE DynamicSection
//
// Rationale for the "concatenate into one section" choices:
//   - `blocks.static` and `blocks.synthesis` are ordered arrays authored as
//     a unit; concatenating keeps their internal ordering encoded in one
//     section's contentHash. A per-entry split would fragment the cache
//     prefix without adding diagnostic value (each entry's individual hash
//     is already observable via the join order).
//   - `blocks.conditional` stays per-entry because conditional inclusion
//     means the final list length varies; each block's contentHash needs to
//     stand alone for cache-prefix stability checks.
// ---------------------------------------------------------------------------

function renderBlockContent(block: BlockContent): string {
  // TODO(PR B — shared blocks): `BlockContent.refs` is NOT resolved in PR A.
  //
  // The `_shared/` block directory does not exist yet — authoring of shared
  // blocks plus overlay/inlining is scoped to PR B (substate overlays and
  // shared-block registry, per the v0.5.0 Phase 2 plan). Until PR B lands a
  // resolver, any spec that ships with `refs` will silently have the
  // referenced bodies OMITTED from the compiled prompt: only `block.content`
  // is rendered. The PR A schema still ACCEPTS `refs` (it is declared in
  // `types.ts` / `_schema/v1.ts`), which means a future spec could be
  // authored with refs and pass validation before the resolver is wired.
  //
  // A.7's `ideation/spec.json` does not use `refs`, so this is not a silent
  // regression today. But the contract is: if you add a `refs` array to any
  // block in a new spec BEFORE PR B implements shared-block resolution, the
  // compiled prompt will drop the referenced content. `gobbi workflow
  // validate` (B.4) is the planned integration gate — it will check that
  // every ref resolves to a real shared block. Do NOT introduce a spec that
  // uses `refs` until PR B wires both the resolver and the validator.
  //
  // @see `.claude/project/gobbi/design/v050-prompts.md` §Shared Blocks
  // @see PR A → PR B handoff in the PR A evaluation project.md (MAJOR-3)
  return block.content;
}

function joinBlocks(blocks: readonly BlockContent[]): string {
  return blocks.map(renderBlockContent).join(SECTION_SEPARATOR);
}

function renderSessionSummary(state: WorkflowState): string {
  // Deterministic, ordered keys — the session section's contentHash must be
  // stable for two compiles that see the same WorkflowState.
  const completedSteps = [...state.completedSteps].join(',');
  const artifactSummary = Object.keys(state.artifacts)
    .sort()
    .map((k) => `${k}=${(state.artifacts[k] ?? []).length}`)
    .join(',');
  return [
    `session.schemaVersion=${state.schemaVersion}`,
    `session.currentStep=${state.currentStep}`,
    `session.currentSubstate=${state.currentSubstate ?? 'null'}`,
    `session.completedSteps=[${completedSteps}]`,
    `session.evalConfig=${
      state.evalConfig === null
        ? 'null'
        : `ideation=${state.evalConfig.ideation},plan=${state.evalConfig.plan}`
    }`,
    `session.feedbackRound=${state.feedbackRound}/${state.maxFeedbackRounds}`,
    `session.artifactCounts={${artifactSummary}}`,
  ].join('\n');
}

function renderDynamicContext(dynamic: DynamicContext): string {
  const parts = [
    `dynamic.timestamp=${dynamic.timestamp}`,
    `dynamic.activeSubagentCount=${dynamic.activeSubagentCount}`,
  ];
  if (dynamic.pid !== undefined) parts.push(`dynamic.pid=${dynamic.pid}`);
  if (dynamic.invocationCounter !== undefined) {
    parts.push(`dynamic.invocationCounter=${dynamic.invocationCounter}`);
  }
  if (dynamic.artifacts.length > 0) {
    parts.push(
      `dynamic.artifacts=[${dynamic.artifacts.map((a) => a.name).join(',')}]`,
    );
    for (const a of dynamic.artifacts) {
      parts.push(`--- ${a.name} ---`);
      parts.push(a.content);
    }
  }
  return parts.join('\n');
}

/**
 * Render a `StepSpec` plus the active session and dynamic context into an
 * ordered `KindedSection[]`. The output satisfies Static* → Session* →
 * Dynamic* by construction.
 *
 * Exported for tests; `compile()` is the normal entry point.
 */
export function renderSpec(input: CompileInput): readonly KindedSection[] {
  const { spec, state, dynamic, predicates, activeAgent } = input;
  const kinded: KindedSection[] = [];

  // 0) Caller-supplied skill sections — prepended to the static prefix
  //    before any block-derived static sections. See `CompileInput.skillSections`
  //    JSDoc for the ordering rationale.
  if (input.skillSections !== undefined) {
    for (const s of input.skillSections) {
      kinded.push(staticKinded(s));
    }
  }

  // 1) Static blocks — concatenated into one StaticSection.
  if (spec.blocks.static.length > 0) {
    const s = makeStatic({
      id: 'blocks.static',
      content: joinBlocks(spec.blocks.static),
    });
    kinded.push(staticKinded(s));
  }

  // 2) Conditional blocks — one StaticSection per block whose predicate
  //    fires. Unknown predicates evaluate to false (see CompileInput doc).
  for (const cb of spec.blocks.conditional) {
    const pred = predicates[cb.when];
    if (pred === undefined) continue;
    if (!pred(state)) continue;
    const s = makeStatic({
      id: `blocks.conditional.${cb.id}`,
      content: renderBlockContent(cb),
    });
    kinded.push(staticKinded(s));
  }

  // 3) Delegation block for the active agent — one StaticSection.
  if (activeAgent !== null) {
    const block = spec.blocks.delegation[activeAgent];
    if (block !== undefined) {
      const s = makeStatic({
        id: `blocks.delegation.${activeAgent}`,
        content: renderBlockContent(block),
      });
      kinded.push(staticKinded(s));
    }
  }

  // 4) Synthesis blocks — concatenated into one StaticSection.
  if (spec.blocks.synthesis.length > 0) {
    const s = makeStatic({
      id: 'blocks.synthesis',
      content: joinBlocks(spec.blocks.synthesis),
    });
    kinded.push(staticKinded(s));
  }

  // 5) Completion block — instruction + criteria as one StaticSection.
  {
    const criteriaLines = spec.blocks.completion.criteria
      .map((c, i) => `  ${i + 1}. ${c}`)
      .join('\n');
    const completionContent = `${spec.blocks.completion.instruction}\n\nCriteria:\n${criteriaLines}`;
    const s = makeStatic({ id: 'blocks.completion', content: completionContent });
    kinded.push(staticKinded(s));
  }

  // 6) Session summary — one SessionSection.
  {
    const s = makeSession({
      id: 'session.state',
      content: renderSessionSummary(state),
    });
    kinded.push(sessionKinded(s));
  }

  // 7) Dynamic context — one DynamicSection.
  {
    const s = makeDynamic({
      id: 'dynamic.context',
      content: renderDynamicContext(dynamic),
    });
    kinded.push(dynamicKinded(s));
  }

  return kinded;
}

// ---------------------------------------------------------------------------
// No-op BudgetAllocator — available as an explicit opt-out from budget
// enforcement.
//
// `compile()`'s default allocator is `defaultBudgetAllocator` from
// `./budget.js`. Callers that deliberately want pass-through behaviour (no
// section drops, no token accounting) pass this sentinel explicitly.
// ---------------------------------------------------------------------------

/**
 * No-op allocator — keeps every section, drops none.
 *
 * Exported so tests and callers that explicitly want pass-through behaviour
 * can request it by name. Not the default for `compile()` — that is
 * `defaultBudgetAllocator`.
 */
export const NOOP_ALLOCATOR: BudgetAllocator = {
  allocate(sections) {
    return { included: sections, dropped: [] };
  },
};

// ---------------------------------------------------------------------------
// Aggregate hashing — sha256 over text + sha256 over the static-prefix hashes
//
// `sections.ts::computeContentHash` is module-private, so this module owns
// its own tiny hasher. Using Bun's built-in `Bun.CryptoHasher` keeps the
// dependency surface at zero (see packages/cli/package.json `engines.bun`).
// ---------------------------------------------------------------------------

function sha256(content: string): string {
  const hasher = new Bun.CryptoHasher('sha256');
  hasher.update(content);
  return hasher.digest('hex');
}

// ---------------------------------------------------------------------------
// `compile()` — the main entry point.
//
// The overload pattern:
//   - `compile(input)` — uses `defaultBudgetAllocator` (A.5's two-pass
//     floor-then-proportional allocator) with a Claude-4-sized default
//     context window
//   - `compile(input, { allocator, contextWindowTokens, ... })` — uses the
//     caller-supplied allocator and window
//
// We do NOT overload TypeScript-wise (overloads complicate error messages);
// instead the second arg is an options record with sensible defaults.
//
// The default allocator choice matters: PR C/D/E will call `compile()`
// without passing an explicit allocator, and the expectation per
// `v050-prompts.md` §Token Budget Awareness is that the assembled prompt is
// budget-enforced. `NOOP_ALLOCATOR` is still exported for the (few) callers
// that explicitly want pass-through behaviour — notably the test suite's
// allocator-bypass cases.
// ---------------------------------------------------------------------------

/**
 * Default context window — 200k tokens. Matches the Claude 4 base model
 * context window and the `GENEROUS_WINDOW` value used in Ideation's snapshot
 * tests. Callers with a different model (e.g. the 1M-token tier) should set
 * `contextWindowTokens` explicitly.
 */
export const DEFAULT_CONTEXT_WINDOW_TOKENS = 200_000;

/**
 * Optional compilation knobs. All fields default to production-appropriate
 * values so `compile(input)` with no options yields a prompt that respects
 * the step spec's `tokenBudget`.
 *
 * - `allocator` — defaults to `defaultBudgetAllocator` (A.5's two-pass
 *   allocator). Pass `NOOP_ALLOCATOR` to bypass budget enforcement.
 * - `contextWindowTokens` — defaults to {@link DEFAULT_CONTEXT_WINDOW_TOKENS}
 *   (200k). The default allocator REQUIRES a finite value; passing
 *   `Number.POSITIVE_INFINITY` with `defaultBudgetAllocator` will throw. If
 *   you need unbounded compilation, pass `NOOP_ALLOCATOR` as `allocator`
 *   explicitly.
 * - `lintRules` — override `STATIC_LINT_RULES`. Useful for tests and for
 *   adding project-specific patterns.
 * - `lintMode` — `'throw'` (default) rejects the compile on any error-severity
 *   issue; `'collect'` returns the issues on the result without throwing.
 */
export interface CompileOptions {
  readonly allocator?: BudgetAllocator;
  readonly contextWindowTokens?: number;
  readonly lintRules?: readonly ContentLintRule[];
  readonly lintMode?: 'throw' | 'collect';
}

/**
 * `CompileOutcome` — the result type when `lintMode: 'collect'` is used.
 * The default `lintMode: 'throw'` returns `CompiledPrompt` directly.
 */
export interface CompileOutcome {
  readonly prompt: CompiledPrompt;
  readonly lintIssues: readonly ContentLintIssue[];
  readonly dropped: readonly CompiledSectionLike[];
}

/**
 * Assemble a compiled prompt for the given step spec and session/dynamic
 * context. Throws `ContentLintError` if any `StaticSection.content` matches
 * a linter error-severity rule (the default; see `lintMode`). Throws
 * `CacheOrderError` if the assembled section list violates Static* →
 * Session* → Dynamic* (a programming error — the type system catches this
 * for literal tuples; the runtime check exists for dynamic-length paths).
 *
 * The returned prompt is deterministic: two calls with the same
 * `CompileInput` produce identical `text`, `contentHash`, and
 * `staticPrefixHash`.
 */
export function compile(
  input: CompileInput,
  options: CompileOptions = {},
): CompiledPrompt {
  const outcome = compileWithIssues(input, { ...options, lintMode: 'throw' });
  return outcome.prompt;
}

/**
 * Lower-level entry point that always returns `CompileOutcome` (prompt +
 * lint issues + dropped sections). Use this when you want to inspect
 * warnings/errors without throwing. Passes `lintMode: 'collect'` by default
 * so callers that want the soft path don't have to set it explicitly.
 */
export function compileWithIssues(
  input: CompileInput,
  options: CompileOptions = {},
): CompileOutcome {
  const {
    allocator = defaultBudgetAllocator,
    contextWindowTokens = DEFAULT_CONTEXT_WINDOW_TOKENS,
    lintRules = STATIC_LINT_RULES,
    lintMode = 'collect',
  } = options;

  // 1) Render spec + inputs into an ordered kinded list.
  const kinded = renderSpec(input);

  // 2) Runtime cache-order assertion (belt-and-braces with the compile-time
  //    `CacheOrderedSections<T>` guard in sections.ts).
  assertCacheOrdered(kinded);

  // 3) Lint static content. The linter reads kind directly from the
  //    KindedSection tuple — no module-global lookup, no brand-interrogation.
  const lintIssues = lintStaticContent(kinded, lintRules);

  const hasError = lintIssues.some((i) => i.severity === 'error');
  if (hasError && lintMode === 'throw') {
    throw new ContentLintError(lintIssues);
  }

  // 4) Budget allocation. Map KindedSection → CompiledSectionLike for the
  //    allocator surface, preserving order.
  const likeForSection = new Map<CompiledSectionLike, KindedSection>();
  const sectionLikes: CompiledSectionLike[] = kinded.map((k) => {
    const like: CompiledSectionLike =
      k.section.minTokens === undefined
        ? {
            id: k.section.id,
            content: k.section.content,
            contentHash: k.section.contentHash,
          }
        : {
            id: k.section.id,
            content: k.section.content,
            contentHash: k.section.contentHash,
            minTokens: k.section.minTokens,
          };
    likeForSection.set(like, k);
    return like;
  });

  const allocation: AllocationResult = allocator.allocate(
    sectionLikes,
    contextWindowTokens,
    input.spec.tokenBudget satisfies TokenBudget,
  );

  // Preserve original order in `included` even if the allocator returned
  // sections in a different order — cache ordering is not the allocator's
  // responsibility. We walk the original `sectionLikes` in order and keep
  // only those the allocator included (dedup by reference).
  const includedSet = new Set(allocation.included);
  const includedOrdered: KindedSection[] = [];
  for (const like of sectionLikes) {
    if (includedSet.has(like)) {
      const k = likeForSection.get(like);
      if (k !== undefined) includedOrdered.push(k);
    }
  }

  // 5) Emit. Text is the concatenated section contents; summaries are one
  //    per included section.
  const text = includedOrdered
    .map((k) => k.section.content)
    .join(SECTION_SEPARATOR);
  const summaries: CompiledSectionSummary[] = includedOrdered.map((k) => ({
    id: k.section.id,
    kind: k.kind,
    byteLength: Buffer.byteLength(k.section.content, 'utf8'),
    contentHash: k.section.contentHash,
  }));

  // 6) Hashes.
  //    - `contentHash`: sha256 over the concatenated text.
  //    - `staticPrefixHash`: sha256 over the static sections' contentHashes,
  //      joined in order. Uses section contentHashes (not raw content) so
  //      this is cheap and matches the Merkle-style cache identity
  //      described in research.md §Cross-Cutting Insight.
  const contentHash = sha256(text);
  const staticPrefixHash = sha256(
    includedOrdered
      .filter((k) => k.kind === 'static')
      .map((k) => k.section.contentHash)
      .join(''),
  );

  const prompt: CompiledPrompt = {
    text,
    sections: summaries,
    contentHash,
    staticPrefixHash,
  };

  const dropped = allocation.dropped;

  return { prompt, lintIssues, dropped };
}

// ---------------------------------------------------------------------------
// Exported helper: cache-order assertion on a literal section tuple.
//
// This is the A.3-documented typed call pattern:
//   `const tuple = [s1, ss1, d1] as const; assertOrdered(tuple);`
// `CacheOrderedSections<T>` catches misorderings at compile time for literal
// tuples. The runtime `assertCacheOrdered` in `compile()` handles the
// dynamic-length path used by the spec renderer.
// ---------------------------------------------------------------------------

/**
 * Compile-time + runtime guard for a literal section tuple. Returns the
 * input unchanged (for chaining in tests).
 *
 * Used in tests and in downstream callers that construct their own section
 * tuples (PR D's error-pathway compilers).
 */
export function assertOrdered<
  const T extends readonly AnySection[],
>(sections: T & CacheOrderedSections<T>): T {
  // At runtime, we don't have a way to inspect the brand symbols (they're
  // module-private in sections.ts). The type-level guard does the heavy
  // lifting here; if you need a runtime check on a dynamic-length array,
  // use the internal `assertCacheOrdered` path via `compile()`.
  return sections;
}
