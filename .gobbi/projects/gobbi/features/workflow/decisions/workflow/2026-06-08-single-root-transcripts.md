---
name: single-root-transcripts
description: All agent transcripts accumulate in one session-root transcripts/ dir as {role}-{agentId}.jsonl; no per-loop transcript dirs.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: []
keywords: [session-memory, transcripts, agents]
author: claude
supersedes: null
superseded_by: null
---

# Single session-root transcripts/ for all agent transcripts (R1)

## Context

The iter1 design had two transcript surfaces: a renamed root `debug-transcripts/` (ephemeral full raw copies) and per-loop `{N}-{loop}/transcripts/` (durable per-iter windows). After iter1 evaluation, Codex flagged that per-loop transcript ownership was ambiguous for continued agents that span loops. The user resolved this in the final-gate round 2 (T-a decision): use a single root `transcripts/` only, no per-loop transcript dirs.

## Decision

All agent transcripts live in one session-root `transcripts/` dir. Files are named `{role}-{agentId}.jsonl` (e.g., `manager-1abeb43f.jsonl`, `leader-acfaed3f.jsonl`). The manager's transcript uses `manager-{sessionId}.jsonl` (id = session id). Files accumulate by distinct `{agentId}` across all loops — one immutable file per agent run, never overwritten.

The assistant copies transcripts to this dir at MEMORIZATION. The dir is gitignored, session-scoped, never promoted to project memory, and removed at worktree cleanup.

Loop interiors have NO `transcripts/` dir (D8: 4-slot loop interior only).

## Rationale

Per-loop transcript dirs create an ownership problem for continued agents that participate in multiple loops — the transcript would need to be split or duplicated per loop. A single root dir with per-agent filenames has no such ambiguity: each agent run is one file, regardless of which loops it touched.

The `{role}-{agentId}.jsonl` naming is more useful than the prior `transcript-iter{n}.jsonl` naming: it tells the reader which agent produced the transcript without opening the file, and it accumulates correctly (different agent IDs → different files; same agent ID across re-runs → overwrite, which is the idempotent behavior).

Removing per-loop `transcripts/` dirs simplifies the loop interior (4 slots not 5) and removes per-loop rules about what to put in them.

## Alternatives considered

- Per-loop `transcripts/` + root `debug-transcripts/` (iter1 design): rejected after the continued-agent scoping ambiguity surfaced. The dual-surface model added complexity without benefit after R1 collapses it.
- Per-iter `transcript-iter{n}.jsonl` naming: rejected (T-b decision). The `{role}-{agentId}.jsonl` form is more informative and accumulation-correct.

## Consequences

- `memorization/SKILL.md` Step 2 is rewritten: "copy each participating agent's transcript to the SESSION-ROOT `transcripts/{role}-{agentId}.jsonl`" (replacing "preserve raw transcript turns at `rawdata/transcript-iter{n}.jsonl`").
- The ephemeral-transcript section in `memorization/SKILL.md` is reconciled to the single root `transcripts/` surface.
- `orchestration/SKILL.md` Step 1 (Configuration) gains a row: "manager creates session-root `transcripts/` alongside the root JSON files."
- The scaffold script never creates a `transcripts/` dir (root only — manager creates it).
- Wrap-up transcript-exclusion rule: Wrap-up enumerates `{N}-{loop}/staging/` ONLY as its promotion input; `transcripts/` is never promoted.

## Related

- design/workflow/session-memory-tree.md
- decisions/workflow/2026-06-08-flat-granular-loop-interior.md
