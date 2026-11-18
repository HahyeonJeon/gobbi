---
name: design-execution
description: "Design Execution produces and verifies one accepted visual task. Use it for an agreed Goal with authority to change visual work."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Design Execution

Design Execution delivers an agreed visual outcome and evidence a viewer can inspect. The designer chooses how
to realize it within the accepted direction and authorized surfaces.

## Principles

### Deliver proven visual work, not a plan

The result is visual work that reaches the task Goal, with the evidence that it does. Grow it in small increments,
so each difference points at the last change.

### Compare like with like

A rendered result can show whether a new flow works. A claim about what changed needs comparable evidence
from before and after, captured with the same settings.

## Rules

- **Return changes to the agreed viewer outcome, visual direction, authority, cost, or risk to the caller.**
  The designer chooses realization details within those bounds and verifies their effects.

## Procedure

### Phase 1 — Define the Task

Know the contract and what evidence will show the change works. Done when the contract is bound and any comparison
that needs a before-state has one.

#### 1.1 Bind the task contract

- Read the task's Goal, accepted design, worktree, scope, writer frontier, commit authority, acceptance evidence,
  and handoff.
- Stop when writer isolation, authority, or a way to show the Goal is met is missing.
- Load the skills that govern the work: [Coding Execution](../../coding/coding-execution/SKILL.md) and the coding
  skills when the visual work is code, such as HTML or web UI, and the other skills the brief indexes.

#### 1.2 Record the baseline before the first edit

- Choose checks for the Goal, affected surfaces, and regression risk, including any required project checks.
  Capture a before-state before editing wherever a comparison will be needed.
- Use the [Baseline Pins](#baseline-pins) to choose evidence, such as fit and accessible name at the
  affected sizes for a button label, or consumers, themes, and states for a shared token change.
- For new work, verify the rendered result against the Goal and accepted direction. Record the environment
  for comparisons and name any material gaps.

### Phase 2 — Produce the Change

Reach the task Goal in small increments. Done when every scope item has a result and no affected surface is stale.

#### 2.1 Build each increment

- Build a coherent version a reviewer can use or see. Exercise the main flow and the assumption that would
  cost most to discover late, and make remaining limitations visible at the checkpoint.
- Set exact token and measurement values here, under the token scheme the accepted design records, because Design
  Ideation stops before values.
- Regenerate generated output, such as exported tokens, from its source instead of editing it, because the next
  generation overwrites a hand edit.

#### 2.2 Reconcile dependents

- Update every component, style, design file, content, doc, and generated copy that uses a changed part.
- Remove every placeholder and temporary diagnostic, and account for each affected surface as changed or
  unchanged for a stated reason.

### Phase 3 — Verify and Deliver

Hand off the exact work that passed. Done when the required checks and evidence for the whole assigned Goal
are recorded on the delivered version.

#### 3.1 Verify the final tree

- Run the selected and required checks on the final tree, expanding coverage where the change exposed risk.
  Match the baseline environment and control animation or dynamic content when comparing renders.
- Fix a difference the Goal does not ask for and rerun the pins it touches. Stop after repeated unexplained
  failure, missing authority, or unsafe scope growth.
- Record each check's command or capture, environment, result, skips, and the sizes and states not checked.

#### 3.2 Deliver and return the handoff

- Commit the verified tree when the caller grants commit authority; otherwise leave it uncommitted as the caller's
  retained state.
- Return the [Delegation Handoff](../../delegation/SKILL.md#handoff-content) with the commit or tree identity, the
  checks for the Goal, any comparisons, and the affected surfaces. Report design concerns and out-of-scope
  findings.
- On a stop, keep the work as it is and return the owner, the failed obligation and its evidence, and the
  condition to resume.

## Baseline Pins

Select the comparisons that can reveal a failure on the affected surfaces.

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
