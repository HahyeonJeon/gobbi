---
name: workflow-doc-generalization-unproven
description: The compaction skeleton is proven only on ideation.md; Planning must re-verify per-doc gates before compacting the other 7 workflow docs.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-07
session: 122609f7-3c4c-44ea-af90-efe1531a5cbf
tags: [design, docs-sync, process]
keywords: [scope-generalization-gate, ideation-md-prototype, gate-orchestration-prototype]
author: claude
---

# Workflow-doc skeleton generalization is unproven — Planning-time gate required

## Context

The Ideation loop's WORK sub-phase produced and validated a full skeleton + pointer mechanism
+ drift guard design, but scope-bounded the concrete prototype to exactly one loop doc
(`ideation.md`). An earlier draft of this design had overclaimed that the skeleton "fits the
five loop docs cleanly" without having prototyped any of the other four.

## Decision

Generalization of the loop-orchestration skeleton to the other 4 loop docs
(`preparation.md`, `planning.md`, `execution.md`, `wrap-up.md`) and of the gate-orchestration
skeleton to the 3 gate docs (`evaluation.md`, `record.md`, `production.md`) is UNPROVEN.
Planning MUST run the 5-gate acceptance test (who to spawn / what to pass / what proves
completion / which decisions need the user / which doc owns each procedure) per remaining doc,
and re-verify that doc's own loop-specific (M) gates survive the pointer swap, before
compacting it. At least one gate doc must get a worked gate-orchestration prototype at
Planning time, since that skeleton itself has no existing prototype in this session's output.

## Rationale

The `ideation.md` prototype proves the pattern CAN work; it does not prove the pattern
generalizes. Each remaining loop doc carries its own loop-specific content that a blind
skeleton swap could silently drop — the Re-Ideate routing (`preparation.md`), the plan-artifact
staging (`planning.md`), the executor-continuation rule (`execution.md`), and the inverted
commit boundary (`wrap-up.md`, where Wrap-up's RECORD may touch memory). The
gate-orchestration skeleton (Genre B) is named but has zero worked examples in this session's
output — the key tension between "cross-cutting sub-phase doc" and "loop-orchestration doc" is
identified, not yet resolved in practice.

## Alternatives considered

- **Treat the `ideation.md` prototype as sufficient proof for all 8 docs.** Rejected — this is
  exactly the overclaim an earlier draft made ("fits the five loop docs cleanly"); a dual-system
  evaluator finding required it be walked back to an explicit unproven-generalization gate.

## Consequences

Planning's task list for this compaction effort must include, per remaining doc, a gate
re-verification step before that doc is compacted — this is a Planning-time requirement, not
an Ideation deliverable. No remaining doc is compacted on the strength of the `ideation.md`
prototype alone.

## Related

- [[two-doc-kind-compaction-model]] — the model whose generalization this gate guards
- [[compaction-prototype-scope-parameters]] — the fixed prototype order (`ideation.md` then `execution.md`) this gate applies to
