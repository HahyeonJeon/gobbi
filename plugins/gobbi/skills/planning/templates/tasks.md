# {Work Name} — Task Hierarchy

| Document attribute | Definition |
|---|---|
| Role | Frozen top-down decomposition |
| Purpose | Define the complete task hierarchy and the work, boundary, and output of every group and task. |
| Boundary | This document does not assign agents, set execution order, or record work metadata. |

## Contents

- [Work Summary](#work-summary)
- [Task Hierarchy](#task-hierarchy)

## Work Summary

### {Work Item}

| Work aspect | Definition |
|---|---|
| Purpose | {State why this work is needed and what it is intended to achieve.} |
| Scope | {State what is included, excluded, deferred, or rejected and where the work stops.} |
| Output | {State what must exist or be observable when this work is complete.} |
| Design | {State the chosen structure, responsibilities, relationships, and constraints that shape this work.} |
| Top-level group paths | {Hierarchy path or paths, such as 1 and 2} |

{Repeat this section for every distinct work item.}

## Task Hierarchy

**Hierarchy rule:** The numeric task path identifies the hierarchy. For example, 1.1.1 is a child of
1.1, which is a child of 1. Record tasks in numeric depth-first order.

### 1 — {Top-level group title}

**Type:** `Group`

- **Work:** {State the complete work contained by this group.}
- **Boundary:** {State what belongs to this group and where its responsibility stops.}
- **Output:** {State what this group and its descendants must produce.}

### 1.1 — {Child group title}

**Type:** `Group`

- **Work:** {State the work contained by this child group.}
- **Boundary:** {State what belongs to this child group and where its responsibility stops.}
- **Output:** {State what this child group and its descendants must produce.}

### 1.1.1 — {Task title}

**Type:** `Task`

- **Work:** {State the bounded work this task must complete.}
- **Boundary:** {State the exact responsibility of this task.}
- **Output:** {State the concrete output this task must produce.}

### 1.2 — {Task title}

**Type:** `Task`

- **Work:** {State the bounded work this task must complete.}
- **Boundary:** {State the exact responsibility of this task.}
- **Output:** {State the concrete output this task must produce.}

### 2 — {Additional top-level group title}

**Type:** `Group`

- **Work:** {State the complete work contained by this group.}
- **Boundary:** {State what belongs to this group and where its responsibility stops.}
- **Output:** {State what this group and its descendants must produce.}

{Repeat the flat section for every group and task.}

{Use numeric hierarchy paths only to locate nodes in this frozen decomposition. Phase 3 assigns final
execution task IDs after the tasks are grouped and ordered.}
