# Codex evaluator — N1 (README Subdirectories nav accuracy across 18 READMEs)

Independent adversarial evaluator, dual-system gobbi eval. A Claude executor (commit `3792cae`, 14 files) made each of 18 P_live READMEs' `## Subdirectories` section match the actual on-disk subdirs of that README's dir; 4 already-accurate READMEs were left untouched (minimal-edit). Verify nav accuracy. DO NOT trust the executor summary.

## Spec
- For EVERY one of the 18 READMEs (`.gobbi/projects/gobbi/{README,features/README,features/{agents,evaluation,git-workflow,guardrails,install-runtime,project-memory,workflow}/README,backlogs/README,decisions/README,design/README,learnings/README,mistakes/README,notes/README,plans/README,references/README,reviews/README}.md`), the `## Subdirectories` list MUST equal the actual `ls -d <its-dir>/*/` output (one entry per live subdir; leaf dirs say `_None_` or equivalent).
- §4.5 leak gate: empty across the 18 READMEs.
- Cross-refs added/changed must resolve.
- Scope: only README.md files touched; no content docs.

## Procedure (evidence-based — mandatory)
1. `cd` worktree `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`; `git show 3792cae --stat`.
2. For EACH of the 18 READMEs: extract live subdirs (`ls -d <dir>/*/` → basenames) and extract listed entries (lines matching `^- \`[a-z]+/\`` or similar inside `## Subdirectories`); confirm sets match. Flag any extra/missing entry as a real defect.
3. Cross-ref resolution on any added/changed link (whole tree).
4. §4.5 leak gate: `find .gobbi/projects/gobbi -name 'README.md' -not -path '*/archive/*' -not -path '*/sessions/*' -not -path '*/skills/*' -not -path '*/tmp/*' -not -path '.gobbi/projects/gobbi/agents/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'`
5. Scope: `git show 3792cae --stat` → only README.md files.

## Output (write this file, workspace-write)
Write to `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/N1-readme-nav-accuracy/evaluation/iter1/codex/findings.md`:
```
VERDICT: <PASS|REVISE|FAIL>
## Summary
## Findings  (each: [type] [severity] [confidence] finding + file:line evidence)
## Per-README nav-accuracy table
## Verification outputs  (paste leak gate + git stat)
```
Type vocab: scenario_gap, checklist_gap, design_flaw, assumption_risk, general. Confidence ≥ 75 requires verified evidence. PASS honest if every README's Subdirectories matches live; don't invent or rubber-stamp.
