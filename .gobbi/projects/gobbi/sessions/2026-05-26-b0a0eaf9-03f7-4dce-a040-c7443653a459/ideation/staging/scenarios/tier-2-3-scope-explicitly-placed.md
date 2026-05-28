---
name: tier-2-3-scope-explicitly-placed
description: User-ratified tier-2 and tier-3 scope items must be explicitly enumerated in the Scope Contract (not folded or implied).
type: scenarios
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [scope-contract, tiers, planning-readiness]
finding-iter: 1
finding-id: codex-f3
disposition: addressed
addressed-in: iter2
---

# Tier-2 and tier-3 scope items must be explicitly placed in the Scope Contract

**Category:** edge-case
**Coverage:** covered

## Situation

The user ratified a 3-tier scope in discussion-log Q4: (1) standard + content rewrite [primary],
(2) skills/principles [optional], (3) organization & navigation. The iter1 Scope Contract only
enumerated tier-1 items and hand-waved that lower tiers were "folded into the in-scope waves."
This can cause Planning to silently drop a user-ratified scope tier.

## Inputs

- `discussion-log.md` Q4: "Cover all three; priority = (1) standard+content rewrite, (2)
  skills/principles [optional, not mandatory], (3) organization & navigation."
- iter1 Scope Contract In-Scope: only tier-1 items enumerated; tier-2/3 not labeled.

## Expected behavior

Every user-ratified scope tier is explicitly named in the Scope Contract's In-Scope block with:
- Its priority label (primary / optional / tertiary).
- Its bounded definition (what it covers, what it excludes).
- Its deferred items (what is explicitly out of scope for this tier this session).

If a tier's content was decided to not ship this session, that must be stated directly ("not this
session") rather than left implicit.

## Verification

At Planning briefing: the Scope Contract enumerates all three tiers as separate labeled
In-Scope blocks, each tracing to the relevant discussion-log exchange.

## Related

- `ideation/evaluation/iter1/codex/overall.md` (F3, Medium/85)
- `ideation/artifacts/scope-contract.md` (§In-Scope now enumerates tier 1/2/3)
- `ideation/rawdata/discussion-log.md` (Q4: scope spine)
