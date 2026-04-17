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

import type {
  ErrorPathwayCrash,
  ErrorPathwayTimeout,
  ErrorPathwayFeedbackCap,
  ErrorPathwayInvalidTransition,
  ErrorPathwayUnknown,
} from './errors.js';

// ---------------------------------------------------------------------------
// Per-pathway static preambles — byte-stable across every invocation.
//
// Each constant mirrors the "framing" text from
// `.claude/project/gobbi/design/v050-session.md` §Resume Briefing
// (lines 176-184). The design doc enumerates one recovery-framing paragraph
// per pathway kind — these preambles quote that framing in operator-facing
// prose so the compiled prompt tells the orchestrator WHAT pathway it is
// recovering from before any dynamic evidence is spliced in.
//
// STATIC_LINT_RULES (`specs/assembly.ts`) gate these: no ISO timestamps, no
// UUIDs, no absolute paths, no PIDs or invocation counters. Pathway-specific
// evidence — timestamps, seqs, artifact filenames — lives in the DynamicSection
// emitted by `render*Evidence` below.
// ---------------------------------------------------------------------------

/**
 * Crash pathway preamble. Matches `v050-session.md` §"Normal mid-step crash".
 * No dynamic content — the `stepAtCrash`, event seqs, and heartbeat seq
 * render via `renderCrashEvidence`.
 */
export const STATIC_PREAMBLE_CRASH = `Pathway: crash.

The workflow was in an active step when the process terminated. There is no explicit triggering event (no timeout, no invalid transition, no feedback cap) — the evidence points to a mid-step process exit. Recovery means choosing whether to retry the step from where it left off or to force-advance to memorization and end the session.`;

/**
 * Timeout pathway preamble. Matches `v050-session.md` §"Error state from step timeout".
 */
export const STATIC_PREAMBLE_TIMEOUT = `Pathway: step timeout.

A step exceeded its configured timeout and the Stop hook emitted a workflow.step.timeout event. The briefing below names which step timed out, the elapsed time at timeout, the configured timeout value, and the artifacts that were in progress when the Stop hook fired. Recovery means choosing between a fresh-context retry, a force-advance to memorization, or an abort.`;

/**
 * FeedbackCap pathway preamble. Matches `v050-session.md` §"Error state from feedback round cap".
 */
export const STATIC_PREAMBLE_FEEDBACK_CAP = `Pathway: feedback round cap.

The evaluation loop reached its configured maximum feedback rounds with a trailing revise verdict — the reducer transitioned execution_eval to error at the cap-fire moment. The briefing below lists the per-round verdict history and the artifacts captured during the final round. Recovery means force-memorizing partial work (gobbi workflow resume --force-memorization) or aborting. Re-entering the evaluation loop is not available once the cap has fired.`;

/**
 * InvalidTransition pathway preamble. Matches `v050-session.md` §"Error state from invalid transition".
 */
export const STATIC_PREAMBLE_INVALID = `Pathway: invalid transition.

The reducer rejected an event because the transition was not valid from the current state. The rejected event itself never landed in the store (it was inside a rolled-back transaction); an audit event of type workflow.invalid_transition carries the witness. The briefing below names the rejected event type, the reducer error message, and the step at the time of rejection. Recovery means retrying from the last valid state or aborting.`;

/**
 * Unknown pathway preamble — classifier fallback. Operator framing when the
 * detector cannot attribute the error to one of the four observable pathways.
 */
export const STATIC_PREAMBLE_UNKNOWN = `Pathway: unknown.

The workflow is in the error step but the event store carries no evidence that attributes the error to one of the four observable pathways (crash, timeout, feedback cap, invalid transition). The classifier's diagnostic hint appears below — it usually indicates either an empty store (state.json written manually) or a store-read race during classification. Recovery means inspecting the hint to pick between retry-from-last-valid-state, force-memorization, and abort.`;

// ---------------------------------------------------------------------------
// Per-pathway dynamic render helpers — evidence + recovery-options text.
//
// Each `render*Evidence` produces the text content for a DynamicSection that
// cites the concrete pathway fields (seqs, steps, counts, artifact names).
// `render*RecoveryOptions` produces the text content for a second
// DynamicSection that lists the specific recovery command lines the operator
// can run — copied verbatim from `v050-session.md` §Resume Briefing's
// "Recovery options" sentences.
//
// DynamicSection content is NOT subject to STATIC_LINT_RULES — timestamps,
// seqs, and paths are expected here.
// ---------------------------------------------------------------------------

function joinArtifacts(artifacts: readonly string[]): string {
  if (artifacts.length === 0) return '(none observable)';
  return artifacts.join(', ');
}

function joinSeqs(seqs: readonly number[]): string {
  if (seqs.length === 0) return '(none)';
  return seqs.join(', ');
}

/**
 * Dynamic evidence block for the Crash pathway. Lists the last observed step,
 * the tail event seqs, and the heartbeat seq (or "none" when no heartbeat
 * exists in the store).
 */
export function renderCrashEvidence(pathway: ErrorPathwayCrash): string {
  const heartbeat =
    pathway.heartbeatEventSeq === null
      ? 'heartbeat=(none)'
      : `heartbeat.seq=${pathway.heartbeatEventSeq}`;
  return [
    'Crash evidence:',
    `  stepAtCrash=${pathway.stepAtCrash}`,
    `  lastEventSeqs=[${joinSeqs(pathway.lastEventSeqs)}]`,
    `  ${heartbeat}`,
  ].join('\n');
}

/**
 * Dynamic recovery-options block for the Crash pathway. Mirrors the design
 * doc's "retry the step from where it left off, or force-advance to
 * memorization" sentence.
 */
export function renderCrashRecoveryOptions(pathway: ErrorPathwayCrash): string {
  return [
    'Recovery options:',
    `  - Retry from the crashed step:      gobbi workflow resume --target ${pathway.stepAtCrash}`,
    '  - Force-advance to memorization:    gobbi workflow resume --force-memorization',
    '  - Abort the session:                gobbi workflow transition --type abort',
  ].join('\n');
}

/**
 * Dynamic evidence block for the Timeout pathway. Lists the timed-out step,
 * elapsed vs configured milliseconds, the triggering audit event's seq, and
 * the artifact filenames observed in the step's directory at detection time.
 */
export function renderTimeoutEvidence(pathway: ErrorPathwayTimeout): string {
  return [
    'Timeout evidence:',
    `  timedOutStep=${pathway.timedOutStep}`,
    `  elapsedMs=${pathway.elapsedMs}`,
    `  configuredTimeoutMs=${pathway.configuredTimeoutMs}`,
    `  timeoutEventSeq=${pathway.timeoutEventSeq}`,
    `  inProgressArtifacts=[${joinArtifacts(pathway.inProgressArtifacts)}]`,
  ].join('\n');
}

/**
 * Dynamic recovery-options block for the Timeout pathway. Mirrors the design
 * doc's "retry the step with a fresh context, force-advance to memorization,
 * or abort" sentence.
 */
export function renderTimeoutRecoveryOptions(
  pathway: ErrorPathwayTimeout,
): string {
  return [
    'Recovery options:',
    `  - Retry with a fresh context:       gobbi workflow resume --target ${pathway.timedOutStep}`,
    '  - Force-advance to memorization:    gobbi workflow resume --force-memorization',
    '  - Abort the session:                gobbi workflow transition --type abort',
  ].join('\n');
}

/**
 * Dynamic evidence block for the FeedbackCap pathway. Lists the round
 * counter, the cap value, the per-round verdict history, and the artifact
 * filenames captured during the final round.
 */
export function renderFeedbackCapEvidence(
  pathway: ErrorPathwayFeedbackCap,
): string {
  const history =
    pathway.verdictHistory.length === 0
      ? '  (none recorded)'
      : pathway.verdictHistory
          .map((h) => {
            const loop = h.loopTarget ?? 'null';
            const evaluator = h.evaluatorId ?? 'null';
            return `  round=${h.round} verdict=${h.verdict} seq=${h.verdictSeq} loopTarget=${loop} evaluator=${evaluator}`;
          })
          .join('\n');
  return [
    'FeedbackCap evidence:',
    `  feedbackRound=${pathway.feedbackRound}/${pathway.maxFeedbackRounds}`,
    '  verdictHistory:',
    history,
    `  finalRoundArtifacts=[${joinArtifacts(pathway.finalRoundArtifacts)}]`,
  ].join('\n');
}

/**
 * Dynamic recovery-options block for the FeedbackCap pathway. Mirrors the
 * design doc's "force memorization to save partial work, or abort" sentence.
 * Note: re-entry into the evaluation loop is NOT offered — the cap has fired.
 */
export function renderFeedbackCapRecoveryOptions(
  _pathway: ErrorPathwayFeedbackCap,
): string {
  return [
    'Recovery options:',
    '  - Force memorization (save partial): gobbi workflow resume --force-memorization',
    '  - Abort the session:                 gobbi workflow transition --type abort',
  ].join('\n');
}

/**
 * Dynamic evidence block for the InvalidTransition pathway. Lists the
 * rejected event type, its seq (or "null" when the reducer rejected before
 * the append landed), the step at rejection, the reducer error message, and
 * the audit event's seq.
 */
export function renderInvalidTransitionEvidence(
  pathway: ErrorPathwayInvalidTransition,
): string {
  const rejectedSeq =
    pathway.rejectedEventSeq === null
      ? 'null (rejected before append)'
      : String(pathway.rejectedEventSeq);
  return [
    'InvalidTransition evidence:',
    `  rejectedEventType=${pathway.rejectedEventType}`,
    `  rejectedEventSeq=${rejectedSeq}`,
    `  stepAtRejection=${pathway.stepAtRejection}`,
    `  reducerMessage=${pathway.reducerMessage}`,
    `  invalidTransitionEventSeq=${pathway.invalidTransitionEventSeq}`,
  ].join('\n');
}

/**
 * Dynamic recovery-options block for the InvalidTransition pathway. Mirrors
 * the design doc's "retry from the last valid state, or abort" sentence.
 */
export function renderInvalidTransitionRecoveryOptions(
  pathway: ErrorPathwayInvalidTransition,
): string {
  return [
    'Recovery options:',
    `  - Retry from the last valid state:  gobbi workflow resume --target ${pathway.stepAtRejection}`,
    '  - Force-advance to memorization:    gobbi workflow resume --force-memorization',
    '  - Abort the session:                gobbi workflow transition --type abort',
  ].join('\n');
}

/**
 * Dynamic evidence block for the Unknown pathway. The detector tags the
 * `reason` (empty-store, no-triggering-event, ambiguous-signals) and supplies
 * a `diagnosticHint` — both surface here for operator context.
 */
export function renderUnknownEvidence(pathway: ErrorPathwayUnknown): string {
  return [
    'Unknown-pathway evidence:',
    `  reason=${pathway.reason}`,
    `  diagnosticHint=${pathway.diagnosticHint}`,
  ].join('\n');
}

/**
 * Dynamic recovery-options block for the Unknown pathway. Offers the
 * conservative superset — retry from the last completed step (if any),
 * force-advance, or abort. Operator-facing text explicitly flags that the
 * detector has no pathway-specific recommendation.
 */
export function renderUnknownRecoveryOptions(
  _pathway: ErrorPathwayUnknown,
): string {
  return [
    'Recovery options (no pathway-specific recommendation — inspect the diagnostic hint above):',
    '  - Retry from the last completed step: gobbi workflow resume --target <step>',
    '  - Force-advance to memorization:      gobbi workflow resume --force-memorization',
    '  - Abort the session:                  gobbi workflow transition --type abort',
  ].join('\n');
}

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
