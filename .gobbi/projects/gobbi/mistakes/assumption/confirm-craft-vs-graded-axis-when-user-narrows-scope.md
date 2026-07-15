---
name: confirm-craft-vs-graded-axis-when-user-narrows-scope
description: When a user narrows scope mid-Ideation, a term can be both an elicitation-craft principle and a graded axis; confirm which role survives before re-designing.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-14
session: 97d3ef5a-1b8a-4dab-b884-9f686e185b22
tags: [process]
keywords: [scope-narrowing, craft-vs-graded-axis, confirm-key-term-role]
author: claude
priority: high
domain: process
related: [scope-narrowed-to-design-craft]
---

# Confirm craft-vs-graded-axis role before re-designing on a scope-narrowing word

## What happened

Mid-Ideation, the user narrowed the `startup` skill rewrite from "add startup/commercial axes" to
"design-craft only — drop the commercial grading." The narrowing word ("drop the commercial axes")
could be read two ways: (a) drop every commercial-sounding SIGNAL entirely, including the interview
truth-serums ("demand ≠ interest," the pay-for/workaround evidence), or (b) drop only the commercial
GRADED-GATE role, while keeping the same underlying signals as elicitation-craft principles. The
correct reading was (b), confirmed only after building the design and having Project's evaluator
separately flag an over-scrub (`F-PROJ-MONEY-OVERSCRUB`) where "money already spent" was dropped
alongside the commercial axes even though it is a pure craft signal.

## Why it happens

A narrowing instruction that names a *category* (e.g., "commercial axes") is ambiguous about whether
it excludes the category's underlying *signals* everywhere they appear, or only its role as a
*graded gate*. The same behavioral-evidence fact (a user already spent money/effort/time to cope
with a problem) can serve two distinct jobs: proving a problem is REAL (interview craft, always in
scope) or proving a project is commercially VIABLE (a graded axis, explicitly out of scope here).
Treating the narrowing word as scoping the SIGNAL rather than the ROLE risks either under-cutting
(leaving a commercial gate alive under a craft label) or over-cutting (deleting a legitimate craft
signal because it shares vocabulary with the removed axis).

## Correct approach

When a user narrows scope mid-Ideation with a category-spanning term, explicitly surface the
craft-vs-graded-axis (or equivalent role) distinction and confirm which role is being cut before
re-designing — do not assume the narrower or broader reading silently. This session's applied
instance: the "demand ≠ interest" principle and the money/effort/workaround-already-spent signal
were kept as elicitation-craft principles (never converted to forward pricing/WTP), while the eight
commercial graded axes and their supporting machinery were locked fully out. This is the
scope-narrowing instance of a broader pattern — confirm a key term's ROLE before acting on an
instruction that names it — that also recurs in identity-line rewrites (a term can be a definition
vs a usage of that definition): before re-designing on a narrowing or renaming instruction, name the
term's candidate roles and confirm which one the instruction actually cuts or changes.

## How to detect

Any time a user narrows scope with a word that names a *category* spanning more than one *role* —
especially a term that can plausibly be read as "the underlying concept" vs. "one specific use of
that concept as a graded/mechanical gate" — before re-designing, ask (or explicitly reason through,
citing evidence) which role is being cut. A red flag in review: a scrub that removes a term
("money," "pricing," "risk") from multiple places without checking whether each occurrence plays the
excluded role or a different, still-in-scope role.

## Related

- [[scope-narrowed-to-design-craft]] — the design decision this mistake's lesson was extracted from
