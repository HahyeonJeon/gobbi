# Structure Perspective — Wrap-up promotion + handoff (iter1, claude)

## Frame
Are the promoted files placed in the correct directories, named per the §1 naming standard, carrying the correct base + per-type extension frontmatter, and structured per the §4.2 section contracts?

## What I verified
- **Routing destinations correct.**
  - 2 mistakes (`mistake-candidate: true` in staging) → `mistakes/` (project scope, `feature: null`). Correct per templates/mistakes.md + rules §3.
  - 2 decisions (no mistake flag) → `features/workflow/decisions/`. Correct per rules §3 "Both" type, feature-level default.
  - 3 deferred Low → `features/workflow/backlogs/`. Backlogs is a "Both" type; feature-level placement correct.
  - 1 layer2 → `skills/mistake/layer2-verify-state-from-authoritative-source-not-proxy.md`. Matches existing layer2-*.md siblings.
- **Naming.** Mistakes are bare-slug (evergreen) per §1.2; decisions are date-prefixed (`2026-06-07-…`) per §1.2; backlogs bare-slug; layer2 `layer2-{slug}`. All ≤6 words, kebab-case, subject-naming (no positional/cryptic tokens). Conformant with §1.3.
- **Frontmatter — promoted mistakes.** Both carry base 9 + `priority: high` + `domain: process` + `supersedes/superseded_by: null`. Matches templates/mistakes.md §2.2. `mistake-candidate` stripped (grep confirmed absent).
- **Frontmatter — promoted decisions.** Both carry base 9 + `supersedes/superseded_by` + `decision_status: accepted`. `decision_status` is a LEGITIMATE decisions extension (§2.2 line 105) and on the KEEP list (§4.4 line 238). Retaining it is correct; all 9 project decision files carry it.
- **Section contracts (§4.2).** Both mistakes: `## What happened` → `## Why it happens` → `## Correct approach` → `## How to detect`. Matches the mistakes contract. Journal: notes contract sections present (What happened / What got stuck / What shifted / Decisions to respect / Next session). Layer2: 4 mistake sections + `## Layer-2 note`. Decisions: ADR shape (Context/Decision/Rationale/Alternatives/Consequences) present in both.
- **Conformance gate.** Ran the canonical §4.5 archive-safe underscore-aware gate over all project memory → ZERO leak files. Confirms structural frontmatter conformance.

## Findings
None structural. Placement, naming, frontmatter shape, and section contracts all conform to the memorization standard.

## Verdict
PASS
