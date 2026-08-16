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
| Design | {The accepted structure, relationships, and constraints that shape execution.} |
| Grouping | {Why these are the fewest dependency-valid, independently verifiable, reviewable, and safe task groups.} |

## Shared Context

| Context | Value | Applies to |
|---|---|---|
| {Truly shared repository, path, artifact, runtime, platform, access, environment, tool, or other metadata} | {Supported value} | {All task groups or named task-group IDs} |

{Repeat rows only for truly shared context. Use `None` when no shared context is needed; never include secret
values. Each task group still states the context needed to understand and execute its work.}

## Task Groups

Lower order numbers execute first. Task groups with the same order may run in parallel only when their
explicit `Requires` edges and writer boundaries permit it; `Requires` remains authoritative.

### `task-NN-slug` — {Task group title}

| Attribute | Definition |
|---|---|
| Order | {Number} |
| Combined task paths | {One or more exact leaf paths from the Task Hierarchy, such as 1.1, 1.2, and 2.1.1.} |
| Accountable role | {Exactly one role assigned to this task group.} |
| Required skills | {Exact skills and capabilities the assigned agent needs.} |
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
- **Execution purpose:** {Why this grouped work is needed and what execution must achieve.}
- **Accepted design:** {The relevant accepted design, decisions, and material assumptions.}
- **Repository context:** {The relevant repository areas, current behavior, conventions, and artifacts.}
- **Work:** {The complete group-level work across all combined tasks.}
- **Boundary:** {What this task group covers and where its responsibility stops.}
- **Output:** {The complete concrete output this task group must produce.}
- **Inputs:** {All inputs the accountable agent needs.}
- **Constraints:** {The accepted constraints and authority limits that govern this task group.}
- **Writer boundary:** {The files, artifacts, state, or external surfaces this task group may change and its coherent commit boundary.}
- **Handoffs:** {Outputs received from prerequisite groups and outputs passed to dependent groups.}
- **Verification:** {Fresh checks and direct evidence that prove the complete task-group outcome.}
- **Metadata:** {Task-group differences from Shared Context, or `None`.}

{Repeat this task-group schema in flat plan order. Each group combines at least one leaf, each leaf appears in
exactly one group, and no child agent tasks sit below a group. Do not make an agent infer group context solely
from task paths, the Task Hierarchy, or private discussion.}

## Unresolved Metadata

| Item | Evidence | Execution effect | Affected groups |
|---|---|---|---|
| {Unknown factual value} | {Why it is not currently knowable.} | {Why execution can proceed, or the exact later resolution point.} | {Task-group IDs.} |

{Record only nonblocking factual metadata. Return missing required input or a material user-owned decision to
the caller; write `None` when this section has no entries.}
