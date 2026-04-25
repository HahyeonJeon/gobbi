/**
 * Unit tests for the `settings-validator.ts` AJV validator — focused on
 * the `projects` field added by gobbi-memory Pass 2 (W1.2).
 *
 * The validator is the single gate for the unified `Settings` shape
 * (workspace / project / session all read through the same AJV
 * validator). These tests exercise only the `projects` extension and
 * the surrounding cross-field invariants — per-field coverage for
 * `workflow.*`, `notify.*`, and `git.*` remains in the feature-level
 * tests at `__tests__/features/gobbi-config.test.ts`.
 *
 * Test matrix (W1.2 acceptance criteria):
 *
 *   1. DEFAULTS exposes `{projects: {active: null, known: []}}`.
 *   2. Accepts a populated projects block (`active: "gobbi"`).
 *   3. Accepts the fresh-install shape (`active: null`, `known: []`).
 *   4. Rejects `projects.active: 42` — wrong primitive.
 *   5. Rejects `projects.known: null` — the array is required, not nullable.
 *   6. Rejects missing `projects` — the block itself is required.
 *   7. Rejects non-string elements inside `projects.known`.
 *   8. Rejects extra fields under `projects` (additionalProperties: false).
 */

import { describe, expect, test } from 'bun:test';

import { DEFAULTS } from '../settings.js';
import { validateSettings } from '../settings-validator.js';

// ---------------------------------------------------------------------------
// Test 1 — DEFAULTS carries the fresh-install projects shape
// ---------------------------------------------------------------------------

describe('settings-validator — projects (W1.2 DEFAULTS)', () => {
  test('DEFAULTS.projects is { active: null, known: [] }', () => {
    expect(DEFAULTS.projects).toEqual({ active: null, known: [] });
    // Each field individually, so a regression that introduces a different
    // default (e.g. `active: ""` or `known: ["gobbi"]`) surfaces clearly.
    expect(DEFAULTS.projects.active).toBeNull();
    expect(DEFAULTS.projects.known).toEqual([]);
    expect(Array.isArray(DEFAULTS.projects.known)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tests 2 & 3 — positive: accepted projects shapes
// ---------------------------------------------------------------------------

describe('settings-validator — projects (W1.2 accepts)', () => {
  test('accepts populated projects: { active: "gobbi", known: ["gobbi"] }', () => {
    const raw: unknown = {
      schemaVersion: 1,
      projects: { active: 'gobbi', known: ['gobbi'] },
    };
    expect(validateSettings(raw)).toBe(true);
  });

  test('accepts fresh-install projects: { active: null, known: [] }', () => {
    const raw: unknown = {
      schemaVersion: 1,
      projects: { active: null, known: [] },
    };
    expect(validateSettings(raw)).toBe(true);
  });

  test('accepts multi-entry known with active matching one of them', () => {
    const raw: unknown = {
      schemaVersion: 1,
      projects: { active: 'foo', known: ['gobbi', 'foo', 'bar'] },
    };
    // The active-matches-known cross-field rule is enforced by a later
    // wave, NOT by this schema pass — today's validator accepts any
    // combination of active + known as long as both shapes are correct.
    expect(validateSettings(raw)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tests 4, 5, 7, 8 — negative: malformed projects content rejected
// ---------------------------------------------------------------------------

describe('settings-validator — projects (W1.2 rejects)', () => {
  test('rejects projects.active with the wrong primitive (42)', () => {
    const raw: unknown = {
      schemaVersion: 1,
      projects: { active: 42, known: [] },
    };
    expect(validateSettings(raw)).toBe(false);
    const errs = validateSettings.errors ?? [];
    expect(errs.length).toBeGreaterThan(0);
    // The error must point inside projects.active, not be a top-level
    // required-key miss.
    expect(errs.some((e) => (e.instancePath ?? '').includes('/projects/active'))).toBe(true);
  });

  test('rejects projects.known: null — array is not nullable', () => {
    const raw: unknown = {
      schemaVersion: 1,
      projects: { active: null, known: null },
    };
    expect(validateSettings(raw)).toBe(false);
    const errs = validateSettings.errors ?? [];
    expect(errs.some((e) => (e.instancePath ?? '').includes('/projects/known'))).toBe(true);
  });

  test('rejects projects.known with non-string elements', () => {
    const raw: unknown = {
      schemaVersion: 1,
      projects: { active: 'gobbi', known: ['gobbi', 42, null] },
    };
    expect(validateSettings(raw)).toBe(false);
    const errs = validateSettings.errors ?? [];
    expect(
      errs.some((e) => {
        const path = e.instancePath ?? '';
        return path.startsWith('/projects/known/');
      }),
    ).toBe(true);
  });

  test('rejects extra fields inside projects (additionalProperties: false)', () => {
    const raw: unknown = {
      schemaVersion: 1,
      projects: { active: null, known: [], extraField: 'nope' },
    };
    expect(validateSettings(raw)).toBe(false);
    const errs = validateSettings.errors ?? [];
    // AJV surfaces this as an additionalProperties violation at the
    // /projects instancePath.
    expect(
      errs.some((e) => {
        const path = e.instancePath ?? '';
        const msg = e.message ?? '';
        return path === '/projects' && /additional/i.test(msg);
      }),
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Test 6 — negative: missing projects at the root
// ---------------------------------------------------------------------------

describe('settings-validator — projects (W1.2 required at root)', () => {
  test('rejects root without a projects block', () => {
    const raw: unknown = { schemaVersion: 1 };
    expect(validateSettings(raw)).toBe(false);
    const errs = validateSettings.errors ?? [];
    // Root-level required-key miss has instancePath === '' and the
    // message names the missing property.
    expect(
      errs.some((e) => {
        const path = e.instancePath ?? '';
        const msg = e.message ?? '';
        return path === '' && /projects/.test(msg);
      }),
    ).toBe(true);
  });

  test('rejects projects with missing required inner keys', () => {
    // Only `active` — `known` missing.
    const raw: unknown = { schemaVersion: 1, projects: { active: 'gobbi' } };
    expect(validateSettings(raw)).toBe(false);
    const errs = validateSettings.errors ?? [];
    expect(
      errs.some((e) => {
        const path = e.instancePath ?? '';
        const msg = e.message ?? '';
        return path === '/projects' && /known/.test(msg);
      }),
    ).toBe(true);
  });
});
