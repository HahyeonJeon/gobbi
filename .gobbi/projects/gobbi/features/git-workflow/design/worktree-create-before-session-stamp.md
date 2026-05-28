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

# Create worktree and stamp git.worktreePath in the Configuration step (D-1)

> **Superseded note (2026-05-25):** worktree creation was reordered from row 5.5 to **row 5** in a later bundle (state.json init is now row 5.5). This file records the original numbering; see `orchestration/SKILL.md` Step 1 for the current rows.

## Context

The session.json git-fields stamp writes `git.branch` and `git.worktreePath`, both of which must be non-null. For those values to exist, the worktree must already have been created and its path known. So the Configuration step needed an explicit worktree-creation action placed *before* the session.json git-fields stamp — and a branch-naming scheme that passes the existing branch-type registry and description-slug validation.

## Decision

Add worktree creation ("Create worktree and stamp `git.worktreePath`") to the Configuration step in `orchestration/SKILL.md`, between state.json init and the session.json git-fields stamp.

**Branch name at creation**: `chore/session-{date}-{ssid-short}` (e.g., `chore/session-2026-05-23-1b26cf20`)
- Type `chore` is in the registered type registry (`feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style`)
- Description slug `session-{date}-{ssid-short}` satisfies the description-slug regex `[a-z0-9]+(-[a-z0-9]+)*`
- Length: `session-2026-05-23-1b26cf20` = 27 chars (within the 3-50 char limit — PASS)

**Idempotency guard**: skip if `session.json.git.worktreePath` non-null on resume, `/clear`, or `/compact`.

## Rationale

The session.json git-fields stamp needs `git.branch` and `git.worktreePath` to be non-null; worktree creation must therefore precede that stamp. The `chore` type is already in the type registry — no registry extension required.

## Alternatives considered

- **`feat/session-{date}-{ssid-short}` branch name** — rejected: `feat` implies a new product feature, not a session-infrastructure branch.
- **`session/{date}-{ssid-short}` branch name** — rejected: `session/` is not in the registered branch-type registry, so it would fail registry validation (and block CI/hooks).
- **Placing worktree creation at a higher row in the Configuration step** — rejected: it changes more of the step order than necessary; state.json init belongs immediately before worktree creation.

## Consequences

The Configuration step in `orchestration/SKILL.md` carries the worktree-creation action between state.json init and the session.json git-fields stamp; an idempotency guard skips it when `worktreePath` is already non-null on resume / `/clear` / `/compact`. No branch-type-registry extension is required since `chore` already exists. Verification: after Configuration, `jq '.git.branch' session.json` matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` and `jq '.git.worktreePath'` returns non-null.

## Related

- `discussions/branch-prefix-sub-option.md` — the discussion that selected the `chore/` branch prefix.
- `design/direct-mode-retained-opt-out.md` — the direct-mode guard (D-5) that can skip this creation step.

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/`
