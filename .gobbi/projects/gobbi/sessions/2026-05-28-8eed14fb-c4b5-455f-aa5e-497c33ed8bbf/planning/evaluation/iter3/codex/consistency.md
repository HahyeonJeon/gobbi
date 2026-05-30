# Consistency - Planning iter3 Evaluation (Codex)

## Artifact Summary
The artifact is `draft-iter3.md`, a surgical G1-G6 revision of the Planning plan. What: it should synchronize task briefs, cross-references, verification commands, required-skills blocks, plan-level checks, risks, and dispositions. Why: Execution should not receive contradictory instructions. How: it uses explicit mode paths, semantic model comparison, in-session baseline variables, FLAG-2 notes outside YAML, and `printf` compare text.

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
Scenario 1: Every `traces-to:` reference still points to the Idea artifact.
- Check: T1 traces to Idea sections 3, 6.3, 8, and 7.3.
- Check: T2 traces to Idea section 4 and 7.3.
- Check: T4/T5/T3/T6/T7 traces point to existing Idea anchors.

Scenario 2: G1-G6 changes are synchronized between prose claims and literal grep evidence.
- Check: a row marked addressed does not leave the mandatory literal grep count failing.
- Check: self-review does not claim "zero hits" while containing the exact counted string.
- Check: G5 note placement is synchronized between prose and YAML blocks.

Scenario 3: Path conventions are internally consistent.
- Check: commands that use `$WT` for Git history also use `$WT` for file reads.
- Check: plan-level acceptance and task-level verification agree on the checkout root.
- Check: main-tree and worktree paths are not mixed for the same task.

Scenario 4 (adversarial): A disposition table says a finding is addressed while the mandatory check still reports regression.
- Check: G1-G6 are judged by the actual counts, not only by the prose description.

Coverage declarations:
- Privacy/data retention: D-A/D-B remain consistent with session-local task records.
- Memorization naming: T7 slug is consistent and subject-descriptive.
- Licensing/IP: not applicable.

## Evaluation (Stage 2)
Scenario 1 result:
- Yes. The task traces map to visible Idea sections and locked decisions.

Scenario 2 result:
- No. The mandatory literal G-checks produce contradictory evidence: G1 recursive count is 1, G2 diff-line grep count is 1, G3 placeholder grep emits 2 lines, G4 `/tmp/t[45]-pre` count is 2, and G6 triple-escape count is 1. These hits are mostly retrospective prose, but the evaluator prompt explicitly says a count contradicting the "Must be" expectation is a regression.

Scenario 3 result:
- No. T1/T2/T3 use main-tree `.gobbi` / `.claude` paths, while T4/T5 mix `$WT` for Git baselines with main-tree file paths. The plan-level acceptance test and T6 correctly use `$WT`, so task-level commands contradict the rest of the plan.

Scenario 4 result:
- No. The §6 disposition table and self-review mark G1/G2/G3/G4/G6 addressed, but the literal grep block does not pass.

Inherited finding disposition table:

| Finding ID | Current disposition | Evidence |
|---|---|---|
| None open from iter2 Consistency | not applicable | Iter2 Consistency had no open typed findings and PASS. |

Typed findings:

### codex-consistency-iter3-001
- Type: checklist_gap
- Domain: process
- Confidence: 100
- Severity: High
- Evidence: Mandatory G-check results on `draft-iter3.md`: G1 recursive grep count `1`; G2 diff-line grep count `1`; G3 placeholder grep emitted lines 602 and 655; G4 `/tmp/t[45]-pre` count `2`; G6 triple-escape count `1`. The prompt states any count contradicting the "Must be" expectation is a regression.
- Disposition: open

### codex-consistency-iter3-002
- Type: design_flaw
- Domain: process
- Confidence: 100
- Severity: High
- Evidence: Task-level file variables at `draft-iter3.md:148`, `212`, `269`, `321`, and `391` use main-tree absolute paths; plan-level acceptance and T6 use `$WT`. This makes the same plan inconsistent about which checkout Execution owns.
- Disposition: open

## Low-confidence appendix
None.

VERDICT: REVISE
