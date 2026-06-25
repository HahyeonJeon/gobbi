---
name: codex-eval-wrapper-vocab-grep-false-blocks-clean-pass
description: Requiring finding-vocab tokens in the Codex evaluator wrapper conflates "no problems found" with "malformed output" — a false BLOCKED on a clean PASS.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [codex, verification]
keywords: [codex-eval-wrapper, finding-vocab, false-blocked, clean-pass, evaluator-output-validation]
author: claude
priority: high
domain: codex
supersedes: null
superseded_by: null
related: []
---

# Codex-eval wrapper's required finding-vocab check false-blocks a clean PASS

## What happened

The Codex-eval assistant-wrapper validates Codex evaluator output files before reporting a verdict. At iter4, the Codex evaluator produced a genuine PASS with no findings — "no findings" prose without any typed finding-vocab token (`scenario_gap|checklist_gap|design_flaw|assumption_risk|general`). The wrapper's REQUIRED check matched zero finding-vocab tokens across the output files, returned BLOCKED, and forced a retry (`agent-a2fa558b56f248565`). The underlying output was substantive and complete: 8 files, each >0 bytes, with a VERDICT line. The BLOCKED was false — the retry produced identical content, confirming the original output was valid.

## Why it happens

Requiring finding-vocab tokens conflates two distinct conditions: "no problems found" (a valid evaluator state) with "malformed output" (the condition the check is meant to catch). A well-formed PASS that finds nothing to flag is indistinguishable from a missing output file by this check. The check is a necessary gate for the malformed-output case but the wrong gate for the no-findings case.

## Correct approach

The wrapper's REQUIRED checks are: (1) all 8 expected files exist, (2) each is >0 bytes, (3) a VERDICT line is present. These three gates detect genuine malformed or missing output. The finding-vocab token check is demoted to ADVISORY only — it may flag "no typed findings found" as an observation, but it does not BLOCK the verdict.

To still receive constructive Stage-1 typed findings on a PASS (which helps the RECORD assistant route findings), the fix belongs in the Codex EVAL PROMPT, not in the wrapper gate: the eval prompt should instruct the Codex evaluator to produce at least one typed finding per perspective even on PASS ("constructive findings exist even when the overall verdict is PASS — use `general` if no other type applies"). Fix it prompt-side; do not make the wrapper's presence-of-findings check a hard block. Keeping the vocab-token check as REQUIRED — or tightening it to ≥1 typed token per file — was rejected: any clean PASS that says "no findings" still triggers a false BLOCKED, and a file-level check lowers but does not eliminate the false-positive rate. The root fix is prompt-side, not wrapper-side.

## How to detect

The wrapper reports BLOCKED but the Codex output files exist, are >0 bytes, and carry a VERDICT line. The content is substantive prose that says "no findings" or equivalent without using typed finding tokens. This is a false BLOCKED from the vocab-token REQUIRED check, not a genuine output-completeness failure.
