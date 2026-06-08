---
name: asserted-git-drift-direction-without-running-git
description: Leader asserted git-drift direction (worktree clean / main-tree drifted) from a harness system-reminder instead of running git commands; the claim was factually inverted.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-07
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [process, git, verification, drift]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Asserted Git Drift Direction Without Running Git

## What happened

In Preparation iter1, the leader's readiness report stated that the worktree was "clean" and that the main-tree had drifted (adding a Continue-vs-Fresh sentence and a `[claude skill]` nav-table row). This was factually inverted. The truth: the worktree was 1 commit BEHIND origin/develop — #295 (c8a8654) had added the continued-teammate sentence to develop, but the stale worktree lacked it. The `[claude skill]` nav-table row was present in BOTH trees and was not a drift item at all. The leader's claim that "grep Continue vs Fresh = 0" was true but was misread as evidence the worktree was current, when it actually proved the worktree was stale.

The Claude evaluator (iter1) flagged this as a High finding (F-C1, confidence 100) calling the claim "factually inverted and partly fabricated." The Codex evaluator (iter1) flagged the nav-row overstatement as a Low. The manager rebased the worktree between iters, and the corrected iter2 report accurately stated the true base state.

## Why it happens

The leader inferred the worktree's git position from the harness's system-reminder, which included context about the main-tree status (git status output, recent commits). A system-reminder that describes the main-tree's git state does NOT describe the worktree's position relative to origin/develop. The leader assumed "system-reminder says develop has recent commits → the worktree is current" — that assumption is wrong. The worktree is a separate git checkout; its ahead/behind status relative to origin/develop requires a dedicated git command.

## Correct approach

Before making any claim about a worktree's ahead/behind position or drift direction relative to origin/develop:

1. Run `git rev-list --left-right --count HEAD...origin/develop` in the worktree to determine ahead/behind.
2. If behind, run `git log HEAD..origin/develop --oneline` to see what commits develop has that the worktree lacks.
3. Run `git show --stat <commit>` on each such commit to confirm which files changed.
4. Only then state the drift direction and affected files.

Never infer the worktree's position from a system-reminder that describes the main-tree or the harness environment.

## How to detect

Any claim about a worktree's ahead/behind position or drift direction relative to origin/develop MUST cite output from `git rev-list --left-right --count HEAD...origin/develop` or `git rev-list --count HEAD..origin/develop` run inside the worktree — not from a system-reminder, a file-content mention, or an inference from the main-tree's commit log.

Trigger signals:
- The leader states a worktree is "clean" or "current" without citing a git command.
- The leader identifies a "drift item" (a line present in main-tree but absent from worktree, or vice versa) without running `git diff origin/develop` or `git show --stat <commit>` to confirm direction.
- The evidence cited for a drift claim is a grep result (zero or nonzero hits) rather than a direct git comparison.

## Related

- `mistakes/leader-iter2-verification-claim-without-evidence.md` — same pattern: claiming empirical verification without actually running the authoritative command. That mistake covers vocabulary/enumeration fixes; this one covers git-position/drift-direction claims.
- `mistakes/planning-leader-asserted-file-type-without-verifying.md` — same root: asserting a fact about a codebase artifact from context rather than direct inspection.
