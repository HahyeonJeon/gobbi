---
name: reciprocal-principle-cross-refs
description: Add reciprocal back-pointers from P5, P6, and P1 to the new P9 and P10
type: backlogs
scope: project
feature: null
status: active
created: 2026-06-07
session: b02c3111-68be-4558-a19f-fabf9627602f
tags: [principles, p5, p6, p1, p9, p10, cross-references, docs]
priority: low
disposition: deferred
project-scope: true
shipped_in: null
---

# Reciprocal Principle Cross-References (P5/P6/P1 → P9/P10)

## Context

When P9 and P10 were added to `principles/SKILL.md`, each new principle carries a forward reference to the existing related principle (P9 references P6 and P1; P10 references P5). The forward references are one-directional. P6, P5, and P1 do not yet carry a back-pointer to the new principles.

This is intentional for the initial ship: the PR scope was locked tight (add P9 + P10 only, no rewrites to existing principle bodies). Reciprocal back-pointers were deferred as D7 in the Ideation locked decisions.

## Why deferred

Adding back-pointers to P5, P6, and P1 requires editing existing principle bodies — out of scope for the originating session, which was locked to appending P9/P10 and updating count-references only. D7 was explicitly deferred per user decision.

## When to pick up

After P9 and P10 are shipped and verified. No other prerequisites. This is a standalone prose edit to three existing principle bodies — it can run any time.

## Suggested approach

Edit `principles/SKILL.md` (canonical real file at `.gobbi/projects/gobbi/skills/principles/SKILL.md`):

- P6 Why paragraph: add one sentence near the end: "For all edits — not just documentation — see Principle 9."
- P5 Why paragraph: add one sentence: "For the complementary lower bound — completing the agreed scope — see Principle 10."
- P1 Practice bullet for "Study what already exists": add a parenthetical: "(at the moment of editing a specific file, see Principle 9 for the CRUD + 5W1H blast-radius check)."

Verify no count-references need updating (these are prose additions, not count changes). Re-run the executor verification grep from the originating session to confirm no regressions.

Also update `.claude/CLAUDE.md` table if the table rows are expanded to include cross-reference footnotes — but if the table stays as one-liner rows only, no change is needed there.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-07-b02c3111-68be-4558-a19f-fabf9627602f/`
