---
name: eval-childdoc-cotouch-inventory
description: The classified co-touch inventory (D5) for the evaluation child-doc split — every surface that goes stale unless repointed, by class-predicate family
type: references
scope: feature
feature: evaluation-childdoc-split
status: active
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation]
keywords: [co-touch-inventory, family-9, family-8, verified-leave, sweep-pattern-families]
author: claude
title: Evaluation child-doc split — classified co-touch inventory (D5)
source: 1-ideation/working/draft-iter6.md
accessed: 2026-07-07
ref_type: docs
related: [evaluation-childdoc-split]
---

# Evaluation child-doc split — classified co-touch inventory (D5)

> **v0.5.3 lifecycle note:** the classified list below is the frozen five-loop rollout inventory.
> Preparation paths are historical evidence, not current targets. The live completeness proof is
> `check-eval-childdocs.sh`, applied to the four current bundles.

## Insight

The complete co-touch set is the CERTIFIED OUTPUT of the `D5 ⊇ genuine-hits` build-time gate applied with the two-family class predicate (Family-9 / Family-8 / `verified-leave`) — not a hand-perfect prose list. The table below is the Ideation draft's illustrative D5 as of iter6 (13 files, ~46 update sub-lines), the starting inventory Planning/Execution worked from; `check-eval-childdocs.sh` (built in task 01) is the actual completeness proof.

## Reason

Every future Planning/Execution task that repoints a stale surface, and every future extension of the eval-output-shape sweep, should start from this classified inventory rather than re-deriving it from scratch — and should treat any surface not yet in this list as a candidate the build-time gate must classify, not as proof the surface doesn't exist.

## The two-family class predicate

- **Family-9** — authoritatively enumerates/validates the eval-output dir `evaluation/iter{n}/{system}/…`: a tree, a table row/cell, a path/file list, an exact-N dir count/validation, a fully-expanded per-file tree, or a DONE-contract "one file per perspective + `overall.md`" phrasing. → must include the filled `checklist.md` (8 → 9). Closed under sibling-identity.
- **Family-8** — a finding-file COUNT (`orchestration/workflow/record.md:209`'s "Σ systems × 8"). Stays 8 — `checklist.md` is a coverage artifact RECORD does not read for findings.
- **`verified-leave`** — names an eval path as a single representative token / a naming-vocabulary rule / a single-file existence check / a verdict/topology count, with a checkable reason the gate spot-checks.

## Classified inventory (by section, as of iter6)

**A. Named skills**: `evaluation/SKILL.md` (full sub-line repoint incl. `:252`; new Output-paths `checklist.md` row above `:565`); `skill-writing/SKILL.md` (new P4 3-file bundle subsection + anti-pattern).

**B. `agents/`**: `evaluator.md:37/:43/:67` update; `:68` verified-leave (Stage-1 Frame object); `evaluator.toml:13` update.

**C. `delegation/`**: `templates/evaluator.md:67` update (load line → bundle); `:139` update (Family-9 DONE contract); `:94` update (DONE-phrasing analogue of `:139`, found iter6).

**D. loop `SKILL.md` (Family-9 → 9)**: emphasis pointers + proc-table output cell + Outputs bullet + Output-paths row per loop — `ideation:388/397/488` (+ `:374`/`:417` verified-leave), `preparation:328/335/425/338`, `planning:394/401/491/404`, `execution:180/187/275/167/190`, `wrap-up:463/483/575/448/486` — all update.

**E. `gobbi/SKILL.md`**: `:185`, `:215` update.

**F. `orchestration/workflow/` PROSE refs**: `evaluation.md:36/:47`, `execution.md:74/:137`, `planning.md:84`, `wrap-up.md:33/:35` update; `preparation.md` PROSE has no stale ref (its TREE is §K).

**G. The 8-file contract (`orchestration/workflow/evaluation.md`, Family-9 → 9)**: `:92/:95/:97/:101/:184/:189/:306` update; `:309` update (CRITICAL — the mechanical gate; enumerate `checklist.md`, "extra file = FAIL" accepts it). `:90` + `:304` update (found iter6 — the two fully-expanded `claude/` trees' `overall.md` nodes). `:291` update (found iter6 — the Output-paths TABLE `overall.md` row, sibling of the `:290` `{perspective}.md` row). `:151/:161` verified-leave (verdict count); `:103/:317` verified-leave (content-description / path-naming, not a file-set enumeration).

**H. `record` (two-family split)**: `orchestration/workflow/record.md:209` Family-8 verified-leave (Σ×8 finding-file count); `record/SKILL.md:167` verified-leave (representative quartet slot, not a dir enumeration; elides `overall.md`); `record/SKILL.md:162` + `:166` verified-leave (naming-vocabulary — bare 7-names + `overall.md`); `record/SKILL.md:209` verified-leave (unrelated `changing_rows`).

**I. historical-leave (frozen mistake docs — never edit, whole-file)**: `codex/mistakes.md` (incl. `:28/:31/:66/:84/:86`); `evaluation/mistakes.md` (incl. `:27/:28/:29`); `skill-writing/mistakes.md:37`.

**J. verified-leave — topology / verdict / naming-vocabulary**: `evaluation/SKILL.md:102/:156/:308/:311/:319`; `delegation/SKILL.md:60/:223/:328/:435`; `gobbi/SKILL.md:159`; `orchestration/SKILL.md:248` (naming-vocabulary, sibling of `record/SKILL.md:166`).

**K. SSOT / map / TREE surfaces (Family-9 → 9, verified on disk)**: `record/record-map.md:118` (SSOT slot, CRITICAL) + `:42` (tree); `orchestration/SKILL.md:199` (table) + `:239` (tree); `memory/memory-map.md:44,:45` (path catalog); the 5 per-loop eval-output trees `orchestration/workflow/{ideation:155, preparation:137, planning:131, execution:128, wrap-up:70}.md` — all update.

**L. `codex/SKILL.md` codex-eval VALIDATION block (found iter6 — Family-9 dir validation)**:

| path:line | what it is | action |
|---|---|---|
| `codex/SKILL.md:383` | `ls .../{system}/ \| wc -l  # must be 8` — counts the WHOLE eval dir | update (Family-9) → must count 9, or keep the 8 finding-bearing count + add an explicit `test -f .../checklist.md` |
| `codex/SKILL.md:387` | `grep -E "scenario_gap\|…" .../{system}/*.md \| wc -l` — the `*.md` glob now also matches `checklist.md` | update (found iter6) → exclude `checklist.md` from the finding-vocab `*.md` glob |
| `codex/SKILL.md:342/:343/:389/:390` | `test -f .../overall.md` + `grep VERDICT overall.md` — single-file existence/verdict checks | verified-leave — but the block also gained a `test -f .../checklist.md`, folded with the `:383` fix |

The whole `codex/SKILL.md` codex-eval validation block (`~:380-390`) was updated as one unit at task 10: count 9 (or 8 + `test -f checklist.md`), the `checklist.md` existence check added, `checklist.md` excluded from the finding-vocab glob.

## Sweep pattern families (what the build-time gate scans for)

Wording + links + output-SHAPE (`{perspective}\.md`, `overall\.md`, "one (file )?per system", "per-perspective files") + N-file (`8 (well-formed )?files`, "exactly [a-z ]*8 files") + (found iter6): (a) exact-N dir validation — `wc -l` / `must be [0-9]` in an `evaluation/iter` context; (b) fully-expanded per-file trees — an `overall.md` node inside an `evaluation/iter…` tree block; (c) DONE-contract phrasing — "one (output )?file per perspective" / "per perspective \+ overall". Scope: `skills/` + `agents/` + `delegation/` + the SSOT/map docs + the 5 workflow trees.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-07 | 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3 | Ideation iter1-6 — the co-touch set the completeness gate proves; Planning's starting inventory for task decomposition; Execution tasks 01-10 repointed every listed surface |

## Related

- [[evaluation-childdoc-split]] (design) — the design section (D5/D6) this reference extracts from
- [[completeness-model-is-a-build-time-gate]] — the mistake the gate-direction flip generalizes
- [[atomic-flip-must-propagate-to-cotouch-prose-and-active-mistakes]] — the task-10 finding that this hand-listed inventory (D5) is illustrative, not the guard's own certified output, and additional prose/mistakes.md surfaces still needed a separate sweep
