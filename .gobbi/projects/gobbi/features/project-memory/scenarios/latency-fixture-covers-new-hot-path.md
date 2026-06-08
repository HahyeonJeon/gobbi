---
name: latency-fixture-covers-new-hot-path
description: Scenario gap — latency gate fixture must include a large per-subagent own-transcript to cover the new per-fire transcript-summing hot path added in task 02
type: scenarios
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [performance, hooks, latency]
---

# Latency fixture must cover per-subagent transcript-summing hot path

## Scenario

When task 02 moves cumulative token summing into the PostToolUse hook (reading `subagents/agent-<agentId>.jsonl` on every fire), the latency gate's fixture must include a realistically-large per-subagent own-transcript — not just the main transcript lines.

## Why it matters

If the fixture's own-transcript is small or absent, task 06 can report < 500ms while the real per-fire cost on a 5000-line own-transcript is unmeasured. The locked gate exists to catch exactly the regression task 02 introduces; a fixture that omits the new hot path measures the old hook.

Claude PERF-1 (Performance, scenario_gap, Medium, Confidence 50) and Codex PERF-001 (Performance, High, Confidence 75) both flagged this.

## Checklist

| # | Item | Status | Verification |
|---|---|---|---|
| 1 | Fixture includes a per-subagent own-transcript of ≥ 500, 1000, and 5000 lines alongside the main transcript | implemented | task 06 verify explicitly states fixture includes a large per-subagent own-transcript |
| 2 | p99 measurement method documented (N≥20 runs, sort, ceil(0.99·N)-th) | implemented | task 06 verify specifies `date +%s%N` / `/usr/bin/time`, N≥20, p99 formula |
| 3 | PASS/ESCALATE verdict per fixture + hook recorded | implemented | results file records per-fixture verdict |

## Status notes

Addressed in iter2: task 06 verify was extended to require the fixture cover the per-subagent own-transcript hot path, and the measurement method was specified (N≥20, p99 formula, PASS/ESCALATE per fixture).
