# {Subject} — Note

> **Status:** {Complete | Stopped}<br>
> **Session:** {Gobbi UUID}<br>
> **Memory note:** {`memory/reports/note/YYYY-MM-DD-<descriptive-title>.md`, or `None` when closure stopped
> before Memory}

## Result

{The Git result or the exact stopped state, in one short paragraph.}

## Git

| Action | Result | Evidence |
|---|---|---|
| {Closure commit, base merge, or another Git action that ran} | {completed, failed, not attempted, or retained} | {Full commit and tree SHAs, base head before and after, checks rerun on the merged tree, or the failure output.} |

## Recovery

{None, or the retained branch and worktree, their state, any preserved unrelated work, and the first safe
command.}

Keep Status, the Git rows for every action that ran or was stopped, and Recovery. Do not repeat the Memory
note's work account. Report only direct evidence, and never describe an intended or failed commit or merge as
complete.
