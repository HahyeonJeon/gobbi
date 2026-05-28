---
loop: execution
iter: 2
artifact_type: change-summary
created_at: 2026-05-28
status: final
supersedes: []
related:
  - execution/N1-readme-nav-accuracy/artifacts/verification-report.md
  - execution/N1-readme-nav-accuracy/artifacts/memory-reads.md
---

# N1 — README Subdirectories Nav Accuracy: Change Summary

## Task

Make each of the 18 P_live READMEs' `## Subdirectories` section match `ls -d <dir>/*/` exactly. This was the last task of the prose wave.

## Commits

### iter1 — `3792cae` (14 files; +88/-15)

`docs(prose): N1 — README Subdirectories nav accuracy across 18 P_live READMEs`

Files modified:

- `.gobbi/projects/gobbi/README.md` — added 12 memory-tier bullet entries + prose footnote for 4 non-memory surfaces
- `.gobbi/projects/gobbi/backlogs/README.md` — added `_None_` leaf placeholder
- `.gobbi/projects/gobbi/decisions/README.md` — added `_None_` leaf placeholder
- `.gobbi/projects/gobbi/design/README.md` — added `_None_` leaf placeholder
- `.gobbi/projects/gobbi/features/README.md` — added 7-entry bullet list
- `.gobbi/projects/gobbi/features/agents/README.md` — corrected to 7-entry bullet list
- `.gobbi/projects/gobbi/features/evaluation/README.md` — corrected to 5-entry bullet list
- `.gobbi/projects/gobbi/features/project-memory/README.md` — corrected to 10-entry bullet list
- `.gobbi/projects/gobbi/learnings/README.md` — added `_None_` leaf placeholder
- `.gobbi/projects/gobbi/mistakes/README.md` — added `_None_` leaf placeholder
- `.gobbi/projects/gobbi/notes/README.md` — added `_None_` leaf placeholder
- `.gobbi/projects/gobbi/plans/README.md` — added `_None_` leaf placeholder
- `.gobbi/projects/gobbi/references/README.md` — added `_None_` leaf placeholder
- `.gobbi/projects/gobbi/reviews/README.md` — added `_None_` leaf placeholder

4 already-accurate feature READMEs left untouched (minimal-edit discipline):
- `features/git-workflow/README.md`
- `features/guardrails/README.md`
- `features/install-runtime/README.md`
- `features/workflow/README.md`

### iter2 — `66bf1be` (root README fix)

`docs(prose): N1 iter2 — add 4 non-memory surfaces as bullet entries`

Fixes the root README (`README.md`): adds `agents/`, `sessions/`, `skills/`, and `tmp/` as explicit bullet entries under `## Subdirectories`, each annotated with `_(non-memory surface ...)_` notes preserving §4-scope intent. Result: 16/16 live subdirs listed as bullets; the earlier prose footnote removed.

## Scope

All changes confined to `README.md` files under `.gobbi/projects/gobbi/`. No skills, agents, or other files touched.

## Final state

18 READMEs audited. 18 PASS after iter2. The root README now lists all 16 live subdirectories as bullet entries (12 memory-tier + 4 non-memory-tier with scope annotations).
