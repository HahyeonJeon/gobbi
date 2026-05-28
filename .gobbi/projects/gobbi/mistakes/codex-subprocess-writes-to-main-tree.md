---
name: codex-subprocess-writes-to-main-tree
description: Both Claude and Codex evaluator subagents wrote session EVAL artifacts to the main tree instead of the worktree path.
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-24
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [dual-system, worktree, evaluation, session-lifecycle, subagent-dispatch]
priority: medium
domain: process
supersedes: null
superseded_by: null
---

# Evaluator subagents (Claude + Codex) write session EVAL artifacts to main tree instead of worktree

## What happened

During Planning iter1 EVAL and T02 EVAL (execution), **both** the Codex evaluator leg and the Claude evaluator leg wrote their artifact files (`overall.md`, perspective files) to the **main-tree** session path (`<main>/.gobbi/projects/gobbi/sessions/.../evaluation/iter1/{claude,codex}/`) rather than the worktree-rooted equivalent.

**Planning iter1 (Codex leg):** The Codex evaluator subagent invoked `codex exec` from its claude-code CWD (the main tree). Codex wrote 4 artifact files to the main-tree path. The delegation prompt cited the worktree absolute path but the `<worktreePath>` macro was documentation syntax — Codex read it literally and fell back to its CWD-rooted resolution.

**T02 EVAL (both Claude + Codex legs):** The Claude evaluator also wrote to the main tree, not just Codex. Both legs' eval artifacts landed at `<main>/.gobbi/.../execution/task-02/evaluation/iter1/{claude,codex}/`. The manager had to relocate all files into the worktree post-hoc.

The manager moved the files in both cases and the per-iter commit caught the corrected locations. Earlier iters (Ideation iter2–5 EVAL, Preparation EVAL Codex) did NOT exhibit this — they wrote to the worktree correctly because the manager pre-created eval output dirs at the worktree path before dispatching.

## User feedback

The user observed that eval files were landing at the main-tree path and instructed the manager to relocate them. Confirmed in T02 EVAL: both legs defaulted to main-tree CWD.

## Why it happens

All evaluator subagents (both Claude and Codex legs) run in their own claude-code process, whose default working directory is the main-tree root — the directory where the gobbi session started. When they write files, they resolve paths relative to their CWD.

For the Codex leg specifically: `codex exec` inherits the subprocess CWD from the wrapping claude-code agent. Even when the delegation prompt cites worktree absolute paths, Codex's tool calls may resolve relative to its CWD when constructing parent directories — especially when the prompt uses `<worktreePath>` as a documentation macro (not a shell variable Codex resolves). Codex sees the literal string `<worktreePath>` and falls back to its CWD.

For the Claude evaluator leg: the same CWD problem applies. Claude's file-writing tool calls in a spawned subagent use the subagent's own CWD (the main tree), not the worktree path, unless the subagent explicitly `cd`s to the worktree or the manager passes literal absolute paths.

Root cause in both cases: the manager's delegation prompt did not instruct the subagent to `cd` to the worktree, and used `<worktreePath>` macro placeholders rather than literal absolute paths. The subagent then resolved all relative path components against its default CWD (main tree).

## Correct approach

When dispatching any evaluator subagent (Claude or Codex leg) in a `worktree-pr` session:

1. **Pass the worktree absolute path as a literal string in the prompt** — not as a `<worktreePath>` macro placeholder. Subagents do not substitute macros; they read them literally.
2. **Instruct the subagent to `cd <literal-worktree-path>` as the first action** before writing any files, so all path resolution is relative to the worktree root.
3. **Pre-create the output directory at the worktree path** before invoking the evaluator (the manager already does this in some cases; make it mandatory).
4. **Post-verify** file location by `ls`-ing the worktree eval dir after the evaluator returns. If files are absent, grep the main-tree equivalent path. If found there, `mv` them into the worktree and continue — the per-iter commit will pick up the corrected locations.

For the Codex leg specifically: replace every `<worktreePath>/...` macro in the prompt with the literal resolved absolute path string. Add an explicit `cd <absolute-worktree-path>` before the `codex exec` call in the wrapper subagent's brief.

## How to detect

Signs you are about to hit this trap:

- You are in `worktree-pr` mode and about to dispatch an evaluator subagent.
- The delegation prompt uses `<worktreePath>` as a placeholder rather than the literal absolute path.
- The delegation prompt does not include an explicit `cd <worktree-path>` instruction as the subagent's first action.

After evaluator returns: check that `ls <worktree-path>/.gobbi/projects/gobbi/sessions/<sid>/{loop}/evaluation/iter{n}/{claude,codex}/` shows the expected files. If empty, run `find <main-tree> -name 'overall.md' -newer <recent-timestamp>` to locate the stray files.

## Related

- `session-dir-placed-outside-worktree.md` — the parent mistake; both originate from subagents defaulting to main-tree CWD when worktree-pr mode is active.
- `qualified-git-write-path-rule.md` in `features/git-workflow/design/` — the qualified absolute-root rule that both mistakes violate.
- T02 EVAL empirical recurrence (2026-05-24): both Claude and Codex eval legs wrote to main tree; confirmed root cause is broader than Codex-only.
