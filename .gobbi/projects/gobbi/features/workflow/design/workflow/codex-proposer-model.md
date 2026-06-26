---
name: codex-proposer-model
description: Locked design for the Codex-as-independent-proposer model (D1-D9): parallel generation, producer selective integration, freeze boundary, large-gap adjudication.
type: design
scope: feature
feature: workflow
status: active
created: 2026-06-26
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [design, codex, process, evaluation]
keywords: [dual-system-production, proposer, selective-integration, large-gap, freeze-boundary, integration-log]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Codex as Independent Proposer — Locked Design (D1–D9)

## Problem

Gobbi's dual-system anti-groupthink discipline applies only at EVALUATION (review), never at PRODUCTION (WORK). Every WORK sub-phase has one Claude author, so the canonical artifact carries a single model family's framing bias. The evaluator reviews an already-committed single-author frame and cannot inject a competing production hypothesis at creation.

## Scope

**In-scope:** Extend Codex from evaluation-only to an independent proposer at all 5 productive WORK sub-phases (Ideation, Preparation, Planning, Execution, Wrap-up). Feature: `workflow`.

**Out-of-scope:** Native-Codex-runtime symmetry (deferred, project backlog `native-codex-proposer-symmetry`). No change to the existing dual-system EVALUATION mechanism.

## Approach

The design is a **generate-then-SELECT pipeline**. The quality of the selective-integration step is the dominant lever, not the mere presence of a second proposer (arXiv 2603.20324: diverse + judge-based selection = 0.810 vs homogeneous = 0.512; synthesis loses to a single-model baseline >80%).

### D1 — Proposer mechanism and topology
Reuse the assistant-wrapper `codex exec` pattern from the existing evaluation model. The Claude producer and the Codex proposer generate **independently in parallel** — neither sees the other at generation time. Codex writes its proposal to `{N}-{loop}/working/proposals/codex/draft-iter{n}.md` (Execution: `task-{NN}-{slug}/working/proposals/codex/draft-iter{n}.md`). Codex never writes the canonical `working/draft-iter{n}.md`.

### D2 — Integration procedure and Integration Log contract (producer-default)
The **Claude producer** is the default integrator. After the proposal is frozen (D9), the producer performs **principle-based selective integration**: enumerate substantive deltas; fold in the Codex element where it better satisfies the 10 principles + Scope Contract + memory/mistakes; keep its own where stronger; never naive-blend. The producer records the **Integration Log** at `{N}-{loop}/working/reconciliation-iter{n}.md` (Execution: `task-{NN}-{slug}/working/reconciliation-iter{n}.md`), staged to `staging/decisions/{slug}.md` for Wrap-up promotion. Log schema (one row per delta): `delta` · `decision` (`took-codex` | `kept-own` | `merged-selective` | `escalated`) · `why` (principle # or Scope Contract clause) · `codex_origin` (boolean). Every row cites a deciding principle or clause — that citation is the auditable selector-quality record (D8).

### D3 — Gap classification and escalation threshold
**LARGE gap** (producer surfaces → manager adjudicates → user-escalation card): any delta that is (a) an Always-Ask category (Design / Scope / Destructive); (b) mutually exclusive at the artifact's core (a fork); or (c) principle equipoise. LARGE = safety-gate; interrupts both Auto and Chat modes.

**SMALL gap** (producer integrates + logs, no interrupt): additive/refinement, stylistic, or clearly principle-decided. In Chat mode only, the manager may surface the Integration Log at the existing finding-discussion gate.

### D4 — Production-vs-evaluation independence
Three structural facts preserve independence: (1) the Codex proposer and Codex evaluator are **independent `codex exec` processes** — no shared context; (2) the evaluator reviews the **Claude-authored canonical** artifact, not the proposal; (3) **the Codex proposal transcript never enters the Codex evaluator prompt**. The cross-family independence control for integrated content is the **independent dual EVALUATION** itself — two systems review every canonical artifact every loop before RECORD. No origin-aware verdict weighting is added. The "manager weighs with awareness" mitigation from iter1 is removed — it was non-operational (it implies an out-of-scope eval-mechanism change). The structural tier guard is staged as feature backlog `proposer-evaluator-model-tier-guard`.

### D5 — Per-step instantiation
| Step | Producer | Proposal path | Integration character |
|---|---|---|---|
| Ideation | leader | `1-ideation/working/proposals/codex/draft-iter{n}.md` | fork-prone; large gaps common |
| Preparation | leader | `2-preparation/working/proposals/codex/draft-iter{n}.md` | additive; small gaps common |
| Planning | leader | `3-planning/working/proposals/codex/draft-iter{n}.md` | fork-prone |
| Execution | executor | `4-execution/task-{NN}-{slug}/working/proposals/codex/draft-iter{n}.md` | per-task; default-ON |
| Wrap-up | assistant | `5-wrap-up/working/proposals/codex/draft-iter{n}.md` | Always-Ask-adjacent |

### D6 — Configuration, cost control, and degraded-mode label
Per-step `workflow.{loop}.propose.mode: "dual" | "single"` + global master switch, stored in `settings.auto.json` + `settings.chat.json` (echoed to `state.template.json` / `session.template.json`). Default-ON ("dual") for all five steps; per-step toggleable. Cost magnitude: ~1 extra `codex exec` per enabled WORK sub-phase per iteration (Execution multiplies by task count). Single round only; `timeout ≥ 1200s`; structural output validation (not vocab-grep).

**Degraded-mode label contract:** on empty/timeout, Codex wrapper reports BLOCKED; producer proceeds Claude-only and stamps `production_mode: claude-only` + `codex_proposal_absent_reason: <timeout|empty|error>` in the canonical artifact frontmatter. RECORD preserves this into the loop `outputs/` frontmatter. A missing Codex *proposer* is NOT a safety-gate stop (contrast: a missing Codex *evaluator* IS a safety gate).

### D7 — Doc CRUD plan (summary)
32 files across: `codex/SKILL.md` (new §); `orchestration/workflow/production.md` (new); 5 per-step `orchestration/workflow/{loop}.md`; 5 loop skills; `orchestration/SKILL.md`; `auto-mode.md`; `chat-mode.md`; `delegation/SKILL.md` + 3 templates; `evaluation/SKILL.md` (independence note only); 4 agent docs; `.claude/CLAUDE.md`; `gobbi/SKILL.md`; 2 settings templates; 2 state templates; `scaffold-session-dir.sh` + `record-map.md`. Drift-gated pair: `verify-record-map.sh --check` + `check-markdown-links.sh` + `check-residual-vocab.sh` green after edits.

### D8 — Integration is SELECT-not-SYNTHESIZE
Integration is a **SELECTION** — fold in the principle-better element; keep own where stronger. Never naive-blend; never a third aggregator agent. The producer is the default selector; the manager adjudicates only large gaps. Selector quality is audited via the Integration Log's per-delta principle citation (D2). Evidence anchor: arXiv 2603.20324 (Selection Bottleneck) + internal precedent `orchestration/workflow/evaluation.md` § Aggregation rule ("never average").

### D9 — WORK two-phase freeze boundary
Derived from `mistakes/verification/freeze-producer-artifact-before-evaluating.md`. The WORK phase has an explicit two-phase freeze:
1. **PRE-INTEGRATION:** both the producer's first draft and the Codex proposal are pinned/frozen before the producer begins integration.
2. **Integration:** producer selectively integrates (D2).
3. **POST-INTEGRATION:** canonical artifact frozen before EVALUATION evaluators spawn.

Documented in `orchestration/workflow/production.md` + each of the 5 loop skills' WORK phases.

## Scenarios

Key scenarios this design handles: golden path (parallel generation → freeze → integration → EVALUATION); large-gap fork (mutually exclusive decompositions → user escalation); additive union (Codex surfaces a readiness gap, leader adopts superset); empty/timeout degraded mode (BLOCKED-on-empty → Claude-only labeled fallback); freeze race (D9 prevents moving-target in both directions). Full scenario set in the ideation briefing.

## Validation

Per D1–D9, each decision has an explicit validation method: structural (transcript/author check for D1), doc review (Integration Log format for D2), scenario test (fork vs additive integration for D3), grep (no proposal transcript in evaluator prompt for D4), doc review of each loop WORK phase (D5), config test (propose key + degraded-mode label for D6), drift gate (D7), doc review (D8), doc review of WORK phase state machine (D9).

## Trade-offs

- Gains: second independent frame at creation; cross-family divergence surfaced at the highest-leverage point; reuses proven `codex exec` wrapper mechanics; SELECT-not-synthesize anchored to arXiv evidence.
- Costs: ~1 extra `codex exec` per enabled WORK sub-phase per iteration (user-accepted, per-step toggleable); producer self-preference is bounded but not eliminated (residual touches only Codex-origin sections; dual EVALUATION is the in-loop check).

## Open issues

Two sub-threshold items carried forward from Ideation to Planning, both now RESOLVED in-session:
- Success Criteria #1 path wording — the Execution per-task variant is carried in `execution/SKILL.md`; see `decisions/workflow/2026-06-25-success-criteria-proposal-path-wording.md` (resolved).
- D7 record-map CRUD row — `working/reconciliation-iter{n}.md` is now enumerated in `record/record-map.md`; see `decisions/workflow/2026-06-25-integration-log-missing-from-record-map-row.md` (resolved).
