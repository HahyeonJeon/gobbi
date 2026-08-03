# {Work Name} — Plan

| Document attribute | Definition |
|---|---|
| Role | Frozen plan for bottom-up execution |
| Purpose | Order the decomposed tasks, assign each task to an accountable agent role, and provide the context required for execution. |
| Source hierarchy | `tasks.md` |
| Authority | This document is the final Planning authority. |
| Boundary | This document defines execution but does not track execution progress or results. |

## Contents

- [Plan Summary](#plan-summary)
- [Work Metadata](#work-metadata)
- [Task Order and Hierarchy](#task-order-and-hierarchy)
- [Assumptions, Defaults, and Unresolved Metadata](#assumptions-defaults-and-unresolved-metadata)

## Plan Summary

| Aspect | Definition |
|---|---|
| Work | {Summarize the defined work represented by this plan.} |
| Purpose | {State why the work is needed and what it is intended to achieve.} |
| Scope | {State the included boundary and the material exclusions, deferrals, or rejections.} |
| Output | {State what must exist or be observable when the complete plan has been executed.} |
| Design | {Summarize the structure, responsibilities, relationships, and constraints that shape execution.} |
| Task groups | {List the final task groups in execution-order form.} |

## Work Metadata

### Workspace and Git

| Metadata | Shared value |
|---|---|
| Repository | `{Repository name or location}` |
| Project root | `{Project-root path}` |
| Working directories | `{Directories used by the work}` |
| Git base branch | `{Branch from which the work starts}` |
| Git work branch | `{Branch used for the work}` |
| Git worktree | `{Worktree path}` |
| Artifact locations | `{Shared input and output locations}` |

### Capabilities and Environment

| Metadata | Shared value |
|---|---|
| Required skills | `{Skills shared by the work}` |
| Required tools | `{Tools shared by the work}` |
| Runtimes | `{Required runtimes and applicable versions}` |
| Platforms | `{Required operating systems, deployment targets, or execution platforms}` |
| Access | `{Required filesystem, service, network, or external-system access}` |
| Environment configuration | `{Required configuration and environment-variable names; never include secret values}` |

{Use `Not applicable` when a field has been considered and does not apply. Use `Unresolved` when the value
is required but not known. Do not invent a value.}

## Task Order and Hierarchy

**Order rule:** Lower order numbers execute first. Groups with the same group-order number may run in
parallel. Within a group, tasks with the same task-order number may run in parallel. Shared order numbers
express safe parallelism.

### `G1` — {Task Group Title}

| Group attribute | Definition |
|---|---|
| Order | {Number} |
| Source hierarchy paths | {Paths from tasks.md, such as 1.1 and 2.2} |
| Requires | `{Earlier group IDs or None}` |
| Boundary | {State the related work contained by this group.} |
| Output | {State what must be available after every task in this group is complete.} |

#### `T01` — {Final task title}

| Task attribute | Definition |
|---|---|
| Order | {Number within this group} |
| Source task | {Exact hierarchy path from tasks.md} |
| Assigned agent | `{One accountable agent role}` |
| Required capabilities | {State the capabilities the assigned agent must have.} |
| Requires | `{Earlier task IDs or None}` |

- **Work:** {State the bounded work this task must complete.}
- **Boundary:** {State what this task covers and where its responsibility stops.}
- **Output:** {State the concrete output this task must produce.}
- **Inputs:** {List only the inputs the assigned agent needs.}
- **Constraints:** {List only the constraints that govern this task.}
- **Handoffs:** {State the outputs received from earlier tasks and the outputs passed to later tasks.}
- **Metadata differences:** {Record only task-specific differences from the shared work metadata, or
  write `None`.}

#### `T02` — {Final task title}

| Task attribute | Definition |
|---|---|
| Order | {Number within this group; reuse an order number only when parallel execution is safe} |
| Source task | {Exact hierarchy path from tasks.md} |
| Assigned agent | `{One accountable agent role}` |
| Required capabilities | {State the capabilities the assigned agent must have.} |
| Requires | `{Earlier task IDs or None}` |

- **Work:** {State the bounded work this task must complete.}
- **Boundary:** {State what this task covers and where its responsibility stops.}
- **Output:** {State the concrete output this task must produce.}
- **Inputs:** {List only the inputs the assigned agent needs.}
- **Constraints:** {List only the constraints that govern this task.}
- **Handoffs:** {State the outputs received from earlier tasks and the outputs passed to later tasks.}
- **Metadata differences:** {Record only task-specific differences from the shared work metadata, or
  write `None`.}

### `G2` — {Additional Task Group Title}

| Group attribute | Definition |
|---|---|
| Order | {Number; reuse a group-order number only when parallel execution is safe} |
| Source hierarchy paths | {Paths from tasks.md} |
| Requires | `{Earlier group IDs or None}` |
| Boundary | {State the related work contained by this group.} |
| Output | {State what must be available after every task in this group is complete.} |

{Repeat the flat task section for every task in this group. Repeat the group section for every task group.}

## Assumptions, Defaults, and Unresolved Metadata

| Item | State | Execution effect | Affected groups or tasks |
|---|---|---|---|
| `{Assumption, selected default, or unknown metadata value}` | `{Assumption, Default, or Unresolved}` | `{How execution depends on it}` | `{Group or task IDs}` |

{Record only items that materially affect execution. Write `None` when there are no assumptions, selected
defaults, or unresolved metadata values.}
