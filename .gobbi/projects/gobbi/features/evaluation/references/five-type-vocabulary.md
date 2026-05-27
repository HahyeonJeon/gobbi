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

# 5-Type Finding Vocabulary

## Insight

Evaluation findings are classified into exactly five types, and that closed vocabulary is what every evaluation-staging file's frontmatter must use verbatim:

```
scenario_gap      — A scenario exists in project memory but no checklist item or task covers it.
checklist_gap     — A checklist item exists but no task implements or verifies it.
design_flaw       — A structural or design problem in the artifact under evaluation.
assumption_risk   — An assumption in the artifact that may not hold at execution time.
general           — A finding that does not fit the four above categories.
```

The split that matters operationally is mechanical-class vs judgment-required:

- **Mechanical-class** (auto-backfill via Step 2.5): `scenario_gap`, `checklist_gap`, `general`.
- **Judgment-required** (trigger NEEDS_CONTEXT): `design_flaw`, `assumption_risk`.

## Related

- [`design/naming-convention-enforcement.md`](../design/naming-convention-enforcement.md) — the Coverage Ownership Matrix row that has the Consistency + Aesthetics perspectives verify this 5-Type vocabulary appears correctly in staging frontmatter.
- [`decisions/coverage-ownership-matrix-row-text.md`](../decisions/coverage-ownership-matrix-row-text.md) — fixes the matrix-cell wording that cites this vocabulary.

## Why it applies

Any Execution task that authors evaluation skill content, or any agent that stages an evaluation finding, must use these exact type strings — an invented or misspelled type breaks the mechanical-vs-judgment routing and the staging-shape checks. Invoke this reference whenever writing or reviewing finding frontmatter.

## Source

- `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md` — § the 5-Type vocabulary (the verbatim block above) and § Slug + collision policy (the staging-filename rules).

## Excerpt

The verbatim 5-Type block is reproduced under Insight above; it is captured from the canonical `evaluation/SKILL.md` 5-Type vocabulary section.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 2026-05-23-7ea62d36 | Authoring the Coverage Ownership Matrix row and evaluation skill content during Bundle A |

> Authoring note: tasks that reference these types MUST `Read` the canonical `evaluation/SKILL.md` source before writing — not reconstruct from this reference or from a briefing alone (Iron Law 7; see [`mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`](../../../mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md)).
