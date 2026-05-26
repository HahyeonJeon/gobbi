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

# Discussion: Codex Invocation Priority

## What was asked

Q: "In Design A, which codex invocation pattern should be the primary one — plugin agent first, `codex exec` first, or treated as equal?"

## User answer

"I think it's better for subagents to use codex cli command like 'codex exec'. Manager too. I think we need to check if subagents can use codex plugin skills. I remember there were some blocks."

## Manager empirical investigation

- `.claude/agents/{leader,executor,evaluator,assistant}.md` confirm all lack Agent tool — subagents cannot spawn `codex:codex-rescue` plugin.
- `.claude/agents/manager.md` has `tools: "*"` — only manager can spawn plugin agents.
- Plugin agent (`agents/codex-rescue.md`) itself declares `tools: Bash` — it is a thin Bash wrapper around `codex exec`.
- The "blocks" the user remembered = subagents cannot spawn plugin agents because they lack the Agent tool.

## Decision and consequence

`codex exec` via Bash is the UNIVERSAL primary pattern (manager AND subagents). `codex:codex-rescue` is manager-only secondary. `/codex:adversarial-review` is user-only tertiary. The codex skill Design A section 2 was reordered accordingly; a new subsection "Why subagents must use `codex exec`" was added with empirical tool-surface witness.
