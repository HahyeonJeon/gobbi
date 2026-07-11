---
name: mark-readiness-verification-as-frozen-snapshot
description: "Point Planning to the Ideation verification authority or label any repeated list as a frozen snapshot."
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, verification]
keywords: [verification-matrix, frozen-snapshot, ssot, docs-sync]
author: codex
scenario: enumerate-every-live-policy-site
item_status: pending
anchor: novel
implemented_in: null
---

# Mark the readiness verification list as a frozen snapshot

## What

Planning must point to the Ideation briefing's `Verification matrix`. If it repeats that list for a
handoff, it must label the copy as a frozen snapshot and identify the briefing as authoritative.

## Why

The Preparation draft repeated the verification list without an ownership label. A later edit to
either copy could create a silent cross-artifact drift.

## Verification

The Planning artifact has one authority pointer to
`1-ideation/outputs/ideation-briefing-iter2.md` section `Verification matrix`. Any inline copy is
explicitly frozen and is not presented as an independently editable specification.

## Status notes

Open Medium/50 Planning input from Claude `F-STRUCT-1` and `F-CONS-1`. It does not block
Preparation PASS.

## Related

- [[validator-and-residual-guard-design]] — the verification design this checklist protects.
- [[point-workflow-to-bridge-owners]] — the paired owner-pointer decision.
