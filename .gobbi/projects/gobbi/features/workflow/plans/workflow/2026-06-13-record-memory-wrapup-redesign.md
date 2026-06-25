---
name: record-memory-wrapup-redesign
description: 11-task plan to rename memorization/memory vocabulary and restructure wrap-up into a 5-stage gated pipeline
type: plans
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: []
keywords: [workflow, vocabulary-rename, wrap-up-pipeline, skill-split]
author: claude
supersedes: null
superseded_by: null
task_count: 11
---

# Record / memory / wrap-up-pipeline redesign

## Idea anchor
`1-ideation/outputs/ideation-record-memory-wrapup-redesign.md` (PASS iter2, locked). Will promote to `features/workflow/design/` at Wrap-up.

## Scope Contract reference
Locked Scope Contract in the Ideation canonical artifact § Scope Contract. Goal: rename gobbi's memorization/memory vocabulary and restructure wrap-up into a 5-stage gated pipeline, so the per-loop-capture job and the durable-promotion job have distinct, unambiguous names. Decisions D1–D14 binding (D15 = Planning iter1 FAIL→revise).

## Sub-tasks

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| 1 | Scaffold new skill dirs: git-mv memorization files to record/ + memory/, and workflow/memorization.md → workflow/record.md | — | file-existence (absolute $WT paths): record/SKILL.md, memory/{rules,memory-map}.md, memory/templates/ (17), workflow/record.md exist; memorization/ gone | executor |
| 2 | Split skill bodies: record/SKILL.md = per-loop RECORD procedure; memory/ = durable-CRUD standard | #1 | grep (own-completion only): 'session record' + self-pointer in record/SKILL.md; durable-memory desc in memory/rules.md | executor |
| 3 | Repoint ~197 cross-ref occurrences (record/ vs memory/ classification + workflow/record) | #1, #2 | grep: zero stale memorization-path refs in skills/agents | executor |
| 4 | Fix .claude/skills mirror (per-file symlinks) + settings.json Skill() perms | #1 | test -L+test -e new links; 17 template links; Skill(memory)+Skill(record) present, Skill(memorization) gone | executor |
| 5 | Fix .agents/skills mirror (dir-level symlinks, native Codex entry) | #1 | test -L+test -e .agents/skills/{memory,record}; memorization gone | executor |
| 6 | Fix plugin.json + marketplace.json prose | #1 | grep: no 'memorization' in the two manifests | assistant |
| 7 | Prose vocabulary sweep (49 live files + Glossary + delegation hard gate + 1 hook comment) | #3 | grep: zero session/project-memory prose + zero MEMORIZATION token in live skills/agents/hooks | executor |
| 8 | Add thin RECORD sections to 5 loop skills pointing at record/SKILL.md | #1, #7 | grep: record/SKILL.md referenced in all 5 loop SKILL.md | executor |
| 9 | Wrap-up 5-stage pipeline + manager git stage + D13 non-skippable rule + handoff spec | #7, #8 | grep: 'non-skippable', 'git finalization', 'shown to the session', '5-stage' in wrap-up/SKILL.md | executor |
| 10 | Reconcile CLAUDE.md + .codex/AGENTS.md top-block to 6-step machine | #7 | grep: Configuration+Preparation+Wrap-up present; '5 productive steps' gone | executor |
| 11 | Post-split gates: no-broken-symlink + presence + residual-vocab grep + 21-EXCLUDE diff-check | #4–#10 | 4 loud-failing gates (exit non-zero + diagnostic on any miss) — see Verification strategy summary | executor |

## Dependency graph
```
01 ──┬─→ 02 ──→ 03 ──→ 07 ──┬─→ 08 ──→ 09 ──┐
     │                       ├─→ 10 ─────────┤
     ├─→ 04 ─────────────────────────────────┤
     ├─→ 05 ─────────────────────────────────┤
     └─→ 06 ─────────────────────────────────┴─→ 11
```
Foundation (01-02-03) → mirrors (04-05-06, after 01) → prose+content (07-08-09-10, after 03) → gates (11, last). No symlink edit before its target dir exists.

## Verification strategy summary
Each task carries a runnable `verifies` command using ABSOLUTE worktree paths (`$WT=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-12-7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4`), self-declaring `WT`/`SK`/`AG`/`HK` inline so each runs standalone from any CWD — the gobbi skills live at project-relative `$WT/.gobbi/projects/gobbi/skills/`, the mirrors + entry docs at the worktree root `$WT/{.claude,.agents,plugins}`. Each verify asserts only what is true at that task's own completion. The gate that decides the whole plan is task 11, which runs FOUR loud-failing gates (each exits non-zero with a diagnostic on any miss): (a) no-broken-symlink — `find -L $WT -type l` zero broken; (b) PRESENCE — every required new loader entry (`test -L && test -e`, catching dangling) on `.claude/skills/{memory,record}/*` + the 17 template links + `.claude/skills/.../workflow/record.md` + `.agents/skills/{memory,record}`, plus both old `memorization` dirs gone, plus `Skill()` perm updated; (c) exhaustive-vocabulary residual grep returns only known intentional retentions; (d) ALL 21 EXCLUDE paths checked against `git diff --name-only 0e930a22`, non-zero if any appears.

## Open issues
- Ideation Medium residual (D-e manifest printed-command BRE/ERE syntax) — already quick-patched in Ideation draft-iter2; counts are ground-truth-correct. Carried as awareness for tasks 07/11: a copied manifest command must run under the correct grep dialect. Not a blocker.
- Task 03 (cross-ref classification) is the highest-risk task — the recorded form-blindness mistake (`sweep-grep-literal-loop-name-blindspot`) applies directly; mitigated by assigning all four sweep/verify mistakes and a residual-grep verify.
- Planning iter1 FAILed (both systems) on `verifies`/gate defects only (path-root, unsatisfiable task-02 verify, non-rigorous task-11 gates, one missing required skill). Fixed in iter2 (draft-iter2.md § iter1→iter2 changelog). Decomposition / DAG / anchors / handoff names preserved unchanged (evaluator Must-preserve list).
