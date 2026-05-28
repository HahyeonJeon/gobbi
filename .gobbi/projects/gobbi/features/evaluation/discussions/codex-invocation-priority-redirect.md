---
name: codex-invocation-priority-redirect
description: User confirmed codex exec via Bash as the universal primary invocation pattern for all roles; manager empirical investigation revealed subagents cannot spawn plugin agents.
type: discussions
scope: feature
feature: evaluation
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [codex, invocation, subagents, plugin-agents]
---

# Codex Invocation Priority

## Context

The codex skill design had two candidate invocation paths — the `codex exec` CLI command via Bash, and the `codex:codex-rescue` plugin agent via the Agent tool — and needed to fix which is primary across roles. The user recalled "some blocks" on subagents using Codex plugin skills but could not name them, so the priority could not be settled without resolving that open question first.

## Question

In the codex skill design, which Codex invocation pattern should be the primary one — plugin agent first, `codex exec` first, or treated as equal?

## Options considered

- **`codex exec` first (universal)** — every role, manager and subagent alike, invokes Codex through the CLI; the plugin agent is a secondary convenience.
- **Plugin agent first** — `codex:codex-rescue` is the primary path, falling back to the CLI.
- **Treat both as equal** — no fixed priority; each caller picks.

## User decision

The user chose CLI-first: "I think it's better for subagents to use codex cli command like 'codex exec'. Manager too. I think we need to check if subagents can use codex plugin skills. I remember there were some blocks." A manager investigation then resolved the "blocks" the user remembered:

- `.claude/agents/{leader,executor,evaluator,assistant}.md` all lack the Agent tool — subagents cannot spawn the `codex:codex-rescue` plugin agent.
- `.claude/agents/manager.md` has `tools: "*"` — only the manager can spawn plugin agents.
- The plugin agent (`agents/codex-rescue.md`) itself declares `tools: Bash` — it is a thin Bash wrapper around `codex exec`.
- The remembered "blocks" = subagents cannot spawn plugin agents because they lack the Agent tool.

## Implication

`codex exec` via Bash is the UNIVERSAL primary pattern (manager AND subagents); `codex:codex-rescue` is a manager-only secondary path; `/codex:adversarial-review` is a user-only tertiary path. The codex skill's invocation-patterns section was reordered accordingly, and a new subsection "Why subagents must use `codex exec`" was added carrying the empirical tool-surface witness.

## Related

- [`decisions/codex-exec-universal-invocation-pattern.md`](../decisions/codex-exec-universal-invocation-pattern.md) — the decision record this discussion produced.
- [`design/codex-skill-structure.md`](../design/codex-skill-structure.md) — the skill structure whose invocation-patterns section encodes this priority.
