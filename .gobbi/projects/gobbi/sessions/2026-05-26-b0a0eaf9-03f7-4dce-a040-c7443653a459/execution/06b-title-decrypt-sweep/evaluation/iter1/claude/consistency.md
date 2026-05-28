# Consistency perspective — T6b title-decrypt sweep (iter1, Claude)

**Scope of judgment:** Are the rewrites applied uniformly, with a single coherent rule for code placement, and do they cohere with the §4.1/§4.3 standard and the surrounding tree?

## Verification (own commands)

- §4.3 placement rule applied uniformly: every **design** file (carries `design-id:` frontmatter, a real cross-reference ID) keeps its code as a **trailing parenthetical** — `(D-1)` … `(D-5)`, `(D-3-1)` … `(D-3-6)`. Confirmed `design-id:` frontmatter still present and matching in all 11 design files.
- Every **session-task code** (`T1`/`T2`/`T3`/`T04`) that was a pure coordinate is **dropped** from the heading. Cross-checked frontmatter: the discussion files carry only `phase`/`sub-step` (no `task:`), confirming T3 was session-only, not a stable ID — correct to drop. The two files that *do* retain `task:` frontmatter (T04/CL-2, T1) keep the code there, so traceability survives.
- The distinction is principled and consistent: stable design IDs preserved (parenthetical), volatile session coordinates dropped (frontmatter/git carry provenance). This matches §4.3 verbatim ("Provenance belongs in frontmatter… plus optionally a single ## Source footer").
- `d-ref-codes-missing-inline-expansion.md`: codes kept in parenthetical because the codes ARE the subject (the doc is about those codes lacking expansion) — a justified exception, internally consistent with the "name the subject" rule.

## Findings

- Type: general / Domain: consistency / Disposition: open / Confidence: 50 / Severity: Low — Minor stylistic variance in parenthetical vs. the rest of the tree is not assessable here (other §4-conformed files outside the 18 were swept in prior commits); within the 18, placement is uniform. No action implied.

No High/Critical consistency defects.

## Verdict

PASS
