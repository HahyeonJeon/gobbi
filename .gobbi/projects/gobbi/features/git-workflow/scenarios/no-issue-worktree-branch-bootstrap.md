---
name: no-issue-worktree-branch-bootstrap
description: Edge-case scenario where a non-feature session (no issue/task slug) boots a worktree on chore/session-* branch — verifying the branch satisfies git/conventions.md without requiring an issue number.
type: scenarios
scope: feature
feature: git-workflow
status: covered
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [non-feature-session, chore-branch, worktree, row-5-5]
category: edge-case
domain: process
---

# Non-feature session: no issue/task slug dependency at row 5.5

## Situation

A session that is not associated with a GitHub issue or a task slug (e.g., investigation, mistake-promotion, doc-lookup, or refactor-only session) boots via `/gobbi`. Configuration Step 1 reaches row 5.5 and must create a worktree. Under a prior branch naming proposal of `session/{date}-{ssid-short}`, the branch type `session/` was not in the `git/conventions.md` type registry. The locked form `chore/session-{date}-{ssid-short}` uses `chore` which does not require an issue number.

## Inputs

- Session started with `/gobbi` without a linked issue or task
- `session.json.git.issue` is null
- Row 5.5 is reached

## Expected behavior

Row 5.5 creates a worktree on branch `chore/session-{date}-{ssid-short}` (e.g., `chore/session-2026-05-23-1b26cf20`). No issue number prefix is expected or required. The branch name satisfies the `git/conventions.md` type regex for `chore/` and the slug `session-...` satisfies the 3-50 char length constraint.

## Verification

Post-merge smoke test: `jq '.git.branch' session.json` matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`.

## Related

- `git/conventions.md` branch naming rules (chore/ type, slug length)
- Smoke test checklist: `checklists/migration-smoke-test-post-merge.md`
- Evaluation finding from the worktree-create session: Codex project finding COD-PROJ-002
