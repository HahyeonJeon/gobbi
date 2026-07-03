---
name: scope-lock-cluster-1-review-fixes
description: Continue the 2026-07-01 adversarial-review fix campaign, scoped to Cluster 1's 4 validated High findings
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, evaluation]
keywords: [cluster-1, scope-lock, review-fix-campaign]
author: claude
outcome: Scope locked to exactly 4 validated High findings (GEN-D1-001, GEN-D1-003, GEN-D7-001, GEN-D7-002); all other 2026-07-01 findings and PR #329's other clusters explicitly out of scope
---

# Scope lock — Cluster 1 (state + RECORD contract blockers)

## Context

The session opened with a choice of direction: continue the ongoing review-and-fix cycle from the
2026-07-01 adversarial review (46+ findings across multiple clusters, some already shipped per
PR #329/G1) or start something new.

## Question

Which work direction for this session, and if continuing the review-and-fix cycle, which cluster of
findings?

## Options considered

- Continue the review-and-fix cycle, scoped to Cluster 1 (state + RECORD contract blockers).
- Continue with a different cluster (G2/G3, deferred from the G1 restructuring).
- Start a new, unrelated line of work.

## User decision

Continue the review-and-fix cycle. Scope to Cluster 1: exactly 4 validated High findings —
`GEN-D1-001`, `GEN-D1-003`, `GEN-D7-001`, `GEN-D7-002`. Out of scope: all other review findings from
2026-07-01, PR #329's merge (already complete), and the G2/G3 clusters.

## Implication

This Ideation loop's Scope Contract is bounded to exactly these 4 findings; no other finding from the
2026-07-01 review may be absorbed into this loop's design without a fresh user decision. `GEN-D7-004`
(the Chat `chat/tasks/` record-map/scaffold documentation) surfaced as an out-of-scope dependency
during the loop and stays deferred per this lock.

## Related

- [[d1-001-re-ideate-verdict-decision]]
- [[d1-003-chat-staging-model-decision]]
- [[d7-001-resume-rehydration-decision]]
- [[d7-002-transcript-audit-mechanism-decision]]
