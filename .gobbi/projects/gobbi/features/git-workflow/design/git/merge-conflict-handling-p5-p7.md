---
name: merge-conflict-handling-p5-p7
description: DD-4 — Add merge-conflict handling to the P5/P7 procedure family for both base-sync and PR-branch conflicts
type: design
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git]
keywords: [merge-conflict, p5, p7, runtime-neutral]
author: claude
supersedes: null
superseded_by: null
related: []
---

# DD-4 — Add merge-conflict handling to the P5/P7 procedure family

## Problem

The current git skill's Failure-Modes table (`SKILL.md:228-240`) covers 7 failures but NOT merge
conflicts. P5 (land PR) and P7 (CI failure) have no conflict recovery path. This is a gap in the
inventory (S10 scenario) — a common git failure with no documented recovery.

## Scope

In-scope: runtime-neutral conflict recovery for (a) base-sync conflicts (during P2 step-1
`git pull --ff-only` / pre-merge base sync) and (b) PR-branch conflicts (during P5 pre-merge gate
or P7 CI-driven). Out-of-scope: runtime-specific conflict tools or UI-level merge UIs.

## Approach

Conflicts surface to the manager; resolution happens in the worktree by the executor, then re-verify.
The manager/subagent split (INT-1) governs who resolves: the executor works in the worktree;
the manager coordinates the resolve-then-re-verify cycle.

Insertion points:
- P5 pre-merge gate checklist: add a conflict check before `gh pr merge`.
- P7 CI failure path: add a conflict detection step if CI fails on a conflict-caused error.

## Scenarios

Resolves C15 (merge-conflict handling). Anchors S10.

## Validation

A conflict scenario has a documented recovery path in the P5/P7 family. A reader can follow
the recovery procedure from conflict detection to successful merge without consulting external docs.

## Trade-offs

Runtime-neutral: the same procedure applies on both runtimes because conflict resolution is a local
git operation (no network needed until the re-push step, which follows the DD-2 pattern).
