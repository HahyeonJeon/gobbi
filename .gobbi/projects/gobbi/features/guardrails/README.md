---
name: README
description: Current mistake routing, user-gated finding dispositions, and owner-scoped conformance validators.
type: features
scope: feature
feature: guardrails
status: active
created: 2026-06-27
session: 659a1b3f-0b70-419a-848b-a02db5dbbded
tags: []
keywords: [mistakes, hybrid, two-home, skill-surface, validate-skill-mistakes, layer2-removal, guards]
author: claude
value_proposition: Reusable corrections stay single-owned, findings require user disposition, and surviving validators fail closed at their boundaries.
subsystems: [skills/mistake, skills/memory, skills/mistake/scripts/validate-skill-mistakes.sh, skills/wrap-up, skills/orchestration]
---

# Guardrails

## Overview

The `guardrails` feature owns how gobbi captures, homes, and loads mistakes — the highest-density knowledge in the system — plus the conformance guards that protect the memory store. Its defining decision is the hybrid two-home mistake model: a skill-owned trap lives co-located as a `## ` section in `skills/{skill}/mistakes.md` (loaded in that skill's context); a cross-cutting / no-owner trap stays in the project `mistakes/{area}/` memory tier (loaded at session start).

Reusable delegation semantics remain in `skills/delegation/SKILL.md`; Gobbi-specific assignment and mistake-companion dispatch is owned by `skills/orchestration/delegation.md`.

## Current contract (2026-07-20)

- The five-role roster remains manager, leader, executor, evaluator, and assistant. One shared delegation skeleton replaces role-specific templates. Protected role documents are an explicit compatibility exception and are not sources for redesigned workflow vocabulary.
- Claude Code may retain stable leader, executor, and assistant teammates while identity and dependency chains remain coherent. Evaluators are always fresh and outside the team. Native Codex uses native specialists.
- `state.json` version 3 records `activeDispatches`; a report, idle/addressability confirmation, and manager artifact reread are all required before reassignment. An idle notice or task-list status is never completion proof.
- Every WORK package has two frozen independent drafts, two reciprocal reviews, a synthesis, and resolved open decisions. Every EVALUATION has one complete report per system. The user approves one batch of finding dispositions before revision.
- Missing-system continuation requires an explicit waiver naming the system, step, and iteration. Cost and token use never justify reduced dual-system rigor.
- Mistake candidates enter typed staging through RECORD and are promoted at Wrap-up to one authorized home. The Memory frontmatter validator and Mistake skill-surface validator are distinct commands in the ten-command set.
- Gobbi has no quality hooks, hook registrations, residual-vocabulary script, merge-reference guard, transcript checks, or operational-telemetry guards.

## Historical status

The dated account below preserves how the hybrid model was introduced. References to retired guards or the former Preparation skill are historical only.

**Session `659a1b3f` (2026-06-27):** the hybrid two-home model shipped, replacing the old dual storage (project `mistakes/` + 9 Layer-2 copies bridged by `check-layer2-source.sh`). 14 commits, all standing guards green, dual-system Execution evaluation PASS. Shipped: the skill-surface `mistakes.md` template + the now Mistake-owned `validate-skill-mistakes.sh` conformance guard; skill-owned mistake homes for `codex`, `git`, `memory`, `skill-writing`, `wrap-up`, `planning`, `mistake`, `delegation`, `evaluation`, `preparation`; migration of the skill-owned subset; deletion of the 9 Layer-2 copies + `check-layer2-source.sh`; de-referencing `layer2-source` from `check-merge-ref-integrity.sh` + `check-residual-vocab.sh`; the Load-Directives companion-path wiring + mandatory git load; and the model-doc rewrites across `mistake/SKILL.md`, `wrap-up/SKILL.md`, `memory/rules.md`, `gobbi/SKILL.md`, the runtime `CLAUDE.md` / `AGENTS.md` mirrors, and the skill docs.

At the time, mistake-to-rule graduation, residual-guard hardening, and pre-existing link repair were deferred. The residual guard was later retired by the ten-command consolidation.

## Subdirectories

- `references/` — 5 external-insight references anchoring the model (ADR hybrid, docs-as-code, nearest-file-wins, Agent Skills progressive disclosure, ESLint local-vs-shared)
- `design/` — 1 design doc: the hybrid two-home mistake model (the model + the 4 design questions + rules R1/R2/R3)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-27 | 659a1b3f-0b70-419a-848b-a02db5dbbded | Hybrid two-home mistake model shipped — 14 commits, guards green, dual-system PASS; design + 5 references promoted; feature dir bootstrapped |

## Current open work

- Run the root scoped link validator, full Memory frontmatter validator, and Mistake skill-surface validator over the final tree.
- Complete fresh dual-system Execution evaluation and obtain the user's finding-disposition decision before any revision.

## Historical backlog references

These paths record older follow-up work. They are not current guardrail instructions.

- `archive/backlogs/tooling/2026-07-20-harden-skill-memory-residual-vocab-allowlist.md` — harden the `check-residual-vocab.sh` whole-file allowlist for `skills/memory/mistakes.md` to a file+line allowlist
- `archive/backlogs/memory/2026-07-20-preexisting-broken-markdown-links.md` — 20 pre-existing broken markdown links across the tree (none introduced by this feature)

## Related

- [[hybrid-two-home-mistake-model]] — the feature's core design doc
