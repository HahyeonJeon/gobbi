---
name: agent-skills-progressive-disclosure
description: Anthropic Agent Skills load a SKILL.md, then pull referenced bundled files on demand — but the auto-pull assumes a Skill runtime
type: references
scope: feature
feature: guardrails
status: active
created: 2026-06-27
session: 659a1b3f-0b70-419a-848b-a02db5dbbded
tags: [memory, design]
keywords: [agent-skills, progressive-disclosure, bundled-resources, load-on-demand, skill-md]
author: claude
title: Agent Skills progressive disclosure — SKILL.md references load on demand
source: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
accessed: 2026-06-27
ref_type: docs
---

# Agent Skills progressive disclosure — SKILL.md references load on demand

## Insight
A skill is a folder whose `SKILL.md` references bundled files (templates, references) that the runtime pulls into context only when a step needs them — there is no context penalty for bundled content left unused.

## Reason
Models the `mistakes.md` companion: referenced from `SKILL.md`, loaded when the skill activates. But the auto-pull assumes a Skill runtime that follows references — gobbi's spawned subagents have no Skill tool and only READ listed paths, so the reference must be made an explicit Load-Directives path (Q3), not relied on as auto-load.

## Source
- https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview

## Excerpt
Skills can bundle additional files within the skill directory and reference them from SKILL.md as the third level of detail, which Claude can navigate and discover only as needed.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-27 | 659a1b3f-0b70-419a-848b-a02db5dbbded | Ideation insight E3 — anchors the loading decision (Q3) and its subagent caveat |

## Related

- [[nearest-file-wins-colocated-rules]] — the co-located-guidance loading pattern
