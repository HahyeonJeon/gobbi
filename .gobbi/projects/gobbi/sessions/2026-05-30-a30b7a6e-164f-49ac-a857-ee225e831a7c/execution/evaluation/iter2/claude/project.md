# Execution Eval — Project (iter2, Claude)

**Target:** principles clarity rewrite + Principle 14, plus iter1 remediation commit ec2c735.
**Perspective:** Project — does the full change meet the user's goal?

## Verdict: REVISE

## What the user wanted
1. Principles state instructions literally; obscuring metaphors removed.
2. **No live doc still teaches retired wording.**
3. A new Principle 14 that is itself sound.

## Evidence (goals 1 and 3: MET)
- `principles/SKILL.md:384-402` Principle 14 ("Write Plainly and Literally") present, well-structured, self-referential (`:402`). Sound.
- P6 body `:139-155` literal ("Refine Vague Requirements Before Acting" / "DO NOT ACT ON A VAGUE REQUIREMENT; MAKE IT CONCRETE FIRST."); old metaphor gone.
- P10 body `:231-250` literal ("Change Only With a Real Trigger"); trigger defined concretely.
- `grep -c "^## Principle "` = 14; headings 1-14 ordered.

## Evidence (goal 2: NOT fully met)
- A live, tracked project-memory doc still teaches the retired P10 wording: `features/install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md:56` cites `Principle 10 (witness-bound work)`. See Risk RISK-01 (High). The user goal is literally "no live doc still teaches retired wording"; this one does.

## Findings
- Defers to **RISK-01** (High, docs-sync, conf 100) — stranded retired P10 wording in a live `features/.../decisions/` doc.

## Must-preserve
- P14 self-reference (`:402`) and the intentional quoted counter-examples (`:391-392`).
- The literal P6/P10 Iron Law wording now mirrored in both nav tables.
