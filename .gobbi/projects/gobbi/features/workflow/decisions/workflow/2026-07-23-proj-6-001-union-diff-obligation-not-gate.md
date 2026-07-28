---
name: proj-6-001-union-diff-obligation-not-gate
description: The locked "union-diff clean" success criterion for the Planning split is carried by a prose executor obligation, not a self-failing gate.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [planning, docs-sync]
keywords: [union-diff, named-primitive-granularity, task-03, success-criterion]
author: claude
---

# The union-diff-clean success criterion rests on an obligation, not a gate

## Context

The Ideation Scope Contract's third Success Criterion requires the folded workflow document to carry
the full Gobbi Planning peer procedure "with no capability lost vs the pre-split `planning/SKILL.md`
(union-diff clean)." Planning task 03's mechanical acceptance is a 17-needle `grep -Fq` loop
(`3-planning/working/draft-iter6.md:299`). The iter-6 Claude evaluator (Project perspective,
`F-PROJ-6-001`, Medium/100, confidence 100) enumerated named primitives present in the pre-split
source at HEAD `68b1c66a` and absent from that needle set — 22 named primitives, including
`Parallel lanes`, `Conflict flag`, `Model Selection`/`model override`, `Spec coverage`,
`Placeholder scan`, `restore/iter`, `discussion-log.md`, `reconciliation-iter`, `proposals/codex`,
`degraded mode`, `production_mode`, three `artifact_type:` values, `Dependency table`,
`Agent assignments`, `Decisions log`, `NOT in scope`, `Scope reference`, and `File map`.

## Decision

Accept the plan as-is for PASS: the criterion is carried by a stated CONTRACT (task 03's narrative:
"The acceptance loop is the mechanical floor; the Verify evidence must also include the inventory with
every local primitive mapped to its surviving heading or pointer") plus a named METHOD (the exact git
object `git show 68b1c66a:...`, a three-way primitive classification, and a named evidence artifact) —
not by a mechanical gate that fails closed on a genuine drop. Defer mechanizing the ~22-primitive
inventory to Execution's own Verify evidence for task 03, rather than blocking Planning on it.

## Rationale

- The plan does not CLAIM the 17-needle gate proves union preservation — it names the floor as a
  floor, and the honest-limitation discipline (§ Honest limitation, § What this plan does not prove)
  is already the corrected posture from the iter-5 FAIL.
- The named method is real and checkable at Execution's Verify phase: a specific git object, a
  three-way classification, a named evidence artifact.
- `skills/planning/mistakes.md` § *Plan Verification As Contract Not Must Pass Now Shell* prescribes
  exactly this discipline — a plan may state a contract enforced at Verify time rather than mechanizing
  every check into a pre-written gate.
- Mechanizing the full ~40-needle inventory into task 03's gate would fight the user's explicit
  iter-5 ruling ("simplify the guards") — the session already REVISE'd 4 times on guard-mechanics
  complexity before the user redirected away from more mechanism.

## Alternatives considered

- **Mechanize the full named-primitive needle set now (REVISE iter 6).** Rejected: it would grow
  task 03's gate from 17 to ~40 needles, re-inflating exactly the guard-complexity axis the user
  directed the session away from at iter 5, for a Medium-severity, non-blocking gap.
- **Drop the union-diff success criterion.** Rejected: it is a locked Ideation Scope Contract item
  (Success Criterion 3), not a Planning-loop decision to relax.

## Consequences

- Execution's task 03 Verify evidence MUST include the primitive inventory with every local primitive
  mapped to its surviving heading or pointer — this decision does not waive that obligation, it defers
  its enforcement mechanism from a pre-written gate to Execution-time verification discipline.
- The Execution evaluator should specifically probe task 03's actual Verify evidence against this
  22-primitive list (reproduced above) rather than trusting the 17-needle gate's green as sufficient.
- If Execution's task 03 Verify evidence shows a genuine drop among the named primitives, that is a
  new `design_flaw` finding at Execution EVALUATION, not a regression against this Planning decision.

## Related

- [[cons-6-001-gate-copy-identity-unasserted]] — the sibling Medium finding from the same iter-6
  evaluation; both are "the verification machinery is strong at the mechanical level, weaker one level
  up" findings
- `archive/mistakes/docs-sync/2026-07-26-union-diff-must-reach-named-primitive-granularity.md` — the recorded trap this
  finding is a live instance of
