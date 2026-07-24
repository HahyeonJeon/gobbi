---
name: assumption-based-planning-signposts
description: Assumption-Based Planning (RAND) — name load-bearing assumptions, watch signposts, take shaping/hedging actions
type: references
scope: feature
feature: workflow
status: active
created: 2026-07-16
session: 2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [memory, design]
keywords: [planning, assumptions, signposts, replanning, rand]
author: codex
title: Assumption-Based Planning (RAND, Dewar)
source: https://www.rand.org/pubs/monograph_reports/MR114.html
accessed: 2026-07-16
ref_type: paper
---

# Assumption-Based Planning (RAND, Dewar)

## Insight
Assumption-Based Planning (ABP) is a five-step method: (1) identify the load-bearing assumptions underlying a plan; (2) identify each assumption's vulnerability within the planning horizon; (3) define signposts — observable indicators that an assumption is beginning to fail; (4) define shaping actions (to avert failure); (5) define hedging actions (to prepare for failure). This is the operational contract behind "explicit re-plan triggers": a trigger is a named assumption plus its signpost, not a vibe.

## Reason
Strengthens the generic skill's Principle 5 (plan-as-forecast) — a re-plan trigger must be concrete (a named assumption + the signpost that trips it), which makes Procedure P7's re-plan conditions checkable rather than hand-wavy. Surfaced by the Codex proposer.

## Source
- Dewar, Builder, Hix, Levin — "Assumption-Based Planning: A Planning Tool for Very Uncertain Times," RAND MR-114-A (1993).
- Landing page: https://www.rand.org/pubs/monograph_reports/MR114.html · full text (PDF): https://www.rand.org/content/dam/rand/pubs/monograph_reports/2005/MR114.pdf
- **Verification disposition — provenance locator, not acceptance evidence.** The extracted Insight above is the acceptance-bearing content; the live URL is provenance and must not serve as a pass condition. Evidence gathered 2026-07-16: the RAND landing returns HTTP 403 on direct fetch (rand.org blocks automated fetchers); corroborated via search — the canonical MR-114-A landing + a stable RAND CDN PDF exist and the five-step signposts methodology is confirmed. Retain the URL as provenance; use the PDF for full text.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-16 | 2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5 | generic planning Principle 5 + Procedure P7 |

## Related
- [[plan-execute-replan-triggers]] — the agent-side form of the same re-plan discipline
- [[reference-class-forecasting]] — the outside view that tests the assumptions
