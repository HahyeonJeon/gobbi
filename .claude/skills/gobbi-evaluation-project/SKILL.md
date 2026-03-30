---
name: gobbi-evaluation-project
description: ALWAYS load when evaluating any output at any stage. Examines whether the output solves the right problem — scope alignment, requirements fit, user intent, and project goals. This perspective is mandatory in every evaluation.
allowed-tools: Read, Grep, Glob, Bash
---

# Evaluation Perspective: Project

This perspective asks whether the output is solving the right problem. It is always relevant, at every stage, regardless of what is being evaluated. Load it alongside every evaluation skill.

Project perspective is not about how well the work is done — that is covered by other perspectives. It asks whether the work is aimed correctly in the first place.

---

## What This Perspective Examines

### Requirements Fit

The output must match what the user actually asked for. Not a plausible interpretation, not an improved version of the request, not a narrower or broader version — the actual thing. Requirements drift happens subtly: the agent solves a related problem that feels like the right one, or interprets an ambiguous requirement in the easiest direction.

Evaluating requirements fit means reading the original goal statement, then reading the output, and asking: if the user received only this output and had forgotten writing the original goal, would they recognize it as addressing their intent? If the answer is uncertain, requirements fit is in question.

### Scope Alignment

Every task has a stated scope boundary. Scope violations go in two directions: scope expansion (the output does more than asked, touching adjacent areas the task didn't include) and scope contraction (the output addresses only part of what was asked, leaving parts of the goal unaddressed).

Both violations matter. Scope expansion introduces risk — untested changes, side effects, and work that wasn't reviewed or approved. Scope contraction means the goal isn't met. Neither is "better than the alternative."

### Goals Alignment

The immediate task exists within a larger project context. The output may technically satisfy the task specification while working against a broader project goal — for instance, a task to add a config option might be implemented in a way that hardcodes behavior elsewhere, quietly defeating a reusability goal that existed before this task.

This requires understanding what the project is trying to achieve at a level above the current task, and checking whether the output reinforces or undermines that.

### User Intent

User intent is distinct from requirements. Requirements are what the user wrote. Intent is what they were trying to accomplish and the assumptions they brought to it. When the user asked for X, were they actually trying to achieve Y using X as the mechanism? If X turns out to be the wrong mechanism for Y, the output may be technically correct but fail the user.

Evaluating intent means asking whether the output delivers the outcome the user was seeking, not just the artifact they requested.

---

## Stage Relevance

At **ideation**, project perspective asks whether the proposed approach is aimed at the right problem and whether the scope is correctly bounded. Ideas that drift from the user's core need — even toward better technical approaches — should be flagged. Confirming project alignment before investing in planning saves the most time.

At **plan**, project perspective asks whether the task decomposition fully covers the approved idea with nothing dropped and nothing added. Plans are where scope shrinks silently: individual tasks each sound reasonable but the collection leaves gaps the idea addressed.

At **execution**, project perspective asks whether the implementation stayed within the delegated scope. This is the most tool-verifiable stage for scope: changed files can be enumerated, modified functionality can be traced, and the specification can be read against what was produced.

This perspective always adds signal. There is no stage where whether the right problem was solved is irrelevant.

---

## Scoring From This Perspective

Project findings tend toward high severity when they are confirmed. A scope violation or a requirements mismatch is not a minor stylistic concern — it means the work is incorrect in a way that affects the user's actual goal.

Confidence in project findings often depends on how clearly the original requirements were stated. When the goal document is specific and the output diverges from it, confidence should be high. When the requirement was ambiguous and the output chose one plausible interpretation, confidence should reflect that ambiguity.

Scope expansion findings are typically higher confidence than scope contraction findings, because expansion leaves artifacts that can be observed directly. Scope contraction requires reasoning about what is absent, which is harder to verify with tools.

A finding that the output solves the wrong problem entirely is the highest-severity finding possible in evaluation — it does not matter how well the work is executed if it is aimed at the wrong target. When this finding is present with high confidence, it overrides positive assessments from other perspectives.
