---
name: perf-6-001-cold-load-schema-mismatch-hard-fails
description: The Codex cold-load probe's success branch hard-fails on a turn.completed event-schema mismatch instead of taking the documented exit-4 unavailable/unauthorized skip path.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [planning, verification]
keywords: [cold-load-probe, codex-exec, turn-completed, exit-code-asymmetry, cost]
author: claude
---

# The cold-load probe's success branch hard-fails on a Codex event-schema mismatch

## Context

Task 08's optional cold-load probe (`COLD_LOAD_PROBE=1`, off by default) enters `case "$codex_rc" in
0)` after re-enabling `set -e`, and its success branch runs
`jq -sre '[.[] | select(.type == "turn.completed") | .usage.input_tokens] | ...'` against the Codex
event stream. The iter-6 Claude evaluator (Performance perspective, `F-PERF-6-001`, Low, confidence
50) found that if Codex's JSON event stream does not carry exactly one `turn.completed` record with
`.usage.input_tokens`, `jq` errors, `set -e` aborts, and all of task 08 exits 1 — the plan's own
documented exit-code contract reserves exit 1 for `COLD_LOAD_FAIL` (a hard probe failure), with exit 4
reserved for `unavailable` / `unauthorized` (routed to `NEEDS_CONTEXT`). A schema mismatch is neither
outcome; it is a tooling mismatch taking the harshest exit path by construction, not by design intent.
The same asymmetry applies to the probe's default model id (`gpt-5.6-sol`).

**Confidence is capped at 50** because verifying the actual `turn.completed` event shape and the
default model id requires a real, cost-bearing `codex exec` call, which this session's verification
preflight forbids without explicit approval. The `set -e`-scope reasoning is verified by reading the
extracted shell block directly; the event-schema premise is not independently confirmed.

## Decision

Accept the plan as-is for PASS. The probe is opt-in and off by default — a normal Execution or
Wrap-up run never reaches this code path, so the risk is bounded to sessions that explicitly authorize
`COLD_LOAD_PROBE=1`. When an authorized run does hit a schema mismatch, the result is a loud,
correctly-attributed failure (task 08 exits 1 with the `jq` error visible), not a silent pass — so the
defect class is an exit-code MISCLASSIFICATION, not a correctness or safety hole.

## Rationale

- Bounded blast radius: default-off, and the failure mode when triggered is loud, not silent.
- The fix is a small, well-scoped change (route a usage-extraction failure to the same
  `unavailable:usage-schema` -> exit 4 path already used for the unavailable/unauthorized case) that
  does not require re-opening the plan's guard-mechanics discipline the user directed toward
  simplification at iter 5.
- Confirming the actual Codex event schema needs a paid API call this session is not authorized to
  make without a separate explicit approval — appropriately deferred rather than guessed at.

## Alternatives considered

- **Verify the Codex `turn.completed` schema now with a paid call.** Rejected: requires explicit
  cost-approval outside this RECORD's authority; the probe's opt-in, zero-default-spend design already
  bounds the risk without spending to resolve it now.
- **REVISE the plan to add the exit-4 branch now.** Rejected: Low severity, capped confidence, bounded
  blast radius (opt-in probe) — not a blocking defect for Planning PASS; better resolved at the point
  someone actually runs the probe with real budget authorization.

## Consequences

- The plan's own suggested direction stands as the fix candidate for whoever next authorizes and runs
  the cold-load probe with real budget: treat a usage-extraction failure the same way an unavailable
  runtime is treated (`unavailable:usage-schema` -> exit 4), OR explicitly document that a schema
  mismatch is an intentional hard failure. Either resolves the asymmetry; the choice is deferred to
  whoever has the budget authorization to verify the real event shape.
- No change required to ship this plan; this is carried forward as a known, bounded, opt-in-path gap.

## Related

- [[usage-6-001-anchorless-pointer-rationale-overstates-tooling]] — a sibling Low finding about a gap
  between what the plan claims a tool proves and what the tool actually proves
