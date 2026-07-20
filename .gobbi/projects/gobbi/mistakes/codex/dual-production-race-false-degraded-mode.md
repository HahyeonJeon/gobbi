---
name: dual-production-race-false-degraded-mode
description: A fast contributor treated a still-running peer as absent; peer failure must be established before any waiver decision.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [codex, process]
keywords: [dual-system-work, race-condition, peer-cli, freeze-barrier, named-waiver]
author: claude
priority: high
domain: process
---

# A still-running peer is not a missing-system failure

## What happened

In a historical Execution WORK stage, one contributor finished its draft and immediately looked for the slower peer result. It treated the not-yet-written file as a missing-system condition even though the peer process was still running. The valid peer result arrived later.

## Why it happens

The workflow conflated “not finished yet” with “finished unsuccessfully.” It had no manager-owned barrier that waited for both independent operations to report and validate before exposing either result to cross-review.

## Correct approach

The manager dispatches the two independent draft operations, waits for both explicit results, validates each structured response, and freezes both rendered drafts. Cross-review cannot begin before that barrier.

Only a completed timeout, availability failure, empty result, malformed response, or schema failure establishes a missing-system failure. Then pause, show the exact error, and ask whether to retry or grant an explicit waiver for the named system, step, and iteration. There is no automatic degraded fallback.

## How to detect

One contributor is asked to draft and synthesize in a single uninterrupted assignment while the peer operation can still be running. Another signal is a waiver or missing-system label based only on an absent target file, with no completed peer result and validation failure.
