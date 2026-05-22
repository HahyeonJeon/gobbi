---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
supersedes: null
superseded_by: null
disposition: addressed
addressed_by: iter2 Pre-routed gaps section (preparation/artifacts/pre-routed-gaps.md § F-CX-PREP-O-02)
finding_id: F-CX-PREP-O-02
severity: Medium
confidence: 75
---

# F-CX-PREP-O-02: Augment Stage B deletion inventory with project.json

## Context

Current `git status --short` shows ` D .gobbi/projects/gobbi/project.json` (worktree-deleted, not yet staged) alongside ` D .claude-plugin/marketplace.json`. The iter1 Preparation draft only acknowledged `.claude-plugin/marketplace.json` as already-deleted-in-tree. The Implementation Checklist's Stage B deletion inventory under-counts by one file.

`project.json` is a tracked file (confirmed via `git ls-files`); it is not gitignored. Both files will be captured by `git add -A` at the Stage B commit point automatically.

## Decision

Planning's Stage B task description (or equivalent deletion inventory) MUST explicitly enumerate BOTH `.claude-plugin/marketplace.json` AND `.gobbi/projects/gobbi/project.json` as already-deleted-in-worktree. No separate `rm` action is needed — `git add -A` handles both.

## Rationale

The risk is cognitive only: if an executor verifying "all deletions accounted for" sees an unexpected `project.json` deletion in the diff, they may flag it as out-of-scope drift and NEEDS_CONTEXT unnecessarily. Pre-announcing the deletion in the task description prevents false alarms with zero executor overhead.

## Alternatives considered

Treating the omission as too minor to stage. Rejected: the Codex evaluator specifically identified it as a Medium/75 planning-checklist gap, and the one-line correction costs nothing.

## Consequences

One-line addition to the Planning-inherited Stage B task description. No executor action, no extra `git rm`, no sweep modification.

## Related

- `preparation/artifacts/pre-routed-gaps.md` § F-CX-PREP-O-02
- `ideation/artifacts/implementation-checklist.md` Stage B / Stage F
- `preparation/evaluation/iter1/codex/overall.md`
