---
name: codex-approval-policies-and-readonly
description: Codex approval policies and read-only mode determine when git ops pause or are blocked; read-only forbids commit entirely
type: references
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, codex, approval-policy, read-only, runtime]
title: Codex approval policies (untrusted / on-request / never) and read-only mode determine when git ops pause or are blocked
source: https://developers.openai.com/codex/config-reference
accessed: 2026-06-14
ref_type: docs
---

# Codex approval policies (untrusted / on-request / never) and read-only mode determine when git ops pause or are blocked

## Insight

Codex `approval_policy` values change git behavior: `untrusted` auto-runs only known-safe read
operations and blocks state-mutating / external-execution commands; `on-request` prompts for
sandbox escalations, network requests, and side-effecting calls; `never` never asks — network-needing
commands cannot proceed. Separately, `read-only` sandbox mode forbids edits AND command execution
without approval — a `read-only` Codex session cannot run the worktree-commit model.

## Related

- EXT-CODEX-4 — the internal insight label in draft-iter2.md
- OQ-5 — read-only Codex session policy (Planning decision)
- S17/S18 scenarios — unhandled in current skill

## Why it applies

Gobbi's git skill assumes a single binary: "command is forbidden → ask user via the user-decision
primitive." On Codex the runtime layer has its own approval state the skill never reads. A gobbi
git procedure must check the effective Codex policy before assuming push/PR can even be attempted,
and a read-only Codex session cannot commit at all — which breaks the worktree-commit model the
skill mandates.

## Source

- https://developers.openai.com/codex/config-reference (approval_policy / sandbox_mode)
- https://developers.openai.com/codex/concepts/sandboxing (read-only definition)

## Excerpt

> approval_policy allowed values "untrusted | on-request | never" (and a granular table form);
> "on-failure is deprecated; use on-request for interactive runs or never for non-interactive runs."
> read-only: "Codex can inspect files, but it can't edit files or run commands without approval."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-14 | 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d | DD-1 (approval model) + C04/C05 + S17/S18 + OQ-5 deferred question |
