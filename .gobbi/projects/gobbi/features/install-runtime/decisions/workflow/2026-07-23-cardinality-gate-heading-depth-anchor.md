---
name: cardinality-gate-heading-depth-anchor
description: The family-count cardinality gate regex was anchored to the legacy heading depth that the migration itself restructures; made heading-depth-neutral
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [f-struct-02, family-defs, heading-depth-neutral, cardinality-gate, mig-2-restructure]
author: claude
supersedes: null
superseded_by: null
related: []
---

# The family-count extractor is heading-depth-neutral

## Context

At iter1, `family_defs` matched only `^### ` (a fixed heading depth) — but MIG-2 adds a parent index plus four
logical sets ABOVE the families, which pushes the families to a DEEPER heading level (`####`) as part of the
very restructure this gate is supposed to verify. A hard-coded depth would break against the migration itself
(`F-STRUCT-02`, Medium/50).

## Decision

Changed the extractor to `^#{1,6}[[:space:]]+STARTUP-...` — heading-depth-neutral by construction.

## Rationale

Verified on the live `scenario.md`: both the old fixed-depth and new depth-neutral forms return 29 today (no
regression on the CURRENT unmigrated file). Verified on a rewritten fixture: the depth-neutral form still
returns 29 at both `###` and `####` depth, so it survives the parent-index/set layers MIG-2 adds.

## Alternatives considered

- **Update the fixed depth to `####` once MIG-2 lands** — rejected: this just relocates the same fragility to
  whatever depth the NEXT restructure chooses; depth-neutrality removes the fragility class entirely.

## Consequences

Any future scenario-family heading restructure does not require touching this extractor again, as long as
family headings stay within `#{1,6}`.

## Related

(none)
