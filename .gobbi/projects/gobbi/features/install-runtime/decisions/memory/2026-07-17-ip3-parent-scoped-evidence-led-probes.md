---
name: ip3-parent-scoped-evidence-led-probes
description: IP-3 = Option IP-3-A — flat parent-scoped {branch}.p{n} probe ids for unbounded evidence-led follow-ups, plus reframing both live topics.md clauses that currently forbid the target behavior.
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [design, process]
keywords: [ip-3, probe-id, evidence-led-depth, contrary-clause-reframe, startup]
author: claude
supersedes: null
superseded_by: null
related: []
---

# IP-3 = Option IP-3-A: parent-scoped `{branch}.p{n}` probe ids, unbounded evidence-led depth, both contrary clauses reframed together

## Context
The user's third improvement point asks the startup interview to allow unbounded, evidence-led hierarchical
follow-up questions, not only the listed script. This is not merely under-sanctioned in the current source —
it is AFFIRMATIVELY FORBIDDEN in the exact state the user wants deepened: two live clauses,
`topics.md:47-51` and `:519-524`, each end "Do not probe when the first answer is already concrete and
evidenced," directly contradicting the locked A4 depth-allocation principle (`SKILL.md:51`).

## Decision
IP-3 = Option IP-3-A: parent-scoped `{branch}.p{n}` probe ids — flat per-parent (no nesting), monotonic,
never reused, each carrying an explicit parent reference and inheriting the parent's Level-2 closure; probes
never add required coverage (the 46-branch validity gate stays defined on Level-2 branches only). Two
distinct rules coexist: a ≤2-repair cap for the SAME still-vague answer (anti-badgering), and unbounded,
evidence-led depth for a productive, evidence-advancing chain — the two are never conflated. Both live
`topics.md` clauses (`:47-51` and `:519-524`) are reframed TOGETHER to the identical vague-repair-vs-
evidence-depth distinction: keep the vague-answer cap and the no-restate-a-concrete-answer rule, while
allowing a concrete answer that exposes a new in-scope claim to open a new evidence-advancing child
question.

## Rationale
laddering, five-whys, and the funnel technique all support variable, answer-derived depth over a fixed
question count — the model is "stop when it stops moving," not a preset number of whys. The two clauses'
existence was discovered only after the initial design (COD-CONS-001-ITER2, iter2 High finding): supplying a
NEW allowance without reframing the two clauses that categorically forbid the exact target behavior would
leave the source self-contradictory — an agent could correctly cite either old clause to refuse the new
behavior. Fixing this required CRUD-ing BOTH copies together (not just adding new prose), per the loaded
mistakes `cotouch-enumeration-must-cover-semantic-equivalents` and
`sweep-must-grep-synonymous-phrasings-not-just-primary`, which require a sweep to reach duplicate
contrary commands and grade them semantically, not just lexically.

## Alternatives considered
- **Option IP-3-B / IP-3-C** — rejected at the design gate (D-4); not the parent-scoped flat-id model the
  user selected.
- **Add the new allowance without reframing the two old clauses (iter1/iter2 shape)** — rejected after
  COD-CONS-001-ITER2 (iter2 High): produces a self-contradictory source where depth is both allowed (new
  prose) and forbidden (old clauses), letting an agent's probe behavior depend on which contradictory clause
  it happens to follow.
- **A numeric depth cap on productive chains** — rejected; contradicts the locked "unbounded, evidence-led"
  answer (A4) and is not supported by any of the three interview-technique references, which model
  stop-when-unproductive rather than a fixed ceiling.

## Consequences
`recording.md §2` gains the `{branch}.p{n}` `Answer ID` scheme; `topics.md` gains a falsifiable 3-part
residual predicate (IP-3-a2) that FAILs any in-scope clause recognizing a concrete/evidenced answer AND
categorically forbidding further probing WITHOUT preserving the new-in-scope-claim allowance, searched by
concept + synonym (not only the exact old sentence). Total probe growth is honestly uncapped: `total probe
events = Σ pᵢ over the 46 parents`, each `pᵢ` data-dependent — the 46-branch count bounds mandatory Level-2
COVERAGE only, never the number of probes per parent (corrected from iter2's COD-PERF-002 finding, which had
implicitly treated 46 as a total-probe bound).

## Related

(no direct `[[slug]]` decision links; discussion-log D-4 is this decision's authority trail; the
contrary-clause reframe traces to Codex iter2 finding COD-CONS-001-ITER2, addressed this loop)
