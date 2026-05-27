---
name: ci-symlink-backlog-pseudocode-plumbing
description: CI symlink integrity check pseudocode uses wrong git command for old-mode detection
type: backlogs
scope: feature
feature: install-runtime
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [ci, symlink, git, pseudocode, backlog]
disposition: open
---

# CI symlink integrity check — wrong git command in pseudocode

## Context

The `ci-symlink-integrity-check.md` backlog file includes pseudocode for a pre-commit hook. The pseudocode uses `git ls-files -s` for both old_mode and staged_mode checks. However, `git ls-files -s` returns the staged (index) mode, not the HEAD/last-commit mode — so comparing staged to itself would never detect the `120000 → 100644` transition. Correct implementation should use `git diff --cached --raw` or `git ls-tree HEAD <path>` (for old mode) vs `git ls-files --stage` (for staged mode).

## Decision

Accepted as non-blocking. The backlog is deferred (zero current witnesses; Principle 10 applies). The pseudocode is labeled "Pseudocode — exact diff plumbing depends on the chosen pre-commit framework." Future pick-up of this backlog must fix the plumbing before implementing.

## Why deferred

This is speculative (the backlog is deferred and no implementation exists). The acknowledgment in the backlog file is sufficient for a deferred item.

## Consequences

When the CI backlog is picked up, the implementer must correct the pseudocode to use `git diff --cached --raw` (or equivalent) for old-mode detection rather than `git ls-files -s` twice.

## Related

- `features/install-runtime/backlogs/` (parent feature backlog context)

## Source

Surfaced during install-runtime preparation evaluation (session 1b26cf20).
