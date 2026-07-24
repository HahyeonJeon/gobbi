---
name: nine-task-decomposition-strategy
description: The plan decomposes into nine tasks ordered source-before-bundle, migrate-then-grade, grouped by improvement-point rather than by-file
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning]
keywords: [nine-task-spine, source-before-bundle, migrate-then-grade, improvement-point-grouping, struct-f1-seam]
author: claude
supersedes: null
superseded_by: null
related: [t6-keep-whole-adjudication]
---

# Nine-task decomposition: source-before-bundle, migrate-then-grade, grouped by improvement point

## Context

The locked Idea bundles three source improvements (IP-1/IP-2/IP-3) with a whole-bundle SOP migration
(MIG-1…MIG-8) across the same six files. Planning had to choose both a TASK GROUPING (by improvement-point vs
by-file) and a TASK ORDERING (source-edits-first vs migration-first) before authoring any task body.

## Decision

Nine tasks: T1 (freeze legacy inventory) → T2 (IP-2) → T3 (IP-3) → T4/T5 (IP-1, split owner/consumer) → T6/T7/T8
(bundle migration, one task per file) → T9 (verify). Source IP edits (T2-T5) precede the bundle migration
(T6-T8); T1 freezes the legacy inventory before any legacy prose moves. Grouping is BY IMPROVEMENT-POINT
(T2=IP-2, T3=IP-3, T4/T5=IP-1), not by-file.

## Rationale

**Source-before-bundle, migrate-then-grade**: the grading additions in T6-T8 reference the FINAL source
behavior (a grading check for "no pacing rule" must be written against the POST-pacing-removal source, not the
pre-removal one), and MIG-1's source-before-trim discipline requires the legacy inventory frozen first
(Principle 2 — build the foundation before dependent work). **By-improvement-point, not by-file**: this matches
how the user locked the work (three named improvement points) and keeps each anchor + commit coherent — a
by-file grouping would scatter IP-1's obligations across three separate commits with no single coherent
checkpoint. IP-1 is further split T4 (recording.md field DEFINITIONS = owner) / T5 (SKILL.md/topics.md wiring =
consumer) specifically so the STRUCT-F1 owner/consumer boundary is independently testable across the seam.

## Alternatives considered

- **Group by-file** (one task per `skills/startup/*.md` file) — rejected: would require touching IP-1, IP-2, and
  IP-3 obligations within the SAME task wherever they share a file, losing the coherent per-improvement-point
  checkpoint the user's own framing implies.
- **Bundle migration before source edits** — rejected: the new grading checks the migration adds must be written
  against the SOURCE's final (post-improvement) behavior; migrating first would require re-touching the
  migrated grading files again after each source edit.

## Consequences

Any future re-decomposition of this plan must preserve the T1→(T2,T3,T4,T5)→(T6,T7,T8)→T9 ordering shape (source
frozen and edited before the bundle grades it) — this is a structural precondition the whole plan's grading
correctness depends on, not just a scheduling convenience.

## Related

- [[t6-keep-whole-adjudication]] — the escalated task-slicing decision within this same decomposition (T6 stays one task, not split)
