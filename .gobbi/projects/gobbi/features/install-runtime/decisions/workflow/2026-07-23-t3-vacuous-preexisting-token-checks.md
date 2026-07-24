---
name: t3-vacuous-preexisting-token-checks
description: Three of T3's four runnable presence-checks passed on pre-edit content (the tokens already exist), so a shell PASS gave zero verification value for the deferred LP-D8 wiring predicate
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [f-usage-02, vacuous-preexisting-token, lp-d8, mandatory-manual, false-green]
author: claude
supersedes: null
superseded_by: null
related: [prep-deferred-constraints-wired-into-plan]
---

# T3's vacuous pre-existing-token checks are removed; LP-D8 is declared mandatory-manual

## Context

At iter1, three of T3's four runnable presence-checks (`A4`, `riskiest-assumption` ×2) tested tokens that
already exist PRE-EDIT (`SKILL.md:51`, `SKILL.md:198`, `topics.md:533`) — so they would report PASS whether or
not the affirmative probe-continuation allowance (LP-D8, the deferred `COD-PROJ-001-ITER3` predicate) was ever
actually added. A shell PASS on these three commands added zero verification value and would have been a false
green on the exact deferred predicate (`F-USAGE-02`, Medium/100).

## Decision

Removed the three vacuous commands. Declared LP-D8 **MANDATORY-MANUAL**: the shell block cannot test it, and
`MC-T3` is the sole acceptance authority — it must verify the affirmative allowance in BOTH files and exercise
the A4/riskiest-assumption selection path AND its override.

## Rationale

Verified all three tokens pre-exist (`A4` at `SKILL.md:51`, `riskiest-assumption` at `SKILL.md:198` and
`topics.md:533`), confirming the deletion was correct — a token that is present before AND after an edit proves
nothing about the edit.

## Alternatives considered

- **Keep the three checks as "smoke tests" even though vacuous** — rejected: a vacuous check that always passes
  is worse than no check, because it visually resembles verification coverage that does not exist
  (`verifies-must-be-self-failing`).

## Consequences

This is the concrete precedent for [[prep-deferred-constraints-wired-into-plan]]'s LP-D8 mandatory-manual
declaration — any future authored predicate whose subject already exists pre-edit must be flagged
MANDATORY-MANUAL rather than given a token-presence shell check.

## Related

- [[prep-deferred-constraints-wired-into-plan]] — the carry-forward decision this finding's fix directly enables
