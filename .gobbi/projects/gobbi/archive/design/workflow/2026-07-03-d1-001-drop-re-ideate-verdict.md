---
name: d1-001-drop-re-ideate-verdict
description: Collapse the RE-IDEATE evaluation verdict into the existing Preparation DISCUSSION model
type: design
scope: feature
feature: workflow
status: superseded
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process]
keywords: [re-ideate, verdict, preparation, discussion-model]
author: claude
superseded_by: d1-001-drop-re-ideate-verdict-shipped
archived_at: 2026-07-03
archive_reason: superseded
---

# GEN-D1-001 — RE-IDEATE is not a representable evaluation verdict

## Problem

`orchestration/workflow/preparation.md:117` frames `RE-IDEATE` as a "Special verdict" and
`orchestration/auto-mode.md:92,100` route on a row-5 `RE-IDEATE` verdict. But evaluation aggregation
emits only `PASS` / `REVISE` / `FAIL` (`evaluation.md:149-161`, `orchestration/SKILL.md:263-267`), and
neither `state.template.json` nor `session.template.json` carries a `RE-IDEATE` enum value. The
promised transition is not representable in the schema or the reader — the shared defect class this
whole feature addresses.

## Scope

In-scope: collapse `RE-IDEATE` to the existing DISCUSSION-resolution model; excise the 3
verdict-framing sites; wording-normalize the surviving uppercase `RE-IDEATE` tokens that could imply a
verdict. Out-of-scope: any FIX edit (this is design only); the alternative (b) below is documented,
not chosen.

## Approach

**Recommended (a)**: re-Ideate remains a Preparation DISCUSSION user decision — the dominant existing
model (~13 DISCUSSION-resolution sites vs. 3 verdict-framing sites). On `re-ideate`: the manager
records the decision in `2-preparation/working/discussion-log.md`, sets Ideation the only Active step,
leaves `workflow.preparation.iter` unchanged, re-enters Ideation; after Ideation PASS, Preparation
restarts from Sub-step A. No new verdict enum; no template edit.

**Alternative (b, not recommended)**: add a formal `RE-IDEATE` verdict to aggregation, RECORD, both
templates, resume, and mode docs — spreads a new enum across ~6 surfaces for what is fundamentally a
DISCUSSION decision, not an evaluation outcome.

**Affected canonical files (recommended a)**: `orchestration/workflow/preparation.md:117` (delete the
verdict row); `orchestration/auto-mode.md:92,100` (replace "RE-IDEATE verdict" with "user-confirmed
`re-ideate` decision"; remove the row-5 verdict route); `preparation/SKILL.md:15` (reword to a
DISCUSSION re-entry); wording-normalize uppercase `RE-IDEATE` at `preparation/SKILL.md:222,280,368`
and optionally `preparation/evaluation.md:261,270-273,297,304,319`. No template edit.

## Scenarios

- **Golden**: Preparation DISCUSSION, a gap is unworkable → user picks `re-ideate` → Preparation
  halts, re-enters Ideation, iter unchanged. No evaluator verdict is ever `RE-IDEATE`.

## Validation

- `git grep -nE 'RE-IDEATE.*verdict|verdict.*RE-IDEATE|Loop verdict.*RE-IDEATE' -- .gobbi/projects/gobbi/skills` → zero.
- `git grep -ni 'RE-IDEATE' -- .gobbi/projects/gobbi/skills/preparation .gobbi/projects/gobbi/skills/orchestration` → only trigger/classification wording (classify each hit, not a hard gate).
- Trace: one user-confirmed `re-ideate` row produces no Preparation evaluation files, no Preparation RECORD verdict, `workflow.preparation.iter` unchanged, Ideation Active.

## Trade-offs

Optimizes for: root-cause fix (P8), no new schema surface, minimal blast radius. Sacrifices: none —
both dual-system producers independently reached this direction (convergence, not a trade-off pick).

## Open issues

None — both Claude and Codex producers converged on (a); the iter1/iter2 evaluators raised only a
Low-severity normalization-scope consistency note (F-CONS-3), resolved at iter2.

## Related

- [[d7-001-split-fresh-init-resume-rehydration]] — shares `state.template.json` in the finding
  location set (co-touch dissolves under the recommended directions)
- [[verify-mirror-and-cross-tree-paths-from-live-tree]] — mistake-candidate this loop staged
