---
name: python-coding-interface-narrowness-principle
description: Add interface-narrowness guidance as a standalone coding Principle 17 plus a specializing python 9th principle — soft strength, both layers.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-14
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [design, docs-sync]
keywords: [interface-narrowness, stamp-coupling, coding-principle-17, python-principle-9, api-legibility, caller-burden]
author: claude
supersedes: null
superseded_by: null
related: [python-compaction-band-exception]
---

# Add interface-narrowness as a standalone coding Principle 17 + a specializing python 9th principle

## Context

The user raised a design concern: agents expose interfaces like `ClassName(param: AnyDataClass)`
— a unit demanding a whole aggregate object as one opaque parameter, or a deeply-nested
boundary annotation the caller must decode. The key point is CALLER BURDEN: these patterns
force the caller to study a complex interface to use the unit, and the API reference stops
being self-documenting. The defect is the caller's cost, not a specific data shape. This was
raised on top of the resumed PR #349 python-compaction plan.

## Decision

Add the guidance at BOTH layers:

- **coding skill** — a NEW standalone Principle 17 ("Keep the Interface Narrow — demand the
  least the caller must understand"). It is the language-agnostic property; it specializes
  nothing and is NOT an extension of an existing principle.
- **python skill** — a NEW 9th principle specializing coding P17 (don't demand a whole
  dataclass/aggregate; prefer explicit narrow params, keyword-only, or a purpose-built value
  object / `Protocol` capturing exactly the used surface; don't force the caller to decode a
  nested annotation), plus a sharpened "Signatures and data models" judgment default and a
  design.md act.

Strength is SOFT — principle / judgment-default altitude, NOT a hard python invariant (the
H1–H18 hard invariants are safety footguns; API legibility is craftsmanship).

## Rationale

Two named anti-patterns were user-selected: (1) aggregate-object-as-a-param (stamp coupling)
— demanding a whole object where the unit uses a few fields; (2) deeply-nested / complex
boundary annotations the caller must decode. Prior art anchors the guidance: stamp vs data
coupling (Constantine/Yourdon), the Interface Segregation Principle (SOLID), Ousterhout's deep
modules / narrow interfaces, McConnell §7 ("pass only the parameters the routine needs"), and
Python-specific PEP 20 / keyword-only args (PEP 3102) / `Protocol`. A standalone coding
principle keeps the language-agnostic property visible across languages; the python 9th
principle carries the language-specific delta.

## Alternatives considered

- **Extend an existing coding principle (e.g. P2) instead of a new P17** — rejected (D4):
  interface narrowness is its own property, not a sub-case of another principle; a standalone
  principle is clearer and traceable.
- **Python-only, no coding-layer change** — rejected (D3): the property is language-agnostic,
  so the coding layer is the correct home for the general form; the user accepted the widened
  PR #349 diff.
- **A hard python invariant** — rejected (D5): API legibility is craftsmanship, not a safety
  footgun; a hard invariant would over-constrain and false-fail legitimate wide-but-cohesive
  signatures.

## Consequences

- coding grows to 17 principles (append, no renumber); Appendix A traceability table +
  coverage check + sources gain a Principle-17 row; coding/evaluation.md gains the matching
  lens/check.
- python grows to 9 principles; the evaluation.md legend crosswalk and Gate A live-locator set
  gain a `final P9` key; the python bundle grows (folded into the band-exception decision).
- A soft principle carries no scenario/check binding (a `final P9` legend row unreferenced by
  any check is EXPECTED, like `final P5`).
- The typescript sibling skill (out of scope this session) should reuse this principle.

## Related

- [[python-compaction-band-exception]] — the band-exception that accepts the union growth this principle contributed
