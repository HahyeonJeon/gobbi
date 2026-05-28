---
name: dev-doc-standard-retrofit
description: Author a dev-doc-level memory standard and retrofit live project-memory docs in conformance-first waves
type: plans
scope: feature
feature: project-memory
status: superseded
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [project-memory, standard, conformance, frontmatter, retrofit]
task: Author a dev-doc-level memory standard and retrofit live docs in waves
supersedes: null
superseded_by: main.md
task_count: 18
---

# Dev-doc-level project-memory standard + waved retrofit

## Idea anchor
- `ideation/artifacts/idea.md` + `design-options.md` (D1-D10, FIX-1 predicate). Standard's home:
  `.gobbi/projects/gobbi/skills/memorization/rules.md` new §4 (canonical; `.claude/` is a symlink mirror).

## Scope Contract reference
- `ideation/artifacts/scope-contract.md` — Tier 1 (standard + conformance + prose) / Tier 2 (grep gate) /
  Tier 3 (nav). Out-of-scope: re-home, big-bang, heavy enforcement, frozen `archive/`, stripping
  legitimate per-type keys.

## Population (TRUE P_live at HEAD d2b5b37 — corrected from filter-bugged 208 baseline)
- 222 files / 18 READMEs / 204 content. Leak set 63. Backlog-disposition legit (preserved) 28.
- Correction: Ideation/Preparation filter excluded `features/agents/` (14 docs); agents is in-scope.

## Sub-tasks

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| T0 | Author dev-doc quality standard §4 in canonical `rules.md` | — | section exists + positive guidance + before/after + FIX-1 predicate + grep gate; worktree diff | executor |
| T1 | Conform `features/agents` (14) | T0 | leak gate 0 (was 4); 9 base keys on all 14 | executor |
| T2 | Conform `features/evaluation` (15) | T0 | leak gate 0 (was 8); 9 base keys on all 15 | executor |
| T3 | Conform `features/git-workflow` A: discussions+design+decisions (20) | T0 | leak gate 0; 9 base keys on 20 | executor |
| T4 | Conform `features/git-workflow` B: rest+README (21) | T0, T3 | leak gate 0 over whole feature (41); disposition preserved on backlogs | executor |
| T5 | Conform `features/guardrails` (10) | T0 | leak gate 0 (was 5); 9 base keys on 10 | executor |
| T6 | Conform `features/install-runtime` A: discussions+design+decisions+changelogs (24) | T0 | leak gate 0; 9 base keys on 24 | executor |
| T7 | Conform `features/install-runtime` B: rest+README (20) | T0, T6 | leak gate 0 over whole feature (44); disposition preserved | executor |
| T8 | Conform `features/project-memory` (4) | T0 | leak gate 0 (was 2); 9 base keys on 4 | executor |
| T9 | Conform `features/workflow` + project-tier dirs (93 → SPLIT T9a/T9b-i/T9b-ii) | T0 | leak gate 0; legit per-type keys preserved (disposition/priority/domain/verdict) | executor |
| T10 | Reconcile AGENTS.md + .codex/AGENTS.md 12→13 (PENDING USER CONFIRM) | T0 | "13 principles" + P13 row present; WORKTREE copies changed | executor |
| T11 | Wire minimal mechanical grep gate | T0, T1, T2, T4, T5, T7, T8, T9 | gate returns 0 leaks over all P_live outside archive/ | executor |
| P1-P7 | Per-type prose rewrite per feature group (DEFERRED to follow-up) | matching Wave-1 task | §4 section-contract checklist; D5 cryptic-coord scan | executor |
| N1 | README Subdirectories nav accuracy (DEFERRED to follow-up) | all Wave-1+Wave-2 | each list matches real subdirs | executor |

## Dependency graph
T0 blocks everything. Wave 1 (T1-T9) runs after T0; split-feature halves are chained (T3→T4, T6→T7).
T11 (grep gate) requires all Wave-1 conformance. Wave 2 prose requires the matching Wave-1
conformance committed first (no interleave on shared files — carry-forward honored). Wave 3 nav last.
T10 is gated on user confirmation (evaluator-introduced, not user-ratified).

## Verification strategy summary
Per-task: type-aware leak gate returns 0 for the task's doc set + all docs carry 9 base keys + worktree
`git diff --name-only` confirms only intended paths changed. Cumulative (T11): the documented grep gate
returns 0 leaks over all of P_live outside `archive/`. SC2 denominator = 222.

## Open issues
- SR-FINDING-1 (Medium): population undercount 208→222; corrected in plan; manager to note to user.
- SR-FINDING-2 (Low): T9 (93 docs) exceeds context ceiling → 3-way split recommended; manager AskUserQuestion.
- T10 INCLUDE-vs-DEFER pending user decision.
- Scale: 18 tasks is multi-session; recommend T0+Wave1+grep-gate this session, defer Wave2/3.
