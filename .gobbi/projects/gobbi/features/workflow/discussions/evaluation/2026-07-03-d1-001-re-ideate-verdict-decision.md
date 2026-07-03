---
name: d1-001-re-ideate-verdict-decision
description: Drop the RE-IDEATE evaluation verdict; keep re-Ideate as a Preparation DISCUSSION user decision
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, evaluation]
keywords: [re-ideate, verdict, preparation]
author: claude
outcome: Model (a) — delete the 3 verdict-framing sites; re-Ideate stays a per-gap DISCUSSION resolution; no new enum
---

# GEN-D1-001 remediation model

## Context

GEN-D1-001 found that `RE-IDEATE` is framed as an evaluation verdict at 3 sites
(`preparation.md:117`, `auto-mode.md:92,100`) but the evaluator aggregation only ever emits
PASS/REVISE/FAIL, and no schema carries a `RE-IDEATE` enum value.

## Question

Should re-Ideate become a formal `RE-IDEATE` evaluation verdict (model b), or should the 3
verdict-framing sites be dropped in favor of the already-dominant DISCUSSION-resolution model
(model a)?

## Options considered

- **(a)** Drop the verdict; keep re-Ideate as a Preparation DISCUSSION user decision. No new enum.
- **(b)** Add a formal `RE-IDEATE` verdict to aggregation, RECORD, both templates, resume, and mode
  docs.

## User decision

Model (a). Both the Claude leader and the Codex proposer independently recommended (a) — a genuine
dual-system convergence. Root-cause: re-Ideate is upstream routing (a DISCUSSION-phase decision), not
an evaluation result.

## Implication

`preparation/SKILL.md`, `orchestration/workflow/preparation.md`, and `orchestration/auto-mode.md`
excise the 3 verdict-framing sites at FIX time; no template edit. Uppercase `RE-IDEATE` tokens that
could imply a verdict get wording-normalized where they don't change the underlying routing semantics.

## Related

- [[d1-001-drop-re-ideate-verdict]] — the design this decision shaped
