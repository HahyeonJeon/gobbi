# Evaluation — Consistency perspective (Claude, iter1)

**Verdict:** REVISE

## Cross-file mirror correctness
Verified character-for-character (canonical principles file vs `.claude/CLAUDE.md` header table):
- Row 6: `DO NOT ACT ON A VAGUE REQUIREMENT; MAKE IT CONCRETE FIRST.` — EXACT match (CLAUDE.md:43 ↔ SKILL.md:141). ✓
- Row 10: `NO CHANGE WITHOUT A REAL TRIGGER.` — EXACT match (CLAUDE.md:47 ↔ SKILL.md:233). ✓
- Row 11: `NO IMPROVEMENT THAT GAMES THE TOOL.` — unchanged, EXACT. ✓
- Row 14: `USE PLAIN, LITERAL LANGUAGE; DO NOT REPLACE A LITERAL STATEMENT WITH A METAPHOR.` — EXACT match (CLAUDE.md:50 ↔ SKILL.md:384). ✓
- CLAUDE.md header Iron Law table has 14 rows; header prose says "The 14 principles below" (CLAUDE.md:31). ✓
- Intro count "Fourteen principles" (SKILL.md:9). ✓
- `grep -c "^## Principle "` == 14; P14 heading unique (count 1). ✓
- orchestration/SKILL.md:44 P6 cross-ref updated to new title. ✓
- backlog watchlist:29 P10 title + concept word updated to "Change Only With a Real Trigger"/"trigger-bound". ✓

## No meaning-drift
Read OLD vs NEW for each rewritten principle — behavioral requirement is unchanged in every case (P6 refine-before-acting, P10 trigger-bound change, P11 improve-property-not-metric). No drift.

## P13 example correctness
P13 blast-radius example updated `three places` → `two places` (SKILL.md:339) and the now-deleted "Iron Law Index table" reference removed; remaining two co-update targets (principles body + CLAUDE.md table) are correct post-deletion. ✓

## FINDINGS

### C-1 — CLAUDE.md navigation footer still says "13 behavioral principles" (stale count)
- **Type:** checklist_gap / **Domain:** docs-sync / **Disposition:** open
- **Severity:** High / **Confidence:** 100
- **Evidence:** `.claude/CLAUDE.md:62` — `| [principles](skills/principles/SKILL.md) | 13 behavioral principles every agent must follow — MUST load at session start; ... |`. The header table at CLAUDE.md:31 and rows now total 14, and the intro at principles/SKILL.md:9 says "Fourteen", but this footer nav-table description was not co-updated from 13→14.
- **Why it matters:** CLAUDE.md is the always-loaded, always-visible doc. It now contradicts itself ("The 14 principles below" at line 31 vs "13 behavioral principles" at line 62) and contradicts the skill it links to. This is exactly the half-applied co-update failure P13 warns about — the count co-update landed in two of three places in CLAUDE.md. A reader scanning the nav table sees a wrong count on the canonical entry doc.
- **Suggested direction:** the count in the CLAUDE.md nav-table row for principles is a co-update target of any principle-count change.

## Must-preserve
- The exact header-table mirror (rows 6/10/14) — it is correct; do not disturb it while fixing the footer.
- "Fourteen" in SKILL.md:9 and "14 principles" in CLAUDE.md:31.
