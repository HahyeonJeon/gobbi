---
name: stage3-memory-validation-nonskippable
description: Wrap-up stage 3 (memory validation = wrap-up EVALUATION) is NON-SKIPPABLE and gates git stage 5
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [wrap-up, evaluation]
keywords: [pipeline, non-skippable]
author: claude
supersedes: null
superseded_by: null
---

# Wrap-up stage 3 (memory validation) is non-skippable and gates git finalization

## Context
The wrap-up pipeline redesign (D-c) places memory validation (= the wrap-up loop's dual-system EVALUATION) as stage 3 before git finalization (stage 5). The iter1 draft stated this as "keep non-skippable (recommended)" and deferred the lock to Planning. This ambiguity was surfaced as Codex consistency-002 and risk-001: a reader could interpret "recommended" as "settings-overridable," which would allow `evaluate.mode: skip` to bypass the memory-validation gate and let git finalization run on unvalidated memory.

## Decision
Stage 3 (memory validation = the wrap-up loop's dual-system EVALUATION) is NON-SKIPPABLE. Settings can NEVER set `evaluate.mode: skip` for this stage. It always runs and always gates the irreversible git stage 5. This is a single explicit rule, not a Planning fork. The rule is stated in Design § D-c.

## Rationale
D13 (user-decided). Existing `wrap-up/SKILL.md:326` already states "Wrap-up evaluation is non-skippable" — D13 keeps that property and ties it explicitly to gate the irreversible git stage 5. EXT-4: release pipelines place irreversible actions last, behind gates. Without this lock, settings could produce a path where git runs on unvalidated memory.

## Alternatives considered
- Defer to Planning (rejected by D13: "Planning must lock" framing creates uncertainty and another decision point; the user locked it as a single Ideation rule).
- Allow skip with explicit user override (rejected: the gate exists precisely to prevent git running on bad memory; any skip path undermines this).

## Consequences
The `wrap-up/SKILL.md` redesign must state the non-skippable rule explicitly in the 5-stage pipeline spec. `orchestration/workflow/record.md` (formerly memorization.md) must reference this rule. No settings key can remove this gate.

## Related
- Design § D-c (5-stage pipeline table)
- Discussion D13
- `evaluation/iter1/codex/consistency.md` (codex-ideation-consistency-002)
- `evaluation/iter1/codex/risk.md` (codex-ideation-risk-001)
