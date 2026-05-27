# Aesthetics — T8 conform features/project-memory (iter1, claude)

## Artifact Summary + Memory reads
(See project.md.) Aesthetics lens: title/heading clarity, naming, prose readability after de-cryption. Memory reads: mistakes/naming-standard-needs-positive-guidance; memorization/rules.md §4.1/§4.3.

## Locked Frame (Stage 1)
S1 0 cryptic-led titles/headings in the 4 docs — [c] every H1 concept-first.
S2 de-cryption reads as self-contained prose — [c] no dangling "I6"/"item B"/"Concern 2".
S3 names (frontmatter `name`) are subject-names, not positional — [c] kebab subject slugs.
S4 (adversarial) de-cryption introduces an awkward/ambiguous phrasing — [c] read each rewritten sentence.

## Per-scenario per-check results
- S1: PASS. H1s: "Feature: Project Memory" / "Bundle A re-homed — project-memory's share" / "Path conventions anchor casing — promote to H3" / "Memorization Moment-of-Capture Core Principle". The "Design B —" cryptic prefix was removed. All H2/H3 headings concept-first. 0 cryptic-led titles.
- S2: PASS. Advisory leak scan (T\d+-, iter\d, COD-\d, row-\d, Concern \d, item [A-Z], \bI\d\b, Task \d) over all 4 bodies → clean. The `**Anchored insight**: I6.` line (a bare insight coordinate) was removed; no orphan reference remains.
- S3: PASS. `name:` values are subject-names (project-memory, bundle-a-rehome, path-conventions-anchor-casing, memorization-moment-of-capture) — consistent with naming-standard positive guidance.
- S4: PASS. Rewrites read cleanly: "during the memory-system redesign (artifact re-home task)", "per the redesign routing rule (design §8)", "scoped to the site needing the stable anchor", "Adopted in planning session". No awkwardness or lost meaning.

## Typed findings
None at PASS threshold. Titles and prose are exemplary post-de-cryption.

Observation (Low): the design doc uses bold-label paragraphs (**Chosen direction**, **Rationale**, …) rather than H2 sections — slightly less scannable than ADR H2s, but pre-existing and out of mechanical scope. Not a T8 finding.

## Low-confidence appendix
- design-doc bold-label vs H2 sections — Type: general, Domain: docs-sync, Confidence 25, Severity Low, Disposition: deferred (pre-existing, out of scope).

VERDICT: PASS
