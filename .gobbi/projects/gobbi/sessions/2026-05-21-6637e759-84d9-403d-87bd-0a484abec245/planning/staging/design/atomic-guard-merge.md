---
title: Atomic Guard Merge via `--match-head-commit`
status: accepted
feature: repo-reset
related:
  - planning/artifacts/decisions-log.md
  - ideation/artifacts/scope-contract.md
---

# Atomic Guard Merge via `--match-head-commit`

## Problem

A destructive repo reset PR merged with stale state (a concurrent push to the sweep branch between CI completion and merge) could incorporate unreviewed changes into develop. The original iter4 Ideation decision Q-iter4-Override established the `--match-head-commit "$HEAD_SHA"` guard as the canonical merge primitive.

## Scope

In-scope: the exact merge command and HEAD_SHA capture timing.
Out-of-scope: multi-guard strategies; re-running CI after SHA capture.

## Approach

The manager captures `HEAD_SHA` via `gh pr view <pr-num> --json headRefOid -q .headRefOid` AFTER CI completes (§8) and IMMEDIATELY before merge (§9). The merge command is:

```
gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"
```

`--delete-branch` handles both local and remote sweep-branch cleanup (per D-PLAN-03 / F-CX-O4-01). No redundant `git branch -d <sweep-branch>` is run.

Non-zero exit from the merge command → no retry, no rationalization (per `executor-rationalized-failing-verification-gate.md`); manager re-contracts with the user.

## Trade-offs

Optimizes for: fail-closed on concurrent sweep-branch modification; no silent stale merges.
Sacrifices: slight complexity over plain `gh pr merge --squash`. Accepted — the sweep is destructive; atomicity is mandatory.

## Open issues

None blocking Execution. F-CX-O4-01 (Ideation iter4 Codex, Medium/75) is resolved by D-PLAN-03 (no redundant `git branch -d`).
