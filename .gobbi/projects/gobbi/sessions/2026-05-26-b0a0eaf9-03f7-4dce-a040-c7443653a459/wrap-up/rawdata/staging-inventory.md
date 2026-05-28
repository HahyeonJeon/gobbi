---
session: 2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459
created: 2026-05-27
step: wrap-up/rawdata/staging-inventory
---

# Staging Inventory — All Prior Loops

Master inventory of every staging file across ideation / preparation / planning / execution loops.
Built at Wrap-up WORK Step 2.

---

## Ideation Staging (`ideation/staging/`)

| File | Sub-dir | Frontmatter notes |
|---|---|---|
| `backlogs/project/evaluation-perspective-for-dev-doc-quality.md` | backlogs/project | project-scope backlog |
| `checklists/principle-drift-entrypoint-reconciliation.md` | checklists | feature-scope checklist |
| `checklists/symlink-edit-target-merge-back-flag.md` | checklists | feature-scope checklist |
| `decisions/agents-md-13-principles-confirm-defer-at-planning.md` | decisions | feature-scope decision |
| `decisions/fix1-subcounts-cross-foot-cosmetic.md` | decisions | feature-scope decision |
| `decisions/population-predicate-explicit-baseline-commit.md` | decisions | feature-scope decision |
| `decisions/type-aware-strip-disposition-not-blanket-leak.md` | decisions | feature-scope decision |
| `design/dev-doc-memory-standard.md` | design | feature-scope design |
| `discussions/2026-05-26-build-on-272-branch-defer-merge.md` | discussions | feature-scope discussion |
| `discussions/2026-05-26-conformance-first-then-prose.md` | discussions | feature-scope discussion |
| `discussions/2026-05-26-scope-spine-three-tier-priority.md` | discussions | feature-scope discussion |
| `references/adr-decision-record-shape.md` | references | feature-scope reference |
| `references/diataxis-type-purity.md` | references | feature-scope reference |
| `references/docs-as-code-linting.md` | references | feature-scope reference |
| `references/frontmatter-as-schema.md` | references | feature-scope reference |
| `references/markdown-memory-atomicity.md` | references | feature-scope reference |
| `scenarios/tier-2-3-scope-explicitly-placed.md` | scenarios | feature-scope scenario |

**Ideation total: 17 files**

---

## Preparation Staging (`preparation/staging/`)

| File | Sub-dir | Frontmatter notes |
|---|---|---|
| `decisions/codex-path-traceability.md` | decisions | feature-scope decision |
| `decisions/context-budget-wave-ordering-carry-forward.md` | decisions | feature-scope decision |
| `decisions/coupling-mischaracterization-deferred.md` | decisions | feature-scope decision |
| `decisions/fx1-sub-count-cross-foot.md` | decisions | feature-scope decision |
| `decisions/triplicate-backlog-remediated.md` | decisions | feature-scope decision |

**Preparation total: 5 files**

---

## Planning Staging (`planning/staging/`)

| File | Sub-dir | Frontmatter notes |
|---|---|---|
| `checklists/disposition-preservation-missing-t1-t5.md` | checklists | feature-scope checklist |
| `checklists/task-count-prose-inconsistency.md` | checklists | feature-scope checklist |
| `decisions/archive-glob-scope-leak.md` | decisions | feature-scope decision |
| `decisions/prose-tasks-exceed-context-ceiling.md` | decisions | feature-scope decision |
| `decisions/reproducing-a-bugged-command-is-not-validation.md` | decisions | **mistake-candidate: true**, project-scope |
| `decisions/t10-symlink-mismodel.md` | decisions | feature-scope decision |
| `decisions/underscore-staging-keys-false-clean.md` | decisions | feature-scope decision |
| `plans/2026-05-26-dev-doc-standard-retrofit.md` | plans | status: superseded, superseded_by: main.md |
| `plans/main.md` | plans | active plan |
| `reviews/dual-system-planning-eval-iter1-iter2.md` | reviews | project-level review |

**Planning total: 10 files**

---

## Execution Staging (all task loops)

Per-task execution staging (all tasks T0–T11): dirs exist (changelogs, decisions, learnings per task). By manager decision under 25-task max-rigor load, executors used the per-task LEDGER model — staging dirs are intentionally empty or sparse. The durable execution record is: git commits (T0–T11 + fix commits at e9c4ea7), per-task evaluation/iter*/ files, and the state.json ledger.

Empty execution staging dirs are EXPECTED, not a compliance gap. No `zero-staging` NEEDS_CONTEXT applies — manager decision authorized the LEDGER model.

**Execution total staging files: 0** (sparse/empty by design; ledger model)

---

## Step 2.5 — Prior-loop MEMORIZATION Compliance Scan

| Loop | Gap category | Finding type | Action |
|---|---|---|---|
| ideation | None — 17 files, well-shaped | n/a | n/a |
| preparation | None — 5 files, well-shaped | n/a | n/a |
| planning | planning/staging/decisions/reproducing-a-bugged-command-is-not-validation.md has `mistake-candidate: true` — routed to mistakes/, not decisions/ | general | Auto-route to mistakes/ (project-scope confirmed by user) |
| planning | plans/2026-05-26-dev-doc-standard-retrofit.md has status: superseded, superseded_by: main.md | general | Promote only main.md as the live plan; manifest old plan as superseded-drop |
| execution | All task staging dirs empty — LEDGER model by manager decision | zero-staging | Authorized absence — no NEEDS_CONTEXT needed; per-session delegation prompt explicitly noted expected sparse/empty |

All Step 2.5 gaps are mechanical-class. No judgment-required escalations. Proceed to Step 3.
