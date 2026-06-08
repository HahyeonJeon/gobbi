## Artifact Summary + Memory reads

Planning artifact evaluated: `planning/rawdata/draft-iter1.md`, a four-task docs-only plan for the locked Idea "Harden Auto-mode evaluation discipline." What: decompose three in-scope doc edits plus a cross-file consistency check. Why: remove Auto-mode evaluation misbehavior without changing runtime shape. How: sequential citation-target-before-citer tasks T1 evaluation.md -> T2 auto-mode.md -> T3 CLAUDE.md -> T4 verification.

Memory reads: `ideation/artifacts/idea.md`; `preparation/artifacts/readiness.md`; `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`; `.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`; `.claude/CLAUDE.md`; `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`; `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md`; `.agents/skills/planning/evaluation.md`; active project mistakes relevant to planning/evaluation/citation fidelity.

## Locked Frame (Stage 1)

Scenario P1: Every locked Idea design item maps to at least one executor task.
- Check: each File 1 auto-mode.md CRUD item is in T2 or T4.
- Check: each File 2 workflow/evaluation.md CRUD item is in T1 or T4.
- Check: each File 3 CLAUDE.md CRUD item is in T3 or T4.
- Check: no task expands beyond the three in-scope edit files.

Scenario P2 (adversarial): the plan's self-review says "every design item maps" while a small cross-reference CRUD item is orphaned.
- Check: compare Idea design bullets, not only the Implementation checklist summary.
- Check: require any mutual cross-reference promised by the Idea to appear in an edit task and in final consistency verification.

## Per-scenario per-check results

P1: FAIL. The main auto-mode, evaluation.md, and CLAUDE.md behavior edits are mapped. One locked evaluation.md design item is not mapped.

P2: FAIL. The plan self-review claims full coverage, but T1 and T4 omit the evaluation.md Cross-references update required by the Idea.

## Typed findings

### COD-PROJECT-001

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`checklist_gap` / `scope-coverage` / `100` / `High` / Idea requires `workflow/evaluation.md` Cross-references to add a row pointing to `auto-mode.md §7` (`ideation/artifacts/idea.md:177`). T1 verifies line 5, degraded-mode, three mode-splits, safety labels, framing, header stability, and no deletion, but no evaluation.md Cross-references update (`planning/rawdata/draft-iter1.md:68`-`75`). T4 verifies auto-mode -> evaluation references, SKILL.md, C1, CLAUDE.md, diff scope, and section deletion, but not the evaluation.md -> auto-mode row (`planning/rawdata/draft-iter1.md:133`-`139`). The plan's self-review still claims every design item maps (`planning/rawdata/draft-iter1.md:193`). / A locked Idea CRUD item can be skipped by Execution because no task tells an executor to add it and no final gate checks it. This breaks completeness. / Add the evaluation.md Cross-references row to T1 scope and verification, and add a T4 check that `workflow/evaluation.md` links back to `auto-mode.md §7`.

## Low-confidence appendix

No low-confidence project findings.
