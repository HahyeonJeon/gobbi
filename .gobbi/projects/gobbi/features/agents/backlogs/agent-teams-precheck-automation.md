---
name: agent-teams-precheck-automation
description: Automate the Agent-Teams operator pre-check (flag + SendMessage invocability) as a runtime gate, instead of only documenting it.
type: backlogs
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [subagent, continuation, agent-teams, precheck, automation]
priority: low
disposition: open
project-scope: false
shipped_in: null
---

# Automate the Agent-Teams operator pre-check

## Context
The subagent-continuation mechanism (2026-06-07 session, T1–T4) documents an operator pre-check: before relying on continuation, confirm `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is set and `SendMessage` is invocable. The locked scope only *documents* this pre-check as a manual operator step.

## Why deferred
The locked Scope Contract (Q2: all of T1–T4 this session) is a docs + prompting-discipline change. Turning the pre-check into an automated runtime gate (a script or hook that probes the flag and tool availability and routes the manager to continue-vs-fallback automatically) is new automation beyond the documented discipline — out of scope for this session's contract. Surfaced in research; not chosen.

## When to pick up
- After T1–T4 ship and the documented pre-check + fresh-spawn fallback prove correct in practice.
- Only worthwhile if `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` becomes stable enough to depend on (the gating regression in `references/sendmessage-continuation-gated.md` must be resolved or reliably enabled in the runtime).

## Suggested approach
A small probe (the manager runs once per session) that tests whether `SendMessage` is invocable, records the result in session state, and lets the orchestration choreography branch on it automatically instead of relying on the operator reading the doc. Reuse the gate-verification step this session already ran manually (flag check + invocability test).

## Originating session
`sessions/2026-06-07-a4e3b54d-3182-4193-8a42-69fce489a098/`
