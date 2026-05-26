---
name: gap-resolutions-9-batch
description: User resolved 9 Preparation gaps in a batch — 4 skipped, 3 deferred to backlog, 2 generate-now artifacts produced.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, preparation, gap-resolution, artifacts]
loop: preparation
topic: Gap-resolutions batch confirmation
outcome: "9 gaps resolved: 4 skipped, 3 deferred to backlog, 2 generate-now"
---

# Gap-resolutions batch confirmation (9 Preparation gaps)

## Context

The Preparation loop identified 9 gaps that required user resolution before Planning could proceed. Each gap received one of three dispositions: skip (no action; rationale documented), generate-now (produce a staged artifact in this loop), or defer-to-backlog (record as a backlog item for a future session).

## Question

For each of the 9 identified gaps: skip, generate-now, or defer-to-backlog?

## User decision

- **Gap 1 (feature dir pre-create)**: Skip. Wrap-up bootstraps feature dirs.
- **Gap 2 (hooks-domain mistakes)**: Defer to backlog. No witnesses yet; capture mid-Execution.
- **Gap 3 (Planning brief mistake citations)**: Generate-now. Bind Planning to cite 3 specific mistakes in every task brief's Load Directives.
- **Gap 4 (workflow phase doc set)**: Generate-now. Stage the 5-file enumeration as a design file.
- **Gap 5 (`.claude/scripts/` dir)**: Skip. Executor handles `mkdir -p` at implementation time.
- **Gap 6 (session-lifecycle design doc)**: Defer to backlog. Post-Execution follow-up.
- **Gap 7 (`gobbi-hook-authoring` skill)**: Defer to backlog. Pick up when hook scripts reach N≥2.
- **Gap 8 (separate `gobbi-session-architecture` skill)**: Skip. The Execution task edits ARE the codification.
- **Gap 9 (`gobbi-shell-script-conventions` skill)**: Skip. Re-evaluate at N≥2 scripts.

## Implication

Two generate-now artifacts produced: `decisions/` (planning brief mistake-citation rule) and `design/workflow-phase-doc-set-for-per-iter-cadence.md` (5-file enumeration). Three backlog items staged. Four gaps closed with rationale only.
