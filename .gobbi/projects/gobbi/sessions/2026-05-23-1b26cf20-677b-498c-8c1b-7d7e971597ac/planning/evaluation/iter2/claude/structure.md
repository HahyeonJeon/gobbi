# Planning iter2 — Structure perspective evaluation

Scope: Did Fix 2 close the iter1 dep-graph gaps? Are there any NEW structural defects from the surgical edits?

## Verdict: PASS

## iter1 Structure findings — disposition transitions

| iter1 ID | Severity | iter2 disposition | Evidence |
|---|---|---|---|
| F-STRUCT-1 (Claude — Missing 06→07 edge, LOCK #1 under-enforced) | **High** | **addressed** | Task 07 `requires: [05-five-phase-docs-per-iter-cadence, 06-direct-mode-opt-out-and-smoke-test]` at draft-iter2.md:276. § Dependency table line 388 reflects this; § Wave-ordering paragraph (line 399) explicitly states "with only `requires: [05]` (iter1 form), the dependency graph permitted 06 → 07 interleaving; Fix 2 closes the loophole". |
| F-STRUCT-2 (Claude — Missing 06→10 edge for shared orchestration/SKILL.md) | Medium | **addressed** | Task 10 `requires: [01, 04, 06, 07, 08]` at draft-iter2.md:347. § Dependency table line 391 reflects 06 added. § Parallel lanes L6 (line 414) and file-overlap memo (line 418) updated. |
| F-STRUCT-3 (Claude — Tasks 07+08 mega-task risk) | Medium | **open** (not addressed) | iter2 5-fix scope did not address LOCK #2 boundary. Pre-existing decision. |
| F-STRUCT-4 (Claude — non-canonical `effort:` schema) | Low | **open** (not addressed) | Same as F-PROJ-2; deferred. |

## Stage 1/2 scenarios

| Scenario | Result |
|---|---|
| S-S1 — DAG remains acyclic after edge additions | PASS — traversal: 01→{02,06}; 02→{03,04}; 03→05; 04→10; 05→07; 06→{07,10}; 07→{08,09,10}; 08→10. No back-edge. |
| S-S2 — Topological order respects new edges | PASS — valid order: 01, 02, 03, 04, 05, 06, 07, 09, 08, 10 (or with 09/08 swapped). 06 always precedes both 07 and 10. |
| S-S3 — Every task has all 9 YAML fields | PASS — uniform across all 10 tasks (id/what/traces-to/requires/files/inputs/outputs/verifies/effort). |
| S-S4 — File-overlap conflicts have ordering edges | PASS — orchestration/SKILL.md (Tasks 01, 06, 10): 01→06, 01→10, 06→10 all in requires. delegation/SKILL.md (Tasks 04, 10): 04→10 in requires. preparation/SKILL.md (Tasks 02→03 cross-skill semantic edge). |
| S-S5 — Adversarial: any task graph-eligible to run before LOCK #1 wave gate? | PASS — only T1 wave (01-06) is reachable from empty deps until both 05+06 complete. |
| S-S6 — Task 07's [05, 06] is truly minimal? | PASS — 05 brings phase-docs (cadence rule) + 06 brings direct-mode opt-out, both surfaces that Task 07 hook script must respect at runtime documentation level. Both are the terminal T1 leaves. |

## NEW iter2 findings

### F2-STRUCT-1 — Tasks 07+08 LOCK #2 shared-executor mega-task risk unmitigated (carried from iter1 F-STRUCT-3)
- Type: `assumption_risk`
- Domain: `process`
- Disposition: `open` (carried — not in iter2 5-fix scope)
- Confidence: 50
- Severity: Medium
- Evidence: § Agent assignment table line 459 still merges Tasks 07+08 into one "shared executor" row at effort Large+Large; combined hook script + reconstructor + WebFetch + bash strict-mode + flock + jq snippets across two files in one delegation. iter2 did not revisit LOCK #2 boundary.
- Why it matters: At Execution time, a single executor brief covering two Large tasks may exceed context coherence budget. iter1 already flagged this as Medium.
- Suggested direction: out of iter2 scope; raise during Execution if witness emerges, or pre-empt with delegation boundary memo.

## Karpathy mode-3 (orthogonal collateral) check

iter2 made 5 surgical fixes. Possible collateral risks:
1. Fix 2 added `06` to two `requires` lists. Did it introduce a cycle? — NO, verified above.
2. Fix 2's added edge 06→07: does any T1 wave task become unreachable? — NO, traversal still complete.
3. Fix 4 changed Task 03 `verifies` count from ≥2 to ≥3 + added 2 new gates. Did it raise the bar so high that the executor cannot pass? — NO, the bar matches the new spec language ("add + commit + rm rollback" + AskUserQuestion co-location).
4. Fix 5 made shellcheck conditional; did it weaken the syntax-gate? — NO, bash -n is universally available and remains an unconditional gate.

**Conclusion**: zero orthogonal collateral from the 5 surgical edits. Mode-3 clean.

## Must-preserve list

- The strengthened dep edges (Task 07 `requires: [05, 06]` + Task 10 `requires: [..., 06, ...]`).
- The DAG acyclicity.
- The strict T1→T3 wave gate.

## Verdict rationale

iter1's load-bearing High (F-STRUCT-1) is now `addressed` with empirical YAML evidence. F-STRUCT-2 addressed via Fix 2 collateral. Two Lower-severity items carry as `open` but are not in iter2's surgical scope. Zero NEW High or Critical findings.

VERDICT: PASS
