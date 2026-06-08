# Consistency - Preparation readiness report eval (iter2, codex)

## Artifact Summary + Memory Reads

Artifact under evaluation: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/preparation/rawdata/draft-iter1.md`.

What: cross-file consistency check of the corrected readiness report. Why: this iteration specifically needed independent verification of git state, resolved iter1 findings, and post-rebase anchors. How: compare each report claim to live files and git evidence.

Memory reads: corrected report; locked Idea; all iter1 evaluation files; target docs; `chat-mode.md`; `orchestration/SKILL.md`; #295 diff; `manager-skipped-dual-system-eval.md`; project rule `stub-redirect-format.md`.

## Locked Frame (Stage 1)

Scenario 1: Git and #295 claims are accurate.
- Check: `HEAD` is `c8a8654`.
- Check: `HEAD..origin/develop` count is `0`.
- Check: #295 touched `auto-mode.md` and `.claude/CLAUDE.md` in the reported regions.
- Check: #295 did not touch `workflow/evaluation.md`.

Scenario 2: Iter1 findings are resolved.
- Check: The inverted G1 claim is corrected.
- Check: `workflow/evaluation.md:42` is present in support anchors.
- Check: `manager-skipped-dual-system-eval.md` is present in mistake coverage.
- Check: The nav-row drift overstatement is removed.

Scenario 3: Target anchors are correct post-rebase.
- Check: `auto-mode.md` total line count, section headers, row 3, evaluate.mode lock, and Cross-references match.
- Check: `workflow/evaluation.md` manager-job, two-evaluator support anchor, safety-gate and routine-triage sections match.
- Check: `.claude/CLAUDE.md:27` matches.

Scenario 4 (adversarial): An extra verify-only anchor row was not rechecked after #295.
- Check: Any anchor row in the report that claims "exact" points to the live line.

## Per-scenario Results

Scenario 1: pass. `git rev-parse HEAD` returns `c8a86546ac9923da2d662af028766637c2d2ece1`; `git rev-list --count HEAD..origin/develop` returns `0`. `git show c8a8654` shows the `auto-mode.md` line 131 continued-executor sentence and the `.claude/CLAUDE.md` line 31 continued-teammate parenthetical. `workflow/evaluation.md` is absent from the #295 changed-files list.

Scenario 2: pass. The corrected report says the worktree was behind at iter1 and is now rebased at `draft-iter1.md:53-56`; includes the support mistake at `draft-iter1.md:76` and `draft-iter1.md:139`; includes `workflow/evaluation.md:42` at `draft-iter1.md:39`, `draft-iter1.md:123`, and `draft-iter1.md:138`; and says the nav-table row was not a drift item at `draft-iter1.md:55`.

Scenario 3: pass for target anchors. Live anchors match: `auto-mode.md` has 292 lines, row 3 at line 78, #295 touch at line 131, section 4 at line 196, evaluate.mode at line 208, section 6 at line 251, Cross-references at line 271. `workflow/evaluation.md` has manager-job at line 5, two-evaluator support anchor at line 42, Severity-gated header at line 112 with Major row at line 119, Dual-system failure at line 162, Degraded-mode at line 188, Regression at line 234, Stuck at line 241, and Iteration Caps at line 253. `.claude/CLAUDE.md` has the Evaluation blockquote at line 27 and #295's touch at line 31.

Scenario 4: partial. One extra verify-only row is wrong: the report still says `orchestration/SKILL.md:247` is the Auto Mode section 3/section 6 pointer. In the live post-#295 file, line 247 is the verdict aggregation table separator, and the Auto Mode pointer is line 266.

## Typed Findings

Finding CONS-ITER2-001

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`general` / `docs-sync` / `100` / `Low` / `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/preparation/rawdata/draft-iter1.md:104`, `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/preparation/rawdata/draft-iter1.md:132`, `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/SKILL.md:247`, `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/SKILL.md:266` / The report claims `orchestration/SKILL.md:247` exactly references Auto Mode section 3 and section 6, but after #295 the live pointer is at line 266. Line 247 is only a table separator. This is not a blocker because `orchestration/SKILL.md` is verify-only, the pointer content still exists, and no planned edit depends on line 247. / Update the verify-only anchor row and prose from line 247 to line 266 before using the report as a precise Planning reference.

## Low-confidence Appendix

None.
