---
name: four-user-decisions
description: The 4 Sub-step D user-decision gates that resolved the Ideation design forks for the evaluation child-doc split
type: decisions
scope: feature
feature: evaluation-childdoc-split
status: accepted
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation, design]
keywords: [scope-co-touch, box-semantics, id-scheme, rollout-order]
author: claude
related: [evaluation-childdoc-split]
---

# The 4 locked user decisions — evaluation child-doc split

## Context

At Sub-step D (the design gate, after both the Claude leader and the Codex proposer independently generated iter1), four forks surfaced where the two systems converged strongly elsewhere but diverged on a design fork the leader could not resolve alone. Each was put to the user through the manager's user-decision primitive.

## Decision

1. **Scope co-touch surfaces — INCLUDE as required co-touches** (not deferred). Three surfaces are stale if untouched: `orchestration/workflow/evaluation.md` (incl. "exactly 8 files" → 9), `delegation/templates/evaluator.md` (loads the single `evaluation.md`), each loop `SKILL.md`'s EVALUATION section. Both systems flagged them; moved from Deferred → In-Scope.
2. **Point-2 checklist box semantics — box = "verified/covered"**, not "passed". `[x]` = verified; a FAIL is signaled by an inline `— FAIL: <finding pointer>` tag, box stays checked; per-perspective files stay authoritative for pass/fail.
3. **Trace mechanism — stable IDs + identical heading tree (merged-selective)**, with the user directive that IDs spell out the full words `SCENARIO` and `CHECK` (not a terse form like `-C1`).
4. **Rollout — prototype `execution` + Points 3/4 first (Wave 1); the other four loops Wave 2; the parent-contract flip lands atomic-last** (adopting the Codex-proposed atomic guard).

## Rationale

1. **Scope co-touch**: leaving these three stale would ship a split that immediately contradicts its own parent contract (the orchestration doc's file-count gate) and its own primary consumer (`evaluator.md`'s load line). Both independently-generated drafts flagged the same three surfaces — a corroborating signal, not a coincidence.
2. **Box semantics**: the Codex-proposed alternative (`[x]` = passed, leave FAILED items unchecked) conflates coverage with outcome — an unchecked box becomes ambiguous between "not covered" and "failed". The user chose per the original "verified items" wording; box measures coverage, the inline tag measures outcome, keeping the two orthogonal.
3. **ID scheme**: stable IDs solve real copy-robustness (Codex's insight — a relative link breaks once the checklist is copied into the session dir), and the identical heading tree gives the mechanical 1:1 alignment (the Claude leader's contribution). The user's full-word-over-terse directive follows Principle 7 — a citable ID a human parses at a glance without decoding an abbreviation.
4. **Rollout order**: the Claude leader's original design had a real defect — a prototype-first sequencing with no atomic guard would leave a mid-rollout state requiring 3 files from a loop that still only has 1, breaking every other evaluator at Stage 0. Codex's atomic parent-contract guard fixes this; the leader's prototype-execution-first ordering is kept underneath it.

## Alternatives considered

1. **Defer the 3 co-touch surfaces to a follow-up** — rejected: ships a split with an immediately stale parent contract and consumer, defeating the point of the "certified complete" design.
2. **Box = passed, unchecked on FAIL (Codex's original proposal)** — rejected: ambiguous unchecked-box semantics.
3. **Terse IDs (`-C1`) alone (Codex's original proposal)** — rejected on readability grounds by explicit user directive; kept Codex's copy-robustness insight, converted to full words.
4. **Prototype-first with no atomic guard (the Claude leader's original D5)** — rejected: a real correctness defect (mid-rollout breakage), not a style preference; Codex's atomic-last flip is strictly better.

## Consequences

- Every loop SKILL's `EVALUATION` section, `orchestration/workflow/evaluation.md`, and `delegation/templates/evaluator.md` are IN-SCOPE co-touches for Planning/Execution — not optional cleanup.
- Every filled `checklist.md` template and worked example must carry the legend + counts (decision 2) so a skim reader is not misled by an unchecked-vs-failed ambiguity.
- Every scenario/checklist ID in the codebase follows `{STEP}-{PERSPECTIVE}-SCENARIO-{NN}` / `-CHECK-{NN}` full-word form (decision 3) — Planning/Execution must not silently revert to a terse form for brevity.
- The parent-contract flip (`evaluation/SKILL.md` requiring 3 files, `:309`'s 8→9 gate) is a single atomic Execution task gated on all 5 bundles existing — Planning must sequence it last, not distribute it across the 5 per-loop tasks (decision 4).

## Related

- [[evaluation-childdoc-split]] (design) — the full design these 4 decisions shaped
- [[evaluation-childdoc-split]] (discussion) — the full discussion-log transcript these decisions are extracted from
