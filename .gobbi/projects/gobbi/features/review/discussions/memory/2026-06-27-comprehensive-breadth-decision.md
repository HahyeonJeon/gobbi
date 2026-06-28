---
name: comprehensive-breadth-decision
description: How broad should review.md be? User chose COMPREHENSIVE — all 13 dimensions as first-class deep points, not just the 8 user seeds
type: discussions
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [ideation, design]
keywords: [breadth, comprehensive, focused, 13-points, 8-seeds, overlap-accepted]
author: claude
outcome: COMPREHENSIVE full-depth playbook chosen
---

# Discussion: how broad should `review.md` be — focused or comprehensive?

## Context

The user requested a code-review best-practice child doc (`skills/coding/review.md`) and provided 8 seed points. During the Ideation DISCUSSION sub-phase, the manager raised the breadth question: should `review.md` cover only the 8 user seeds (focused), or cover ALL review dimensions as first-class deep points (comprehensive)?

This was flagged as Always-Ask — a direction-setting question that requires user decision. The manager relayed it through the active runtime.

## Question

Should `review.md` cover:

**Option A — Focused (8 seeds only)**: a lean doc covering exactly the 8 seed concerns, each in depth. Simpler, faster to author, less overlap with `evaluation.md`.

**Option B — Comprehensive (all dimensions)**: a full-depth playbook covering all review dimensions as first-class points — correctness/requirement-fit, public API, naming, necessity/simplicity, architecture, file/dir/imports, data-flow/state, error-handling/trust-boundaries, tests, performance, comments/docstrings, consistency/blast-radius, and review-communication. The 8 seeds are first-class within this broader set, each with depth parity. More overlap with `evaluation.md` (user-accepted).

## Options

| Option | Scope | Overlap with eval.md | Authoring cost |
|---|---|---|---|
| A — Focused | 8 seeds only | Minimal | Lower |
| B — Comprehensive | 13 dimensions (seeds first-class within) | More (accepted) | Higher |

## User decision

**COMPREHENSIVE (Option B)** — confirmed by user via manager relay (Always-Ask). The user explicitly chose the full-depth playbook with all dimensions as first-class deep points.

The overlap with `evaluation.md` is accepted. The boundary is managed via the framing/organization distinction + the authoritative-source rule.

## Implication

- The taxonomy is 13 points (not 8), with seeds embedded as first-class points within the broader set.
- Points #3 (naming) and #6 (file/dir/imports) each carry two seeds — these were split into sub-points (3a/3b and 6a/6b) to preserve depth parity for each seed.
- The design doc, taxonomy, and Implementation Checklist all reflect this choice.
- The overlap cost (two docs with shared coverage, no automated drift-detection) is accepted.
