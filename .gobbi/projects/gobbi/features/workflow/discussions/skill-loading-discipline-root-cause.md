---
name: skill-loading-discipline-root-cause
description: User confirmed the (D+L) composite root cause for skill-loading discipline failures — 3 of 7 promoted mistakes fit the docs-gap + lazy-load-behavior pattern.
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [ideation, skill-loading, root-cause, deferred-t2]
discussion-id: CP-1-2-alpha
---

# Root-cause hypothesis for skill-loading discipline confirmed

## Context

While framing the skill-loading-discipline improvement (the T2 topic), the leader proposed a composite root cause: agents fail to load instructed skills both because of a documentation gap (D) and because of lazy-load behavior (L). The leader asked the user to confirm this (D+L) composite before any design built on it.

## Question

Is the root cause for the skill-loading-discipline topic a (D+L) composite — a documentation gap plus lazy-load behavior?

## Options considered

1. **(D+L) composite (Recommended)** — both a docs gap and lazy-load behavior drive the failures.
2. **Single-cause** — either docs-only or behavior-only.

## User decision

Confirmed the (D+L) composite: 3 of 7 promoted mistakes fit the pattern of agents failing to load skills they were instructed to load.

## Implication

The (D+L) composite analysis is preserved in the skill-loading-discipline backlog for when the T2 topic is picked up in a future session. It does not affect the T1 or T3 design in the current session's scope.

## Related

- `../../../backlogs/skill-loading-discipline.md` — the deferred T2 backlog item carrying this root-cause analysis.
- `discussions/matrix-location-ambiguity-defers-t2.md` — the discussion that deferred the T2 topic to which this root cause applies.
