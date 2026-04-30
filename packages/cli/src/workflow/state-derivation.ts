/**
 * Workflow state types, initial state factory, and event-derived state.
 *
 * Defines the WorkflowState interface, step/substate types, evaluation
 * configuration, active subagent tracking, and guard violation records.
 * State is immutable — all fields use readonly modifiers.
 *
 * Per PR-FIN-2a-ii (T-2a.9.unified) the per-session `state.json`
 * projection (and its `state.json.backup` companion) was retired in
 * favour of pure event-derived state via `deriveState`. This module
 * therefore exposes types, the initial-state factory, the runtime
 * shape guard, and the EventRow → WorkflowState replay path —
 * filesystem persistence helpers no longer live here. PR-FIN-2a-iii
 * removed the orphaned `writeState` / `readState` / `backupState` /
 * `restoreBackup` / `restoreStateFromBackup` / `resolveState` /
 * `normaliseToLatestSchema` exports + the private `normaliseReadState`
 * helper that the four read paths shared.
 *
 * This module does NOT import from reducer.ts — `deriveState` accepts
 * a reduce function as a parameter to avoid circular dependencies.
 * engine.ts is the module that bridges state-derivation.ts and reducer.ts.
 */

import { isRecord, isString, isNumber, isBoolean, isArray } from '../lib/guards.js';
import type { ResolvedSettings } from '../lib/settings.js';
import { isValidEventType } from './events/index.js';
import type { Event } from './events/index.js';
import type { VerificationResultData } from './events/verification.js';
import { migrateEvent } from './migrations.js';
import type { EventRow } from './migrations.js';

// ---------------------------------------------------------------------------
// Workflow step type — 11 discrete states
// ---------------------------------------------------------------------------

export type WorkflowStep =
  | 'idle'
  | 'ideation'
  | 'ideation_eval'
  | 'planning'
  | 'planning_eval'
  | 'execution'
  | 'execution_eval'
  | 'memorization'
  | 'memorization_eval'
  | 'handoff'
  | 'done'
  | 'error';

/**
 * Steps that represent active workflow execution (not terminal or pre-start).
 * Used for timeout and skip applicability checks.
 *
 * Includes `handoff` per Wave A.1.5 — the narrow cover-sheet step that
 * follows memorization. `handoff` is productive (not terminal at the spec
 * level the way `done` is at runtime) so it participates in the same
 * timeout / skip lifecycle as the other productive steps.
 */
export const ACTIVE_STEPS: ReadonlySet<WorkflowStep> = new Set<WorkflowStep>([
  'ideation',
  'ideation_eval',
  'planning',
  'planning_eval',
  'execution',
  'execution_eval',
  'memorization',
  'memorization_eval',
  'handoff',
]);

/**
 * Type guard: checks whether a string is an active WorkflowStep.
 * Narrows the type from string to WorkflowStep at the call site.
 */
export function isActiveStep(value: string): value is WorkflowStep {
  return (ACTIVE_STEPS as ReadonlySet<string>).has(value);
}

/**
 * Terminal steps that accept no further events.
 */
export const TERMINAL_STEPS: ReadonlySet<WorkflowStep> = new Set<WorkflowStep>([
  'done',
]);

// ---------------------------------------------------------------------------
// Ideation substate — tracks discussion vs research within ideation step
// ---------------------------------------------------------------------------

export type IdeationSubstate = 'discussing' | 'researching' | null;

// ---------------------------------------------------------------------------
// Evaluation configuration — decided once at workflow start
// ---------------------------------------------------------------------------

export interface EvalConfig {
  readonly ideation: boolean;
  readonly planning: boolean;
  /**
   * Execution-eval gate. Optional for backward-compat — prior to Wave C.2
   * the EVAL_DECIDE payload carried only `{ideation, planning}` (the field
   * was originally named `plan`; see the Wave-4 rename history in
   * `v050-features/gobbi-memory`), and on-disk state files written under
   * those semantics have no `execution` key.
   * Under `exactOptionalPropertyTypes`, absence means "field not set" (the
   * reducer never wrote one); presence means the EVAL_DECIDE payload
   * carried an explicit boolean. The `execution_eval` step is still
   * unconditionally reached via the graph — this slot is observational
   * today and will gate the step in a follow-up Pass.
   */
  readonly execution?: boolean;
  /**
   * Memorization-eval gate (PR-FIN-2a-i T-2a.7). Optional for
   * backward-compat — pre-T-2a.7 EVAL_DECIDE payloads carry no
   * `memorization` field, and on-disk state files written under those
   * semantics have no `memorization` key.
   *
   * Under `exactOptionalPropertyTypes`, absence means "field not set";
   * presence means the EVAL_DECIDE payload carried an explicit boolean.
   * Read by the `evalMemorizationEnabled` / `evalMemorizationDisabled`
   * predicates that gate the `memorization → memorization_eval` graph
   * transition.
   */
  readonly memorization?: boolean;
}

// ---------------------------------------------------------------------------
// Active subagent tracking
// ---------------------------------------------------------------------------

export interface ActiveSubagent {
  readonly subagentId: string;
  readonly agentType: string;
  readonly step: string;
  readonly spawnedAt: string;
}

// ---------------------------------------------------------------------------
// Guard violation record — persisted in state for audit trail
// ---------------------------------------------------------------------------

/**
 * One persisted guard record. Both `guard.violation` (error) and `guard.warn`
 * (warning) events append records here; the `severity` field discriminates
 * them. `severity` is optional for v1 event-payload backward-compat —
 * pre-schema-v2 events never carried it; the v1→v2 migration in
 * `migrations.ts` defaults absent severity to `'error'`.
 */
export interface GuardViolationRecord {
  readonly guardId: string;
  readonly toolName: string;
  readonly reason: string;
  readonly step: string;
  readonly timestamp: string;
  readonly severity?: 'error' | 'warning';
}

// ---------------------------------------------------------------------------
// Workflow state — the complete snapshot at any point in time
// ---------------------------------------------------------------------------

export interface WorkflowState {
  readonly schemaVersion: number;
  readonly sessionId: string;
  readonly currentStep: WorkflowStep;
  readonly currentSubstate: IdeationSubstate;
  readonly completedSteps: readonly string[];
  readonly evalConfig: EvalConfig | null;
  readonly activeSubagents: readonly ActiveSubagent[];
  readonly artifacts: Readonly<Record<string, readonly string[]>>;
  readonly violations: readonly GuardViolationRecord[];
  readonly feedbackRound: number;
  readonly maxFeedbackRounds: number;
  /**
   * The verdict that most recently fired an `EVAL_VERDICT` event, or `null`
   * when no verdict has fired in the current productive step. `escalate`
   * verdicts are informational and do not overwrite this field — they leave
   * the prior outcome in place. Cleared to `null` on `workflow.step.exit`
   * from a productive step.
   *
   * Consumed by `verdictPass` / `verdictRevise` predicates (schema v2+).
   */
  readonly lastVerdictOutcome: 'pass' | 'revise' | null;

  // E.2 ZONE: verificationResults field insertion (per L3)
  /**
   * Per-subagent verification outcomes keyed by
   * `${subagentId}:${commandKind}` — the composite form locked in L3 that
   * (a) gives O(1) lookup to the E.8 verification-block compiler and
   * (b) round-trips cleanly through `JSON.stringify` / `JSON.parse` at the
   * state-persistence boundary. `commandKind` is the normalised
   * `VerificationCommandKind` string ("lint" | "test" | ...), so keys take
   * the form `"sub-123:typecheck"`. Populated by E.3's `reduceVerification`
   * sub-reducer; read by E.8's verification-block dynamic section.
   *
   * Empty record on a fresh state. Added by PR E (schema v4).
   */
  readonly verificationResults: Readonly<Record<string, VerificationResultData>>;

  // E.10 ZONE: stepStartedAt field insertion
  /**
   * ISO-8601 timestamp of the current step's entry, or `null` when no
   * step has been entered yet (fresh-init state).
   *
   * Set by the reducer on `workflow.step.exit` (for the next step the
   * transition advances to) and on `workflow.resume` (for the target
   * step a resume refocuses on) per L13 — `event.ts` at both sites.
   * Derived entirely from existing event timestamps; no new event type
   * carries this field. Consumed by the E.11 timeout detection branch
   * in `gobbi workflow stop` to compute `elapsedMs = now - stepStartedAt`
   * against `spec.meta.timeoutMs`.
   *
   * Intentionally NOT updated by `decision.eval.verdict` step transitions
   * (verdicts transition via `reduceDecision`, not STEP_EXIT) — the
   * timestamp reflects the most recent STEP_EXIT/RESUME entry. Added by
   * PR E (schema v4).
   */
  readonly stepStartedAt: string | null;
}

// ---------------------------------------------------------------------------
// Initial state factory
// ---------------------------------------------------------------------------

/**
 * Create a fresh WorkflowState for a new session.
 *
 * Starts in the `idle` step with no substate, no eval config,
 * and a feedback cap derived from the resolved settings cascade
 * (see {@link resolveMaxFeedbackRounds}). When `settings` is omitted
 * — the common case in tests, replay paths, and any call site that
 * does not have a cascade in hand — falls back to the historical
 * default of 3.
 *
 * The `state.maxFeedbackRounds` field is a single session-wide cap
 * (state-shape unchanged this Pass). `resolveMaxFeedbackRounds`
 * collapses the per-step `workflow.{ideation,planning,execution}.maxIterations`
 * values into one number using the `execution → planning → ideation`
 * preference ladder — execution-step REVISE loops are the most common
 * driver of the cap in practice. Per-step state extension is a
 * deferred follow-up; see issue #134.
 */
export function initialState(
  sessionId: string,
  settings?: ResolvedSettings,
): WorkflowState {
  return {
    schemaVersion: 4,
    sessionId,
    currentStep: 'idle',
    currentSubstate: null,
    completedSteps: [],
    evalConfig: null,
    activeSubagents: [],
    artifacts: {},
    violations: [],
    feedbackRound: 0,
    maxFeedbackRounds: resolveMaxFeedbackRounds(settings),
    lastVerdictOutcome: null,
    verificationResults: {},
    stepStartedAt: null,
  };
}

/**
 * Resolve the session-wide `maxFeedbackRounds` from a resolved settings
 * cascade. Reads the per-step `workflow.{step}.maxIterations` slots in
 * the order `execution → planning → ideation`, returning the first
 * defined value. Falls back to `3` when `settings` is `undefined` or
 * none of the step slots carry a value.
 *
 * The state shape carries a single number this Pass — per-step state
 * extension is deferred (see issue #134). Execution-step REVISE loops
 * are the most common driver of the cap, so the execution slot wins
 * the resolution race.
 */
function resolveMaxFeedbackRounds(settings: ResolvedSettings | undefined): number {
  if (settings === undefined) return 3;
  return (
    settings.workflow?.execution?.maxIterations
    ?? settings.workflow?.planning?.maxIterations
    ?? settings.workflow?.ideation?.maxIterations
    ?? 3
  );
}

// ---------------------------------------------------------------------------
// Reducer result type — imported from shared types to avoid circular deps
// ---------------------------------------------------------------------------

import type { ReducerResult, ReduceFn } from './types.js';

export type { ReducerResult, ReduceFn } from './types.js';

// ---------------------------------------------------------------------------
// Valid workflow step set — for runtime validation
// ---------------------------------------------------------------------------

const VALID_STEPS: ReadonlySet<string> = new Set<string>([
  'idle',
  'ideation',
  'ideation_eval',
  'planning',
  'planning_eval',
  'execution',
  'execution_eval',
  'memorization',
  'memorization_eval',
  'handoff',
  'done',
  'error',
]);

const VALID_SUBSTATES: ReadonlySet<string | null> = new Set<string | null>([
  'discussing',
  'researching',
  null,
]);

const VALID_SEVERITIES: ReadonlySet<string> = new Set<string>([
  'error',
  'warning',
]);

const VALID_VERDICT_OUTCOMES: ReadonlySet<string | null> = new Set<string | null>([
  'pass',
  'revise',
  null,
]);

// ---------------------------------------------------------------------------
// Type guard for WorkflowState shape validation
// ---------------------------------------------------------------------------

/**
 * Runtime validation that a parsed JSON value has the correct WorkflowState
 * shape. Uses existing type guards from guards.ts for primitive checks.
 *
 * Does not validate deep semantic correctness (e.g., whether completedSteps
 * are valid step names) — only structural shape.
 */
export function isValidState(value: unknown): value is WorkflowState {
  if (!isRecord(value)) return false;

  // Required scalar fields
  if (!isNumber(value['schemaVersion'])) return false;
  if (!isString(value['sessionId'])) return false;
  if (!isString(value['currentStep'])) return false;
  if (!VALID_STEPS.has(value['currentStep'])) return false;

  // currentSubstate: string | null
  const substate = value['currentSubstate'];
  if (substate !== null && !isString(substate)) return false;
  if (!VALID_SUBSTATES.has(substate as string | null)) return false;

  // completedSteps: string[]
  if (!isArray(value['completedSteps'])) return false;
  for (const step of value['completedSteps']) {
    if (!isString(step)) return false;
  }

  // evalConfig: object | null
  const evalConfig = value['evalConfig'];
  if (evalConfig !== null) {
    if (!isRecord(evalConfig)) return false;
    if (!isBoolean(evalConfig['ideation'])) return false;
    if (!isBoolean(evalConfig['planning'])) return false;
    // execution is optional (Wave C.2 additive slot). When present must be
    // a boolean; when absent the field is simply not set on the record.
    const execution = evalConfig['execution'];
    if (execution !== undefined && !isBoolean(execution)) return false;
    // memorization is optional (T-2a.7 additive slot). Same semantics as
    // execution: absent = "not set", present must be a boolean.
    const memorization = evalConfig['memorization'];
    if (memorization !== undefined && !isBoolean(memorization)) return false;
  }

  // activeSubagents: array of objects
  if (!isArray(value['activeSubagents'])) return false;
  for (const agent of value['activeSubagents']) {
    if (!isRecord(agent)) return false;
    if (!isString(agent['subagentId'])) return false;
    if (!isString(agent['agentType'])) return false;
    if (!isString(agent['step'])) return false;
    if (!isString(agent['spawnedAt'])) return false;
  }

  // artifacts: Record<string, string[]>
  if (!isRecord(value['artifacts'])) return false;
  for (const files of Object.values(value['artifacts'])) {
    if (!isArray(files)) return false;
    for (const f of files) {
      if (!isString(f)) return false;
    }
  }

  // violations: array of objects
  if (!isArray(value['violations'])) return false;
  for (const v of value['violations']) {
    if (!isRecord(v)) return false;
    if (!isString(v['guardId'])) return false;
    if (!isString(v['toolName'])) return false;
    if (!isString(v['reason'])) return false;
    if (!isString(v['step'])) return false;
    if (!isString(v['timestamp'])) return false;
    // severity is optional (schema v2+); `undefined` passes for v1 event
    // backward-compat. The v1→v2 migration in `migrations.ts` defaults
    // absent severity to `'error'` before it reaches state.
    const severity = v['severity'];
    if (severity !== undefined) {
      if (!isString(severity)) return false;
      if (!VALID_SEVERITIES.has(severity)) return false;
    }
  }

  // feedbackRound and maxFeedbackRounds
  if (!isNumber(value['feedbackRound'])) return false;
  if (!isNumber(value['maxFeedbackRounds'])) return false;

  // lastVerdictOutcome: 'pass' | 'revise' | null (schema v2+).
  // `undefined` is tolerated for v1 event backward-compat (the field
  // didn't exist pre-PR-C; replay produces `null`).
  const outcome = value['lastVerdictOutcome'];
  if (outcome !== undefined) {
    if (outcome !== null && !isString(outcome)) return false;
    if (!VALID_VERDICT_OUTCOMES.has(outcome as string | null)) return false;
  }

  // verificationResults: Record<string, VerificationResultData> (schema v4+).
  // `undefined` is tolerated for v1/v2/v3 event backward-compat. When
  // present, we validate the outer record shape and every entry's
  // top-level key/type invariants — nested string/number fields are
  // spot-checked for corruption detection rather than strict full-schema
  // conformance (the same approach taken for `violations`).
  const verifResults = value['verificationResults'];
  if (verifResults !== undefined) {
    if (!isRecord(verifResults)) return false;
    for (const entry of Object.values(verifResults)) {
      if (!isRecord(entry)) return false;
      if (!isString(entry['subagentId'])) return false;
      if (!isString(entry['command'])) return false;
      if (!isString(entry['commandKind'])) return false;
      if (!isNumber(entry['exitCode'])) return false;
      if (!isNumber(entry['durationMs'])) return false;
      if (!isString(entry['policy'])) return false;
      if (!isBoolean(entry['timedOut'])) return false;
      if (!isString(entry['stdoutDigest'])) return false;
      if (!isString(entry['stderrDigest'])) return false;
      if (!isString(entry['timestamp'])) return false;
    }
  }

  // stepStartedAt: string | null (schema v4+).
  // `undefined` is tolerated for v1/v2/v3 event backward-compat. When
  // present, must be an ISO timestamp string or explicit `null` —
  // numbers/objects/booleans are rejected.
  const startedAt = value['stepStartedAt'];
  if (startedAt !== undefined) {
    if (startedAt !== null && !isString(startedAt)) return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// EventRow → Event conversion
// ---------------------------------------------------------------------------

/**
 * Rename the legacy `'plan'` / `'plan_eval'` literals to their post-Wave-4
 * equivalents inside a parsed event `data` record. Applies to the
 * well-known step-carrying fields:
 *
 *   - `step` — `workflow.step.exit`, `workflow.step.skip`, etc.
 *   - `targetStep` — `workflow.resume`
 *   - `loopTarget` — `decision.eval.verdict`
 *
 * The `EvalDecideData.plan` payload field is INTENTIONALLY preserved
 * (see `reducer.ts:184` — the state-level field is `planning` but the
 * event payload keeps `plan` for wire-format stability). Event data
 * normalization does NOT touch `ideation`/`plan`/`execution` keys on
 * `workflow.eval.decide` payloads — those are handled by the reducer's
 * existing `planning: event.data.plan` mapping.
 *
 * Pure and idempotent: returns a new record when a translation fires,
 * the original reference otherwise.
 */
function normaliseEventDataLiterals(data: Record<string, unknown>): Record<string, unknown> {
  const stepLike: readonly string[] = ['step', 'targetStep', 'loopTarget'];
  let out: Record<string, unknown> | null = null;
  for (const key of stepLike) {
    const value = data[key];
    if (value === 'plan') {
      out ??= { ...data };
      out[key] = 'planning';
    } else if (value === 'plan_eval') {
      out ??= { ...data };
      out[key] = 'planning_eval';
    }
  }
  return out ?? data;
}

/**
 * Convert an EventRow (SQLite row) to a typed Event.
 *
 * Applies schema migration, parses the data JSON, validates the type field,
 * and constructs the Event variant. Returns null if the row contains an
 * unrecognized event type or unparseable data.
 *
 * Also applies `normaliseEventDataLiterals` to translate pre-Wave-4 step
 * literals (`'plan'` / `'plan_eval'`) on `step` / `targetStep` /
 * `loopTarget` payload fields so replay against new-shape state matches
 * correctly. The `EvalDecideData.plan` field is intentionally preserved
 * (see `reducer.ts:184`).
 */
export function rowToEvent(row: EventRow): Event | null {
  let migrated: EventRow;
  try {
    migrated = migrateEvent(row);
  } catch {
    // Migration failure (invalid data JSON, missing hop) is indistinguishable
    // from the other rowToEvent failure modes — a best-effort replay should
    // skip the row rather than crash the reducer.
    return null;
  }
  if (!isValidEventType(migrated.type)) return null;

  let parsedData: unknown;
  try {
    parsedData = JSON.parse(migrated.data);
  } catch {
    return null;
  }

  if (!isRecord(parsedData)) return null;

  const normalizedData = normaliseEventDataLiterals(parsedData);

  // Construct the Event with the validated type and parsed data.
  // The type field from the row is already validated as EventType by
  // isValidEventType, and the data is a parsed JSON object. The event
  // categories use discriminated unions on the type field, so the cast
  // is safe after validation.
  return { type: migrated.type, data: normalizedData } as Event;
}

// ---------------------------------------------------------------------------
// State derivation — full event replay
// ---------------------------------------------------------------------------

/**
 * Derive WorkflowState from a sequence of EventRows by replaying them
 * through the reduce function.
 *
 * Accepts the reduce function as a parameter to avoid importing from
 * reducer.ts (which would create a circular dependency). engine.ts
 * passes the concrete reduce function when calling this.
 *
 * Events that fail migration, parsing, or reduction are skipped —
 * replay is best-effort to recover from partial corruption.
 */
export function deriveState(
  sessionId: string,
  events: readonly EventRow[],
  reduceFn: ReduceFn,
): WorkflowState {
  let state = initialState(sessionId);
  for (const row of events) {
    const event = rowToEvent(row);
    if (event === null) continue; // skip unparseable events
    // Pass row.ts as the third argument so the reducer can project
    // timestamp-derived state fields (e.g. stepStartedAt per L13) during
    // replay — the event itself has no `ts`, but the EventRow does.
    const result = reduceFn(state, event, row.ts);
    if (result.ok) {
      state = result.state;
    }
    // Skip invalid events during replay — log but don't crash
  }
  return state;
}

