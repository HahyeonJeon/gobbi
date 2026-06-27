---
name: c4-validator-tested-synthetic-not-real-logs
description: The C4 Integration-Log validator passed hand-built fixtures but false-failed the project's OWN real logs — verify a parser/gate against REAL in-repo data, not only synthetic fixtures
type: learnings
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [verification, process]
keywords: [validator-testing, real-data, synthetic-fixtures, false-fail, C4, escaped-pipe, F-PROJ-1]
author: claude
related: []
---

# Test a parser/gate against the project's REAL data, not only synthetic fixtures

## Insight

A validator that passes hand-built fixtures can still false-fail the project's own real artifacts.
This session's C4 Integration-Log structural validator passed its synthetic fixtures but false-failed
the project's REAL reconciliation logs (the F-PROJ-1 finding) on an escaped-pipe table cell. Always
run a new parser/gate over the real in-repo data it will face in production, not only the examples you
wrote to make it pass.

## Context

Execution task built the C4 validator (`validate-integration-log.sh`) for the Integration Log. Its
authored fixtures all passed, so it looked done. When pointed at the session's actual
`reconciliation-iter{n}.md` logs, it false-failed: a real log cell contained an escaped pipe (`\|`)
inside a markdown table, which the naive field-split mis-parsed. The dual evaluation surfaced this
(F-PROJ-1 / the C4 escaped-pipe false-fail); the remediation made the parse escape-aware
(`7fea07ef`).

## Reason

Synthetic fixtures encode the author's model of the input — including the author's blind spots. Real
data carries the messy cases the author did not think to fixture (escaped delimiters, edge spacing,
multi-line cells). A gate validated only against its own fixtures certifies the author's assumptions,
not the input it will actually gate. The cost of skipping the real-data run is a gate that goes red
on legitimate production data the first time it is used for real.

## How

- After a parser/validator passes its fixtures, run it over the REAL in-repo files it will gate
  (`find` them, feed each one) and confirm zero false-fails before declaring it done.
- Specifically fixture the messy real cases once found (escaped delimiters, empty cells, header rows)
  so the regression is locked.
- Treat "passes my fixtures" as a necessary-not-sufficient milestone; "passes the project's real
  data" is the real bar.

## Counter-cases

- **No real data exists yet** (a greenfield format): synthetic fixtures are all you have — but
  re-run the gate against the first real artifacts the moment they appear.
- **The gate is intentionally strict** and the real data is genuinely malformed: then the fail is
  correct — distinguish "validator is wrong" from "data is wrong" by reading the flagged cell, not by
  assuming the validator.

## Related

- [[dual-eval-divergence-caught-two-distinct-defects]] — the C4 false-fail was the Claude-side half of that divergence
