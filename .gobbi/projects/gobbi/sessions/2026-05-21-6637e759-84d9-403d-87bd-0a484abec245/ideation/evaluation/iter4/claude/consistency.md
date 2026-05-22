# Ideation iter4 — Consistency (claude)

## Stage 0 — Target Understanding

Consistency = cross-section claims about the same fact agree. iter3's defect (F-C3-01 + F-C3-02 High/100) was that I11/D11/D2 #20-21/Success #14/Stage G all repeated an empirical claim about squash-commit body shape that was false on this repo. iter4 must replace ALL those occurrences with a coherent new claim.

## Stage 1 Locked Frame (Consistency perspective)

- Scenario C1: every mention of the merge-head guard mechanism agrees across sections.
- Scenario C2 (adversarial — inheritance of F-C3-01/02): no remnant of the iter3 body-grep claim survives in any section.
- Scenario C3: 19-lock count cross-checked in all enumerations.
- Scenario C4: D2 verification command count agrees (the new "20" claim).

## Stage 2 — Walked checklists + inherited disposition

### Inherited from iter3

- **F-C3-01 + F-C3-02 (High/100, iter3 body-grep claim inconsistency)** — **addressed by iter4**. Grep across iter4 for `mergeCommit.oid`, `grep -F`, `--json mergeCommit` returns only the "removed" historical mention at D2 #20 (line 413) and the iter3-narrative in D11 (line 492). All other prior occurrences are deleted. iter4's new claim ("atomic head-match guard at merge time, exit-code is the gate") is consistent across:
  - iter4 delta bullet (line 9)
  - Scope Contract → In-Scope iter3+iter4 merge bullet (line 70)
  - Out-of-Scope post-merge body-grep removed (line 82)
  - Decisions Locked Q-iter4-Override (line 118)
  - Success Criterion #14 (line 135)
  - I11 (line 227-230)
  - S6b (line 249)
  - S13 (line 256)
  - Stage G (line 348-359)
  - Critical Invariant #7 (line 371)
  - D1 (line 381)
  - D2 #20 (line 411-413)
  - D6 D11 row (line 455)
  - D11 (line 490-504)
  - Decisions Log Round 6 (line 568-580)
  - WORK-exit checklist (line 668-672).
  Disposition: `addressed-by-iter4`.

### Walked checklists

- **C1 — cross-section coherence**: every mention of Stage G's gate now reads "capture `HEAD_SHA` (audit-log) → `gh pr merge --squash --delete-branch --match-head-commit "$HEAD_SHA"` → exit 0 ⇒ pass, exit ≠ 0 ⇒ NEEDS_CONTEXT". The phrasing varies but the semantic content is identical.
- **C2 — no body-grep remnants**: confirmed by grep. Only historical "iter3's separate ... commands are removed" reference at D2 #20.
- **C3 — 19-lock count**: title says "19 locks"; Scope Contract says "Decisions Locked (19 total)"; Stage G PR-body bullet says "cites the 19 locked decisions (Q1–Q8, Q-A–Q-G, Q-Survivor, Q-StageE, Q-Gate-Redesign, Q-iter4-Override)" — enumerates 8 + 7 + 2 + 1 + 1 = 19. Cross-section count consistent.
- **C4 — D2 count = 20**: title says 20; line 448 says "iter4 collapsed iter3's 21 down to 20"; D2 explicit numbering ends at #20 (last entry at line 411). Internally consistent.

## New iter4-only findings

None.

## Must-preserve list

- Every section that mentions the Stage G guard uses the same atomic-flag semantic (no drift to "post-merge inference" anywhere).
- 19-lock count is consistent across header / Decisions Locked / Stage G PR-body bullet.
- D2 count of 20 verifications is consistent.

## Verdict

**PASS**.
