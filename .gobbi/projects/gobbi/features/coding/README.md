---
name: README
description: The coding code-review playbook — the memory behind skills/coding/review.md (taxonomy, procedure, references) and its design history
type: features
scope: feature
feature: coding
status: active
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: []
keywords: [code-review, coding-skill, review-playbook, taxonomy, procedure, references]
author: claude
value_proposition: A maintained, reference-grounded code-review playbook for the coding skill — the taxonomy, the review procedure, and the design decisions behind skills/coding/review.md, kept as durable feature memory.
subsystems: [skills/coding]
---

# Feature: coding

## Overview

The `coding` feature owns the durable memory behind gobbi's code-review playbook — `skills/coding/review.md`, a child of `coding/SKILL.md` and sibling of `coding/evaluation.md`. It holds the playbook's design decisions, its 13-point taxonomy and Phase 0–5 procedure design, the external code-review references it is grounded in (Google, PEP 8/257, Bloch, scikit-learn, TypeScript conventions, conventional-comments), and the discussions/checklists/scenario that shaped it.

## Status

The `review.md` playbook itself is shipped (PR #321) and lives under `skills/coding/` (not in this memory tree). This feature directory holds the playbook's design memory, which was re-homed here on 2026-06-29 from the dissolved `features/review/` — `review` was determined to be a non-canonical value-feature, and the review-playbook content is the coding skill's child, so it belongs to `features/coding/`. Deferred wiring (Load Directives entry, runtime mirror sync, formal EVALUATION-phase integration, reverse back-links) remains open.

## Subdirectories

- `decisions/` — 16 design decisions behind `review.md` (taxonomy, authoritative-source rule, finding-mapping schema, wording/threshold choices)
- `references/` — 11 external code-review references (Google code-review standards, PEP 8/257, Bloch API design, scikit-learn API consistency, TypeScript/conventional-comments)
- `design/` — 4 design docs (authoritative-source rule, 3-layer boundary, points taxonomy, procedure)
- `checklists/` — 3 process checklists (language-silo validation, non-redundancy gate, communication-principle trace)
- `discussions/` — 3 user-decision topics (child-of-coding, comprehensive-breadth, language-stance)
- `plans/` — 1 plan (author the coding `review.md`)
- `backlogs/` — 1 deferred item (authoritative-source no-drift)
- `changelogs/` — 1 entry (`review.md` shipped)
- `scenarios/` — 1 scenario (8-seed depth-parity risk)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-29 | 40b9a93e-5ec4-43d7-bd16-075b0c7fa303 | Re-homed the review.md code-review playbook memory here from the dissolved `features/review/` (41 typed files); feature created |
| 2026-06-27 | d45128ad-6a6c-4bb7-9925-343cd3b826c8 | Authored `skills/coding/review.md` (the playbook this memory documents) |

## Open items

- Deferred wiring of `review.md` into the workflow (Load Directives entry, runtime mirror sync, EVALUATION-phase integration, reverse back-links) — tracked in project backlogs.

## Related

- [[defeatureize-review-namespace]] — the migration note that re-homed this content
- [[review-md-procedure]] — the playbook procedure design
- [[review-md-points-taxonomy]] — the 13-point taxonomy design
