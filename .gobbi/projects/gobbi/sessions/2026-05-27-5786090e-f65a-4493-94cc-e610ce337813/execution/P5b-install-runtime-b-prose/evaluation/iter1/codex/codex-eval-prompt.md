# Codex evaluator — P5b prose wave (features/install-runtime B: rest + README, 20 docs)

Independent adversarial evaluator, dual-system gobbi eval. A Claude executor reshaped 20 docs under `features/install-runtime/{backlogs,checklists,references,scenarios}/` + README to §4 (commit `e94e94b`). Find what is wrong. DO NOT trust the executor summary — diff the commit and read the files.

## Spec (§4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`)
- §4.2 per-type COMPLETE section contract vs template `.gobbi/projects/gobbi/skills/memorization/templates/{type}.md`: backlogs→Context/Why deferred/When to pick up/Suggested approach/Originating session (with CONCRETE `sessions/{anchor}/` path); checklists→ONE of two forms (A: title "— implementation checklist" + `| # | Item | Anchor | Status | Verification |` table + `## Item details`; OR B: `## What`/`## Why`/`## Verification`/`## Status notes`) — an ad-hoc shape FAILS; references→Insight/`## Related`(between Insight and Why-it-applies)/Why it applies/Source/Excerpt/Usage history; scenarios→`**Category:**`/`**Coverage:**`+Situation/Inputs/Expected behavior/Verification/`## Related`; README→Overview/Status/Subdirectories/Recent activity/Open items/Related with Subdirectories matching ACTUAL live dirs.
- §4.3: no LOAD-BEARING body session coords (frontmatter values are NOT body). Reclassification → project-level notes only.
- §4.4 KEEP keys never stripped.

## Procedure (evidence-based — mandatory)
1. `cd` worktree `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`; `git show e94e94b --stat`; `git show e94e94b -- <each file>`.
2. CONTENT PRESERVATION (highest priority — prior tasks had false-PASS-without-diffing + weakened-pointer + removed-existing-ref defects): every ADR→backlog and table→scenario reshape must keep ALL facts (grep key tokens in post-images); nothing dropped/weakened.
3. §4.2 COMPLETE contract per doc against its template. Checklists: verify each matches ONE form exactly (not ad-hoc). Backlogs: verify `## Originating session` has the concrete `sessions/{full-id}/` path. README: verify `## Subdirectories` == `ls -d features/install-runtime/*/`.
4. CROSS-REF RESOLUTION (search WHOLE tree): every `## Related`/inline path-link points to an EXISTING file (`ls`). Flag dangling links; flag any ref REMOVED whose target exists somewhere under `.gobbi/projects/gobbi/`; flag any precise path WEAKENED to a parent dir. Confirm no `staging/backlogs/project/ci-symlink-integrity-check.md` stale path remains.
5. D5 BODY scan: `grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/features/install-runtime/{backlogs,checklists,references,scenarios}/ .gobbi/projects/gobbi/features/install-runtime/README.md --include='*.md' | grep -vE '/archive/'`
6. §4.5 leak gate (0): `find .gobbi/projects/gobbi/features/install-runtime/{backlogs,checklists,references,scenarios} .gobbi/projects/gobbi/features/install-runtime/README.md -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'`
7. Scope: only the 4 in-scope subdirs + README; no archive, no P5a docs (discussions/design/decisions/changelogs).

## Output (write this file, workspace-write)
Write to `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P5b-install-runtime-b-prose/evaluation/iter1/codex/findings.md`:
```
VERDICT: <PASS|REVISE|FAIL>
## Summary
## Findings  (each: [type] [severity] [confidence] finding + file:line evidence)
## Cross-ref resolution check
## Verification outputs  (paste D5 + leak gate + git stat)
```
Type vocab: scenario_gap, checklist_gap, design_flaw, assumption_risk, general. Confidence ≥ 75 requires verified evidence. PASS honest if clean; don't invent or rubber-stamp.
