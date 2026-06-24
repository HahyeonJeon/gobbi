---
name: int3-case-sensitivity-note
description: INT-3's 46 vocab-hit line count inside workflow/memorization.md is case-insensitive; case-sensitive count is 24
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [docs-sync, vocabulary-sweep]
keywords: [count-derivation]
author: claude
supersedes: null
superseded_by: null
---

# INT-3 line count in workflow/memorization.md: 46 case-insensitive vs 24 case-sensitive

## Context
INT-3 states "46 vocab-hit lines" inside `skills/orchestration/workflow/memorization.md`. This was produced by `grep -icE` (case-insensitive). The case-sensitive count (`grep -c`) is 24. Both figures are defensible but INT-3 does not state which mode was used, leaving a reader unable to reproduce the count without guessing.

## Decision
Accept as a Low residual. The file IS in scope and IS a filename-rename target — the count's derivation mode does not affect that decision. For the sweep itself, use the exhaustive-vocabulary mapping (D-e) which handles both upper and lower case forms; the exact line count inside this one file is informational only.

## Rationale
Low severity: the count's purpose is to characterize the per-file work for one specific file; the actual rename decision (INT-3) is not affected by whether there are 24 or 46 vocabulary-bearing lines. The sweep works file-by-file, not line-by-line.

## Alternatives considered
- Fix INT-3 to state both counts (acceptable as a Execution-time cleanup; the Ideation artifact captures the right decision regardless).

## Consequences
When the D-e sweep reaches `workflow/memorization.md`, the executor will run the exhaustive-vocabulary alternation grep on it — the line count is for estimation, not for verification. Verification is by the zero-survivor check after the sweep.

## Related
- Design § INT-3 (this file's role as rename target)
- `evaluation/iter2/claude/project.md` (proj-int3-46-line-count-case-sensitivity-unstated)
