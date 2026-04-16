/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by `packages/cli/scripts/gen-predicate-names.ts` from the
 * predicate references in every `spec.json`, `index.json`, and
 * `*.overlay.json` under `packages/cli/src/specs/`.
 *
 * The union lists every predicate name a spec, overlay, or graph edge
 * references. `workflow/predicates.ts` asserts its default registry via
 * `satisfies Record<PredicateName, Predicate>` — adding a reference in
 * a spec without registering the predicate here becomes a typecheck
 * error.
 *
 * Regenerate with `bun run scripts/gen-predicate-names.ts` (auto-runs as
 * `prebuild` / `pretypecheck` in `packages/cli/package.json`).
 */
export type PredicateName =
  | 'abortRequested'
  | 'always'
  | 'evalIdeationDisabled'
  | 'evalIdeationEnabled'
  | 'evalPlanDisabled'
  | 'evalPlanEnabled'
  | 'feedbackCapExceeded'
  | 'feedbackRoundActive'
  | 'ideationSynthesized'
  | 'loopTargetExecution'
  | 'loopTargetIdeation'
  | 'loopTargetPlan'
  | 'piAgentsToSpawn'
  | 'resumeTargetExecution'
  | 'resumeTargetIdeation'
  | 'resumeTargetMemorization'
  | 'resumeTargetPlan'
  | 'skipRequested'
  | 'stepTimeoutFired'
  | 'verdictPass'
  | 'verdictRevise';

/**
 * The sorted list of predicate names the codegen discovered. Exported
 * for runtime validators that walk the spec library — the typed union
 * above is the compile-time surface; this constant is the runtime
 * mirror.
 */
export const PREDICATE_NAMES: readonly PredicateName[] = [
  'abortRequested',
  'always',
  'evalIdeationDisabled',
  'evalIdeationEnabled',
  'evalPlanDisabled',
  'evalPlanEnabled',
  'feedbackCapExceeded',
  'feedbackRoundActive',
  'ideationSynthesized',
  'loopTargetExecution',
  'loopTargetIdeation',
  'loopTargetPlan',
  'piAgentsToSpawn',
  'resumeTargetExecution',
  'resumeTargetIdeation',
  'resumeTargetMemorization',
  'resumeTargetPlan',
  'skipRequested',
  'stepTimeoutFired',
  'verdictPass',
  'verdictRevise',
] as const;

/**
 * Source files the codegen scanned. Listed for auditability; not
 * consumed at runtime.
 */
const SOURCE_FILES: readonly string[] = [
  'src/specs/evaluation/spec.json',
  'src/specs/execution/spec.json',
  'src/specs/ideation/discussing.overlay.json',
  'src/specs/ideation/researching.overlay.json',
  'src/specs/ideation/spec.json',
  'src/specs/index.json',
  'src/specs/memorization/spec.json',
  'src/specs/plan/spec.json',
] as const;
void SOURCE_FILES;
