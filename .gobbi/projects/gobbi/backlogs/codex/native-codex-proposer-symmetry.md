---
name: native-codex-proposer-symmetry
description: Make the Codex-proposer model work when gobbi runs natively inside Codex (Claude as the co-worker proposer), mirroring the Claude-primary bridge design.
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-06-25
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [process, codex]
keywords: [native-codex, proposer-symmetry, dual-system-production, runtime-parity]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Native-Codex proposer symmetry

## Context
The dual-system PRODUCTION (Codex-proposer) feature is being designed for the **Claude-primary bridge**: gobbi runs inside Claude Code and spawns the Codex proposer via `codex exec`, while the Claude producer (leader/executor/assistant) is the default selective integrator and the manager adjudicates large gaps. The symmetric case — gobbi running natively inside Codex, with Claude as the co-worker proposer — is the mirror image and was explicitly held out of scope for the current workflow.

## Why deferred
The current task's scope is locked to the Claude-primary bridge (one of the four hard constraints). Native-Codex runtime symmetry is a distinct runtime-parity problem (Codex has no Agent-Teams continuation surface, different subagent spawn primitive, different user-decision primitive) and would roughly double the design + doc surface. Folding it in would breach the locked scope contract.

## When to pick up
- After the Claude-primary Codex-proposer feature ships and stabilizes (so there is a proven reference model to mirror).
- Requires a decision on how a native-Codex session spawns a Claude proposer (no `codex exec` analogue from Codex → Claude is currently defined in gobbi).

## Suggested approach
Mirror `orchestration/workflow/production.md` and the `codex/SKILL.md` § Dual-System Production for the native-Codex column of the Runtime Matrix: define the Claude-proposer spawn primitive, the producer-integration duty for the native-Codex producer, and the same degraded-mode (BLOCKED-on-empty → Codex-only labeled fallback). Reuse the producer-default selective-integration + manager large-gap-adjudication model unchanged.

## Originating session
`.gobbi/projects/gobbi/sessions/2026-06-25-6cf13813-a002-4e55-96b9-a5d65f619ef8/`

## Related

- [[selection-bottleneck-selector-quality]] — the selection model this symmetry would mirror
