# Usage Perspective — Loop Skills Batch 2 iter1 (Claude)

## Artifact Summary + Memory reads

(See `project.md` for the shared Stage 0 summary.)

## Locked Frame (Stage 1)

**S-U1: Each loop's SKILL is usable standalone by the agent that owns its WORK phase**
- A leader spawned for Ideation/Preparation/Planning can read the SKILL and run DISCUSSION + WORK
- An executor spawned for Execution can read the SKILL and run the 5-phase lifecycle
- An assistant spawned for Wrap-up / MEMORIZATION can read the SKILL and run the 7-step procedure

**S-U2: Each evaluation.md child is usable standalone by an evaluator at Stage 0**
- Output reminder tells the evaluator where to write
- Per-perspective seed scenarios are concrete enough for Stage 1 to CRUD

**S-U3: Cross-references resolve**
- All `[link](path)` references in the loop SKILLs point to real paths in the worktree

**S-U4 (adversarial): A consumer reads the SKILL and forms the wrong mental model**
- Each loop's "what triggers entry" / "what triggers exit" is unambiguous

**Accessibility / I18n**: `not-applicable:` — workflow docs not user-facing.

**Observability / "diagnosable at 3am"**: each loop SKILL traces failure modes (e.g., write violation → revoke + restart) so an operator can diagnose.

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| S-U1 | Standalone leader usability | YES (Ideation/Preparation/Planning) | Each SKILL has step-by-step procedure tables |
| S-U1 | Standalone executor usability | YES | Execution L123-133 5-phase lifecycle table is complete |
| S-U1 | Standalone Wrap-up assistant usability | YES | Wrap-up L132-141 7-step procedure table is complete |
| S-U2 | Evaluator standalone Stage 0 readiness | YES (4 of 5) | execution/evaluation.md output path is wrong (F-S-03) so evaluator writes to wrong location |
| S-U3 | Cross-references resolve | NOT VERIFIED | Did not exhaustively grep; sample paths checked OK |
| S-U4 | Mental model unambiguous | YES | Loop purposes are distinct |

## Typed findings

### F-U-01 — Execution loop SKILL conflates per-task and loop-wide iteration counter (Medium / 75)

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: `open`
- **Severity**: Medium
- **Confidence**: 75
- **Evidence**: `execution/SKILL.md:11`: "The Execution Loop runs once per planned task. The loop body — DISCUSSION → WORK → EVALUATION → MEMORIZATION — repeats for each task in `planning/artifacts/`. Within a single task, REVISE iterations re-enter that task's DISCUSSION until verdict is `PASS`; `PASS` then advances to the next task in the Plan." Then L215: "session.json field is `workflow.execution.iterations[]` keyed by `{task-id, iter}` (per-task iter, not loop-wide)." Yet `orchestration/SKILL.md` L246 says `state.json.workflow.execution.iter` (loop-wide). The relationship between loop-wide vs per-task counters is implicit.
- **Impact**: when REVISE happens on task 3 of 5, does `iter` increment loop-wide or per-task? The SKILL says per-task; orchestration's state.json shape says single `iter` per step. Without explicit reconciliation, evaluator's `iter` input is ambiguous at run time.
- **Remediation**: in execution/SKILL.md, add an explicit clarification block: "Execution's `iter` is per-task; the manager passes `(task-id, task-iter)` to evaluator. orchestration's `iter` for step=execution is the count of tasks processed; per-task iter is shape-distinct from other loops." This is partly a cross-layer concern (out-of-scope per #258) but the loop skill itself should at least name the asymmetry.

### F-U-02 — Discussion-log lifecycle defined only in Ideation, referenced in all others (Medium / 75)

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Severity**: Medium
- **Confidence**: 75
- **Evidence**: `ideation/SKILL.md:391`: complete lifecycle ("Discussion-log lifecycle: created by manager, appended after each AskUserQuestion exchange, format `## YYYY-MM-DD HH:MM — Q: ... | A: ... | Decision: ...`, preserved across REVISE iterations"). Preparation/Planning/Execution/Wrap-up SKILL.mds reference `rawdata/discussion-log.md` as input but never specify who creates it, when it's appended, or its format.
- **Impact**: ambiguity at Preparation/Planning/Execution/Wrap-up: where does the discussion-log come from? Does each loop create its own? The output-paths tables for Preparation/Planning/Execution don't list discussion-log.md as a written file. Only Wrap-up SKILL.md:335 lists it as manager-written. The four non-Ideation loops have orphaned input dependencies.
- **Remediation**: add a one-line "Discussion-log lifecycle" cross-reference to each non-Ideation loop's MEMORIZATION block, OR move the lifecycle spec to the orchestration skill and remove the Ideation duplicate. Either way, each loop SKILL must clearly indicate who writes `{loop}/rawdata/discussion-log.md`.

## Low-confidence appendix

(none beyond above)
