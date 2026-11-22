---
name: git
description: "Git sets branch, commit, pull-request, issue, and tag conventions and the shared Git safety rules. Use it whenever you create a branch, commit, tag, pull request, or issue."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# Git

Git sets the conventions an agent cannot infer from Git itself: how to name branches, write commits, shape
pull requests and issues, and tag releases, plus the few safety rules every agent shares. Use it whenever you
create a branch, commit, tag, pull request, or issue, in any repository.

## Principles

### Make history readable at a glance

A reader should tell what a branch, commit, or pull request is for from its name or subject alone. A shared
form makes history easy to scan, search, and review.

## Rules

- **Follow the repository's own Git policy first.** Its guidance, configured hooks, branch protection, and
  templates were set by its owners and win over every default here.
- **Stage explicit paths.** `git add -A`, `git add .`, and `git commit -a` can commit changes you do not own in
  a checkout that others also edit.
- **MUST get explicit authority before a push, pull request, merge, history rewrite, branch or worktree
  deletion, or moving or deleting a pushed tag.** These reach other people or cannot be undone, and authority
  for one of them does not extend to another.
- **NEVER use `git push --force`.** It can overwrite remote work you have not seen, so publish an authorized
  rewrite with `--force-with-lease=<ref>:<expected-object>`.

## Preferences

### Branches

#### Name branches by type and purpose

- Use `<type>/<slug>`, or `<type>/<issue>-<slug>` when a real issue exists. Choose `type` from `feat`, `fix`,
  `hotfix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`, `build`, or `style`.
- Write `slug` as lowercase ASCII words joined by hyphens, normally 3–50 characters, for example
  `fix/142-login-timeout`.
- Do not add agent names, dates, or session IDs to a branch name. When a name is taken, choose a more
  specific slug instead of appending a number.

### Commits

#### Amend only unpushed commits

- Amend only your own latest commit that has not been pushed. Otherwise add a new commit.

#### Write commit messages in one form

- Write the subject as `<type>(<optional-scope>)!: <description>` with a branch type, an optional lowercase
  hyphenated scope, and `!` only for a documented breaking change, for example
  `fix(auth)!: drop legacy token format`.
- Keep the subject imperative, lowercase after the colon, without a final period, and at most 72 characters.

### Pull Requests and Issues

#### Shape a pull request

- Title the pull request like a commit subject. When the repository has no pull-request template, write the
  body in this order: `Summary`, `Changes`, `Verification`, `Issues`, `Risks`.
- Use bullets under `Changes`, one per changed area and its effect, and a `Check | Result` table under
  `Verification`. When no check ran, say why.
- Issues uses `Closes #<n>` only when the merge should close it and `Refs #<n>` otherwise. Write `None` for an
  empty Issues or Risks section.

#### Shape an issue

- When the repository has no issue template, write the body in this order: `Problem`, `Context`, `Outcome`,
  `Acceptance`.
- Write `None` under `Context` when there is none. Use unchecked checkboxes under `Acceptance`, one per
  condition that can be verified on its own.

### Merges and Tags

#### Follow the repository's merge policy

- Use the merge method the repository sets. When none is set and you update a topic branch, rebase unpushed
  commits when a linear history helps review, and merge otherwise.

#### Tag releases with annotated tags

- Use an annotated tag for a release, and a lightweight tag only for a temporary local label.
