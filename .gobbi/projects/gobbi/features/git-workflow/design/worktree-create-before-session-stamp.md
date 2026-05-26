---
name: worktree-create-before-session-stamp
description: Worktree creation and git.worktreePath stamping happen in the Configuration step before session.json stamps git fields.
type: design
scope: feature
feature: git-workflow
status: locked
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, worktree-first, configuration-step, session-stamp]
design-id: D-1
---

# D-1 — Create worktree and stamp git.worktreePath in the Configuration step

> **Superseded note (2026-05-25):** worktree creation was reordered from row 5.5 to **row 5** in a later bundle (state.json init is now row 5.5). This file records the original bundle-B numbering; see `orchestration/SKILL.md` Step 1 for the current rows.

## Decision

Add worktree creation ("Create worktree and stamp `git.worktreePath`") to the Configuration step in `orchestration/SKILL.md`, between state.json init and the session.json git-fields stamp.

**Branch name at creation**: `chore/session-{date}-{ssid-short}` (e.g., `chore/session-2026-05-23-1b26cf20`)
- Type `chore` is in the registered type registry (`feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style`)
- Description slug `session-{date}-{ssid-short}` satisfies the description-slug regex `[a-z0-9]+(-[a-z0-9]+)*`
- Length: `session-2026-05-23-1b26cf20` = 27 chars (within the 3-50 char limit — PASS)

**Idempotency guard**: skip if `session.json.git.worktreePath` non-null on resume, `/clear`, or `/compact`.

## Rationale

The session.json git-fields stamp needs `git.branch` and `git.worktreePath` to be non-null; worktree creation must therefore precede that stamp. The `chore` type is already in the type registry — no registry extension required.

## Trade-offs considered

- `feat/session-{date}-{ssid-short}` — rejected: `feat` implies a new product feature, not a session-infrastructure branch
- `session/{date}-{ssid-short}` — rejected: `session/` is not in the registered type registry (causes registry validation failure)
- Promote to a higher row — rejected: changes more than necessary; state.json init belongs immediately before worktree creation

## Validation

After Configuration: `jq '.git.branch' session.json` matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`; `jq '.git.worktreePath'` returns non-null.

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/`
