---
name: README
description: Skill-writing and agent-writing reference skills for gobbi — authoring guides for `.claude/` and `.agents/` surfaces.
type: features
scope: feature
feature: agents
status: active
created: 2026-06-24
session: 2026-06-24-bb4eb896-bed0-42d6-9a3c-f74547df2611
tags: [process]
keywords: [skill-writing, agent-writing, authoring, meta-skill]
author: claude
value_proposition: Reference skills that teach Claude and Codex agents how to author gobbi skills and agents correctly.
subsystems:
  - .gobbi/projects/gobbi/skills/skill-writing/SKILL.md
  - .gobbi/projects/gobbi/skills/agent-writing/SKILL.md
---

# Agents

## Overview

The `agents` feature provides reference skills that teach gobbi agents how to author new skills (`.claude/skills/` + `.agents/skills/`) and new agents (`.claude/agents/` + `.codex/agents/`). It covers the 4-axis Claude Code model for skill loadability, the dual-runtime mirror structure, and the verification discipline required when writing any wiring claim into a taught document.

## Status

Two skills shipped in commit `4e7c68a` (2026-06-24): `skill-writing/SKILL.md` and `agent-writing/SKILL.md`. Both are mirrored on the Codex side. The `claude-plugin` skill and the `gobbi-hook-authoring` skill serve as prior-art meta-skill precedents. Feature-dir bootstrap (this README) was deferred to Wrap-up per DD-5.

## Subdirectories

- `decisions/` — 1 decision: DD-1/DD-5 skill loadability + skill-map placement (2026-06-24)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-24 | 2026-06-24-bb4eb896-bed0-42d6-9a3c-f74547df2611 | Feature bootstrapped; skill-writing + agent-writing shipped (commit 4e7c68a); DD-1/DD-5 decision promoted |

## Open items

- None currently.

## Related

- [[planning-asserted-skill-without-verifying]] — verification discipline that skill-writing must enforce
- [[verify-dont-assert-taught-facts]] — mistake promoted this session; the skill-writing skill carries this as a hard rule
