---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
loop: planning
feature: session-foundations-bundle-b
topic: Codex iter2 blocked — wrapper relative-path failure; re-dispatch with strict brief
outcome: Re-dispatched with absolute paths + marker verification; Codex iter2 PASS produced on retry
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

The retry produced the correct Codex iter2 PASS. The false-PASS incident is staged as a mistake-candidate for Wrap-up promotion (see `planning/staging/decisions/codex-wrapper-relative-path-wrong-session-write.md`).

## Related

- planning/staging/decisions/codex-wrapper-relative-path-wrong-session-write.md
- planning/evaluation/iter2/codex/ (correct output from retry)
