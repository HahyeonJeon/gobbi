---
name: para-fluid-folder-refactor
description: PARA treats movement between buckets as the normal lifecycle, not an exception — the design stance for gobbi's refactorability mechanism.
type: references
scope: feature
feature: memory
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, design, refactor]
keywords: [para, folders, fluid-buckets, refactorable, pkm]
author: claude
title: PARA — folders as fluid buckets that records move between
source: https://www.thedilettantelife.com/organising-notes-pkm/
accessed: 2026-06-21
ref_type: blog
---

# PARA — folders as fluid buckets that records move between

## Insight

PARA organizes by a small fixed top set (Projects / Areas / Resources / Archive) and treats movement BETWEEN buckets as the normal lifecycle, not an exception — a finished project moves to Archive, a revived one moves back. Folders give spatial memory and browsability; the cost is each note lives in exactly one place. Community consensus: there is no universal best layout — start simple, and refactor if it feels wrong after ~3 months.

## Reason

Supports a folder-based (not tag-based) namespace, because gobbi already commits to "directory = category" (rules §1.1) and folders are browsable in a way YAML tags are not. PARA's "movement is normal" principle is the stance the refactorability mechanism adopts: re-namespacing a record is an expected, procedured operation, not a schema violation. Invoke when designing the split/merge/rename refactor procedure.

## Source

- https://www.thedilettantelife.com/organising-notes-pkm/
- https://pkmdiaries.substack.com/p/in-defense-of-folders

## Excerpt

"The beauty of the PARA system is that it's fluid, with notes and folders able to move in and out of areas as they are needed."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-21 | c3ac1c53-6741-49cf-8856-cdb3fcd6bec0 | Anchored the "re-namespacing is a normal procedured operation" refactorability stance |

## Related

- [[tags-vs-folders-one-axis-each]] — the folder-one-axis decision PARA's folder model supports
- [[file-move-needs-link-resolution-check]] — the move hazard the procedure must close
