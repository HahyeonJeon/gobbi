# Structure perspective — T0 §4 (iter1, claude)

**Lens:** Internal organization, section numbering, append integrity, cross-reference correctness.

## Verified
- Append placement: §4 inserted after §3 (line 142 boundary), before "## Cross-references". Numbering §4.1–§4.6 is sequential and well-nested (4.1.1 sub-heading for type-purity). No collision with §1-3.
- Pure append: diff has 0 deletion lines; §1-3 byte-identical.
- Cross-refs resolve to real targets: §4.3 cites `mistakes/design-literal-retire-instruction-without-replacement.md` (exists), `memory-map.md`, `templates/`. §4.2 cites `memorization/templates/{type}.md` (templates dir verified to contain notes/learnings/decisions/mistakes.md). §4.4 cites §2.1/§2.2/§2.2 line 110 — line 110 in current file is indeed the `backlogs | ... disposition: open|deferred` row. Accurate.
- §4.2 contract table matches actual templates (notes, learnings, decisions = exact; mistakes ≈ equivalent). Internal claim "obeys the same section contract its staging template encodes" is true.

## Findings
**ST-1 — §4.2 mistakes-row labels diverge from template wording (Type: general; Domain: docs-sync; Disposition: open; Confidence: 100; Severity: Low)**
- Evidence: §4.2 mistakes contract = `What happened → Why it happens → How to recognize → Corrected approach` (rules.md:178). The actual `templates/mistakes.md` item-template uses `What happened / Why it happens / Correct approach / How to detect` (+ `User feedback`). Labels "How to recognize" vs "How to detect" and "Corrected" vs "Correct" differ, and order differs (recognize-before-correct vs correct-before-detect).
- Why it matters: §4.2's premise is that the promoted body matches its TEMPLATE; for `mistakes` the section names won't literally match, so a strict section-name checklist would mis-score. Semantically equivalent, so impact is low.
- Suggested direction: align §4.2 mistakes-row wording/order to `templates/mistakes.md`, or have §4.2 state it lists canonical section *intent* not literal headings.

## Verdict
PASS — structurally clean append; one Low label-sync nit.
