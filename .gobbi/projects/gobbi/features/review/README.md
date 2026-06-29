---
name: README
description: Review feature — the coding code-review playbook plus the gobbi adversarial-review charter and its harness baselines
type: features
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [code-review, coding-skill, taxonomy, procedure, review-playbook, workflow]
author: claude
---

# Feature: review

## What

The `review` feature covers gobbi's review capability across two surfaces:

1. **Coding code-review playbook** — author and maintain `skills/coding/review.md`, a standalone code-review playbook for the gobbi coding skill (a child of `coding/SKILL.md`, sibling of `coding/evaluation.md`).
2. **Adversarial-review charter** — `plans/workflow/2026-06-29-adversarial-review-charter.md`, an executable spec for a deep dual-system review of gobbi's whole system surface (agents + skills + plugin), with seven dimensions, seven lifecycle scenarios, a by-dimension methodology, and four external-harness reference baselines.

## Scope

- **Shipped:** `skills/coding/review.md` (516 lines) — 13-point taxonomy + Phase 0–5 procedure
- **Shipped:** `plans/workflow/2026-06-29-adversarial-review-charter.md` — the adversarial-review charter (review-only; deep review deferred to a future session)
- **Deferred (wiring):** Load Directives entry, runtime mirror sync, formal EVALUATION-phase integration, reverse back-links from existing coding docs
- **Deferred (review):** run the deep adversarial review per the charter; fix the confirmed seed findings (see backlogs)

## Sessions

| Session | Task | Outcome |
|---------|------|---------|
| 2026-06-27-d45128ad-6a6c-4bb7-9925-343cd3b826c8 | Author skills/coding/review.md | PASS — 2 commits shipped |
| 2026-06-29-40b9a93e-5ec4-43d7-bd16-075b0c7fa303 | Author the gobbi adversarial-review charter (review-only, dual-system) | PASS — charter + 4 refs + 3 backlogs + 3 mistakes promoted |

## Related

- `backlogs/docs/wire-review-doc-into-workflow.md` — deferred wiring work
- `features/review/plans/workflow/2026-06-29-adversarial-review-charter.md` — the adversarial-review charter
- `features/review/backlogs/evaluation/run-deep-adversarial-review.md` — the next-session deep review
- `features/review/references/memory/` — external-harness comparison baselines
- `features/review/decisions/` — design decisions
- `features/review/design/` — design documents
