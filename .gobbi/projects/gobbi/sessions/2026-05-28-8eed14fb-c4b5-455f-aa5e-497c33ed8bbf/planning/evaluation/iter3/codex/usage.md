# Usage - Planning iter3 Evaluation (Codex)

## Artifact Summary
The artifact is `draft-iter3.md`, a task brief for fresh executors and a Wrap-up assistant. What: it should provide each agent with files, decisions, success criteria, verification commands, required skills, and required mistakes. Why: executors should be able to run each task without rediscovering absent skills, stale mirrors, baseline mechanics, or verification intent. How: iter3 adds explicit path variables, explicit mode/default checks, semantic model checks, `PRE_T4_REV` / `PRE_T5_REV`, prose FLAG-2 notes, and a `printf` evaluate-mode comparison.

## Memory reads
- `/playinganalytics/git/gobbi/AGENTS.md`
- `/playinganalytics/git/gobbi/.agents/skills/principles/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/mistake/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/planning/evaluation.md`
- `/playinganalytics/git/gobbi/.agents/skills/orchestration/workflow/planning.md`
- `/playinganalytics/git/gobbi/.agents/skills/gobbi/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/design-literal-retire-instruction-without-replacement.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/prose-reclassification-target-is-project-level-notes.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter3.md`
- All eight iter2 Codex files under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter2/codex/`

## Locked Frame (Stage 1)
Scenario 1: A fresh executor can load the required context.
- Check: required skills are loadable or explicitly replaced.
- Check: required mistakes are relevant and readable.
- Check: no deleted mirror path becomes an executor question.

Scenario 2: Verification commands are usable by a fresh executor.
- Check: binary assertions test the intended condition.
- Check: absolute path variables resolve to the files the task modifies.
- Check: a correct implementation is not rejected by a wrong root path.

Scenario 3: Special Focus B - F1/G5 note shape.
- Check: T1/T2/T3/T4/T5 have no `- claude` entry.
- Check: each of those tasks has a prose FLAG-2 note above YAML.
- Check: T6/T7 have no accidental `claude` entry.

Scenario 4 (adversarial): The executor follows the commands literally and works in the wrong tree.
- Check: pre-flight symlink checks target existing worktree symlinks.
- Check: post-edit checks read the same worktree files the executor changed.

Coverage declarations:
- Operator accessibility: task blocks are readable; command root correctness determines usability.
- Observability: plan-level and task-level gates are the operator signal.

## Evaluation (Stage 2)
Scenario 1 result:
- Yes. The absent `claude` skill is replaced by prose notes, and `plugins/` mirror work is not reintroduced.

Scenario 2 result:
- No. The path variables are absolute, but not usable for this worktree. T1 sets `F1` and `M1` to main-tree paths; tool checks show the main `chat-mode.md` path and main `.claude` symlink do not exist, while the worktree equivalents do. T4/T5 likewise read main-tree template files while Git baselines come from `$WT`.

Scenario 3 result:
- Yes. The G5 shape passes: `grep -c 'FLAG-2'` returned 10 and the `required-skills:` scan for `- claude` returned 0.

Scenario 4 result:
- No. A fresh executor running T1's first pre-flight command against `M1=/playinganalytics/git/gobbi/.claude/skills/orchestration/chat-mode.md` fails before any edit, even though `$WT/.claude/skills/orchestration/chat-mode.md` is a valid symlink. The same root mismatch affects T2/T3 and the T4/T5 post-edit file reads.

Inherited finding disposition table:

| Finding ID | Current disposition | Evidence |
|---|---|---|
| codex-usage-004 | addressed | T4 no longer uses recursive `.mode` extraction in the command; explicit `.chat.mode` and `.auto.mode` checks are present. |
| codex-usage-005 | addressed | The old command placeholders are removed from task verification-command lines; residual literal grep hits are retrospective prose examples and are recorded as a new mandatory-check regression. |

Typed findings:

### codex-usage-iter3-001
- Type: design_flaw
- Domain: process
- Confidence: 100
- Severity: High
- Evidence: A fresh executor cannot run T1 as written because `M1=/playinganalytics/git/gobbi/.claude/skills/orchestration/chat-mode.md` does not exist as a symlink (`main_m1_symlink:1`), while `$WT/.claude/skills/orchestration/chat-mode.md` does (`wt_m1_symlink:0`). The same pattern appears in T2/T3, and T4/T5 compare worktree Git history to main-tree file paths.
- Disposition: open

## Low-confidence appendix
None.

VERDICT: REVISE
