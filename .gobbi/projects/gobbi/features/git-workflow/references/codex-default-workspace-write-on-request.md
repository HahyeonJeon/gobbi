---
name: codex-default-workspace-write-on-request
description: Codex default in a git repo is workspace-write + on-request approvals; gobbi always runs in a repo
type: references
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, codex, sandbox, approval, defaults, runtime]
title: Codex CLI default in a version-controlled folder is "Auto" = workspace-write sandbox + on-request approvals
source: https://developers.openai.com/codex/agent-approvals-security
accessed: 2026-06-14
ref_type: docs
---

# Codex CLI default in a version-controlled folder is "Auto" = workspace-write sandbox + on-request approvals

## Insight

On launch in a version-controlled folder, Codex recommends the "Auto" preset =
`sandbox_mode = "workspace-write"` + `approval_policy = "on-request"`. In a non-version-controlled
folder it defaults to `read-only`. Three sandbox modes: `read-only`, `workspace-write`,
`danger-full-access`; approval values: `untrusted` / `on-request` / `never` (`on-failure`
deprecated). Set in `config.toml` via `sandbox_mode` and `approval_policy`.

## Related

- EXT-CODEX-1 — the internal insight label in draft-iter2.md
- DD-1 — dual-runtime git environment model
- C02 checklist item

## Why it applies

Gobbi always runs in a git repo (worktree model), so the relevant Codex default is workspace-write
+ on-request — NOT an unrestricted shell. Every gobbi git procedure that assumes "shell + network
always available" (P1 auth, P4 push, P5 merge) is wrong-by-default on Codex. The git skill
currently has zero awareness of these modes.

## Source

- https://developers.openai.com/codex/agent-approvals-security
- https://developers.openai.com/codex/concepts/sandboxing
- https://developers.openai.com/codex/config-reference (sandbox_mode / approval_policy keys)

## Excerpt

> "Three modes: read-only ('Codex can inspect files, but it can't edit files or run commands
> without approval'), workspace-write (default; 'read files, edit within the workspace, and run
> routine local commands'), danger-full-access ('removes the filesystem and network boundaries').
> Default in a version-controlled folder = 'Auto (workspace write + on-request approvals)'."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-14 | 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d | DD-1 runtime model + C01/C02 checklist items |
