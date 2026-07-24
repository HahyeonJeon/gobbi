---
name: traces-to-quotation-contract
description: All 51 traces-to entries are now normalized-verbatim quotations of the Idea (79/79 elision segments resolve), replacing 16 authored paraphrases of user locks
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification, docs-sync]
keywords: [f3-cons-02, traces-to-quotation, verbatim-substring, d-lock-paraphrase, cod-plan-proj-001-residual]
author: claude
scenario: plan-cons-handoff-consistency
item_status: implemented
anchor: novel
implemented_in: null
---

# `traces-to` is now a quotation field, not an authored-paraphrase field

## What

`planning/SKILL.md` defines `traces-to` as exact text match, not paraphrase; every entry must be a
normalized-verbatim quotation of `1-ideation/outputs/idea.md`, checkable by `grep -F`.

## Why

At iter2, all 16 D-lock entries were authored paraphrases in a field whose contract is exact text match — the
checklist's mechanical trace check could not run, and each paraphrase was an unreviewed re-statement of a USER
LOCK. One paraphrase (T8's D7) attributed to D7 a target D7 never actually names (`F2-CONS-03`, Medium/100 —
itself a residual of `COD-PLAN-PROJ-001`).

## Verification

Every entry is now a normalized-verbatim quotation under one stated normalization (drop code fences/bold,
double→single quotes) and one elision marker (` [...] `). Split every entry on the marker, normalize, `grep -F`
each segment against `idea.md`: **79/79 segments resolve, 0 misses**, run at plan time over all 51 entries. The
T8 `evaluation.md:163` obligation is re-anchored to Scope-Contract Success Criterion 2 (the obligation that
actually carries it) instead of D7 (which never names that site).

## Status notes

Resolved and mechanically re-verifiable — any future edit to `traces-to` can be re-checked by re-running the
same split+normalize+`grep -F` procedure documented in the plan.

## Related

- [[integration-log-tally-correction]] — the sibling self-consistency fix in the Integration Log
