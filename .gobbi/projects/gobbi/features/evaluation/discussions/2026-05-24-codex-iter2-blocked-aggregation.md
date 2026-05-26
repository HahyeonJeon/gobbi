---
name: codex-iter2-blocked-aggregation
description: Codex Planning evaluator false-passed due to relative paths resolving to a prior session directory — re-dispatched with absolute paths and marker verification.
type: discussions
scope: feature
feature: evaluation
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [codex, evaluation, relative-paths, re-dispatch]
---

# Codex iter2 evaluation blocked — re-dispatched with strict brief

## Context

The Codex evaluator for Planning iter2 was first dispatched with a wrapper that used relative ellipsis paths (`sessions/.../planning/...`). Codex's sandbox resolved these against a prior-session directory (`2026-05-23-7ea62d36-...`). The evaluator wrote to the wrong session directory and validated against stale files, reporting a false PASS.

The Claude evaluator independently verified Codex's claimed empirical checks and found them referencing artifacts from the prior session — not the current iter2 draft.

## Question

How should the Codex evaluator be re-dispatched to ensure it operates on the correct session directory?

## Options considered

1. **Re-dispatch with absolute paths + marker verification** — wrapper specifies every path as absolute; includes `.wrapper-marker` file write before invocation; instructs Codex to verify marker and write `.codex-marker` as first action; validate-step checks marker exists after completion.
2. **Accept the false PASS from iter1 Codex baseline** — use Claude evaluator results only for iter2; Codex is optional.

## User decision

Re-dispatch with absolute paths + marker verification. Codex iter2 PASS required for dual-system aggregate PASS.

## Implication

The retry produced the correct Codex Planning iter2 PASS. The false-PASS incident was promoted as a mistake to project memory.
