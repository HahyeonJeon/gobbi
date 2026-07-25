---
name: planning-bundle-source-trace-paraphrase
description: Task-05 residual Low findings F3 (source: traces paraphrase WF sub-blocks + two-way task-schema naming) and F4 (SOP-PERF-CASE-01 weak scenario-level failure coverage) — deferred, non-gating.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-24
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync]
keywords: [source-trace, paraphrase, task-schema-naming, sop-perf-case-01, f3, f4]
author: claude
scenario: rewrite-planning-bundle
item_status: deferred
anchor: novel
implemented_in: null
---

# Check the planning bundle's source-traces name literal headings and align task-schema naming

## What

Two residual Low findings from task 05's iter1 evaluation, consolidated (shared bundle-hygiene subject):

- **F3** (Consistency / Aesthetics, Low/75) — a few `source:` traces in the rewritten bundle paraphrase
  WF sub-blocks rather than naming the literal heading; and `scenario.md` vs `checklist.md` name the
  task-schema source two different ways. All references resolve; none is a line-number anchor.
- **F4** (Structure, Low/50, appendix) — SOP-PERF-CASE-01's failure/recovery coverage-role is exercised
  weakly at the scenario level; the dedicated check for it exists in the checklist, so coverage is not
  lost, only thin at the scenario tier.

## Why

Both are conformance nits below the REVISE threshold, and neither blocks the SOP-dogfood the bundle
rewrite achieves. F3 is a docs-sync precision gap (paraphrase vs literal heading); F4 is a
scenario/checklist coverage-balance nuance.

**Manager disposition: deferred (non-gating).** Fixing them requires no plan change; a future
bundle-hygiene pass can tighten the `source:` traces to literal headings, unify the task-schema naming,
and strengthen SOP-PERF-CASE-01's scenario-level failure oracle.

## Verification

Not required for task 05 (Low, non-gating). When picked up: confirm every `source:` trace names a
literal heading, `scenario.md`/`checklist.md` agree on the task-schema source name, and SOP-PERF-CASE-01
carries an explicit scenario-level failure/recovery oracle. Re-run
`check-eval-childdocs.sh --bundle planning --pre-flip` (exit 0) + `check-markdown-links.sh`.

## Status notes

`item_status: deferred` = manager reviewed, intentionally not remediated inside task 05. Full finding
text in `evaluation/iter1/claude/consistency.md` (F3) and `evaluation/iter1/claude/structure.md` (F4).

## Related

- `evaluation/iter1/claude/consistency.md` — F3 finding text
- `evaluation/iter1/claude/structure.md` — F4 finding text
- [[task-05-single-system-evaluation-codex-waived]] — the evaluation-mode note for this iteration
