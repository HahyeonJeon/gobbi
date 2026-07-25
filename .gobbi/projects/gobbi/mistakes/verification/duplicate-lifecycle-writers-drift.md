---
name: duplicate-lifecycle-writers-drift
description: Two lifecycle writers can validate different contracts and silently overwrite one another.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-08
session: 14fbc122-d84c-4a16-af52-3a6dc3b1894b
tags: [process, verification]
keywords: [session-json, state-json, sole-writer, atomic-patch, schema-validation]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Duplicate lifecycle writers drift

## What happened

A historical session record had two independent lifecycle writers. One process wrote an intermediate
field set while another later rebuilt the same record from a different source and silently dropped
fields it did not know. The final file looked valid enough to read, but it no longer represented the
state previously accepted by the workflow.

## Why it happens

The filesystem admitted multiple writers that each treated a partial view as authoritative. Without a
single schema and atomic replacement boundary, one writer could validate its own subset and overwrite
settings, routing, runtime identity, or outcome owned by another lifecycle operation.

## Correct approach

Use the Record-owned `session-record.sh` as the sole lifecycle file writer. `transition` accepts a state
patch and may change only the active router. `checkpoint` accepts a manifest patch and may change only
the lifecycle manifest. Each command parses the patch file, validates the complete candidate against
the current schema, writes a same-directory temporary file, and atomically replaces the target only
after validation succeeds. A parse, schema, ownership, or replacement failure leaves the prior bytes
unchanged.

No runtime projection or secondary process writes lifecycle fields back. Verify with fixtures that a
state patch cannot mutate settings, a manifest patch cannot mutate routing, and invalid candidates
preserve the original file byte-for-byte.

## How to detect

Any code path other than `session-record.sh` writes `session.json` or `state.json`, or one command can
change both owners' fields. Another signal is a failed patch that changes target bytes, or a partial
writer that validates only the fields it touches instead of the complete candidate.

## Related

- [`skills/record/SKILL.md`](../../skills/record/SKILL.md) — sole lifecycle file writer and atomic update owner
- [`skills/workflow/mistakes.md#skill-prose-template-drift`](../../skills/workflow/mistakes.md#skill-prose-template-drift) — the general owner/consumer drift pattern
