# Consistency

## Artifact Summary

The revised Idea fixes the three named iter1 consistency failures: placement now uses a trailing §7 append, cap exhaustion is mode-split in `workflow/evaluation.md`, and producer/evaluator separation cites the right authority. A separate manager-side escalation path remains in `workflow/evaluation.md` directly above `Iteration Caps`.

## Memory Reads

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/evaluation/iter1/codex/overall.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.claude/CLAUDE.md`

## Locked Frame (Stage 1)

Scenario: The three iter1 findings have explicit addressed/open dispositions.
- Check: Trailing §7 placement is chosen and no §4-insert path remains as the design.
- Check: The `Iteration Caps` section gets a Chat/Auto split.
- Check: Producer/evaluator separation cites `evaluation/SKILL.md` or CLAUDE's evaluation block.

Scenario: The docs agree on Auto's interruption contract.
- Check: `auto-mode.md` no-mid-session review at §6 is preserved.
- Check: New `auto-mode.md` §7.3 no-triage rule agrees with every in-scope evaluation escalation path.
- Check: `.claude/CLAUDE.md` mode split does not reintroduce mode-agnostic triage.

Scenario: A nearby user-escalation instruction remains mode-agnostic (adversarial).
- Check: `workflow/evaluation.md` sections immediately adjacent to `Iteration Caps` are checked for AskUserQuestion escalation.
- Check: Stuck or regression handling does not contradict Auto's no-mid-loop triage rule.

## Iter1 Finding Dispositions

### COD-OVERALL-001 - Placement did not honor trailing append

Type: design_flaw / Domain: process / Disposition: addressed / Confidence: 100 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:91-93`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:207`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:224`

Why-it-matters: The out-of-scope `orchestration/SKILL.md` edit path is no longer part of the design.

Suggested-direction: Preserve the trailing append.

### COD-OVERALL-002 - Cap-exhaustion question conflict remains live

Type: design_flaw / Domain: docs-sync / Disposition: addressed / Confidence: 100 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:135-139` proposes a mode-aware `Iteration Caps` rewrite.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:197-200` includes scenarios for Auto cap exhaustion and the second-instance check.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:210` names the mode-split edit in the implementation checklist.

Why-it-matters: The exact iter1 second-instance finding is now in scope and has a concrete design edit.

Suggested-direction: Preserve the Chat/Auto split in `Iteration Caps`.

### COD-OVERALL-003 - Producer/evaluator rule used a stale principle reference

Type: design_flaw / Domain: docs-sync / Disposition: addressed / Confidence: 100 / Severity: Medium

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:101`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:183`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:187`

Why-it-matters: The draft no longer relies on a false numbered-principle citation.

Suggested-direction: Keep the source citation to `evaluation/SKILL.md`.

## Findings

### COD-CONSISTENCY-001 - The stuck-detection prompt remains a mode-agnostic mid-loop user-triage path

Type: design_flaw / Domain: docs-sync / Disposition: open / Confidence: 75 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md:241-247` defines Stuck detection and unconditionally says to escalate to the user before the iteration cap, with options including `accept-with-deferral`, `abort`, and `change scope`.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:104` proposes new Auto §7.3 text saying the manager must not ask the user whether to defer, address, or triage findings mid-loop, and that only Always-Ask findings plus unresolvable scope-change findings interrupt.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:113-114` reinforces the same rule in the "manager never" table: no triage/defer mid-loop and no cap escalation.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md:32-40` says the Auto manager pauses only for the listed exceptions and does not pause for any other reason.

Why-it-matters: The design fixes `Iteration Caps` but leaves the adjacent Stuck-detection path able to recreate the same Problem-3 behavior after two repeated findings: an Auto manager can still read an in-scope evaluation doc and ask the user to defer/abort/change scope mid-loop. If Stuck detection is meant to be an Auto exception, the revised Idea does not classify it that way; if it is not an exception, the unconditional prompt remains inconsistent with the proposed Auto §7.3 guard.

Suggested-direction: Reconcile the Stuck-detection contract with the new Auto no-mid-loop-triage rule and with Chat's explicit user-driven gates.
