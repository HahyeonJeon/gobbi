---
name: dual-system-plan-integration
description: Planning iter1's Claude producer selectively integrated 8 of 10 Codex-proposal deltas into the canonical evaluation-childdoc-split plan
type: decisions
scope: feature
feature: evaluation-childdoc-split
status: accepted
created: 2026-07-08
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [process, design]
keywords: [dual-system, production, codex-proposer, selective-integration, atomic-flip]
author: claude
supersedes: null
superseded_by: null
---

# Integrate the Codex Planning proposal selectively, not by blend

## Context

Planning ran under `propose.mode: dual` for iter1: the Claude producer wrote its own 20-task plan (`draft-iter1.own.md`) and a Codex proposer independently wrote an 8-task plan (`proposals/codex/draft-iter1.md`) for the same locked Ideation design, without seeing each other. The Claude producer then had to reconcile the two into one canonical `draft-iter1.md` — never a blend, always a selection per row.

## Decision

The producer resolved 10 substantive deltas between the two plans. It took Codex's element on 4 deltas (`took-codex`), merged the two element's best parts on 4 deltas (`merged-selective`), and kept its own element on 2 deltas (`kept-own`). No delta was escalated to the user — both plans converged on the same wave backbone (guard-first → execution-prototype → other-4-bundles → atomic-flip-last), so every divergence resolved to one selected element.

## Rationale

- **Took Codex (4 of 10):** Point-3 prototype-safe split (shared docs land in Wave 1 without a hard-require, avoiding mid-rollout frame-collapse on un-split loops); the atomic-flip-as-one-unit shape (never split the parent flip from its Family-9 co-touch); the flip file set as the guard `--classify-only` output (not a hand-list, so scope expansion surfaces instead of silently landing); the concrete guard-flag names (`--self-test`/`--classify-only`/`--bundle {loop} --pre-flip`/`--enforce-inclusion`).
- **Merged-selective (4 of 10):** guard modes (kept the producer's two-mode CONCEPT, adopted Codex's concrete flags); required-skills/mistakes floor (merged Codex's broader default floor with the producer's `skills/git/mistakes.md#executor-wrote-to-main-tree-not-worktree` mistake, which Codex's list omitted and which is CRITICAL for this self-referential-repo feature); per-bundle wire+verify (kept the producer's per-bundle sync discipline, folded into each split task's `verifies` rather than separate tasks); cut-line (reconciled to tasks 01-05, adopting Codex's explicit "stop after task 02 if over budget" fallback).
- **Kept own (2 of 10):** the labor-core granularity (the execution prototype stays a 3-task sequence — scenario/checklist/trim — so the highest-risk authored content, the ~7-14-block no-filler scenario writing, gets its own review-able commit; Codex's 1-task version was leaner but coarser); the DO-NOT-MERGE-mid-way hazard (kept prominent — Codex's plan covered iteration-snapshot discipline but not this specific worktree-incoherence risk).

## Alternatives considered

- **Producer-only (single-mode), skipping the Codex proposal entirely.** Rejected — dual-system production is not optional per `codex/mistakes.md#dual-system-production-is-not-optional`; the anti-groupthink signal from an independent Codex plan is exactly what caught the atomicity-shape and guard-flag improvements adopted here.
- **Blend the two plans line-by-line.** Rejected — selective integration selects the stronger element per delta; a line-by-line blend would have produced an incoherent hybrid (e.g., mixing the producer's 20-task granularity with Codex's 8-task atomicity without a clean seam).

## Consequences

The canonical `draft-iter1.md` (10 tasks) is genuinely stronger than either input plan: it has the producer's labor-core granularity AND Codex's atomicity discipline AND the certified-file-list guard mechanism. iter2 (this session's final plan) is a single-mode focused revision of this canonical draft — no new Codex proposal ran at iter2, but the dual-integrated backbone from iter1 is unchanged and both iter2 evaluators (Claude + Codex) confirmed no regression to it.

## Related

- [[execution-bundle-source-before-trim]] — a defect in the iter1 canonical draft that iter2 fixed
- [[verifies-must-be-self-failing]] — a second defect in the iter1 canonical draft that iter2 fixed
