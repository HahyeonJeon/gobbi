---
name: scope-lock-3-high-workflow-doc-bundle
description: User picked the 3-High workflow-doc-routing bundle (D3-001/D3-002/D1-002) over 3 other candidate fix units
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [ideation, process]
keywords: [scope-lock, gen-d3-001, gen-d3-002, gen-d1-002, 2026-07-01-adversarial-review]
author: claude
outcome: User locked the session scope to PR #333 (landed first) plus the GEN-D3-001 + GEN-D3-002 + GEN-D1-002 bundle — 3 validated Highs from the 2026-07-01 adversarial review.
---

# Session scope — which fix unit after landing PR #333

## Context

The 2026-07-01 adversarial review left 4 remaining validated High findings unshipped: GEN-D3-001,
GEN-D3-002, GEN-D1-002, and GEN-D4-003. The manager grounded the choice by reading all four first-hand
before presenting options.

## Question

After landing PR #333, which fix unit should this session take on?

## Options considered

- The 3-High workflow-doc-routing bundle (D3-001 + D3-002 + D1-002) — all three share the theme "a doc
  contradicts the canonical contract it claims to follow."
- The 2-High pair (a narrower subset of the above).
- D1-002 and D4-003 as two independent self-contained fixes.
- A corpus-reconcile session addressing all remaining review findings at once.

## User decision

**#333 + GEN-D3-001 + GEN-D3-002 + GEN-D1-002** (the 3-High workflow-doc-routing bundle). PR #333 landed
first (merged `6a0d747c`; its worktree and branches were cleaned before this session's Ideation started).

## Implication

The Scope Contract locked to exactly these three findings; GEN-D4-003 and the other 2026-07-01 findings stay
backlog pointers for a future session, never folded into this bundle's design (Principle 5). This is the
scope every downstream Ideation sub-step (Design, Research) built against.

## Related

- [[d3-001-route-both-step6-bullets-through-mode-dispatch]] — one of the three chosen findings
- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — one of the three chosen findings
- [[d1-002-canonical-pointer-replaces-drifted-routing-table]] — one of the three chosen findings
