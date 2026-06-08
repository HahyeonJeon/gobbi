# Structure

## Artifact Summary

The Idea proposes a docs-only design with one new `auto-mode.md` section and targeted updates to two existing cross-reference points. The structural choice is conservative: append a new Auto-mode evaluation-discipline home after §6, leave §1-§6 numbering intact, and link existing scattered references to that new home.

## Memory Reads

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`

## Locked Frame (Stage 1)

Scenario: The new section's physical position preserves existing anchors.
- Check: Existing §1-§6 numbers remain unchanged.
- Check: The new section is appended before Cross-references.
- Check: Existing references to §3 and §6 do not require edits outside scope.

Scenario: The design avoids duplicating row-level evaluation instructions.
- Check: The §2 tables get a pointer, not six manually divergent row edits.
- Check: The §4 `evaluate.mode` row gets a pointer without changing the row's value.
- Check: §6 remains the source for Auto cap-exhaustion behavior.

Scenario: A nearby manager-side evaluation rule conflicts with the new Auto section (adversarial).
- Check: The whole `workflow/evaluation.md` manager-side flow is checked, not only `Iteration Caps`.
- Check: Any remaining unconditional AskUserQuestion path is classified by mode or by Auto exception.

## Iter1 Finding Dispositions

### COD-OVERALL-001 - Placement did not honor trailing append

Type: design_flaw / Domain: process / Disposition: addressed / Confidence: 100 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:93` locks "after §6, before Cross-references" and says no renumbering.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:181` says `orchestration/SKILL.md` is no longer at risk.

Why-it-matters: Structure now matches the user's placement contract.

Suggested-direction: Preserve the no-renumbering structure.

## Findings

No Structure-only findings. The structural rewrite is clear and keeps existing section order stable.
