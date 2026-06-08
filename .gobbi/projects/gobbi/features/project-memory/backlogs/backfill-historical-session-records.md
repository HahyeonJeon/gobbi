---
name: backfill-historical-session-records
description: Optionally migrate the existing untracked on-disk session dirs into the new notes/{date}-{slug}-{ssid}/ record shape.
type: backlogs
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [migration, session-records, notes, backfill]
priority: low
disposition: open
project-scope: false
---

# Backfill historical session dirs into notes/ records

## What is deferred
After this redesign ships, ~20 session directories already exist on disk (some tracked, some untracked). The redesign untracks them (D8) and leaves them on disk, but does NOT migrate them into the new `notes/{date}-{slug}-{ssid}/` finalized-record shape. Backfilling them — generating a distilled per-session record for each historical session — is deferred.

## Why deferred
Out of scope for the in-session redesign (Scope Contract § Out-of-Scope). The redesign delivers the forward-going lifecycle; retroactive migration is independent, lower-priority, and large (per-session distillation). Solo-user project: there is no external consumer waiting on historical records.

## How to resume
Once the `notes/` record shape + generator are shipped, write a one-off script (or a guided pass) that, per historical session dir, distills the per-loop artifacts into the loop-symmetric record. The `notes/` record shape is the target; the historical `sessions/` tree is the source.

## Related
- design decision D2 (the notes/ record shape this would backfill into)
- design decision D8 (untrack + leave on disk — the state these dirs are left in)
