---
name: session-dir-placed-outside-worktree
description: Manager bootstrap created the session directory at the main-tree absolute path despite worktree-pr mode being active; should have used `session.json.git.worktreePath` as the absolute root per the qualified git/SKILL.md rule (D-2) and so that D-4's `git -C "$worktreePath" commit` can include the session memory.
mistake-candidate: true
domain: session-lifecycle
scope: project
status: open
severity: medium
confidence: 95
created: 2026-05-24
session-id: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
project: gobbi
feature: session-foundations-bundle-c
anchor_session: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
---

# Manager bootstrap placed session dir outside the worktree in worktree-pr mode

## What went wrong

During Configuration Step 1 rows 5 and 6, the manager wrote `state.json`, `settings.json`, and `session.json` to the **main-tree absolute path** `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-.../`. The session was running in `worktree-pr` mode with `session.json.git.worktreePath` already resolved to `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/`. Subsequent Ideation iter1/iter2 leader artifacts and the iter2 dual-system evaluation artifacts inherited the wrong location, all landing under the main-tree session dir rather than inside the worktree.

The user flagged it after the dual-system evaluators were dispatched.

## Why it went wrong

The orchestration skill's Configuration Step 1 procedure (rows 5 and 6) specifies the session-file path as `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/...` — a **relative** path with no explicit tree qualifier. The manager resolved the relative path against the **current working directory** (the main tree, where the session started), not against `session.json.git.worktreePath`. The qualified absolute-root rule lives in `git/SKILL.md` § Memory Access Matrix Critical-Rule + bundle-B design doc D-2 (`d-2-qualified-git-rule.md`) — the manager either failed to load that rule before bootstrap, or loaded it but did not apply it to Configuration row 5/6 because the orchestration rows themselves do not cite the qualifier inline.

Bundle B's own session (2026-05-23-1b26cf20) ran in **direct mode** with `worktreePath: null`, so its session dir at the main tree was correct under the fallback. That precedent masked the worktree-pr divergence: every prior session a fresh manager could inspect for the convention happened to be a direct-mode session.

D-4 (`d-4-per-iter-session-commit.md`) makes the consequence concrete: per-iter MEMORIZATION commits run via `git -C "$worktreePath" add <session-memory-deltas>` + `git -C "$worktreePath" commit -m "chore(session): record <loop> iter{n} memory"`. For those commits to actually include session memory, the session memory must live inside `$worktreePath` — otherwise `git add` from `-C "$worktreePath"` will not see the files. The main-tree placement silently breaks D-4's per-iter commit cadence; the breakage only surfaces when the first commit is attempted.

## How to recognize the situation before making the same mistake

At Configuration Step 1, **before** running rows 5 and 6:

1. Read `session.json.git.workflow.mode` from the resolved settings (or compute it from `settings.git.workflow.mode`). If `worktree-pr`:
2. Compute the absolute write-root: `$worktreePath/.gobbi/projects/{project-name}/sessions/{date}-{session-id}/`. The worktreePath is determined by P2 before row 5 is reached only if row 5.5 ran first; row 5 currently precedes row 5.5 so the worktree does not yet exist when row 5 fires.

The conflict: orchestration row order is 5 (state.json) → 5.5 (worktree create) → 6 (session.json). State.json gets written before the worktree exists. Either:

- **Option A**: state.json + settings.json go to the main tree at row 5 (because worktree doesn't exist yet), then move into the worktree at row 5.5 after creation.
- **Option B**: Reorder — promote 5.5 to 5, write everything inside the worktree from the start.
- **Option C**: Write state.json to a temp location at row 5, move into worktree after row 5.5.

The skill text does not yet specify which option applies. **This is a documentation gap in orchestration/SKILL.md** — the qualified absolute-root rule needs to be cited inline in rows 5 and 6, with an explicit procedure for handling the row-5-before-worktree-exists ordering.

## Corrected approach

For this session, the corrective action is to **move the entire session directory tree** from `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-.../` to `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-.../`. Since `.gobbi/projects/` is whitelisted in the repo's gitignore (`!.gobbi/projects/`), and `.gobbi/projects/*/sessions/` is not in the ignore list, the moved dir at the worktree path will be a tracked path that D-4's `git -C "$worktreePath" add` can include.

For future sessions, the manager bootstrap procedure should be amended so:

1. When `settings.git.workflow.mode == "worktree-pr"`, row 5.5 (worktree create) is moved to **before** row 5, so `worktreePath` is known when row 5 writes state.json.
2. Row 5 path-resolution: read `session.json.git.worktreePath` (or compute pre-stamp); if set, write to `<worktreePath>/.gobbi/...`; if null (direct mode), write to main-tree `.gobbi/...`.
3. Row 6 path-resolution: identical to row 5 (consistent absolute root).
4. The orchestration skill text (rows 5 and 6 in particular) cites the qualified absolute-root rule inline with a direct pointer to `git/SKILL.md` § Memory Access Matrix Critical-Rule and to `d-2-qualified-git-rule.md`.

This mistake is staged here as a `mistake-candidate`; Wrap-up promotes to `.gobbi/projects/gobbi/mistakes/session-dir-placed-outside-worktree.md` after user-confirmed scope.

## Related

- [[d-2-qualified-git-rule]] — the qualified absolute-root rule
- [[d-4-per-iter-session-commit]] — the per-iter MEMORIZATION commit cadence that depends on session dir being inside the worktree
- [[d-1-worktree-row-5-5]] — the worktree-creation row; ordering tension with row 5 surfaces this mistake
