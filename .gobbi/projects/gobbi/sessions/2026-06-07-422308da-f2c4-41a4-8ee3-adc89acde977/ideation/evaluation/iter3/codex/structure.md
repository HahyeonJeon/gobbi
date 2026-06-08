# Structure

## Artifact Summary + Memory reads

The iter3 Idea is a docs-only design with three edit targets and one new Auto-mode evaluation-discipline section. The structural decision is to append `auto-mode.md` section 7 after the existing section 6 and before Cross-references, while mode-splitting only the routine-triage sections in `workflow/evaluation.md`.

Memory reads:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/SKILL.md`

## Locked Frame (Stage 1)

Scenario 1: The new Auto-mode section has a stable structural home.
- Check: Placement is exact.
- Check: Existing section numbers 1-6 are not renumbered.
- Check: Existing section 3 and section 6 references stay valid.

Scenario 2: The workflow/evaluation edits are local updates, not a new competing section structure.
- Check: The draft mode-splits Iteration Caps, Stuck detection, and Regression marking in place.
- Check: It keeps Severity-gated divergence and Degraded-mode policy in their existing homes.
- Check: It adds one classification sentence instead of creating a parallel policy document.

Scenario 3 (adversarial): The design creates two evaluation-discipline authorities that can drift.
- Check: `auto-mode.md` section 7 is the Auto-facing quick guard.
- Check: `workflow/evaluation.md` remains the detailed orchestration authority.
- Check: Cross-references are added both ways.

## Per-scenario per-check results

Scenario 1: pass. The draft locks the append point at `draft-iter1.md:115`, repeats it in the organization summary at `draft-iter1.md:201`, and includes it in the checklist at `draft-iter1.md:249`.

Scenario 2: pass. The `workflow/evaluation.md` CRUD plan is update-only at `draft-iter1.md:153-179`; it mode-splits routine triage at `draft-iter1.md:165-175` and preserves safety gates at `draft-iter1.md:161-163`.

Scenario 3: pass. The draft adds `auto-mode.md` section 7 as the scan point at `draft-iter1.md:119-142`, then adds mutual cross-references at `draft-iter1.md:149` and `draft-iter1.md:177`.

## Typed findings

None.

## Low-confidence appendix

None.
