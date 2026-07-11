---
name: eval-childdoc-split-shipped
description: The evaluation-childdoc-split feature shipped end-to-end this session — 10 tasks, atomic parent-contract flip, 14 mistakes promoted
type: notes
scope: project
feature: null
status: active
created: 2026-07-10
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation]
keywords: [evaluation-childdoc-split, scenario-md, checklist-md, atomic-flip, dual-system-production]
author: claude
features_touched: [evaluation-childdoc-split]
loops_completed: [ideation, planning, execution, wrap-up]
shipped: [evaluation-childdoc-split, eval-childdoc-scenario-authoring, eval-childdoc-checklist-authoring, eval-childdoc-split-scope-lock, eval-childdoc-cotouch-inventory, eval-childdoc-split-plan, four-user-decisions, guard-run-mode-not-separated, dual-system-plan-integration, completeness-model-is-a-build-time-gate, execution-bundle-source-before-trim, verifies-must-be-self-failing, cotouch-classifier-must-model-exclusion-flips, exit-in-command-substitution-fails-open, load-directive-path-must-exist-in-worktree-base, mechanical-boundary-guard-relocates-not-converges, over-scrub-drops-idea-level-seed-condition, merging-two-seed-bullets-narrows-broader-scope, usage-context-check-narrowed-to-inputs-only, split-added-content-must-match-skill-and-runtime-facts, atomic-flip-must-propagate-to-cotouch-prose-and-active-mistakes]
supersedes: null
superseded_by: null
---

# evaluation-childdoc-split shipped end-to-end

## What happened

This session ran the full 6-step workflow (Configuration → Ideation → Planning → Execution → Wrap-up; Preparation skipped by default under Chat mode) against one task: split each of the 5 workflow-loop skills' `evaluation.md` into three sibling files — `evaluation.md` (procedure), `scenario.md` (per-perspective Good/Bad/Adversarial framing), and `checklist.md` (`- [ ]` checks) — and make checklist coverage a real 9th output file per evaluation run.

Ideation took 6 iterations to lock: the first 3 REVISE rounds each found a different facet the hand-listed co-touch inventory (D5) had missed, until iter4 flipped the completeness gate's own direction from "sweep matches the hand-list" to "the hand-list must cover every genuine hit the sweep finds, fail-closed" — the same `guard-revises-twice-means-scope-model-wrong` pattern already in project memory, independently re-confirmed. Four user decisions locked the remaining forks: co-touch scope inclusion, checklist box semantics (verified/covered, not passed/failed), the stable full-word ID scheme, and the atomic-last rollout order.

Planning (2 iterations) decomposed the design into a 10-task guard-first-then-atomic-flip-last plan, with the Codex proposer's dual-system contribution selectively integrated (4 taken, 4 merged, 2 kept — see the `dual-system-plan-integration` decision). Codex's iter1 evaluation caught two structural defects in the canonical draft before any executor touched it: a source-before-trim ordering bug that would have destroyed the seed content two downstream tasks needed, and several `verifies:` gates that could never fail (`grep | wc -l`, `echo exit=$?`) despite looking like checks.

Execution shipped all 10 tasks in this same session, though the plan's own recommended cut line was tasks 01-05 (the rest deferred to "next session(s)"). Task 01 built `check-eval-childdocs.sh` — the two-mode completeness/inclusion gate — across 8 evaluation iterations, each round's dual-system evaluation catching a real defect: a classifier missing an exclusion-flip case, a `resolve_proj` subshell `exit` that made a fail-closed guard fail OPEN, and a markdown-boundary regex that relocated rather than converged for several rounds before a structural fix. Tasks 02-04 proved the `execution/` 3-file bundle (the labor-core scenario authoring, its sibling checklist, then the trim). Task 05 landed the prototype-safe shared docs. Tasks 06-09 repeated the bundle pattern for ideation, preparation, planning, and wrap-up — each of the four non-code bundle tasks had exactly one real seed-fidelity defect (an over-scrubbed idea-level condition, a merge that narrowed a broader seed bullet, a merge that dropped two of three context dimensions, three added claims that contradicted the evaluation SKILL/role-boundary/runtime facts) — Codex caught every one, the executor fixed it, and the dual-system pattern held for the entire arc. Task 10 landed the atomic parent-contract flip as a single commit — the 8→9 file-count mechanical gate, the Stage-0 hard-require, and every guard-certified Family-9 co-touch file across ~51 surfaces — gated solely by `--enforce-inclusion`. The flip's own dual-system iter2 evaluation still found two classes of survivor the structural guard could not see (stale seed-source attributions in active prose, and a stale forward-count in guard-excluded `mistakes.md` files) — a further instance of "a guard's green proves what it enforces, not the whole semantic change."

## What shipped

- Feature directory `features/evaluation-childdoc-split/` (created this session): 1 design, 1 scenario-authoring spec, 1 checklist-authoring spec, 1 discussion, 1 reference (the co-touch inventory), 1 plan, 3 decisions, 4 backlogs (3 closed, 1 open)
- 14 mistakes promoted to the project tier: `mistakes/verification/` (+8), `mistakes/refactor/` (+2), `mistakes/docs-sync/` (+4)
- 1 new project backlog: `backlogs/process/coding-skill-evaluation-childdoc-split.md` — the `coding` skill's still-monolithic `evaluation.md` is the one remaining un-migrated surface, out of this feature's locked scope
- Source: 24 commits on branch `claude-2026-07-07-39f3dfb0-49df-44d4-a6bd-d2e4743b36e3` (guard `48ff11a2`, atomic flip `503d69a6`, among others); the actual split content lives in the 5 loop skills' `scenario.md`/`checklist.md`/`evaluation.md` trees, not in this project's memory tree
- Memory promotion commit `75cc1181` (durable-memory write), fixed up for a stray `</content>` wrapper-tag leak and other Stage-3 findings in a follow-up commit on the same branch

## What got stuck

Nothing is in-flight-stuck within this feature's own scope. The Wrap-up promotion itself needed one REVISE round (Claude Stage-3 evaluation found a promotion-writer artifact — every promoted file carried a stray literal `</content>` closing tag with no matching opening tag, invisible below frontmatter — plus a missing session journal, a stale pre-Execution handoff, and a dangling reference to a retired memory slug that has since moved to a skill-owned `mistakes.md` section). All four were fixed in the same Wrap-up loop.

## What shifted

The Execution cut line shifted mid-session: Planning's own plan recommended stopping after task 05 (`execution-cut-line-06-to-10` backlog), but the executor continued through task 10 in the same session once tasks 01-05 evaluated cleanly — closing that backlog as shipped rather than deferred.

## Decisions to respect

- The 4 locked Ideation decisions (`four-user-decisions`): co-touch surfaces in-scope, checklist box = verified/covered not passed/failed, stable full-word IDs (`SCENARIO`/`CHECK`, never terse), atomic-last rollout.
- `dual-system-plan-integration`: the Planning canonical plan is a genuine selective integration of the Claude producer's and Codex proposer's independent plans — do not treat either input plan alone as authoritative going forward.
- The `coding` skill's `evaluation.md`/`review.md` were explicitly OUT of this feature's scope (a locked Scope Contract decision, not an oversight) — the follow-up is tracked, not silently expected to happen.
- `mistakes/verification/` is now at 34 files, over its `hardCap` of 15 — Stage-2c compaction was NOT run this session (dormant by `settings.compaction.enabled: false`); a future session should revisit consolidating this area.

## Next session

Open a PR from branch `claude-2026-07-07-39f3dfb0-49df-44d4-a6bd-d2e4743b36e3` once this Wrap-up's memory-validation gate passes and the manager runs git finalization. Pick up the `coding-skill-evaluation-childdoc-split` project backlog whenever a session is scoped around `coding`-skill maintenance. Confirm `backlogs/evaluation/illustrative-d5-omissions.md` (still open) against `check-eval-childdocs.sh`'s actual first-run classification of its 3 named smoke-test surfaces.

## Related

- [[evaluation-childdoc-split]] (design) — the design this session implemented end-to-end
- [[eval-childdoc-split-plan]] — the 10-task plan this session executed in full
- [[completeness-model-is-a-build-time-gate]] — the Ideation-loop mistake this session's core methodology generalizes
- [[atomic-flip-must-propagate-to-cotouch-prose-and-active-mistakes]] — the task-10 finding that closes out the session's dual-system-caught-defect arc
