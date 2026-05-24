You are a Codex evaluator running the iter1 evaluation of Task 06 for the gobbi project, dual-system Claude+Codex contract. Independent perspective from Claude.

## Session-id guard (do this FIRST)

```bash
SESSION_DIR=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
CODEX_DIR=$SESSION_DIR/execution/task-06/evaluation/iter1/codex
test -f "$CODEX_DIR/.wrapper-marker" || { echo "ABORT: wrapper marker missing — wrong session"; exit 1; }
date -u +"%Y-%m-%dT%H:%M:%SZ" > "$CODEX_DIR/.codex-marker"
```

If `.wrapper-marker` is missing, ABORT — wrong session.

## Task

Evaluate commit `32b9adc` on branch `chore/268-session-foundations-bundle-b` against the Plan acceptance for Task 06. Walk all 7 perspectives + Overall per `.gobbi/projects/gobbi/skills/evaluation/SKILL.md`. Output 8 files to `$CODEX_DIR/`.

You are independent of Claude.

## Read these inputs

1. The commit: `git -C /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/268-session-foundations-bundle-b show 32b9adc`
2. The modified file in full: `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (focus on row 5.5 region — the direct-mode footnote and smoke-test regex added by this commit)
3. Plan acceptance for T06 from `$SESSION_DIR/planning/artifacts/plan.md`:

```
files:
  - .gobbi/projects/gobbi/skills/orchestration/SKILL.md (modify)
verifies:
  - grep -E 'direct.*mode|workflow.git.mode' .claude/skills/orchestration/SKILL.md
    returns ≥1 match co-located with row 5.5
  - grep -E 'chore/session-[0-9]{4}' .claude/skills/orchestration/SKILL.md
    returns ≥1 match
```

4. LOCK #5 (from prior session): home for direct-mode opt-out documentation is orchestration/SKILL.md (NOT git/SKILL.md). Explicit user-locked decision.
5. Scope Contract: `$SESSION_DIR/ideation/artifacts/bundle-b-ideation-pass.md`
6. Project mistakes: `.gobbi/projects/gobbi/mistakes/*.md` — filter docs-sync, process
7. Evaluation skill: `.gobbi/projects/gobbi/skills/evaluation/SKILL.md`
8. Phase child doc: `.gobbi/projects/gobbi/skills/evaluation/workflow/execution.md`

## Procedure

Stage 0 → 1 → 2 (7 perspectives) → 3. 5-Type vocabulary. Per-finding Type + Domain + Disposition + Confidence + Severity + Evidence.

## Critical for Consistency + Risk perspectives

T06's footnote cross-links to `git/SKILL.md § Core Principles` for "full definitions of direct vs worktree-pr modes". Verify:
- Does `git/SKILL.md § Core Principles` actually define `direct` and `worktree-pr` mode keys and their behavioral contracts?
- Does the smoke-test regex `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` match the actual branch-naming convention documented in `git/conventions.md`?
- LOCK #5: confirm direct-mode opt-out is NOT also documented in `git/SKILL.md` (no duplication; orchestration is the home).
- Is the smoke-test gate actually wired anywhere (hook, memorization step), or is it doc-only?

## Output

Write 8 files to `$CODEX_DIR/`: `project.md`, `structure.md`, `performance.md`, `aesthetics.md`, `usage.md`, `consistency.md`, `risk.md`, `overall.md`.

`overall.md` must include a leading line `VERDICT: <PASS|REVISE|FAIL>`.

## Session-write path discipline

All writes use absolute main-tree path:
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/execution/task-06/evaluation/iter1/codex/`

Read-only against artifacts. No fixes.
