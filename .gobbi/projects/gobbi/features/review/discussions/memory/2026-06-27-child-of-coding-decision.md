---
name: child-of-coding-decision
description: Where does review.md live in the skill tree? User chose skills/coding/review.md as a child of the coding skill
type: discussions
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [ideation, design]
keywords: [placement, skill-tree, coding-child, top-level, evaluation-child]
author: claude
outcome: review.md placed at skills/coding/review.md as a child doc of the coding skill
---

# Discussion: where does the code-review playbook live in the skill tree?

## Context

The user requested a code-review best-practice doc. During the Ideation DISCUSSION sub-phase, the manager identified a placement question: the doc could live at (a) `skills/coding/review.md` as a child of the `coding` skill, or (b) at `skills/review.md` as a top-level skill, or (c) at `skills/evaluation/review.md` as a child of the evaluation skill.

## Question

Where should the code-review playbook live in the gobbi skill tree?

## Options

| Option | Path | Rationale |
|---|---|---|
| A | `skills/coding/review.md` | Child of the coding skill — the source principles live in `coding/SKILL.md`; `review.md` traces each point to those principle numbers; natural sibling of `coding/evaluation.md` |
| B | `skills/review.md` | Top-level skill — if code review is general enough to apply outside the coding domain |
| C | `skills/evaluation/review.md` | Child of evaluation — if the playbook is primarily a gobbi EVALUATION sub-phase doc |

## User decision

**Option A — `skills/coding/review.md`** — confirmed by user (direct discussion). The doc is a child of the coding skill because:
- It traces its review points to `coding/SKILL.md` principle numbers.
- It is a natural sibling of `coding/evaluation.md` — both are derivatives of the 16 coding principles.
- The coding skill directory is the right home for both the author-side (`SKILL.md`) and the reviewer-side (`review.md`) docs.

## Implication

- Execution target: author `skills/coding/review.md` (a NEW file; `skills/coding/` dir already exists).
- The `skills/coding/` dir now has: `SKILL.md` (write-side), `evaluation.md` (evaluator frame), `review.md` (reviewer playbook).
- Per-language idiom children (e.g., `skills/coding/python.md`, `skills/coding/typescript.md`) are a natural future extension; they are NOT part of this session's scope.
- The doc is project-level (not `features/`-scoped).
