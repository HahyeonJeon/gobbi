---
loop: execution
iter: 2
artifact_type: change-summary
created_at: 2026-05-28
status: final
supersedes: []
related:
  - artifacts/verification-report.md
  - artifacts/memory-reads.md
---

# P7b Change Summary — Full normalize 31 active mistakes + 2 reviews + 1 rule

## Scope

Task P7b was the last prose-content task in the PROSE wave. It covered the full normalization of
the remaining project-tier mistake records (31 active), 2 review records, and 1 rule record to the
§4.2:178 contract, plus reshape of 3 ADR-shaped mistakes and a frontmatter fix on 1 review.
READMEs were deferred to N1.

## Commits

- `a7d8253` — iter1: 31 mistake files normalized (heading SET + wording to §4.2:178; 3 ADR-reshapes;
  2 review records; 1 rule record; frontmatter fix on 1 review). 31 files changed.
- `456534b` — iter2: 29 files changed. Remediated all 4 Codex REVISE findings (F1–F4 below).

## What changed

### Mistake records (31 active)

All 31 active mistake records were normalized to the §4.2:178 heading contract:
- Required H2 set: `## What happened`, `## Why it happens`, `## Correct approach`, `## How to detect`
- Arrow-ordered sequence per §4.2: What happened → Why it happens → Correct approach → How to detect
- ADR-shaped mistakes reshaped (3 records): Context/Decision/Rationale/etc. H2s removed; content
  folded into the §4.2 four-section structure
- Non-contract H2s removed from all records: 3 "Context" sections, 1 "Ground truth" section, 1
  "Witness" section — content folded into the nearest §4.2 section

### Review records (2)

Both review records confirmed to match their templates. One review was missing its `base-schema`
frontmatter field; that field was added (iter1).

### Rule record (1)

The `stub-redirect-format` rule was confirmed to the rules template shape (no H2 restructuring
needed; body preserved verbatim).

### Specific iter2 fixes

- **F1 — Content loss on manager-context-overflow mistake**: The precise prior-session witness
  identifier `2026-05-23-7ea62d36` had been stripped to a vague "A prior session"; restored to the
  exact session ID. A wrong-date placeholder `2026-05-22` was also corrected to `2026-05-23`.
- **F2 — Section order**: 26 of 31 mistakes had `## How to detect` before `## Correct approach`,
  opposite of §4.2's arrow-ordered contract. All 26 files reordered to What → Why → Correct → HtD.
- **F3 — Non-contract H2s**: 5 non-contract H2s folded (3 "Context", 1 "Ground truth", 1 "Witness").
- **F4 — Broken cross-refs**: 4 broken cross-references fixed, including one that pointed to an
  archived path — repointed to the live target.

## Files touched

- 31 mistake records under `.gobbi/projects/gobbi/mistakes/`
- 2 review records under `.gobbi/projects/gobbi/reviews/`
- 1 rule record under `.gobbi/projects/gobbi/rules/`
- Total across both commits: 60 file-touches (31 + 29, with overlap on reordering pass)
