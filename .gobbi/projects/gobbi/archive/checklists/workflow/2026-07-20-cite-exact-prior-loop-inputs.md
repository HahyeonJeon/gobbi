---
name: cite-exact-prior-loop-inputs
description: "Give each executor an exact prior-loop file and section for every authority it consumes."
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, verification, docs-sync]
keywords: [prior-loop-inputs, section-anchor, fresh-executor]
author: codex
scenario: enumerate-every-live-policy-site
item_status: implemented
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: addressed
---

# Cite exact prior-loop inputs

## What

Name each locked Ideation input and each Planning-readiness source with its session path, source
identity, and exact section anchor.

## Why

The pre-v0.5.3 iter1 plan described Ideation and Preparation inventories generically. A fresh executor
had to reconstruct their locations. Planning readiness now owns the register and exact source identity.

## Verification

Every prior-loop entry under task `inputs` resolves to an existing file and heading anchor.

## Status notes

Codex `CDEX-PLAN-I1-USAGE-002` and the exact-reference portion of `CDEX-PLAN-I1-OVERALL-005` were addressed in iter2 and remain addressed in iter3.

## Related

- [[deterministic-codex-model-policy]] - the final exact-input contract.
