# {Task} — Execution Handoff

> **Output role:** Response body after any caller-required prefix; not a tracked task artifact<br>
> **Task:** {Stable task identity and required outcome}<br>
> **Scope:** {Implemented boundary and explicit exclusions}

## Result

{State the implemented observable result or the exact stopped state.}

## Changes

> **Strategy:** {State the chosen implementation strategy and why it fits the task and project.}

| Path | Change |
|---|---|
| `{Task-owned path}` | `{What changed and why}` |

{Repeat for every changed path, or state `None`.}

## Verification

| Check | Result | Evidence |
|---|---|---|
| `{Exact command or direct inspection}` | `{PASS, FAIL, or not run, with exit status and counts}` | `{Material output or exact observation}` |

{Repeat for every required or targeted check, or state why verification could not run.}

## Local Delivery

| Item | Detail |
|---|---|
| Commit | `{Full focused local commit hash whose tree contains the verified result, or None with reason}` |
| In-scope work uncommitted | `{None, or exact remaining work}` |
| Unauthorized side effects | `{None, or exact side effect}` |

## Concerns and Limits

| Item | Detail |
|---|---|
| Remaining concerns | `{None, or exact concern and effect}` |
| Preserved unrelated work | `{None, or exact path and retained state}` |
| Blocked external actions | `{None, or exact action, disposition, and reason it was not performed}` |
