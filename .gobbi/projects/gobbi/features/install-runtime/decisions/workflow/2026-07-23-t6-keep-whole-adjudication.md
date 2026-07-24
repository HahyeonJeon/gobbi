---
name: t6-keep-whole-adjudication
description: Codex proposed an alternative 8-task re-slice (merging IP-1/IP-2+IP-3/splitting phase-doc grading into its own task); escalated to the manager and adjudicated closed 2026-07-18 -- the 9-task spine with T6 kept whole is preserved
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning]
keywords: [t6-keep-whole, escalated-then-adjudicated, eight-task-reslice, manager-adjudication, dual-system-integration]
author: claude
supersedes: null
superseded_by: null
related: [nine-task-decomposition-strategy]
---

# T6 stays one task (families+cases together); Codex's 8-task re-slice adjudicated closed

## Context

At iter1, Codex's independent 8-task proposal re-grouped the plan differently: merge IP-1 into one task, merge
IP-2+IP-3 source work into one task, and separate the new phase-doc grading into a dedicated post-migration
task. This is a mutually-exclusive alternative to the Claude producer's 9-task spine (with T6 = the whole
`scenario.md` migration — 30 families' sets/families/cases together, kept as one task/commit) — a genuine
LARGE-gap disagreement, not a selectively-integrable delta.

## Decision

Escalated to the manager per the LARGE-gap rule (dual-system production discipline: a mutually-exclusive
structural choice is surfaced, not silently resolved by either producer). **Adjudicated 2026-07-18: the manager
kept the 9-task spine**, T6 stays whole (families-without-cases would be a worse intermediate state; sets →
families → cases is one coherent shape). Codex's verification-benefit argument (separating the new grading so
its cardinality assertions are independently testable) was captured IN-SPINE instead, as T6's two-phase
cardinality gate (assert 29 after legacy migration, then 30 after PROJ-08) — no re-slice needed.

## Rationale

A families-without-cases split would leave T6's own output in an incoherent intermediate state (families
declared, but their cases — the actual scenario content — deferred to a later task) — worse than one large,
internally coherent task. The verification benefit Codex's split would have bought (testing 29 vs 30 separately)
is achievable WITHOUT the split, via a two-phase gate inside the single T6 task; see
[[t1-ledger-gate-cross-task-predicate-fix]] and the phase-A/phase-B pattern used identically in T7 and T8.

## Alternatives considered

- **Codex's 8-task re-slice** (merge IP-1; merge IP-2+IP-3; separate phase-doc grading into its own task) —
  considered and REJECTED by manager adjudication; this is frozen reconciliation history, not reopened at iter2
  or iter3.
- **A middle ground (split T6 by set, not by family)** — not seriously considered; the manager's stated
  rationale (families-without-cases is a worse intermediate state) applies to any split that separates a
  family's definition from its cases.

## Consequences

T6 is EFFORT-BANDED (not re-sliced) instead — see [[t6-t9-effort-banding]] for the checkpoint/continuation
contract that makes T6's size a stated budget rather than a hidden risk. Any future proposal to re-slice T6 must
re-litigate this adjudication explicitly, not silently reopen it as a "cleanup."

## Related

- [[nine-task-decomposition-strategy]] — the overall decomposition this adjudication is a structural sub-decision within
- [[t6-t9-effort-banding]] — the consequence: T6's size is managed by banding, not by re-slicing
