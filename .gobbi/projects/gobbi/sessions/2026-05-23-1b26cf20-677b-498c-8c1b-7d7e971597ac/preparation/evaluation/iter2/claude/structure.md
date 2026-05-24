# Preparation iter2 — STRUCTURE perspective (Claude)

Perspective: structure (artifact shape, frontmatter, file placement, supersession discipline)
Verdict: **PASS**

## Frame (Stage 1)

Scenario S1: Supersession discipline — superseded files preserve original body + add reason section + frontmatter pointer.
Scenario S2: New decision file shape matches `decisions.md` template (Context / Decision / Rationale / Alternatives / Consequences / Related).
Scenario S3: D-4 design file iter2 update is additive (iter1 body preserved).
Scenario S4 (adversarial): No file moved, renamed, or deleted; supersede-not-delete discipline upheld.

## Per-scenario results

S1: PASS. Both superseded files (`mirror-propagation-policy-workspace-canonical.md`, `workspace-to-mirror-sync-mechanism.md`) carry `status: superseded` in frontmatter; iter1 body preserved verbatim above a horizontal-rule + "## Supersession reason" / "## Moot reason" section; `superseded_by:` populated (with rationale string for the moot backlog).

S2: PASS. `mirror-propagation-policy-mirror-canonical-symlinks.md` follows the established `decisions.md` template — Context (with empirical evidence block), Decision, Rationale, Alternatives considered, Consequences, Empirical reference, Related. Frontmatter has `date / session / status / feature / supersedes / superseded_by`.

S3: PASS. D-4 design file changes: frontmatter `status: updated-iter2`; `related:` array gains the new mirror-policy decision; original body lines 11-73 preserved; new "## Excluded files + rationale (added iter2)" appended below the original closing.

S4: PASS. All 4 iter1 files survive on disk; no deletions; no renames. New file added: `mirror-propagation-policy-mirror-canonical-symlinks.md`.

## Findings

### F-S1-iter2 (Low, Confidence 100, general / docs-sync)

**Cross-iter disposition: iter1 F-S1 (Low/100 frontmatter shape) → preserved.**

The new mirror-canonical-symlinks decision file uses the same `date / session / status / feature / supersedes / superseded_by` schema as the existing decisions; consistent shape.

### F-S2-iter2 (Low, Confidence 50, general / docs-sync)

**Mild idiosyncrasy in the sync-mechanism backlog supersession frontmatter.**

Evidence: `workspace-to-mirror-sync-mechanism.md` line 4 — `superseded_by: "no superseding file; backlog is closed as moot per iter2 corrected lock"`. This is a quoted prose string in a field that other supersessions use for a filename. The schema is loosely typed (no enforced regex), and the prose is informative, but a strict superseded-by indexer would not know to treat the string as "no pointer". Acceptable as documented; a future supersession-status enum (`active|superseded|superseded_as_moot`) could disambiguate.

Why it matters: future automation that indexes supersession pointers may need an explicit nullable convention.

### F-S3-iter2 (Low, Confidence 100, general / process)

**Generated-this-loop count in WORK exit checklist:** the iter2 draft (line 256) self-attests "5 modified/new files" implicitly via the empirical re-verification list; the explicit "Generated this loop" section (lines 86-122) cleanly distinguishes "iter1 outputs (unchanged)", "iter2 outputs (new)", "iter2 modifications (audit-trail supersessions, no deletion)". Categorization is correct.

## Must-preserve list

- The supersede-not-delete discipline (both superseded files keep iter1 body verbatim).
- The "iter1 outputs (unchanged) / iter2 outputs (new) / iter2 modifications" 3-tier categorization in the draft's "Generated this loop" section — readable audit trail.
- Frontmatter `status: updated-iter2` on the D-4 design file — marks the in-place edit clearly.

## Verdict

**PASS.** Supersession discipline, frontmatter shape, and additive D-4 update all conform to the project conventions. F-S2 is a minor schema-tightening suggestion, not a blocker.
