---
name: codex-bridge-model-at-capacity-degrades-eval
description: codex exec can fail mid-run with "model at capacity" leaving stub output, and a retry can hit it again — salvage the partial narration, verify it directly, and surface the degraded-mode gate rather than silently proceeding single-system.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [codex, verification]
keywords: [model-at-capacity, codex-exec, partial-output, degraded-mode-gate, salvage-narration]
author: claude
priority: medium
domain: codex
---

# `codex exec` "model at capacity" failures leave salvageable partial output — surface the gate, don't silently degrade

## What happened

At Planning iter 4, the Codex evaluation run hit a provider-side "model at capacity" failure — the
`codex exec` process could not complete. Critically, this was a CLAUDE-side classifier outage that
blocked the Claude evaluator's own Agent spawn ("claude-sonnet-5[1m] temporarily unavailable"), not a
Codex-side failure — the Codex iter-4 evaluation had actually COMPLETED successfully (9/9 files,
VERDICT: REVISE) by the time the Claude side failed. Rather than discarding the completed Codex result
or silently proceeding Claude-only without flagging it, the manager honored the completed Codex
evidence and surfaced the situation explicitly to the user, who then issued the explicit Codex waiver
for the rest of the session (`gate-decisions-iter4.md`).

## Why it happens

A `codex exec` (or any long-running background provider call) failing partway through — whether from
provider capacity limits, a classifier outage on either side, or a timeout — naturally reads as "this
run produced nothing usable," inviting either a silent retry-and-hope or a silent fallback to
single-system without flagging the degradation. Both responses lose information: a partial or even a
COMPLETED run on one side, while the other side failed, still carries real evaluative signal that a
retry-and-discard approach throws away, and a silent single-system fallback hides the exact safety-gate
condition (`orchestration`/CLAUDE.md's dual-system waiver requirement) that the workflow is designed to
surface to the user before continuing degraded.

## How to recognize it

A dual-system production or evaluation step where ONE side (Claude or Codex) fails to complete —
provider capacity, classifier outage, timeout, or any other infrastructure failure — while the OTHER
side has partial or complete output. The trigger to catch: about to discard the working side's output
because "the run overall failed," or about to silently continue single-system without an explicit
user-facing waiver, when the underlying dual-system contract (`CLAUDE.md` § Dual-system quality
contract) requires the user to explicitly waive a named system before the loop continues degraded.

## Corrected approach

When one side of a dual-system run fails: (1) check whether the OTHER side's output is complete or
partially usable — do not assume a paired failure; (2) if the surviving side's output is complete,
HONOR it as valid evidence rather than discarding it because the paired run overall "failed"; (3) if
the surviving side's output is only partial, read it directly for any real findings it already
surfaced before deciding whether to retry; (4) always surface the degraded-mode condition through the
active runtime's user-decision primitive — per `CLAUDE.md`, continuing with one system requires the
user to EXPLICITLY WAIVE the named system for that step and iteration; never silently fall back.

## Related

- [[dual-value-survives-a-failed-run]] — the generalization of this instance: the second system's
  anti-groupthink value can be realized even when its OWN run fails mechanically, by reading its
  partial output directly rather than discarding it
- `mistakes/codex/codex-background-exec-exit-code-unreliable.md` — a related trap on validating a
  backgrounded codex run's output file rather than trusting its raw exit code
- `mistakes/codex/dual-production-race-false-degraded-mode.md` — a related trap where a fast side
  races ahead of a slower Codex run and falsely declares degraded mode; this trap is the mirror case
  where a genuine infrastructure failure occurred and the correct response is to salvage, not discard
