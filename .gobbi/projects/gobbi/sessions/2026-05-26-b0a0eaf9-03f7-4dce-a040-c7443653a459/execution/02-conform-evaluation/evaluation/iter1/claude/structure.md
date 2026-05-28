# Evaluation — Structure Perspective (Claude)

## Frame
Do the conformed docs respect §1 (naming/placement), §3 (atomicity/scope), and §4.2 per-type section contracts?

## Verified
- **Placement:** every file sits under the correct type subdir (`decisions/`, `design/`, `discussions/`, `references/`, `changelogs/`, README at feature root). PASS.
- **Naming:** date-prefixed types (changelogs, the dated discussion) carry `YYYY-MM-DD-`; evergreen types are bare-slug. No positional/cryptic slugs introduced. PASS.
- **§4.2 section contracts:** decisions docs read ADR-ish (Context/Question → Decision/Resolution → Rationale/Action); discussions follow Q/A/impact shape; design docs carry chosen-direction + rationale + alternative. PASS.
- **Atomicity:** no bundle files; each doc is one concept. PASS.

## Findings
**F-STRUCT-1 — decisions docs use heterogeneous H2 shapes (not strict ADR)** — Type: `checklist_gap` · Domain: `docs-sync` · Severity: Low · Confidence: 50 · Disposition: open
Evidence: §4.2 prescribes decisions = `## Context → ## Decision → ## Rationale → ## Alternatives considered → ## Consequences`. The conformed decisions use `## Question / ## Resolution / ## Evidence / ## Action / ## Shipped in / ## User-selection note` (e.g., `coverage-ownership-matrix-row-text.md`, `constraints-body-block-kept-per-h2-lock.md`). These are pre-existing shapes the conformance pass did not (and per scope, should not) restructure — T2 is mechanical frontmatter+de-crypt, not a body-section rewrite. Why it matters: strict §4.2 conformance is not fully met, but enforcing it was out of T2 scope. Direction: a future §4.2 section-contract pass; not a T2 defect.

## Must-preserve
- Correct subdir placement and bare-slug/date-prefix naming discipline.

VERDICT: PASS
