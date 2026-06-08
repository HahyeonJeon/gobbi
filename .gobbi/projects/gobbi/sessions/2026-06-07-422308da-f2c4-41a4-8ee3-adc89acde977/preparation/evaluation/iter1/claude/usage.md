# Usage — Preparation readiness report eval (iter1, claude)

## Frame + findings

### Scenario U1 — Can a Planner pick up the anchors table and decompose tasks correctly at 3am?
The anchors table gives File / target / verified anchor / Idea-cited / status. A Planner can map each Idea CRUD item to a verified line. The corrected G2 anchor (use line 5, not line 4) is explicitly flagged. USABLE. PASS.

### Scenario U2 — Does the report give the executor the edit-mechanics it needs (canonical paths, Edit-vs-Write)?
Item 5 tells the executor: edit canonical `.gobbi/...` for the two skill files (symlink refuses through `.claude/...`); edit `.claude/CLAUDE.md` directly. I confirmed CLAUDE.md is a regular file (not symlink) and the two skill files are mirror symlinks. The guidance is correct and actionable. PASS.

### Scenario U3 — Does the C1 split-anchor guidance prevent the executor mis-anchoring Chat branches?
The report tells Planning: 3a/3b (CLAUDE.md / Iteration Caps) may cite chat-mode.md; 3c/3d (Stuck / Regression) must use evaluation.md's existing behavior because chat-mode.md is silent. I confirmed: chat-mode.md has budget-exhausted/escalate at lines 154 + 237 (Iteration Caps parallel) and the after-EVALUATION discuss gate at line ~298, but is silent on Stuck + Regression (only line 563 "silent regression" in unrelated settings prose). The split-anchor guidance is CORRECT and prevents a real mis-anchor. PASS — high-value usability item, accurate.

### Finding U-1 — G1 instructs Wrap-up to check the wrong thing (Medium)
- **Type:** assumption_risk
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:** Item 1b / G1 (lines 47-49, 78) instruct Wrap-up to "rebase/merge develop before opening the PR and re-confirm the Evaluation blockquote did not move" based on the premise that develop drifted in a *different* paragraph and the worktree is "clean". The actual state (git diff origin/develop): the worktree is 1 commit BEHIND develop (`#295 c8a8654`); develop ADDED the Continue-vs-Fresh sentence to the principle-intro paragraph; the worktree lacks it. The edit-target Evaluation blockquote IS byte-identical between worktree and develop, so the merge conclusion is right, but the model of WHERE the drift lives is inverted.
- **Why it matters:** A Wrap-up agent following this note will look for a develop-side edit to "merge in" while believing the worktree is current; in fact it must rebase to pick up #295. The conclusion (no collision on line 27) holds, so it is non-blocking, but the rationale is misleading.
- **Suggested direction:** Wrap-up should rebase onto origin/develop (worktree is behind by #295) and re-confirm line 27; the drift is the worktree being stale, not develop having drifted. Manager + user decide whether to correct the note now or at Wrap-up.

The report is usable for Planning. The one usability defect is the G1 note pointing Wrap-up at an inverted drift model.
