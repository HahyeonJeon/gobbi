---
name: four-ideation-forks
description: Four locked forks for the scenario+checklist SOP work — two sibling skills, full-expanded taxonomy, Option A relationship, both skills this session.
type: decisions
scope: feature
feature: scenario-checklist
status: accepted
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [ideation, design]
keywords: [scenario, checklist, sop-skills, scope-contract]
author: claude
related: [author-declared-primary-category, ideation-finalization-then-lock]
---

# Four locked forks for the scenario + checklist SOP skills

## Context

The Ideation loop needed the user to resolve four open forks before the design could proceed past
framing: how many skills to author, how wide the coverage taxonomy should be, how the two skills
relate to each other, and how much of the work to do in this session. These forks anchor the Scope
Contract (`outputs/design.md` §1) and were locked once, not relitigated across the 5 Ideation
iterations.

## Decision

1. **Two sibling skills** — `scenario/SKILL.md` (primary) and `checklist/SKILL.md` (derived), not one
   combined skill.
2. **Full-expanded taxonomy** — the complete 10-category × 8-case-type model (design draft §4), not a
   smaller starter set.
3. **Relationship = Option A** — additive now; per-phase caller wiring and the conformance sweep of the
   6 bundles / 12 scenario+checklist docs are deferred to a later session (design draft §8), not bundled
   into this Ideation scope.
4. **Both skills, this session** — author `scenario` first, then `checklist`, in the same Execution
   pass, rather than splitting them across sessions.

## Rationale

- Two sibling skills keep the one-way, acyclic `scenario → checklist` relationship enforceable at the
  skill boundary (§3): `checklist` may read a scenario set; `scenario` never reads or constructs checks.
  A combined skill would blur that boundary.
- The full taxonomy was chosen over a smaller starter set because the 7 evaluation perspectives + the
  9-row Coverage Ownership Matrix already imply all 10 coverage concerns (design draft §0 Research→
  Decision ledger) — a smaller set would silently under-cover categories the project already tracks
  elsewhere.
- Option A (additive, wiring deferred) keeps this Ideation's Scope Contract from expanding into a
  cross-cutting rewrite of 6 existing phase bundles — a materially larger, riskier change that deserves
  its own Ideation loop.
- Authoring both skills in one session was chosen so the `scenario`→`checklist` handoff could be
  validated end-to-end (a fresh agent loading only `checklist/SKILL.md` reading a `scenario` set that
  was actually produced by `scenario/SKILL.md`) rather than validated against a hypothetical.

## Alternatives considered

- **One combined skill** — rejected: conflates two coherent capabilities (design draft §0 load-bearing
  assumption) and makes the one-way acyclic boundary a matter of internal discipline rather than a
  structural one.
- **A smaller starter taxonomy** (e.g., only the golden/failure axis) — rejected: reproduces the
  conflation the current per-phase docs already have, where "category" means both the coverage axis and
  the Good/Bad/Adversarial face.
- **Option B / immediate wiring** — rejected: would require editing all 6 existing `scenario.md` +
  `checklist.md` bundles plus `evaluation.md` in the same pass as authoring two brand-new skills,
  violating the Out-of-Scope "zero semantic change to the eval bundle" boundary.
- **Splitting `scenario` and `checklist` across two sessions** — rejected: risks a `checklist` skill
  written to an assumed, not actual, `scenario` output shape.

## Consequences

- Planning decomposes into ordered tasks for `scenario/SKILL.md` first, then `checklist/SKILL.md`,
  inside this one session.
- The per-phase pointer wiring + conformance sweep become a tracked deferred item (staged separately;
  see the backlog entry) rather than in-scope work.
- The no-touch gate (`outputs/design.md` §1 Success Criteria) enforces the "zero semantic change to the
  eval bundle" boundary mechanically for the rest of this session.

## Related

- [[author-declared-primary-category]] — a downstream decision inside the full-expanded taxonomy this
  fork locked
- [[ideation-finalization-then-lock]] — how the design produced under these forks reached LOCKED status
