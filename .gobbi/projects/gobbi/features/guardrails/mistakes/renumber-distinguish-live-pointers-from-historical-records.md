---
name: renumber-distinguish-live-pointers-from-historical-records
description: Before a principle/section renumber sweep, separate LIVE pointers (instruction docs that cite the item as current guidance) from HISTORICAL records (point-in-time notes/decisions/plans). Renumber the former; never rewrite the latter.
type: mistakes
scope: feature
feature: guardrails
status: active
created: 2026-06-05
session: 9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10
tags: [docs-sync, renumber, blast-radius, historical-records]
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
---

# A renumber sweep must distinguish live pointers from historical records

## What happened

When merging two principles (P5+P9 into new P3, renumbering 14 toward 13), the manager framed a "full renumber" option as re-pointing ALL ~64 "Principle N" references repo-wide, including project memory (`mistakes/`, `decisions/`, `notes/`, `plans/`, old design docs). Only after quantifying did it surface that roughly half those references live in HISTORICAL point-in-time records — e.g., a note "added the 13th principle body", a decision "reconcile principle count 12 to 13", a plan "conform all 14". Blanket-renumbering those would have made the historical record FALSE. The manager caught it before executing and re-scoped with the user to `principles/SKILL.md` only (external live sweep deferred).

## Why it happens

"Re-point every reference for consistency" treats all references as live pointers to a current entity. But a reference inside a dated note/decision/plan is a record of what was true then, not a pointer to be kept current. The renumber's true blast radius was conflated with its correct blast radius.

## Correct approach

Before a renumber sweep, partition the references into (1) LIVE pointers — the canonical source + instruction docs (skills, agents, CLAUDE.md/AGENTS.md) that cite the entity as current behavioral guidance — and (2) HISTORICAL records — dated/point-in-time memory that describes a past state. Renumber only (1). Leave (2) at its as-of-then values (the concept, not the number, is what a future reader maps). Surface this partition to the user as the scope, with counts, before executing. Also: quantify BEFORE committing to a "full" option — a renumber's reference count is often an order of magnitude larger than expected and changes the right approach.

## How to detect

Any renumber or rename of a numbered or named entity (principles, steps, procedures, schema versions) that is referenced across the repo. The moment the grep hits files under `mistakes/`, `decisions/`, `notes/`, `plans/`, `archive/`, or dated design docs — pause and partition before proceeding.
