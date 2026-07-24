---
name: structured-enum-terminal-field-column-position
description: T2/T4 wrote trial rows in a 5-column layout while the audit gate read column 3, so a positional awk gate silently read the wrong field.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [verification]
keywords: [structured-row, column-position, awk-gate, audit-gate, multi-producer-contract]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: []
---

# A positional row-column gate silently reads the wrong field when producers disagree on layout

## What happened

T2 and T4 wrote trial rows in a 5-column layout, while the audit gate that reads those rows was written
to read column 3 for the field it needed. Because the gate's read was purely positional (a column-index
`awk` extraction, not a named-field lookup), it silently read whatever value happened to sit in column 3
of the 5-column rows — the wrong field — without erroring or flagging the mismatch.

## Why it happens

A positional `awk`-style gate has no way to notice a column-count or column-order mismatch between what
it expects and what a producer actually wrote: it always returns something, so a wrong column produces a
plausible-looking value instead of a visible failure. When more than one producer (here T2 and T4) appends
rows to the same audit stream, each producer's column layout is an implicit contract that nothing enforces
unless it is pinned in one shared place all producers read before writing.

## Correct approach

Pin the exact column layout (count, order, and the meaning of each position) in the row-type contract
itself, in one place every producer that appends to that stream reads before writing its first row. Audit
the column shape as an explicit, separate check — e.g., assert the row's column count before extracting
any single positional field — so a layout drift fails the gate loudly instead of silently returning a
wrong value.

## How to detect

Any multi-producer, append-only, structured-row contract (more than one task or agent appends rows to the
same file) where the reading gate extracts a field by raw column position rather than a named lookup is
the setup for this trap. The concrete symptom: a gate that "passes" with a value that, on inspection,
belongs to a different column than the one the gate's author intended.

## Related

(none — first record of this trap)
