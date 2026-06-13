---
name: pre-post-gate-different-artifacts
description: A pre-gate validates a stage's input, a post-gate validates its output — the two wrap-up validation gates act on different artifacts, not duplicates
type: references
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [pipeline, validation-gate, wrap-up]
title: Pre-deployment vs post-deployment gates validate different artifacts
source: https://learn.microsoft.com/en-us/azure/devops/pipelines/release/approvals/gates
accessed: 2026-06-13
ref_type: docs
---

# Pre-deployment vs post-deployment gates validate different artifacts

## Insight
Gates run either at stage entry (pre) or stage exit (post). A pre-gate validates the INPUT a stage will consume; a post-gate validates the OUTPUT a stage produced before the next stage proceeds. The pattern is "validate input → produce → validate output → consume downstream".

## Related
- design decision D-c (stage 1 record validation vs stage 3 memory validation); D11

## Why it applies
Directs the wrap-up stage ordering: stage 1 (session-record validation) is a PRE-gate validating the promotion's input; stage 3 (memory validation) is a POST-gate validating the promotion's output before stage 4 (handoff) reports on it and stage 5 (git) commits it. The two validation stages are gates on DIFFERENT artifacts (input record vs output memory), not duplicates — which is why D11 can map stage 3 onto the EVALUATION sub-phase without making it redundant with stage 1.

## Source
- https://learn.microsoft.com/en-us/azure/devops/pipelines/release/approvals/gates

## Excerpt
"You can enable gates at the start of a stage (Pre-deployment conditions) or at the end of a stage (Post-deployment conditions) or for both."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-13 | 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4 | Anchoring D-c (the two validation gates act on different artifacts; D11 stage-3 = EVALUATION) |
