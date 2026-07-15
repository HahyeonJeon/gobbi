---
name: validity-signal-must-be-written-after-its-validation-gate
description: A durable "valid/complete" signal must be written only after the gate that validates it passes, never before.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-13
session: 2026-07-13-0bbb7c63-919c-45c2-81ea-b86406c8b75b
tags: [assumption]
keywords: [validity-signal, gate-ordering, completeness-predicate, baseline-promotion]
author: claude
priority: high
domain: assumption
supersedes: null
superseded_by: null
related: [reuse-target-must-be-invocable-at-needed-granularity]
---

# A "valid/complete" signal must be written AFTER the gate that validates it — not before

## What happened

The startup skill combined two independently-locked user decisions: (a) add a P6.5
dual-system evaluation gate over the promoted baseline, and (b) let a later session detect
"this project has a complete baseline" by reading the durable memory the promotion writes.
But the promotion (P6) wrote that durable memory — the root/feature living-index a later
session reads — before P6.5 evaluated it. So a baseline that P6.5 later REVISE'd or FAIL'd, or
an interrupted run, was indistinguishable from a passed one once the session record (holding
the only `baseline_valid` flag) was gone. The dual-system evaluation caught this as a
High-confidence finding.

## Why it happens

Two decisions each locked in isolation ("add a validation gate" and "derive completeness from
the produced artifact") interact: if the artifact that signals completeness is produced
before the gate that decides completeness, the signal can exist for a non-validated artifact.
Neither decision is wrong alone; the gap is in their ordering, which no single decision named.

## Correct approach

The durable "valid/complete" signal must be written strictly after the gate that validates it
passes; a gate REVISE/FAIL must leave no completeness signal (route to recovery instead).
Prefer making the completeness predicate itself an artifact that only a passed run produces —
here, the living-index, written at P7 post-PASS — rather than adding a separate status flag.
When locking interacting decisions, verify their combined lifecycle ordering, not each
decision in isolation.

## How to detect

Whenever a design has both a validation/quality gate and a durable signal that downstream
readers use to conclude "this passed / is complete / is safe," check the write order: is the
signal written before or after the gate? If any durable "valid/complete/ready" marker is
produced before its validating gate runs, a failed or interrupted artifact can carry a
true-looking signal. Also check: when two locked decisions touch the same lifecycle, trace
their interaction explicitly, not just each in isolation.

## Related

- [[reuse-target-must-be-invocable-at-needed-granularity]] — sibling trap from the same
  startup-skill design session: a locked decision that looked sound in isolation broke on
  interaction/verification against the actual mechanism
