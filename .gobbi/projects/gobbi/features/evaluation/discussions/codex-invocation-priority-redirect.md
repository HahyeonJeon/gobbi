---
date: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
scope: feature
feature: evaluation
loop: ideation
iter: 3
topic: codex-invocation-priority-redirect
status: final
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/discussions/codex-invocation-priority-redirect.md
promoted-at: 2026-05-23T14:00:00Z
---

# Discussion: Codex Invocation Priority (Post-WORK iter1 Redirect)

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

Decisions Locked row 14: `codex exec` via Bash is the UNIVERSAL primary pattern (manager AND subagents). `codex:codex-rescue` is manager-only secondary. `/codex:adversarial-review` is user-only tertiary. Design A section 2 reordered accordingly; new subsection "Why subagents must use `codex exec`" added with empirical tool-surface witness.

## Source

iter1-user-redirects.md § Decision 2 + manager empirical investigation post-iter1
