---
name: evaluation-md-section-name-paraphrase
description: evaluation.md framing references "Same symptom, different root cause" but the actual section header is "Same symptom, different root cause — do not collapse" (missing the " — do not collapse" suffix)
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [docs-sync, prose-polish, evaluation]
scenario: auto-mode-evaluation-discipline
item_status: pending
anchor: novel
implemented_in: null
---

# evaluation.md — correct by-name section reference to include full header text

## What

The framing sentence in `evaluation.md` (at the head of § Cross-System Reconciliation, added in commit 5e8e39d) references the section as "Same symptom, different root cause". The actual section header is "Same symptom, different root cause — do not collapse". The reference omits the " — do not collapse" suffix, making it a paraphrase rather than an exact by-name cite.

## Why

Claude evaluator (iter1 overall.md): flagged as Low/50 docs-sync finding. "framing names '§ Same symptom, different root cause' but the actual header is 'Same symptom, different root cause — do not collapse' (by-name paraphrase)." Non-gating cosmetic docs-sync gap. Both evaluators' reconciled verdict was PASS; deferred to prose polish.

## Verification

After fix: the framing sentence should contain the full header text "Same symptom, different root cause — do not collapse" (or use a markdown link `[§ Same symptom, different root cause — do not collapse](#same-symptom-different-root-cause--do-not-collapse)`). Grep the updated line to confirm the suffix is present.

## Status notes

Deferred by both evaluators at iter1 (Claude Low/50, confidence 50). Address in a future prose-polish session for `evaluation.md`. Do not block the current session's PR on this.
