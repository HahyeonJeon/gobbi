---
name: gitignore-aware-residual-gate
description: Residual-reference gates in a worktree session must use git grep (tracked files only) — plain grep false-counts gitignored session records and can never read clean.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-27
session: b5601d38-c988-4f53-b34b-9ace12a55c25
tags: [verification, process]
keywords: [git-grep, residual-gate, gitignore, worktree, refactor-verification]
author: claude
priority: high
domain: process
---

# Use `git grep` for residual gates inside a worktree session

## What happened

During the Ideation loop for this session, the iter1/iter2 plan used `grep -rn '.' | grep -v worktrees` to verify "zero residual `gobbi-hook-authoring` references." Running this command in the worktree returned ~97 false hits from the gitignored `sessions/` record (which contains the live ideation draft, evaluation files, and staging) plus ~54 hits from the `worktrees/` tree. The gate could never read clean because it was scanning gitignored paths. The verification criterion was unverifiable throughout the session until the command was changed to `git grep`.

## Why it happens

Plain `grep -rn` recurses into all paths, including gitignored ones. In this repo, `.gitignore` excludes `.gobbi/projects/*/sessions/` and `.gobbi/projects/*/worktrees/`. During a worktree session the live draft, evaluation files, and staging documents contain the very string being gated against. The `grep -v worktrees` exclusion is insufficient: it strips one directory name but not the `sessions/` tree. The count can never reach zero during the session, making the gate unverifiable.

## Correct approach

All "zero residual references" success criteria in a worktree session MUST use `git grep` (which scans only tracked files, naturally excluding gitignored paths). The check reads: "hits appear ONLY in the N allowlisted historical records; ZERO on live/active surfaces."

Concretely:
1. Use `git grep -n 'PATTERN'` (from the repo root or worktree root — both work).
2. Enumerate the allowlist of tracked historical files that legitimately contain the pattern (e.g., old `decisions/` or `notes/` records that documented the renamed thing).
3. Confirm that all hits appear only in the allowlisted files.

No `grep -v` exclusion chain is needed. `git grep` is gitignore-aware by construction.

## How to detect

A refactor plan or task description that:
- Uses `grep -rn .` or `grep -rn . | grep -v {X}` to verify zero residual references
- Does NOT start with `git grep`

If the grep command does not start with `git grep`, it will likely false-fail on gitignored session content in a worktree session. The trigger signal is seeing unexpectedly high hit counts (tens or hundreds) when the refactor should be nearly done.

## Related

- [[frozen-history-by-doc-type-not-dir]] — companion mistake: the allowlist itself must be computed by doc-type and claim-tense, not directory
- [[grep-absence-claim-needs-exact-pattern]] — adjacent verification trap: absence claims need exact pattern matching
