---
name: coding-review-md-authored
description: Session journal — authored skills/coding/review.md, a comprehensive 516-line code-review playbook with 13-point taxonomy and Phase 0–5 procedure
type: notes
scope: project
feature: null
status: active
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [review-md, coding-skill, code-review, dual-system, taxonomy, procedure, workflow]
author: claude
---

# Session: Authored `skills/coding/review.md` (2026-06-27)

## What shipped

`skills/coding/review.md` — a new 516-line standalone code-review playbook for the gobbi `coding` skill. The doc is a sibling of `coding/SKILL.md` (write-side principles) and `coding/evaluation.md` (evaluator frame). Any reviewer, human or agent, can use it standalone or as the substance behind the `/code-review` command.

**Commits:** `b35a439a` (iter1), `de5b1e99` (iter2 schema fix)

## What the doc contains

- **Relationship/boundary section** — 3-layer model (`coding/SKILL.md` → `review.md` → `evaluation.md`), authoritative-source rule, one-way citation, deferred-wiring note
- **13-point taxonomy** — broadest first; each with Check/Why/property-led Signals table (Python+TypeScript columns)/Finding mapping/False positive. Points 3 and 6 each split into 3a/3b and 6a/6b for full seed depth-parity
- **Phase 0–5 procedure** — who-runs-review table, preflight, understand-change, build-frame, review broadest-first, write findings (canonical gobbi schema), verdict+handoff
- **Gobbi Integration mapping** — 13 rows, phrased as intent (wiring deferred)

## Key decisions in this session

- COMPREHENSIVE breadth (all 13 dimensions as first-class, not just the 8 user seeds)
- Language-general with property-led Python+TypeScript signal tables (no language-siloed sections)
- Authoritative-source rule: both docs trace to `coding/SKILL.md` principle numbers; `coding/SKILL.md` owns divergence resolution
- Wiring deferred: load directives, runtime mirrors, reverse back-links all tracked in `backlogs/docs/wire-review-doc-into-workflow.md`

## Key events

- Dual-system production + evaluation: Codex REVISE in iter1 (schema violation caught — `general`+`general` finding-mapping combo forbidden by `evaluation/SKILL.md`). Fixed in iter2. Both systems PASS.
- Preparation iter1+iter2: Auto-mode mistake — manager auto-dispositioned gaps without user. Corrected in iter3 after Codex correctly held High/100 open.

## Deferred / open

- CONSIST-2 (Low/50): authoritative-source rule has no drift-detection mechanism — accepted residual
- FLAG-2: `skills/claude/SKILL.md` dangling reference — backlogged
- Wire review.md into workflow — backlogged
