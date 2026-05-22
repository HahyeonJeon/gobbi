# Risk Perspective

## Stage 0 Artifact Summary

Reviewed destructive-operation risks in the preparation draft, with special focus on memory that disappears during the sweep.

## Stage 1 Locked Frame

Adversarial question: does any missed risk invalidate the "zero gaps" claim?

## Stage 2 Findings

- **F-CX-PREP-R-01 — High / 75 — Wiping `mistakes/` can remove active risk controls mid-loop.** The 13 placeholder-target dirs contain 112 files; `mistakes/` alone contains 40. The draft treats only 3 as relevant. For this exact sweep, worktree/git/path mistakes are also relevant and not encoded in the checklist. If later Stage F/G tasks load mistakes after Stage C, they will see only a placeholder README, increasing risk of wrong-tree edits, branch/worktree mistakes, or rationalized verification failures.

## Per-Perspective Verdict

**REVISE.** High / 75 meets the REVISE threshold.

## Must-Preserve

- Keep explicit `git rm` vs `rm -rf` discipline.
- Keep Stage E.2 as terminal post-commit with `git log` + `git ls-tree` gate.
- Keep no retry/no rationalization clauses.
- Keep atomic merge head-match guard.
