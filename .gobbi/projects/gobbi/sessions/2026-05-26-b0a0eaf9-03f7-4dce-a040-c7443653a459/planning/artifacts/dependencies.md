---
loop: planning
iter: 2
artifact_type: dependencies
created_at: 2026-05-26
status: final
supersedes: []
related:
  - planning/rawdata/draft-iter2.md
  - planning/artifacts/task-list.md
---

# Dependencies — dev-doc-level project-memory standard + waved retrofit

## Dependency table (25 tasks)

| Task | Depends on | Blocks | Files touched |
|---|---|---|---|
| T0 standard | — | T1-T11, all prose, N1 | `skills/memorization/rules.md` |
| T1 agents | T0 | T11, P1 | `features/agents/**` (archive-safe) |
| T2 evaluation | T0 | T11, P2 | `features/evaluation/**` (archive-safe) |
| T3 git-workflow A | T0 | T4, P3a | `features/git-workflow/{discussions,design,decisions}/**` |
| T4 git-workflow B | T0, T3 | T11, P3b | `features/git-workflow/{backlogs,changelogs,checklists,plans,references,scenarios,README}` |
| T5 guardrails | T0 | T11, P4 | `features/guardrails/**` (archive-safe) |
| T6 install-runtime A | T0 | T7, P5a | `features/install-runtime/{discussions,design,decisions,changelogs}/**` |
| T7 install-runtime B | T0, T6 | T11, P5b | `features/install-runtime/{backlogs,checklists,references,scenarios,README}` (archive-safe) |
| T8 project-memory | T0 | T11, P6 | `features/project-memory/**` (archive-safe) |
| T9a workflow | T0 | T11, P6 | `features/workflow/**` (archive-safe — excludes `archive/`) |
| T9b project-tier high-touch | T0 | T11, P7a | `{decisions,design,learnings,notes,backlogs}/*.md` |
| T9c project-tier remainder | T0 | T11, P7b | `{references,reviews,rules,plans,mistakes}/*.md` + `features/README.md` + `README.md` |
| T10 .codex/AGENTS.md | T0 | — | `.codex/AGENTS.md` (WORKTREE copy; AGENTS.md symlink auto-reflects) |
| T11 grep gate | T0, T1, T2, T4, T5, T7, T8, T9a, T9b, T9c (10 direct edges) | — | `skills/memorization/rules.md` |
| P1 prose agents | T1 | N1 | `features/agents/**` (archive-safe) |
| P2 prose evaluation | T2 | N1 | `features/evaluation/**` (archive-safe) |
| P3a prose git-workflow A | T3 | P3b, N1 | `features/git-workflow/{discussions,design,decisions}/**` |
| P3b prose git-workflow B | T4, P3a | N1 | `features/git-workflow/{backlogs,changelogs,checklists,plans,references,scenarios,README}` |
| P4 prose guardrails | T5 | N1 | `features/guardrails/**` (archive-safe) |
| P5a prose install-runtime A | T6 | P5b, N1 | `features/install-runtime/{discussions,design,decisions,changelogs}/**` |
| P5b prose install-runtime B | T7, P5a | N1 | `features/install-runtime/{backlogs,checklists,references,scenarios,README}` (archive-safe) |
| P6 prose pm+workflow | T8, T9a | N1 | `features/{project-memory,workflow}/**` (archive-safe) |
| P7a prose project-tier high-touch | T9b | P7b, N1 | `{decisions,design,learnings,notes,backlogs}/*.md` |
| P7b prose project-tier remainder | T9c, P7a | N1 | `{references,reviews,rules,plans,mistakes}/*.md` + 2 index READMEs |
| N1 nav | P1, P2, P3a, P3b, P4, P5a, P5b, P6, P7a, P7b (all 10 prose tasks) | — | all 18 README.md (archive-safe) |

## T11 dependency note

T11 carries **10 DIRECT `requires` edges** (T0 + the 9 leaf conformance records: T1, T2, T4, T5, T7, T8, T9a, T9b, T9c). It transitively depends on the remaining 2 conformance records — **T3 via T4** (T4 requires T3) and **T6 via T7** (T7 requires T6) — so its prerequisite closure is **all 11 conformance records**, even though the direct edge list has 10 entries. This is intentional: T4/T7 each verify their feature's A+B leak gate cumulatively, so requiring the B half pulls in the A half.

## Parallel lanes (documentation only — execution is sequential)

| Lane | Tasks | Order |
|---|---|---|
| Foundation | T0 | first, alone |
| Conformance (independent features) | T1, T2, T5, T8, T9a, T9b, T9c | any order after T0 |
| Conformance (git-workflow chain) | T3 → T4 | T3 before T4 |
| Conformance (install-runtime chain) | T6 → T7 | T6 before T7 |
| Reconciliation | T10 | any time after T0 |
| Enforcement | T11 | after the 10 leaf conformance tasks |
| Prose (split chains) | P3a → P3b; P5a → P5b; P7a → P7b | A before B in each |
| Prose (independent) | P1, P2, P4, P6 | each after its matching Wave-1 conformance task |
| Nav | N1 | last, after all 10 prose tasks |

## Conflict flags

- T3 and T4 both touch `features/git-workflow/` — sequential (T4 requires T3), not parallel-safe.
- T6 and T7 both touch `features/install-runtime/` — sequential (T7 requires T6).
- P3a and P3b both touch `features/git-workflow/` — sequential (P3b requires P3a).
- P5a and P5b both touch `features/install-runtime/` — sequential (P5b requires P5a).
- P7a and P7b both touch the project tier — disjoint dir sets, but P7b requires P7a (serialized).
- T0 and T11 both touch `skills/memorization/rules.md` — T11 requires T0; sequential.
- Each prose task touches the same files as its matching Wave-1 conformance task (e.g., P1 ↔ T1 on `features/agents/**`) — the `requires` edge is the conflict mitigation: conformance is committed before prose touches the file.
- N1 touches all 18 README.md — each also touched by a prose task. N1 requires all 10 prose tasks, so it runs strictly after.
- T9c and P7b both edit `features/README.md` + `PM/README.md`; N1 also edits them. Ordering T9c → P7b → N1 via `requires` serializes the three.
- No two Wave-1 conformance tasks share any file (disjoint feature/dir globs).
- No task edit-set includes any `archive/` path — every `**` glob is archive-safe.

## Conformance-before-prose ordering invariant (carry-forward honored)

ALL Wave-1 conformance for a given file group completes and commits BEFORE any Wave-2 prose touches the same file. Enforced by per-group `requires` edges (each prose sub-task requires its matching Wave-1 conformance task). This is the carry-forward from `preparation/staging/decisions/context-budget-wave-ordering-carry-forward.md` — honored throughout.

T0 blocks every retrofit task (the standard is the spec they verify against). T11 (grep gate) requires the 10 leaf conformance tasks (covering all 11 by transitive closure) because it verifies the cumulative 0-leak criterion over all of P_live. N1 runs last (after all 10 prose tasks) so the nav reflects the final tree.
