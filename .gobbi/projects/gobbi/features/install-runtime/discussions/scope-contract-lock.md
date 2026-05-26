---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
feature: install-runtime
discussion-id: CP-4-1-gamma
slug: scope-contract-lock
phase: ideation
sub-step: A-round-2
loop-iter: 1
---

# T3 schema gap check — existing agents[] fields sufficient; no template bump this session

## Question asked

CP-4.1-γ: Does the existing `session.template.json.agents[]` schema have gaps that need to be filled before T3 ships?

## User answer

Confirmed (Option Recommended): template schema is sufficient; no template change this session. The `status` field is an extra-property write (not in template); a formal template bump is deferred to `staging/backlogs/feature/schema-extension-agents-status-field.md`.

## Impact on design

T3 ships without modifying `session.template.json`. The hook writes `status` as an extra-property on failed spawn entries; Planning and Execution do not need to include a template edit task.

## Source

`rawdata/draft-iter3.md:459-460` (Sub-step A round 2, decision #9)
