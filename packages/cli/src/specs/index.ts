/**
 * Specs barrel — public API for the specs package.
 *
 * Only modules whose exports are intended for consumption outside the
 * specs package are re-exported here. Stub modules (PR D error-pathway
 * compilers, resume compiler) are deliberately omitted so their
 * placeholder symbols do not leak into the public surface — downstream
 * callers can import them directly from their specific file path once
 * PR D populates them.
 *
 * M5 reconciliation (PR B B.3):
 *
 *   - `errors.ts` and `resume.ts` are stub modules today (PR D work);
 *     their `__todoErrors` / `__todoResume` unique symbols and
 *     `compileErrorPrompt` / `compileResumePrompt` throw-stub functions
 *     were previously re-exported from this barrel. Nothing consumes
 *     them yet and the throw-stub calls at runtime would be a cliff.
 *     Removed from the barrel; PR D will add them back when the real
 *     implementations land.
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
