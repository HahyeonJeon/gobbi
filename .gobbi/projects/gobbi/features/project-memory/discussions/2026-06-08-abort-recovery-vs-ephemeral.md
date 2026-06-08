---
name: 2026-06-08-abort-recovery-vs-ephemeral
description: User chose ephemeral sessions/ with no abort-recovery; Wrap-up is the only durable point
type: discussions
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [sessions, abort-recovery, ephemeral, d1]
loop: ideation
outcome: Wrap-up is the only durable point; sessions/ is fully ephemeral; D-4 per-iter commit cadence is retired
---

# Abort-recovery vs fully-ephemeral sessions

## Context

The D-4 per-iteration session-memory commit cadence existed to enable mid-session abort-recovery: if a session crashed before Wrap-up, the last committed iter was not lost. Making `sessions/` fully ephemeral and gitignored removes that recovery guarantee.

## Question

Should abort-recovery be preserved (keep D-4 or an equivalent) or abandoned (fully ephemeral sessions/, Wrap-up is the only durable point)?

## Options considered

1. **Keep some commit cadence for abort-recovery:** preserve D-4 or a lighter variant. Session memory survives a crash.
2. **Fully ephemeral — Wrap-up is the only durable point:** abandon abort-recovery by design. A crash before Wrap-up loses in-flight working memory. The durable record is only the finalized `notes/` record produced at Wrap-up.

## User decision

Option 2: **Wrap-up is the only durable point.** sessions/ stays fully ephemeral; a crash/abort before Wrap-up loses in-flight working memory by design. D-4 per-iter commit cadence is retired/redefined accordingly.

## Implication

- D1 is the most consequential decision: it requires updating the full `git-workflow` feature-memory cluster (D-4 design-of-record, README, phase-doc-set design, discussions, storage-bounds decision, phase-doc-count checklist).
- The counterfactual ("tracked tree IS the audit trail") is steel-manned and rejected: the user explicitly chose the ephemeral model, backed by E3 (don't commit outputs) and the finalized `notes/` record providing the durable audit trail.
- Planning must enumerate all D-4 artifacts and define per-file CRUD (supersede/archive/update).

## Related

- Design § D1, Scenario S6
- `staging/decisions/2026-06-08-d1-cross-feature-cotouchset-incomplete.md`
