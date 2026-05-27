---
name: evaluation
description: Dual-system review (Claude + Codex) across 7 perspectives, gating each deliverable before acceptance.
type: features
scope: feature
feature: evaluation
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [evaluation, codex, dual-system, review]
value_proposition: "Dual-system review (Claude + Codex) across 7 perspectives, gating each deliverable before acceptance."
---

# Feature: Evaluation

Dual-system review (Claude + Codex) across 7 perspectives, gating each deliverable before acceptance. This is value-feature #4 of the 7 capability features defined in the memory-system redesign.

## Overview

`evaluation` is gobbi's review subsystem: a 4-stage procedure run by two independent systems (Claude + Codex) across 7 perspectives plus Overall, with finding metadata and cross-system reconciliation, gating each deliverable before it is accepted.

## Status

Active. The dual-system evaluation procedure, the 7-perspective set, the 5-Type finding vocabulary, and the codex-invocation conventions are shipped and in use. The feature directory was created during the memory-system redesign (W3-T0) and the codex / dual-system-evaluation artifacts from the Bundle A and Bundle B sprints have been re-homed here.

## Subsystems

- `evaluation` (4-stage procedure, 7 perspectives + Overall, finding metadata, cross-system reconciliation) + per-loop `evaluation.md` child docs
- `codex` (the Codex-invocation half + the cross-model differentiator)

## Subdirectories

- `decisions/` — evaluation design decisions
- `design/` — evaluation-scope design topics
- `discussions/` — substantive AskUserQuestion topics scoped to evaluation
- `references/` — external prior art touching evaluation
- `plans/` — plan artifacts produced by the Planning loop
- `changelogs/` — what shipped per task
- `archive/` — superseded evaluation artifacts (move-on-terminal)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-05-26 | a10c82d6 | Feature dir created during memory-redesign W3-T0 |

## Open items

No open deferred items tracked at the feature level. Residual non-blocking evaluation findings carried forward from earlier loops are recorded in the feature's `discussions/` (see [`discussions/eval-pass-loop-closed.md`](discussions/eval-pass-loop-closed.md)).

## Related

- Memory-system redesign design doc — 7-feature table and sprint → value-feature routing heuristics
