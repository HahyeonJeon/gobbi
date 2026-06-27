---
type: mistakes
skill: evaluation
description: "Recorded traps for evaluation — load before doing evaluation work"
updated: 2026-06-27
---

# Evaluation — Mistakes

> Load before any evaluation work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Freeze Producer Artifact Before Evaluating

`priority: high` · `domain: verification` · `added: 2026-06-24` · `status: active` · `tags: [verification, evaluation]`

**What happened** — The manager spawned the dual-system evaluators (`eval-claude`, `eval-codex`) on a producer's artifact while the producer teammate was still writing it. A queued, in-flight delta landed a new write (11 to 12 principles) around the same time the evaluators read the file, so the evaluation target changed mid-evaluation. Both Codex Risk and Consistency perspectives independently flagged the moving target, and the eval brief still named the stale version.
**Why it happens** — The manager moved from WORK to EVALUATION without confirming the producer's terminal output and without freezing the artifact. A teammate reports DONE and goes idle, but it remains resumable — a previously-sent delta can still be processed and overwrite the file after the manager has already dispatched evaluators against it.
**How to detect** — You are about to spawn evaluators on a file a teammate produced, AND that teammate is idle-but-resumable, AND you have sent it a delta whose completion you have not individually confirmed. The eval brief pins a version or count the teammate may have since changed.
**Correct approach** — Before spawning evaluators on a producer's artifact: (1) confirm the producer's terminal output is the one on disk — read it, check the version or count; (2) stop sending it deltas; (3) pin the exact version in the eval brief; only then dispatch. If the target changes after dispatch, re-pin and re-evaluate rather than reconciling across versions.
**User feedback** — Evaluators surfaced the problem independently: the eval brief named a stale version, and two Codex perspectives flagged the moving target as a gap. The manager recognized the dispatch ordering was the root cause.
