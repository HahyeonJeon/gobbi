---
name: README
description: Runtime install/interview skill work — the startup skill's design, decisions, and grading-SOP migration.
type: features
scope: feature
feature: install-runtime
status: active
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: []
keywords: [startup, interview, phase-document, scenario-checklist-migration]
author: claude
value_proposition: A structured, gate-checked product-shape interview (the `startup` skill) that confirms each phase's findings with the user before moving on, instead of a single unchecked pass.
subsystems: [skills/startup]
---

# Install-runtime

## Overview

This feature owns the `startup` skill — gobbi's structured, phase-gated product-shape interview. This
session shipped three improvement points (IP-1 phase-document supplement-and-gate, IP-2 pacing-touchpoint
removal, IP-3 parent-scoped evidence-led follow-up probes) plus a full migration of the skill's grading
bundle (scenarios + checklists + evaluation) onto gobbi's current scenario/checklist SOP.

## Status

Active. IP-1/IP-2/IP-3 and the whole-bundle SOP migration shipped this session (branch
`claude-2026-07-17-1245142c-0a76-4333-b2d3-6892a62eb359`, 7 commits, six files touched, EXEC_BASE
`9f7898a3` off `develop`). Ideation, Preparation, Planning, and Execution all reached PASS (Planning
iter2+, Execution, and this Wrap-up ran Claude-only under a user-approved Codex waiver, 2026-07-18).

## Subdirectories

- `scenarios/` — none yet
- `checklists/` — 15 items (1 `process`, 14 `workflow`) — Ideation- and Planning-loop fix/verification
  checklist entries
- `decisions/` — 31 records (10 `memory`, 2 `process`, 19 `workflow`) — IP-1/IP-2/IP-3 design locks, D11/D12,
  Preparation anchors, and Planning-loop dual-system fix decisions
- `design/` — none yet
- `discussions/` — none yet
- `references/` — 8 items, area `startup-prior-art` — interview-methodology prior art (BABOK, Five Whys,
  Funnel, Laddering, Mom Test, Stage-Gate, research-readout synthesis, survey pacing)
- `plans/` — 1 record, area `workflow` — the nine-task decomposition plan
- `backlogs/` — none yet
- `changelogs/` — none yet
- `mistakes/` — none yet (this session's 8 mistake-candidates all routed cross-cutting to the project
  `mistakes/` tier, not feature-scoped — see the session's Wrap-up handoff)
- `rules/` — none yet
- `learnings/` — none yet
- `reviews/` — none yet
- `reports/` — none yet

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-07-24 | 1245142c-0a76-4333-b2d3-6892a62eb359 | Wrap-up promoted 55 records (31 decisions, 15 checklists, 8 references, 1 plan) from this session's Ideation/Preparation/Planning staging; feature directory bootstrapped |

## Open items

None currently tracked in `backlogs/`.

## Related

None yet — no cross-feature project-level design currently touches this feature.
