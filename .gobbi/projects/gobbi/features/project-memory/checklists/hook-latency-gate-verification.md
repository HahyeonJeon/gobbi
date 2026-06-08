---
name: hook-latency-gate-verification
description: New or heavier hooks must be measured at 500/1000/5000-line fixtures before ship; gate is 500ms p99
type: checklists
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [hooks, performance, latency, checklist]
---

# Hook latency gate verification

## Scenario

Shipping a new hook or making an existing hook heavier (e.g., D5's PostToolUse now sums a full agent transcript per fire; D5's SessionEnd hook processes the complete manager transcript).

## Checklist

- [ ] Run the PostToolUse hook against a 500-line transcript fixture and measure wall-clock time. Must be < 500ms p99.
- [ ] Run the PostToolUse hook against a 1000-line transcript fixture. Must be < 500ms p99.
- [ ] Run the PostToolUse hook against a 5000-line transcript fixture. Must be < 500ms p99.
- [ ] Run the SessionEnd hook against a 500-line main-transcript fixture (manager transcript at end of session). Must be < 500ms p99.
- [ ] Run the SessionEnd hook against a 1000-line fixture. Must be < 500ms p99.
- [ ] Run the SessionEnd hook against a 5000-line fixture. Must be < 500ms p99.
- [ ] If any fixture breaches 500ms p99: escalate to a Planning latency-budget decision before shipping. Do not ship a hook that fails the gate.
- [ ] Record fixture results in the relevant hook's inline comments or a companion `hooks/latency-measurements.md` note.

## Why this matters

The locked latency gate at `features/install-runtime/checklists/hook-latency-bounds.md` requires measurement at these three fixture sizes. D5's PostToolUse hook is heavier than the current version (it now sums a full agent transcript every fire). The SessionEnd hook is new and processes the manager transcript. Both must meet the gate before they can ship.

Discoverable during D5 evaluation: Codex (PERF-001) flagged that D5's implementation checklist omitted the latency gate measurement entirely.

## Related

- `features/install-runtime/checklists/hook-latency-bounds.md` — the authoritative gate definition
- Design § D5, Success Criterion 5, Scenario S9
