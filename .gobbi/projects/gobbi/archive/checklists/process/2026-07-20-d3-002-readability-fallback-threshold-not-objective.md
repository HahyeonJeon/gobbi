---
name: d3-002-readability-fallback-threshold-not-objective
description: The D3-002 readability fallback's trigger condition ("renders poorly in Markdown") has no objective threshold (F-CLAUDE-ITER2-USAGE-02)
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [docs-sync]
keywords: [f-claude-iter2-usage-02, d3-002, readability-fallback, objective-trigger]
author: claude
scenario: d3-002-manager-refs-specialist-phase-loads-column-split
item_status: pending
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: dropped
---

# D3-002 readability-fallback trigger has no objective threshold (F-CLAUDE-ITER2-USAGE-02)

## What

At iter2 the fallback's authority was bounded ("the executor MAY, with manager awareness"), resolving the
prior authority-bounding gap (F-CODEX-USAGE-001). One residual remains: the trigger condition itself — "if
the 6-column table renders poorly in Markdown" — still has no objective threshold. An executor still judges
"poorly" subjectively.

## Why

Bounded by "with manager awareness," so the impact is low — the executor cannot invoke the fallback
unilaterally without the manager being aware, which already prevents the worst case (a silent, unreviewed
weakening of the locked structural split). But an objective trigger would remove even the residual judgment
call.

## Verification

Not required to close before Execution starts. If addressed, name a concrete trigger (e.g., "if any cell's
rendered content wraps to more than N lines") OR require the executor to confirm with the manager before
invoking the fallback (which the current wording already implies via "manager awareness").

## Status notes

Open, minor, not blocking. Recorded so a future editor of this design knows the threshold gap is a known,
accepted residual rather than an oversight.

## Related

- [[d3-002-readability-fallback-not-authority-bounded]] — the iter1 defect this residual is the leftover of
- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — the design this item verifies
