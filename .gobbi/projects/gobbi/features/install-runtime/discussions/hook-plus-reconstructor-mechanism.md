---
name: hook-plus-reconstructor-mechanism
description: User confirmed PostToolUse hook + shell-script reconstructor as the mechanism to populate session.json.agents[]; SDK and manager-manual approaches ruled out.
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, post-tool-use, agents, session-json]
discussion-id: CP-4-1-alpha
---

# PostToolUse hook + shell-script reconstructor selected for agents[] population

## Context

The agents-population task needed a mechanism to keep `session.json.agents[]` populated as subagents are spawned. Three candidate mechanisms were on the table, and the choice shapes the entire downstream design (hook stack, reconstructor, serialization, correlation key).

## Question

Which mechanism should the agents-population task use to populate `session.json.agents[]`?

## Options considered

- (a) SDK-based SubagentStop callback.
- (b) Manager-manual append.
- (c) PostToolUse hook + shell-script reconstructor (the recommended option).

## User decision

The user confirmed **(c) — PostToolUse hook + shell-script reconstructor** (the recommended option).

## Implication

The agents-population task's entire design (hook authoring stack, reconstructor algorithm, dual-hook registration, hybrid metadata extraction, flock serialization, `tool_use_id` correlation) is built around the hook + reconstructor pattern. The SDK approach and the manager-manual approach are ruled out.

## Related

- `design/hook-bash-jq-stack.md`, `design/reconstructor-verify-and-fix.md`, `design/dual-hook-registration-resolver.md`, `design/metadata-extraction-input-vs-result.md`, `design/flock-serialization-on-session-json.md`, `design/tool-use-id-correlation-key.md` — the design docs built on this mechanism choice.
- `discussions/hook-contract-verification-gate.md` — the empirical gate that confirmed the mechanism is feasible.
