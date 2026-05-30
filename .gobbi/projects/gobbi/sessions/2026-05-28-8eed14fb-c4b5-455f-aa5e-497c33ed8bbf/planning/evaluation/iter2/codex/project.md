# Project - Planning iter2 Evaluation (Codex)

## Artifact Summary
The artifact is `draft-iter2.md`, a surgical revision of the Planning iter1 draft for the Chat Mode + Auto Mode redesign. What: it preserves the seven-task plan, adds F1-F8 fixes, and records an iter1-to-iter2 disposition table. Why: it should make the locked Ideation decisions executable without stale `claude` skill, plugin mirror, baseline-placeholder, or non-binary-verification traps. How: it keeps the order T1 -> T2 -> T4 -> T5 -> T3 -> T7, leaves T6 for Wrap-up, and converts the prior evaluator findings into task-level and plan-level verification requirements. Scope Contract source: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`. Downstream consumers are executors for T1/T2/T4/T5/T3/T7, the Wrap-up assistant for T6, and the manager reconciling Planning evaluation.

## Memory reads
- `/playinganalytics/git/gobbi/.agents/skills/principles/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/mistake/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/planning/evaluation.md`
- `/playinganalytics/git/gobbi/.agents/skills/orchestration/workflow/planning.md`
- `/playinganalytics/git/gobbi/.agents/skills/orchestration/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/gobbi/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/discussion/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/delegation/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/git/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/design-literal-retire-instruction-without-replacement.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter2.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/project.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/structure.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/performance.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/aesthetics.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/usage.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/consistency.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/risk.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/overall.md`

## Locked Frame (Stage 1)
Scenario 1: Iter2 stays inside the locked Ideation Scope Contract.
- Check: the task set remains T1/T2/T4/T5/T3/T7 plus Wrap-up T6.
- Check: no deferred Bucket B/C/D work is silently implemented.
- Check: the plan keeps R1, R2+R3, R5, D-A, and D-B as locked decisions.

Scenario 2: The stale-scope findings from iter1 are actually removed.
- Check: no task requires the absent `claude` skill.
- Check: no task requires plugin mirror work after the brief states `plugins/` is absent.
- Check: `memorization/SKILL.md` and `discussion/SKILL.md` remain no-bleed files.

Scenario 3: The F1-F8 surgical revision claim is true.
- Check: the diff from `draft-iter1.md` changes only F1-F8, the disposition table, cross-references, and self-review.
- Check: the seven-task order and task ownership are unchanged.
- Check: no new section creates new execution scope.

Scenario 4 (adversarial): A polished F3 conversion hides a new task blocker.
- Check: binary assertions must be not only binary, but semantically targeted at the claim they verify.
- Check: a false-failing assertion is treated as a Planning defect, not an executor burden.

Coverage declarations:
- Privacy/data retention: D-A/D-B stay session-local; T1 keeps task-record scope local.
- Licensing/IP and dependency supply chain: not applicable; no dependencies or third-party content are added.
- Cost/budget: no paid APIs in this Execution plan; future Chat-session cost is deferred by the Idea.

## Evaluation (Stage 2)
Scenario 1 result:
- Yes. The task set and ordering remain T1 -> T2 -> T4 -> T5 -> T3 -> T7, with T6 assigned to Wrap-up.
- Yes. Deferred items remain in Scope Contract Out-of-Scope and Plan-level risks rather than becoming execution work.

Scenario 2 result:
- Yes. `rg` found no task-level `- claude` required-skill entry and no `.claude/skills/claude/SKILL.md` dependency. The only `plugins/gobbi` mention is the F2 note saying the tree is absent and no plugin mirror work is required.

Scenario 3 result:
- Yes with one caveat outside the Project lens. `diff -U0 draft-iter1.md draft-iter2.md` shows surgical edits for F1-F8 plus the iter2 disposition/cross-reference/self-review sections. The caveat is not scope drift; it is a verification bug in one F3-converted assertion, covered under Structure/Risk.

Scenario 4 result:
- Project impact: no new project-scope task. The false-failing T4 assertion is a verification-readiness defect rather than a Scope Contract violation.

Inherited finding disposition table:

| Finding ID | Current disposition | Evidence |
|---|---|---|
| codex-project-001 | addressed | Iter2 line 560 says `plugins/` is verified absent and no plugin-side mirroring is required; no executor `plugins/gobbi/...` check remains. |
| codex-project-002 | addressed | T4/T5/T7/T6 now have task-level checks for the previously omitted surfaces; residual command correctness is evaluated under Structure/Risk. |

Typed findings:
None for Project.

## Low-confidence appendix
None.

VERDICT: PASS
