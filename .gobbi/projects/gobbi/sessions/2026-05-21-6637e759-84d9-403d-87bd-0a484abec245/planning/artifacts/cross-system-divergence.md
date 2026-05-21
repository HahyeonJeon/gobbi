---
loop: planning
iter: 4
artifact_type: cross-system-divergence
created_at: 2026-05-21
status: final
supersedes: []
related:
  - planning/artifacts/resolution-log.md
  - planning/artifacts/memory-reads.md
---

# Cross-System Divergence — Planning Loop (iter4 PASS)

Per-iteration divergence analysis between Claude and Codex evaluator systems.

---

## iter1 — Claude REVISE / Codex FAIL

**Divergence**: Both systems converged on the same root cause (role-boundary leak), but at different severity thresholds.

| Aspect | Claude | Codex |
|---|---|---|
| Aggregate verdict | REVISE | FAIL |
| Stage F role-boundary finding | F-CL-P-01 High/75 — "local-ref mutation carve-out not in skill" | F-CX-PLAN-O-01 Critical/95 — same root cause, stronger framing |
| Commit count finding | F-CL-S-01 High/75 | F-CX-PLAN-O-02 High/80 — also caught the "Stage F generates a commit" false assumption |
| Self-review accuracy | Not surfaced as a top finding | F-CX-PLAN-O-03 Medium/85 — Stage A branch-open misattributed to Task 02 |
| Converged on? | YES — both demanded role-boundary remediation |

**Why FAIL vs REVISE**: Codex interpreted F-CX-PLAN-O-01 as Critical (Score/90 ≥ 75 threshold); Claude interpreted the equivalent finding as High (≥ 50 threshold, not Critical). The fix set was the same regardless: iter2 Fix 1 (role-boundary) + Fix 2 (commit count) + Fix 3 (mistake-load wording) + Fix 4 (self-review accuracy).

---

## iter2 — Claude REVISE / Codex REVISE (convergent)

**Divergence**: Both systems returned REVISE. Claude found the tag-form drift from multiple perspectives; Codex confirmed with a single High/85 finding.

| Aspect | Claude | Codex |
|---|---|---|
| Aggregate verdict | REVISE | REVISE |
| Tag-form drift | F-CL2-P-01 Medium/90 + F-CL2-A-02 Medium/90 + F-CL2-C-01 Medium/95 + F-CL2-R-03 Medium/95 (4 perspectives convergent) | F-CX-PLAN-O2-01 High/85 — single high-priority finding covering same defect |
| Worktree precheck gap | F-CL2-P-02 Medium/80 + F-CL2-R-01 Medium/85 (2 perspectives) | Not surfaced independently |
| main.md wording | Not surfaced | F-CX-PLAN-O2-02 Low/85 — main.md:87 mistake-load timing wording |
| Converged on? | YES — both demanded iter3 tag-form correction |

**Notable**: Claude covered the worktree precheck gap that Codex missed; Codex surfaced the main.md wording that Claude missed at this severity. Together the systems provided complementary coverage.

---

## iter3 — Claude PASS / Codex REVISE (divergence)

**Divergence**: This is the critical cross-system divergence of the Planning Loop. Claude PASS while Codex surfaced a High/100 docs-sync finding.

| Aspect | Claude | Codex |
|---|---|---|
| Aggregate verdict | PASS | REVISE |
| main.md docs-sync drift | Not detected — Claude missed that main.md still referenced `draft-iter2.md` at lines 126, 141, 154 | F-CX-PLAN-O3-O-01 High/100 — explicitly enumerated the 3 stale pointer locations and the missing §5a precheck in main.md |
| Self-review grep wording | Not surfaced | F-CX-PLAN-O3-O-02 Low/100 — audit wording suggestion |
| Outcome | User authorized maxIterations override 3→4 to address Codex finding | Triggered iter4 |

**Why Claude missed it**: Claude's iter3 evaluation focused on the rawdata (draft-iter3.md) being correct — which it was. Claude did not cross-check the derived summary (staging/plans/main.md) against the iter3 rawdata changes as rigorously. Codex performed the mechanical grep verifications (`grep -nE "draft-iter2\.md" main.md`) that surfaced the residual.

**Lesson**: When a LIGHT iter's changes are concentrated in a derived summary file, the evaluator must explicitly grep the summary for stale references rather than relying on the rawdata being correct. This is the same class of finding as `manager-mispec-grep-c-for-occurrence-count.md` (empirical verification > reasoning).

---

## iter4 — Claude PASS / Codex PASS (convergent)

**No divergence**. Both systems confirmed F-CX-PLAN-O3-O-01 addressed.

| Aspect | Claude | Codex |
|---|---|---|
| Aggregate verdict | PASS | PASS |
| F-CX-PLAN-O3-O-01 disposition | addressed — V1-V5 critical verifications all PASS | addressed — `grep -nE "draft-iter2.md" main.md` returned no matches; §5a precheck present |
| F-CX-PLAN-O3-O-02 disposition | deferred | deferred |
| New findings | 5 Low cosmetic findings (docs-sync metadata staleness — inherent to LIGHT iter discipline) | 0 new findings |
| Converged on? | YES — Planning Loop can close |

**Notable**: Claude surfaced 5 Low cosmetic findings that Codex did not raise. These are acknowledged consequences of the LIGHT iter4 discipline guardrail (the brief's tight enumeration left some metadata outside the substitution scope). Both systems agree they are not blocking; iter4 closes PASS.
