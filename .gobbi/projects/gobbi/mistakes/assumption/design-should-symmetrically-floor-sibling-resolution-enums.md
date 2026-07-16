---
name: design-should-symmetrically-floor-sibling-resolution-enums
description: A locked design floored one sibling artifact's escape-hatch enum but not the other's, so the same class of relabel gap surfaced late, at Execution.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [assumption, verification]
keywords: [escape-hatch, resolution-enum, sibling-artifacts, property-floor, acceptance-gate]
author: claude
priority: high
domain: process
related: [acceptance-gate-and-conjunct-escape-hatch]
---

# A design must floor every sibling artifact's resolution enum, not just one

## What happened

The locked Ideation design floored the `scenario` SOP's `n/a` value (a property-floor requiring evidence
before a case can be marked not-applicable) but did NOT symmetrically apply the same floor to the
`checklist` SOP's own resolution enum (`advisory` / `n/a` / `waiver`). Execution's dual-system evaluation
then caught 3 Highs in the checklist skill that the analogous scenario floor would have prevented: an
`advisory` relabel that let a checked item dodge acceptance, an `n/a` resolution accepted without
inspected-false evidence, and a `waiver` token spelled three different ways across the doc.

## Why it happens

An escape-hatch / property-floor discipline closed on one artifact does not automatically transfer to a
sibling artifact that has its OWN, differently-named resolution or acceptance enum. The design session
treated "close the `n/a` escape hatch" as a single, artifact-scoped fix rather than recognizing it as a
CLASS of gap — any resolution/acceptance enum in any sibling artifact is a candidate for the same
relabel-to-dodge-acceptance failure, whatever that enum's own vocabulary happens to be.

## Correct approach

When closing an escape-hatch class on one artifact during design, sweep every SIBLING artifact for its
own analogous resolution/acceptance enum and apply the same floor symmetrically — before locking the
design, not after Execution's dual-eval finds the gap. Concretely: enumerate every enum value a sibling
artifact allows for "how was this item resolved," and for each value that can be used to avoid doing the
work (skip, defer, waive, mark not-applicable), require the same evidence-before-acceptance discipline
the first artifact already carries.

## How to detect

A design closes a relabel / escape-hatch class in artifact A (a property-floor, an evidence requirement,
a vocabulary lock) and a SIBLING artifact B has its own resolution/acceptance enum that was not audited
against the same class. The early-warning signal: two artifacts in the same design session share a
"how was this item disposed of" concept but use different enum names for it (e.g., scenario's `n/a` vs
checklist's `advisory`/`n/a`/`waiver`) — different names make it easy to treat them as unrelated concerns
instead of the same discipline applied twice.

## Related

- [[acceptance-gate-and-conjunct-escape-hatch]] — a prior escape-hatch trap in the same family: an
  acceptance gate must close every relabel vector, not just the one first identified
