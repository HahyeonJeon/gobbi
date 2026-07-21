---
name: resolve-verbatim-trace-anchor
description: "Keep exact checklist text while pointing its relative wording to the authoritative inventory."
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, docs-sync, verification]
keywords: [verbatim-trace, deictic-reference, exact-anchor]
author: codex
scenario: enumerate-every-live-policy-site
item_status: pending
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: addressed
---

# Resolve the verbatim trace anchor

## What

Preserve the Ideation checklist text verbatim while resolving its phrase `inventory below` to the exact `#form-covering-per-site-edit-inventory` owner anchor.

## Why

The iter1 plan copied the required text exactly but left the relative word `below` without an in-plan referent. The iter2 and iter3 plans add an explicit authority note instead of restating the inventory.

## Verification

The task trace remains byte-verbatim and the same task input names the authoritative path and section anchor.

## Status notes

Claude `F-AES-1` was open in iter1, addressed with mitigation in iter2, and confirmed preserved by both systems in iter3.

## Related

- [[deterministic-codex-model-policy]] - the plan carrying the resolved trace.
