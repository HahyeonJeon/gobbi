---
name: renumber-verify-target-still-owns-the-subdiscipline
description: When renumbering a cross-ref after a principle merge/rewrite, confirm the NEW principle's text still contains the specific sub-discipline — a merged/rewritten principle may have dropped or relocated the sub-bullet, so lineage-based renumbering can point at a principle that no longer owns it.
type: mistakes
scope: feature
feature: guardrails
status: active
created: 2026-06-05
session: ca2231b3-9567-4cf9-b0d6-f9bd3e2e78ee
tags: [docs-sync, renumber, principles, discipline-mapping]
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
---

# Lineage-based renumbering can point at a principle that no longer owns the sub-discipline

## What happened

The iter1 plan mapped two cross-references by lineage and got both wrong — caught only by Codex during dual-system evaluation (Claude missed them):

(a) The "3-strike rule" was cited as Principle 1 and left as-is because old P1 owned it. But new P1 dropped the 3-strike rule entirely — it now lives, reworded, in new P8 ("Fix the Root Cause, Not the Symptom"). The ref pointed at a principle that no longer owns the discipline.

(b) `orchestration/SKILL.md` line 45 cited "subagent prompt must include requirements/constraints/context" and was renumbered from old Scope-P4 to new Scope-P5 by lineage. But new P5 (Scope) dropped the subagent-prompt-completeness bullet while new P4 ("Refine the Task With the User") absorbed it. The renumbered ref pointed at P5, which no longer owns that sub-discipline.

## Why it happens

A 14→8 principle merge rewrites the principles themselves. A sub-bullet that lived under principle X-old may be dropped from the merged result or moved to a different principle Y-new. Mapping a cross-reference by the OLD principle's identity (lineage: "P4 became P5") assumes the sub-discipline traveled with the number/name — it may not have.

## Correct approach

For each cross-reference being renumbered after a principle set was merged or rewritten:

1. Identify what specific sub-discipline the reference invokes (not just which principle it cited).
2. Read the NEW principle's full text and confirm it still states that specific sub-discipline.
3. If not, search the new principle set for which principle absorbed the sub-discipline (or, if removed, reword to point at the owning skill).

Use dual-system evaluation — this class of error was caught by Codex in this session; Claude's lineage-mapping was wrong on both instances. The evaluator running an independent read of the new principle text is the only reliable catch.

## How to detect

Any cross-ref renumber after a principle set was merged or rewritten. The risk is highest for refs to a sub-bullet rather than the principle's headline (e.g., "3-strike rule", "subagent-prompt-completeness", "What/Why/How") because sub-bullets migrate or disappear in merges more often than headline disciplines do. If the reference includes a quoted phrase or sub-discipline name, always verify that phrase still appears in the target principle's text.
