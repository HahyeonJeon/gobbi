---
name: verification-frame-phase-b-shipped
description: Phase B of the dual-system verification frame shipped — improvement candidates C1-C6 plus the live F1 mirror fix, all eight commits on the session branch
type: changelogs
scope: feature
feature: workflow
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [codex, evaluation, docs-sync]
keywords: [verification-frame, phase-b, C1, C2, C3, C4, C5, C6, F1, dual-system]
author: claude
shipped_in: claude-2026-06-26-babc6f3b-e845-4ed3-9625-c14ea9237fd8
---

# Verification-frame Phase B shipped — C1–C6 + F1

**Task:** Phase B of "Verifying the Claude–Codex dual-system" — implement the six improvement
candidates (C1–C6) the verification frame surfaced, plus fix the live F1 runtime-mirror defect.

## Summary

This session built the dual-system verification frame (Ideation) and then implemented every Phase-B
candidate the frame surfaced (Execution). All six candidates plus the live F1 fix shipped as eight
commits on branch `claude-2026-06-26-babc6f3b-e845-4ed3-9625-c14ea9237fd8`. The candidates were
originally staged as open backlog items; they are recorded here as SHIPPED rather than promoted as
open backlog, because the implementing work landed in the same session.

## What changed

Eight commits (newest first), `origin/develop..HEAD`:

| Commit | Candidate | What shipped |
|---|---|---|
| `7fea07ef` | C4 + C6 | Execution eval remediation — C4 escape-aware Integration-Log parse + bounded heuristic claim; C6 per-task schema reconcile + roll-up invariant |
| `94bdef34` | C2 + C5 | Execution remediation — state schemaVersion revert, C5/production docs-sync, C2 always-run guard |
| `5ee953f2` | C6 | per-step value telemetry (richer integration counts, schemaVersion 3) |
| `36b37f4f` | C5 | manual independence-classification gate before the Codex eval spawn (in `evaluation.md`) |
| `fbbefcd4` | C4 | Integration-Log structural validator (`validate-integration-log.sh`) + reference from `production.md` |
| `64c16ffb` | C3 | degraded-mode label gate added to the RECORD exit checklist |
| `93d83498` | C2 | `check-workflow-mirror-consistency.sh` standing guard + wired into Wrap-up |
| `f51f8d27` | C1 / F1 | mirror `production.md` into the `.claude/` runtime workflow dir (the live F1 fix) |

Candidate → outcome:

- **C1 / F1** — `production.md` now resolves through the `.claude/` runtime mirror (4-level symlink,
  matching its siblings). The live defect F1 is closed.
- **C2** — `check-workflow-mirror-consistency.sh` makes the D2.5 mirror check a standing guard, run at
  Wrap-up, so a future un-mirrored `workflow/*.md` can't ship silently again.
- **C3** — the degraded-mode label gate confirms RECORD copied `production_mode` +
  `codex_proposal_absent_reason` into `outputs/` frontmatter when a Codex proposal was absent.
- **C4** — `validate-integration-log.sh` checks 4-fields/row, the `decision` column ∈ enum, and that
  `merged-selective` rows name both sides; made escape-aware after the F-PROJ-1 real-log false-fail.
- **C5** — the proposer↔evaluator independence gate ships as a manual classification checklist wired
  into the eval-spawn step (doc/process, not a script — per the D6.2 lesson).
- **C6** — per-step value telemetry (`workflow.{loop}.integration` counts) on `session.json`,
  schemaVersion 3, unblocking the frame's D1.6 / D4.1 cost-review gates.

## Verification

Full gobbi workflow run: Ideation (iter1 FAIL → iter2 Claude-PASS/Codex-REVISE → iter3 PASS),
Preparation, Planning, Execution (dual-system eval, remediated via `7fea07ef` + `94bdef34`, then PASS).
The dual evaluation caught real defects at both Ideation (the manager's own audit-trail gap) and
Execution (two distinct defects via cross-system divergence — the C4 escaped-pipe false-fail and the C6
per-task schema drift). Standing guards re-run at Wrap-up.

## Deferred

- The Phase-B D1 consult sub-mode (Option C) stays DEFERRED (evidence-gated); the locked default is
  Option A. See the verification-frame design doc's re-open criteria.
- Cross-session D1.6 / D4.1 trend evaluation needs N=3 sessions of accumulated telemetry before it
  produces a single-mode-candidate signal.

## Related

- [[dual-system-verification-frame]] — the frame these candidates harden
- [[codex-proposer-model]] — the D1–D9 dual-system model the frame verifies
- [[2026-06-26-rolling-window-n-and-per-task-telemetry]] — the C6 decision
- [[2026-06-26-independence-gate-doc-not-script]] — the C5 decision
- [[2026-06-26-claude-symlink-target-depth]] — the C1 decision
