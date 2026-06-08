# Usage

## Artifact Summary + Memory reads

The iter3 Idea must be usable by Planning and Execution without asking the user again about the locked mode split or safety-gate boundary. The consumer should know exactly which sections to update and which interrupts remain valid in Auto mode.

Memory reads:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.claude/skills/orchestration/chat-mode.md`

## Locked Frame (Stage 1)

Scenario 1: Planner can decompose the work without reopening locked decisions.
- Check: Placement is locked.
- Check: Routine-triage classification is locked.
- Check: The exact target sections are listed.

Scenario 2: Manager-facing behavior is clear.
- Check: In Auto mode, REVISE auto-iterates without routine triage.
- Check: Stuck and regression findings are surfaced at Wrap-up.
- Check: Major divergence, degraded mode, and both-systems-fail still interrupt.

Scenario 3 (adversarial): Chat behavior regresses because Auto wording leaks into Chat.
- Check: Chat retains discussion after evaluation.
- Check: Chat retains cap-exhaustion escalation.
- Check: The design says to match `chat-mode.md`, not edit it.

## Per-scenario per-check results

Scenario 1: pass. The exact target sections are listed in the implementation checklist at `draft-iter1.md:249-253`, and D8 locks the classification at `draft-iter1.md:269`.

Scenario 2: pass. Auto REVISE behavior is in section 7.3 at `draft-iter1.md:126`; Stuck and Regression marking are mode-split at `draft-iter1.md:171` and `draft-iter1.md:175`; safety gates are preserved at `draft-iter1.md:128`.

Scenario 3: pass. Chat-mode currently says after EVALUATION the manager discusses findings and remediation at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.claude/skills/orchestration/chat-mode.md:296-300` and cap exhaustion escalates at `chat-mode.md:154` and `chat-mode.md:500`. The draft flags `chat-mode.md` as read-only consistency context at `draft-iter1.md:214`.

## Typed findings

None.

## Low-confidence appendix

None.
