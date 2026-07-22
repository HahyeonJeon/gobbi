---
name: mark-readiness-verification-as-frozen-snapshot
description: "Point Planning to the Ideation verification authority or label any repeated list as a frozen snapshot."
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, verification]
keywords: [verification-matrix, frozen-snapshot, ssot, docs-sync]
author: codex
scenario: enumerate-every-live-policy-site
item_status: implemented
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: addressed
---

# Mark the readiness verification list as a frozen snapshot

## What

Planning must point to the Ideation briefing's `Verification matrix`. If it repeats that list for a
handoff, it must label the copy as a frozen snapshot and identify the briefing as authoritative.

## Why

The pre-v0.5.3 Preparation draft repeated the verification list without an ownership label. A later
edit to either copy could create a silent cross-artifact drift. Planning readiness now records each
attempt in the stable readiness report and identifies its source authority.

## Verification

The Planning artifact has one authority pointer to
`1-ideation/outputs/ideation-briefing-iter2.md` section `Verification matrix`. Any inline copy is
explicitly frozen and is not presented as an independently editable specification.

## Status notes

Implemented by the v0.5.3 Planning readiness report's source-identity and append-only attempt
contract. A failure blocks readiness routing; there is no Preparation PASS state.

## Related

- [[validator-and-residual-guard-design]] — the verification design this checklist protects.
- [[point-workflow-to-bridge-owners]] — the paired owner-pointer decision.
