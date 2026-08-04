# {Work Name} — Combined Task Group Plan

| Document attribute | Definition |
|---|---|
| Role | Flat ordered list of combined task groups assigned to agents |
| Purpose | Combine compatible decomposed leaf tasks into complete agent assignments and order them by dependency. |
| Source hierarchy | `tasks.md` |
| Boundary | This document defines task groups, not execution progress, evaluation, records, or commit provenance. |

## Plan Summary

| Aspect | Definition |
|---|---|
| Work | {The defined work represented by this plan.} |
| Purpose | {Why the work is needed.} |
| Scope | {The included boundary and material exclusions.} |
| Output | {What must exist or be observable after all task groups execute.} |
| Design | {The accepted structure, relationships, and constraints that shape execution.} |
| Task-group strategy | {Why these are the fewest dependency-valid, independently verifiable, reviewable, and safe task groups.} |

## Shared Execution Context

| Context item | Value | Applies to |
|---|---|---|
| {Truly shared repository, path, artifact, runtime, platform, access, environment, tool, or other metadata} | {Supported value} | {All task groups or named task-group IDs} |

{Repeat rows only for truly shared context. Use `None` when no shared context is needed; never include secret
values. Each task group still restates the context needed to understand and execute its grouped work.}

## Ordered Combined Task Groups

Lower order numbers execute first. Task groups with the same order may run in parallel only when their
explicit `Requires` edges and writer/change boundaries permit it; `Requires` remains authoritative.

### `task-NN-slug` — {Task group title}

| Task-group attribute | Definition |
|---|---|
| Order | {Number} |
| Combined decomposed-task paths | {One or more exact leaf paths from tasks.md, such as 1.1, 1.2, and 2.1.1} |
| Accountable agent role | {Exactly one role assigned to this task group} |
| Required skills and capabilities | {Exact skills and capabilities the assigned agent needs} |
| Requires | {Earlier task-group IDs or `None`} |

#### Combined decomposed task details

| Path | Title | Work | Boundary | Output |
|---|---|---|---|---|
| {Exact leaf path} | {Decomposed task title} | {Copied or restated leaf work} | {Copied or restated leaf boundary} | {Copied or restated leaf output} |

{Add one row for every decomposed leaf task combined into this task group.}

- **Why combined:** {Why these decomposed tasks belong in one agent assignment and how they form one coherent outcome.}
- **Execution purpose:** {Why this grouped work is needed and what execution must achieve.}
- **Accepted design and decisions:** {The relevant accepted design, decisions, and material assumptions.}
- **Repository context:** {The relevant repository areas, current behavior, conventions, and artifacts.}
- **Work:** {The complete group-level work across all combined decomposed tasks.}
- **Boundary:** {What this task group covers and where its responsibility stops.}
- **Output:** {The complete concrete output this task group must produce.}
- **Inputs:** {All inputs the assigned accountable agent needs.}
- **Constraints:** {The accepted constraints and authority limits that govern this task group.}
- **Writer/change boundary:** {The files, artifacts, state, or external surfaces this task group may change and
  its coherent commit boundary.}
- **Handoffs:** {Outputs received from prerequisite task groups and outputs passed to dependent task groups.}
- **Verification:** {Fresh checks and direct evidence that prove the complete task-group outcome.}
- **Applicable metadata:** {Task-group metadata differences from Shared Execution Context, or `None`.}

{Repeat this one task-group schema in flat plan order. Each task group combines at least one leaf, each leaf
appears in exactly one task group, and no child agent tasks sit under a task group. Do not make an agent infer
task-group context solely from paths, `tasks.md`, or private discussion.}

## Nonblocking Unresolved Metadata

| Item | Evidence | Execution effect | Affected task groups |
|---|---|---|---|
| {Unknown factual value} | {Why it is not currently knowable} | {Why execution can still proceed, or the exact later resolution point} | {Task-group IDs} |

{Record only nonblocking factual metadata. Return missing required input or a material user-owned decision to
the caller instead; write `None` when this section has no entries.}
