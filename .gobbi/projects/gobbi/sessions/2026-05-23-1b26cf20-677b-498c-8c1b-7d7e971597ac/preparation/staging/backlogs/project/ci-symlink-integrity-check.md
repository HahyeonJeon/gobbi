---
title: CI / pre-commit guard against workspace-symlink → regular-file conversion
status: deferred
project: gobbi
feature: null
task: null
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created: 2026-05-24
---

# CI / pre-commit symlink-integrity check

## Context

53 tracked workspace symlinks under `.claude/skills/` point INTO the canonical mirror at `.gobbi/projects/gobbi/skills/` (verified `find .claude/skills/ -type l -name "*.md" | wc -l` → 53, run 2026-05-24). The mirror-canonical policy locked in Preparation iter2 (`staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`) depends on these symlinks remaining symlinks: if any one of them is silently converted to a regular file, the workspace and mirror copies diverge — every subsequent loader read returns stale content, every subsequent `Edit` touches only the divergent workspace file, and the canonical mirror stops being canonical for that one path.

The Preparation iter3 "Symlink-preservation edit contract" addition (same decision file, new H2 section) provides the **runtime defenses**: prefer the Edit tool; use the canonical mirror path for bulk rewrites; run `test -L .claude/skills/<path>` after any non-Edit-tool modification. These are per-edit, per-executor disciplines.

This backlog item flags the **durable defense**: a repository-level guard that fails CI or the pre-commit hook if any tracked workspace symlink under `.claude/` has been converted from `120000` (symlink) to `100644` (regular file). The runtime gate catches it at the moment of the bad edit; the CI/pre-commit gate catches it before the bad commit lands, even if the runtime gate was skipped or ran in a non-instrumented executor.

## Why deferred

Pick-up of this guard is **not in Bundle B scope** (Bundle B is T1 worktree-first session architecture + T3 PostToolUse hook reconstructor; CI infrastructure changes are orthogonal). The Bundle B Preparation already locks the runtime discipline that protects T1 + T3 executors directly. Witness count for the bad-edit failure is currently **zero** in this repo — the iter2 Codex evaluator surfaced the *risk* empirically (via `/tmp` reproduction), but no actual bad commit has occurred yet against this repository's tracked symlinks. Per Principle 10 (witness-bound work), a CI guard for a zero-witness pattern is defensible only as a **deferred** item.

## When to pick up

Pick up at whichever fires first:

- **First real defect**: any commit lands in which a tracked `.claude/skills/...` path flips from `120000` to `100644` (the symlink was replaced by a regular file). At that point, the witness count is N=1 and the durable defense becomes justified.
- **N≥2 future bundles** edit skill files via the workspace path (Bundle B is N=1). With a second bundle's worth of skill-editing executors running the same risk, accumulated exposure justifies the upfront CI work even without an actual defect.
- **Tooling change**: any new agent type or harness is introduced that does NOT have `Edit`-tool inode-preserving semantics by default (e.g., a CI bot that runs `sed -i` on skill files for batch refactors). The new tooling shifts the failure probability from "unlikely human slip" to "default behavior of automation".

## Suggested approach

A pre-commit hook (preferred for fast feedback) or a GitHub Actions check (broader coverage) that runs:

```bash
# For every staged file under .claude/, check the git index mode
git diff --cached --name-only -- '.claude/' | while read path; do
  old_mode=$(git ls-files -s -- "$path" | awk '{print $1}' || echo "")
  staged_mode=$(git ls-files --stage -- "$path" | awk '{print $1}' || echo "")
  if [ "$old_mode" = "120000" ] && [ "$staged_mode" = "100644" ]; then
    echo "ERROR: workspace symlink $path was converted to a regular file."
    echo "       Restore with: rm $path && ln -sfn <relative-target> $path"
    exit 1
  fi
done
```

(Pseudocode — exact diff plumbing depends on the chosen pre-commit framework; the trigger condition is `120000 → 100644` mode-transition on any tracked `.claude/` path.)

Alternative: an annotated baseline file listing every expected symlink path + its canonical target; a CI step compares the current `git ls-files -s` output against the baseline and fails on divergence. This catches the same defect plus net-new untracked symlink conversions.

Effort estimate: **low** (a half-day script + CI wire-up). Owner: deferred — assign at pick-up.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

Pointer: Preparation iter3 Symlink-preservation edit contract — staged as the deferred follow-up to the runtime `test -L` gate (point 4 of the discipline list in `staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` § Symlink-preservation edit contract). Originating empirical witness: iter2 Codex evaluation (`evaluation/iter2/codex/{structure,usage,consistency,risk,overall}.md`), `/tmp/gobbi-edit-test/` `sed -i` reproduction confirming the failure mode.
