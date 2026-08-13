---
name: planning
description: "Planning is the operation for turning defined work into a traceable task hierarchy and dependency-valid execution plan."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Planning

Planning turns accepted work into a fine-grained task hierarchy and a flat, dependency-valid execution plan. Use it when scope and direction are defined but work still needs decomposition and grouping for accountable agents. It records both views as one indexed result while the caller retains orchestration and evaluation authority.

## Principles

### Separate task hierarchy from execution order

The task hierarchy explains how broad work divides into decomposable groups and leaf tasks, while execution
order explains how combined task groups build on one another through `Requires` and which independent groups
may run in parallel. Keeping these views separate prevents parent-child structure from being mistaken for
dependency order and exposes safe parallel work.

### Bound each task group for one accountable agent

Planning is complete only when one accountable agent can understand and finish each combined task group from
its recorded decomposed-task details and complete group context. If completion requires hidden coordination,
the task group is too broad or its recorded details are incomplete.

## Rules

- **MUST preserve exact scope and leaf-to-group coverage.** Every accepted work item traces into the hierarchy;
  every leaf maps to exactly one task group, every task group combines at least one leaf, and a leaf that
  needs several task groups is split in the task hierarchy first.
- **MUST combine only context-coherent decomposed tasks.** Combined tasks share one accountable agent role and
  capabilities, skills and repository context, compatible inputs, one coherent outcome, writer/change
  boundary, and dependency frontier; fixed-size batches and one-group-per-leaf defaults are invalid.
- **NEVER combine incompatible work.** Keep separate any leaves divided by roles, unresolved material
  decisions, destructive or external authority, conflicting dependencies, or incoherent verification or
  commit boundaries.
- **MUST make execution order dependency-valid.** Stable IDs use `task-NN-slug`; explicit `Requires` edges
  are acyclic and authoritative, while shared order numbers only mark safe parallelism.
- **MUST give each task group complete agent context.** Include its stable ID and title, exact combined paths,
  every combined task's title, work, boundary, and output, why they are combined, relevant accepted context,
  one agent role, skills, dependencies, group work, inputs, constraints, writer/change boundary,
  handoffs, verification, and metadata.
- **MUST keep one closed indexed result and freeze it only after complete validation passes.** Use one
  caller-supplied absolute output root and its `plan-index.md` as the exact result locator; list the required
  task index and every plan part in the root index, and every task part in the task index.

## Procedure

### Phase 1 — Understand the Defined Work

#### 1.1 Establish the planning inputs

- Read the work, purpose, scope, output, accepted design, evidence, required skills, authority boundaries, and
  repository and execution metadata. Bind the caller-supplied absolute output root, its absolute
  `plan-index.md` locator, and the allowed write boundary.
- Separate supported facts and routine planning choices from missing required input, user-owned decisions, and
  evidence that challenges the accepted direction. Return the exact evidence and question to the caller rather
  than inventing an answer.
- Continue only when the scope, output, constraints, decision owners, output root, and write boundary are clear.

### Phase 2 — Decompose the Work

#### 2.1 Decompose the task hierarchy

- Choose top-level groups by coherent decomposition boundaries, not one group per work item. Preserve each
  accepted work item's traceability to its hierarchy paths.
- Recursively decompose every group until each leaf states one bounded outcome, boundary, and output. Split
  distinct responsibilities, capabilities, change boundaries, dependencies, or outputs.
- Keep the hierarchy independently readable. Do not assign agents or encode execution order in it.

#### 2.2 Write the indexed task view

- Within the bound output root, create `plan-index.md` from the
  [plan index template](templates/planning/plan-index.md), then create
  `tasks/tasks-index.md` from the [task index template](templates/planning/tasks/tasks-index.md) and at least one
  numbered task file from the [task part template](templates/planning/tasks/tasks-NN.md). Keep every file inside
  the write boundary, the root index as the result locator, and the task index as its required source view.
- Name task parts `tasks-01.md`, `tasks-02.md`, and so on; assign the next unused number, never rename or reuse a
  part, and let the task index define reading order. Record the work summary once and the complete hierarchy in
  depth-first order.
- Keep coherent branches together when practical, and split only between complete work-item blocks, group
  nodes, leaf tasks, or table rows. Return to Phase 1 if writing exposes missing input or a material decision.

### Phase 3 — Plan the Execution

#### 3.1 Combine decomposed tasks

- Read every task part in indexed order. Combine one or more compatible leaves into each task group, prefer the
  fewest safe coherent groups, and use neither fixed batch sizes nor an automatic one-group-per-leaf mapping.
- Return to Step 2.1 when one leaf crosses several roles, outcomes, writer boundaries, or dependency frontiers.
  Split the leaf before combining it.
- Give each task group its final `task-NN-slug`, title, exact combined leaf paths, one accountable agent role,
  `Requires` edges, and order number.

#### 3.2 Write the indexed plan

- Within the bound output root, complete `plan-index.md` and create at least one numbered file from the
  [plan part template](templates/planning/plan-NN.md). Name parts `plan-01.md`,
  `plan-02.md`, and so on; assign the next unused number, never rename or reuse a part, and let the index define
  reading order.
- Copy or restate every combined leaf's title, work, boundary, and output. For each group, record why the tasks
  form one coherent outcome, accepted design and decisions, repository context, execution purpose, role,
  skills, dependencies, work, inputs, constraints, writer boundary, handoffs, verification, and metadata.
- Keep the plan flat and every group understandable without private discussion or reconstructing its context
  from task paths. Record shared context once, and split parts only between complete task groups or table rows.

#### 3.3 Review and improve the result

- Check six invariants: **coverage** traces every accepted work item through all applicable hierarchy paths and
  maps every leaf to exactly one task group; **acyclicity** validates `Requires` and order; **factual metadata**
  is supported or explicitly nonblocking; **separation** keeps hierarchy out of execution order and the plan
  flat; **accountability** gives every group one role and complete context; and **independent consistency**
  keeps both views aligned and independently readable.
- Improve the section structure, reading order, sentences, vocabulary, part boundaries, links, and group
  context directly. Remove repetition and complexity that do not improve execution, traceability, or safety.
- Return input, authority, decision, or direction failures to Phase 1; hierarchy failures to Phase 2; and
  combination, dependency, or order failures to Step 3.1. Return written context, metadata, structure, or link
  failures to Step 3.2; repair the owning step, then repeat this review.

#### 3.4 Validate and freeze the result

- Read the absolute `plan-index.md` locator, the task index, every task part, and every plan part in declared
  order. Confirm that each listed path resolves inside the output root and that every file below the root is
  reached exactly once through the two indexes.
- Repeat the six invariant checks against the final bytes. If any check fails, return to Step 3.3 and repair
  the owning step before validating again.
- Freeze only the validated result. Return the absolute `plan-index.md` locator and every indexed member in
  declared order; any later path, membership, order, or byte change invalidates the freeze.

## References

| Name | Description |
|---|---|
| [Task index](templates/planning/tasks/tasks-index.md) | Index template for the numbered task-hierarchy output. |
| [Task part](templates/planning/tasks/tasks-NN.md) | Repeatable template for coherent task-hierarchy content. |
| [Plan index](templates/planning/plan-index.md) | Root template for result authority, task source, and plan-part order. |
| [Plan part](templates/planning/plan-NN.md) | Repeatable template for complete ordered task groups. |
