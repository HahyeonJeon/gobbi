# Planning iter2 — Project perspective evaluation

Scope: Did the iter2 surgical pass honor the 5-fix contract + iter1 disposition transitions for Project-tier claims (scope coverage, spec fidelity, contract-with-user)?

## Verdict: PASS

## iter1 Project findings — disposition transitions

| iter1 ID | Severity | iter2 disposition | Evidence |
|---|---|---|---|
| F-PROJ-1 (Claude — Task 01 heading "T1.d (partial)" doesn't match traces-to T1.c) | Low | **open** (not addressed) | Line 125 still: "Task 01 — T1.a + T1.d (partial)". iter2 5-fix scope did not include header relabel. Same finding as Codex `task01-overclaims-t1c-trace`. |
| F-PROJ-2 (Claude — non-canonical `effort:` field) | Low | **open** (not addressed) | 10 `effort:` lines still present (grep -c). iter2 scope did not include schema decision. |
| F-PROJ-3 (Claude — scope-contract verbatim drift) | Low | open | Not in iter2 scope. |
| Codex `task01-overclaims-t1c-trace` | Low | **open** (not addressed) | Same as F-PROJ-1. |
| Codex `rollback-semantics-drift-from-ideation` | **High** | **addressed** | Task 03 `what` (line 173) rewritten with `git -C "$worktreePath" rm <copied-paths>` + AskUserQuestion + Ideation:283 verbatim citation requirement; § Decisions row 14 documents the change; matches Codex evidence requirement. |

## Stage 1/2 scenarios

| Scenario | Checklist | Result |
|---|---|---|
| S-P1 — Scope contract honored | iter2 only modifies the 5 declared sections | PASS — diff scope-discipline check (35 chunks, all 5-fix-related): Status note, Task 03 `what` + traces-to + verifies, Task 07 `requires` + verifies, Task 08 `verifies`, Task 09 row, Task 10 `requires`, § Dependency table rows 05/06/07/10, § Wave-ordering paragraph, § Parallel lanes L4/L6/orchestration-flag, § Edit-contract brief note, § Execution intake notes Edit-tool default, § Decisions rows 2/3/6/7/11-15, § Locked decisions row 1/4, § Self-review additions. **Zero non-5-fix collateral modifications.** |
| S-P2 — Fix 4 alignment with Ideation:283 | Task 03 cites Ideation:283 verbatim; uses `git rm`, not `git checkout` | PASS — line 173 has verbatim instruction. |
| S-P3 — Spec coverage preserved | 18/18 checklist anchors still mapped | PASS — Self-review table lines 569-587, unchanged from iter1 except T1-I-T1.j now annotated with "rollback sequence per Fix 4 → Ideation:283". |
| S-P4 — User locks preserved | LOCK #1-5 still intact + strengthened where applicable | PASS — LOCK #1 strengthened by Fix 2 graph form; LOCK #2/3/4/5 substance unchanged. |

## NEW iter2 findings

### F2-PROJ-1 — Task 01 header drift remains unfixed; iter2 silently dropped iter1 overall.md recommended action #4
- Type: `checklist_gap`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: Low
- Evidence: draft-iter2.md:125 still reads "Task 01 — T1.a + T1.d (partial) — Configuration Step 1 row 5.5 worktree creation"; but `traces-to:` at line 131-132 is `T1.a + T1.c`. iter1 Claude overall.md "Recommended actions" item 4 explicitly named relabel; iter1 Codex overall.md `task01-overclaims-t1c-trace` (Confidence 100) listed it too. iter2 Status note enumerates 5 fixes and explicitly states "All other sections copied verbatim from iter1" — the header drift was therefore consciously deferred without acknowledgment in the iter2 brief.
- Why it matters: Low impact at execution time (executor reads `traces-to:` and ignores the heading), but the iter2 leader's "All other sections copied verbatim" framing conceals the conscious decision to defer two Low findings (this one + `effort:` schema). User cannot tell from reading iter2 alone that two iter1 findings are still open.
- Suggested direction: Either fix the header in iter3, or add an "iter1 findings consciously deferred" note next to the 5-fix list in the Status note.

### F2-PROJ-2 — Two iter1 Low findings (`effort:` schema, F-PROJ-3 scope-contract drift) silently carried over
- Type: `general`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: Low
- Evidence: `effort:` field still appears 10x in iter2 task YAMLs (lines 144, 166, 192, 217, 242, 265, 290, 313, 335, 364). Planning/SKILL.md does not define `effort` in the canonical task schema.
- Why it matters: Low impact; same disposition transparency issue as F2-PROJ-1.

## Must-preserve list

- 18/18 spec coverage table (preserve at iter3 if any further changes).
- Fix 4 Ideation:283 verbatim citation requirement (this is the load-bearing Project fidelity fix).
- LOCK #1-5 substance + Fix 2 graph encoding strengthening.
- Scope-discipline of iter2's surgical-only modification pattern.

## Verdict rationale

Per `evaluation/SKILL.md` thresholds: zero Critical, zero High-confidence open findings → **PASS**. Both new findings are Low (transparency/cosmetic). The five iter2 fixes hit their declared targets with empirical evidence.

VERDICT: PASS
