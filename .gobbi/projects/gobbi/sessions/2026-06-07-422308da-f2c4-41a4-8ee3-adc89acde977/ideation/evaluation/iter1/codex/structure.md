# Structure Perspective

## Findings

### COD-STR-001 - Auto-mode section organization is internally contradictory

Type: design_flaw / Domain: docs-sync / Disposition: open / Confidence: 100 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:90-92` directs an insert as new §4, with renumbering.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:173` recommends trailing append to avoid out-of-scope `orchestration/SKILL.md` edits.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:214` logs the trailing §7 recommendation.

Why-it-matters: A Planner or Executor cannot implement one coherent document organization from this. One branch requires renumbering and an out-of-scope anchor update; the other branch preserves scope. A design doc must choose the locked structure, not carry both.

Suggested-direction: Make the Auto-mode structure single-path and internally consistent with the locked trailing section placement.

## Verdict

REVISE
