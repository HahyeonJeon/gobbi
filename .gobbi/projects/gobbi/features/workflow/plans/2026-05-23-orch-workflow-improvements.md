---
name: orch-workflow-improvements
description: Execution plan for the gobbi-orchestration-workflow-improvements bundle — 7 tasks repairing codex invocation, memorization capture, wrap-up compliance, and naming conventions.
type: plans
scope: feature
feature: workflow
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [planning, execution-plan, bundle-a, orchestration]
title: "gobbi-orchestration-workflow-improvements — Execution plan"
verdict: PASS
artifact_ref: /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/artifacts/plan.md
---

# Execution Plan — gobbi-orchestration-workflow-improvements

## Idea anchor

Repair four discipline gaps in gobbi orchestration/workflow — the codex-invocation anchor, the memorization moment-of-capture, the wrap-up compliance check, and naming-convention enforcement — plus two gobbi entry-skill polish items. The design topics this plan implements are now homed in `design/drop-legacy-setup-questions.md`, `design/glossary-placement.md`, and `design/wrap-up-step-2-5-compliance-check.md`.

## Scope Contract reference

The locked Scope Contract is the seven Bundle A items selected at Ideation; see `discussions/scope-bundle-selection.md`.

## Sub-tasks

| ID | What | Agent | Branch |
|---|---|---|---|
| 01-gobbi-polish-fg | Rewrite gobbi/SKILL.md § Step 4 (1-question mode) + move Glossary | executor | feat/gobbi-skill-polish-fg |
| 02-memorization-moment-of-capture | Add memorization Core Principle + mistake P2 reciprocal link | executor | feat/memorization-moment-of-capture |
| 03-delegation-memorization-hard-gate | Add delegation Core Principle + Load Directives row + 3 per-role templates | executor | feat/delegation-memorization-hard-gate |
| 04-wrap-up-step-2-5 | Insert Step 2.5 H3 in wrap-up/SKILL.md (4-category gap table + 5-Type classification) | executor | feat/wrap-up-step-2-5-compliance |
| 05-coverage-ownership-naming-row | Add Coverage Ownership Matrix row + memorization Path conventions H3 | executor | feat/coverage-ownership-naming-row |
| 06-codex-skill-content | Fill 8 H2 sections of codex/SKILL.md + gobbi Skill Map row | executor | feat/codex-skill-content |
| 07-cross-link-sweep | Verify all 10 Cross-Link Manifest entries post-ship | assistant | chore/bundle-a-cross-link-sweep |

## Dependency graph

Effective execution order: `01 → 02 → 03 → 04 → 05 → 06 → 07`. Key edges:

- Task 06 depends on Task 01 (both touch gobbi/SKILL.md).
- Task 03 depends on Task 02 (delegation references the memorization link target).
- Task 05 depends on Task 02 (both touch memorization/SKILL.md — sequential required).
- Task 07 depends on all 6 prior tasks.

## Verification strategy summary

Each task ships its own grep/jq verification; the plan-level gate is Task 07's cross-link sweep, which verifies all 10 Cross-Link Manifest entries post-ship. The full plan is preserved at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/artifacts/plan.md`.

## Open issues

The Planning evaluation closed with PASS. The first evaluation iteration returned REVISE (8 High findings on the coverage-ownership matrix-row wording, relative-path references, the Task 04 brief, and stale `_claude` references); the fix iteration addressed all threshold findings and both evaluation systems returned PASS with 0 Critical/High.
