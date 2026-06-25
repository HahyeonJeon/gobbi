---
name: git-layout-mutability-split
description: .git/ separates immutable objects, mutable refs, and append-only reflog — the proven model for a debuggable working-state directory.
type: references
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: []
keywords: [directory-structure, debuggability, mutability-split]
author: claude
title: git internal layout — mutability split and reflog audit trail
source: https://git-scm.com/docs/gitrepository-layout
accessed: 2026-06-08
ref_type: docs
---

# git internal layout: mutability split + reflog audit trail

## Insight

`.git/` is debuggable because it separates content by mutability and role: immutable content-addressed `objects/`, mutable `refs/`, an append-only change log `logs/` (the reflog) that mirrors the `refs/` namespace, and `config`/`index`/`HEAD` at the root as the small set of "what is the current state" files. A developer can open any one of these and know what it holds without reading git's source.

## Related

- decisions/workflow/2026-06-08-flat-granular-loop-interior.md
- design/workflow/session-memory-tree.md

## Why it applies

gobbi's session dir previously mixed three roles in `{loop}/rawdata/` (mutable drafts, immutable transcripts, append-only journal) with no organizing principle. The git split — state at root, immutable audit in its own tree, mutable working area separate — is the proven model for "a developer opens the dir and understands what happened." This is the EXT-1 pattern that anchors the flat-granular-loop-interior design decision (keeping named per-role dirs rather than a single `rawdata/` bucket).

## Source

- https://git-scm.com/docs/gitrepository-layout
- https://www.kernel.org/pub/software/scm/git/docs/gitrepository-layout.html

## Excerpt

> `.git/` is debuggable because it separates content by mutability/role: immutable content-addressed `objects/`, mutable `refs/`, append-only `logs/` (reflog), and small state files (`HEAD`/`config`) at the root.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-08 | 1abeb43f-6389-4abf-b098-b2b3e68d79b2 | Grounded the flat-per-role-dir model (EXT-1) in the Ideation design options analysis |
