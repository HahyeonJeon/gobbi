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
supersedes: null
superseded_by: null
---

# CI symlink integrity check — wrong git command in pseudocode

## Context

The project-level `ci-symlink-integrity-check.md` backlog file includes pseudocode for a pre-commit hook that guards the `.claude/`↔project symlink layer against accidental dereferencing. That pseudocode uses `git ls-files -s` for both the old-mode and staged-mode checks. However, `git ls-files -s` returns the staged (index) mode, not the HEAD/last-commit mode — so comparing staged to itself would never detect the `120000 → 100644` transition (a symlink silently replaced by a regular file). The integrity check, as written, cannot fire on the very failure mode it exists to catch.

## Why deferred

Accepted as non-blocking: the integrity-check backlog itself is deferred (it has zero current witnesses — no CI symlink breakage has been observed — so Principle 10 keeps it un-built). The pseudocode is already labeled "Pseudocode — exact diff plumbing depends on the chosen pre-commit framework," so the wrong-command error is contained inside a not-yet-implemented sketch. Fixing the plumbing only matters once someone implements the check, so the fix is carried as a note on the deferred parent rather than acted on now.

## When to pick up

When the `ci-symlink-integrity-check` backlog is itself picked up and implemented. The plumbing must be corrected before the check ships — otherwise the guard is inert.

## Suggested approach

Correct the old-mode detection to read the committed mode rather than the staged mode: use `git diff --cached --raw` (which reports both the old and new mode per path) or `git ls-tree HEAD <path>` for the committed mode versus `git ls-files --stage <path>` for the staged mode. Compare the two so a `120000 → 100644` transition is detected.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Related

- [`../../../backlogs/ci-symlink-integrity-check.md`](../../../backlogs/ci-symlink-integrity-check.md) — the project-level backlog whose pseudocode this entry corrects

## Source

Surfaced during install-runtime preparation evaluation (session 1b26cf20).
