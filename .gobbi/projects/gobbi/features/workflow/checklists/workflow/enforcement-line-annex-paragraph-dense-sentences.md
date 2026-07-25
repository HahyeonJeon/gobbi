---
name: enforcement-line-annex-paragraph-dense-sentences
description: The rule's Enforcement line and planning.md's annex marker paragraph each pack the full invariant into one long multi-clause sentence, below Principle 7's brevity bar.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync]
keywords: [principle-7, brevity, dense-sentence, enforcement-line, annex-marker]
author: claude
scenario: dense-single-sentence-prose
item_status: deferred
anchor: novel
implemented_in: null
---

# Consider splitting the Enforcement line and annex-marker paragraph into shorter sentences

## What

`rules/docs/point-dont-restate-workflow-docs.md:22` (the Enforcement line) and `orchestration/workflow/planning.md:10`
(the annex-marker paragraph) each state their full invariant as one long, multi-clause sentence. A
future doc-quality pass could split each into two or three shorter sentences per Principle 7 (say the
thing plainly, one idea per sentence).

## Why

The task 02 evaluation (Aesthetics perspective) found this while checking Principle 7 brevity — Confidence
50, Severity Low. It is explicitly a style-preference note, not a regression: both sentences match the
pre-existing density of the surrounding rule (the original Enforcement line was already one long
sentence before task 02 touched it), so task 02 did not introduce the density, it inherited it.

## Verification

None required for task 02. If a future docs pass splits the sentences, confirm the invariant's meaning
is unchanged (no dropped clause) by re-running `check-workflow-pointer-drift.sh` and
`check-markdown-links.sh` against the edited files.

## Status notes

Deferred — optional future work, not part of any task's contracted scope. Not blocking task 02's PASS.

## Related

None.
