---
name: startup-skill-3-improvements-and-whole-bundle-sop-migration
description: Nine-task decomposition of the startup skill's IP-1/IP-2/IP-3 improvements + whole-bundle scenario/checklist/evaluation SOP migration
type: plans
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [startup-skill, pacing-removal, evidence-led-followups, phase-doc-contract, scenario-checklist-evaluation-migration, dual-system]
author: claude
supersedes: null
superseded_by: null
task: startup-skill-improvement
task_count: 9
---

# Startup skill: three improvements + whole-bundle SOP migration — Execution plan

## Idea anchor

`1-ideation/outputs/idea.md` (iter3 PASS) — the locked Idea: IP-1 (per-phase confirmed synthesis docs, five-layer
phase-doc contract), IP-2 (remove pacing — no replacement cadence/turn/count proxy), IP-3 (unbounded evidence-led
Level-3+ follow-ups, wired to A4/riskiest-assumption), plus D12/MIG-1…MIG-8/X-1 (whole-bundle migration of the
startup `scenario.md`/`checklist.md`/`evaluation.md` trio to the current scenario/checklist/evaluation SOPs,
lossless across 29 legacy families / 119 legacy checks).

## Scope Contract reference

`1-ideation/outputs/idea.md:22-31` (`artifact_type: scope-contract`) is the sole authoritative Scope Contract —
project `gobbi`, feature `install-runtime`, task: revise exactly six `skills/startup/{SKILL.md,topics.md,
recording.md,scenario.md,checklist.md,evaluation.md}` files for the three improvement points plus the bundle SOP
migration. No topic-tree content change; no startup-close promotion-model change. Readiness input:
`2-preparation/outputs/preparation.md` (PASS, user-accept-with-deferral) — ten manual verification anchors, four
live carry-forwards, one deferred constraint (COD-PROJ-001-ITER3), now resolved in-plan (see Open issues).

## Sub-tasks

Full task bodies (`traces-to`, `requires`, `files`, `inputs`/`outputs`, `anchors`, `verifies`, and the runnable
verification-command blocks) live in the canonical Plan artifact — `3-planning/outputs/plan.md` — this table is
a navigation summary, not the trace contract (per `planning/SKILL.md` Sub-step B, `traces-to` is quotation, not
paraphrase; do not re-derive task acceptance from this table).

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| T1 | Freeze the legacy 29-family/119-check inventory + build the per-clause semantic-union losslessness ledger (source side) | — | Runnable `verifies` block (LEDGER row completeness, EXEC_BASE singleton) + manual MC-T1 (no sampling) | executor |
| T2 | Delete the six pure-pacing occurrences from `SKILL.md`+`topics.md`; reframe per-axis lines; loosen fixed prompt-count to evidence-led judgment | T1 | Absence regex + co-located-rule-preservation checks + 3 owned VA-09 behavioural trials | executor |
| T3 | Add the unbounded evidence-led Level-3+ follow-up allowance (both files); reframe both contrary "stop probing" clauses; add probe id/closure rules to `recording.md` | T2 | Structural presence/absence checks + **MANDATORY-MANUAL** `MC-T3` for the authored LP-D8 predicate | executor |
| T4 | Author the five-layer phase-doc contract in `recording.md` (schema/body/provenance) + the D11 cross-phase §7 pass | T3 | Structural token checks + 5 owned VA-07 behavioural trials + authored LP-D23 predicate | executor (record skill) |
| T5 | Wire the four phase-close gates + P4 recap-fold consumption into `SKILL.md`/`topics.md` (FRESH executor) | T4 | Recap/heuristic absence + `phase-results` wiring + resume-anchor integrity | executor (record skill) |
| T6 | Migrate `scenario.md` to full SOP form for 30 families (KEEP WHOLE — manager-adjudicated); two-phase 29→30 cardinality gate | T1,T2,T3,T4,T5 | Phase-A/phase-B executable boundary + `MC-T6` no-sampling manual walk (largest task, effort-banded) | executor (`scenario` skill) |
| T7 | Migrate `checklist.md` to the eval-coverage-register SOP form; all 119 legacy checks preserved | T1,T6 | Phase-A/phase-B boundary + `check_ids` zero-loss proof (pinned `-S{NN}` sibling shape) | executor (`scenario`,`checklist` skills) |
| T8 | Migrate `evaluation.md` adapter; D16 two-contract reconciliation; frozen-set pointers | T6,T7 | Phase-A/phase-B boundary + pre-existing-token audit | executor (`evaluation` skill) |
| T9 | Verify losslessness + conformance + the two-way lock→destination trace across all six files (FRESH executor) | T5,T6,T7,T8 | Non-sample-based `MC-T9` (8 workstreams) + landing diff off pinned `EXEC_BASE` + directory-membership six-file lock | executor (`scenario`,`checklist`,`evaluation`,`skill-writing` skills) |

## Dependency graph

Single topological order (verified: the `requires:` graph has exactly one ready-task at every step):
`T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9`. Conflict flags (file-overlap, sequential-only):
T2/T3/T5 share `topics.md`+`SKILL.md`; T3/T4 share `recording.md`; T6→T7→T8 form a bundle chain
(`scenario.md`→`checklist.md`→`evaluation.md`). Full table: `3-planning/outputs/plan.md` § Dependency table.

## Verification strategy summary

Every task carries a runnable `verifies:` command block (structural facts only — a required path/field/ID
exists, an ID set matches exactly, a guard exits 0) PLUS a manual `MC-Tn` self-failing predicate that is the
sole acceptance authority for every semantic property (SOP conformance, LP-D8, LP-D23, D11, VA-07, VA-09,
STRUCT-F1) — **no shell block claims to prove semantic union or SOP conformance by token presence**. The user
decided to keep this verification manual (no automated conformance/semantic guard is built in this plan). Every
changed command block was re-executed this session against both a compliant and a deliberately-bad fixture
before adoption (`3-planning/outputs/plan.md` § Command-block verification record). Landing is atomic at the
branch/PR level, not per task commit (`idea.md:74` locks the six-file edit as one synchronized unit); each task
commit is a branch-internal, non-independently-landable checkpoint.

## Open issues

Findings that survived to PASS without blocking the plan (full per-finding evidence staged individually at
`3-planning/staging/{decisions,checklists}/`; narrative summary at `3-planning/outputs/resolution-log.md`):

- **`pacing-regex-residual-formulation-gaps`** (staged decision, Low/50, `assumption_risk`, open) — the T9
  widened pacing candidate regex is necessary-not-sufficient by design; several plausible pacing formulations
  reach only `MC-T9`'s manual concept/synonym sweep, not the mechanical gate. Execution should read this
  decision before treating a clean T9 regex run as complete pacing-removal proof.
- **`prep-deferred-constraints-wired-into-plan`** (staged decision) — re-affirms that the two Preparation
  carry-forward constraints (COD-PROJ-001-ITER3's D2/D3 phase-doc predicate = **LP-D23**, and its D8
  probe-wiring predicate = **LP-D8**) plus the STRUCT-F1 carry-forward guard are now authored as literal,
  task-local acceptance predicates in T4, T3, and T4/T5/T9 respectively — closed at Planning, not deferred
  further into Execution.
- **Degraded-mode provisional status** — both the iter2 and iter3 evaluation rounds ran single-system (Codex
  waived by the user 2026-07-18). Per `verification/single-evaluator-pass-is-provisional`, this PASS carries a
  degraded-mode discount; see `3-planning/outputs/resolution-log.md` § Degraded-mode status for the named
  single-evaluator blind spots (own-instrument-error risk, semantic-fidelity close-reading, the counterfactual
  T6/T9 decomposition, execution-time behaviour, and the `MC-Tn` predicates' discriminating power).

## Related

- [[startup-skill-improvement]] — the Idea this plan decomposes (feature: install-runtime)
- [[pacing-regex-residual-formulation-gaps]] — the one open forward-looking finding this plan carries into Execution
- [[prep-deferred-constraints-wired-into-plan]] — the Preparation carry-forward constraints this plan resolves
