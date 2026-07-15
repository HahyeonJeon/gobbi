---
name: require-local-develop-ref
description: "Fail before merge-base resolution when the required local develop ref is absent."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, git, verification]
keywords: [develop-ref, merge-base, fail-closed]
author: codex
---

# Require the local develop ref explicitly

## Context

Iter2 used `git merge-base HEAD develop` without first proving the local ref exists.

## Decision

Run `git show-ref --verify --quiet refs/heads/develop` before every merge-base call and fail closed if it is absent.

## Rationale

An explicit prerequisite prevents the plan from silently guessing a different authority.

## Alternatives considered

Automatically falling back to `origin/develop` was rejected because the locked Verification matrix names `develop` and fallback selection would add policy.

## Consequences

The implicit-assumption root is addressed. A separate Low setup risk records that a fresh worktree may need the local ref established.

## Related

- [[surface-local-develop-prerequisite]] - the remaining setup risk.
- [[deterministic-codex-model-policy]] - the fail-closed gate.
