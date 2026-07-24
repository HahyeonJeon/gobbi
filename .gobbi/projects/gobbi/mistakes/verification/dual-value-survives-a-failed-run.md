---
name: dual-value-survives-a-failed-run
description: The second system's anti-groupthink value can be realized even when its run FAILS mechanically — always read a failed evaluator's partial output before discarding it.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, evaluation]
keywords: [dual-system-value, partial-output, mechanical-failure, anti-groupthink, salvage]
author: claude
priority: medium
domain: process
---

# The dual-system anti-groupthink value survives a mechanically failed run

## What happened

At an earlier point in this session's dual-system evaluation history, a Codex evaluator run FAILED
mechanically before completing all its output files — yet the partial narration it had already written
carried two real, independently verifiable findings that the manager confirmed directly against the
live tree and folded into the loop's reconciled verdict. The dual-system model's value — an
independent second vantage point catching what the first system missed — was realized from a run that,
by the narrow metric of "did the process complete successfully," counted as a failure.

## Why it happens

"The run failed" and "the run produced no usable signal" are treated as equivalent, but they are not:
a generator or evaluator process can fail PARTWAY through — a timeout, a provider capacity limit, an
infrastructure hiccup — after it has already written real, substantive findings to its output stream
or partial output file. Discarding the whole run because its EXIT status was unsuccessful throws away
whatever signal it produced before failing, even when that signal is independently verifiable and
genuinely useful. This compounds with the general operator instinct to treat a failed background job
as simply "retry or skip," rather than "read what it left behind first."

## How to recognize it

Any dual-system (or any multi-run) evaluation where one run's process exits with a failure status —
before concluding that run produced nothing, check whether it wrote any output BEFORE failing (a
partial file, a stdout log, a stub with narration). The trigger to catch: about to mark a run's
contribution as zero, or skip reading its partial output, solely because its process-level status was
"failed" rather than "succeeded."

## Corrected approach

Before discarding a failed run's contribution: (1) read whatever partial output it produced — do not
gate the read on the process's own success/failure status; (2) for each finding or observation the
partial output contains, independently verify it against the live tree or artifact (the same
verification discipline as any other evaluator finding) — a partial run's findings are not
automatically trustworthy just because they exist, but they are not automatically WORTHLESS either;
(3) fold verified findings into the loop's reconciled verdict on their own merits, citing the partial
run as their source; (4) still surface the mechanical failure itself through the degraded-mode /
user-decision gate (see `codex-bridge-model-at-capacity-degrades-eval`) — salvaging value from a
failed run does not substitute for surfacing that the run failed.

## Related

- [[codex-bridge-model-at-capacity-degrades-eval]] — the concrete instance this general lesson is
  extracted from: a Codex run that hit provider capacity mid-run still carried usable, verified signal
- `mistakes/codex/codex-background-exec-exit-code-unreliable.md` — a related but distinct trap: there,
  a SUCCESSFUL background run reports an unreliable exit code; here, a run whose exit status genuinely
  IS a failure can still carry salvageable partial content
