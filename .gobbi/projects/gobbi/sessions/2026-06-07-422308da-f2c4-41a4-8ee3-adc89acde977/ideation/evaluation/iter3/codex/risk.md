# Risk

## Artifact Summary + Memory reads

The iter3 Idea reduces Auto-mode orchestration risk by preventing routine-triage user prompts while retaining the safety gates that protect the dual-system evaluation guarantee. The main risk check is whether the new no-interrupt discipline can cause unsafe Auto progress.

Memory reads:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/mistakes/evaluator-false-pass-without-diffing.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md`

## Locked Frame (Stage 1)

Scenario 1: The dual-system guarantee is not weakened.
- Check: Manager self-evaluation remains prohibited.
- Check: Exactly two evaluators remain required.
- Check: Single-system fallback is post-failure only and user-gated.

Scenario 2: The "no routine triage" rule does not silence critical safety interrupts.
- Check: Major divergence interrupts.
- Check: Degraded-mode/single-system fallback interrupts.
- Check: Both-systems-fail interrupts.
- Check: Always-Ask and unresolvable scope-change interrupts still fire.

Scenario 3 (adversarial): The design trusts the report instead of the files.
- Check: The live target docs contain the old mode-agnostic paths the draft claims to fix.
- Check: The revised draft proposes concrete edits to those exact live paths.

## Per-scenario per-check results

Scenario 1: pass. The draft prohibits manager evaluation at `draft-iter1.md:122-123` and sharpens the target `workflow/evaluation.md` manager-job line at `draft-iter1.md:157`. It keeps degraded mode post-failure only at `draft-iter1.md:120` and `draft-iter1.md:161`.

Scenario 2: pass. Safety-gate interrupts are listed in the Problem 3 classification table at `draft-iter1.md:75-77`, in Auto section 7.3 at `draft-iter1.md:128`, and in D8 at `draft-iter1.md:269`. Always-Ask and unresolvable scope-change interrupts remain carved out at `draft-iter1.md:128`.

Scenario 3: pass. The live target still has mode-agnostic Regression, Stuck, and Iteration Caps paths at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md:234-258`; the revised draft proposes exact mode splits at `draft-iter1.md:165-175`.

## Typed findings

None.

## Low-confidence appendix

None.
