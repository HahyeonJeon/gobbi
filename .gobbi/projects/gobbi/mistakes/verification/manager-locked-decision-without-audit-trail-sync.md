---
name: manager-locked-decision-without-audit-trail-sync
description: A user decision changed the synthesis while its open-decision record stayed unresolved, leaving contradictory evidence.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [verification, process, evaluation]
keywords: [open-decisions, audit-trail, locked-decision, synthesis, principle-9]
author: claude
priority: critical
domain: process
---

# A resolved user decision must update synthesis and open decisions together

## What happened

In a historical design loop, the user resolved a material topology question and the canonical candidate was updated. The records that had surfaced the conflict still described it as unresolved. The evaluation package therefore contradicted itself on a load-bearing decision.

## Why it happens

The manager treated the canonical candidate as the only authoritative surface. But a material conflict has two coupled records: the decision row that explains why user input was required and the synthesis that implements the answer. Updating only one makes the creation evidence internally inconsistent.

## Correct approach

Record material draft and cross-review conflicts in `working/iteration-{n}/open-decisions.md`. Pause for the user on design, scope, destructive, or otherwise material conflicts. After the answer, update the synthesis and mark each affected decision resolved with the chosen disposition and rationale. Validate the complete package before EVALUATION.

Evaluation findings use a separate batch disposition gate. Do not rewrite creation decisions as finding dispositions or apply a finding before the user approves the batch. Treat each owner-coupled update as one Principle-9 change.

## How to detect

The synthesis says a material question is decided while `open-decisions.md` still marks it open, or the decision file says resolved without the synthesis reflecting the answer. Another signal is an EVALUATION transition while any material decision remains unresolved.

**Historical recurrence, 2026-07-05:** a locked scope change was prepended as an amendment while several body sections retained the old direction. The lesson remains: a superseding header does not propagate through every material restatement.

## Related

- `skills/evaluation/mistakes.md#freeze-canonical-candidate-before-evaluating` — sibling verification-discipline trap
- [[dual-eval-caught-managers-own-audit-gap]] — the learning this mistake demonstrates
