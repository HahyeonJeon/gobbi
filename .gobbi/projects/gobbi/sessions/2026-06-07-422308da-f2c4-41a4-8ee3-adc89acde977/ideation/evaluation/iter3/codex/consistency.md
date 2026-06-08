# Consistency

## Artifact Summary + Memory reads

The iter3 Idea must keep the revised Auto-mode discipline consistent across the draft, the live target docs, and prior evaluation findings. The main consistency check is whether all routine-triage paths are now named and whether the safety gates are not accidentally silenced.

Memory reads:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/evaluation/iter2/codex/overall.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.claude/CLAUDE.md`

## Locked Frame (Stage 1)

Scenario 1: The iter2 open finding is addressed.
- Check: The draft identifies Stuck detection as a Problem 3 instance.
- Check: The draft mode-splits Stuck detection with Chat and Auto branches.
- Check: The Auto branch matches Auto section 6 and section 7.3.

Scenario 2: Regression marking is also mode-split.
- Check: The draft identifies Regression marking as a Problem 3 instance.
- Check: The draft gives Chat and Auto branches.
- Check: The Auto branch records the regression and surfaces it at Wrap-up.

Scenario 3: Safety gates are preserved and explicitly carved out.
- Check: Major PASS/FAIL or REVISE/FAIL divergence remains a stop-the-line interrupt.
- Check: Degraded-mode/single-system fallback remains post-failure only and interrupts in Auto.
- Check: Both-systems-fail remains an Auto interrupt.
- Check: Minor PASS/REVISE divergence auto-proceeds.

Scenario 4 (adversarial): The no-routine-triage rule is over-applied and silences a real safety gate.
- Check: The draft states the routine-triage-vs-safety-gate policy in `workflow/evaluation.md`.
- Check: `auto-mode.md` section 7.3 has a safety-gate carve-out.
- Check: The section 7.4 table explicitly says the manager never silences a safety gate.

## Per-scenario per-check results

Scenario 1: pass. Iter2 found Stuck detection open at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/evaluation/iter2/codex/overall.md:62-74`. The revised draft now names it at `draft-iter1.md:58`, classifies it at `draft-iter1.md:72`, and mode-splits it at `draft-iter1.md:169-171`.

Scenario 2: pass. Regression marking is newly identified as a Problem 3 instance at `draft-iter1.md:59`, classified at `draft-iter1.md:73`, and mode-split at `draft-iter1.md:173-175`.

Scenario 3: pass. The target file currently has minor divergence auto-proceed and major divergence stop-the-line at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md:112-121`; the draft says to keep that behavior and label major divergence as a safety gate at `draft-iter1.md:163`. Degraded mode and both-fail are live at `workflow/evaluation.md:188-199`; the draft preserves them at `draft-iter1.md:161`.

Scenario 4: pass. The framing sentence is specified at `draft-iter1.md:159`, the Auto section 7.3 carve-out at `draft-iter1.md:127-128`, and the section 7.4 no-silencing row at `draft-iter1.md:141`.

## Typed findings

None.

## Low-confidence appendix

None.
