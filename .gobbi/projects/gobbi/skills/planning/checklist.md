# Planning Checklist

> **Document role:** Reusable unchecked evaluation source<br>
> **Subject:** Planning work and complete indexed results produced through the Planning operation<br>
> **Applicability:** General Planning evaluation with a current indexed result; Evaluation binds the exact work, locator, ordered membership, bytes, accepted work, intended consumers, and frozen state<br>
> **Purpose:** Provide baseline coverage for Planning authority, decomposition, execution grouping, indexed integrity, downstream use, and safe change before target-specific items are added<br>
> **Scope:** Work inputs and authority, hierarchy traceability and leaf boundaries, task-group composition and ownership, cross-view coverage, dependencies and parallelism, execution context and handoffs, indexed integrity, change, and recovery<br>
> **Exclusions:** General documentation quality; retained legacy results; target-specific design, domain, implementation, security, accessibility, performance, and platform requirements; execution progress and operating product behavior; evaluation, acceptance, commit, and orchestration state<br>
> **Governing sources:** [Evaluation](../evaluation/SKILL.md), [Checklist](../checklist/SKILL.md), [Principles](../principles/SKILL.md), [Planning](SKILL.md), the accepted work contract, accepted design and decisions, and applicable project sources<br>
> **Context:** Evaluate the operation evidence, plan index, task index, and every listed part as one subject. Apply the [Documentation checklist](../execution/docs/checklist.md) in parallel and add target-specific items after study.<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Project Lifecycle

### Work Contract

#### The result rests on an unclear, incomplete, or unsupported work contract

- [ ] The accepted purpose cannot be identified.
- [ ] The included and excluded work boundary is unclear.
- [ ] The intended output is absent or conflicts with the accepted work.
- [ ] A material accepted design, decision, or constraint is absent.
- [ ] A required input or premise remains unresolved while the result is presented as execution-ready.

### Governance

#### The result crosses or hides a decision, access, or change authority boundary

- [ ] A user-owned material decision appears resolved without an accepted decision.
- [ ] A decision or authority needed for execution has no identifiable owner.
- [ ] Planned work depends on access or change authority that no accountable owner holds.
- [ ] The result crosses its authorized output or change boundary.
- [ ] The result claims state owned by execution, evaluation, acceptance, commit handling, or orchestration.

## Design and Development Lifecycle

### Result Integrity

#### The indexes do not define one complete frozen result

- [ ] The authoritative result locator or membership boundary is ambiguous.
- [ ] A listed member is missing or unreadable.
- [ ] A current result member is unlisted.
- [ ] A member is reached more than once through the indexes.
- [ ] The indexes do not define one complete reading order.
- [ ] Validation or freeze evidence binds different membership, order, or bytes from the current result.

### Task Decomposition

#### The hierarchy loses accepted work or bounded leaf responsibilities

- [ ] An accepted work item has no hierarchy path.
- [ ] A hierarchy path traces to no accepted work item.
- [ ] A hierarchy group's work, boundary, or output conflicts with its descendants.
- [ ] A leaf contains outcomes that can complete independently.
- [ ] A leaf requires materially different accountable roles or writer boundaries.
- [ ] A leaf combines work from different dependency frontiers.

### Task Group Composition

#### Combined leaves do not form one coherent accountable assignment

- [ ] A task group lacks exactly one accountable role.
- [ ] Combined leaves do not contribute to one coherent outcome.
- [ ] Combined leaves require incompatible capabilities or skills.
- [ ] Combined leaves require incompatible context, inputs, or constraints.
- [ ] Combined leaves begin from different dependency frontiers.
- [ ] Combined leaves require conflicting writer or verification boundaries.

#### Compatible leaves are split into unnecessary task groups

- [ ] Leaves with the same role, context, inputs, constraints, outcome, writer boundary, and dependency frontier remain separate without a supported reason.
- [ ] A fixed batch size or automatic one-group-per-leaf pattern determines the task groups.

### Cross-View Coverage

#### The hierarchy and plan lose or contradict leaf-to-group membership

- [ ] A hierarchy leaf appears in no task group.
- [ ] A hierarchy leaf appears in more than one task group.
- [ ] A task group contains no hierarchy leaf.
- [ ] A task group references a missing path or a path that is not a leaf.
- [ ] A combined leaf's work, boundary, or output conflicts with the hierarchy.
- [ ] The task and plan views disagree about task-group membership.

#### The hierarchy and plan collapse their distinct roles

- [ ] The Task Hierarchy assigns accountable agents or defines execution order.
- [ ] The Plan represents parent-child decomposition or nests agent tasks below a task group.

### Dependencies and Order

#### Dependencies, order, or parallel claims permit an invalid execution sequence

- [ ] A group needs an earlier result that is absent from its dependencies.
- [ ] A recorded dependency points to a missing or ineligible predecessor.
- [ ] The dependency relationships contain a cycle.
- [ ] Recorded order conflicts with a required predecessor relationship.
- [ ] Groups presented as parallel have a dependency or conflicting writer boundary.
- [ ] Independent groups are serialized without a supported dependency, authority, or resource constraint.

### Execution Use

#### An accountable agent cannot execute a task group from the recorded result

- [ ] The agent cannot determine when the task group is ready to start.
- [ ] The agent cannot determine the complete owned outcome and stopping boundary.
- [ ] A required input, context source, or access condition cannot be located.
- [ ] A task group lacks one unique stable `task-NN-slug` identifier.
- [ ] The required skills or capabilities cannot be identified from the task group.
- [ ] The agent cannot distinguish permitted changes from prohibited changes.
- [ ] The recorded verification cannot establish when the assignment is complete.
- [ ] Execution requires private planning context or a new decomposition decision.

### Handoff Failure

#### A handoff leaves required inputs, outputs, or ownership unresolved

- [ ] A required incoming output has no identifiable producer.
- [ ] An output needed by a dependent group is not identified.
- [ ] A producer and consumer assign different meaning or boundaries to the same handoff.
- [ ] Responsibility is missing or overlaps at a handoff boundary.
- [ ] Recorded prerequisites can finish while the dependent group still lacks what it needs to start.

### Change and Recovery

#### Revision or interruption leaves no safe current Planning result

- [ ] An accepted scope or design change is absent from the hierarchy.
- [ ] A hierarchy change is absent from task-group membership or copied task context.
- [ ] A grouping change leaves dependencies, order, or handoffs stale.
- [ ] An indexed membership change leaves authority or freeze evidence stale.
- [ ] Current and superseded Planning results cannot be distinguished.
- [ ] The last complete frozen result cannot be identified after an interrupted revision.

## Product Lifecycle

No supported coverage for this lifecycle.
