---
name: pacing-count-proxy-routing
description: A grading-layer count-proxy at evaluation.md:163 was not routed to any IP-2-d/IP-3-d reframe task, and the pacing enumeration undercited its own scenario.md:148 site
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, docs-sync]
keywords: [f-perf-01, evaluation-md-163, scenario-md-148, count-proxy-routing]
author: claude
scenario: plan-proj-pacing-coverage
item_status: implemented
anchor: novel
implemented_in: null
---

# The `evaluation.md:163` count-proxy site is routed to its owning reframe task

## What

Every count-proxy-shaped site the pacing/depth-grading obligations touch (`evaluation.md:163`,
`scenario.md:148`) must be named in the owning task's `verifies:` as an expected classify-and-reframe site.

## Why

At iter1, `evaluation.md:163`'s count-proxy diagnostic had no task routing it to an IP-2-d/IP-3-d reframe, and
the plan's pacing-site enumeration only named `scenario.md:148` without confirming the candidate regex actually
reached it (`F-PERF-01`, Medium/75).

## Verification

T8's `verifies:` now names `evaluation.md:163` as an expected classify-and-reframe site (the diagnostic is
reframed, never removed, never an acceptance proxy). The pacing candidate regex was confirmed to hit
`scenario.md:148` (12 of 16 hits at iter2's baseline).

## Status notes

Resolved at iter2, reconfirmed at iter3 (the `evaluation.md:163` diagnostic is explicitly re-anchored to Scope
Contract Success Criterion 2 there — see [[traces-to-quotation-contract]]).

## Related

- [[traces-to-quotation-contract]] — the iter3 fix that re-anchors this same site's obligation correctly
