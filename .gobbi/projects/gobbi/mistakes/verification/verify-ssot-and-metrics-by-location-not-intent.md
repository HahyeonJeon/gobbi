---
name: verify-ssot-and-metrics-by-location-not-intent
description: A design's SSOT-ownership and reduction-metric claims must be verified by grep/measurement, not by the concept's intent.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-07
session: 122609f7-3c4c-44ea-af90-efe1531a5cbf
tags: [verification, refactor, evaluation]
keywords: [ssot-ownership, hoist-then-point, honest-metrics, content-vs-line-reduction]
author: claude
priority: high
domain: verification
---

# SSOT-ownership and reduction-metric claims must be verified by location/measurement, not intent

## What happened

The iter1 draft of the workflow-doc compaction design asserted SSOT-ownership — "the no-commit
git-mechanics rule's owner is `record.md`" — and reported a reduction metric — "184 → 113 lines,
39%, hits the ~40% target" — on the strength of what those claims were SUPPOSED to be true
(the concept/intent), not on what an exhaustive check showed. A form-covering grep in iter2
showed the no-commit rule lives ONLY in the 5 loop docs (`ideation.md:117`,
`preparation.md:98`, `planning.md:96`, `execution.md:87`, `wrap-up.md:43`) — `record.md` has
ZERO hits. And the honest content-based reduction (words 2,046 → 852; chars 16,487 → 6,729) is
58-59%, not the flattering line-based 39% the draft led with — the line percentage was itself
inflated low by the draft's own re-wrapping of long unwrapped source lines into ~90-char prose.

## Why it happens

This is claim-by-intent instead of claim-by-location/measurement — a form of the blast-radius
trap ([[blast-radius-map-from-named-files-not-exhaustive-grep]]: the ownership map was built
from what the concept SHOULD point to, not an exhaustive grep of where the content actually
lives today) combined with the clean-verdict trap
([[clean-verdict-unreliable-without-edge-case-stress]]: a single plausible metric was reported
and trusted without stress-checking it in the unit that actually matters). Both traps share the
same root: a claim that sounds correct on the concept's own terms is treated as verified,
without independently checking the concept against the artifact it describes.

## Correct approach

Verify every SSOT-ownership claim by grepping where the content ACTUALLY is TODAY, not where
the design intends it to end up. When the grep shows the intended owner does not yet hold the
content, hoist the content into that owner FIRST, then point at it — never point at content the
owner does not hold ("hoist-then-point"). Report reduction / improvement metrics in the unit
that is meaningful to the reader (content: words/chars), not the unit that happens to look best
(lines, when re-wrapping alone can move that number). Stress-check every "passes the target" /
"hits the goal" claim before it ships in a design doc, the same way a "clean" review verdict
must be cross-checked before it is trusted.

## How to detect

Any design, refactor, or compaction claim of the form "concept X's owner/SSOT is Y" or "this
change achieves N% reduction / hits the target" that was not independently verified by (a)
grepping the actual current location of the content in question, or (b) measuring the claimed
improvement in the unit that matters to the reader (not just the unit that is easiest to quote
or that looks best). A design doc that states an ownership fact or a headline metric without a
"verified per block" table or an honest secondary measurement alongside it is a candidate for
this trap.

## Related

- [[blast-radius-map-from-named-files-not-exhaustive-grep]] — the enumeration discipline this mistake is a form of
- [[clean-verdict-unreliable-without-edge-case-stress]] — the verification discipline this mistake is a form of
