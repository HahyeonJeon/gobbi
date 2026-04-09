/**
 * gobbi-prompt JSON schema types.
 *
 * Independent type family for the prompt architecture (14 phases).
 * Discriminated unions on `$schema` (prompt schemas).
 * Strict mode compliance: no `any`, no `as` assertions.
 */

import { isRecord, isString, isBoolean, isArray } from '../guards.js';

// ---------------------------------------------------------------------------
// Prompt Schema Discriminator
// ---------------------------------------------------------------------------

/** All valid prompt schema identifiers. */
export type PromptSchema =
  | 'gobbi-prompt/session-start'
  | 'gobbi-prompt/project-setup'
  | 'gobbi-prompt/workflow-start'
  | 'gobbi-prompt/workflow-ideation'
  | 'gobbi-prompt/workflow-plan'
  | 'gobbi-prompt/workflow-research'
  | 'gobbi-prompt/workflow-execution'
  | 'gobbi-prompt/workflow-collection'
  | 'gobbi-prompt/workflow-memorization'
  | 'gobbi-prompt/workflow-review'
  | 'gobbi-prompt/workflow-feedback'
  | 'gobbi-prompt/workflow-finish'
  | 'gobbi-prompt/evaluation-ask'
  | 'gobbi-prompt/evaluation-spawn';

/** Short names used as CLI arguments and state references. */
export type PromptPhase =
  | 'session-start'
  | 'project-setup'
  | 'workflow-start'
  | 'workflow-ideation'
  | 'workflow-plan'
  | 'workflow-research'
  | 'workflow-execution'
  | 'workflow-collection'
  | 'workflow-memorization'
  | 'workflow-review'
  | 'workflow-feedback'
  | 'workflow-finish'
  | 'evaluation-ask'
  | 'evaluation-spawn';

/** Map from short phase name to full schema identifier. */
export const PROMPT_PHASE_TO_SCHEMA: Readonly<Record<PromptPhase, PromptSchema>> = {
  'session-start': 'gobbi-prompt/session-start',
  'project-setup': 'gobbi-prompt/project-setup',
  'workflow-start': 'gobbi-prompt/workflow-start',
  'workflow-ideation': 'gobbi-prompt/workflow-ideation',
  'workflow-plan': 'gobbi-prompt/workflow-plan',
  'workflow-research': 'gobbi-prompt/workflow-research',
  'workflow-execution': 'gobbi-prompt/workflow-execution',
  'workflow-collection': 'gobbi-prompt/workflow-collection',
  'workflow-memorization': 'gobbi-prompt/workflow-memorization',
  'workflow-review': 'gobbi-prompt/workflow-review',
  'workflow-feedback': 'gobbi-prompt/workflow-feedback',
  'workflow-finish': 'gobbi-prompt/workflow-finish',
  'evaluation-ask': 'gobbi-prompt/evaluation-ask',
  'evaluation-spawn': 'gobbi-prompt/evaluation-spawn',
};

export const VALID_PROMPT_PHASES: readonly PromptPhase[] = [
  'session-start',
  'project-setup',
  'workflow-start',
  'workflow-ideation',
  'workflow-plan',
  'workflow-research',
  'workflow-execution',
  'workflow-collection',
  'workflow-memorization',
  'workflow-review',
  'workflow-feedback',
  'workflow-finish',
  'evaluation-ask',
  'evaluation-spawn',
];

// ---------------------------------------------------------------------------
// Variable Types
// ---------------------------------------------------------------------------

/** Sources from which a variable can be resolved. */
export type VariableSource = 'env' | 'config' | 'file' | 'glob' | 'command' | 'state' | 'git' | 'runtime';

const VALID_VARIABLE_SOURCES: readonly VariableSource[] = [
  'env', 'config', 'file', 'glob', 'command', 'state', 'git', 'runtime',
];

/** Declaration of a single variable and how to resolve it. */
export interface VariableDeclaration {
  source: VariableSource;
  path: string;
  required: boolean;
  fallback?: string;
  description?: string;
}

// ---------------------------------------------------------------------------
// Layer Types
// ---------------------------------------------------------------------------

/** A single layer of prompt content with a role. */
export interface PromptLayer {
  role: 'system' | 'context' | 'task';
  content: string;
}

// ---------------------------------------------------------------------------
// Completion Types
// ---------------------------------------------------------------------------

/** A possible outcome from completing a phase. */
export interface CompletionOutcome {
  id: string;
  description?: string;
}

/** How the phase is completed — currently only select-outcome. */
export interface Completion {
  type: 'select-outcome';
  outcomes: CompletionOutcome[];
}

// ---------------------------------------------------------------------------
// Transition Types
// ---------------------------------------------------------------------------

/** A condition that checks a variable against an expected value. */
export interface TransitionCondition {
  variable: string;
  equals: string;
}

/** A single transition choice — if condition matches, go to `next`. */
export interface TransitionChoice {
  condition: TransitionCondition;
  next: string;
}

/** ASL Choice-style transition routing. */
export interface Transitions {
  type: 'choice';
  choices: TransitionChoice[];
  default: string;
}

// ---------------------------------------------------------------------------
// Agent Spec Types
// ---------------------------------------------------------------------------

/** Specification for an agent to spawn during a phase. */
export interface AgentSpec {
  id: string;
  model: 'sonnet' | 'opus' | 'haiku';
  stance?: 'innovative' | 'best-practice';
  skills: string[];
  outputPath?: string;
  brief?: string;
}

// ---------------------------------------------------------------------------
// AskUser Types
// ---------------------------------------------------------------------------

/** A single option in an AskUser question. */
export interface AskUserOption {
  label: string;
  description?: string;
}

/** An interactive question to present to the user. */
export interface AskUserQuestion {
  question: string;
  header?: string;
  options: AskUserOption[];
  multiSelect?: boolean;
}

// ---------------------------------------------------------------------------
// Prompt Template
// ---------------------------------------------------------------------------

/** Complete prompt template for a single phase. */
export interface PromptTemplate {
  $schema: PromptSchema;
  version: string;
  phase: string;
  layers: PromptLayer[];
  variables: Record<string, VariableDeclaration>;
  completion: Completion;
  transitions: Transitions;
  agents?: AgentSpec[];
  askUser?: AskUserQuestion[];
}

// ---------------------------------------------------------------------------
// Type Guards
// ---------------------------------------------------------------------------

/** Check whether a string is a valid prompt phase. */
export function isPromptPhase(value: string): value is PromptPhase {
  return (VALID_PROMPT_PHASES as readonly string[]).includes(value);
}

/** Check whether a string is a valid prompt schema identifier. */
export function isPromptSchema(value: string): value is PromptSchema {
  return value.startsWith('gobbi-prompt/') && isPromptPhase(value.slice('gobbi-prompt/'.length));
}

/** Check whether a string is a valid variable source. */
export function isVariableSource(value: string): value is VariableSource {
  return (VALID_VARIABLE_SOURCES as readonly string[]).includes(value);
}

function isVariableDeclaration(value: unknown): value is VariableDeclaration {
  if (!isRecord(value)) return false;
  if (!isString(value['source']) || !isVariableSource(value['source'])) return false;
  if (!isString(value['path'])) return false;
  if (!isBoolean(value['required'])) return false;
  if ('fallback' in value && value['fallback'] !== undefined && !isString(value['fallback'])) return false;
  if ('description' in value && value['description'] !== undefined && !isString(value['description'])) return false;
  return true;
}

function isVariableRecord(value: unknown): value is Record<string, VariableDeclaration> {
  if (!isRecord(value)) return false;
  return Object.values(value).every(isVariableDeclaration);
}

function isPromptLayer(value: unknown): value is PromptLayer {
  if (!isRecord(value)) return false;
  if (!isString(value['role'])) return false;
  if (value['role'] !== 'system' && value['role'] !== 'context' && value['role'] !== 'task') return false;
  return isString(value['content']);
}

function isCompletionOutcome(value: unknown): value is CompletionOutcome {
  if (!isRecord(value)) return false;
  if (!isString(value['id'])) return false;
  if ('description' in value && value['description'] !== undefined && !isString(value['description'])) return false;
  return true;
}

function isCompletion(value: unknown): value is Completion {
  if (!isRecord(value)) return false;
  if (value['type'] !== 'select-outcome') return false;
  if (!isArray(value['outcomes'])) return false;
  return value['outcomes'].every(isCompletionOutcome);
}

function isTransitionCondition(value: unknown): value is TransitionCondition {
  if (!isRecord(value)) return false;
  return isString(value['variable']) && isString(value['equals']);
}

function isTransitionChoice(value: unknown): value is TransitionChoice {
  if (!isRecord(value)) return false;
  if (!isTransitionCondition(value['condition'])) return false;
  return isString(value['next']);
}

function isTransitions(value: unknown): value is Transitions {
  if (!isRecord(value)) return false;
  if (value['type'] !== 'choice') return false;
  if (!isArray(value['choices'])) return false;
  if (!value['choices'].every(isTransitionChoice)) return false;
  return isString(value['default']);
}

function isAgentSpec(value: unknown): value is AgentSpec {
  if (!isRecord(value)) return false;
  if (!isString(value['id'])) return false;
  const model = value['model'];
  if (model !== 'sonnet' && model !== 'opus' && model !== 'haiku') return false;
  if ('stance' in value && value['stance'] !== undefined) {
    if (value['stance'] !== 'innovative' && value['stance'] !== 'best-practice') return false;
  }
  if (!isArray(value['skills']) || !value['skills'].every(isString)) return false;
  if ('outputPath' in value && value['outputPath'] !== undefined && !isString(value['outputPath'])) return false;
  if ('brief' in value && value['brief'] !== undefined && !isString(value['brief'])) return false;
  return true;
}

function isAskUserOption(value: unknown): value is AskUserOption {
  if (!isRecord(value)) return false;
  if (!isString(value['label'])) return false;
  if ('description' in value && value['description'] !== undefined && !isString(value['description'])) return false;
  return true;
}

function isAskUserQuestion(value: unknown): value is AskUserQuestion {
  if (!isRecord(value)) return false;
  if (!isString(value['question'])) return false;
  if ('header' in value && value['header'] !== undefined && !isString(value['header'])) return false;
  if (!isArray(value['options']) || !value['options'].every(isAskUserOption)) return false;
  if ('multiSelect' in value && value['multiSelect'] !== undefined && !isBoolean(value['multiSelect'])) return false;
  return true;
}

/** Check whether an unknown value is a valid PromptTemplate. */
export function isPromptTemplate(value: unknown): value is PromptTemplate {
  if (!isRecord(value)) return false;
  if (!isString(value['$schema']) || !isPromptSchema(value['$schema'])) return false;
  if (!isString(value['version'])) return false;
  if (!isString(value['phase'])) return false;
  if (!isArray(value['layers']) || !value['layers'].every(isPromptLayer)) return false;
  if (!isVariableRecord(value['variables'])) return false;
  if (!isCompletion(value['completion'])) return false;
  if (!isTransitions(value['transitions'])) return false;
  if ('agents' in value && value['agents'] !== undefined) {
    if (!isArray(value['agents']) || !value['agents'].every(isAgentSpec)) return false;
  }
  if ('askUser' in value && value['askUser'] !== undefined) {
    if (!isArray(value['askUser']) || !value['askUser'].every(isAskUserQuestion)) return false;
  }
  return true;
}
