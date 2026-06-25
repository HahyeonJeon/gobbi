---
name: session-memory-redesign
description: 10-task plan for the session-memory directory redesign — spec doc + scaffold script + verify script + D7 cadence correction + 5 doc-sweep clusters + integration gate.
type: plans
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: []
keywords: [session-memory, scaffold, doc-sweep, workflow]
author: claude
task: redesign the per-session working-memory directory structure
supersedes: null
superseded_by: null
task_count: 10
---

# Session-memory redesign plan

## Idea anchor

`features/workflow/design/workflow/session-memory-tree.md` — the design this plan implements.

## Scope Contract reference

Design `:142-159` (in-scope/out-of-scope). In scope: flat+numbered loop dirs, 4-slot interior, single root transcripts/, C1 spec doc, C2 scaffold script + verify script, C3 rules carve-out, D7 lifecycle correction, Wrap-up promotion-inventory rule, full doc sweep. Out of scope: `interview/` interior, FLAG-1, FLAG-2, promotion-routing changes, JSON-key changes, retention store, runtime TS.

## Sub-tasks

| # | Sub-task | Depends on | Verification |
|---|---|---|---|
| 01 | CREATE `orchestration/templates/session-tree.md` — single source of truth; 11-point contents | — | File exists; contains ASCII tree + {N} ordinal map + 4 slot names + F-P2 line (interview/staging/ stays a promotion source) + SEAM-3 bare-key rule |
| 02 | CREATE `orchestration/scripts/scaffold-session-dir.sh` — idempotent materializer; embedded dir manifest; fail-closed path-validation | 01 | `bash -n` parses; `1-ideation` creates working/{,research}/ evaluation/ staging/ staging subdirs, NO transcripts/, NO outputs/; `--pass` adds outputs/; re-run byte-identical; negative cases exit non-zero + create nothing |
| 03 | CREATE `orchestration/scripts/verify-session-tree.sh` — `--check` sync-check gate; diffs script-created subtree only (not root transcripts/JSON); negative cases | 01, 02 | `bash -n` parses; `--check` exits 0 against current spec+scaffold for `<step-dir>` subtree ONLY; negative-case block returns non-zero; bad args exit 2 with usage |
| 04 | D7 git-verify + cadence correction — verify git behavior in scratch repo, then correct per-iter commit-cadence wording in 5 PHASE workflow files; conditional co-touch of `git/SKILL.md` | 01 | Zero surviving "chore(session): record" no-op claims; 5 phase files state gitignored/ephemeral reality; `git/SKILL.md` verified consistent |
| 05 | Memorization standard cluster — D1,D2,D3,D4,D6,D8 + C3 rules carve-out across `memorization/SKILL.md`, `memory-map.md`, `rules.md`, 15 templates | 01 | Zero `{loop}/rawdata/` / `{loop}/artifacts/` / `transcript-iter` tokens; rules.md has §1.3 carve-out; SKILL.md transcript section describes single-root `{role}-{agentId}.jsonl` |
| 06 | Orchestration core cluster — D1,D2,D3,D4,D6,D8 to orchestration SKILL + auto-mode + chat-mode + workflow/memorization + workflow/evaluation | 01, 02, 03 | Zero stale tokens; orchestration/SKILL.md Configuration references scaffold script + creates root transcripts/ + links spec doc + names verify script as gate |
| 07 | Loop skills cluster — D1,D2,D4,D8 to 5 loop SKILLs + their evaluation.md; execution/SKILL.md also D6; wrap-up/SKILL.md also gets Fix-5 + F-P2 wording | 01 | Zero stale tokens; execution/SKILL.md per-task nesting uses task-{NN}-{slug}/; wrap-up/SKILL.md states staging/ only + keeps interview/staging/ as valid source |
| 08 | Cross-cutting skills cluster — D1,D4 to evaluation/SKILL.md; D1,D2 to research/SKILL.md, mistake/SKILL.md, gobbi/SKILL.md; RECONCILE codex/SKILL.md | 01 | Zero stale tokens; codex/SKILL.md uses canonical placeholders + 4-execution/task-{NN}-{slug}/; research/SKILL.md still references rawdata/research/ (intentional) |
| 09 | Agents + delegation cluster — D1,D2,D4 to agents/assistant.md, delegation/SKILL.md, delegation/templates/leader.md | 01 | Zero stale tokens in 3 files; delegation/templates/evaluator.md confirmed still 0 session-path tokens |
| 10 | Full sweep verification — repo-wide regression grep + `verify-session-tree.sh --check` | 01–09 | verify script exits 0; zero stale per-loop interior tokens describing NEW shape; all 46 edit-set files show expected deltas; 7 script/hook files unchanged |

## Dependency graph

01 → 02 → 03; 01 → {04,05,07,08,09} (independent, disjoint files); {02,03} → 06; {01–09} → 10.

Recommended sequential spine: `01 → 02 → 03 → 04 → 06 → 05 → 07 → 08 → 09 → 10`. Any topological order honoring the hard constraints is valid.

## Verification strategy summary

Task 10 is the integration gate. It runs `verify-session-tree.sh --check` (exits 0 if spec-to-script sync-check passes) and a repo-wide regression grep proving zero stale tokens across all 46 edited files. The 7 script/hook files are confirmed unchanged.

## Open issues

- git/SKILL.md D7 lifecycle co-touch is conditional (verify-that-may-edit): verify exact git behavior of committing gitignored-only changes in a scratch repo before deciding whether to edit. Task 04 owns this.
- F-P2 wording in task 07 is a semantic nuance (keep interview/staging/ as a promotion source while excluding transcripts/) — not grep-detectable; executor brief must carry the design + inventory F-P2 text.
