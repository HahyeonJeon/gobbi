/**
 * Unit tests for `specs/spec-loader.ts` — `loadSpecForRuntime` step-driven
 * settings overlay.
 *
 * Mirrors the 6-case discipline from `workflow/__tests__/state.test.ts:139-198`
 * (settings-driven `maxFeedbackRounds` wiring): each case asserts a single
 * locked behaviour from PR-FIN-1e ideation §§2.3, 2.3.1, 2.3.2.
 *
 * The fixtures reuse the on-disk committed spec.json files at
 * `packages/cli/src/specs/<step>/spec.json` rather than building synthetic
 * specs — the loader is exercised against the same bytes the production
 * pipeline reads via `next.ts:237`. Hardcoded delegation values per spec
 * (verified at test authoring time):
 *
 *   - `ideation/spec.json` — innovative + best, both `modelTier: 'opus'`,
 *     `effort: 'max'`
 *   - `execution/spec.json` — executor, `modelTier: 'opus'`, `effort: 'max'`
 *   - `evaluation/spec.json` — project + overall, both `modelTier: 'sonnet'`,
 *     `effort: 'max'`
 *   - `planning/spec.json` — `delegation.agents: []` (no agents)
 *
 * Memorization is intentionally NOT bound to a settings slot in
 * `pickSettingsSlot` (ideation §2.3.1 mapping table omits it); the case 6
 * test confirms that an unknown step short-circuits the overlay.
 */

import { describe, it, expect } from 'bun:test';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadSpecForRuntime } from '../spec-loader.js';
import { DEFAULTS, type ResolvedSettings } from '../../lib/settings.js';

// ---------------------------------------------------------------------------
// Spec paths — resolved once relative to this test file's location
// ---------------------------------------------------------------------------

const HERE = dirname(fileURLToPath(import.meta.url));
const IDEATION_SPEC = resolve(HERE, '..', 'ideation', 'spec.json');
const EXECUTION_SPEC = resolve(HERE, '..', 'execution', 'spec.json');
const EVALUATION_SPEC = resolve(HERE, '..', 'evaluation', 'spec.json');
const PLANNING_SPEC = resolve(HERE, '..', 'planning', 'spec.json');

// ---------------------------------------------------------------------------
// Settings fixture builders — one per case, mirroring state.test.ts pattern
// ---------------------------------------------------------------------------

function settingsWithExecutionAgent(
  agent: { model?: 'opus' | 'sonnet' | 'haiku' | 'auto'; effort?: 'low' | 'medium' | 'high' | 'max' | 'auto' },
): ResolvedSettings {
  return {
    ...DEFAULTS,
    workflow: {
      ...DEFAULTS.workflow,
      execution: {
        ...DEFAULTS.workflow?.execution,
        agent,
      },
    },
  };
}

function settingsWithIdeationEvaluateAgent(
  agent: { model?: 'opus' | 'sonnet' | 'haiku' | 'auto'; effort?: 'low' | 'medium' | 'high' | 'max' | 'auto' },
): ResolvedSettings {
  return {
    ...DEFAULTS,
    workflow: {
      ...DEFAULTS.workflow,
      ideation: {
        ...DEFAULTS.workflow?.ideation,
        evaluate: {
          ...DEFAULTS.workflow?.ideation?.evaluate,
          agent,
        },
      },
    },
  };
}

// ===========================================================================
// loadSpecForRuntime — 6 cases per ideation §§2.3.1 / 2.3.2
// ===========================================================================

describe('loadSpecForRuntime — step-driven settings overlay', () => {
  it('returns spec.json hardcoded values verbatim when settings is undefined', () => {
    const { spec, originals } = loadSpecForRuntime(
      IDEATION_SPEC,
      undefined,
      'ideation',
    );

    // Spec carries the on-disk values unchanged.
    expect(spec.delegation.agents).toHaveLength(2);
    const innovative = spec.delegation.agents[0];
    const best = spec.delegation.agents[1];
    expect(innovative?.role).toBe('innovative');
    expect(innovative?.modelTier).toBe('opus');
    expect(innovative?.effort).toBe('max');
    expect(best?.role).toBe('best');
    expect(best?.modelTier).toBe('opus');
    expect(best?.effort).toBe('max');

    // `originals` mirrors the spec.json values keyed by role — even with
    // settings === undefined the loader produces the originals map so
    // callers can rely on a stable shape (per JSDoc on RuntimeSpec).
    expect(originals['innovative']).toEqual({ modelTier: 'opus', effort: 'max' });
    expect(originals['best']).toEqual({ modelTier: 'opus', effort: 'max' });
  });

  it('overlays workflow.execution.agent onto execution-step delegation.agents', () => {
    const settings = settingsWithExecutionAgent({ model: 'haiku', effort: 'high' });
    const { spec, originals } = loadSpecForRuntime(
      EXECUTION_SPEC,
      settings,
      'execution',
    );

    // Post-overlay: executor carries the override values.
    expect(spec.delegation.agents).toHaveLength(1);
    const executor = spec.delegation.agents[0];
    expect(executor?.role).toBe('executor');
    expect(executor?.modelTier).toBe('haiku');
    expect(executor?.effort).toBe('high');

    // `originals` carries the pre-overlay (spec.json hardcoded) values so
    // the renderer can compute `(default)` vs `(override)` provenance
    // without re-reading the spec from disk.
    expect(originals['executor']).toEqual({ modelTier: 'opus', effort: 'max' });
  });

  it('overlays workflow.ideation.evaluate.agent onto ideation_eval delegation.agents', () => {
    const settings = settingsWithIdeationEvaluateAgent({ model: 'opus', effort: 'high' });
    const { spec, originals } = loadSpecForRuntime(
      EVALUATION_SPEC,
      settings,
      'ideation_eval',
    );

    // Both evaluator perspectives receive the eval-mode overlay.
    expect(spec.delegation.agents).toHaveLength(2);
    const project = spec.delegation.agents[0];
    const overall = spec.delegation.agents[1];
    expect(project?.role).toBe('project');
    expect(project?.modelTier).toBe('opus');
    expect(project?.effort).toBe('high');
    expect(overall?.role).toBe('overall');
    expect(overall?.modelTier).toBe('opus');
    expect(overall?.effort).toBe('high');

    // `originals` reflects the spec.json hardcoded sonnet/max values.
    expect(originals['project']).toEqual({ modelTier: 'sonnet', effort: 'max' });
    expect(originals['overall']).toEqual({ modelTier: 'sonnet', effort: 'max' });
  });

  it("flows 'auto' verbatim into the resolved spec — no pre-resolution", () => {
    const settings = settingsWithExecutionAgent({ model: 'auto', effort: 'auto' });
    const { spec, originals } = loadSpecForRuntime(
      EXECUTION_SPEC,
      settings,
      'execution',
    );

    // The literal string `'auto'` flows through every layer; the
    // orchestrator (not the CLI) resolves it via `_gobbi-rule` Model
    // Selection at spawn time.
    const executor = spec.delegation.agents[0];
    expect(executor?.modelTier).toBe('auto');
    expect(executor?.effort).toBe('auto');

    // Originals still hold the pre-overlay literals.
    expect(originals['executor']).toEqual({ modelTier: 'opus', effort: 'max' });
  });

  it('returns empty originals map when delegation.agents is empty (planning)', () => {
    const settings = settingsWithExecutionAgent({ model: 'haiku' });
    const { spec, originals } = loadSpecForRuntime(
      PLANNING_SPEC,
      settings,
      'planning',
    );

    // Planning has no agents to overlay onto — the empty array passes
    // through and the originals map is correspondingly empty.
    expect(spec.delegation.agents).toHaveLength(0);
    expect(Object.keys(originals)).toHaveLength(0);
  });

  it('skips overlay when step is outside the productive/eval mapping (memorization)', () => {
    // Memorization is not in the ideation §2.3.1 step-driven mapping table;
    // pickSettingsSlot returns null, so even a populated settings tree
    // produces no overlay. The spec returns as-authored.
    const settings = settingsWithExecutionAgent({ model: 'haiku', effort: 'low' });
    const { spec, originals } = loadSpecForRuntime(
      EXECUTION_SPEC,
      settings,
      'memorization',
    );

    // Spec values remain spec-hardcoded — proves no overlay was applied
    // even though execution.agent was populated in settings.
    const executor = spec.delegation.agents[0];
    expect(executor?.modelTier).toBe('opus');
    expect(executor?.effort).toBe('max');
    expect(originals['executor']).toEqual({ modelTier: 'opus', effort: 'max' });
  });
});
