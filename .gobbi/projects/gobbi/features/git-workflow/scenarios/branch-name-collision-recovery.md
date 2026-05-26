---
scenario: Branch name collision when chore/session-{date}-{ssid-short} already exists
category: failure-mode
feature: git-workflow
added: 2026-05-24
added_by_session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: uncovered
finding-id: R-002
finding-type: scenario_gap
domain: process
severity: Low
confidence: 50
disposition: open
source_iter: 1
source_system: claude
source_file: execution/task-01/evaluation/iter1/claude/risk.md
---

# Scenario: Branch Name Collision — `chore/session-{date}-{ssid-short}` Already Exists

## Situation

A prior session at the same date with the same 8-char ssid prefix left an existing branch (e.g., due to a resume case where the idempotency guard misfired, or a manual git branch creation). When the manager invokes row 5.5 for a new session, `git worktree add -b chore/session-{date}-{ssid-short}` fails with "branch already exists". Row 5.5 does not document this scenario; P2's collision handling is not explicitly confirmed to cover it.

## Inputs

- `git.workflow.mode` is `worktree-pr`
- `session.json.git.worktreePath` is null (fresh session, not a resume)
- A git branch `chore/session-{date}-{ssid-short}` already exists from a prior operation

## Expected behavior

Row 5.5 or P2 should define behavior: (a) verify P2 handles branch-exists collision gracefully, or (b) add a collision-detection branch to row 5.5 before invoking P2. Manager should not be stuck mid-Configuration with no documented recovery.

## Verification

Read `git/SKILL.md` P2 (line 153+) to confirm whether P2 handles the branch-already-exists case. If P2 does not cover it, file a backlog item against P2 or against row 5.5.

## Related

- `execution/task-01/evaluation/iter1/claude/risk.md` — finding R-002
- `git/SKILL.md` P2 — the invocation target whose collision handling is unconfirmed
