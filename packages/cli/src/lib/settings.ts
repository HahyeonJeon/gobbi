/**
 * Unified `settings.json` schema — the single TypeScript shape for all three
 * settings levels (workspace / project / session) plus the built-in defaults.
 *
 * The unified three-level cascade: workspace, project, session. Each level
 * uses the same `Settings` shape; resolution folds session over project
 * over workspace via `deepMerge` (see `settings-io.ts::resolveSettings`)
 * with last-wins semantics (session > project > workspace > default).
 * Unknown keys fail validation at write time — see `settings-validator.ts`.
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
 * Claude Code hook events that gobbi can subscribe to via channel
 * `triggers` filters. Listed in target-state §4.4 canonical order
 * (lifecycle → prompt → tool → permission → notification → subagent/task →
 * compaction → worktree → workspace → config → elicitation).
 *
 * PR-FIN-1d.1 expanded the union from the original 9 values to all 28 known
 * Claude Code hook event names. Issue #219 (Phase 2 of PR-FIN-1d) wired
 * rich-message templates for the full 28-event surface in
 * `lib/notify.ts::renderHookMessage`. Per-event dispatch through the
 * generic stub is governed by `commands/hook/_stub.ts::STUB_DISPATCH_EVENTS`
 * — Tier-A events fire by default; Tier-B events (high-frequency
 * tool/file/cwd/prompt-expansion/elicitation) keep templates but are
 * excluded from default dispatch to avoid flooding.
 */
export type HookTrigger =
  // Session lifecycle
  | 'SessionStart'
  | 'SessionEnd'
  | 'Stop'
  | 'StopFailure'
  // Prompt lifecycle
  | 'UserPromptSubmit'
  | 'UserPromptExpansion'
  // Tool lifecycle
  | 'PreToolUse'
  | 'PostToolUse'
  | 'PostToolUseFailure'
  | 'PostToolBatch'
  // Permission
  | 'PermissionRequest'
  | 'PermissionDenied'
  // Notification
  | 'Notification'
  // Subagent / task
  | 'SubagentStart'
  | 'SubagentStop'
  | 'TaskCreated'
  | 'TaskCompleted'
  | 'TeammateIdle'
  // Compaction
  | 'PreCompact'
  | 'PostCompact'
  // Worktree
  | 'WorktreeCreate'
  | 'WorktreeRemove'
  // Workspace
  | 'FileChanged'
  | 'CwdChanged'
  | 'InstructionsLoaded'
  // Config
  | 'ConfigChange'
  // Elicitation
  | 'Elicitation'
  | 'ElicitationResult';

/**
 * Per-agent model + effort override for a workflow step.
 *
 * PR-FIN-1e introduced this nested shape — the prior flat
 * `{model, effort}` fields on `StepDiscuss` / `StepEvaluate` were lifted
 * into a sibling `agent` sub-object so the productive-step spawn surface
 * (`StepSettings.agent`) and the per-mode surfaces (`discuss.agent`,
 * `evaluate.agent`) share one uniform shape.
 *
 * `model: 'auto'` defers to `_delegation`'s model table and `effort:
 * 'auto'` defers to core-rule's max-effort policy. Concrete tiers
 * override unconditionally — no per-tier policy lookup at the loader
 * boundary.
 */
export interface AgentConfig {
  readonly model?: AgentModel;
  readonly effort?: AgentEffort;
}

/**
 * Discussion configuration for a workflow step.
 *
 *   - `mode: 'agent'` → delegate to a step-specific subagent (orchestrator
 *     picks PI innovative+best for ideation, planner for plan, executor for
 *     execution).
 *   - `mode: 'user'` → interactive discussion with the user.
 *   - `mode: 'auto'` → orchestrator decides based on context.
 *   - `mode: 'skip'` → no discussion.
 *   - `agent.{model,effort}` override the agent that the discussion mode
 *     spawns. Schema slot reserved for future discussion-agent spawn —
 *     not yet consumed by any spec.json. PR-FIN-1e shipped the schema;
 *     consumer wiring is a follow-up.
 */
export interface StepDiscuss {
  readonly mode?: 'agent' | 'user' | 'auto' | 'skip';
  readonly agent?: AgentConfig;
}

/**
 * Evaluation configuration for a workflow step.
 *
 *   - `mode: 'always'` → spawn evaluators without asking.
 *   - `mode: 'skip'` → do not spawn evaluators.
 *   - `mode: 'ask'` → prompt the user via AskUserQuestion at the eval
 *     checkpoint; translation helper converts the answer to boolean.
 *   - `mode: 'auto'` → orchestrator decides based on context.
 *   - `agent.{model,effort}` override the evaluator-perspective agents
 *     spawned for this step's eval-mode (`*_eval` substate).
 */
export interface StepEvaluate {
  readonly mode?: 'ask' | 'always' | 'skip' | 'auto';
  readonly agent?: AgentConfig;
}

export interface StepSettings {
  readonly discuss?: StepDiscuss;
  /**
   * Step-wide primary-spawn agent override (PI/executor for productive
   * steps). Applied at the spec-loader boundary to every entry of
   * `spec.delegation.agents[*]` for productive-step substates
   * (`ideation`, `planning`, `execution`). Eval-mode substates
   * (`*_eval`) read from `evaluate.agent` instead — see ideation §2.3.1
   * step-driven role-to-mode mapping.
   */
  readonly agent?: AgentConfig;
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
 * Observability sub-tree for the workflow step lifecycle. Currently the
 * only field is `advancement.enabled` — the dormant gate for the
 * `step.advancement.observed` PostToolUse emitter (PR-CFM-C / #197).
 *
 * Default (`enabled: false`) keeps the emitter inert; flipping the flag
 * to `true` activates the audit-only event path without touching the
 * reducer. The emitter itself lives at
 * `commands/workflow/capture-advancement.ts` and reads this gate via
 * `resolveSettings()` at the dispatcher boundary.
 */
export interface WorkflowObservabilityAdvancement {
  readonly enabled?: boolean;
}

export interface WorkflowObservability {
  readonly advancement?: WorkflowObservabilityAdvancement;
}

/**
 * Per-step config keyed by the workflow loop's name. Settings field name
 * and state-machine literal both align on `'planning'`. Callers that pass
 * the legacy `'plan'` literal fail at compile time.
 *
 * `memorization` (PR-FIN-2a-i T-2a.7) gates the optional `memorization →
 * memorization_eval` graph transition. When `memorization.evaluate.mode`
 * resolves to `'always'` (or `'ask'` with a true user answer / `'auto'`
 * with a true orchestrator decision) the workflow init pipeline stamps
 * `memorization: true` onto the `EVAL_DECIDE` event payload and the
 * reducer lands the boolean in `state.evalConfig.memorization`.
 *
 * `observability` (PR-CFM-C T4) holds dormant audit-emitter gates.
 */
export interface WorkflowSettings {
  readonly ideation?: StepSettings;
  readonly planning?: StepSettings;
  readonly execution?: StepSettings;
  readonly memorization?: StepSettings;
  readonly observability?: WorkflowObservability;
}

/**
 * Shared fields for every notification channel. Channel-specific routing
 * (Slack channel, Telegram chatId, Discord webhookName) is added per-channel
 * below. Desktop has no routing fields.
 *
 * Exported so the notify dispatcher can type its predicate parameter
 * against the common parent of `SlackChannel | TelegramChannel |
 * DiscordChannel | DesktopChannel` without duplicating the shape.
 */
export interface ChannelBase {
  readonly enabled?: boolean;
  /** Workflow events this channel fires on. Absent = all; `[]` = none. */
  readonly events?: readonly NotifyEvent[];
  /**
   * Claude Code hook events this channel fires on. Consumed by
   * `dispatchHookNotify` in `lib/notify.ts`. Absent = fire on all hook
   * events; `[]` = fire on none (silent); `[...]` = fire only when the
   * hook event matches.
   */
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
 * Git configuration (PR-FIN-1c reshape).
 *
 * Worktrees are always created for every task — there is no `mode` enum
 * controlling worktree-vs-direct-commit. PR opening and issue creation
 * are independent opt-in fields. Per-concern auto-remove flags live on
 * each sub-object that owns the concern (worktree, branch).
 *
 * Cross-field invariant (enforced post-cascade in
 * `settings-io.ts::resolveSettings`):
 *
 *   `git.pr.open === true` requires `git.baseBranch !== null`. A repo
 *   without a target branch (no GitHub remote, direct-commit-style
 *   workflow) must set `pr.open: false`.
 */
export interface GitSettings {
  /** PR target branch. `null` means no remote / no PR target. */
  readonly baseBranch?: string | null;
  /** Issue creation policy. */
  readonly issue?: { readonly create?: boolean };
  /** Worktree lifecycle policy (worktree itself is always created). */
  readonly worktree?: { readonly autoRemove?: boolean };
  /** Branch lifecycle policy. */
  readonly branch?: { readonly autoRemove?: boolean };
  /** Pull-request policy — `open` opt-in, `draft` formatting. */
  readonly pr?: {
    readonly open?: boolean;
    readonly draft?: boolean;
  };
}

/**
 * The unified settings shape. Written identically at every level
 * (`.gobbi/settings.json`, `.gobbi/projects/<name>/settings.json`,
 * `.gobbi/projects/<name>/sessions/<id>/settings.json`) — narrower levels
 * override wider ones during cascade resolution.
 *
 * `schemaVersion` is required and must equal `1`. Every section is
 * optional; absent sections delegate to the next-wider level (and finally
 * to {@link DEFAULTS}). Arrays replace on overlay (no concat, no dedup).
 *
 * PR-FIN-1c: `Settings.projects` (the multi-project registry) was removed.
 * Projects are now resolved by `basename(repoRoot)` plus an optional
 * `--project <name>` flag on each command; the directory tree under
 * `.gobbi/projects/` is the single source of truth for which projects
 * exist.
 */
export interface Settings {
  readonly schemaVersion: 1;
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
 *
 * `git.pr.open: true` — most users have a GitHub remote. Repos without one
 * (or operators preferring direct-commit-style flows) override per-workspace.
 * `git.baseBranch: null` — must be set explicitly when `pr.open === true`;
 * the cross-field check in `settings-io.ts::resolveSettings` enforces this.
 */
export const DEFAULTS: Settings = {
  schemaVersion: 1,
  workflow: {
    ideation: {
      discuss: { mode: 'user', agent: { model: 'auto', effort: 'auto' } },
      agent: { model: 'auto', effort: 'auto' },
      evaluate: { mode: 'always', agent: { model: 'auto', effort: 'auto' } },
      maxIterations: 3,
    },
    planning: {
      discuss: { mode: 'user', agent: { model: 'auto', effort: 'auto' } },
      agent: { model: 'auto', effort: 'auto' },
      evaluate: { mode: 'always', agent: { model: 'auto', effort: 'auto' } },
      maxIterations: 3,
    },
    execution: {
      discuss: { mode: 'agent', agent: { model: 'auto', effort: 'auto' } },
      agent: { model: 'auto', effort: 'auto' },
      evaluate: { mode: 'always', agent: { model: 'auto', effort: 'auto' } },
      maxIterations: 3,
    },
    memorization: {
      discuss: { mode: 'agent', agent: { model: 'auto', effort: 'auto' } },
      agent: { model: 'auto', effort: 'auto' },
      evaluate: { mode: 'always', agent: { model: 'auto', effort: 'auto' } },
      maxIterations: 3,
    },
    observability: { advancement: { enabled: false } },
  },
  notify: {
    slack: { enabled: false, events: [], triggers: [], channel: null },
    telegram: { enabled: false, events: [], triggers: [], chatId: null },
    discord: { enabled: false, events: [], triggers: [], webhookName: null },
    desktop: { enabled: false, events: [], triggers: [] },
  },
  git: {
    baseBranch: null,
    issue: { create: false },
    worktree: { autoRemove: true },
    branch: { autoRemove: true },
    pr: { open: true, draft: false },
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
 * Named `ConfigCascadeError` (not `SettingsError`) because catch paths in
 * `commands/config.ts` and other surfaces dispatch on this class name.
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
