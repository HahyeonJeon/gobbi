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

const HOOK_TRIGGER_ENUM = [
  'PreToolUse',
  'PostToolUse',
  'Stop',
  'SubagentStop',
  'UserPromptSubmit',
  'Notification',
  'PreCompact',
  'SessionStart',
  'SessionEnd',
] as const;

const AGENT_MODEL_ENUM = ['opus', 'sonnet', 'haiku', 'auto'] as const;
const AGENT_EFFORT_ENUM = ['low', 'medium', 'high', 'max', 'auto'] as const;

const DISCUSS_MODE_ENUM = ['agent', 'user', 'auto', 'skip'] as const;
const EVALUATE_MODE_ENUM = ['ask', 'always', 'skip', 'auto'] as const;

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
                model: { type: 'string', nullable: true, enum: [...AGENT_MODEL_ENUM] },
                effort: { type: 'string', nullable: true, enum: [...AGENT_EFFORT_ENUM] },
              },
            },
            evaluate: {
              type: 'object',
              nullable: true,
              additionalProperties: false,
              properties: {
                mode: { type: 'string', nullable: true, enum: [...EVALUATE_MODE_ENUM] },
                model: { type: 'string', nullable: true, enum: [...AGENT_MODEL_ENUM] },
                effort: { type: 'string', nullable: true, enum: [...AGENT_EFFORT_ENUM] },
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
                model: { type: 'string', nullable: true, enum: [...AGENT_MODEL_ENUM] },
                effort: { type: 'string', nullable: true, enum: [...AGENT_EFFORT_ENUM] },
              },
            },
            evaluate: {
              type: 'object',
              nullable: true,
              additionalProperties: false,
              properties: {
                mode: { type: 'string', nullable: true, enum: [...EVALUATE_MODE_ENUM] },
                model: { type: 'string', nullable: true, enum: [...AGENT_MODEL_ENUM] },
                effort: { type: 'string', nullable: true, enum: [...AGENT_EFFORT_ENUM] },
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
                model: { type: 'string', nullable: true, enum: [...AGENT_MODEL_ENUM] },
                effort: { type: 'string', nullable: true, enum: [...AGENT_EFFORT_ENUM] },
              },
            },
            evaluate: {
              type: 'object',
              nullable: true,
              additionalProperties: false,
              properties: {
                mode: { type: 'string', nullable: true, enum: [...EVALUATE_MODE_ENUM] },
                model: { type: 'string', nullable: true, enum: [...AGENT_MODEL_ENUM] },
                effort: { type: 'string', nullable: true, enum: [...AGENT_EFFORT_ENUM] },
              },
            },
            maxIterations: { type: 'integer', nullable: true, minimum: 1 },
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
