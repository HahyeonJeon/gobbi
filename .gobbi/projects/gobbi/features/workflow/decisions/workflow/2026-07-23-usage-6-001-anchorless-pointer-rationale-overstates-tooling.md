---
name: usage-6-001-anchorless-pointer-rationale-overstates-tooling
description: Task 03's anchorless-SOP-pointer rule is correct but its stated justification claims an anchor-resolution check no tool in the plan performs.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [planning, verification]
keywords: [anchor-resolution, check-markdown-links, anchorless-pointer, rationale-overstatement]
author: claude
---

# The anchorless-pointer rule is right; its stated justification overstates the tooling

## Context

Planning task 03 forbids an anchored SOP pointer with the stated reason: "the craft pointer must be
anchorless so it resolves before task 01 rewrites the SOP." The narrative repeats it: "The craft
pointer is anchorless because it must still resolve at the stop point BEFORE task 01 rewrites the
SOP's headings." The iter-6 Claude evaluator (Usage perspective, `F-USAGE-6-001`, Low/100, confidence
100) confirmed empirically that `check-markdown-links.sh` states in its own header comment that it
does NOT validate heading anchors ("the path must exist; anchor validity is out of scope — this guard
verifies PATH resolution, not heading anchors"), and reproduced this with a constructed
`[bad](target.md#no-such-heading)` link: the guard reported only a separately-missing file and passed
the bad anchor silently. The Python anchor resolver that DOES validate anchors is scoped to the three
bundle files (task 05), never to `orchestration/workflow/planning.md`. So no gate in this plan would
actually detect a stale anchor in the workflow document.

## Decision

Accept the plan as-is for PASS. The RULE (keep the craft pointer anchorless) is correct — an anchor
into a document task 01 rewrites would go stale silently if the pointer WERE anchored, since no gate
validates it. Only the STATED JUSTIFICATION overstates what the tooling proves; carry the corrected
justification forward as a documentation note rather than a plan-blocking defect, since the underlying
engineering decision (anchorless) is sound regardless of the justification's wording.

## Rationale

- This is exactly the shape `mistakes/verification/guard-cited-as-runtozero-without-matching-vocab.md`
  records: a guard cited for a property its implementation does not cover. The risk is a future
  maintainer reading the current justification and believing anchored links ARE validated somewhere in
  this plan's guard set, when none of them are for the workflow document.
- A related, same-root gap: task 08 does not re-assert `grep -Fxq '## USER CHALLENGE'` on the workflow
  document at close time, although three consumer-gate rows point at `#user-challenge`. Tasks 03 and 09
  DO assert it, and the state-scope gate prevents any later task from editing that file, so the anchor
  cannot realistically vanish between task 09 and task 08 in the plan's own model — but the terminal
  close does not re-check the target it depends on.
- Correcting the prose costs nothing to the plan's mechanism and closes the misleading-tooling-claim
  risk without adding a new gate.

## Alternatives considered

- **Add anchor validation for the workflow document to task 03 or task 08's gate (REVISE iter 6).**
  Rejected: this is new guard machinery for a Low-severity documentation-accuracy gap, working against
  the "simplify the guards" direction; the anchorless-pointer choice already sidesteps the underlying
  risk without needing a new check.
- **Leave the justification wording as-is.** Rejected: it is a genuine, verifiable overstatement of
  what `check-markdown-links.sh` proves, and the corrected wording is a one-sentence fix available at
  the next opportunity to touch this text.

## Consequences

- Recommended (not prescriptive) wording for the next touch of task 03's rationale: "no guard
  validates heading anchors, so an anchored pointer into a document a later task rewrites would go
  stale undetected" — or add the workflow document to the anchor-resolver's scope, whichever the
  maintainer prefers.
- No Execution-loop follow-up obligation beyond normal task 03 authoring — the underlying anchorless
  choice does not need to change.

## Related

- [[cons-6-001-gate-copy-identity-unasserted]] — a sibling finding about a gap between what a section
  of the plan asserts and what its enforcement mechanism actually covers
- `mistakes/verification/guard-cited-as-runtozero-without-matching-vocab.md` — the recorded trap this
  finding is a live instance of
