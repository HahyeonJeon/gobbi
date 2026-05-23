---
perspective: risk
target: T04 (commit aea5916 — wrap-up/SKILL.md +60/-1)
iter: 1
system: claude
verdict: PASS
---

# Risk — T04 Step 2.5

Risk perspective: what failure modes could the new procedure introduce, and does Step 2.5 itself fail safely?

## Scenario walk

| # | Scenario | Result | Evidence |
|---|---|---|---|
| 1 | Auto-backfill could corrupt a staging file authored deliberately in unusual shape | PASS | Auto-backfill is gated to mechanical-class Types only (scenario_gap / checklist_gap / general). Judgment Types (design_flaw / assumption_risk) escalate via NEEDS_CONTEXT rather than rewriting. This is a deliberate fail-safe split |
| 2 | Step 2.5 cannot be silently skipped | PASS | Three reinforcements: Procedure row 2 flags it inline (line 137), Exit checklist explicitly requires it (line 175), Exit criteria for Step 2.5 (lines 237-240) gate Step 3 entry. Defense in depth |
| 3 | zero-staging vs deliberately-empty loop (e.g., a loop ran but had no findings) | PASS | Step 2.5 escalates rather than backfills — "Loop {loop} staging dir is empty — was that intentional?" lets the user confirm legitimate empty cases |
| 4 | directory-absent vs loop-never-ran | PASS | Same escalation pattern: "Loop {loop} staging dir does not exist — verify the loop ran". User confirms before proceeding |
| 5 | finding-id collision risk during auto-backfill | PASS | Section explicitly applies Slug+collision policy before writing (line 219: "Apply Slug+collision policy (see below) before writing"), including pre-write read, finding-id match check, suffix disambiguation |
| 6 | Step 2.5 could write to project memory prematurely | PASS | Line 188 explicitly states "No project-memory writes happen until all Step 2.5 findings are resolved". Auto-backfill writes are to *staging*, not project memory |
| 7 | Forbidden Type-vocabulary regression (improvement / bug) — past failure mode | PASS | grep returns zero matches for those tokens used as Types. The brief-discipline manager iter2 regression is not reproduced |
| 8 | COD-CONS-003 Domain=`testing` typo regression | PASS | grep returns zero matches |
| 9 | Cross-link rot if evaluation/SKILL.md anchors change | OPEN | Anchors `#type-5-values` and `#slug--collision-policy` depend on GFM auto-anchor of current heading text. If a future edit renames "Type (5 values)" → "Finding Types" the wrap-up cross-link silently rots. Risk is mitigated by the inlined verbatim content (the source-of-truth check would catch drift), but the link itself would 404 |
| 10 | Commit-scope discipline | PASS | Single-file diff verified |

## Findings

### F-RISK-T04-01 — Cross-link anchor brittleness

- Type: `assumption_risk`
- Domain: `docs-sync`
- Disposition: `deferred`
- Confidence: 50
- Severity: Low
- Evidence: wrap-up/SKILL.md:201 and :224 link to `evaluation/SKILL.md#type-5-values` and `evaluation/SKILL.md#slug--collision-policy`. These anchors are computed from heading text by GFM. A future heading rename in evaluation/SKILL.md would silently break the links without triggering any verification gate.
- Why it matters: Doc-rot is the dominant failure mode in this codebase's adversarial-review history. Verbatim content inlined into wrap-up mitigates the *semantic* rot but not the *navigation* rot.
- Suggested direction: Project-level — add an anchor-resolution lint to the rules/ directory, or convert the cross-link to a stable path+line-range reference (e.g., "see evaluation/SKILL.md § Type (5 values) at lines 344-352") which is robust to heading renames.

## Must-preserve list

- The mechanical/judgment fail-safe split (only constructive Types auto-backfill)
- The "no project-memory writes until Step 2.5 resolves" fence at line 188
- The pre-write Slug+collision check (line 219 directive to "Apply ... before writing")

## Verdict

PASS — F-RISK-T04-01 is a `deferred / Low` finding with downstream-tooling resolution; it does not gate Task 04's merge.
