---
name: six-file-lock-untracked-file-detection
description: The six-file lock and landing proof were blind to untracked/gitignored strays; the lock is now directory-membership plus a git ls-files --others leg
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification, security]
keywords: [f3-risk-02, f2-risk-02, ar-7, untracked-file-detection, git-ls-files-others, directory-membership-lock]
author: claude
supersedes: null
superseded_by: null
related: [phase-boundary-supersede-contract-fix]
---

# The six-file lock and landing proof now catch untracked strays

## Context

`idea.md` locks the edit to exactly six `skills/startup/*.md` files (AR-7: a required seventh file must STOP and
escalate to the user). At iter2 the lock was `test ! -e skills/startup/mistakes.md` — one filename — and the
landing proof was `git diff --name-only`, which is blind to untracked and gitignored paths. An executor that
created a seventh startup child WITHOUT `git add`ing it satisfied both checks while still triggering the exact
AR-7 condition the gate exists to detect (`F2-RISK-02`, High/100).

## Decision

The lock is now directory MEMBERSHIP — `find` diffed against the six expected names — plus a
`git ls-files --others` leg over the skills tree that catches an untracked (including gitignored-untracked) stray
anywhere under `skills/startup/`.

## Rationale

A filename-existence check and a tracked-only diff are each individually insufficient for a security/scope-
integrity property (an unauthorized seventh source file); `git status`/`git diff --name-only` cannot see
untracked files at all (`git-gate-blind-to-gitignored-writes`). Live-verified: an untracked
`skills/startup/sets.md` now fails BOTH legs; the OLD `test ! -e mistakes.md` form passed with `sets.md` present.

## Alternatives considered

- **Widen the filename-existence check to a list of forbidden names** — rejected: any new stray filename not on
  the list would still pass; directory membership is the only complete check.
- **Rely on `git diff --name-only` alone** — rejected: this is the exact blind spot the finding identified;
  `git diff` never sees untracked paths.

## Consequences

T9's landing proof and the per-task scope check both now run this two-leg form. Any Execution-time repair that
needs a temporary scratch file under `skills/startup/` must clean it up before the task's Verify step, or the
scope check will correctly fail it.

## Related

- [[phase-boundary-supersede-contract-fix]] — the sibling risk-perspective fix in the same finding family
