---
name: planning
description: "MUST load when defined work must be decomposed into an executable plan. Planning produces a traceable task hierarchy and ordered context-coherent execution units."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Planning

Use this skill to turn defined work into two independently readable artifacts: a fine-grained top-down task
hierarchy and a flat ordered list of agent execution units. Planning defines executable work contracts; its
caller owns TODO state, evaluation, records, iterations, commit provenance, and other orchestration mechanics.

The operation understands the accepted direction, decomposes it in `tasks.md`, and forms context-coherent
execution units in `plan.md`. Both artifacts remain revisable until one final validation passes, then freeze
together and return to the caller.

## Principles

### Keep hierarchy and execution as different views

Hierarchy paths explain how the work decomposes; plan order and `Requires` edges explain how agents execute
it. A hierarchy leaf is a traceable unit of work, not automatically an agent assignment.

### Aggregate work around reusable context

Prefer the fewest execution units that remain dependency-valid, independently verifiable, reviewable, and
safe for one accountable role. A coherent unit lets one agent reuse its skills, repository context, inputs,
and writer state across compatible leaves.

### Return material uncertainty to its owner

Planning records supported facts and resolves routine decomposition choices. Missing required input, a
material user-owned decision, or evidence against the accepted direction returns to the caller with the exact
evidence and question.

## Rules

- **MUST preserve exact scope and leaf-to-unit coverage.** Every accepted work item traces into the hierarchy;
  every leaf maps to exactly one execution unit, every unit traces at least one leaf, and a leaf that needs
  several units is split in `tasks.md` first.
- **MUST aggregate only context-coherent leaves.** Combined leaves share one accountable role and
  capabilities, working context and skills, compatible inputs, one coherent outcome, writer and change
  boundary, and dependency frontier; fixed-size batches and one-unit-per-leaf defaults are invalid.
- **NEVER combine incompatible work.** Keep separate any leaves divided by roles, unresolved material
  decisions, destructive or external authority, conflicting dependencies, or incoherent verification or
  commit boundaries.
- **MUST make execution order dependency-valid.** Stable IDs use `task-NN-slug`; explicit `Requires` edges
  are acyclic and authoritative, while shared order numbers only mark safe parallelism.
- **MUST record facts and complete unit contracts.** Each unit has one accountable role plus its source paths,
  skills and capabilities, dependencies, work, boundary, output, inputs, constraints, writer/change boundary,
  verification, and applicable metadata.
- **MUST freeze both artifacts only after final validation passes.** Until then, repair the owning phase and
  repeat the complete validation.

## Procedure

### Phase 1 — Understand the Defined Work

#### 1.1 Establish the planning inputs

- Read the defined work, purpose, scope, expected output, accepted design, supporting evidence, required
  skills, authority boundaries, and applicable repository and execution metadata.
- Separate accepted facts from routine planning choices and from missing required input or material decisions.
- When required input or a material user-owned decision is missing, or evidence challenges the accepted
  direction, return the exact evidence and question to the caller. Do not invent an answer or continue on an
  unsupported premise.
- Continue with a concrete input set whose scope, output, constraints, and decision owners are clear.

### Phase 2 — Decompose the Work

#### 2.1 Build a revisable task hierarchy

- Use [the hierarchy template](templates/tasks.md) to draft `tasks.md` directly from the established inputs.
- Choose top-level groups by coherent decomposition boundaries, not by forcing one group per work item.
  Preserve each work item's traceability to its hierarchy paths.
- Decompose groups top-down until every leaf states one bounded work outcome, boundary, and output. Keep
  splitting distinct responsibilities, capabilities, change boundaries, dependencies, or outputs.
- Keep the hierarchy revisable and independently readable; do not assign agents or encode execution order in
  it.

### Phase 3 — Plan the Execution

#### 3.1 Form ordered execution units

- Read the complete hierarchy and use [the plan template](templates/plan.md) to draft `plan.md` directly.
- Start from the smallest dependency-valid leaf relationships, then combine leaves only when every
  context-coherence condition in the Rules holds. Prefer the fewest safe coherent units; use no fixed batch
  size and preserve no automatic one-to-one leaf mapping.
- If one leaf must cross several roles, outcomes, writer boundaries, or dependency frontiers, return to Step
  2.1 and split it before continuing.
- Give each unit its final `task-NN-slug`, source leaf paths, complete execution contract, `Requires` edges,
  and order number. Shared order numbers may express safe parallelism, but edges control readiness.
- Keep `plan.md` flat and independently readable. Record shared applicable metadata once and unit-specific
  differences on the affected units.

#### 3.2 Validate, repair, and freeze both artifacts

- Check six invariants: **coverage** traces every accepted work item and places every leaf in exactly one
  nonempty execution unit;
  **acyclicity** has valid `Requires` edges and order; **factual metadata** is supported or explicitly
  nonblocking and unresolved; **separation** keeps hierarchy out of order and the plan flat; **accountability**
  gives every unit one role and a complete contract; and **independent consistency** lets a cold reader use
  either artifact while both agree on paths, work, boundaries, and outputs.
- Return input, authority, material-decision, or challenged-direction failures to Phase 1 with the exact
  evidence and question. Return hierarchy, trace, or leaf-boundary failures to Step 2.1; return aggregation,
  contract, dependency, order, or plan-metadata failures to Step 3.1.
- Repair the owning phase and rerun all six checks. When all pass, freeze `tasks.md` and `plan.md` together and
  return both to the caller.

## References

- [`tasks.md`](templates/tasks.md) defines the top-down task hierarchy.
- [`plan.md`](templates/plan.md) defines the ordered execution units.
