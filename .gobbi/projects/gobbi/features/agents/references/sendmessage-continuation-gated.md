---
name: sendmessage-continuation-gated
description: SendMessage(to agentId) is the continuation primitive but is gated behind CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 (Agent Teams), and continued teammates do not survive /resume or /rewind.
type: references
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [subagent, continuation, sendmessage, agent-teams, feature-flag, resume]
title: SendMessage continuation primitive is feature-gated (Agent Teams) and not resume-durable
source: https://github.com/anthropics/claude-code/issues/42737
accessed: 2026-06-07
ref_type: code
---

# SendMessage continuation primitive is feature-gated (Agent Teams) and not resume-durable

## Insight
`SendMessage({to: agentId})` continues a previously-spawned agent (an Agent Teams "teammate") with its own context preserved across messages; a new `Agent` call always starts fresh. The tool is gated behind `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (the Agent Teams feature; requires Claude Code v2.1.32+). Without the flag the tool does not appear in ToolSearch, even though the Agent result text still says "use SendMessage to continue this agent." Two operational hard limits: (1) the flag is experimental and off by default; (2) in-process teammates are NOT restored by `/resume` or `/rewind` — after `/clear`, `/compact`, or resume the teammate is gone and the manager must fresh-spawn and re-prime from durable session memory.

## Related
- Reference `claude-code-agent-teams` — the official doc that defines this primitive and its cost/limit shape; this issue is the corroborating regression report.
- Design D4 (primary-where-safe + fresh-spawn fallback + operator pre-check) — directly motivated by this gating.
- Design D7 (compaction/resume fallback) — directly motivated by the no-`/resume`/`/rewind` survival fact.
- Internal insight I3 (cwd-reset realized failure during a SendMessage continuation).
- This session's gate verification: flag unset, SendMessage not invocable in Claude Code 2.1.168 → fallback dogfooded.

## Why it applies
Any markdown-driven continuation design must treat continuation as best-effort with a fresh-spawn fallback, or require the operator to enable the flag. It cannot be a hard dependency. Because a continued teammate does not survive `/resume`/`/rewind`, the design also needs an explicit compaction/resume → fresh-spawn-and-re-prime path (never message a dead teammate).

## Source
- https://github.com/anthropics/claude-code/issues/42737 (closed not-planned)
- Official Agent Teams doc: https://code.claude.com/docs/en/agent-teams
- v2.1.77 changelog: https://x.com/ClaudeCodeLog/status/2033705667295379568
- Corroborating issues: #35141, #35240, #37051, #38183; SDK #716

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-07 | a4e3b54d-3182-4193-8a42-69fce489a098 | Design D4 (fallback + pre-check) + D7 (compaction fallback) + counterfactual; reconciled in iter2 with the official Agent Teams facts |
