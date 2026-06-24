---
name: executor-git-stash-in-worktree-during-verify
description: An executor used git stash mid-verification inside the worktree (a Forbidden Operation), reverting its in-scope uncommitted edits and briefly putting the work at risk before recovering with stash pop.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-19
session: 8bdd12ad-9d28-4293-a38f-881db184c465
tags: [process, git, execution, verification]
keywords: [git-stash, worktree, forbidden-operation, baseline-compare, executor]
author: claude
priority: medium
domain: git
supersedes: null
superseded_by: null
related: [executor-wrote-to-main-tree-not-worktree]
---

# Executor used git stash in the worktree during Verify

## What happened

During an Execution-loop Verify step, an executor ran `git stash` inside the worktree
to get a "clean baseline" to compare its edits against — a Forbidden Operation in a
worktree. The stash reverted the executor's own in-scope uncommitted edits. It
recovered by running `git stash pop` and re-verifying, but the work was briefly at
risk of being lost (a stash pop can conflict, and an interrupted session would leave
the edits buried in a stash entry).

## Why it happens

The executor reached for `git stash` as a familiar "save my work, get a clean tree,
look at the baseline, restore" trick — not recognizing that `git stash` is **Forbidden
in worktrees** because uncommitted work is too easily lost (an unpopped stash, a
conflicting pop, a session that ends before the pop). This RE-OCCURRED despite the git
skill's explicit ban, which means the ban was not surfaced in the executor's working
context at the moment the "compare against baseline" need arose.

## Correct approach

- **Never `git stash` in a worktree.** To compare current edits against a baseline,
  use read-only inspection: `git show HEAD:<path>` to see the committed version,
  `git diff` / `git diff HEAD` to see the uncommitted delta, `git diff <ref> -- <path>`
  for any other baseline. None of these touch the working tree.
- Executor briefs MUST restate the no-stash-in-worktree rule inline, at the point
  where verification/baseline-comparison is described — not only in the git skill the
  executor may not have loaded into working context.

## How to detect

An executor (or any agent) planning a "stash, check the clean tree, unstash" sequence
during Verify, or any `git stash` / `git stash pop` appearing in a worktree's command
history. The intent phrasing to catch: "let me stash to get a clean baseline" — that
is the trigger; redirect to `git show HEAD:<path>` / `git diff` before it runs.

## Related

- [[executor-wrote-to-main-tree-not-worktree]] — a sibling executor git-discipline
  trap (writing outside the worktree); both are worktree-safety violations an executor
  brief must pre-empt inline.
