# Consistency — T8 conform features/project-memory (iter1, claude)

## Artifact Summary + Memory reads
(See project.md.) Consistency lens: does T8's output match the §4 standard, the rest of the conformed tree, and itself? Did de-cryption preserve meaning? Memory reads: memorization/rules.md §4.4 KEEP + §4.2 contracts; prior conform commits (07c/07d/T4/T5).

## Locked Frame (Stage 1)
S1 conformance consistent with sibling-feature conform passes (07c/07d kept project/last_updated) — [c].
S2 commit message matches the diff — [c] no over/understatement.
S3 KEEP-restore consistent with §4.4 + brief KEEP set — [c].
S4 de-cryption preserves the original meaning (no semantic drift) — [c] each rewrite.
S5 (adversarial) frontmatter conforms but body now misleads (§4.2 ADR mismatch) — [c].

## Per-scenario per-check results
- S1: PASS. dbe61c3 explicitly aligns project/last_updated retention with 07c/07d. The 9-base-key + S-strip pattern matches T3/T4/T5/06/07 conform commits across the tree.
- S2: PASS. T8 commit body claims "Add 9 base keys / Strip S-set / Preserve KEEP / Fix type field / De-crypt / No body reshaping; no narrative deleted" — every claim verified against the diff. One nuance: the T8 body lists "project, last_updated" under *stripped* keys, which contradicts the KEEP intent — but dbe61c3 corrects this and its message accurately says T8 over-stripped them. Net state at HEAD is consistent.
- S3: PASS. KEEP-restore adds exactly project+last_updated (README) and project (decisions). No other pre-T8 KEEP key is missing (verified vs 54c0cde^): related/supersedes/superseded_by/domain/title/decision_status/shipped_in/value_proposition/topic/subsystems all present where they were (or legitimately added).
- S4: PASS. Semantic preservation verified: "§8 rule 1"→"design §8 routing rule" (same rule), "T02/T04 project-memory secondary"→"project-memory secondary routing" (same fact), "Cross-Link 7"→"cross-links" (generalized, no fact lost), witness session 2026-05-22-bac669ad retained. No semantic drift.
- S5: PARTIAL/PASS-with-note. decisions doc uses Question/Resolution/Evidence/Action and design uses bold-label paragraphs, not the §4.2 ADR contract (Context/Decision/Rationale/Alternatives/Consequences). This is a real §4.2 deviation — but it is **pre-existing** (the shape predates T8) and T8 is mechanical-only with "no body reshaping" mandated, so reshaping would itself violate scope + the brief's check 5. FP category: pre-existing + out-of-scope. Recorded as deferred, not a blocking finding.

## Typed findings
- F-CONS-1: decisions/design bodies do not follow §4.2 ADR section contract. Type: checklist_gap, Domain: docs-sync, Confidence: 75, Severity: Low, Disposition: deferred. Evidence: decisions uses `## Question/## Resolution/## Evidence/## Action`; design uses bold-label paragraphs with zero H2. §4.2 prescribes ADR shape for decisions+design. Why it matters: a future §4.2 prose-quality pass (not T8's mechanical scope) should reshape-or-reclassify. Suggested direction: file as a follow-up; out of T8's contract — do NOT fix in this task.

## Low-confidence appendix
(none)

VERDICT: PASS
