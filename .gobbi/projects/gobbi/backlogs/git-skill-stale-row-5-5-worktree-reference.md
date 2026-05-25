---
title: "git/SKILL.md § P2 still says \"Configuration row 5.5\" for worktree creation — stale post-T02"
type: backlog
severity: low
status: addressed
source: session-2026-05-24-45388fa9-T05-eval
created: 2026-05-25
promoted-from: sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/execution/task-05/staging/backlogs/project/git-skill-stale-row-5-5-worktree-reference.md
promoted-at: 2026-05-25
---

# git/SKILL.md § P2 still says "Configuration row 5.5" for worktree creation — stale post-T02

## Finding

`git/SKILL.md` (workspace-level copy at `.claude/skills/git/SKILL.md`) lines 155 and 157 both
say "Configuration row 5.5" when referring to the P2 invocation point:

- Line 155: "P2 is invoked from Configuration row 5.5 for worktree-first sessions..."
- Line 157: "Steps (run once at Configuration row 5.5 for worktree-first sessions; not re-invoked...)"

This is stale. T02 (commit `2b537ae`, session `2026-05-24-45388fa9`) reordered the
`orchestration/SKILL.md` Step 1 table under DL-7 Option B: worktree creation moved from row 5.5
to row **row 5**, and state.json init moved to row 5.5. The project copy of `orchestration/SKILL.md`
(`.gobbi/projects/gobbi/skills/orchestration/SKILL.md`) already reflects this change (row 5 =
worktree, row 5.5 = state.json). The workspace copy `.claude/skills/git/SKILL.md` was out of
scope for T02 and remains unreconciled.

## What needs fixing

Reconcile `.claude/skills/git/SKILL.md` § P2 (lines 155, 157) to say "Configuration row 5"
(not "row 5.5") for P2 invocation. Apply the same fix to any other workflow docs or the
D-1 memorial (`features/session-foundations-bundle-b/design/d-1-worktree-row-5-5.md`) that
still reference the old row 5.5 numbering for worktree creation.

## Drift class

Same drift class as issue #258 (cross-doc drift detector). The workspace-level skill copy
diverged from the project-level skill copy after T02 modified only the project copy.
This is the canonical case for a drift-detector scan: after any row-reorder in
`orchestration/SKILL.md`, all downstream docs citing the affected row number need
a corresponding update. Until issue #258 ships, this fix requires manual identification
and update.

## Impact

Low severity. No behavioral change — the invocation semantics are identical; only the row
label is wrong. A reader consulting `git/SKILL.md` § P2 and `orchestration/SKILL.md` Step 1
simultaneously will see contradictory row references, reducing trust in the docs.

## Evidence

- Evaluator findings: T05 iter1 dual-system EVAL — Claude finding F-CONS-1 (High) and
  Codex finding CONS-001 (High), both REVISE.
- Authoritative source: `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` row 5
  (`**Create worktree (P2 wrapper)...`).
- Stale reference: `.claude/skills/git/SKILL.md:155,157` ("Configuration row 5.5").

## Resolution

Fixed in PR #270 (session 2026-05-24-45388fa9 / follow-up FU-1, 2026-05-25):

- `git/SKILL.md` lines 155 and 157 corrected from "Configuration row 5.5" to "Configuration row 5" (real target: `.gobbi/projects/gobbi/skills/git/SKILL.md`).
- `features/session-foundations-bundle-b/design/d-1-worktree-row-5-5.md` (D-1 memorial) left as historical record per user decision 2026-05-25 — forward-pointer blockquote added near the top referencing the bundle-C T02 / commit 2b537ae reorder. Memorial text not rewritten.
- `gobbi/SKILL.md:91` (found by the FU Codex confirm) carried the same stale "row 5.5 (worktree creation)" reference plus an ordering error ("runs after state.json initialization"). Corrected to "row 5 (worktree creation), which runs before state.json initialization (row 5.5) and before session.json stamping (row 6, where git.worktreePath is recorded)".
- The 5 workflow sub-docs (`execution/planning/ideation/wrap-up/preparation.md`) also each carried "row 5.5 worktree-first lock" in their session-memory commit description and were corrected to "row 5 worktree-first lock" (found via the FU-1c tree-wide audit; root cause = T02 edited only `orchestration/SKILL.md`).
