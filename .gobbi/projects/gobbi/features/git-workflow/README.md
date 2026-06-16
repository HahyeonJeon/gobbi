---
name: git-workflow
description: Worktree-isolated sessions plus the dual-runtime branch / PR / issue git lifecycle across Claude Code and Codex
type: features
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, dual-runtime, codex, claude-code, worktree, pr-lifecycle]
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

Shipped this session: the dual-runtime git skill. The `git` skill now carries a "Runtime git
environment" section (CC sandbox + Codex `sandbox_mode`/`approval_policy`/`network_access`), a
read-only runtime-posture probe (`git-posture-probe.sh`), a five-trigger PR-deferral with an
Always-Ask remediation menu, a sandbox-boundary framing of the commit-vs-push split, merge-conflict
handling in the P5/P7 family, and a "Worktree CWD discipline" section that resolves the previously
dangling `codex/SKILL.md:254` cross-reference. Both Execution evaluators returned PASS. Deferred:
DD-6 git-lifecycle hook telemetry (backlog).

## Subdirectories

- `references/` — 9 files: CC + Codex sandbox / approval / network documentation (the external prior art the design rests on)
- `design/` — 7 files: DD-1 … DD-7 (runtime model, five-trigger deferral, posture probe, merge-conflict, sandbox-boundary split, hooks-additive, Worktree CWD discipline)
- `decisions/` — 3 files: codex-skill prior-art alignment, probe per-field reliability, role-prompt verification correction
- `discussions/` — 2 files: Codex-first-class scope lock; post-research D1–D4 locks + REVISE handling
- `scenarios/` — 1 file: feature-memory-absent readiness scenario
- `checklists/` — 1 file: remediation-must-be-ask-only security checklist
- `plans/` — 1 file: the 7-task dual-runtime git skill plan
- `backlogs/` — 1 file: DD-6 git-lifecycle hook telemetry (deferred)
- `changelogs/` — 1 file: the 9-commit dual-runtime git skill ship

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-14 | 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d | Bootstrapped the feature. Shipped the dual-runtime git skill (9 commits, `9d522168..ab25dce0`). Promoted 9 references + 7 design + 3 decisions + 2 discussions + 1 scenario + 1 checklist + 1 plan + 1 backlog + 1 changelog. |

## Open items

- DD-6 git-lifecycle telemetry in hooks — deferred at Planning, user-confirmation gated. See `backlogs/git-lifecycle-telemetry-in-hooks.md`.
- OQ-5 read-only Codex policy + the F5 plan-nit are noted in the session journal `notes/2026-06-14-dual-runtime-git-skill.md`.

## Related

- `skills/git/SKILL.md` — the dual-runtime git skill (the feature's primary subsystem)
- `skills/codex/SKILL.md` — the canonical Codex sandbox-vocabulary source the git skill aligns with
- Two project-scope process mistakes recorded this session: `mistakes/grep-absence-claim-needs-exact-pattern.md`, `mistakes/staging-a-mistake-candidate-does-not-fix-the-artifact.md`
