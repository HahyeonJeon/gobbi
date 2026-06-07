---
name: continuation-mode-and-scope
description: How to treat continuation (primary+fallback+pre-check) and which scope to bundle (all of T1-T4)
type: discussions
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [agents, delegation, continuation, scope]
loop: ideation
outcome: Primary + fallback + pre-check; all of T1-T4 bundled in one session
---

# Continuation Treatment and Scope Lock

## Context

Two early decisions were required before designing the continuation mechanism: (1) how strictly to treat continuation (mandatory? preferred? fallback?), and (2) how wide to set the scope (one component at a time or all of T1–T4 in one session).

## Question

Q1: Should continuation be described as mandatory (always use), preferred-where-safe (with a fresh-spawn fallback and an operator pre-check), or only where explicitly invoked?

Q2: Should this session address all of T1–T4 (delegation skill + session metadata + orchestration choreography + agent specs), or decompose into multiple smaller sessions?

## Options considered

**Q1 options:**
- Mandatory: rejected — the continuation primitive (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) is experimental and not invocable in this runtime; asserting it as mandatory would block sessions where the flag is unset.
- Preferred-where-safe with fallback and pre-check: accepted — continuation is the goal but the design must be resilient to the flag being unset; a fresh-spawn fallback with a full brief achieves the same functional result.
- Only where explicitly invoked: rejected — too restrictive; the goal is to make continuation the norm in applicable contexts.

**Q2 options:**
- All of T1–T4 in one session: accepted — the user ratified the larger blast radius.
- Decompose: rejected by user — the components are logically coupled (T1 rule → T3 choreography → T4 agent specs; T2 is the metadata home for T1/T3 behavior).

## User decision

Q1: **Primary + fallback + pre-check.** Docs describe continuation as preferred-where-safe, with a fresh-spawn fallback and an operator pre-check for the Agent-Teams flag.

Q2: **All of T1–T4 this session.** Full mechanism — T1 continue-vs-fresh rule + delta-brief in `delegation/SKILL.md`; T2 session-metadata representation; T3 orchestration spawn choreography; T4 agent-spec continuation discipline. User accepted the larger blast radius.

## Implication

The design must always describe continuation as preferred-where-safe, never as a hard dependency. No doc may assert "continuation is required to run gobbi." The operator pre-check (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, v2.1.32+) is the gate before relying on continuation; if the gate fails, the manager fresh-spawns with a full brief. T1–T4 are all in scope, all shipped in this session's Planning + Execution.

## Related

- `features/agents/design/subagent-continuation-mechanism.md` — D4 (primary-where-safe + fallback + pre-check)
- `features/agents/decisions/2026-06-07-continue-vs-fresh-deterministic-rule.md` — D1 (the deterministic rule)
