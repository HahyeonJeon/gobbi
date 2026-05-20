# Performance Perspective — Batch 4 iter2 (Claude)

## Stage 0 — Fix verification

All 11 fixes net-add documentation lines (no removals). Approximate net additions:

- `gobbi/SKILL.md`: +25 lines (Glossary 12, sanitization 4, mistake-promotion expansion 6, bootstrap mistake load 3)
- `principles/SKILL.md`: +20 lines (Iron Law Index 14, Principle 2 clarification 6)
- `git/SKILL.md`: +1 row in Forbidden Operations
- `git/conventions.md`: +15 lines (two-step validator structure + trailer ordering Rule)

Total ~60 lines across 4 files. Performance impact on session-load: gobbi/SKILL.md grows from 210 → 235 lines, principles from 307 → 330, git/SKILL.md ~unchanged at 281, conventions.md from 323 → 341. All four remain well under any practical context limit. Total skill-bundle delta: tiny.

## Inheritance from iter1

iter1 Performance verdict was PASS with 0 in-scope findings (only 2 Low). No real cost concerns. Both iter1 Lows were:

- **L1**: principles/SKILL.md anti-rationalization lists could be condensed — speculative, did not act.
- **L2**: Skill Map table could collapse — speculative, did not act.

Both persist as carryovers; neither targeted by iter2. Both remain Low — performance cost of the current shape is not a concern.

## New findings (iter2-introduced)

None. The added content is all index/anchor material — high information density per line, low load cost per token.

## Typed findings (iter2)

None at Medium or above.

## Low-confidence appendix

- **L-Pf-01 (confidence 30)** — The Iron Law Index repeats the 12 Iron Law headlines that already appear inline in each principle's H2 section. Strictly redundant in token count. Counter-argument: the table is a scannable index, the H2 is the full body — the redundancy is the *point* of an index. Net judgment: keep.
- **L-Pf-02 (confidence 25)** — Glossary's 8 rows take ~12 lines. A more compact prose form ("Phase = one of the 6 workflow steps; Loop = a phase's 4-sub-phase iteration; ...") would save ~4 lines. Counter-argument: tables are scannable, prose is not. Keep table.
- **L-Pf-03 (confidence 20)** — gobbi/SKILL.md line 72's sanitization blockquote sits between the section header and the bullet list, adding 4 lines. Could be a footnote-style aside. Counter: blockquote is the locked convention per `__gobbi-convention.md`. Keep.

## Verdict

**PASS** — No performance regressions. iter2 fixes add ~60 lines for sustained value (scannable indexes, missing safety annotations, clarifying ordering rules). Nothing approaches a cost concern. Performance converges PASS.
