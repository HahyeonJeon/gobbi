You are a Codex evaluator running the iter1 evaluation of Task 04 for the gobbi project, dual-system Claude+Codex contract. Independent perspective from Claude.

## Session-id guard (do this FIRST)

The manager pre-seeded `.wrapper-marker` at this directory. Verify it exists and write `.codex-marker` next to it as your first action.

```bash
SESSION_DIR=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
CODEX_DIR=$SESSION_DIR/execution/task-04/evaluation/iter1/codex
test -f "$CODEX_DIR/.wrapper-marker" || { echo "ABORT: wrapper marker missing — wrong session"; exit 1; }
date -u +"%Y-%m-%dT%H:%M:%SZ" > "$CODEX_DIR/.codex-marker"
```

If `.wrapper-marker` is missing, ABORT immediately — your CWD has resolved to the wrong session.

## Task

Evaluate commit `79b8925` on branch `chore/268-session-foundations-bundle-b` against the Plan acceptance for Task 04. Walk all 7 perspectives + Overall per `.gobbi/projects/gobbi/skills/evaluation/SKILL.md`. Output 8 files (one per perspective + overall.md) to `$CODEX_DIR/`.

**You are independent of Claude.** Do not anchor on what Claude might find — find what you find.

## Read these inputs

1. The commit: `git -C /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/268-session-foundations-bundle-b show 79b8925`
2. The modified files in full:
   - `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`
   - `.gobbi/projects/gobbi/skills/delegation/SKILL.md`
3. Plan acceptance for T04 from `$SESSION_DIR/planning/artifacts/plan.md` (grep for "Task 04" / `04-gobbi-and-delegation-cross-ref-and-audit`):

```
files:
  - .gobbi/projects/gobbi/skills/gobbi/SKILL.md (modify)
  - .gobbi/projects/gobbi/skills/delegation/SKILL.md (modify)
verifies:
  - grep -E 'row 5.5|Configuration Step 1' .claude/skills/gobbi/SKILL.md returns ≥1 match
  - grep -nE 'main.tree' .claude/skills/delegation/SKILL.md — every match site checked
  - test -L .claude/skills/gobbi/SKILL.md && test -L .claude/skills/delegation/SKILL.md
```

4. Scope Contract: `$SESSION_DIR/ideation/artifacts/bundle-b-ideation-pass.md`
5. Project mistakes: `.gobbi/projects/gobbi/mistakes/*.md` — filter docs-sync, process
6. Evaluation skill: `.gobbi/projects/gobbi/skills/evaluation/SKILL.md`
7. Phase child doc: `.gobbi/projects/gobbi/skills/evaluation/workflow/execution.md`

## Procedure (per evaluation/SKILL.md)

Stage 0 (Target Understanding) → Stage 1 (Frame Build per perspective) → Stage 2 (7 perspectives sequential) → Stage 3 (Overall).

5-Type vocabulary: `scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` / `general`.

Each finding carries: Type + Domain + Disposition + Confidence(0/25/50/75/100) + Severity(Critical/High/Medium/Low) + Evidence.

Per-perspective verdict: any Critical ≥ 75 → FAIL; any High ≥ 50 → REVISE; else PASS.

## Critical for Consistency perspective

T04 is a cross-reference + grep-audit task. Consistency MUST verify:
- The cross-ref in gobbi/SKILL.md actually points to a real, existing section in orchestration/SKILL.md
- Every `main-tree` site in delegation/SKILL.md (pre + post commit) has been audited and qualified or explicitly declared not-applicable

## Output

Write 8 files. Filenames: `project.md`, `structure.md`, `performance.md`, `aesthetics.md`, `usage.md`, `consistency.md`, `risk.md`, `overall.md`. All inside `$CODEX_DIR/`.

Each per-perspective file: Artifact Summary + Memory reads + Locked Frame + per-scenario per-check yes/no + findings + verdict + low-confidence appendix.

`overall.md`: cross-perspective tensions + cross-cutting findings + Karpathy 4-mode check + Preserve list + Overall verdict + a leading line `VERDICT: <PASS|REVISE|FAIL>`.

## Session-write path discipline

All session writes MUST use the absolute main-tree path:
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/execution/task-04/evaluation/iter1/codex/`

Do NOT use relative paths. Do NOT use the worktree path.

Read-only against artifacts. No fixes. Findings only.
