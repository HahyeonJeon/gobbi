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

# Scenario: $CLAUDE_CODE_SESSION_ID Absent — Branch Name Derivation Fallback

## Situation

The manager is executing Configuration Step 1 row 5.5 in a Codex environment or a Claude Code build that does not inject `$CLAUDE_CODE_SESSION_ID`. Row 5.5 specifies `{ssid-short} = first 8 characters of $CLAUDE_CODE_SESSION_ID` but does not define a fallback when the env var is absent or empty. The manager has no documented recovery path and would produce a trailing-hyphen branch name (`chore/session-YYYY-MM-DD-`) that fails the `git/conventions.md` shape regex.

## Inputs

- `$CLAUDE_CODE_SESSION_ID` is empty/unset
- `git.workflow.mode` is `worktree-pr`
- Manager is following row 5.5 literally

## Expected behavior

Row 5.5 should specify a fallback: if `$CLAUDE_CODE_SESSION_ID` is absent, derive `{ssid-short}` from `openssl rand -hex 4` (or equivalent) and proceed. This mirrors how row 6 handles `transcriptPath` absent by leaving `null`.

## Verification

Confirm row 5.5 prose (after a dedicated fix task or footnote addition) includes an explicit absent-env-var branch. Check `git/conventions.md` shape regex accepts the materialized branch name in both env-present and env-absent scenarios.

## Related

- `git/conventions.md` branch naming rules
- Backlog: `backlogs/abort-mid-commit-partial-session.md` (related recovery-path coverage gap)
- Session risk evaluation finding that surfaced this gap: risk finding R-001
