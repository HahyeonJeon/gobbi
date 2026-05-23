# iter3 Claude eval — Project perspective

**Target**: `draft-iter3.md` (610 lines), surgical fix against iter2 FAIL findings.

## Frame

The brief was: surgical, mechanical repair of (a) Finding-Type vocabulary regression (COD-STRUCT-001 propagation, 3 Claude Critical findings + 1 Codex High), (b) `.agents/skills` count 17→16, (c) phantom anchor `§ Staging routing`, (d) CLAUDE.md:50 citation re-verification. No new design directions, no scope expansion.

## Findings

None. The fix matches the brief exactly:

- Line count 617 → 610 (7 lines shorter). No new H2/H3 sections added (H2/H3 count = 41 in both iter2 and iter3, structure-diff shows only iter2→iter3 label tweaks on 4 headers).
- All four fixes empirically verified against the actual repo state (Iron Law 11 — no gaming):
  - 5 Types match (`sed -n '344,352p'` returns `scenario_gap, checklist_gap, design_flaw, assumption_risk, general`).
  - `.agents/skills/` count is 16 (`ls | wc -l`), iter3 references match.
  - `§ Staging routing` is NOT a real heading; the actual `### Complete Domain → staging destination routing (general Type)` IS present at line 356.
  - CLAUDE.md:50 contains the mistake-discipline paragraph as cited.
- The four remaining `improvement`/`bug` hits (lines 31, 484, 574, 597) are genuine meta-references — they all explicitly frame the term as "iter2 was wrong" audit-trail context. None propagates the broken vocabulary.
- Bundle "gobbi-orchestration-workflow-improvements" — the word `improvements` here is the bundle name (English noun), not the Type value. Unrelated to vocabulary regression.

## Verdict

**PASS** at Confidence 100. The surgical fix took; the scope contract is honored.

## Must-preserve

- Iter3 Changelog table (lines 25-36) — clean audit trail of what changed and why, with finding-ID provenance.
- Iter1 + iter2 preserved as separate files (`draft-iter1.md`, `draft-iter2.md`), not overwritten.
- Empirical-verification commands inlined in the changelog (`sed -n '344,352p'`, `ls | wc -l`, `sed -n '50p'`) — falsifiable by any future reader.
- The "mechanical / judgment-required" type-set re-spec is precise and references SKILL.md line ranges, not phantom anchors.
