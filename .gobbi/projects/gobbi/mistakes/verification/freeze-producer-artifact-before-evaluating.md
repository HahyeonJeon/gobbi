---
name: freeze-producer-artifact-before-evaluating
description: Spawning evaluators on an artifact a producer teammate is still writing makes the eval target change mid-evaluation
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: e351aa58-de50-41b4-a147-a6ac33356c08
tags: [verification, evaluation]
keywords: [producer-freeze, eval-dispatch, moving-target, artifact-version, dual-system]
author: claude
priority: high
domain: verification
supersedes: null
superseded_by: null
related: []
---

# Freeze the producer's artifact before spawning evaluators on it

## What happened

The manager spawned the dual-system evaluators (`eval-claude`, `eval-codex`) on `coding-skill-design.md` while the producer teammate (`research-coding`) was still writing it. A queued or in-flight delta landed a new write (11 to 12 principles) around the same time the evaluators read the file, so the evaluation target changed mid-evaluation. Both Codex Risk and Consistency perspectives independently flagged the moving target (COD-RISK-1, COD-CONS-1) and the eval brief still named the stale "v2/11" version.

## User feedback

Evaluators surfaced the problem independently: the eval brief named a stale version, and two Codex perspectives flagged the moving target as a gap. The manager recognized the dispatch ordering was the root cause.

## Why it happens

The manager moved from WORK to EVALUATION without confirming the producer's terminal output and without freezing the artifact. A teammate reports `DONE` and goes idle, but it remains resumable — a previously-sent delta can still be processed and overwrite the file after the manager has already dispatched evaluators against it.

## Correct approach

Before spawning evaluators on a producer's artifact: (1) confirm the producer's terminal output is the one on disk — read it, check the version or count; (2) stop sending it deltas; (3) pin the exact version in the eval brief; only then dispatch. If the target changes after dispatch, re-pin and re-evaluate rather than reconciling across versions.

## How to detect

You are about to spawn evaluators on a file a teammate produced, AND that teammate is idle-but-resumable, AND you have sent it any delta whose completion you have not individually confirmed. The eval brief pins a version or count that the teammate may have since changed.

## Related

- [[guard-cited-as-runtozero-without-matching-vocab]] — related verification trap: a gate trusted without confirming it covers the current change
