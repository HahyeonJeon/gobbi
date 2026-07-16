---
name: dual-production-race-false-degraded-mode
description: A same-spawn draft-then-integrate executor races the slower Codex proposer into a false degraded-mode call.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [codex, process]
keywords: [dual-production, degraded-mode, race-condition, codex-proposer, integration-barrier]
author: claude
priority: high
domain: process
---

# A same-spawn executor races the Codex proposer into a false degraded-mode call

## What happened

For dual-system Execution production, the manager spawned the Claude executor with BOTH phases in one
brief (Phase 1 = independent draft; Phase 2 = read + integrate the Codex proposal). The Codex proposer
(`codex exec`) is markedly slower than the Claude executor. The executor finished Phase 1 and reached
Phase 2 BEFORE the proposer had written its `draft-iter1.md`, saw no file, and correctly-per-the-rule
fell back to Claude-only with a durable degraded-mode label. But the proposal was NOT absent — it
landed ~minutes later (a race). Degraded mode was declared falsely.

## Why it happens

`codex exec` proposer runs (large reads + a full draft) routinely take longer than the Claude producer.
A single-spawn draft-then-integrate executor has no barrier that waits for the proposer, so a fast
producer laps the proposer and reads an as-yet-unwritten proposal path.

## Correct approach

The MANAGER gates the integration phase on proposer completion. Either (a) spawn the executor for
Phase-1 draft ONLY + the Codex proposer in parallel, wait for BOTH to complete (proposer bg-task exit +
draft file validated), THEN continue the executor for Phase-2 integration; or (b) if using one spawn,
instruct the executor to POLL/wait for the proposer's `draft-iter1.md` (with a bounded timeout) before
concluding degraded-mode — do not treat "not yet present" as "absent". A true degraded-mode call
requires the proposer process to have EXITED without a valid proposal, not merely "no file yet".

## How to detect

Dual production where the executor is told to draft-then-integrate in one run, and the Codex proposer is
still running when the executor reaches integration. Symptom: executor reports "Codex proposal MISSING →
degraded Claude-only" while `codex exec` is still in `pgrep` and the draft file appears shortly after.
