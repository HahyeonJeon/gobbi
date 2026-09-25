---
name: coding-planning
description: "Coding Planning is an operation for turning defined code work into a traceable task hierarchy, a dependency-valid execution plan, and the assignment contract those require."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Coding Planning

Coding Planning turns accepted code work into a fine-grained task hierarchy, a flat,
dependency-valid execution plan, and the assignment contract those require.
Use it when scope and direction are defined for code work but that work still needs decomposition, grouping, order, and dispatch.
It records both views as one indexed result and stops before implementation recipes,
repository study dumps, file-level edit recipes, and verification methods.

## Principles

### Separate task hierarchy from execution order

The task hierarchy explains how broad work divides into decomposable groups and leaf tasks, while execution
order explains how combined task groups build on one another through `Requires` and which independent groups
may run in parallel. Keeping these views separate prevents parent-child structure from being mistaken for
dependency order and exposes safe parallel work.

### Size each task group for one agent

A task group is the right size when one accountable agent can complete it from its recorded assignment
contract alone. If completion needs hidden coordination, the group is too broad or its contract is incomplete.

## Rules

- **MUST preserve exact scope and leaf-to-group coverage.** Every accepted work item traces into the hierarchy;
  every leaf maps to exactly one task group, every task group combines at least one leaf, and a leaf that
  needs several task groups is split in the task hierarchy first.
- **MUST combine only context-coherent leaves into one task group.** Combined leaves share one accountable
  role, compatible skills and inputs, one outcome, one writer frontier, one dependency frontier, and one
  commit boundary; leaves that differ in unresolved material decisions or destructive or external authority
  stay in separate groups.
- **MUST make execution order dependency-valid.** Stable IDs use `task-NN-slug`; explicit `Requires` edges
  are acyclic and authoritative, while shared order numbers only mark safe parallelism.
- **MUST record every field of the plan-part task-group schema for each task group.** Leave out repository
  study dumps, implementation strategy, file-level edit recipes presented as the work, and verification
  methods, commands, or test lists.
- **MUST plan only code-work leaves into Developer-owned groups whose compatible skills include
  Coding Execution and whose writer frontier includes code.** Return a leaf whose writer frontier is
  not code to the caller as out-of-frontier work.
- **MUST keep one closed indexed result and freeze it only after complete validation passes.** Use one
  caller-supplied absolute output root and its `plan-index.md` as the exact result locator; list the required
  task index and every plan part in the root index, and every task part in the task index.

## Procedure

### Phase 1 — Understand the Defined Work

#### 1.1 Establish the planning inputs

- Read the code work, purpose, scope, output, accepted design, evidence, required skills, authority
  boundaries, and repository and execution metadata. Bind the caller-supplied absolute output root, its
  absolute `plan-index.md` locator, and the allowed write boundary.
- Separate supported facts and routine planning choices from missing required input, user-owned decisions, and
  evidence that challenges the accepted direction. Return the exact evidence and question to the caller rather
  than inventing an answer.
- Continue only when the scope, output, constraints, decision owners, output root, and write boundary are clear.

### Phase 2 — Decompose the Work

#### 2.1 Decompose the task hierarchy

- Derive the leaves and writer frontiers from the accepted design. With no Ideation result, the caller's topic
  contract is the design.
- Choose top-level groups by coherent decomposition boundaries, not one group per work item, and keep each
  accepted work item traceable to its hierarchy paths. Do not assign agents or encode execution order in the
  hierarchy.
- Decompose every group until each leaf states one bounded outcome, boundary, and output. Split distinct
  responsibilities, capabilities, writer frontiers, dependencies, or outputs into separate leaves.

#### 2.2 Write the indexed task view

- Create `plan-index.md` from the [plan index template](templates/plan-index.md), `tasks-index.md` from the
  [task index template](templates/tasks-index.md), and at least one task part from the
  [task part template](templates/tasks-NN.md). Write every result file directly in the output root, because
  the template links assume each file sits beside `plan-index.md`.
- Name task parts `tasks-01.md`, `tasks-02.md`, and so on; assign the next unused number, never rename or reuse a
  part, and let the task index define reading order. Record the work summary once and the complete hierarchy in
  depth-first order.
- Keep coherent branches together when practical, and split only between complete work-item blocks, group
  nodes, leaf tasks, or table rows. Return to Phase 1 if writing exposes missing input or a material decision.

### Phase 3 — Plan the Execution

#### 3.1 Combine decomposed tasks

- Read every task part in indexed order. Combine one or more compatible leaves into each task group, prefer the
  fewest safe coherent groups, and use neither fixed batch sizes nor an automatic one-group-per-leaf mapping.
- Return to Step 2.1 when one leaf crosses several roles, outcomes, writer frontiers, or dependency frontiers.
  Split the leaf before combining it.
- Give each task group its final `task-NN-slug`, title, exact combined leaf paths, one accountable agent role,
  `Requires` edges, and order number.

#### 3.2 Write the indexed plan

- Complete `plan-index.md` and create at least one plan part from the
  [plan part template](templates/plan-NN.md) directly in the output root. Name parts `plan-01.md`,
  `plan-02.md`, and so on; assign the next unused number, never rename or reuse a part, and let the index define
  reading order.
- Copy or restate every combined leaf's title, work, boundary, and output into the group. Record the rest of
  the group's assignment contract from the plan-part template.
- Keep the plan flat and every group understandable from its assignment contract without private discussion
  or reconstructing it from task paths. Record shared assignment-local pointers once, and split parts only
  between complete task groups or table rows.

#### 3.3 Review and improve the result

- Check six invariants: **coverage** traces every accepted work item through all applicable hierarchy paths and
  maps every leaf to exactly one task group; **acyclicity** validates `Requires` and order; **factual metadata**
  is supported or explicitly nonblocking; **separation** keeps hierarchy out of execution order and the plan
  flat; **accountability** gives every group one role and the assignment contract; and **independent consistency**
  keeps both views aligned and independently readable.
- Improve the section structure, reading order, sentences, vocabulary, part boundaries, links, and assignment
  contract directly. Remove repetition and complexity that do not improve execution, traceability, or safety.
- Return input, authority, decision, or direction failures to Phase 1; hierarchy failures to Phase 2; and
  combination, dependency, or order failures to Step 3.1. Return written context, metadata, structure, or link
  failures to Step 3.2; repair the owning step, then repeat this review.

#### 3.4 Validate and freeze the result

- Read the absolute `plan-index.md` locator, the task index, every task part, and every plan part in declared
  order. Confirm that each listed path resolves directly in the output root and that every file below the root
  is reached exactly once through the two indexes.
- Repeat the six invariant checks against the final bytes. If any check fails, return to Step 3.3 and repair
  the owning step before validating again.
- Freeze only the validated result. Return the absolute `plan-index.md` locator and every indexed member in
  declared order; any later path, membership, order, or byte change invalidates the freeze.

## References

| Name | Description |
|---|---|
| [Coding Planning checklist](checklist.md) | Reusable unchecked source for evaluating Coding Planning work and complete current indexed results. |
| [Task index](templates/tasks-index.md) | Index template for the numbered task-hierarchy output. |
| [Task part](templates/tasks-NN.md) | Repeatable template for coherent task-hierarchy content. |
| [Plan index](templates/plan-index.md) | Root template for result authority, task source, and plan-part order. |
| [Plan part](templates/plan-NN.md) | Repeatable template for ordered task groups and their assignment contracts. |
| [Coding](../SKILL.md) | Routes defined code work that still needs decomposition to this operation. |
| [Coding Ideation](../coding-ideation/SKILL.md) | Prior owner that settled material code-design choices this plan must follow. |
| [Coding Execution](../coding-execution/SKILL.md) | Later owner of each dependency-ready code-work task group. |
