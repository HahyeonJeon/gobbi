# Project Perspective

## Findings

### COD-PROJ-001 - Locked trailing placement is reopened as a design choice

Type: design_flaw / Domain: process / Disposition: open / Confidence: 100 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:90-92` says to create the new Auto evaluation section as "a new §4" and says "Planning may re-decide placement".
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:197` makes placement an Implementation checklist decision: "trailing-append as new §7 ... vs insert-as-§4".
- The same draft scope says the user-locked resolutions are "Pre-resolved (do not re-open)" at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:26`.

Why-it-matters: The brief locked trailing append and forbade relitigating the approach. Reopening placement makes the design fail the scope contract before Planning starts, and it invites the exact kind of manager question the change is supposed to remove.

Suggested-direction: Treat trailing append as fixed scope, not a Planning decision or optional branch.

## Verdict

REVISE
