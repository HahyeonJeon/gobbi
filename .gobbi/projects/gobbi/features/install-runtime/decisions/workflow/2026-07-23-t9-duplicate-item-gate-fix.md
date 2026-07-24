---
name: t9-duplicate-item-gate-fix
description: T9's duplicate-checklist-item gate ran on an already-deduplicated stream and could never fail; it now runs on the pre-dedup item stream
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [f3-cons-01, f2-cons-01, vacuous-gate, pre-dedup-stream, check-item-ids]
author: claude
supersedes: null
superseded_by: null
related: [phase-boundary-supersede-contract-fix]
---

# T9's duplicate-item gate can now actually fail

## Context

T9's "zero duplicate check-item lines" gate at iter2 ran `check_ids | uniq -d` — but `check_ids` already pipes
through `sort -u`, so its output can never contain a duplicate. A register with a duplicated
`- [ ] …-CHECK-01` line (raw occurrences 119 → 120) still passed the gate (`F2-CONS-01`, Medium/100) — a gate
that cannot fail by construction.

## Decision

Rewired the gate to run on `check_item_ids`, the pre-dedup per-register-line item stream (one register item per
line, `$4` is the item's own ID so an in-line reference to another ID on the same line is never mistaken for a
second item), and check for duplicates there instead.

## Rationale

The defect was structural: any dedup'd input makes a "check for duplicates" gate vacuous regardless of what
follows it. Fixture-verified: the new gate against a duplicated fixture (120 raw occurrences from 119 distinct
IDs) exits 1; the OLD `check_ids | uniq -d` form on the SAME fixture exits 0.

## Alternatives considered

- **Add a separate raw-count comparison alongside the existing gate** — rejected: leaves the vacuous gate in
  place as dead weight; simpler to fix the actual stream the gate reads.

## Consequences

The pre-dedup `check_item_ids` extractor is now load-bearing for this gate specifically — any future edit to the
register-item parsing must keep both `check_ids` (for the zero-loss proof) and `check_item_ids` (for the
duplicate gate) in sync with the register's actual line shape.

## Related

- [[phase-boundary-supersede-contract-fix]] — a sibling gate-soundness fix (last-row-wins reads) in the same finding family
