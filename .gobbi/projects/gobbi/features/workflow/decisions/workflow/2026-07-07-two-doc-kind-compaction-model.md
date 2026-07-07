---
name: two-doc-kind-compaction-model
description: Adopt a two-doc-kind compaction model (loop-orchestration + gate-orchestration) for orchestration/workflow/*.md instead of one uniform skeleton.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-07
session: 122609f7-3c4c-44ea-af90-efe1531a5cbf
tags: [design, docs-sync, process]
keywords: [compaction, doc-kind, loop-orchestration, gate-orchestration, skeleton]
author: claude
---

# Adopt the two-doc-kind compaction model for `orchestration/workflow/*.md`

## Context

The Ideation loop needed one shared skeleton for compacting the 8
`orchestration/workflow/*.md` docs. An earlier locked decision (this session's Point 2,
locked decision 5) had already called for "8 answers, not 8 headings." Applying that framing
to all 8 docs uncovered a problem: 5 of the docs are per-loop wrappers (each answers "how does
the manager run *this loop*?"), but 3 — `evaluation.md`, `record.md`, `production.md` — are
cross-cutting sub-phase docs with no loop sub-phases of their own and no peer skill owning
their manager orchestration (`production.md` has no peer skill at all).

## Decision

Adopt a two-doc-kind compaction model, marked visibly in each doc: `loop-orchestration` (the 5
per-loop docs — ideation / preparation / planning / execution / wrap-up), which answer the
8-point skeleton as 8 ANSWERS embedded in the doc, not 8 mandatory headings; and
`gate-orchestration` (the 3 cross-cutting docs — evaluation / record / production), which
follow a separate 6-point gate-doc skeleton: Purpose + authority boundary; manager pre-spawn
inputs; manager validation/reconciliation/integration gates carrying stable
`[GATE:{doc}.{gate-name}]` IDs; failure/degraded/retry/stop-the-line; output contracts +
path-owner pointers; cross-references. This refines the session's earlier Point 2 locked
decision 5: the "8 answers, not 8 headings" framing applies only to the loop-orchestration
kind, and the gate-orchestration kind gets its own 6-point contract.

## Rationale

Both independent producers (Claude + Codex), then both independent dual-system evaluators,
converged on this split — the anti-groupthink signal held across two full iterations.
`production.md` has no loop phases to map onto an 8-point skeleton; forcing one would hide or
mislabel its manager gates. The split matches the tree's own Diátaxis type-separation, already
adopted at `memory/rules.md` § 4.1.1: "documentation types serve different reader needs, and
mixing them in one doc serves none well."

## Alternatives considered

- **Uniform 8-point skeleton on all 8 docs.** Rejected globally — `production.md` has no loop
  phases to map, so the skeleton would be a fiction for the 3 cross-cutting docs. Kept only for
  the 5 loop docs.
- **Split the gate-heavy docs into new child docs.** Rejected — creates new SSOTs against the
  session's locked decision to hoist to EXISTING SSOTs (no new `_loop-common.md`), and adds a
  manager read-hop.

## Consequences

The 5 loop docs get the 8-answer loop-orchestration skeleton; the 3 gate docs get the distinct
6-point gate-orchestration skeleton. Every doc must carry a visible `**Doc kind:**` marker (see
the companion `compaction-prototype-scope-parameters` decision). Planning must independently
verify the loop-orchestration skeleton against the 4 remaining loop docs and prototype the
gate-orchestration skeleton on at least one gate doc before either shape is treated as proven
project-wide (see the `workflow-doc-generalization-unproven` decision).

## Related

- [[point-dont-restate-guard-rule-home]] — the guard-rule home for enforcing the pointer discipline this split enables
- [[compaction-prototype-scope-parameters]] — the concrete implementation parameters ratified alongside this split
- [[workflow-doc-generalization-unproven]] — the Planning-time gate that guards this design's unproven generalization
