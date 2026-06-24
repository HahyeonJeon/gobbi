---
name: dual-runtime-git-environment-model
description: DD-1 — Add an explicit dual-runtime git environment model to the git skill covering CC sandbox and Codex sandbox_mode/approval_policy/network, aligned with codex/SKILL.md
type: design
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, design]
keywords: [runtime, sandbox, dual-runtime]
author: claude
supersedes: null
superseded_by: null
related: []
---

# DD-1 — Add a dual-runtime git environment model to the git skill

## Problem

The git skill has no account of the two runtime constraint models. It reads as a single-runtime
(CC-like) document. Codex appears only as a branch-name prefix. The result: every git procedure
that assumes "shell + network always available" is wrong-by-default on Codex, and the CC-specific
behaviors (no pre-allowed domains, `gh` TLS, ask-rules) are undocumented.

## Scope

In-scope: add a runtime git environment model to `skills/git/SKILL.md` covering:
- Claude Code: OS sandbox (no pre-allowed domains, `gh` TLS-under-Seatbelt,
  `Bash(git push *)` ask-rules, `dangerouslyDisableSandbox` escape hatch + Strict mode).
- Codex: `sandbox_mode` ∈ read-only/workspace-write/danger-full-access;
  `approval_policy` ∈ untrusted/on-request/never; network OFF by default in workspace-write.

Out-of-scope: duplicating or redefining Codex sandbox vocabulary already owned by
`skills/codex/SKILL.md`. The git skill cross-references that skill as the canonical source.

## Approach

The git skill's new Codex content must CROSS-REFERENCE `skills/codex/SKILL.md` as the canonical
Codex sandbox source (INT-7, Principle 3 — design on prior art). That skill already defines
`sandbox_mode`/`workspace-write`/`danger-full-access` and has a Runtime Matrix + Models-and-Sandbox
section. Git skill points at those; does not re-derive them.

Open sub-question for Planning: section vs inline tags = OQ-1.

## Scenarios

Resolves C01–C08 gap cluster; anchors S16–S26 scenarios.

## Validation

A reader can state what blocks `git push` on a default Codex session and on a sandboxed CC session.
Gap items C01–C08 cite the new text. The git skill cross-references `codex/SKILL.md` rather than
restating its sandbox-mode definitions.

## Trade-offs

Cross-referencing vs. duplicating: cross-referencing keeps the codex/SKILL.md as the source of
truth and avoids drift; the trade-off is that a git skill reader must follow a link for full Codex
sandbox detail. This is acceptable — the git skill's job is git procedure, not sandbox reference.

## Open issues

OQ-1 (doc structure): dedicated "Runtime git environment" section vs inline runtime tags. Planning
resolves.
