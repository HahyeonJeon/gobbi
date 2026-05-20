# Structure Perspective — Batch 4 iter2 (Claude)

## Stage 0 — Fix verification

- **Fix 9 (Iron Law Index)** — `principles/SKILL.md` line 15 adds a 12-row table `Iron Law (one-liner)` indexed by `#`. Directly closes iter1 S-S-01.
- **Fix 8 (Glossary)** — `gobbi/SKILL.md` line 15 adds an 8-row glossary. Provides scannable entry-skill anchoring.
- **Fix 5 (validator two-step)** — `git/conventions.md` line 15-38 reorganizes branch validation into "Step 1 — shape regex" + "Step 2 — length check on slug" with an example block. Structure improves: previously the length cap was ambiguous between subject and slug.
- **Fix 6 (trailer order)** — `git/conventions.md` lines 132-140 add an explicit numbered ordering plus a Rule paragraph. Closes a structural gap.

## Inheritance from iter1

iter1 Structure verdict was PASS with 3 findings (1 Medium, 2 Low):

| Finding | iter1 severity | iter2 disposition |
|---|---|---|
| S-S-01 principles lacks Iron Law index | Medium | **Addressed** by Fix 9. The 12-row index sits immediately under the load-when paragraph. |
| S-S-02 git/SKILL.md Constraints duplicates Memory Access Matrix | Low | **Persists** — iter2 did not target. Re-asserted at Low. |
| S-S-03 gobbi Skill Map categorizes principles inconsistently | Low | **Persists** — iter2 did not retarget. The Glossary indirectly helps anchor naming, but the Skill Map's category placement of `principles` is unchanged. Re-asserted at Low. |

## New findings (iter2-introduced)

None. The Glossary and Iron Law Index are both pure structural additions with no displacement effects.

## Typed findings (iter2)

### S-S-02 (carryover) — git/SKILL.md "Constraints" duplicates Memory Access Matrix + Role Boundaries

- **Type**: structural_duplication
- **Domain**: docs-sync
- **Disposition**: open (persisted from iter1)
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: git/SKILL.md still carries a "Constraints" section that re-states fragments of the Memory Access Matrix and Role Boundaries already present in `delegation/SKILL.md`. Mild duplication, not contradictory.
- **Remediation**: Either delete the duplicated rows and link to delegation, or scope the Constraints section to git-specific concerns only.

### S-S-03 (carryover) — Skill Map categorization of `principles` row

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open (persisted from iter1)
- **Confidence**: 40
- **Severity**: Low
- **Evidence**: gobbi/SKILL.md Skill Map lists `principles` in a category that doesn't quite match its actual role (behavioral floor, loaded by every agent, not a workflow participant). The Glossary helps but doesn't re-categorize.
- **Remediation**: Move `principles` into its own row above the workflow categories with a label like "Behavioral floor (always-on)".

## Low-confidence appendix

- **L-S-01 (confidence 30)** — The Iron Law Index uses dual quotes "(one-liner)" in the header. Style preference only; rest of the skill tree uses no parenthetical sub-headers in tables. Low confidence — internal consistency at the file level is what matters and that holds.
- **L-S-02 (confidence 20)** — Glossary's "Sub-phase" row uses slash-separated values (`DISCUSSION / WORK / EVALUATION / MEMORIZATION`) where other rows use comma-separated. Minor inconsistency.

## Verdict

**PASS** — Fix 9 closes the single Medium finding from iter1; Fix 8 cleanly adds structural anchoring without disrupting existing sections; Fix 5 + 6 tighten conventions.md structure. Two iter1 Low findings persist as carryovers, neither a blocker. Structure converges PASS.
