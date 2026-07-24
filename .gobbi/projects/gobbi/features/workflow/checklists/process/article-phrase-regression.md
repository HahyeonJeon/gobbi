---
name: article-phrase-regression
description: A targeted-token purge (removing a specific retired word/phrase) must not remove an unrelated adjacent word, producing an ungrammatical or altered-meaning residual.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-16
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync, verification]
keywords: [token-purge, article-regression, targeted-edit, grammar-check]
author: claude
scenario: ideation-revise-fix-claim-precision
item_status: pending
anchor: novel
implemented_in: null
---

# A targeted retired-token purge must not remove an unrelated adjacent word

## What

When a fix targets removing a specific retired word or phrase from a sentence, verify the edit removed only that token and left the rest of the sentence grammatically and semantically intact. Add a post-edit grammar/sense check to the fix's own acceptance criterion.

## Why

The iter-3 FX1 fix (purging the retired branch-snapshot reference and other-branch adjective) changed "a generic SOP" to the ungrammatical "a SOP" at line 85 — the removed word ("generic") is unrelated to either retired token FX1 targeted. `CODEX-I3-AESTH-001` (codex, Low/100, `general`/`docs-sync`) caught the regression: "Iter 3 introduces an article/phrase regression outside the stated vocabulary purge."

## Verification

For any fix whose acceptance criterion is "token X no longer appears," diff the exact sentence before and after the edit and confirm no word besides token X (and any grammatically-required adjustment) changed. A bare "grep for X returns 0" check is insufficient — it proves the target is gone but says nothing about collateral damage to the surrounding sentence.

## Status notes

Non-blocking (Low/100, below the REVISE/FAIL thresholds). Carried to Wrap-up as a residual open finding; see `1-ideation/outputs/evaluation-summary.md` and `1-ideation/outputs/resolution-log.md`. A one-word fix ("a SOP" → "a generic SOP" restored, or an equivalent phrasing) closes this cleanly whenever Execution touches the same line.

## Related

- [[verbatim-claim-precision]] — the sibling finding from the same iteration, staged as the union record for the broader "claim vs. actual diff" pattern this is a specific instance of
