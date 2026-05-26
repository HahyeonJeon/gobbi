---
name: five-type-vocabulary
description: The 5-type finding vocabulary used in evaluation staging — verbatim capture from evaluation/SKILL.md.
type: references
scope: feature
feature: evaluation
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [evaluation, finding-types, vocabulary, staging]
title: "5-Type Finding Vocabulary"
source: /playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md
accessed: 2026-05-23
ref_type: internal
---

# 5-Type Finding Vocabulary (canonical source: evaluation/SKILL.md:344-352)

This reference captures the verbatim 5-Type vocabulary that Execution tasks must use when authoring evaluation skill content.

## The 5 Types

```
scenario_gap      — A scenario exists in project memory but no checklist item or task covers it.
checklist_gap     — A checklist item exists but no task implements or verifies it.
design_flaw       — A structural or design problem in the artifact under evaluation.
assumption_risk   — An assumption in the artifact that may not hold at execution time.
general           — A finding that does not fit the four above categories.
```

## Classification

- **Mechanical-class** (auto-backfill via Step 2.5): `scenario_gap`, `checklist_gap`, `general`
- **Judgment-required** (trigger NEEDS_CONTEXT): `design_flaw`, `assumption_risk`

## Canonical source path

`/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md` lines 344-352 (5-Type vocabulary) and lines 385-393 (Slug + collision policy).

## Usage note

Execution tasks that author content referencing these types MUST `Read` the canonical source file before writing — not reconstruct from this reference or from briefing alone (per Iron Law 7 and `mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`).
