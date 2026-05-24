---
perspective: risk
system: codex
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
task: task-01
iter: 2
verdict: PASS
surfaced-by: codex
---

## Artifact Summary
Commit `05e446b` reduces the recovery risk introduced by Task 01's earlier worktree bootstrap row. What: it defines what happens when `session.json.git.worktreePath` is stale and the directory is missing. Why: iter1 `COD-RISK-001` found that resume/clear/compact could fail or proceed ambiguously after a deleted worktree directory. How: it adds a guarded escalation path using `AskUserQuestion`, recreates via P2 only by user choice, and aborts Step 1 without advancing when investigation is chosen.

### Memory reads
- Required skills/rules/mistakes, especially `git/SKILL.md` P6 and process mistakes around destructive cleanup and absolute paths.
- All iter1 Codex/Claude evaluation files and the planning Task 01 scope.
- Target evidence: row 5.5, `git show 05e446b`, required greps for 3-state/P6/AskUserQuestion, symlink check, trailer check.

## Locked Frame (Stage 1)
Scenario: Stale-path risk is handled.
- Check: inherited `COD-RISK-001` is seeded.
- Check: set-but-missing path is recognized as a distinct state.
- Check: recovery is not silent.
- Check: abort is available before downstream stamping.

Scenario: The fix does not introduce destructive cleanup risk.
- Check: no `rm -rf`, forced worktree removal, reset, or branch deletion appears in row 5.5.
- Check: user authority is requested before recreate/abort decision.
- Check: P6 recovery guidance is cited.

Scenario: Direct mode remains safe (adversarial).
- Check: direct mode still skips worktree creation.
- Check: direct mode still relies on row 6 current-HEAD branch stamping.

## Stage 2 — Findings
Scenario: Stale-path risk is handled.
- PASS: row 5.5 state (3) names the stale condition: `worktreePath` is set and the path is missing.
- PASS: state (3) logs a warning and surfaces `AskUserQuestion`.
- PASS: state (3) offers recreate via P2 or abort to investigate.
- PASS: abort exits Step 1 without advancing.

Inherited finding `COD-RISK-001`
- Type: `assumption_risk`
- Domain: `process`
- Confidence: 100
- Severity: High
- Disposition: addressed
- Evidence: row 5.5 line 103 now defines the stale recorded-path state and cites `git/SKILL.md` P6 recovery guidance.
- FP-check: tool-verified by greps for `3-state`, `AskUserQuestion`, and `P6`.

Scenario: The fix does not introduce destructive cleanup risk.
- PASS: close reading found no `rm -rf`, `--force`, `git reset`, branch deletion, or worktree removal instruction in row 5.5.
- PASS: P6 is cited, and P6 itself requires surfacing the orphaned worktree decision to the manager/user.

Scenario: Direct mode remains safe (adversarial).
- PASS: row 5.5 still says `If direct: skip — no worktree is created`.
- PASS: row 5.5 still says `git.branch` will be stamped from current HEAD in row 6.

No new open risk findings.

## Verdict
PASS

The stale-path recovery risk that blocked iter1 is addressed without adding destructive cleanup behavior.

## Low-confidence appendix
None.
