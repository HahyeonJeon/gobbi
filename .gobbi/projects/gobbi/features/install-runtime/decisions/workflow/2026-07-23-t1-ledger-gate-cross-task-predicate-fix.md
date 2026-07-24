---
name: t1-ledger-gate-cross-task-predicate-fix
description: T1's ledger verification gate demanded columns only T6-T8 can produce; split into a T1 source-side LEDGER row and a T9 destination-side T9_LEDGER row against the same key
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [f3-struct-01, f2-struct-01, ledger-t9-ledger-split, cross-task-predicate, source-ref-key]
author: claude
supersedes: null
superseded_by: null
related: [check-id-boundary-sibling-shape-fix]
---

# T1's ledger gate is no longer a cross-task predicate

## Context

T1 freezes the legacy migration ledger's SOURCE side before any legacy prose is trimmed. At iter2, the gate
demanded all seven ledger columns be non-empty, including `destination_union` and `semantic_diff` — but those
columns can only be populated after T6-T8 create the destination content, three tasks later than T1's own
sequence point. A row that was CORRECT at T1's moment (four source columns filled, destination columns
genuinely absent) exited 1 (`F2-STRUCT-01`, High/100) — a gate whose subject cannot exist yet is not
self-failing, it is unsatisfiable.

## Decision

Split the ledger into two row types against the same `source_ref` key: T1 writes a SOURCE-side `LEDGER` row
(four columns, all its own — `source_clause`/`source_primitives`/`logical_relations`, T1 asserts all four); T9
writes a DESTINATION-side `T9_LEDGER` row after the destinations exist (`forward_union`/`relation_equivalence`/
`destination_union`/`semantic_diff`).

## Rationale

T1 OWNS THE SOURCE SIDE ONLY — no task's gate should ask for a column another task produces. The reverse-sweep
shape T9 already needed (comparing `source_ref` key sets) is the shape that naturally splits the row this way.
Reproduced-then-fixed: the iter2 seven-column form on a T1-correct row exited 1; the iter3 four-column form on
the identical row exits 0.

## Alternatives considered

- **A `pending` terminal that T9 must find and replace** — rejected: the evidence note is append-only, so a
  "pending" row could only be "replaced" by rewriting it, breaking the append-only contract.
- **Fabricate placeholder destination text at T1 to satisfy the gate** — rejected: this corrupts the one
  artifact MIG-8's forward union and reverse sweep depend on, and destroys `semantic_diff`'s diagnostic value —
  a column pre-filled at T1 can never honestly record "narrowed" at T9.

## Consequences

Any future task that needs to read the full ledger (source + destination) must join `LEDGER` and `T9_LEDGER` on
`source_ref` — no single row carries both sides. T9 asserts the `source_ref` key sets are equal between the two
row types as part of its reverse sweep.

## Related

- [[check-id-boundary-sibling-shape-fix]] — the sibling composition-at-task-boundaries fix in the same finding family
