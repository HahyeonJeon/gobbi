---
name: README
description: Code-review feature — the standalone code-review playbook for the coding skill, covering the 13-point review taxonomy and Phase 0–5 review procedure
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

Author and maintain `skills/coding/review.md` — a standalone, comprehensive code-review playbook for the gobbi coding skill. The doc is a child of `coding/SKILL.md` and a sibling of `coding/evaluation.md`.

## Scope

- **Shipped:** `skills/coding/review.md` (516 lines) — 13-point taxonomy + Phase 0–5 procedure
- **Deferred (wiring):** Load Directives entry, runtime mirror sync, formal EVALUATION-phase integration, reverse back-links from existing coding docs

## Sessions

| Session | Task | Outcome |
|---------|------|---------|
| 2026-06-27-d45128ad-6a6c-4bb7-9925-343cd3b826c8 | Author skills/coding/review.md | PASS — 2 commits shipped |

## Related

- `backlogs/docs/wire-review-doc-into-workflow.md` — deferred wiring work
- `features/review/decisions/` — design decisions
- `features/review/design/` — design documents
