# Ideation iter3 — Project (claude)

## Stage 0 Artifact Summary

iter3 draft (628 lines) remediates two Codex iter2 findings:
- F-CX-OV-01 (High/100) — the iter2 H-3 SHA-in-session.json gate was self-referential. iter3 drops the SHA-in-session.json requirement entirely and replaces it with two non-circular `git log` + `git ls-tree` pre-conditions.
- F-CX-OV-02 (Medium/50) — adds Stage G `HEAD_SHA` capture before `gh pr merge` plus post-merge verification.

All 18 user locks preserved; iter2's 4-High + 4-Med/Low remediations carried verbatim.

## Stage 1 Locked Frame (Project)

- S-P1: Scope contract scoped to the locked 18 decisions, no scope creep.
- S-P2 (adversarial): no NEW prior-art / survivor-set citation breakage from the iter3 edits.
- S-P3: Brief alignment — iter3 delivered exactly the contracted F-CX-OV-01 + F-CX-OV-02 fixes.

## Inherited Findings Dispositions

| ID | iter2 verdict | iter3 disposition | Evidence |
|---|---|---|---|
| F-P-01 (CLAUDE.md links) | addressed | **addressed (preserved)** | Stage B step at line 279, Success #12, D2 #17 — verbatim carry-over |
| F-P-02 (steel-man "do less") | open Medium/75 | **open** | Counterfactual block unchanged; not in iter3 brief |
| F-P-03 (`c676684d-` not named) | addressed | **addressed (preserved)** | Stage E.1 line 308 + I5 — verbatim |
| F-P-04 (discussion-log not updated) | open Low | **open** | Optional iter2 delta; not addressed at iter3 |
| F-P-05 (counterfactual split) | open Low | **open** | Informational |

## Stage 2 Findings (Project)

### F-P3-01 — iter3 deltas-block expansion well-anchored

- **Type**: general
- **Domain**: process
- **Disposition**: addressed (no finding required)
- **Confidence**: 100
- **Severity**: n/a
- **Evidence**: Lines 7-25 of iter3 cleanly distinguish iter3 fixes from iter2 carries; the "iter3 deltas at a glance" block adds 2 items and re-lists 8 inherited items. Locks count goes 15 → 18 consistently.

### F-P3-02 — Memory reads register extended for iter2 codex files

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: n/a
- **Evidence**: Lines 518-519 add `iter2/codex/*` and `iter2/claude/overall.md` as read paths; this matches the iter3 brief's inheritance requirement.

No new project-scope findings reach High/50 or Critical/75.

## Karpathy Failure Modes (Project lens)

- **Wrong assumptions**: NO — iter3 corrects iter2's wrong assumption (commits can't contain their own SHA) explicitly in the D9 narrative.
- **Overcomplexity**: NO — surgical 2-fix scope.
- **Scope creep**: NO — out-of-scope explicitly adds "writing sweep SHA into any tracked file."

## Must-Preserve list (Project lens)

1. The 18 locked decisions enumeration in two tables (Scope Contract + Decisions Log).
2. The brief-described 2-fix scope (F-CX-OV-01 + F-CX-OV-02).
3. The "writing the sweep commit SHA into any tracked file" Out-of-Scope addition.
4. The Memory reads register's iter2-codex + iter2-claude entries.
5. The Preserve list inheritance from iter1 (9) + iter2 (6).

## Verdict

**PASS**.

Driver: Project scope is intact. iter3 addresses exactly the two contracted findings without scope creep. F-CX-OV-01 (the high-severity one) is genuinely fixed at the project-scope level — Out-of-Scope explicitly forbids writing the SHA into any tracked file. F-CX-OV-02 is added as a surgical Stage G capture+verify pair; the project-scope brief authorizes this surgical add.

(Cross-perspective note: F-CX-OV-02's *mechanism* — relying on the squash commit body containing the source SHA — is empirically defective. That finding is owned by Consistency/Risk, not Project. The Project lens judges only whether the contracted brief was delivered with proper scope discipline; it was.)
