---
name: coding-planning
description: "Coding Planning splits settled code work into goal-based tasks, one plan document per major goal. Use it when the code work is too large for one task."
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

A task is one goal a developer can reach and a reviewer can judge. Describe what must be true when it is done
and leave the method to the developer, who knows the code better once it is in it.

### Define tasks the way you would delegate them

Each task becomes a [Delegation](../../delegation/SKILL.md) brief. A sharp Goal and enough Context let a capable
agent do its best work; every extra constraint, taste, or number takes some of that freedom away. The manager
adds the Role, Materials, and Return when it builds the brief.

## Rules

- **Cover the whole accepted work.** Every part of the goal and the Ideation result falls in exactly one task
  and no task adds scope, so nothing is dropped or done twice.
- **Write each task's Goal, Context, Constraints, and Taste and Preference as Delegation defines them.** The
  manager builds each brief from them, so a Goal is an end state a reviewer can judge, Context is what the
  developer cannot find alone, and Constraints are only rules that must hold, each with its reason.
- **Give every constraint and taste a source.** Take it from the user, the Ideation result, a project rule, or
  existing code, and leave the section out when there is none, because an unsourced limit narrows the developer
  for no reason.
- **Set a numeric target only when the user, an accepted decision, or a project rule requires it.** Name the
  source next to the number, because quality beyond the Goal is judged in Review.
- **Leave implementation steps, file-by-file edits, and test lists to the developer.** The developer knows the
  code better once it is in it; return an open design choice to the caller instead of deciding it in the plan.

## Procedure

### Phase 1 — Understand the Work

Know what to plan and where it goes. Done when the inputs are read and any missing input, user-owned decision,
or evidence against the accepted design has gone back to the caller.

#### 1.1 Read the inputs

- Read the work goal, the Ideation result or the caller's topic contract when Ideation did not run, project
  rules, and the caller's output directory.
- Return missing input, a user-owned decision, or evidence against the accepted design to the caller with the
  exact question. Do not invent an answer.

### Phase 2 — Write the Plan

Turn the work into goal-based tasks. Done when every plan document passes the Step 2.3 checks and their paths
and task IDs are returned.

#### 2.1 Choose the plan documents

- Name the major goals in the work. Write one plan document per major goal from the
  [plan template](templates/plan.md), named `plan-NN-slug.md` in the caller's output directory. One goal means
  one document.

#### 2.2 Split each goal into tasks

- Split the goal into the fewest tasks that each reach one goal one developer can finish and a reviewer can
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
