# iter3 Claude eval — Structure perspective

## Frame

Structure perspective in iter2 raised 1 Critical finding (COD-STRUCT-001 propagation across 10 sites + phantom-anchor in cross-link manifest #6). iter3 must repair both without introducing new structural breakage.

## Findings

None. Structural integrity confirmed:

- Section diff iter2→iter3 shows only 4 trivial label changes (Iter2→Iter3 Changelog header; "refined per iter2"→"refined per iter3" in one Edge-scenario subheading; "NEW iter2" removed from one Adversarial heading; iter2-NEW→iter2;iter3-correction in cross-link-manifest heading). No section additions, no removals, no reorders. H2/H3 count = 41 in both files.
- Decisions Log row 7 (Step 2.5 escalation shape) updated with the corrected vocabulary; new row 18 added inside the same table (row count grew by exactly 1 — a legitimate audit-trail addition for the iter3 fix, not a scope expansion).
- Cross-link manifest item #6 now reads `evaluation/SKILL.md § Complete Domain → staging destination routing (general Type)` and embeds the iter3 correction note. All 4 phantom occurrences (lines 309, 489, 504, 594 in iter2) replaced.
- Type vocabulary now consistent across: Iter3 Changelog row 1, Scope Contract § Decisions Locked, Research Insight I11, Scenarios § Edge + § Adversarial, Implementation Checklist row 8, Design D § Step 2.5 + § Classification audit trail, Decisions Log rows 7 + 18, Cross-link manifest items #4-6.

## Verdict

**PASS** at Confidence 100. Cross-link consistency is the strongest test of a vocabulary repair, and iter3 holds it.

## Must-preserve

- Cross-link manifest as a single auditable list (lines 580-591) — its existence (added iter2 per F-CLAUDE-S-02) is what made the phantom-anchor regression catchable.
- The 4-tier deferred / out-of-scope / decisions-locked / scope-contract structure — unchanged across iters, gives the artifact its stable shape.
