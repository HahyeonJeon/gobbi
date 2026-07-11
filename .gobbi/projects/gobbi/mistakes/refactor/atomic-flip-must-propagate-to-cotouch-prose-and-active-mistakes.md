---
name: atomic-flip-must-propagate-to-cotouch-prose-and-active-mistakes
description: An atomic-flip's semantic repoint must propagate to co-touch PROSE and guard-excluded-but-active mistakes.md, not only to the structural-guard's count surfaces
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-10
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [refactor, docs-sync]
keywords: [atomic-flip, seed-source-repoint, structural-guard-blindspot, guard-excluded-surface]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: [cotouch-enumeration-must-cover-semantic-equivalents, enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete, split-added-content-must-match-skill-and-runtime-facts]
---

# An atomic-flip's semantic repoint must propagate to co-touch PROSE and guard-excluded-but-active mistakes.md, not only to the structural-guard's count surfaces

## What happened

Task 10's atomic flip changed the evaluator output contract from 8 to 9 files AND repointed the Stage-1 seed source (seeds now come from `{loop}/scenario.md` + `{loop}/checklist.md`, no longer from the monolithic `{loop}/evaluation.md`). The flip was gated GREEN by `check-eval-childdocs.sh --enforce-inclusion` (all 65 Family-9 output-COUNT surfaces reference `checklist.md`). But the dual-system iter2 evaluation still found two classes of survivor the guard could not see:

- **CONSISTENCY-01 (Codex Medium):** ~8 ACTIVE prose surfaces still attributed the Stage-1 SEED scenarios/checklist to `evaluation.md` (`orchestration/workflow/evaluation.md:36`, `.../execution.md:137`, `.../planning.md:84`, `execution/SKILL.md:167`, `wrap-up/SKILL.md:448`, `delegation/templates/evaluator.md:67`, `evaluation/SKILL.md:106/238/531`). None is an output-count surface, so the guard never flagged them.
- **PROJECT-01 (Codex High):** the forward-guidance "8 expected files" count survived in guard-EXCLUDED-but-active `skills/{evaluation,codex}/mistakes.md` (`check-eval-childdocs.sh` prunes `mistakes.md` from its scan). Those files still tell a future agent to verify 8 files.

## Why it happens

A structural guard proves ONE property — here, that every output-directory-ENUMERATION surface names `checklist.md` (Family-9, output-COUNT). It says nothing about SEED-SOURCE prose (which file supplies the Stage-1 seeds) or about files it deliberately excludes from its scan (`mistakes.md`). A green `--enforce-inclusion` was read as "the flip fully propagated", but the flip had TWO semantic axes (count 8→9 AND seed-source `evaluation.md`→`scenario.md`/`checklist.md`) and the guard only enforces the first. The seed-source axis and the guard-excluded forward-counts are exactly the co-touch sites a count-only guard cannot reach.

## Correct approach

When an atomic flip carries a semantic repoint the structural guard does NOT enforce, run a SEPARATE concept-level co-touch sweep for EVERY phrasing of the repointed semantic across the WHOLE tree — including guard-excluded-but-active surfaces (`skills/*/mistakes.md` forward-guidance) — and repoint each active occurrence, leaving only genuinely historical narrative ("what happened") intact. Treat the structural guard's green as necessary-not-sufficient: enumerate the semantic axes of the flip, and for each axis the guard does not cover, add its own sweep to the verification plan.

## How to detect

An atomic flip whose acceptance gate is a STRUCTURAL guard, where the change has a SEMANTIC axis the guard does not enforce (e.g. it enforces output COUNT but the flip also repoints a SEED SOURCE, or it excludes a live doc class like `mistakes.md`). Red flag: "the guard is green, so the flip is done" without a separate concept-grep for every phrasing of the repointed semantic (seed-source attributions to the old file, stale forward-counts in guard-excluded active docs).

## Related

- [[cotouch-enumeration-must-cover-semantic-equivalents]] — the sibling trap: a co-touch enumeration by one phrasing misses semantically-identical assertions phrased differently
- [[enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete]] — enumerate every restatement of a contract before claiming the affected-file map complete
- [[split-added-content-must-match-skill-and-runtime-facts]] — sibling trap from the same session: content added during a split must be checked against its owner, not assumed correct
