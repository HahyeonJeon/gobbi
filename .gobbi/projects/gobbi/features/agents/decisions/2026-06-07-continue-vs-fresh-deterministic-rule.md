---
name: continue-vs-fresh-deterministic-rule
description: Use a deterministic role x transition table (Option A) to decide whether to continue or fresh-spawn a subagent
type: decisions
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [agents, delegation, continuation, agent-teams]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Use a Deterministic Continue-vs-Fresh Rule (Option A) for Both Chains

## Context

gobbi's delegation contract asserts "Nothing is inherited" as an absolute rule. The user asked to redesign the subagent system so the manager can continue the same subagent across phases/steps instead of always spawning fresh. Three alternative approaches were considered: (A) a deterministic rule keyed on role × transition, (B) a manager-discretion model, and (C) a fresh-always-by-default with explicit continuation invocations.

## Decision

Use Option A: a deterministic rule keyed on **role × transition**. The rule is a table with six rows (leader in-loop / leader cross-loop / executor shared subsystem / executor disjoint/cap-reached / assistant / evaluator) and a deterministic continue-or-fresh decision for each, with the evaluator row FORBIDDEN.

The F1 operational predicate for the executor row:
- "Shared subsystem" = the next task's `files:`/feature scope OVERLAPS the current task's touched files, OR the two tasks are in the same feature directory.
- "Saturation cap" = continue at most 3 consecutive tasks, then force fresh. Break early if context budget is strained.

Cross-loop leader continuation (Ideation→Preparation→Planning) is best-effort — it works only while the team + session stay live; it degrades to a fresh re-prime at the first `/compact`/`/clear`/resume.

## Rationale

A deterministic rule is the only approach that eliminates manager invention at dispatch time. Option B (manager discretion) produces variable behavior that is hard to reason about and harder to test. Option C (fresh-always by default) does not address the cost motivation. Option A makes the rule falsifiable: the manager can grep `delegation/SKILL.md` and know immediately whether to continue or fresh-spawn without consulting design docs.

The F1 predicate was made fully operational after iter1 identified the original draft's "shared subsystem" as a label rather than an actionable check.

## Alternatives considered

- **Option B (manager discretion):** rejected — adds judgment overhead at dispatch time; produces variable behavior.
- **Option C (fresh-always by default):** rejected — does not address the redundant re-read cost motivation.
- **Continue-all for the leader chain across all loops:** rejected — teammates do not survive compaction/resume (Agent Teams confirmed); a "single persistent leader across all loops" over-promises what the platform supports.

## Consequences

- `delegation/SKILL.md` must carry the decision table with all six rows, with the evaluator row marked FORBIDDEN.
- The F1 predicate must be stated in the executor row with both components (overlap-OR-same-feature-dir AND under-cap=3).
- The cross-loop leader row must state the best-effort / live-only qualification.
- Planning decomposes T1 first (blocks T3 choreography which cites D1).
