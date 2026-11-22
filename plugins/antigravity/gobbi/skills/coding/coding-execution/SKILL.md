---
name: coding-execution
description: "Coding Execution implements and verifies one accepted code task. Use it for an agreed Goal with authority to change code."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Coding Execution

Coding Execution gives the developer responsibility for reaching an agreed Goal within the authorized code
surface. The developer chooses the internal implementation and hands the verified result to the caller.

## Principles

### Deliver proven code, not a plan

The result is code that reaches the task Goal, with the evidence that it does. Grow it in small working
increments that expose the behavior or assumption a reviewer can test next.

### Apply the principles to real code

The [Coding Principles](../principles.md) judge real Ontology units, parameters, and callers, so apply them as code
is written and simplified. Simplicity comes first: the task adds only mechanism that a current caller needs.

### Leave no stale reach

A change is complete when every caller, mirror, generated output, test, and document it affects agrees with
it. The code's real dependencies decide that set, not the repository type or file extension.

## Rules

- **MUST commit only when the caller grants commit authority.** Commits are the caller's to grant; without
  that authority, the exact verified uncommitted tree, kept under the caller's retained-state policy and
  neither staged nor committed, is the completed result.
- **Return a choice that changes the Goal, a client decision, a public contract, or agreed cost or risk.**
  Internal structure, patterns, and implementation order belong to the developer within those boundaries.
- **Stop before changing a surface outside the scope or writer frontier.** Another owner holds it, so return
  its effect, its owner, and the next action it needs; do the same for out-of-scope findings.
- **NEVER run Coding Review, write a review report, claim reviewer independence, issue a verdict, accept the work,
  or change mode state.** Review needs a reviewer that did not produce the work, and acceptance belongs to the
  caller.

## Procedure

### Phase 1 — Define the Task

Know the contract and the state the code starts from. Done when the contract is bound and the baseline is
recorded.

#### 1.1 Bind the task contract

- Read the task's Goal, accepted design, worktree, scope, writer frontier, commit authority, retained-state
  policy, acceptance evidence, and handoff. Without Ideation, the task contract is the accepted design.
- Stop when writer isolation, authority, or a way to prove the Goal is missing. A missing Ideation design or
  missing commit authority alone is not a stop.
- Load each language, framework, platform, tool, and domain skill that governs the code, and
  [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md) when the change
  creates or changes classes, interfaces, or inheritance.

#### 1.2 Record the baseline before the first edit

- A baseline taken after editing cannot separate this task's failures from earlier ones, so take it first.
- For a defect, reproduce the original symptom. When you cannot, record why and use a diagnostic baseline the
  caller accepts, or stop rather than guess the cause.
- For any other change, run the relevant existing checks and record which already fail.

### Phase 2 — Implement the Change

Reach the task Goal in small working increments. Done when every scope item has a result, nothing the task
added fails the Simplicity tests, and no affected surface is stale.

#### 2.1 Build and prove each increment

- Choose the order that exposes a useful outcome or tests the riskiest assumption early. For a testable
  defect, add a regression check that fails before the fix and passes after it.
- Preserve accepted contracts and explain consequential implementation choices in the handoff. For a new
  public unit, make its responsibility and caller contract clear as
  [Modularization](../principles.md#modularization)
  describes.
- Regenerate generated output from its canonical source instead of editing it, because the next generation
  overwrites a hand edit.

#### 2.2 Simplify and reconcile before verifying

- Remove each Ontology unit, parameter, option, and hook the task added that fails the
  [Simplicity](../principles.md#simplicity) tests, and every placeholder, temporary diagnostic, and stale path.
  When mechanism the accepted design requires fails them, keep it and record a concern.
- Account for every affected surface as changed or unchanged for a stated reason.
- Replace each Ontology unit the task added that repeats knowledge an existing Ontology unit holds with a call to
  that unit. Restructure internal units when their responsibilities change, and escalate changes to an agreed
  contract before depending on them.

### Phase 3 — Verify and Deliver

Hand off the exact tree that passed. Done when the final tree's checks are recorded and the handoff is
returned.

#### 3.1 Verify the final tree

- Run checks on the exact tree after the last edit: focused checks, then the affected or project checks the
  task requires, then the original reproducer when one exists.
- Compare each failure with the baseline, and repair only a cause this task introduced, then rerun what the
  repair touches. Stop after repeated unexplained failure, missing authority, or unsafe scope growth.
- Record each check's command or observation, environment, result, skips, and limits.

#### 3.2 Deliver and return the handoff

- Commit the verified tree when the caller grants commit authority; otherwise retain it under the caller's
  retained-state policy.
- Return the [Delegation Handoff](../../delegation/SKILL.md#handoff-content) with the commit or retained-tree
  identity, the verification record, affected surfaces, and consequential design choices. Put accepted-design
  concerns and out-of-scope findings in its concerns.
- On a stop, keep the worktree as it is and return the owner, the failed obligation and its evidence, the safe
  retained state, what not to do next, and the condition to resume.

## References

| Name | Description |
|---|---|
| [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md) | Defaults and entries for code that creates or changes classes, interfaces, or inheritance. |
| [Coding Principles](../principles.md) | Simplicity, modularization, reusability, readability, naming, and intuitive public API, applied while code is written and simplified. |
| [Delegation](../../delegation/SKILL.md) | Handoff Content that Step 3.2 returns. |
