---
name: claude-md-agents-md-6step-reconcile
description: Reconcile CLAUDE.md and AGENTS.md top-blocks from 5-step to 6-step machine with RECORD/memorization split
type: design
scope: feature
feature: workflow
status: retired
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [design]
keywords: [claude-md, agents-md, 6-step, vocabulary]
author: claude
supersedes: null
superseded_by: null
related: [vocabulary-rename-record-memory-split, wrap-up-5-stage-pipeline]
archived_at: 2026-07-20
archive_reason: retired
---

# CLAUDE.md + AGENTS.md top-block reconcile to 6-step machine (D-f)

> **Superseded 2026-07-19:** v0.5.3 replaced this six-step target with Configuration → Ideation → Planning → Execution → Wrap-up. Preparation-specific instructions below are historical evidence and must not be applied to current entry documents.

## Problem
`.claude/CLAUDE.md:9-21` describes a 5-step "Ideation → Planning → Execution → Memorization → Handoff" pipeline. This predates the 6-step machine (Configuration + Ideation + Preparation + Planning + Execution + Wrap-up). "Memorization" and "Handoff" appear as separate final steps instead of as stages inside the Wrap-up pipeline. CLAUDE.md is the most-read entry document and currently the most stale.

## Scope
In: update `.claude/CLAUDE.md:9-21` + `.codex/AGENTS.md` (the real file; top-level `AGENTS.md` symlinks it). Out: the Principle-6 "Documents are the team's memory" framing — keep as-is.

## Approach
- Name all 6 steps (Configuration + Ideation + Preparation + Planning + Execution + Wrap-up).
- Replace "Memorization" (step) with "RECORD sub-phase" (per-loop sub-phase inside each loop).
- Replace "Handoff" (step) with a description of Wrap-up's stages, including memorization (promotion stage) and handoff as stage 4.
- Point the top-block at the Glossary (`gobbi/SKILL.md:114-121`) as the single source for loop/sub-phase/stage vocabulary — avoids a second drift point.
- One edit covers both `AGENTS.md` and `.codex/AGENTS.md` (former symlinks the latter).

## Scenarios
- After reconcile: the top-block names all 6 steps; no "5 productive steps" or "Memorization → Handoff" residue; `.codex/AGENTS.md` mirrors it.

## Validation
Post-sweep check: exhaustive-vocabulary grep in `CLAUDE.md` + `AGENTS.md` → no old-vocabulary survivors; the Glossary is cited as the enum source.

## Trade-offs
Minimal: the update is small (one top-block section); the Glossary pointer avoids re-stating the full enum in CLAUDE.md, reducing future drift.

## Open issues
None. D-f was an uncontested auto-decide.
