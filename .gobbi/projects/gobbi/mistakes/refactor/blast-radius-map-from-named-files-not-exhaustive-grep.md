---
name: blast-radius-map-from-named-files-not-exhaustive-grep
description: A blast-radius / co-touch edit-site map must be built from an exhaustive form-covering grep across all surfaces, not by reading the files a brief named.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-06
session: 0d898156-8d5b-4142-9b93-308d3b692995
tags: [refactor, process, docs-sync]
keywords: [enumeration, blast-radius, co-touch]
author: claude
priority: high
domain: process
---

# Blast-radius map built from named files, not an exhaustive grep

## What happened
During Point-1 investigation, the leader built the §1.1 change-set / blast-radius map by reading the three files the manager's brief named (`chat-mode.md`, `settings.chat.json`, `SKILL.md`) and reported that as the complete edit-site set. A later exhaustive grep found 6+ additional "default 5" sites (five `workflow/*.md` sub-docs + `record.md`) plus the `state.template.json` propagation gap that the named-file read missed. The leader self-caught it after reading the project enumeration traps.

## Why it happens
It treated the brief's named files as the full surface. A brief names entry points, not the complete blast radius. Enumeration built by reading a handful of named files silently under-counts co-touch sites and semantic-equivalent restatements of the same rule.

## Correct approach
Build every blast-radius / co-touch map from an exhaustive, form-covering grep across ALL surfaces (skills, `workflow/` sub-docs, templates, scripts, the three mirror trees), then manually classify each hit. Never treat the brief's named files as the complete set. Recurrence class of [[enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete]] + [[cotouch-enumeration-must-cover-semantic-equivalents]] + [[sweep-grep-literal-loop-name-blindspot]].

## How to detect
Any task that must enumerate a change's blast radius / co-touch set / every restatement of a rule — rename, count change, cap change, term change, doc-sync. If the enumeration was produced by reading named files rather than a repo-wide form-covering grep + manual classification, it is incomplete.

## Related
- [[enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete]] — same recurrence class: enumerate every restatement before claiming a map complete
- [[cotouch-enumeration-must-cover-semantic-equivalents]] — co-touch enumeration must cover semantically-equivalent restatements, not one phrasing
- [[sweep-grep-literal-loop-name-blindspot]] — a form-specific grep misses other-form occurrences
