/**
 * Error-state + resume prompt compilers — public surface.
 *
 * PR D's error-pathway pipeline lives under a factored layout: this module is
 * the public surface (types + dispatcher + re-exports); private siblings
 * `errors.pathway-detect.ts`, `errors.pathway-compilers.ts`, and
 * `errors.sections.ts` hold the detector, per-pathway compiler bodies, and
 * shared section/lint helpers respectively.
 *
 * ## Surface layout
 *
 * - `ErrorPathway` discriminated union (5 variants, `kind` discriminant,
 *   JSON-safe primitive fields only — the entire shape round-trips through
 *   `JSON.stringify` / `JSON.parse` at the event-store boundary).
 * - `ErrorPathwayKind` union of variant tags.
 * - Per-variant interfaces: `ErrorPathwayCrash`, `ErrorPathwayTimeout`,
 *   `ErrorPathwayFeedbackCap`, `ErrorPathwayInvalidTransition`,
 *   `ErrorPathwayUnknown`.
 * - `visitPathway<T>(pathway, visitor)` mapped-type-backed exhaustive
 *   dispatch. The visitor object literal is the exhaustiveness gate; adding a
 *   new variant requires every call site to register a handler (stronger
 *   than `satisfies Record` — the mapped type cannot be bypassed by a
 *   literal).
 * - `detectPathway(state, store, options?)` re-exported from the detect
 *   module for convenience.
 * - `compileErrorPrompt(state, store): CompiledPrompt` — PR D.3 swaps the
 *   body to the `visitPathway` dispatcher; this wave (D.1) ships the typed
 *   signature with a throw body.
 * - `compileUnknownErrorPrompt(state, store): CompiledPrompt` — body swap in
 *   D.2; D.1 only updates the docblock.
 * - `compileResumePrompt` — declared here for export-surface continuity;
 *   real signature + body lands in D.4 (which also deletes the
 *   `specs/resume.ts` stub file wholesale).
 *
 * ## Why the 5 variants
 *
 * `v050-session.md` §Resume Briefing defines four observable error
 * pathways (Crash, Timeout, FeedbackCap, InvalidTransition) plus a
 * classifier fallback (Unknown). Each variant carries its own narrative
 * evidence — the payloads are narrow to the pathway, not widened to a
 * shared shape.
 *
 * @see `.claude/project/gobbi/design/v050-session.md` §Resume Briefing with Pathway Differentiation
 */

import type { WorkflowState } from '../workflow/state.js';
import type { EventStore } from '../workflow/store.js';
import type { CompiledPrompt } from './types.js';

// ---------------------------------------------------------------------------
// ErrorPathway — 5-variant discriminated union on `kind`
//
// Every field is `readonly`. Every payload is JSON-safe (primitives, arrays
// of primitives, records of primitives). No `Date`, `Map`, `Set`, or class
// instances — those do NOT round-trip through the event store's
// `JSON.stringify` / `JSON.parse` boundary used by `EvalSkipData.priorError`
// in CP11 reversibility (see D.5).
// ---------------------------------------------------------------------------

/**
 * Discriminator union for `ErrorPathway`. The 5 values match the plan
 * contract — one per observable pathway + `'unknown'` fallback.
 */
export type ErrorPathwayKind =
  | 'crash'
  | 'timeout'
  | 'feedbackCap'
  | 'invalidTransition'
  | 'unknown';

/**
 * Process crashed mid-step. State was `error` but no explicit triggering
 * event (timeout, invalid transition, feedback cap) can be attributed.
 *
 * - `stepAtCrash` — last non-`error` step observable in the store (derived
 *   from `state.completedSteps` tail when the event trail is inconclusive).
 * - `lastEventSeqs` — up to 5 most-recent event seqs for operator context.
 * - `heartbeatEventSeq` — seq of the most-recent `session.heartbeat` event,
 *   or `null` when no heartbeat exists. Staleness computation is the
 *   compiler's responsibility (D.2) — the detector is clock-free.
 */
export interface ErrorPathwayCrash {
  readonly kind: 'crash';
  readonly stepAtCrash: string;
  readonly lastEventSeqs: readonly number[];
  readonly heartbeatEventSeq: number | null;
}

/**
 * A step's wall-clock time exceeded its configured timeout and the Stop
 * hook emitted `workflow.step.timeout`.
 *
 * - `timedOutStep` — the step that ran over.
 * - `elapsedMs` / `configuredTimeoutMs` — from the timeout event's data.
 * - `timeoutEventSeq` — the triggering event's seq (for audit trail + CP11
 *   witness).
 * - `inProgressArtifacts` — filenames observed in the step directory at
 *   detection time. May be empty when the detector runs before the step's
 *   filesystem captures any artifact.
 */
export interface ErrorPathwayTimeout {
  readonly kind: 'timeout';
  readonly timedOutStep: string;
  readonly elapsedMs: number;
  readonly configuredTimeoutMs: number;
  readonly timeoutEventSeq: number;
  readonly inProgressArtifacts: readonly string[];
}

/**
 * The evaluation loop exhausted `maxFeedbackRounds` with a trailing
 * `revise` verdict. The reducer transitioned `execution_eval → error` at
 * the cap-fire moment.
 *
 * - `feedbackRound` / `maxFeedbackRounds` — the matching state fields at
 *   detection time.
 * - `verdictHistory` — per-round verdict record for briefing context.
 * - `finalRoundArtifacts` — filenames captured during the last `execution`
 *   pass (the one that produced the trailing `revise` verdict).
 */
export interface ErrorPathwayFeedbackCap {
  readonly kind: 'feedbackCap';
  readonly feedbackRound: number;
  readonly maxFeedbackRounds: number;
  readonly verdictHistory: readonly {
    readonly round: number;
    readonly verdict: 'pass' | 'revise' | 'escalate';
    readonly verdictSeq: number;
    readonly loopTarget: string | null;
    readonly evaluatorId: string | null;
  }[];
  readonly finalRoundArtifacts: readonly string[];
}

/**
 * The reducer rejected an event the engine tried to append. The rejection
 * is persisted as a `workflow.invalid_transition` audit event (D.1
 * `engine.ts` refactor) — this pathway reads from that audit record.
 *
 * - `rejectedEventType` — type string of the event that was rejected.
 * - `rejectedEventSeq` — the AUDIT event's seq. The original rejected event
 *   never landed in the store (it was inside a rolled-back transaction), so
 *   there is no seq for it; the audit-event seq is the available witness.
 * - `stepAtRejection` — the current step when the rejection happened.
 * - `reducerMessage` — human-readable error from the reducer.
 * - `invalidTransitionEventSeq` — same as `rejectedEventSeq`; kept as a
 *   distinct field so downstream tooling can cite the audit record
 *   explicitly without ambiguity.
 */
export interface ErrorPathwayInvalidTransition {
  readonly kind: 'invalidTransition';
  readonly rejectedEventType: string;
  readonly rejectedEventSeq: number | null;
  readonly stepAtRejection: string;
  readonly reducerMessage: string;
  readonly invalidTransitionEventSeq: number;
}

/**
 * Classifier fallback — state is `error` but no triggering evidence is
 * observable in the store.
 *
 * - `reason` — tight enum of the observed degenerate scenarios.
 * - `diagnosticHint` — operator-readable text the compiler can splice into
 *   the prompt. No dynamic content (timestamps, paths) — the hint is a
 *   static string per reason.
 */
export interface ErrorPathwayUnknown {
  readonly kind: 'unknown';
  readonly reason:
    | 'empty-store'
    | 'no-triggering-event'
    | 'ambiguous-signals';
  readonly diagnosticHint: string;
}

/**
 * Discriminated union of all pathway variants. `visitPathway` and the
 * per-variant compilers in `errors.pathway-compilers.ts` dispatch on
 * `kind`. New variants MUST update `ErrorPathwayKind`, this union, and
 * `PathwayVisitor<T>` in lockstep — the mapped type will surface the gap
 * at every call site.
 */
export type ErrorPathway =
  | ErrorPathwayCrash
  | ErrorPathwayTimeout
  | ErrorPathwayFeedbackCap
  | ErrorPathwayInvalidTransition
  | ErrorPathwayUnknown;

// ---------------------------------------------------------------------------
// visitPathway — mapped-type exhaustive dispatcher
//
// The mapped type `PathwayVisitor<T>` structurally requires every pathway
// kind to appear as a key, and each handler's parameter is narrowed to the
// matching variant via `Extract<ErrorPathway, { kind: K }>`. This is the
// codebase's first mapped-type-backed visitor; the `assertNever` default
// keeps it consistent with the reducer pattern (workflow/reducer.ts:38-40).
// ---------------------------------------------------------------------------

/**
 * Mapped-type visitor. Every `ErrorPathwayKind` maps to a handler that
 * receives the narrowed variant. Call sites register handlers as an object
 * literal — missing a key is a `tsc` error.
 */
export type PathwayVisitor<T> = {
  readonly [K in ErrorPathwayKind]: (
    pathway: Extract<ErrorPathway, { kind: K }>,
  ) => T;
};

/**
 * Compile-time exhaustive guard. Identical to the reducer's `assertNever`
 * but local to this module to avoid a cross-module import of a
 * workflow-specific helper into the specs layer.
 */
function assertNever(value: never): never {
  throw new Error(
    `visitPathway: unreachable pathway kind — ${JSON.stringify(value)}`,
  );
}

/**
 * Dispatch on the pathway's `kind`, invoking the matching visitor handler
 * with the narrowed variant.
 *
 * The mapped-type parameter guarantees all 5 handlers are present; the
 * `switch` + `assertNever` default guarantees a new variant added to
 * `ErrorPathway` without a matching `case` is a `tsc` error. Belt-and-
 * braces exhaustiveness.
 *
 * Used by `compileErrorPrompt` (D.3) and `compileResumePrompt` (D.4) —
 * both dispatchers take the same shape with different per-kind handlers.
 */
export function visitPathway<T>(
  pathway: ErrorPathway,
  visitor: PathwayVisitor<T>,
): T {
  switch (pathway.kind) {
    case 'crash':
      return visitor.crash(pathway);
    case 'timeout':
      return visitor.timeout(pathway);
    case 'feedbackCap':
      return visitor.feedbackCap(pathway);
    case 'invalidTransition':
      return visitor.invalidTransition(pathway);
    case 'unknown':
      return visitor.unknown(pathway);
    default:
      return assertNever(pathway);
  }
}

// ---------------------------------------------------------------------------
// Re-exports — flatten the factored module layout for consumer ergonomics
// ---------------------------------------------------------------------------

export { detectPathway } from './errors.pathway-detect.js';
export type { DetectPathwayOptions } from './errors.pathway-detect.js';

// ---------------------------------------------------------------------------
// compileErrorPrompt — typed throw-body; D.3 replaces body
//
// Signature change from PR C: the return type is now `CompiledPrompt`, not
// `never`. D.3 swaps the throw for a real body that runs `detectPathway` +
// `visitPathway` against the five pathway compilers. Callers written against
// this signature compose naturally once D.3 lands.
// ---------------------------------------------------------------------------

/**
 * Compile a prompt for the workflow's `error` step.
 *
 * D.1 wave: typed signature pins the contract; body still throws so that
 * D.2's pathway compilers and D.3's dispatcher wire-up land into a stable
 * public surface without further signature drift.
 *
 * Consumers call this on the `error` branch of `gobbi workflow next`. The
 * return value is a `CompiledPrompt` — same shape every other step emits.
 */
export function compileErrorPrompt(
  _state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  throw new Error(
    'compileErrorPrompt: not implemented — D.3 swaps body to visitPathway dispatcher',
  );
}

/**
 * Compile the "unknown / unclassified" error pathway prompt — the fallback
 * when `detectPathway(state, store)` cannot attribute the error to one of
 * the four observable pathways (Crash, Timeout, FeedbackCap,
 * InvalidTransition).
 *
 * D.1 wave: typed signature only; body still throws. D.2 fills the body
 * alongside the other four pathway compilers. Callers observe no signature
 * change.
 */
export function compileUnknownErrorPrompt(
  _state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  throw new Error(
    'compileUnknownErrorPrompt: not implemented — D.2 populates the pathway compilers',
  );
}

// ---------------------------------------------------------------------------
// compileResumePrompt — conservative standalone form (CP §3.2)
//
// Produces a resume prompt that orients the orchestrator to the recovery
// pathway + target step ONLY. It does NOT inline the target step's full
// prompt — the orchestrator calls `gobbi workflow next` immediately
// afterward to receive the target step's work prompt. This two-invocation
// shape is the user-locked contract from the session briefing: the resume
// frame is orientation; the next prompt is work.
//
// Body shape:
//
//   1. Detect the pathway via `detectPathway(state, store)`.
//   2. Resolve `targetStep` — explicit option wins; otherwise read from
//      the most recent `workflow.resume` event's `data.targetStep` field.
//      If still absent, throw (caller wiring bug).
//   3. Dispatch via `visitPathway` into five resume-specific compilers —
//      each builds a CompiledPrompt whose static block list starts with
//      the shared resume role (first-static cache-prefix anchor), then
//      the pathway preamble; whose session block is the standard session
//      summary; and whose dynamic block is the pathway recap + target-
//      entry framing.
//
// Section layout across every pathway:
//
//   [static] STATIC_ROLE_RESUME_RECOVERY   — shared cache prefix
//   [static] STATIC_RESUME_PREAMBLE_{KIND}  — pathway-specific framing
//   [session] renderSessionSummary(state)   — standard session block
//   [dynamic] renderResume{Kind}Context(p, targetStep)
//                                           — pathway recap + target entry
//
// The shared role anchors a byte-stable first-static hash across ALL 5
// pathways — proved by the cache-stability test in `resume.snap.test.ts`.
// This is the same invariant `compileErrorPrompt` carries via
// `STATIC_ROLE_ERROR_RECOVERY`, but with a resume-specific role string so
// the resume cache bucket is distinct from the error-state cache bucket.
// ---------------------------------------------------------------------------

import {
  buildErrorCompiledPrompt,
  makeStatic,
  makeSession,
  makeDynamic,
  STATIC_ROLE_RESUME_RECOVERY,
  STATIC_RESUME_PREAMBLE_CRASH,
  STATIC_RESUME_PREAMBLE_TIMEOUT,
  STATIC_RESUME_PREAMBLE_FEEDBACK_CAP,
  STATIC_RESUME_PREAMBLE_INVALID,
  STATIC_RESUME_PREAMBLE_UNKNOWN,
  renderResumeCrashContext,
  renderResumeTimeoutContext,
  renderResumeFeedbackCapContext,
  renderResumeInvalidTransitionContext,
  renderResumeUnknownContext,
} from './errors.sections.js';
import { renderSessionSummary } from './assembly.js';
import { detectPathway } from './errors.pathway-detect.js';

// Resume-prompt section IDs — named constants keep snapshot section-summary
// output stable and keep slot-override maps aligned with the IDs actually
// emitted by the dynamic block factories below.
const ID_RESUME_ROLE = 'resume.role';
const ID_RESUME_SESSION = 'session.state';

const ID_RESUME_CRASH_PREAMBLE = 'resume.crash.preamble';
const ID_RESUME_CRASH_RECAP = 'resume.crash.recap';

const ID_RESUME_TIMEOUT_PREAMBLE = 'resume.timeout.preamble';
const ID_RESUME_TIMEOUT_RECAP = 'resume.timeout.recap';

const ID_RESUME_FEEDBACK_CAP_PREAMBLE = 'resume.feedbackCap.preamble';
const ID_RESUME_FEEDBACK_CAP_RECAP = 'resume.feedbackCap.recap';

const ID_RESUME_INVALID_PREAMBLE = 'resume.invalidTransition.preamble';
const ID_RESUME_INVALID_RECAP = 'resume.invalidTransition.recap';

const ID_RESUME_UNKNOWN_PREAMBLE = 'resume.unknown.preamble';
const ID_RESUME_UNKNOWN_RECAP = 'resume.unknown.recap';

/**
 * Derive the resume target step. An explicit `options.targetStep` always
 * wins (the caller just appended a `workflow.resume` event and passed its
 * targetStep down). When absent, read the most recent `workflow.resume`
 * event from the store — this handles the compact-recovery scenario where
 * the orchestrator re-opens mid-resume.
 *
 * Throws when neither source has a targetStep — that would be a caller
 * wiring bug (nothing in the codebase should reach the resume compiler
 * without a resume event or an explicit override).
 */
function resolveResumeTargetStep(
  store: EventStore,
  options: { readonly targetStep?: string | undefined } | undefined,
): string {
  if (options?.targetStep !== undefined) return options.targetStep;
  const rows = store.lastN('workflow.resume', 1);
  const last = rows[0];
  if (last !== undefined) {
    // EventRow.data is a JSON string; parse to extract targetStep. The
    // event's schema is stable (workflow.ts::ResumeData) — the migration
    // pipeline applies to read-time reducers, not here, but the shape for
    // `targetStep` is identity across every schema version.
    try {
      const parsed = JSON.parse(last.data) as { readonly targetStep?: unknown };
      if (typeof parsed.targetStep === 'string' && parsed.targetStep.length > 0) {
        return parsed.targetStep;
      }
    } catch {
      // fall through to the throw below
    }
  }
  throw new Error(
    'compileResumePrompt: targetStep missing — supply options.targetStep or append a workflow.resume event before compiling',
  );
}

/**
 * Compile the resume prompt for a workflow that entered the error step.
 *
 * **Conservative standalone form (CP §3.2).** The returned prompt recaps
 * the pathway and names the target step — it does NOT inline the target
 * step's work prompt. The orchestrator is expected to run
 * `gobbi workflow next` immediately after emitting this prompt to receive
 * the target step's content. This two-invocation shape keeps the resume
 * surface free of the target-step spec-loading machinery that lives in
 * `specs/assembly.ts::compile()`.
 *
 * @param state Current workflow state — must have `currentStep === 'error'`.
 * @param store Event store — used by `detectPathway` and for target-step
 *              fallback resolution when `options.targetStep` is absent.
 * @param options Optional overrides. `targetStep` is the target of the
 *              transition; when absent, the compiler reads the most recent
 *              `workflow.resume` event's `data.targetStep` field. If
 *              neither source has a targetStep, compilation throws.
 */
export function compileResumePrompt(
  state: WorkflowState,
  store: EventStore,
  options?: { readonly targetStep?: string | undefined },
): CompiledPrompt {
  const pathway = detectPathway(state, store);
  const targetStep = resolveResumeTargetStep(store, options);
  const sessionBlock = makeSession({
    id: ID_RESUME_SESSION,
    content: renderSessionSummary(state),
  });

  return visitPathway(pathway, {
    crash: (p) =>
      buildErrorCompiledPrompt({
        staticBlocks: [
          makeStatic({ id: ID_RESUME_ROLE, content: STATIC_ROLE_RESUME_RECOVERY }),
          makeStatic({
            id: ID_RESUME_CRASH_PREAMBLE,
            content: STATIC_RESUME_PREAMBLE_CRASH,
          }),
        ],
        sessionBlock,
        dynamicBlocks: [
          makeDynamic({
            id: ID_RESUME_CRASH_RECAP,
            content: renderResumeCrashContext(p, targetStep),
          }),
        ],
      }),
    timeout: (p) =>
      buildErrorCompiledPrompt({
        staticBlocks: [
          makeStatic({ id: ID_RESUME_ROLE, content: STATIC_ROLE_RESUME_RECOVERY }),
          makeStatic({
            id: ID_RESUME_TIMEOUT_PREAMBLE,
            content: STATIC_RESUME_PREAMBLE_TIMEOUT,
          }),
        ],
        sessionBlock,
        dynamicBlocks: [
          makeDynamic({
            id: ID_RESUME_TIMEOUT_RECAP,
            content: renderResumeTimeoutContext(p, targetStep),
          }),
        ],
      }),
    feedbackCap: (p) =>
      buildErrorCompiledPrompt({
        staticBlocks: [
          makeStatic({ id: ID_RESUME_ROLE, content: STATIC_ROLE_RESUME_RECOVERY }),
          makeStatic({
            id: ID_RESUME_FEEDBACK_CAP_PREAMBLE,
            content: STATIC_RESUME_PREAMBLE_FEEDBACK_CAP,
          }),
        ],
        sessionBlock,
        dynamicBlocks: [
          makeDynamic({
            id: ID_RESUME_FEEDBACK_CAP_RECAP,
            content: renderResumeFeedbackCapContext(p, targetStep),
          }),
        ],
      }),
    invalidTransition: (p) =>
      buildErrorCompiledPrompt({
        staticBlocks: [
          makeStatic({ id: ID_RESUME_ROLE, content: STATIC_ROLE_RESUME_RECOVERY }),
          makeStatic({
            id: ID_RESUME_INVALID_PREAMBLE,
            content: STATIC_RESUME_PREAMBLE_INVALID,
          }),
        ],
        sessionBlock,
        dynamicBlocks: [
          makeDynamic({
            id: ID_RESUME_INVALID_RECAP,
            content: renderResumeInvalidTransitionContext(p, targetStep),
          }),
        ],
      }),
    unknown: (p) =>
      buildErrorCompiledPrompt({
        staticBlocks: [
          makeStatic({ id: ID_RESUME_ROLE, content: STATIC_ROLE_RESUME_RECOVERY }),
          makeStatic({
            id: ID_RESUME_UNKNOWN_PREAMBLE,
            content: STATIC_RESUME_PREAMBLE_UNKNOWN,
          }),
        ],
        sessionBlock,
        dynamicBlocks: [
          makeDynamic({
            id: ID_RESUME_UNKNOWN_RECAP,
            content: renderResumeUnknownContext(p, targetStep),
          }),
        ],
      }),
  });
}
