---
name: planning
description: "MUST load when defined work must be decomposed into an executable plan. Planning produces a traceable task hierarchy and ordered context-coherent combined task groups."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Planning

Use this skill to turn defined work into a fine-grained top-down task hierarchy and a flat ordered list of
combined task groups assigned to agents. Its caller owns TODO state, evaluation, records, iterations, commit
provenance, and orchestration.

Planning decomposes the accepted direction in `tasks.md` and combines tasks into context-coherent groups in
`plan.md`. It freezes and returns both artifacts only after final validation passes.

## Principles

### Keep hierarchy and execution as different views

Hierarchy paths show decomposition; plan order and `Requires` edges show execution. A hierarchy leaf is a
traceable decomposed task, not an agent assignment.

### Combine tasks around reusable context

Prefer the fewest task groups that remain dependency-valid, independently verifiable, reviewable, and safe
for one agent. A combined task group lets that agent reuse skills, repository context, inputs, and writer
state.

### Return material uncertainty to its owner

Planning records facts and resolves routine choices. Missing required input, a material user decision, or
evidence against the accepted direction returns to the caller with the exact evidence and question.

## Rules

- **MUST preserve exact scope and leaf-to-group coverage.** Every accepted work item traces into the hierarchy;
  every leaf maps to exactly one task group, every task group combines at least one leaf, and a leaf that
  needs several task groups is split in `tasks.md` first.
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
- **MUST freeze both artifacts only after final validation passes.** Until then, repair the owning phase and
  repeat the complete validation.

## Procedure

### Phase 1 — Understand the Defined Work

#### 1.1 Establish the planning inputs

- Read the work, purpose, scope, output, accepted design, evidence, required skills, authority boundaries, and
  repository and execution metadata.
- Separate facts from routine planning choices and missing required input or material decisions.
- When required input or a material user-owned decision is missing, or evidence challenges the accepted
  direction, return the exact evidence and question to the caller. Do not invent an answer or continue on an
  unsupported premise.
- Continue only when the scope, output, constraints, and decision owners are clear.

### Phase 2 — Decompose the Work

#### 2.1 Build the task hierarchy

- Use [the hierarchy template](templates/tasks.md) to write the complete hierarchy directly to `tasks.md` in
  one pass.
- Choose top-level groups by coherent decomposition boundaries, not one group per work item.
  Preserve each work item's traceability to its hierarchy paths.
- Recursively decompose the complete hierarchy into smaller groups and leaf tasks until each leaf states one
  bounded outcome, boundary, and output. Split distinct responsibilities, capabilities, change boundaries,
  dependencies, or outputs.
- Keep the hierarchy independently readable; do not assign agents or encode execution order in it.

### Phase 3 — Plan the Execution

#### 3.1 Combine decomposed tasks into ordered task groups

- Read the complete hierarchy and use [the plan template](templates/plan.md) to draft `plan.md` directly.
- Combine one or more decomposed leaf tasks into each task group only when every context-coherence condition
  in the Rules holds. Prefer the fewest safe coherent task groups; use no fixed batch size and preserve no
  automatic one-group-per-leaf mapping.
- If one leaf must cross several roles, outcomes, writer boundaries, or dependency frontiers, split it in Step
  2.1 first.
- Give each task group its final `task-NN-slug`, title, exact combined leaf paths, one accountable agent role,
  `Requires` edges, and order number. Copy or restate every combined decomposed task's title, work, boundary,
  and output inside the task group.
- State why the tasks are combined and how they form one coherent outcome. Include the relevant accepted
  design and decisions, repository context, execution purpose, required skills and capabilities, group-level
  work, boundary, output, inputs, constraints, writer/change boundary, handoffs, verification, and metadata.
- Keep `plan.md` flat: each task group is the agent assignment and has no child agent tasks. Record truly
  shared context once, but make every group understandable without private discussion or reconstructing its
  context from source paths or `tasks.md`.

#### 3.2 Validate, repair, and freeze both artifacts

- Check six invariants: **coverage** traces every accepted work item and places every leaf in exactly one
  nonempty task group;
  **acyclicity** has valid `Requires` edges and order; **factual metadata** is supported or explicitly
  nonblocking and unresolved; **separation** keeps hierarchy out of order and the plan flat; **accountability**
  gives every task group one role and complete context; and **independent consistency** lets a cold reader use
  either artifact while both agree on paths, work, boundaries, and outputs.
- Return input, authority, material-decision, or challenged-direction failures to Phase 1 with the exact
  evidence and question. Return hierarchy, trace, or leaf-boundary failures to Step 2.1; return combination,
  task-group context, dependency, order, or plan-metadata failures to Step 3.1.
- Repair the owning phase and rerun all six checks. When all pass, freeze `tasks.md` and `plan.md` together and
  return both to the caller.

## References

- [`tasks.md`](templates/tasks.md) defines the top-down task hierarchy.
- [`plan.md`](templates/plan.md) defines the ordered combined task groups.
