---
name: session-memory-redesign-decisions
description: Decision arc for the Ideation loop — structure option, transcript subsystem, and REVISE remediation choices that locked the final design.
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: []
keywords: [session-memory, directory-structure, user-decisions]
author: claude
outcome: Flat 4-slot loop interior + number-prefixed dirs + single root transcripts/ + manager-invoked scaffold script + dedicated spec doc + interview bootstrap exception.
---

# Session-memory redesign — ideation decision arc

## Context

The user triggered this session with a goal: "deterministic session memory operation with intuitive and dev-vibe file and directory structure that users can debug session with the memories." The leader researched three structure options (A/B/C) and the transcript subsystem in detail, then ran AskUserQuestion gates across two rounds plus a REVISE remediation round.

## Question

The Ideation loop resolved six key decisions across three gate rounds. Grouped by theme:

**Round 1 — structure option and session completeness:**
- Which per-loop interior model? (flat granular vs grouped parent vs unchanged quartet)
- Full ship this session or design-only?

**Round 2 — transcript subsystem:**
- Transcript surface model? (per-loop dirs vs single root vs dual surfaces)
- Transcript file naming? (per-iter snapshot vs per-agent accumulating)
- When are transcripts saved? (at MEMORIZATION vs at hooks)
- Lifecycle scope? (document accurately + fix commit-cadence contradiction)

**Round 3 — REVISE remediation:**
- Continued-agent transcript scoping? (codex evaluation finding)
- interview/ scope? (workflow loop or bootstrap exception?)

## Options considered

**Structure interior:** flat + granular explicitly-named dirs per role (user's words: "more specified directories like outputs/ transcripts/ evaluation/ staging/"); vs grouped parents (docs/ wrapping staging/artifacts); vs unchanged rawdata/staging/evaluation/artifacts quartet.

**Transcript surface:** (a) per-loop `{N}-{loop}/transcripts/` + root `debug-transcripts/`; (b) single session-root `transcripts/` only; (c) drop transcripts/ from loop interior, use root only.

**Transcript naming:** per-iter snapshot `transcript-iter{n}.jsonl`; vs per-agent accumulating `{role}-{agentId}.jsonl`.

## User decision

**Structure interior:** flat, granular, explicitly-named per-role dirs. Number-prefixed loop dirs (`1-ideation/` … `5-wrap-up/`). One PR, full ship.

**Transcript surface (R1 — REVISE remediation):** single session-root `transcripts/` only. No per-loop transcript dirs. Resolves the continued-agent scoping ambiguity (Codex COD-USAGE-1: a continued agent spanning multiple loops has one transcript across all loops, not a per-loop split).

**Transcript naming (T-b):** `{role}-{agentId}.jsonl` — manager = `manager-{sessionId}.jsonl`. Transcripts accumulate per agent run (one immutable file per `{agentId}`); never overwritten.

**When saved (T-c):** at MEMORIZATION (assistant copies; hooks stay lean for the latency gate).

**interview/ (R2):** bootstrap exception — NOT a workflow loop, NOT swept to the flat-4-slot shape.

**Value-feature:** `workflow` (confirmed F2 gate — session-memory tree is a workflow-runtime concern).

## Implication

The final design has a 4-slot loop interior (`working/ evaluation/ staging/ outputs/`) with a single session-root `transcripts/` that accumulates all agent transcripts across the whole session. The init mechanism is a manager-invoked idempotent `scaffold-session-dir.sh`. One dedicated spec doc (`orchestration/templates/session-tree.md`) closes the ~16-prose-definition root cause. The doc sweep covers all loop/orchestration/memorization/agents docs in one PR.

Three items carried forward to Planning: (a) D7 git-verb (verify exact git behavior before finalizing lifecycle wording); (b) sync-check scope split (script-created step-dir baseline vs manager-created root invariants); (c) Wrap-up exclusion wording must preserve `interview/staging/` as a valid promotion source.

## Related

- design/workflow/session-memory-tree.md
- decisions/workflow/2026-06-08-flat-granular-loop-interior.md
- decisions/workflow/2026-06-08-single-root-transcripts.md
- decisions/workflow/2026-06-08-number-prefixed-loop-dirs.md
- decisions/workflow/2026-06-08-scaffold-script-mechanism.md
- decisions/workflow/2026-06-08-session-tree-spec-doc.md
- decisions/workflow/2026-06-08-interview-bootstrap-exception.md
