---
name: design-template-stale-vs-adr-standard
description: "templates/design.md (8-section Problem/Scope/Approach/Scenarios/Validation/Trade-offs/Open-issues/Supersedence) is out of sync with the §4.2:177 + dev-doc-standard:50 ADR contract for design docs."
type: backlogs
scope: project
feature: project-memory
status: active
created: 2026-05-27
session: 5786090e-f65a-4493-94cc-e610ce337813
tags: [docs-authoring, template-drift, adr, design-docs, standard]
disposition: deferred
supersedes: null
superseded_by: null
related:
  - ../../../../../../../skills/memorization/rules.md
  - ../../../../../../../skills/memorization/templates/design.md
---

# Design template (8-section) is stale vs the §4.2 ADR contract

## What

The staging template `memorization/templates/design.md` encodes an 8-section shape for
`design`-type docs — `## Problem` / `## Scope` / `## Approach` / `## Scenarios` /
`## Validation` / `## Trade-offs` / `## Open issues` / `## Supersedence`. The dev-doc standard,
however, REQUIRES design docs to be ADR-shaped:

- `rules.md` §4.2 (line 177): "`decisions`, `design` → ADR-shaped: `## Context` → `## Decision`
  (or `## Approach`) → `## Rationale` → `## Alternatives considered` → `## Consequences`."
- The dev-doc-memory-standard design doc's own body (line 50) self-declares the same:
  "decisions/design → Context → Decision → Rationale → Alternatives → Consequences → Related
  (ADR-shaped)."

The template and the standard disagree on the canonical section set for the same doc type.

## Why it matters

A design doc authored from the stale `templates/design.md` will land in the 8-section shape and
then FAIL the §4.2 ADR section contract at evaluation — exactly the divergence that forced the
P6a iter2 reshape of `dev-doc-memory-standard.md` and `memorization-moment-of-capture.md` (both
had been authored in the stale 8-section shape). Until the template and the standard are
reconciled, future design docs will keep diverging from the contract they are graded against.
Already-passed design docs under `features/git-workflow/design/` and
`features/install-runtime/design/` use the ADR shape, confirming ADR is the live contract.

## Proposed follow-up

Reconcile the two so they cannot drift: either (a) rewrite `templates/design.md` to the ADR
section set (Context → Decision/Approach → Rationale → Alternatives considered → Consequences →
Related), or (b) amend §4.2:177 to match the template — decide which is canonical. Option (a) is
the likely answer since the passed corpus already uses ADR and §4.2 explicitly names the ADR
shape as the design-type contract; (b) would require justifying why the 8-section shape should
win against the established standard.

## Disposition

Deferred — out of scope for P6a iter2 (which only reshaped the 2 affected design docs to ADR).
The template/§4.2 reconciliation is a separate standard-authoring change to `templates/design.md`
or `rules.md` §4.2, neither of which P6a touches.
