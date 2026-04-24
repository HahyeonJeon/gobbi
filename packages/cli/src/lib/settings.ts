/**
 * Unified `settings.json` schema — the single TypeScript shape for all three
 * settings levels (workspace / project / session) plus the built-in defaults.
 *
 * Pass 3 finalization collapsed the Pass-3 split (T1 user-settings JSON +
 * T2 project-config JSON + T3 SQLite session rows + provenance) into a
 * single unified shape. Every level reads and writes the same interface;
 * `settings-io.ts::resolveSettings` composes them with last-wins semantics
 * (session > project > workspace > default). Unknown keys fail validation
 * at write time — see `settings-validator.ts`.
 *
 * ## Module boundary
 *
 *   - This module owns the type shape and defaults.
 *   - `settings-validator.ts` owns AJV validation against the shape.
 *   - `settings-io.ts` owns on-disk read/write + cascade resolution.
 *   - `ensure-settings-cascade.ts` owns legacy cleanup + default seeding.
 *
 * Keeping types here (no AJV import, no I/O) lets tests and cascade
 * consumers depend on the shape without pulling in AJV compile cost.
 */

import { isRecord } from './guards.js';

// ---------------------------------------------------------------------------
// Public types — Settings shape
// ---------------------------------------------------------------------------

/** Agent model override for a workflow step. `'auto'` defers to `_delegation` defaults. */
export type AgentModel = 'opus' | 'sonnet' | 'haiku' | 'auto';

/** Agent effort override for a workflow step. `'auto'` defers to core-rule defaults. */
export type AgentEffort = 'low' | 'medium' | 'high' | 'max' | 'auto';

/**
 * Events emitted by the gobbi workflow engine. Channels subscribe via
 * `notify.<channel>.events` — absent = all events; `[]` = none; `[...]` = exactly.
 */
export type NotifyEvent =
  | 'workflow.start'
  | 'workflow.complete'
  | 'step.start'
  | 'step.complete'
  | 'subagent.spawn'
  | 'subagent.complete'
  | 'eval.findings'
  | 'error';

/**
 * Claude Code hook events. Schema-only in this Pass — dispatch wiring to
 * register Claude Code hooks is deferred to a follow-up Pass. Shape is
 * reserved so future wiring does not bump the schema.
 */
export type HookTrigger =
  | 'PreToolUse'
  | 'PostToolUse'
  | 'Stop'
  | 'SubagentStop'
  | 'UserPromptSubmit'
  | 'Notification'
  | 'PreCompact'
  | 'SessionStart'
  | 'SessionEnd';

/**
 * Discussion configuration for a workflow step.
 *
 *   - `mode: 'agent'` → delegate to a step-specific subagent (orchestrator
 *     picks PI innovative+best for ideation, planner for plan, executor for
 *     execution).
 *   - `mode: 'user'` → interactive discussion with the user.
 *   - `mode: 'auto'` → orchestrator decides based on context.
 *   - `mode: 'skip'` → no discussion.
 *   - `model` + `effort` of `'auto'` defer to `_delegation`'s model table
 *     and core-rule's max-effort policy.
 */
export interface StepDiscuss {
  readonly mode?: 'agent' | 'user' | 'auto' | 'skip';
  readonly model?: AgentModel;
  readonly effort?: AgentEffort;
}

/**
 * Evaluation configuration for a workflow step.
 *
 *   - `mode: 'always'` → spawn evaluators without asking.
 *   - `mode: 'skip'` → do not spawn evaluators.
 *   - `mode: 'ask'` → prompt the user via AskUserQuestion at the eval
 *     checkpoint; translation helper converts the answer to boolean.
 *   - `mode: 'auto'` → orchestrator decides based on context.
 */
export interface StepEvaluate {
  readonly mode?: 'ask' | 'always' | 'skip' | 'auto';
  readonly model?: AgentModel;
  readonly effort?: AgentEffort;
}

export interface StepSettings {
  readonly discuss?: StepDiscuss;
  readonly evaluate?: StepEvaluate;
  /**
   * Per-step REVISE-loop iteration cap. Default `3` (matches
   * `state.maxFeedbackRounds` hardcode prior to this Pass).
   *
   * Schema-only this Pass — wiring to `state.maxFeedbackRounds`
   * initialization is deferred to a follow-up Pass that extends state to
   * carry per-step caps. See backlog.
   */
  readonly maxIterations?: number;
}

/**
 * Per-step config keyed by the workflow loop's name. Field name `planning`
 * matches `deterministic-orchestration.md` ("Planning Loop"); the
 * state-machine literal remains `'plan'` until a comprehensive rename
 * Pass — `resolveEvalDecision` accepts both for backward compatibility.
 */
export interface WorkflowSettings {
  readonly ideation?: StepSettings;
  readonly planning?: StepSettings;
  readonly execution?: StepSettings;
}

/**
 * Shared fields for every notification channel. Channel-specific routing
 * (Slack channel, Telegram chatId, Discord webhookName) is added per-channel
 * below. Desktop has no routing fields.
 */
interface ChannelBase {
  readonly enabled?: boolean;
  /** Workflow events this channel fires on. Absent = all; `[]` = none. */
  readonly events?: readonly NotifyEvent[];
  /** Claude Code hook events. Schema-only in this Pass. */
  readonly triggers?: readonly HookTrigger[];
}

export interface SlackChannel extends ChannelBase {
  readonly channel?: string | null;
}

export interface TelegramChannel extends ChannelBase {
  readonly chatId?: string | null;
}

export interface DiscordChannel extends ChannelBase {
  readonly webhookName?: string | null;
}

export type DesktopChannel = ChannelBase;

export interface NotifySettings {
  readonly slack?: SlackChannel;
  readonly telegram?: TelegramChannel;
  readonly discord?: DiscordChannel;
  readonly desktop?: DesktopChannel;
}

/**
 * Git workflow configuration. `worktree-pr` mode requires a non-null
 * `baseBranch` — the cross-field check in `settings-io.ts::resolveSettings`
 * enforces this post-cascade. `'auto'` defers the choice to the orchestrator
 * (main session agent) at workflow-decision time.
 */
export interface GitWorkflow {
  readonly mode?: 'direct-commit' | 'worktree-pr' | 'auto';
  readonly baseBranch?: string | null;
}

export interface GitPr {
  readonly draft?: boolean;
}

export interface GitCleanup {
  readonly worktree?: boolean;
  readonly branch?: boolean;
}

export interface GitSettings {
  readonly workflow?: GitWorkflow;
  readonly pr?: GitPr;
  readonly cleanup?: GitCleanup;
}

/**
 * Multi-project workspace registry. Identifies which project is currently
 * active and enumerates every project known to this workspace. Introduced
 * by gobbi-memory Pass 2 for the `.gobbi/projects/{name}/` redesign.
 *
 *   - `active: null` + `known: []` = fresh install, no project configured
 *     yet; the next `gobbi workflow init` triggers bootstrap.
 *   - `active: "name"` is expected to also appear in `known` (cross-field
 *     invariant enforced by a later wave — NOT in this schema pass).
 *
 * Both fields are required at the runtime/AJV level; callers that write
 * `projects` must supply both. The AJV sub-schema is declared as an
 * unannotated constant rather than `JSONSchemaType<ProjectsRegistry>`
 * because AJV's strict `JSONSchemaType` cannot express
 * required-plus-nullable fields cleanly (mirrors the `_schema/v1.ts`
 * subschema pattern). Drift safety is retained via the top-level
 * `JSONSchemaType<Settings>` annotation in `settings-validator.ts`.
 */
export interface ProjectsRegistry {
  readonly active: string | null;
  readonly known: readonly string[];
}

/**
 * The unified settings shape. Written identically at every level
 * (`.gobbi/settings.json`, `.gobbi/project/settings.json`,
 * `.gobbi/sessions/{id}/settings.json`) — narrower levels override wider
 * ones during cascade resolution.
 *
 * `schemaVersion` is required and must equal `1`. Every section is
 * optional; absent sections delegate to the next-wider level (and finally
 * to {@link DEFAULTS}). Arrays replace on overlay (no concat, no dedup).
 *
 * `projects` is required at schemaVersion 1 (additive from gobbi-memory
 * Pass 2) — the defaults carry `{active: null, known: []}` so every
 * existing on-disk file that omits the block surfaces a clean AJV error
 * pointing at the missing field, and `ensureSettingsCascade` bootstraps
 * the field on legacy files.
 */
export interface Settings {
  readonly schemaVersion: 1;
  readonly projects: ProjectsRegistry;
  readonly workflow?: WorkflowSettings;
  readonly notify?: NotifySettings;
  readonly git?: GitSettings;
}

/** Alias — after cascade merge the shape is fully the same as `Settings`. */
export type ResolvedSettings = Settings;

// ---------------------------------------------------------------------------
// Built-in defaults — the "default" tier of the cascade
// ---------------------------------------------------------------------------

/**
 * Built-in defaults applied when no level supplies a value. Every workflow
 * step defaults to `evaluate.mode: 'always'` — conservative, maximum
 * quality-checking. Downgrade per-step via workspace/project/session override.
 *
 * `discuss.execution.mode: 'agent'` — orchestrator delegates execution to
 * `__executor` subagents by default. Matches current implicit behaviour.
 *
 * `notify.*.events: []` means each channel fires on NO events until the user
 * opts in. Absent `events` would mean "all events" — the explicit empty-list
 * default keeps channels silent by default.
 */
export const DEFAULTS: Settings = {
  schemaVersion: 1,
  projects: { active: null, known: [] },
  workflow: {
    ideation: {
      discuss: { mode: 'user', model: 'auto', effort: 'auto' },
      evaluate: { mode: 'always', model: 'auto', effort: 'auto' },
      maxIterations: 3,
    },
    planning: {
      discuss: { mode: 'user', model: 'auto', effort: 'auto' },
      evaluate: { mode: 'always', model: 'auto', effort: 'auto' },
      maxIterations: 3,
    },
    execution: {
      discuss: { mode: 'agent', model: 'auto', effort: 'auto' },
      evaluate: { mode: 'always', model: 'auto', effort: 'auto' },
      maxIterations: 3,
    },
  },
  notify: {
    slack: { enabled: false, events: [], triggers: [], channel: null },
    telegram: { enabled: false, events: [], triggers: [], chatId: null },
    discord: { enabled: false, events: [], triggers: [], webhookName: null },
    desktop: { enabled: false, events: [], triggers: [] },
  },
  git: {
    workflow: { mode: 'direct-commit', baseBranch: null },
    pr: { draft: true },
    cleanup: { worktree: true, branch: true },
  },
};

// ---------------------------------------------------------------------------
// deepMerge — shared cascade merge primitive
// ---------------------------------------------------------------------------

/**
 * Deep-merge two plain-object trees. Right wins on leaves; arrays replace
 * (no concat); `null` on the right is a leaf and replaces the left value;
 * non-record values stop recursion; `undefined` on the right is skipped so
 * absent overlay keys do not clobber base values.
 *
 * Used by {@link Settings}-shaped trees but structurally generic — the
 * return type is cast to the template `T` after the merge completes.
 * Callers passing any `Record`-shaped overlay (e.g. a parsed
 * `Settings`, a `Partial<Settings>`, or a raw `unknown` from `JSON.parse`)
 * get back the merged result typed as `T`.
 */
export function deepMerge<T>(base: T, overlay: unknown): T {
  if (!isRecord(base) || !isRecord(overlay)) {
    return base;
  }

  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(overlay)) {
    const overlayValue = overlay[key];
    const baseValue = out[key];

    if (overlayValue === undefined) continue;

    if (isRecord(baseValue) && isRecord(overlayValue)) {
      out[key] = deepMerge(baseValue, overlayValue);
    } else {
      // Leaf write: primitives, null, arrays (replace), or overlay-added keys.
      out[key] = overlayValue;
    }
  }
  return out as T;
}

// ---------------------------------------------------------------------------
// ConfigCascadeError — cascade-specific error class
// ---------------------------------------------------------------------------

/** The settings level that asserted the failure, when known. */
export type SettingsLevel = 'workspace' | 'project' | 'session';

/**
 * Error class for settings-cascade failures. The `.code` field is a literal
 * union so catch blocks dispatch without string-matching, and the optional
 * `tier` / `path` fields carry the failure's provenance for CLI-layer
 * messages.
 *
 * Named `ConfigCascadeError` (not `SettingsError`) to preserve the
 * Pass-3 error-class identity — catch paths in `commands/config.ts` and
 * other surfaces dispatch on this class name.
 */
export class ConfigCascadeError extends Error {
  readonly code: 'read' | 'parse' | 'notFound';
  readonly tier?: SettingsLevel;
  readonly path?: string;

  constructor(
    code: 'read' | 'parse' | 'notFound',
    message: string,
    opts?: { tier?: SettingsLevel; path?: string; cause?: unknown },
  ) {
    super(message);
    this.name = 'ConfigCascadeError';
    this.code = code;
    // Under `exactOptionalPropertyTypes`, assign tier/path only when the
    // caller supplied them — never `this.tier = opts?.tier` which would
    // materialise the key with `undefined` on optional-tier errors.
    if (opts?.tier !== undefined) {
      this.tier = opts.tier;
    }
    if (opts?.path !== undefined) {
      this.path = opts.path;
    }
    if (opts?.cause !== undefined) {
      (this as { cause?: unknown }).cause = opts.cause;
    }
  }
}
