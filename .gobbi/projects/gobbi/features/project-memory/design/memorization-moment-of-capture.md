---
name: memorization-moment-of-capture
description: "Design for adding a Moment-of-Capture Core Principle to memorization/SKILL.md, enforcing write-as-you-go during WORK"
type: design
scope: feature
feature: project-memory
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [memorization, moment-of-capture, write-as-you-go, core-principle]
topic: memorization-moment-of-capture
supersedes: null
superseded_by: null
related: []
---

# Memorization moment-of-capture Core Principle

## Problem

The write-as-you-go discipline gap lives in WORK: corrections, decisions, and mistake-candidates that surface during a loop's DISCUSSION are often deferred to the MEMORIZATION sub-phase and then silently lost when a session is interrupted. The corrective documentation, however, lives in MEMORIZATION's contract, so the discipline needs a home that every agent loading memorization will see.

## Scope

In-scope: add one Core Principle bullet to the memorization skill and a reciprocal link to the mistake skill's P2. Out-of-scope: changing the MEMORIZATION procedure steps or the staging routing.

## Approach

Add a new Core Principle bullet, "Moment-of-capture, not end-of-loop," to the memorization skill's Core Principles section — placed after "Store what survives, not what's transient" and before "Templates over freeform." The body states in two or three sentences that corrections / decisions / mistake-candidates are written to staging or rawdata at the moment of occurrence during WORK, not deferred to MEMORIZATION. Add a reciprocal link to the mistake skill's P2, which already says "Do not defer to MEMORIZATION" — the two-way link closes the loop between the two skills.

## Validation

- `grep -i "moment-of-capture" memorization/SKILL.md` returns at least one match.
- `grep "memorization/SKILL.md" mistake/SKILL.md` returns the reciprocal link.

## Trade-offs

Optimizes for visibility (the discipline appears wherever memorization is loaded) at the cost of a small duplication of intent between the memorization Core Principle and the mistake skill's P2 — accepted because the reciprocal link keeps them in sync.

## Open issues

None — the principle and the reciprocal link are both additive.

## Related

- [`skills/memorization/SKILL.md`](../../../skills/memorization/SKILL.md) — the skill the Core Principle bullet was added to
- [`skills/mistake/SKILL.md`](../../../skills/mistake/SKILL.md) — the P2 the new bullet reciprocally links to
