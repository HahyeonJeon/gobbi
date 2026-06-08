---
name: weak-verify-gate-nonzero-passes-wrong-source
description: A `>0` (or key-exists / count) verify gate passes on both the correct read and the wrong-source read — a verify must prove the computation source, not just non-emptiness
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [process, hooks, test, verification, planning]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# A verify gate must prove the defect class, not just a nonzero result

## What happened

Planning iter1 for the session-memory redesign gave task 02 (post-tool-use hook token fix)
this verify gate: "a non-manager agent's `tokensUsed.total > 0` AND no `toolu_` ids". The
whole point of the task was to change WHERE the token value is computed — from a wrong
final-turn `toolUseResult.usage` read to a correct cumulative own-transcript sum. A `total > 0`
check passes on a final-turn (non-cumulative, wrong) read just as it passes on a correct
cumulative read. So the gate could not catch the exact defect the task existed to fix.

Both evaluator systems flagged it independently: Claude STR-1 (Structure, checklist_gap,
Medium/75) and Codex USAGE-002 (Usage, checklist_gap, High/100).

## User feedback

Surfaced by the dual-system Planning evaluation, not a direct user correction — but it is a
recurring planning trap worth promoting: the gate proved the property *exists*, not that the
property is *correct*.

## Why it happens

Planning authors reach for the cheapest assertion that the field is populated (`> 0`,
key-exists, `wc -l == N`) instead of the assertion that the field is *right*. When the task's
whole goal is to replace a wrong-but-nonzero value with a correct value, an existence/non-empty
gate lets the original wrong value sail through green.

## Correct approach

A task verify must prove the behavioral invariant the task claims to establish. For a task that
changes the SOURCE of a value (final-turn → cumulative-own-transcript), assert the written value
EQUALS an independently-computed reference, not merely that it is nonzero:

```
[ "$(jq -r '.agents[1].tokensUsed.total' fixture.json)" \
  = "$(agent-token-usage.sh <own-transcript>.jsonl | jq -r .total)" ]
```

Before finalizing any gate, ask: **"Can this gate pass while the defect it targets is still
present?"** If yes, the gate is weak — strengthen it to an equality/shape assertion against an
independent oracle.

## How to detect

Red-flag gate shapes when the task changes a value's computation source or content:
- `field > 0` when the goal is to change the *source* of the field's value (not just add it).
- Key-existence (`.hooks.SessionEnd` exists) when the goal is a specific *command shape*.
- Count (`wc -l == N`) when the goal is specific *content*.

Each of these passes on both the correct and the wrong implementation.

## Related

- [[verify-paths-bare-hooks-dir-nonexistent]] — sibling planning-verify trap (path-correctness)
- [[reproducing-a-bugged-command-is-not-validation]] — verifying against a flawed oracle
- [[leader-iter2-verification-claim-without-evidence]] — verification claims without fresh evidence
