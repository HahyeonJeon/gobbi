---
name: authoring-planning
description: "Authoring Planning splits settled writing work into goal-based tasks, one plan document per major goal. Use it when the writing work is too large for one task."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Authoring Planning

Authoring Planning splits accepted writing work into tasks, each defined by the goal it reaches. Use it when
the goal and design of writing work are settled but the work is too large for one task. It writes one plan
document per major goal and stops before implementation steps; the manager decides which tasks run in parallel
and which in order.

## Principles

### Split by goal, not by step

A task is one goal an author can reach and a reviewer can judge. Describe what must be true when it is done
and leave the method to the author, who knows the material better once it is in it.

### Define tasks the way you would delegate them

Each task becomes a [Delegation](../../delegation/SKILL.md) brief. A sharp Goal and enough Context let a capable
agent do its best work; every extra constraint, taste, or number takes some of that freedom away. The manager
adds the Role, Materials, and Return when it builds the brief.

## Rules

- **Cover the whole accepted work, with no added scope.** Every part of the goal and the Ideation result falls
  in exactly one task, so nothing is lost, done twice, or done unasked.
- **Write each task's Goal, Context, Constraints, and Taste and Preference as Delegation defines them.** The
  manager turns each task into a brief, so a Goal is an end state a reviewer can judge, Context is what the
  author cannot find alone, and a Constraint is a rule that must hold, with its reason.
- **Add a constraint or taste only from a source.** Each one narrows the author, so take it from the user,
  the Ideation result, a project rule, or existing docs, and leave the section out when there is none.
- **Set a numeric target only when the user, an accepted decision, or a project rule requires it.** Name the
  source next to the number, because quality beyond the Goal is judged in Review.
- **Leave implementation steps, file-by-file edits, and test lists out of the plan.** The author chooses the
  method, and an open design choice goes back to the caller instead of being decided in the plan.

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

- Name the major goals in the work, and write one plan document per major goal from the
  [plan template](templates/plan.md), named `plan-NN-slug.md` in the caller's output directory. One goal means
  one document.

#### 2.2 Split each goal into tasks

- Split the goal into the fewest tasks that each reach one goal one author can finish and a reviewer can
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
| [Authoring Ideation](../authoring-ideation/SKILL.md) | Prior owner of the writing design this plan follows. |
| [Authoring Execution](../authoring-execution/SKILL.md) | Later owner of each task. |
