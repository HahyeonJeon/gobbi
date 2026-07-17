---
type: mistakes
skill: discussion
description: "Recorded traps for discussion — load before doing discussion work"
updated: 2026-07-16
---

# Discussion — Mistakes

> Load before any work in this skill. Each `## ` section is one active trap; `## Archived` holds superseded ones.
## auto-mode-research-overgated

`priority: high` · `domain: process` · `added: 2026-07-11` · `status: active` · `tags: [process, assumption]`

**What happened** — The manager treated a contract-preserving implementation inference as a user decision.
**Why it happens** — It confused research confirmation with authority classification.
**How to detect** — An Auto-mode question asks the user to approve a technical inference that stays inside already accepted scope and trade-offs.
**Correct approach** — Auto-resolve the inference, record its evidence, and continue unless it changes user-owned authority.

## Discussion SOP Became Policy Schema

`priority: high` · `domain: process` · `added: 2026-07-16` · `status: active` · `tags: [process, design]`

**What happened** — The discussion redesign split the skill into policy and runtime-adapter child documents and added `class`, `header`, and `resume_action` fields that did not help an agent discuss work with a user.
**Why it happens** — The design optimized for classification and auditability, treating discussion as a runtime data model instead of a human interaction procedure.
**How to detect** — A discussion redesign introduces enums, adapters, logging schemas, or metadata that do not clarify the discussion point or explain why user input is needed.
**Correct approach** — Design the discussion internally, then ask one point at a time with `Discussion point`, `Why discussion is needed`, and meaningful options. Leave runtime transport and workflow recording to their owning mechanisms.
