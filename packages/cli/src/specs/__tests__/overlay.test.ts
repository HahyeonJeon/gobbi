/**
 * Overlay engine tests — `specs/overlay.ts`.
 *
 * Covers:
 *
 *   1. Engine semantics — deep-merge base case, replace-arrays, every `$ops`
 *      directive, $ops ordering (merge-then-ops), unknown-key rejection,
 *      bad-path diagnostics, merged-spec schema validity.
 *
 *   2. Per-(step × substate) snapshot locks — each overlay on disk is
 *      applied to its base spec and the resulting `StepSpec` JSON is
 *      snapshotted. This is the lock that catches any content drift
 *      between overlays and their bases.
 *
 * The overlay matrix in PR B.2 is narrow on purpose (only Ideation declares
 * substates today — see the reconciliation note at the top of
 * `specs/overlay.ts`). The snapshot block below loops over `OVERLAY_MATRIX`
 * so adding a future (step × substate) combination adds a snapshot test
 * automatically.
 */

import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  applyOverlay,
  validateOverlay,
  OverlayError,
  type OverlayDoc,
} from '../overlay.js';
import { validateStepSpec } from '../_schema/v1.js';
import type { StepSpec } from '../types.js';

// ---------------------------------------------------------------------------
// Fixture — a minimal valid StepSpec, shaped like Ideation but trimmed
// ---------------------------------------------------------------------------

function baseSpec(): StepSpec {
  return {
    $schema: 'https://gobbi.dev/schemas/step-spec/v1.json',
    version: 1,
    meta: {
      description: 'Base spec',
      allowedAgentTypes: ['__pi'],
      maxParallelAgents: 2,
      requiredSkills: ['_gotcha'],
      optionalSkills: [],
      expectedArtifacts: ['artifact.md'],
      completionSignal: 'SubagentStop',
    },
    transitions: [{ to: 'plan', condition: 'evalIdeationDisabled' }],
    delegation: {
      agents: [
        {
          role: 'agent',
          modelTier: 'opus',
          effort: 'max',
          skills: [],
          artifactTarget: 'artifact.md',
          blockRef: 'agent',
        },
      ],
    },
    tokenBudget: {
      staticPrefix: 0.4,
      session: 0.1,
      instructions: 0.2,
      artifacts: 0.1,
      materials: 0.2,
    },
    blocks: {
      static: [
        { id: 'role', content: 'role content' },
        { id: 'principles', content: 'principles content' },
      ],
      conditional: [
        { id: 'cond-a', content: 'a content', when: 'feedbackRoundActive' },
        { id: 'cond-b', content: 'b content', when: 'ideationSynthesized' },
      ],
      delegation: {
        agent: { id: 'agent', content: 'agent prompt' },
      },
      synthesis: [{ id: 'synthesis', content: 'synthesis content' }],
      completion: {
        instruction: 'Emit signal',
        criteria: ['criterion one', 'criterion two'],
      },
      footer: 'Step completion protocol — run gobbi workflow transition COMPLETE.',
    },
  };
}

// ===========================================================================
// validateOverlay — structural narrowing
// ===========================================================================

describe('validateOverlay', () => {
  test('accepts an empty overlay', () => {
    const result = validateOverlay({});
    expect(result.ok).toBe(true);
  });

  test('accepts an overlay with $schema and $ops', () => {
    const result = validateOverlay({
      $schema: 'https://gobbi.dev/schemas/step-overlay/v1.json',
      $ops: [{ op: 'append', path: 'blocks.static', value: [] }],
    });
    expect(result.ok).toBe(true);
  });

  test('rejects an unknown top-level field', () => {
    const result = validateOverlay({ nonsense: true });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join('')).toContain("unknown top-level field 'nonsense'");
    }
  });

  test('rejects $ops that is not an array', () => {
    const result = validateOverlay({ $ops: {} });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join('')).toContain('$ops is not an array');
    }
  });

  test('rejects an $ops entry with an unknown op kind', () => {
    const result = validateOverlay({
      $ops: [{ op: 'wiggle', path: 'meta.description' }],
    });
    expect(result.ok).toBe(false);
  });

  test('rejects an append op without an array value', () => {
    const result = validateOverlay({
      $ops: [{ op: 'append', path: 'blocks.static', value: 'nope' }],
    });
    expect(result.ok).toBe(false);
  });

  test('rejects a remove op that provides both match and value', () => {
    const result = validateOverlay({
      $ops: [
        {
          op: 'remove',
          path: 'blocks.static',
          match: { id: 'role' },
          value: 'role',
        },
      ],
    });
    expect(result.ok).toBe(false);
  });

  test('rejects a remove op that provides neither match nor value', () => {
    const result = validateOverlay({
      $ops: [{ op: 'remove', path: 'blocks.static' }],
    });
    expect(result.ok).toBe(false);
  });
});

// ===========================================================================
// applyOverlay — deep-merge semantics
// ===========================================================================

describe('applyOverlay — deep merge', () => {
  test('empty overlay returns a structurally identical spec', () => {
    const base = baseSpec();
    const merged = applyOverlay(base, {});
    expect(merged).toEqual(base);
  });

  test('does not mutate the base spec', () => {
    const base = baseSpec();
    const snapshot = JSON.stringify(base);
    applyOverlay(base, {
      meta: { description: 'changed' },
    } as unknown as OverlayDoc);
    expect(JSON.stringify(base)).toBe(snapshot);
  });

  test('overlay scalars replace base scalars at the same path', () => {
    const base = baseSpec();
    const merged = applyOverlay(base, {
      meta: { description: 'overlay description' },
    } as unknown as OverlayDoc);
    expect(merged.meta.description).toBe('overlay description');
    // Sibling fields on meta are preserved.
    expect(merged.meta.completionSignal).toBe(base.meta.completionSignal);
    expect(merged.meta.allowedAgentTypes).toEqual(base.meta.allowedAgentTypes);
  });

  test('nested object patches merge recursively', () => {
    const base = baseSpec();
    const merged = applyOverlay(base, {
      blocks: {
        completion: {
          instruction: 'new instruction',
        },
      },
    } as unknown as OverlayDoc);
    expect(merged.blocks.completion.instruction).toBe('new instruction');
    // `criteria` array is untouched because overlay did not include it.
    expect(merged.blocks.completion.criteria).toEqual([
      'criterion one',
      'criterion two',
    ]);
  });

  test('arrays in the overlay REPLACE the base array (no element-wise merge)', () => {
    const base = baseSpec();
    const merged = applyOverlay(base, {
      meta: { requiredSkills: ['_gotcha', '_execution'] },
    } as unknown as OverlayDoc);
    expect(merged.meta.requiredSkills).toEqual(['_gotcha', '_execution']);

    // Replacing `blocks.static` with a shorter array fully replaces — no
    // element-wise merge preserving the old entries.
    const merged2 = applyOverlay(base, {
      blocks: {
        static: [{ id: 'only', content: 'only content' }],
      },
    } as unknown as OverlayDoc);
    expect(merged2.blocks.static).toEqual([
      { id: 'only', content: 'only content' },
    ]);
  });
});

// ===========================================================================
// applyOverlay — $ops directives
// ===========================================================================

describe('applyOverlay — $ops directives', () => {
  test('append extends an array at the path', () => {
    const base = baseSpec();
    const merged = applyOverlay(base, {
      $ops: [
        {
          op: 'append',
          path: 'blocks.static',
          value: [{ id: 'extra', content: 'extra content' }],
        },
      ],
    });
    expect(merged.blocks.static.map((b) => b.id)).toEqual([
      'role',
      'principles',
      'extra',
    ]);
  });

  test('prepend inserts at the start of the array', () => {
    const base = baseSpec();
    const merged = applyOverlay(base, {
      $ops: [
        {
          op: 'prepend',
          path: 'blocks.static',
          value: [{ id: 'first', content: 'first content' }],
        },
      ],
    });
    expect(merged.blocks.static.map((b) => b.id)).toEqual([
      'first',
      'role',
      'principles',
    ]);
  });

  test('remove by match.id drops the matching array entry', () => {
    const base = baseSpec();
    const merged = applyOverlay(base, {
      $ops: [
        {
          op: 'remove',
          path: 'blocks.conditional',
          match: { id: 'cond-a' },
        },
      ],
    });
    expect(merged.blocks.conditional.map((b) => b.id)).toEqual(['cond-b']);
  });

  test('remove by match.id that matches nothing is a no-op', () => {
    const base = baseSpec();
    const merged = applyOverlay(base, {
      $ops: [
        {
          op: 'remove',
          path: 'blocks.conditional',
          match: { id: 'does-not-exist' },
        },
      ],
    });
    expect(merged.blocks.conditional.map((b) => b.id)).toEqual([
      'cond-a',
      'cond-b',
    ]);
  });

  test('remove by primitive value drops the matching element', () => {
    const base = baseSpec();
    const merged = applyOverlay(base, {
      $ops: [
        {
          op: 'remove',
          path: 'meta.requiredSkills',
          value: '_gotcha',
        },
      ],
    });
    expect(merged.meta.requiredSkills).toEqual([]);
  });

  test('replace overwrites the value at path', () => {
    const base = baseSpec();
    const merged = applyOverlay(base, {
      $ops: [
        {
          op: 'replace',
          path: 'meta.maxParallelAgents',
          value: 5,
        },
      ],
    });
    expect(merged.meta.maxParallelAgents).toBe(5);
  });

  test('$ops apply AFTER deep-merge in document order', () => {
    // Overlay first replaces `blocks.static` with a two-entry array via
    // deep-merge, then the first op removes one of the two and the second
    // op appends a third. Order matters: if ops ran before merge, the
    // remove target would be the base entry ids.
    const base = baseSpec();
    const merged = applyOverlay(base, {
      blocks: {
        static: [
          { id: 'alpha', content: 'alpha content' },
          { id: 'beta', content: 'beta content' },
        ],
      },
      $ops: [
        { op: 'remove', path: 'blocks.static', match: { id: 'alpha' } },
        {
          op: 'append',
          path: 'blocks.static',
          value: [{ id: 'gamma', content: 'gamma content' }],
        },
      ],
    } as unknown as OverlayDoc);
    expect(merged.blocks.static.map((b) => b.id)).toEqual(['beta', 'gamma']);
  });

  test('$ops on a nonexistent path throws OverlayError', () => {
    const base = baseSpec();
    expect(() =>
      applyOverlay(base, {
        $ops: [
          { op: 'append', path: 'does.not.exist', value: [1] },
        ],
      }),
    ).toThrow(OverlayError);
  });

  test('$ops with a numeric index segment throws OverlayError', () => {
    const base = baseSpec();
    expect(() =>
      applyOverlay(base, {
        $ops: [
          {
            op: 'replace',
            path: 'blocks.static.0.content',
            value: 'replaced',
          },
        ],
      }),
    ).toThrow(OverlayError);
  });

  test('append on a non-array path throws OverlayError', () => {
    const base = baseSpec();
    expect(() =>
      applyOverlay(base, {
        $ops: [
          {
            op: 'append',
            path: 'meta.description',
            value: ['nope'],
          },
        ],
      }),
    ).toThrow(OverlayError);
  });
});

// ===========================================================================
// applyOverlay — schema validity of merged result
// ===========================================================================

describe('applyOverlay — schema validity', () => {
  test('a well-formed overlay produces a spec that passes validateStepSpec', () => {
    const base = baseSpec();
    const merged = applyOverlay(base, {
      meta: { description: 'adapted for substate' },
      $ops: [
        {
          op: 'append',
          path: 'blocks.static',
          value: [{ id: 'extra', content: 'extra content' }],
        },
      ],
    });
    const result = validateStepSpec(merged);
    expect(result.ok).toBe(true);
  });

  test('overlay that breaks the tokenBudget sum fails validation', () => {
    const base = baseSpec();
    expect(() =>
      applyOverlay(base, {
        tokenBudget: {
          staticPrefix: 0.9,
          session: 0.1,
          instructions: 0.1,
          artifacts: 0.0,
          materials: 0.0,
        },
      } as unknown as OverlayDoc),
    ).toThrow(OverlayError);
  });

  test('overlay that drops a delegation block leaves agent blockRef dangling — fails validation', () => {
    // Deep-merge of `{delegation: {}}` does NOT drop the base's agent key —
    // object merges recurse key-by-key, and an empty overlay object simply
    // adds no keys. To actually clear the record an author uses the
    // $ops.replace escape hatch; this test verifies the merged spec then
    // fails cross-reference validation (the agent's blockRef points at
    // nothing) rather than silently compiling with a dangling ref.
    const base = baseSpec();
    expect(() =>
      applyOverlay(base, {
        $ops: [{ op: 'replace', path: 'blocks.delegation', value: {} }],
      }),
    ).toThrow(OverlayError);
  });
});

// ===========================================================================
// Per-(step × substate) snapshot locks
//
// OVERLAY_MATRIX is the authoritative list for PR B.2. Adding a future
// (step, substate) combination adds its snapshot automatically.
// ===========================================================================

const HERE = dirname(fileURLToPath(import.meta.url));
const SPECS_ROOT = resolve(HERE, '..');

interface OverlayMatrixEntry {
  readonly step: string;
  readonly substate: string;
}

const OVERLAY_MATRIX: readonly OverlayMatrixEntry[] = [
  { step: 'ideation', substate: 'discussing' },
  { step: 'ideation', substate: 'researching' },
];

function loadBaseSpec(step: string): StepSpec {
  const specPath = resolve(SPECS_ROOT, step, 'spec.json');
  const raw: unknown = JSON.parse(readFileSync(specPath, 'utf8'));
  const result = validateStepSpec(raw);
  if (!result.ok) {
    throw new Error(
      `${step}/spec.json failed validation: ` +
        JSON.stringify(result.errors, null, 2),
    );
  }
  return result.value;
}

function loadOverlay(step: string, substate: string): OverlayDoc {
  const overlayPath = resolve(SPECS_ROOT, step, `${substate}.overlay.json`);
  const raw: unknown = JSON.parse(readFileSync(overlayPath, 'utf8'));
  const result = validateOverlay(raw);
  if (!result.ok) {
    throw new Error(
      `${step}/${substate}.overlay.json failed validation: ` +
        result.errors.join('; '),
    );
  }
  return result.value;
}

describe('overlay files — snapshot + validity per (step × substate)', () => {
  for (const entry of OVERLAY_MATRIX) {
    const { step, substate } = entry;

    describe(`${step} / ${substate}`, () => {
      test(`${step}/${substate}.overlay.json — loads and validates`, () => {
        const overlay = loadOverlay(step, substate);
        expect(overlay).toBeDefined();
      });

      test(`${step}/${substate}.overlay.json — applies to base spec and produces a valid StepSpec`, () => {
        const base = loadBaseSpec(step);
        const overlay = loadOverlay(step, substate);
        const merged = applyOverlay(base, overlay);
        const result = validateStepSpec(merged);
        expect(result.ok).toBe(true);
      });

      test(`${step}/${substate}.overlay.json — applies deterministically (byte-identical twice)`, () => {
        const base = loadBaseSpec(step);
        const overlay = loadOverlay(step, substate);
        const a = JSON.stringify(applyOverlay(base, overlay));
        const b = JSON.stringify(applyOverlay(base, overlay));
        expect(a).toBe(b);
      });

      test(`${step}/${substate}.overlay.json — merged spec matches snapshot`, () => {
        const base = loadBaseSpec(step);
        const overlay = loadOverlay(step, substate);
        const merged = applyOverlay(base, overlay);
        // Stringify with stable key ordering by going through the structured
        // JSON tree. bun:test's `toMatchSnapshot` serializes values, which
        // may not stabilize object key order for our purposes — stringify
        // explicitly with sorted keys for a byte-stable snapshot.
        const serialized = stableStringify(merged);
        expect(serialized).toMatchSnapshot();
      });
    });
  }

  test('every substate declared in ideation/spec.json has an overlay file', () => {
    const base = loadBaseSpec('ideation');
    const declared = base.meta.substates ?? [];
    const covered = new Set(
      OVERLAY_MATRIX.filter((e) => e.step === 'ideation').map(
        (e) => e.substate,
      ),
    );
    for (const substate of declared) {
      expect(covered.has(substate)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Stable JSON stringify — object keys sorted at every depth, arrays left
// in order. Used by the snapshot so key reordering upstream cannot silently
// invalidate the lock.
// ---------------------------------------------------------------------------

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return JSON.stringify(value);
  if (typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']';
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return (
    '{' +
    keys
      .map((k) => JSON.stringify(k) + ':' + stableStringify(obj[k]))
      .join(',') +
    '}'
  );
}
