---
name: subagent-stray-recurred-despite-absolute-path-instruction
description: A memorization assistant wrote its 4 output files to the MAIN tree's session dir (not the worktree) even though the delegation brief said "use ABSOLUTE worktree paths; never relative." Telling a subagent to use absolute paths is not enough — the brief must make the subagent cd into the worktree FIRST and verify cwd before any write.
type: decisions
scope: project
feature: project-memory
status: active
created: 2026-05-27
session: 5786090e-f65a-4493-94cc-e610ce337813
tags: [process, delegation, worktree, write-path, recurrence, memorization]
mistake-candidate: true
domain: process
supersedes: null
superseded_by: null
related: [subagent-relative-path-write-strays-to-main-tree]
---

# Subagent write strayed to main tree again — despite an explicit absolute-path instruction

## What happened

The P2 memorization assistant reported DONE and listed four output files under the worktree
session dir. They were not there: a search of both trees found them in the **main tree's**
session dir (`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/.../P2-evaluation-prose/...`),
not the worktree (`.../worktrees/chore/session-2026-05-25-a10c82d6/.gobbi/projects/gobbi/sessions/...`).
The assistant even reported "the parent session dir did not pre-exist" — a tell that it had
created a parallel session tree in the wrong root. This is a recurrence of
[[subagent-relative-path-write-strays-to-main-tree]] — and it happened even though the
delegation brief contained the line "All session writes use ABSOLUTE worktree paths; never relative."

## Why it happens

A subagent's Bash/Write cwd resets to the harness session start dir (the main tree), not the
worktree. When the brief hands the subagent a long absolute path to paste into every Write, the
subagent can still (a) drop the `/worktrees/chore/<branch>/` segment when reconstructing the path,
or (b) `mkdir -p` a fresh `.gobbi/.../sessions/...` under its cwd because the relative-looking tail
matches. A passive "use this absolute path" instruction does not change the subagent's working
directory, so the cheapest-looking path (cwd-relative) wins. The instruction names the destination
but does not anchor the actor.

## How to detect

- A subagent reports artifacts written but `ls <worktree>/<expected-path>` shows them missing.
- A subagent says a dir "did not pre-exist" / "bootstrapped the session dir" when you know it exists.
- `find <repo-root> -path '*<task-id>*' -name '<artifact>'` returns a hit under the MAIN tree root
  (no `/worktrees/` segment) instead of the worktree.

## Correct approach

Do not rely on pasting an absolute path alone. Every subagent whose job includes writes MUST be
instructed to, as its FIRST action: `cd <worktree-abs>` AND verify with
`git rev-parse --show-toplevel` (or `pwd`) that it is inside the worktree before any write — then
write using paths relative to that confirmed root. The manager also verifies post-hoc:
`ls` the expected worktree paths (do not trust the subagent's DONE), and if files strayed, relocate
them and remove the stray main-tree session dir. Link [[subagent-relative-path-write-strays-to-main-tree]].
