---
name: peer-cli-host-timeout-must-pause
description: A host timeout ends the peer operation; it cannot be converted into background work or partial evidence.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [codex, process]
keywords: [peer-cli, host-timeout, bounded-process, exact-failure, no-substitute]
author: claude
priority: high
domain: codex
supersedes: null
superseded_by: null
---

# A peer CLI host timeout must pause the workflow

## What happened
During a historical dual-system operation, the configured subprocess timeout exceeded the host
harness's execution window. The host terminated the peer before a complete structured response
existed. Restarting it as an untracked background job avoided the visible timeout but lost exact
process status and invocation control.

## Why it happens
The wrapper treated its requested timeout as the only bound and tried to preserve progress after the
host had already broken the controlled invocation. A partial response or later background file cannot
establish that the assigned peer completed under the frozen contract.

## Correct approach
Choose a bounded timeout that the active host can observe to completion. Run the peer under an
explicit process or runtime session identity and capture its final status. If either the wrapper bound
or host bound expires, classify the operation as timeout, preserve the prior target bytes, and pause.
Show the exact bound and immediate diagnostic. The manager may offer a fresh retry or request an exact
user waiver for the named system, step, and iteration. Do not detach the same invocation, mine partial
output, or substitute locally authored content.

## How to detect
The configured peer timeout exceeds a known host-call window, the host returns before the process's
final status is available, or an operator proposes detaching the invocation to preserve it. Any of
these means the wrapper cannot prove bounded completion and must pause.

## Related

- [[peer-cli-completion-requires-validated-structured-output]] — completion also requires exact status and a validated invocation-bound response
