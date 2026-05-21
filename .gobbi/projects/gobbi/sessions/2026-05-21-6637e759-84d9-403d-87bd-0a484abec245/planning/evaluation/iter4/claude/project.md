# Claude Planning Evaluation iter4 — Project Perspective

## Stage 0 Artifact Summary

LIGHT main.md-only iter under user-authorized override (planning.maxIterations 3 → 4). Scope = 6 surgical text edits to `staging/plans/main.md` (3 leader + 3 manager-bookkeeping) closing Codex iter3 F-CX-PLAN-O3-O-01 (High/100 docs-sync) + the 3 collateral `draft-iter2.md` operational pointer residuals the leader surfaced via DONE_WITH_CONCERNS. iter4 rawdata draft adds D-PLAN-12 only (24-line addition; byte-identical to iter3 otherwise).

## Stage 1 Locked Frame

Project scenarios:
- P1: 19 Ideation locks + all D-PLAN locks (01, 03, 04, 06–11) carry through iter4 unchanged.
- P2: D-PLAN-12 is stamped at iter4 and surfaced in main.md lock enumeration (line 55).
- P3: Iron Law 4 honored — Ideation `implementation-checklist.md` untouched; iter1/2/3 rawdata drafts untouched.
- P4: Brief discipline guardrail (Iron Law 4) honored — leader emitted DONE_WITH_CONCERNS rather than expanding scope.
- P5: D-PLAN-12 documents the manager-bookkeeping carve-out with rationale.

## Stage 2 Findings

### Scenario walk

- **P1**: PASS. Line 55 enumerates `D-PLAN-01, -03, -04, -06, -07, -08, -09, -10, -11, -12`. Lines 22 / 122 retain historical-context iter2 enumeration ("5 D-PLAN locks", "All 5 D-PLAN AskUserQuestions resolved") which accurately describes iter1/iter2 state and is not a regression — those sentences are narrating the iter2 layer.
- **P2**: PASS. D-PLAN-12 present at `draft-iter4.md:742-765`; main.md line 55 references it.
- **P3**: PASS. Mtimes confirm: `implementation-checklist.md` 2026-05-21 15:19 (Ideation epoch); iter3 draft 22:57; iter4 draft 23:18; main.md 23:17. iter1/2/3 untouched.
- **P4**: PASS. D-PLAN-12 addendum explicitly cites Iron Law 4 and the executor-rationalized-failing-verification-gate mistake; leader behaved correctly.
- **P5**: PASS. Addendum names the bookkeeping carve-out, lists each manager edit (4/5/6), and verifies "zero remaining `draft-iter2.md` references in main.md operational sections."

### Project-perspective findings

#### F-IT4-CL-P-01 — Manager-bookkeeping carve-out strict-reading risk

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: `open`
- **Confidence**: `50`
- **Severity**: `Low`
- **Evidence**: D-PLAN-12 addendum (`draft-iter4.md:760-765`) justifies the 3 manager-applied substitutions via "trivial bookkeeping allowance per `orchestration/SKILL.md` core principles (TaskCreate / TaskUpdate / AskUserQuestion / status updates / docs-sync)". Read strictly, `orchestration/SKILL.md:38` defines manager direct ops as AskUserQuestion + subagent management only; `orchestration/SKILL.md:56` routes "mechanical edits" to the **assistant** lane, not manager. The carve-out is defensible because the substitutions were lexically unambiguous and tightly scoped, but the rationale text overstates the precedent.
- **Why it matters**: Future managers may cite this addendum to justify direct text edits beyond find-and-replace pointer normalization. Process drift risk.
- **Suggested direction**: Leave iter4 main.md as-is (re-editing would itself be scope expansion). Out-of-scope cleanup: a follow-up mistake or rules entry noting "manager-direct text substitution is bounded to find-and-replace on stale pointers; otherwise route to assistant".

## Stage 2 Step 3 — Iter3 finding disposition

| iter3 finding | Source | Disposition | Verification |
|---|---|---|---|
| F-CX-PLAN-O3-O-01 (High/100 docs-sync — main.md:126/154/141 drift) | Codex iter3 overall | **addressed** | (a) Line 126 → `draft-iter3.md`; (b) line 154 → `draft-iter3.md`; (c) line 141 §5a now contains the `git status --porcelain` precheck (both worktrees) + NEEDS_CONTEXT + no auto-`--force` + canonical-detail citation. |
| F-CX-PLAN-O3-O-02 (Low docs-sync — self-review grep wording) | Codex iter3 overall | **deferred** | Codex's own Suggested direction was "only clean this if another revision is already happening for F-CX-PLAN-O3-O-01"; iter4 brief did not enumerate. iter4 discipline → leave for follow-up. |

## Verdict

**PASS.** No High≥50, no Critical≥75. One Low/50 process-discipline observation about the addendum's rationale wording.

## Must-Preserve List

- 6 surgical main.md edits (lines 55 / 85 / 106 / 126 / 141 / 154).
- D-PLAN-12 addendum recording the manager-bookkeeping carve-out + rationale.
- iter1 / iter2 / iter3 rawdata + Ideation `implementation-checklist.md` untouched (audit trail intact).
- Iter3-canonical rawdata content (iter4 byte-identical except for D-PLAN-12).
