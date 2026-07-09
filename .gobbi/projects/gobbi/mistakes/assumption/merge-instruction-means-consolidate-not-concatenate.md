---
name: merge-instruction-means-consolidate-not-concatenate
description: A user "merge X/Y/Z" instruction asks for one consolidated, compacted passage — not the labeled blocks stitched back-to-back.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-08
session: 33de02b8-4dff-4768-bafa-c1f53ae81890
tags: [process, assumption]
keywords: [merge, consolidate, concatenate, editing-instruction, doc-writing]
author: claude
priority: medium
domain: process
---

# "Merge X/Y/Z" means consolidate, not concatenate

## What happened

During this session's Execution work, the user asked to merge several labeled blocks at a
specified position in a document. The first pass interpreted "merge" literally as concatenation:
the blocks were placed back-to-back at the position, each still carrying its own block label. The
user corrected this — "merge" meant produce ONE continuous, compacted passage at that position:
drop the block labels and combine the underlying content into a single, non-redundant statement,
not stitch the labeled pieces together.

## Why it happens

"Merge" is ambiguous between two very different actions: mechanical concatenation (keep every
piece, glue them in sequence, change nothing else) and content consolidation (fold redundant
material together, keep one voice, remove the seams). The mechanical reading is the cheaper
default — it requires no judgment about what is redundant or how the pieces relate — so it is the
one an agent under time pressure reaches for first.

## Correct approach

When a user says "merge X/Y/Z" (or "combine" / "consolidate"), default to producing ONE
continuous, compacted passage that carries the combined meaning at the specified position: remove
the individual block or section labels, resolve any overlap or redundancy between the pieces, and
write the result as a single connected passage. Treat literal concatenation as the exception, not
the default — confirm with the user only if the instruction is genuinely ambiguous about which
behavior is wanted.

## How to detect

A "merge" or "combine" instruction is followed by output that still shows the original piece
boundaries — separate labeled sub-blocks, visible seams, back-to-back paragraphs each
recognizably one original source — instead of one recomposed passage. That shape is a
concatenation, not a merge.
