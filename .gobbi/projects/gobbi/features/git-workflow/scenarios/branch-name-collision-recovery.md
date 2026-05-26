---
name: branch-name-collision-recovery
description: Scenario covering recovery when chore/session-{date}-{ssid-short} already exists at row 5.5 worktree creation time — P2 collision handling not yet confirmed.
type: scenarios
scope: feature
feature: git-workflow
status: uncovered
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [branch-collision, worktree, failure-mode, row-5-5, p2]
category: failure-mode
domain: process
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

- `git/SKILL.md` P2 — the invocation target whose collision handling is unconfirmed
- Session risk evaluation finding from the worktree-create session: risk finding R-002
