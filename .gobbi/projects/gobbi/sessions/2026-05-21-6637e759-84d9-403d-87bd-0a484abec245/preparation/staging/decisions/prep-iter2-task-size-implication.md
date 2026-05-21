---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
status: deferred
feature: repo-reset
supersedes: null
superseded_by: null
disposition: open
severity: Medium
confidence: 50
finding_id: F-CL2-PREP-RK-01
---

# F-CL2-PREP-RK-01: Option (a) "RECOMMENDED" hides task-size trade-off from Planning

## Context

iter2's F-CX-PREP-O-01 section stamps option (a) as "RECOMMENDED" without surfacing the task-size implication: a single-executor task spanning Stages 0–G end-to-end encompasses ~672 lines of concrete commands and multi-stage destructive operations. This is unusually large for a standard executor task.

The execution skill's typical task-size discipline expects focused, bounded tasks. Option (a) violates that norm. A Planning leader leaning on the "RECOMMENDED" label may pick option (a) without realizing it implies accepting an atypically large execution unit, creating a Hobson's choice:
- Option (a): simple but creates a very large task
- Option (b): task-size compliant but requires snapshot machinery overhead

Neither option is ideal; the tension should be explicit in Planning's AskUserQuestion.

## Decision

Document as open below-threshold finding. Planning's AskUserQuestion for the (a)/(b) choice SHOULD explicitly name the task-size implication of option (a) alongside the snapshot machinery overhead of option (b), so the user can make an informed trade-off rather than defaulting to "RECOMMENDED."

## Consequences

Planning leader should not blindly inherit the "RECOMMENDED" label from the pre-routed-gaps artifact without presenting the task-size context in the AskUserQuestion. The recommendation is non-binding; Planning chooses.

## Related

- `preparation/evaluation/iter2/claude/risk.md` § One new risk introduced, Medium / 50
- `preparation/artifacts/pre-routed-gaps.md` § F-CX-PREP-O-01 option (a)
