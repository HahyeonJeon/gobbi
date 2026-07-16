---
name: wrap-up-prep-skill-fallback-escalate
description: "E8 (deferred): when a Preparation-generated skill's durable destination is missing at Wrap-up, ESCALATE (NEEDS_CONTEXT) rather than silently re-copying it — a missing destination means the Preparation→Wrap-up transition contract failed and a planning/execution step may have run without its required skill."
type: backlogs
scope: project
feature: null
status: open
priority: medium
project-scope: true
created: 2026-07-16
session: e5c0af1d-005d-4455-a58f-efe601ed342f
tags: [wrap-up, process]
keywords: [e8, preparation-skill, fallback, escalate, transition-contract, silent-repair]
author: claude
---

# E8 — Preparation-skill fallback should escalate, not silently repair (deferred)

**Deferred from the 2026-07-16 wrap-up redesign** (design § Design H).

**What**: the routing table says Preparation-generated skills are manifest-only (promoted before Planning), but Wrap-up re-promotes them if the destination is missing. A missing destination means the Preparation transition failed; silently repairing it at Wrap-up hides that a Planning/Execution step may have run without its required skill. E8 = verify the narrow exception and escalate `NEEDS_CONTEXT` on absence/mismatch instead of replaying it.

**Why deferred**: changes the Preparation↔Wrap-up recovery contract.

**Blast radius**: `wrap-up/{promotion,scenario,checklist,evaluation}.md`, `preparation/SKILL.md`, `orchestration/workflow/preparation.md`. Related: `[[wrap-up-skill-redesign]]`.
