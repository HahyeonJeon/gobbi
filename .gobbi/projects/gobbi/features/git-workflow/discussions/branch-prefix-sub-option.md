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

## Question asked

The initial Ideation draft used `session/{date}-{ssid-short}` as the worktree branch name, but `session/` is not in the registered branch type registry. The options for correcting it were: (a) `chore/session-{date}-{ssid-short}`, (b) `feat/session-{date}-{ssid-short}`, (c) leave as `session/` but add `session` to the registry.

## User answer

User selected **(a) `chore/session-{date}-{ssid-short}`** — use the existing `chore` type from the registry.

## Rationale confirmed by user

- `chore` is in the registered branch type registry
- The second component `session-{date}-{ssid-short}` satisfies the description-slug regex
- No need to extend the registry or use `feat` (which implies a product feature)

## Impact on design

Design Decision D-1 and all branch-naming statements updated to use `chore/session-{date}-{ssid-short}`. The registry-validation failure mode that would have blocked CI/hooks is eliminated.
