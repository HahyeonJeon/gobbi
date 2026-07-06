---
name: d3-002-d1-002-co-locate-at-auto-mode-line-81
description: iter1 Claude findings F-CONSIST-01 / F-OVERALL-02 — D3-002 and D1-002 share auto-mode.md line 81, understated as independent; resolved at iter2 with a sequencing note
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [ideation, docs-sync]
keywords: [f-consist-01, f-overall-02, d3-002, d1-002, auto-mode-line-81, sequencing]
author: claude
related: [d3-002-manager-refs-specialist-phase-loads-column-split, d1-002-canonical-pointer-replaces-drifted-routing-table]
---

# D3-002 and D1-002 co-locate at `auto-mode.md:81`; "independent" framing understated the row adjacency (F-CONSIST-01 / F-OVERALL-02)

## Context

The iter1 draft labeled D1-002 as "not clustered with D3-001/D3-002 (different file: workflow/evaluation.md)"
and clustered only D3-001+D3-002. The Claude iter1 Consistency evaluator (F-CONSIST-01, Type `design_flaw`,
Domain `docs-sync`, Severity Medium, Confidence 75) found that D1-002's sole live inbound anchor
(`#routing-findings-to-record`) lives in the ACTION column of `auto-mode.md:81` — the Ideation-loop RECORD
row — and D3-002's structural split EDITS the REFS cell of that exact same row. The Stage 3 Overall pass
elevated the same fact to cross-perspective visibility as F-OVERALL-02 (same evidence, same finding, no
independent content — see § Consequences).

## Decision

Add an explicit Execution-sequencing note in BOTH the D3-002 and D1-002 blast-radius sections: the two tasks
share `auto-mode.md:81` (different cells, same row). Sequence the D3-002 and D1-002 tasks; after both, verify
`#routing-findings-to-record` still resolves via `check-markdown-links.sh`. Carry this coupling into
Planning as an explicit note, not an assumed independence.

## Rationale

The underlying design direction was already safe — D3-002 never touches the Action cell, and D1-002 keeps
the heading regardless of sequencing — but the "independent" framing hid a real coordination dependency: if
the two fixes ship in separate, unordered Execution tasks/PRs, a writer restructuring the row for D3-002
could disturb the Action-column anchor link without realizing D1-002 depends on it staying intact. Naming
the adjacency explicitly removes that risk without changing either design's content.

## Alternatives considered

- **Leave the two fixes framed as fully independent, since neither's DESIGN conflicts with the other.**
  Rejected — the finding is about EXECUTION-ordering risk, not design conflict; an accurate blast-radius
  section names the sequencing risk even when the underlying design is safe.
- **Merge D3-002 and D1-002 into one combined design decision, since they share a row.** Rejected — they are
  two independently-locked decisions (Option S and Option A) with distinct rationale and scope; the fix is a
  coordination note, not a design merge.

## Consequences

The Claude iter2 Risk and Consistency evaluators confirmed: "Disposition: addressed. Co-location sequencing
+ anchor-preservation now in both blast-radius sections, S6, checklist, Decisions Log; live tree confirms the
coupling." Planning must sequence the D3-002 and D1-002 tasks (or bundle them in one task over the shared
row) and verify the anchor resolves after both land.

**F-OVERALL-02 note.** The Stage 3 Overall pass (iter1) separately scored this same fact as F-OVERALL-02
("elevates F-CONSIST-01 to cross-perspective visibility") for cross-perspective aggregation purposes. It
carries no evidence beyond F-CONSIST-01's own citation of `auto-mode.md:81`, so it is recorded here rather
than as a separate file — its resolution is identical to F-CONSIST-01's above.

## Related

- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — the design whose blast radius this note
  extends
- [[d1-002-canonical-pointer-replaces-drifted-routing-table]] — the design whose blast radius this note
  extends
