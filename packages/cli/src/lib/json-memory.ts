/**
 * JSON memory I/O — `session.json` + `project.json` schemas, AJV validators,
 * atomic writers, and the memorization-time aggregator that builds a
 * fully-populated `SessionJson` from the workspace event store and the
 * Anthropic JSONL transcripts under `~/.claude/projects/<encoded-cwd>/<sessionId>/subagents/`.
 *
 * # Authoritative shape
 *
 * The TS interfaces below are the source of truth for both files. The AJV
 * schemas (`sessionJsonSchema`, `projectJsonSchema`) bind via
 * `JSONSchemaType<T>` where the recursion depth permits, falling back to
 * `as never` casts at the root only for the 5-level `SessionJson` shape per
 * the `_schema/v1.ts:60-73` precedent. `tsc --noEmit` is the drift gate at
 * every leaf where the type compiles cleanly.
 *
 * # Module layout (mirrors `lib/settings-io.ts` + `lib/canonical-json.ts`)
 *
 *   - Types — discriminated unions for `provider`, `outcome`, `step.id`,
 *     `verdict`, `terminationReason`. Every consumer that branches on
 *     `agent.provider` MUST end its switch with `assertNever(agent)` so a
 *     future `'codex'` widening fails to compile at every reader.
 *   - AJV — single instance compiled at module load
 *     (`new Ajv2020({strict, allErrors, discriminator: true})` + `addFormats`).
 *     Reuse `formatAjvErrors` from `settings-validator.ts` — DO NOT
 *     instantiate a second formatter.
 *   - Read — defensive boundary parse (returns `null` on absence, throws
 *     `ConfigCascadeError('parse', …)` on malformed/invalid).
 *   - Write — atomic temp+rename, AJV-validate before write, sorted-rewrite
 *     primitives sort arrays at the writer call site (never inside the
 *     stringifier).
 *   - Aggregator — `aggregateSessionJson` is async because
 *     `buildAgentCalls` walks JSONL transcripts via `parseJsonlFile`.
 *
 * # Sort discipline (lock 32)
 *
 * Every array in the persisted shape sorts deterministically before the
 * writer stringifies:
 *
 *   - `steps[]` — state-machine order (`ideation`, `planning`, `execution`,
 *     `memorization`); pre-arranged by the aggregator.
 *   - `iterations[]` — by `round` ASC.
 *   - `substeps[]` — by `seq` ASC of first nested event.
 *   - `agents[]` — by `seq` ASC of first event mentioning the subagentId.
 *   - `calls[]` — by `turnIndex` ASC (monotonically aligned with seq inside
 *     one agent).
 *   - `project.json.sessions[]` — by `createdAt` ASC.
 *   - `project.json.gotchas[]` — by `path` ASC.
 *   - `project.json.decisions[]` / `learnings[]` — by `recordedAt` ASC.
 *
 * # Provenance
 *
 *   - Agent-level `tokensUsed` is a SUM-fold over `agents[].calls[].*Tokens`
 *     (lock 34). The `delegation.complete.tokensUsed` event payload is
 *     statically `number` (Architecture C4) — DO NOT consume it. JSONL
 *     transcripts are the canonical source for both call-level and
 *     agent-level token data.
 *   - Per-agent cost rollup reuses `aggregateDelegationCosts` from
 *     `workflow/store.ts:294` (lock 36). DO NOT reinvent.
 *   - `iterations[].terminationReason` derives from which terminal event
 *     closed the iteration (`exit`/`skip`/`timeout`/`aborted`/`in-flight`).
 *     `'in-flight'` is the memorization mid-run case — the iteration that
 *     contains memorization itself has no terminal event because
 *     memorization is the step writing this very file.
 *   - JSONL transcript discovery (Plan-eval Overall H1):
 *       1. `dirname($CLAUDE_TRANSCRIPT_PATH)/<sessionId>/subagents/agent-<id>.jsonl`
 *       2. fallback glob `~/.claude/projects/<encoded-cwd>/<sessionId>/subagents/agent-*.jsonl`
 *       3. if neither resolves, emit `agent.calls: []` + one-line stderr warning.
 *
 * # Concurrency caveat (lock 42)
 *
 * `project.json` writers (`gobbi gotcha promote` + memorization step) form a
 * read-modify-write pair. Atomic temp+rename prevents torn writes; it does
 * NOT prevent lossy merges if two terminals run concurrently. Solo-user
 * context accepted; recovery path is manual edit / git-restore.
 *
 * # Codex forward-compat (lock 28)
 *
 * AJV is constructed with `discriminator: true` so future widening to
 * `oneOf: [<anthropic>, <codex>]` keeps validating v1 fixtures unchanged.
 * The schema-equivalence test in `__tests__/json-memory.test.ts` pins the
 * preconditions: `provider` is `const`/`enum`, `required` includes
 * `provider`, schemas are inline (no `$ref` at the discriminator).
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import addFormatsPlugin from 'ajv-formats';
import Ajv2020, { type ValidateFunction } from 'ajv/dist/2020.js';

import { isNumber, isRecord, isString } from './guards.js';
import { parseJsonlFile } from './jsonl.js';
import { ConfigCascadeError } from './settings.js';
import { formatAjvErrors } from './settings-validator.js';
import { projectDir, sessionDir } from './workspace-paths.js';
import { derivedCost } from './cost-rates.js';
import type { ReadStore, CostAggregateRow } from '../workflow/store.js';
import type { EventRow } from '../workflow/migrations.js';

// ajv-formats default export shape: TypeScript ESM interop — the runtime
// value is the plugin function; the typings expose it under `.default`.
// Cast through `unknown` to handle both shapes consistently.
const addFormats: (ajv: Ajv2020) => Ajv2020 =
  (addFormatsPlugin as unknown as { default?: typeof addFormatsPlugin }).default ??
  (addFormatsPlugin as unknown as (ajv: Ajv2020) => Ajv2020);

// ---------------------------------------------------------------------------
// Discriminated unions
// ---------------------------------------------------------------------------

/**
 * Agent provider discriminant. v1 ships only `'anthropic'`. The Codex arm
 * lands as a strictly-additive widening: `| 'codex'` plus a parallel
 * `CodexAgentEntry` interface and a `oneOf` schema branch. Pre-existing v1
 * `session.json` files validate unchanged because `discriminator: true` on
 * the AJV instance routes them down the `'anthropic'` arm.
 *
 * Every consumer that branches on `agent.provider` MUST end its switch with
 * `assertNever(agent)`. Without it, a future `'codex'` literal compiles
 * silently and the consumer skips the new arm at runtime (Architecture H1).
 */
export type AgentProvider = 'anthropic';

export type DelegationOutcome = 'complete' | 'fail' | 'running';

export type SessionStepId = 'ideation' | 'planning' | 'execution' | 'memorization';

export type EvalVerdict = 'pass' | 'revise' | 'escalate';

export type TerminationReason = 'exit' | 'skip' | 'timeout' | 'aborted' | 'in-flight';

// ---------------------------------------------------------------------------
// session.json — telemetry types (5-level recursion)
// ---------------------------------------------------------------------------

/**
 * Per-LLM-turn row produced by the JSONL transcript walker. One row per
 * assistant message line; `turnIndex` is the 0-based index inside the
 * subagent's transcript. Token fields are `null` when the line lacked a
 * `message.usage` block (rare for Anthropic — typically only on synthetic
 * lines or hand-crafted fixtures).
 */
export interface AnthropicAgentCallEntry {
  readonly seq: number;
  readonly turnIndex: number;
  readonly model: string | null;
  readonly ts: string | null;
  readonly stopReason: string | null;
  readonly requestId: string | null;
  readonly inputTokens: number | null;
  readonly outputTokens: number | null;
  readonly cacheReadTokens: number | null;
  readonly cacheCreationTokens: number | null;
}

export type AgentCallEntry = AnthropicAgentCallEntry;

/**
 * Anthropic `message.usage` shape, mirrored verbatim so a JSON.parse of the
 * raw usage object round-trips into this interface without renaming.
 */
export interface AnthropicTokensUsed {
  readonly input_tokens: number;
  readonly output_tokens: number;
  readonly cache_read_input_tokens: number;
  readonly cache_creation_input_tokens: number;
}

/**
 * Common agent-entry fields shared across providers. The provider-specific
 * subtype carries the discriminant and the provider's identity fields.
 */
interface AgentEntryBase {
  readonly id: string;
  readonly seq: number;
  readonly name: string;
  readonly model: string | null;
  readonly skillsLoaded: readonly string[];
  readonly startedAt: string | null;
  readonly finishedAt: string | null;
  readonly outcome: DelegationOutcome | null;
  readonly costUsd: number | null;
  readonly calls: readonly AgentCallEntry[];
}

/**
 * Anthropic agent entry. `tokensUsed` is the SUM-fold over `calls[]` token
 * fields (lock 34) — never sourced from the `delegation.complete.tokensUsed`
 * event payload (which is statically `number`).
 */
export interface AnthropicAgentEntry extends AgentEntryBase {
  readonly provider: 'anthropic';
  readonly claudeCodeVersion: string | null;
  readonly transcriptPath: string | null;
  readonly transcriptSha256: string | null;
  readonly tokensUsed: AnthropicTokensUsed | null;
  readonly cacheHitRatio: number | null;
  readonly sizeProxyBytes: number | null;
}

export type AgentEntry = AnthropicAgentEntry;

export interface SubstepEntry {
  readonly id: string;
  readonly startedAt: string;
  readonly finishedAt: string | null;
  readonly agents: readonly AgentEntry[];
}

/**
 * One iteration through a productive step. Iterations contain EITHER a
 * `substeps[]` axis (typical: ideation/planning/execution have
 * discussion → research → delegation → evaluation substeps) OR a flat
 * `agents[]` lift (typical: memorization, where the orchestrator-only
 * pattern has no substep axis). Schema accepts both shapes; aggregator
 * lifts agents up if no substep axis is detected.
 */
export interface IterationEntry {
  readonly round: number;
  readonly startedAt: string;
  readonly finishedAt: string | null;
  readonly terminationReason: TerminationReason;
  readonly substeps?: readonly SubstepEntry[];
  readonly agents?: readonly AgentEntry[];
}

export interface StepEntry {
  readonly id: SessionStepId;
  readonly startedAt: string;
  readonly finishedAt: string | null;
  readonly skippedAt: string | null;
  readonly timedOutAt: string | null;
  readonly iterations: readonly IterationEntry[];
}

/**
 * Persisted shape of `<sessionDir>/session.json`. The 6 required fields are
 * stamped at `gobbi workflow init` (the stub) and the writer at the
 * memorization step's STEP_EXIT replaces the file with the same fields plus
 * a populated `steps[]`. `finishedAt` is `null` until `workflow.finish` /
 * `workflow.abort` fires.
 *
 * Stub-vs-complete distinguishability (lock 43): a `session.json` with no
 * `steps` field is a stub. No new `status` field — readers infer state
 * from field presence.
 */
export interface SessionJson {
  readonly schemaVersion: 1;
  readonly sessionId: string;
  readonly projectId: string;
  readonly createdAt: string;
  readonly finishedAt: string | null;
  readonly gobbiVersion: string;
  readonly task: string;
  readonly steps?: readonly StepEntry[];
}

// ---------------------------------------------------------------------------
// project.json — cross-session memory types
// ---------------------------------------------------------------------------

export interface ProjectJsonSession {
  readonly sessionId: string;
  readonly createdAt: string;
  readonly finishedAt: string | null;
  readonly task: string;
  readonly handoffSummary?: string | null;
}

export interface ProjectJsonGotcha {
  readonly path: string;
  readonly sha256: string;
  readonly class: string;
  readonly promotedAt: string;
  readonly promotedFromSession: string;
}

export interface ProjectJsonDecision {
  readonly id: string;
  readonly title: string;
  readonly recordedAt: string;
  readonly sessionId: string;
}

export interface ProjectJsonLearning {
  readonly id: string;
  readonly title: string;
  readonly recordedAt: string;
  readonly sessionId: string;
}

/**
 * Persisted shape of `.gobbi/projects/<projectName>/project.json`. Tracked
 * in git. Concurrent writers (gotcha promote + memorization) form a
 * read-modify-write race; atomic temp+rename prevents torn writes but NOT
 * lossy merges. Solo-user context accepted (lock 42).
 */
export interface ProjectJson {
  readonly schemaVersion: 1;
  readonly projectName: string;
  readonly projectId: string;
  readonly sessions: readonly ProjectJsonSession[];
  readonly gotchas: readonly ProjectJsonGotcha[];
  readonly decisions: readonly ProjectJsonDecision[];
  readonly learnings: readonly ProjectJsonLearning[];
}

// ---------------------------------------------------------------------------
// AJV — single instance, compiled at module load (mirror settings-validator.ts:376-388)
// ---------------------------------------------------------------------------

const ajv = new Ajv2020({ strict: true, allErrors: true, discriminator: true });
addFormats(ajv);

// ---------------------------------------------------------------------------
// Inline schema constants
// ---------------------------------------------------------------------------
//
// Schemas are written as untyped object literals (not annotated with
// `JSONSchemaType<T>`) for two reasons:
//
//   1. `JSONSchemaType<SessionJson>` cannot represent the 5-level recursion
//      with `oneOf` discriminators cleanly under EOPT — the same trade-off
//      `_schema/v1.ts:60-73` documented for `StepSpecSchema`.
//   2. The discriminator preconditions (`provider` is `const`, `required`
//      includes `provider`, no `$ref` at the discriminator position) are
//      asserted by the v1→v2 schema-equivalence test rather than by AJV's
//      `JSONSchemaType` type. The test is the gate; the inline schema is
//      the ground truth.
//
// Drift is mitigated by (a) the type-cast bind to `ValidateFunction<T>` at
// the `compile` call site, (b) positive AJV fixtures hitting every required
// field, and (c) the schema-equivalence test pinning the discriminator
// preconditions.

const anthropicTokensUsedSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'input_tokens',
    'output_tokens',
    'cache_read_input_tokens',
    'cache_creation_input_tokens',
  ],
  properties: {
    input_tokens: { type: 'integer', minimum: 0 },
    output_tokens: { type: 'integer', minimum: 0 },
    cache_read_input_tokens: { type: 'integer', minimum: 0 },
    cache_creation_input_tokens: { type: 'integer', minimum: 0 },
  },
} as const;

const anthropicAgentCallSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'seq',
    'turnIndex',
    'model',
    'ts',
    'stopReason',
    'requestId',
    'inputTokens',
    'outputTokens',
    'cacheReadTokens',
    'cacheCreationTokens',
  ],
  properties: {
    seq: { type: 'integer', minimum: 0 },
    turnIndex: { type: 'integer', minimum: 0 },
    model: { type: ['string', 'null'] },
    ts: { type: ['string', 'null'], format: 'date-time' },
    stopReason: { type: ['string', 'null'] },
    requestId: { type: ['string', 'null'] },
    inputTokens: { type: ['integer', 'null'], minimum: 0 },
    outputTokens: { type: ['integer', 'null'], minimum: 0 },
    cacheReadTokens: { type: ['integer', 'null'], minimum: 0 },
    cacheCreationTokens: { type: ['integer', 'null'], minimum: 0 },
  },
} as const;

/**
 * Anthropic agent schema. `provider: { const: 'anthropic' }` is the
 * v1→v2 schema-equivalence pin (lock 28) — the discriminator's
 * preconditions are written here, not in the union schema. When v2 widens
 * to `oneOf: [<this>, <codex>]`, AJV's `discriminator: true` keeps v1
 * fixtures validating against this branch.
 */
const anthropicAgentSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'provider',
    'id',
    'seq',
    'name',
    'model',
    'skillsLoaded',
    'startedAt',
    'finishedAt',
    'outcome',
    'costUsd',
    'calls',
    'claudeCodeVersion',
    'transcriptPath',
    'transcriptSha256',
    'tokensUsed',
    'cacheHitRatio',
    'sizeProxyBytes',
  ],
  properties: {
    provider: { const: 'anthropic' },
    id: { type: 'string', minLength: 1 },
    seq: { type: 'integer', minimum: 0 },
    name: { type: 'string', minLength: 1 },
    model: { type: ['string', 'null'] },
    skillsLoaded: { type: 'array', items: { type: 'string' } },
    startedAt: { type: ['string', 'null'], format: 'date-time' },
    finishedAt: { type: ['string', 'null'], format: 'date-time' },
    outcome: { type: ['string', 'null'], enum: ['complete', 'fail', 'running', null] },
    costUsd: { type: ['number', 'null'], minimum: 0 },
    calls: { type: 'array', items: anthropicAgentCallSchema },
    claudeCodeVersion: { type: ['string', 'null'] },
    transcriptPath: { type: ['string', 'null'] },
    transcriptSha256: { type: ['string', 'null'] },
    tokensUsed: { ...anthropicTokensUsedSchema, type: ['object', 'null'] as const },
    cacheHitRatio: { type: ['number', 'null'], minimum: 0 },
    sizeProxyBytes: { type: ['integer', 'null'], minimum: 0 },
  },
} as const;

const substepSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'startedAt', 'finishedAt', 'agents'],
  properties: {
    id: { type: 'string', minLength: 1 },
    startedAt: { type: 'string', format: 'date-time' },
    finishedAt: { type: ['string', 'null'], format: 'date-time' },
    agents: { type: 'array', items: anthropicAgentSchema },
  },
} as const;

const iterationSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['round', 'startedAt', 'finishedAt', 'terminationReason'],
  properties: {
    round: { type: 'integer', minimum: 0 },
    startedAt: { type: 'string', format: 'date-time' },
    finishedAt: { type: ['string', 'null'], format: 'date-time' },
    terminationReason: { type: 'string', enum: ['exit', 'skip', 'timeout', 'aborted', 'in-flight'] },
    substeps: { type: 'array', items: substepSchema },
    agents: { type: 'array', items: anthropicAgentSchema },
  },
} as const;

const stepSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'startedAt', 'finishedAt', 'skippedAt', 'timedOutAt', 'iterations'],
  properties: {
    id: { type: 'string', enum: ['ideation', 'planning', 'execution', 'memorization'] },
    startedAt: { type: 'string', format: 'date-time' },
    finishedAt: { type: ['string', 'null'], format: 'date-time' },
    skippedAt: { type: ['string', 'null'], format: 'date-time' },
    timedOutAt: { type: ['string', 'null'], format: 'date-time' },
    iterations: { type: 'array', items: iterationSchema },
  },
} as const;

const sessionJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'schemaVersion',
    'sessionId',
    'projectId',
    'createdAt',
    'finishedAt',
    'gobbiVersion',
    'task',
  ],
  properties: {
    schemaVersion: { type: 'integer', const: 1 },
    sessionId: { type: 'string', minLength: 1 },
    projectId: { type: 'string', minLength: 1 },
    createdAt: { type: 'string', format: 'date-time' },
    finishedAt: { type: ['string', 'null'], format: 'date-time' },
    gobbiVersion: { type: 'string', minLength: 1 },
    task: { type: 'string' },
    steps: { type: 'array', items: stepSchema },
  },
} as const;

const projectJsonSessionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['sessionId', 'createdAt', 'finishedAt', 'task'],
  properties: {
    sessionId: { type: 'string', minLength: 1 },
    createdAt: { type: 'string', format: 'date-time' },
    finishedAt: { type: ['string', 'null'], format: 'date-time' },
    task: { type: 'string' },
    handoffSummary: { type: ['string', 'null'] },
  },
} as const;

const projectJsonGotchaSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['path', 'sha256', 'class', 'promotedAt', 'promotedFromSession'],
  properties: {
    path: { type: 'string', minLength: 1 },
    sha256: { type: 'string', minLength: 1 },
    class: { type: 'string', minLength: 1 },
    promotedAt: { type: 'string', format: 'date-time' },
    promotedFromSession: { type: 'string', minLength: 1 },
  },
} as const;

const projectJsonDecisionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'title', 'recordedAt', 'sessionId'],
  properties: {
    id: { type: 'string', minLength: 1 },
    title: { type: 'string', minLength: 1 },
    recordedAt: { type: 'string', format: 'date-time' },
    sessionId: { type: 'string', minLength: 1 },
  },
} as const;

const projectJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'schemaVersion',
    'projectName',
    'projectId',
    'sessions',
    'gotchas',
    'decisions',
    'learnings',
  ],
  properties: {
    schemaVersion: { type: 'integer', const: 1 },
    projectName: { type: 'string', minLength: 1 },
    projectId: { type: 'string', minLength: 1 },
    sessions: { type: 'array', items: projectJsonSessionSchema },
    gotchas: { type: 'array', items: projectJsonGotchaSchema },
    decisions: { type: 'array', items: projectJsonDecisionSchema },
    learnings: { type: 'array', items: projectJsonDecisionSchema },
  },
} as const;

/**
 * Compiled `SessionJson` validator. The schema literal is untyped (see the
 * inline-schema docblock above); the `as never` cast is the documented
 * fallback per `best.md:401` and `_schema/v1.ts:60-73` precedent. Runtime
 * narrowing is sound because the schema is the boundary contract — TS
 * cannot type-check the recursive AJV shape without an enormous expansion.
 */
export const validateSessionJson: ValidateFunction<SessionJson> =
  ajv.compile<SessionJson>(sessionJsonSchema as never);

export const validateProjectJson: ValidateFunction<ProjectJson> =
  ajv.compile<ProjectJson>(projectJsonSchema as never);

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

/**
 * Path to `.gobbi/projects/<projectName>/project.json` — git-tracked
 * cross-session memory.
 */
export function projectJsonPath(repoRoot: string, projectName: string): string {
  return path.join(projectDir(repoRoot, projectName), 'project.json');
}

/**
 * Path to `.gobbi/projects/<projectName>/sessions/<sessionId>/session.json`
 * — gitignored per-session telemetry.
 */
export function sessionJsonPath(
  repoRoot: string,
  projectName: string,
  sessionId: string,
): string {
  return path.join(sessionDir(repoRoot, projectName, sessionId), 'session.json');
}

// ---------------------------------------------------------------------------
// Read — defensive boundary parse
// ---------------------------------------------------------------------------

/**
 * Read and AJV-validate `session.json`. Returns `null` when the file is
 * absent (e.g., on a session that init'd before the JSON pivot). Throws
 * `ConfigCascadeError('parse', …)` on JSON parse failure or schema
 * violation — error messages name the file path for "remove or repair
 * manually" remediation, matching the `init.ts` precedent for malformed
 * `metadata.json`.
 */
export function readSessionJson(filePath: string): SessionJson | null {
  return readValidatedJson(filePath, validateSessionJson);
}

/**
 * Read and AJV-validate `project.json`. Returns `null` when the file is
 * absent. Throws `ConfigCascadeError('parse', …)` on malformed/invalid.
 */
export function readProjectJson(filePath: string): ProjectJson | null {
  return readValidatedJson(filePath, validateProjectJson);
}

function readValidatedJson<T>(
  filePath: string,
  validate: ValidateFunction<T>,
): T | null {
  if (!existsSync(filePath)) return null;

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ConfigCascadeError('read', `Failed to read ${filePath}: ${message}`, {
      path: filePath,
      cause: err,
    });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ConfigCascadeError('parse', `Invalid JSON in ${filePath}: ${message}`, {
      path: filePath,
      cause: err,
    });
  }

  if (!validate(parsed)) {
    const messages = formatAjvErrors(validate.errors);
    throw new ConfigCascadeError('parse', `Invalid ${filePath}:\n${messages}`, {
      path: filePath,
    });
  }

  return parsed;
}

// ---------------------------------------------------------------------------
// Write — atomic temp+rename, AJV-validate before write
// ---------------------------------------------------------------------------

/**
 * Atomically write a `SessionJson` to `filePath`. Validates against the
 * AJV schema first — refuses to write invalid bytes to disk.
 *
 * Insertion-order serialization (`JSON.stringify(value, null, 2)`) per
 * `canonical-json.ts:50-52`. Atomic temp+rename per `settings-io.ts:241-244`.
 *
 * Sort discipline lives at the call site — this writer does NOT sort. The
 * aggregator and upsert helpers handle sort order (lock 32).
 */
export function writeSessionJson(filePath: string, value: SessionJson): void {
  if (!validateSessionJson(value)) {
    const messages = formatAjvErrors(validateSessionJson.errors);
    throw new ConfigCascadeError(
      'parse',
      `Refusing to write invalid session.json:\n${messages}`,
      { path: filePath },
    );
  }
  atomicWriteJson(filePath, value);
}

/** Atomic write for `ProjectJson`. Same contract as `writeSessionJson`. */
export function writeProjectJson(filePath: string, value: ProjectJson): void {
  if (!validateProjectJson(value)) {
    const messages = formatAjvErrors(validateProjectJson.errors);
    throw new ConfigCascadeError(
      'parse',
      `Refusing to write invalid project.json:\n${messages}`,
      { path: filePath },
    );
  }
  atomicWriteJson(filePath, value);
}

function atomicWriteJson(filePath: string, value: unknown): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
  const payload = `${JSON.stringify(value, null, 2)}\n`;
  const tmpPath = `${filePath}.tmp`;
  writeFileSync(tmpPath, payload, 'utf8');
  renameSync(tmpPath, filePath);
}

// ---------------------------------------------------------------------------
// Stub writer — `gobbi workflow init` calls this with required-only fields
// ---------------------------------------------------------------------------

export interface WriteSessionStubArgs {
  readonly repoRoot: string;
  readonly projectName: string;
  readonly sessionId: string;
  readonly task: string;
  readonly gobbiVersion: string;
  readonly createdAt: string;
}

/**
 * Write the init-time `session.json` stub: the 6 required fields, no
 * `steps[]` (steps absent → reader convention "stub" per lock 43),
 * `finishedAt: null`. Idempotent — same input produces identical bytes.
 *
 * `projectId === projectName` today (post-rename per ideation lock 3); the
 * field name is retained for forward-compat with a future projectId surface
 * that may diverge from the on-disk project name.
 */
export function writeSessionStub(args: WriteSessionStubArgs): void {
  const { repoRoot, projectName, sessionId, task, gobbiVersion, createdAt } = args;
  const stub: SessionJson = {
    schemaVersion: 1,
    sessionId,
    projectId: projectName,
    createdAt,
    finishedAt: null,
    gobbiVersion,
    task,
  };
  const filePath = sessionJsonPath(repoRoot, projectName, sessionId);
  writeSessionJson(filePath, stub);
}

// ---------------------------------------------------------------------------
// Sort primitives — applied at writer call sites (lock 32)
// ---------------------------------------------------------------------------

function sortByCreatedAt<T extends { readonly createdAt: string }>(
  rows: readonly T[],
): readonly T[] {
  return [...rows].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function sortByPath<T extends { readonly path: string }>(
  rows: readonly T[],
): readonly T[] {
  return [...rows].sort((a, b) => a.path.localeCompare(b.path));
}

function sortByRecordedAt<T extends { readonly recordedAt: string }>(
  rows: readonly T[],
): readonly T[] {
  return [...rows].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));
}

// ---------------------------------------------------------------------------
// project.json upsert helpers
// ---------------------------------------------------------------------------

export interface UpsertProjectSessionArgs {
  readonly path: string;
  readonly entry: ProjectJsonSession;
  readonly projectName?: string;
  readonly projectId?: string;
}

/**
 * Insert or replace a `ProjectJsonSession` in `project.json.sessions[]`,
 * keyed by `sessionId`. If the file does not exist, creates a fresh
 * `ProjectJson` with `projectName` / `projectId` derived from
 * `args.projectName` / `args.projectId` (or `path.basename(dirname(path))`
 * if neither supplied).
 *
 * Sort by `createdAt` ASC; atomic write. Solo-user race acknowledged
 * (lock 42) — concurrent writers can drop one update.
 */
export function upsertProjectSession(args: UpsertProjectSessionArgs): void {
  const current = ensureProjectJson(args.path, args.projectName, args.projectId);
  const sessions = upsertById(current.sessions, args.entry, (s) => s.sessionId);
  const next: ProjectJson = {
    ...current,
    sessions: sortByCreatedAt(sessions),
  };
  writeProjectJson(args.path, next);
}

export interface UpsertProjectGotchaArgs {
  readonly path: string;
  readonly entry: ProjectJsonGotcha;
  readonly projectName?: string;
  readonly projectId?: string;
}

/**
 * Insert or replace a `ProjectJsonGotcha` in `project.json.gotchas[]`,
 * keyed by `path`. Writes a fresh `ProjectJson` if the file is absent.
 * Sort by `path` ASC; atomic write.
 */
export function upsertProjectGotcha(args: UpsertProjectGotchaArgs): void {
  const current = ensureProjectJson(args.path, args.projectName, args.projectId);
  const gotchas = upsertById(current.gotchas, args.entry, (g) => g.path);
  const next: ProjectJson = {
    ...current,
    gotchas: sortByPath(gotchas),
  };
  writeProjectJson(args.path, next);
}

function ensureProjectJson(
  filePath: string,
  projectName: string | undefined,
  projectId: string | undefined,
): ProjectJson {
  const existing = readProjectJson(filePath);
  if (existing !== null) return existing;
  const fallbackName = path.basename(path.dirname(filePath));
  return {
    schemaVersion: 1,
    projectName: projectName ?? fallbackName,
    projectId: projectId ?? projectName ?? fallbackName,
    sessions: [],
    gotchas: [],
    decisions: [],
    learnings: [],
  };
}

function upsertById<T>(
  rows: readonly T[],
  next: T,
  keyOf: (row: T) => string,
): readonly T[] {
  const key = keyOf(next);
  const filtered = rows.filter((row) => keyOf(row) !== key);
  return [...filtered, next];
}

// ---------------------------------------------------------------------------
// Memorization aggregator
// ---------------------------------------------------------------------------

export interface AggregateSessionJsonArgs {
  readonly store: ReadStore;
  readonly sessionId: string;
  readonly projectId: string;
  readonly createdAt: string;
  readonly gobbiVersion: string;
  readonly task: string;
  /**
   * Override for the parent directory containing `<sessionId>/subagents/`.
   * Defaults to `dirname($CLAUDE_TRANSCRIPT_PATH)` (Plan-eval Overall H1
   * primary discovery path). When unset and the env var is also unset, the
   * fallback glob under `~/.claude/projects/<encoded-cwd>/<sessionId>/`
   * runs; if both fail, agents emit `calls: []` + one-line stderr warning.
   */
  readonly transcriptDir?: string;
  /**
   * Optional override for the encoded cwd used in the fallback glob. When
   * absent, the glob walks every `~/.claude/projects/<dir>/` looking for a
   * matching `<sessionId>/subagents/` subdirectory.
   */
  readonly encodedCwd?: string;
  /**
   * Override for the `~/.claude` root used by the fallback glob. Test-only;
   * defaults to `process.env.HOME ?? '/'`.
   */
  readonly claudeHome?: string;
  /**
   * Optional terminal-event override for `finishedAt`. Memorization writes
   * before `workflow.finish` lands, so `finishedAt` is typically `null`
   * during the post-commit dispatch in T-2a.8.2. Tests can supply a value.
   */
  readonly finishedAt?: string | null;
}

/**
 * Build a fully-populated `SessionJson` from the workspace event store and
 * the per-subagent JSONL transcripts. Async because `buildAgentCalls` walks
 * JSONL streams (lock 33). Pure with respect to the caller — returns the
 * value, never writes.
 *
 * Algorithm:
 *
 *   1. Replay every event row partitioned by `sessionId`.
 *   2. Walk WORKFLOW step lifecycle events to build `steps[].iterations[]`
 *      with `terminationReason`.
 *   3. For each `delegation.spawn` event, build an `AgentEntry` with the
 *      JSONL-derived `calls[]`. Tokens roll up via SUM-fold (lock 34).
 *   4. Cost rolls up via `aggregateDelegationCosts` (lock 36).
 *   5. Lift agents into substeps (when present) or directly into the
 *      iteration's flat `agents[]` (memorization-style step shape).
 *   6. Sort every array by `seq` ASC (lock 32).
 */
export async function aggregateSessionJson(
  args: AggregateSessionJsonArgs,
): Promise<SessionJson> {
  const { store, sessionId, projectId, createdAt, gobbiVersion, task } = args;

  const allRows = store.replayAll();
  const rows = allRows.filter((row) => rowBelongsToSession(row, sessionId));

  const finishRow =
    rows.find((row) => row.type === 'workflow.finish') ??
    rows.find((row) => row.type === 'workflow.abort') ??
    null;
  const finishedAt =
    args.finishedAt !== undefined
      ? args.finishedAt
      : finishRow !== null
        ? finishRow.ts
        : null;

  // Build agent entries — keyed by subagentId.
  const costsBySubagent = buildCostsBySubagent(store);
  const agentMap = new Map<string, AnthropicAgentEntry>();
  for (const row of rows) {
    if (row.type === 'delegation.spawn') {
      const agent = await buildAgentFromSpawn(row, rows, costsBySubagent, args);
      if (agent !== null) {
        agentMap.set(agent.id, agent);
      }
    }
  }

  // Build steps with iterations + terminationReason. Substeps default to
  // a single empty axis if no substep events exist; agents lift to the
  // iteration's flat `agents[]` instead.
  const steps = buildSteps(rows, agentMap);

  return {
    schemaVersion: 1,
    sessionId,
    projectId,
    createdAt,
    finishedAt,
    gobbiVersion,
    task,
    steps,
  };
}

function rowBelongsToSession(row: EventRow, sessionId: string): boolean {
  // EventStore writes session_id on every v5+ row. Legacy rows (null) are
  // tolerated — if every row in the store is null, the aggregator yields
  // no agents, which is the documented degraded state.
  if (row.session_id === null) return true;
  return row.session_id === sessionId;
}

function buildCostsBySubagent(store: ReadStore): ReadonlyMap<string, number> {
  const acc = new Map<string, number>();
  let costs: readonly CostAggregateRow[];
  try {
    costs = store.aggregateDelegationCosts();
  } catch {
    return acc;
  }
  for (const cost of costs) {
    if (cost.subagentId === null) continue;
    const dollars = derivedCost(cost.tokensJson, cost.model);
    acc.set(cost.subagentId, (acc.get(cost.subagentId) ?? 0) + dollars);
  }
  return acc;
}

async function buildAgentFromSpawn(
  spawn: EventRow,
  rows: readonly EventRow[],
  costsBySubagent: ReadonlyMap<string, number>,
  args: AggregateSessionJsonArgs,
): Promise<AnthropicAgentEntry | null> {
  const spawnData = parseEventData(spawn);
  if (spawnData === null) return null;
  const subagentId = readString(spawnData['subagentId']);
  if (subagentId === null) return null;

  const completeRow = findCompleteOrFail(rows, subagentId);
  const completeData = completeRow !== null ? parseEventData(completeRow) : null;
  const failData =
    completeRow !== null && completeRow.type === 'delegation.fail' ? parseEventData(completeRow) : null;

  const calls = await buildAgentCalls({
    sessionId: args.sessionId,
    subagentId,
    spawnSeq: spawn.seq,
    ...(args.transcriptDir !== undefined ? { transcriptDir: args.transcriptDir } : {}),
    ...(args.encodedCwd !== undefined ? { encodedCwd: args.encodedCwd } : {}),
    ...(args.claudeHome !== undefined ? { claudeHome: args.claudeHome } : {}),
  });

  const tokensUsed = sumCallTokens(calls);
  const cacheHitRatio = computeCacheHitRatio(tokensUsed);

  const transcriptPath =
    failData !== null
      ? readString(failData['transcriptPath'])
      : completeData !== null
        ? readString(completeData['artifactPath'])
        : null;

  const sizeProxyBytes =
    completeData !== null ? readNumber(completeData['sizeProxyBytes']) : null;

  const outcome: DelegationOutcome | null =
    completeRow === null
      ? 'running'
      : completeRow.type === 'delegation.complete'
        ? 'complete'
        : 'fail';

  const startedAt = readString(spawnData['timestamp']);
  const finishedAt = completeRow !== null ? completeRow.ts : null;
  const claudeCodeVersion = readString(spawnData['claudeCodeVersion']);
  const name = readString(spawnData['agentType']) ?? subagentId;

  // Model — first non-null model from calls[] (Anthropic JSONL records the
  // model on every assistant line; first call wins).
  const model =
    calls.find((call): call is AnthropicAgentCallEntry & { model: string } =>
      typeof call.model === 'string' && call.model.length > 0,
    )?.model ?? null;

  const costUsd = costsBySubagent.get(subagentId) ?? null;

  return {
    provider: 'anthropic',
    id: subagentId,
    seq: spawn.seq,
    name,
    model,
    skillsLoaded: [],
    startedAt,
    finishedAt,
    outcome,
    costUsd,
    calls,
    claudeCodeVersion,
    transcriptPath,
    transcriptSha256: null,
    tokensUsed,
    cacheHitRatio,
    sizeProxyBytes,
  };
}

function findCompleteOrFail(
  rows: readonly EventRow[],
  subagentId: string,
): EventRow | null {
  for (const row of rows) {
    if (row.type !== 'delegation.complete' && row.type !== 'delegation.fail') {
      continue;
    }
    const data = parseEventData(row);
    if (data === null) continue;
    if (data['subagentId'] === subagentId) return row;
  }
  return null;
}

function parseEventData(row: EventRow): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(row.data);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readString(value: unknown): string | null {
  return isString(value) && value !== '' ? value : null;
}

function readNumber(value: unknown): number | null {
  return isNumber(value) && Number.isFinite(value) ? value : null;
}

function sumCallTokens(
  calls: readonly AnthropicAgentCallEntry[],
): AnthropicTokensUsed | null {
  if (calls.length === 0) return null;
  let any = false;
  let inputTokens = 0;
  let outputTokens = 0;
  let cacheReadTokens = 0;
  let cacheCreationTokens = 0;
  for (const call of calls) {
    if (typeof call.inputTokens === 'number') {
      inputTokens += call.inputTokens;
      any = true;
    }
    if (typeof call.outputTokens === 'number') {
      outputTokens += call.outputTokens;
      any = true;
    }
    if (typeof call.cacheReadTokens === 'number') {
      cacheReadTokens += call.cacheReadTokens;
      any = true;
    }
    if (typeof call.cacheCreationTokens === 'number') {
      cacheCreationTokens += call.cacheCreationTokens;
      any = true;
    }
  }
  if (!any) return null;
  return {
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    cache_read_input_tokens: cacheReadTokens,
    cache_creation_input_tokens: cacheCreationTokens,
  };
}

function computeCacheHitRatio(tokens: AnthropicTokensUsed | null): number | null {
  if (tokens === null) return null;
  if (tokens.input_tokens <= 0) return null;
  return tokens.cache_read_input_tokens / tokens.input_tokens;
}

// ---------------------------------------------------------------------------
// Step-and-iteration builder
// ---------------------------------------------------------------------------

const PRODUCTIVE_STEPS = ['ideation', 'planning', 'execution', 'memorization'] as const;

type ProductiveStep = (typeof PRODUCTIVE_STEPS)[number];

function buildSteps(
  rows: readonly EventRow[],
  agentMap: ReadonlyMap<string, AnthropicAgentEntry>,
): readonly StepEntry[] {
  const out: StepEntry[] = [];
  for (const stepId of PRODUCTIVE_STEPS) {
    const stepRows = rows.filter((row) => row.step === stepId);
    if (stepRows.length === 0) continue;

    const startedAt = stepRows[0]?.ts ?? null;
    const exitRow = stepRows.find((row) => row.type === 'workflow.step.exit') ?? null;
    const skipRow = stepRows.find((row) => row.type === 'workflow.step.skip') ?? null;
    const timeoutRow = stepRows.find((row) => row.type === 'workflow.step.timeout') ?? null;
    const abortRow = stepRows.find((row) => row.type === 'workflow.abort') ?? null;

    const finishedAt =
      exitRow !== null
        ? exitRow.ts
        : abortRow !== null
          ? abortRow.ts
          : null;

    const iterations = buildIterations(stepId, stepRows, agentMap);

    if (startedAt === null) continue;

    out.push({
      id: stepId,
      startedAt,
      finishedAt,
      skippedAt: skipRow !== null ? skipRow.ts : null,
      timedOutAt: timeoutRow !== null ? timeoutRow.ts : null,
      iterations,
    });
  }
  return out;
}

function buildIterations(
  stepId: ProductiveStep,
  stepRows: readonly EventRow[],
  agentMap: ReadonlyMap<string, AnthropicAgentEntry>,
): readonly IterationEntry[] {
  // v1 simple iteration model: one round per step. The state machine
  // currently emits one terminal event per step, so this is faithful.
  // When loop iterations land (Wave D.1), this builder grows a round
  // splitter; the schema accepts the wider shape unchanged.
  const exit = stepRows.find((row) => row.type === 'workflow.step.exit') ?? null;
  const skip = stepRows.find((row) => row.type === 'workflow.step.skip') ?? null;
  const timeout = stepRows.find((row) => row.type === 'workflow.step.timeout') ?? null;
  const abort = stepRows.find((row) => row.type === 'workflow.abort') ?? null;

  const startedAt = stepRows[0]?.ts ?? null;
  if (startedAt === null) return [];

  const terminal = exit ?? skip ?? timeout ?? abort;
  const finishedAt = terminal !== null ? terminal.ts : null;

  let terminationReason: TerminationReason;
  if (exit !== null) terminationReason = 'exit';
  else if (skip !== null) terminationReason = 'skip';
  else if (timeout !== null) terminationReason = 'timeout';
  else if (abort !== null) terminationReason = 'aborted';
  else terminationReason = 'in-flight';

  // Lift agents directly under the iteration when no substep axis is
  // detected. v1 does not emit substep markers; substeps[] stays absent.
  const agents = collectAgentsForStep(stepRows, agentMap);

  if (agents.length === 0) {
    return [
      {
        round: 0,
        startedAt,
        finishedAt,
        terminationReason,
      },
    ];
  }

  return [
    {
      round: 0,
      startedAt,
      finishedAt,
      terminationReason,
      agents,
    },
  ];
}

function collectAgentsForStep(
  stepRows: readonly EventRow[],
  agentMap: ReadonlyMap<string, AnthropicAgentEntry>,
): readonly AnthropicAgentEntry[] {
  const seen = new Set<string>();
  const out: AnthropicAgentEntry[] = [];
  for (const row of stepRows) {
    if (row.type !== 'delegation.spawn') continue;
    const data = parseEventData(row);
    if (data === null) continue;
    const subagentId = readString(data['subagentId']);
    if (subagentId === null) continue;
    if (seen.has(subagentId)) continue;
    seen.add(subagentId);
    const agent = agentMap.get(subagentId);
    if (agent !== undefined) {
      out.push(agent);
    }
  }
  return out.sort((a, b) => a.seq - b.seq);
}

// ---------------------------------------------------------------------------
// JSONL transcript walker — buildAgentCalls
// ---------------------------------------------------------------------------

export interface BuildAgentCallsArgs {
  readonly sessionId: string;
  readonly subagentId: string;
  readonly spawnSeq: number;
  readonly transcriptDir?: string;
  readonly encodedCwd?: string;
  readonly claudeHome?: string;
}

/**
 * Walk the per-subagent JSONL transcript and build a list of
 * `AgentCallEntry` rows — one per assistant message line. Discovery order:
 *
 *   1. `args.transcriptDir/<sessionId>/subagents/agent-<subagentId>.jsonl`
 *   2. `dirname($CLAUDE_TRANSCRIPT_PATH)/<sessionId>/subagents/agent-<subagentId>.jsonl`
 *   3. fallback glob: `<claudeHome>/.claude/projects/*\/<sessionId>/subagents/agent-<subagentId>.jsonl`
 *
 * If none of the above resolves, returns `[]` and emits a one-line stderr
 * warning. Best-effort by design — older transcripts may have been GC'd.
 *
 * The `seq` field on each call is offset from `spawnSeq + 1 + turnIndex` so
 * cross-array sort is deterministic — calls inside one agent always sort
 * after the spawn event and in turn order.
 */
export async function buildAgentCalls(
  args: BuildAgentCallsArgs,
): Promise<readonly AnthropicAgentCallEntry[]> {
  const transcriptPath = resolveTranscriptPath(args);
  if (transcriptPath === null) {
    process.stderr.write(
      `[json-memory] no transcript found for subagent ${args.subagentId} in session ${args.sessionId}\n`,
    );
    return [];
  }

  const calls: AnthropicAgentCallEntry[] = [];
  let turnIndex = 0;
  for await (const line of parseJsonlFile(transcriptPath)) {
    if (!isRecord(line)) continue;
    if (line['type'] !== 'assistant') continue;
    const message = line['message'];
    if (!isRecord(message)) continue;

    const usage = isRecord(message['usage']) ? message['usage'] : null;
    const stopReason = readString(message['stop_reason']);
    const requestId = readString(line['requestId']);
    const ts = readString(line['timestamp']);
    const model = readString(message['model']);

    calls.push({
      seq: args.spawnSeq + 1 + turnIndex,
      turnIndex,
      model,
      ts,
      stopReason,
      requestId,
      inputTokens: usage !== null ? readNumber(usage['input_tokens']) : null,
      outputTokens: usage !== null ? readNumber(usage['output_tokens']) : null,
      cacheReadTokens: usage !== null ? readNumber(usage['cache_read_input_tokens']) : null,
      cacheCreationTokens: usage !== null ? readNumber(usage['cache_creation_input_tokens']) : null,
    });
    turnIndex += 1;
  }

  // Already in transcript-line order; explicit sort is a no-op insurance
  // against generator interleaving (currently impossible, but cheap).
  return calls.sort((a, b) => a.turnIndex - b.turnIndex);
}

function resolveTranscriptPath(args: BuildAgentCallsArgs): string | null {
  const fileName = `agent-${args.subagentId}.jsonl`;

  // Primary: explicit transcriptDir override.
  if (args.transcriptDir !== undefined && args.transcriptDir !== '') {
    const candidate = path.join(args.transcriptDir, args.sessionId, 'subagents', fileName);
    if (existsSync(candidate)) return candidate;
  }

  // Secondary: dirname($CLAUDE_TRANSCRIPT_PATH)
  const envTranscriptPath = process.env['CLAUDE_TRANSCRIPT_PATH'];
  if (envTranscriptPath !== undefined && envTranscriptPath !== '') {
    const envDir = path.dirname(envTranscriptPath);
    const candidate = path.join(envDir, args.sessionId, 'subagents', fileName);
    if (existsSync(candidate)) return candidate;
  }

  // Fallback glob: ~/.claude/projects/<encoded>/<sessionId>/subagents/agent-<id>.jsonl
  const home = args.claudeHome ?? process.env['HOME'] ?? '';
  if (home === '') return null;
  const projectsRoot = path.join(home, '.claude', 'projects');
  if (!existsSync(projectsRoot)) return null;

  if (args.encodedCwd !== undefined && args.encodedCwd !== '') {
    const candidate = path.join(
      projectsRoot,
      args.encodedCwd,
      args.sessionId,
      'subagents',
      fileName,
    );
    if (existsSync(candidate)) return candidate;
    return null;
  }

  // Walk every encoded-cwd dir looking for the matching session subdir.
  let entries: readonly string[];
  try {
    entries = readdirSync(projectsRoot);
  } catch {
    return null;
  }
  for (const entry of entries) {
    const candidate = path.join(projectsRoot, entry, args.sessionId, 'subagents', fileName);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Provider-discriminant exhaustiveness helper
// ---------------------------------------------------------------------------

/**
 * Compile-time exhaustiveness gate for `agent.provider`. Every consumer that
 * branches on the discriminant MUST end its switch with a call to
 * `assertNeverProvider(agent)` so widening the union to `'codex'` fails to
 * compile at every reader (Architecture H1, lock 41).
 *
 * Local to this module — not re-exported from a shared helpers file —
 * so the call site reads as part of the json-memory contract rather than
 * as a generic utility.
 */
export function assertNeverProvider(value: never): never {
  throw new Error(
    `json-memory: unreachable agent provider — ${JSON.stringify(value)}`,
  );
}
