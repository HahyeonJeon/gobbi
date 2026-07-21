---
name: harden-skill-memory-residual-vocab-allowlist
description: The check-residual-vocab.sh allowlist for skills/memory/mistakes.md is whole-file; a future illegitimate retired-vocab line there would be silently excluded. Harden to file+line.
type: backlogs
scope: project
feature: null
status: closed
created: 2026-06-27
session: 659a1b3f-0b70-419a-848b-a02db5dbbded
tags: [verification, docs-sync]
keywords: [check-residual-vocab, allowlist, is_excluded_path, whole-file, file-line-allowlist, skill-memory]
author: claude
priority: medium
project-scope: true
shipped_in: null
archived_at: 2026-07-20
archive_reason: dropped
---

# Harden the residual-vocab allowlist for skills/memory/mistakes.md to file+line

## Context

During the hybrid-mistakes migration, `skills/memory/mistakes.md` legitimately accreted migrated memory-skill traps whose bodies mention retired-vocab forms in historical context. To stop `check-residual-vocab.sh` false-failing on those legitimate lines, the file was added to the guard's whole-file allowlist via `is_excluded_path` — the entire file is excluded from the residual-vocab scan.

That whole-file exclusion carries the `whole-file-allowlist-false-passes-same-file-residual` risk: `skills/memory/mistakes.md` is a live, accreting file. A future illegitimate retired-vocab line added to it — a genuine new occurrence, not historical context — would be silently excluded by the whole-file allowlist and pass the guard. The guard would report clean while a real residual-vocab defect lived in the file.

## Why deferred

The hybrid-mistakes feature's scope was the two-home model + its migration + guard wiring, not a refactor of `check-residual-vocab.sh`'s allowlist mechanism. The whole-file exclusion was the minimal change needed to keep the guard green for the migrated file; hardening the allowlist mechanism is a separate, self-contained tooling task.

## When to pick up

No prerequisites — can be done any time. Should be done before `skills/memory/mistakes.md` grows further, so the hardened allowlist covers the smaller current set of legitimate historical lines.

## Suggested approach

Replace the whole-file `is_excluded_path` exclusion for `skills/memory/mistakes.md` with a file+line allowlist — model it on Family B's `is_allowlisted_b` (which allowlists specific `file:line` carriers, not the whole file). Enumerate the specific legitimate historical-context lines in `skills/memory/mistakes.md`, allowlist exactly those lines, and let every other line in the file stay in the scan. Then confirm: a synthetic new retired-vocab line added anywhere else in the file makes the guard return non-zero, while the allowlisted historical lines still pass.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-27-659a1b3f-0b70-419a-848b-a02db5dbbded/`

## Related

- [[whole-file-allowlist-false-passes-same-file-residual]] — the recorded risk this backlog remediates (a whole-file allowlist hides a same-file residual)
- [[extend-residual-vocab-guard-for-per-type-sweep]] — a sibling `check-residual-vocab.sh` hardening task
