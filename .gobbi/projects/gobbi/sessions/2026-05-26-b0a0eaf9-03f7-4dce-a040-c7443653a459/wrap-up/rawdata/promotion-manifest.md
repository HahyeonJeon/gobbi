---
session: 2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459
created: 2026-05-27
step: wrap-up/rawdata/promotion-manifest
---

# Promotion Manifest

Append-only routing-decision log. One entry per staging file. Three outcomes: PROMOTE / BACKLOG / DROP.

Feature destination: `features/project-memory/` (from session.json.feature = "project-memory")
Project destination: `.gobbi/projects/gobbi/` top-level

---

## Ideation Staging

| # | Source path | Outcome | Destination | Notes |
|---|---|---|---|---|
| 1 | `ideation/staging/backlogs/project/evaluation-perspective-for-dev-doc-quality.md` | PROMOTE | `backlogs/evaluation-perspective-for-dev-doc-quality.md` (project-scope per path `backlogs/project/`) | |
| 2 | `ideation/staging/checklists/principle-drift-entrypoint-reconciliation.md` | PROMOTE | `features/project-memory/checklists/principle-drift-entrypoint-reconciliation.md` | |
| 3 | `ideation/staging/checklists/symlink-edit-target-merge-back-flag.md` | PROMOTE | `features/project-memory/checklists/symlink-edit-target-merge-back-flag.md` | |
| 4 | `ideation/staging/decisions/agents-md-13-principles-confirm-defer-at-planning.md` | PROMOTE | `features/project-memory/decisions/agents-md-13-principles-confirm-defer-at-planning.md` | |
| 5 | `ideation/staging/decisions/fix1-subcounts-cross-foot-cosmetic.md` | PROMOTE | `features/project-memory/decisions/fix1-subcounts-cross-foot-cosmetic.md` | |
| 6 | `ideation/staging/decisions/population-predicate-explicit-baseline-commit.md` | PROMOTE | `features/project-memory/decisions/population-predicate-explicit-baseline-commit.md` | |
| 7 | `ideation/staging/decisions/type-aware-strip-disposition-not-blanket-leak.md` | PROMOTE | `features/project-memory/decisions/type-aware-strip-disposition-not-blanket-leak.md` | |
| 8 | `ideation/staging/design/dev-doc-memory-standard.md` | PROMOTE | `features/project-memory/design/dev-doc-memory-standard.md` | |
| 9 | `ideation/staging/discussions/2026-05-26-build-on-272-branch-defer-merge.md` | PROMOTE | `features/project-memory/discussions/2026-05-26-build-on-272-branch-defer-merge.md` | |
| 10 | `ideation/staging/discussions/2026-05-26-conformance-first-then-prose.md` | PROMOTE | `features/project-memory/discussions/2026-05-26-conformance-first-then-prose.md` | |
| 11 | `ideation/staging/discussions/2026-05-26-scope-spine-three-tier-priority.md` | PROMOTE | `features/project-memory/discussions/2026-05-26-scope-spine-three-tier-priority.md` | |
| 12 | `ideation/staging/references/adr-decision-record-shape.md` | PROMOTE | `features/project-memory/references/adr-decision-record-shape.md` | |
| 13 | `ideation/staging/references/diataxis-type-purity.md` | PROMOTE | `features/project-memory/references/diataxis-type-purity.md` | |
| 14 | `ideation/staging/references/docs-as-code-linting.md` | PROMOTE | `features/project-memory/references/docs-as-code-linting.md` | |
| 15 | `ideation/staging/references/frontmatter-as-schema.md` | PROMOTE | `features/project-memory/references/frontmatter-as-schema.md` | |
| 16 | `ideation/staging/references/markdown-memory-atomicity.md` | PROMOTE | `features/project-memory/references/markdown-memory-atomicity.md` | |
| 17 | `ideation/staging/scenarios/tier-2-3-scope-explicitly-placed.md` | PROMOTE | `features/project-memory/scenarios/tier-2-3-scope-explicitly-placed.md` | |

---

## Preparation Staging

| # | Source path | Outcome | Destination | Notes |
|---|---|---|---|---|
| 18 | `preparation/staging/decisions/codex-path-traceability.md` | PROMOTE | `features/project-memory/decisions/codex-path-traceability.md` | |
| 19 | `preparation/staging/decisions/context-budget-wave-ordering-carry-forward.md` | PROMOTE | `features/project-memory/decisions/context-budget-wave-ordering-carry-forward.md` | |
| 20 | `preparation/staging/decisions/coupling-mischaracterization-deferred.md` | PROMOTE | `features/project-memory/decisions/coupling-mischaracterization-deferred.md` | |
| 21 | `preparation/staging/decisions/fx1-sub-count-cross-foot.md` | PROMOTE | `features/project-memory/decisions/fx1-sub-count-cross-foot.md` | |
| 22 | `preparation/staging/decisions/triplicate-backlog-remediated.md` | PROMOTE | `features/project-memory/decisions/triplicate-backlog-remediated.md` | |

---

## Planning Staging

| # | Source path | Outcome | Destination | Notes |
|---|---|---|---|---|
| 23 | `planning/staging/checklists/disposition-preservation-missing-t1-t5.md` | PROMOTE | `features/project-memory/checklists/disposition-preservation-missing-t1-t5.md` | |
| 24 | `planning/staging/checklists/task-count-prose-inconsistency.md` | PROMOTE | `features/project-memory/checklists/task-count-prose-inconsistency.md` | |
| 25 | `planning/staging/decisions/archive-glob-scope-leak.md` | PROMOTE | `features/project-memory/decisions/archive-glob-scope-leak.md` | |
| 26 | `planning/staging/decisions/prose-tasks-exceed-context-ceiling.md` | PROMOTE | `features/project-memory/decisions/prose-tasks-exceed-context-ceiling.md` | |
| 27 | `planning/staging/decisions/reproducing-a-bugged-command-is-not-validation.md` | PROMOTE | `mistakes/reproducing-a-bugged-command-is-not-validation.md` | `mistake-candidate: true`, project-scope per user decision |
| 28 | `planning/staging/decisions/t10-symlink-mismodel.md` | PROMOTE | `features/project-memory/decisions/t10-symlink-mismodel.md` | |
| 29 | `planning/staging/decisions/underscore-staging-keys-false-clean.md` | PROMOTE | `features/project-memory/decisions/underscore-staging-keys-false-clean.md` | |
| 30 | `planning/staging/plans/2026-05-26-dev-doc-standard-retrofit.md` | DROP | n/a | status: superseded (superseded_by: main.md per its own frontmatter); live plan is main.md; old plan is session-transient scaffold, no project-memory value |
| 31 | `planning/staging/plans/main.md` | PROMOTE | `features/project-memory/plans/2026-05-26-dev-doc-standard-retrofit.md` | Canonical plan file; date-prefix applied per routing table |
| 32 | `planning/staging/reviews/dual-system-planning-eval-iter1-iter2.md` | PROMOTE | `reviews/2026-05-26-dual-system-planning-eval-iter1-iter2.md` | Project-level review; date-prefix applied per routing table |

---

## Execution Staging

| # | Source | Outcome | Destination | Notes |
|---|---|---|---|---|
| — | All execution task staging dirs | DROP (authorized) | n/a | All task dirs (T0–T11) have empty staging; LEDGER model by manager decision. Execution record is git commits (tip e9c4ea7) + per-task evaluation/iter*/ files + state.json ledger |

---

## Process Mistakes (Wrap-up-authored; not from staging)

| # | File | Destination |
|---|---|---|
| M1 | `reproducing-a-bugged-command-is-not-validation.md` | `mistakes/reproducing-a-bugged-command-is-not-validation.md` (promoted from planning/staging/decisions/ per mistake-candidate routing) |
| M2 | `evaluator-false-pass-without-diffing.md` | `mistakes/evaluator-false-pass-without-diffing.md` |
| M3 | `conformance-executor-pre-executed-prose-wave-reshape.md` | `mistakes/conformance-executor-pre-executed-prose-wave-reshape.md` |
| M4 | `subagent-relative-path-write-strays-to-main-tree.md` | `mistakes/subagent-relative-path-write-strays-to-main-tree.md` |
| M5 | `executor-cwd-reset-commits-task-to-wrong-branch.md` | `mistakes/executor-cwd-reset-commits-task-to-wrong-branch.md` |

---

## Step 2.5 Compliance Gap Report

| Loop | Path | Category | Finding type | Action | Result |
|---|---|---|---|---|---|
| planning | `plans/2026-05-26-dev-doc-standard-retrofit.md` | shape-mismatch (superseded) | general | DROP — superseded by main.md per its own frontmatter | Applied |
| planning | `decisions/reproducing-a-bugged-command-is-not-validation.md` | template-mismatch (mistake-candidate routing) | general | Auto-route: mistake-candidate: true → mistakes/ | Applied |
| execution | All task staging dirs empty | zero-staging (authorized) | general | Authorized absence per manager's LEDGER decision in delegation prompt | No NEEDS_CONTEXT |

---

## Totals

| Category | Count |
|---|---|
| PROMOTE (feature-memory) | 28 |
| PROMOTE (project mistakes) | 5 |
| PROMOTE (project backlogs) | 1 |
| PROMOTE (project reviews) | 1 |
| DROP (superseded plan scaffold) | 1 |
| DROP (authorized empty execution staging) | 0 (dirs, not files) |
| **Total staging files accounted for** | **32** |
