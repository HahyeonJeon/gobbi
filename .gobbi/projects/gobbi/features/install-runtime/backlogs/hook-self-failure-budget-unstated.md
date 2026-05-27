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

The hook's failure-recovery design is an Execution concern: the executor authoring the script can make appropriate choices for flock timeout and error logging based on the script's final structure, so locking those values in advance would over-specify. The risk is also bounded — the `reconstruct-agents.sh` script is the recovery mechanism for missed entries (it exists precisely to handle hook gaps, and is documented as "orphan-report-only (never deletes)" and the "hook crash/gap recovery mechanism"), so a silently-failed hook fire is recoverable rather than data-losing.

## When to pick up

If the hook fails silently during a test after Execution. At that point, specify the three things the plan currently leaves open: (1) the flock timeout, (2) whether hook errors are logged, and (3) what happens to `agents[]` after N consecutive silent failures.

## Suggested approach

Add an explicit flock timeout (`flock -x -w N`) and stderr-based error logging to the script so a hook self-failure is observable rather than silent. Record any observed failure mode as a mistake so the budget is grounded in a real witness rather than guessed.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Source

Surfaced as a risk finding during install-runtime design evaluation (session 1b26cf20); the reconstructor was identified as the recovery path that makes the deferral acceptable.
