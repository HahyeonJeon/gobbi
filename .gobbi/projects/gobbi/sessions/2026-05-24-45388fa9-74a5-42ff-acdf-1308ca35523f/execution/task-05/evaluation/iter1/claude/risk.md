# Risk — T05 design doc (iter1, claude)

## Artifact Summary + Memory reads
(Shared Stage 0 summary in project.md. mistakes/leader-iter2-verification-claim-without-evidence.md read — directly applicable.)

## Locked Frame (Stage 1)

S1 — Blast radius: docs-only, 2 files, reversible. What breaks if the doc is wrong?
- [ ] No code/config/runtime affected
- [ ] Doc is informational, not enforced by tooling

S2 — A wrong factual claim in a "canonical" doc propagates: future readers/editors trust it.
- [ ] Any wrong claim is identified and its propagation risk weighed

S3 — Backlog closed prematurely (doc not actually delivering) leaves a gap with no tracking.
- [ ] Close is backed by delivered content

S4 (adversarial) — The doc induces a destructive downstream edit (someone "fixes" the authoritative orchestration table to match the doc's wrong row label).
- [ ] Mismatch direction assessed for reverse-contamination risk

S5 — Reversibility / rollback.
- [ ] `git revert ecb1a5e` cleanly restores prior state

S6 — Privacy / licensing / supply-chain (Coverage Matrix). not-applicable: no PII, no deps, no license-bearing third-party content; pure internal design prose.

## Per-scenario per-check results

S1: docs-only, no runtime surface, reversible ✓. Low intrinsic blast radius. PASS.
S2: One wrong factual claim identified — the "row 5.5 creates worktree" label (see Consistency F-CONS-1). Because this doc is explicitly positioned as the *canonical aggregation*, the propagation risk is elevated: future readers will trust it over grepping. FAIL → F-RISK-1.
S3: backlog close is backed by real delivered content ✓. No tracking gap. PASS.
S4: Reverse-contamination is plausible — a contributor reading this "accepted, canonical" doc could edit orchestration's row labels to match "5.5", corrupting the authoritative table. Elevated by the fact that the doc's status is `accepted`. This is the worst-case downstream of F-CONS-1; weighed into severity.
S5: revert is clean (2-file additive-ish commit) ✓. PASS.

## Typed findings

F-RISK-1 (High). Misinformation-propagation risk from an `accepted`-status canonical doc carrying a wrong row label. The doc says worktree creation is "row 5.5"; the authoritative orchestration table says row 5. As the designated single-source aggregation, a wrong claim here has higher downstream trust-weight than the same error buried in a memorial, and creates reverse-contamination risk (someone edits the authoritative table to match the doc).
- Type: assumption_risk | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: High
- Evidence: doc frontmatter `status: accepted` (line 3); doc:45-46,69,84 vs orchestration:102-107,134. Same evidence as F-CONS-1; the Risk framing is the propagation/contamination consequence, distinct remediation weight (do-not-edit-table-to-match).
- Why: canonical docs are trusted without re-verification; a wrong "accepted" claim is load-bearing misinformation. Matches the `leader-iter2-verification-claim-without-evidence` mistake — accepting a source claim without cross-checking the authoritative implementation.
- Suggested direction: user decides remediation. When fixing, correct the *doc* to match the authoritative orchestration table (row 5), NOT the reverse. Flag the orchestration↔git/SKILL.md contradiction as a separate follow-up.

Per-perspective verdict: REVISE

## Low-confidence appendix
(none)
