# Git Mistakes

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
