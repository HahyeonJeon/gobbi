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

# Codex evaluation blocked by stale-session paths — re-dispatched with strict brief

## Context

During the Planning loop's second evaluation iteration, the Codex evaluator was first dispatched with a wrapper that used relative ellipsis paths (`sessions/.../planning/...`). Codex's sandbox resolved those relative paths against a prior session's directory (`2026-05-23-7ea62d36-...`) rather than the current one. The evaluator wrote to the wrong session directory and validated against stale files, reporting a false PASS.

The Claude evaluator independently re-ran Codex's claimed empirical checks and found they referenced artifacts from the prior session, not the current draft under evaluation — exposing the false PASS.

## Question

How should the Codex evaluator be re-dispatched so it provably operates on the correct (current) session directory?

## Options considered

1. **Re-dispatch with absolute paths + marker verification** — the wrapper specifies every path as absolute, writes a `.wrapper-marker` file before invocation, instructs Codex to verify that marker and write a `.codex-marker` file as its first action, and the validate step checks the marker exists after completion.
2. **Accept the false PASS and proceed Claude-only** — use the Claude evaluator's results for this iteration and treat Codex as optional.

## User decision

Re-dispatch with absolute paths + marker verification. A genuine Codex PASS was required for the dual-system aggregate to PASS — a Claude-only result was not accepted.

## Implication

The retry produced a correct Codex Planning PASS against the right session directory. The false-PASS incident — relative paths resolving to a stale session under Codex's sandbox — was promoted to project memory as a mistake so the relative-path trap is not repeated.

## Related

- [`mistakes/codex-eval-session-write-path-nested-in-worktree.md`](../../../mistakes/codex-eval-session-write-path-nested-in-worktree.md) — the promoted mistake about Codex session-write paths.
- [`decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md`](../decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md) — the assistant-wrapper topology that hardens Codex dispatch with absolute paths and file validation.
