# Consistency Perspective

## Findings

### COD-CONS-001 - Workflow evaluation cap behavior remains inconsistent with Auto-mode no-interrupt behavior

Type: design_flaw / Domain: docs-sync / Disposition: open / Confidence: 75 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md:253-258` says that when the cap is reached without `PASS`, the manager escalates with an AskUserQuestion offering "revise one more time, accept the artifact as-is despite findings, or abort".
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md:251-262` says Auto mode does not interrupt the user mid-session at maxIterations exhaustion and the user reviews outcomes at Wrap-up.
- The Idea's proposed edits for `workflow/evaluation.md` only cover the manager job wording and degraded-mode wording at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:125-135`.
- The Idea then claims the Auto scenario should validate "Manager does NOT interrupt mid-session" at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:189`.

Why-it-matters: After the proposed edit, an Auto-mode manager reading `workflow/evaluation.md` can still derive a user deferral/acceptance question at the iteration cap. That conflicts with the Auto-mode rule that finding review happens at Wrap-up except for Always-Ask interrupts.

Suggested-direction: Make the cap behavior across the in-scope docs mode-consistent so Auto does not inherit the generic AskUserQuestion path.

### COD-CONS-002 - The producer/evaluator citation conflicts with the current principles file

Type: design_flaw / Domain: docs-sync / Disposition: open / Confidence: 100 / Severity: Medium

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:99-100` cites "Principle 3, producer!=evaluator".
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/principles/SKILL.md:47` defines Principle 3 as "Design With the User, Based on References".

Why-it-matters: The proposed three-file docs would disagree with the mandatory principles skill. This is a cross-file consistency defect, not only a style issue.

Suggested-direction: Keep citations aligned with the current principle table and the true producer/evaluator separation docs.

## Verdict

REVISE
