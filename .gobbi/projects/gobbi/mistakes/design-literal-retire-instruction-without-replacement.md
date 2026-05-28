---
name: design-literal-retire-instruction-without-replacement
description: A design instruction saying "retire X" was executed literally, removing the live state.json; the instruction was a misread of a prior SQLite-era retirement that referred to a different file.
type: mistakes
scope: project
feature: project-memory
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [process, design, state-machine, state-json]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Design-literal "retire X" instruction executed without verifying X had a replacement

## What happened

During W0-rest, the locked design §7 #7 + §3.4 + §8 instructed "retire state.json references." The executor and the Claude evaluator both refused and surfaced evidence; the Codex evaluator initially held the design-literal "retire" view. Manager surfaced the divergence as a USER CHALLENGE. **User ratified: KEEP state.json as the live workflow state-machine.** Design-of-record amended at §3.4, §7#7, and §8 with dated CORRECTION notes (originals struck-through, preserved).

## Why it happens

`state.json` is the live per-session workflow state-machine: initialized at orchestration Step 1 row 5.5 from `templates/state.template.json` (ships on disk), updated by the manager at every state transition, read for `/clear`/`/compact` recovery, and projected into the Workflow Status Display. `session.json` is a separate telemetry file and is NOT a replacement. The design §3.4 "state.json retired per MEMORY.md" conflated this live file with the OLD SQLite-era `state.json` that PR-FIN-2a-iii actually retired. The design instruction referenced a prior retirement that applied to a different entity under the same name.

## How to detect

- A design instruction says "retire/remove X" where X is a known live mechanism with active callers in the codebase.
- The retirement instruction names no destination for the retired entity's responsibilities ("retire" with no "replaced by").
- The cited witness (e.g., a prior PR) actually retired a DIFFERENT X under the same name or in a previous era.

**Red flag check:** Before executing any retire/remove instruction, answer: (1) Does X have active call sites? (grep). (2) Does the cited witness actually refer to the same X in this context? (cross-check commit message + code change). If either is ambiguous, surface to the user before executing.

## Correct approach

- Verify a retirement instruction has a concrete replacement specified and the cited witness actually refers to the same file/mechanism.
- When two evaluators diverge on a retirement (one literal, one defensive), treat the divergence as a USER CHALLENGE signal — surface before executing.
- Design-of-record carries CORRECTION annotations when a design decision is amended post-session; use struck-through originals + CORRECTION note pattern.

## Related

- [[manager-skipped-dual-system-eval]] — the dual-system divergence (Codex vs Claude) on this exact issue forced the right user decision; self-verification would have missed it.
- `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/execution/w0-rest/staging/decisions/state-json-retained-design-amended.md` — originating staged candidate.
