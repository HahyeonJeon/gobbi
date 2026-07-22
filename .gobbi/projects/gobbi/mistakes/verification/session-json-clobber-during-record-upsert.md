---
name: session-json-clobber-during-record-upsert
description: Direct shell redirection truncated session.json before validation; lifecycle changes require patch-file atomic replacement.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-06
session: 019f283d-e961-7442-9c22-319f26798141
tags: [process, verification]
keywords: [session-json-v5, patch-file, checkpoint, atomic-replacement, byte-preservation]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
related: [edit-write-tool-success-without-disk-persistence, verify-state-from-authoritative-source-not-proxy, manager-locked-decision-without-audit-trail-sync]
---

# Update session.json only through validated patch-file checkpoints

## What happened

During a historical Execution RECORD stage, an invalid `jq` command redirected directly into `session.json` and truncated it before the transform succeeded. A later reconstruction parsed, but preservation of the original manifest could not be proven.

## Why it happens

Shell redirection mutated the authoritative file before parsing, schema validation, and lifecycle invariants passed. The operation also treated arbitrary JSON transformation as an allowed manifest update instead of separating lifecycle fields from router state.

## Correct approach

Use `session-record.sh checkpoint --root ABS --patch FILE`. The patch file may change only authorized version-5 lifecycle fields. The command creates a same-directory candidate, applies unambiguous merge-patch semantics, validates the complete candidate against the schema and invariants, and atomically replaces the manifest only after every check passes.

Any parse, schema, path, immutable-field, runtime-order, or replacement failure must leave the previous bytes unchanged. There is no session lock file. Routing changes belong only to `session-record.sh transition --patch FILE` and `state.json` version 3; a checkpoint cannot mutate the router, and a transition cannot mutate settings.

## How to detect

An agent is about to redirect, overwrite, or edit `session.json` directly; passes JSON inline through shell interpolation; or mixes a router change into a manifest checkpoint. Another signal is a failure test that does not compare the manifest bytes before and after the rejected operation.

## Related

- [[edit-write-tool-success-without-disk-persistence]] — verify file state from disk after writes.
- [[verify-state-from-authoritative-source-not-proxy]] — validate authoritative state, not reported state.
- [[manager-locked-decision-without-audit-trail-sync]] — workflow recovery state must be reflected durably and safely.
