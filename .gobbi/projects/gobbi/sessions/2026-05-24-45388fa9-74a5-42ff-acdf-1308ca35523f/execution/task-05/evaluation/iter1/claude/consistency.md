# Consistency — T05 design doc (iter1, claude)

## Artifact Summary + Memory reads
(Shared Stage 0 summary in project.md. This is the load-bearing perspective for the factual-accuracy check the contract flagged.)

## Locked Frame (Stage 1)

S1 — Doc ↔ orchestration/SKILL.md: row numbers, direct-mode, smoke-test gate, branch regex all match the authoritative skill.
- [ ] Worktree-creation row label matches the orchestration table
- [ ] Direct-mode opt-out description matches
- [ ] Smoke-test gate (regex + worktreePath non-null) matches
- [ ] Branch naming + length claim matches conventions

S2 — Doc ↔ git/SKILL.md: write-root rule, P2/P5, Matrix.
- [ ] worktreePath write-root rule matches the Matrix
- [ ] P2 = create, P5 = land-PR/remove match
- [ ] transcript-paths-outside-both-trees matches

S3 — Doc ↔ bundle-B memorials (D-1/D-2/D-4/D-5).
- [ ] Claims trace to the linked memorials

S4 — Backlog ↔ doc: closing the backlog is consistent with delivering the promised structure.
- [ ] Backlog status flipped; suggested structure delivered

S5 (adversarial) — The doc grep-passes the header check but misdescribes the model (the contract's explicit warning).
- [ ] Substance, not just headers, verified against source

## Per-scenario per-check results

S1:
- Worktree-creation row label: **MISMATCH**. Doc says row 5.5; orchestration table says row 5 (orchestration:102 row5=create worktree; :103 row5.5=state.json; :104 row6=session.json). FAIL → F-CONS-1.
- Direct-mode opt-out content (emergency hotfix + pure-read; settings.git.workflow.mode; default worktree-pr): matches orchestration:107-116 ✓ — but the doc attaches it to "row 5.5" whereas the skill header is "Row 5". Content ✓, label ✗.
- Smoke-test gate regex `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` + worktreePath non-null: matches orchestration:132,134 ✓.
- Branch naming `chore/session-{date}-{ssid-short}`, 27-char slug, regex satisfied: matches D-1 + conventions ✓ (full-branch=33 vs slug=27 phrasing nit — see Aesthetics A-1).

S2:
- worktreePath write-root + main-tree fallback + transcript outside both trees: matches git Matrix:31,33 ✓.
- P2 = create worktree (doc line 47, 87) ✓; P5 = land PR / worktree removal discards uncommitted (doc line 66-67) matches git:184,200 ✓.

S3:
- D-2/D-4/D-5 claims trace cleanly to the memorials ✓.
- D-1: the doc's "row 5.5 creates worktree" actually matches the D-1 memorial's framing AND git/SKILL.md:155 ("P2 is invoked from Configuration row 5.5"). So the doc is internally faithful to two of its three sources — but those two sources themselves contradict the authoritative orchestration Step-1 table. This is a pre-existing cross-skill inconsistency the doc inherited and propagated rather than reconciled.

S4: backlog status=closed ✓; promised 5-section structure delivered ✓. Consistent.

S5: Confirmed the contract's warning scenario is real: the doc PASSES the header grep (5 H2 sections present) yet MISDESCRIBES which row performs worktree creation. Grep-pass ≠ accurate.

## Typed findings

F-CONS-1 (High). Doc ↔ orchestration/SKILL.md row-label desync: the doc states worktree creation + direct-mode guard + LOCK #5 footnote live at "row 5.5", but the authoritative Step-1 table assigns worktree creation to **row 5** and state.json to row 5.5. The doc mirrors git/SKILL.md:155 and the D-1 memorial (both say "5.5"), exposing a pre-existing cross-skill contradiction the aggregation doc propagated instead of resolving.
- Type: general | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: High
- Evidence: doc:45-46,69,84 ("row 5.5" worktree/guard/LOCK#5) vs orchestration:102 (row 5=create worktree), :103 (row 5.5=state.json), :107 (header "Row 5 — Direct-mode opt-out"), :134 (smoke-test: "indicates row 5 was skipped"); git/SKILL.md:155 ("P2 invoked from Configuration row 5.5") — the contradicting source. All verified by direct read.
- Why: a canonical aggregation doc whose central structural claim disagrees with the authoritative table is worse than no doc — it invites a reader to "fix" the table to match. Also matches the project mistake `leader-iter2-verification-claim-without-evidence` pattern: a claim grounded in a source (memorial/git-skill) that was not cross-checked against the authoritative implementation.
- Suggested direction: user decides. Minimal fix: correct the doc to "row 5". Fuller fix: reconcile the orchestration↔git/SKILL.md row-label contradiction (file as a separate follow-up — out of T05 scope). Do NOT silently edit orchestration to match the doc.

Per-perspective verdict: REVISE

## Low-confidence appendix
(none)
