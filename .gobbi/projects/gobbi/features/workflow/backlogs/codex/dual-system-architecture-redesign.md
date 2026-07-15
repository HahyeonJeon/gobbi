---
name: dual-system-architecture-redesign
description: Deferred redesign of full dual-system production and evaluation architecture.
type: backlogs
scope: feature
feature: workflow
status: deferred
created: 2026-07-01
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [codex, evaluation, design]
keywords: [dual-system, production, evaluation, orchestration]
author: codex
priority: medium
project-scope: false
shipped_in: null
---

# Dual-system architecture redesign

## Context
This session approved a bounded bridge orchestration contract for Claude wrapper agents that launch Codex proposer and evaluator jobs. The approved scope intentionally stops at documentation ownership, prompt-file lifecycle, wrapper responsibilities, prompt contracts, failure behavior, verification gates, and parent routing.

The broader architecture question remains: how Gobbi should design full dual-system production and evaluation across phases, including production/evaluation orchestration algorithms and cross-system interaction boundaries beyond the bridge wrapper contract.

## Why deferred
The user-approved Scope Contract excludes a full dual-system production/evaluation architecture rewrite. Keeping it out preserves the current workflow-sized contract and avoids changing orchestration semantics while the immediate bridge prompt-file contract is still missing.

## When to pick up
Pick this up after `codex/delegation.md` exists, parent docs route to it, and the bridge contract has passed evaluation. A future session should start with the shipped bridge contract as prior art and decide whether production and evaluation orchestration need a broader redesign.

## Suggested approach
Run a fresh Ideation Loop focused on full dual-system architecture. Start by reading `codex/delegation.md`, `orchestration/workflow/production.md`, `orchestration/workflow/evaluation.md`, generic `delegation/SKILL.md`, Gobbi dispatch owner `orchestration/delegation.md`, and the Codex bridge mistake records. Separate semantic orchestration from command-line wrapper mechanics so the new work does not duplicate the bridge child doc.

## Originating session
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/codex-2026-07-01-019f1f53-6ae2-7853-953e-4ee246cbef0b/.gobbi/projects/gobbi/sessions/2026-07-01-019f1f53-6ae2-7853-953e-4ee246cbef0b/`

## Related

No related memory links staged in this iteration.
