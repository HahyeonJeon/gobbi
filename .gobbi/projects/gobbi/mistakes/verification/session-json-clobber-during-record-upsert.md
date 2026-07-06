---
name: session-json-clobber-during-record-upsert
description: RECORD assistant clobbered session.json during an invalid jq update before reconstructing it
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-06
session: 019f283d-e961-7442-9c22-319f26798141
tags: [process, verification]
keywords: [session-json, jq, record, upsert, clobber]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
related: [edit-write-tool-success-without-disk-persistence, verify-state-from-authoritative-source-not-proxy, manager-locked-decision-without-audit-trail-sync]
---

# Protect session.json during RECORD upserts

## What happened

During Execution Task 04 RECORD, an assistant ran an invalid intermediate `jq` command that truncated `session.json` to zero bytes before reconstructing and rewriting a valid JSON file. The final file parsed and contained the known Task 04 telemetry, but byte-level preservation of every unknown pre-existing field could not be proven after the clobber.

## Why it happens

Shell redirection opened the authoritative state file for writing before the JSON transform had produced and validated a replacement. When the transform failed, the target file was already truncated.

## Correct approach

Never write transformed JSON directly back to `session.json`. Write to a temporary file in the same directory, run `jq empty` on that temporary file, verify required invariants, then atomically move it over `session.json` under the session lock. If any step fails, leave the original `session.json` untouched and report the failure.

## How to detect

An agent is about to update `session.json` with a command shaped like `jq ... > session.json`, or any direct write path that does not first create and validate a separate temporary file. A later report that says `session.json` was reconstructed is evidence that the safe-update invariant already failed.

## Related

- [[edit-write-tool-success-without-disk-persistence]] — verify file state from disk after writes.
- [[verify-state-from-authoritative-source-not-proxy]] — validate authoritative state, not reported state.
- [[manager-locked-decision-without-audit-trail-sync]] — workflow recovery state must be reflected durably and safely.
