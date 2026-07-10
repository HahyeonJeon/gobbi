---
name: eval-childdoc-split-scope-lock
description: The Ideation discussion exchanges that framed and locked the evaluation child-doc split — scope, checklist location, ID scheme, box semantics, rollout order
type: discussions
scope: feature
feature: evaluation-childdoc-split
status: active
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation, ideation]
keywords: [chat-mode, scope-co-touch, box-semantics, id-scheme, rollout-order]
author: claude
outcome: 4 design forks resolved by user decision; scope, checklist location, and organization locked pre-WORK
---

# Ideation Discussion — evaluation-childdoc-split

## Context

Chat-mode session (user drives step by step; Preparation skipped by default). Before generation began, the manager and user framed the contract in two sub-steps: A/B (pre-WORK contract framing) and D (the post-generation design gate, after both the Claude leader and the Codex proposer independently produced iter1).

## Question

**Sub-step A/B** — before WORK started: what is the split's scope (which loop skills, which files stay out), where does the Point-2 filled checklist live, and how is `scenario.md` organized?

**Sub-step D** — after both drafts came in: four forks where the leader and proposer converged strongly elsewhere but diverged, needing a user call (see [[four-user-decisions]] for the full decision record):
1. Are the 3 discovered co-touch surfaces (`orchestration/workflow/evaluation.md`, `delegation/templates/evaluator.md`, each loop `SKILL.md`) in-scope or deferred?
2. Does the filled-checklist box mean "passed" or "verified/covered"?
3. What trace mechanism aligns `scenario.md` and `checklist.md`, and what ID form?
4. What order does the 5-loop rollout ship in?

## Options considered

**Sub-step A/B**:
- Scope: all 5 workflow loop skills vs. a subset vs. including `coding/evaluation.md`. → 5 workflow loop skills only; `coding/evaluation.md` and `orchestration/workflow/evaluation.md` (as a split target) OUT.
- Checklist location: one filled copy per iter per system vs. a single running file. → one filled `checklist.md` per iter per system at `evaluation/iter{n}/{system}/checklist.md`, alongside the 7 per-perspective files + `overall.md`.
- Scenario organization: by perspective vs. by scenario category. → by the 7 perspectives, aligned 1:1 with `checklist.md`.
- Rollout: manager-decided sequencing vs. leader-recommended. → proceed to WORK; let the leader recommend rollout (dual-system production).

**Sub-step D** (see [[four-user-decisions]] for full rationale per fork):
1. Co-touch surfaces: include vs. defer to a follow-up.
2. Box semantics: `[x]` = passed (Codex's original proposal, unchecked-on-fail) vs. `[x]` = verified/covered (inline `— FAIL:` tag on failure).
3. Trace mechanism: heading-tree only vs. stable IDs vs. both; ID form: terse (`-C1`) vs. full words (`SCENARIO`/`CHECK`).
4. Rollout order: prototype-first with no cross-loop guard vs. prototype-first with an atomic parent-contract flip gating the last step.

## User decision

**Sub-step A/B**: 5 workflow loop skills only; one filled `checklist.md` per iter per system; `scenario.md` organized by the 7 perspectives; proceed to WORK, leader recommends rollout.

**Sub-step D**: (1) INCLUDE the 3 co-touch surfaces as required — both systems independently flagged them, a corroborating signal. (2) Box = "verified/covered" — per the original "verified items" wording; `[x]` = verified, FAIL via inline tag, box stays checked. (3) Stable IDs + identical heading tree (merged-selective), with the directive that IDs spell out the FULL WORDS "SCENARIO" and "CHECK" — not terse `C1` — for readability (Principle 7). (4) Prototype `execution` + Points 3/4 first (Wave 1); the other four loops Wave 2; the parent-contract flip lands atomic-last (adopting Codex's atomic guard).

## Implication

These decisions locked the Scope Contract before dual-system generation proceeded (Sub-step A/B) and resolved every design fork the two independently-generated iter1 drafts could not converge on alone (Sub-step D). The scope co-touch decision (D-1) is what made `orchestration/workflow/evaluation.md`, `delegation/templates/evaluator.md`, and each loop `SKILL.md`'s EVALUATION section required Planning/Execution deliverables, not optional cleanup. The rollout decision (D-4) is what made the parent-contract flip a single atomic Execution task (task 10) gated on all 5 bundles existing, rather than distributed across the 5 per-loop tasks.

Deferred / backlog candidates surfaced but not decided this loop: the `check-eval-childdocs.sh` alignment guard itself (the design specified its contract; task 01 built it this session); generalizing the split to `coding/evaluation.md` (follow-up, OQ-6, still open as a project backlog); consolidating per-perspective results INTO the filled checklist (kept additive this arc, OQ-3 resolved by integration — see [[evaluation-childdoc-split]] design D2).

## Related

- [[four-user-decisions]] (decision) — the formal decision record for the 4 Sub-step D forks
- [[evaluation-childdoc-split]] (design) — the design these exchanges shaped
