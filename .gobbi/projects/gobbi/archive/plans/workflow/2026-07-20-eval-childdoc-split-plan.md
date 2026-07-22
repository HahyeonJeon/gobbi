---
name: eval-childdoc-split-plan
description: 10-task executor plan splitting each workflow loop's evaluation.md into evaluation.md + scenario.md + checklist.md, guard-first then atomic-flip-last
type: plans
scope: feature
feature: evaluation-childdoc-split
status: completed
created: 2026-07-08
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [planning]
keywords: [evaluation-childdoc-split, 3-file-bundle, atomic-flip, source-before-delete, check-eval-childdocs, wave-plan]
author: claude
task: "Split workflow evaluation.md into evaluation.md + scenario.md + checklist.md; update evaluation + skill-writing skills"
supersedes: null
superseded_by: null
task_count: 10
archived_at: 2026-07-20
archive_reason: completed
---

# Evaluation Child-Doc 3-Way Split — Planning Plan

Splits each of the 5 workflow loop skills' `evaluation.md` into `evaluation.md` (procedure) + `scenario.md` (good/bad/adversarial) + `checklist.md` (`- [ ]` checks), adds the evaluator copy-then-tick filled `checklist.md` as the 9th evaluation output, and wires `evaluation/SKILL.md` (Point 3) + `skill-writing/SKILL.md` (Point 4) + the full Family-9 co-touch set. This is the iter2 canonical plan (`production_mode: single` — a deliberate Claude-only focused revision of iter1's dual-system plan); dual EVALUATION ran on both iters and PASSed on iter2. All 10 tasks shipped in this session's Execution (the original cut line recommended stopping after task 05 — see [[execution-cut-line-06-to-10]] — but Execution continued through task 10 in the same session).

## Idea anchor

[`evaluation-childdoc-split`](../../design/evaluation/evaluation-childdoc-split.md) — the locked Ideation design this plan decomposes.

## Scope Contract reference

Locked Scope Contract verbatim in the design's `## Scope` section. In scope: the 5 workflow loop skills' evaluation child docs, the `check-eval-childdocs.sh` completeness gate, `evaluation/SKILL.md` Point 3, `skill-writing/SKILL.md` Point 4, the Family-9 co-touch set. **Out of scope (locked):** `coding/evaluation.md` / `coding/review.md`; splitting `orchestration/workflow/evaluation.md`; child-doc frontmatter normalization; recorded mistake docs (frozen — guard classifies them historical-leave); the 7-perspective vocabulary / finding schema / verdict thresholds / 2-agent topology; Family-8 finding-file counts stay 8.

## Path constants (used verbatim in every `verifies:` gate)

- `<WT>` = `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-07-07-39f3dfb0-49df-44d4-a6bd-d2e4743b36e3`
- `<PM>` = `<WT>/.gobbi/projects/gobbi` (the per-session worktree project dir — the ONLY write root; every write path MUST contain `worktrees/claude-2026-07-07-…/`; gobbi is self-referential — the same tracked path exists in the main tree, so a path omitting the worktree segment silently hits the main tree)

## Sub-tasks

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| 01 | Build `check-eval-childdocs.sh` — the shape-aware sweep + two-family CLASS predicate (Family-9/Family-8/verified-leave) in 4 invocation forms across 2 strictly-separated modes (`--self-test`/`--classify-only`/`--bundle {loop} --pre-flip` = classify-completeness; `--enforce-inclusion` = inclusion-enforcement) | — | `bash -n` syntax + `--self-test` smoke fixtures + `--classify-only` whole-tree classify, all self-failing | executor |
| 02 | Create `execution/scenario.md` from the CURRENT (un-trimmed) `execution/evaluation.md` seeds — 7 perspective scenario families, Good/Bad/Adversarial, stable IDs `EXE-{PERSP}-SCENARIO-{NN}`. The labor core — its own commit. | 01 | Per-perspective coverage gate (all 7 prefixes) + adversarial count-equality gate, both self-failing | executor |
| 03 | Create `execution/checklist.md` from the same seeds + `scenario.md`'s heading tree — `- [ ]` items with stable CHECK IDs, 1:1 heading alignment. Run mirror sync. | 02 | `diff` heading-tree alignment + sync + `readlink -e` on both mirrors, all self-failing | executor |
| 04 | Trim `execution/evaluation.md` to procedure-only NOW (seeds already consumed by 02+03) — remove seed sections, add Scenario-source/Checklist-source pointers, update Output count to 9 | 03 | Seed-section-removed grep (self-failing) + pointer-presence grep + `--bundle execution --pre-flip` | executor |
| 05 | Update `evaluation/SKILL.md` (Point 3, prototype-safe ADDITIVE: copy-then-tick + `## Stage 1 Additions` + Stage-2 compact CHECK-ID table + 3-file target model — NO hard fail-closed yet) + `skill-writing/SKILL.md` (Point 4, 3-file bundle standard) | 02, 03, 04 | copy-then-tick + Stage-1-Additions + bundle-standard greps + hard-require-leak negative-gate, all self-failing | executor |
| 06 | Split ideation's evaluation child doc — same 3-file bundle, INTERNAL order scenario → checklist → trim, IDs `IDEA-{PERSP}-SCENARIO-{NN}` | 05 | Same gate shape as 02-04 combined + `--bundle ideation --pre-flip` | executor |
| 07 | Split preparation's evaluation child doc — same shape, IDs `PREP-{PERSP}-SCENARIO-{NN}` | 06 | Same gate shape + `--bundle preparation --pre-flip` | executor |
| 08 | Split planning's evaluation child doc — same shape, IDs `PLAN-{PERSP}-SCENARIO-{NN}` | 07 | Same gate shape + `--bundle planning --pre-flip` | executor |
| 09 | Split wrap-up's evaluation child doc — same shape, IDs `WRAP-{PERSP}-SCENARIO-{NN}`; re-run `--classify-only` across the whole tree (all 5 bundles now exist) | 08 | Same gate shape + whole-tree `--classify-only` | executor + opus |
| 10 | Atomic parent flip — ONE atomic commit: parent-contract hard-require (Stage-0 fail-closed + Stage-1 seed-line repoint) + mechanical 8→9 (`orchestration/workflow/evaluation.md`, `codex/SKILL.md`) + every guard-certified Family-9 co-touch file. `--enforce-inclusion` is the single acceptance gate — never a partial flip. | 05, 06, 07, 08, 09 | `--classify-only` + `--enforce-inclusion` + mirror parity + codex-validation-flipped grep, all self-failing | executor + opus |

## Per-task detail

Full inputs/outputs/files/verifies for every task are the canonical source in this session's `3-planning/working/draft-iter2.md` (the `## Tasks` YAML block) — reproduced here per task for a self-contained reader.

### 01 — build-check-eval-childdocs-guard
- **Files:** `<PM>/skills/orchestration/scripts/check-eval-childdocs.sh` (create)
- **Inputs:** design section D6 (sweep families + gate); backlog `guard-run-mode-goal-state` (F1/F2 goal-states); backlog `illustrative-d5-omissions` (smoke fixtures)
- **Outputs:** `check-eval-childdocs.sh` with `--self-test` / `--classify-only` / `--bundle {loop} --pre-flip` / `--enforce-inclusion`
- **Verifies:** `bash -n` syntax check; `--self-test` (codex/SKILL.md:358/359 + loop-skill exit-checklist wording → verified-leave; skill-writing/SKILL.md:121 + wrap-up/evaluation.md:155 → not-applicable — a disagreement fails); `--classify-only` (every genuine hit classified + every verified-leave correctness-checked against the CURRENT tree)

### 02 — execution-scenario-create
- **Files:** `<PM>/skills/execution/scenario.md` (create)
- **Inputs:** `<PM>/skills/execution/evaluation.md` (the CURRENT un-trimmed seed source, read before task 04 trims it); design Scenarios-design
- **Outputs:** `execution/scenario.md`
- **Verifies:** per-perspective loop over PROJ/STRUCT/PERF/AESTH/USAGE/CONS/RISK asserting `### EXE-$P-SCENARIO-` exists (exit 1 on any miss); scenario-family-count == Adversarial-count (exit 1 on mismatch)

### 03 — execution-checklist-create
- **Files:** `<PM>/skills/execution/checklist.md` (create)
- **Inputs:** `<PM>/skills/execution/scenario.md` (heading tree to mirror); `<PM>/skills/execution/evaluation.md` (the still-un-trimmed bullet-check source)
- **Outputs:** `execution/checklist.md` + built mirrors
- **Verifies:** `diff` of the two files' `### ` heading trees (exit 1 on mismatch); `sync-plugin-package.sh` + `--check` (exit 1 on failure); `readlink -e` on both per-file symlinks (exit 1 if unresolved)

### 04 — execution-evaluation-procedure-only
- **Files:** `<PM>/skills/execution/evaluation.md` (modify)
- **Inputs:** `execution/scenario.md` + `execution/checklist.md` (proof the seeds were extracted before this trim); design D1/D2
- **Outputs:** `execution/evaluation.md` (procedure-only) + a coherent execution bundle
- **Verifies:** seed-section-removed grep (exit 1 if still present); Scenario-source/Checklist-source pointer-presence grep (exit 1 if either missing); `--bundle execution --pre-flip` (exit 1 on failure)

### 05 — shared-prototype-safe-docs
- **Files:** `<PM>/skills/evaluation/SKILL.md` (modify), `<PM>/skills/skill-writing/SKILL.md` (modify)
- **Inputs:** proven execution bundle shape; design sections D3/D4
- **Outputs:** `evaluation/SKILL.md` (copy-then-tick + Stage 1 Additions documented, prototype-safe) + `skill-writing/SKILL.md` (bundle standard)
- **Verifies:** copy-then-tick documented grep; `Stage 1 Additions` section-present grep; bundle-standard grep in skill-writing; NEGATIVE gate — a hard-require/fail-closed phrase present in `evaluation/SKILL.md` at this stage is a leak (exit 1); markdown-link guard baseline-diff on both files (no NEW broken links)

### 06-09 — the 4 Wave-2 bundles (ideation, preparation, planning, wrap-up)
- **Files (each):** `<PM>/skills/{loop}/scenario.md` (create), `<PM>/skills/{loop}/checklist.md` (create), `<PM>/skills/{loop}/evaluation.md` (modify)
- **Inputs (each):** `<PM>/skills/{loop}/evaluation.md` (current seed source, read before the trim step); proven execution bundle shape
- **Outputs (each):** the loop's 3-file bundle + mirrors
- **Verifies (each):** per-perspective coverage loop (7 prefixes) + adversarial count-equality + heading-tree `diff` + seed-removed grep + `sync-plugin-package.sh --check` + `--bundle {loop} --pre-flip`, all self-failing. Task 09 additionally re-runs whole-tree `--classify-only` and `readlink -e` across all 5 bundles.
- **INTERNAL order per bundle:** scenario → checklist → trim (source-before-delete — same invariant as 02→03→04).

### 10 — atomic-parent-flip
- **Files:** `evaluation/SKILL.md`, `orchestration/workflow/evaluation.md`, `codex/SKILL.md`, `orchestration/SKILL.md`, `record/record-map.md`, `memory/memory-map.md`, `orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md`, `{ideation,preparation,planning,execution,wrap-up}/SKILL.md`, `agents/evaluator.md`, `agents/evaluator.toml`, `delegation/templates/evaluator.md`, `gobbi/SKILL.md`, plus any additional Family-9 file the guard `--classify-only` emits within the allowed roots (all `modify`)
- **Inputs:** all 5 bundles (task 09); guard `--classify-only`-certified Family-9 list
- **Outputs:** merge-ready flipped tree — parent requires the bundle; all Family-9 surfaces contain `checklist.md`
- **Verifies:** `--classify-only` (a Family-9 hit outside `<PM>/skills/`, `<PM>/agents/`, `<PM>/skills/delegation/templates/` → STOP + NEEDS_CONTEXT); `--enforce-inclusion` (every Family-9 surface now contains `checklist.md`); mirror parity; codex-validation-flipped negative grep (the stale `| wc -l  # must be 8` string must be gone); markdown-link guard baseline-diff on every edited file
- **Sub-checklist (all land together, one commit):** (a) parent contract — `evaluation/SKILL.md` Stage-0 hard-require + fail-closed + Stage-1 seed-line repoint + Output-paths checklist.md row; (b) mechanical 8→9 — `orchestration/workflow/evaluation.md`:309 + the 8-file family + `codex/SKILL.md`:383/:387; (c) Family-9 co-touch — SSOT/catalog, workflow trees+prose, loop SKILLs, role/delegation/map surfaces. Family-8 finding-file counts (`orchestration/workflow/record.md:209` Σ×8) STAY 8; verified-leave surfaces are NOT edited.

## Dependency graph

```
01 (guard)
 └─ 02 (exec scenario) ─ 03 (exec checklist) ─ 04 (exec trim) ─┐
                                                                 ├─ 05 (shared prototype-safe docs)
                                                                 │    └─ 06 (ideation) ─ 07 (preparation) ─ 08 (planning) ─ 09 (wrap-up)
                                                                 │                                                              │
                                                                 └──────────────────────────────────────────────────────────────┴─ 10 (atomic flip, requires 05+06+07+08+09)
```

Lanes (documentation only — Execution runs the tasks sequentially):
- **Lane G (guard + shared contracts):** 01 → 05 → 10.
- **Lane X (execution prototype):** 02 → 03 → 04 — fully sequential (source-before-delete). Joins Lane G at 05.
- **Lane B (Wave-2 bundles):** 06 → 07 → 08 → 09 — file-disjoint per loop; each internally scenario → checklist → trim.

**Conflict flags:** `evaluation/SKILL.md` is touched twice (05 prototype-safe ADDITIVE, then 10 the hard-require flip) — 10 MUST run after 05, sequential, never concurrent; 05's verifies actively guards against a hard-require leak. Task 10 touches the 5 loop `SKILL.md` files — do NOT fold those edits into 06-09 (which touch the loop's `evaluation.md`/`scenario.md`/`checklist.md` only, disjoint by design). Task 10 may need a small guard patch (from 01) if `--classify-only` exposes a missing pattern family — that correction lands INSIDE task 10's commit, not as a separate task.

## Waves + cut line

| Wave | Tasks | Content |
|---|---|---|
| Wave 0 | 01 | The guard, built EARLY — its `--classify-only` output IS the certified Family-9 inventory used by task 10 |
| Wave 1 | 02-05 | Execution-loop 3-file bundle prototype (the labor core, 02) + trim (04) + shared prototype-safe docs (05) |
| Wave 2 | 06-09 | The other 4 loop bundles (ideation, preparation, planning, wrap-up), one atomic 3-file task per loop |
| Wave 3 | 10 | The atomic parent-contract flip — ONE commit, gated by `--enforce-inclusion`; MERGE ONLY AFTER this passes |

**Original recommended cut line for this session's Execution: tasks 01-05** (see [[execution-cut-line-06-to-10]] for the deferral note this plan originally carried). Execution in fact continued through all 10 tasks in the same session — the cut-line backlog entry was closed at this session's Wrap-up once tasks 06-10 shipped and evaluated cleanly.

## Key hazards

1. **Atomic-last / DO-NOT-MERGE (resolved).** The branch was INTENTIONALLY incoherent between task 04 (execution/evaluation.md trimmed) and task 10 (the flip repoints the Stage-1 seed-load to scenario.md) until task 10 landed. This window is now closed — task 10's `--enforce-inclusion` passed in this session.
2. **Self-referential-repo write discipline.** gobbi edits its own skill tree, so `.gobbi/projects/gobbi/skills/...` exists as separate inodes in both the main checkout and this session's worktree. Every write path MUST be resolved against the absolute worktree root (`<PM>`) and MUST literally contain `worktrees/claude-2026-07-07-…/` before the first write — see `skills/git/mistakes.md#executor-wrote-to-main-tree-not-worktree` (CRITICAL, required on every task).
3. **Mechanical gates flip-coupled.** `orchestration/workflow/evaluation.md:309` + `codex/SKILL.md:383` land WITH the parent flip (task 10) — a pre-flip 8-file evaluation would FAIL a gate already changed to 9. These landed together in task 10, per design.
4. **Guard mode timing.** `--enforce-inclusion` fails BY DESIGN before task 10 (no Family-9 surface updated yet) — it is task 10's acceptance gate only. `--classify-only` / `--bundle --pre-flip` are the standing checks re-run at 04/06-09/10.

## Verification strategy summary

Every task's `verifies:` block is self-failing (`|| exit 1`, `if …; then exit 1; fi`, `[ … ] || exit 1`, `diff … || exit 1`) — no bare `grep | wc -l`, no bare `echo exit=$?`, no "executor confirms" human-only gate. Tasks 02 and 06-09 carry a per-perspective coverage gate (all 7 perspective prefixes present) and an adversarial count-equality gate (scenario-family count == Adversarial-marker count). The whole plan's completion gate is task 10's `--enforce-inclusion`, which was guaranteed to fail before the flip and passed only after every Family-9 surface contains `checklist.md`.

## Open issues

- **COD-PLAN-CONS-LOW-01 (Low, non-blocking).** Some task `inputs:` for the labor-core handoff read `proven execution bundle shape` / `proven bundle shape` (tasks 05-09) instead of a literal upstream filename list. Left open by both evaluators as non-blocking.
- **Claude iter2 Low findings (non-blocking):** F-USE-1 (skill-owned mistake-citation address imprecision, pre-existing from the iter1 KEPT floor), F-STRUCT-1 (adversarial count-equality gate is aggregate not per-family — acceptable), F-AESTH-1 (link-guard stated as a method-comment). None gated PASS.

## Related

- [[dual-system-plan-integration]] — how the Planning iter1 Codex proposal was selectively integrated into this plan
- [[execution-bundle-source-before-trim]] — the mistake this plan's Wave-1/Wave-2 ordering invariant corrects
- [[verifies-must-be-self-failing]] — the mistake every task's `verifies:` block corrects
- [[execution-cut-line-06-to-10]] — the (now-closed) backlog entry recording the original Wave-2/Wave-3 deferral
