---
name: file-move-needs-link-resolution-check
description: A file-MOVE refactor breaks relative links that do not carry the renamed token; a renamed-token residual grep returns green while links silently break
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [process, refactor, verification, links]
priority: high
domain: process
layer: 2
layer2-source: .gobbi/projects/gobbi/mistakes/file-move-needs-link-resolution-check.md
layer2-rationale: Generalizable across all projects — any refactor that moves or renames files is vulnerable to silent link breakage that a token grep cannot catch. The verification discipline (link-resolution check in addition to token grep) must propagate to every project.
supersedes: null
superseded_by: null
---

# File-Move Refactors Require a Link-Resolution Check, Not Only a Token-Residual Grep

## Layer-2 note

This is a Layer-2 copy of `mistakes/file-move-needs-link-resolution-check.md`. It lives in `skills/mistake/` so it persists and loads across all projects and future sessions. The canonical record is at the project mistakes path above; this copy exists only for cross-project recall.

---

## What happened

During task 03 (repoint cross-references after the memorization → {memory, record} skill split), the executor ran a token-residual grep to verify no stale `memorization/` path refs remained. The grep returned 0 files — a green signal. Batch-1 evaluation then caught 36 broken cross-tier links. The token-grep was correct: those links did not contain the renamed token `memorization`. But the link targets had moved, and the relative paths in the linking files now pointed at non-existent locations.

## Why it happens

A file-MOVE refactor changes the destination of existing links. Links that reference the moved file via a path that does NOT contain the renamed token are invisible to a renamed-token grep: the grep checks for the old token in the link text, not whether the link resolves. A link like `../record/SKILL.md` correctly omits the old token "memorization" and still resolves to nothing if `record/SKILL.md` has not been created yet — or to the wrong target if created at a different relative depth.

The mistaken assumption: a residual-token grep that returns 0 is sufficient evidence that a file-move refactor left no broken links.

## Correct approach

Any refactor that moves or renames files MUST run a link-resolution check — one that actually follows the relative path from each linking file's location and confirms the target exists — in addition to (not instead of) a token-residual grep.

A link-resolution check extracts every `[text](path)` and `[text][ref]` from each markdown file, resolves the relative path from the file's directory, and reports any that do not resolve to an existing file. This guard must run as part of the verify step for any task that moves or renames files.

## How to detect

The trigger: a planning task says "move file X to new location Y" or "rename directory A to B", AND the verify step only includes a grep for the old token/path, without any link-resolution step.

Correct verify: a link-resolution script run over the affected tree, confirming zero new broken links compared to the pre-move baseline.

## Related

- `mistakes/file-move-needs-link-resolution-check.md` — canonical project-level record
