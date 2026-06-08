# Project

## Artifact Summary

The revised Idea is an iter2 Ideation design for a docs-only hardening pass across three in-scope files: `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`, `.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`, and `.claude/CLAUDE.md`. Its goal is to stop three Auto-mode evaluation failures: asking whether/how to evaluate, manager self-evaluation, and mid-loop user triage/idling. The design uses a trailing `auto-mode.md` §7 append, targeted `workflow/evaluation.md` wording changes, and a mode split in `.claude/CLAUDE.md`.

## Memory Reads

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/evaluation/iter1/codex/overall.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.claude/CLAUDE.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.claude/skills/orchestration/chat-mode.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/mistakes/manager-skipped-dual-system-eval.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/rules/stub-redirect-format.md`

## Locked Frame (Stage 1)

Scenario: The design stays inside the locked scope contract.
- Check: Only the three in-scope files are listed as editable.
- Check: Out-of-scope files are explicitly listed as flag-only.
- Check: No design path requires `orchestration/SKILL.md` edits.

Scenario: The right problem is addressed.
- Check: All three manager failures are named.
- Check: Each failure is tied to a root cause in the target docs.
- Check: Success criteria map to observable manager behavior.

Scenario: The iter1 High findings are resolved without broadening scope.
- Check: The rejected mid-document §4 insertion is not the chosen path.
- Check: The cap-exhaustion conflict is included in the design.
- Check: The bad Principle 3 citation is removed from authority claims.

Scenario: A hidden adjacent conflict remains in an in-scope file (adversarial).
- Check: Nearby evaluation escalation paths are checked, not only the line range named in iter1.
- Check: Any remaining mode-agnostic user prompt is compared to Auto's no-mid-loop-triage rule.

## Iter1 Finding Dispositions

### COD-OVERALL-001 - Placement did not honor trailing append

Type: design_flaw / Domain: process / Disposition: addressed / Confidence: 100 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:91-93` locks the new section as trailing §7 after §6 and before Cross-references, with no renumbering.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:207` repeats the implementation checklist item as trailing §7.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:224` states the iter1 mid-document §4-insert option is rejected and removed.

Why-it-matters: The revised design now respects the scope contract and avoids an out-of-scope `orchestration/SKILL.md` edit.

Suggested-direction: Preserve this placement lock in Planning and Execution.

## Findings

No Project-scope findings. The Scope Contract is sharp and the prior placement breach is addressed.
