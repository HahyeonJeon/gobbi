# {Work Name} — Task Hierarchy

| Document attribute | Definition |
|---|---|
| Role | Fine-grained top-down decomposition |
| Purpose | Define every group and leaf task with its work, boundary, and output. |
| Boundary | This document does not assign agents, set execution order, or define orchestration state. |

## Work Summary

### {Work Item}

| Work aspect | Definition |
|---|---|
| Purpose | {Why this work is needed.} |
| Scope | {What is included and excluded, and where the work stops.} |
| Output | {What must exist or be observable when this work is complete.} |
| Design | {The accepted structure, responsibilities, relationships, and constraints.} |
| Hierarchy paths | {Every group or leaf path that traces this work item.} |

{Repeat this work-item section as needed. A work item may trace several paths, and a coherent top-level group
may contain paths from several work items.}

## Task Hierarchy

Numeric paths define parent-child structure only. Record nodes in depth-first order; a leaf task is a
traceable unit of work and not automatically an agent assignment.

### 1 — {Group title}

**Type:** `Group`

- **Work items:** {Work items traced through this group.}
- **Work:** {The complete work contained by this group.}
- **Boundary:** {What belongs to this group and where its responsibility stops.}
- **Output:** {What this group and its descendants must produce.}

{Repeat the group form for each top-level or nested group. Choose top-level groups by coherent decomposition
boundaries, not one group per work item.}

### 1.1 — {Leaf task title}

**Type:** `Task`

- **Work items:** {Work items traced through this leaf.}
- **Work:** {The bounded work this leaf must complete.}
- **Boundary:** {The exact responsibility of this leaf.}
- **Output:** {The concrete output this leaf must produce.}

{Repeat the task form for every leaf. Keep splitting until one execution unit can include the whole leaf; if
the leaf would need several units, split it here first.}
