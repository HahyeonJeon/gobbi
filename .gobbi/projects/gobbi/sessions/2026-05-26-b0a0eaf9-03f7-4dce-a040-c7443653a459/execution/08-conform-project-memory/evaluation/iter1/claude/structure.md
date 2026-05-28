# Structure — T8 conform features/project-memory (iter1, claude)

## Artifact Summary + Memory reads
(See project.md for full Summary.) Structure lens: frontmatter key organization, type-field correctness, allowlist discipline. Memory reads: memorization/rules.md §2.1/§2.2/§4.4; execution/evaluation.md Structure seeds.

## Locked Frame (Stage 1)
S1 each doc carries base + only its type's legitimate extensions — [c] 9 base present; [c] extensions legitimate for type/dir.
S2 type field correct per directory — [c] decisions=decisions, design=design, changelogs=changelogs, README=features.
S3 KEEP keys preserved (no over-strip) — [c] all pre-T8 KEEP keys still present.
S4 (adversarial) allowlist over-strips a legitimate key — [c] project/last_updated were over-stripped by T8, must be RESTORED at HEAD.

## Per-scenario per-check results
- S1: PASS. All 4 docs carry the 9 base keys in order. Extensions: README value_proposition+subsystems+project+last_updated; changelogs shipped_in; decisions title+domain+supersedes+superseded_by+decision_status+project; design topic+supersedes+superseded_by+related. All legitimate per §2.2 / KEEP.
- S2: PASS. type=design_flaw→decisions (fixed); status=final→active on design (fixed); changelogs type=changelogs; README type=features. Verified in frontmatter at HEAD.
- S3: PASS. Pre-T8 KEEP inventory (git show 54c0cde^): README {project,last_updated,value_proposition}; decisions {domain,project,superseded_by,supersedes,title}; design {topic}; changelogs {none}. All present at HEAD; design additionally gained supersedes/superseded_by/related (added, legitimate).
- S4: PASS (the over-strip was caught and fixed). dbe61c3 restores README project+last_updated and decisions project — exactly the two KEEP keys T8 over-stripped. The §4.4 KEEP list (line 231) does not literally name project/last_updated, but the brief's KEEP set + the 07c/07d precedent treat them as preserve-keys; restore is correct and minimal (+3 lines). No OTHER KEEP key missing vs pre-T8.

## Typed findings
None at PASS threshold. Allowlist discipline is sound after the restore; type fields corrected; no legitimate key lost.

## Low-confidence appendix
(none)

VERDICT: PASS
