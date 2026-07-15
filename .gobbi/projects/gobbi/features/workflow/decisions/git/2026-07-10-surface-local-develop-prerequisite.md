---
name: surface-local-develop-prerequisite
description: "Treat a missing local develop ref as an explicit executor setup failure."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, git, process]
keywords: [fresh-worktree, local-ref, setup]
author: codex
---

# Surface the local develop prerequisite

## Context

A fresh worktree may contain `origin/develop` without a local `develop` ref.

## Decision

Let the gate stop loudly. Establish the required local ref through an explicit, authorized setup step rather than guessing a fallback inside verification.

## Rationale

The residual is an operator setup issue, not a false pass. The fail-closed behavior preserves authority clarity.

## Alternatives considered

Silent fallback was rejected. Removing the check would restore the original hidden assumption.

## Consequences

Claude `F-RISK-2-ITER3` remains open at Low/25. Execution should diagnose this precondition before editing.

## Related

- [[require-local-develop-ref]] - the addressed implicit-assumption root.
