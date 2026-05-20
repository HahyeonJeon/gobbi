# Consistency Perspective — Batch 4 iter2 (Claude)

## Stage 0 — Fix verification

- **Fix 1 (Principle 2 clarification)** — Clarification paragraph explicitly bounds "ONE AGENT" semantics: it governs (1) producer/evaluator separation and (2) implementation category focus; it does NOT mean one spawned agent per perspective. Cross-references `delegation/SKILL.md` § Anti-Patterns. **Directly closes iter1 C-C-01 (the High finding driving REVISE).**
- **Fix 2 (Research demoted)** — Principle 1 Mechanism now reads "Ideation, Preparation, and Planning" with Research explicitly tagged as "a workflow sub-activity (typically occurring within Ideation or Preparation), not a standalone phase." `grep -n "Research phase" principles/SKILL.md` returns 0 — clean.
- **Fix 3 (mistake bootstrap)** — gobbi/SKILL.md Constraints line 227 now enumerates 6 skills (principles + orchestration + discussion + delegation + git + mistake). Line 45 has the full description. Line 47 says "These six skills." Cohere across all three sites.
- **Fix 5 (two-step validator)** — conventions.md branch validator now consistent with the "Description length 3–50 chars" row in the Rules table at line 64. Previously the regex alone didn't capture the length constraint; now the procedure does.
- **Fix 6 (trailer ordering)** — explicit ordering rule + Rule paragraph. Resolves any ambiguity between AI-Provenance-Record and Signed-off-by.

## Inheritance from iter1

iter1 Consistency verdict was REVISE with 4 in-scope findings (1 High, 2 Medium, 1 Low) plus 1 out-of-scope (C-C-03 deferred to issue #259):

| Finding | iter1 severity | iter2 disposition |
|---|---|---|
| C-C-01 Principle 2 wording vs evaluation topology | High | **Addressed** by Fix 1. The clarification paragraph cleanly separates "Iron Law" from "spawn topology" and cross-references delegation/SKILL.md anti-pattern. |
| C-C-02 Mistake-promotion mechanism conflict | Medium | **Addressed** by Fix 7. The Layer 1/Layer 2 split aligns the gobbi/SKILL.md description with the broader workspace-promotion model. |
| C-C-03 5-step vs 6-step drift in `.claude/CLAUDE.md` | Medium (out-of-scope) | **Deferred** per F-U-01 lock + #259. Out-of-scope: `.claude/CLAUDE.md`. Confirmed unchanged in iter2 (system reminder shows `.claude/CLAUDE.md` still says "5 productive steps" + "11 principles" — both drift cases remain out-of-scope). |
| C-C-04 Subject regex shape vs length | Medium | **Partially addressed** by Fix 5's two-step structure for branch validator. The subject regex itself (line 76) still uses `.{1,67}` rather than an explicit step. Re-asserted at Low. |
| C-C-05 Issue number optional vs required | Low | **Persists** — iter2 did not target. Re-asserted at Low. |

## New findings (iter2-introduced)

None — but spot-checked for partial-sweep regression on Fix 3 (mistake bootstrap). Grep confirms one site says "These six skills" (line 47). All three sites consistent. No regression.

## Typed findings (iter2)

### C-C-04 (carryover, downgraded) — Subject regex shape vs length conflation

- **Type**: docs_inconsistency
- **Domain**: docs-sync
- **Disposition**: open (persisted from iter1, downgraded Medium → Low)
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: conventions.md subject regex `.{1,67}` already enforces a length cap inside the regex, while branch validation was split into two steps by Fix 5. Inconsistent style: shape-only regex for branches (with explicit length check), shape+length combined for commits.
- **Remediation**: Either (a) split commit subject validation into the same two-step shape-then-length pattern, or (b) explicitly note that the commit regex's `.{1,67}` covers both shape and length (rationale: subject is short enough that combined is fine). Either closes the inconsistency.

### C-C-05 (carryover) — Branch regex makes issue number optional but Rules table requires it when applicable

- **Type**: docs_inconsistency
- **Domain**: docs-sync
- **Disposition**: open (persisted from iter1)
- **Confidence**: 60
- **Severity**: Low
- **Evidence**: conventions.md branch regex makes `(\d+-)?` optional, but the Rules table at line 61 says "Issue number when issue exists." A reader sees mismatch: regex permits no-issue branches, rule requires issue-when-exists.
- **Remediation**: Add a note: "The regex enforces shape only; the Rules table enforces semantic requirements (e.g., issue number when an issue exists). Both apply."

### C-C-03 (out-of-scope, restated for transparency) — `.claude/CLAUDE.md` drift

- **Disposition**: deferred per F-U-01 + #259
- **Evidence**: System reminder confirms `.claude/CLAUDE.md` still references "5 productive steps" and "11 principles" — the skill tree says 6 steps and 12 principles. Out-of-scope per briefing; no action this iteration.

## Low-confidence appendix

- **L-C-01 (confidence 30)** — Glossary's "Sole-writer" definition uses "finalized artifacts" — could the reader misread this as "all artifacts"? Probably not, but a one-word tweak (e.g., "persistent artifacts") would be tighter.
- **L-C-02 (confidence 25)** — Iron Law Index column header says "Iron Law (one-liner)" — minor terminology cousin of the Glossary entry; the Glossary doesn't have a row for "Iron Law" itself.

## Verdict

**PASS** — Fix 1 cleanly closes the iter1 High that drove the REVISE verdict. Fix 7 closes the iter1 Medium C-C-02. Two iter1 Lows + one downgraded Medium persist as carryovers. Out-of-scope C-C-03 remains deferred. Consistency converges PASS in iter2.
