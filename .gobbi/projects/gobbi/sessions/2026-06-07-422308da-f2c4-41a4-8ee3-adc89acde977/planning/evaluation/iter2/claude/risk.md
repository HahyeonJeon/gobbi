# Planning Eval — Risk (claude, iter2)

## Frame
Adversarial: what could go wrong at Execution? Stale anchors, scope leak, silenced gates, broken citations, a new defect from the revision.

## Walk
- **Anchor drift (was iter1 R-2).** Closed. Drift-guard now verifies by stable section name, not the wrong line 247. Even the locator line (266) is correct live; and the by-name check survives future shifts.
- **Silenced safety gate.** Adversarially checked. The mode-splits touch ONLY the 3 routine sites; the 6 safety sites get label-only treatment (T1(d) "No per-site BEHAVIOR edit"). T4(d) greps for any unclassified/un-interrupting survivor. A mode-split that silenced a safety gate would be caught. No silencing path.
- **Scope leak.** T4(g) verifies git diff touches only the 3 in-scope files; SKILL.md/chat-mode.md are read-only (T4 file ops = read). Live git status: clean for both. Low risk.
- **Broken citation.** Mutual edge resolved via generic wording (DD5) + both-direction T4(b) check. The §7 trailing-append does not renumber §1-§6 (T2 verifies-(b)), so the out-of-scope SKILL.md §3/§6 pointer stays valid.
- **New defect from the revision.** Searched. The two residual "SKILL.md:247" strings are assertions of absence, not operative pointers (cosmetic). The exhaustive table adds no behavior edit. No new defect found.

## Findings
None gating. Residual cosmetic: the meta-string "SKILL.md:247" appears twice in self-review/DD6 prose; harmless (asserts the stale pointer's removal). Confidence 100 it is non-operative — verified in context.
