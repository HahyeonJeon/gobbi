---
date: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
loop: planning
iter: 1
finding-id: DOC-STRUCT-1-PERF-1-CodexF1
type: design_flaw
domain: process
severity: High
confidence: 100
disposition: addressed
addressed-in-iter: 2
addressed-how: "P3 (41 docs) split → P3a (20) + P3b (21) along T3/T4 boundary; P5 (44) → P5a (24) + P5b (20) along T6/T7 boundary; P7 (68) → P7a (35) + P7b (33) along T9b/T9c boundary. Each prose sub-task ≤ 35 docs (the inherited context ceiling). Task total 22→25. N1 now requires all 10 prose tasks. Inputs/outputs re-threaded."
status: accepted
feature: project-memory
supersedes: null
superseded_by: null
---

# Prose tasks exceed the ≤35-doc context ceiling inherited from Preparation

## Context

The Preparation carry-forward (`preparation/staging/decisions/context-budget-wave-ordering-carry-forward.md`) required Planning to bound each wave to a context budget of ≤~35 docs. The iter1 plan correctly applied this to all 11 Wave-1 conformance tasks, but the 10 Wave-2 prose tasks were not split: P3 = 41 docs, P5 = 44 docs, P7 = 68 docs. Prose rewrites are more judgment-heavy than mechanical conformance, making the overflow risk HIGHER, not lower.

## Decision

Confirmed as a structural flaw. Split prose tasks that exceed the ceiling along the same A/B boundaries the conformance wave uses, so the prose partition mirrors the conformance partition exactly.

## Rationale

The `manager-context-overflow-with-large-bundle` mistake documents that large bundles cause context overflow. The carry-forward's ≤35 ceiling was motivated by conformance tasks — prose rewrites are more expensive. Three perspectives (Structure DOC-STRUCT-1, Performance DOC-PERF-1, Codex F1) converged on this root.

## Alternatives considered

Arbitrary subdir splits (not mirroring conformance boundaries) — rejected: the conformance A/B boundaries are already count-verified; mirroring them avoids re-counting and keeps the conformance-before-prose invariant trivially enforced.

## Consequences

Prose wave expanded from 7 tasks (P1-P7) to 10 tasks (P1, P2, P3a, P3b, P4, P5a, P5b, P6, P7a, P7b). Task total 22→25. Each prose task ≤35 docs. N1 prerequisites updated to list all 10 prose tasks. Inputs/outputs re-threaded with `*-a-prose-quality`/`*-b-prose-quality` names.

## Related

- `planning/evaluation/iter1/claude/structure.md` (DOC-STRUCT-1)
- `planning/evaluation/iter1/claude/performance.md` (DOC-PERF-1)
- `planning/evaluation/iter1/codex/overall.md` (F1)
- `preparation/staging/decisions/context-budget-wave-ordering-carry-forward.md`
- `planning/rawdata/draft-iter2.md` §DL-H
