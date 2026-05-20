# Project Perspective — Cross-cutting Batch (iter2, claude)

## Stage 0 — Target Understanding

Same 7 cross-cutting skills + child docs as iter1. W/W/H clear. Phase tag `cross-cutting` accepted. Memory reads: iter1 carryover trusted; iter2 fixes 1-8 applied.

## Inheritance from iter1

| iter1 ID | Severity | Conf | iter2 disposition |
|---|---|---|---|
| F-P-01 (Interview invisible in orchestration) | High | 75 | **Addressed** — Step 1 row 7 added in orchestration/SKILL.md:83 (verified grep). Bootstrap gate explicit; mature-project skip explicit. |
| F-P-02 (Scope Contract no canonical anchor) | High | 75 | **Persisted** — no fix shipped. Scope Contract still referenced as input by 5 skills with no canonical schema definition. |
| F-P-03 (Configuration sparse-memory check) | Medium | 50 | **Addressed** — folded into F-P-01 fix (row 7). |
| F-P-04 (`feature` set during Ideation but mechanism unclear) | Medium | 50 | **Persisted** — no fix in iter2 scope. |

## Stage 1 — Locked Frame

Inherited from iter1 (S1-S4). New adversarial scenario added for iter2:

**S5. (adversarial — iter2 regression check) Fix 7's bootstrap gate composes with the rest of Step 1**
- [ ] Row 7 sequencing is correct (after session.json stamp so project-name is resolved)
- [ ] Row 7 routes back to row 8 (or Step 2) cleanly if user declines
- [ ] Bootstrap detection criteria match interview/SKILL.md's detection criteria

## Stage 2 — Findings

### F-P-01-iter2 — RESOLVED — Interview discoverability gap closed

**Type**: `general` / **Domain**: `process` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `orchestration/SKILL.md:83` Step 1 row 7 now reads "Interview check (bootstrap gate): inspect `.gobbi/projects/{project-name}/`. If project memory is empty ... surface an AskUserQuestion ... If the user accepts, load the `interview` skill and run the Interview skill to completion before proceeding to Ideation." Detection criteria (no `README.md`, no `design/`, no `features/` with content) match `interview/SKILL.md:26`. Sequencing is correct — row 7 runs after row 6 stamps `session.json` (project-name resolved before lookup).

### F-P-02 (carry forward) — Scope Contract still has no canonical anchor

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

**Evidence** (unchanged from iter1): `evaluation/SKILL.md:39` reads "prior-loop artifact tagged `artifact_type: scope-contract`"; `orchestration/workflow/preparation.md`, `planning.md`, `research/SKILL.md:64`, `ideation/evaluation.md:9-13` all consume it; no skill in scope defines the artifact's field schema. The `artifact_type: scope-contract` slug is referenced but the schema lives nowhere.

**Why it matters**: This was flagged High at iter1 and not on the iter2 fix list. The 6-step workflow's load-bearing input still has no canonical definition.

### F-P-04 (carry forward) — `feature` stamping mechanism unclear

**Type**: `general` / **Domain**: `process` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence** (unchanged from iter1): `orchestration/SKILL.md:82` "leave `feature` as `null` if not yet clear and stamp later, typically during Ideation"; no concrete sub-step or AskUserQuestion shown in Step 1 or Step 2 procedure. Memorization gate at `memorization/SKILL.md:154` requires `feature` set.

### F-P-NEW-1 — Step 1 row 7 lacks an iteration handle for sparse-but-not-empty projects

**Type**: `general` / **Domain**: `process` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence**: `orchestration/SKILL.md:83` row 7 says "If project memory is empty (no `README.md`, no `design/`, no `features/` directory with content)". The bootstrap test is binary. A project with only a stub `README.md` and no feature memory passes the "not empty" test but is still effectively unbootstrapped — the manager will skip Interview. `interview/SKILL.md:43` "Mature-project rerun" assumes the user explicitly invokes Interview, but a sparse-but-not-empty project will neither be auto-recommended nor flagged.

**Why it matters**: The bootstrap gate's emptiness threshold may be too narrow. An evaluator-perspective expectation: borderline cases should at minimum surface "your project memory looks sparse — run Interview?" rather than silent skip.

## Stage 2 Verdict

**REVISE** — F-P-02 (High, conf 75) persists from iter1 unfixed (intentional, out of iter2 scope). F-P-NEW-1 (Medium, conf 50) is a regression-class observation on Fix 7 composition. F-P-01 cleanly resolved. Verdict moves up from iter1 REVISE (which was F-P-01-driven) but does not reach PASS because F-P-02 was carried unaddressed by intent — note this as a deferred decision, not an evaluator failure.

## Low-confidence appendix

- LC-P-1 (conf 25, Low): The 7-skill set could still be reduced by merging `discussion` into `orchestration`. Same as iter1 LC-P-1; defer.
- LC-P-2-iter2 (conf 25, Low): Row 7's "If the user declines, proceed to Step 2 directly" — Step 2 is "Ideation Loop" per orchestration/SKILL.md:85. Reads correctly but a fresh manager could read "Step 2" as the row number; phrase as "proceed to Ideation Loop (Step 2)" would be clearer. Polish.
