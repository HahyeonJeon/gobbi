---
name: codex-first-class-scope
description: User locked Codex as first-class equal coverage target; scope = git docs + runtime wiring + new helper scripts if justified
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [codex]
keywords: [scope, dual-runtime]
author: claude
outcome: Codex first-class; scope = git skill docs + .codex/ + agents + hooks (additively) + scripts
---

# Session setup — Codex coverage depth and initial scope

## Context

At session start the user specified the task as "Improve the git skill so it fully covers
git/GitHub operations performed by agent tools (Claude Code + Codex)." Two scope questions
needed locking before research could begin.

## Question

1. Codex coverage depth — first-class equal coverage or secondary?
2. Implementation change scope — which files/categories are in scope?

## Options considered

1a. Codex first-class (equal coverage): full dual-runtime model.
1b. Codex secondary (mention only): lighter; would leave the real gaps unaddressed.

2a. Git skill docs + runtime wiring + new scripts if justified.
2b. Git skill docs only (no runtime wiring).

## User decision

1. Codex first-class, equal coverage.
2. Scope = "Git skill docs + git-related runtime + write scripts if it's necessary."
   Interpreted as: `skills/git/` docs + git-related runtime wiring (hooks, `.codex/agents/*.toml`,
   agent prompts) + new helper scripts if research justifies them.

## Implication

The research phase focused equally on Codex and Claude Code sandbox behaviors. No Codex-lite
shortcut. Scripts (specifically the runtime-posture probe) are in scope if research confirms they
are warranted — which it did (D3).

## Related

- `working/discussion-log.md` — 2026-06-14T05:42:41Z entry
- D1 (wiring scope) + D3 (probe script) in `working/draft-iter2.md § Decisions Log`
