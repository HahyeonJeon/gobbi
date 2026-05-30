# Risk - Planning iter3 Evaluation (Codex)

## Artifact Summary
The artifact is `draft-iter3.md`, a capped Planning execution contract for spec, settings, template, backlog, and archive work. What: it should reduce execution risk by making file scope, verification, and no-bleed constraints explicit. Why: iter2 had open verification findings that could block or misdirect executors. How: iter3 replaces recursive mode extraction, replaces weak model diff grep with `jq -S`, removes `/tmp` command baselines, removes command placeholders, cleans FLAG-2 YAML, and replaces the triple-escaped evaluate-mode assertion.

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
Scenario 1: Verification commands enforce the intended safety properties.
- Check: count/value assertions fail on wrong values and pass on correct values.
- Check: selectors target the exact invariant, not unrelated sibling fields.
- Check: no-bleed checks catch protected-file edits.

Scenario 2: Special Focus A - G1-G6 mandatory grep checks.
- Check: each "Must be 0" command returns 0.
- Check: each "Must be >= 1" command returns a positive count.
- Check: a contradiction is marked regression with evidence.

Scenario 3: Rollback and interruption boundaries remain coherent.
- Check: each task has bounded file scope.
- Check: task commands verify the worktree branch, not the main tree.
- Check: T6 archive waits for the close-producing tasks.

Scenario 4 (adversarial): The plan can pass or fail checks against a checkout that Execution did not edit.
- Check: absolute variables do not target a stale or absent main-tree path.
- Check: mirror pre-flight checks do not fail because they are run outside the worktree.

Coverage declarations:
- Privacy/data handling: task-record content stays session-local; T1 carries D-A/D-B.
- Cost/paid-API: no paid calls.
- Supply chain: no dependencies.
- Error budget: wrong-tree verification and mandatory-check regressions are the main risks.

## Evaluation (Stage 2)
Scenario 1 result:
- Partial. The original iter2 T4 command defects are fixed: explicit mode paths, semantic `jq -S`, and `PRE_T4_REV` / `PRE_T5_REV` are present. But path-root mistakes mean the commands can still verify the wrong files or fail before valid worktree edits.

Scenario 2 result:
- No. Mandatory counts: G1 recursive `.. |` = `1` (expected 0), `.chat.mode` = `5`, `.auto.mode` = `5`; G2 diff-line grep = `1` (expected 0), `jq -S` = `2`; G3 placeholder grep emitted two lines; G4 `/tmp/t[45]-pre` = `2` (expected 0), `PRE_T4_REV` = `10`, `PRE_T5_REV` = `9`; G5 `FLAG-2` = `10`, required-skills `claude` = `0`; G6 triple-escape count = `1` (expected 0), `printf 'always` = `3`.

Scenario 3 result:
- No. The task file scopes are bounded conceptually, but task verification paths are not bounded to the worktree branch. A T1/T2/T3 executor can fail on absent main `.claude` symlinks, and T4/T5 can compare worktree Git history against main-tree file contents.

Scenario 4 result:
- No. The risk is concrete: `test -L /playinganalytics/git/gobbi/.claude/skills/orchestration/chat-mode.md` fails, while the worktree equivalent passes. That turns a valid worktree state into a task-blocking failure.

Inherited finding disposition table:

| Finding ID | Current disposition | Evidence |
|---|---|---|
| codex-risk-004 | addressed | The T4 command no longer uses recursive `.mode` extraction; explicit `.chat.mode` and `.auto.mode` checks are present. |
| codex-risk-005 | addressed | T4/T5 command baselines no longer write `/tmp/t4-pre.txt` or `/tmp/t5-pre.txt`; `PRE_T4_REV` and `PRE_T5_REV` are used. Residual `/tmp` hits are prose examples and are scored as a new mandatory-check regression. |
| codex-risk-006 | addressed | The T4 model guard now compares `.chat.models` and `.auto.models` with pre-edit `.models` via `jq -S`; the weak diff-line grep is gone from the command. Residual `grep.*models.*diff` is prose and scored separately. |

Typed findings:

### codex-risk-iter3-001
- Type: design_flaw
- Domain: process
- Confidence: 100
- Severity: High
- Evidence: T1/T2/T3 command variables use main `.claude` paths that do not exist in this checkout, while the worktree symlink paths exist. T4/T5 use `$WT` for the Git baseline but main-tree `F4`/`F5_*` paths for file reads. This can block valid worktree output or steer edits/checks into the wrong branch.
- Disposition: open

### codex-risk-iter3-002
- Type: checklist_gap
- Domain: process
- Confidence: 100
- Severity: High
- Evidence: The mandatory G1-G6 literal grep block reports regressions for G1, G2, G3, G4, and G6 with counts contradicting the stated expectations. Even if most hits are retrospective prose, the evaluator prompt explicitly defines contradictory counts as regressions.
- Disposition: open

## Low-confidence appendix
None.

VERDICT: REVISE
