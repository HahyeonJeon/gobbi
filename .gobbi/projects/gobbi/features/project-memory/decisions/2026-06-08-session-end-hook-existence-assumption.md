---
name: session-end-hook-existence-assumption
description: D5 assumes Claude Code exposes a usable SessionEnd/Stop hook — unverified; Planning must gate on this
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [hooks, metadata, assumption, process]
decision_status: proposed
supersedes: null
superseded_by: null
---

# Session-end hook existence is unverified — Planning must gate

## Context

D5 (hook-only deterministic metadata) requires a SessionEnd or Stop hook event to perform the manager-transcript rollup and write `usage.sessionTotal`. As of 2026-06-08, the live hook registry (`.claude/settings.json`) and plugin registry (`.gobbi/projects/gobbi/hooks/hooks.json`) expose only `SessionStart`, `PostToolUse`, and `PostToolUseFailure`.

## Decision

This is a load-bearing Planning-must-verify item. If no usable session-end hook event exists in Claude Code, do NOT ship a manager-zeroed total. Re-surface to the user (scenario S4) and redesign the manager rollup path.

## Rationale

The manager's main transcript is still growing at any PostToolUse fire time — it cannot be summed until the session ends. The only mechanism to guarantee a complete manager total is a session-end event. If that event does not exist, D5's metadata-determinism goal (root cause #2 fix) is unmet by the chosen mechanism.

## Alternatives considered

- **PostToolUse for manager total too:** rejected. The prior agents decision correctly identifies that PostToolUse cannot see the complete manager transcript. Not a valid path.
- **Wrap-up step runs the reconcile:** this is the existing convention that already fails under load (root cause #2). Not acceptable as the primary path.
- **Accept zeroed manager total:** rejected. Root cause #2 is the trigger for this entire redesign; silently shipping a zeroed total defeats the purpose.

## Consequences

Planning carries a go/no-go gate: verify `SessionEnd` or `Stop` hook event exists → proceed with D5 implementation OR re-surface to user and redesign.

## Related

- `features/agents/decisions/2026-06-06-session-operation-metadata-recording-from-agent-transcripts.md` — the prior agents decision D5 amends
- `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md` — the worktree-path resolution bug D5 must close
- Success Criterion 3, Scenario S4, Design § D5
