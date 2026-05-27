---
name: scope-contract-lock
description: User confirmed existing session.template.json agents[] schema is sufficient; no template bump needed this session, status field deferred to backlog.
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [agents, session-template, schema]
discussion-id: CP-4-1-gamma
phase: ideation
sub-step: A-round-2
loop-iter: 1
---

# Session template agents[] schema sufficient; no template bump needed

## Question asked

Does the existing `session.template.json.agents[]` schema have gaps that need to be filled before the PostToolUse hook task ships?

## User answer

Confirmed (Option Recommended): template schema is sufficient; no template change this session. The `status` field is an extra-property write (not in template); a formal template bump is deferred to the `schema-extension-agents-status-field` backlog item.

## Impact on design

The PostToolUse hook task ships without modifying `session.template.json`. The hook writes `status` as an extra-property on failed spawn entries; Planning and Execution do not need to include a template edit task.

## Source

`rawdata/draft-iter3.md:459-460` (Sub-step A round 2, decision #9)
