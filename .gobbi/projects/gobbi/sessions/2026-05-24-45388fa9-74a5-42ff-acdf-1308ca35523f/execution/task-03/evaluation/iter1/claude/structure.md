# Structure — T03 (commit 0632ad8)

## Artifact Summary + Memory reads
See project.md. Docs artifact (markdown skill + backlog); "structure" = document organization, section coherence, model integrity of the two-layer staging→promotion description.

## Locked Frame (Stage 1)

**S1 — the rewritten promotion model is internally coherent end-to-end**
- [ ] P3 (stage during MEMORIZATION) and P4 (Wrap-up promotes) describe one consistent two-layer model
- [ ] No section still describes the retired CLI mechanism
- [ ] Memory Access Matrix rows, Core Principles, Procedures, Constraints, Output-paths all agree

**S2 — the staging→promotion (two-layer) model is KEPT, not collapsed into direct-write**
- [ ] "staging → promotion" framing still present
- [ ] Working-loop agents still write to staging only

**S3 — heading/section structure preserved (no orphaned/renamed anchors)**
- [ ] P4 heading rename (`Reference the promotion command` → `Wrap-up-phase promotion`) leaves no dangling internal reference
- [ ] No section deleted that other sections point to

**S4 (adversarial) — a grep-passing rewrite that is structurally inconsistent**
- [ ] No clause says "Wrap-up promotes" while another says "agents never write to mistakes/" without the exception qualifier
- [ ] The "sole exception" is stated consistently (working-loop vs Wrap-up assistant) everywhere it appears

## Per-scenario per-check results
- S1.1 YES — P3 line 84-92 (stage to `staging/decisions/{slug}.md` during MEMORIZATION on PASS); P4 line 94-96 (Wrap-up assistant promotes staging→`mistakes/`). Two layers, consistent.
- S1.2 YES — `grep -c 'gobbi mistake promote'` = 0; no orphan "post-session"/"outside the session"/"user-facing command"/"separate command" (grep returned empty).
- S1.3 YES — description (line 3), body intro (line 11), Matrix intro (line 17) + rows (21-23), Promotion note (27), Core Principle (45-47), P4 (94-96), Constraints (105), Output-paths Wrap-up promotion (119) all describe the same Wrap-up-assistant-promotes model.
- S2.1 YES — "The model is **staging → promotion**" retained (line 11).
- S2.2 YES — "During the working loops, agents write mistake-candidates to session staging only" (line 11); Matrix Session-staging row WRITE (line 23).
- S3.1 YES — P4 heading renamed; no other section references the old heading text by anchor (grep for "promotion command" returns only the new prose context, no link).
- S3.2 YES — no section deleted; all edits are in-place rewordings.
- S4.1 YES — every "never write directly to project memory" / "MUST NOT write directly to `mistakes/`" instance is qualified ("working-loop agents… ; Wrap-up assistant is the sole exception"). Verified lines 3, 11, 105 + Matrix rows 21-22 + Constraints 105.
- S4.2 YES — "sole exception" / "sole documented exception" / "documented sole exception" phrasing is consistent in meaning; minor wording variance (see aesthetics A-1) but not a structural inconsistency.

## Typed findings
(none at or above threshold)

## Verdict: PASS
The two-layer staging→promotion model is preserved and coherent across all eight touchpoints; no orphaned anchor; no section now describes the retired CLI. Structurally sound.

## Low-confidence appendix
- ST-LC-1 (Confidence 25, Low) — Type: general | Domain: docs-sync — The P4 heading rename relies on no other doc deep-linking `#p4-reference-the-promotion-command`. A cross-repo grep for that anchor was not exhaustively run for every consumer; risk is low because internal cross-refs to P-step anchors are rare in this codebase. Recorded for completeness; suppressed at threshold.
