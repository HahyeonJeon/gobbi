---
name: write-early-for-long-generators
description: A single end-written artifact loses everything when a long generator run is interrupted, on either runtime — skeleton-first + fill-incrementally is the fix.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, codex]
keywords: [write-early, incremental-fill, end-written-artifact, timeout, usage-limit, dual-system]
author: claude
priority: high
domain: process
---

# Every long generator brief must mandate create-skeleton-first + fill-incrementally

## What happened

During this session's iter-1 Ideation WORK, two independent long-running generator turns each lost their entire output when interrupted, on both runtimes:

1. The Codex researcher/proposer's first `codex exec` run (xhigh, workspace-write, background, launched 11:19) was killed at the 1200s cap. Its narration showed real progress (an exhaustive recursive mistakes read + full repo wiring audit), but because the deliverable was a single end-written file, the kill left the target file absent — zero salvage, despite ~20 minutes of real work.
2. Separately, the Claude leader's own WORK turn 1 — which had NO write-early instruction — read for roughly 25 minutes, then hit the account usage limit at 12:00 (reset 13:50 UTC). It died with zero bytes on disk, the identical failure shape as the Codex timeout, on the other runtime.

The retried Codex run and the Claude WORK proposer, both given an explicit write-early instruction, each delivered complete files.

## Why it happens

Any long-running generator whose deliverable is one artifact written only at the end loses everything on interruption — a timeout, a usage limit, or a crash. This is not a Codex-specific or Claude-specific failure mode: it is a property of the "compute for a long time, then write once" shape, and it hits whichever runtime happens to run long enough to collide with its own interruption boundary (a hard timeout cap, a usage-limit reset window, or an unplanned crash). Treating it as a Codex-only concern (because it was first observed there) would leave the identical trap live on the Claude side, which this session's own Claude-leader incident then confirmed.

## Correct approach

Every long-running generator brief — Claude leader/executor turns AND Codex proposer/researcher/evaluator runs — must instruct create-skeleton-first + fill-incrementally: write the target file's skeleton (headers, section stubs) immediately, then fill each section as it completes, rather than holding the entire deliverable in-memory until a single final write. This session's iter-2 and iter-3 runs, dispatched with this instruction, all delivered complete files even under time pressure.

## How to detect

Any delegation brief for a generator turn expected to run more than a few minutes (a full-repo audit, an exhaustive recursive read, a multi-section artifact) that does not explicitly instruct incremental/skeleton-first writing. The trigger signal after the fact: a long-running turn returns with zero bytes on disk, or a background process is killed/interrupted and the target artifact is entirely absent despite visible progress in the transcript or stdout narration.

## Related

- [[codex-exec-timeout-exceeds-bash-cap]] — the sibling runtime-boundary trap this session's Codex-side incident is an instance of
