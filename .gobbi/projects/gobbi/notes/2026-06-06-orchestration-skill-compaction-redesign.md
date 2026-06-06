---
name: 2026-06-06-orchestration-skill-compaction-redesign
description: Work-log for the 10-task Chat-mode session that compacted and redesigned orchestration/SKILL.md — entry-point removal, always-worktree model, metadata recording, scripts packaging, and State Machine compaction.
type: notes
scope: project
feature: null
status: active
created: 2026-06-06
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [orchestration, workflow, git-workflow, agents, session-metadata, compaction]
---

# 2026-06-06 — Orchestration Skill Compaction + Redesign

Session `06668274-cee3-4bc0-9125-91a327467cd2`. Branch `chore/session-2026-06-05-06668274`. Merged to `develop` as `3b07ffc`.

## What the session did

A 10-task Chat-mode session worked through a compaction and redesign of `orchestration/SKILL.md` and several connected skill files. The work fell into four main arcs.

### Arc 1 — Entry Point removal + opening polish (tasks 01–02)

The session opened by removing `## Entry Point` from `orchestration/SKILL.md`. PR #262 had deliberately added this section, but the user judged it duplicative of `gobbi/SKILL.md`, which is already the canonical session-bootstrap front door. Task 01 removed the section, collapsed `## Orchestration Mode` to a 2-bullet list, and repointed the two inbound links to `#you-are-the-manager`. Task 02 went further: it removed the `## You Are the Manager` heading entirely so the manager-role paragraph now opens the skill with no heading, and repointed those two links again to the skill top with no fragment. The decision record `2026-06-05-orchestration-entry-point-removed-as-gobbi-front-door-duplicate.md` captures the full rationale and the WARNING to future sessions not to re-add `## Entry Point`.

Commits: `9a2b7ff` (task 01), `df87f60` (task 02).

### Arc 2 — Always-worktree model + Configuration restructure (tasks 03–05)

Tasks 03–05 dropped direct mode entirely and restructured the Step-1 procedure table. The 7-row table became 4 rows (Create Worktree / Resolve Settings / Init state.json / Init session.json). The direct-mode LOCK #5 block, the Smoke-test T1.h gate, the 3-tier bootstrap table, and the interview row 7 were all removed. The `conventions.md` file gained a new "§ Session-Worktree Branches" rule with the strict regex `^(claude|codex)-\d{4}-\d{2}-\d{2}-[0-9a-f]{8}-...` for session branch names.

Task 03 iter1 required a remediation iter2 to fix 6 dangling row-number cross-references (across `gobbi/SKILL.md`, `orchestration/SKILL.md`, and `chat-mode.md`) that a keyword-only blast-radius sweep had missed. This generated the process mistake `table-renumber-must-sweep-inbound-row-references.md`. Task 04 removed the pointer paragraph from `orchestration/SKILL.md § Step 1` (the project-memory baseline check is now owned solely by `gobbi/SKILL.md` session bootstrap). Task 05 cleaned the `git/SKILL.md` worktree section, updating it to match the new unconditional always-worktree model.

Decision promoted: `features/git-workflow/decisions/2026-06-05-always-worktree-model-replaces-direct-mode.md`.
Backlog deferred: `features/workflow/backlogs/interview-skill-line72-ties-gate-to-configuration.md` (the `interview/SKILL.md:72` wording still ties the gate to Configuration).

Commits: `46d93c8` (task 03 iter1), `72cee33` (task 03 iter2 remediation), `28d15e8` (task 04), `93ad7d2` (task 05).

### Arc 3 — Session operation metadata + orchestration scripts (tasks 06–09)

Tasks 06–09 addressed the long-standing gap in `session.json` `agents[]` token usage recording.

Task 06 identified the correct source: each agent's own transcript file, not the PostToolUse hook (which cannot resolve the worktree `session.json`) and not `toolUseResult.totalTokens` (a different, smaller metric). The schema was updated to version 2: `agents[]` entries now carry cumulative `tokensUsed` breakdowns; session-level `usage.sessionTotal` was added. The empirical reference doc `claude-code-transcript-tooluseresult-empirical.md` was corrected.

Task 07 packaged the reconciliation logic as two runnable shell scripts under `skills/orchestration/scripts/`: `agent-token-usage.sh` (single-agent transcript reader) and `reconcile-session-metadata.sh` (idempotent bulk orchestrator). The orchestration skill's `§ Recording workflow metadata` section was compacted: the prior `### Session metadata` sub-heading was removed, table column names were fixed, and git-stamp timing guidance was folded into the procedure body. Dogfood validation confirmed unit total `2544324` for one representative agent was reproduced exactly.

Tasks 08–09 evaluated the orchestration skill's State Machine section, removed the broken-hook caveat from `§ Recording workflow metadata` (the caveat had mixed session-init concerns into a recording section), and deferred the Step 1 row 4 stale hook claim as a backlog.

Task 06 required an evaluator REVISE + iter2 to fix a "preserved subsection reconstructed from memory" regression — the `verbatim-section-replacement-must-copy-preserved-parts-from-live-file.md` process mistake.

Decisions promoted: `features/agents/decisions/2026-06-06-session-operation-metadata-recording-from-agent-transcripts.md`, `features/agents/decisions/2026-06-06-workflow-metadata-fetch-packaged-as-orchestration-scripts.md`.
Backlog promoted: `features/agents/backlogs/step1-row4-stale-hook-auto-append-claim.md`.
Project backlog: `backlogs/wire-metadata-reconciler-into-wrapup-and-claude-mirror.md`.

Commits: `44ca2f6` (task 06 iter1), `7a119ad` (task 06 iter2 remediation), `88c6921` (task 07), `cf2b605` (task 08), `b9e07d5` (task 09 iter1), `0deaaab` (task 09 iter2 remediation).

### Arc 4 — State Machine compaction + Wrap-up (task 10 + merge)

Task 10 compacted `orchestration/SKILL.md § Workflow State Machine` from 103 lines to approximately 75 lines. The per-loop user-interaction gate rules were removed from orchestration (they are now canonically owned by `chat-mode.md §5` and `auto-mode.md §3/§6`). Inverted cross-refs in those mode docs were fixed. A GAP-1 "WORK + MEMORIZATION auto-advance" clause was added to `chat-mode.md §5`. The state-persistence table was redesigned (`Item|Value` format + `<ul><li>`). The `workflow.chat.tasks[]` row was compacted to a cross-ref — but the cross-ref was initially written without verifying the target held all the facts (the `trim-to-crossref-must-verify-target-holds-facts.md` process mistake), requiring an iter2 to re-home two missing facts.

Session wrap-up created this note, the handoff, and 11 staged-file promotions. The session branch was merged to `develop` as `3b07ffc`.

Decision promoted: `features/workflow/decisions/2026-06-06-per-loop-mode-gates-owned-by-mode-docs.md`.

Commits: `1565e97` (task 10 iter1), `6201fba` (task 10 iter2 remediation). Merge: `3b07ffc`.

## Process mistakes generated

Three process mistakes were staged and promoted to `features/guardrails/mistakes/` during this session:

1. `table-renumber-must-sweep-inbound-row-references.md` — when a table is renumbered, positional references ("row N") are invisible to keyword sweeps and must be swept separately. Layer-2 candidate.
2. `verbatim-section-replacement-must-copy-preserved-parts-from-live-file.md` — when replacing a whole section, copy preserved subsections from the live on-disk file, not from memory or a prior draft. Layer-2 candidate.
3. `trim-to-crossref-must-verify-target-holds-facts.md` — before trimming content to a cross-ref, open the target and verify it holds every fact being removed. Layer-2 candidate.

All three are flagged as Layer-2 promotion candidates (workspace-level skill storage across all projects).

## Commits (14 + merge)

| Commit | Task | Description |
|---|---|---|
| `9a2b7ff` | task-01 | Remove ## Entry Point from orchestration/SKILL.md |
| `df87f60` | task-02 | Polish opening; remove ## You Are the Manager heading |
| `46d93c8` | task-03 iter1 | Always-worktree model; restructure Step 1 table |
| `72cee33` | task-03 iter2 | Remediate 6 dangling row-number cross-references |
| `28d15e8` | task-04 | Remove project-memory-baseline-check pointer from Step 1 |
| `93ad7d2` | task-05 | Update git/SKILL.md worktree section |
| `44ca2f6` | task-06 iter1 | Session metadata schema v2 + recording reframe |
| `7a119ad` | task-06 iter2 | Remediate preserved-subsection regression |
| `88c6921` | task-07 | Ship orchestration scripts; compact § Recording workflow metadata |
| `cf2b605` | task-08 | State Machine evaluation + minor fixes |
| `b9e07d5` | task-09 iter1 | Remove broken-hook caveat from § Recording workflow metadata |
| `0deaaab` | task-09 iter2 | Remediation pass |
| `1565e97` | task-10 iter1 | Compact State Machine; flip mode-gate ownership to mode docs |
| `6201fba` | task-10 iter2 | Re-home two missing workflow.chat.tasks[] facts |
| `3b07ffc` | merge | Merge chore/session-2026-06-05-06668274 to develop |
