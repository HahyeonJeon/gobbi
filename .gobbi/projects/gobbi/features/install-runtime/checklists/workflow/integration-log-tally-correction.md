---
name: integration-log-tally-correction
description: The Integration-Log decision-count summary is corrected to 8/7/3, matching a row-by-row re-tally of the 18-row log
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, docs-sync]
keywords: [f3-cons-03, integration-log-tally, decision-count, reconciliation-iter2]
author: claude
scenario: plan-cons-handoff-consistency
item_status: implemented
anchor: novel
implemented_in: null
---

# The iter2 Integration Log's decision-count summary matches its own rows

## What

`reconciliation-iter2.md`'s summary count of `took-codex`/`merged-selective`/`kept-own` decisions must equal a
row-by-row tally of the log's own 18 rows.

## Why

At iter2, the declared summary was `7 / 7 / 4`, which contradicted a direct count of the log's own rows
(`F2-CONS-04`, Low/100) — a self-consistency defect the iter2 evaluator caught by counting rather than trusting
the stated summary.

## Verification

Re-tallied from the decision column, row by row: **8 / 7 / 3** (`took-codex` / `merged-selective` / `kept-own`).
The per-row table itself was and remains authoritative; only the summary line was wrong.

## Status notes

Resolved. Trivial-scope fix (a summary count), but recorded per finding-atomicity — it is a real, independently
verifiable defect a future reader would otherwise trust without re-counting.

## Related

- [[traces-to-quotation-contract]] — the sibling self-consistency fix in the same finding family
