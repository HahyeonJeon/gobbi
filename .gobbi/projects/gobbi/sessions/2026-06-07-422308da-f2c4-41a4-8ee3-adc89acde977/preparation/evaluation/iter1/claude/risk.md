# Risk — Preparation readiness report eval (iter1, claude)

## Frame + findings

### Scenario R1 — Will a wrong anchor cause an executor to edit the wrong line (blast radius)?
14/15 anchors verified exact; the one correction (G2: line 5 not line 4) is itself correct and flagged. Risk of mis-edit from anchors is LOW. The Stuck/Regression/Iteration-Caps anchors cite content lines rather than section headers (see Structure S-1), a minor precision risk but resolvable. Acceptable.

### Scenario R2 — Is the merge/drift risk correctly characterized so it does not bite at Wrap-up?
The merge CONCLUSION (no collision on the line-27 edit target; clean 3-way merge expected) is correct — line 27 is byte-identical between worktree and develop. But the drift MODEL is inverted (see Consistency F-C1 / Usage U-1): the worktree is BEHIND develop by #295, not develop-drifted-ahead-of-a-clean-worktree. Residual risk: a Wrap-up agent that trusts "worktree is clean / current" may NOT rebase, then open a PR that is 1 commit behind develop and silently drops nothing on line 27 but carries a stale principle-intro paragraph (missing the Continue-vs-Fresh sentence #295 added). That is a real, if small, regression risk on a NON-target paragraph.

### Finding R-1 — Stale-worktree regression risk on the non-target principle-intro paragraph (Medium)
- **Type:** assumption_risk
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:** Worktree CLAUDE.md line 31 lacks the Continue-vs-Fresh sentence that origin/develop carries (added by #295). If Wrap-up merges with the worktree as the base (rather than rebasing onto develop), a naive merge keeps the worktree's stale paragraph; depending on merge direction the #295 sentence could be lost or produce a conflict the report did not anticipate (it predicted a "clean 3-way merge"). The report's G1 says "different paragraphs, clean merge expected" — but it never identified that the worktree is *behind*, so its merge prediction rests on a wrong premise.
- **Why it matters:** Could regress an unrelated CLAUDE.md paragraph at PR time, or surprise Wrap-up with an unexpected conflict. Non-blocking for Planning/Execution (the line-27 edit is safe), but the readiness report's job is to de-risk Wrap-up, and here it under-states the risk by mis-modeling it.
- **Suggested direction:** Flag for Wrap-up: rebase onto origin/develop first (worktree is behind by #295), then apply the line-27 edit. Manager + user decide.

### Scenario R3 — Are the "non-blocking" claims for G1 and G2 sound?
- **G2 (off-by-one):** non-blocking is CORRECT — the corrected anchor (line 5) is supplied; Planning uses it directly. No residual risk.
- **G1 (drift):** non-blocking *for Planning/Execution* is CORRECT (line-27 edit target is collision-free). But the report's framing under-states the Wrap-up rebase obligation (R-1). The "non-blocking" label is right for the immediate next phase; the residual is a Wrap-up-time process risk.

### Scenario R4 — Reversibility / scope-breach risk
The report confirms no out-of-scope file is touched and SKILL.md:247 is verify-only. Docs-only, fully reversible. No destructive risk. PASS.

Net: no Critical risk. One Medium (R-1) stale-worktree regression risk that the G1 mischaracterization masks; one Medium already counted under Usage (U-1). These are the same root cause (inverted drift model) viewed through different lenses.
