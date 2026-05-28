# Risk — T8 conform features/project-memory (iter1, claude)

## Artifact Summary + Memory reads
(See project.md.) Risk lens: data loss (narrative/provenance), reversibility, wrong-tree edits, supersede-never-delete. Memory reads: mistakes/design-literal-retire (delete-without-replacement), executor-main-tree-edit-near-miss, supersede-never-delete; memorization/rules.md §4.3.

## Locked Frame (Stage 1)
S1 no narrative deleted — reclassified not removed (§4.3) — [c].
S2 no durable provenance lost (session/created/PR refs) — [c].
S3 edits landed in the worktree, not the main tree — [c] (mistake: executor-main-tree-edit).
S4 fully reversible (git-tracked markdown) — [c].
S5 (adversarial) de-cryption silently dropped a load-bearing fact under guise of "cryptic" — [c].
S6 (adversarial) a KEEP key permanently lost (irreversible info loss) — [c].

## Per-scenario per-check results
- S1: PASS. No narrative paragraph removed. The only deletions are bare session coordinates: `**Anchored insight**: I6.` (single label, no narrative), "item B", "Concern 2", "Task 05" inline tokens — replaced by self-contained phrasing or simply dropped where they carried no reader-facing content. This is the §4.3 "strip inline session-coordinates from evergreen types" rule, NOT narrative deletion. No content needed relocation to notes/.
- S2: PASS. session + created retained on all 4; PR #266/b9970dc, design §8 LOW-16, SKILL.md:224, witness session 2026-05-22-bac669ad all preserved. Provenance intact.
- S3: PASS. git show confirms both commits modified files under the worktree-physical features/project-memory/ path; `git status` clean at HEAD. No main-tree leak (the near-miss mistake did not recur).
- S4: PASS. All changes are git-tracked markdown — fully reversible via git revert. No irreversible op, no migration, no one-way door.
- S5: PASS. Cross-checked every de-crypted line against its pre-image: "T02/T04 project-memory secondary"→"project-memory secondary routing" preserves the routing fact; "§8 rule 1"→"design §8 routing rule" preserves the rule pointer (§8 LOW-16 still cited in Related). No load-bearing fact dropped.
- S6: PASS. project/last_updated were over-stripped by T8 but RESTORED in dbe61c3 — so even the one info-loss event was caught and reversed before HEAD. No KEEP key permanently lost (verified vs 54c0cde^).

## Typed findings
None at PASS threshold. The over-strip risk (project/last_updated) materialized in T8 but was remediated in dbe61c3; net HEAD state carries no loss. Supersede-never-delete honored (no file deleted; archive untouched).

## Low-confidence appendix
(none)

VERDICT: PASS
