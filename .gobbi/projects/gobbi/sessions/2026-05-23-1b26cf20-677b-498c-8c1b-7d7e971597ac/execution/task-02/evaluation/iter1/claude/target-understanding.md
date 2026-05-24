# Stage 0 — Target Understanding (Claude Iter1)

## What

Commit 97ae373 — `feat(git): qualify Memory Access Matrix worktreePath rule + P2 invocation note`. Single-file change to `.gobbi/projects/gobbi/skills/git/SKILL.md` (4 insertions, 2 deletions). Implements two ideation anchors (T1-I-T1.b and T1-I-T1.c) from session-foundations-bundle-b.

## Why

Bundle B (issue #268, plan task 02 of 10) realigns gobbi's session-write paths from "always main tree" to "worktree-first when `session.json.git.worktreePath` is set, fall back to main tree in direct mode." The shift is forced by the 1829fa3 witness — symlinks created at Preparation-exit promotion landed on the main tree and never reached the worktree branch, missing the PR diff. T1-I-T1.b qualifies the matrix rule; T1-I-T1.c relocates P2 invocation from Execution-start to Configuration row 5.5 (now once-per-session, not once-per-task).

## How

- Edit Memory Access Matrix row 31 ("Session notes / mistakes"): replace single-tree rule with worktreePath-when-set + direct-mode-fallback + transcript-in-home note.
- Edit Critical rule paragraph line 33: same shift in prose form.
- Insert one paragraph at line 155 above P2 body declaring the invocation-site shift to Configuration row 5.5.
- Preserve all other content (delete semantics, Core Principles, Prerequisites, Role Boundaries, Forbidden Operations, all other Procedures).
- Honor plan verifies: grep ≥2 worktreePath hits, symlink test, single-file scope.
- Carry `AI-Provenance-Record:` trailer pointing back to session+task.

## Plan task spec

From `planning/artifacts/plan.md` lines 64-76:
- id: `02-git-skill-worktree-path-qualifier`
- what: "Qualify git/SKILL.md Memory Access Matrix row 31 and Critical rule paragraph — use worktreePath when set; fallback main tree when null. Add P2 invocation note."
- requires: `[01-orchestration-row-5-5-worktree-create]` (sibling commit 14da700 establishes orchestration row 5.5)
- files: `.gobbi/projects/gobbi/skills/git/SKILL.md` (modify)
- verifies: grep ≥2 worktreePath + `test -L .claude/skills/git/SKILL.md`
- effort: Small

## Phase-doc loaded

`orchestration/workflow/execution.md` — Execution Loop evaluation criteria. Single-task, single-file, doc-only execution. Plan-spec adherence + Iron Laws 4/7/8/11 are the dominant lenses.

