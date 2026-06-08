# Overall

## Cross-cutting findings

### COD-OVERALL-001 - The design does not honor the locked trailing-append placement

Type: design_flaw / Domain: process / Disposition: open / Confidence: 100 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:90-92` proposes a mid-document insert and lets Planning re-decide.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:197` makes placement an Always-Ask decision.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:173` admits the mid-document branch forces an out-of-scope edit.

Why-it-matters: This is the main blocker. The Idea otherwise understands the three manager failures, but its structure plan contradicts the locked approach and creates an unauthorized branch.

Suggested-direction: Collapse the design to the locked trailing-append path.

### COD-OVERALL-002 - The cap-exhaustion question conflict remains live

Type: design_flaw / Domain: docs-sync / Disposition: open / Confidence: 75 / Severity: High

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md:253-258` still tells the manager to ask the user at cap exhaustion.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md:251-262` says Auto does not interrupt mid-session at cap exhaustion.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:125-135` does not include a design edit for this conflict in the in-scope `workflow/evaluation.md`.

Why-it-matters: The design fixes the normal `REVISE` path but leaves a second "accept/defer/abort" question path in a manager-loaded evaluation doc. That is close to the third reported failure.

Suggested-direction: Align the in-scope evaluation and Auto docs so Auto's cap path cannot be misread as a mid-session user triage.

### COD-OVERALL-003 - The producer/evaluator rule is supported with a stale principle reference

Type: design_flaw / Domain: docs-sync / Disposition: open / Confidence: 100 / Severity: Medium

Evidence:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/rawdata/draft-iter1.md:99-100` cites "Principle 3, producer!=evaluator".
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/skills/principles/SKILL.md:47` defines Principle 3 as "Design With the User, Based on References".

Why-it-matters: The proposed hardening should reduce ambiguity, not add a bad authority citation.

Suggested-direction: Cite only sources that actually contain the producer/evaluator separation rule.

## Must-preserve

- Keep the explicit Auto-mode prohibition against asking whether/how to evaluate.
- Keep the rule that the manager must not evaluate and must spawn exactly two evaluator subagents before normal evaluation.
- Keep degraded mode as a post-failure fallback only, with no pre-evaluation "claude-only" menu.
- Keep the CLAUDE.md mode split that preserves Chat's finding discussion gate while making Auto auto-iterate on `REVISE`.
- Keep canonical-path discipline: edit `.gobbi/...` skill files, and edit `.claude/CLAUDE.md` directly.

## Final aggregated verdict

VERDICT: REVISE
