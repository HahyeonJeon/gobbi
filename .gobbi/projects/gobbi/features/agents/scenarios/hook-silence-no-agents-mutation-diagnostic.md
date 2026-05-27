---
name: hook-silence-no-agents-mutation-diagnostic
description: Scenario where the PostToolUse hook fires but session.json agents[] shows no new entry — operator has no diagnostic to distinguish hook success from silent failure.
type: scenarios
scope: feature
feature: agents
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hook, diagnostics, silent-failure, agents-metadata]
category: failure-mode
domain: usability
---

# Hook silence — no agents[] mutation visible

## Situation

After a Task spawn completes, the PostToolUse hook fires (verified by hook registration), but `session.json.agents[]` has not gained a new entry. The manager or operator cannot tell whether the hook ran and produced no output (e.g., jq parse error, transcript not yet flushed, resolver failed silently) vs the hook did not fire at all.

This scenario is not in the current design's golden-path coverage. The reconstructor (`reconstruct-agents.sh`) provides the recovery path but requires manual invocation; there is no positive-confirmation diagnostic when the hook runs successfully.

## Inputs

- Completed Task spawn (PostToolUse event fired)
- `session.json.agents[]` unchanged
- No stderr output visible (hook uses `>/dev/null 2>&1` or similar)

## Expected behavior

When the hook runs and successfully appends an entry, it SHOULD emit a one-line diagnostic to stderr such as `agents[<id>] appended` (optionally silenceable with a flag). This makes the hook's success visible in the process output without modifying any files.

When the hook fails silently (jq error, resolver failure), it SHOULD exit non-zero with a descriptive error on stderr — the hook's strict-mode design already specifies this failure behavior.

## Verification

After Execution: run a Task spawn with hook enabled; check that a diagnostic line appears in the session output or that the reconstructor run confirms the agents[] population.

## Source

Session 1b26cf20 evaluation — Claude and Codex usage perspectives (two iterations). Suggested fix: add `echo "agents[<id>] appended" >&2` to hook script after successful upsert.
