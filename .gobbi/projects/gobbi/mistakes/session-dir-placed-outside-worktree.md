---
name: session-dir-placed-outside-worktree
description: Manager bootstrap placed the session directory at the main-tree path instead of inside the worktree in worktree-pr mode.
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-24
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [session-lifecycle, worktree, bootstrap, orchestration]
priority: medium
domain: process
supersedes: null
superseded_by: null
---

# Manager bootstrap placed session dir outside the worktree in worktree-pr mode

## What happened

During Configuration Step 1 rows 5 and 6, the manager wrote `state.json`, `settings.json`, and `session.json` to the **main-tree absolute path** (`.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-.../`). The session was running in `worktree-pr` mode with `session.json.git.worktreePath` already resolved to the worktree root. Subsequent Ideation iter1/iter2 leader artifacts and the iter2 dual-system evaluation artifacts inherited the wrong location, all landing under the main-tree session dir rather than inside the worktree.

The user flagged it after the dual-system evaluators were dispatched. The manager had to move the entire session directory tree from the main-tree path into the worktree.

## User feedback

The user explicitly flagged the misplacement after evaluator outputs landed in the wrong location. The correction was: move the session directory tree from the main-tree `.gobbi/projects/gobbi/sessions/…` path into `<worktreePath>/.gobbi/projects/gobbi/sessions/…` before continuing.

## Why it happens

The orchestration skill's Configuration Step 1 procedure (rows 5 and 6) specifies the session-file path as `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/...` — a **relative** path with no explicit tree qualifier. The manager resolved the relative path against the current working directory (the main tree, where the session started), not against `session.json.git.worktreePath`.

The qualified absolute-root rule lives in `git/SKILL.md` § Memory Access Matrix (`**Critical rule — write paths**` at line 33) and bundle-B design doc `d-2-qualified-git-rule.md`. The manager either failed to load that rule before bootstrap, or loaded it but did not apply it to Configuration rows 5 and 6 because the orchestration rows themselves do not cite the qualifier inline.

A compounding factor: prior sessions used `worktreePath: null` (direct mode), so every session a fresh manager could inspect for the convention was a direct-mode session where main-tree placement was correct. The divergence only surfaces in `worktree-pr` mode.

The row-ordering tension makes this structurally fragile: row 5 (state.json) fires before row 5.5 (worktree create), so the worktree doesn't exist when row 5 resolves the write path.

## Correct approach

At Configuration Step 1, **before running rows 5 and 6**:

1. Check `settings.git.workflow.mode`. If `worktree-pr`, compute the absolute write-root: `<worktreePath>/.gobbi/projects/{project-name}/sessions/{date}-{session-id}/`.
2. Reorder row 5.5 (worktree create) to **before** row 5 so `worktreePath` is known when row 5 writes state.json.
3. Row 5 path-resolution: if `worktreePath` is set, write to `<worktreePath>/.gobbi/...`; if null (direct mode), write to main-tree `.gobbi/...`.
4. Row 6 path-resolution: identical to row 5.

For immediate remediation when this is caught mid-session: move the entire session directory tree from the main-tree path into the worktree path using `mv`. Since `.gobbi/projects/` is whitelisted in the repo's gitignore (`!.gobbi/projects/`), the moved dir at the worktree path will be a tracked path that `git -C "$worktreePath" add` can include.

The orchestration skill text (rows 5 and 6) must cite the qualified absolute-root rule inline with a direct pointer to `git/SKILL.md` § Memory Access Matrix and to `d-2-qualified-git-rule.md`.

## How to detect

Signs that you are about to hit this trap:

- You are in `worktree-pr` mode and about to run Configuration Step 1 rows 5–6.
- The orchestration skill's row 5 says "write `.gobbi/projects/{project-name}/sessions/…`" without a tree qualifier.
- `session.json.git.worktreePath` is already resolved but the row doesn't reference it for the write path.

If after Configuration you notice that session artifacts (state.json, session.json, evaluation outputs) are appearing at `<main-tree>/.gobbi/projects/gobbi/sessions/…` rather than `<worktreePath>/.gobbi/…`, the misplacement has occurred and needs immediate remediation (mv + re-commit).

## Related

- `codex-subprocess-writes-to-main-tree.md` — the session that surfaced this mistake also saw evaluator subagents (both Claude and Codex legs) write EVAL artifacts to the main tree; same root cause (CWD defaults to main tree, path macros aren't resolved by subagents).
- `d-2-qualified-git-rule.md` in `features/session-foundations-bundle-b/design/` — the qualified absolute-root rule this violates.
- `d-4-per-iter-session-commit.md` — `git -C "$worktreePath" add` cannot see session memory placed outside the worktree; this mistake silently breaks the per-iter commit cadence.
