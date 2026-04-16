/**
 * Tests for `specs/_schema/v1.ts` — the ajv binding for StepSpec v1.
 *
 * Covers:
 *
 * 1. Positive — a valid `StepSpec` (the Ideation-shaped fixture) passes both
 *    `validate` and `validateStepSpec`.
 * 2. Negative — missing required field, wrong `version`, invalid `modelTier`,
 *    tokenBudget sum ≠ 1.0, blockRef pointing at a missing delegation key,
 *    extra property on `meta` (additionalProperties violation).
 * 3. Drift — the JSON file on disk matches `JSON.stringify(StepSpecSchema)`.
 *    The real drift-type-check is the compile-time binding
 *    `StepSpecSchema: JSONSchemaType<StepSpec>` in `_schema/v1.ts`: if
 *    `types.ts` gains a field the schema doesn't declare (or vice versa),
 *    `tsc --noEmit` fails at the TS constant's type annotation BEFORE this
 *    runtime test ever loads. This file's drift test catches the secondary
 *    drift: the JSON mirror on disk falling out of sync with the TS value.
 */

import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  StepSpecSchema,
  STEP_SPEC_SCHEMA_ID,
  validate,
  validateStepSpec,
  ajv,
} from '../_schema/v1.js';
import type { StepSpec } from '../types.js';

// ---------------------------------------------------------------------------
// Fixture — minimal valid Ideation-shaped StepSpec
// ---------------------------------------------------------------------------

const validSpec: StepSpec = {
  $schema: 'https://gobbi.dev/schemas/step-spec/v1.json',
  version: 1,
  meta: {
    description: 'Ideation — explore what to do',
    substates: ['discussing', 'researching'],
    allowedAgentTypes: ['__pi'],
    maxParallelAgents: 2,
    requiredSkills: ['_gotcha', '_ideation'],
    optionalSkills: [],
    expectedArtifacts: ['innovative.md', 'best.md'],
    completionSignal: 'SubagentStop',
  },
  transitions: [
    { to: 'plan', condition: 'evalIdeationDisabled', label: 'skip evaluation' },
    { to: 'evaluation', condition: 'evalIdeationEnabled' },
  ],
  delegation: {
    agents: [
      {
        role: 'innovative',
        stance: 'innovative',
        modelTier: 'opus',
        effort: 'max',
        skills: ['_ideation'],
        artifactTarget: 'innovative.md',
        blockRef: 'pi.innovative',
      },
      {
        role: 'best',
        stance: 'best-practice',
        modelTier: 'opus',
        effort: 'max',
        skills: ['_ideation'],
        artifactTarget: 'best.md',
        blockRef: 'pi.best',
      },
    ],
  },
  tokenBudget: {
    staticPrefix: 0.4,
    session: 0.1,
    instructions: 0.2,
    artifacts: 0.2,
    materials: 0.1,
  },
  blocks: {
    static: [{ id: 'role', content: 'You are the orchestrator.' }],
    conditional: [
      {
        id: 'feedback-context',
        content: 'This is feedback round N.',
        when: 'feedbackRoundActive',
      },
    ],
    delegation: {
      'pi.innovative': {
        id: 'pi.innovative',
        content: 'Explore novel approaches.',
      },
      'pi.best': {
        id: 'pi.best',
        content: 'Apply best practices.',
      },
    },
    synthesis: [{ id: 'synth', content: 'Synthesize PI findings.' }],
    completion: {
      instruction: 'Emit completion signal once both PI agents complete.',
      criteria: ['innovative.md written', 'best.md written', 'synthesis emitted'],
    },
  },
};

// `structuredClone` gives each negative test an independent mutable copy,
// so mutations in one test do not leak into another. The `Mutable<T>` helper
// strips `readonly` recursively so test code can mutate cloned fixtures
// without peppering every mutation with `as` casts (the StepSpec interface
// declares everything `readonly` — a good runtime contract, but inconvenient
// for tests that deliberately corrupt the shape).
type Mutable<T> = T extends readonly (infer U)[]
  ? Mutable<U>[]
  : T extends object
    ? { -readonly [K in keyof T]: Mutable<T[K]> }
    : T;

const clone = <T>(value: T): Mutable<T> => structuredClone(value) as Mutable<T>;

// ---------------------------------------------------------------------------
// Schema metadata
// ---------------------------------------------------------------------------

describe('StepSpecSchema metadata', () => {
  test('top-level $schema points at draft 2020-12', () => {
    expect(StepSpecSchema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
  });

  test('$id is the canonical gobbi URL', () => {
    expect(StepSpecSchema.$id).toBe(STEP_SPEC_SCHEMA_ID);
    expect(STEP_SPEC_SCHEMA_ID).toBe('https://gobbi.dev/schemas/step-spec/v1.json');
  });

  test('has title and description', () => {
    expect(typeof StepSpecSchema.title).toBe('string');
    expect(typeof StepSpecSchema.description).toBe('string');
    expect((StepSpecSchema.title as string).length).toBeGreaterThan(0);
    expect((StepSpecSchema.description as string).length).toBeGreaterThan(0);
  });

  test('ajv instance was configured with strict mode', () => {
    // ajv exposes its options under `opts`; the options snapshot is how
    // downstream consumers (B.4) can confirm the validator's strictness
    // contract without round-tripping schemas.
    expect(ajv.opts.strict).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Positive — valid spec passes
// ---------------------------------------------------------------------------

describe('validate (positive)', () => {
  test('Ideation-shaped fixture passes `validate`', () => {
    const ok = validate(validSpec);
    expect(ok).toBe(true);
    expect(validate.errors).toBeNull();
  });

  test('`validateStepSpec` narrows to { ok: true, value }', () => {
    const result = validateStepSpec(validSpec);
    expect(result.ok).toBe(true);
    if (result.ok) {
      // The narrowed `value` is typed as StepSpec; reference a nested field
      // to prove the compile-time narrowing survives the branch.
      expect(result.value.meta.description).toBe('Ideation — explore what to do');
      expect(result.value.delegation.agents).toHaveLength(2);
    }
  });

  test('`meta.substates` is optional — omitting it still validates', () => {
    const spec = clone(validSpec);
    delete (spec.meta as { substates?: readonly string[] }).substates;
    expect(validate(spec)).toBe(true);
  });

  test('`meta.timeoutMs` is optional — omitting it still validates', () => {
    const spec = clone(validSpec);
    // `timeoutMs` is not present on the fixture, but explicitly remove the
    // property in case the fixture gains one in future edits.
    delete (spec.meta as { timeoutMs?: number }).timeoutMs;
    expect(validate(spec)).toBe(true);
  });

  test('transitions[].label is optional', () => {
    const spec = clone(validSpec);
    spec.transitions.forEach((t) => {
      delete (t as { label?: string }).label;
    });
    expect(validate(spec)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Negative — each failing case produces a targeted ajv error
// ---------------------------------------------------------------------------

describe('validate (negative — required fields)', () => {
  test('omitting top-level `$schema` fails with a required-field error', () => {
    const spec = clone(validSpec) as Partial<Mutable<StepSpec>>;
    delete spec.$schema;
    expect(validate(spec)).toBe(false);
    const errors = validate.errors ?? [];
    const missingSchema = errors.find(
      (e) => e.keyword === 'required' && (e.params as { missingProperty?: string }).missingProperty === '$schema',
    );
    expect(missingSchema).toBeDefined();
  });

  test('omitting `blocks.completion.criteria` fails with required error', () => {
    const spec = clone(validSpec);
    delete (spec.blocks.completion as { criteria?: string[] }).criteria;
    expect(validate(spec)).toBe(false);
    const missingCriteria = (validate.errors ?? []).find(
      (e) =>
        e.keyword === 'required' &&
        (e.params as { missingProperty?: string }).missingProperty === 'criteria',
    );
    expect(missingCriteria).toBeDefined();
  });
});

describe('validate (negative — const / enum)', () => {
  test('`version: 2` is rejected by the const constraint', () => {
    const spec = clone(validSpec) as Omit<Mutable<StepSpec>, 'version'> & { version: number };
    spec.version = 2;
    expect(validate(spec)).toBe(false);
    const constError = (validate.errors ?? []).find((e) => e.keyword === 'const');
    expect(constError).toBeDefined();
    expect(constError?.instancePath).toBe('/version');
  });

  test('`modelTier: "gpt-5"` is rejected by the enum constraint', () => {
    const spec = clone(validSpec);
    const first = spec.delegation.agents[0];
    // `noUncheckedIndexedAccess` means TS sees `first` as possibly undefined;
    // the fixture guarantees at least one agent, so assert it.
    if (!first) throw new Error('fixture invariant: delegation.agents[0] exists');
    (first as { modelTier: string }).modelTier = 'gpt-5';
    expect(validate(spec)).toBe(false);
    const enumError = (validate.errors ?? []).find((e) => e.keyword === 'enum');
    expect(enumError).toBeDefined();
    expect(enumError?.instancePath).toBe('/delegation/agents/0/modelTier');
  });

  test('`effort: "low"` is rejected by the enum constraint', () => {
    const spec = clone(validSpec);
    const first = spec.delegation.agents[0];
    if (!first) throw new Error('fixture invariant: delegation.agents[0] exists');
    (first as { effort: string }).effort = 'low';
    expect(validate(spec)).toBe(false);
    const enumError = (validate.errors ?? []).find((e) => e.keyword === 'enum');
    expect(enumError).toBeDefined();
    expect(enumError?.instancePath).toBe('/delegation/agents/0/effort');
  });
});

describe('validate (negative — additionalProperties)', () => {
  test('extra field in `meta` is rejected', () => {
    const spec = clone(validSpec);
    (spec.meta as unknown as Record<string, unknown>).unexpected = 'nope';
    expect(validate(spec)).toBe(false);
    const addlError = (validate.errors ?? []).find((e) => e.keyword === 'additionalProperties');
    expect(addlError).toBeDefined();
    expect(addlError?.instancePath).toBe('/meta');
    expect((addlError?.params as { additionalProperty?: string }).additionalProperty).toBe(
      'unexpected',
    );
  });

  test('extra field at top level is rejected', () => {
    const spec = clone(validSpec) as Mutable<StepSpec> & { bonus?: string };
    spec.bonus = 'nope';
    expect(validate(spec)).toBe(false);
    const addlError = (validate.errors ?? []).find((e) => e.keyword === 'additionalProperties');
    expect(addlError).toBeDefined();
    expect((addlError?.params as { additionalProperty?: string }).additionalProperty).toBe(
      'bonus',
    );
  });
});

describe('validate (negative — tokenBudget sum)', () => {
  test('sum ≠ 1.0 is rejected by the custom `tokenBudgetSumEqualsOne` keyword', () => {
    const spec = clone(validSpec);
    spec.tokenBudget = {
      staticPrefix: 0.5,
      session: 0.5,
      instructions: 0.1,
      artifacts: 0,
      materials: 0,
    };
    expect(validate(spec)).toBe(false);
    const sumError = (validate.errors ?? []).find(
      (e) => e.keyword === 'tokenBudgetSumEqualsOne',
    );
    expect(sumError).toBeDefined();
    expect(sumError?.instancePath).toBe('/tokenBudget');
  });

  test('sum within ± 1e-6 of 1.0 is accepted (floating-point tolerance)', () => {
    const spec = clone(validSpec);
    // 0.1 + 0.2 + 0.3 + 0.2 + 0.2 = 1.0000000000000002 in IEEE 754.
    // Must pass under the epsilon tolerance.
    spec.tokenBudget = {
      staticPrefix: 0.1,
      session: 0.2,
      instructions: 0.3,
      artifacts: 0.2,
      materials: 0.2,
    };
    expect(validate(spec)).toBe(true);
  });

  test('sum error surfaces via `validateStepSpec` as well', () => {
    const spec = clone(validSpec);
    spec.tokenBudget = {
      staticPrefix: 0.5,
      session: 0.5,
      instructions: 0.1,
      artifacts: 0,
      materials: 0,
    };
    const result = validateStepSpec(spec);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.keyword === 'tokenBudgetSumEqualsOne')).toBe(true);
    }
  });
});

describe('validate (negative — number bounds)', () => {
  test('tokenBudget proportion > 1 is rejected by `maximum`', () => {
    const spec = clone(validSpec);
    spec.tokenBudget = {
      staticPrefix: 1.5,
      session: 0,
      instructions: 0,
      artifacts: 0,
      materials: 0,
    };
    expect(validate(spec)).toBe(false);
    const maxError = (validate.errors ?? []).find((e) => e.keyword === 'maximum');
    expect(maxError).toBeDefined();
  });

  test('tokenBudget proportion < 0 is rejected by `minimum`', () => {
    const spec = clone(validSpec);
    spec.tokenBudget = {
      staticPrefix: -0.1,
      session: 0.4,
      instructions: 0.3,
      artifacts: 0.2,
      materials: 0.2,
    };
    expect(validate(spec)).toBe(false);
    const minError = (validate.errors ?? []).find((e) => e.keyword === 'minimum');
    expect(minError).toBeDefined();
  });
});

describe('validateStepSpec (negative — cross-ref)', () => {
  test('blockRef pointing at a non-existent delegation key is rejected', () => {
    const spec = clone(validSpec);
    const first = spec.delegation.agents[0];
    if (!first) throw new Error('fixture invariant: delegation.agents[0] exists');
    first.blockRef = 'pi.missing';
    const result = validateStepSpec(spec);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const blockRefError = result.errors.find((e) => e.keyword === 'blockRef');
      expect(blockRefError).toBeDefined();
      expect(blockRefError?.instancePath).toBe('/delegation/agents/0/blockRef');
      expect(blockRefError?.message).toContain('pi.missing');
    }
  });

  test('valid blockRefs pass cross-reference check', () => {
    const result = validateStepSpec(validSpec);
    expect(result.ok).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Drift — JSON mirror on disk must match the TS-typed schema constant.
//
// The primary drift check is compile-time: `StepSpecSchema: JSONSchemaType<
// StepSpec>` in `_schema/v1.ts` forces `types.ts` and the schema to agree.
// This test catches the secondary drift — someone editing `v1.json` by hand
// and forgetting to sync `v1.ts` (or vice versa).
// ---------------------------------------------------------------------------

describe('drift — v1.json ↔ v1.ts', () => {
  test('v1.json on disk matches JSON.stringify(StepSpecSchema, null, 2)', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const jsonPath = resolve(here, '../_schema/v1.json');
    const onDisk = readFileSync(jsonPath, 'utf8').trimEnd();
    const fromTs = JSON.stringify(StepSpecSchema, null, 2);
    expect(onDisk).toBe(fromTs);
  });
});
