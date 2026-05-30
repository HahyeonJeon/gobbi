# Codex Overall Re-check - Preparation iter2

## Check 1 - RESOLVED

The `claude` skill is now represented as absent, not present.

- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:68`: "`claude` (`.claude/` doc-authoring standard) | NO - known-absent dangling reference (FLAG-2)"
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:73`: "`ls .gobbi/projects/gobbi/skills/` confirms **no `claude` dir exists**"
- Filesystem check: `.gobbi/projects/gobbi/skills/` lists 18 dirs (`codex` through `wrap-up`) and no `claude`; direct `test -d .gobbi/projects/gobbi/skills/claude` returned `NO claude dir`.

## Check 2 - UNRESOLVED

The original "Generated this loop: None" contradiction is fixed in the narrow sense that the section now names the staged files, but the readiness accounting is still internally contradictory: the filesystem has 5 decision files plus 1 design file, while the artifact still claims 4 decisions + 1 design in two places and "5 files" in the generated section.

- Filesystem check: `preparation/staging/decisions/` contains 5 `.md` files; `preparation/staging/design/` contains 1 `.md` file.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:30`: "`preparation/staging/` holds ONLY this loop's 4 decisions + 1 design"
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:47`: "`preparation/staging/` for this loop's 4 decisions + 1 design"
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:150`: "5 session-staged files ... The 5 files:"
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:152-157`: the bullets actually enumerate 6 files, including the DD-7 decision and the design file.

## Check 3 - RESOLVED

All staged decision files now have `decision_status: ratified`; I found no `decision_status: proposed` or `decision_status: open` frontmatter, and no residual status label asserting the user-ratified hook/permissions/18-skill items remain open.

- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/staging/decisions/bounded-package-root-and-marketplace-source-resolved.md:13`: `decision_status: ratified`
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/staging/decisions/drift-resync-trigger-and-mechanical-gate-resolved.md:13`: `decision_status: ratified`
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/staging/decisions/hook-double-registration-steady-state-dev-vs-installed-split.md:13`: `decision_status: ratified`
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/staging/decisions/permissions-disposition-keep-project-local-verify-empirically.md:13`: `decision_status: ratified`
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/staging/decisions/worktree-test-default-git-ref-source-with-sentinel.md:13`: `decision_status: ratified`
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:179`: "**RATIFIED: Option C (dev-vs-installed split)**"
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:181`: "**RATIFIED: do not ship entries; keep project-local; verify auto-grant via post-install invocability check**"
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:182`: "**RATIFIED: package all 18**"

## Check 4 - UNRESOLVED

One new/still-present consistency issue exists: the DD-7 decision file is present and listed, but the artifact's summary/accounting did not update from 4 decisions/5 staged files to 5 decisions/6 staged files. I did not find a new contradiction in the fire-once operationalization or cross-phase path roots beyond that staged-file accounting mismatch.

- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:98`: "clean installed-only environment (plugin installed, NO in-repo `.claude/settings.json` dev registrations active" - consistent with Option C's dev-vs-installed split.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/staging/decisions/hook-double-registration-steady-state-dev-vs-installed-split.md:35-37`: keeps the two hook sources coherent, validates installed-only fire-exactly-once, and documents the accepted double-fire caveat.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/staging/decisions/worktree-test-default-git-ref-source-with-sentinel.md:13`: `decision_status: ratified`
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:156`: DD-7 is listed in Generated this loop, but the surrounding count at line 150 says "5" and the earlier accounting at lines 30 and 47 says "4 decisions + 1 design."

## NEW-ISSUES

### COD-OVERALL-ITER2-001 - High/90 - Staged-file accounting still contradicts the filesystem after DD-7 was added

The remediation added/listed the DD-7 staged decision but did not update all readiness-accounting counts. Actual staged output is 6 files (5 decisions + 1 design). The artifact still states "4 decisions + 1 design" and "5 files." This is the same readiness-accounting class as prior COD-OVERALL-001(b), so it remains blocking until the counts and summary prose match the filesystem.

Evidence:
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:30`: "`preparation/staging/` holds ONLY this loop's 4 decisions + 1 design"
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:47`: "`preparation/staging/` for this loop's 4 decisions + 1 design"
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:150`: "5 session-staged files ... The 5 files:"
- Filesystem check: `preparation/staging/decisions/` = 5 files; `preparation/staging/design/` = 1 file.

VERDICT: REVISE

## Micro-confirmation (count fix)

Confirmed only COD-OVERALL-ITER2-001 staged-file accounting.

Evidence:
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:30`: `preparation/staging/` holds ONLY this loop's 5 decisions + 1 design.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:47`: `preparation/staging/` holds this loop's 5 decisions + 1 design.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:150`: 6 session-staged files (5 decisions + 1 design); the 6 files.
- Filesystem check: `ls .../preparation/staging/decisions/ | wc -l` = 5; `ls .../preparation/staging/design/ | wc -l` = 1.

VERDICT: PASS
