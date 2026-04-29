/**
 * Spec loader — read a `spec.json`, validate via {@link validateStepSpec},
 * and (optionally) overlay user-config-driven model/effort onto every entry
 * of `spec.delegation.agents[*]` according to the step-driven role-to-mode
 * mapping documented in PR-FIN-1e ideation §2.3.1.
 *
 * Two exported entry points:
 *
 * - {@link loadSpec} — pure factor-out of the prior inline definition in
 *   `commands/workflow/next.ts`. Reads + validates + returns the typed spec.
 *   No settings awareness; preserved for callers (`render.ts`, `patch.ts`,
 *   tests) that compile against the spec-as-authored without runtime overlay.
 *
 * - {@link loadSpecForRuntime} — reads + validates + overlays the resolved
 *   settings cascade for the active workflow step. Returns both the
 *   post-overlay `StepSpec` AND a sibling `originals` map carrying the
 *   pre-overlay `{modelTier, effort}` keyed by each agent's `role` field.
 *   The sibling-map shape sidesteps the readonly-`StepSpec` contract: we
 *   never mutate the input; the overlay produces a fresh `StepSpec` and the
 *   pre-overlay values flow alongside (rather than embedded in) the spec so
 *   the renderer can compute `(default)` vs `(override: ...)` provenance
 *   without re-reading the spec from disk.
 *
 * ## Step-driven role-to-mode mapping (ideation §2.3.1)
 *
 * | `step`             | Active settings slot                              |
 * |--------------------|---------------------------------------------------|
 * | `ideation`         | `workflow.ideation.agent`                         |
 * | `planning`         | `workflow.planning.agent`                         |
 * | `execution`        | `workflow.execution.agent`                        |
 * | `ideation_eval`    | `workflow.ideation.evaluate.agent`                |
 * | `planning_eval`    | `workflow.planning.evaluate.agent`                |
 * | `execution_eval`   | `workflow.execution.evaluate.agent`               |
 * | (any other)        | none — no overlay                                 |
 *
 * The overlay applies to **every** entry of `spec.delegation.agents[*]` —
 * the array is uniform within the step's purpose (PI/executor for
 * productive steps, evaluator perspectives for `*_eval`). No role-name
 * filter; if the user picks `model: 'haiku'` for ideation, both
 * `innovative` and `best` agents get `'haiku'`.
 *
 * `'auto'` flows verbatim through the overlay — the orchestrator resolves
 * it via `_gobbi-rule` Model Selection at spawn time. The CLI does not
 * pre-resolve `'auto'` at any layer.
 *
 * ## Module boundary
 *
 * - `commands/workflow/next.ts` is the only caller that passes resolved
 *   settings (T4b will swap `next.ts:237` to `loadSpecForRuntime`).
 * - `commands/workflow/render.ts` and `commands/workflow/patch.ts` are
 *   spec-authoring/inspection commands: they take a `PromptId` (not a
 *   `WorkflowStep`) and pin `FIXED_TIMESTAMP` for deterministic snapshots.
 *   They continue to call {@link loadSpec} (no settings overlay).
 */

import { readFileSync } from 'node:fs';

import type { ResolvedSettings, StepSettings } from '../lib/settings.js';
import { validateStepSpec } from './_schema/v1.js';
import type {
  AgentConfig,
  EffortLevel,
  ModelTier,
  StepDelegation,
  StepSpec,
} from './types.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Pre-overlay (model, effort) snapshot for one agent — keyed in the
 * {@link RuntimeSpec.originals} map by the agent's `role` field. The
 * renderer uses this to compute `(default)` vs `(override: ...)` provenance
 * for each agent in the `agent-routing` rendered-prompt block.
 */
export interface AgentOriginal {
  readonly modelTier: ModelTier;
  readonly effort: EffortLevel;
}

/** Result of {@link loadSpecForRuntime}. */
export interface RuntimeSpec {
  /**
   * Spec with the active settings overlay applied to every entry of
   * `delegation.agents[*]`. When no overlay applies (no settings, no slot
   * for the step, slot present but empty), this is the spec as-authored.
   */
  readonly spec: StepSpec;
  /**
   * Pre-overlay `{modelTier, effort}` for each agent in the spec, keyed by
   * the agent's `role`. Always reflects the spec.json hardcoded values
   * regardless of whether an overlay was applied.
   */
  readonly originals: Readonly<Record<string, AgentOriginal>>;
}

// ---------------------------------------------------------------------------
// loadSpec — factor-out of next.ts:298-307 (pure read + validate)
// ---------------------------------------------------------------------------

/**
 * Read a `spec.json` from disk, validate it against the v1 schema, and
 * return the typed {@link StepSpec}. Throws when validation fails — the
 * thrown `Error` includes the file path and the AJV error list serialized
 * as JSON for log surfaces.
 *
 * Pure factor-out of the prior inline definition in `commands/workflow/next.ts`.
 * Behaviour-preserving — no overlay, no settings awareness.
 */
export function loadSpec(path: string): StepSpec {
  const raw: unknown = JSON.parse(readFileSync(path, 'utf8'));
  const result = validateStepSpec(raw);
  if (!result.ok) {
    throw new Error(
      `gobbi workflow next: spec ${path} failed validation: ${JSON.stringify(result.errors)}`,
    );
  }
  return result.value;
}

// ---------------------------------------------------------------------------
// loadSpecForRuntime — load + step-driven settings overlay
// ---------------------------------------------------------------------------

/**
 * Load a spec and overlay the active settings slot's `{model, effort}`
 * onto every entry of `spec.delegation.agents[*]` according to the
 * step-driven role-to-mode mapping (ideation §2.3.1).
 *
 * `settings === undefined` short-circuits the overlay — the spec returns
 * as-authored, and `originals` still mirrors the spec's hardcoded values
 * so callers can rely on a stable shape regardless of cascade presence.
 *
 * For steps outside the productive/eval set (idle, done, error,
 * memorization, handoff), no overlay applies — those steps either have
 * empty `delegation.agents` or don't expose a settings slot.
 *
 * @param specPath Absolute (or caller-resolved) path to the `spec.json`.
 * @param settings Resolved settings cascade; `undefined` skips overlay.
 * @param step Current workflow step identifier from `state.currentStep`.
 *   Drives the slot lookup per the ideation §2.3.1 table.
 * @returns The spec (post-overlay when applicable) plus the `originals`
 *   map of pre-overlay values keyed by agent role.
 */
export function loadSpecForRuntime(
  specPath: string,
  settings: ResolvedSettings | undefined,
  step: string,
): RuntimeSpec {
  const baseSpec = loadSpec(specPath);
  const originals = buildOriginals(baseSpec);

  if (settings === undefined) {
    return { spec: baseSpec, originals };
  }

  const slot = pickSettingsSlot(settings, step);
  if (slot === null) {
    return { spec: baseSpec, originals };
  }

  const overlaid = overlayAgents(baseSpec, slot);
  return { spec: overlaid, originals };
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

/**
 * Snapshot the spec's hardcoded `{modelTier, effort}` for each agent into
 * a frozen-shape map keyed by `role`. The map is small (≤2 entries per
 * step today) and lives only inside the loader's caller chain — it is not
 * persisted, not snapshotted, not compared across compiles.
 */
function buildOriginals(
  spec: StepSpec,
): Readonly<Record<string, AgentOriginal>> {
  const out: Record<string, AgentOriginal> = {};
  for (const agent of spec.delegation.agents) {
    out[agent.role] = {
      modelTier: agent.modelTier,
      effort: agent.effort,
    };
  }
  return out;
}

/**
 * Resolve `step` to the active {@link StepSettings.agent}-shaped slot
 * (productive: `workflow.<step>.agent`; eval: `workflow.<step>.evaluate.agent`).
 *
 * Returns `null` when the step has no slot (any step outside the
 * productive/eval set) or when the resolved settings cascade did not
 * supply the slot.
 */
function pickSettingsSlot(
  settings: ResolvedSettings,
  step: string,
): { readonly model?: ModelTier; readonly effort?: EffortLevel } | null {
  const workflow = settings.workflow;
  if (workflow === undefined) return null;

  switch (step) {
    case 'ideation':
      return slotFromStep(workflow.ideation, 'agent');
    case 'planning':
      return slotFromStep(workflow.planning, 'agent');
    case 'execution':
      return slotFromStep(workflow.execution, 'agent');
    case 'ideation_eval':
      return slotFromStep(workflow.ideation, 'evaluate');
    case 'planning_eval':
      return slotFromStep(workflow.planning, 'evaluate');
    case 'execution_eval':
      return slotFromStep(workflow.execution, 'evaluate');
    default:
      // idle, done, error, memorization, handoff, or any unknown step —
      // no overlay slot is defined.
      return null;
  }
}

/**
 * Pull the `{model, effort}` pair from a {@link StepSettings} entry,
 * dispatching by `kind`:
 *
 * - `'agent'` → `step.agent`
 * - `'evaluate'` → `step.evaluate.agent`
 *
 * Returns `null` when the step entry, the inner branch, or the agent
 * sub-object is absent. The caller treats `null` as "no overlay applies"
 * — the {@link AgentModel}/{@link AgentEffort} types from `lib/settings.ts`
 * are structurally identical to {@link ModelTier}/{@link EffortLevel}
 * (both unions widened to include `'auto'` in T2), so the returned shape
 * carries directly into {@link overlayAgents}.
 */
function slotFromStep(
  stepCfg: StepSettings | undefined,
  kind: 'agent' | 'evaluate',
): { readonly model?: ModelTier; readonly effort?: EffortLevel } | null {
  if (stepCfg === undefined) return null;
  const agent =
    kind === 'agent' ? stepCfg.agent : stepCfg.evaluate?.agent;
  if (agent === undefined) return null;
  // `AgentModel` ⊆ `ModelTier` and `AgentEffort` ⊆ `EffortLevel` after
  // T2's enum widening — both unions are now `'opus' | 'sonnet' | 'haiku'
  // | 'auto'` and `'low' | 'medium' | 'high' | 'max' | 'auto'`. The
  // settings-side and spec-side aliases are nominally distinct but
  // structurally identical, so a direct read is type-safe.
  const out: { model?: ModelTier; effort?: EffortLevel } = {};
  if (agent.model !== undefined) out.model = agent.model;
  if (agent.effort !== undefined) out.effort = agent.effort;
  // Empty-slot guard: a parsed `agent: {}` carries no override; treat as
  // null so the caller skips the (no-op) overlay path entirely.
  if (out.model === undefined && out.effort === undefined) return null;
  return out;
}

/**
 * Apply the `{model, effort}` overlay onto every entry of
 * `spec.delegation.agents[*]`, returning a fresh {@link StepSpec}.
 *
 * `StepSpec` and its sub-shapes are deeply readonly (`types.ts`) — this
 * function never mutates the input. New objects are constructed via
 * spread; the agents array is rebuilt as a fresh array; each agent that
 * receives an override becomes a new object with the resolved fields
 * substituted. Agents whose values match the overlay no-op-ly identical
 * still get a fresh object — the overhead is negligible (≤2 objects per
 * compile) and keeping the code branch-free reads cleaner than testing
 * for equality before rebuilding.
 *
 * `'auto'` flows verbatim — no resolution at this layer.
 */
function overlayAgents(
  spec: StepSpec,
  slot: { readonly model?: ModelTier; readonly effort?: EffortLevel },
): StepSpec {
  const newAgents: AgentConfig[] = spec.delegation.agents.map((agent) => ({
    ...agent,
    modelTier: slot.model ?? agent.modelTier,
    effort: slot.effort ?? agent.effort,
  }));

  const newDelegation: StepDelegation = {
    ...spec.delegation,
    agents: newAgents,
  };

  return {
    ...spec,
    delegation: newDelegation,
  };
}
