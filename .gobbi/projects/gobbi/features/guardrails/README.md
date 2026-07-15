---
name: README
description: The guardrails feature — how gobbi records, homes, and loads mistakes (the hybrid two-home model) and the conformance guards that protect memory.
type: features
scope: feature
feature: guardrails
status: active
created: 2026-06-27
session: 659a1b3f-0b70-419a-848b-a02db5dbbded
tags: []
keywords: [mistakes, hybrid, two-home, skill-surface, check-skill-mistakes, layer2-removal, guards]
author: claude
value_proposition: A mistake is recorded once, homed where it loads in context, and protected by a conformance guard — so a correction is never copied, never diverges, and never loads context-blind.
subsystems: [skills/mistake, skills/memory, skills/orchestration/scripts/check-skill-mistakes.sh, skills/wrap-up, skills/orchestration]
---

# Guardrails

## Overview

The `guardrails` feature owns how gobbi captures, homes, and loads mistakes — the highest-density knowledge in the system — plus the conformance guards that protect the memory store. Its defining decision is the hybrid two-home mistake model: a skill-owned trap lives co-located as a `## ` section in `skills/{skill}/mistakes.md` (loaded in that skill's context); a cross-cutting / no-owner trap stays in the project `mistakes/{area}/` memory tier (loaded at session start).

Reusable delegation semantics remain in `skills/delegation/SKILL.md`; Gobbi-specific mistake-companion dispatch is owned by `skills/orchestration/delegation.md`.

## Status

**Session `659a1b3f` (2026-06-27):** the hybrid two-home model shipped, replacing the old dual storage (project `mistakes/` + 9 Layer-2 copies bridged by `check-layer2-source.sh`). 14 commits, all standing guards green, dual-system Execution evaluation PASS. Shipped: the skill-surface `mistakes.md` template + the new `check-skill-mistakes.sh` conformance guard; skill-owned mistake homes for `codex`, `git`, `memory`, `skill-writing`, `wrap-up`, `planning`, `mistake`, `delegation`, `evaluation`, `preparation`; migration of the skill-owned subset; deletion of the 9 Layer-2 copies + `check-layer2-source.sh`; de-referencing `layer2-source` from `check-merge-ref-integrity.sh` + `check-residual-vocab.sh`; the Load-Directives companion-path wiring + mandatory git load; and the model-doc rewrites across `mistake/SKILL.md`, `wrap-up/SKILL.md`, `memory/rules.md`, `gobbi/SKILL.md`, the runtime `CLAUDE.md` / `AGENTS.md` mirrors, and the skill docs.

Deferred: per-lesson mistake → rule graduation; the `check-residual-vocab.sh` skill-memory allowlist hardening (backlog); the 20 pre-existing markdown-link breaks (backlog).

## Subdirectories

- `references/` — 5 external-insight references anchoring the model (ADR hybrid, docs-as-code, nearest-file-wins, Agent Skills progressive disclosure, ESLint local-vs-shared)
- `design/` — 1 design doc: the hybrid two-home mistake model (the model + the 4 design questions + rules R1/R2/R3)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-27 | 659a1b3f-0b70-419a-848b-a02db5dbbded | Hybrid two-home mistake model shipped — 14 commits, guards green, dual-system PASS; design + 5 references promoted; feature dir bootstrapped |

## Open items

- `backlogs/tooling/harden-skill-memory-residual-vocab-allowlist.md` — harden the `check-residual-vocab.sh` whole-file allowlist for `skills/memory/mistakes.md` to a file+line allowlist
- `backlogs/memory/preexisting-broken-markdown-links.md` — 20 pre-existing broken markdown links across the tree (none introduced by this feature)

## Related

- [[hybrid-two-home-mistake-model]] — the feature's core design doc
