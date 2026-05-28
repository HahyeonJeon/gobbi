# Usage — T4 conform git-workflow (commit 33340be)

## Artifact Summary + Memory reads
See project.md. Usage lens: can a zero-context reader (the §4.1 bar) open any of these 21 docs cold, months later, and understand it without the originating session?
Memory reads: skills/memorization/rules.md §4.1/§4.3 (zero-context reader, self-contained prose).

## Locked Frame (Stage 1)
- **S1 zero-context readability**: each de-crypted doc body stands alone; no load-bearing session-coordinate the reader cannot resolve.
- **S2 provenance preserved (not deleted)**: per §4.3 + design-literal-retire mistake, narrative is reclassified/footer-pointed, never deleted into a vacuum.
- **S3 cross-links resolve**: `## Related`/`## Source` pointers reference real, resolvable artifacts (backlog slugs, design docs, PR #s).
- **S4 (adversarial) trapped knowledge**: a body still requires the vanished task list / eval finding IDs to follow the reasoning.

## Per-scenario per-check results
- S1: YES. Bodies de-crypted: "iter1 P4 finding identified..." → "The worktree-create design adds a first success criterion..."; "T2's Load Directives validator" → "The Load Directives validator design problem (ensuring delegation prompts carry the required skill-load directives before dispatch)". Reader follows without the session.
- S2: YES — this is the strongest part of the work. Raw session paths removed from `## Related` were REPLACED with self-contained descriptions + a provenance pointer (e.g., "Session risk evaluation finding that surfaced this gap: risk finding R-001"), honoring the design-literal-retire lesson (never delete narrative; reclassify). No vacuum left.
- S3: YES. Cross-links point to resolvable targets: design/worktree-create-before-session-stamp.md, backlog slugs (ssid-env-var-absent-fallback, branch-name-collision-recovery), PR #266/#267, witness commit 1829fa3.
- S4: PARTIAL — finding U1 on residual eval-finding IDs in footers; not load-bearing, so the §4.3 bar is met, but see U1.

## Typed findings
- (Low/50) `general`/`docs-sync` (U1): Several `## Related` footers retain bare evaluator finding IDs (`R4`, `R-001`, `R-002`, `S3`, `COD-CONS-ITER3-002`, `COD-OVERALL-PREP1-004`) prefixed by self-contained descriptions. §4.3 explicitly permits a `## Source`/`## Related` footer pointing at the canonical session artifact, so these are sanctioned: the body no longer DEPENDS on them. The IDs alone are unresolvable to a zero-context reader, but they sit after a plain-language descriptor, so the reader loses nothing if they ignore the ID. Evidence: backlogs/abort-mid-commit-partial-session.md:38 "Session evaluation risk finding that surfaced this gap: iter1 risk evaluation R4". Why it matters: marginally noisy provenance; acceptable per the standard. Disposition: open. FP-check: borderline out-of-scope (the standard sanctions it) — kept Low/50 not higher.

## Low-confidence appendix
- (Low/25) changelogs/worktree-create body retains "Task 06 / LOCK #5 footnote" — but it quotes the literal forward-reference text shipped into SKILL.md, and the Deferred section pairs each with a resolvable backlog filename. Self-contained enough for a changelog (session-contextual type). Not a defect.

VERDICT: PASS
