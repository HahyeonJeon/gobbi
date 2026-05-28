# Consistency — T9c iter2 re-run (commit c001694)

## Locked Frame (Stage 1)
- **S-CON-1** §4.5 gate (archive-safe, all S keys, both spellings) = 0 over T9c scope and whole P_live.
  - [x] Gate printed 0 files. Conditional `disposition` (non-backlogs) check = 0 files.
- **S-CON-2** Commit message claims match the on-disk diff (no claim drift).
  - [x] Message: "6 placeholder READMEs add 9 base keys" → diff confirms 6 READMEs each +12 lines (frontmatter). "features/README scope:project" → confirmed. "strip Mistake Candidate:/Mistake —/(addressed in iter2)/iter2" → all 4 confirmed in diff. "§4.5 gate=0" → independently re-run = 0.
- **S-CON-3 (adversarial)** KEEP safety invariant (§4.4) — did any conformance edit strip a legitimate type-extension or cross-ref key?
  - [x] Frontmatter key-set diff parent(cedd0cd)→commit(c001694) IDENTICAL for edit-tool, manager-iter2-brief, symlink-restore. naming-standard: +tags only. reviews: date→created rename (value preserved) + 6 base-key additions, all pre-existing extensions retained. ZERO KEEP keys stripped.
- **S-CON-4** No file deleted; supersede-never-delete honored.
  - [x] mistakes count parent=26, commit=26. No deletions anywhere in diff.

## Stage 2 findings
None open. Everything that should change together changed together: the gate, the base-key set, the titles, and the commit message are mutually consistent. The iter1 codex Critical (KEEP-strip on the discarded 14041db) does NOT recur — verified by direct frontmatter-key diff, not by trusting the report.

- **Inherited iter1 codex KEEP-strip Critical/100** → disposition: addressed (clean re-run from cedd0cd; key-set diffs prove no stripping).

VERDICT: PASS
