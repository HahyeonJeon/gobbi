---
name: vocabulary-rename-record-memory-split
description: Rename MEMORIZATION→RECORD (sub-phase) and rename memory storage tiers across 71 in-scope files
type: design
scope: feature
feature: workflow
status: retired
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [memory, design]
keywords: [vocabulary, record, rename]
author: claude
supersedes: null
superseded_by: null
related: [memorization-spread-count-corrected, wrap-up-5-stage-pipeline]
archived_at: 2026-07-20
archive_reason: retired
---

# Vocabulary rename: RECORD / memory split (D-a + D-e)

## Problem
One word, "memorization", names two structurally different jobs. One word, "memory", names two storage tiers. The collision is live in the codebase and was reported by the user as ambiguous.

## Scope
In: 71 in-scope files (B1..B7, command-derived manifest in Design § D-e). Out: 21 historical-exclude files, git history, JSON enum keys, hook regex tokens.

## Approach
The D-e mapping table defines all forms to rename:

| Old form | New form |
|---|---|
| `MEMORIZATION` (caps, per-loop sub-phase) | `RECORD` |
| `Memorization` / `memorization` (per-loop sense) | `Record` / `record` |
| `memorization/SKILL.md` and `memorization/...` paths | `record/SKILL.md` or `memory/...` per D-b |
| `workflow/memorization.md` (doc filename + path) | `workflow/record.md` |
| `MEMORIZATION` (wrap-up sense, the promotion) | `memorization` (new meaning, lowercase) |
| "session memory" / `session-memory` | "session record" / `session-record` |
| "project memory" / `project-memory` | "memory" |
| `Skill(memorization)` | `Skill(memory)` + `Skill(record)` |

The sweep uses the exhaustive-vocabulary alternation grep (not a form-specific search). Verification uses the ERE pattern `T="memoriz|session[ -]memor|project[ -]memor"` after the dialect fix.

## Scenarios
- Normal sweep: all 71 in-scope files updated; zero survivors in exhaustive-vocabulary grep.
- Doc-filename rename: `workflow/memorization.md` → `workflow/record.md`; 15 live inbound refs repointed.
- Historical files: the 21 EXCLUDE files are untouched; diff check confirms.

## Validation
- Exhaustive-vocabulary grep over 71 in-scope files → only known intentional retentions.
- `workflow/record.md` exists; `workflow/memorization.md` absent.
- 21 EXCLUDE files: `git diff` → 0 changes.

## Trade-offs
Large surface (71 files) for a clarity gain. Risk mitigated by command-derived manifest + exhaustive alternation + form-blindness mistake awareness.

## Open issues
The printed grep commands in the D-e manifest use BRE `\|` under `grep -E` (returns 0 on verbatim re-run). Fix the dialect before Execution's verification step. See `features/workflow/decisions/process/2026-06-13-manifest-command-grep-dialect-bug.md`.
