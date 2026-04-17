/**
 * Per-pathway error-state prompt compilers.
 *
 * Each exported compiler takes the narrowed `ErrorPathway*` variant plus the
 * workflow state + event store, and returns a `CompiledPrompt` built via
 * `buildErrorCompiledPrompt`. `visitPathway` (see `errors.ts`) narrows the
 * pathway at the call site via the mapped-type visitor, so compilers never
 * re-discriminate internally.
 *
 * Every compiler assembles the same section layout:
 *
 *   1. Shared static role block  — `STATIC_ROLE_ERROR_RECOVERY`.
 *   2. Pathway-specific static preamble — `STATIC_PREAMBLE_*`.
 *   3. Session block              — `renderSessionSummary(state)`.
 *   4. Pathway-specific evidence dynamic block.
 *   5. Pathway-specific recovery-options dynamic block.
 *
 * The shared role block is the FIRST static section across all 5 compilers.
 * That placement anchors a shared cache prefix: every error-state prompt has
 * an identical first-static `contentHash`, which is what lets Anthropic's
 * prefix cache hit across pathway switches. The cross-pathway invariant test
 * in `errors.snap.test.ts` locks this property.
 */

import type { WorkflowState } from '../workflow/state.js';
import type { EventStore } from '../workflow/store.js';
import type { CompiledPrompt } from './types.js';
import type {
  ErrorPathwayCrash,
  ErrorPathwayTimeout,
  ErrorPathwayFeedbackCap,
  ErrorPathwayInvalidTransition,
  ErrorPathwayUnknown,
} from './errors.js';
import { renderSessionSummary } from './assembly.js';
import {
  buildErrorCompiledPrompt,
  makeStatic,
  makeSession,
  makeDynamic,
  STATIC_ROLE_ERROR_RECOVERY,
  STATIC_PREAMBLE_CRASH,
  STATIC_PREAMBLE_TIMEOUT,
  STATIC_PREAMBLE_FEEDBACK_CAP,
  STATIC_PREAMBLE_INVALID,
  STATIC_PREAMBLE_UNKNOWN,
  renderCrashEvidence,
  renderCrashRecoveryOptions,
  renderTimeoutEvidence,
  renderTimeoutRecoveryOptions,
  renderFeedbackCapEvidence,
  renderFeedbackCapRecoveryOptions,
  renderInvalidTransitionEvidence,
  renderInvalidTransitionRecoveryOptions,
  renderUnknownEvidence,
  renderUnknownRecoveryOptions,
} from './errors.sections.js';

// ---------------------------------------------------------------------------
// Per-compiler section IDs. Named constants keep the snapshot-test section
// summaries stable and keep the `slotOverrides` map in the compilers aligned
// with what `buildErrorCompiledPrompt` actually produces.
// ---------------------------------------------------------------------------

const ID_ROLE = 'error.role';
const ID_SESSION = 'session.state';

const ID_CRASH_PREAMBLE = 'error.crash.preamble';
const ID_CRASH_EVIDENCE = 'error.crash.evidence';
const ID_CRASH_RECOVERY = 'error.crash.recovery';

const ID_TIMEOUT_PREAMBLE = 'error.timeout.preamble';
const ID_TIMEOUT_EVIDENCE = 'error.timeout.evidence';
const ID_TIMEOUT_RECOVERY = 'error.timeout.recovery';

const ID_FEEDBACK_CAP_PREAMBLE = 'error.feedbackCap.preamble';
const ID_FEEDBACK_CAP_EVIDENCE = 'error.feedbackCap.evidence';
const ID_FEEDBACK_CAP_RECOVERY = 'error.feedbackCap.recovery';

const ID_INVALID_PREAMBLE = 'error.invalidTransition.preamble';
const ID_INVALID_EVIDENCE = 'error.invalidTransition.evidence';
const ID_INVALID_RECOVERY = 'error.invalidTransition.recovery';

const ID_UNKNOWN_PREAMBLE = 'error.unknown.preamble';
const ID_UNKNOWN_EVIDENCE = 'error.unknown.evidence';
const ID_UNKNOWN_RECOVERY = 'error.unknown.recovery';

/**
 * Recovery-options dynamic block should ride the `materials` slot — it is
 * operator-facing recovery copy rather than pathway artifact evidence. The
 * evidence block stays on the default `artifacts` slot. L4 (explicit slot
 * tagging) — the error.* IDs are not covered by `inferSlot`, so every
 * dynamic block must be routed deliberately.
 */
function recoverySlotOverride(recoveryId: string): Readonly<Record<string, 'materials'>> {
  return { [recoveryId]: 'materials' };
}

// ---------------------------------------------------------------------------
// Crash compiler
// ---------------------------------------------------------------------------

/**
 * Compile a Crash-pathway prompt.
 *
 * Section layout: role → crash preamble → session → crash evidence →
 * crash recovery options.
 */
export function compileCrashPrompt(
  pathway: ErrorPathwayCrash,
  state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  const staticBlocks = [
    makeStatic({ id: ID_ROLE, content: STATIC_ROLE_ERROR_RECOVERY }),
    makeStatic({ id: ID_CRASH_PREAMBLE, content: STATIC_PREAMBLE_CRASH }),
  ];
  const sessionBlock = makeSession({
    id: ID_SESSION,
    content: renderSessionSummary(state),
  });
  const dynamicBlocks = [
    makeDynamic({
      id: ID_CRASH_EVIDENCE,
      content: renderCrashEvidence(pathway),
    }),
    makeDynamic({
      id: ID_CRASH_RECOVERY,
      content: renderCrashRecoveryOptions(pathway),
    }),
  ];
  return buildErrorCompiledPrompt({
    staticBlocks,
    sessionBlock,
    dynamicBlocks,
    slotOverrides: recoverySlotOverride(ID_CRASH_RECOVERY),
  });
}

// ---------------------------------------------------------------------------
// Timeout compiler
// ---------------------------------------------------------------------------

/**
 * Compile a Timeout-pathway prompt.
 *
 * Section layout: role → timeout preamble → session → timeout evidence →
 * timeout recovery options.
 */
export function compileTimeoutPrompt(
  pathway: ErrorPathwayTimeout,
  state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  const staticBlocks = [
    makeStatic({ id: ID_ROLE, content: STATIC_ROLE_ERROR_RECOVERY }),
    makeStatic({ id: ID_TIMEOUT_PREAMBLE, content: STATIC_PREAMBLE_TIMEOUT }),
  ];
  const sessionBlock = makeSession({
    id: ID_SESSION,
    content: renderSessionSummary(state),
  });
  const dynamicBlocks = [
    makeDynamic({
      id: ID_TIMEOUT_EVIDENCE,
      content: renderTimeoutEvidence(pathway),
    }),
    makeDynamic({
      id: ID_TIMEOUT_RECOVERY,
      content: renderTimeoutRecoveryOptions(pathway),
    }),
  ];
  return buildErrorCompiledPrompt({
    staticBlocks,
    sessionBlock,
    dynamicBlocks,
    slotOverrides: recoverySlotOverride(ID_TIMEOUT_RECOVERY),
  });
}

// ---------------------------------------------------------------------------
// FeedbackCap compiler
// ---------------------------------------------------------------------------

/**
 * Compile a FeedbackCap-pathway prompt.
 *
 * Section layout: role → feedbackCap preamble → session → feedbackCap
 * evidence → feedbackCap recovery options.
 */
export function compileFeedbackCapPrompt(
  pathway: ErrorPathwayFeedbackCap,
  state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  const staticBlocks = [
    makeStatic({ id: ID_ROLE, content: STATIC_ROLE_ERROR_RECOVERY }),
    makeStatic({
      id: ID_FEEDBACK_CAP_PREAMBLE,
      content: STATIC_PREAMBLE_FEEDBACK_CAP,
    }),
  ];
  const sessionBlock = makeSession({
    id: ID_SESSION,
    content: renderSessionSummary(state),
  });
  const dynamicBlocks = [
    makeDynamic({
      id: ID_FEEDBACK_CAP_EVIDENCE,
      content: renderFeedbackCapEvidence(pathway),
    }),
    makeDynamic({
      id: ID_FEEDBACK_CAP_RECOVERY,
      content: renderFeedbackCapRecoveryOptions(pathway),
    }),
  ];
  return buildErrorCompiledPrompt({
    staticBlocks,
    sessionBlock,
    dynamicBlocks,
    slotOverrides: recoverySlotOverride(ID_FEEDBACK_CAP_RECOVERY),
  });
}

// ---------------------------------------------------------------------------
// InvalidTransition compiler
// ---------------------------------------------------------------------------

/**
 * Compile an InvalidTransition-pathway prompt.
 *
 * Section layout: role → invalidTransition preamble → session →
 * invalidTransition evidence → invalidTransition recovery options.
 */
export function compileInvalidTransitionPrompt(
  pathway: ErrorPathwayInvalidTransition,
  state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  const staticBlocks = [
    makeStatic({ id: ID_ROLE, content: STATIC_ROLE_ERROR_RECOVERY }),
    makeStatic({ id: ID_INVALID_PREAMBLE, content: STATIC_PREAMBLE_INVALID }),
  ];
  const sessionBlock = makeSession({
    id: ID_SESSION,
    content: renderSessionSummary(state),
  });
  const dynamicBlocks = [
    makeDynamic({
      id: ID_INVALID_EVIDENCE,
      content: renderInvalidTransitionEvidence(pathway),
    }),
    makeDynamic({
      id: ID_INVALID_RECOVERY,
      content: renderInvalidTransitionRecoveryOptions(pathway),
    }),
  ];
  return buildErrorCompiledPrompt({
    staticBlocks,
    sessionBlock,
    dynamicBlocks,
    slotOverrides: recoverySlotOverride(ID_INVALID_RECOVERY),
  });
}

// ---------------------------------------------------------------------------
// Unknown compiler — classifier fallback
// ---------------------------------------------------------------------------

/**
 * Compile an Unknown-pathway prompt.
 *
 * Section layout: role → unknown preamble → session → unknown evidence
 * (diagnosticHint) → unknown recovery options. The unknown evidence block
 * carries the detector's `diagnosticHint` so the operator can read the
 * classifier's pathway attempt even when no pathway was chosen.
 */
export function compileUnknownPrompt(
  pathway: ErrorPathwayUnknown,
  state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  const staticBlocks = [
    makeStatic({ id: ID_ROLE, content: STATIC_ROLE_ERROR_RECOVERY }),
    makeStatic({ id: ID_UNKNOWN_PREAMBLE, content: STATIC_PREAMBLE_UNKNOWN }),
  ];
  const sessionBlock = makeSession({
    id: ID_SESSION,
    content: renderSessionSummary(state),
  });
  const dynamicBlocks = [
    makeDynamic({
      id: ID_UNKNOWN_EVIDENCE,
      content: renderUnknownEvidence(pathway),
    }),
    makeDynamic({
      id: ID_UNKNOWN_RECOVERY,
      content: renderUnknownRecoveryOptions(pathway),
    }),
  ];
  return buildErrorCompiledPrompt({
    staticBlocks,
    sessionBlock,
    dynamicBlocks,
    slotOverrides: recoverySlotOverride(ID_UNKNOWN_RECOVERY),
  });
}
