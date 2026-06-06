---
name: table-renumber-must-sweep-inbound-row-references
description: When a numbered/ordered table is renumbered, inbound positional references ("row N") are a blast-radius surface missed by keyword-only sweeps — grep for them explicitly.
type: mistakes
scope: feature
feature: guardrails
status: active
created: 2026-06-05
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [process, docs-sync, blast-radius, planning]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# A table renumber must sweep inbound positional references, not just concept keywords

## What happened

During task-03 (`step1-configuration-restructure-always-worktree`), the Planning phase's blast-radius sweep correctly identified files referencing the *concepts* being removed or changed — direct mode, smoke-test gate T1.h, the `chore/session-` branch prefix, and so on. It did NOT sweep for inbound **positional references** to the Step-1 procedure table ("row 5", "row 5.5", "row 6", "rows 5-6") when that table was renumbered from 7 rows to 4.

Iter-1 shipped with 6 dangling row-number cross-references across `gobbi/SKILL.md`, `orchestration/SKILL.md` (including a self-reference inside the file being edited), and `chat-mode.md`. The evaluator caught them (REVISE verdict); iter-2 was needed solely to fix those references. No user correction was issued — the evaluator caught the drift — but a second iteration was required, which is waste that a better planning sweep would have prevented.

## Why it happens

The planning blast-radius sweep was scoped to the *concepts being removed* and the *terms being renamed*. Renumbering a table is a structural change: the positional addresses (row indices) are invalidated even though no concept keyword changed. A keyword sweep cannot find "row 5" references because "row 5" is not a concept word — it is a positional address that happens to be valid until the moment the table is restructured. The mistaken assumption was: **a concept-keyword sweep is sufficient blast-radius coverage for a table restructure.** It is not.

## Correct approach

When a numbered or ordered table (or list, or step sequence) is REORDERED or has items ADDED or REMOVED — i.e., any change that shifts positional indices — add an explicit second sweep to the blast-radius plan:

1. Identify the table's name / section heading so you can scope the grep.
2. Grep the entire canonical tree for positional reference patterns: `row [0-9]`, `rows [0-9]`, `step [0-9]`, `section [0-9]`, `Row [0-9]` — in the context of the renamed table.
3. Build an old→new index mapping from the restructure plan (e.g., old row 5 → new row 1, old row 6 → new row 3).
4. Remap every positional cross-reference found in step 2 per that mapping.
5. Treat this positional-sweep as a first-class CRUD plan item, not a post-hoc cleanup.

Grep pattern example for a "Step 1 procedure" table:

```bash
rg -n 'row [0-9]|rows [0-9]|Row [0-9]' --type md .claude/skills/ .claude/workflow/
```

## How to detect (before shipping)

Any time a CRUD plan includes "restructure table" or "renumber rows" or "remove N rows" from a table, ask: **does any other file reference this table by row number?** If the answer is "I don't know", run the positional grep before finalizing the task plan. The trigger signal is a structural change to an addressable table — not just a content change.

A second detector: after writing the restructured table, grep for the old row-count range (`row [old-max]` or the specific old row numbers) across the project. Any hit is a reference that needs remapping.

## Related

- Triggering change: `[[2026-06-05-always-worktree-model-replaces-direct-mode]]` — the Step-1 table restructure that produced the dangling references.
- Commits: `46d93c8` (iter1, introduced drift) + `72cee33` (iter2, corrected 6 references).
- Cross-ref — RELATED but DISTINCT from `renumber-verify-target-still-owns-the-subdiscipline.md` (that mistake is about content-ownership mismatch when a principle merges/rewrites; this one is about positional-reference blindness when a table's row indices shift).
- Cross-ref — RELATED but DISTINCT from `renumber-distinguish-live-pointers-from-historical-records.md` (that mistake is about partitioning live pointers vs historical records before a sweep; this one is about the sweep failing to find positional references at all).
- Generalizability: this process lesson applies to any numbered table, ordered list, or step sequence that has inbound positional cross-references elsewhere in the doc tree. Likely a Layer-2 promotion candidate (workspace-level process skill).
