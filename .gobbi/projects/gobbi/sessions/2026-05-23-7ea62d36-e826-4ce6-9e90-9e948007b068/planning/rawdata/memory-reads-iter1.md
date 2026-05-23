# Planning Loop Iter 1 — Memory Reads

This file enumerates all evaluation files and other key inputs consumed during Planning iter1 MEMORIZATION. Written per memorization/SKILL.md Step 5 procedure (memory-reads artifact for PASS iter — note: verdict is REVISE so this is a rawdata file, not an artifact/).

## Evaluation Files Consumed (iter1)

### Claude system — iter1

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/claude/aesthetics.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/claude/consistency.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/claude/overall.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/claude/performance.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/claude/project.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/claude/risk.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/claude/structure.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/claude/usage.md`

### Codex system — iter1

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/codex/aesthetics.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/codex/consistency.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/codex/overall.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/codex/performance.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/codex/project.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/codex/risk.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/codex/structure.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/evaluation/iter1/codex/usage.md`

## Draft File Consumed

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/rawdata/draft-iter1.md`

## Staging Files Read

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/concern-1-wrap-up-step-2-5-anchor.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/concern-2-path-conventions-anchor-casing.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/concern-3-coverage-ownership-cell-text.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/concern-5-constraints-body-block-vs-h2.md`

## Verdict Summary (iter1)

| System | Verdict | Critical | High | Medium | Low |
|--------|---------|----------|------|--------|-----|
| Claude | PASS    | 0        | 0    | 1      | 17  |
| Codex  | REVISE  | 0        | 8    | 2      | 2   |
| **Combined** | **REVISE** | **0** | **8** | **3** | **19** |

Combined verdict: REVISE (Claude PASS + Codex REVISE -> REVISE per evaluation rules).

## Codex REVISE Root Causes (iter1)

1. **Concern 3 not propagated** (COD-PROJ-001, COD-CONS-001, COD-USAGE-001, COD-RISK-002, COD-OVERALL-001) — user locked Draft A but artifact still has `USER DECISION REQUIRED` at `draft-iter1.md:89`, `concern-3-coverage-ownership-cell-text.md:5-6`, and `concern-3-coverage-ownership-cell-text.md:48-50`.
2. **Relative/ellipsis session paths** (COD-STRUCT-001, COD-RISK-001, COD-OVERALL-002) — `draft-iter1.md:278` uses `test -f sessions/...`; `draft-iter1.md:338` uses `sessions/2026-05-23-.../planning/staging/decisions/{slug}.md`. Required: absolute main-tree paths `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/...`.
3. **Task 04 verbatim-spec discipline weaker than Task 06** (COD-USAGE-002, COD-OVERALL-003) — Task 06 explicitly inlines 8 H2 section names verbatim; Task 04 lacks parallel "inline verbatim spec from idea.md" directive for the 5-Type vocabulary.
4. **Residual `claude/SKILL.md` reference** (COD-CONS-002) — Concern 5 established `.claude/skills/claude/` does not exist, but Task 06 brief still conditionally allows citing `claude/SKILL.md`.

## Codex Sandbox Issue (empirical witness for codex skill Item A)

First Codex evaluation attempt hit `writing outside of the project; rejected` sandbox error (no project-root detection). Retry with `--cd` + `--add-dir` flags succeeded. This is an empirical witness for the codex skill design decision requiring `--add-dir` for session path access (Item A, locked in Ideation).
