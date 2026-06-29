---
name: review-md-points-taxonomy
description: Design for the 13-point code-review taxonomy — per-point authoring shape, seed coverage map, external reference anchors
type: design
scope: feature
feature: coding
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [design]
keywords: [taxonomy, 13-points, seed-coverage, per-point-shape, signal-table, principle-trace]
author: claude
supersedes: null
---

# Design: `review.md` code-review points taxonomy (13 points)

## Problem

A standalone code-review child doc (`skills/coding/review.md`) needs a comprehensive set of first-class review points that (a) covers all 8 user seeds with depth parity and (b) covers the full breadth of review dimensions. No existing gobbi doc provides this in reviewer-facing form.

## Scope

- The taxonomy is the breadth base for `review.md` authoring (Execution scope).
- Each point uses a consistent per-point authoring shape.
- Language coverage: general points with Python + TypeScript illustrations in property-led signal tables. No language-siloed sections.
- All principle traces reference `coding/SKILL.md` principle numbers, except behavioral principles which reference `principles/SKILL.md` with the source skill named.

## Approach

### Per-point authoring shape

Every taxonomy point follows this structure:
```
### N. <Review Point>
**Check** — what the reviewer inspects.
**Why** — why it matters + the principle(s) it checks (with source skill).
**Signals** — property-led table: | General signal | Python example | TypeScript example |
**Finding mapping** — likely gobbi Type + Domain; "blocks when …" (derived from Severity+threshold).
**False positive to avoid** — the over-eager rejection this point invites.
```

### The 13 points

| # | Review Point | Seeds covered | Primary coding/SKILL.md trace |
|---|---|---|---|
| 1 | Scope & requirement fit | — | P8, P5, P10 |
| 2 | Public API & caller ergonomics | seed 3 | P2, P3 |
| 3a | Naming consistency | seed 1 | P5 |
| 3b | Naming quality / industry-consensus terms | seed 2 | P5 |
| 4 | Necessity & simplicity | seed 4 | P3, P8, P12 |
| 5 | Architecture, classes & methods | seed 7 | P3, P4 |
| 6a | Import consistency | seed 5 | P4, P5, P15 |
| 6b | File & directory structure | seed 8 | P4, P5 |
| 7 | Data flow, state & side effects | — | P16, P6 |
| 8 | Error handling, trust boundaries & dependencies | — | P10 |
| 9 | Tests & verifiability | — | P6 |
| 10 | Performance & resource use | — | P14, P11 |
| 11 | Comments, docstrings & public docs | seed 6 | P13 |
| 12 | Consistency & blast radius | — | P15, P12 |
| 13 | Review communication | — | principles/SKILL.md P7 (Say/Write Plainly); see checklist `review-communication-principle-trace` |

**Notes on combined points:**
- Points #3 and #6 each have TWO sub-points (3a/3b, 6a/6b) with full depth parity: each sub-point gets its own Check, Signals row, and false-positive.
- Point #13 trace must be disambiguated in Execution — "P7" alone is ambiguous between `coding/SKILL.md` P7 (Build Bottom-Up) and `principles/SKILL.md` P7 (Say/Write Plainly). See `features/coding/checklists/process/review-communication-principle-trace.md`.

### External reference anchors per point

| # | External anchors |
|---|---|
| 2 | Bloch "API design"; sklearn "consistency + non-proliferation"; cross-library API consensus (NumPy/PyTorch) |
| 3a/3b | Bloch "names matter"; least astonishment principle |
| 6a | PEP 8 imports; TypeScript named exports + type-only imports |
| 6b | TypeScript barrel entry-point convention |
| 11 | PEP 257; Bloch "document every exported element" |
| 13 | Google "code review comments"; Conventional Comments labels + decoration mapping |

### 8-seed coverage map

seed 1→#3a, seed 2→#3b, seed 3→#2, seed 4→#4, seed 5→#6a, seed 6→#11, seed 7→#5, seed 8→#6b.

## Scenarios

- **A1** — New public API diff: points #2, #3a/3b, #11, #9 all fire.
- **A2** — Over-structured small change: point #4 (necessity/simplicity) fires on the unneeded wrapper.
- **A3** — Bug fix: point #1 (scope), #8 (error handling), #9 (tests) all fire.
- **A4** — Structural refactor: points #6a/6b, #12 (blast radius) fire.
- **A5** — Trust-boundary change: point #8 fires; Python + TS examples in property-led table, no language-siloed section.
- **A6** — Docs change: point #11 fires; checks compact summary line, no stale param, necessary rationale.

## Validation

- [ ] All 13 top-level points present (with #3 and #6 each having two full sub-points).
- [ ] Every point has the full per-point authoring shape.
- [ ] All principle traces name the source skill (coding/SKILL.md or principles/SKILL.md) unambiguously.
- [ ] Point #13 trace is disambiguated (see `review-communication-principle-trace.md` checklist).
- [ ] Property-based language-silo check passes (see `language-silo-validation-method.md`).
- [ ] 8-seed coverage map verified against finished doc.

## Trade-offs

- **13 points is large**: the user explicitly chose comprehensive breadth. Changed-surface prioritization (Phase 3 of the procedure) keeps reviews manageable by focusing on the most-changed surfaces first.
- **Combined points #3 and #6**: preserves 13 top-level points while meeting depth-parity requirement via sub-points. Alternative (15 points) rejected as unnecessary structural change.
- **Point #13 (Review Communication) as first-class**: not a structural principle but a behavioral one. Keeps the playbook self-contained; traces to external references + a behavioral principle.

## Open issues

- Point #13 principle trace disambiguation (codex-structure-002, Med/100): must be resolved in Execution. See `features/coding/checklists/process/review-communication-principle-trace.md`.
