# Project - Planning iter3 Evaluation (Codex)

## Artifact Summary
The artifact is `draft-iter3.md`, the final capped Planning iteration for the Chat Mode + Auto Mode redesign. What: it preserves the seven-task Execution plan and applies the G1-G6 surgical verification fixes requested after iter2. Why: Execution needs a task contract that implements the locked Idea doc without absent-skill, stale-plugin, placeholder, baseline, or verification-command traps. How: it keeps the order T1 -> T2 -> T4 -> T5 -> T3 -> T7, leaves T6 for Wrap-up, changes T4/T5 verification commands, moves FLAG-2 notes above YAML blocks, and adds a disposition table for iter1/iter2 findings. Scope Contract source: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`. Downstream consumers are the T1/T2/T4/T5/T3/T7 executors, the Wrap-up assistant for T6, and the manager reconciling the capped Planning evaluation.

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
Scenario 1: Iter3 stays inside the locked Ideation Scope Contract.
- Check: the task set remains T1/T2/T4/T5/T3/T7 plus Wrap-up T6.
- Check: no deferred Bucket B/C/D work is silently implemented.
- Check: R1, R2+R3, R5, D-A, and D-B remain locked decisions.

Scenario 2: The G1-G6 surgical pass addresses the iter2 open findings without expanding scope.
- Check: T4 mode checks use explicit `.chat.mode` / `.auto.mode`.
- Check: T4 model checks use semantic `jq -S`.
- Check: T4/T5 before-state capture uses in-session variables, not `/tmp`.
- Check: FLAG-2 notes are prose above YAML, not fake required skills.

Scenario 3: Worktree scope is preserved.
- Check: task verification paths target the session worktree files that Execution will edit.
- Check: task commands do not point executors at the main tree for worktree-only placeholders or symlink mirrors.
- Check: the `skills-mirror-symlinks-not-copies` mistake is applied: edit `<worktree>/.gobbi/...`, not the main tree.

Scenario 4 (adversarial): The plan looks scoped correctly but sends implementation to the wrong checkout.
- Check: absolute path replacement in G3 did not replace placeholders with the wrong absolute root.
- Check: file-existence evidence distinguishes main tree from session worktree.

Coverage declarations:
- Privacy/data retention: D-A/D-B remain session-local and are not expanded.
- Licensing/IP and dependency supply chain: not applicable; no dependencies or third-party content are added.
- Cost/budget: no paid APIs or network calls are introduced.
- Observability: plan-level and task-level checks are the execution signals.

## Evaluation (Stage 2)
Scenario 1 result:
- Yes. The task set and order remain T1 -> T2 -> T4 -> T5 -> T3 -> T7, with T6 assigned to Wrap-up. Deferred items remain listed as out-of-scope.

Scenario 2 result:
- Partial. The original iter2 T4 command defects are addressed in the task command lines: `.chat.mode` and `.auto.mode` are present, `jq -S` is present, `PRE_T4_REV` / `PRE_T5_REV` are present, and `- claude` is absent from `required-skills:` blocks. However the mandatory literal grep checks still fail on residual prose; that is scored under Consistency/Risk.

Scenario 3 result:
- No. Task command variables at `draft-iter3.md:148`, `212`, `269`, `321`, and `391` point at `/playinganalytics/git/gobbi/.gobbi/...` and `/playinganalytics/git/gobbi/.claude/...` rather than `$WT/.gobbi/...` and `$WT/.claude/...`. The worktree file exists (`wt_chat:0`) while the main-tree `chat-mode.md` path does not (`main_chat:1`), and the main `.claude` symlink check fails (`main_m1_symlink:1`) while the worktree symlink check passes (`wt_m1_symlink:0`).

Scenario 4 result:
- No. The plan replaced placeholders with absolute paths, but for T1/T2/T3/T4/T5 those paths anchor to the wrong checkout. This is scope-relevant because executors can either fail valid worktree edits or be tempted to edit the main tree, outside the session branch.

Inherited finding disposition table:

| Finding ID | Current disposition | Evidence |
|---|---|---|
| None open from iter2 Project | not applicable | Iter2 Project had no open typed findings and PASS. |

Typed findings:

### codex-project-iter3-001
- Type: design_flaw
- Domain: process
- Confidence: 100
- Severity: High
- Evidence: `draft-iter3.md:148`, `212`, `269`, `321`, and `391` define task verification variables against `/playinganalytics/git/gobbi/.gobbi/...` or `/playinganalytics/git/gobbi/.claude/...` instead of the session worktree root `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/...`. Tool checks confirm the main `chat-mode.md` path is missing (`main_chat:1`) while the worktree path exists (`wt_chat:0`), and the worktree symlink exists while the main symlink does not. The loaded `skills-mirror-symlinks-not-copies.md` mistake says worktree executors must edit the worktree-absolute canonical files.
- Disposition: open

## Low-confidence appendix
None.

VERDICT: REVISE
