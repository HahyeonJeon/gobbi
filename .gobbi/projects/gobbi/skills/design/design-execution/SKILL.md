---
name: design-execution
description: "Design Execution produces and verifies one accepted visual task. Use it when a task with a settled visual design changes visual work."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Design Execution

Design Execution produces, verifies, and hands off one accepted visual task. Use it when one accepted task has a
settled visual design and a writer frontier that includes visual work.

## Principles

### Deliver proven visual work, not a plan

The result is visual work that reaches the task Goal, with the evidence that it does. Grow it in small increments,
so each difference points at the last change.

### Compare like with like

A capture proves nothing alone; it proves the work unchanged or changed only against a baseline taken the same way.
Rendering varies by system, settings, and hardware, so the baseline and the final check run in one environment.

## Rules

- **Stop and return to the caller when the task or design leaves a material design choice open.** Design belongs
  to Design Ideation and the user, and a designer's guess becomes a design no one accepted.

## Procedure

### Phase 1 — Define the Task

Know the contract and the state the work starts from. Done when the contract is bound and the baseline is
recorded.

#### 1.1 Bind the task contract

- Read the task's Goal, accepted design, worktree, scope, writer frontier, commit authority, acceptance evidence,
  and handoff.
- Stop when writer isolation, authority, or a way to show the Goal is met is missing.
- Load the skills that govern the work: [Coding Execution](../../coding/coding-execution/SKILL.md) and the coding
  skills when the visual work is code, such as HTML or web UI, and the other skills the brief indexes.

#### 1.2 Record the baseline before the first edit

- A baseline taken after editing cannot separate this task's changes from earlier ones, so record it first, in
  the environment the final check will use.
- For UI, web pages, flows, and design systems, run the [Baseline Pins](#baseline-pins) in order. For other visual
  work, such as charts, slides, images, or motion, record a comparable state, such as a render, exported values,
  or a checksum, or mark the part unverified.
- Record each pin's command or capture, environment, and result, and list the sizes and states no pin covers.

### Phase 2 — Produce the Change

Reach the task Goal in small increments. Done when every scope item has a result and no affected surface is stale.

#### 2.1 Build each increment

- Build in small increments and compare each with the baseline before starting the next.
- Set exact token and measurement values here, under the token scheme the accepted design records, because Design
  Ideation stops before values.
- Regenerate generated output, such as exported tokens, from its source instead of editing it, because the next
  generation overwrites a hand edit.

#### 2.2 Reconcile dependents

- Update every component, style, design file, content, doc, and generated copy that uses a changed part.
- Remove every placeholder and temporary diagnostic, and account for each affected surface as changed or
  unchanged for a stated reason.

### Phase 3 — Verify and Deliver

Hand off the exact work that passed. Done when the final checks are recorded against the baseline and the handoff
is returned.

#### 3.1 Verify the final tree

- Rerun the baseline pins on the exact tree after the last edit, in the same environment, with animations off and
  dynamic content fixed.
- Fix a difference the Goal does not ask for and rerun the pins it touches. Stop after repeated unexplained
  failure, missing authority, or unsafe scope growth.
- Record each check's command or capture, environment, result, skips, and the sizes and states not checked.

#### 3.2 Deliver and return the handoff

- Commit the verified tree when the caller grants commit authority; otherwise leave it uncommitted as the caller's
  retained state.
- Return the [Delegation Handoff](../../delegation/SKILL.md#handoff-content) with the commit or tree identity, the
  checks against the baseline, and the reach account. Put design concerns and out-of-scope findings in its
  concerns.
- On a stop, keep the work as it is and return the owner, the failed obligation and its evidence, and the
  condition to resume.

## Baseline Pins

Run these for UI, web pages, flows, and design systems, cheapest first.

| Pin | What it compares |
|---|---|
| Resolved-token diff | Every token alias resolved to its final value, before and after, exactly and with no rendering. |
| Token lint | Hard-coded values where a token exists, and unknown tokens or properties. |
| Route and link inventory | Every route, URL, and link target the work exposes. |
| Accessibility tree and axe run | Roles, names, reading and focus order, and the findings of an automated axe accessibility scan. |
| Screenshots per viewport and state | Each target viewport and state, captured in one environment with animations off. |

## References

| Name | Description |
|---|---|
| [Coding Execution](../../coding/coding-execution/SKILL.md) | The execution steps for visual work that is code, such as HTML or web UI. |
| [Delegation](../../delegation/SKILL.md) | Handoff Content that Step 3.2 returns. |
