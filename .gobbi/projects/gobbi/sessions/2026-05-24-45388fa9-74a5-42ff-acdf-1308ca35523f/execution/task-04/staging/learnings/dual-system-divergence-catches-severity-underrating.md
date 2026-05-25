---
title: Dual-system eval divergence surfaces correctness defects single-system misses
discovered: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [evaluation, dual-system, docs-quality, process]
related: []
---

# Dual-system eval divergence surfaces correctness defects single-system misses

## Insight

When Claude and Codex diverge on verdict or severity, the divergence is high-signal: it means one system caught a defect the other rationalized away. Do not average or compromise — investigate the more conservative verdict. The divergence IS the finding.

## Context

T04 (gobbi-hook-authoring skill authoring) produced a textbook witness. Claude rated USAGE-001 as Medium and returned PASS; Codex rated the same finding as High and returned REVISE. Both identified the same root defect: the skill's registration examples omitted `"type":"command"` and used a `bash` prefix not present in the real `.claude/settings.json`. Claude's reasoning was that the `bash` form "still runs" — functionally equivalent. Codex's reasoning was that a skill whose purpose is to teach canonical registration shape must mirror the real settings, and that `"type":"command"` is a required field.

Codex was right. The defect was a High teaching-correctness error. When Claude returned PASS on that basis, the dual-system check caught it — and the REVISE round was warranted.

## Why it matters

A single-system-only evaluation would have shipped the skill with an incorrect registration shape. Future hook authors copying the P1 example would have created settings entries without the required `type` field. The correction required only one additional commit (+46/-12 lines), but without the Codex REVISE the defect would have propagated undetected.

## How to apply

- When dual-system verdicts diverge: run the `INVESTIGATE-DIVERGENCE` rule first — read both perspective files side by side on the diverging finding before resolving.
- Apply the higher-severity verdict unless the lower-severity system's rationale is specifically stronger (e.g., it has evidence the stricter system lacks). "It still works" is NOT sufficient to downgrade from High.
- Log the divergence in the verification report with both severity ratings and the rationale for the resolution chosen.

## Counter-cases

- Divergence at Low/Low between systems (both finding the same thing, just classifying differently) does not require REVISE — this is calibration noise, not a coverage gap.
- If the stricter system's finding is based on a wrong assumption (e.g., misread of the spec), the lower-severity verdict may be correct. Always verify the finding's evidence claim against the real file before resolving in favor of either system.

## Related

- T04 iter1: `execution/task-04/evaluation/iter1/claude/usage.md` (CLA-USAGE-001 Medium) vs `execution/task-04/evaluation/iter1/codex/usage.md` (USAGE-001 High)
- Mistake: `codex-exec-at-file-hangs-on-stdin-in-background.md` (the other T04 Codex operational finding — separate from this quality signal)
