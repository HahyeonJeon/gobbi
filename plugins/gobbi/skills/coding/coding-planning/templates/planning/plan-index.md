# {Work Name} — Plan

> **Document role:** Authoritative Coding Planning result locator<br>
> **Authority:** This index, every listed Plan part, and every file reached through the Task Hierarchy index form the current result.<br>
> **Reading rule:** Read the Task Hierarchy first, then read every Plan part once in the order below.<br>
> **Output boundary:** The result defines task decomposition and execution groups. It does not record execution progress, evaluation, commits, or orchestration state.

## Task Hierarchy

| View | Description |
|---|---|
| [Tasks](tasks/tasks-index.md) | Required top-down work decomposition and leaf-task boundaries. |

## Plan Parts

| Part | Description |
|---|---|
| [plan-NN.md](plan-NN.md) | {Replace `NN` with the assigned number and state the complete task groups in this part.} |

{Keep the Task Hierarchy, list every `plan-NN.md` file exactly once, and preserve dependency-valid reading
order. Every file below the output root must be reached from this index; a missing, duplicate, or unlisted file
makes the result incomplete. Keep existing part numbers stable, assign the next unused number to a new part,
and never rename or reuse a part.}
