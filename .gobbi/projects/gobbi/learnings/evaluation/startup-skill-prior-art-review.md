---
name: startup-skill-prior-art-review
description: What shipped from the startup-skill prior-art review (6-file rewrite, 10 principles, 5 design-substance families) and the process lesson that dual-system Execution evaluation caught 5 semantic defects mechanical guards missed.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-14
session: 97d3ef5a-1b8a-4dab-b884-9f686e185b22
tags: [process, evaluation, verification]
keywords: [startup-skill, design-craft, dual-system, teeth-check, prior-art-review]
author: claude
related: [acceptance-gate-and-conjunct-escape-hatch, startup-review-proportionality]
---

# Prior-art-driven review of the startup skill: what shipped, and why dual-system Execution evaluation mattered

## Insight

A design that reads clean to its own producer and passes every mechanical guard can still ship a
semantic contradiction that defeats its own stated purpose — catching this class of defect requires
an independent adversarial reader, not a second mechanical pass.

## Context

This session ran a prior-art-driven deep review of gobbi's `startup` skill: five parallel research
leaders mined YC canon, the startup-book canon (Mom Test, Lean Startup, Running Lean, Disciplined
Entrepreneurship, Four Steps, Zero to One), SaaS/PLG metrics, AI-skill-framework prior art (gstack,
superpowers), and an adversarial gap map of the pre-rewrite skill (see
[[yc-canon]], [[startup-canon]], [[saas-metrics-pmf]], [[skill-frameworks]],
[[current-skill-gap-study]]). The user narrowed the scope mid-Ideation to design-craft only (see
[[scope-narrowed-to-design-craft]]), and Execution then applied the locked design across five tasks:
a rewrite of `SKILL.md` to 10 principles, a rewrite of `topics.md`'s traversal rules and Topic 2/3,
five new design-substance scenario/checklist families (including a "failability teeth" family meant
to make a hollow baseline FAIL), and the matching `evaluation.md` propagation. `recording.md` (the
promotion/recovery machinery) was locked out of the rewrite and verified byte-unchanged.

The Claude Execution evaluator returned Overall PASS at iter1 with only 2 Low findings, having run
all 4 mechanical guard scripts (link check, residual-vocabulary sweep, eval-childdoc classification,
skill-mistakes conformance) green. The independent Codex evaluator, working from the same frozen
artifact with no visibility into the Claude read, returned Overall REVISE with 5 High-confidence
`design_flaw` findings — most notably an AND-conjunct in the new teeth check's acceptance predicate
that let an owned-but-unevidenced claim pass, directly contradicting the design's own two-gate rule
(see [[acceptance-gate-and-conjunct-escape-hatch]]). Two remediation passes (iter2, iter3) closed all
5 findings; a regression pass of 8 probes confirmed no prior fix reopened.

## Reason

The cost of losing this insight is real: a future session with a "mechanically clean, evaluator-PASS"
artifact could reasonably assume the artifact is done and skip or shortcut the second independent
evaluator, exactly the scenario this session shows is riskiest. The specific defect class this
session surfaced — a multi-conjunct acceptance/gate predicate that silently loosens instead of
tightens a check — is subtle enough that neither the artifact's own author, a single careful
evaluator, nor any of the four mechanical guards caught it.

## How

- When authoring or reviewing any multi-conjunct acceptance/gate/teeth predicate ("fails when A and
  B and C"), truth-table it across every combination against the document's own separately-stated
  invariants before treating it as done — see [[acceptance-gate-and-conjunct-escape-hatch]] for the
  concrete technique.
- Do not treat a mechanically-clean, single-evaluator-PASS artifact as sufficient evidence to skip or
  weaken the standing mandatory dual-system Execution evaluation gate, even when the artifact "looks
  solid" — see [[startup-review-proportionality]] for the session-level evidence this insight rests
  on.
- When a user narrows scope mid-session with a category-spanning term (e.g., "drop the commercial
  axes"), confirm which specific role of the term is being cut before re-designing — this session's
  applied instance kept the interview-craft truth-serums while cutting the commercial-grading role
  of the same underlying signal (see [[scope-narrowed-to-design-craft]]).

## Counter-cases

- This insight does NOT argue every loop needs full dual-system evaluation regardless of cost — the
  same session shows single-system Ideation evaluation was proportional *because* the dual-system
  signal was already delivered at PRODUCTION for that loop (a genuine Codex proposal with a
  documented integration log). The mandatory-dual-system argument applies specifically to Execution,
  where evaluation is gobbi's non-optional gate, and to any loop where PRODUCTION did NOT already
  deliver an independent second read (a degraded/absent Codex proposal, as this session's own
  Execution production was).
- The truth-tabling technique for multi-conjunct acceptance predicates does not by itself replace
  dual-system evaluation — it is a review HEURISTIC an evaluator (or author) can apply; this session's
  evidence is that even with the heuristic available in principle, only the independent second
  evaluator actually applied it and caught the defect.

## Related

- [[acceptance-gate-and-conjunct-escape-hatch]] — the specific mistake this learning's technique
  guidance is drawn from
- [[startup-review-proportionality]] — the session-level decision this learning's process insight
  validates
- [[scope-narrowed-to-design-craft]] — the design decision that set the rewrite's final scope
