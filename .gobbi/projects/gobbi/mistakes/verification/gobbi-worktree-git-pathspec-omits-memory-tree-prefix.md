---
name: gobbi-worktree-git-pathspec-omits-memory-tree-prefix
description: A git diff-gate pathspec omitting gobbi's `.gobbi/projects/gobbi/` prefix matches nothing and silently false-passes.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-06
session: fe6cbcd3-5e63-46fb-a62e-93308b687d1f
tags: [verification, git]
keywords: [worktree, git-pathspec, memory-tree-prefix, diff-gate, false-pass, gobbi-self-edit]
author: claude
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# A worktree-root-relative git pathspec omits gobbi's memory-tree prefix and false-passes

## What happened
A verification gate ran `git -C <WT> status/diff --porcelain -- skills/orchestration/SKILL.md`
against a file that had just been edited, and the gate returned EMPTY — no change — so it
"passed". The pathspec was written relative to the worktree ROOT (`<WT>`), but gobbi's own
skill and agent files do not live at the worktree root: they live under
`<WT>/.gobbi/projects/gobbi/skills/…`. So the pathspec `skills/orchestration/SKILL.md`
matched no tracked file, the diff was empty, and the gate false-passed a real edit. This
bit BOTH the Task-02 executor's gate 5 AND the manager's eval-fix re-verify this same
session.

## Why it happens
In a gobbi worktree the git root IS the worktree, but the project's memory tree is nested
one directory deep under `.gobbi/projects/gobbi/`. A pathspec that names the file relative
to the worktree root (as it would in a normal repo) omits that `.gobbi/projects/gobbi/`
prefix. Git treats a pathspec that matches nothing as "no changes in that path" — it does
NOT error — so a `status`/`diff` gate reports a clean tree and the gate silently
false-passes instead of flagging the edit it was meant to confirm.

## Correct approach
Prefix every gobbi-file git pathspec with `.gobbi/projects/gobbi/` — e.g.
`git -C <WT> status --porcelain -- .gobbi/projects/gobbi/skills/orchestration/SKILL.md`.
Anchor every gate pathspec to the memory-tree root, not the worktree root. When a
status/diff gate returns empty on a file you know you just edited, do not trust the pass:
re-run `git -C <WT> status --porcelain` with NO pathspec first, confirm the file appears,
then copy its exact printed path into the gate.

## How to detect
A worktree-diff / worktree-status gate on a gobbi skill or agent file shows no change even
though the file was edited. Red flag: the pathspec after `--` starts with `skills/` or
`agents/` (worktree-root-relative) rather than `.gobbi/projects/gobbi/skills/` /
`.gobbi/projects/gobbi/agents/`. Trigger: a green diff-gate on a file you are certain you
just changed.

## Related

- [[whole-file-allowlist-false-passes-same-file-residual]] — a sibling false-passing verification gate
- [[verify-mirror-and-cross-tree-paths-from-live-tree]] — verify paths from the live tree, not an assumed root
