/**
 * Workflow state types, initial state factory, and persistence.
 *
 * Defines the WorkflowState interface, step/substate types, evaluation
 * configuration, active subagent tracking, and guard violation records.
 * State is immutable — all fields use readonly modifiers.
 *
 * Persistence functions are synchronous (writeFileSync, renameSync,
 * appendFileSync) because they execute inside bun:sqlite transactions
 * which cannot contain async calls.
 *
 * This module does NOT import from reducer.ts — deriveState and
 * resolveState accept a reduce function as a parameter to avoid
 * circular dependencies. engine.ts is the module that bridges
 * state.ts and reducer.ts.
 */

import {
  writeFileSync,
  readFileSync,
  renameSync,
  copyFileSync,
  existsSync,
  appendFileSync,
  mkdirSync,
} from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

import { isRecord, isString, isNumber, isBoolean, isArray } from '../lib/guards.js';
import { isValidEventType } from './events/index.js';
import type { Event } from './events/index.js';
import { migrateEvent } from './migrations.js';
import type { EventRow } from './migrations.js';

// ---------------------------------------------------------------------------
// Workflow step type — 10 discrete states
// ---------------------------------------------------------------------------

export type WorkflowStep =
  | 'idle'
  | 'ideation'
  | 'ideation_eval'
  | 'plan'
  | 'plan_eval'
  | 'execution'
  | 'execution_eval'
  | 'memorization'
  | 'done'
  | 'error';

/**
 * Steps that represent active workflow execution (not terminal or pre-start).
 * Used for timeout and skip applicability checks.
 */
export const ACTIVE_STEPS: ReadonlySet<WorkflowStep> = new Set<WorkflowStep>([
  'ideation',
  'ideation_eval',
  'plan',
  'plan_eval',
  'execution',
  'execution_eval',
  'memorization',
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
  readonly plan: boolean;
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

export interface GuardViolationRecord {
  readonly guardId: string;
  readonly toolName: string;
  readonly reason: string;
  readonly step: string;
  readonly timestamp: string;
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
}

// ---------------------------------------------------------------------------
// Initial state factory
// ---------------------------------------------------------------------------

/**
 * Create a fresh WorkflowState for a new session.
 *
 * Starts in the `idle` step with no substate, no eval config,
 * and a default feedback cap of 3 rounds.
 */
export function initialState(sessionId: string): WorkflowState {
  return {
    schemaVersion: 1,
    sessionId,
    currentStep: 'idle',
    currentSubstate: null,
    completedSteps: [],
    evalConfig: null,
    activeSubagents: [],
    artifacts: {},
    violations: [],
    feedbackRound: 0,
    maxFeedbackRounds: 3,
  };
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
  'plan',
  'plan_eval',
  'execution',
  'execution_eval',
  'memorization',
  'done',
  'error',
]);

const VALID_SUBSTATES: ReadonlySet<string | null> = new Set<string | null>([
  'discussing',
  'researching',
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
    if (!isBoolean(evalConfig['plan'])) return false;
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
  }

  // feedbackRound and maxFeedbackRounds
  if (!isNumber(value['feedbackRound'])) return false;
  if (!isNumber(value['maxFeedbackRounds'])) return false;

  return true;
}

// ---------------------------------------------------------------------------
// State persistence — synchronous for use inside bun:sqlite transactions
// ---------------------------------------------------------------------------

/**
 * Synchronous atomic write: write to temp file, then rename.
 * Creates the directory if it does not exist.
 */
export function writeState(dir: string, state: WorkflowState): void {
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, 'state.json');
  const tmpPath = join(dir, `state.json.${randomUUID()}.tmp`);
  writeFileSync(tmpPath, JSON.stringify(state, null, 2), 'utf8');
  renameSync(tmpPath, filePath);
}

/**
 * Read state.json from disk.
 * Returns null if the file is absent, contains invalid JSON, or has
 * an unexpected shape.
 */
export function readState(dir: string): WorkflowState | null {
  const filePath = join(dir, 'state.json');
  if (!existsSync(filePath)) return null;
  try {
    const raw = readFileSync(filePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (!isValidState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Copy state.json to state.json.backup.
 * No-op if state.json does not exist.
 */
export function backupState(dir: string): void {
  const src = join(dir, 'state.json');
  const dest = join(dir, 'state.json.backup');
  if (existsSync(src)) {
    copyFileSync(src, dest);
  }
}

/**
 * Restore WorkflowState from the backup file.
 * Returns null if the backup is absent, invalid JSON, or wrong shape.
 */
export function restoreBackup(dir: string): WorkflowState | null {
  const filePath = join(dir, 'state.json.backup');
  if (!existsSync(filePath)) return null;
  try {
    const raw = readFileSync(filePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (!isValidState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Restore state.json from state.json.backup on disk.
 *
 * Unlike restoreBackup() which reads and returns the backup state,
 * this function copies the backup file back to state.json so that
 * subsequent resolveState() calls find the pre-operation state.
 *
 * No-op if the backup file does not exist.
 */
export function restoreStateFromBackup(dir: string): void {
  const backup = join(dir, 'state.json.backup');
  const target = join(dir, 'state.json');
  if (existsSync(backup)) {
    copyFileSync(backup, target);
  }
}

/**
 * Append one JSON line to events.jsonl.
 * Creates the directory and file if they do not exist.
 *
 * Uses appendFileSync because Bun.write does not support append mode.
 */
export function appendJsonl(dir: string, event: object): void {
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, 'events.jsonl');
  appendFileSync(filePath, JSON.stringify(event) + '\n', 'utf8');
}

// ---------------------------------------------------------------------------
// EventRow → Event conversion
// ---------------------------------------------------------------------------

/**
 * Convert an EventRow (SQLite row) to a typed Event.
 *
 * Applies schema migration, parses the data JSON, validates the type field,
 * and constructs the Event variant. Returns null if the row contains an
 * unrecognized event type or unparseable data.
 */
export function rowToEvent(row: EventRow): Event | null {
  const migrated = migrateEvent(row);
  if (!isValidEventType(migrated.type)) return null;

  let parsedData: unknown;
  try {
    parsedData = JSON.parse(migrated.data);
  } catch {
    return null;
  }

  if (!isRecord(parsedData)) return null;

  // Construct the Event with the validated type and parsed data.
  // The type field from the row is already validated as EventType by
  // isValidEventType, and the data is a parsed JSON object. The event
  // categories use discriminated unions on the type field, so the cast
  // is safe after validation.
  return { type: migrated.type, data: parsedData } as Event;
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
    const result = reduceFn(state, event);
    if (result.ok) {
      state = result.state;
    }
    // Skip invalid events during replay — log but don't crash
  }
  return state;
}

/**
 * Resolve state using a three-level fallback chain:
 *
 * 1. Read state.json (primary)
 * 2. Read state.json.backup (fallback)
 * 3. Derive from full event replay (ultimate fallback)
 *
 * Always returns a valid WorkflowState.
 */
export function resolveState(
  dir: string,
  events: readonly EventRow[],
  sessionId: string,
  reduceFn: ReduceFn,
): WorkflowState {
  return readState(dir) ?? restoreBackup(dir) ?? deriveState(sessionId, events, reduceFn);
}
