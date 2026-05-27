---
name: migration-smoke-test-post-merge
description: Post-merge smoke test checklist for the worktree-first bootstrap — verifies that session.json carries worktree fields and that generate-now Preparation lands symlinks on the PR diff after the worktree-create row 5.5 ships.
type: checklists
scope: feature
feature: git-workflow
status: open
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [smoke-test, worktree, session-json, generate-now, migration]
domain: process
---

# Worktree-first bootstrap — post-merge migration smoke test checklist

| # | Item | Status | Verification |
|---|---|---|---|
| 1 | After PR merge, run `jq '.git.branch' .gobbi/projects/gobbi/sessions/<latest>/session.json` on the first new session | pending | value matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` |
| 2 | After PR merge, run `jq '.git.worktreePath' .gobbi/projects/gobbi/sessions/<latest>/session.json` on the first new session | pending | value is non-null |
| 3 | On next `generate-now` Preparation, verify PR diff contains skill body AND both symlinks on the worktree branch | pending | git diff shows `+` for both `.claude/skills/{slug}/` and `.agents/skills/{slug}/` |

## Item details

### 1. Branch regex check

**Why this check matters**: The worktree-create design adds a success criterion that after the worktree-creation step lands, new session branches follow the `chore/session-{date}-{ssid-short}` pattern. This smoke test verifies the runtime materializes that branch correctly.

**Verification approach**: `jq '.git.branch' session.json | grep -E '^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$'` on the first session after the worktree-create PR merge.

### 2. worktreePath non-null

**Why this check matters**: The worktree-first design's success criterion is that `session.json.git.worktreePath` is non-null immediately after Configuration. A null value means the worktree-creation step was skipped or failed.

### 3. generate-now PR diff

**Why this check matters**: The motivating failure that led to the worktree-first design was commit `1829fa3`, where Preparation generate-now symlinks created in the main tree missed the PR diff. This check is the structural regression test confirming the fix holds post-merge.

## Related

- Design: `../design/worktree-create-before-session-stamp.md` (the design decision the worktree-creation step implements).
- Witness commit: `1829fa3` (the motivating failure).
