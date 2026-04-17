/**
 * Specs barrel — public API for the specs package.
 *
 * Only modules whose exports are intended for consumption outside the
 * specs package are re-exported here. The error-state + resume compiler
 * surface (`errors.ts` + private siblings) is deliberately omitted so
 * that consumers import from the specific file path — this keeps the
 * barrel free of the factored pathway-compiler internals.
 *
 * M5 reconciliation (PR B B.3, PR D D.4):
 *
 *   - `errors.ts` ships the real `compileErrorPrompt` / `compileResumePrompt`
 *     surface as of PR D. Both live under `specs/errors.ts`; the earlier
 *     stub file `specs/resume.ts` was removed in PR D.4 — its
 *     `__todoResume` unique symbol and zero-arg `compileResumePrompt`
 *     throw-stub were placeholders, and callers now import the real
 *     `compileResumePrompt(state, store, options?): CompiledPrompt`
 *     directly from `specs/errors.js`.
 *   - `overlay.ts` (B.2's substate overlay engine) is added here. Its
 *     `applyOverlay` and `OverlayDoc`/`OverlayOp`/`OverlayError` surface
 *     is public — callers outside the specs package compose overlays
 *     via this barrel.
 *
 * Kept in the barrel:
 *
 *   - `sections.ts` — `StaticSection` / `SessionSection` / `DynamicSection`
 *     factories, `CacheOrderedSections` tuple guard.
 *   - `types.ts` — `StepSpec` and its subtrees, `CompiledPrompt`,
 *     `BudgetAllocator`, `TokenBudget`, etc.
 *   - `assembly.ts` — `compile()`, lint rules, predicate-reference
 *     validators.
 *   - `budget.ts` — `defaultBudgetAllocator`, `allocate()`.
 *   - `skills.ts` — `loadSkills`, `SkillName`, `SKILL_NAMES`,
 *     `DEFAULT_SKILLS_ROOT`.
 *   - `artifact-selector.ts` — `selectPriorArtifacts` + its step-scope types.
 *   - `graph.ts` — `loadGraph`, `analyzeGraph`, graph types.
 *   - `overlay.ts` — `applyOverlay`, `OverlayDoc`, `OverlayError`.
 */

export * from './sections.js';
export * from './types.js';
export * from './assembly.js';
export * from './budget.js';
export * from './skills.js';
export * from './artifact-selector.js';
export * from './graph.js';
export * from './overlay.js';
