# Codex evaluator — P6a (features/project-memory: prose + 16 frontmatter type-fixes, 32 docs)

Independent adversarial evaluator, dual-system gobbi eval. A Claude executor (commit `f367095`) did TWO things on 32 docs under `features/project-memory/`: (A) fixed 16 wrong `type:` frontmatter values to match their directory + stripped finding-disposition residue keys; (B) applied §4.2/§4.3 prose. Find what is wrong. DO NOT trust the executor summary — diff the commit and read the files.

## Spec (§4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`)
- PART A: every doc's `type:` MUST equal the canonical memory type of its directory (decisions/→decisions, checklists/→checklists, references/→references, etc.). References that held a subtype (code/docs/blog) must now be `type: references` with the subtype preserved in `ref_type:` (a §4.4 KEEP key). Finding-disposition residue keys (`addressed-in-iter`/`addressed-how`/`addressed-by`/`finding_ids`/`finding-id`/`surfaced-by`/`confidence`/`severity`) must be STRIPPED; KEEP-list keys (§4.4: base 9 + domain/priority/title/source/accessed/ref_type/related/supersedes/superseded_by/topic/decision_status/etc.) must be PRESERVED.
- PART B §4.2 per-type COMPLETE section contract vs template `.gobbi/projects/gobbi/skills/memorization/templates/{type}.md` (decisions/design→ADR+Related; checklists→Form A or B; references→Insight/Related/Why it applies/Source/Excerpt/Usage history; discussions→6-section; changelogs→`**Task:**`+5; README→Overview/Status/Subdirectories/Recent activity/Open items/Related). §4.3: no LOAD-BEARING body session coords; provenance→`## Source` footer.

## Procedure (evidence-based — mandatory)
1. `cd` worktree `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`; `git show f367095 --stat`; `git show f367095 -- <each file>`.
2. PART A verification: confirm ALL 32 docs' `type:` == directory (zero mismatch); confirm the 5 references carry `ref_type:` with the old subtype; confirm residue keys gone; confirm NO KEEP-list key was stripped (esp. `domain`/`title`/`source`/`ref_type`/`related`/`decision_status`). Run: `grep -rnE '^(addressed-in-iter|addressed-how|addressed-by|finding_ids|finding[-_]id|surfaced[-_]by|confidence|severity):' .gobbi/projects/gobbi/features/project-memory/ --include='*.md'` (must be empty).
3. CONTENT PRESERVATION (highest priority — prior tasks had false-PASS + weakened-pointer + over-strip defects): every reshaped decision/checklist/reference keeps its facts; the type-fix + residue-strip did NOT drop body content or a legitimate frontmatter key. Grep key tokens in post-images.
4. §4.2 COMPLETE contract per doc (using corrected type).
5. CROSS-REF RESOLUTION (whole tree): every `## Related`/inline path-link resolves to an existing file; flag dangling/removed-existing/weakened-to-parent.
6. D5 BODY scan: `grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/features/project-memory/ --include='*.md' | grep -vE '/archive/'` — survivors legitimate (plan's own sub-task IDs in its Dependency graph; teaching examples inside quoted bad-doc scenarios; literal mention of a dangling link the doc documents)?
7. §4.5 leak gate (0): `find .gobbi/projects/gobbi/features/project-memory -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'`
8. Scope: only features/project-memory touched; no features/workflow (P6b), no other feature.

NOTE: the §4 standard says strip session-only coordinates (iter markers, finding IDs, draft-iterN line refs) from evergreen bodies and put provenance in a `## Source` footer — do NOT flag a correctly-stripped coordinate as "content loss" if provenance is preserved in `## Source`/frontmatter (that is §4.3-conformant, not a regression).

## Output (write this file, workspace-write)
Write to `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P6a-project-memory-prose/evaluation/iter1/codex/findings.md`:
```
VERDICT: <PASS|REVISE|FAIL>
## Summary
## Findings  (each: [type] [severity] [confidence] finding + file:line evidence)
## Part A check (type-match / ref_type / residue / KEEP preservation)
## Cross-ref resolution check
## Verification outputs  (paste type-match + residue + D5 + leak gate + git stat)
```
Type vocab: scenario_gap, checklist_gap, design_flaw, assumption_risk, general. Confidence ≥ 75 requires verified evidence. PASS honest if clean; don't invent or rubber-stamp.
