/**
 * StepSpec JSON Schema v1 — TypeScript binding + ajv validator.
 *
 * This module is the drift seam between `../types.ts` (the authoritative
 * TypeScript shape) and `./v1.json` (the authoritative JSON Schema document
 * consumed by external tooling). The `JSONSchemaType<StepSpec>` annotation
 * on `StepSpecSchema` below is the drift check: if `types.ts` and this
 * schema diverge in field shape, `tsc --noEmit` fails here, not at runtime.
 *
 * Authoritative spec source: `.claude/project/gobbi/design/v050-prompts.md`
 * §Spec Schema. JSON-Schema draft is 2020-12 (via `ajv/dist/2020.js`).
 *
 * Design notes:
 *
 * - Every TS optional field (e.g. `StepMeta.substates`) is declared
 *   `nullable: true` in the ajv binding. ajv's `Nullable<T>` helper requires
 *   this for any `T | undefined` field because JSON Schema has no first-
 *   class "undefined" — ajv models optionality via `required` omission +
 *   `nullable`. The runtime JSON files omit the property entirely rather
 *   than emitting `null`; `nullable: true` tells ajv both shapes are
 *   acceptable.
 * - Subschemas (`StepMeta`, `StepTransition`, `AgentConfig`, `TokenBudget`,
 *   `BlockContent`, `ConditionalBlock`, `StepCompletion`, `StepBlocks`,
 *   `StepDelegation`) are defined as reusable constants and registered in
 *   the top-level schema's `$defs`. Consumers that read the JSON file
 *   directly can dereference them via `$ref: '#/$defs/<Name>'`. Inside the
 *   TS binding, the top-level schema uses `$ref` at `properties.*`
 *   positions — ajv's `JSONSchemaType` accepts `$ref` there — and inlines
 *   the same subschema objects at array-`items` and `additionalProperties`
 *   positions where `JSONSchemaType` does not permit `$ref`. The inline
 *   path still points at the same shared constant, so there is no
 *   duplication.
 * - `additionalProperties: false` on every closed object. `noUncheckedIndexedAccess`
 *   + `exactOptionalPropertyTypes` in tsconfig enforces the TS side;
 *   `additionalProperties: false` enforces the JSON side.
 *
 * Runtime-only invariants (not expressible in pure JSON Schema):
 *
 * - `tokenBudget.{staticPrefix,session,instructions,artifacts,materials}`
 *   must sum to `1.0` (± 1e-6). Enforced by the custom ajv keyword
 *   `tokenBudgetSumEqualsOne` registered against the `TokenBudget`
 *   subschema — so the single `validate()` entry point reports the
 *   violation inline with other schema errors.
 * - Every `AgentConfig.blockRef` must name a key in `blocks.delegation`.
 *   Enforced by a post-validation pass inside `validateStepSpec()` —
 *   cross-property references are not expressible in pure JSON Schema.
 * - Every `StepTransition.condition` and `ConditionalBlock.when` must name
 *   a predicate registered in `workflow/predicates.ts`. B.3's codegen
 *   narrows these to a branded `PredicateName` type at compile time; for
 *   A.6 the schema only checks structural form (non-empty string). The
 *   seam for B.3's predicate-name validation is the commented placeholder
 *   in `validateStepSpec()` below.
 */

import Ajv2020, { type ErrorObject, type JSONSchemaType } from 'ajv/dist/2020.js';

import type { StepSpec } from '../types.js';

// ---------------------------------------------------------------------------
// Shared subschemas — each is defined once and referenced both by `$defs`
// (for external tooling readers of `v1.json`) and inline (at `items` and
// `additionalProperties` positions where ajv's `JSONSchemaType<>` does not
// accept `$ref`). Because they are the same constant object in both places,
// there is no duplication and no way for the two paths to drift.
//
// These constants are NOT annotated with `JSONSchemaType<Sub>`. The reason:
// `JSONSchemaType<Sub>` forbids extra index-signature values that do not
// match the strict shape, which collides with `$defs: Record<string,
// UncheckedJSONSchemaType<Known, true>>` under `exactOptionalPropertyTypes`.
// Drift safety still holds — the top-level `StepSpecSchema: JSONSchemaType<
// StepSpec>` annotation forces every subschema used inline in
// `StepSpecSchema` to match its TS counterpart, and every subschema is
// used inline at least once.
// ---------------------------------------------------------------------------

const StepMetaSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'description',
    'allowedAgentTypes',
    'maxParallelAgents',
    'requiredSkills',
    'optionalSkills',
    'expectedArtifacts',
    'completionSignal',
  ],
  properties: {
    description: { type: 'string', minLength: 1 },
    substates: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      nullable: true,
    },
    allowedAgentTypes: { type: 'array', items: { type: 'string', minLength: 1 } },
    maxParallelAgents: { type: 'integer', minimum: 0 },
    requiredSkills: { type: 'array', items: { type: 'string', minLength: 1 } },
    optionalSkills: { type: 'array', items: { type: 'string', minLength: 1 } },
    expectedArtifacts: { type: 'array', items: { type: 'string', minLength: 1 } },
    completionSignal: { type: 'string', minLength: 1 },
    timeoutMs: { type: 'integer', minimum: 0, nullable: true },
  },
} as const;

const StepTransitionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['to', 'condition'],
  properties: {
    to: { type: 'string', minLength: 1 },
    // `condition` is a predicate name. B.3's codegen will later narrow this
    // to a branded `PredicateName` literal union; for A.6 we only check
    // structural form (non-empty string). The branded-type check is the
    // seam documented in `validateStepSpec()` below.
    condition: { type: 'string', minLength: 1, pattern: '^[a-zA-Z][a-zA-Z0-9_]*$' },
    label: { type: 'string', minLength: 1, nullable: true },
  },
} as const;

const AgentConfigSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['role', 'modelTier', 'effort', 'skills', 'artifactTarget', 'blockRef'],
  properties: {
    role: { type: 'string', minLength: 1 },
    stance: { type: 'string', minLength: 1, nullable: true },
    modelTier: { type: 'string', enum: ['opus', 'sonnet', 'haiku'] },
    effort: { type: 'string', enum: ['max', 'high', 'medium'] },
    skills: { type: 'array', items: { type: 'string', minLength: 1 } },
    artifactTarget: { type: 'string', minLength: 1 },
    blockRef: { type: 'string', minLength: 1 },
  },
} as const;

const StepDelegationSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['agents'],
  properties: {
    agents: { type: 'array', items: AgentConfigSchema },
  },
} as const;

/**
 * TokenBudget — the sum-to-1 invariant is enforced by the
 * `tokenBudgetSumEqualsOne` custom keyword registered on the ajv instance
 * below. Declaring `tokenBudgetSumEqualsOne: true` in the schema tells ajv
 * to run the validator against values of this subschema.
 */
const TokenBudgetSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['staticPrefix', 'session', 'instructions', 'artifacts', 'materials'],
  properties: {
    staticPrefix: { type: 'number', minimum: 0, maximum: 1 },
    session: { type: 'number', minimum: 0, maximum: 1 },
    instructions: { type: 'number', minimum: 0, maximum: 1 },
    artifacts: { type: 'number', minimum: 0, maximum: 1 },
    materials: { type: 'number', minimum: 0, maximum: 1 },
  },
  tokenBudgetSumEqualsOne: true,
} as const;

const BlockContentSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'content'],
  properties: {
    id: { type: 'string', minLength: 1 },
    content: { type: 'string' },
    refs: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      nullable: true,
    },
  },
} as const;

const ConditionalBlockSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'content', 'when'],
  properties: {
    id: { type: 'string', minLength: 1 },
    content: { type: 'string' },
    when: { type: 'string', minLength: 1, pattern: '^[a-zA-Z][a-zA-Z0-9_]*$' },
    refs: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      nullable: true,
    },
  },
} as const;

const StepCompletionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['instruction', 'criteria'],
  properties: {
    instruction: { type: 'string', minLength: 1 },
    criteria: { type: 'array', items: { type: 'string', minLength: 1 } },
  },
} as const;

const StepBlocksSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['static', 'conditional', 'delegation', 'synthesis', 'completion'],
  properties: {
    static: { type: 'array', items: BlockContentSchema },
    conditional: { type: 'array', items: ConditionalBlockSchema },
    // `delegation` is a string-keyed record of BlockContent. JSON Schema
    // models this via `additionalProperties: <schema>` on an open-keyed
    // object. `required: []` keeps it open to any keys; the cross-reference
    // check in `validateStepSpec()` verifies each key is consumed by an
    // `AgentConfig.blockRef`.
    delegation: {
      type: 'object',
      required: [],
      additionalProperties: BlockContentSchema,
    },
    synthesis: { type: 'array', items: BlockContentSchema },
    completion: StepCompletionSchema,
  },
} as const;

// ---------------------------------------------------------------------------
// Top-level schema — the authoritative JSON Schema for a v1 `StepSpec`.
//
// This is what `./v1.json` mirrors (the drift test in `schema.test.ts`
// verifies the JSON file on disk matches `JSON.stringify(StepSpecSchema)`).
// External tooling reads `./v1.json`; internal TS consumers read
// `StepSpecSchema`.
// ---------------------------------------------------------------------------

export const STEP_SPEC_SCHEMA_ID = 'https://gobbi.dev/schemas/step-spec/v1.json';

export const StepSpecSchema: JSONSchemaType<StepSpec> = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: STEP_SPEC_SCHEMA_ID,
  title: 'Gobbi StepSpec v1',
  description:
    'Per-step spec.json shape. Mirrors the TypeScript `StepSpec` interface ' +
    'in `packages/cli/src/specs/types.ts`. The ajv `JSONSchemaType<StepSpec>` ' +
    'binding in `_schema/v1.ts` forces this schema and the TS interface to ' +
    'evolve together; any drift fails `tsc --noEmit`.',
  type: 'object',
  additionalProperties: false,
  required: [
    '$schema',
    'version',
    'meta',
    'transitions',
    'delegation',
    'tokenBudget',
    'blocks',
  ],
  properties: {
    // Per-file `$schema` URI — points at the JSON Schema document this spec
    // conforms to. Validated only as a non-empty string; format/URI
    // validation is deliberately not enforced for A.6 (see deviations).
    $schema: { type: 'string', minLength: 1 },
    version: { type: 'integer', const: 1 },
    // Subschemas are inlined via the shared constants above, NOT via
    // `$ref: '#/$defs/...'`. The `$defs` block below still publishes the
    // subschemas for external JSON-Schema tooling that prefers named
    // dereferencing, but the TS binding validates against the inline forms.
    // Rationale: ajv's `JSONSchemaType<StepSpec>` derives `$defs` values
    // from its internal `Known` shape, which rejects schemas that use
    // `nullable: true` on optional fields (our `refs`, `substates`, `label`,
    // `timeoutMs`, `stance` all need this). Inlining the shared constants
    // keeps single-source-of-truth (the same object is used in both
    // positions) while preserving drift safety: each subschema is
    // referenced inline at least once under the `JSONSchemaType<StepSpec>`
    // annotation, so `types.ts` / schema divergence still fails
    // `tsc --noEmit` at the top-level constant.
    meta: StepMetaSchema,
    transitions: { type: 'array', items: StepTransitionSchema },
    delegation: StepDelegationSchema,
    tokenBudget: TokenBudgetSchema,
    blocks: StepBlocksSchema,
  },
  // `$defs` is not required for ajv to resolve anything (we inline above),
  // but publishing it makes the generated `v1.json` discoverable to
  // external tooling (e.g., editor JSON-Schema plugins) that prefers named
  // dereferencing via `$ref: '#/$defs/StepMeta'`. It is cast via the
  // untyped `[keyword: string]: any` escape hatch on ajv's schema type to
  // bypass the `Known` constraint on `$defs` entries that bans `nullable:
  // true`. This is safe because the inline usage above is what the
  // compiler actually validates against — `$defs` here is documentation.
  ['$defs' as string]: {
    StepMeta: StepMetaSchema,
    StepTransition: StepTransitionSchema,
    AgentConfig: AgentConfigSchema,
    StepDelegation: StepDelegationSchema,
    TokenBudget: TokenBudgetSchema,
    BlockContent: BlockContentSchema,
    ConditionalBlock: ConditionalBlockSchema,
    StepCompletion: StepCompletionSchema,
    StepBlocks: StepBlocksSchema,
  },
};

// ---------------------------------------------------------------------------
// ajv instance + compiled validator
//
// - `strict: true` catches unknown keywords in schemas, malformed types, and
//   missing definitions. Required by the A.6 briefing.
// - `allErrors: true` collects every violation, not just the first. The
//   validator is intended for author-time checks (`gobbi workflow validate`
//   from B.4), where a full list beats a single error.
// - `Ajv2020` wires draft 2020-12 support (needed for `$defs`, `const`, etc.).
// ---------------------------------------------------------------------------

export const ajv = new Ajv2020({
  strict: true,
  allErrors: true,
});

// Tolerance for the tokenBudget sum-to-1 invariant. Matches the comment in
// `types.ts::TokenBudget` ("sum === 1.0 (± 1e-6)"). Floating-point addition
// of five decimal values can drift by a few ULP; 1e-6 is orders of magnitude
// below meaningful budget granularity.
const TOKEN_BUDGET_SUM_EPSILON = 1e-6;

ajv.addKeyword({
  keyword: 'tokenBudgetSumEqualsOne',
  type: 'object',
  schemaType: 'boolean',
  error: {
    message:
      'tokenBudget proportions must sum to 1.0 ' +
      `(± ${TOKEN_BUDGET_SUM_EPSILON})`,
  },
  validate: function tokenBudgetSumEqualsOne(
    schemaValue: boolean,
    data: unknown,
  ): boolean {
    if (!schemaValue) return true;
    if (data === null || typeof data !== 'object') return false;
    const budget = data as Record<string, unknown>;
    const keys = ['staticPrefix', 'session', 'instructions', 'artifacts', 'materials'] as const;
    let sum = 0;
    for (const key of keys) {
      const v = budget[key];
      if (typeof v !== 'number' || !Number.isFinite(v)) {
        // Per-field type errors surface via the main schema; this keyword
        // only asserts the sum invariant when every field is a finite
        // number. Returning true here defers the diagnostic to the main
        // schema's `type: 'number'` check.
        return true;
      }
      sum += v;
    }
    return Math.abs(sum - 1) <= TOKEN_BUDGET_SUM_EPSILON;
  },
});

export const validate = ajv.compile<StepSpec>(StepSpecSchema);

// ---------------------------------------------------------------------------
// validateStepSpec — narrowing helper
//
// Wraps `validate()` and adds the cross-reference checks that cannot be
// expressed in pure JSON Schema:
//
// 1. Every `AgentConfig.blockRef` must be a key of `blocks.delegation`.
// 2. (B.3 seam) Every `StepTransition.condition` and `ConditionalBlock.when`
//    must name a predicate registered in `workflow/predicates.ts`. A.6 only
//    checks structural form (non-empty string) here; B.3's codegen plugs
//    into the commented placeholder below to do the registry lookup.
//
// Cross-reference violations are returned as ajv `ErrorObject`s shaped to
// match the compiler's output so consumers (B.4 `gobbi workflow validate`,
// A.7's snapshot tests) can treat them uniformly.
// ---------------------------------------------------------------------------

/**
 * Type-narrowing validator for an untyped JSON payload. On success returns
 * the input typed as `StepSpec`; on failure returns the accumulated ajv
 * error list.
 */
export function validateStepSpec(
  input: unknown,
): { ok: true; value: StepSpec } | { ok: false; errors: ErrorObject[] } {
  if (!validate(input)) {
    // `validate.errors` is non-null after a false return per ajv docs.
    return { ok: false, errors: validate.errors ?? [] };
  }

  // `validate` narrowed `input` to `StepSpec` via its `compile<StepSpec>()`
  // generic; copy into a local binding with the narrowed type.
  const spec: StepSpec = input;

  const crossRefErrors: ErrorObject[] = [];

  // (1) blockRef → delegation key cross-reference
  const delegationKeys = new Set(Object.keys(spec.blocks.delegation));
  spec.delegation.agents.forEach((agent, index) => {
    if (!delegationKeys.has(agent.blockRef)) {
      crossRefErrors.push({
        instancePath: `/delegation/agents/${index}/blockRef`,
        schemaPath: '#/properties/delegation/agents/items/properties/blockRef',
        keyword: 'blockRef',
        params: { blockRef: agent.blockRef, availableKeys: [...delegationKeys] },
        message:
          `blockRef '${agent.blockRef}' is not a key of blocks.delegation ` +
          `(available: ${[...delegationKeys].join(', ') || '<none>'})`,
      });
    }
  });

  // (2) B.3 seam — predicate-name registry lookup.
  //
  //     When B.3 (`gen-predicate-names.ts` codegen) lands, import the
  //     generated `PredicateName` set from `workflow/predicates.ts` and
  //     verify every `StepTransition.condition` and `ConditionalBlock.when`
  //     string is a registered predicate name. For A.6 we only enforce the
  //     structural form (non-empty string) via the JSON Schema's `minLength`
  //     constraint — no registry lookup here.
  //
  //     Pseudocode for B.3:
  //       import { PREDICATE_NAMES } from '../../workflow/predicates.js';
  //       for (const t of spec.transitions) {
  //         if (!PREDICATE_NAMES.has(t.condition)) crossRefErrors.push(...);
  //       }
  //       for (const c of spec.blocks.conditional) {
  //         if (!PREDICATE_NAMES.has(c.when)) crossRefErrors.push(...);
  //       }

  if (crossRefErrors.length > 0) {
    return { ok: false, errors: crossRefErrors };
  }

  return { ok: true, value: spec };
}
