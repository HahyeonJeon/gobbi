# {Work Name} — Plan Part {NN}

> **Index:** [Plan](plan-index.md)<br>
> **Source:** [Task Hierarchy](tasks/tasks-index.md)<br>
> **Covers:** {One coherent ordered set of complete task groups.}

{Keep only the applicable complete content groups below. Do not split one task group or table row across
parts.}

## Summary

{Keep the Summary and Shared Context in the first listed part only.}

| Aspect | Definition |
|---|---|
| Work | {The defined work represented by this plan.} |
| Purpose | {Why the work is needed.} |
| Scope | {The included boundary and material exclusions.} |
| Output | {What must exist or be observable after all task groups execute.} |
| Design | {The accepted writing design and decisions that shape execution.} |
| Grouping | {Why these are the fewest dependency-valid, independently verifiable, reviewable, and safe task groups.} |

## Shared Context

| Context | Value | Applies to |
|---|---|---|
| {Truly shared assignment-local pointer, path, runtime, platform, access, environment, tool, or other metadata} | {Supported value} | {All task groups or named task-group IDs} |

{Repeat rows only for truly shared assignment-local pointers. Use `None` when no shared context is needed;
never include secret values. Do not record a repository study dump here or in a task group.}

## Task Groups

Lower order numbers execute first. Task groups with the same order may run in parallel only when their
explicit `Requires` edges and writer frontiers permit it; `Requires` remains authoritative.

### `task-NN-slug` — {Task group title}

| Attribute | Definition |
|---|---|
| Order | {Number} |
| Combined task paths | {One or more exact leaf paths from the Task Hierarchy, such as 1.1, 1.2, and 2.1.1.} |
| Accountable role | {Author for a writing-work group.} |
| Compatible skills | {Include Authoring Execution for a writing-work group.} |
| Requires | {Earlier task-group IDs or `None`.} |

#### Decomposed Tasks

| Path | Title | Work | Boundary | Output |
|---|---|---|---|---|
| {Exact leaf path} | {Decomposed task title} | {Copied or restated leaf work} | {Copied or restated leaf boundary} | {Copied or restated leaf output} |

{Add one row for every leaf combined into this task group.}

{Copied or restated fields must remain semantically identical to the Task Hierarchy. Any conflict makes the
result inconsistent.}

#### Group Details

- **Why combined:** {Why these tasks belong in one agent assignment and form one coherent outcome.}
- **Group outcome:** {The owned observable outcome this task group must produce.}
- **Stop:** {Where this task group's responsibility ends and what it must leave unspecified.}
- **Constraints and authority:** {The accepted constraints and authority limits that govern this task group.}
- **Accepted design:** {The accepted writing design and decisions that shape execution.}
- **Writer frontier:** {The durable prose files this task group may change.}
- **Handoffs:** {Outputs received from prerequisite groups and outputs passed to dependent groups.}
- **Verification:** {That the observable group outcome exists, not a test implementation, command list, or method.}
- **Metadata:** {Task-group differences from Shared Context, or `None`.}

{Repeat this task-group schema in flat plan order. Each group combines at least one leaf, each leaf appears in
exactly one group, and no child agent tasks sit below a group. Do not make an agent infer the assignment
contract solely from task paths, the Task Hierarchy, or private discussion.}

## Unresolved Metadata

| Item | Evidence | Execution effect | Affected groups |
|---|---|---|---|
| {Unknown factual value} | {Why it is not currently knowable.} | {Why execution can proceed, or the exact later resolution point.} | {Task-group IDs.} |

{Record only nonblocking factual metadata. Return missing required input or a material user-owned decision to
the caller; write `None` when this section has no entries.}
