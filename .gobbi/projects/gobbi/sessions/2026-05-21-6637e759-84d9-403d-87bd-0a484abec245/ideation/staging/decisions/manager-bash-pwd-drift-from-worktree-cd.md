---
name: manager-bash-pwd-drift-from-worktree-cd
description: Manager bash session persisted a `cd <worktree>` across commands, then relative-path verifications resolved against the worktree and falsely reported missing files
metadata:
  type: mistake
artifact_type: mistake-candidate
mistake-candidate: true
domain: process
scope: project
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
loop: ideation
created-by: manager
created-at: 2026-05-21T05:55:00Z
---

# Manager bash pwd drifted from worktree cd, then verification falsely reported missing files

## What went wrong

During Ideation iter1, the manager investigated worktree state by running
`cd /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules && git status`. That `cd` persisted in the bash session. The manager then verified the leader's WORK artifact with `ls .gobbi/projects/gobbi/sessions/.../draft-iter1.md` (relative path) and `wc -l .gobbi/projects/gobbi/sessions/...` — both resolved against the worktree's working directory, not the main tree. The leader's artifacts existed correctly in the main tree, but the verification claimed they did not.

The manager nearly classified this as the `executor-rationalized-failing-verification-gate` pattern at the leader role and was about to re-dispatch a SendMessage demanding the leader "actually write the file this time" — which would have been a false accusation. Caught at the last moment by running `find` with absolute path + printing pwd in the same Bash call.

## Why it went wrong (the mistaken assumption)

The manager treated bash tool invocations as if each was scoped to the main tree's working directory. The Bash tool's system prompt actually states: "The working directory persists between commands." Forgotten.

Compounding factor: when the manager investigates git worktrees, `cd <worktree>` is the idiomatic way to scope `git status` to the worktree. The manager used the right command but did not `cd -` back.

## How to recognize the situation next time

- Whenever a Bash call contains `cd <path>` (whether standalone or in an `&&` chain), the bash session's pwd has moved. All subsequent bash calls in the session inherit that pwd.
- When verifying that a subagent's artifact was written, ALWAYS use absolute paths OR `cd <main-tree>` before the verification command. Never trust relative paths after an investigation `cd`.
- The Bash tool description literally says (under Instructions): "Try to maintain your current working directory throughout the session by using absolute paths and avoiding usage of `cd`."
- A failed `ls`/`wc`/`find` on a subagent's claimed artifact is suspicious — before concluding the subagent fabricated the work, print `pwd` and re-run with the absolute path.

## Corrected approach

- For all verification of subagent artifacts: use absolute paths (`/playinganalytics/git/gobbi/...`) rather than relative.
- When `cd` is unavoidable (e.g., `cd <worktree> && git status`), follow with `cd -` (or chain the next unrelated command with explicit `cd /playinganalytics/git/gobbi &&`) to restore pwd.
- Before concluding "subagent rationalized completion," print `pwd` + retry with absolute path. The `executor-rationalized-failing-verification-gate` pattern is real but only applies after this check rules out manager-side path error.

## Cross-references

- `principles` Iron Law 1 (think before acting — pwd is part of the action context)
- `principles` Iron Law 7 (verification gate — verification command itself must be correct before concluding the verified fact)
- Existing mistake `executor-rationalized-failing-verification-gate.md` — narrowly avoided false-positive triggering against the leader
