# Structure - Planning iter2 Evaluation (Codex)

## Artifact Summary
The artifact is `draft-iter2.md`, a Planning iter2 task decomposition for implementing the locked Chat Mode + Auto Mode redesign. What: seven ordered tasks plus a Plan-level acceptance gate. Why: fresh executors need narrow task contracts and runnable verification. How: the plan fixes iter1 structural blockers by removing absent skills, replacing stale plugin mirror scope, adding pre-flight symlink checks, defining pre-edit baselines, and adding symmetric T5 checks.

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
Scenario 1: Task dependencies form a coherent DAG.
- Check: T3 remains after T1/T2.
- Check: T6 remains a Wrap-up task after T1/T2/T3.
- Check: independent JSON/template/backlog tasks do not hide file overlap.

Scenario 2: Required skills are structurally loadable.
- Check: no known-absent skill is listed as a required skill.
- Check: T1-T5 carry a replacement NOTE for the absent `claude` doc-authoring skill.
- Check: T6/T7 do not accidentally gain `claude`.

Scenario 3: Verification structure is concrete and semantically targeted.
- Check: binary assertions fail only when the intended invariant is false.
- Check: recursive checks do not accidentally include unrelated fields.
- Check: baseline capture commands produce a value before the edit and re-use the same value after the edit.

Scenario 4 (adversarial): A correct executor output is rejected by an over-broad assertion.
- Check: T4's mode/default-set assertion distinguishes top-level default-set mode from nested `discuss.mode` and `evaluate.mode`.
- Check: a command converted from a count-printing probe to a binary assertion was not made stricter than the claimed invariant.

Coverage declarations:
- Dependency supply chain: no new external dependency; required skills are the structural dependency.
- Observability: the Plan-level and task-level gates must be executable pass/fail signals.
- Parallel feasibility: not applicable beyond the stated sequential order.

## Evaluation (Stage 2)
Scenario 1 result:
- Yes. The order is topologically valid: T1 and T2 precede T3; T6 waits for T1/T2/T3; T4/T5 are independent JSON/template work.

Scenario 2 result:
- Yes. `gobbi/SKILL.md` line 187 confirms the absent `claude` row; T1-T5 now use NOTE comments instead of `- claude`, and T6/T7 have no `claude` required-skill entry.

Scenario 3 result:
- No. T4's binary mode assertion at `draft-iter2.md:265` uses `jq -r '.. | .mode? // empty'`, which recursively reads every object field named `mode`, including nested `workflow.*.discuss.mode` and `workflow.*.evaluate.mode`. The current template already produces `agent,always,auto,user,` for that selector; a valid two-default-set template will include nested `agent`, `always`, and `user` values in addition to `auto` and `chat`.

Scenario 4 result:
- No. Because the T4 assertion expects exactly `auto,chat,`, it will reject a structurally correct settings template that preserves the existing nested mode fields. This is not an executor judgment call; it is a wrong verification contract.

Inherited finding disposition table:

| Finding ID | Current disposition | Evidence |
|---|---|---|
| codex-structure-001 | addressed | `claude` is removed from T1-T5 `required-skills`; the replacement NOTE cites `gobbi/SKILL.md` line 187 FLAG-2 and `.claude/CLAUDE.md`. |
| codex-structure-002 | addressed | T5 now includes symmetric zero-deletion checks for both `state.template.json` and `session.template.json` at lines 316 and 318. |

Typed findings:

### codex-structure-003
- Type: design_flaw
- Domain: verification
- Confidence: 100
- Severity: High
- Evidence: `draft-iter2.md:265` asserts that `jq -r '.. | .mode? // empty' <settings.default.json> | sort -u | tr '\n' ','` equals `auto,chat,`. The existing template contains nested `discuss.mode` and `evaluate.mode` fields; running the same selector on the current template returns `agent,always,auto,user,`. A correct Chat+Auto template will still contain nested `agent`, `always`, and `user` values, so this assertion false-fails valid output.
- Disposition: open

## Low-confidence appendix
None.

VERDICT: REVISE
