# Evaluation — Project perspective (Claude, iter1)

**Target:** principles clarity pass (commits 31d53f9, d9cdbc5).
**Verdict:** PASS

## What the user asked for
Principles should state instructions clearly and literally; metaphors that obscured the instruction removed; a new P14 codifying plain literal language; user-locked SURGICAL calibration (keep defined shorthand).

## Assessment
The goal is met. Verified by reading OLD (`git show 7e25f76`) vs NEW canonical (`.gobbi/projects/gobbi/skills/principles/SKILL.md`):

- **P6** title `Specificity Is the Only Currency` → `Refine Vague Requirements Before Acting` (line 139); Iron Law → `DO NOT ACT ON A VAGUE REQUIREMENT; MAKE IT CONCRETE FIRST.` (141). The metaphor ("currency", "transact in vagueness") is gone; the literal instruction is now the title and law. The "Comfort is a warning sign" aphorism is replaced with a literal heuristic (148). Behavioral requirement unchanged. GOOD.
- **P10** title `Witness-bound Work` → `Change Only With a Real Trigger` (231); Iron Law MOTIVATOR → TRIGGER (233); concept word `witness`→`trigger` throughout body (235,238,239,240,250). The coined term "witness" is replaced by the literal "trigger", and the list that defines it ("a session, a logged error, a user request...") is retained. GOOD.
- **P11** title `Metrics Are Signals, Not Targets` → `Improve the Property, Not the Metric` (254); Iron Law + Goodhart sentence kept per lock. The new title states the literal instruction (improve the property) rather than the abstraction. GOOD.
- **P14** (382-400) is sound and useful: Iron Law is literal and imperative; Why explains the decode-step failure mode; Discipline gives 4 concrete writing rules; Anti-rationalizations name the real temptations; Mechanism ties to the Planning/Execution eval gates and acknowledges the `discussion` skill's separate remit. The intentional `"a witness"` counter-example (390) is present per lock. GOOD.

P14's Mechanism self-references "the Principle 1-13 clarity rewrite... is judged against [this rubric]" — this is an accurate and useful framing, not a circular claim.

## Findings
None at Project severity. The work delivers the user's intent.

## Must-preserve
- The literal P6/P10/P11 titles and Iron Laws.
- P14's 4-rule Discipline block and the `discussion`-skill delineation sentence.
- The retained Goodhart sentence (P11) and the defined trigger-list (P10).
