/**
 * Prompt state management — read, write, and update prompt-state.json.
 *
 * Independent state system for the prompt architecture. Tracks session
 * configuration, project context, workflow progress, and phase history.
 *
 * This module is the pure data layer. It has no locking — callers are
 * responsible for coordination. Follows the same patterns as config.ts:
 * pure data, atomic writes, type guards for safe narrowing.
 */

import { readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';

import { isRecord, isString, isBoolean, isArray } from '../guards.js';
import { nowIso } from '../config.js';
import { isPromptPhase } from './types.js';
import type { PromptPhase } from './types.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const PROMPT_STATE_VERSION = '0.5.0';
export const PROMPT_STATE_FILENAME = 'prompt-state.json';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PromptNotifyConfig {
  slack: boolean;
  telegram: boolean;
  discord: boolean;
}

export interface PromptSessionState {
  trivialRange: string;
  evaluationMode: string;
  gitWorkflow: string;
  notify: PromptNotifyConfig;
}

export interface PromptProjectState {
  name: string;
  noteDir: string | null;
  projectDir: string;
  baseBranch: string | null;
}

export type TaskTier = 'trivial' | 'structured-routine' | 'non-trivial';

export interface PromptWorkflowState {
  currentPhase: PromptPhase | null;
  taskSlug: string | null;
  taskTier: TaskTier | null;
  feedbackRound: number;
}

export interface PromptHistoryEntry {
  phase: PromptPhase;
  outcome: string;
  timestamp: string;
}

export interface PromptState {
  version: string;
  session: PromptSessionState;
  project: PromptProjectState;
  workflow: PromptWorkflowState;
  history: PromptHistoryEntry[];
}

// ---------------------------------------------------------------------------
// Type Guards
// ---------------------------------------------------------------------------

function isPromptNotifyConfig(value: unknown): value is PromptNotifyConfig {
  if (!isRecord(value)) return false;
  return (
    isBoolean(value['slack']) &&
    isBoolean(value['telegram']) &&
    isBoolean(value['discord'])
  );
}

function isPromptSessionState(value: unknown): value is PromptSessionState {
  if (!isRecord(value)) return false;
  return (
    isString(value['trivialRange']) &&
    isString(value['evaluationMode']) &&
    isString(value['gitWorkflow']) &&
    isPromptNotifyConfig(value['notify'])
  );
}

function isPromptProjectState(value: unknown): value is PromptProjectState {
  if (!isRecord(value)) return false;
  return (
    isString(value['name']) &&
    (value['noteDir'] === null || isString(value['noteDir'])) &&
    isString(value['projectDir']) &&
    (value['baseBranch'] === null || isString(value['baseBranch']))
  );
}

function isTaskTier(value: unknown): value is TaskTier {
  return value === 'trivial' || value === 'structured-routine' || value === 'non-trivial';
}

function isPromptWorkflowState(value: unknown): value is PromptWorkflowState {
  if (!isRecord(value)) return false;
  const phase = value['currentPhase'];
  if (phase !== null && !(isString(phase) && isPromptPhase(phase))) return false;
  const slug = value['taskSlug'];
  if (slug !== null && !isString(slug)) return false;
  const tier = value['taskTier'];
  if (tier !== null && !isTaskTier(tier)) return false;
  if (typeof value['feedbackRound'] !== 'number') return false;
  return true;
}

function isPromptHistoryEntry(value: unknown): value is PromptHistoryEntry {
  if (!isRecord(value)) return false;
  if (!isString(value['phase']) || !isPromptPhase(value['phase'])) return false;
  if (!isString(value['outcome'])) return false;
  return isString(value['timestamp']);
}

function isPromptState(value: unknown): value is PromptState {
  if (!isRecord(value)) return false;
  if (!isString(value['version'])) return false;
  if (!isPromptSessionState(value['session'])) return false;
  if (!isPromptProjectState(value['project'])) return false;
  if (!isPromptWorkflowState(value['workflow'])) return false;
  if (!isArray(value['history'])) return false;
  return value['history'].every(isPromptHistoryEntry);
}

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

/**
 * Returns a fresh prompt state with default values.
 */
export function emptyPromptState(): PromptState {
  return {
    version: PROMPT_STATE_VERSION,
    session: {
      trivialRange: 'read-only',
      evaluationMode: 'ask-each-time',
      gitWorkflow: 'direct-commit',
      notify: { slack: false, telegram: false, discord: false },
    },
    project: {
      name: '',
      noteDir: null,
      projectDir: '',
      baseBranch: null,
    },
    workflow: {
      currentPhase: null,
      taskSlug: null,
      taskTier: null,
      feedbackRound: 0,
    },
    history: [],
  };
}

// ---------------------------------------------------------------------------
// Read / Write
// ---------------------------------------------------------------------------

/**
 * Read and parse prompt-state.json from disk.
 * Returns null if the file is missing or contains invalid JSON / unexpected shape.
 */
export async function readPromptState(filePath: string): Promise<PromptState | null> {
  let raw: string;
  try {
    raw = await readFile(filePath, 'utf8');
  } catch (err: unknown) {
    if (isNodeErrnoException(err) && err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }

  if (!isPromptState(parsed)) {
    return null;
  }

  return parsed;
}

/**
 * Write prompt-state.json atomically: write to a temp file in the same
 * directory, then rename to the target path. The rename is atomic on
 * same-filesystem writes.
 */
export async function writePromptStateAtomic(filePath: string, data: PromptState): Promise<void> {
  const dir = dirname(filePath);
  const tmpPath = join(dir, `${PROMPT_STATE_FILENAME}.${randomUUID()}.tmp`);
  const serialized = JSON.stringify(data, null, 2);

  await writeFile(tmpPath, serialized, 'utf8');
  await rename(tmpPath, filePath);
}

// ---------------------------------------------------------------------------
// Path Resolution
// ---------------------------------------------------------------------------

/**
 * Resolve the path to prompt-state.json using CLAUDE_PROJECT_DIR.
 * Returns null if CLAUDE_PROJECT_DIR is not set.
 */
export function resolvePromptStatePath(): string | null {
  const projectDir = process.env['CLAUDE_PROJECT_DIR'];
  if (!projectDir) return null;
  return join(projectDir, '.claude', PROMPT_STATE_FILENAME);
}

// ---------------------------------------------------------------------------
// State Updates
// ---------------------------------------------------------------------------

/**
 * Append a history entry to the state. Returns a new state — does not mutate input.
 */
export function updatePromptHistory(
  state: PromptState,
  phase: PromptPhase,
  outcome: string,
): PromptState {
  const entry: PromptHistoryEntry = {
    phase,
    outcome,
    timestamp: nowIso(),
  };

  return {
    ...state,
    history: [...state.history, entry],
  };
}

// ---------------------------------------------------------------------------
// Internal utilities
// ---------------------------------------------------------------------------

interface NodeErrnoException extends Error {
  code?: string;
}

function isNodeErrnoException(err: unknown): err is NodeErrnoException {
  return err instanceof Error && 'code' in err;
}
