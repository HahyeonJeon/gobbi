---
name: orchestration-metadata-rewrite-unassigned
description: D5 orchestration/SKILL.md Workflow Metadata rewrite was in the file map but not assigned to any in-scope task — addressed in iter2 by adding task 08b
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [docs-sync, planning, design-flaw]
decision_status: accepted
supersedes: null
superseded_by: null
---

# Route `orchestration/SKILL.md` D5 metadata rewrite to its own task

## Context

The planning file map listed `skills/orchestration/SKILL.md` for two distinct purposes: (a) the D4 transcript-inventory entry (on-disk inventory adds `transcripts/`) and (b) the D5 Workflow Metadata rewrite (drop manager-owned wording; state the hook-driven contract). Task 07 in iter1 was assigned to (a) only. The D5 rewrite was in the file map but had no matching task, verified by both evaluator systems:

- Claude CONS-1 (Consistency, High, Confidence 75): task 02 implements behavior the active agents decision rejects; the amendment (task 08) lands after the code. Root: no orchestration contract rewrite to state the authority rule.
- Claude RISK-1 (Risk, High, Confidence 75): dual-writer on `agents[].tokensUsed` with no last-writer-wins / authority rule.
- Codex PROJ-001 / STR-002 / CONS-002 (Project/Structure/Consistency, High, Confidence 100): `orchestration/SKILL.md` D5 metadata rewrite is listed in the file map but not assigned to any task 01–09.

## Decision

Iter2 adds task `08b-rewrite-orchestration-metadata-contract` (executor/opus) to close this gap. Task 08b explicitly rewrites the § Workflow Metadata section, drops the manager-owned wording, states the Authority rule (SessionEnd reconciles last), and documents the not-fired degraded path. Sequenced after task 07 (shared file, different sections).

## Rationale

A file-map entry without a corresponding task means the executor team never touches that section. The orchestration skill is the canonical behavioral contract for how agents record session metadata; leaving it contradicting the shipped code (hook-driven) and the active decision (manager-owned) is a docs-sync defect that degrades trust in the entire skill tree.

## Alternatives considered

- Fold the D5 rewrite into task 07: rejected — task 07 is a documentation task for the D4 transcript-capture doc, while 08b is a contract-rewrite for D5. Different intent, different executor context. Bundling them violates the one-task-one-concern principle and hides the D5 work behind the D4 task title.
- Defer to Wrap-up / Execution: rejected — the orchestration contract must be current before Execution begins; Execution executors load orchestration/SKILL.md as a required skill.

## Consequences

Task 08b is now in-scope (in-scope count 9 → 10). It carries `requires: [04-session-end-hook]` (the code it documents must exist) and is sequenced after task 07 (shared file, soft requires). The verify asserts the old manager-owned wording is gone AND the new hook-driven contract is present.

## Related

- `planning/evaluation/iter1/claude/overall.md` — CONS-1, RISK-1
- `planning/evaluation/iter1/codex/project.md` — PROJ-001
- `planning/evaluation/iter1/codex/structure.md` — STR-002
- `planning/evaluation/iter1/codex/consistency.md` — CONS-002
- `planning/artifacts/task-list.md` — task 08b definition
