---
name: evaluation-childdoc-split
description: Split each workflow loop skill's evaluation.md into 3 sibling child docs, certified complete by a class-predicate build-time gate
type: design
scope: feature
feature: evaluation-childdoc-split
status: active
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation, design]
keywords: [scenario-md, checklist-md, class-predicate, completeness-gate, three-way-split]
author: claude
related: [eval-childdoc-cotouch-inventory]
---

# Evaluation Child-Doc 3-Way Split

## Problem

Each of the 4 current workflow-loop skills (`ideation`, `planning`, `execution`, `wrap-up`) carries three sibling evaluation files for distinct reader jobs: the evaluation procedure, the per-perspective situation-discrimination, and per-check pass/fail bookkeeping. The filled checklist is a durable, citable 9th output file per run. The former Preparation bundle was retired in v0.5.3; readiness coverage now belongs to Planning's entry gate and Planning's evaluation bundle.

## Scope

**In-scope**: the 4 current loop skills' `evaluation.md` + `scenario.md` + `checklist.md` bundles; the Point-2 copy-then-tick 9th output (`evaluation/iter{n}/{system}/checklist.md`); `evaluation/SKILL.md` routing; `skill-writing/SKILL.md`'s 3-file bundle standard; every co-touch surface matching the eval-output-shape class predicate below.
**Out-of-scope**: `coding/evaluation.md` + `coding/review.md` (follow-up, OQ-6); `orchestration/workflow/evaluation.md` is updated in place, not split; child-doc frontmatter normalization; recorded mistake docs (frozen, supersede-only); the 7-perspective vocabulary, finding schema, verdict thresholds, 2-agent evaluation topology.

## Approach

### D1 — The split rule

- **Bold `### {ID} — {title}` scenario blocks** (Category / Situation / Good / Bad-failure / Adversarial / Checklist IDs) → `scenario.md`.
- **Bullet `- [ ] {CHECK-ID} — {condition}` check items** (no suffix — a plain condition, no restated scenario text) → `checklist.md`.
- **Procedure text, verifications, anti-patterns, `## Overall`** stay in `evaluation.md`.
- Each current loop `evaluation.md` has a 9th output-reminder line for the filled `checklist.md`, in addition to seven per-perspective files and one overall file.
- **Authoring reality**: not a mechanical relocation. Roughly 35 net-new authored BAD/Adversarial blocks are required under the no-filler bar (`evaluation/SKILL.md:252`) — the current files carry no adversarial framing per scenario.

### D2 — `evaluation.md` skeleton (post-split)

Intro → per-perspective **Lens** (a one-line pointer: "see `scenario.md`/`checklist.md`") → `Scenario source:` / `Checklist source:` pointer lines per perspective (reverse-trace) → verifications → anti-patterns → `## Overall` → `## Output reminder` (9 outputs, incl. the filled `checklist.md`).

### D3 — `scenario.md` design

Organized by the 7 perspectives, aligned 1:1 with `checklist.md` by identical heading tree.

**Scenario ID convention**: `{STEP}-{PERSPECTIVE}-SCENARIO-{NN}` — full words, not terse forms (e.g. `EXE-PROJ-SCENARIO-01`, not `EXECUTION-PROJECT-01` or `EXE-PROJ-01`). `STEP ∈ {IDEA, PLAN, EXE, WRAP}`; `PERSPECTIVE ∈ {PROJ, STRUCT, PERF, AESTH, USAGE, CONS, RISK}`.

**Family block shape**: `### {ID} — {title}` + `**Category:**` + `**Situation:**` + `**Good:**` + `**Bad / failure:**` + `**Adversarial:**` + `**Checklist IDs:**`. One family per distinct post-step contract — not multiple loosely-related scenarios per perspective.

**How GOOD-vs-BAD differs per step** (drives what "adversarial" means at each step):

| Step | Job | GOOD | BAD / adversarial |
|---|---|---|---|
| Ideation | Get the IDEA right | Root cause; sharp enumerated scope; research-backed | Symptom framing; adv: adjacent feature silently absorbs the idea |
| Planning | Prove READINESS, then DECOMPOSE | Every gate item evidenced; every task traces; every item covered; deps ordered | Upstream gap silently repaired; orphan task; adv: "while we're here" task |
| Execution | IMPLEMENT | Change-set matches task 1:1; `verifies:` run; scoped | Partial-complete; adv: tidy abstraction hides a cycle |
| Wrap-up | CONSOLIDATE | Every shipped artifact referenced; promotions valid; handoff matches `git log` | Phantom completion; adv: a promoted file makes old memory wrong and both stay active |

Full worked examples (execution + ideation, non-code and code) are at [`../../scenarios/evaluation/eval-childdoc-scenario-authoring.md`](../../scenarios/evaluation/eval-childdoc-scenario-authoring.md).

### D4 — `checklist.md` design

Every check is a `- [ ]` GFM item with a stable `{CHECK-ID}` — heading tree 1:1 with `scenario.md`. Items carry `{CHECK-ID} — {condition}` only; no per-item `Scenario:` / `Procedure:` restatement (that duplication was rejected — see the ID/aesthetics fix in `revision-notes-iter2.md`).

**Point 2 — copy-then-tick, box = VERIFIED (not pass/fail)**:
- **Stage 0**: COPY `checklist.md` to `evaluation/iter{n}/{system}/checklist.md` — a real 9th output file, not a post-hoc summary. Fail-closed: any of the 3 child docs missing at Stage 0 → Critical `general`/`unevaluable` finding.
- **Stage 1**: APPEND a `## Stage 1 Additions` section for evaluator-created checks (still emits `scenario_gap`/`checklist_gap` findings per the parent-skill rule).
- **Stage 2**: TICK `[x]` = verified/covered (NOT pass/fail — the box measures coverage, not outcome); a FAIL still ticks the box but carries an inline `— FAIL: <finding pointer>` tag; per-perspective files stay authoritative for pass/fail. `n/a:` for not-applicable items.
- **Legend + counts** — the filled checklist carries a legend (what `[x]`/`FAIL:`/`n/a:` mean) and a PASS/FAIL/N-A/coverage count line, so an unintuitive box semantic doesn't mislead a skim reader.
- **Completeness gate before DONE** — every source item accounted for; all 7 perspective headings present; validated before the evaluator reports DONE.
- **Per-perspective results stay a compact table** citing check IDs (not a restated full body) — the filled `checklist.md` is the coverage register; the per-perspective file does not duplicate it.

Full field-by-field design is at [`../../checklists/evaluation/eval-childdoc-checklist-authoring.md`](../../checklists/evaluation/eval-childdoc-checklist-authoring.md).

### The completeness MODEL — why hand-listing the co-touch set failed 3 times, and the fix

**Root cause (iter1→3 recurrence)**: the co-touch inventory (D5, the list of every file that goes stale unless repointed) was hand-written prose, and the gate that was supposed to certify it ran in the WRONG direction: `sweep ⊇ D5` — the sweep only had to match lines already IN the hand-written D5. A surface never entered into D5 was invisible to the gate by construction, so each REVISE round found a different facet the hand-list had missed (iter1: `agents/` + per-phase workflow docs entirely excluded; iter2: sub-lines within files already in D5; iter3: SSOT/map docs + a false internal §D/§H contradiction). Per the recorded pattern [[guard-revises-twice-means-scope-model-wrong]], three consecutive REVISEs patching the same facet meant the **model** was wrong, not the count.

**The fix (iter4, terminal)**: flip the gate's direction to **`D5 ⊇ genuine-hits`, fail-closed**. The sweep runs over the real tree; D5 must classify every genuine hit the sweep finds; any unclassified hit blocks the atomic rollout flip. D5 becomes the gate's **certified output**, not a hand-perfect prose artifact — the draft's D5 is explicitly illustrative until the build-time guard (`check-eval-childdocs.sh`, deferred, sequenced early) generates and certifies the real one.

**The two-family class predicate** (iter5, closed under sibling-identity — every structurally identical surface classifies the same way automatically, so it cannot be cherry-picked instance-by-instance the way the iter1-4 named-pair classification was):

- **Family-9** — a surface that AUTHORITATIVELY enumerates or validates the eval-output directory `evaluation/iter{n}/{system}/…` as a structure: a tree, a table row/cell, a path/file list, an exact-N dir count/validation (`ls .../{system}/ | wc -l # must be 8`), a fully-expanded per-file tree (an `overall.md` node inside an `evaluation/iter…` tree block), or a DONE-contract phrasing ("one file per perspective + `overall.md`"). → must include the filled `checklist.md` (8 → 9).
- **Family-8** — a finding-file COUNT: `orchestration/workflow/record.md:209`'s "Σ systems × 8" counts the finding-BEARING per-perspective files RECORD reads at Step-6 to enumerate findings. `checklist.md` is a coverage artifact RECORD does not read for findings, so it correctly stays out of this count and stays 8.
- **`verified-leave`** — a surface that names an eval path as a single representative token (e.g. `record/SKILL.md:167`'s quartet-slot illustration, which already elides `overall.md`), a naming-vocabulary rule (bare 7-perspective names + `overall.md`), a single-file existence check, or a verdict/topology count. Every `verified-leave` MUST carry a checkable reason — the gate spot-checks it, and a `verified-leave` on a surface that actually satisfies the Family-9 predicate FAILS the gate. This closes the gap the iter4 presence-only gate left: proving presence (every hit classified) is not the same as proving correctness (classified correctly). The historical pre-v0.5.3 `preparation.md` misclassification (iter4→5) is the concrete instance that established this check.

### The `D5 ⊇ genuine-hits` gate — the three checks

1. **Presence** — every genuine hit the sweep finds is classified somewhere in D5.
2. **Class-predicate classification** — Family-9 / Family-8, applied by the predicate, not by name — sibling-identity closure means an unclassified sibling of an already-classified surface is caught automatically.
3. **Correctness spot-check** — a `verified-leave` on a surface satisfying the Family-9 predicate FAILS; granularity is per `path:line`.

### The co-touch inventory + sweep pattern families

The full classified co-touch inventory (13 files, ~46 update sub-lines, organized into sections A–L by surface kind) is a reference: [`../../references/evaluation/eval-childdoc-cotouch-inventory.md`](../../references/evaluation/eval-childdoc-cotouch-inventory.md). The D6 sweep that certifies it is shape-aware, not wording-only, and covers these pattern families: output-SHAPE tokens (`{perspective}.md`, `overall.md`, "one (file )?per system", "per-perspective files"); N-file tokens ("8 (well-formed )?files", "exactly [a-z ]*8 files"); exact-N dir validation (`wc -l` / `must be [0-9]` in an `evaluation/iter` context); fully-expanded per-file trees (an `overall.md` node inside an `evaluation/iter…` tree block); DONE-contract phrasing ("one (output )?file per perspective" / "per perspective \+ overall"). Current scope: `skills/` + `agents/` + `delegation/` + the SSOT/map docs + the 4 productive-loop workflow eval-output trees.

### Rollout

The original rollout prototyped `execution/` first, then added the other pre-v0.5.3 bundles before the parent-contract flip. The current contract keeps the same fail-closed three-file requirement and Family-9 coverage across the four surviving productive-loop bundles. Preparation's retired bundle is not a required input.

## Scenarios

Cross-reference [`../../scenarios/evaluation/eval-childdoc-scenario-authoring.md`](../../scenarios/evaluation/eval-childdoc-scenario-authoring.md) for the full per-perspective Good/Bad/Adversarial enumeration and the two worked examples (execution + ideation).

## Validation

- **Completeness** — the `D5 ⊇ genuine-hits` gate, fail-closed, at build time (`check-eval-childdocs.sh`, built in task 01 of the Planning plan).
- **Correctness** — the gate's `verified-leave` spot-check.
- **Cross-doc integrity** — `scenario.md` ↔ `checklist.md` heading-tree + ID integrity; `sync-plugin-package.sh --check`; markdown-link guard on every D5 `update` file.

## Trade-offs

Optimizes for: a completeness proof that cannot silently miss a stale surface (the class-predicate gate generalizes over every structurally identical instance, so a new sibling surface is caught automatically rather than requiring a 7th hand-list patch). Costs: the guard must classify a non-trivial hit set (~40 `per-perspective files` matches measured across `skills/`) at build time — bounded (tens, not thousands) but not free; and hand-listing remains the interim completeness proxy until the guard ships, which is why the guard is sequenced early rather than left to the end of Planning/Execution.

## Open issues

- **OQ-6 (follow-up, backlog)** — generalize the split to `coding/evaluation.md`, which still uses the pre-split monolithic shape. See the project backlog entry raised at this session's Wrap-up.

## Related

- [[eval-childdoc-cotouch-inventory]] — the full classified co-touch inventory this design's D5 illustrates
- [[four-user-decisions]] — the 4 locked user-decision gates
- [[completeness-model-is-a-build-time-gate]] — the mistake this design's core fix generalizes
- [[eval-childdoc-split-plan]] — the 10-task Planning decomposition of this design
