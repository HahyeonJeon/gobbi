# Structure — T9c iter2 re-run (commit c001694)

## Locked Frame (Stage 1)
- **S-STR-1** Frontmatter block is well-formed (valid YAML, 9 base keys, correct ordering).
  - [x] All 8 evaluated docs carry the 9 base keys (name/description/type/scope/feature/status/created/session/tags) — base-key sweep printed "ALL 9 PRESENT".
- **S-STR-2** type values are correct per §2.2: READMEs=notes, reviews doc=reviews.
  - [x] 6 READMEs `type: notes`; reviews doc `type: reviews`. Both valid enum values.
- **S-STR-3** Placeholder body preserved beneath frontmatter (no structural rewrite).
  - [x] Diff shows pure prepend on 6 READMEs; original placeholder line retained verbatim.
- **S-STR-4 (adversarial)** Did the additions break any existing per-type extension structure on the reviews doc (review_kind/subject/verdict block)?
  - [x] Reviews doc retains review_kind, reviewed_artifact, reviewer, perspectives, overall_verdict, status, related_reports, related_decisions — all pre-existing extensions intact.

## Stage 2 findings
None. Structure is sound: additive frontmatter, no abstraction or body reshaping. The reviews doc reorders `date`→`created` cleanly within the frontmatter block; no orphaned or duplicated keys.

VERDICT: PASS
