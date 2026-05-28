## Findings

1. **Type:** design_flaw
   **Severity:** High
   **Confidence:** 100
   **Evidence:** `design/workflow-phase-doc-set-for-per-iter-cadence.md` repointed `related:` to `features/git-workflow/decisions/planning-brief-mistake-load-directives-for-t1.md` and `features/git-workflow/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`, but both paths are missing at HEAD (`test -f` returned `missing` for both). `rg --files .gobbi/projects/gobbi | rg 'planning-brief-mistake-load-directives-for-t1|mirror-propagation-policy-mirror-canonical-symlinks'` shows the promoted decision files exist instead at `features/workflow/decisions/2026-05-24-planning-brief-mistake-load-directives-for-t1.md` and `features/install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md`; the new `git-workflow` paths are fabricated.
   **Fix:** Update the `related:` entries to point at the existing promoted feature-memory paths, or remove them if cross-feature related links are not desired. Re-run the target-existence check after editing.
VERDICT: REVISE
