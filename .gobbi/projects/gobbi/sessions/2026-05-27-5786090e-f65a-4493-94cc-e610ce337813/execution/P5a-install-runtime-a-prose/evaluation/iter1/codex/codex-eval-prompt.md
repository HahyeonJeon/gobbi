# Codex evaluator — P5a prose wave (features/install-runtime A: discussions+design+decisions+changelogs, 24 docs)

Independent adversarial evaluator, dual-system gobbi eval. A Claude executor reshaped 24 docs under `features/install-runtime/{discussions,design,decisions,changelogs}/` to §4 (commit `520cdb2`, 21 files changed; 3 already-conformant docs untouched). Find what is wrong. DO NOT trust the executor summary — diff the commit and read the files.

## Spec (§4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`)
- §4.2 per-type COMPLETE section contract vs template `.gobbi/projects/gobbi/skills/memorization/templates/{type}.md`: decisions/design→ADR (Context/Decision-or-Approach/Rationale/Alternatives considered/Consequences + Related); discussions→Context/Question/Options considered/User decision/Implication/Related; changelogs→`**Task:**`+Summary/What changed/Verification/Deferred/Related.
- §4.3 self-contained prose: no LOAD-BEARING body session coords (frontmatter `tags:`/`topic:`/`outcome:` values are NOT body — out of §4.3 scope). Narrative reclassified to PROJECT-level notes only.
- §4.4 KEEP keys never stripped.

## Procedure (evidence-based — mandatory)
1. `cd` to worktree `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`; `git show 520cdb2 --stat`; `git show 520cdb2 -- <each file>`.
2. CONTENT PRESERVATION (highest priority — prior tasks had a false-PASS-without-diffing and a weakened-precise-pointer): the 3 journal-shaped decisions reshaped to ADR (`env-file-load-semantics`, `pre-planning-readiness`, `session-start-hook-script`, `task-decomposition`) are the main risk — confirm ALL their content (P1-P7, FIX tables, findings α-δ, commits) survives in the ADR sections, nothing dropped/weakened. Grep key tokens in post-images.
3. §4.2 COMPLETE contract per doc against its template.
4. CROSS-REF RESOLUTION (search WHOLE tree, not just siblings): every `## Related`/inline doc link must point to an EXISTING file (`ls`). Flag dangling links; flag any ref REMOVED whose target actually exists somewhere under `.gobbi/projects/gobbi/`; flag any precise path WEAKENED to a parent dir.
5. D5 BODY scan: `grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/features/install-runtime/{discussions,design,decisions,changelogs}/ --include='*.md' | grep -vE '/archive/'` — survivors legitimate (frontmatter lines / literal existing-file paths)?
6. §4.5 leak gate (0): `find .gobbi/projects/gobbi/features/install-runtime/{discussions,design,decisions,changelogs} -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'`
7. Scope: only the 4 in-scope subdirs touched; no archive, no P5b docs (README/backlogs/checklists/scenarios/references/plans).

## Output (write this file, workspace-write)
Write to `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P5a-install-runtime-a-prose/evaluation/iter1/codex/findings.md`:
```
VERDICT: <PASS|REVISE|FAIL>
## Summary
## Findings  (each: [type] [severity] [confidence] finding + file:line evidence)
## Cross-ref resolution check
## Verification outputs  (paste D5 + leak gate + git stat)
```
Type vocab: scenario_gap, checklist_gap, design_flaw, assumption_risk, general. Confidence ≥ 75 requires verified evidence. PASS honest if clean; don't invent or rubber-stamp.
