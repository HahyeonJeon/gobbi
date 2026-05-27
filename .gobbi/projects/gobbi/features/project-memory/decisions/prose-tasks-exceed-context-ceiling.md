---
name: prose-tasks-exceed-context-ceiling
description: "The three largest prose tasks exceeded the ≤35-doc context ceiling; each was split into A/B sub-tasks along the conformance-wave boundaries."
tags: [prose-tasks, context-ceiling, planning, wave-split]
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
type: decisions
domain: process
status: accepted
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
---

# Prose tasks exceed the ≤35-doc context ceiling inherited from Preparation

## Context

The Preparation carry-forward (see [context-budget-wave-ordering-carry-forward](context-budget-wave-ordering-carry-forward.md)) required Planning to bound each wave to a context budget of roughly 35 docs. The first plan applied this to all 11 conformance tasks, but the 10 prose tasks were not split: the largest were 41, 44, and 68 docs. Prose rewrites are more judgment-heavy than mechanical conformance, making the overflow risk higher, not lower.

## Decision

Confirmed as a structural flaw. Split prose tasks that exceed the ceiling along the same A/B boundaries the conformance wave uses, so the prose partition mirrors the conformance partition exactly.

## Rationale

The `manager-context-overflow-with-large-bundle` mistake documents that large bundles cause context overflow. The carry-forward's ≤35 ceiling was motivated by conformance tasks — prose rewrites are more expensive. Three perspectives (Structure DOC-STRUCT-1, Performance DOC-PERF-1, Codex F1) converged on this root.

## Alternatives considered

Arbitrary subdir splits (not mirroring conformance boundaries) — rejected: the conformance A/B boundaries are already count-verified; mirroring them avoids re-counting and keeps the conformance-before-prose invariant trivially enforced.

## Consequences

The prose wave expanded from 7 tasks to 10 (the three oversize tasks each split into A/B halves), raising the plan's task total from 22 to 25. Each prose task is now bounded to 35 docs or fewer. The nav task's prerequisites were updated to require all 10 prose tasks.

## Related

- [context-budget-wave-ordering-carry-forward](context-budget-wave-ordering-carry-forward.md) — the inherited ≤35-doc ceiling this decision applies to the prose wave
- [`plans/2026-05-26-dev-doc-standard-retrofit`](../plans/2026-05-26-dev-doc-standard-retrofit.md) — the plan whose task list reflects the split (25 records)

## Source

Originating session `b0a0eaf9-03f7-4dce-a040-c7443653a459` (see the `session` frontmatter field) — Planning review, Structure / Performance perspectives and Codex finding F1.
