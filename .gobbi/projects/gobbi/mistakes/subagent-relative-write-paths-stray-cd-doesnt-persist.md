---
name: subagent-relative-write-paths-stray-cd-doesnt-persist
description: Subagents that `cd` to the worktree and then call the Write tool with RELATIVE paths still write to the MAIN tree, because `cd` does not persist across Claude Code tool boundaries. The cd-first instruction + a relative path is NOT sufficient; absolute worktree paths in Write are required. Discovered after 4 recurrences in one session despite explicit cd-first briefs.
type: decisions
scope: project
feature: project-memory
status: active
created: 2026-05-28
session: 5786090e-f65a-4493-94cc-e610ce337813
tags: [process, delegation, write-path, worktree, recurrence, claude-code-toolchain]
domain: process
supersedes: null
superseded_by: null
related: [subagent-relative-path-write-strays-to-main-tree, subagent-stray-recurred-despite-absolute-path-instruction]
---

# Subagent `cd <worktree>` + relative-path Write strays — cd doesn't persist across tool boundaries

## What happened

Across one session, FOUR memorization/evaluator subagent runs strayed to the
MAIN tree even though every brief told the subagent to `cd <worktree-abs>` first
and "verify with `git rev-parse --show-toplevel`". The strays were silent: each
assistant reported `STATUS: DONE` + "toplevel check passed" + listed correct
worktree paths in its report. Only at Wrap-up's staging inventory did the
manager `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-*`
(searching the WHOLE repo, not just the worktree) reveal the strays.

Specific evidence (4 recurrences this session): P2 memorization, P6b
memorization + P6b Claude evaluator, P7a memorization, P7b memorization — all
wrote artifacts to `.gobbi/projects/gobbi/sessions/.../...` (main-tree path
WITHOUT the `/worktrees/chore/session-2026-05-25-a10c82d6/` segment) despite
cd-first briefs. Three of those (P6b, P7a, P7b) had their session-record
commits silently capture ZERO artifact files because `git add` against the
worktree path found empty dirs there.

## Why it happens

Claude Code does not persist `cd` across tool boundaries. A subagent that runs
`cd <worktree-abs>` in one Bash call, then later issues a Write tool call with
a RELATIVE path like `.gobbi/projects/gobbi/sessions/.../foo.md`, has its Write
resolved relative to the harness's session-start cwd (the main-tree project
root), NOT the cd'd worktree. The `git rev-parse --show-toplevel` check in the
cd'd Bash returns the worktree path — passing the verification — but the
subsequent Write happens against a different cwd. The two tool surfaces don't
share state. The "cd-first + verify" pattern is necessary but NOT SUFFICIENT.

## Correct approach

Briefs MUST require the subagent to use FULL ABSOLUTE worktree paths in EVERY
Write tool call — never a relative path. The brief should explicitly state:

> "Every Write tool call MUST use the full absolute path starting with
> `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6/`
> — do NOT use relative paths like `.gobbi/projects/gobbi/...` (they resolve
> against a different cwd than the Bash you just ran, and will stray to the
> main tree)."

Manager-side post-hoc verification: after every subagent that writes session
artifacts, run BOTH (a) `ls <worktree-abs>/.gobbi/.../expected-file` AND (b)
`find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<session-id> -type f`
(the latter SEARCHES THE WHOLE REPO to catch main-tree strays). If the find
returns files outside the worktree, the assistant strayed — relocate them
before committing. Do NOT trust the assistant's "toplevel check passed" report.

## How to detect

- A subagent writes session artifacts and the worktree shows no new files there
  while `git add <worktree-path>` succeeds but stages nothing.
- `git commit -q` succeeds but the commit's `--stat` shows zero artifact files
  (only state.json/session.json), which is the silent-stray signature.
- A `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<id>` (no
  worktree prefix in path filter) returns hits in the main tree path WITHOUT
  the `/worktrees/chore/<branch>/` segment.
- A subagent's report cites file paths starting with `/playinganalytics/git/gobbi/.gobbi/...`
  (no `/worktrees/`) instead of `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/...`.
- Recurrence of the [[subagent-relative-path-write-strays-to-main-tree]] or
  [[subagent-stray-recurred-despite-absolute-path-instruction]] pattern despite
  the cd-first remediation — the recurrence IS the signal that cd-first is
  insufficient.
