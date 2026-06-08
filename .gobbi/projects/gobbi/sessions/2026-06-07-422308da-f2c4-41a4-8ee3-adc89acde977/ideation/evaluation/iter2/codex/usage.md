# Usage

## Artifact Summary

The consumers are Planning, Execution, and future managers reading the updated docs during Auto-mode orchestration. The Idea gives them concrete edit targets, proposed wording sketches, placement constraints, and scenarios that test the intended manager behavior.

## Memory Reads

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.claude/skills/orchestration/chat-mode.md`

## Locked Frame (Stage 1)

Scenario: A Planner can decompose the design without asking where the new section belongs.
- Check: The placement is locked.
- Check: In-scope and out-of-scope files are explicit.
- Check: The implementation checklist names the exact edit classes.

Scenario: A future Auto manager can operate at an evaluation boundary.
- Check: The design forbids asking whether/how to evaluate.
- Check: The design forbids manager self-evaluation.
- Check: The design tells Auto what to do on REVISE and cap exhaustion.

Scenario: A future Auto manager hits repeated unchanged findings (adversarial).
- Check: The design says whether unchanged/stuck findings follow Auto iteration, Chat escalation, or an Auto exception.
- Check: The answer is consistent across `auto-mode.md` and `workflow/evaluation.md`.

## Findings

No Usage-only finding. The consumer impact of the remaining issue is recorded under Consistency because it is caused by cross-doc contradiction.
