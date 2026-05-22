---
loop: ideation
iter: 4
artifact_type: scenarios
created_at: 2026-05-21
status: final
related:
  - ideation/artifacts/scope-contract.md
  - ideation/artifacts/implementation-checklist.md
  - ideation/rawdata/draft-iter4.md
---

# Scenarios — Repo Reset (iter4 PASS)

All scenarios from draft-iter4.md § Scenarios, including iter4's S6b update.

| Scenario | Type | Description | Verification |
|---|---|---|---|
| S1 | Golden | Single squashed sweep commit lands on `develop` via PR; post-merge `git status` clean; `.claude/skills/+agents/` symlinks all resolve. | `find .claude/{skills,agents} -xtype l` returns empty; `git status` clean. |
| S2 | Golden | Current session dir `2026-05-21-6637e759-...` retained; no other session dirs remain (including the bare-UUID sibling and the prior date-prefixed `2026-05-21-c676684d-...`). | `ls .gobbi/projects/gobbi/sessions/` shows exactly one entry. |
| S3 | Golden | `pre-reset-2026-05-21` tag exists at `487fc35` locally and on origin BEFORE the PR opens. | `git rev-parse pre-reset-2026-05-21` → `487fc35`; `git ls-remote --tags origin` includes the tag. |
| S3b | Golden | (iter2 H-1) Post-sweep `.claude/CLAUDE.md` no longer contains the two `v050-{overview,cli}.md` table rows. | `grep -nE '\[`v050-(overview\|cli)\.md`\]' .claude/CLAUDE.md` → empty. |
| S4 | Edge | Worktree at `.gobbi/projects/gobbi/worktrees/redesign-v050-ideation` has an uncommitted dirty tree. | Executor runs `git -C <wt> status` first; if dirty, NEEDS_CONTEXT to user; else `git worktree remove`. |
| S5 | Edge | `.gitignore` line removal precedes the new `sessions/` content being staged. If sequence inverted, `git add .gobbi/projects/gobbi/sessions/` is a no-op (still ignored), and the kept session dir doesn't enter the commit. | Plan orders: (a) edit root `.gitignore`, (b) verify with `git check-ignore`, (c) `git add` session dir. |
| S6 | Edge | **(iter3 Q-Gate-Redesign)** CLI's live bare-UUID session dir `6637e759-...` deletion mid-workflow could cause the CLI to lose track of the session. Resolved by Stage E.2: bare-UUID delete is a terminal post-commit FS-only operation, gated by TWO non-circular pre-conditions — (1) `git log --format=%H -1 <sweep-branch>` returns a non-empty SHA, AND (2) `git ls-tree <sweep-branch> <kept-session-dir>/` returns a non-empty result. The sweep SHA is NOT written into any file. On gate failure: NEEDS_CONTEXT. | Executor runs the two `git` commands; both must succeed before `rm -rf`. |
| S6b | Edge | **(iter4 Q-iter4-Override)** PR head gets force-pushed between the last review and `gh pr merge`, so a naive merge would silently merge different content than what was reviewed. Stage G captures `HEAD_SHA=$(gh pr view <pr-num> --json headRefOid -q .headRefOid)` as audit-log, then merges via `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"`. The flag enforces head-match atomically server-side: mismatch causes `gh pr merge` to exit non-zero, the merge does NOT happen, and the executor returns NEEDS_CONTEXT (no rationalization). | No post-merge inference required. |
| S7 | Failure | `git rm -r .gobbi/projects/gobbi/adversarial-review/` fails because of a working-tree change. | Executor `git status` first; resolve before retry. |
| S8 | Failure | Single atomic PR exceeds GitHub's diff/file limit when squashed. | Pre-merge sweep branch carries bisect-safe sub-commits (B/C/D/E.1/F); single squash-merge produces one develop commit (M-1). |
| S9 | Failure | Stub READMEs collide with names of existing files in the destination dir. | Executor verifies each subdir is empty (after the wipe) before writing stub README. |
| S10 | Adversarial | After deletion, future agent reads `.claude/skills/orchestration/SKILL.md` (symlink → `.gobbi/.../skills/orchestration/SKILL.md`). | Q-A keeps the symlink target; agent loads succeed. |
| S11 | Adversarial | User changes mind mid-execution; needs to recover. | Pre-reset tag `pre-reset-2026-05-21` makes recovery a one-command checkout. Pre-merge revert: `git checkout develop`. Post-merge revert: `git revert <merge-sha>`. |
| S12 | Adversarial | Future rebuilt CLI regenerates `.gobbi/.gitignore` with the OLD policy, silently re-ignoring `sessions/` and `project/note/`. | Backlog entry `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` flags this; per H-4 it has no project-promotion target but is referenced in the Wrap-up handoff; rebuild session must update the regen template before shipping. |
| S13 | Adversarial | (iter2 M-2) Post-merge, the local sweep branch is not deleted, breaking Success #5. | Stage G post-merge step `git branch -d <sweep-branch>` after `gh pr merge --squash --delete-branch --match-head-commit "$HEAD_SHA"` succeeds. |
| S14 | Edge | (iter2 L-1) `find .gobbi/projects/gobbi/worktrees/ -type d -empty -delete` (without `-mindepth 1`) deletes `worktrees/` itself once empty, breaking Success #3. | Use `find .../worktrees/ -mindepth 1 -type d -empty -delete`. |
