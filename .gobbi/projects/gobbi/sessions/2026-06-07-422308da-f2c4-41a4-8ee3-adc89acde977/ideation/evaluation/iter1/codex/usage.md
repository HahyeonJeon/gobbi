# Usage Perspective

## Findings

### COD-USAGE-001 - The implementation checklist teaches the manager to ask a forbidden placement question

Type: design_flaw / Domain: process / Disposition: open / Confidence: 100 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:167-173` says the placement conflict is a "scope question for Planning/the user".
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:197` labels the placement choice as "[Always-Ask: Design/structure decision]".
- The draft itself states the user-locked resolutions are "Pre-resolved (do not re-open)" at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:26`.

Why-it-matters: The next consumer is a manager or Planner. This checklist gives that consumer a prompt to ask the user about a decision the brief already locked. That reintroduces the "ask and idle" failure pattern in a new form.

Suggested-direction: Make the checklist executable without user triage for this already-locked placement decision.

## Verdict

REVISE
