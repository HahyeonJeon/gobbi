---
name: codex-commit-ok-push-gh-escalate
description: Codex git commit runs in-boundary (workspace-write); git push and gh escalate to approval or cannot proceed under never
type: references
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, codex]
keywords: [sandbox, commit, push, gh-cli, approval, runtime]
author: claude
title: Codex — git commit runs under workspace-write (writes inside workspace .git); git push and gh escalate to an approval prompt because they need network
source: https://developers.openai.com/codex/agent-approvals-security
accessed: 2026-06-14
ref_type: docs
---

# Codex — git commit runs under workspace-write (writes inside workspace .git); git push and gh escalate to an approval prompt because they need network

## Insight

Under Codex workspace-write: `git commit` runs without escalation because it writes inside the
workspace boundary. Commands that need network (`git push`, `gh pr create`, `gh pr merge`,
`gh run view`) when `network_access = false` ESCALATE to an approval prompt; if approved they run
but still respect sandbox constraints. Under `approval_policy = "never"` no prompt is offered, so
a network-needing command simply cannot proceed autonomously.

## Related

- EXT-CODEX-3 — the internal insight label in draft-iter2.md
- INT-1 — manager/subagent split maps precisely onto this Codex boundary
- DD-5 — ties the split to the sandbox boundary explicitly

## Why it applies

This maps gobbi's manager/subagent git split onto Codex precisely: the subagent's commit works on
default Codex; the manager's push/PR steps hit approval escalation or fail under `never`. The git
skill's "commit, never push" boundary is therefore not only a gobbi role rule on Codex — it aligns
with the sandbox itself: commit is in-boundary, push is out-of-boundary.

## Source

- https://developers.openai.com/codex/concepts/sandboxing
- https://developers.openai.com/codex/agent-approvals-security

## Excerpt

> "When a task stays inside those boundaries, Codex can keep moving without stopping for
> confirmation. When it needs to go beyond them, Codex falls back to the approval flow." /
> "If Codex runs tools like `git`, package managers, or test runners, those commands inherit the
> same sandbox boundaries." / on-request "Requires approval for sandbox escalations, network
> requests, and side-effecting tool calls"; never "operates autonomously within sandbox constraints."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-14 | 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d | DD-5 (sandbox-boundary grounding of manager/subagent split) + C14 |
