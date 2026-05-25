---
evaluator: codex
model: gpt-5-codex
iter: 1
task: T02
verbatim: true
---
# Cross-Reference and Citation Evaluation (C-2, C-3, C-4)

The Step 1 table occurrences at lines 102-104 were excluded from C-2 per the prompt. The whole-file grep outside that table found no stale reference that still maps worktree creation to old row 5.5 or `state.json` initialization to old row 5.

ID: C-2-1
Severity: Low
Confidence: 100
Evidence:
- line 107: "**Row 5 — Direct-mode opt-out (LOCK #5)**"
- line 109: "When `settings.git.workflow.mode == \"direct\"`, row 5 is skipped entirely — no worktree is created, no P2 is invoked, and `session.json.git.worktreePath` stays `null`. `git.branch` is stamped from the current HEAD in row 6. This is the documented escape hatch; it is not a fallback-on-error path."
- line 120: "- **Worktree creation.** `worktree-pr` invokes [`git/SKILL.md` § P2](../git/SKILL.md#p2----create-worktree) at row 5 to create a per-session worktree under `.gobbi/projects/<name>/worktrees/`. `direct` skips P2 entirely — the session works in the main tree at its current checkout."
- line 134: "Also verify `jq -r '.git.worktreePath'` returns a non-null value for `worktree-pr` sessions. A `null` `worktreePath` on a `worktree-pr` session indicates row 5 was skipped or P2 failed without surfacing an error."
- line 152: "**Loop iteration.** Rows 1-5 form one iteration. Row 5 decides whether to iterate (back to row 1) or exit the loop. Repeats up to `workflow.ideation.maxIterations` until `PASS`, `Skipped`, or cap exhausted."
- line 170: "**Loop iteration.** Rows 1-5 form one iteration. Row 5 decides whether to iterate (back to row 1) or exit the loop. Repeats up to `workflow.preparation.maxIterations` until `PASS`, `Skipped`, or cap exhausted. A `RE-IDEATE` verdict in row 5 is a special exit that re-enters the Ideation Loop (Preparation re-runs after Ideation re-completes)."
- line 188: "**Loop iteration.** Rows 1-5 form one iteration. Row 5 decides whether to iterate (back to row 1) or exit the loop. Repeats up to `workflow.planning.maxIterations` until `PASS`, `Skipped`, or cap exhausted."
- line 206: "**Loop iteration (per task in the Plan).** Rows 1-5 form one iteration. Row 5 decides whether to iterate (back to row 1) or exit the loop. Repeats up to `workflow.execution.maxIterations` until `PASS`, `Skipped`, or cap exhausted. The whole Execution Loop runs once per planned task."
- line 224: "**Loop iteration.** Rows 1-5 form one iteration. Row 5 decides whether to iterate (back to row 1) or exit the loop. Repeats up to `workflow.wrap-up.maxIterations` until `PASS`, `Skipped`, or cap exhausted."
- line 415: "see [Step 1 row 6](#step-1--workflow-configuration)"
Finding: No stale C-2 cross-reference was found in `orchestration/SKILL.md`. The Step 1 footnote and smoke-test text now use row 5 for worktree creation; later rows 152, 170, 188, 206, and 224 refer to each loop's own row 5 `ITER / EXIT`, not Step 1 row semantics. Line 415 references row 6, whose session-init role is unchanged.

ID: C-3-1
Severity: Low
Confidence: 100
Evidence: git/SKILL.md line 17: "## Memory Access Matrix"; orchestration/SKILL.md line 102: "[Memory Access Matrix](../git/SKILL.md#memory-access-matrix)"; orchestration/SKILL.md line 103: "[Memory Access Matrix](../git/SKILL.md#memory-access-matrix)"; orchestration/SKILL.md line 104: "[Memory Access Matrix](../git/SKILL.md#memory-access-matrix)"
Finding: The citation anchor in rows 5, 5.5, and 6 matches the actual H2 heading slug. I found no hyphenated stale anchor such as `Memory-Access-Matrix-Critical-Rule`.

ID: C-4-1
Severity: Low
Confidence: 100
Evidence: line 107: "**Row 5 — Direct-mode opt-out (LOCK #5)**"; line 109: "row 5 is skipped entirely — no worktree is created, no P2 is invoked"; line 120: "`worktree-pr` invokes [`git/SKILL.md` § P2](../git/SKILL.md#p2----create-worktree) at row 5"
Finding: LOCK #5 is consistent with direct mode skipping worktree creation. It correctly says the skipped row is row 5, not row 5.5.
