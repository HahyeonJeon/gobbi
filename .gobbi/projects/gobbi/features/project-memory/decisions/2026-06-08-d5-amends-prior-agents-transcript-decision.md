---
name: d5-amends-prior-agents-transcript-decision
description: D5 changes the subagent token reader from manager to PostToolUse hook; the prior agents decision is amended, not reversed
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [hooks, metadata, agents, amendment]
decision_status: accepted
supersedes: null
superseded_by: null
---

# D5 amends the prior agents transcript-summing decision

## Context

`features/agents/decisions/2026-06-06-session-operation-metadata-recording-from-agent-transcripts.md` (status: accepted) established that:
1. Each agent's OWN transcript is the canonical token source.
2. PostToolUse is rejected for token usage because it captures only final-turn usage, not cumulative.
3. The manager reads each agent's transcript to record usage.

D5 (hook-only deterministic metadata) changes the subagent reader: instead of the manager reading subagent transcripts at MEMORIZATION+Wrap-up, the PostToolUse hook reads each subagent's own complete transcript at fire time.

The prior decision rejection of PostToolUse was for the MANAGER/final-turn case. D5 honors both grounds:
1. D5 does NOT read `toolUseResult.usage/totalTokens` (the final-turn value the prior decision rejected). D5 has the hook sum the agent's own complete `subagents/agent-<agentId>.jsonl` transcript — the exact canonical source the prior decision endorses.
2. The worktree-path resolution constraint (hook CWD is the main tree) is real and in D5's implementation scope.

For the MANAGER, the prior decision's rejection of PostToolUse is fully correct — D5 routes the manager rollup to SessionEnd, never to PostToolUse.

## Decision

D5 amends (does not reverse) the prior agents decision: PostToolUse is now used for SUBAGENT cumulative tokens (reading each agent's own complete transcript); the manager goes via SessionEnd; `toolUseResult.usage/totalTokens` stays rejected for both.

## Rationale

At PostToolUse fire time for a subagent, that subagent's `subagents/agent-<agentId>.jsonl` is COMPLETE — the subagent has returned. Reading the complete transcript produces the same canonical cumulative total the manager would compute, but deterministically (no convention to skip). The change is who reads the transcript (hook vs manager), not what transcript is read (own transcript stays canonical).

## Alternatives considered

- Keep manager-reads-transcript as primary: this is the existing convention that fails under load (backlog `manager-token-reconcile-skipped-and-key-mismatch.md`). Rejected.
- PostToolUse reads `toolUseResult.usage.totalTokens`: the prior decision correctly rejects this (final-turn only, not cumulative). Rejected.

## Consequences

The prior decision's `features/agents/decisions/2026-06-06-session-operation-metadata-recording-from-agent-transcripts.md` receives an amendment note (added to D5's file-change inventory). The core principle ("own transcript is canonical") is preserved; only the reader changes for subagents.

## Related

- `features/agents/decisions/2026-06-06-session-operation-metadata-recording-from-agent-transcripts.md` — the amended decision
- `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md` — the worktree-path bug D5 must close
- Design § D5
