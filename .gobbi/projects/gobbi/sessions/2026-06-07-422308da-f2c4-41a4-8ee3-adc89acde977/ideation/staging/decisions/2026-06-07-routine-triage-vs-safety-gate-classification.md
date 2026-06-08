---
name: 2026-06-07-routine-triage-vs-safety-gate-classification
description: Auto-mode evaluation escalations are split into routine-triage (mode-split, Chat-only) and safety-gate (interrupt in both modes) classes; this boundary is locked and explicit in three locations
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-07
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [auto-mode, evaluation, safety-gate, routine-triage, mode-split]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Routine-triage vs safety-gate classification for Auto-mode evaluation escalations

## Context

The `workflow/evaluation.md` document contains multiple escalation paths that tell the manager to stop and ask the user. In Auto mode, these conflict with the autonomy contract in `auto-mode.md §1/§6`. The question is: which escalations are legitimate Auto interrupts, and which are routine triage that must be mode-split?

This was debated during ideation iter3 evaluation and resolved as a user-locked decision (D8, Always-Ask Design category).

## Decision

Auto-mode evaluation escalations are divided into two classes:

**Routine-triage escalations (mode-split — Chat escalates to user; Auto does not interrupt):**
- `evaluation.md § Iteration Caps` — cap exhaustion without PASS
- `evaluation.md § Stuck detection` — same finding open across two consecutive iters
- `evaluation.md § Regression marking` — new finding introduced in a REVISE iter

In Auto mode, the manager handles these by auto-iterating within budget, recording the tag/finding, and surfacing it at Wrap-up.

**Safety-gate escalations (interrupt in BOTH modes — must not be mode-split):**
- Major dual-system divergence (`PASS`↔`FAIL` / `REVISE`↔`FAIL`) in `evaluation.md § Severity-gated divergence handling`
- Degraded-mode / single-system fallback in `evaluation.md § Degraded-mode policy`
- Both systems failing (same section)

The minor divergence (`PASS`↔`REVISE`) is not a safety gate — it auto-proceeds via pessimistic union, as today.

## Rationale

The routine-triage paths are about ordinary editorial judgment (should we revise more, accept-as-is, defer?). These are appropriate for the user to decide in Chat mode but are routine operational decisions the Auto manager should handle within its budget. They do not indicate a structural failure of the workflow.

The safety gates are different in kind: they indicate the dual-system evaluation mechanism itself has broken down (major divergence, single-system failure, total failure). These cannot be resolved by iterating — they require human judgment about whether to continue the session at all. They remain as §1 "a step fails in a way the manager cannot resolve" interrupts.

## Alternatives considered

**Alternative A — mode-split all evaluation.md AskUserQuestion paths.** Rejected: silencing safety gates breaks the dual-system guarantee. A major divergence (`PASS`↔`FAIL`) is not routine triage; it signals a fundamental disagreement between systems that the manager cannot reconcile.

**Alternative B — keep all evaluation.md paths mode-agnostic.** Rejected: this is the pre-fix state causing the three manager misbehaviors. Routine-triage paths are the root cause of the manager asking the user and idling in Auto mode.

## Consequences

1. Planning and Execution must mode-split exactly the three routine-triage sections and leave the three safety-gate sections intact.
2. The boundary must be stated explicitly in both `auto-mode.md §7.3` (carve-out) + `§7.4` (NEVER-row: "silences a safety gate") and `evaluation.md` (framing sentence near the escalation sections).
3. `orchestration/SKILL.md` is NOT touched (locked trailing-append as §7 means §3/§6 references remain valid).

## Related

- Ideation artifact: `sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/artifacts/idea.md § Decisions Log D8`
- Source eval: `sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/evaluation/iter3/claude/overall.md`
