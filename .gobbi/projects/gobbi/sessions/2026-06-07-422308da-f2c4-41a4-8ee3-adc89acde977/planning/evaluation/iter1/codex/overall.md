## Artifact Summary + Memory reads

Evaluated `planning/rawdata/draft-iter1.md` for Planning iteration 1. The plan is a docs-only, four-task, strictly sequential decomposition of the locked Idea: T1 edits `workflow/evaluation.md`, T2 edits `auto-mode.md`, T3 edits `.claude/CLAUDE.md`, and T4 verifies cross-file consistency. The evaluation judged decomposition quality only, not the locked Idea design.

Memory reads: plan, locked Idea, readiness report, target files, read-only `orchestration/SKILL.md` and `chat-mode.md`, `.agents/skills/principles/SKILL.md`, `.agents/skills/mistake/SKILL.md`, `.agents/skills/evaluation/SKILL.md`, `.agents/skills/planning/evaluation.md`, project rule `stub-redirect-format.md`, and active project mistakes relevant to planning/evaluation/docs-sync.

## Locked Frame (Stage 1)

Scenario O1: plan is complete against the locked Idea.
- Check: every Idea CRUD item maps to a task.
- Check: no claimed self-review coverage hides an orphan.

Scenario O2: anchors and dependencies are live at c8a8654.
- Check: live files match plan line anchors.
- Check: readiness corrections are incorporated.
- Check: citation targets are final before citers, or final checks explicitly own the exception.

Scenario O3: final T4 is sufficient.
- Check: cross-references resolve in both directions where promised.
- Check: section order and no-renumber constraints are checked.
- Check: read-only files remain read-only.

## Per-scenario per-check results

O1: FAIL. The evaluation.md Cross-references row required by the Idea is orphaned.

O2: FAIL. The plan repeats stale `orchestration/SKILL.md:247` anchors despite the readiness correction and live line 266.

O3: FAIL. T4 covers several critical checks, including C1, line 31, diff scope, and no deleted sections. It does not cover the missing reciprocal evaluation.md Cross-references row and contains the stale SKILL.md line anchor.

## Typed findings

### COD-OVERALL-001

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`checklist_gap` / `scope-coverage` / `100` / `High` / The locked Idea requires `workflow/evaluation.md` Cross-references to add a row pointing to `auto-mode.md §7` (`ideation/artifacts/idea.md:177`). The plan's T1 verification omits that update (`planning/rawdata/draft-iter1.md:68`-`75`), T4 omits the reciprocal-link check (`planning/rawdata/draft-iter1.md:133`-`139`), and the self-review incorrectly says every design item maps (`planning/rawdata/draft-iter1.md:193`). / Execution can satisfy the plan while failing a locked Idea design item. / Add the evaluation.md Cross-references update to T1 and add a reciprocal-link verification to T4.

### COD-OVERALL-002

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`design_flaw` / `citation-fidelity` / `100` / `High` / The plan anchors the read-only `orchestration/SKILL.md` pointer at line 247 in scope, T4, consistency, and out-of-scope notes (`planning/rawdata/draft-iter1.md:24`, `planning/rawdata/draft-iter1.md:135`, `planning/rawdata/draft-iter1.md:186`, `planning/rawdata/draft-iter1.md:200`). Readiness explicitly corrects this to line 266 (`preparation/artifacts/readiness.md:164`-`171`). Live `orchestration/SKILL.md` confirms line 247 is a table separator and line 266 is the pointer (`.gobbi/projects/gobbi/skills/orchestration/SKILL.md:246`-`266`). / T4 is not runnable as written. It can produce a false failure against an out-of-scope file. / Replace the stale line anchor with line 266 or a stable section/content search.

### COD-OVERALL-003

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`checklist_gap` / `dependency-order` / `75` / `Medium` / T2 requires a Cross-references row to the "reconciled CLAUDE.md line" (`planning/rawdata/draft-iter1.md:92`) before T3 reconciles that line (`planning/rawdata/draft-iter1.md:98`-`111`). The plan's citation graph rationale does not mention this reverse edge (`planning/rawdata/draft-iter1.md:33`-`39`). / The plan overstates independent verification and cite-target-before-citer ordering. / Defer that row or make T4 own final verification after T3.

## Karpathy-mode checks

Wrong assumptions: PRESENT. The plan assumes `orchestration/SKILL.md:247` is still the §3/§6 pointer.

Overcomplexity: absent. The task split is otherwise reasonable for three files plus final consistency.

Orthogonal edits: absent. No task adds out-of-scope behavior edits.

Imperative-over-declarative: minor risk only. Some verification text prescribes exact wording, but the locked Idea already supplied wording sketches; this is not a verdict driver.

## Preserve list

Preserve the overall T1 -> T2 -> T3 -> T4 shape, the C1 split-anchor, canonical `.gobbi/...` skill paths, `.claude/CLAUDE.md` direct edit, line-31 untouched guard, no-renumber §7 trailing append, mode-split-not-delete discipline, safety-gate labels, and retire-nothing checks.

## Low-confidence appendix

No low-confidence overall findings.

VERDICT: REVISE
