---
name: scope-narrowed-to-design-craft
description: User narrowed the startup-skill rewrite from adding commercial/startup axes to pure design-craft only.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-14
session: 97d3ef5a-1b8a-4dab-b884-9f686e185b22
tags: [design, process]
keywords: [craft-vs-graded-axis, commercial-scope, truth-serum]
author: claude
related: [confirm-craft-vs-graded-axis-when-user-narrows-scope]
---

# Scope narrowed to design-craft, not commercial grading

## Context

Early Ideation research ([[yc-canon]], [[startup-canon]], [[saas-metrics-pmf]], [[skill-frameworks]],
[[current-skill-gap-study]] — especially the SaaS-metrics canon) surfaced eight commercial-viability axes —
demand-as-market, willingness-to-pay/pricing, product-market-fit signal, business-model coherence,
go-to-market/distribution/growth, unit economics, moat/defensibility, competitive positioning — as
candidate graded gates for the `startup` skill. draft-iter1 built a DP-4 universal-spine +
conditional-commercial-modules architecture around them. The user reviewed this direction and
redirected the rewrite to design-craft only.

## Decision

The `startup` skill rewrite grades only design-craft substance — problem reality, user & job clarity,
product-shape soundness, and feasibility/sustainability — evidenced by past behavior. It adds
**zero** commercial-viability grading. The eight commercial axes, the DP-4 spine/modules machinery,
and any project-class gate are locked OUT, not deferred.

## Rationale

The key distinction the user drew is **craft vs. graded axis**, not "keep vs. drop the underlying
idea." Two interview truth-serums from the commercial research — "demand ≠ interest" (a user's
stated interest is not proof of demand) and the pay-for/workaround signal (what a user already gave
up to cope is stronger evidence than what they say they want) — survive, but ONLY as
elicitation-craft **principles** (the interview posture, and the behavioral-evidence branch of the
user/value topic), never as a forward-looking commercial **graded gate** (willingness-to-pay,
revenue, pricing). The same underlying signal plays two different roles depending on whether it
grades the INTERVIEW's rigor or the PROJECT's commercial viability; the user kept the former and cut
the latter.

## Alternatives considered

- **Keep the full DP-4 commercial-axes architecture** (draft-iter1's original direction) — rejected:
  out of scope for what the user wants this skill to do; commercial-viability grading is a distinct,
  separately-scoped decision.
- **Drop the truth-serums entirely along with the commercial axes** — considered and rejected as an
  over-scrub (flagged by the Ideation evaluator as `F-PROJ-MONEY-OVERSCRUB`): this would have thrown
  away a legitimate problem-reality signal ("money already spent") that has nothing to do with
  commercial grading.

## Consequences

- The shipped `startup` skill's design-craft principles enumerate the locked-out commercial axes
  explicitly, so Planning/Execution (and any future session) cannot silently reintroduce them.
- The 10 principles the rewrite shipped were audited to confirm none reads as a commercial-viability
  check in disguise — the feasibility/sustainability principle is explicitly NOT profit/commercial
  viability.
- Every future addition to `startup`'s acceptance surface must be checked against this
  craft-vs-graded-axis distinction before it is added — see
  [[confirm-craft-vs-graded-axis-when-user-narrows-scope]] for the generalizable process lesson.

## Related

- [[confirm-craft-vs-graded-axis-when-user-narrows-scope]] — the process mistake this decision's
  resolution pattern generalizes into
- [[startup-review-proportionality]] — the sibling decision on this session's evaluation approach
