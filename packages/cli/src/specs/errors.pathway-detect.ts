/**
 * `detectPathway(state, store, options?)` — classify an error-state session
 * into one of the five `ErrorPathway` variants.
 *
 * Pure, deterministic, clock-injectable. All wall-clock reads are pushed to
 * the caller via the optional `options.now` injection — tests supply a fixed
 * clock, the production call site defaults to `Date.now`.
 *
 * ## Algorithm (research §Area 3, plan §D.1.2)
 *
 * Pre-condition: `state.currentStep === 'error'`. Calling from any other
 * step throws — the detector is only meaningful from the error step.
 *
 * Priority probes (first match wins, all scoped to "newer than most recent
 * `workflow.resume`"):
 *
 *   1. **Timeout** — a `workflow.step.timeout` event whose seq is newer than
 *      the most recent `workflow.resume` (if any) → Timeout pathway.
 *   2. **InvalidTransition** — a `workflow.invalid_transition` audit event
 *      newer than the most recent `workflow.resume` → InvalidTransition
 *      pathway. The rejected event itself never landed (rolled-back
 *      transaction); the audit record is the witness.
 *   3. **FeedbackCap** — `state.feedbackRound >= state.maxFeedbackRounds`
 *      AND most-recent `decision.eval.verdict` newer than the most recent
 *      `workflow.resume` AND that verdict is `'revise'` → FeedbackCap
 *      pathway.
 *   4. **Crash** — state is `error` with observable events in the store but
 *      none of the above fired → Crash pathway.
 *   5. **Unknown** — degenerate case. Empty store OR all observable evidence
 *      predates the most recent resume AND no cap is in effect.
 *
 * ## Query budget
 *
 * At most 7 indexed store queries per call (including the `eventCount()`
 * prepared statement). `store.replayAll()` is NEVER invoked.
 *
 * ## Purity
 *
 * No `new Date()` calls. `options.now` (default: `() => Date.now()`) is the
 * only wall-clock seam. The detector's output depends only on the (state,
 * store) pair — two calls on the same inputs return structurally equal
 * pathways.
 *
 * @see `.claude/project/gobbi/design/v050-session.md` §Resume Briefing with Pathway Differentiation
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import type { WorkflowState } from '../workflow/state.js';
import type { ReadStore } from '../workflow/store.js';
import { WORKFLOW_EVENTS } from '../workflow/events/workflow.js';
import { DECISION_EVENTS } from '../workflow/events/decision.js';
import { SESSION_EVENTS } from '../workflow/events/session.js';
import type { EventRow } from '../workflow/store.js';

import type {
  ErrorPathway,
  ErrorPathwayCrash,
  ErrorPathwayTimeout,
  ErrorPathwayFeedbackCap,
  ErrorPathwayInvalidTransition,
  ErrorPathwayUnknown,
} from './errors.js';

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

/**
 * Optional detector knobs. `now` is the clock seam; `sessionDir` is the
 * filesystem root used to enumerate in-progress artifacts for the Timeout
 * pathway (not required for the other variants).
 */
export interface DetectPathwayOptions {
  /**
   * Wall-clock seam. Defaults to `() => Date.now()`. Tests inject a fixed
   * clock to assert determinism across runs.
   */
  readonly now?: () => number;

  /**
   * Session directory root. When provided and the detector classifies
   * Timeout, it reads `sessionDir/{timedOutStep}/` for artifact filenames.
   * When omitted (or the directory is absent / unreadable), the pathway
   * carries an empty `inProgressArtifacts` array.
   */
  readonly sessionDir?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface ParsedTimeout {
  readonly step: string;
  readonly elapsedMs: number;
  readonly configuredTimeoutMs: number;
}

function parseTimeoutData(row: EventRow): ParsedTimeout | null {
  try {
    const parsed: unknown = JSON.parse(row.data);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const step = (parsed as { step?: unknown }).step;
    const elapsedMs = (parsed as { elapsedMs?: unknown }).elapsedMs;
    const configuredTimeoutMs = (parsed as { configuredTimeoutMs?: unknown })
      .configuredTimeoutMs;
    if (
      typeof step !== 'string' ||
      typeof elapsedMs !== 'number' ||
      typeof configuredTimeoutMs !== 'number'
    ) {
      return null;
    }
    return { step, elapsedMs, configuredTimeoutMs };
  } catch {
    return null;
  }
}

interface ParsedInvalidTransition {
  readonly rejectedEventType: string;
  readonly rejectedEventSeq: number | null;
  readonly stepAtRejection: string;
  readonly reducerMessage: string;
}

function parseInvalidTransitionData(
  row: EventRow,
): ParsedInvalidTransition | null {
  try {
    const parsed: unknown = JSON.parse(row.data);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const p = parsed as Record<string, unknown>;
    const rejectedEventType = p['rejectedEventType'];
    const stepAtRejection = p['stepAtRejection'];
    const reducerMessage = p['reducerMessage'];
    const rejectedEventSeqRaw = p['rejectedEventSeq'];
    if (
      typeof rejectedEventType !== 'string' ||
      typeof stepAtRejection !== 'string' ||
      typeof reducerMessage !== 'string'
    ) {
      return null;
    }
    const rejectedEventSeq =
      typeof rejectedEventSeqRaw === 'number'
        ? rejectedEventSeqRaw
        : null;
    return {
      rejectedEventType,
      rejectedEventSeq,
      stepAtRejection,
      reducerMessage,
    };
  } catch {
    return null;
  }
}

interface ParsedVerdict {
  readonly verdict: 'pass' | 'revise' | 'escalate';
  readonly loopTarget: string | null;
  readonly evaluatorId: string | null;
}

function parseVerdictData(row: EventRow): ParsedVerdict | null {
  try {
    const parsed: unknown = JSON.parse(row.data);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const p = parsed as Record<string, unknown>;
    const verdict = p['verdict'];
    if (verdict !== 'pass' && verdict !== 'revise' && verdict !== 'escalate') {
      return null;
    }
    const loopTargetRaw = p['loopTarget'];
    const evaluatorIdRaw = p['evaluatorId'];
    return {
      verdict,
      loopTarget: typeof loopTargetRaw === 'string' ? loopTargetRaw : null,
      evaluatorId: typeof evaluatorIdRaw === 'string' ? evaluatorIdRaw : null,
    };
  } catch {
    return null;
  }
}

/**
 * List filenames under a step's artifact directory. Returns an empty array
 * when the directory is absent, unreadable, or `sessionDir` was not
 * provided.
 */
function readArtifactFilenames(
  sessionDir: string | undefined,
  step: string,
): readonly string[] {
  if (sessionDir === undefined) return [];
  const dir = join(sessionDir, step);
  if (!existsSync(dir)) return [];
  try {
    const entries = readdirSync(dir);
    const files: string[] = [];
    for (const name of entries) {
      try {
        const stat = statSync(join(dir, name));
        if (stat.isFile()) files.push(name);
      } catch {
        // Skip entries we cannot stat (permissions, race).
      }
    }
    return files;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Classify an error-state session into one of the 5 `ErrorPathway`
 * variants. See module docblock for the algorithm.
 *
 * @throws if `state.currentStep !== 'error'` — detector pre-condition.
 */
export function detectPathway(
  state: WorkflowState,
  store: ReadStore,
  options?: DetectPathwayOptions,
): ErrorPathway {
  if (state.currentStep !== 'error') {
    throw new Error(
      `detectPathway: pre-condition failed — state.currentStep must be 'error', got '${state.currentStep}'`,
    );
  }

  // Query 1: last workflow.resume (used as the burial boundary for every
  // subsequent probe). Seq 0 is "no resume has ever fired" — any evidence
  // with seq > 0 is considered current.
  const lastResume = store.last(WORKFLOW_EVENTS.RESUME);
  const resumeBoundary = lastResume?.seq ?? 0;

  // Query 2: last workflow.step.timeout.
  const lastTimeout = store.last(WORKFLOW_EVENTS.STEP_TIMEOUT);
  if (lastTimeout !== null && lastTimeout.seq > resumeBoundary) {
    const parsed = parseTimeoutData(lastTimeout);
    if (parsed !== null) {
      const pathway: ErrorPathwayTimeout = {
        kind: 'timeout',
        timedOutStep: parsed.step,
        elapsedMs: parsed.elapsedMs,
        configuredTimeoutMs: parsed.configuredTimeoutMs,
        timeoutEventSeq: lastTimeout.seq,
        inProgressArtifacts: readArtifactFilenames(
          options?.sessionDir,
          parsed.step,
        ),
      };
      return pathway;
    }
    // Malformed timeout payload — fall through to the next probe.
  }

  // Query 3: last workflow.invalid_transition.
  const lastInvalid = store.last(WORKFLOW_EVENTS.INVALID_TRANSITION);
  if (lastInvalid !== null && lastInvalid.seq > resumeBoundary) {
    const parsed = parseInvalidTransitionData(lastInvalid);
    if (parsed !== null) {
      const pathway: ErrorPathwayInvalidTransition = {
        kind: 'invalidTransition',
        rejectedEventType: parsed.rejectedEventType,
        rejectedEventSeq: parsed.rejectedEventSeq,
        stepAtRejection: parsed.stepAtRejection,
        reducerMessage: parsed.reducerMessage,
        invalidTransitionEventSeq: lastInvalid.seq,
      };
      return pathway;
    }
    // Malformed audit payload — fall through.
  }

  // FeedbackCap probe — state-driven, with an event-trail confirmation.
  if (
    state.feedbackRound >= state.maxFeedbackRounds &&
    state.lastVerdictOutcome === 'revise'
  ) {
    // Query 4: last decision.eval.verdict.
    const lastVerdict = store.last(DECISION_EVENTS.EVAL_VERDICT);
    if (lastVerdict !== null && lastVerdict.seq > resumeBoundary) {
      const parsed = parseVerdictData(lastVerdict);
      if (parsed !== null && parsed.verdict === 'revise') {
        // Query 5: full verdict history since the last boundary (start or
        // resume). Cheap in practice — the number of verdict events is
        // O(rounds).
        const allVerdicts = store.byType(DECISION_EVENTS.EVAL_VERDICT);
        const lastStart = store.last(WORKFLOW_EVENTS.START);
        const boundaryStart = lastStart?.seq ?? 0;
        const windowBoundary = Math.max(boundaryStart, resumeBoundary);
        const windowVerdicts = allVerdicts.filter(
          (v) => v.seq > windowBoundary,
        );
        const history = buildVerdictHistory(windowVerdicts);
        const pathway: ErrorPathwayFeedbackCap = {
          kind: 'feedbackCap',
          feedbackRound: state.feedbackRound,
          maxFeedbackRounds: state.maxFeedbackRounds,
          verdictHistory: history,
          finalRoundArtifacts: readArtifactFilenames(
            options?.sessionDir,
            'execution',
          ),
        };
        return pathway;
      }
    }
  }

  // Crash vs Unknown — depends on whether the store has ANY events.
  const count = store.eventCount();
  if (count === 0) {
    const pathway: ErrorPathwayUnknown = {
      kind: 'unknown',
      reason: 'empty-store',
      diagnosticHint:
        'The event store is empty — state.json appears to have been manually written into the error step without any triggering event.',
    };
    return pathway;
  }

  // Crash: derive a `stepAtCrash` hint from completed steps when no single
  // event trail points at a triggering step.
  const stepAtCrash =
    state.completedSteps.length > 0
      ? (state.completedSteps[state.completedSteps.length - 1] ??
        'unknown')
      : 'idle';

  // Query 6: 5 most-recent events (any type) for operator context.
  const lastEvents = store.lastNAny(5);
  const lastEventSeqs = lastEvents.map((e) => e.seq);

  // Query 7: last session.heartbeat for staleness signalling (compiler uses
  // `now()` to render staleness; detector stays clock-free).
  const lastHeartbeat = store.last(SESSION_EVENTS.HEARTBEAT);
  const heartbeatEventSeq = lastHeartbeat?.seq ?? null;

  // Exceptional fallthrough: the store has events but none satisfied any
  // pathway-specific probe AND the `lastEventSeqs` list is empty. In
  // practice impossible (count > 0 guarantees lastNAny returns entries),
  // but defended here so the detector cannot return a Crash with zero
  // witness seqs.
  if (lastEventSeqs.length === 0) {
    const pathway: ErrorPathwayUnknown = {
      kind: 'unknown',
      reason: 'ambiguous-signals',
      diagnosticHint:
        'The event store reports a non-zero count but no events were observable at detection time — likely a store-read race.',
    };
    return pathway;
  }

  const crash: ErrorPathwayCrash = {
    kind: 'crash',
    stepAtCrash,
    lastEventSeqs,
    heartbeatEventSeq,
  };
  return crash;
}

/**
 * Construct the verdict-history projection for the FeedbackCap pathway.
 *
 * The round assignment is derived from the position of `'revise'` verdicts
 * in the window — each revise verdict (inclusive) contributes one round.
 * A `'pass'` or `'escalate'` verdict does not advance the round counter.
 *
 * Keeps the derivation deterministic and local to the detector; compilers
 * consume the projection without re-reading the store.
 */
function buildVerdictHistory(
  windowVerdicts: readonly EventRow[],
): readonly ErrorPathwayFeedbackCap['verdictHistory'][number][] {
  const history: ErrorPathwayFeedbackCap['verdictHistory'][number][] = [];
  let round = 0;
  for (const row of windowVerdicts) {
    const parsed = parseVerdictData(row);
    if (parsed === null) continue;
    if (parsed.verdict === 'revise') round += 1;
    history.push({
      round: parsed.verdict === 'revise' ? round : round + 1,
      verdict: parsed.verdict,
      verdictSeq: row.seq,
      loopTarget: parsed.loopTarget,
      evaluatorId: parsed.evaluatorId,
    });
  }
  return history;
}
