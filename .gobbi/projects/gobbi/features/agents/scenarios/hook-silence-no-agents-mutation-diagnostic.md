---
scenario: Hook ran but session.json agents[] shows no mutation — operator-facing diagnostic missing
category: failure-mode
scope: feature
feature: agents
added: 2026-05-23
added_by_session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: uncovered
finding-id: F-USAGE-iter3-2
type: scenario_gap
domain: usability
disposition: deferred
confidence: 50
severity: Medium
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

When the hook fails silently (jq error, resolver failure), it SHOULD exit non-zero with a descriptive error on stderr (already specified in D-3-1 strict mode).

## Verification

After Execution: run a Task spawn with hook enabled; check that a diagnostic line appears in the session output or that the reconstructor run confirms the agents[] population.

## Related

- `evaluation/iter2/claude/usage.md` U3
- `evaluation/iter3/claude/usage.md` F-USAGE-iter3-2
- `evaluation/iter3/codex/usage.md` CLAUDE-USAGE-U3
- Suggested fix: add `echo "agents[<id>] appended" >&2` to hook script after successful upsert.
