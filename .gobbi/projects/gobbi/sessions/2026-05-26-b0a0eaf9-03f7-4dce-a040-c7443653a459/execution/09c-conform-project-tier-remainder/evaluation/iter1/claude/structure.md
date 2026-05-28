# Evaluation — Structure Perspective (Claude) — T9c iter1

**Target:** commit `14041db`. **Method:** diff-read vs parent `82a5137`; per-file frontmatter + body-line-count analysis.

## Checks
- **9-key base ordering / completeness:** all 28 files carry the 9 base keys. Base keys appear in the canonical order (`name`→`description`→`type`→`scope`→`feature`→`status`→`created`→`session`→`tags`) on the conformed files; extensions (`domain`, `priority`, `supersedes`, `superseded_by`, review-specific keys) trail the base block. Consistent structure.
- **No KEEP key stripped (CRITICAL, diff-read):** every removed `-` line in the full T9c diff is either (a) an S-set staging-routing key, or (b) a base/KEEP key removed-then-re-added in canonical order. Enumerated removals: `mistake-candidate`(17), `severity`(9), `promoted-at`(9), `promoted-from`(9), `loop`(7), `slug`(4), `finding-id`(7), `finding-type`(1), `task`(1), `surfaced-by`(1), `session-id`(2), `confidence`(2), `iter`(5), `disposition: open|addressed|addressed-by-fallback`(4), `addressed-in`(1), `type: design_flaw|general`(3), `metadata:`(3). All S-set or obsolete-type-value replacements. Re-added/preserved: `status`, `domain`, `date`→`created`, `session`, `feature`, `project`(folded), `priority`, `source`, all review-specific KEEP keys.
- **Reviews KEEP keys survived:** `review_kind`, `reviewed_artifact`, `reviewer`, `perspectives`, `overall_verdict`, `related_reports`, `related_decisions` ALL present at `14041db`. `related: [...]` on `codex-subprocess`/`session-dir`/`handoff` preserved. `supersedes`/`superseded_by` preserved everywhere.
- **Body integrity:** post-frontmatter body line counts identical parent vs `14041db` for all 20 mistakes (e.g. codex-subprocess 53=53, memorization-delegation 53=53) and reviews (48=48). `stub-redirect` = +12/-0 (pure frontmatter add, 0 body change). No body reshaping beyond the 2 declared title de-crypts + the reviews H3/cross-system/outcome iter→review de-cryption.
- **No mistakes deleted:** 20 mistakes/*.md at parent, 20 at `14041db`; `--diff-filter=D` empty.

## Findings

### STRUCT-1 — `date`→`created` fold via legacy `discovered:` key dropped without explicit KEEP coverage (low risk, value preserved)
- **Type:** general · **Domain:** docs-sync · **Disposition:** addressed · **Confidence:** 75 · **Severity:** Low
- **Evidence:** `codex-subprocess-writes-to-main-tree.md` and `session-dir-placed-outside-worktree.md` had `discovered: 2026-05-24` (not in S, not in KEEP). T9c dropped `discovered:` and the value landed in `created: 2026-05-24` (identical date).
- **Why it matters:** `discovered` is an ad-hoc legacy key absent from both S and KEEP. The "When in doubt, KEEP" rule (§4.4) argues for caution — but here the value was preserved into the canonical `created` base key with no information loss, which is the correct fold. Logging as addressed for transparency; no remediation needed.

## Verdict reasoning
Structurally clean: zero KEEP-key strips, zero body reshaping, zero deletions, canonical key ordering. The single finding is value-preserving and self-addressed. Structure perspective: PASS.

VERDICT: PASS
