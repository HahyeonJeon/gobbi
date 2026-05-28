---
name: codex-eval-session-write-path-nested-in-worktree
description: "Codex:codex-rescue evaluator wrote session memory to a worktree-nested path instead of the main-tree absolute path."
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-22
session: bac669ad-4fec-40b5-8387-51ac57bc0d3d
tags: [process, worktree, session-lifecycle, codex]
domain: process
supersedes: null
superseded_by: null
---

# Codex:codex-rescue evaluator writes session memory to worktree-nested path

## What happened

During the env-var audit session (2026-05-22-bac669ad), the `codex:codex-rescue` evaluator (spawned as a Codex subagent to evaluate Planning loop outputs) wrote session-memory staging files to `.gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook/.gobbi/projects/gobbi/sessions/...` — a path nested inside the Execution worktree — instead of the canonical main-tree absolute path `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/...`.

The session-write-path discipline (`git/SKILL.md` Memory Access Matrix + Output paths) requires all session writes to use the main-tree absolute path regardless of the agent's current working directory. The Codex sandbox ran with its working directory set to the worktree root, and the evaluator constructed a relative path from there — producing a worktree-nested path that no downstream loop reads.

The manager discovered the misplaced files, manually moved them to the correct main-tree path, and recorded the incident in the Preparation decisions log (finding γ — Main-tree absolute session-write path note). A subsequent `rm -rf` incident to clean up the residue led to a tracked-files violation (see companion mistake `manager-rm-rf-without-investigating-tracked-files`).

## Why it happens

The Codex evaluator's delegation prompt did not include an explicit, concrete reminder that session writes must use the **main-tree absolute path** (`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/...`), not a path relative to the current working directory or the worktree root. The evaluator's CWD was inside the worktree, so a relative or `pwd`-derived path construction produced the worktree-nested path.

Root cause: the session-write-path discipline is documented in `git/SKILL.md` but was not emphasized as a concrete absolute-path mandate in the evaluator's load directives.

## How to detect

- A Codex-spawned evaluator (via `codex:codex-rescue`) writes staging or artifact files but the files do not appear under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/`.
- Files appear under any path containing `worktrees/` in their prefix (e.g., `.gobbi/projects/gobbi/worktrees/{branch}/.gobbi/...`).
- `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees -name '*.md' -path '*/sessions/*'` returns results.

## Correct approach

1. **Delegation prompt must include a concrete absolute path.** Every evaluator delegation prompt that involves session writes must carry an explicit line: "All session writes MUST use the absolute main-tree path `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/...`. Do NOT use relative paths or `pwd`-derived paths. The worktree CWD is NOT the session-write root."

2. **Manager-proxy when sandbox blocks.** If the Codex sandbox prevents writing to the main-tree path, the manager must write the files directly (manager-proxy write) rather than accepting worktree-nested outputs.

3. **Post-eval sanity check.** After any Codex evaluator completes, verify the staging files landed at the correct main-tree path before advancing to the next loop. Use `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/...` to confirm presence.
