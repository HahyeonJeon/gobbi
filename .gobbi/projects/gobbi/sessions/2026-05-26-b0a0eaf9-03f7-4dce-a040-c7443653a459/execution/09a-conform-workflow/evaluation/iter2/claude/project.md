# Evaluation — Project (Claude, iter2, fc17c34)

**Perspective:** Project (brief↔delivery contract fidelity)
**Target:** T9a iter2 — restore KEEP keys, de-crypt cryptic titles, codify §4.4 KEEP list.

## Contract checks
- iter1 (1287e88) was REVISE for over-stripping KEEP keys (`project`, `title`) and leaving cryptic-led titles. iter2 brief = fix exactly those two regressions + codify the KEEP list. Every commit-message Part (A restore keys, B de-crypt, C KEEP list) maps to a brief item; no scope creep.
- CHECK 2: `project: gobbi` restored at README.md:14; `title:` restored at wrap-up-step-2-5-anchor-placement.md:12 (tool-verified on disk). Both were the exact keys iter1 over-stripped.
- CHECK 1: cryptic-led-title gate (broadened: T#/Task/D-/W#-T/COD-/F-/iter#/CP-/LOCK) over features/workflow excl archive = **empty**. All 8 cryptic headings de-crypted.
- CHECK 4: §4.4 KEEP-list subsection added (git show fc17c34 rules.md): table by category (base/cross-ref/provenance/per-type/backlog) + "When in doubt, KEEP" rule. Matches brief verbatim.

## Findings
None. Delivery == contract. No under-delivery, no over-delivery, no unrequested scope.

**Type:** n/a · **Severity:** n/a · **Confidence:** 100 (tool-verified diff + on-disk grep)

VERDICT: PASS
