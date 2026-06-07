---
name: guardrails-readme-iron-law-count-drift
description: Resolve pre-existing "13 Iron Laws" hard-coding in features/guardrails/README.md (5 occurrences), now further stale after adding P9 and P10
type: backlogs
scope: project
feature: null
status: active
created: 2026-06-07
session: b02c3111-68be-4558-a19f-fabf9627602f
tags: [guardrails, readme, count-drift, iron-laws, docs]
priority: medium
disposition: deferred
project-scope: true
shipped_in: null
---

# Guardrails README — Iron Law Count Drift

## Context

`features/guardrails/README.md` hard-codes the string "13 Iron Laws" and "Iron Law #13" in 5 places (`:3,11,17,25,29`). This was already stale before the P9/P10 session: the count had previously moved from 14 to 8 via the principles redesign (PR related to `2026-06-05-principles-redesign-14-to-8.md`), leaving the README 5 behind. After adding P9 and P10 in the originating session, the live count is now 10, making the README wrong by 7.

The originating session deferred this as D8 because:
1. The drift is pre-existing (not introduced by the P9/P10 change).
2. Fixing it would mix two distinct changes in one PR.
3. The backlog on the prior count-reconcile sweep (`backlogs/principles-external-renumber-reword-sweep.md`) noted the historical-vs-live rule.

## Why deferred

Including this fix in the P9/P10 PR would conflate two separate changes (add principles + fix pre-existing README drift) and widen the PR review surface. The README drift predates this session and stands as its own fix.

## When to pick up

After the P9/P10 PR is merged and `principles/SKILL.md` shows 10 principles as the stable live count. No other prerequisites. This is a standalone prose edit to one README.

## Suggested approach

Two options — pick one with the user:

**Option A — Reconcile to the live count (10).**
Replace all 5 occurrences of "13 Iron Laws" / "Iron Law #13" with "10 Iron Laws" / "Iron Law #10" in `features/guardrails/README.md`. Simple, correct. Future count changes will require updating the README again.

**Option B — Rewrite the README to stop hard-coding the count.**
Replace the hard-coded number with a prose reference ("the full set of Iron Laws") and a link to `principles/SKILL.md`. Requires more rewriting but makes the README immune to future count changes.

Recommended: Option B if the README prose permits it without losing meaning; Option A otherwise. Either way, verify with `grep -n "Iron Laws\|Iron Law" features/guardrails/README.md` that all 5 occurrences are addressed.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-07-b02c3111-68be-4558-a19f-fabf9627602f/`
