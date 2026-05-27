---
name: build-on-272-branch-defer-merge
description: User decided to build the memory standard on the #272 branch and defer the merge to develop.
type: discussions
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [branch, merge, pr272, worktree]
outcome: Work inside the existing #272 worktree; structure + content land together; merge later; #272 re-home + renames NOT re-litigated.
---

# Build on #272 branch, defer merge to develop

## Context

PR #272 ships the 7-capability re-home + naming standard. It was open and mergeable on develop
at session start. The question was whether to merge first, then build, or continue inside the
#272 worktree.

## Question

Merge #272 to develop then build on develop / build on the #272 branch and defer merge /
re-judge #272's structure.

## Options considered

- **Option A (merge-first):** merge #272 to develop, then start content work on a fresh
  branch. Clean base; standard and retrofit land separately from the structural re-home.
- **Option B (build on #272):** work inside the existing #272 worktree. Structure + content
  land in the same PR. Merge-back reconciliation deferred.
- **Option C (re-judge):** re-evaluate #272's 7-capability structure before building on it.

## User decision

"Build on #272 branch, defer merge."

## Implication

- All content work (standard, conformance wave, prose wave) is done inside the #272 worktree
  (`chore/session-2026-05-25-a10c82d6`).
- The 7-capability re-home and #272 renames are NOT re-litigated.
- P13 + 13-type taxonomy + the re-home exist ONLY on this branch until #272 merges to develop.
- The `rules.md` edit must be kept additive to minimize merge-conflict surface.
- The merge-back-to-develop reconciliation is a Planning/handoff item, not an Execution gate.

## Related

- [symlink-edit-target-merge-back-flag](../checklists/symlink-edit-target-merge-back-flag.md) — the checklist capturing the additive-edit / merge-back discipline this decision requires
- [conformance-first-then-prose](2026-05-26-conformance-first-then-prose.md) — the sibling sequencing discussion from the same session

## Source

Originating session `b0a0eaf9-03f7-4dce-a040-c7443653a459` (see the `session` frontmatter field) — Ideation DISCUSSION Q3 (starting point relative to PR #272).
