---
name: chat-mode-stuck-regression-anchor
description: Planning must cite evaluation.md's existing behavior (not chat-mode.md) as the Chat anchor for the Stuck and Regression mode-splits
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-06-07
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [docs-sync, chat-mode, evaluation, mode-split, planning-note]
scenario: chat-mode-consistency-check
item_status: pending
anchor: novel
implemented_in: null
---

# Chat anchor for Stuck/Regression mode-splits — Planning precision check

## What

The idea's § Cross-file consistency risks note #1 (consistency-risk note) says to quote "chat-mode.md's existing language" as the Chat anchor for ALL three routine-triage mode-splits (§ Iteration Caps, § Stuck detection, § Regression marking). This is imprecise for two of the three:

- **§ Iteration Caps**: chat-mode.md DOES say "Budget exhausted → escalate to user via AskUserQuestion" — cite chat-mode.md here.
- **§ Stuck detection**: chat-mode.md is SILENT on stuck findings. The Chat branch for this split preserves evaluation.md's existing unconditional behavior ("Escalate to user BEFORE reaching the iteration cap via AskUserQuestion"). Cite evaluation.md's current behavior as the Chat anchor, NOT chat-mode.md.
- **§ Regression marking**: chat-mode.md is SILENT on regression marking. The Chat branch preserves evaluation.md's existing behavior ("A regression at any iter triggers user awareness via AskUserQuestion"). Cite evaluation.md's current behavior, NOT chat-mode.md.

## Why

chat-mode.md covers the cap-exhaustion escalation but does not mention stuck findings or regression marking. If Planning authors the Chat branch by quoting chat-mode.md for Stuck/Regression, the quote will fail (no such text exists there) and Planning may incorrectly infer that Chat behavior needs to be invented. The Chat branch for Stuck/Regression is simply "preserve what evaluation.md currently says" — no new Chat rule is invented.

## Verification

Before finalizing the evaluation.md mode-split edits, Planning or Execution verifies:
1. `grep -n "stuck\|Stuck" .gobbi/projects/gobbi/skills/orchestration/chat-mode.md` — should return zero hits.
2. `grep -n "regression\|Regression" .gobbi/projects/gobbi/skills/orchestration/chat-mode.md` — should return zero hits.
3. The Chat branch of the Stuck mode-split quotes or paraphrases evaluation.md line ~241-249, not chat-mode.md.
4. The Chat branch of the Regression mode-split quotes or paraphrases evaluation.md line ~239, not chat-mode.md.

## Status notes

Residual Low finding from iter3 Claude overall.md (C1). Non-gating at Ideation; surfaced here so Planning picks up the precision fix without re-debating it. The mode-splits themselves are correct; only the cited anchor in the Planning note is imprecise.
