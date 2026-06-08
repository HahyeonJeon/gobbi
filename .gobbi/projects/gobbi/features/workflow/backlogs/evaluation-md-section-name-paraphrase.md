---
name: evaluation-md-section-name-paraphrase
description: evaluation.md framing references "Same symptom, different root cause" but the actual section header is "Same symptom, different root cause — do not collapse" (missing the suffix)
type: backlogs
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [docs-sync, prose-polish, evaluation]
priority: low
disposition: open
---

# evaluation.md — correct by-name section reference to include full header text

## What

The framing sentence in `evaluation.md` (at the head of § Cross-System Reconciliation, added in commit 5e8e39d) references the section as "Same symptom, different root cause". The actual section header is "Same symptom, different root cause — do not collapse". The reference omits the " — do not collapse" suffix, making it a paraphrase rather than an exact by-name cite.

## Why deferred

Claude evaluator at Execution iter1 flagged as Low/50. Both evaluators' reconciled verdict was PASS; deferred to prose polish. Non-gating cosmetic docs-sync gap.

## Suggested fix

Update the framing sentence to use the full header text "Same symptom, different root cause — do not collapse" or use a markdown link `[§ Same symptom, different root cause — do not collapse](#same-symptom-different-root-cause--do-not-collapse)`.

## Verification

After fix: the reference in evaluation.md should contain the full header text including " — do not collapse". Grep confirms the suffix is present in the framing sentence.
