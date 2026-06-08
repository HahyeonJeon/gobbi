# Risk Perspective

## Findings

### COD-RISK-001 - The insert-as-§4 branch can force an out-of-scope file edit

Type: design_flaw / Domain: process / Disposition: open / Confidence: 100 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:90-92` says insert as new §4 and update the `orchestration/SKILL.md` pointer if renumbering shifts it.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:173` admits the insert option "forces an out-of-scope edit to `orchestration/SKILL.md:247`".
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:24` lists `orchestration/SKILL.md` state machine as out of scope.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.claude/skills/orchestration/SKILL.md:247` is the pointer that would be affected.

Why-it-matters: The design carries an implementation path that knowingly crosses the scope boundary. If a downstream agent follows that branch, the docs-only change touches a forbidden file and widens review.

Suggested-direction: Remove the branch that requires out-of-scope anchor repair.

## Verdict

REVISE
