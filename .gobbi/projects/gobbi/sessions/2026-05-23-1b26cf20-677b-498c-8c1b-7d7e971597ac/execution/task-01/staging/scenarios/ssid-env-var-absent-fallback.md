---
scenario: $CLAUDE_CODE_SESSION_ID absent — no fallback documented for row 5.5 branch-name derivation
category: failure-mode
feature: session-foundations-bundle-b
added: 2026-05-24
added_by_session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: uncovered
finding-id: R-001
finding-type: scenario_gap
domain: process
severity: Medium
confidence: 75
disposition: open
source_iter: 1
source_system: claude
source_file: execution/task-01/evaluation/iter1/claude/risk.md
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

Confirm row 5.5 prose (after Task 06 footnote work or a dedicated fix) includes an explicit absent-env-var branch. Check `git/conventions.md` shape regex accepts the materialized branch name in both env-present and env-absent scenarios.

## Related

- `execution/task-01/evaluation/iter1/claude/risk.md` — finding R-001
- Plan Task 06 (LOCK #5 footnote bundle) as the deferred resolution locus
- `git/conventions.md` branch naming rules
