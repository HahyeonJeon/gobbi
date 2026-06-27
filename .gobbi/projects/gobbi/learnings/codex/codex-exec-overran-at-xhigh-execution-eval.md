---
name: codex-exec-overran-at-xhigh-execution-eval
description: A full 7-perspective Codex eval at xhigh over a multi-file change-set over-ran (15k+ output lines, ~17min); budget timeout >=1500s and expect the wrapper assistant to checkpoint before Codex finishes
type: learnings
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [codex, evaluation, process]
keywords: [codex-exec, xhigh, timeout-budget, eval-overrun, wrapper-checkpoint, cost]
author: claude
related: []
---

# Codex eval at xhigh over-runs on a multi-file change-set — budget the timeout up

## Insight

A full seven-perspective Codex evaluation at `xhigh` reasoning over a multi-file change-set is slow
and high-volume: this session's Execution Codex eval produced 15k+ output lines and the wrapper
assistant checkpointed before Codex finished; the run completed in roughly 17 minutes. Budget the
`codex exec` timeout at >= 1500s for this shape, and expect a wrapper checkpoint rather than a clean
single-shot return.

## Context

Execution evaluation (session babc6f3b) ran the Codex evaluator over the C1–C6 change-set (eight
commits across several skill/script files), all seven perspectives plus Overall, at xhigh. The output
was large enough (15k+ lines) that the wrapper assistant recorded a checkpoint mid-run; the exec
itself ran ~17 minutes before completing. The evaluation was real and caught a genuine defect (the
C6 per-task schema drift), so the cost bought signal — but the latency and volume were notably higher
than a single-file or non-xhigh eval.

## Reason

The default evaluation-bridge timeout (and an under-budgeted manager timeout) will trip on this shape
and risk a false BLOCKED/timeout on a Codex run that would have completed. Knowing the empirical
envelope (>= ~17min, 15k+ lines, checkpoint expected) lets the manager set the timeout correctly and
not mistake a slow-but-valid eval for a degraded one.

## How

- For a full 7-perspective Codex eval at xhigh over a multi-file change-set, set `timeout >= 1500s`
  (not the 600s evaluation-bridge default and not a tight 1200s).
- Expect the wrapper assistant to checkpoint before Codex returns; a checkpoint is not a failure
  signal here.
- Confirm completion by the proposal/eval file's terminal state on disk, not by the wall-clock alone.

## Counter-cases

- **Single-file or small change-set evals** finish well inside the default budget; do not inflate the
  timeout by habit.
- **Non-xhigh reasoning** is materially faster — the >=1500s budget is specific to xhigh + breadth.
- **A genuine hang** (no new `~/.codex` rollout, no growing output) is still a real timeout — budget
  up, but keep the BLOCKED-on-genuinely-empty discipline (do not self-author a Codex result).

## Related

- [[codex-exec-cd-worktree-worked]] — companion codex-exec operational learning this session
