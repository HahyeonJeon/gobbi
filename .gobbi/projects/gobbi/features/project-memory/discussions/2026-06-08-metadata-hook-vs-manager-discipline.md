---
name: 2026-06-08-metadata-hook-vs-manager-discipline
description: User chose hook-only deterministic metadata recording over manager-skill discipline; D5 confirmed
type: discussions
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [metadata, hooks, tokensUsed, d5]
loop: ideation
outcome: Hook-only deterministic metadata; PostToolUse for subagent tokens; SessionEnd for manager rollup
---

# Metadata recording: hook-only vs manager-discipline

## Context

The existing metadata recording convention makes the manager run `reconcile-session-metadata.sh` at MEMORIZATION + Wrap-up. Backlog `manager-token-reconcile-skipped-and-key-mismatch.md` records that session 422308da shipped `tokensUsed` zeroed and `sessionTotal=0` due to this convention being skipped. Root cause #2 of the redesign.

## Question

Should metadata recording be made deterministic via hooks (fire-and-forget, no manager involvement) or kept as manager-skill discipline with a stronger gate?

## Options considered

1. **Hook-only deterministic:** PostToolUse hook computes real subagent tokens + writes them immediately; a SessionEnd/Stop hook does the manager rollup. No manager skill-discipline required. CAVEAT: requires a SessionEnd/Stop hook event (unverified — Planning must confirm existence).
2. **Stronger manager gate:** add an exit-checklist gate that blocks MEMORIZATION/Wrap-up progression if `sessionTotal == 0`. Manager still runs the reconcile.

## User decision

**Hook-only deterministic.** PostToolUse resolves `agentId` → sums `subagents/agent-<agentId>.jsonl` → writes real cumulative tokens. SessionEnd/Stop hook does manager rollup + `usage.sessionTotal`. Planning MUST confirm Claude Code exposes a usable session-end hook; if not, re-surface to user (do not ship zeroed total).

## Implication

- D5 must add PostToolUse hook real-token logic + a new `hooks/session-end.sh`.
- BOTH `.claude/settings.json` AND plugin `.gobbi/projects/gobbi/hooks/hooks.json` must register the SessionEnd hook.
- The prior agents decision (`2026-06-06-session-operation-metadata-recording-from-agent-transcripts.md`) is amended: PostToolUse is now used for subagent cumulative tokens (reading each agent's own complete transcript); the manager goes via SessionEnd; `toolUseResult.usage/totalTokens` still rejected.
- Planning carries a go/no-go gate: verify SessionEnd or Stop hook event exists.

## Related

- Design § D5, Scenarios S3/S4
- `staging/decisions/2026-06-08-session-end-hook-existence-assumption.md`
- `staging/decisions/2026-06-08-d5-amends-prior-agents-transcript-decision.md`
