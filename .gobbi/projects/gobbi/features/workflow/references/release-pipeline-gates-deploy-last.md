---
name: release-pipeline-gates-deploy-last
description: Release pipelines order stages with gates; the irreversible deploy runs last after all gates pass — validates git-last behind the memory-validation gate
type: references
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [pipeline, validation-gate, fail-fast, wrap-up]
title: Release pipeline gates with irreversible action last
source: https://learn.microsoft.com/en-us/azure/devops/pipelines/release/approvals/gates
accessed: 2026-06-13
ref_type: docs
---

# Release pipeline gates with irreversible action last

## Insight
A release pipeline is ordered stages separated by gates; a gate blocks progression until criteria pass. The irreversible action (deploy to production) is placed LAST, after every validation gate has passed. Gates are made fast so failures surface early ("fail fast").

## Related
- design decision D8 (git last); D-c (5-stage pipeline failure semantics)

## Why it applies
Validates the locked 5-stage wrap-up pipeline (D8): two validation gates (session-record validation, memory validation) bracket the memorization promotion, and the irreversible git finalization (commit/push/PR/merge/cleanup) is LAST — after memory validation passes. A failed validation gate must block the irreversible git stage, exactly as a failed release gate blocks deploy.

## Source
- https://learn.microsoft.com/en-us/azure/devops/pipelines/release/approvals/gates
- Corroborated: https://learn.microsoft.com/en-us/azure/devops/pipelines/process/stages

## Excerpt
"The release execution and deployment doesn't proceed if all gates don't succeed in the same interval and before the configured timeout."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-13 | 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4 | Anchoring D-c (git-last behind the memory-validation gate; failed gate blocks git) |
