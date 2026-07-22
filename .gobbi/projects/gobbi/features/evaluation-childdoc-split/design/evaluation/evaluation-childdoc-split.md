---
name: evaluation-childdoc-split
description: Split each workflow loop skill's evaluation.md into 3 sibling child docs, certified complete by a class-predicate build-time gate
type: design
scope: feature
feature: evaluation-childdoc-split
status: active
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation, design]
keywords: [scenario-md, checklist-md, class-predicate, completeness-gate, three-way-split]
author: claude
related: [eval-childdoc-cotouch-inventory]
---
# Dual-system evaluation record design

## Problem

The earlier evaluation output shape split each review across perspective child files. The current workflow needs one independently authored, complete, and directly validatable report from each system.

## Scope

This record defines the surviving evaluation evidence shape for every productive step and every materially revised canonical artifact. Creation mechanics remain owned by dual-system WORK; finding disposition remains a user decision.

## Approach

Each evaluation iteration contains exactly two independent system reports: `claude.md` and `codex.md`. Each report covers Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall exactly once.

Every report also contains one `VERDICT: PASS | REVISE | FAIL`, the complete finding ledger, and the completed evaluation checklist. Evaluators are fresh, receive the full creation and verification evidence, and never receive the other evaluator's report before finishing.

The aggregate uses the more severe verdict. PASS requires two PASS reports unless the user approved an exact missing-system waiver for this step and iteration. A material revision requires two new complete reports.

## Validation

The evaluation-report validator rejects a missing or duplicate perspective, missing Overall, malformed verdict or finding ledger, incomplete checklist, reused evaluator identity, wrong system, or stale iteration. Aggregation fixtures cover every verdict pair and preserve both systems' provenance after deduplication.

## Trade-offs

Two complete reports repeat some context, but the duplication preserves independent scrutiny and makes each system's reasoning auditable without reconstructing a directory of partial files.

## Related

- [[dual-system-verification-frame]] — the creation and review independence frame.
