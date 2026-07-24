---
name: cons-6-001-gate-copy-identity-unasserted
description: The 13-row consumer gate is inlined 4x with no runnable check or instruction that an amendment must update every copy — an Execution-time operational risk.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [planning, verification]
keywords: [gate-duplication, copy-identity, amendment-path, tenth-consumer, task-09, task-01, task-08]
author: claude
---

# The inlined 4x consumer gate has no copy-identity assertion or amendment instruction

## Context

The Planning task decomposition's 13-row enumerated per-consumer gate appears four times — once in
the plan's own § Consumer gate section, and once each inside tasks 09, 01, and 08. Today all four
extractions are byte-identical (`md5 24dd803d1b7e478d9ba8a3821b4e2762`, 36 lines each). The iter-6
Claude evaluator (Consistency perspective, `F-CONS-6-001`, Medium/100, confidence 100) found that
§ Gate-failure remedy step 3 instructs, singular: "the row is fixed in the plan, the executor
re-runs" — nothing directs an amender to update all four copies, and no runnable check anywhere in the
plan asserts the three task copies remain identical. The plan explicitly treats amendment as a normal
path, not an exception: "This path also covers the discovery of a tenth consumer: add a row, re-run,
continue. It is the same procedure, not an exception."

## Decision

Accept the plan as-is for Planning PASS — this is a missing INSTRUCTION, not a broken mechanism, and
it cannot produce a wrong result on the plan's own expected (zero-amendment) execution path, which the
iter-6 evaluator proved end to end. Carry the risk forward explicitly as an **Execution-time
operational note**: any mid-loop amendment to the consumer gate (a row correction, or the
tenth-consumer discovery the plan itself names as the normal remediation path) must update all four
inlined copies, verified by re-computing the copy-identity md5 across § Consumer gate + tasks 09/01/08
after the edit.

## Rationale

- Two concrete divergence modes exist if this is left unaddressed during Execution: (1) a row
  corrected in task 09 only — tasks 01 and 08 fail loudly when they run (recoverable, noisy, costs a
  `NEEDS_CONTEXT` round-trip); (2) a row ADDED in task 09 only (the tenth-consumer case) — task 09
  verifies the new consumer, but tasks 01 (the strip) and 08 (the close) do NOT, so the strip and
  close pass without ever checking the tenth consumer — a silently weaker gate at exactly the two stop
  points where an orphan reference would bite.
- The plan's own self-review already demonstrates the producer knows to check copy identity (it
  records the md5 in § Self-review report), so the fix is a one-sentence documentation gap, not a
  design defect requiring a Planning-level REVISE.
- Adding a mechanical cross-copy-identity assertion now would be new guard machinery, working against
  the same "simplify the guards" direction that produced this plan's terminal iteration.

## Alternatives considered

- **Add a runnable identity assertion to the plan now (REVISE iter 6).** Rejected: correct in the
  abstract, but adds machinery for a documentation gap, and the finding is Medium/non-blocking — the
  fix is cheaper to apply as an Execution-time discipline note than as a new Planning-loop guard.
- **Do nothing and rely on the plan's existing self-review discipline.** Rejected: the self-review
  discipline is producer-authored and one-time; it does not survive into a MID-EXECUTION amendment by
  a different executor, which is exactly the risk scenario.

## Consequences

- The Execution manager MUST treat any amendment to the consumer gate — a row correction OR a new
  row — as a 4-copy edit: § Consumer gate, task 09, task 01, task 08, verified by re-computing the
  copy-identity md5 across all four locations before continuing.
- If Execution's own EVALUATION finds a genuine divergence between the copies (mode 1 or mode 2
  above), that traces back to this decision's accepted risk, not a fresh unrelated defect.
- This decision does not require a Planning-loop follow-up; it is closed at the Planning level and
  carried as an Execution-time note.

## Related

- [[proj-6-001-union-diff-obligation-not-gate]] — the sibling Medium finding from the same iter-6
  evaluation
- `mistakes/docs-sync/reharden-edit-blast-radius-miss.md` — the recorded trap this finding is a live
  instance of: a set-membership change needs a consumer sweep, and here the "consumers" of the
  13-row set are the plan's own three inlined copies
