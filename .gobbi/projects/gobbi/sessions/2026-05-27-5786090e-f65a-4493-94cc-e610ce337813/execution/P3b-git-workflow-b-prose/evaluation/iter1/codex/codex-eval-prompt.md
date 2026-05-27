# Codex evaluator — P3b prose wave (features/git-workflow B: rest + README)

Independent adversarial evaluator in a dual-system gobbi evaluation. A Claude executor reshaped 21 docs under `features/git-workflow/` (backlogs, changelogs, checklists, plans, references, scenarios, README — NOT discussions/design/decisions, which were P3a) to the §4 standard. Find what is wrong. DO NOT trust the executor summary — diff the commit and read the files.

## Spec (§4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`)
- §4.1 zero-context bar; §4.1.1 type-purity.
- §4.2 per-type section contract vs template `.gobbi/projects/gobbi/skills/memorization/templates/{type}.md`. **Check each doc against its template's COMPLETE required-section list.** Known traps: references→body `## Related` (between Insight and Why-it-applies); scenarios→body `**Category:**`/`**Coverage:**` (before Situation) + `## Related`; backlogs/checklists/changelogs/plans/README → match the full template body-section list.
- §4.3 self-contained prose: no LOAD-BEARING session coords in BODY (Tn, iterN, COD-n, row-n, LOCK #n). Frontmatter `tags:` tokens are NOT body prose (governed by §4.4/§4.5 leak gate, not §4.3). Narrative reclassified to PROJECT-level notes only.
- §4.4 KEEP keys never stripped.

## Change under review
- Commit `de207ac` on branch `chore/session-2026-05-25-a10c82d6` (worktree HEAD). 21 files, +197/-160. The executor also fixed several broken cross-reference paths — VERIFY each cross-ref it touched actually resolves to an existing file.

## Procedure (evidence-based — mandatory)
1. `git show de207ac --stat`; `git show de207ac -- <each doc>`. Read actual diffs.
2. CONTENT PRESERVATION (highest priority — a prior evaluator false-PASSed by asserting without diffing): for every reshaped doc (esp. the 3 backlogs reshaped from ADR→backlog contract, and the README), confirm no fact/bullet/table was deleted without relocation. Grep key facts in post-images.
3. §4.2 COMPLETE contract per doc against its template (references→body `## Related`; scenarios→body Category/Coverage+Related; backlogs→Context/Why deferred/When to pick up/Suggested approach/Originating session; changelogs→`**Task:**`+Summary/What changed/Verification/Deferred/Related; README→Overview/Status/Subdirectories/Recent activity/Open items/Related; plan + checklists per template).
4. CROSS-REF RESOLUTION (the executor fixed several paths — verify): for every `## Related`/inline doc link in the 21 docs, confirm the target file EXISTS. Flag any dangling link (High if a fix introduced a still-broken or newly-broken path). Pay attention to cross-feature relative paths (`../../{feature}/...`) and the README `## Subdirectories` list matching the real on-disk subdirs.
5. D5 scan — confirm BODY survivors are legitimate (tags-array tokens are frontmatter, not body): `grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/features/git-workflow/{backlogs,changelogs,checklists,plans,references,scenarios}/ .gobbi/projects/gobbi/features/git-workflow/README.md --include='*.md' | grep -vE '/archive/'`
6. §4.5 leak gate (must be 0): `find .gobbi/projects/gobbi/features/git-workflow/{backlogs,changelogs,checklists,plans,references,scenarios} .gobbi/projects/gobbi/features/git-workflow/README.md -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'`
7. Scope: only the P3b subdirs + README touched; no archive, no P3a docs (discussions/design/decisions).

## Output (write this file, workspace-write)
Write findings to: `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P3b-git-workflow-b-prose/evaluation/iter1/codex/findings.md`
Format:
```
VERDICT: <PASS|REVISE|FAIL>
## Summary
## Findings  (each: [type: design_flaw|assumption_risk|scenario_gap|checklist_gap|general] [severity High|Med|Low] [confidence 0-100] finding + file:line evidence)
## Cross-ref resolution check
## Verification outputs  (paste D5 + leak gate + git stat)
```
Type vocab: scenario_gap, checklist_gap, design_flaw, assumption_risk, general. Confidence ≥ 75 requires verified evidence. PASS is honest if clean; do not invent or rubber-stamp.
