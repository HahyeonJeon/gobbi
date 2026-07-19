---
name: README
description: Typed skill-writing SOP and agent-writing guide for Gobbi's shared Claude Code and Codex authoring surfaces.
type: features
scope: feature
feature: agents
status: active
created: 2026-06-24
session: 2026-06-24-bb4eb896-bed0-42d6-9a3c-f74547df2611
tags: []
keywords: [skill-writing, agent-writing, authoring, meta-skill]
author: claude
value_proposition: A typed authoring contract that makes Gobbi skills and agents classifiable, loadable, and verifiable across both runtimes.
subsystems:
  - .gobbi/projects/gobbi/skills/skill-writing/SKILL.md
  - .gobbi/projects/gobbi/skills/agent-writing/SKILL.md
---

# Agents

## Overview

The `agents` feature owns Gobbi's authoring procedures for skills and custom agents. `skill-writing` is an
operation skill: its parent SOP classifies a target as `preference`, `tool`, or `operation`, then loads one
type-owned procedure. `agent-writing` remains the companion authoring guide. Both operate through the shared
canonical sources and runtime mirrors, with verification required for every wiring claim.

## Status

The original `skill-writing` and `agent-writing` guides shipped in commit `4e7c68a` (2026-06-24). On
2026-07-19, `skill-writing` became a typed operation SOP with direct procedures for all three semantic skill
types and a required operation verification bundle (`scenarios.md`, `checklists.md`, `evaluation.md`). Fresh
repository Codex discovery loaded the typed skill; the Claude manifest validation and Codex source-package
smoke check pass. The known Codex installed-cache limitation for symlinked component directories remains.
Existing untyped skills stay legacy-compatible until they are substantively revised; this change does not
force a repository-wide retrofit.

## Subdirectories

- `decisions/` — 1 active decision: typed skill authoring contract (2026-07-19); the superseded 2026-06-24 contract is preserved under project archive history

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-07-19 | 019f790a-59de-7f40-aa29-99b7356ca704 | Three-type skill-writing contract shipped; fresh Codex load proof passed and both Codex evaluation findings were remediated |
| 2026-06-24 | 2026-06-24-bb4eb896-bed0-42d6-9a3c-f74547df2611 | Feature bootstrapped; skill-writing + agent-writing shipped (commit 4e7c68a); DD-1/DD-5 decision promoted |

## Open items

- None currently.

## Related

- [[planning-asserted-skill-without-verifying]] — verification discipline that skill-writing must enforce
- [[verify-dont-assert-taught-facts]] — mistake promoted this session; the skill-writing skill carries this as a hard rule
- [[typed-skill-authoring-contract]] — current three-type authoring and migration contract
