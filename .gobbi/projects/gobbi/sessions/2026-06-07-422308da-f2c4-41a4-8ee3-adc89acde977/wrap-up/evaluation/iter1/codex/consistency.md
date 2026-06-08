# Consistency - Wrap-up promotion + handoff - Codex iter1

## Artifact Summary + Memory reads
This perspective checks whether the manifest, inventory, handoff, and actual promoted files tell one coherent story. Reads: manifest, inventory, handoff, promoted decisions, promoted mistakes, promoted backlogs, memorization rules, and targeted grep results.

## Locked Frame (Stage 1)
Scenario 1: manifest and inventory agree on coverage.
- Check: both say ten staging files.
- Check: the manifest has one disposition for each independently found file.

Scenario 2: audit trail agrees with on-disk promoted files.
- Check: frontmatter strip claims match actual frontmatter.
- Check: retained fields are allowed by the memory standard.

Scenario 3 (adversarial): a correct promoted file is contradicted by the audit record.
- Check: if manifest says a field was stripped, verify the target file and the allowlist.

## Per-scenario per-check results
Scenario 1: PASS. The independent staging inventory and manifest agree on ten files and the same distribution.

Scenario 2: PARTIAL. Actual live promoted memory is clean, but the audit trail misstates the `decision_status` operation.

Scenario 3: FAIL for audit text only. The decision files correctly retain `decision_status: accepted`, while the manifest and handoff say `decision_status` was stripped.

## Typed findings
### CODEX-CONS-001 - Manifest and handoff falsely claim `decision_status` was stripped
- Type: general
- Domain: docs-sync
- Confidence: 100
- Severity: Medium
- Evidence(file:line): `.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/wrap-up/rawdata/promotion-manifest.md:42`, `:50`, `:65`; `.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/wrap-up/artifacts/handoff.md:95`; `.gobbi/projects/gobbi/features/workflow/decisions/2026-06-07-routine-triage-vs-safety-gate-classification.md:13`; `.gobbi/projects/gobbi/features/workflow/decisions/2026-06-07-rebase-worktree-to-current-develop.md:13`; `.agents/skills/memorization/rules.md:99`, `:105`, `:238`.
- Why-it-matters: The promoted decision files are correct, but the trusted audit record claims an operation that did not happen and should not happen. A future agent could copy the manifest as a worked example and strip a legitimate decisions extension, violating the documented status model.
- Suggested-direction: Correct the manifest and handoff text to remove `decision_status` from the stripped-field claims. Do not change the promoted decision files.

## Low-confidence appendix
None.
