---
name: task-09-surfaces-verify-false-pass
description: Task-09 verifies clause uses 'surfaces' which pre-exists in wrap-up/SKILL.md, giving a false green regardless of whether the handoff mechanic was added
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [planning, verification, docs-sync, wrap-up]
decision_status: accepted
supersedes: null
superseded_by: null
---

# Task-09 `surfaces` verify clause false-passes on a pre-existing token

## Context

Planning iter1 identified (STRUCT-4) and iter2 confirmed (STRUCT-2-iter2) that task-09's `verifies` command included `grep -qiE '... | surfaces' skills/wrap-up/SKILL.md`. The word "surfaces" already appears 2 times in the current `wrap-up/SKILL.md` as incidental usage (e.g., "an evaluator finding that surfaces a new promotable item"), so the clause passes BEFORE task-09 adds the D-d "shown to the session" handoff mechanic. The iter2 changelog claimed this was addressed by the path-root/gate fixes, but the iter2 Claude evaluator disputed that claim — the `surfaces` false-pass was unchanged in iter2.

## Decision

The quick-patch (D16) removed the over-broad `surfaces` alternative from task-09's verify and added a phrase unique to the new handoff step plus an `evaluation.md` content assertion. The finding was resolved in the quick-patch before the loop closed.

## Rationale

A verify that passes before the task is executed provides no guarantee the specified deliverable was implemented. Checklist item 8 (handoff "shown to session") is a real success criterion; anchoring on a pre-existing incidental token defeats the verification gate.

## Alternatives considered

- Accept the false-pass (rejected: the Execution manager has no machine-checkable proof the handoff step shipped).
- Add a more specific phrase unique to the new handoff step (chosen, applied in quick-patch).

## Consequences

Task-09's verify now anchors on a phrase that can only be present after the D-d handoff step is written. The verification gate is now an accurate acceptance criterion.

## Related

- `3-planning/evaluation/iter1/claude/structure.md` § STRUCT-4
- `3-planning/evaluation/iter2/claude/structure.md` § STRUCT-2-iter2
- `3-planning/working/draft-iter2.md` § Decisions log D16
