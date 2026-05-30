# T4 iter1 — Risk perspective (claude)

**Perspective:** Risk — failure modes, schema-bloat, downstream breakage, drift exposure, backward-compat surface.

## Stage 0 — Target understanding

Schema-shape change from single-default-set to mode-keyed bundle. This is a breaking shape change for any resolver coded against the baseline. T4 itself is the JSON only; the resolver edit is downstream.

## Stage 1 — Frame

Scenarios:
1. Resolver-side breakage: any code path that reads `settings.workflow.{phase}.{...}` directly (not via `settings[mode].workflow…`) breaks immediately.
2. Drift exposure: `models.*` and `git.*` duplicated in both subtrees creates two edit sites.
3. R1 semantic: `preparation.maxIterations: 0` must be interpreted as "Skipped at loop entry" by the resolver. If the resolver treats `0` as "no iterations allowed → FAIL", the lock is silently broken.
4. Karpathy-4 over-engineering: bundled shape is the simplest realization of Idea Decision #8; no alternative was instantiated that would have over-engineered the schema.
5. Backward-compat: any user with a custom `settings.json` overlay matching the old flat shape will now mis-resolve.

## Stage 2 — Evidence

| # | Scenario | Risk level | Notes |
|---|---|---|---|
| 1 | Resolver-side breakage | High — but out of T4 scope; downstream tasks must implement the dispatch | not a T4 finding |
| 2 | models/git drift | Low | duplication risk acknowledged in Performance + Consistency |
| 3 | R1 semantic | Medium | depends on resolver. Idea §6.2 + §3.2 + §5 footnote document the semantic; the literal `0` is present in the file |
| 4 | Karpathy-4 over-engineering | Low | bundled shape ≤ alternative complexity |
| 5 | Backward-compat for user overlays | High — but explicitly accepted by Idea Decision #9 ("Mode now affects workflow structure") | not a T4 finding |

## Findings

**F-R1 — User-overlay backward compatibility (Confidence 50, Severity Medium):** Any user-edited `settings.json` overlay that still uses the pre-T4 flat shape (`workflow.{phase}` at root) will mis-resolve once the resolver is updated to expect mode-keyed bundles. T4 itself doesn't introduce this risk (it's a resolver concern), but T4 is the precondition. Downstream tasks should include a migration shim or a one-time overlay re-shaper.

**Why it matters:** Solo-user context (Gobbi is solo-user per memory) — the user's own `settings.json` overlay (if any exists) needs explicit re-shape, not silent failure. Recommend a Planning-stage check for any extant overlays.

**F-R2 — R1 semantic depends on resolver implementation (Confidence 50, Severity Medium):** The literal `chat.workflow.preparation.maxIterations: 0` is correct. But whether the resolver/loop-entry guard interprets `0` as `Skipped` (Idea R1 intent) vs `no-iterations-allowed → Aborted/FAIL` (naïve interpretation) is a downstream contract. T4 cannot enforce it. The Idea doc locks the semantic in §6.2 and §5 footnote; downstream tasks must implement the guard.

**Why it matters:** If the resolver isn't updated in lockstep with T4, the first Chat-mode session post-merge will stamp `Aborted` instead of `Skipped`, producing audit-trail FAIL noise (the exact regression Idea Success Criterion #5 calls out).

## Must-preserve

- The literal `0` in `chat.workflow.preparation.maxIterations` (do not "fix" by raising to 1).
- The bundled shape (do not regress to a flat single-default-set).

## Verdict

**PASS** — F-R1 and F-R2 are downstream concerns, not T4 defects. T4's JSON is correct.
