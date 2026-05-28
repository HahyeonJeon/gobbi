# Codex evaluator — P2 prose wave (features/evaluation)

You are an independent adversarial evaluator in a dual-system gobbi evaluation. A Claude executor reshaped 15 docs under `.gobbi/projects/gobbi/features/evaluation/` to the §4 dev-document quality standard. Find what it got wrong. DO NOT trust the executor's summary — diff the commit and read the resulting files yourself.

## Spec (§4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`)
- §4.1 zero-context-reader bar; §4.1.1 type-purity (one doc, one type's job).
- §4.2 per-type section contract — body `##` sections must match the type's template under `.gobbi/projects/gobbi/skills/memorization/templates/{type}.md`:
  - decisions/design → ADR: Context / Decision(or Approach) / Rationale / Alternatives considered / Consequences (+ Related).
  - discussions → Context / Question / Options considered / User decision / Implication / **Related**.
  - references → Insight / **Related** / Why it applies / Source / Excerpt / Usage history (`## Related` is a BODY section between Insight and Why-it-applies).
  - changelogs, features/README → their template shapes.
  **Check each doc against its template's COMPLETE required-section list — "looks shaped" is not "has every required section." This is the exact trap that caused P1's REVISE (references/scenario docs were missing body sections).**
- §4.3 self-contained prose: no LOAD-BEARING session coordinates (Tn, iterN, COD-n, row-n) where resolving them is required to understand the doc. Provenance → frontmatter + optional `## Source`. Narrative is NEVER deleted — only reclassified to `notes/`.
- §4.4 KEEP-list: base 9 + cross-ref/provenance/per-type keys NEVER stripped.

## Change under review
- Commit `5c36142` on branch `chore/session-2026-05-25-a10c82d6` (this worktree HEAD). 15 files, +288/-127, all under `features/evaluation/` (5 decisions, 2 design, 4 discussions, 2 changelogs, 1 references, 1 README). No archive in this feature.

## Procedure (evidence-based — mandatory)
1. `git show 5c36142 --stat`; then `git show 5c36142 -- <each file>`. Read actual diffs, not the executor's claims.
2. CONTENT PRESERVATION (highest priority — a prior evaluator false-PASSed by asserting relocation without diffing): for every doc, confirm no fact/bullet/table/cross-ref was deleted without relocation into the reshaped body or a `## Source`/`notes/` destination. Decisions reshaped from narrative to ADR are the main risk — verify the original reasoning survives in Rationale/Consequences.
3. §4.2 COMPLETE contract per doc: open each type template, enumerate its full required body-section list, and confirm the doc has EACH (esp. references→body `## Related`; discussions→body `## Related`; decisions/design→all 5 ADR sections).
4. D5 scan — confirm survivors are legitimate (literal file paths, `name:` slugs, quotes, `## Source`): `grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/features/evaluation/ --include='*.md' | grep -vE '/archive/'`
5. §4.5 leak gate (must be 0): `find .gobbi/projects/gobbi/features/evaluation -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'`
6. Scope: `git show 5c36142 --stat` touches ONLY features/evaluation/, no archive/.
7. Assess the executor's 2 flagged out-of-scope items: README frontmatter lacks `subsystems:` key though body has `## Subsystems`; `changelogs/2026-05-26-bundle-a-rehome.md` frontmatter `status: shipped` vs changelogs-template `status: active`. Are these real defects, and are they prose-scope (P2) or frontmatter-scope (out of P2)?

## Output (write this file, workspace-write)
Write findings to: `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P2-evaluation-prose/evaluation/iter1/codex/findings.md`
Format:
```
VERDICT: <PASS|REVISE|FAIL>
## Summary
## Findings  (each: [type: design_flaw|assumption_risk|scenario_gap|checklist_gap|general] [severity High|Med|Low] [confidence 0-100] finding + file:line evidence you verified)
## Out-of-scope-flag assessment  (subsystems key / status value)
## Verification outputs  (paste D5 + leak gate + git stat outputs you ran)
```
Type vocabulary: scenario_gap, checklist_gap, design_flaw, assumption_risk, general. Confidence ≥ 75 requires verified file/diff evidence. PASS is honest if no real problems — do not invent findings, do not rubber-stamp.
