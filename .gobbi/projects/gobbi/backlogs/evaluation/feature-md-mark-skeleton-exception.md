---
name: feature-md-mark-skeleton-exception
description: feature.md deviates from the standard 4-section template skeleton (it documents a directory, not one item); mark it the allowed structural exception so future evaluators stop re-flagging it.
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-06-19
session: 8bdd12ad-9d28-4293-a38f-881db184c465
tags: [memory, docs-sync, evaluation]
keywords: [feature-md, skeleton-exception, template, evaluator-flag]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Mark feature.md as the allowed skeleton exception

## Context

The memory-template redesign standardized 17 templates to one 4-section skeleton
(`Core principle` / `Write it` / `Frontmatter + body` / `Notes`). `feature.md` is an
intentional structural outlier: it documents a feature **directory** (an identity doc
for a `features/{slug}/` tier), not a single memory item, so it does not — and should
not — follow the per-item skeleton. The Codex eval flagged this deviation as an
inconsistency.

## Why deferred

The deviation is correct, not a defect — but it is undocumented, so a future evaluator
will re-flag it every pass. The fix is a one-line annotation, not a structural change;
it was scoped out of the redesign's locked task list to avoid touching the
already-ratified skeleton work, and held as a small follow-up.

## When to pick up

No prerequisites — can run any time. Naturally folds into the next session that
touches `memory/templates/feature.md` or the `memory/SKILL.md` Authoring style guide.

## Suggested approach

Add one explicit line — in `feature.md` itself or in the `memory/SKILL.md`
`## Authoring style` guide — stating that `feature.md` (and `archive.md`) are the
sanctioned skeleton exceptions because they document a directory / destination rather
than a single item. That gives future evaluators an in-doc answer so they stop
re-flagging it.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-19-8bdd12ad-9d28-4293-a38f-881db184c465/`

## Related

- [[2026-06-19-memory-template-redesign]] — the session that produced this deferral.
