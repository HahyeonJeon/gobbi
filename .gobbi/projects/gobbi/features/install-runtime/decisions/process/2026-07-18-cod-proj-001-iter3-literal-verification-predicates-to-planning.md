---
name: cod-proj-001-iter3-literal-verification-predicates-to-planning
description: Preparation's ten manual anchors lack literal, self-failing pass predicates for D2/D3's phase-document schema and D8's IP-3 probe-wiring — Planning must author them, not just map to broad anchors.
type: decisions
scope: feature
feature: install-runtime
status: proposed
created: 2026-07-18
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [process, verification]
keywords: [cod-proj-001-iter3, self-failing-check, phase-document-schema, probe-wiring, planning-constraint, accept-with-deferral]
author: claude
supersedes: null
superseded_by: null
related: [struct-f1-manager-phase-doc-boundary-guard]
---

# Planning must author literal, self-failing pass predicates for D2/D3's phase-document schema and D8's probe-wiring

## Context

Preparation iter3's readiness record (`2-preparation/outputs/preparation.md` § Manual Planning verification
anchors) claims its ten manual anchors, together with a two-way lock→destination trace, are the complete
verification burden Planning must copy into task acceptance criteria — "an unmapped lock or an unexplained
destination FAILS the handoff." The Codex iter3 evaluator (`evaluation/iter3/codex/overall.md`,
`evaluation/iter3/codex/project.md`) found this claim overstated: anchor 7 (`draft-iter1.md:92`, now
`outputs/preparation.md`) does not state a failing check for D2/D3's `phase identity` / `gate state` /
`confirmation_ref` fields, the ledger `Status` / `Claim kind` fields, the Phase-II premise-gate result, phase
ownership of source IDs, or the not-a-raw-log-copy predicate (`idea.md:198`, `idea.md:235-237`). Anchor 10
(`draft-iter1.md:95`) does not state a failing check for the required both-`topics.md`-and-`SKILL.md`
affirmative allowance or its A4/riskiest-assumption connection (`idea.md:206`, `idea.md:241`). The meta-level
two-way trace can map both clauses to the broad topic-level anchors (7 and 10) without ever producing a check
that fails when the clause is absent from a real phase-result document.

The reconciled iter3 verdict was Claude PASS + Codex REVISE, with COD-PROJ-001-ITER3 as the sole open
High/100 finding. The user reviewed the finding and chose **accept-with-deferral**: advance to Planning rather
than run a fourth Preparation DISCUSSION/WORK/EVALUATION iteration, on the condition that Planning closes this
exact gap before treating anchors 7 and 10 as complete.

## Decision

Defer COD-PROJ-001-ITER3 to Planning as a binding constraint, not a Preparation fix. Planning MUST author two
additional literal, self-failing verification predicates — one for D2/D3's phase-result-document schema/body/
provenance semantics, one for D8's IP-3 probe-wiring — and attach each to the Planning task(s) that implement
or verify anchors 7 and 10, rather than relying on the existing broad topic-level anchor text alone.

The two predicates Planning must add:

1. **D2/D3 phase-result-document schema/body/provenance check** (extends anchor 7): for each of the four
   `working/phase-results/{phase}.md` documents, FAIL unless the document states — per-field — `phase
   identity`, `gate state`, and `confirmation_ref`; FAIL unless its source ledger entries carry `Status` and
   `Claim kind`; FAIL unless the Phase-II document states the premise-gate result; FAIL unless every cited
   source ID is attributed to the owning phase; and FAIL if the document is a raw event-log copy rather than a
   synthesized readout (`idea.md:198`, `idea.md:235-237`).
2. **D8 IP-3 two-source-owner / A4 / override probe-wiring check** (extends anchor 10): FAIL unless BOTH
   `topics.md` AND `SKILL.md` carry the affirmative probe-continuation allowance (not one file only); FAIL
   unless that allowance is explicitly wired to A4 / the riskiest-assumption selection and to the override
   path (`idea.md:206`, `idea.md:241`).

## Rationale

The finding is High/100 (definite, tool-verified by literal clause-to-anchor comparison) and load-bearing:
without these two predicates, a Planning task can satisfy the topic-level anchor text while never checking
the specific fields/wiring the locked Idea (`idea.md:198`, `:206`, `:235-241`) requires, so a real phase-result
document could ship missing `confirmation_ref` or a single-file (not two-file) probe allowance and still read
as "anchor 7 / anchor 10 satisfied." Deferring — rather than blocking Preparation on a fourth iteration — is
appropriate because: the gap is narrow (two additional predicates on two of ten already-correct anchors, not
a structural rewrite); the readiness record's inventory, structure, and the other nine iter2 fixes are all
independently verified accurate (see `outputs/preparation.md` § Evaluation summary); and Planning is the loop
that already authors literal task-level acceptance criteria from these anchors, so it is the natural, in-scope
place to add clause-level precision rather than re-opening Preparation DISCUSSION for a wording fix.

## Alternatives considered

- **Re-enter Preparation DISCUSSION for a fourth iteration to add the two predicates directly to the
  readiness record.** Rejected by the user: the gap is narrow and precisely scoped, the anchors and trace
  structure are otherwise sound (all ten iter2 findings addressed), and Planning already re-derives literal
  per-task acceptance criteria from these anchors — adding clause-level predicates there is not
  meaningfully different work than adding them to the readiness record, but it avoids a fourth full
  DISCUSSION/WORK/EVALUATION cycle.
- **Accept the finding as a non-blocking Low/informational note (treat it like PREP-CLAUDE-ITER3-001).**
  Rejected: the finding is High/100, not Low/25 — it is definite (literal clause comparison) and load-bearing
  (a planner CAN produce a formally-complete trace while missing required source-contract facts), unlike
  PREP-CLAUDE-ITER3-001's Low/25 migration-obligation-trace-asymmetry, which is independently covered by
  anchors 2-3. Treating a High/100 as informational-only would silently drop real verification burden.
- **Dispute the finding as a false positive.** Rejected: the Codex evaluator's FP-check explicitly confirmed
  the finding does not require duplicating the Idea or deciding implementation mechanism — it tests only
  locked acceptance facts the readiness record's own "complete observable checks below" claim requires to be
  self-failing (`evaluation/iter3/codex/overall.md` § COD-PROJ-001-ITER3 — Full Stage-3 metadata, FP-check
  line). No mitigating evidence contradicts it.

## Consequences

Planning inherits a binding acceptance condition: the task(s) implementing or verifying anchors 7 and 10 MUST
carry the two literal predicates above as explicit, self-failing acceptance criteria — not merely a citation
of `idea.md:198/206/235-241`. Planning's own two-way lock→destination trace (inherited from the readiness
record) must show these two predicates as the destination for the D2/D3 and D8 clauses named above, so a
future audit can confirm the gap this finding names is closed, not merely re-mapped to the same broad anchor
text that left it open at Preparation iter3.

## Related

- [[struct-f1-manager-phase-doc-boundary-guard]] — the Ideation-staged disputed finding also carried forward
  as a live Planning constraint (STRUCT-F1); COD-PROJ-001-ITER3 is a second, independent Planning constraint
  from this loop's own evaluation, not a Ideation carry-forward.
