---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: open
scope: feature
feature: guardrails
finding-id: COD-OVERALL-ITER3-001
type: general
domain: docs-sync
disposition: open
confidence: 100
severity: Medium
---

# Hook event count claim (31) contradicts captured evidence (29)

## Context

`draft-iter3.md` and the staged reference `claude-code-posttooluse-hook-schema.md` claim the official hooks page lists 31 hook events. The staged reference itself enumerates 29 event names (lines 45-73). The current official page visible lifecycle list also shows 29 events. The Codex evaluator independently fetched the page and confirmed 29.

The `PostToolUseFailure` event itself is verified by both Claude and Codex evaluators — this is a supporting-prose defect, not an operational blocker.

## Checklist item for Execution / docs sweep

- [ ] In `draft-iter3.md`: update T3-E-5 (line ~205), D-3-3 (line ~366), and F-Fix-B (line ~533) from "31" to "29"
- [ ] In `staging/references/claude-code-posttooluse-hook-schema.md`: if the header claims "31 events", update to "29"
- [ ] After update: `grep -n '"31 hook' draft-iter3.md` returns 0 matches (all corrected to 29)

## Related

- `evaluation/iter3/codex/overall.md` COD-OVERALL-ITER3-001
- `evaluation/iter3/codex/consistency.md` COD-CONS-ITER3-001
- `evaluation/iter3/codex/aesthetics.md` COD-AESTH-ITER3-001
- `staging/references/claude-code-posttooluse-hook-schema.md`
- Note: a duplicate of this finding is also at `staging/decisions/hook-event-count-31-vs-29-docs-sync.md` (misrouted in prior pass)
