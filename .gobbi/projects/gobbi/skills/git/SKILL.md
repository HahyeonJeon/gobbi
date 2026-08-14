---
name: git
description: "Git defines conventions for consistent, focused, and recoverable version-control work."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# Git

Git defines common conventions for inspecting repositories, naming branches, committing changes, integrating
work, publishing refs, and recovering safely. Use it whenever an agent selects or runs Git commands; the active
operation and current project or user authority own the ordered work and external effects.

## Principles

### Inspect the real state

Choose commands from current repository, worktree, branch, index, ref, and remote evidence. Recheck state after
every mutation that another action depends on.

### Keep changes and history focused

Stage only intended paths and keep each commit about one coherent change. Prefer explicit targets over commands
that infer a branch, remote, revision, or path set.

### Prefer recoverable choices

Preserve unique work before discarding, rewriting, or deleting anything. Use previews, abort paths, retained
refs, and reflogs so a failed action has a safe recovery point.

### Let project authority lead

Follow repository policy, configured protection, and current user or caller decisions before generic defaults.
Stop when authority is missing or conflicting instead of choosing a convenient Git result.

## Rules

- **MUST apply current repository policy and caller authority before this skill's defaults.** Keep local commits
  separate from push, pull-request, merge, cleanup, configuration, and other external or destructive authority.
- **MUST run Git against the intended repository or worktree.** When the caller supplies an absolute worktree,
  use `git -C <absolute-worktree>` and verify its repository, branch, and status before mutation.
- **MUST preserve unrelated and unique work.** Honor the active writer boundary, stage exact paths, and stop
  when ownership, a dirty state, or concurrent mutation makes isolation uncertain.
- **MUST inspect the staged candidate before commit creation and the resulting commit afterward.** Review
  status, unstaged changes, staged paths, and the staged diff first, then confirm the commit contains the
  verified tree and no unintended path.
- **MUST obtain exact current authority before remote mutation, protected-branch integration, history
  rewriting, destructive restoration, or ref and worktree deletion.** Never use an unqualified force push.
- **NEVER hide drift, conflicts, or failures through cleanup, retry, or guessed resolution.** Preserve the
  current objects and report the first safe recovery action.

## Preferences

### Repository State

#### Inspect the checkout

- Start with `git -C <repo> status --short --branch`, then inspect unstaged content with `git diff` and staged
  content with `git diff --cached`. These commands distinguish the working tree, index, and current branch
  without changing them ([Git status](https://git-scm.com/docs/git-status), [Git diff](https://git-scm.com/docs/git-diff)).
- Use `git branch --show-current`, `git rev-parse`, `git worktree list --porcelain`, `git remote -v`,
  `git log --oneline --decorate --graph`, and `git show` only as the current question needs.

#### Select exact targets

- Put `--` before path arguments and name the intended remote, base, head, ref, or revision when ambiguity
  could change the result.
- Begin integration, history editing, or cleanup only from a state whose dirty paths, active Git operation, and
  unique commits are understood.

### Branches and Worktrees

#### Name branches by purpose

- Use `<type>/<slug>`, or `<type>/<issue>-<slug>` when a real issue exists. Choose `type` from `feat`,
  `fix`, `hotfix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`, `build`, or `style`.
- Write `slug` as descriptive lowercase ASCII words joined by hyphens, normally 3–50 characters. Do not add a
  runtime, date, session identifier, or automatic collision suffix; choose a more specific slug when occupied.

#### Create and switch branches

- Create a topic branch from an inspected base with `git switch -c <branch> <base>`; use `git switch <branch>`
  for an existing branch. Stop for a user decision when the base is dirty, detached, stale, or ambiguous
  ([Git switch](https://git-scm.com/docs/git-switch)).
- Keep unrelated changes on separate branches. Reuse a branch only when the new work belongs to its same
  accepted scope and history.

#### Use linked worktrees

- Use `git worktree add -b <branch> <path> <base>` when the caller requires isolation or simultaneous
  checkouts, then verify it with `git worktree list --porcelain`.
- Keep one writer per worktree and use its fully expanded path for every write. Remove the worktree before its
  branch, and only after proving it is clean and contains no unique work
  ([Git worktree](https://git-scm.com/docs/git-worktree)).

### Changes and Commits

#### Stage intended changes

- Stage explicit paths with `git add -- <paths>` or interactively with `git add -p`. Inspect
  `git diff --cached --name-status` and the full staged diff before committing
  ([Git add](https://git-scm.com/docs/git-add)).
- Unstage without discarding working-tree content with `git restore --staged -- <paths>`. Preserve unrelated
  user changes instead of stashing, restoring, or resetting them to make the checkout appear clean.

#### Keep commits focused

- Put one coherent change and its required tests or documentation in each commit. Split unrelated areas, but
  do not split a change when either commit would be invalid or unverifiable alone.
- Amend only the current unpublished local commit when all replacement content is owned and verified. Otherwise
  create a new commit so shared history stays stable.

#### Write commit messages

- Use `<type>(<optional-scope>)!: <description>` with the branch type set, an optional lowercase hyphenated
  scope, and `!` only for a documented breaking change. Keep the subject imperative, lowercase after the
  colon, without a final period, and at most 72 characters.
- Add a body when the reason, trade-off, or non-obvious effect is not clear from the subject. Explain why and
  the consequence rather than narrating changed files ([Git commit](https://git-scm.com/docs/git-commit)).

### Integration and Publication

#### Open issues

- For GitHub, inspect the default branch's `.github/ISSUE_TEMPLATE/` and contribution guidance. When several
  templates exist, select the one whose stated purpose matches the issue.
- Use the applicable repository template; otherwise render the body-only [issue template](templates/issue.md).
  State the problem, relevant context, expected outcome, and observable acceptance evidence.
- Link an existing issue instead of opening a duplicate. Keep issue creation separate from labels, assignees,
  projects, and other remote changes that lack current authority.

#### Fetch before integrating

- Prefer `git fetch <remote>` to update remote-tracking refs without integrating them. Add `--prune` only after
  inspecting configured fetch refspecs and prune-tag settings and proving no local ref that must be preserved
  can be removed ([Git fetch](https://git-scm.com/docs/git-fetch#_pruning)).
- Use `git pull --ff-only` only when the exact upstream is known and a fast-forward-only update is intended
  ([Git pull](https://git-scm.com/docs/git-pull)).
- After fetching, compare the named base and topic refs before selecting merge or rebase. Do not let a plain
  `git pull` choose an unstated integration policy.

#### Choose merge or rebase

- Rebase unpublished local commits when a linear topic history helps review; merge when repository policy or
  shared-history preservation requires it. Rebase creates replacement commits, so published history needs
  explicit coordination and rewrite authority ([Git rebase](https://git-scm.com/docs/git-rebase)).
- Start merge or rebase only with a clean working tree and index. Do not rely on `git merge --abort` to
  reconstruct changes that existed before the merge ([Git merge](https://git-scm.com/docs/git-merge#Documentation/git-merge.txt---abort)).
- On conflict, abort when the accepted result cannot be preserved. Otherwise inspect and stage only owned
  resolutions, run `git merge --continue` or `git rebase --continue` for the active operation, then verify the
  complete result.

#### Push branches

- Publish a new topic branch with `git push -u <remote> <branch>`, then use `git push` only after verifying
  its upstream and expected remote head.
- Use `--force-with-lease=<ref>:<expected-object>` only for a separately authorized rewrite; never replace it
  with `--force` ([Git push](https://git-scm.com/docs/git-push)).

#### Open pull requests

- For GitHub, inspect the default branch for `pull_request_template.md` in the root, `docs/`, or `.github/`,
  plus any `PULL_REQUEST_TEMPLATE/` directory. When several templates exist, follow project guidance or the
  caller's selection.
- For GitHub, use `gh pr create --base <base> --head <branch>` only when the repository, CLI, network, and
  authority are available. Use the applicable repository template; otherwise render the body-only
  [pull-request template](templates/pull-request.md).
- Confirm the exact head, base, required checks, and repository policy before merge. This evidence does not
  grant merge authority ([Creating a pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request)).

#### Complete integration

- Use the merge method configured by the repository rather than a universal squash, merge-commit, or rebase
  default. Recheck the accepted head, base head, required checks, clean checkout, and current authority
  immediately before integration.
- Verify the resulting base ref and tree before cleanup. A conflict or changed head returns to the owning
  operation instead of being resolved as part of finalization.

### Tags

#### Create and publish release tags

- Inspect existing tags with `git tag --list` and `git show <tag>`. Prefer
  `git tag -a <tag> <target> -m <message>` for a release and a lightweight tag only for a temporary local
  label; repository policy owns signing ([Git tag](https://git-scm.com/docs/git-tag)).
- Verify the tag name, form, and target before `git push <remote> refs/tags/<tag>`. Moving or deleting a
  published tag requires separate exact authority and consumer-impact review.

### Recovery and Cleanup

#### Choose the narrow undo command

- Use `git restore --staged` to unstage, path-scoped `git restore` only to discard explicitly owned
  working-tree content, and `git revert <commit>` to reverse a shared commit with a new commit
  ([Git restore](https://git-scm.com/docs/git-restore), [Git revert](https://git-scm.com/docs/git-revert)).
- Use commit-level `git reset` only for unpublished local history with exact authority and a retained recovery
  ref. Never use `--hard` as a routine repair because it overwrites tracked working-tree and index content
  ([Git reset](https://git-scm.com/docs/git-reset)).

#### Recover lost local refs

- Inspect `git reflog` and the candidate object before recovery, then create a rescue branch or tag that
  preserves it. Reflog is local evidence and does not replace a remote backup
  ([Git reflog](https://git-scm.com/docs/git-reflog)).
- After recovery, verify the rescued history and working tree before any further reset, rebase, deletion, or
  publication.

#### Remove branches

- Delete a local branch with `git branch -d <branch>` only after proving it is merged or intentionally
  abandoned without unique work. Treat `-D` as a destructive exception that requires exact authority
  ([Git branch](https://git-scm.com/docs/git-branch)).
- Remove a remote branch only with separate exact authority after verifying the intended remote and branch.

#### Remove worktrees

- Remove only a clean, identified worktree with `git worktree remove <path>`. Verify its registration is gone
  before deleting the associated local branch.
- Treat force removal as a destructive exception that requires exact authority and proof that no unique work
  or required recovery state remains ([Git worktree](https://git-scm.com/docs/git-worktree)).

#### Clean untracked files

- Preview ordinary untracked-file cleanup with `git clean -nd`; it excludes ignored files. Use an ignored-file
  preview only when that separate scope is required ([Git clean](https://git-scm.com/docs/git-clean)).
- Run no deleting clean command without reviewing its exact preview and obtaining current authority. Preserve
  every unowned, unique, or recovery-relevant file.

## References

| Name | Description |
|---|---|
| [Gobbi Skill](../gobbi-skill/SKILL.md) | Shared guidance for compact skill structure, language, rules, and references. |
| [Preference Skill](../gobbi-skill/preference-skill/SKILL.md) | Guidance for consistency categories, recurring choices, defaults, and valid variation. |
| [Issue template](templates/issue.md) | Body-only fallback for a clear problem, relevant context, expected outcome, and observable acceptance evidence. |
| [Pull-request template](templates/pull-request.md) | Body-only fallback for a change summary, changed areas, verification, linked issues, and risks. |
