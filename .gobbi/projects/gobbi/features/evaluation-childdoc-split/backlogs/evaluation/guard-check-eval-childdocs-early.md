---
name: guard-check-eval-childdocs-early
description: Sequence check-eval-childdocs.sh (the D5-completeness gate) as an EARLY Planning/Execution task, ahead of the rollout
type: backlogs
scope: feature
feature: evaluation-childdoc-split
status: closed
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation, process]
keywords: [check-eval-childdocs, completeness-gate, fail-closed, class-predicate]
author: claude
priority: high
project-scope: false
shipped_in: 48ff11a2
---

# Build `check-eval-childdocs.sh` early, before the rollout

## Context

The evaluation-childdoc-split design's completeness proof is a build-time gate, not the hand-listed illustrative D5 in the draft. The gate — `check-eval-childdocs.sh` (OQ-4) — sweeps `skills/` + `agents/` + `delegation/` + the SSOT/map docs + the 5 workflow trees for eval-output-shape hits, classifies each by the two-family class predicate (Family-9 / Family-8 / `verified-leave`), and spot-checks correctness (a `verified-leave` on a surface that actually satisfies Family-9 fails). It was fully specified in the design (see the `evaluation-childdoc-split` design doc's Completeness MODEL section) but not yet built.

## Why deferred

Out of scope for the Ideation loop's own size — Ideation locks the design and the gate's contract; building the script itself is Planning/Execution work.

## When to pick up

Immediately at the start of Planning/Execution for this feature — sequenced EARLY, ahead of the 5 per-loop split tasks and ahead of the atomic-last rollout flip, per FIX-U3 (iter6). Building it first means it GENERATES and CERTIFIES the complete co-touch inventory, rather than every split task relying on the hand-listed illustrative D5 as its only completeness signal.

## Suggested approach

Implement the 3-check gate from the design: (1) presence — every genuine hit the sweep finds is classified; (2) class-predicate classification (Family-9/Family-8, sibling-identity — a structurally identical surface auto-classifies the same way); (3) correctness spot-check — a `verified-leave` on a Family-9-predicate surface fails, at per-`path:line` granularity. Use the sweep pattern families cataloged in the `eval-childdoc-cotouch-inventory` reference as the starting scan patterns. Before wiring the gate into the rollout sequence, read the decision `guard-run-mode-not-separated` — the guard has two run modes (early D5-generation vs. flip-gated inclusion-enforcement) that must be kept separate or the guard fails on its first run.

## Resolution

Shipped as task 01 (`build-check-eval-childdocs-guard`) of this session's Execution — `check-eval-childdocs.sh` with `--self-test` / `--classify-only` / `--bundle {loop} --pre-flip` / `--enforce-inclusion`, built in 8 evaluation iterations. Used by every subsequent task (02-10) and as the sole acceptance gate for task 10's atomic flip. See the mistakes this build surfaced: `cotouch-classifier-must-model-exclusion-flips`, `exit-in-command-substitution-fails-open`, `mechanical-boundary-guard-relocates-not-converges`.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-07-39f3dfb0-49df-44d4-a6bd-d2e4743b36e3/`

## Related

- [[evaluation-childdoc-split]] (design) — the D6 gate specification this backlog item built
- [[eval-childdoc-cotouch-inventory]] — the illustrative co-touch inventory used to seed the sweep patterns
- [[guard-run-mode-not-separated]] — the open risk about the guard's two run modes, addressed during the build
