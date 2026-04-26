/**
 * Glob-validate every on-disk `spec.json` against the locked StepSpec v1
 * JSON Schema (Wave C.1.1).
 *
 * # Why this test exists
 *
 * The drift safety nets at `_schema/v1.ts:247-313` — `JSONSchemaType<StepSpec>`
 * compile-time binding plus the `v1.json` byte-mirror test at
 * `schema.test.ts:399-406` — keep `types.ts ↔ schema TS ↔ schema JSON` in
 * lockstep. They do NOT, on their own, validate the actual on-disk
 * `packages/cli/src/specs/<step>/spec.json` files. Whichever test happens
 * to load a spec exercises its own slice; a spec edit that violates the
 * schema (e.g., a token-budget sum that no longer hits 1.0, a missing
 * `required` field, a stray top-level key) only surfaces if downstream
 * code paths happen to load the offending step.
 *
 * This test closes that gap. It walks every step subdirectory under
 * `packages/cli/src/specs/<step>/`, parses each `spec.json`, runs
 * `validateStepSpec`, and asserts:
 *
 *   1. `validateStepSpec` returns `ok: true` (full schema + cross-ref
 *      gates pass; AJV error list is empty).
 *   2. The `$schema` field on the parsed JSON equals `STEP_SPEC_SCHEMA_ID`
 *      — every spec self-identifies as v1, no stray version strings.
 *
 * # Discovery
 *
 * Uses `node:fs.readdirSync(specsRoot)` against the absolute path computed
 * from `import.meta.url` so the test is location-independent and never
 * accidentally globs into `__tests__/fixtures/`. The expected step set is
 * pinned (`{ideation, planning, execution, evaluation, memorization,
 * handoff}`) so a missing or extra directory fails the closed-set check
 * — drift in either direction surfaces here.
 */

import { describe, test, expect } from 'bun:test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  validateStepSpec,
  STEP_SPEC_SCHEMA_ID,
} from '../_schema/v1.js';

// ---------------------------------------------------------------------------
// Closed step-id set — matches the prompt-id set locked in
// `design/v050-features/prompts-as-data.md` user lock 2.
// ---------------------------------------------------------------------------

const EXPECTED_STEP_IDS = [
  'ideation',
  'planning',
  'execution',
  'evaluation',
  'memorization',
  'handoff',
] as const;

// ---------------------------------------------------------------------------
// Discovery — walk `packages/cli/src/specs/<step>/spec.json`
// ---------------------------------------------------------------------------

const here = dirname(fileURLToPath(import.meta.url));
const specsRoot = resolve(here, '..');

function discoverSpecDirs(): readonly string[] {
  return readdirSync(specsRoot)
    .filter((entry) => {
      // Skip non-directories (sibling .ts files like `assembly.ts`,
      // `types.ts`, `index.json`).
      if (!statSync(join(specsRoot, entry)).isDirectory()) return false;
      // Skip leading-underscore subdirs (`_schema`) — those are
      // infrastructure, not steps. Skip the test-runner directory.
      if (entry.startsWith('_') || entry.startsWith('__')) return false;
      // Only count directories that contain a `spec.json`.
      try {
        statSync(join(specsRoot, entry, 'spec.json'));
        return true;
      } catch {
        return false;
      }
    })
    .sort();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('all spec.json files validate against StepSpec v1', () => {
  const stepIds = discoverSpecDirs();

  test('discovered step directories match the closed prompt-id set', () => {
    expect(stepIds).toEqual([...EXPECTED_STEP_IDS].sort());
  });

  // One test per spec so failures point at a single file.
  for (const stepId of stepIds) {
    test(`${stepId}/spec.json: validateStepSpec returns ok=true`, () => {
      const path = join(specsRoot, stepId, 'spec.json');
      const raw = readFileSync(path, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      const result = validateStepSpec(parsed);
      // Surface the AJV error list verbatim so a regression points at the
      // exact field/keyword combination.
      if (!result.ok) {
        // eslint-disable-next-line no-console
        console.error(`${stepId}/spec.json validation errors:`, result.errors);
      }
      expect(result.ok).toBe(true);
    });

    test(`${stepId}/spec.json: $schema equals STEP_SPEC_SCHEMA_ID`, () => {
      const path = join(specsRoot, stepId, 'spec.json');
      const raw = readFileSync(path, 'utf8');
      const parsed = JSON.parse(raw) as { $schema?: unknown };
      expect(parsed.$schema).toBe(STEP_SPEC_SCHEMA_ID);
    });
  }
});
