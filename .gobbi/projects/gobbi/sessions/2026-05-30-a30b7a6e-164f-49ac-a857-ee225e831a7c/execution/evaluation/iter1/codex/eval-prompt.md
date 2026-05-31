You are the independent Codex-system evaluator in a dual-system review. Review a committed documentation change in this repository. Do NOT modify any file except writing your single findings file. Findings only — do not propose or apply fixes.

## The change under review (two commits on the current branch HEAD)

Commit 31d53f9: removed the "Iron Law Index" quick-reference table from `.gobbi/projects/gobbi/skills/principles/SKILL.md` and updated Principle 13's blast-radius example from "three places" to "two places".

Commit d9cdbc5: a plain-language clarity rewrite plus a new Principle 14, in the same file, with co-updates:
- Principle 6 title -> "Refine Vague Requirements Before Acting"; Iron Law -> "DO NOT ACT ON A VAGUE REQUIREMENT; MAKE IT CONCRETE FIRST."; removed the "Comfort is a warning sign" aphorism.
- Principle 10 title -> "Change Only With a Real Trigger"; Iron Law MOTIVATOR -> TRIGGER; the concept word "witness" standardized to "trigger" across P10 body and the P12 cross-reference.
- Principle 11 title -> "Improve the Property, Not the Metric" (Iron Law and Goodhart sentence kept).
- New "Principle 14 — Write Plainly and Literally" (Iron Law "USE PLAIN, LITERAL LANGUAGE; DO NOT REPLACE A LITERAL STATEMENT WITH A METAPHOR.") governing all agent-authored text.
- Co-updates: `.claude/CLAUDE.md` Iron Law table rows 6/10 mirrored, new row 14, count 13 -> 14; `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` line 44 (P6 title cross-reference); `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` (P10 title + concept word).

## User-locked parameters — do NOT report these as problems (they are deliberate)
- SURGICAL calibration: body-defined shorthand is kept on purpose (P11 "games the tool"/Goodhart, P13 "CRUD"/"blast radius", P4 "contract/client").
- Principle 14 reach = all agent-authored text.
- The quoted "a witness" counter-example inside Principle 14 is intentional.

## Your task
Read the actual files (use `git show HEAD~2:<path>` for pre-change state) and review these perspectives:
1. Project — does it meet the goal (principles now state instructions literally; obscuring metaphors gone; P14 sound)?
2. Consistency — do CLAUDE.md Iron Law table rows 6/10/14 match the principles' Iron Laws character for character; is the principle count 14 in EVERY place it appears in CLAUDE.md and in the principles file; do orchestration:44 and the backlog match the new titles; is there any meaning-drift in any rewritten principle; is P14 self-consistent; is the P13 example correct?
3. Structure — does P14 match the existing principle format (Iron Law / Why / Discipline / Anti-rationalizations / Mechanism); are the `---` separators and section ordering intact; valid markdown?
4. Risk — any STRANDED reference to an old title, old Iron Law, or the deleted index in LIVE docs (search `.claude`, `skills/`, `agents/`, `rules/`, `backlogs/` — EXCLUDE frozen `sessions/` and `archive/`); any behavioral regression; did witness->trigger break any cross-reference?

Run real greps. Verify the CLAUDE.md table equals the principles Iron Laws exactly. Confirm `grep -c "^## Principle " .gobbi/projects/gobbi/skills/principles/SKILL.md` equals 14. Look hard for half-applied count co-updates (a "13" left behind) and missing separators.

## Output
Write your findings to this exact relative path (you are anchored at the repo root via --cd):
`.gobbi/projects/gobbi/sessions/2026-05-30-a30b7a6e-164f-49ac-a857-ee225e831a7c/execution/evaluation/iter1/codex/findings.md`

Format: for each perspective give a verdict (PASS / REVISE / FAIL) and list each finding with severity and exact file:line evidence. End the file with a single line: `AGGREGATE: PASS` or `AGGREGATE: REVISE` or `AGGREGATE: FAIL`. Be adversarial and concrete.
