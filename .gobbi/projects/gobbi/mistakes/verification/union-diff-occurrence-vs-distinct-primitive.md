---
name: union-diff-occurrence-vs-distinct-primitive
description: The compaction union floor is each DISTINCT named primitive surviving once, not every occurrence; adjudicate occurrence-level over-flags.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-14
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [verification, evaluation, docs-sync]
keywords: [union-diff, occurrence, distinct-primitive, over-flag, compaction, adjudication]
author: claude
priority: medium
domain: evaluation
supersedes: null
superseded_by: null
related: [union-diff-must-reach-named-primitive-granularity, codex-eval-overall-md-can-contradict-perspective-verdicts]
---

# The union floor is each distinct primitive surviving once, not every occurrence

## What happened

In the T7 compaction evaluation the Codex evaluator raised occurrence-level over-flags as High
drops: `foo_close`'s redundant `argtypes`/`restype` declaration (the primitive survives via
`foo_open`) and a `.strip()` call (a generic method; the concept survives via the `stdout`
example). These were NOT union drops — the distinct primitive still appears elsewhere at full
count. The manager had to adjudicate them apart from the ONE genuine distinct-primitive drop in
the same review (the POSIX directory-fsync durability mechanism `os.open`/`os.fsync`/`os.close`,
which WAS a real drop and was restored).

## Why it happens

At named-primitive granularity it is easy to conflate two different floors: (a) each DISTINCT
named primitive must survive at least once, versus (b) every OCCURRENCE of a primitive must
survive. A compaction legitimately deduplicates repeated declarations — removing a second,
redundant occurrence of a primitive that still appears elsewhere is NOT a union drop. An
evaluator hunting named-primitive drops (correctly, per the sibling trap) can over-correct and
flag every removed occurrence.

## Correct approach

Define the union floor as: each DISTINCT named primitive survives at least once. Before flagging
a removed occurrence as a drop, check whether that primitive still appears elsewhere in the
compacted doc at full fidelity — if it does, the removal is a dedup, not a drop. Reserve the
"genuine drop" verdict for a distinct primitive that appears NOWHERE after compaction. Both
evaluators and the manager must distinguish occurrence-level over-flags from genuine
distinct-primitive drops.

## How to detect

A drop finding names a primitive that grep still finds elsewhere in the compacted doc — that is
an occurrence-level over-flag, not a union drop. Conversely, a primitive the finding names that
grep finds NOWHERE after compaction is a genuine distinct-primitive drop. Grep the flagged
primitive across the whole compacted doc before accepting or rejecting the finding.

## Related

- [[union-diff-must-reach-named-primitive-granularity]] — the paired under-check trap: a union-diff must REACH named-primitive granularity
- [[codex-eval-overall-md-can-contradict-perspective-verdicts]] — a sibling evaluation-adjudication discipline from the same session
