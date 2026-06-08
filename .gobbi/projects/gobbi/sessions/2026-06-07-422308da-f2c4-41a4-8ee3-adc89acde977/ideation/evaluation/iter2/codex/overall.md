# Overall

## Artifact Summary

The iter2 Idea is a revised docs-only design to harden Auto-mode evaluation discipline. It keeps scope bounded to three files, rejects the iter1 mid-document insertion path, adds the required `workflow/evaluation.md` `Iteration Caps` mode split, and corrects the stale producer/evaluator principle citation. The three iter1 findings are addressed. One new cross-cutting consistency finding remains open.

## Memory Reads

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/evaluation/iter1/codex/overall.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.claude/CLAUDE.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.claude/skills/orchestration/chat-mode.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.agents/skills/principles/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.agents/skills/evaluation/SKILL.md`
- Relevant project mistakes: `manager-skipped-dual-system-eval.md`, `section-order-is-part-of-the-contract-not-just-the-set.md`, `evaluator-false-pass-without-diffing.md`, `leader-iter2-verification-claim-without-evidence.md`

## Prior Iter Finding Dispositions

### COD-OVERALL-001 - The design does not honor the locked trailing-append placement

Type: design_flaw / Domain: process / Disposition: addressed / Confidence: 100 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:91-93` locks trailing append as new §7 after §6 and before Cross-references, with no renumbering.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:181` says no out-of-scope `orchestration/SKILL.md` edit is required.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:224` says the iter1 mid-document §4-insert option is rejected and removed.

Why-it-matters: The design no longer forces a scope breach or anchor renumbering.

Suggested-direction: Preserve the trailing-append decision.

### COD-OVERALL-002 - The cap-exhaustion question conflict remains live

Type: design_flaw / Domain: docs-sync / Disposition: addressed / Confidence: 100 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:135-139` proposes a Chat/Auto split for `workflow/evaluation.md § Iteration Caps`.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:197-200` tests Auto cap exhaustion and the second-instance check.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:210` includes the mode-split edit in the implementation checklist.

Why-it-matters: The exact iter1 gap is now handled in an in-scope target file.

Suggested-direction: Preserve the mode split.

### COD-OVERALL-003 - The producer/evaluator rule is supported with a stale principle reference

Type: design_flaw / Domain: docs-sync / Disposition: addressed / Confidence: 100 / Severity: Medium

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:101` cites `evaluation/SKILL.md` and `.claude/CLAUDE.md`'s evaluation block.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:183` states Principle 3 is "Design With the User, Based on References."
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:187` states no producer/evaluator principle number remains attached.

Why-it-matters: The revised hardening does not repeat the bad authority citation.

Suggested-direction: Preserve the current source citation.

## Cross-cutting Findings

### COD-OVERALL-001 - Stuck detection remains a mode-agnostic mid-loop user-triage path

Type: design_flaw / Domain: docs-sync / Disposition: open / Confidence: 75 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md:241-247` unconditionally escalates to the user when a finding is stuck across two iterations, with options including `accept-with-deferral`, `abort`, and `change scope`.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:104` proposes Auto §7.3 text forbidding mid-loop defer/address/triage prompts and limiting finding interrupts to Always-Ask plus unresolvable scope-change findings.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:113-114` repeats that the manager never pauses to triage/defer findings mid-loop and never escalates at cap exhaustion.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md:32-40` says Auto pauses only for the listed exceptions and not for any other reason.

Why-it-matters: The revised design correctly fixes the named `Iteration Caps` conflict, but a nearby in-scope escalation path can still produce the same Auto-mode failure after two repeated findings: a user defer/abort/change-scope prompt mid-loop. The draft does not say whether stuck detection is Chat-only, an Auto step-failure exception, or subject to Auto's no-triage rule, so the target docs would remain internally inconsistent.

Suggested-direction: Reconcile the Stuck-detection path with the new Auto evaluation-discipline contract and Chat's user-driven gates.

## Must Preserve

- The new `auto-mode.md` section is a trailing §7 after §6 and before Cross-references.
- The manager never asks whether/how to evaluate in Auto mode.
- The manager never evaluates; it spawns exactly two evaluator subagents.
- Degraded `claude-only` is post-failure only, not a pre-evaluation option.
- `.claude/CLAUDE.md` uses a Chat/Auto mode split and keeps user-owned findings in Always-Ask categories.
- `workflow/evaluation.md § Iteration Caps` is mode-specific and preserves Auto §6's unsound-to-proceed exception.
- Producer/evaluator separation cites `evaluation/SKILL.md` or the CLAUDE evaluation block, not a numbered principle.

## Verdict Rationale

The three iter1 findings are addressed. The new High-confidence consistency finding blocks PASS under the supplied threshold: any High finding with confidence >= 50 requires REVISE.

VERDICT: REVISE
