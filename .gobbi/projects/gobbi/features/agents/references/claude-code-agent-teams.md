---
name: claude-code-agent-teams
description: Claude Code Agent Teams — persistent teammates are the continuation primitive, but cost scales linearly with teammate count.
type: references
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [subagent, continuation, agent-teams, teammate, sendmessage, feature-flag, cost]
title: Claude Code Agent Teams — persistent teammates as the continuation primitive
source: https://code.claude.com/docs/en/agent-teams
accessed: 2026-06-07
ref_type: docs
---

# Claude Code Agent Teams — persistent teammates as the continuation primitive

## Insight
A "teammate" is a FULL, independent Claude Code session that PERSISTS — you message it by name via `SendMessage` and its own context is preserved across messages. This IS the continuation primitive the design needs. Teammates do NOT inherit the lead's conversation; on spawn they load CLAUDE.md + skills + MCP fresh (which validates the delta-brief model: a continuation message is a delta, the teammate already holds its accumulated context). CRITICAL cost fact: agent teams use SIGNIFICANTLY MORE tokens than a single session — each teammate is a full separate instance and token cost scales LINEARLY with teammate count; subagents (results summarized back) are the lower-cost option. So the token win exists ONLY in the sequential single-persistent-teammate shape, NOT in the parallel-many-teammates shape. CRITICAL metadata fact: because each teammate is a SEPARATE session with its OWN transcript and the team/task state lives outside the parent session (team config `members` array; per-team task list), a teammate's turns and tokens are NOT under the parent transcript's `subagents/` rollup — so the session-metadata + cost-rollup design must be teammate-aware.

## Related
- Design D1/D6 (mechanism = Agent Teams; mode 1 sequential single teammate = token-saving core; mode 2 bounded parallel fan-out 3–5 = higher cost).
- Design D2 (delta-brief) — teammates load fresh and do not inherit lead history, validating the delta model.
- Design D4 (operator pre-check) — enable the flag; v2.1.32+ requirement.
- Design D5 + F4 (teammate-aware metadata + cost rollup) — teammates are separate sessions outside the parent `subagents/` rollup; discover via the team config `members` array; read tokens from the teammate's own session.
- Design D7 (compaction/resume fallback) — in-process teammates are not restored by `/resume`/`/rewind`.
- Design D8 + D9 (evaluator-forbidden + roster/mailbox/lifecycle) — teammates can message each other (mailbox), so evaluators must stay fresh subagents OUT of the team; non-evaluator teammates coordinate only via the manager; one team at a time; no nested teams.
- External insight E2 (`sendmessage-continuation-gated`) — the gating + unreliability of the same primitive.

## Why it applies
This is the concrete mechanism for gobbi's continuation design and the source of its hard constraints: enable via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (experimental, off by default, requires Claude Code v2.1.32+; this runtime is 2.1.168 = the operator pre-check). The linear cost shape forces the design to default to sequential single-teammate (mode 1) and treat parallel fan-out (mode 2) as a knowing higher-cost exception. The separate-session + team-config-`members` facts force the teammate-aware metadata path (D5/T2) and the teammate-aware cost measurement (F4): the parent-scoped `reconcile-session-metadata.sh` rollup reads only `${main_transcript%.jsonl}/subagents/`, so it cannot see teammate turns or tokens. The no-resume-survival and mailbox limits drive the compaction fallback (D7), the evaluator-out-of-mailbox rule (D8), and the manager-centralized coordination policy (D9).

## Source
- https://code.claude.com/docs/en/agent-teams (official Claude Code docs, fetched 2026-06-07 by the manager)

## Excerpt
Key confirmed facts (paraphrased from the official doc):
- A teammate is a full, independent Claude Code session that persists; re-addressed by name via `SendMessage`; its own context is preserved across messages.
- Teammates do NOT inherit the lead's conversation history; on spawn they load CLAUDE.md + skills + MCP fresh.
- Experimental, disabled by default. Enable: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings.json `env` or environment. Requires Claude Code v2.1.32+.
- Cost: agent teams use significantly more tokens than a single session; each teammate is a full separate instance; cost scales linearly with teammate count. Subagents are the lower-cost option (results summarized back).
- Limits: in-process teammates are NOT restored by `/resume` or `/rewind`; one team at a time; no nested teams (teammates can't spawn teammates); lead is fixed for the team's lifetime; teammates can message each other directly (mailbox).
- Teammates can reference subagent definitions by name (honor `tools` allowlist + `model`; definition body appended to system prompt). `SendMessage` + task tools are always available to a teammate. The `skills`/`mcpServers` frontmatter in a subagent definition is NOT applied when it runs as a teammate.
- Team + task state lives OUTSIDE the parent session: the team config is at `~/.claude/teams/{team-name}/config.json` with a `members` array (name / agentId / agentType); the shared task list is a separate per-team store at `~/.claude/tasks/{team-name}/`. Each teammate has its OWN session transcript — it is NOT a file under the parent session's `subagents/` rollup.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-07 | a4e3b54d-3182-4193-8a42-69fce489a098 | iter2 design — mechanism = Agent Teams (D1/D6), delta-brief validation (D2), operator pre-check (D4), compaction fallback (D7), evaluator-out-of-mailbox (D8), F4 cost rationale |
| 2026-06-07 | a4e3b54d-3182-4193-8a42-69fce489a098 | iter3 design — teammate-aware metadata path (D5/T2/F4), roster/mailbox/lifecycle policy (D9), cross-loop best-effort + compaction degrade |
