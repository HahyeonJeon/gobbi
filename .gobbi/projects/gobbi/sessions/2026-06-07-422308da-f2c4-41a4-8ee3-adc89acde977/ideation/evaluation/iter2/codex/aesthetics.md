# Aesthetics

## Artifact Summary

The revised Idea is readable and sectioned as a design artifact: Scope Contract, Framed Problem, canonical-home verification, per-file CRUD plan, cross-file risks, scenarios, implementation checklist, and decisions log. The rewrite is more direct than iter1 and makes the locked placement visible in multiple sections.

## Memory Reads

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.agents/skills/principles/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/mistakes/principle-text-lead-with-imperative-not-agent-psychology.md`

## Locked Frame (Stage 1)

Scenario: A reader can find the chosen design path quickly.
- Check: The Scope Contract names the in-scope files.
- Check: The placement decision is called out near the `auto-mode.md` plan.
- Check: The implementation checklist repeats the placement decision.

Scenario: Authority citations are readable and correct.
- Check: Producer/evaluator separation cites `evaluation/SKILL.md` or CLAUDE's evaluation block, not a wrong numbered principle.
- Check: Remaining principle-number references match the current 10-principle table.
- Check: Stale citations in out-of-scope mistake files are labeled as stale rather than copied as authority.

Scenario: The rewrite hides a rejected path in plausible prose (adversarial).
- Check: Mentions of §4 are only references to existing defaults, not a chosen §4 insertion path.
- Check: "Rejected" or equivalent language is present for the old mid-document insertion path.

## Iter1 Finding Dispositions

### COD-OVERALL-003 - Producer/evaluator citation used a wrong principle number

Type: design_flaw / Domain: docs-sync / Disposition: addressed / Confidence: 100 / Severity: Medium

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:101` cites `evaluation/SKILL.md` and the CLAUDE evaluation block for producer/evaluator separation.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:183` explicitly states producer/evaluator separation is not a numbered principle and Principle 3 is "Design With the User, Based on References."
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:187` says §7.2 has no principle number attached.

Why-it-matters: The design no longer hardens evaluation discipline with a false authority citation.

Suggested-direction: Preserve the source-based citation.

## Findings

No Aesthetics findings. The draft is scannable and the stale principle citation has been corrected.
