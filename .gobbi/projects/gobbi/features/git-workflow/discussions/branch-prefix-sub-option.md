---
name: branch-prefix-sub-option
description: User selected chore/ as the worktree branch type prefix, using the existing registry entry rather than adding a new type.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, branch-naming, worktree-first, type-registry]
---

# Branch type prefix selection — chore/session-{date}-{ssid-short}

## Context

The initial worktree-first design draft used `session/{date}-{ssid-short}` as the worktree branch name. But `session/` is not in the registered branch-type registry (`feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style`), so a branch named that way would fail registry validation and block CI/hooks. The branch prefix had to be corrected to a registered type.

## Question

Which branch-type prefix should the worktree branch use, given `session/` is unregistered?

## Options considered

1. **`chore/session-{date}-{ssid-short}`** — reuse the existing `chore` type from the registry; the `session-{date}-{ssid-short}` component satisfies the description-slug regex `[a-z0-9]+(-[a-z0-9]+)*`.
2. **`feat/session-{date}-{ssid-short}`** — reuse the existing `feat` type, but `feat` implies a new product feature, not a session-infrastructure branch.
3. **Keep `session/` and add `session` to the branch-type registry** — extends the registry to legitimize the original draft name.

## User decision

User selected option 1, `chore/session-{date}-{ssid-short}` — use the existing `chore` type. `chore` is already registered, the description slug passes validation, and no registry extension is needed; `feat` was rejected because it implies a product feature.

## Implication

Design Decision D-1 and all branch-naming statements use `chore/session-{date}-{ssid-short}`. The registry-validation failure mode that would have blocked CI/hooks is eliminated.

## Related

- `design/worktree-create-before-session-stamp.md` — Design Decision D-1, which adopts this branch-naming scheme.
