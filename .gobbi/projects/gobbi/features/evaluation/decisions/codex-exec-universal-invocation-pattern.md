---
name: codex-exec-universal-invocation-pattern
description: "Codex skill invocation — codex exec via Bash is the universal primary pattern"
type: decisions
scope: feature
feature: evaluation
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [codex, invocation, orchestration, dual-system]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Codex skill invocation priority

This decision was split out from a bundled user-redirect record. Full session context is preserved in `archive/decisions/2026-05-23-iter1-user-redirects.md`.

## Question

How should the codex skill be invoked across roles — via the `codex exec` Bash command, or via plugin agents (`codex:codex-rescue`)? Which is primary, and can subagents use codex plugin skills?

## Resolution

**User answer**: "I think it's better for subagents to use codex cli command like 'codex exec'. Manager too. I think we need to check if subagents can use codex plugin skills. I remember there were some blocks."

**Interpretation**: `codex exec` via Bash is the UNIVERSAL primary pattern, including for the manager. Plugin agents are secondary.

## Manager empirical investigation (resolving user's open question)

- `.claude/agents/{leader,executor,evaluator,assistant}.md` confirm tool surfaces — NONE include the Agent tool. Subagents lack Agent tool → cannot spawn `codex:codex-rescue` plugin agent.
- `.claude/agents/manager.md` has `tools: "*"` — only the manager can spawn `codex:codex-rescue`.
- `~/.claude/plugins/cache/openai-codex/codex/1.0.2/agents/codex-rescue.md` is itself `tools: Bash` — even the plugin agent is a thin Bash wrapper around `codex exec`.
- `codex-cli 0.133.0` is installed at `/home/jeonhh0061/.nvm/versions/node/v22.22.1/bin/codex`. `codex exec` available with `--cd`, `--add-dir`, sandbox modes, `-c` config overrides.
- The "blocks" the user remembered are: **subagents cannot spawn plugin agents because they lack the Agent tool**. This is the empirical witness.

## Implementation impact on Design A

Leader must respec the codex skill to:
1. **Primary pattern (universal — manager AND subagents)**: `codex exec` via Bash.
2. **Secondary pattern (manager-only)**: `Agent(subagent_type="codex:codex-rescue", ...)` for ad-hoc rescue / second-opinion work.
3. **Anti-pattern**: trying to spawn a codex plugin agent from a subagent context.
4. **User-action pattern**: `/codex:adversarial-review` is `disable-model-invocation: true` — neither manager nor subagent can invoke.
