---
name: dual-production-codex-added-real-coverage
description: Dual-system production with a blind Codex proposer adds real, verifiable coverage rather than noise — this session's evidence
type: learnings
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [evaluation, codex, process]
keywords: [dual-system, proposer, coverage-breadth, integration-log, blind-parallel]
author: claude
related: []
---

# Dual production: Codex blind proposal added real coverage this session

## Insight

A blind Codex proposal integrated via principled SELECT (not blend) can add genuine artifact coverage across 13 of 16 integration decisions (4 took-codex + 9 merged-selective) while Claude-main catches what the proposal misses (F1, the missing runtime mirror — 2 kept-own).

## Context

Ideation iter1 (session babc6f3b) ran dual production per the D1–D9 model: Claude leader authored the canonical frame; a blind Codex proposer (separate `codex exec`, no shared context) wrote a parallel draft; the producer ran principled selective integration (16 deltas logged in `reconciliation-iter1.md`). Both systems independently reached the same headline conclusions (keep blind-parallel default; reject interactive-advisor; selection is the lever). The proposal added coverage breadth the producer's draft lacked.

## Reason

Without evidence that dual production adds real value (vs just adding cost and Codex-label theater), there is no basis for keeping it as the default. This session's Integration Log is a concrete, per-delta-cited record that the Codex co-worker shaped 13 of 16 decisions — the value is attributable, not a vibe.

## How

Read the Integration Log counts after each dual production run: `took-codex` + `merged-selective` = artifact-changing rows; `kept-own` = noise or Claude-main superiority; `escalated` = LARGE-gap surfacing. A run with zero `took-codex` + zero `merged-selective` across all rows is a noise signal (D1.2 in the verification frame). The coverage areas the proposal added: step-specific scenarios (1B), 8 sharper checklist items, the labeled `consult` sub-mode, the closing verification invariant — all cited in the Integration Log with their source principle.

## Counter-cases

- **Low-yield steps (Preparation, mechanical Execution):** Codex may add nothing across several runs. D1.2 flags this; D4.1 + D1.6 (when C6 telemetry ships) make the single-mode-candidate case. Do not generalize this session's Ideation result to every step.
- **Weak selector:** a low `took-codex` count may reflect a producer that does not integrate well, not a Codex proposal that adds nothing (D4.6 in the verification frame). Read the Integration Log `why` columns to distinguish.

## Related

- [[dual-eval-caught-managers-own-audit-gap]] — the evaluation-side complement: dual eval also caught a real defect
