---
name: wal-vs-checkpoint-lifecycle
description: WAL (transient append-only log) vs checkpoint (durable snapshot) — validates worktree-local record + promote-to-memory
type: references
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [naming, memory, lifecycle, event-sourcing]
title: Write-ahead log vs checkpoint/snapshot lifecycle
source: https://arxiv.org/pdf/2507.13062
accessed: 2026-06-13
ref_type: paper
---

# Write-ahead log vs checkpoint/snapshot lifecycle

## Insight
A write-ahead log records every change as it happens (cheap, append-only, replayed-then-discarded); a checkpoint/snapshot is a periodic complete state written to stable storage as the durable recovery point. Two artifacts, two lifecycles — the log is transient, the checkpoint is durable.

## Related
- design decision D8 (session record worktree-local); D-c (promotion to durable memory)

## Why it applies
gobbi's session record is the append-only per-loop WAL (gitignored, dies with the worktree); memory is the durable checkpoint (committed, survives the session). The "log transient, checkpoint durable" lifecycle split validates keeping the session record worktree-local (D8) and promoting only to memory at wrap-up.

## Source
- https://arxiv.org/pdf/2507.13062 (Design and Reliability of a User-Space Write-Ahead Log)
- Corroborated: https://www.kurrent.io/blog/snapshots-in-event-sourcing/

## Excerpt
"A checkpoint is a record in the log where the application state itself is completely written to stable storage and is used by many recovery algorithms as their starting point."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-13 | 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4 | Anchoring D8 (record stays worktree-local) + promotion-to-memory lifecycle |
