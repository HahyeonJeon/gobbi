---
name: over-scrub-drops-idea-level-seed-condition
description: Scrubbing a code-loop seed to a non-code loop deleted an idea-level condition whose keyword matched a scrubbed idiom, instead of rewording it
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-08
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [docs-sync]
keywords: [scrub, seed-faithfulness, reword, non-code-adaptation]
author: claude
priority: medium
domain: docs-sync
supersedes: null
superseded_by: null
related: [merging-two-seed-bullets-narrows-broader-scope]
---

# Over-scrubbing dropped an idea-level seed condition instead of rewording it

## What happened

When adapting the code-loop evaluation seed (Execution) to a NON-CODE loop (Ideation), a seed sub-dimension whose keyword is on the scrub list was DELETED rather than reworded, silently losing an idea-quality condition. The Performance seed characterized external calls by three sub-dimensions — "count, batching, **retry policy**" (`ideation/evaluation.md` old seed). The reword pass correctly turned "Big-O → order-of-magnitude" (concept kept, code phrase dropped) but DELETED "retry policy" outright, so the ideation `PERF-01-CHECK-03` kept "how many calls, whether they batch" and lost the third dimension. The dual-system evaluation flagged it (Codex REVISE, user-upheld).

## Why it happens

The scrub rule ("remove retry/timeout") was applied too literally: the code PHRASE and the underlying idea-level CONCERN it encodes were conflated. "Retry policy" reads as a code idiom, so it was scrubbed like `test.skip` — but unlike a pure stack idiom it also encodes a real idea-quality question (does the design account for what happens when an external call fails or is slow). A keyword match on the scrub list is not the same as the sub-dimension being purely-code.

## Correct approach

REWORD the concern to idea-level, do not drop it — the same treatment "Big-O → order-of-magnitude" got. Only the literal code construct is scrubbed; the idea-quality question it encodes is preserved. Here: "retry policy → how the design behaves when an external call fails or is slow" (concept kept, code phrase — retry / backoff / timeout / N retries — dropped). When scrubbing a multi-dimension seed bullet, enumerate every sub-dimension first, then for each decide scrub-the-phrase-keep-the-concern vs drop-entirely-because-purely-code; default to reword.

## How to detect

A seed bullet has several sub-dimensions and ONE of them shares a keyword with a scrubbed idiom (retry / timeout / benchmark / lockfile); the reword pass kept some sub-dimensions and dropped the code-flavored one. Tell: after adaptation, a multi-part seed condition has FEWER parts than the source, and the missing part is the one whose keyword was on the scrub list. Diff the adapted condition against the source seed bullet and count the sub-dimensions.

## Related

- [[merging-two-seed-bullets-narrows-broader-scope]] — sibling consolidation-loss trap: a merge narrowed a broader seed bullet's scope
