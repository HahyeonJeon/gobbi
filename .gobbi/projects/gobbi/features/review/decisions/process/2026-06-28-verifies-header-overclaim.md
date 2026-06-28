---
name: verifies-header-overclaim
description: The planning draft's verifies header claims (a)(b)(c)(d) coverage but (d)(ii) non-redundancy is not bound to any verify
type: decisions
scope: feature
feature: review
status: proposed
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [verifies-header, validation-coverage, planning-accuracy, docs-sync, F-CONSIST-1, F-PROJ-1]
author: claude
supersedes: null
---

## Context

The Planning draft (`3-planning/working/draft-iter1.md`) introduces V1–V13 with the header:

> "File-existence + the design's own validation methods (a)(b)(c)(d), expressed as atomic re-runnable checks."

The Ideation design specifies four validation methods: (a) taxonomy/property-table, (b) procedure shape, (c) voice/format/scope/sources, (d) boundary section. Method (d) has four sub-parts: (d)(i) relationship section, (d)(ii) non-redundancy check (headings not just 7 perspectives), (d)(iii) one-way citation, (d)(iv) no present-tense wiring claim.

V4 covers (d)(i)+(d)(iv). V11 covers (d)(iii). But **(d)(ii) — the non-redundancy check — is not bound to any verify**. The header's "(a)(b)(c)(d)" claim therefore over-states the actual coverage.

Claude evaluator flagged this as F-CONSIST-1 (consistency.md, Medium/75, checklist_gap/docs-sync) and F-PROJ-1 (project.md, Medium/75, checklist_gap/docs-sync). Both are views of the same root.

## Decision

Two options:

**Option A (recommended):** Inject the non-redundancy check as an evaluation-added verify in the Execution brief. The executor runs the heading comparison against `coding/evaluation.md` as a non-optional gate. The verifies header stays "(a)(b)(c)(d)" and is now accurate. This is captured in `3-planning/outputs/task-list.md` § Evaluation-added verify.

**Option B:** Correct the verifies header to "(a)(b)(c)+(d) parts i/iii/iv only" and record V5 as deemed-sufficient structural coverage for (d)(ii). This accepts the gap as a residual.

The manager chose Option A: inject the evaluation-added verify into the Execution brief.

## Rationale

V5 (all 13 theme-organized points present) provides strong structural evidence that review.md is organized by review property, not by 7-perspective name — it is structurally not a 7-perspective frame. But "structurally not" is not the same as the explicit heading-comparison check the design requires. A heading comparison is fast, concrete, and directly falsifiable. Injecting it as an evaluation-added verify is cheaper than discovering a B4 collapse post-Execution.

## Alternatives considered

- Accept the gap as a residual and rely on post-Execution EVALUATION to catch a B4 collapse. Rejected: the check is fast and the Ideation design named it as a hard requirement.
- Remove the "(d)" claim from the verifies header. Accepted as Option B but not chosen: the gap is better filled than acknowledged.

## Consequences

The Execution brief must include the evaluation-added verify verbatim (see `3-planning/outputs/task-list.md` § Evaluation-added verify). The executor treats the heading-comparison check as required, not optional.
