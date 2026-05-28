---
name: dev-doc-standard-retrofit
description: Author a dev-doc-level memory standard and retrofit all live project-memory docs in conformance-first waves (all waves this session)
type: plans
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [project-memory, standard, conformance, prose, frontmatter, retrofit]
task: Author a dev-doc-level memory standard and retrofit live docs in waves
supersedes: null
superseded_by: null
task_count: 25
---

# Dev-doc-level project-memory standard + waved retrofit (all waves this session)

> **iter2 (REVISE remediation).** Synced to `planning/rawdata/draft-iter2.md`. The iter1 plan PASSED
> counts/ordering/schema; five surgical findings were applied: prose-task splits (P3/P5/P7 → 6 sub-tasks,
> task_count 22→25), archive-safe `**` globs, underscore-aware leak gate, T10 retargeted to the real
> `.codex/AGENTS.md` (AGENTS.md is a symlink), and count-prose normalized to 25 records.

## Idea anchor
- `ideation/artifacts/idea.md` + `design-options.md` (D1-D10, FIX-1 type-aware predicate). Standard
  home: `.gobbi/projects/gobbi/skills/memorization/rules.md` new §4 (CANONICAL; `.claude/...` is a
  symlink mirror — never edit the symlink).

## Scope Contract reference
- `ideation/artifacts/scope-contract.md` — Tier 1 (standard + conformance + prose) / Tier 2 (grep gate)
  / Tier 3 (nav). Out-of-scope: re-home, big-bang, heavy enforcement / new eval perspective (FLAG-2),
  `.claude/` published-docs standard (FLAG-3), frozen `archive/`, stripping legitimate per-type keys.

## Population (TRUE P_live at HEAD d2b5b37 — count-corrected from filter-bugged 208 baseline)
- **222 files / 18 READMEs / 204 content docs / 63 hyphen-form leak files + 5 underscore-form leak files
  (install-runtime).** Backlog-disposition legit (preserved) 28.
- Correction (Decision 4): the locked 208/191/59 figures were computed with a `find` predicate that
  wrongly excluded in-scope `features/agents/` (14 docs, 4 leaks). NOT a scope change — agents is T1.
  Re-verified with a corrected `find` (no agents exclusion): 222/18/204/63.
- iter2 (DOC-CONS-2): the leak gate key-set was hyphen-only; 5 LIVE `features/install-runtime/` docs
  carry underscore-spelled staging keys (`promoted_from`/`promoted_at`) and NO hyphen key. The gate now
  detects BOTH spellings; SC2 "0 leaks" target = union of the 63 hyphen-form + 5 underscore-form files → 0.

## Sub-tasks (25 executable records)

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| T0 | Author dev-doc quality standard §4 in canonical `rules.md` (key-set S = hyphen+underscore; archive-safe grep gate) | — | section exists + positive guidance + before/after + FIX-1 predicate (both spellings) + grep gate; worktree diff | executor |
| T1 | Conform `features/agents` (14, archive-safe) | T0 | leak gate 0 (was 4); 9 base keys on all 14; disposition preserved on 1 backlog | executor |
| T2 | Conform `features/evaluation` (15, archive-safe) | T0 | leak gate 0 (was 8); 9 base keys on all 15 | executor |
| T3 | Conform `features/git-workflow` A: discussions+design+decisions (20) | T0 | leak gate 0; 9 base keys on 20 | executor |
| T4 | Conform `features/git-workflow` B: rest+README (21) | T0, T3 | leak gate 0 over whole feature (41); disposition preserved on backlogs | executor |
| T5 | Conform `features/guardrails` (10, archive-safe) | T0 | leak gate 0 (was 5); 9 base keys on 10; disposition preserved on 3 backlogs | executor |
| T6 | Conform `features/install-runtime` A: discussions+design+decisions+changelogs (24) | T0 | leak gate (hyphen+underscore) 0 — clears 5 underscore-key docs; 9 base keys on 24 | executor |
| T7 | Conform `features/install-runtime` B: rest+README (20, archive-safe) | T0, T6 | leak gate (hyphen+underscore) 0 over whole feature (44, no archive); disposition preserved | executor |
| T8 | Conform `features/project-memory` (4, archive-safe) | T0 | leak gate 0 (was 2); 9 base keys on 4 | executor |
| T9a | Conform `features/workflow` (26, archive-safe — excludes archive/) — T9 split 1/3 | T0 | find -not archive = 26; leak gate 0 (was 14); 9 base keys on 26; disposition preserved | executor |
| T9b | Conform project-tier high-touch: decisions+design+learnings+notes+backlogs (35) — T9 split 2/3 | T0 | leak gate 0; 9 base keys on 35; disposition preserved on backlogs | executor |
| T9c | Conform project-tier remainder: references+reviews+rules+plans+mistakes + features/README + root README (33) — T9 split 3/3 | T0 | leak gate 0 (was 1); 9 base keys on 33; priority/domain on mistakes + verdict/review_kind/subject on reviews preserved | executor |
| T10 | Reconcile principle count 12→13 by editing REAL file `.codex/AGENTS.md` (AGENTS.md symlink auto-reflects; edit WORKTREE copy only — Decision 2) | T0 | readlink AGENTS.md = .codex/AGENTS.md; "13 principles" + P13 row present; "12 principles" = 0; WORKTREE .codex/AGENTS.md changed | executor |
| T11 | Wire minimal mechanical grep gate (hyphen+underscore key-set; archive-safe) | T0, T1, T2, T4, T5, T7, T8, T9a, T9b, T9c (10 direct → 11 by transitive closure) | gate returns 0 leaks over all P_live outside archive/ (63 hyphen ∪ 5 underscore) | executor |
| P1 | Prose: `features/agents` (14, archive-safe) | T1 | §4 section-contract checklist pass; D5 cryptic-coord scan 0 | executor |
| P2 | Prose: `features/evaluation` (15, archive-safe) | T2 | §4 checklist pass; D5 scan 0 | executor |
| P3a | Prose: `features/git-workflow` A: discussions+design+decisions (20) — P3 split 1/2 | T3 | §4 checklist pass; D5 scan 0 | executor |
| P3b | Prose: `features/git-workflow` B: rest+README (21) — P3 split 2/2 | T4, P3a | §4 checklist pass; D5 scan 0 | executor |
| P4 | Prose: `features/guardrails` (10, archive-safe) | T5 | §4 checklist pass; D5 scan 0 | executor |
| P5a | Prose: `features/install-runtime` A: discussions+design+decisions+changelogs (24) — P5 split 1/2 | T6 | §4 checklist pass; D5 scan 0 | executor |
| P5b | Prose: `features/install-runtime` B: rest+README (20, archive-safe) — P5 split 2/2 | T7, P5a | §4 checklist pass; D5 scan 0 | executor |
| P6 | Prose: `features/project-memory` + `features/workflow` (30, archive-safe) | T8, T9a | §4 checklist pass; D5 scan 0 | executor |
| P7a | Prose: project-tier high-touch: decisions+design+learnings+notes+backlogs (35) — P7 split 1/2 | T9b | §4 checklist pass; D5 scan 0; per-type keys intact | executor |
| P7b | Prose: project-tier remainder: references+reviews+rules+plans+mistakes + 2 index READMEs (33) — P7 split 2/2 | T9c, P7a | §4 checklist pass; D5 scan 0; per-type keys intact | executor |
| N1 | README Subdirectories nav accuracy (18 READMEs, archive-safe — excludes 5 archive READMEs) — Wave 3 | P1, P2, P3a, P3b, P4, P5a, P5b, P6, P7a, P7b | find -not archive = 18; each list matches real subdirs | executor |

## Dependency graph
T0 blocks everything. Wave 1 (T1-T9c) runs after T0; split-feature halves are chained (T3→T4, T6→T7).
T11 (grep gate) carries 10 direct `requires` edges (T0 + T1, T2, T4, T5, T7, T8, T9a, T9b, T9c) covering
all 11 conformance records by transitive closure (T3 via T4, T6 via T7). Wave 2 prose: each prose
sub-task requires its matching Wave-1 conformance task committed first (no interleave on shared files —
carry-forward honored); the prose splits chain (P3a→P3b, P5a→P5b, P7a→P7b). Wave 3 nav (N1) requires all
10 prose tasks. T10 requires only T0. Recommended order: T0 → T1..T9c → T10 → T11 → P1 → P2 → P3a → P3b →
P4 → P5a → P5b → P6 → P7a → P7b → N1. All 25 sub-tasks ship THIS session (Decision 1).

## Verification strategy summary
Per-task: type-aware FIX-1 leak gate (hyphen+underscore key-set, archive-safe) returns 0 for the task's
doc set + all docs carry 9 base keys + worktree `git diff --name-only` confirms only intended paths (no
`archive/`) changed. Prose tasks add the §4 section-contract checklist (evaluator) + D5 cryptic-coord
scan. Cumulative (T11): documented grep gate returns 0 leaks over all of P_live outside `archive/`
(63 hyphen ∪ 5 underscore). SC2 denominator = 204 content / 222 total. **Evaluation cadence (Decision 3):
dual-system (Claude + Codex) on EVERY task + the Planning-loop eval — no single-system shortcut.**

## Open issues
- None blocking. All five user decisions ratified (session scope all-in, T10 in, max-rigor dual eval,
  count correction 222/18/204/63, T9 3-way split).
- DEFERRED (not in this plan): new dev-doc-quality eval perspective (FLAG-2, backlog filed); `.claude/`
  published-docs standard surgery (FLAG-3).
- Cosmetic: backlog-disposition legit count 28 (this measurement) vs 27 strict P_live — non-blocking;
  the 63-file leak set + D6 predicate reproduce exactly.
