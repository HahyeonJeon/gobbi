---
name: ssid-env-var-absent-fallback
description: Failure-mode scenario where $CLAUDE_CODE_SESSION_ID is absent at row 5.5 branch-name derivation time — no fallback currently documented, which would produce a malformed branch name.
type: scenarios
scope: feature
feature: git-workflow
status: uncovered
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [env-var, ssid, branch-naming, failure-mode, row-5-5]
category: failure-mode
domain: process
---

# `$CLAUDE_CODE_SESSION_ID` absent — branch-name derivation fallback

**Category:** failure-mode
**Coverage:** uncovered

## Situation

The manager is executing the Configuration Step 1 worktree-creation step in a Codex environment or a Claude Code build that does not inject `$CLAUDE_CODE_SESSION_ID`. The step specifies `{ssid-short} = first 8 characters of $CLAUDE_CODE_SESSION_ID` but does not define a fallback when the env var is absent or empty. The manager has no documented recovery path and would produce a trailing-hyphen branch name (`chore/session-YYYY-MM-DD-`) that fails the `git/conventions.md` shape regex.

## Inputs

- `$CLAUDE_CODE_SESSION_ID` is empty/unset
- `git.workflow.mode` is `worktree-pr`
- Manager is following row 5.5 literally

## Expected behavior

The worktree-creation step should specify a fallback: if `$CLAUDE_CODE_SESSION_ID` is absent, derive `{ssid-short}` from `openssl rand -hex 4` (or equivalent) and proceed. This mirrors how the session-stamp step handles an absent `transcriptPath` by leaving it `null`.

## Verification

Confirm the worktree-creation prose (after a dedicated fix task or footnote addition) includes an explicit absent-env-var branch. Check that the `git/conventions.md` shape regex accepts the materialized branch name in both env-present and env-absent scenarios.

## Related

- `git/conventions.md` branch-naming rules.
- Backlog: `../backlogs/abort-mid-commit-partial-session.md` (related recovery-path coverage gap).
- Surfaced by a risk-evaluation finding during the worktree-first session-architecture work (session `1b26cf20`, 2026-05-24).
