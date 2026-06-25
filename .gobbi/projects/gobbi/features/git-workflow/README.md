---
name: README
description: Worktree-isolated sessions plus the dual-runtime branch / PR / issue git lifecycle across Claude Code and Codex
type: features
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: []
keywords: [git, dual-runtime, codex, claude-code, worktree, pr-lifecycle]
author: claude
value_proposition: Every gobbi session runs git/GitHub operations safely across both agent runtimes, with each runtime's sandbox and approval model handled correctly by default.
subsystems: [skills/git, skills/git/scripts/git-posture-probe.sh, skills/codex/SKILL.md, .codex/config.toml, .codex/agents]
---

# git-workflow

## Overview

`git-workflow` is the gobbi value-feature for worktree-isolated sessions and the branch / PR /
issue git lifecycle. It owns the `git` skill. This feature directory was bootstrapped on
2026-06-14 when the git skill was made dual-runtime — correct for both Claude Code and Codex,
safe-by-default under each runtime's sandbox / approval / network model.

## Status

The git lifecycle is now correct AND complete across the whole session lifecycle (Configuration →
Wrap-up), for both runtimes. Session 2026-06-16 finalized the operation set on top of the
2026-06-14 dual-runtime base: `git/SKILL.md` P5 reorders worktree-removal before branch-delete
(root fix for the `gh pr merge --delete-branch` worktree-held-branch conflict witnessed in PR #302),
adds the sanctioned `git branch -D` carve-out, a new P8 liveness-protected/TOCTOU-guarded retro
bulk-cleanup procedure, and PR-association issue done-detection; `conventions.md` drops
`--delete-branch` from the merge strategy. The feature now carries a standing 50-scenario lifecycle
baseline + per-phase checklists for eval. The first P8 retro-sweep ran this session (27+3 branches,
2 worktrees, 45 issues; the live concurrent session protected). All Execution evaluators returned
PASS over 2 iters.

Earlier (2026-06-14) the dual-runtime git skill shipped: a "Runtime git environment" section
(CC sandbox + Codex `sandbox_mode`/`approval_policy`/`network_access`), a read-only runtime-posture
probe (`git-posture-probe.sh`), a five-trigger PR-deferral with an Always-Ask remediation menu, a
sandbox-boundary framing of the commit-vs-push split, merge-conflict handling in the P5/P7 family,
and a "Worktree CWD discipline" section. Deferred: DD-6 git-lifecycle hook telemetry (backlog).

## Subdirectories

- `references/` — 9 files: CC + Codex sandbox / approval / network documentation (the external prior art the design rests on)
- `design/` — 7 files: DD-1 … DD-7 (runtime model, five-trigger deferral, posture probe, merge-conflict, sandbox-boundary split, hooks-additive, Worktree CWD discipline)
- `decisions/` — 4 files: codex-skill prior-art alignment, probe per-field reliability, role-prompt verification correction, git-completeness Ideation DQ1–DQ4 locks
- `discussions/` — 2 files: Codex-first-class scope lock; post-research D1–D4 locks + REVISE handling
- `scenarios/` — 2 files: feature-memory-absent readiness scenario; the 50-scenario git-operation lifecycle baseline
- `checklists/` — 2 files: remediation-must-be-ask-only security checklist; the per-phase git-operation checklists
- `plans/` — 1 file: the 7-task dual-runtime git skill plan
- `backlogs/` — 1 file: DD-6 git-lifecycle hook telemetry (deferred)
- `changelogs/` — 1 file: the 9-commit dual-runtime git skill ship

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-14 | 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d | Bootstrapped the feature. Shipped the dual-runtime git skill (9 commits, `9d522168..ab25dce0`). Promoted 9 references + 7 design + 3 decisions + 2 discussions + 1 scenario + 1 checklist + 1 plan + 1 backlog + 1 changelog. |
| 2026-06-16 | 3596d7f1-ee88-4055-8e66-a67f977812ad | Finalized git-operation completeness. P5 reorder + sanctioned `-D` + P8 retro/bulk cleanup + PR-association done-detection (6 commits `13736c32..bbae2d8a`). First P8 retro-sweep run (27+3 branches, 2 worktrees, 45 issues; live session protected). Promoted 1 decision (DQ1–DQ4) + 1 scenario (50-scenario baseline) + 1 checklist + 1 project report (retro-sweep) + 2 project process mistakes. |

## Open items

- DD-6 git-lifecycle telemetry in hooks — deferred at Planning, user-confirmation gated. See `backlogs/git/git-lifecycle-telemetry-in-hooks.md`.
- OQ-5 read-only Codex policy + the F5 plan-nit are noted in the session journal `notes/2026-06-14-dual-runtime-git-skill.md`.
- Layer-2 (workspace) promotion of the 2 process write-safety mistakes (`mistakes/tooling/absolute-path-typo-on-write-evades-cwd-guard.md`, `mistakes/verification/edit-write-tool-success-without-disk-persistence.md`) — deferred this session per user decision.

## Related

- `skills/git/SKILL.md` — the dual-runtime git skill (the feature's primary subsystem)
- `skills/codex/SKILL.md` — the canonical Codex sandbox-vocabulary source the git skill aligns with
