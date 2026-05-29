# Usage - Planning iter2 Evaluation (Codex)

## Artifact Summary
The artifact is `draft-iter2.md`, a task brief for fresh executors and a Wrap-up assistant. What: it should provide each agent with files, decisions, success criteria, verification commands, required skills, and required mistakes. Why: executors should not have to rediscover whether a skill exists, whether a plugin mirror matters, or how to interpret a verification command. How: iter2 adds F1 NOTE comments, F3 binary assertions, F6 pre-flight symlink checks, and F8 slug naming.

## Memory reads
- `/playinganalytics/git/gobbi/.agents/skills/principles/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/mistake/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/planning/evaluation.md`
- `/playinganalytics/git/gobbi/.agents/skills/orchestration/workflow/planning.md`
- `/playinganalytics/git/gobbi/.agents/skills/gobbi/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/design-literal-retire-instruction-without-replacement.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter2.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`
- All eight files under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json`

## Locked Frame (Stage 1)
Scenario 1: A fresh executor can load the required context.
- Check: required skills are loadable or explicitly replaced.
- Check: required mistakes are relevant and readable.
- Check: no deleted mirror path becomes an executor question.

Scenario 2: Verification commands are usable by a fresh executor.
- Check: binary assertions test the intended condition.
- Check: placeholders are either resolved by adjacent `files:` entries or named in the command setup.
- Check: a correct implementation is not rejected by a wrong assertion.

Scenario 3: Special Focus B - F1 NOTE shape.
- Check: T1/T2/T3/T4/T5 have no `- claude` entry.
- Check: each of those tasks has a `# NOTE:` comment.
- Check: each NOTE cites `gobbi/SKILL.md` line 187 FLAG-2 and `.claude/CLAUDE.md`.
- Check: T6/T7 have no accidental `claude` entry.

Scenario 4 (adversarial): The executor needs to ask "what does this command prove?"
- Check: `grep`, `jq`, `wc`, and `find` checks are not merely binary wrappers around the wrong selector.

Coverage declarations:
- Operator accessibility: task blocks are readable; command correctness determines usability.
- Observability: Plan-level gate and task gates are the operator signal.

## Evaluation (Stage 2)
Scenario 1 result:
- Yes. The absent `claude` skill is replaced by NOTE comments; the deleted `plugins/` mirror no longer creates NEEDS_CONTEXT.

Scenario 2 result:
- No. The T4 command at `draft-iter2.md:265` will false-fail a correct settings file because it asks for every recursive `.mode` value to equal only `auto,chat,`. A fresh executor following the plan can implement the intended Chat/Auto default sets and still be blocked by this assertion.

Scenario 3 result:
- Yes. `rg` found no task-level `- claude` entry. T1/T2/T3/T4/T5 each have a `# NOTE:` line citing `gobbi/SKILL.md` line 187 FLAG-2 and `.claude/CLAUDE.md`. T6 and T7 do not add `claude`.

Scenario 4 result:
- No. The mode assertion wraps an over-broad recursive selector in a binary check, so the question shifts from "did the executor produce both default sets?" to "did the executor somehow remove existing nested mode fields?" That is not the intended proof.

Inherited finding disposition table:

| Finding ID | Current disposition | Evidence |
|---|---|---|
| codex-usage-001 | addressed | No required-skill block contains `- claude`; F1 NOTE comments cite the absent skill source and direct fallback. |
| codex-usage-002 | superseded | The `<pre-T4-rev>` and `<pre-T5-rev>` baselines are now captured, but the remaining T4 mode assertion has a new usability failure recorded as `codex-usage-004`. |
| codex-usage-003 | addressed | Plan-level checks #2-#9 now use assertions rather than comments. |

Typed findings:

### codex-usage-004
- Type: design_flaw
- Domain: execution-readiness
- Confidence: 100
- Severity: High
- Evidence: `draft-iter2.md:265` expects the recursive `.mode` selector to return only `auto,chat,`. The current `settings.default.json` already has nested mode values (`agent`, `always`, `user`) under `workflow.*.discuss.mode` and `workflow.*.evaluate.mode`. A valid future two-mode template will still contain those nested values, so the executor cannot satisfy this assertion while preserving the existing settings schema.
- Disposition: open

### codex-usage-005
- Type: checklist_gap
- Domain: verification
- Confidence: 75
- Severity: Medium
- Evidence: Several task-level verification commands still use unresolved command placeholders such as `<chat-mode.md>`, `<settings.default.json>`, `<state.template.json>`, `<session.template.json>`, `<new-backlog.md>`, and `<archived-chat-backlog>` (`draft-iter2.md:150-155`, `265-269`, `313-318`, `431-434`, `480-482`). Most are inferable from the task's `files:` list, but they are not runnable as-is.
- Disposition: open

## Low-confidence appendix
None.

VERDICT: REVISE
