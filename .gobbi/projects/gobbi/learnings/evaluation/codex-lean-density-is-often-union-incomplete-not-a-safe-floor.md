---
name: codex-lean-density-is-often-union-incomplete-not-a-safe-floor
description: When the Codex proposer lands a compaction leaner than the Claude producer, the gap is often DROPPED union, not compressible filler — verify before trimming to peer density.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-14
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [evaluation, docs-sync, process]
keywords: [codex-proposer, union-complete, compaction, density-floor, lean-draft, band-exception]
author: claude
supersedes: null
superseded_by: null
related: [dual-system-catches-union-narrowing-in-compaction, dual-system-caught-broken-teaching-example, compaction-line-savings-overestimate]
---

# The Codex proposer's leaner draft is often union-INCOMPLETE, not a safe density floor

## Insight

When the Codex proposer or peer lands a compaction LOWER (fewer words) than the Claude
producer with apparently "equal union," do NOT assume the gap is compressible filler the
producer over-kept. Verify: repeatedly the Codex-lean count came from DROPPED union that the
dual-system EVALUATION then caught and forced restored. The union-complete floor is HIGHER
than the leanest proposer draft, so a "tighten to peer density" pass recovers only genuine
filler (tens of words), not the full producer-vs-peer gap.

## Context

Across the python-skill T4–T8 compaction, the Claude producer's per-doc word counts ran
consistently ABOVE the Codex peer's, which read as "the producer over-keeps prose density."
But every large slice of that gap turned out to be union the Codex peer had DROPPED and the
dual-system evaluation had caught and restored: the `RetryBudget` good branch and the
`AppConfig` unused fields in `design.md`, two conditions in `typing.md`/`convention.md`, six
named primitives in `concurrency.md`/`performance.md`, and a directory-fsync durability
mechanism plus named APIs in `interoperability.md`. The manager initially mis-projected the
final aggregate at roughly 25,258 words by treating the Codex-peer density as the reachable
floor; the union-complete reality was roughly 27,400, and a real prose-tighten pass recovered
only about 91 words of true filler across two docs (design 2,655→2,591, convention 1,965→1,938).
The band was then exceeded on purpose (see the band-exception decision).

## Reason

If this is lost, a future compaction session will read a lower peer count as proof its own
draft is padded and trim toward it — re-dropping exactly the union the dual-system evaluation
already paid to catch and restore. Word-band targets get set from the leaner draft, making the
union-complete result look "over band" when it is actually at its floor. The correct mental
model is: leaner ≠ better when the leanness came from dropped conditions; union completeness
is the binding property, and its floor is above the leanest draft.

## How

When the Codex peer/proposer lands leaner than the producer, treat the delta as a
verification target, not a trim target: diff the peer's draft against the union-complete
producer draft at named-primitive granularity and classify each missing item as (a) genuine
filler the producer can drop or (b) union the peer dropped. Only trim the (a) items. Project
the final aggregate from the union-complete floor, not the peer's count. If the union-complete
floor exceeds the word band, that is a band-exception, not a signal to trim.

## Counter-cases

- **A peer draft that is leaner AND union-complete** (verified by the same diff) is a real
  filler win — trim toward it. The insight is "verify the leanness is union-complete before
  trusting it," not "always distrust a leaner peer."
- **A pure prose pass with no source conditions at stake** (a rename, a formatting fix) has no
  union to drop — peer density comparison is safe there.

## Related

- [[dual-system-catches-union-narrowing-in-compaction]] — the prior-session learning this extends: Codex catches union-narrowing structural checks miss
- [[dual-system-caught-broken-teaching-example]] — this session's companion catch (broken example + named-primitive drops)
- [[compaction-line-savings-overestimate]] — the related trap of over-estimating how much a compaction can shrink
