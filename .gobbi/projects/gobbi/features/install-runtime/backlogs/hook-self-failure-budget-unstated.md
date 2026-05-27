---
name: hook-self-failure-budget-unstated
description: PostToolUse hook self-failure budget (flock timeout, error logging) left to executor discretion
type: backlogs
scope: feature
feature: install-runtime
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hook, flock, error-logging, failure-budget, planning]
disposition: open
supersedes: null
---

# Hook self-failure budget — flock timeout and error logging left unstated

## Context

The hook script (`post-tool-use-agents.sh`) is invoked on PostToolUseFailure. If the hook itself fails (e.g., jq not available, flock timeout, session.json write permission denied), the failure is silent from Claude Code's perspective — Claude Code does not crash on hook errors.

The plan does not specify: (1) what flock timeout to use, (2) whether hook errors should be logged, (3) what happens to `agents[]` if the hook silently fails for N consecutive Task spawns.

## Why deferred

The hook's failure-recovery design is an Execution concern: the executor will author the script and can make appropriate choices for flock timeout and error logging based on the bash script's structure. The `reconstruct-agents.sh` script is the recovery mechanism for missed entries — it exists precisely to handle hook gaps.

The risk is acceptable given the reconstructor provides the "fix" path. The plan already documents: "orphan-report-only (never deletes)" and "hook crash/gap recovery mechanism."

## Trigger condition for revisiting

If after Execution the hook fails silently during a test, add explicit flock timeout (`flock -x -w N`) and stderr-based error logging to the script. Record the failure mode as a mistake.

## Related

- `draft-iter2.md:272` (Task 07 what — D-3-3-resolver step ii)
- `iter1 F-RISK-2` (Claude)
- Task 08 (reconstructor as recovery path)
