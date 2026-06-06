---
name: evaluator-topology-doc-reconcile
description: Reconcile the stale per-perspective evaluator topology in agents/evaluator.md + gobbi/SKILL.md + CLAUDE.md + AGENTS.md to the canonical dual-system topology (2 evaluators, one per system, each covering all 7 perspectives).
type: backlogs
scope: project
status: active
created: 2026-06-05
session: ca2231b3-9567-4cf9-b0d6-f9bd3e2e78ee
tags: [evaluation, agents, docs-sync, topology, contradiction]
priority: high
disposition: open
---

# Reconcile evaluator topology docs to the canonical dual-system model

Surfaced by the Codex merge re-eval during PR #291 (principles 14→8). Deferred to its
own PR (different concern/category from the principles sweep; needs its own dual-system eval).

## The contradiction

Two evaluator topologies coexist in the canonical docs:

- **Topology A — CANONICAL** (`skills/delegation/SKILL.md` rows + its explicit
  "Per-perspective evaluator spawning" anti-pattern; `skills/evaluation/SKILL.md`
  "every evaluation runs all seven perspectives + Overall — both systems use the same 7
  names"): **spawn exactly 2 evaluators in parallel, one per SYSTEM (Claude + Codex);
  each evaluator covers ALL 7 perspectives + Overall sequentially; per-system isolation is
  the anti-groupthink signal.** This is also what session ca2231b3 actually ran.
- **Topology B — STALE DRIFT** (must be reconciled to A):
  - `agents/evaluator.md` — built throughout around the per-perspective model: ":3 single
    perspective specified at delegation", ":12 a perspective (one of …) … manager spawns at
    least two perspectives", ":23 your perspective is single", ":45 do not load more than one
    perspective per evaluator instance", ":113 one perspective per agent. **Substantial
    rewrite** — the agent spec's core frame is the wrong model.
  - `skills/gobbi/SKILL.md:149` — "Spawned ≥ 2 in parallel with distinct perspectives."
  - `.claude/CLAUDE.md:27` — "The orchestrator selects 2-5 evaluator perspectives based on
    task type, with Project and Overall always included." (mirror)
  - `.codex/AGENTS.md:65` — "The orchestrator selects evaluator perspectives based on task
    type…" (mirror — co-update both).

## Scope of the fix

Rewrite the four docs above to Topology A. The `agents/evaluator.md` rewrite is the bulk —
reframe from "you are assigned one perspective" to "you (one system) cover all 7 perspectives
+ Overall sequentially; the other system's evaluator does the same independently." Preserve
the producer/evaluator separation language (already correct). Co-update the CLAUDE.md +
AGENTS.md mirror pair together (see mistake `iron-law-table-has-two-mirrors-claude-and-codex`).
After the rewrite, run a dual-system eval (this is exactly the kind of cross-doc contradiction
the dual system catches — Codex flagged it; Claude's merge eval missed it).

## Related minor deferred findings (same Codex re-eval; fold in or separate)

- `skills/orchestration/templates/state.template.json:6-10` — loop caps still 3/3/3/3/1 while
  PR #290 set settings/docs to maxIterations=5. This is a **#290 template gap** (pre-existing on
  develop), not an evaluator-topology issue — fix alongside or in a #290 follow-up.
- `skills/orchestration/auto-mode.md:259,275` — cross-reference "orchestration/SKILL.md line 405"
  is stale (file is ~389 lines post-#290; relevant text ~line 334). Fragile line-number ref;
  reword to a section anchor rather than a line number.
