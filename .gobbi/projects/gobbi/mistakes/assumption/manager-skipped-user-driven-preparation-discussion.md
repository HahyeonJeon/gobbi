---
name: manager-skipped-user-driven-preparation-discussion
description: Manager auto-dispositioned material readiness gaps without surfacing them to the user; Planning's readiness gate requires user decisions for material gaps even in Auto mode.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [auto-mode, preparation, discuss-mode, user-driven, gap-disposition]
author: claude
priority: high
domain: process
---

# Manager Skipped User Decisions for Readiness Gaps

## What happened

The manager ran Preparation iter1 and iter2 in Auto mode and auto-dispositioned all readiness gaps (FLAG-2 skip, principle-trace defer, REVISE-threshold defer, etc.) without surfacing them to the user. The iter1 and iter2 drafts labeled those dispositions "manager-auto-dispositioned, pending Wrap-up review" and stated that "no user-facing gap-resolution decision is strictly required" in Auto mode.

The dual-system Codex evaluator held a High/100 finding (`codex-prep-project-001`, `codex-prep-risk-001`, `codex-prep-usage-001`, `codex-prep-consistency-001`) OPEN across iter1 and iter2 because `preparation/SKILL.md:115` requires "every identified gap has a user-locked resolution." Claude's evaluator wrongly called this addressed in iter2. The cross-system divergence was the correct signal: Codex was right.

## Why it happens

The historical manager confused Auto mode's general auto-decide authority with authority to bind unresolved readiness gaps. In the current v0.5.3 contract, Planning DISCUSSION is agent-driven, but that does not turn material readiness gaps into auto-decisions. The readiness gate may auto-advance only on a clean scan. Material gaps, external-write go/no-go choices, and scope-affecting dispositions remain user decision points under the discussion skill.

## How to detect

Before auto-deciding a readiness disposition, inspect `2-planning/working/readiness-gate-iter{n}.md`. If the scan contains any material gap, missing authority, external-write go/no-go choice, or change to locked scope, stop and surface the decision to the user. The clean-scan auto-advance rule is not permission to auto-disposition a non-clean scan.

## Correct approach

Planning starts DISCUSSION by completing the readiness inventory defined in `planning/SKILL.md`. A clean scan records `READY` and auto-advances. For each material gap, the manager presents the evidence and recommended route, waits for the user decision, and records that decision in the readiness artifact. An upstream Ideation omission is never accepted or repaired in Planning; it routes to re-Ideation or abort. Missing workspace/domain context returns `NEEDS_CONTEXT`. Only a user-resolved scan may become `READY`.

## Related

- [`planning/SKILL.md`](../../skills/planning/SKILL.md) — current readiness entry-gate owner
