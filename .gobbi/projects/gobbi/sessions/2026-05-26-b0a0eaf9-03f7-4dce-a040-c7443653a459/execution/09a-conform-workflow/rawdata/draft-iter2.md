---
date: 2026-05-27
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
task: T9a
iter: 2
status: DONE
---

# T9a iter2 execution notes — conform features/workflow

## Summary

iter2 REVISE on T9a. Three parts:
- Part A: restore stripped KEEP keys (project on README, title on wrap-up-step decisions file)
- Part B: de-crypt 8 cryptic-led headings across 4 workflow files
- Part C: codify explicit KEEP list subsection in §4.4 of canonical rules.md

## Part A — KEEP keys restored

- `features/workflow/README.md`: restored `project: gobbi` (stripped by 1287e88)
- `features/workflow/decisions/wrap-up-step-2-5-anchor-placement.md`: restored `title: "Wrap-up Step 2.5 anchor placement — new H3 after ### WORK discipline"` (recovered from git show 1287e88^)

## Part B — Title rewrites (before -> after)

### discussions/2026-05-24-wave-ordering-sequential-t1-t3.md
- H1: `# T1→T3 wave ordering — strict sequential confirmed` -> `# Wave ordering: strict sequential T1→T3 (workflow waves)`

### design/five-locked-decisions.md (5 H2s)
- `## LOCK #1 — T1→T3 strict wave ordering` -> `## Strict wave ordering: T1 completes before T3 (LOCK #1)`
- `## LOCK #2 — Tasks 07+08 shared executor` -> `## Shared-executor delegation for hook and reconstructor (LOCK #2)`
- `## LOCK #3 — T3 mistake bundle limited to Iron Law 7 procedural mistake` -> `## Mistake-bundle scope: Iron Law 7 only for T3 tasks (LOCK #3)`
- `## LOCK #4 — T1.j rollback semantics home: preparation/SKILL.md` -> `## Rollback semantics home: preparation/SKILL.md (LOCK #4)`
- `## LOCK #5 — T1.g direct-mode opt-out home: orchestration/SKILL.md row 5.5 footnote` -> `## Direct-mode opt-out home: orchestration/SKILL.md row 5.5 footnote (LOCK #5)`

### backlogs/lock2-shared-executor-mega-task-risk.md
- H1: `# LOCK #2 Tasks 07+08 shared-executor context-budget risk` -> `# Shared-executor context-budget risk (LOCK #2)`

### checklists/task01-t1c-trace-overclaim.md
- H1: `# Task 01 traces-to overclaim — T1.c edit assigned to Task 02` -> `# Conformance task traces-to overclaim — edit assigned to wrong task`

## Part C — §4.4 KEEP list

Replaced single-line "KEEP — never strip" sentence with an explicit subsection containing:
- Table of KEEP keys by category (base 9, cross-ref/linking, provenance/source, per-type lifecycle, backlog-specific)
- "When in doubt, KEEP" rule: S is a closed enumerated list; any key absent from S is by definition not a leak

## Verifications

1. Cryptic-led titles (broadened grep incl LOCK/Task/T-codes/etc): 0 matches
2. KEEP keys restored: `project: gobbi` in README, `title:` in decisions file
3. §4.5 gate on features/workflow: exit 123 (no matches = clean)
4. §4.4 KEEP list: confirmed present with table + "when in doubt" rule
5. git diff --name-only: exactly 7 files (rules.md + 6 workflow files)

## Files changed

- `.gobbi/projects/gobbi/skills/memorization/rules.md` (canonical, NOT symlink)
- `.gobbi/projects/gobbi/features/workflow/README.md`
- `.gobbi/projects/gobbi/features/workflow/decisions/wrap-up-step-2-5-anchor-placement.md`
- `.gobbi/projects/gobbi/features/workflow/discussions/2026-05-24-wave-ordering-sequential-t1-t3.md`
- `.gobbi/projects/gobbi/features/workflow/design/five-locked-decisions.md`
- `.gobbi/projects/gobbi/features/workflow/backlogs/lock2-shared-executor-mega-task-risk.md`
- `.gobbi/projects/gobbi/features/workflow/checklists/task01-t1c-trace-overclaim.md`
