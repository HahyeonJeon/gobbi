---
loop: execution
iter: 2
artifact_type: change-summary
created_at: 2026-05-25
status: final
supersedes: []
related:
  - execution/task-07/artifacts/verification-report.md
  - execution/task-07/staging/learnings/dual-system-cross-mirror-drift-detection.md
  - execution/task-07/staging/decisions/executor-main-tree-edit-near-miss.md
  - execution/task-07/staging/backlogs/project/stale-packages-cli-architecture-refs.md
---

# T07 Change Summary — gobbi-mistake-promote CLI eradication (4 surfaces, 2 commits)

## Task contract

T07 contracted: fix the `gobbi mistake promote` CLI defect on the surfaces outside `mistake/SKILL.md` (T03 handled that surface). Mechanism: keep the two-layer model, replace CLI instruction with Wrap-up-phase agent promotion.

## What shipped

### iter1 — commit f2356ca (4 surfaces)

Four contracted files changed:

1. **`.claude/CLAUDE.md` (lines 48 + 50)**: dropped `gobbi mistake promote` CLI instruction; replaced with two-layer model (Layer 1 = Wrap-up agent writes to project mistakes; Layer 2 = Wrap-up agent promotes to workspace-level skill storage). Also reconciled line 13's stale `packages/cli` + `gobbi workflow init` refs to the current orchestration-skill / markdown-driven model.

2. **`.gobbi/projects/gobbi/skills/gobbi/SKILL.md` (Layer-2 mechanism block)**: replaced Layer-2 description "run `gobbi mistake promote`" with "Wrap-up assistant promotion to workspace-level skill storage." Two-layer model now internally consistent.

3. **`.gobbi/projects/gobbi/skills/wrap-up/SKILL.md` (new Layer-2 section)**: added explicit Layer-2 promotion responsibility to the Wrap-up skill. Before this commit, the skill described only Layer-1 staging promotion. Now documents that Wrap-up is also responsible for Layer-2 promotion (session-staged mistakes → project mistakes → workspace-level skill storage).

4. **Backlog `gobbi-mistake-promote-command-does-not-exist.md`**: marked resolved via `## Resolution` section citing the T03/T07 split, the user-locked mechanism decision (keep two-layer model, Wrap-up-phase agent), and the independently-verified facts (ls + grep).

### iter2 — commit 6bf792a (1 surface, Codex-caught)

5. **`.codex/AGENTS.md` (lines 45 + 80-82)**: mirrored the CLAUDE.md fix onto the Codex-side entrypoint. Dropped `packages/cli`/`gobbi workflow init` stale framing on line 45; replaced mistake-promotion block (lines 80-82) with the two-layer model + Wrap-up sole-writer exception. The Codex-specific load path (`.agents/skills/mistake/SKILL.md`) preserved.

Iter2 surface was flagged by Codex evaluator (CONS-001, High/100); Claude evaluator and manager had missed it because cross-mirror drift is invisible to a single system that only checks its own entrypoint surfaces.

## Invariant preserved across all changes

Two-layer model KEPT (not dropped): Layer 1 = session staging → Wrap-up promotes staged mistakes to project `mistakes/`; Layer 2 = Wrap-up promotes project mistakes to workspace-level skill storage. No CLI command anywhere. Wrap-up assistant is the sole writer.

## Tree-wide eradication status

`grep -rl 'gobbi mistake promote'` over `.claude/`, `.gobbi/projects/gobbi/skills/`, `.codex/`, `.agents/` = **NONE REMAIN** (verified by Codex iter2 evaluator + manager independent check).

## Out-of-contract finding deferred

Codex iter2 also raised OVERALL-001 (High/90): stale `packages/cli` architecture references in `gobbi/SKILL.md:74` + `gobbi/SKILL.md:129` + `delegation/templates/assistant.md:14`. User dispositioned **DEFERRED** — out of T07's contracted scope. Backlog staged at `execution/task-07/staging/backlogs/project/stale-packages-cli-architecture-refs.md`.
