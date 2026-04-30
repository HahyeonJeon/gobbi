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
  ModelTier,
  EffortLevel,
} from './types.js';
import { defaultBudgetAllocator } from './budget.js';
import type { AgentOriginal } from './spec-loader.js';
import type { WorkflowState } from '../workflow/state-derivation.js';
import type { WorkflowGraph } from './graph.js';

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
  // `BlockContent.refs` is accepted structurally by the schema but is
  // NOT inlined at compile time. The `_shared/` block directory and
  // resolver were originally scoped to PR B but shipped with PR B
  // deferring them; see `assembly.test.ts` (`renderBlockContent —
  // BlockContent.refs`) which pins the current no-op behaviour. A
  // future PR that wires the resolver must update those tests to
  // assert inlined shared-block content.
  //
  // @see `.claude/project/gobbi/design/v050-prompts.md` §Shared Blocks
  return block.content;
}

function joinBlocks(blocks: readonly BlockContent[]): string {
  return blocks.map(renderBlockContent).join(SECTION_SEPARATOR);
}

export function renderSessionSummary(state: WorkflowState): string {
  // Deterministic, ordered keys — the session section's contentHash must be
  // stable for two compiles that see the same WorkflowState.
  const completedSteps = [...state.completedSteps].join(',');
  const artifactSummary = Object.keys(state.artifacts)
    .sort()
    .map((k) => `${k}=${(state.artifacts[k] ?? []).length}`)
    .join(',');
  // evalConfig rendering (Wave C.2 + T-2a.7): ideation/planning are always
  // present when evalConfig is non-null; `execution` (Wave C.2) and
  // `memorization` (PR-FIN-2a-i T-2a.7) are optional slots OMITTED from the
  // rendered summary when undefined. Wave-4 rename flipped the field name
  // from `plan` to `planning`; snapshot regeneration (W4.4) tracks the line
  // change.
  const renderEvalConfig = (ec: NonNullable<WorkflowState['evalConfig']>): string => {
    const parts = [`ideation=${ec.ideation}`, `planning=${ec.planning}`];
    if (ec.execution !== undefined) parts.push(`execution=${ec.execution}`);
    if (ec.memorization !== undefined) parts.push(`memorization=${ec.memorization}`);
    return parts.join(',');
  };
  return [
    `session.schemaVersion=${state.schemaVersion}`,
    `session.currentStep=${state.currentStep}`,
    `session.currentSubstate=${state.currentSubstate ?? 'null'}`,
    `session.completedSteps=[${completedSteps}]`,
    `session.evalConfig=${
      state.evalConfig === null ? 'null' : renderEvalConfig(state.evalConfig)
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

// ---------------------------------------------------------------------------
// Agent-routing block — settings-cascade provenance surfaced in the prompt
//
// Emitted as a static section between the active delegation block and the
// synthesis block (per PR-FIN-1e ideation §2.4). Surfaces the resolved
// `(model, effort)` plus a provenance suffix for every entry of
// `spec.delegation.agents`. The orchestrator reads concrete tiers directly;
// only `'auto'` carries a policy reference, and the policy itself stays in
// `_gobbi-rule.md` Model Selection (where it already lives).
//
// The block is NOT emitted when:
//   - `spec.delegation.agents` is empty (planning, memorization, handoff);
//   - `originals` is undefined (caller used {@link loadSpec} directly,
//     bypassing the runtime settings overlay — preserves backward compat
//     for spec-authoring tools and test fixtures).
//
// Cache-prefix engineering (ideation §2.4):
//   - Default-only sessions produce a fixed-byte block per step.
//   - Toggling an override → one-time cache miss; subsequent same-state
//     sessions are cache-stable again.
//   - Block content is byte-stable for any given (spec, originals,
//     resolved settings) triple — the renderer is deterministic.
// ---------------------------------------------------------------------------

/**
 * Per-agent entry that drives one rendered line of the agent-routing block.
 * Values mirror the resolved spec post-overlay, so the renderer can compare
 * them against `originals[role]` to compute `(default)` vs `(override)`.
 */
interface AgentRoutingRow {
  readonly role: string;
  readonly modelTier: ModelTier;
  readonly effort: EffortLevel;
}

/**
 * Render the `agent-routing` static section.
 *
 * Returns `null` when no block should be emitted:
 *
 * - `originals === undefined` — the caller did not opt into the runtime
 *   overlay path. Preserves backward compatibility for spec-authoring
 *   tools (`prompt render` / `prompt patch`) and test fixtures.
 * - `spec.delegation.agents.length === 0` — empty-delegation steps
 *   (planning, memorization, handoff) emit no block.
 *
 * Format (per PR-FIN-1e ideation §2.4):
 *
 * ```
 * Agent routing for this step (resolved from settings cascade):
 *   - role=<R>   model=<M>   effort=<E>   (<provenance>)
 * ```
 *
 * Provenance suffix rules:
 *
 * - `(auto: resolve via _gobbi-rule Model Selection)` — resolved
 *   `modelTier === 'auto'` OR `effort === 'auto'`. Takes precedence over
 *   the default/override branches because `'auto'` defers to a policy
 *   reference regardless of how the value was selected.
 * - `(override: <slot>)` — resolved value differs from `originals[role]`.
 *   `<slot>` is the `slotHint` argument when supplied (e.g.
 *   `'workflow.execution.agent'`); otherwise a bare `(override)` marker.
 *   The loader (`spec-loader.ts::loadSpecForRuntime`) is the only producer
 *   that knows the active slot; passing `slotHint` from the caller keeps
 *   this renderer stateless.
 * - `(default)` — resolved value matches the spec.json hardcoded literal
 *   exactly AND no `'auto'` is present.
 *
 * Column widths are fixed (role=10, model=8, effort=6) to keep lines
 * visually scannable across the typical role names. Roles longer than 10
 * characters extend the line; the suffix sits at the end of each line.
 *
 * @param spec  - The post-overlay {@link StepSpec} (`spec.delegation.agents`
 *   carries the resolved values).
 * @param originals - Pre-overlay `{modelTier, effort}` keyed by `role`. May
 *   be `undefined` (returns `null`) or an empty/partial map (roles missing
 *   from the map are treated as "no original known" — falls back to the
 *   `'auto'` or bare `(override)` branch as appropriate).
 * @param slotHint - Optional dotted-path naming the active settings slot
 *   that produced an override (e.g. `'workflow.ideation.agent'` for
 *   productive steps, `'workflow.execution.evaluate.agent'` for eval
 *   steps). When `null` or omitted, override lines render `(override)`
 *   without the slot tail.
 */
export function renderAgentRoutingBlock(
  spec: StepSpec,
  originals: Readonly<Record<string, AgentOriginal>> | undefined,
  slotHint: string | null = null,
): StaticSection | null {
  if (originals === undefined) return null;
  if (spec.delegation.agents.length === 0) return null;

  const rows: readonly AgentRoutingRow[] = spec.delegation.agents.map(
    (agent) => ({
      role: agent.role,
      modelTier: agent.modelTier,
      effort: agent.effort,
    }),
  );

  const lines: string[] = ['Agent routing for this step (resolved from settings cascade):'];
  for (const row of rows) {
    const provenance = computeProvenance(row, originals, slotHint);
    const rolePart = padRight(`role=${row.role}`, 16);
    const modelPart = padRight(`model=${row.modelTier}`, 14);
    const effortPart = padRight(`effort=${row.effort}`, 13);
    lines.push(`  - ${rolePart}${modelPart}${effortPart}${provenance}`);
  }

  return makeStatic({
    id: 'blocks.agent-routing',
    content: lines.join('\n'),
  });
}

/**
 * Compute the provenance suffix for one agent-routing row.
 *
 * Precedence: auto > override > default. The `'auto'` branch fires when
 * either the resolved model or effort carries the literal `'auto'` — both
 * paths defer to `_gobbi-rule` Model Selection at orchestrator-spawn time,
 * so a single suffix covers both legs.
 */
function computeProvenance(
  row: AgentRoutingRow,
  originals: Readonly<Record<string, AgentOriginal>>,
  slotHint: string | null,
): string {
  if (row.modelTier === 'auto' || row.effort === 'auto') {
    return '(auto: resolve via _gobbi-rule Model Selection)';
  }
  const original = originals[row.role];
  const overridden =
    original === undefined ||
    original.modelTier !== row.modelTier ||
    original.effort !== row.effort;
  if (overridden) {
    return slotHint === null ? '(override)' : `(override: ${slotHint})`;
  }
  return '(default)';
}

/**
 * Right-pad a string with spaces to `width`. Strings already at or beyond
 * `width` are returned unchanged plus a single trailing space — keeps the
 * column separators visible even for over-long roles.
 */
function padRight(s: string, width: number): string {
  if (s.length >= width) return `${s} `;
  return s + ' '.repeat(width - s.length);
}

/**
 * Optional decorations consumed only by {@link renderSpec} and forwarded by
 * {@link compile}/{@link compileWithIssues} from {@link CompileOptions}.
 *
 * Kept separate from {@link CompileInput} because these fields are
 * settings-cascade provenance — a rendering decoration, not part of the
 * deterministic-input identity (spec/state/dynamic). The sibling-parameter
 * placement is the locked design choice from PR-FIN-1e plan §"Locked design
 * choices".
 */
export interface RenderDecorations {
  readonly originals?: Readonly<Record<string, AgentOriginal>>;
  readonly slotHint?: string | null;
}

/**
 * Render a `StepSpec` plus the active session and dynamic context into an
 * ordered `KindedSection[]`. The output satisfies Static* → Session* →
 * Dynamic* by construction.
 *
 * Exported for tests; `compile()` is the normal entry point.
 *
 * @param input - The deterministic compile inputs.
 * @param decorations - Optional rendering decorations forwarded by
 *   {@link compile}/{@link compileWithIssues}. When `decorations.originals`
 *   is present AND `spec.delegation.agents` is non-empty, an additional
 *   `agent-routing` static section is inserted between the active
 *   delegation block (step 3) and the synthesis block (step 4) — see
 *   {@link renderAgentRoutingBlock} for format and provenance rules.
 */
export function renderSpec(
  input: CompileInput,
  decorations: RenderDecorations = {},
): readonly KindedSection[] {
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

  // 3b) Agent-routing block — settings-cascade provenance surfaced in the
  //     prompt. Emitted only when `decorations.originals` was supplied (the
  //     runtime overlay path via {@link loadSpecForRuntime}); spec-authoring
  //     callers (`prompt render`, `prompt patch`) and unsettings-aware test
  //     fixtures pass no `originals` and skip this section to preserve their
  //     deterministic snapshots. See {@link renderAgentRoutingBlock} for
  //     format, provenance suffix rules, and cache-prefix engineering.
  {
    const routing = renderAgentRoutingBlock(
      spec,
      decorations.originals,
      decorations.slotHint ?? null,
    );
    if (routing !== null) kinded.push(staticKinded(routing));
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

  // 5b) Footer block — JIT step-completion protocol that names the exact
  //     `gobbi workflow transition <VERB>` invocation the agent must run as
  //     its terminal action. Always emitted; per-spec text. Sits between the
  //     completion block and the session summary so the protocol prose is
  //     part of the cache prefix and the agent reads it immediately after
  //     the criteria it back-references.
  {
    const s = makeStatic({
      id: 'blocks.footer',
      content: spec.blocks.footer,
    });
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
  /**
   * Pre-overlay `{modelTier, effort}` for each agent in the spec, keyed by
   * the agent's `role`. When supplied AND `spec.delegation.agents` is
   * non-empty, `renderSpec` emits an additional `agent-routing` static
   * section (between the delegation block and the synthesis block) that
   * surfaces the resolved model/effort + provenance for each agent. When
   * omitted (or empty map), no `agent-routing` block is emitted — preserving
   * backward compatibility for callers that load the spec directly via
   * {@link loadSpec} without going through the runtime overlay path.
   *
   * Sibling-parameter design (locked per PR-FIN-1e plan): `originals` is
   * NOT a field on {@link CompileInput}. Keeping it on the options bag
   * preserves the "compile() is deterministic given (spec, state, dynamic)"
   * contract — settings provenance is a rendering decoration, not part of
   * the spec/state/dynamic identity.
   *
   * The map is small (≤2 entries per step today). It is consumed only by
   * {@link renderAgentRoutingBlock}; downstream pipeline stages (linter,
   * allocator, hashes) do not see it.
   *
   * @see `loadSpecForRuntime` in `./spec-loader.ts` for the producer.
   */
  readonly originals?: Readonly<Record<string, AgentOriginal>>;
  /**
   * Optional dotted-path naming the active settings slot that produced an
   * override (e.g. `'workflow.ideation.agent'` for productive steps,
   * `'workflow.execution.evaluate.agent'` for eval steps). Surfaces in the
   * `agent-routing` block as `(override: <slotHint>)`. When absent or
   * `null`, override lines render as a bare `(override)` marker.
   *
   * Only the caller that resolved the cascade knows which slot fired —
   * `renderAgentRoutingBlock` stays stateless by accepting this as a hint.
   */
  readonly slotHint?: string | null;
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
    originals,
    slotHint = null,
  } = options;

  // 1) Render spec + inputs into an ordered kinded list. The agent-routing
  //    decoration is forwarded only to the renderer — downstream stages
  //    (linter, allocator, hashes) work on the already-decorated section
  //    list and do not see `originals` directly.
  //
  //    Build the decorations record with conditional spread so we never set
  //    `originals: undefined` explicitly (incompatible with the
  //    `exactOptionalPropertyTypes: true` compile flag — see `_typescript`
  //    skill on optional-property semantics).
  const decorations: RenderDecorations = {
    ...(originals !== undefined ? { originals } : {}),
    slotHint,
  };
  const kinded = renderSpec(input, decorations);

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

// ---------------------------------------------------------------------------
// Spec/graph predicate-reference validation
//
// The registry's `satisfies Record<PredicateName, Predicate>` clause
// (workflow/predicates.ts) catches missing registrations at compile time —
// but only for spec/overlay/graph files that the codegen scanned at the
// last typecheck. Specs loaded from disk at runtime (for instance via
// `gobbi workflow validate` pointed at a user spec directory, or a
// migration-time spec read) bypass that gate. The two validators below
// cover the runtime case.
//
// Both return `string[]` of human-readable error messages; an empty array
// means the spec/graph references only registered predicates. They do NOT
// throw — callers decide whether to escalate.
//
// Intentional scope: the validators check *that* a predicate is registered,
// not *what* its body does. Semantic correctness of the predicate's
// evaluation is a unit-test concern, not a validator concern.
// ---------------------------------------------------------------------------

/**
 * Collect every predicate name referenced anywhere in a `StepSpec`.
 *
 * Walks:
 *   - `spec.transitions[*].condition`
 *   - `spec.blocks.conditional[*].when`
 *
 * Returns a deduplicated, insertion-ordered array.
 */
export function collectSpecPredicateReferences(
  spec: StepSpec,
): readonly string[] {
  const seen = new Set<string>();
  for (const t of spec.transitions) {
    if (typeof t.condition === 'string' && t.condition.length > 0) {
      seen.add(t.condition);
    }
  }
  for (const cb of spec.blocks.conditional) {
    if (typeof cb.when === 'string' && cb.when.length > 0) {
      seen.add(cb.when);
    }
  }
  return [...seen];
}

/**
 * Validate that every predicate referenced by a `StepSpec` is present in
 * the registry. Complements the compile-time `satisfies` gate for
 * dynamically-loaded specs.
 *
 * @param spec - the spec to check
 * @param registry - the predicate registry to validate against
 * @param specLabel - optional human-readable label (e.g. the spec file
 *   path) to include in error messages; defaults to `'<step-spec>'`
 */
export function validateSpecPredicateReferences(
  spec: StepSpec,
  registry: Readonly<Record<string, unknown>>,
  specLabel: string = '<step-spec>',
): string[] {
  const errors: string[] = [];
  for (const t of spec.transitions) {
    if (t.condition !== undefined && !(t.condition in registry)) {
      errors.push(
        `${specLabel}: transition -> ${t.to} references unknown predicate "${t.condition}"`,
      );
    }
  }
  for (const cb of spec.blocks.conditional) {
    if (cb.when !== undefined && !(cb.when in registry)) {
      errors.push(
        `${specLabel}: conditional block "${cb.id}" references unknown predicate "${cb.when}"`,
      );
    }
  }
  return errors;
}

/**
 * Validate that every predicate referenced by a `WorkflowGraph`'s
 * `transitions[]` is present in the registry. Complements
 * `validateSpecPredicateReferences` for graph-level edges (index.json).
 *
 * `transitions[*].condition` is a non-empty string by schema; missing
 * registrations are emitted as one error per offending edge.
 */
export function validateGraphPredicateReferences(
  graph: WorkflowGraph,
  registry: Readonly<Record<string, unknown>>,
  graphLabel: string = '<workflow-graph>',
): string[] {
  const errors: string[] = [];
  for (const edge of graph.transitions) {
    if (edge.condition.length === 0) continue;
    if (!(edge.condition in registry)) {
      errors.push(
        `${graphLabel}: edge ${edge.from} -> ${edge.to} references unknown predicate "${edge.condition}"`,
      );
    }
  }
  return errors;
}
