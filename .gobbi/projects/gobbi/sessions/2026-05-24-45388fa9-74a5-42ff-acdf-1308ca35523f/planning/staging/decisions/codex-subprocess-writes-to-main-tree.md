---
name: codex-subprocess-writes-to-main-tree
description: Codex evaluator subagent invoked `codex exec` from its claude-code CWD (the main tree); Codex's tool calls resolved against main-tree paths, writing the Planning iter1 EVAL artifacts to `<main>/.gobbi/projects/gobbi/sessions/.../planning/evaluation/iter1/codex/` instead of the worktree path even though the delegation prompt cited the worktree absolute path.
mistake-candidate: true
domain: dual-system
scope: project
status: open
severity: medium
confidence: 90
created: 2026-05-24
session-id: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
project: gobbi
feature: session-foundations-bundle-c
related: session-dir-placed-outside-worktree
---

# Codex subprocess writes EVAL artifacts to main tree instead of worktree

## What went wrong

Planning iter1 EVAL Codex leg: the Codex evaluator subagent (claude-code, sonnet) invoked `codex exec` to run the adversarial review. The delegation prompt cited the worktree absolute path (`<worktreePath>/.../planning/evaluation/iter1/codex/`) as the output target. However, Codex itself wrote its 4 artifact files (`overall.md`, `p3-scope.md`, `p4-specificity.md`, `codex-prompt.md`) to the **main-tree** equivalent path (`<main>/.gobbi/projects/gobbi/sessions/.../planning/evaluation/iter1/codex/`) — a stale session-dir location whose parent had already been emptied during the earlier session-dir-placed-outside-worktree fix.

Manager moved the 4 files into the worktree post-hoc and cleaned up the empty main-tree parents. Earlier iters (iter2-iter5 of Ideation EVAL Codex; iter1 Preparation EVAL Codex) did NOT exhibit this — they wrote to the worktree correctly. The Planning iter1 Codex run was the first to manifest this variant.

## Why it went wrong

The Codex evaluator subagent (claude-code) runs in its own working directory, which is the gobbi-companion-rooted main tree CWD by default. When it invokes `codex exec`, Codex inherits the subprocess CWD. Even when the delegation prompt cites worktree absolute paths, Codex's file-writing tool calls resolve relative to its actual CWD when constructing the parent directories — specifically, when Codex sees `.gobbi/projects/gobbi/sessions/...` as a relative-looking prefix (the `<worktreePath>` macro is documented session-path syntax, not a literal env var Codex resolves), Codex may interpret it relative to its CWD.

Why earlier iters didn't manifest: in Ideation iters 2-5, the manager pre-created the eval output dirs at the worktree path before dispatching, so Codex created files there only if its tool call hit the existing dir. The Planning iter1 wrapper may have pre-created dirs too (manager did `mkdir -p` earlier in the session); but Codex's file creation chose to recreate the parents at the main-tree path because of an unresolved path interpretation. Empirically — Codex's own log said "main-tree absolute paths" — Codex thought it was writing to the worktree, but the absolute path it resolved was the main-tree.

Root cause hypothesis: the worktree directory and the main-tree directory share the same project name (`gobbi`) and the same nested path under `.gobbi/projects/gobbi/sessions/`. Codex's tool call may have constructed the absolute path by joining its CWD with the relative tail. The `<worktreePath>` macro in the prompt was NOT substituted (it's documentation syntax) — Codex saw the literal string `<worktreePath>` followed by `/.gobbi/projects/gobbi/sessions/...` and dropped the macro, falling back to its CWD-rooted equivalent.

## How to recognize the situation before making the same mistake

When dispatching a Codex evaluator subagent (the dual-system contract's Codex leg):

1. **Pass the worktree absolute path as a literal string in the prompt, not as a `<worktreePath>` macro placeholder**. Codex doesn't substitute placeholders; it reads them literally and falls back to CWD if the path isn't valid.
2. **Instruct the Claude wrapper subagent to `cd $worktreePath` before invoking `codex exec`** so the subprocess CWD is the worktree, ensuring relative path resolution lands there.
3. **Pre-create the output directory at the worktree path** before invoking Codex (the manager already does this).
4. **Post-verify** file location by `ls`-ing the worktree dir after Codex returns; if files are absent, grep the main-tree equivalent path before assuming Codex failed.

## Corrected approach

In future Codex evaluator dispatches:
- Replace every `<worktreePath>/...` macro in the prompt with the LITERAL resolved absolute path string.
- Add an explicit instruction: "Before invoking `codex exec`, `cd /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9` (or equivalent absolute worktree path) so Codex's tool calls resolve relative to the worktree."
- Add a post-verification step in the wrapper's brief: "After `codex exec` returns, `ls <worktree-path>/.gobbi/projects/gobbi/sessions/<sid>/planning/evaluation/iter<N>/codex/` to confirm files landed there. If not, `find /playinganalytics/git/gobbi -name 'p3-scope.md' -newer <timestamp>` to locate them and `mv` into place."

For the immediate Bundle C session: the Codex iter1 Planning EVAL files have been moved into the worktree. The Planning iter2 EVAL prompt should include the corrected Codex-wrapper instructions.

## Related

- [[session-dir-placed-outside-worktree]] — the parent mistake; this is its Codex-subprocess variant.
- [[d-2-qualified-git-rule]] — the qualified absolute-root rule that both mistakes violate.
