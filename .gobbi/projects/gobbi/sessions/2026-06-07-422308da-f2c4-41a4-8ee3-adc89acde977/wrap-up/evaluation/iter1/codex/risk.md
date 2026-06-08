# Risk - Wrap-up promotion + handoff - Codex iter1

## Artifact Summary + Memory reads
Risk asks what breaks if the wrap-up is wrong: memory pollution, false audit claims, lost staging, or misleading future sessions. Reads: project mistakes relevant to wrap-up/frontmatter verification, manifest, inventory, handoff, promoted files, memorization rules, existing layer2 files, and git status/log checks.

## Locked Frame (Stage 1)
Scenario 1: no project memory pollution.
- Check: targeted staging-key grep over promoted files is clean.
- Check: archive-safe live-memory grep gate is clean.

Scenario 2: mistakes are recorded and not duplicates.
- Check: both new mistakes have the four required elements and related links.
- Check: they are distinct from `leader-iter2-verification-claim-without-evidence.md` and `planning-leader-asserted-file-type-without-verifying.md`.

Scenario 3 (adversarial): audit text teaches a future agent the wrong frontmatter transform.
- Check: compare strip claims against the allowlist and actual destination files.

## Per-scenario per-check results
Scenario 1: PASS. Targeted grep found no live promoted-memory leaks for `mistake-candidate`, `item_status`, `promoted-from`, `promoted-at`, or `decision_status` on non-decision targets. The archive-safe live-memory gate printed no leak files.

Scenario 2: PASS. The two new mistakes are well-formed and distinct. The layer2 file generalizes both into an authoritative-source rule and links adjacent prior layer2 coverage rather than duplicating it.

Scenario 3: FAIL for audit text only. The false `decision_status` strip claim is a forward-propagation risk, not current memory corruption.

## Typed findings
### CODEX-RISK-001 - Audit trail asserts an unperformed and unsafe strip operation
- Type: assumption_risk
- Domain: process
- Confidence: 100
- Severity: Medium
- Evidence(file:line): `.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/wrap-up/rawdata/promotion-manifest.md:42`, `:50`, `:65`; `.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/wrap-up/artifacts/handoff.md:95`; `.agents/skills/memorization/rules.md:238`.
- Why-it-matters: The issue is contained because the promoted files are correct. The risk is that the audit trail is a reusable pattern, and it currently describes `decision_status` as staging residue even though the memory standard says it is a KEEP-list decisions field.
- Suggested-direction: Correct the audit docs. Preserve the promoted decision files as-is.

## Low-confidence appendix
None.
