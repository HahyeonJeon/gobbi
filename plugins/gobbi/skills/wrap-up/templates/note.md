# {Subject} — Note

> **Output role:** Response body after any caller-required prefix; not a tracked closure artifact<br>
> **Note type:** {Development | Research | Work}<br>
> **Status:** {Complete | Stopped}<br>
> **Caller:** {Caller context label}<br>
> **Session:** {Gobbi UUID}<br>
> **Assignment:** {Stable closure assignment ID}<br>
> **Recorded at:** {UTC timestamp}

## Context

| Item | Detail |
|---|---|
| Repository | {Exact repository root and Git common-directory identity.} |
| Purpose | {Why the work was needed and who or what it serves.} |
| Requirements | {Accepted requirements and completion conditions.} |
| Scope | {Included work and affected surfaces.} |
| Exclusions | {Explicit exclusions or `None`.} |
| Decisions and constraints | {Material decisions, constraints, and preserved conditions.} |
| Sources | {Primary artifacts, evidence, or references needed to understand the work.} |
| Acceptance | {Caller acceptance and evaluation evidence, or the exact missing evidence.} |

## Result

{State the completed result or exact stopped state in one short paragraph.}

## Work

| Item | Detail | Evidence |
|---|---|---|
| {Delivered work, research result, or other outcome} | {What was completed and why it matters.} | {Repository-relative artifacts, observations, or accepted commits.} |

{Repeat for every material result, or state `None`.}

## Memory

| Action | Owner | Change and reason | Evidence |
|---|---|---|---|
| {Created, updated, moved, merged, reorganized, removed, no change, or not attempted} | {Category skill or `None`} | {Source and result paths, what changed, and why it was needed.} | {Verification or direct observation.} |

{Repeat for every material Memory action. Use one `No change` row with its reason and evidence when no durable
update was needed.}

## Verification

| Method | Result | Evidence |
|---|---|---|
| {Command, review, comparison, observation, or other method} | {Factual result or not run} | {Material output or exact observation.} |

{Repeat for every required or targeted check, or state why verification could not run.}

## Git

| Item | Result | Evidence |
|---|---|---|
| Accepted work | {Full head and tree IDs, or not observed} | {Frozen closure tree and accepted task commits.} |
| Closure commit | {not configured, not authorized, not attempted, deferred, failed, completed, or retained} | {Full commit and tree IDs, provenance, status, or failure evidence.} |
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

Keep every section and fixed table row. Make Context sufficient for a cold reader to understand why the work
was done, what it had to satisfy, and where its boundaries came from. Use the listed Git action states exactly;
use `removed` only for the work branch and worktree. Use `None` for an empty required value, report only direct
evidence, and never describe an intended or failed commit or merge as complete.
