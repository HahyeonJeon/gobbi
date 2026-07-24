---
name: parallel-record-assistants-clobber-shared-session-json-array
description: Two RECORD assistants writing the same session.json array concurrently lost-update each other despite atomic temp-file+mv — atomic replace prevents corruption, not lost updates.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-24
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, verification]
keywords: [session-json, lost-update, atomic-mv, parallel-record, single-writer, flock, read-modify-write]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Parallel RECORD assistants clobber a shared session.json array

## What happened

The manager parallelized two per-task RECORD assistants (record-t09 and record-t01) to save wall-clock;
both did a read-modify-write append to `session.json.workflow.execution.iterations[]`. Each read the
array (both saw `[02,03]` before the other's write landed), appended its own task, and atomically `mv`'d.
Last-writer-won: record-t01's write produced `[02,03,01]`, silently DROPPING record-t09's `[02,03,09]`
entry. Task 09 was fully done on disk (commit `ac3da9e3`, 9 eval files) but vanished from the iterations
ledger.

## Why it happens

Atomic temp-file + `jq empty` + `mv` guarantees the file is never CORRUPT (always valid JSON) but does
NOT prevent a LOST UPDATE — it is not a compare-and-swap. Two concurrent read-modify-write cycles on the
same file race regardless of atomic replace. Even record-t01's "re-read immediately before mv" did not
help: its re-read still predated t09's write. The `session-json-clobber-during-record-upsert` mistake
names the single-writer intent; parallelizing two record writers violates it structurally, not just by
timing.

## Correct approach

ONE writer per shared file. (a) The manager owns the authoritative execution task ledger in `state.json`
(only the manager writes it — no race). (b) RECORD assistants write ONLY per-task directories
(`4-execution/task-*/{outputs,staging}/`) and `transcripts/` (unique filenames) — never a shared
session.json array. If a shared-file append is unavoidable, SERIALIZE the writers (dispatch the second
only after the first's write is confirmed on disk), or use a real lock (`flock`) — not
atomic-mv-and-hope.

## How to detect

Any time more than one subagent is dispatched in parallel and each writes the SAME shared file (a
session.json array, a shared manifest, a shared index). The atomic-mv pattern is a false comfort — it
addresses corruption, not lost updates. The concrete tell after the fact: a task fully done on disk
(commit + eval files present) is missing from a shared ledger that a sibling writer also touched.

## Related

- [[session-json-clobber-during-record-upsert]] — the single-writer-intent trap this violates structurally
- [[gate-decisions-need-citable-session-record]] — a sibling session-record integrity trap
