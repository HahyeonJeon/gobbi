# Evaluation — Structure

**Perspective:** structure
**System:** Claude
**Target:** `principles/SKILL.md` @ `a629bf8`
**Method:** awk field-extraction per `## Principle` block; heading-order grep; separator count; leaked-label grep; markdown fence check.

**Verdict: PASS**

## Checks
- **14 headings, order 1..14:** present and in sequence (`grep '^## '` → P1 `:7` … P14 `:348`). PASS.
- **Each section exactly the 4 fields in order Why → What → How → Anti-pattern:** awk walk confirms all 14 emit exactly `Why What How Anti-pattern` with no missing, extra, or out-of-order field. PASS.
- **No old field labels leaked:** `grep` for `**Mechanism:**`/`**Discipline:**`/`**Anti-rationalizations:**`/`**Procedure:**` as top-level bold labels → 0 hits. The old labels' content moved into How (`*Enforcement:*` / `*Procedure:*` / `*Cross-reference:*` italic sub-keys) and Anti-pattern, as designed. PASS.
- **`---` separators intact:** 16 in both develop and new (frontmatter pair + 14 inter-section). PASS.
- **What is a list:** every `**What:**` is immediately followed by a `-` bullet (27 bullet-leads counted across the 14 What blocks). PASS.
- **How carries the detail:** spot-checked P1/P5/P7/P12/P13/P14 — full sentences, nested numbered procedures (P7 5-step `:165-169`, P13 4-step `:323-335`), and `*sub-label:*` italic keys all live in How. PASS.
- **Valid markdown:** 0 code fences (none expected); nested list indentation under P7/P13 procedures correct (2-space then 5-space for sub-bullets); inline backticks balanced. PASS.

## Findings
None.

## Verdict: PASS
