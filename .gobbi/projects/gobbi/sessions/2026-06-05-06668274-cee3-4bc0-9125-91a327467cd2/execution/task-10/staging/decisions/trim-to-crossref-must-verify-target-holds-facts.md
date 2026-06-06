---
name: trim-to-crossref-must-verify-target-holds-facts
description: Trimming content to a cross-ref ("see §X for the full Y") is a relocation claim; if the cited target does not already contain every fact being removed, the trim silently deletes those facts.
type: decisions
scope: project
feature: null
status: active
created: 2026-06-06
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [process, docs-sync, compaction, cross-ref, content-loss]
mistake-candidate: true
domain: docs-sync
supersedes: null
superseded_by: null
decision_status: accepted
---

# Verify the cross-ref target actually holds every fact before trimming to a pointer

## What happened

During task-10 execution (commit `1565e97`), the `workflow.chat.tasks[]` row in `orchestration/SKILL.md § Workflow State Machine` was compacted from a full field-reference block to a one-line cross-ref claiming "full field reference now in § Workflow Metadata." Two facts in that block were not already present in `§ Workflow Metadata`:

1. The template-seed provisioning contract: both `tasks-list` and `task-single` templates seed `workflow.chat: { tasks: [] }`.
2. The R2 session.json-archive semantic for `workflow.chat.tasks[]`.

The cross-ref was written first; the target was not opened to verify it contained those facts. The result was a "relocated" pointer pointing to a section that was missing two of the facts the pointer claimed were there. The evaluator caught this (REVISE verdict); the remediation commit `6201fba` re-homed both facts into `§ Workflow Metadata`.

## Why it happens

The mistaken assumption: when trimming content to a cross-ref, the executor assumed the target section already held the full content being removed — because the task description said to move the schema to the target, it was treated as already done. The target had a partial field list; the two missing facts were never moved. A "relocated to X" claim was made without opening X to verify.

## Correct approach

1. **Before trimming, open the cited target.** Read the destination section and enumerate every fact being removed from the source. Confirm each fact appears verbatim (or functionally equivalent) in the destination.
2. **If any fact is missing from the target, add it to the target first** — then trim the source. The trim must always be the second step, never the first.
3. **At evaluation: diff removed content against the cross-ref target, not just confirm the section exists.** An evaluator confirming "§ Workflow Metadata exists" is not evidence the missing facts are there. The diff is the evidence.

The corrected sequence: read target → identify gaps → fill gaps in target → trim source → verify cross-ref is now lossless.

## How to detect

- Any edit that replaces content with a one-line cross-ref ("see § X for the full Y", "full reference now in § Z") is a relocation claim — treat it as a content-loss risk until verified.
- The task plan says "move X to Y" but the executor trims X without first reading Y to confirm it contains X.
- Evaluation: the evaluator confirms the cross-ref section exists but does not diff the removed content against the target — that is a false-pass signal (related to `evaluator-false-pass-without-diffing`).

## Related

- `[[verbatim-section-replacement-must-copy-preserved-parts-from-live-file]]` — sibling docs-sync mistake (task-06, same session): reconstructing "preserved" subsections from memory rather than reading the live file also causes silent regression. Both mistakes share the root: acting on an assumption about a file's content without reading it.
- `[[evaluator-false-pass-without-diffing]]` — project mistake: evaluators asserting preservation/relocation without reading the destination file.
- Commits `1565e97` (introduced trim) + `6201fba` (remediation) on `chore/session-2026-06-05-06668274`.
- Layer-2 promotion candidate: this mistake generalizes across projects — any compaction pass that trims content to a cross-ref faces this risk regardless of which project.
