---
name: teammate-finalize-brief-crosses-with-in-progress-turn
description: Send a finalize/revise delta-brief to an Agent-Teams teammate only after it is confirmed IDLE, not immediately on a DONE — else the brief lands against a superseded state.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-06
session: 0d898156-8d5b-4142-9b93-308d3b692995
tags: [verification, process]
keywords: [agent-teams, delegation, coordination, idle-notification]
author: claude
priority: medium
domain: process
---

# Finalize/revise brief crosses with a teammate's in-progress turn

## What happened
Twice this session the manager sent a finalize/revise delta-brief to the persistent leader teammate while it was still mid-turn on the prior brief. The teammate produced output against the superseded understanding (Point 1: MF-2 as a Config-overlay instead of the user's state-template split; Point 2: the pre-decision compaction target), then had to be re-briefed, and the manager had to re-verify the on-disk artifact before presenting.

## Why it happens
Agent-Teams teammate messages are async and queued. The manager treated a teammate `DONE` as "ready for the next brief" without confirming the teammate was IDLE — but the teammate had already queued or started its next action, so the new brief was processed against a stale state. A decision that changed between the teammate's turn-start and the brief made the crossover visible.

## Correct approach
Send a finalize/revise brief only after the teammate's `idle_notification` (confirmed idle), not immediately on a `DONE`. If a brief must be sent while the teammate may be busy, expect a crossover: verify the on-disk artifact reflects the LATEST brief (files-as-truth) before presenting, and re-brief if stale. Prefer one consolidated brief over rapid sequential briefs. Relates to [[blast-radius-map-from-named-files-not-exhaustive-grep]] (both are verify-the-artifact-against-latest-intent disciplines).

## How to detect
Any Agent-Teams session where the manager sends a follow-up delta-brief (finalize / revise / next-step) right after a teammate `DONE`, especially when a user decision changed between the teammate's turn-start and the brief.

## Related
- [[blast-radius-map-from-named-files-not-exhaustive-grep]] — sibling verify-the-artifact-against-latest-intent discipline
