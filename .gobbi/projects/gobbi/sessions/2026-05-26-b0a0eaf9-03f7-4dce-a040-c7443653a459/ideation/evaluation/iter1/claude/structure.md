# Structure — Ideation eval (iter1, claude)

## Artifact Summary + Memory reads
(see project.md for the shared Artifact Summary + Memory reads register)

## Locked Frame (Stage 1)
**S1 — Decomposition coheres; each piece owns one concern, depends in one direction.** Checks: standard / conformance-wave / prose-wave / grep-gate are separable; wave dependency is unidirectional (wave1 → wave2).
**S2 — Every checklist item maps to a structural element.** Checks: each Implementation Checklist item names a target (rules.md section, per-type contract, grep, etc.); each Design decision anchors a research insight.
**S3 — Boring-by-default; standard EXTENDS not competes with rules.md / P13.** Checks: standard lands as a new section in an existing doc, not a parallel doc; no taxonomy re-home; no P13 surgery.
**S4 — Two-week smell test on the standard's home.** Checks: a maintainer can locate the standard from rules.md alone.
**S5 — Testability/verification is first-class.** Checks: each Design decision (D1-D10) names a validation method; waves verified before the next.
**S6 (adversarial) — Wave sequencing hides a circular/ordering hazard.** Checks: prose wave does not depend on prose-quality artifacts that wave1 destroys; de-crypt in wave1 vs prose-rewrite in wave2 do not double-edit the same bodies in conflicting ways.

## Per-scenario per-check results
- S1 YES — the four work products are cleanly separable; wave1 (mechanical) strictly precedes wave2 (prose). Unidirectional.
- S2 YES — Implementation Checklist (lines 98-106) each names a concrete target + anchors (INT/EXT IDs + Success Criteria). Design table (lines 112-123) gives every decision a Validation method column.
- S3 YES — verified against `.claude/skills/memorization/rules.md`: standard is a NEW section inside it (D2), keeps the 13 types (D1), no P13 edit (D8). Confirmed P13 exists in this worktree's `principles/SKILL.md` line 331 — so "no P13 surgery" is a real boring-path choice, not an omission.
- S4 YES — D2 validation "section exists in rules.md; cross-references the existing standard" passes the locate-from-base test.
- S5 YES — every D1-D10 has a Validation method; D5 even supplies a concrete grep (`grep -nE 'T[0-9]+-|iter[0-9]|draft-iter|COD-|row-[0-9]'`), which I re-ran: 101 content files currently match — verification path is real.
- S6 — see finding S-1: wave1 de-crypts bodies and wave2 rewrites the same bodies; this is double-touch on the same files but in the intended order (mechanical first), not a cycle. Surfaced as a sequencing observation, not a defect.

## Typed findings

### S-1 — Wave1 and Wave2 both edit the same evergreen doc bodies; merge/ordering discipline unstated
- Type: `assumption_risk` · Domain: `process` · Disposition: open · Confidence: 25 · Severity: Low
- Evidence: Checklist line 103 (wave1: de-crypt cryptic body coordinates) and line 104 (wave2: rewrite bodies toward quality bar) both operate on doc BODIES of the same evergreen docs (e.g., `features/git-workflow/design/worktree-create-before-session-stamp.md`). The Design says "verify before wave 2" but does not state whether wave1's de-crypt and wave2's prose-rewrite are committed separately or whether wave2 may re-touch a body wave1 already changed.
- Why it matters: minor — at Ideation this is a planning detail, not a design flaw; flagged so Planning sequences the two body-edits without churn/conflict.
- Suggested direction: Planning task ordering should make wave1 body edits land and verify before wave2 prose edits begin on the same file.

## Per-perspective verdict: PASS
Sound, separable decomposition; boring-path home; every decision has a validation method. Sole finding Low/25.

## Low-confidence appendix
- S-1 recorded above at confidence 25 (kept visible because it is a concrete planning hand-off note).
