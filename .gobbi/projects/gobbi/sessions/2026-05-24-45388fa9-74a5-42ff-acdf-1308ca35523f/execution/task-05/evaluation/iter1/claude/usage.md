# Usage — T05 design doc (iter1, claude)

## Artifact Summary + Memory reads
(Shared Stage 0 summary in project.md.)

## Locked Frame (Stage 1)

Consumer = a future contributor / agent who reads this doc to answer "what is the canonical session lifecycle, and where do session writes go relative to the worktree boundary?" (the backlog's stated motivator).

S1 — A reader can understand the worktree-first model from this doc alone, without grepping all 9 surfaces.
- [ ] Problem, approach, and write-root rule are self-contained
- [ ] Direct-mode opt-out + smoke-test gate are explained

S2 — Cross-references let a reader verify against source.
- [ ] Surfaces table points the reader to the right skill sections
- [ ] Pointers are accurate enough to land the reader in the right place

S3 (adversarial) — A reader follows the doc to the named source row and finds something different (cross-reference sends them to the wrong place at 3am).
- [ ] Row/section labels in the doc resolve to the matching content in the source skills

S4 — Accessibility (agent/operator scannability). not-applicable to deep a11y (no UI); skip-friendly headings checked under Aesthetics S1.

## Per-scenario per-check results

S1: The model is well-explained self-contained — write-root rule, direct-mode, smoke-test, cadence all present ✓. PASS.
S2: Surfaces table cites concrete skill sections; pointers to git P2/P5, Matrix, delegation, preparation are accurate ✓. PASS on the section-level pointers.
S3: FAILS. A reader who follows the doc's "Row 5.5 creates the worktree" claim (lines 45-46, 69, 84) and opens orchestration/SKILL.md Step 1 will find **row 5** = create worktree and **row 5.5** = state.json init. The direct-mode opt-out is titled "**Row 5** — Direct-mode opt-out", and the smoke-test gate says "indicates **row 5** was skipped". The reader is sent to the wrong row label. This is the precise 3am-confusion failure this perspective owns. Recorded as F-USAGE-1.

## Typed findings

F-USAGE-1 (High). The doc's row-label pointers misdirect the reader: it repeatedly states worktree creation is "row 5.5", but the authoritative orchestration/SKILL.md Step-1 table places worktree creation at **row 5** (row 5.5 = state.json, row 6 = session.json). A contributor cross-referencing the doc against the table will be confused at exactly the moment the doc is supposed to help.
- Type: general | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: High
- Evidence: doc lines 45-46 ("Row 5.5 ... creates the per-session worktree"), 69 ("Row 5.5 is guarded"), 84 ("Row 5.5 definition: P2 invocation ... direct-mode guard ... LOCK #5"); vs orchestration/SKILL.md:102 (row 5 = "Create worktree (P2 wrapper)"), :103 (row 5.5 = state.json), :107 (header "Row 5 — Direct-mode opt-out"), :134 ("indicates row 5 was skipped"). Verified by direct read.
- Why: the doc's whole reason to exist (per its backlog) is single-doc reader convenience; a wrong row label defeats that and risks a downstream editor "fixing" the orchestration table to match the doc.
- Suggested direction: discuss with user — the doc and git/SKILL.md P2 say "5.5" while orchestration says "5"; the authoritative table is orchestration's. Either correct the doc to "row 5" or, if the team wants "5.5" canonical, that is a cross-skill reconciliation beyond this doc's scope (file as follow-up).

Per-perspective verdict: REVISE

## Low-confidence appendix
(none)
