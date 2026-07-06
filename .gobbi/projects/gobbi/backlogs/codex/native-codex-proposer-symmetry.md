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

## Follow-up notes

### 2026-07-06 — add a mechanical render-time producer-label gate (RI-1)
When the native-Codex dual-production path is built, add a MECHANICAL render-time gate that
FAILS if a native-Codex-rendered producer prompt still contains "You are the Claude
producer" or `production_mode: claude-only`. Rationale: the GEN-D4-003 fix shipped
2026-07-06 scopes the dual-system-production block to the Claude producer with
instruction-based PROSE only — there is no runtime check that a producer prompt actually
rendered for the correct system. Claude eval finding RI-1 (Low / confidence 50) flagged
this as acceptable for the current Claude-primary bridge but load-bearing once the
symmetric native-Codex producer exists. Fold the gate into this feature's render step, not
into the prose fix.

## Originating session
`.gobbi/projects/gobbi/sessions/2026-06-25-6cf13813-a002-4e55-96b9-a5d65f619ef8/`

## Related

- [[selection-bottleneck-selector-quality]] — the selection model this symmetry would mirror
