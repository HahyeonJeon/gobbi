---
name: acceptance-gate-and-conjunct-escape-hatch
description: An AND-conjunct in an acceptance-gate predicate folded a coverage property (ownership) into acceptance, creating a silent escape hatch that contradicted the doc's own two-gate rule.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-14
session: 97d3ef5a-1b8a-4dab-b884-9f686e185b22
tags: [process, verification, execution]
keywords: [acceptance-gate, conjunct, teeth, two-gate, coverage-vs-acceptance, truth-table]
author: claude
priority: high
domain: process
related: [startup-review-proportionality]
---

# An AND-conjunct acceptance predicate created a coverage/ownership escape hatch

## What happened

The `startup` skill's Family-5 "failability teeth" check — the mechanism whose entire job is to
make a hollow, un-evidenced baseline FAIL — was authored with the predicate: an applicable claim
drives REVISE only when it is **un-evidenced AND un-owned AND** not-proven-irrelevant
(`scenario.md:295-296` pre-fix, `checklist.md:240` pre-fix, `evaluation.md:282` pre-fix). Because
the predicate was an AND of three conditions, an **owned-but-un-evidenced** applicable claim — the
exact case the teeth exist to catch — passed the local check. This directly contradicted the same
document's OWN separately-stated two-gate rule (`checklist.md:26-32`, `SKILL.md:304-307`,
`evaluation.md:69-75`): `recorded-open` with an owner closes **coverage**, but is explicitly NOT an
**acceptance** pass. The Family-5 predicate erased that distinction it was supposed to enforce. The
design (Ideation) introduced the inconsistency when it wrote the family/check text; Execution
faithfully transcribed the design as written, so the defect entered the shipped artifact unchanged.

## Why it happens

Acceptance/gate logic with more than one AND-ed condition is fragile exactly where one conjunct is
actually a **coverage-gate property** (ownership: "recorded-open with an owner" is a valid branch
closure for coverage) that gets wrongly folded into the **acceptance-gate predicate** (substance
evidence: is the claim itself backed by evidence). The author conflated two separate gates that the
document elsewhere kept distinct. Writing "fails when X and Y" reads as stricter than "fails when X"
alone, so the extra conjunct looks like it tightens the check — it actually loosens it, because
adding an AND to a failure condition narrows the set of things that fail.

## Correct approach

State the acceptance predicate **positively and with a single condition**: a claim is accepted when
it is *evidenced-or-proven-irrelevant* — full stop. Keep coverage-gate properties (ownership,
`recorded-open` status) **out of the acceptance predicate entirely**; they belong only to the
separate coverage check. Before shipping any multi-conjunct acceptance/teeth/gate check: **truth-table
it** across all combinations of its conditions (here: owned/unowned × evidenced/unevidenced) and
verify each cell against the document's own stated invariants and the user's locked decisions — not
just against the isolated check text. This is exactly what the corrected predicate does
(`scenario.md:296`, `checklist.md:241`, `evaluation.md:282` post-fix): "un-evidenced and not
proven-irrelevant drives REVISE — ownership does not excuse it, `recorded-open` is coverage, not
acceptance."

## How to detect

Any acceptance/gate/teeth check phrased as "fails when A **and** B **and** C" (or "passes when A
**or** B") should trigger a truth-table review: enumerate every combination of the conjuncts and ask
whether each cell's outcome matches the document's own separately-stated invariant and any locked
user decision on the same topic. A red flag specific to this trap: one of the conjuncts names a
property (ownership, ticket status, review sign-off) that a DIFFERENT section of the same document
already defines as a **coverage**, not **acceptance**, closure condition — that is the conflation.
Mechanical guards (parity diffs, count sweeps, link checkers, vocabulary greps) do **not** catch this
class of defect: all 4 guards were green and the Claude evaluator's own PASS missed it. Only an
adversarial semantic reader — one who truth-tables the gate against the doc's own invariants —
surfaces it.

**Meta:** this was a **dual-system win**. The Codex Execution evaluator (`COD-EXE-CONS-001`) caught
this exact contradiction where the Claude evaluator's independent PASS and all four mechanical
guards missed it entirely. It reinforces that mechanical guards are necessary-but-not-sufficient and
that dual-system semantic evaluation — not mechanical verification alone — is what catches
acceptance-logic defects of this shape.

## Related

- [[startup-review-proportionality]] — the session-level decision this finding validates: the
  proportionality choice to run full dual-system evaluation at Execution paid off exactly here.
- See also `evaluation/SKILL.md` § Finding Metadata and `evaluation/mistakes.md` — this class of
  acceptance-gate defect is evaluation-relevant: an evaluator auditing any multi-conjunct
  acceptance/teeth check should truth-table it against the artifact's own separately-stated
  invariants, not just read the check text in isolation. The evaluation skill's own mistakes surface
  may want a companion entry for this evaluator-side truth-tabling discipline.
