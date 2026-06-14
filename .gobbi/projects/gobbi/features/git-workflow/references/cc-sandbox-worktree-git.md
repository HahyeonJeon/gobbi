---
name: cc-sandbox-worktree-git
description: Claude Code sandbox allows git commit inside a linked worktree but OS-denies .git/hooks and .git/config writes
type: references
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, claude-code, sandbox, worktree, runtime]
title: Claude Code sandbox allows commit inside a linked worktree but denies .git/hooks and .git/config writes
source: https://code.claude.com/docs/en/sandboxing#filesystem-isolation
accessed: 2026-06-14
ref_type: docs
---

# Claude Code sandbox allows commit inside a linked worktree but denies .git/hooks and .git/config writes

## Insight

When the Claude Code sandboxed Bash tool runs inside a linked git worktree, the OS-level sandbox
grants write access to the main repo's shared `.git` directory so `git commit` can update refs and
the index — but writes to `hooks/` and `config` inside that `.git` stay denied.

## Related

- EXT-CC-1 — the internal insight label in draft-iter2.md
- `skills/git/SKILL.md:30` — "never modify `.git/config`" rule (now confirmed as OS-enforced)
- DD-5 — reframes the rule as OS-enforced boundary, not only a gobbi convention

## Why it applies

Gobbi's entire model is "every session in its own linked worktree, subagents commit inside it."
This confirms commit-in-worktree works under the CC sandbox without extra config. It also means a
subagent cannot write git hooks or `.git/config` from inside the sandbox — the skill's existing
prohibition is now confirmed as an OS-enforced reality, not only a gobbi rule.

## Source

- https://code.claude.com/docs/en/sandboxing (§ How sandboxing works → Filesystem isolation)

## Excerpt

> "Git worktrees: when the working directory is a linked git worktree, the sandbox also allows
> writes to the main repository's shared `.git` directory so commands such as `git commit` can
> update refs and the index. Writes to `hooks/` and `config` inside that directory remain denied."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-14 | 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d | DD-5 (commit-boundary grounding) + C10 checklist item |
