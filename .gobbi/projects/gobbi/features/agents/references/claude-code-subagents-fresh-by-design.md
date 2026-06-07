---
name: claude-code-subagents-fresh-by-design
description: Claude Code subagents start fresh; the only parent-to-child channel is the prompt string, and "fork" is the one inherit-everything escape.
type: references
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [subagent, context, delegation, continuation]
title: Claude Code subagents are fresh-by-design
source: https://code.claude.com/docs/en/sub-agents
accessed: 2026-06-07
ref_type: docs
---

# Claude Code subagents are fresh-by-design

## Insight
Each Claude Code subagent spawns in its own ~200K-token context window with its own system prompt and tools; no parent context is inherited. The only parent→child channel is the Agent tool's prompt string, and "fork" is the single inherit-everything escape.

## Related
- Internal insight I1 (`delegation/SKILL.md:22-24,104-106` — the "nothing inherited" tenet).
- Design D2 (delta-brief mechanism — the prompt string is the only channel, so a continuation delta must be carried in the message).

## Why it applies
gobbi already lives this fresh-by-design model. Continuation is the deliberate exception: it keeps context within one role's contiguous run, and the delta-brief is the disciplined way to use the prompt-string channel instead of a full re-paste.

## Source
- https://code.claude.com/docs/en/sub-agents
- https://www.mindstudio.ai/blog/sub-agents-claude-code-context-management

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-07 | a4e3b54d-3182-4193-8a42-69fce489a098 | Design D2 (delta-brief) + Framed Problem root cause |
