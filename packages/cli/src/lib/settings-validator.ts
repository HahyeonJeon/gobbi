/**
 * Single AJV validator for the unified {@link Settings} shape.
 *
 * `ajv.compile<Settings>(settingsSchema)` with `JSONSchemaType<Settings>`
 * derivation type-checks cleanly under the project's strict flags
 * (`strict: true`, `noUncheckedIndexedAccess: true`,
 * `exactOptionalPropertyTypes: true`). One validator covers every level.
 *
 * `additionalProperties: false` at every object level rejects unknown keys
 * at write time. `gobbi config set` validates the mutated tree before
 * atomic write and exits 2 on failure.
 *
 * Cross-field checks (e.g. `git.pr.open === true` requires a non-null
 * `git.baseBranch`) are enforced post-merge in
 * `settings-io.ts::resolveSettings`, NOT here — they depend on cascaded
 * state, not single-file state.
 */

import Ajv2020, { type JSONSchemaType } from 'ajv/dist/2020.js';

import type { Settings } from './settings.js';

// Literal enum lists — kept inline so the compiled validator is self-contained
// and AJV sees exact string tuples. Changing a union in `settings.ts` requires
// updating the matching enum here; the `JSONSchemaType<Settings>` inference
// surfaces any drift as a TypeScript compile error.
const NOTIFY_EVENT_ENUM = [
  'workflow.start',
  'workflow.complete',
  'step.start',
  'step.complete',
  'subagent.spawn',
  'subagent.complete',
  'eval.findings',
  'error',
] as const;

// Mirrors `HookTrigger` in `settings.ts`. Listed in the same target-state
// §4.4 canonical order so the AJV schema diff matches a manual scan of the
// TypeScript union — drift surfaces as a `JSONSchemaType<Settings>` error.
//
// Exported so user-facing commands (e.g., `gobbi notify configure --enable
// <event>`) can validate event-name inputs against the same canonical list
// the AJV schema enforces. Iteration order is the canonical enum order
// shared with `HookTrigger` in `settings.ts`.
export const HOOK_TRIGGER_ENUM = [
  // Session lifecycle
  'SessionStart',
  'SessionEnd',
  'Stop',
  'StopFailure',
  // Prompt lifecycle
  'UserPromptSubmit',
  'UserPromptExpansion',
  // Tool lifecycle
  'PreToolUse',
  'PostToolUse',
  'PostToolUseFailure',
  'PostToolBatch',
  // Permission
  'PermissionRequest',
  'PermissionDenied',
  // Notification
  'Notification',
  // Subagent / task
  'SubagentStart',
  'SubagentStop',
  'TaskCreated',
  'TaskCompleted',
  'TeammateIdle',
  // Compaction
  'PreCompact',
  'PostCompact',
  // Worktree
  'WorktreeCreate',
  'WorktreeRemove',
  // Workspace
  'FileChanged',
  'CwdChanged',
  'InstructionsLoaded',
  // Config
  'ConfigChange',
  // Elicitation
  'Elicitation',
  'ElicitationResult',
] as const;

const AGENT_MODEL_ENUM = ['opus', 'sonnet', 'haiku', 'auto'] as const;
const AGENT_EFFORT_ENUM = ['low', 'medium', 'high', 'max', 'auto'] as const;

const DISCUSS_MODE_ENUM = ['agent', 'user', 'auto', 'skip'] as const;
const EVALUATE_MODE_ENUM = ['ask', 'always', 'skip', 'auto'] as const;

// PR-FIN-1e: shared `AgentConfig` sub-schema used by `StepSettings.agent`,
// `StepDiscuss.agent`, and `StepEvaluate.agent`. Hoisting keeps the three
// AJV sites byte-identical so a future enum widening only edits one spot.
//
// Not annotated with `JSONSchemaType<AgentConfig>` — that annotation collides
// with `exactOptionalPropertyTypes: true` when the constant is reused at
// optional-property positions on the outer `JSONSchemaType<Settings>` schema
// (the `T | undefined` discriminant on optional fields rejects a
// `JSONSchemaType<T>`-typed constant). Drift safety holds because the outer
// `settingsSchema: JSONSchemaType<Settings>` annotation type-checks every
// inline use of `agentConfigSchema` against the matching `AgentConfig`
// property on `Settings` — the same pattern as `_schema/v1.ts:60-73`.
const agentConfigSchema = {
  type: 'object',
  nullable: true,
  additionalProperties: false,
  properties: {
    model: { type: 'string', nullable: true, enum: [...AGENT_MODEL_ENUM] },
    effort: { type: 'string', nullable: true, enum: [...AGENT_EFFORT_ENUM] },
  },
} as const;

// ---------------------------------------------------------------------------
// Schema — single AJV JSONSchemaType<Settings>
// ---------------------------------------------------------------------------

const settingsSchema: JSONSchemaType<Settings> = {
  type: 'object',
  required: ['schemaVersion'],
  additionalProperties: false,
  properties: {
    schemaVersion: { type: 'integer', const: 1 },
    workflow: {
      type: 'object',
      nullable: true,
      additionalProperties: false,
      properties: {
        ideation: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            discuss: {
              type: 'object',
              nullable: true,
              additionalProperties: false,
              properties: {
                mode: { type: 'string', nullable: true, enum: [...DISCUSS_MODE_ENUM] },
                agent: agentConfigSchema,
              },
            },
            agent: agentConfigSchema,
            evaluate: {
              type: 'object',
              nullable: true,
              additionalProperties: false,
              properties: {
                mode: { type: 'string', nullable: true, enum: [...EVALUATE_MODE_ENUM] },
                agent: agentConfigSchema,
              },
            },
            maxIterations: { type: 'integer', nullable: true, minimum: 1 },
          },
        },
        planning: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            discuss: {
              type: 'object',
              nullable: true,
              additionalProperties: false,
              properties: {
                mode: { type: 'string', nullable: true, enum: [...DISCUSS_MODE_ENUM] },
                agent: agentConfigSchema,
              },
            },
            agent: agentConfigSchema,
            evaluate: {
              type: 'object',
              nullable: true,
              additionalProperties: false,
              properties: {
                mode: { type: 'string', nullable: true, enum: [...EVALUATE_MODE_ENUM] },
                agent: agentConfigSchema,
              },
            },
            maxIterations: { type: 'integer', nullable: true, minimum: 1 },
          },
        },
        execution: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            discuss: {
              type: 'object',
              nullable: true,
              additionalProperties: false,
              properties: {
                mode: { type: 'string', nullable: true, enum: [...DISCUSS_MODE_ENUM] },
                agent: agentConfigSchema,
              },
            },
            agent: agentConfigSchema,
            evaluate: {
              type: 'object',
              nullable: true,
              additionalProperties: false,
              properties: {
                mode: { type: 'string', nullable: true, enum: [...EVALUATE_MODE_ENUM] },
                agent: agentConfigSchema,
              },
            },
            maxIterations: { type: 'integer', nullable: true, minimum: 1 },
          },
        },
        // PR-FIN-2a-i T-2a.7: memorization step gains its own settings slot
        // mirroring `execution` exactly so `gobbi config set
        // workflow.memorization.evaluate.mode <mode>` writes a valid file.
        // Required for the new `memorization → memorization_eval` graph
        // transition to be reachable end-to-end through the cascade.
        memorization: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            discuss: {
              type: 'object',
              nullable: true,
              additionalProperties: false,
              properties: {
                mode: { type: 'string', nullable: true, enum: [...DISCUSS_MODE_ENUM] },
                agent: agentConfigSchema,
              },
            },
            agent: agentConfigSchema,
            evaluate: {
              type: 'object',
              nullable: true,
              additionalProperties: false,
              properties: {
                mode: { type: 'string', nullable: true, enum: [...EVALUATE_MODE_ENUM] },
                agent: agentConfigSchema,
              },
            },
            maxIterations: { type: 'integer', nullable: true, minimum: 1 },
          },
        },
        // PR-CFM-C T4: dormant gate for the `step.advancement.observed`
        // PostToolUse emitter (#197). Default `false`; T5 wires the
        // emitter to read this value via `resolveSettings()`. Schema
        // mirrors `additionalProperties: false` discipline at every
        // nest level — sibling memorization slot is the structural model.
        observability: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            advancement: {
              type: 'object',
              nullable: true,
              additionalProperties: false,
              properties: {
                enabled: { type: 'boolean', nullable: true },
              },
            },
          },
        },
      },
    },
    notify: {
      type: 'object',
      nullable: true,
      additionalProperties: false,
      properties: {
        slack: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            enabled: { type: 'boolean', nullable: true },
            events: {
              type: 'array',
              nullable: true,
              items: { type: 'string', enum: [...NOTIFY_EVENT_ENUM] },
            },
            triggers: {
              type: 'array',
              nullable: true,
              items: { type: 'string', enum: [...HOOK_TRIGGER_ENUM] },
            },
            channel: { type: 'string', nullable: true },
          },
        },
        telegram: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            enabled: { type: 'boolean', nullable: true },
            events: {
              type: 'array',
              nullable: true,
              items: { type: 'string', enum: [...NOTIFY_EVENT_ENUM] },
            },
            triggers: {
              type: 'array',
              nullable: true,
              items: { type: 'string', enum: [...HOOK_TRIGGER_ENUM] },
            },
            chatId: { type: 'string', nullable: true },
          },
        },
        discord: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            enabled: { type: 'boolean', nullable: true },
            events: {
              type: 'array',
              nullable: true,
              items: { type: 'string', enum: [...NOTIFY_EVENT_ENUM] },
            },
            triggers: {
              type: 'array',
              nullable: true,
              items: { type: 'string', enum: [...HOOK_TRIGGER_ENUM] },
            },
            webhookName: { type: 'string', nullable: true },
          },
        },
        desktop: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            enabled: { type: 'boolean', nullable: true },
            events: {
              type: 'array',
              nullable: true,
              items: { type: 'string', enum: [...NOTIFY_EVENT_ENUM] },
            },
            triggers: {
              type: 'array',
              nullable: true,
              items: { type: 'string', enum: [...HOOK_TRIGGER_ENUM] },
            },
          },
        },
      },
    },
    git: {
      type: 'object',
      nullable: true,
      additionalProperties: false,
      properties: {
        baseBranch: { type: 'string', nullable: true },
        issue: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            create: { type: 'boolean', nullable: true },
          },
        },
        worktree: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            autoRemove: { type: 'boolean', nullable: true },
          },
        },
        branch: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            autoRemove: { type: 'boolean', nullable: true },
          },
        },
        pr: {
          type: 'object',
          nullable: true,
          additionalProperties: false,
          properties: {
            open: { type: 'boolean', nullable: true },
            draft: { type: 'boolean', nullable: true },
          },
        },
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Compiled validator — one instance at module init, reused across calls.
// ---------------------------------------------------------------------------

const ajv = new Ajv2020({ strict: true, allErrors: true });

/**
 * The compiled AJV validator for {@link Settings}. Use as:
 *
 *   if (validateSettings(raw)) { // `raw` is now narrowed to `Settings` }
 *   else { const msg = formatAjvErrors(validateSettings.errors); }
 *
 * The single exported validator replaces Pass-3's two-schema dispatch
 * (`validateV1` + `validateV2`) — no per-version fork is needed because
 * the unified shape has no top-level discriminated union.
 */
export const validateSettings = ajv.compile<Settings>(settingsSchema);

/**
 * Pretty-print AJV error objects for surfacing through
 * {@link ConfigCascadeError} messages. Matches the format used by the
 * Pass-3 `formatAjvErrors` in `config-cascade.ts` and `project-config.ts`
 * so CLI error messages stay stable across the rewrite.
 */
export function formatAjvErrors(
  errors: readonly { instancePath?: string; message?: string }[] | null | undefined,
): string {
  const list = errors ?? [];
  return list
    .map(
      (e) =>
        `  ${e.instancePath !== undefined && e.instancePath !== '' ? e.instancePath : '<root>'}: ${e.message ?? 'unknown error'}`,
    )
    .join('\n');
}
