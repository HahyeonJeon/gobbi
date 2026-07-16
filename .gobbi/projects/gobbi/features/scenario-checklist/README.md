---
name: README
description: Two sibling SOP skills — `scenario` and `checklist` — that are the shared basis of design AND evaluation authoring across the gobbi workflow.
type: features
scope: feature
feature: scenario-checklist
status: active
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: []
keywords: [scenario, checklist, sop-skills, taxonomy, evaluation-basis]
author: claude
value_proposition: One authoring reference for "what makes a good scenario set" and "what makes a good checklist" — a full 10-category × 8-case-type taxonomy plus an author-declared primary-category discipline — so any skill or workflow-loop bundle that needs scenarios or checklists has a single, non-duplicated SOP to build against.
subsystems: [skills/scenario, skills/checklist]
---

# Feature: scenario-checklist

## Overview

Two new standalone SOP skills, `scenario/SKILL.md` and `checklist/SKILL.md`, formalize how to author a
good scenario set (Good / Bad / Adversarial coverage across a 10-category taxonomy) and a good
checklist (per-item resolution with an evidence-before-acceptance floor). They are a one-way, acyclic
pair — `checklist` may read a `scenario` set; `scenario` never reads or constructs checks — intended as
the shared basis of design AND evaluation authoring project-wide.

## Status

**Session `59694f66` (2026-07-16):** both skills shipped. Ideation ran 5 dual-system iterations plus one
bounded finalization pass (2 mechanical residuals — a symlink-gate leg and a duplicate token-scoping
encoding — fixed and tool-verified rather than spending a 6th iteration) to lock the design. Preparation
and Planning each PASSed in 1 iteration. Execution authored `scenario/SKILL.md` first, then
`checklist/SKILL.md`, both dual-system (Claude + Codex), each with multiple REVISE rounds; a third task
closed two P10 cold-load-proof gaps found by a fresh-agent read of each skill in isolation. 4 commits:
`73964df5` (scenario), `8c92b5da` (checklist), `6d3a055b` (cold-load gaps), `0cb8f9f2` (wiring fixes).
Per the locked Scope Contract (Option A), the two skills are a discoverable authoring reference only
this session — no phase reader loads them yet; see the open item below.

## Subdirectories

- `decisions/` — 3 files: the 4 locked Ideation forks, the author-declared-primary-category resolution,
  and the finalization-pass decision
- `backlogs/` — 1 file: the deferred per-phase wiring + conformance sweep

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-07-16 | `59694f66-422a-4fd5-b93b-625c2f354fc3` | Both SOP skills designed (5 iter + finalization) and shipped (4 commits); wiring deferred |

## Open items

- Per-phase pointer wiring + conformance sweep of the 6 existing `scenario.md`/`checklist.md` bundles —
  see `[[wire-scenario-checklist-into-workflow]]`
- A possible `templates/` child doc or P3(b) lookup child, if a `SKILL.md` exceeds the length norm once
  the inline catalogs are in place — flagged, not yet needed; touches the locked "no child docs" scope
  and needs a fresh user decision before adding either
- `check-eval-childdocs.sh --self-test` fixture drift found during this session's wrap-up is unrelated to
  this feature and tracked separately (`backlogs/tooling/eval-childdocs-selftest-fixture-drift.md`,
  project tier)

## Related

- [[four-ideation-forks]] — the Scope Contract this feature's Ideation locked
