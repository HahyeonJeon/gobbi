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

# Hook and reconstructor latency bounds — Execution measurement

## What

At Execution, measure the PostToolUse hook's wall-clock cost against representative fixture transcripts (500, 1000, and 5000 lines) and verify it stays under 500ms p99 per fire. If any fixture exceeds 500ms p99, escalate to Planning for a latency-budget decision before shipping the hook.

## Why

The hook's per-fire cost is O(transcript_lines) for the transcript scan, bounded by N Task spawns × session transcript size (typically 20-50 fires and under 5000 lines per session, with no external network call). No hard latency budget was locked at design time, so the per-fire cost is bounded only by analysis, not by a measured ceiling. A fixture measurement at Execution turns the assumed bound into a verified one before the hook fires on every real Task spawn.

## Verification

Run the hook against the three fixture sizes, record wall-clock time, and confirm < 500ms p99 per fire. Failing that threshold gates the ship.

## Status notes

Pending — the measurement runs at Execution time, once the hook script exists. No budget has been locked yet; the 500ms p99 figure above is the proposed gate, subject to the Planning escalation if a fixture exceeds it.

## Source

Surfaced as a performance finding during install-runtime design evaluation (session 1b26cf20); the Codex evaluator flagged the absence of a hard latency budget at design time.
