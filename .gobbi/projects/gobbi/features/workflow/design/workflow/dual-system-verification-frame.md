---
name: dual-system-verification-frame
description: "Defines the independent-draft, reciprocal-cross-review, synthesis, and fresh dual-evaluation evidence frame for every productive step."
type: design
scope: feature
feature: workflow
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [codex, evaluation, verification]
keywords: [verification-frame, dual-system, independent-drafts, cross-review, synthesis, evaluation]
author: claude
related: [codex-proposer-model]
---
# Dual-system work and evaluation frame

## Problem

A second system improves quality only when both systems contribute independently, see each other's work at controlled boundaries, and receive fresh adversarial evaluation. Shared framing or silent fallback can preserve the appearance of rigor while removing its benefit.

## Scope

This frame applies to every productive step and every full revision iteration. It covers independent creation, reciprocal review, synthesis, fresh evaluation, failures, and exact waivers.

## Work protocol

1. Claude and Codex receive the same neutral contract and independently author system-labeled drafts.
2. Both drafts are frozen and validated before either system sees the other.
3. Claude reviews the frozen Codex draft, and Codex reviews the frozen Claude draft.
4. The active runtime's step specialist synthesizes the canonical candidate from both drafts and both cross-reviews.
5. Material conflicts are recorded as open decisions and paused for the user.
6. Every decision is resolved and the complete package validates before evaluation.

The opposite-system process is new, ephemeral, read-only, and schema-bound for each operation. It receives complete inputs and never writes the session tree.

## Evaluation protocol

Two fresh evaluators independently inspect the canonical synthesis, both drafts, both cross-reviews, resolved decisions, and relevant scope and verification evidence. Each evaluator covers all seven perspectives plus Overall, emits a complete finding ledger and checklist, and returns PASS, REVISE, or FAIL.

The aggregate uses the most severe verdict. Findings retain both systems' provenance after deduplication. No finding is applied until the user approves or edits the complete disposition batch. Any material revision repeats the entire dual-system work protocol and receives two new complete evaluations.

## Failure and waiver

A missing, timed-out, empty, malformed, mislabeled, or unavailable system halts the iteration and surfaces the exact failure. A waiver is valid only when the user explicitly names the missing system, step, and iteration. It is recorded as a material decision and linked from the final outcome. Silent single-system fallback is impossible.

## Quality invariant

Token cost may inform a user-requested settings change, but it never narrows dual-system Ideation, independent creation, reciprocal review, or evaluation coverage. Quality and independence are workflow invariants.

## Validation

Package validators prove draft freeze ordering, reciprocal authorship, active-runtime synthesis, resolved decisions, fresh evaluator identities, complete perspectives, verdict aggregation, finding provenance, disposition approval, and exact waiver scope in both runtime directions.

## Trade-offs

The protocol spends more time than a single-system pass. That cost buys distinct reasoning paths, explicit conflict handling, and repeatable review evidence rather than unlabelled consensus.
