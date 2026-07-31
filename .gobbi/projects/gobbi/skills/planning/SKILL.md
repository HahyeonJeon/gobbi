---
name: planning
description: "MUST load when defined work must be decomposed into an executable plan. Planning is an operation skill for defining a hierarchy of groups and tasks and each task's work, assigned agent, and order."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Planning

Use this skill to turn defined work into an executable plan. Break the work into a hierarchy of groups and
tasks, decomposing each group until every task is actionable. For every task, define its work, assign one
accountable agent role, and set its order relative to its dependencies.

## Principles

### Separate task hierarchy from execution order

The task hierarchy explains how broad work divides into decomposable groups and bounded tasks. Execution
order explains how those tasks build on one another and which independent tasks may run in parallel. Keeping
these views separate prevents parent-child structure from being mistaken for dependency order and exposes
safe parallel work that can reduce total execution time.

### Bound each task for one accountable agent

Planning is complete only when one accountable agent can understand and finish each task from its recorded
work, boundary, output, context, and required capabilities. If completion requires hidden coordination, the
task is too broad or its recorded details are incomplete.

## Rules

### Must follow

- **MUST preserve scope and coverage.** Every planned task comes from the defined work, and every defined work
  item appears in the task hierarchy and final plan.
- **MUST make the execution order dependency-valid.** No task or group precedes its prerequisites, and the
  dependency relationships contain no cycles.
- **MUST record facts rather than guesses.** Work metadata comes from the available work and project
  context; an unknown value remains explicitly unresolved instead of being invented.

## Procedure

### Phase 1 — Understand the Defined Work

#### 1.1 Understand the work, purpose, scope, output, and design

- Understand the work by reading the defined work and its supporting materials.
- Understand the purpose by identifying why the work is needed and what it is intended to achieve.
- Understand the scope by identifying what is included, excluded, deferred, or rejected and where the work
  stops.
- Understand the output by identifying what must exist or be observable when the work is complete.
- Understand the design by identifying the chosen structure, responsibilities, relationships, and constraints
  that shape the work.

### Phase 2 — Decompose the Work Top-Down

#### 2.1 Draft and initialize top-level groups

- For each distinct work item, draft a provisional top-level group whose wide boundary contains the subwork
  to be decomposed.
- Treat each top-level group as a decomposition starting point rather than a bounded execution task.
- Initialize `tasks.tmp.md` with the complete provisional set of top-level groups as a mutable Phase 2 working
  record that is neither final authority nor returned.

#### 2.2 Decompose each top-level group recursively

- Read `tasks.tmp.md` as the current decomposition.
- Decompose each top-level group recursively into smaller groups and tasks.
- Separate foundation, layout, structure, interface, or skeleton work that other work must build upon.
- Continue splitting groups with distinct outcomes, responsibilities, agent capabilities, change boundaries,
  dependencies, shared resources, handoffs, or independently executable work until each resulting task is
  bounded enough for one agent role to complete.
- Write the complete updated decomposition back to `tasks.tmp.md` after each group is decomposed.

#### 2.3 Record and freeze the task hierarchy

- Create an independently readable `tasks.md` from [the task hierarchy template](templates/tasks.md) using
  the completed `tasks.tmp.md`, with the complete hierarchy and the work, boundary, and output of every group
  and task.
- Freeze `tasks.md` as the intermediate decomposition for Phase 3 and do not edit it afterward.
- Delete `tasks.tmp.md` after the frozen `tasks.md` is complete.

### Phase 3 — Reorganize and Plan for Bottom-Up Execution

#### 3.1 Group and order tasks for bottom-up execution

- Read the frozen `tasks.md` and initialize `plan.tmp.md` as a mutable Phase 3 working record that is neither
  final authority nor returned.
- Group related bounded tasks, using their wider parent groups as the initial group boundaries.
- Determine the bottom-up order of the task groups before ordering their child tasks.
- Place foundation, layout, structure, interface, or skeleton groups before dependent groups, and place
  integration groups after their contributing groups.
- After the group order is set, order the child tasks within each group by their prerequisites.
- Write the task order and hierarchy to `plan.tmp.md`.

#### 3.2 Define and detail the ordered tasks

- Annotate each ordered task with its final ID, title, work, boundary, and output, then assign it to one
  accountable agent role with the required capabilities.
- Add only the inputs, constraints, and handoffs the assigned agent needs to execute the task.
- Write the complete ordered task definitions back to `plan.tmp.md`.

#### 3.3 Add work metadata

- Add the repository, project root, working directories, Git base branch, work branch, worktree, required
  skills, tools, runtimes, platforms, access, environment configuration, and artifact locations to
  `plan.tmp.md` when applicable.
- Record shared metadata once for the whole plan and record task-specific differences on the affected tasks.

#### 3.4 Record and freeze the plan

- Create an independently readable `plan.md` from [the plan template](templates/plan.md) using the
  completed `plan.tmp.md`, with the bottom-up order and each task's complete work, assigned agent, order, and
  execution details.
- Update `plan.tmp.md` and regenerate `plan.md` when a task or its order is incomplete.
- Freeze `plan.md` as the final Planning authority, delete `plan.tmp.md` after the frozen plan is complete, and
  return `plan.md`.

## References

- [`tasks.md`](templates/tasks.md) defines the frozen top-down task hierarchy.
- [`plan.md`](templates/plan.md) defines the frozen plan for bottom-up execution.
