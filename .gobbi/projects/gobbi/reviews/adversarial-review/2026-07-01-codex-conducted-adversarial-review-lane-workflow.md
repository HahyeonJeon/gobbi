---
name: codex-conducted-adversarial-review-lane-workflow
description: Lane A review for D1 end-to-end workflow correctness
type: reviews
scope: project
feature: null
status: active
created: 2026-07-01
session: 019f1ef9-a676-7f12-8d78-922f12cb64e9
tags: [evaluation, process, verification]
keywords: [d1, workflow, lifecycle, state, record, codex-conducted]
author: codex
review_kind: adversarial-review
subject: "Gobbi general surface — D1 end-to-end workflow correctness"
verdict: needs-attention
---

# Lane A — D1 End-To-End Workflow Correctness

This lane reviews Configuration -> Ideation -> Preparation -> Planning -> Execution -> Wrap-up.

## Method

Lane A reviewed Configuration -> Ideation -> Preparation -> Planning -> Execution -> Wrap-up,
with emphasis on loop transitions, output/input contracts, state/session/memory boundaries,
PASS/REVISE/FAIL paths, artifact freeze points, and failure recovery.

The lane deduped against the previous `2026-06-29-*` review corpus and did not re-file known
workflow findings unless current evidence showed a distinct variant.

Commands and checks used included:

- required load reads for `AGENTS.md`, evaluator role prompt, principles, mistake, evaluation,
  research, coding, codex, and this charter
- targeted `nl -ba` reads of `.agents/skills/orchestration/{SKILL.md,auto-mode.md,chat-mode.md,workflow/*.md,templates/*.json}`
- targeted reads of `.agents/skills/{record,wrap-up,preparation,evaluation}/SKILL.md`
- `rg -n` dedup checks against `.gobbi/projects/gobbi/reviews/adversarial-review/2026-06-29-*.md`
- `git rev-parse --show-toplevel`, `git branch --show-current`, `git rev-parse HEAD`, and `git status --short`

## Findings

### GEN-D1-001: Preparation `RE-IDEATE` is a transition the evaluator/session-state contract cannot emit
- Type: design_flaw
- Domain: process
- Severity: High
- Confidence: 100
- Priority: high
- Disposition: open
- Runner: codex
- Dimension: D1
- Owner-surface: workflow
- Location: `.agents/skills/orchestration/workflow/preparation.md:51`; `.agents/skills/orchestration/workflow/preparation.md:110`; `.agents/skills/orchestration/workflow/evaluation.md:5`; `.agents/skills/orchestration/workflow/evaluation.md:149`; `.agents/skills/preparation/SKILL.md:311`; `.agents/skills/orchestration/SKILL.md:263`; `.agents/skills/orchestration/templates/state.template.json:5`
- Expected: If Preparation can re-enter Ideation after evaluation/ITER, that transition is represented in the same verdict/state vocabulary used by evaluators, manager aggregation, RECORD, and `state.json` / `session.json`; otherwise it is modeled only as a pre-evaluation user decision.
- Observed: Preparation says re-Ideate halts Preparation and is not a Preparation `REVISE`, then lists `RE-IDEATE` as a special ITER/EXIT verdict. Auto mode also says a `RE-IDEATE` verdict re-enters Ideation. The manager evaluation contract emits only `PASS` / `REVISE` / `FAIL`; Preparation's skill records only those three; orchestration aggregation lists only those three; `state.template.json` has no `RE-IDEATE` enum.
- Evidence: `rg -n "RE-IDEATE|re-Ideate" .gobbi/projects/gobbi/reviews/adversarial-review/2026-06-29-*.md` found no prior review duplicate; targeted `nl -ba` traces show `RE-IDEATE` present in Preparation/Auto transition prose but absent from evaluation aggregation and state/session field references.
- False-positive check: none. This is an enum/transition mismatch, not a wording preference. The pre-evaluation discussion path exists, but the separate row-5 verdict path is not representable.
- Proposed remediation: Choose one model: either keep re-Ideate strictly as a Preparation DISCUSSION user decision before WORK/EVALUATION, or add a formal `RE-IDEATE` transition/status to evaluation aggregation, RECORD, state/session templates, and resume logic.
- Verification: A future pass traces every Preparation re-Ideate path from DISCUSSION or EVALUATION through RECORD and state/session persistence with no out-of-band enum.
- Second-pass: validated by Godel (`019f1f2d-20a4-71f0-a5e5-0ef5512dd3dc`). Severity remains High.

### GEN-D1-002: Manager-side finding routing table contradicts canonical Type+Domain routing
- Type: design_flaw
- Domain: docs-sync
- Severity: High
- Confidence: 100
- Priority: high
- Disposition: open
- Runner: codex
- Dimension: D1
- Owner-surface: workflow
- Location: `.agents/skills/orchestration/workflow/evaluation.md:165`; `.agents/skills/evaluation/SKILL.md:363`
- Expected: The manager-facing EVALUATION workflow should point to the canonical evaluator/RECORD routing contract or restate it completely so PASS-iter staging receives the right destinations.
- Observed: `.agents/skills/orchestration/workflow/evaluation.md:165-178` gives a narrowed type-only table: `general` routes only when it has a citable external pattern to `staging/references/`, and `design_flaw` / `assumption_risk` always go to decisions. The canonical table at `.agents/skills/evaluation/SKILL.md:363-390` routes Type=`general` by Domain across decisions, checklists, references, process mistake-candidates, and an error for `general/general`. RECORD says it applies the canonical Type+Domain table with no shortcut routing.
- Evidence: Prior review D5-012 covers stale routing duplicated inside `ideation/SKILL.md`, not this manager-facing `workflow/evaluation.md` table. `rg -n "Routing Findings to RECORD|general with citable|Complete Domain|Type \\+ Domain|D5-012" .gobbi/projects/gobbi/reviews/adversarial-review/2026-06-29-*.md` confirms the prior location/class but not this runtime manager surface.
- False-positive check: pre-existing checked; this is a new variant because the manager orchestration doc is a different handoff surface that feeds RECORD.
- Proposed remediation: Replace the local table in `workflow/evaluation.md` with a pointer to `evaluation/SKILL.md` + `record/SKILL.md`, or restate the full Type+Domain table exactly once from the canonical source.
- Verification: A future pass can diff all manager/evaluator/record routing prose and show there is one complete routing source, with no `general with citable external pattern` shortcut.
- Second-pass: validated by Godel (`019f1f2d-20a4-71f0-a5e5-0ef5512dd3dc`). Severity remains High.

### GEN-D1-003: Chat narrowed RECORD defers staging to Wrap-up, but Wrap-up forbids the deferred sources
- Type: design_flaw
- Domain: process
- Severity: High
- Confidence: 75
- Priority: high
- Disposition: open
- Runner: codex
- Dimension: D1
- Owner-surface: workflow
- Location: `.agents/skills/orchestration/chat-mode.md:246`; `.agents/skills/wrap-up/SKILL.md:71`
- Expected: If Chat Mode skips per-slice typed-finding staging, Wrap-up must have an explicit, executable reconstruction step that reads the deferred sources and materializes promotable staging or memory entries.
- Observed: Chat Mode says PASS RECORD skips typed-finding staging, then says Wrap-up must mine transcript, task records, and per-loop evaluation files. It also says Wrap-up RECORD reads task records and transcript. Wrap-up's promotion-inventory rule inventories `staging/` only and never promotes from `transcripts/`, `working/`, `evaluation/`, or `outputs`. Its WORK inputs use prior evaluation outputs for closure audit only; Step 2 enumerates staging only; Step 2.5 can auto-backfill malformed staging but treats absent/empty staging as `NEEDS_CONTEXT`, not transcript/evaluation reconstruction.
- Evidence: `rg -n "Chat|task-record|transcript|reconstruct|narrowed|evaluation files|mine" .agents/skills/wrap-up/SKILL.md .agents/skills/orchestration/chat-mode.md` shows reconstruction promised in Chat docs, while Wrap-up only references transcript preservation and staging-only promotion. Prior `2026-06-29` searches for `Chat narrowed|task-record` returned no duplicate.
- False-positive check: none; this changes whether Chat-mode findings reach durable memory.
- Proposed remediation: Add a Chat-specific Wrap-up WORK sub-step that reconstructs typed findings into a staging-compatible inventory before promotion, or remove the deferred-staging model and run base RECORD staging per slice.
- Verification: A future Chat-mode dry run with one evaluation finding should produce either a per-slice staging file or a Wrap-up-generated staging/promotion-manifest entry sourced from the task record/evaluation file.
- Second-pass: validated by Godel (`019f1f2d-20a4-71f0-a5e5-0ef5512dd3dc`). Severity remains High.

### GEN-D1-004: Execution iteration history has incompatible idempotency keys
- Type: design_flaw
- Domain: process
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D1
- Owner-surface: workflow
- Location: `.agents/skills/orchestration/workflow/execution.md:91`; `.agents/skills/record/SKILL.md:192`; `.agents/skills/record/SKILL.md:275`
- Expected: Execution's per-task iteration history should have one schema and one idempotency key across execution workflow docs, RECORD procedure, field reference, and templates.
- Observed: Execution says per-task iteration boundaries live at `session.json.workflow.execution.iterations[]` keyed by `{task-id, iter}`. RECORD says all loops upsert `workflow.{loop}.iterations[]` keyed only by `iter`; execution-specific per-task data is separately keyed by `taskNo` in `workflow.execution.integration.tasks[]`. The field reference documents `workflow.execution.integration.tasks[]` but not the `{task-id, iter}` key for execution iterations.
- Evidence: Prior D1-009 covers the broader missing `iterations[]` array in the template; this is a new variant because the current conflict is not just missing seed fields, but contradictory idempotency keys for multiple Execution tasks.
- False-positive check: pre-existing checked; same schema family as D1-009, distinct trigger/runtime effect.
- Proposed remediation: Define Execution iterations either as a task-scoped array keyed by `{taskNo|slug, iter}` everywhere, or keep generic `iterations[]` keyed by loop-level `iter` and store task-specific history only under a documented `tasks[]` subrecord.
- Verification: A future session with two Execution tasks both on iter 1 can re-run RECORD and preserve both histories without overwrite or duplicate entries.

## Existing Findings Not Re-Filed

- Existing: Ideation PASS handoff skips Preparation in one doc. Prior finding: `2026-06-29-gobbi-adversarial-review.md` D1-003.
- Existing: `session.template.json` omits generic `iterations[]`. Prior finding: `2026-06-29-gobbi-adversarial-review.md` D1-009.
- Existing: Preparation `outputs/` has no documented Planning consumer in workflow docs. Prior finding: `2026-06-29-gobbi-adversarial-review.md` D1-013.
- Existing: evaluation mandatory/optional/skip policy drift. Prior finding: `2026-06-29-gobbi-adversarial-review-d4.md` D4-001.
- Existing/new-variant boundary: stale finding-routing duplication in `ideation/SKILL.md` is already D5-012; GEN-D1-002 is the separate manager workflow/evaluation surface.
