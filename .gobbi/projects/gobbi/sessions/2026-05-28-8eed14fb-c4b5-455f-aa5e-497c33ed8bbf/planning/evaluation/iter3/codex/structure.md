# Structure - Planning iter3 Evaluation (Codex)

## Artifact Summary
The artifact is `draft-iter3.md`, a capped Planning task decomposition for implementing the locked Chat Mode + Auto Mode redesign. What: seven ordered tasks plus a plan-level acceptance gate. Why: fresh executors need narrow task contracts and runnable verification. How: iter3 keeps the task DAG but changes G1-G6 verification details around mode extraction, model comparison, placeholders, baseline capture, FLAG-2 notes, and `printf` evaluate-mode checks.

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
Scenario 1: Task dependencies form a coherent DAG.
- Check: T3 remains after T1/T2.
- Check: T6 remains a Wrap-up task after T1/T2/T3.
- Check: independent JSON/template/backlog tasks do not hide file overlap.

Scenario 2: Required skills and mistakes are structurally loadable.
- Check: no known-absent skill is listed as a required skill.
- Check: T1-T5 carry a replacement FLAG-2 note above their YAML blocks.
- Check: worktree/mirror mistakes are reflected in the task commands.

Scenario 3: Verification structure is concrete and semantically targeted.
- Check: T4 mode checks target only `.chat.mode` and `.auto.mode`.
- Check: T4 model checks compare the protected model objects semantically.
- Check: T4/T5 baseline commands use captured revisions without global `/tmp` files.

Scenario 4 (adversarial): Correct task output is rejected because checks point at the wrong file tree.
- Check: verification variables use the same worktree root as the Git baseline and plan-level acceptance gate.
- Check: mirror pre-flight checks target the worktree `.claude` symlink layer, not absent main-tree paths.

Coverage declarations:
- Dependency supply chain: no new external dependency; required skills are the structural dependency.
- Observability: task-level verification commands must be executable pass/fail signals.
- Parallel feasibility: not applicable beyond the stated sequential order.

## Evaluation (Stage 2)
Scenario 1 result:
- Yes. The order remains topologically valid: T1 and T2 precede T3; T6 waits for T1/T2/T3; T4/T5/T7 are independent.

Scenario 2 result:
- Partial. The absent `claude` skill is no longer in required-skills, and the required mistakes include the mirror/worktree discipline. But the actual command variables violate that discipline by anchoring to the main tree for T1/T2/T3/T4/T5.

Scenario 3 result:
- Yes for the original iter2 Structure finding. The T4 mode command now uses explicit `.chat.mode` and `.auto.mode`; the recursive selector is gone from the T4 verification command.

Scenario 4 result:
- No. `grep -nE 'F1=|F2=|F3F=|F4=|F5_STATE=|F5_SESSION=|M1=|M2=|M3=' draft-iter3.md` shows main-root variables at lines 148, 212, 269, 321, and 391. T4/T5 mix `$WT` for Git history with main-tree `F4` / `F5_*` file reads, making the structural verification contract internally inconsistent.

Inherited finding disposition table:

| Finding ID | Current disposition | Evidence |
|---|---|---|
| codex-structure-003 | addressed | The T4 mode assertion now uses explicit `.chat.mode` and `.auto.mode` checks at `draft-iter3.md:275`; the recursive selector is absent from the T4 command. The remaining recursive-string count is a self-review prose hit, recorded separately under Consistency/Risk. |

Typed findings:

### codex-structure-iter3-001
- Type: design_flaw
- Domain: process
- Confidence: 100
- Severity: High
- Evidence: `draft-iter3.md:269` sets `WT` to the session worktree but `F4` to `/playinganalytics/git/gobbi/.gobbi/.../settings.default.json`; `draft-iter3.md:321` does the same for `F5_STATE` and `F5_SESSION`. T1/T2/T3 similarly use main-tree `F1`/`F2`/`F3F` and main `.claude` `M1`/`M2`/`M3` paths at lines 148, 212, and 391. This splits each task between a worktree Git baseline and main-tree file checks.
- Disposition: open

## Low-confidence appendix
None.

VERDICT: REVISE
