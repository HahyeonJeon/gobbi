---
name: iter2-fix-direction-continue-this-session
description: User confirmed to address all 5 Planning iter1 REVISE findings surgically within the same session rather than deferring to a next-session re-plan.
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [planning, iter2, fix-direction, evaluation]
topic: iter2 fix direction — continue-this-session vs. defer to next session
outcome: Continue this session; iter2 is a surgical 5-fix pass, not a re-do
---

# Fix direction — continue this session with surgical 5-fix pass

## Context

The first Planning evaluation iteration returned REVISE with 5 High findings. The leader asked the user to confirm the direction for the fix: address all 5 findings surgically within this session's planning loop, or defer to a next session as a fresh Planning iteration.

## Question

Should the fix iteration address all 5 REVISE findings in a surgical pass within this session, or should we defer to a next-session re-plan?

## Options considered

1. **Continue this session — surgical 5-fix pass** — the fix iteration is strictly a delta on the prior draft: update exactly the 5 declared sections, copy all other sections verbatim. No re-architecture. Faster path to Execution.
2. **Defer to next session** — treat the findings as requiring a more substantial rethink; start a fresh Planning iteration in the next session.

## User decision

Continue this session; surgical 5-fix pass confirmed.

## Implication

The fix-iteration status note records: "This draft is a surgical delta on the prior draft. Modified sections only: [5 sections]. All other sections copied verbatim." The 5 Medium findings that were out of scope remain carried open; the surgical pass does not address them.

## Related

- `decisions/2026-05-24-lock1-wave-ordering-not-graph-enforced.md` — one of the surgical fixes applied in this pass (the wave-ordering graph edges).
- The fix-iteration Planning evaluation (both systems PASS) is preserved in `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/planning/evaluation/`.
