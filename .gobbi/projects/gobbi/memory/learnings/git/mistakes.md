# Git Mistakes

## Putting `--` before `-F` makes Git treat `-F` as a path

**Context:** Creating a commit with a message from stdin and an explicit path list.

**Mistake:** `git commit -- paths -F -` treats `-F` as a path, so the message
file option is never applied.

**Correction:** Put the message option before the path separator:
`git commit -F - -- paths`.

## Reusing a squash-merged branch can reopen old history

**Context:** Publishing a focused follow-up from a retained branch after that branch's earlier work was
squash-merged.

**Mistake:** Assuming a new pull request from the retained branch will contain only its latest tree delta. A
squash merge creates a new base-branch commit without making the source tip an ancestor, so the server may
choose the old merge base and display the previously squashed commits and files again.

**Correction:** Inspect the server-side pull-request commit and file diff before merge. When it includes old
work, leave the retained session branch unchanged. Create a clean non-session branch at the current base,
apply the focused correction there, verify the exact delta, and publish that branch. Do not force-rewrite the
retained session branch to make the comparison look smaller.

## Updating a branch that another worktree has checked out

**Context:** Fast-forwarding `develop` with `git update-ref` from a session worktree while the start
checkout still has `develop` checked out.

**Mistake:** Expecting that checkout's index and worktree to match the new `HEAD`. They stay at the
old tree, so `git status` shows the new commit's files as modified or deleted.

**Correction:** That dirtiness is the other checkout's stale index, not a second copy of the work.
Do not restore, reset, or check out files there from the session. Leave it until a separately
authorized tidy of that checkout.

## A relative delete from the worktree can hit the base checkout

**Context:** A specialist edits a linked worktree whose skills are reached by relative symlinks, while the
start checkout stays on the base branch.

**Mistake:** A relative delete removed Authoring and Design Ideation files in the base checkout. The specialist
restored those paths from `HEAD`. The base checkout was clean afterward, and the old files were present again.

**Correction:** Name every write and delete as an absolute path under the session worktree. After the
specialist returns, run `git status` on the base checkout and confirm the files that must stay there still
exist.
