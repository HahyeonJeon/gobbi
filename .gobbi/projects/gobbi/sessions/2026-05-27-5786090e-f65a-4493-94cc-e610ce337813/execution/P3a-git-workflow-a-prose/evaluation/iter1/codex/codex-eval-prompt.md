# Codex evaluator — P3a prose wave (features/git-workflow A: discussions+design+decisions)

Independent adversarial evaluator in a dual-system gobbi evaluation. A Claude executor reshaped 20 docs under `features/git-workflow/{discussions,design,decisions}/` to the §4 standard, and the manager then relocated one reclassified note. Find what is wrong. DO NOT trust summaries — diff the commits and read the resulting files.

## Spec (§4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`)
- §4.1 zero-context bar; §4.1.1 type-purity.
- §4.2 per-type section contract vs template `.gobbi/projects/gobbi/skills/memorization/templates/{type}.md`:
  - decisions/design → ADR: Context / Decision(or Approach) / Rationale / Alternatives considered / Consequences (+ Related).
  - discussions → Context / Question / Options considered / User decision / Implication / **Related**.
  **Check each doc against its template's COMPLETE required-section list — "looks shaped" ≠ "has every required section."**
- §4.3 self-contained prose: no LOAD-BEARING session coords (Tn, iterN, COD-n, row-n, LOCK #n) where resolving them is required. Provenance → frontmatter + optional `## Source`. Narrative NEVER deleted — reclassified to PROJECT-level `notes/` (notes is project-only; there is NO `features/{f}/notes/` tier).
- §4.4 KEEP-list keys never stripped.

## Changes under review (two commits)
- `183dbfb` — P3a: 20 docs reshaped (11 discussions, 6 design, 3 decisions) + 1 new reclassified note.
- `dc0e5a9` — manager fix: relocated that note from feature-level to project-level `notes/2026-05-23-workflow-phase-doc-set-enumeration.md` (scope project, feature null) + repointed cross-links.
Net P3a effect = `git diff 183dbfb^ dc0e5a9` restricted to git-workflow + the project note.

## Procedure (evidence-based — mandatory)
1. `git show 183dbfb --stat`; `git show dc0e5a9 --stat`; then `git show 183dbfb -- <each doc>` and `git show dc0e5a9` to see exact changes.
2. CONTENT PRESERVATION (highest priority — a prior evaluator false-PASSed by asserting relocation without diffing): every reshaped decision/design doc must keep its original reasoning/facts in the ADR sections; the reclassified narrative must survive in `notes/2026-05-23-workflow-phase-doc-set-enumeration.md`, NOT be dropped. Grep key facts in post-images.
3. §4.2 COMPLETE contract per doc against its template (5 ADR sections on all 9 decision/design docs; body `## Related` on all 11 discussions).
4. NOTES PLACEMENT: confirm the reclassified note now lives at PROJECT-level `.gobbi/projects/gobbi/notes/` with `scope: project`, `feature: null`, and that NO `features/git-workflow/notes/` dir remains (`find .gobbi/projects/gobbi/features -type d -name notes` must be empty). Confirm design↔note cross-links resolve.
5. D5 scan — survivors legitimate? `grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/features/git-workflow/{discussions,design,decisions}/ .gobbi/projects/gobbi/notes/2026-05-23-workflow-phase-doc-set-enumeration.md --include='*.md' | grep -vE '/archive/'`
6. §4.5 leak gate (must be 0): `find .gobbi/projects/gobbi/features/git-workflow/{discussions,design,decisions} .gobbi/projects/gobbi/notes/2026-05-23-workflow-phase-doc-set-enumeration.md -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'`
7. Scope: the two commits touch ONLY git-workflow {discussions,design,decisions} + the project note; no archive, no P3b docs (README/changelogs/checklists/scenarios/references/backlogs).

## Output (write this file, workspace-write)
Write findings to: `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P3a-git-workflow-a-prose/evaluation/iter1/codex/findings.md`
Format:
```
VERDICT: <PASS|REVISE|FAIL>
## Summary
## Findings  (each: [type: design_flaw|assumption_risk|scenario_gap|checklist_gap|general] [severity High|Med|Low] [confidence 0-100] finding + file:line evidence)
## Notes-placement check
## Verification outputs  (paste D5 + leak gate + git stat you ran)
```
Type vocab: scenario_gap, checklist_gap, design_flaw, assumption_risk, general. Confidence ≥ 75 requires verified evidence. PASS is honest if clean; do not invent or rubber-stamp.
