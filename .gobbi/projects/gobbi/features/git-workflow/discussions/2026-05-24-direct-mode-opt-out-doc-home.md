---
name: direct-mode-opt-out-doc-home
description: User confirmed the direct-mode opt-out text lives in orchestration/SKILL.md at the worktree-creation step footnote, not in git/SKILL.md.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, direct-mode, orchestration-skill, doc-placement]
loop: planning
topic: direct-mode opt-out doc home — orchestration/SKILL.md or git/SKILL.md?
outcome: orchestration/SKILL.md worktree-creation footnote confirmed
---

# Direct-mode opt-out doc home

## Context

The worktree-first design (Design Decision D-5) preserves direct mode as a documented escape hatch: if `workflow.git.mode = 'direct'`, the worktree creation step is skipped and `worktreePath` remains null. The question was where to document this opt-out path.

## Question

Where should the direct-mode opt-out be documented?

## Options considered

1. **orchestration/SKILL.md worktree-creation footnote** (recommended) — co-locates the opt-out with the exact step it opts out of.
2. **git/SKILL.md workflow-mode docs** — alongside the general git workflow-mode documentation. Creates cross-skill indirection; an executor reading the orchestration step would need to cross-reference git/SKILL.md to find the opt-out.

## User decision

`orchestration/SKILL.md` worktree-creation footnote confirmed.

## Opt-out text

"If `workflow.git.mode = 'direct'`, the worktree creation step is skipped and `worktreePath` remains null."

Co-located with the smoke-test gate: `jq '.git.branch' session.json` must match `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` when worktree mode is active.

## Implication

The Execution task implementing the direct-mode opt-out owns both the footnote and the smoke-test gate. The file home is `orchestration/SKILL.md` at the worktree-creation step. `git/SKILL.md` gets the general critical-rule qualifier (worktreePath resolution) but NOT the direct-mode opt-out documentation.
