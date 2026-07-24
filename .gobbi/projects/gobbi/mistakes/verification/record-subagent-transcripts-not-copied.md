---
name: record-subagent-transcripts-not-copied
description: RECORD assistants copied only the manager transcript, never the subagent transcripts record/SKILL.md Step 2 mandates, because the {role}-{agentId} destination naming is under-specified.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [verification]
keywords: [record, transcripts, subagent-capture, record-conformance, naming-underspecified]
author: claude
priority: medium
domain: process
supersedes: null
superseded_by: null
related: []
---

# RECORD copied only the manager transcript, never the ~20 mandated subagent transcripts

## What happened

Across this session, the RECORD assistants copied only the manager's own transcript into the session
record, never the roughly twenty subagent transcripts that `record/SKILL.md` Step 2 mandates be captured.
The `{role}-{agentId}` destination naming convention for a copied subagent transcript is under-specified
in the skill, which left each RECORD assistant without a concrete target path to copy to.

## Why it happens

A RECORD assistant naturally has direct, immediate access to its own (manager-facing) transcript, but
reaching a spawned subagent's transcript requires an explicit copy step with a resolved destination name.
When the naming rule for that destination is not pinned precisely enough to act on without guessing, the
step is easy to silently skip rather than block on an ambiguous target — especially across many
subagent dispatches in one session, where the omission compounds.

## Correct approach

Pin the exact `{role}-{agentId}` naming rule for a copied subagent transcript in `record/SKILL.md` Step 2,
and have every RECORD brief explicitly instruct the assistant to copy each subagent transcript spawned
during that loop to its resolved destination — not just the manager's own. If manager-only capture is
ever intentionally sufficient for a given workflow shape, update the skill to say so explicitly rather
than leaving the gap to be silently filled by omission.

## How to detect

At Wrap-up, or at any RECORD step, count the subagents dispatched during the loop against the transcripts
actually present under the session's transcript directory — a persistent, session-wide gap between
"subagents spawned" and "subagent transcripts captured" is this trap firing. A RECORD brief that does not
name a concrete subagent-transcript destination path is the earlier warning sign.

## Related

(none — first record of this trap)
