# {Subject} — Note

> **Output role:** Response body after any caller-required prefix; not a tracked closure artifact<br>
> **Note type:** {Development | Research | Work}<br>
> **Status:** {Complete | Stopped}<br>
> **Caller:** {Caller context label}<br>
> **Session:** {Gobbi UUID}<br>
> **Assignment:** {Stable closure assignment ID}<br>
> **Recorded at:** {UTC timestamp}

## Memory note

| Item | Detail |
|---|---|
| Path | {`memory/reports/note/YYYY-MM-DD-<descriptive-title>.md`, or `None` when Phase 1 stopped before Memory.} |

When a Memory note path is present, use it as the work account. Do not repeat that account here.

## Result

{State the completed Git/recovery result or exact stopped state in one short paragraph.}

## Git

| Item | Result | Evidence |
|---|---|---|
| Accepted work | {Full head and tree IDs, or not observed} | {Frozen closure tree and accepted task commits.} |
| Closure commit | {not configured, not authorized, not attempted, deferred, failed, completed, or retained} | {Full commit and tree IDs, changed scope, status, or failure evidence.} |
| Base before | {Exact branch and full head, or not observed} | {Tree ID, bound checkout path and status, and drift result.} |
| Base merge | {not configured, not authorized, not attempted, deferred, failed, completed, or retained} | {Merge form, authority, resulting head, or failure evidence.} |
| Base after | {Full head and tree IDs, or not observed} | {Accepted/base tree comparison and checkout operation state.} |
| Work branch | {retained, removed, or not observed} | {Exact branch and current head, removal evidence, or observation limit.} |
| Worktree | {retained, removed, or not observed} | {Exact path and status, removal evidence, or observation limit.} |

## Concerns

| Item | Detail |
|---|---|
| Remaining concerns | {None, or exact concern and effect.} |
| Preserved unrelated work | {None, or exact path and retained state.} |
| Recovery | {None, or exact retained objects, owner, and first safe command.} |

Keep every section and fixed table row. When a Memory note path is present, do not repeat its work account.
Use the listed Git action states exactly; use `removed` only for the work branch and worktree. Use `None` for
an empty required value, report only direct evidence, and never describe an intended or failed commit or merge
as complete.
