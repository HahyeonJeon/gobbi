---
name: hook-latency-bounds
description: Checklist — Execution-time latency measurement for hook and reconstructor
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [performance, latency, hook, reconstructor, checklist]
---

# Hook and reconstructor latency bounds — Execution measurement checklist

## Context

The hook's per-fire cost is O(transcript_lines) for the transcript scan, bounded by N Task spawns × session transcript size. No hard latency budget was locked in Ideation. Inline bounds documented at design time:
- Hook fires: N Task spawns, typically 20-50 per session
- Transcript scan: O(transcript_lines), typically < 5000 lines per session
- No external network call

## Checklist item

- [ ] Execution-time fixture measurement: run the hook against a representative fixture transcript (500 lines, 1000 lines, 5000 lines); record wall-clock time; verify < 500ms p99 per fire.
- [ ] If wall-clock exceeds 500ms p99: escalate to Planning with a latency budget decision before shipping.

## Source

Surfaced as a performance finding during install-runtime design evaluation (session 1b26cf20). Codex evaluator flagged the absence of a hard latency budget in Ideation.
