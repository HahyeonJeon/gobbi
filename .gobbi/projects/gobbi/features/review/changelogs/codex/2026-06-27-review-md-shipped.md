---
name: review-md-shipped
description: skills/coding/review.md authored and committed — 516-line reviewer's playbook with 13-point taxonomy and Phase 0–5 procedure
type: changelogs
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [docs-sync, codex]
keywords: [review-playbook, code-review, dual-production, schema-fix]
author: claude
shipped_in: de5b1e99
---

# skills/coding/review.md shipped

**Task:** task-01-author-review-md — Author the code-review child doc for the coding skill

## Summary

`skills/coding/review.md` is a new 516-line code-review playbook. It is a sibling of `coding/SKILL.md` — where the skill states what good code is, this doc states what a reviewer looks for and how to conduct a review. It is usable standalone (human or agent reviewer, preflight self-review), or as the substance behind the `/code-review` built-in command. The doc completed dual-system production (Claude + Codex proposer) and required one REVISE iteration after the Codex evaluator caught a High/100 schema violation the Claude evaluator missed.

## What changed

- **Created:** `skills/coding/review.md` (516 lines, no YAML frontmatter, consistent with `coding/SKILL.md` sibling voice)
  - Relationship section: 4-doc boundary table + why-not-redundancy + authoritative-source rule + one-way citation + deferred-wiring note
  - Review Outcomes: PASS / REVISE / FAIL with pointer to Phase 5 for exact thresholds
  - 13-point taxonomy: broadest first, each with Check / Why / property-led Signals table (Python + TypeScript as illustrations) / Finding mapping / False positive to avoid. Points 3 and 6 each split into two first-class sub-checks
  - Central craft-findings rule at line 54: `Type general` + `Domain general` = contract violation; correct routing for craft findings
  - Phase 0–5 review procedure
  - Gobbi Integration mapping (13 rows) + deferred-wiring note + forward-invariants contract
  - Scope: language-agnostic; third-language paragraph
  - Scenarios A1–A6 with lead-points and expected outcomes
  - Validation Method: reviewer self-check on a completed review
  - Sources: 4 internal + 10 external

## Verification

- Dual-system evaluation iter2: Claude PASS / Codex PASS (all 7 perspectives + Overall)
- `grep` for forbidden `Type=general`+`Domain=general` combo → 0 hits
- 13 points grep; 14 signal tables; 0 language-siloed headings; UPPERCASE verdicts only; no `blocking` field
- `git show --stat de5b1e99` = one file only

## Deferred

- Load Directives entry for `coding/review.md` in orchestration prompts — deferred to coding-wiring campaign
- Runtime mirror sync (`.claude/`, `.codex/`, `plugins/gobbi/`) — deferred
- Formal EVALUATION-phase integration (automatic use in gobbi eval loop) — deferred
- Reverse back-links from `coding/evaluation.md` and `coding/SKILL.md` — deferred
- Language-specific sub-skills (`python`, `typescript`) that provide concrete idiom columns — deferred
