/**
 * Step-spec migration chain tests — `specs/migrations.ts`.
 *
 * Covers:
 *
 *   1. Identity path — `migrateSpec(v, n, n)` returns the input by reference
 *      (same no-copy semantics as `migrateEvent` for already-current rows).
 *   2. Downgrade rejection — `migrateSpec(v, to, from)` with `to > from`
 *      throws `SpecMigrationError` with a descriptive message.
 *   3. Missing-step rejection — an unregistered adjacent hop throws
 *      `SpecMigrationError` and names the missing `vN → vN+1` edge.
 *   4. v1 is the only registered version — the production registry has no
 *      v1→v2 migration yet; attempting the hop fails with the missing-step
 *      error. When v2 lands, this test gets updated in lockstep.
 *   5. Composition — multi-hop walk (v1→v2→v3) via the test seam
 *      `migrateSpecWith`, proving the chain is composed, not just a single
 *      lookup.
 *   6. Purity — the input object is not mutated across a multi-hop migrate
 *      (deep equality against a pre-call snapshot).
 *   7. Invalid input shape — tolerated by the pure transform layer. Shape
 *      validation is the ajv validator's job (`_schema/vN.ts`), not
 *      `migrateSpec`'s; the chain walks whatever the step functions accept.
 *
 * Rationale for the "v1→v2 throws missing-step" choice (vs. registering an
 * identity placeholder): an identity would let `migrateSpec(v1, 1, 2)` type-
 * silently return a v1-shape object claimed to be v2. When v2 actually lands,
 * every caller would then need an audit to verify which migrations were the
 * intentional v2 authors vs. the placeholder that never ran. A throwing
 * missing-step error forces the real migration to be written before v2 can
 * be targeted, which is the safer default.
 */

import { describe, test, expect } from 'bun:test';

import {
  CURRENT_SPEC_VERSION,
  migrateSpec,
  migrateSpecWith,
  SpecMigrationError,
  type SpecMigrationFn,
} from '../migrations.js';
import type { StepSpec } from '../types.js';

// ---------------------------------------------------------------------------
// Fixture — a minimal valid v1 StepSpec
// ---------------------------------------------------------------------------

function v1Spec(): StepSpec {
  return {
    $schema: 'https://gobbi.dev/schemas/step-spec/v1.json',
    version: 1,
    meta: {
      description: 'Migration test fixture',
      allowedAgentTypes: ['__pi'],
      maxParallelAgents: 1,
      requiredSkills: [],
      optionalSkills: [],
      expectedArtifacts: ['out.md'],
      completionSignal: 'SubagentStop',
    },
    transitions: [],
    delegation: { agents: [] },
    tokenBudget: {
      staticPrefix: 0.4,
      session: 0.1,
      instructions: 0.2,
      artifacts: 0.2,
      materials: 0.1,
    },
    blocks: {
      static: [{ id: 'role', content: 'stub' }],
      conditional: [],
      delegation: {},
      synthesis: [],
      completion: {
        instruction: 'done',
        criteria: ['all-done'],
      },
    },
  };
}

// ---------------------------------------------------------------------------
// CURRENT_SPEC_VERSION
// ---------------------------------------------------------------------------

describe('CURRENT_SPEC_VERSION', () => {
  test('is 1 — the only registered spec schema version today', () => {
    expect(CURRENT_SPEC_VERSION).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

describe('migrateSpec — identity', () => {
  test('returns the same reference when from === to (v1 → v1)', () => {
    const spec = v1Spec();
    const result = migrateSpec(spec, 1, 1);
    expect(result).toBe(spec);
  });

  test('identity does not mutate the input', () => {
    const spec = v1Spec();
    const snapshot = structuredClone(spec);
    migrateSpec(spec, 1, 1);
    expect(spec).toEqual(snapshot);
  });

  test('identity works for a future-version no-op (v2 → v2)', () => {
    // No registered migration is needed for a same-version call; this works
    // even for versions the registry doesn't know about, by design. Use
    // Object.is to compare references without binding `toBe`'s inferred
    // `StepSpec` parameter to an `unknown` payload.
    const obj: unknown = { version: 2 };
    expect(Object.is(migrateSpec(obj, 2, 2), obj)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Downgrade rejection
// ---------------------------------------------------------------------------

describe('migrateSpec — downgrade rejection', () => {
  test('throws SpecMigrationError when from > to', () => {
    const spec = v1Spec();
    expect(() => migrateSpec(spec, 2, 1)).toThrow(SpecMigrationError);
    expect(() => migrateSpec(spec, 2, 1)).toThrow(
      'Spec version 2 is newer than target 1 — downgrade migrations are not supported',
    );
  });

  test('error is named SpecMigrationError', () => {
    try {
      migrateSpec(v1Spec(), 5, 3);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(SpecMigrationError);
      expect((err as Error).name).toBe('SpecMigrationError');
    }
  });
});

// ---------------------------------------------------------------------------
// Missing-step rejection — the v1→v2 placeholder behaviour
// ---------------------------------------------------------------------------

describe('migrateSpec — missing-step rejection (v1 → v2 placeholder)', () => {
  test('throws when no migration is registered for the requested hop', () => {
    const spec = v1Spec();
    expect(() => migrateSpec(spec, 1, 2)).toThrow(SpecMigrationError);
    expect(() => migrateSpec(spec, 1, 2)).toThrow(
      'No migration from spec v1 to v2',
    );
  });

  test('throws for any unregistered hop, not just v1→v2', () => {
    const spec = v1Spec();
    // v1 → v99 requires v1→v2 first; the walker fails at the first missing hop.
    expect(() => migrateSpec(spec, 1, 99)).toThrow(
      'No migration from spec v1 to v2',
    );
  });

  test('does not mutate the input when the hop is missing', () => {
    const spec = v1Spec();
    const snapshot = structuredClone(spec);
    expect(() => migrateSpec(spec, 1, 2)).toThrow(SpecMigrationError);
    expect(spec).toEqual(snapshot);
  });
});

// ---------------------------------------------------------------------------
// Composition — multi-hop walk via the test seam
// ---------------------------------------------------------------------------

describe('migrateSpec — composition (via migrateSpecWith)', () => {
  /**
   * Synthetic migration registry used only by these tests. It declares two
   * hops — v1→v2 (`addedByV2`) and v2→v3 (`addedByV3`) — so a (1,3)
   * migration walks both steps in order. Proves the composition is real, not
   * a single-lookup trick.
   *
   * Each step returns a NEW object; this also demonstrates that purity is
   * the caller's contract (step authors return new objects, the walker never
   * mutates inputs).
   */
  const v1ToV2: SpecMigrationFn = (input) => {
    const obj = input as Record<string, unknown>;
    return { ...obj, addedByV2: true, version: 2 };
  };
  const v2ToV3: SpecMigrationFn = (input) => {
    const obj = input as Record<string, unknown>;
    return { ...obj, addedByV3: 'yes', version: 3 };
  };
  const testRegistry = {
    1: { 2: v1ToV2 },
    2: { 3: v2ToV3 },
  };

  test('single hop — v1 → v2 applies only v1ToV2', () => {
    const input = { version: 1, original: 'keep' };
    const result = migrateSpecWith(input, 1, 2, testRegistry) as Record<
      string,
      unknown
    >;
    expect(result).toEqual({ version: 2, original: 'keep', addedByV2: true });
  });

  test('two-hop — v1 → v3 composes v1ToV2 then v2ToV3', () => {
    const input = { version: 1, original: 'keep' };
    const result = migrateSpecWith(input, 1, 3, testRegistry) as Record<
      string,
      unknown
    >;
    expect(result).toEqual({
      version: 3,
      original: 'keep',
      addedByV2: true,
      addedByV3: 'yes',
    });
  });

  test('single hop starting mid-chain — v2 → v3 skips v1ToV2', () => {
    const input = { version: 2, preexisting: 'mid-chain' };
    const result = migrateSpecWith(input, 2, 3, testRegistry) as Record<
      string,
      unknown
    >;
    expect(result).toEqual({
      version: 3,
      preexisting: 'mid-chain',
      addedByV3: 'yes',
    });
  });

  test('missing adjacent hop breaks the walk with a step-specific error', () => {
    // Registry has v1→v2 but not v2→v3.
    const partial = { 1: { 2: v1ToV2 } };
    const input = { version: 1 };
    expect(() => migrateSpecWith(input, 1, 3, partial)).toThrow(
      'No migration from spec v2 to v3',
    );
  });

  test('purity — input is not mutated across a multi-hop walk', () => {
    const input = { version: 1, original: 'keep', nested: { count: 0 } };
    const snapshot = structuredClone(input);
    migrateSpecWith(input, 1, 3, testRegistry);
    expect(input).toEqual(snapshot);
  });

  test('identity (from === to) returns input by reference', () => {
    const input = { version: 1 };
    expect(migrateSpecWith(input, 1, 1, testRegistry)).toBe(input);
  });

  test('downgrade rejection applies to migrateSpecWith', () => {
    expect(() => migrateSpecWith({}, 3, 1, testRegistry)).toThrow(
      SpecMigrationError,
    );
    expect(() => migrateSpecWith({}, 3, 1, testRegistry)).toThrow(
      'Spec version 3 is newer than target 1 — downgrade migrations are not supported',
    );
  });
});

// ---------------------------------------------------------------------------
// Invalid input shape — tolerated by the pure transform layer
// ---------------------------------------------------------------------------

describe('migrateSpec — input shape tolerance', () => {
  test('identity path accepts any input (shape validation is not this module)', () => {
    // The pure transform has no opinion on shape when from === to. The ajv
    // validator in `_schema/v1.ts` owns shape validation; the migration
    // walker owns version composition. This test pins the boundary: when
    // from === to and nothing is applied, the input is returned as-is.
    const weirdInputs: readonly unknown[] = [
      null,
      undefined,
      0,
      '',
      [],
      {},
      { unrelated: 'field' },
    ];
    for (const input of weirdInputs) {
      // The point of this test is that the identity path returns exactly
      // what was passed in, regardless of whether that payload satisfies
      // `StepSpec`. Compare references directly via `Object.is`.
      const output = migrateSpec(input, 1, 1);
      expect(Object.is(output, input)).toBe(true);
    }
  });

  test('non-identity path surfaces step-function errors verbatim', () => {
    // Step functions are responsible for their own preconditions. If a
    // caller feeds a garbage object into a migration, the step's own throw
    // is what surfaces — the walker only owns the composition plumbing.
    const throwingStep: SpecMigrationFn = () => {
      throw new Error('step got bad input');
    };
    const registry = { 1: { 2: throwingStep } };
    expect(() =>
      migrateSpecWith({ malformed: true }, 1, 2, registry),
    ).toThrow('step got bad input');
  });
});
