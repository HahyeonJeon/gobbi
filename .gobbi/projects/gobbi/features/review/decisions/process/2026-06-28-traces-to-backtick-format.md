---
name: traces-to-backtick-format
description: Four traces-to anchors strip inline-code backticks from Ideation checklist items; exact-match verifiers would report false dangling traces
type: decisions
scope: feature
feature: review
status: proposed
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [traces-to, backtick-formatting, exact-match, checklist-anchors, codex-finding, consistency]
author: codex
supersedes: null
---

## Context

The Planning draft's `traces-to` anchors are meant to map 1:1 to the Ideation Implementation Checklist items. The Codex evaluator (codex-planning-consistency-001, Low/100, checklist_gap/process) found that four anchors dropped inline-code backtick formatting that the Ideation source carries:

- Item 3: `coding/SKILL.md` in the Ideation source → `coding/SKILL.md` without backticks in the plan
- Item 5: `SKILL.md`, `evaluation.md`, `evaluation/SKILL.md`, `/code-review`, `evaluation.md`, `review.md` in the Ideation source → without backticks in the plan
- Item 6: `review.md`, `evaluation.md`, `SKILL.md` in the Ideation source → without backticks in the plan
- Item 14: `coding/SKILL.md` in the Ideation source → without backticks in the plan

All 14 anchors are semantically real and all 14 Ideation checklist items are covered. The gap is cosmetic formatting only.

## Decision

Accept the current format for the submitted plan (iter 1 is PASS). Record the formatting preference for future Planning loops: `traces-to` anchors should copy the checklist string verbatim, including inline-code backtick markers, so that strict automated trace verifiers do not report false dangling traces.

Alternatively: define a normalizing trace check that explicitly ignores Markdown inline-code formatting. Either approach eliminates the ambiguity.

## Rationale

This is Low/100 — high confidence but low impact. The semantic coverage is complete; the formatting difference has no effect on the current Planning PASS. Documenting it here ensures future Planning loops or a trace-verifier tooling feature knows to match verbatim including Markdown formatting.

## Alternatives considered

- Correct the 4 anchors in iter 1 before PASS. Rejected: the plan already passed evaluation; re-editing for cosmetic formatting would be unnecessary churn.
- Leave undocumented. Rejected: a future automated trace check could false-positive on these and block a valid plan.

## Consequences

Future Planning loops should copy `traces-to` anchor strings verbatim from the Ideation checklist, including inline-code backtick markers. If a trace verifier is built, its normalization logic should handle Markdown inline-code formatting to avoid false dangling-trace reports.
