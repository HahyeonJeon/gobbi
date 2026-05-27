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

## Context

The codex skill can be invoked two ways: by running the `codex exec` CLI command through the Bash tool, or by spawning a Codex plugin agent (`codex:codex-rescue`) through the Agent tool. The design had to fix which of these is the primary invocation pattern across every role (manager and subagents), and whether subagents are even able to use the plugin-agent path — the user recalled "some blocks" but could not name them.

## Decision

`codex exec` via Bash is the UNIVERSAL primary invocation pattern — for the manager and for every subagent alike. The Codex plugin agent (`codex:codex-rescue`) is a manager-only secondary path, and the `/codex:adversarial-review` slash command is a user-only tertiary path.

## Rationale

The user's direction was: "I think it's better for subagents to use codex cli command like 'codex exec'. Manager too. I think we need to check if subagents can use codex plugin skills. I remember there were some blocks." A manager investigation confirmed why the CLI path must be universal:

- `.claude/agents/{leader,executor,evaluator,assistant}.md` tool surfaces — NONE include the Agent tool. Subagents therefore cannot spawn the `codex:codex-rescue` plugin agent at all. This is the "block" the user remembered.
- `.claude/agents/manager.md` has `tools: "*"` — only the manager can spawn `codex:codex-rescue`.
- `~/.claude/plugins/cache/openai-codex/codex/1.0.2/agents/codex-rescue.md` is itself `tools: Bash` — even the plugin agent is a thin Bash wrapper around `codex exec`, so the CLI is the lowest common denominator anyway.
- `codex-cli 0.133.0` is installed at `/home/jeonhh0061/.nvm/versions/node/v22.22.1/bin/codex`; `codex exec` supports `--cd`, `--add-dir`, sandbox modes, and `-c` config overrides — enough to cover every role's needs.

## Alternatives considered

- **Plugin agent (`codex:codex-rescue`) as the primary pattern** — rejected: subagents lack the Agent tool and cannot spawn it, so a plugin-first design would leave every subagent without a Codex path.
- **Treat the two paths as equal** — rejected: equality forces every caller to branch on its own role; making the CLI universal removes that branching and keeps the plugin agent as a manager-only convenience.

## Consequences

The codex skill is specced so that:
1. **Primary pattern (universal — manager AND subagents)**: `codex exec` via Bash.
2. **Secondary pattern (manager-only)**: `Agent(subagent_type="codex:codex-rescue", ...)` for ad-hoc rescue / second-opinion work.
3. **Anti-pattern**: trying to spawn a Codex plugin agent from a subagent context.
4. **User-action pattern**: `/codex:adversarial-review` is `disable-model-invocation: true` — neither manager nor subagent can invoke it.

## Related

- This decision was split out from a bundled user-redirect record; the full originating session narrative is preserved in [`features/workflow/archive/decisions/2026-05-23-iter1-user-redirects.md`](../../workflow/archive/decisions/2026-05-23-iter1-user-redirects.md).
- [`discussions/codex-invocation-priority-redirect.md`](../discussions/codex-invocation-priority-redirect.md) — the AskUserQuestion exchange that set this direction.
- [`design/codex-skill-structure.md`](../design/codex-skill-structure.md) — the skill structure this invocation priority feeds into.
