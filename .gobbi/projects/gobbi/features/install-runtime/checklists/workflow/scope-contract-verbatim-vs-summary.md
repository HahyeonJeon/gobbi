---
name: scope-contract-verbatim-vs-summary
description: The plan's Scope Contract section is relabelled as an explicit boundary summary citing idea.md as authoritative, instead of implying it is the verbatim contract
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, docs-sync]
keywords: [cod-plan-proj-003, scope-contract-summary, anti-drift-labelling]
author: claude
scenario: plan-proj-scope-fidelity
item_status: implemented
anchor: novel
implemented_in: null
---

# The Scope Contract section is labelled a summary, not implied to be the verbatim contract

## What

`planning/SKILL.md` requires the Ideation Scope Contract to be copied verbatim or, if summarized, explicitly
labelled as a non-authoritative summary.

## Why

At iter1, the plan's Scope reference section read like the contract itself rather than a clearly-labelled
summary of it (`COD-PLAN-PROJ-003`, Medium/100) — a labelling gap that risks a reader treating the bullets as
authoritative when `idea.md:22-31`'s YAML block is.

## Verification

The section now states explicitly: "`idea.md:22-31` is the authoritative Scope Contract... The bullets below are
a planning boundary summary and do NOT replace, quote, or override it." Verified this exact language is present
at `draft-iter1.md:63-78`.

## Status notes

Resolved. No scope meaning changed — labelling-only fix.

## Related

(none)
