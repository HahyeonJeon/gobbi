---
name: dual-system-catches-union-narrowing-in-compaction
description: In doc compaction, the Codex evaluator caught a real union-narrowing on every task where the Claude-side structural check passed.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-14
session: 44971171-d5eb-4834-83fc-ff42e62460a7
tags: [evaluation, process, docs-sync]
keywords: [dual-system, union-narrowing, compaction, structural-vs-semantic, gate-c]
author: claude
related: [gate-c-structural-mapping-is-not-semantic-union-preservation, softening-can-narrow-scope-like-a-merge, consolidating-per-perspective-verification-tables-narrows-the-union]
---

# Dual-system evaluation catches union-scope narrowing in doc compaction that structural checks miss

## Insight

In a multi-task python-skill compaction pass, the Codex evaluator caught a real union-scope narrowing
on every compaction task the Claude-side STRUCTURAL check passed: a softened dunder rule that had
over-scrubbed its special-method breadth, and a 82-to-22 bullet consolidation that dropped named idiom
conditions despite a complete source-to-target coverage map. On the task where both systems hunted the
same class of defect up front, the result came back clean. Structural completeness checks (a mapping
row exists for every source; a count matches) do not detect SEMANTIC narrowing — a destination that
keeps the topic but drops a source condition.

## Context

Three sequential compaction tasks each rewrote a python-skill doc to a shorter or reframed form:

- **Task 1** softened a hard rule (a special-method breadth warning) to guidance. The producer's own
  review passed it; an independent evaluator caught that the softened sentence had dropped the
  special-method breadth and the caller-expectation hazard the hard rule named.
- **Task 2** consolidated roughly 82 inline check bullets into a smaller register with a complete
  source-to-target coverage map (every source bullet had a destination row, zero unmapped). An
  independent evaluator still caught that several destinations kept only the broad topic and dropped
  named special-case conditions the sources listed — the map was structurally complete but
  semantically lossy.
- **Task 3** reframed a doc to a pointing structure. Both the producer and the evaluators explicitly
  hunted for this class of drop up front (informed by Tasks 1 and 2), and the result held clean on the
  first pass.

## Reason

If the project ran a single-system review, the Task 1 and Task 2 narrowing would likely have shipped:
in both cases the producer's own structural check (does every source have a destination? does the
softened wording still cover the topic?) passed cleanly. The gap is not a carelessness failure — it is
a category gap. A structural check answers "does a mapping exist" or "is the topic still named"; it
cannot answer "does the destination still enumerate every condition the source named." The second
question needs an independent close-read against the pre-edit source, which is exactly what a second
evaluator, unaware of the first system's structural pass, supplies.

## How

- Treat any doc compaction, consolidation, or reframe as carrying two distinct verification
  questions: (1) STRUCTURAL — does every source have a mapped destination or coverage entry; (2)
  SEMANTIC — does each destination still enumerate every condition the source named, not just its
  topic. A structural pass alone is necessary but not sufficient.
- Run both evaluator systems (Claude and Codex) on every compaction task, and have each diff PRE-edit
  vs POST-edit content for dropped conditions — across BOTH the hard-rule set and the softened-item
  set, not just the hard set.
- When a producer's own review already passed a structural completeness check, treat that as
  necessary evidence, not sufficient evidence, that no evaluator review is needed.
- Build a semantic coverage register once the pattern is known (as Task 3 did): naming what class of
  drop to hunt for, informed by prior tasks in the same session, raises the odds the producer's own
  first pass already catches it.

## Counter-cases

- **A pass that changes only wording, not scope** (a rename, a formatting pass, a typo fix) does not
  need this two-question treatment — there is no source-to-destination condition mapping to check.
- **A single-system session** (deliberate Claude-only run) does not get the cross-system catch this
  learning describes; it still benefits from explicitly running the semantic diff step itself, but
  loses the independent second look that caught these two instances.
- **A greenfield doc with no pre-edit source** has nothing to diff against; this technique applies
  only to edits that consolidate, compact, or reframe existing content.

## Related

- [[gate-c-structural-mapping-is-not-semantic-union-preservation]] — the mistake this learning's
  Task 2 instance produced: a complete coverage map is a structural proof, not a semantic one
- [[softening-can-narrow-scope-like-a-merge]] — the mistake this learning's Task 1 instance produced:
  a hard-to-soft conversion can drop a condition exactly like a merge
- [[consolidating-per-perspective-verification-tables-narrows-the-union]] — the same union-narrowing
  family at whole-table-consolidation granularity, found the same session
