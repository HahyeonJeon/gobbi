---
name: guard-cited-as-runtozero-without-matching-vocab
description: A verification guard was cited as the sweep's run-to-zero proof, but its pattern only matched a PRIOR rename's vocabulary — a false-PASS.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: 84e9570c-bf2b-42b0-af5c-1c181d182e1b
tags: [verification, tooling]
keywords: [check-residual-vocab, run-to-zero, false-pass, guard-pattern, sweep-verification]
author: claude
priority: high
domain: verification
supersedes: null
superseded_by: null
related: [namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep, plan-rename-must-enumerate-all-ref-classes, grep-absence-claim-needs-exact-pattern]
---

# Verification guard cited as run-to-zero proof — but its pattern matched only a PRIOR rename's vocabulary

## What happened

The Planning plan for the per-type vocabulary redesign cited `check-residual-vocab.sh` as the "run-to-zero" verification anchor for removing the retired forms (`_shared`, `.effective.*`, `.tagAreaMap.spine|mistakes`). The Planning evaluator RAN the guard and found it returns "NO RESIDUAL VOCAB / exit 0" while 5 `_shared` + 3 `.effective` occurrences remained in `rules.md`. The manager reproduced this independently. The guard's VOCAB pattern only scans a PRIOR campaign's rename vocabulary (`memorization|session[- ]memory|...`), not this redesign's retired forms — so it would have green-lit Execution shipping a consumer still carrying `_shared`. A false-PASS verification gate.

## User feedback

The Planning dual-system evaluation was the signal — the evaluator ran the cited guard and the manager reproduced the false-PASS independently, exposing the gap between the guard's name and its actual pattern coverage.

## Why it happens

The plan assumed a named guard verifies "no residual vocabulary" generically. It does not — a residual-vocab guard is only as good as the specific pattern compiled into it, which is scoped to whatever change it was built for. Citing it by name, without confirming its pattern covers the CURRENT change's retired forms, treats the guard as a generic oracle it is not.

## Correct approach

For sweep verification, use EXPLICIT per-form `grep -c <retired-form> == 0` on the named change-set files (allowlisting legitimate historical carriers), not a generic guard — unless the guard's pattern is first confirmed (or extended) to cover the change's vocabulary. If the guard should detect the new forms for future sweeps, extend its pattern as a separate, in-scope task; do not silently rely on the stale pattern. Pair this with the §1.5/anchor-stability lesson: link-checkers that strip `#anchor` do not catch heading renames — verify heading anchors explicitly.

## How to detect

Any plan/verification that cites a residual/lint/guard script as the run-to-zero proof for a rename or vocabulary sweep — before trusting it, OPEN the guard and confirm its pattern actually matches the current change's retired tokens. A guard that returns "clean" while `grep -c <retired-form>` is non-zero is a false-PASS, not a pass.

## Related

- [[namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep]] — grep-every-form, classify-every-hit
- [[plan-rename-must-enumerate-all-ref-classes]] — enumerate every reference class before declaring a sweep done
- [[grep-absence-claim-needs-exact-pattern]] — an absence claim is only as good as the exact pattern behind it
