---
name: worktree-physical-file-missing-when-checked-out
description: Worktree may have files in the index but absent from the working-tree filesystem; run a pre-flight integrity check before any executor editing pass.
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [process, worktree, execution]
domain: process
supersedes: null
superseded_by: null
---

# Worktree may have files in the index but absent from the working tree filesystem

## What happened

During a dispatch into the worktree at `.gobbi/projects/gobbi/worktrees/chore/268-session-foundations-bundle-b/`, the manager observed that 953 files showed in `git status --short` as ` D` (working-tree deleted, index retained). The Edit and Read tools failed against those paths because the physical files were missing, yet `git -C <worktree> show HEAD:<path>` succeeded — proving the tracked version existed.

The corrective stance: adopt a pre-flight worktree-integrity check before any executor or assistant editing pass against the worktree:

```
PHYS=$(git -C <worktree> status --short | grep -c "^ D")
if [ "$PHYS" -gt 0 ]; then
  git -C <worktree> checkout HEAD -- .
fi
```

The restore is safe because the index is the source of truth for the branch's intended content.

## Why it happens

- Failing Read/Edit calls inside an executor produce confusing errors that look like missing files rather than worktree-state drift, so the executor mis-diagnoses the problem.
- The remediation is a single `git checkout HEAD -- <path>` (or `-- .` for bulk); without the pre-flight check, executors burn time on misdiagnosis before finding it.

Alternatives that were considered and rejected:

- Recreate the worktree from scratch. Rejected — destroys per-iter commits that may not be pushed.
- Trust the executor to detect the missing files. Rejected — Read tool failures look like missing-file errors, not worktree drift.

Downstream consequences of the chosen prevention:

- Delegation prompts targeting worktree files should include the pre-flight check or a "restore-if-needed" note.
- Wrap-up's own routing pass may need to run the same pre-flight if it ever writes to worktree-internal paths (currently it writes only to main-tree `.gobbi/projects/gobbi/` so does not).

## Correct approach

- Pre-flight: `git -C <worktree> status --short | grep -c "^ D"` — if > 0, run `git -C <worktree> checkout HEAD -- <path>`.
- For Wrap-up: prefer the main-tree `.gobbi/projects/{project}/` for all project-memory writes (already the canonical location).

## How to detect

- Bash `ls <worktree>/.gobbi/projects/...` returns "No such file or directory" but `git -C <worktree> ls-files <path>` returns the path.
- `git -C <worktree> status --short | head` shows many ` D` (space-D) entries.

## Related
- T1 implementation (PR #269) — worktree-first session architecture
