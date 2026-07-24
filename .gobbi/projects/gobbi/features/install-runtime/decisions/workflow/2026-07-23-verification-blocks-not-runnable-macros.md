---
name: verification-blocks-not-runnable-macros
description: Every task's verification command block used a <WT> macro instead of a real absolute path, making all nine blocks non-runnable as printed
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [cod-plan-usage-003, wt-macro, command-preamble, non-runnable-block, bash-n]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Every verification command block is runnable as printed, with no macros

## Context

At iter1, every task's command block used a `<WT>` placeholder macro instead of a bound absolute path, so none
of the nine blocks could actually run as printed — a fresh executor would have to guess the substitution
(`COD-PLAN-USAGE-003`, Medium/100).

## Decision

Added a single Command preamble (prepended verbatim to every task block) binding real absolute `WT`/`SR`/`S`/`G`/
`EVIDENCE` values plus shared `family_defs`/`check_ids` helper functions — never a `<WT>` macro anywhere in a
command block.

## Rationale

Verified after adoption: zero of the (now 13) fenced bash blocks contains any macro, and all 13 pass `bash -n`
with the preamble prepended. `rg` resolves to a real binary (`/home/jeonhh0061/.local/bin/rg`), confirmed
runnable under `bash`.

## Alternatives considered

- **Leave the macro and document the substitution in prose** — rejected: a fresh single-task executor must be
  able to copy-paste and run the block without cross-referencing separate substitution instructions.

## Consequences

Any NEW task command block added to this plan (Execution-time repair or a future plan revision) must prepend the
same Command preamble and must not introduce a new macro or placeholder — this is now the plan's standing
authoring convention, not a one-time fix.

## Related

(none)
