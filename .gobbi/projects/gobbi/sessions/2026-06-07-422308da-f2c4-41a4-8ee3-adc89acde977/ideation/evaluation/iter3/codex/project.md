# Project

## Artifact Summary + Memory reads

The iter3 Idea is a docs-only design to harden Auto-mode evaluation discipline. It keeps scope limited to `auto-mode.md`, `workflow/evaluation.md`, and `.claude/CLAUDE.md`; it preserves the locked trailing-append placement for the new Auto section; and it expands the prior fix to cover Stuck detection, Regression marking, and safety-gate carve-outs.

Memory reads:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/evaluation/iter1/codex/overall.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/evaluation/iter2/codex/overall.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.claude/CLAUDE.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.claude/skills/orchestration/chat-mode.md`

## Locked Frame (Stage 1)

Scenario 1: The Idea stays inside the locked scope contract.
- Check: Only the three allowed files are in scope.
- Check: Out-of-scope files are read for consistency only, not edited.
- Check: No design path requires editing `orchestration/SKILL.md`, `chat-mode.md`, `discussion/SKILL.md`, `principles/SKILL.md`, templates, or settings.

Scenario 2: The Idea solves the right Auto-mode problem.
- Check: It fixes the evaluate-mode question, self-evaluation, and mid-loop routine triage/idling.
- Check: It addresses all four routine-triage instances named in the revised root-cause analysis.
- Check: Safety-gate interrupts remain allowed.

Scenario 3 (adversarial): The revised design quietly expands scope by making out-of-scope docs mandatory edit targets.
- Check: The draft explicitly says `chat-mode.md` stays read-only and the Chat behavior must be matched, not changed.
- Check: The draft verifies the locked trailing append leaves the `orchestration/SKILL.md` section 3/6 pointer valid.

## Per-scenario per-check results

Scenario 1: pass. Scope is explicit at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:20-24`, and implementation checklist item 7 verifies no out-of-scope edit at `draft-iter1.md:255`.

Scenario 2: pass. Problems 1-3 are stated at `draft-iter1.md:32-65`; Stuck detection and Regression marking are now included at `draft-iter1.md:58-59` and mode-split at `draft-iter1.md:169-175`.

Scenario 3: pass. The draft flags `chat-mode.md` as consistency-only at `draft-iter1.md:214` and verifies `orchestration/SKILL.md` needs no edit at `draft-iter1.md:218`; the actual pointer remains section 3/6 at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/SKILL.md:247`.

## Typed findings

None.

## Low-confidence appendix

None.
