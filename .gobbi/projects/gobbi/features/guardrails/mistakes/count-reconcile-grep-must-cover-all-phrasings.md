---
name: count-reconcile-grep-must-cover-all-phrasings
description: A count-reconcile verification grep must cover EVERY phrasing the count appears in (principles / Iron Laws / behavioral / spelled-out), not just one — a narrow grep shows green while stale counts survive.
type: mistakes
scope: feature
feature: guardrails
status: active
created: 2026-06-05
session: ca2231b3-9567-4cf9-b0d6-f9bd3e2e78ee
tags: [docs-sync, verification, renumber, blast-radius]
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
---

# A count-reconcile grep must cover every synonym phrasing, not just one

## What happened

The sweep's verification grep keyed on `1[34] (principles|behavioral)`. It returned ZERO matches and the executor reported clean. But 4 stale counts survived in the "N Iron Laws" phrasing: `manager.md` ("12 Iron Laws") and `gobbi/SKILL.md` (three occurrences of "13 Iron Laws"). Dual-system evaluation caught them — Codex ran an independent broad `[0-9]+ Iron Laws` grep and found all four.

## Why it happens

The doc uses multiple synonyms for the same count: "principles", "Iron Laws", "behavioral discipline", "laws". A verification grep tuned to one synonym is blind to the others — it shows green while stale counts survive under the unqueried phrasings.

## Correct approach

Enumerate ALL phrasings before declaring a count reconcile complete. Use a union pattern:

```
grep -iE "([0-9]+|twelve|thirteen|fourteen|eight) (iron laws?|principles|behavioral|laws)"
```

Have the evaluator run an independent broad grep (Codex's broad form in this session: `[0-9]+ Iron Laws`). Do not declare a count reconcile done until both the author grep and the independent evaluator grep return no stale values.

## How to detect

Any reconcile or rename task where the same concept is referred to by two or more terms. A verification grep that lists only one synonym — especially when the target concept has "principles", "Iron Laws", and "behavioral discipline" as co-existing phrasings — is a signal the grep is incomplete. A dual-system evaluator running a broader pattern that finds hits the author grep missed is the definitive signal.
