---
name: coding-planning
description: "Coding Planning is an operation for splitting defined code work into goal-based tasks, one plan document per major goal."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Coding Planning

Coding Planning splits accepted code work into tasks, each defined by the goal it reaches. Use it when
the goal and design of code work are settled but the work is too large for one task. It writes one plan
document per major goal and stops before implementation steps; the manager decides which tasks run in parallel
and which in order.

## Principles

### Split by goal, not by step

A task is one goal an executor can reach and a reviewer can judge. Describe what must be true when it is done
and leave the method to the executor, who knows the code better once it is in it.

### Define tasks the way you would delegate them

Each task becomes a [Delegation](../../delegation/SKILL.md) brief. A sharp Goal and enough Context let a capable
agent do its best work; every extra constraint, taste, or number takes some of that freedom away. The manager
adds the Role, Materials, and Return when it builds the brief.

## Rules

- **MUST cover the whole accepted work.** Every part of the goal and the Ideation result falls in exactly one
  task, and no task adds scope.
- **MUST write each task's Goal, Context, Constraints, and Taste and Preference as Delegation defines them.**
  Write a Goal as an end state a reviewer can judge, Context as what the executor cannot find alone, and
  Constraints only for rules that must hold, each with its reason.
- **NEVER add a constraint or taste without a source.** Take it from the user, the Ideation result, a project
  rule, or existing code, and write `None` when there is none.
- **NEVER set a numeric target unless the user, an accepted decision, or a project rule requires it.** Name the
  source next to the number. Quality beyond the Goal is judged in Review.
- **NEVER write implementation steps, file-by-file edits, or test lists.** Return an open design choice to the
  caller instead of deciding it in the plan.

## Procedure

### Phase 1 — Understand the Work

#### 1.1 Read the inputs

- Read the work goal, the Ideation result or the caller's topic contract when Ideation did not run, project
  rules, and the caller's output directory.
- Return missing input, a user-owned decision, or evidence against the accepted design to the caller with the
  exact question. Do not invent an answer.

### Phase 2 — Write the Plan

#### 2.1 Choose the plan documents

- Name the major goals in the work. Write one plan document per major goal from the
  [plan template](templates/plan.md), named `plan-NN-slug.md` in the caller's output directory. One goal means
  one document.

#### 2.2 Split each goal into tasks

- Split the goal into the fewest tasks that each reach one goal one executor can finish and a reviewer can
  judge on its own. Give each task a `task-NN-slug` ID that is unique across all plan documents.
- Write each task from the template, then draw the Task Graph: an edge `A --> B` for each task B that uses task
  A's result, with every task as a node, so the manager can tell what may run in parallel.

#### 2.3 Check and return the plan

- Reread every plan document. Check that the tasks cover the whole work without overlap, that each Goal can be
  judged without asking the planner, that the Task Graph shows every task and has no cycle, and that every
  constraint, taste, and number has its source.
- Fix what fails, then return the path of every plan document and its task IDs.

## References

| Name | Description |
|---|---|
| [Plan template](templates/plan.md) | One plan document per major goal, with its Task Graph and tasks. |
| [Delegation](../../delegation/SKILL.md) | Defines each task's Goal, Context, Constraints, and Taste and Preference. |
| [Coding Ideation](../coding-ideation/SKILL.md) | Prior owner of the code design this plan follows. |
| [Coding Execution](../coding-execution/SKILL.md) | Later owner of each task. |
