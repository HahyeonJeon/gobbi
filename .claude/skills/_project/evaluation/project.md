# Project Evaluation — Project Perspective

This perspective answers one question: does the deliverable solve the right problem? Load this skill when evaluating project output — code implementations, documentation updates, configuration changes, refactoring results — from the requirements and goals angle.

The evaluator's job is to find gaps and misalignments, not to confirm success.



---

## Core Principle

> **The task spec is not the goal. The user's intent is the goal.**

A deliverable can satisfy every written requirement and still miss the point. This perspective checks whether the output serves what the user actually needed — not just what was written in the task description.

> **Scope alignment works in both directions — expansion and contraction both fail.**

Over-delivering changes things the user didn't ask for. Under-delivering leaves requested work undone. Both are misalignments. Neither is acceptable without explicit sign-off.

---

## Evaluation Lenses

### Requirements Fit

Does the deliverable match what was explicitly asked for?

Read the original task specification and trace each requirement to the output. Requirements that were addressed ambiguously — implemented in a way that technically satisfies the wording but misses the intended behavior — are a failure of requirements fit, not just of aesthetics.

Look for requirements that were silently reinterpreted. When an agent rewrites a requirement as something subtly different and implements that instead, the spec is met on paper but not in substance.

### Scope Alignment

Is the scope of the change correct — neither too broad nor too narrow?

Scope creep is the more common failure: adjacent code refactored "while I was in there," formatting normalized beyond the task boundary, or additional features added that weren't requested. These changes may be improvements in isolation but represent unauthorized decisions.

Scope contraction is less common but equally problematic: partial implementation that stops short of the full requirement, edge cases silently dropped, or deferred handling not flagged as deferred.

When scope appears off in either direction, assess whether the deviation was noted and the user given the chance to approve it.

### Goals Alignment

Does the output serve the user's intent — the problem behind the task?

This requires understanding the why, not just the what. A bug fix that closes the reported symptom but leaves the root cause intact solves the wrong problem. A documentation update that answers the literal question but confuses the actual workflow the user is trying to understand misses the goal.

Ask: if the user ran this deliverable, would they feel their original problem was resolved? If not, why not?

---

## Signals Worth Investigating

These patterns are not automatically failures, but each warrants examination:

- Changes touching files or components not mentioned in the task
- Requirements that appear in the spec but are absent from the output
- Behavior changes that go beyond the stated scope
- Assumptions about user intent that were not confirmed
- Partial implementations without a noted rationale for deferral

---

## Output Expectations

Report findings as specific, grounded observations — not impressions. For each gap, identify the requirement it traces to, describe the actual output, and explain the misalignment. Rate the severity: whether the gap blocks the deliverable from serving its purpose (critical), creates a visible shortfall (significant), or is a minor deviation that does not affect the core result (minor).

Where the deliverable is well-aligned to goals, note what is working — not as praise, but because the overall perspective (read by the next evaluator) needs to know what must be preserved.
