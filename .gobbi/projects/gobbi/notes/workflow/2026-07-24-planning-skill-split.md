---
name: planning-skill-split
description: Split the gobbi planning skill into a workflow-agnostic generic SOP plus a folded Gobbi Planning-loop procedure; full workflow run, single-system from Planning iter 4, cold-load P10 PASS.
type: notes
scope: project
feature: null
status: active
created: 2026-07-24
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [refactor, docs-sync, process]
keywords: [planning-skill-split, generic-sop, local-procedure, cold-load-p10, single-system-eval]
author: claude
features_touched: [workflow]
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [guard-must-not-forbid-the-state-it-requires, enumerate-consumers-by-content-not-path, cold-load-probe-budget-token-ceilings-unsatisfiable]
---

# Planning-skill split — workflow-agnostic SOP + folded Gobbi loop procedure

## 1. Outcome + agreed scope

This session split the gobbi `planning` skill into two homes: a **workflow-agnostic generic planning
SOP** (`skills/planning/SKILL.md`) and the **Gobbi Planning-loop operational procedure**, folded into
`skills/orchestration/workflow/planning.md`. Feature = `workflow`. The agreed scope was exactly this
split plus its consumer migrations and the evaluation-bundle conformance — no broader `planning` redesign.
The generic SOP is empirically proven to work standalone for a fresh agent (cold-load P10 = COLD_LOAD_PASS).

The full workflow ran: Ideation (PASS iter3) → Preparation (PASS iter2) → Planning (PASS iter6, after a
FAIL at iter5 and a user-approved cap raise 5→6) → Execution (all 8 tasks PASS + a bounded F1/F2 fix) →
Wrap-up. Codex was **user-waived** partway through (Planning iter 4 onward), so Planning iters 5-6 and all
of Execution ran deliberate single-system Claude (`production_mode: single`, NOT degraded).

## 2. Completed / shipped work (commit + verification evidence)

Branch `claude-2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5`, base `68b1c66a` (= origin/develop at
branch time). 9 split commits, 23 files, +1553 / -999, in dependency order:

| Commit | Task | What shipped |
|---|---|---|
| `57f4b5d2` | 02 | authorize the narrow fold (`local-procedure` flag + guard check `#8`) |
| `8617415a` | 03 | fold the Gobbi Planning-loop procedure into `orchestration/workflow/planning.md` |
| `ac3da9e3` | 09 | migrate the complete 9-file consumer inventory to the WF doc (pre-strip) |
| `e5a6d05a` | 01 | rewrite `planning/SKILL.md` down to the generic SOP |
| `c06332eb` | 04 | move the 2 planning traps → `orchestration/mistakes.md` (byte-identical + D4-003 path fix) |
| `b711845e` | 05 | rewrite the eval bundle (`scenario`/`checklist`/`evaluation.md`) to conform to the SOPs |
| `bc6041eb` | 06 | own the `.gobbi`-SSOT sentence in `delegation.md`; repoint the codex-compat check |
| `a384d011` | 08 | name both the SOP + WF doc in the leader template example |
| `30f7bc39` | 05-fix | disposition the 9th coverage concern + split multi-clause checklist items (F1/F2) |

Verification evidence: every task PASSed its evaluation (task-*/evaluation/iter1/claude/; task 03 has a
manager-proxy 2-file overall+checklist, the rest full 9-file; task 08 has no per-perspective dir — its
acceptance is the empirical cold-load + deterministic gates). The **cold-load P10 re-run =
COLD_LOAD_PASS** (`4-execution/task-08-close-planning-split/coldload-rerun-result.md`,
`coldload-claude-rerun.json`): a fresh agent given ONLY `planning/SKILL.md` produced a complete plan from
the SOP's Procedure alone. Repo-wide guards green across the split
(`check-workflow-pointer-drift.sh --self-test` 18/18 + live; `check-markdown-links.sh`;
`check-residual-vocab.sh`; `check-skill-mistakes.sh --all`).

## 3. Single-system evaluation result + finding dispositions + the Codex waiver

**Evaluation ran single-system (Claude only)** from Planning iter 4 onward, under the user's explicit
Codex waiver (`3-planning/working/gate-decisions-iter4.md`), triggered when a Claude-side classifier
outage coincided with a completed Codex iter-4 result. Per
`mistakes/verification/single-evaluator-pass-is-provisional.md`, every PASS from that point is provisional
— but each was backed by tool-verified evidence (byte diffs, guard exit codes, inode/readlink mirror
topology, the exact `verifies:` blocks re-run). This waiver is a deliberate `production_mode: single`, NOT
a degraded dual run — no degraded-mode label applies.

Approved finding dispositions (all non-gating; no Critical, no High):
- **task-04 F-CONS-01** (Low, docs-sync) — `orchestration/mistakes.md` description/H1 left narrow →
  ACCEPTED, deferred to backlog `orchestration-mistakes-description-generalize`.
- **task-05 F1 + F2** (Medium) — 9th Coverage-Ownership-Matrix concern un-dispositioned + checklist
  atomicity → ADDRESSED by fix commit `30f7bc39`.
- **task-05 F3 + F4** (Low) — `source:` trace paraphrase + weak SOP-PERF scenario coverage → deferred
  (checklist `planning-bundle-source-trace-paraphrase`).
- **task-06 AESTH-OBS-1** (Conf 25) — mild delegation.md sentence repetition → rejected FP, do-not-action.
- **task-08 cold-load probe** — unsatisfiable ceilings → mistake promoted + backlog for the probe pattern.

**Wrap-up EVALUATION (iter1, single-system Claude).** REVISE on **F-CONS-01 (High)** — the 8 promoted
`discussions/process/` files were written bare-slug, violating `memory/rules.md` §1.2 (`discussions` are
date-prefixed) and diverging from all 34 pre-existing discussion files tree-wide. Fixed in-tree: the 8 files were renamed to
their `created:`-dated form (`2026-07-2X-…`; `name:` slugs and every inbound `[[wikilink]]` unchanged).
Two rider defects were corrected in the same pass — §2 diff-stat `+1533`→`+1553` (git-verified) and the §8
stale `gate-decisions-iter1.md` claim. The **root cause** — `wrap-up/SKILL.md` classifies
`discussions`/`changelogs` as bare-slug (contradicting §1.2) and `validate-frontmatter.sh` never requires
the prefix — was user-approved for backlog (`wrapup-discussion-date-prefix-nonconformance`), as was the Low
§1.3 re-slug (F-AESTH-01). The corrected tree is the subject of the Wrap-up EVALUATION iter2.

## 4. Decisions to respect (do not silently re-litigate)

- **D2 = Option D (narrow fold).** The Gobbi Planning-loop procedure is a manifest-authorized
  `local-procedure` in `orchestration/workflow/planning.md`; general planning craft stays sole-owned by
  the generic SOP, reached by ONE typed pointer. Enforced by `check-workflow-pointer-drift.sh`
  invariant-(iii)/`#8`. (`rules/docs/point-dont-restate-workflow-docs.md`.)
- **gate-#4 amendment** — task 06's `verifies:` gate #4 was narrowed to grep the SOP only (dropping the
  WF-doc arm); the SSOT phrase legitimately lives at WF-doc:261 by task 03's fold. User-approved,
  eval-confirmed sound. (`4-execution/task-06-repoint-codex-compat-owner/gate-decision.md`.)
- **Planning iteration cap raised 5→6** by the user after the iter-5 FAIL, enabling the terminal
  enumerated-checklist guard model.
- **Pre-PR fix-vs-backlog** — fix task-05 F1/F2 in place (`30f7bc39`), backlog the rest;
  a deliberate deviation from the usual re-eval-to-dual-PASS preference, justified because Codex was
  waived and the findings were non-gating.

## 5. Durable memory promoted this session

66 staging files promoted (65 in the frozen iter1 manifest `5-wrap-up/working/promotion-manifest.md`
plus 1 root-cause backlog added at the Wrap-up EVALUATION iter1 fix — see §3 / §7):

- **16 project mistakes** — `mistakes/verification/` (13: claimed-count, evaluator-todo, token-count,
  write-early, gate-decisions-citable, dual-value, freeze-requires-process-exit, guard-must-not-forbid,
  repeated-revise, terminator-not-in-skeleton, valid-file-wrong-content, parallel-record-clobber,
  cold-load-probe), `mistakes/docs-sync/` (1: memory-baseline-check-keys-stale), `mistakes/codex/` (1:
  codex-bridge-model-at-capacity), `mistakes/refactor/` (1: enumerate-consumers-by-content-not-path).
  These are the session's highest-value output.
- **12 references** → `features/workflow/references/memory/` (planning prior-art: WBS, critical path,
  HTN, rolling-wave, INVEST, reference-class forecasting, etc.).
- **14 checklists** → `features/workflow/checklists/{process,workflow}/`.
- **3 scenarios** → `features/workflow/scenarios/{evaluation,workflow,process}/`.
- **5 feature decisions** → `features/workflow/decisions/workflow/` (cons/perf/proj/usage/struct-6-001).
- **8 discussions** → `features/workflow/discussions/process/` (the per-task Codex-waiver records).
- **8 backlogs** → `features/workflow/backlogs/process/` (1) + `backlogs/process/` (7, incl. the
  F-CONS-01 root-cause `wrapup-discussion-date-prefix-nonconformance`).
- **1 journal entry** → `notes/workflow/2026-07-24-planning-skill-split.md` (this note).

## 6. Pre-finalization Git state + authorized finalization plan

- The 9 split commits are on the session branch and are **NOT pushed**. The Wrap-up memory-promotion
  writes (all files in section 5) are **uncommitted worktree changes** left for the manager to review and
  commit — the assistant did NOT commit or finalize.
- `origin/develop` has advanced **7 commits ahead** of the branch base `68b1c66a` since branch time.
- Authorized finalization (manager, Stage 5, after the Wrap-up evaluation gate PASSes): commit the
  promotion writes with the `AI-Provenance-Record:` trailer, push the branch, open a PR against
  `develop`. **A rebase onto current `origin/develop` may be needed** given the 7-commit divergence —
  check for conflicts before/after push.

## 7. Deferred / backlogged items (with reasons)

- `orchestration-mistakes-description-generalize` (project, Low) — broaden `orchestration/mistakes.md`
  H1/description beyond "delegation dispatch"; deferred because task 04's scope was "change ONLY the
  D4-003 path."
- `check-eval-childdocs-selftest-fixture-drift` (project, Low) — `check-eval-childdocs.sh --self-test`
  1/10 fixture drift on `skill-writing/SKILL.md`; **pre-existing** (zero commits this branch), out of
  every task's scope.
- `coldload-probe-params-empirically-calibrated` (project, Low) — harden the reusable cold-load/P10 probe
  pattern to calibrate ceilings from measured cost; the in-session need was met by the budget-raised re-run.
- `wrapup-discussion-date-prefix-nonconformance` (project, Low) — fix the F-CONS-01 root cause:
  `wrap-up/SKILL.md` mis-classifies `discussions`/`changelogs` as bare-slug (vs `memory/rules.md` §1.2),
  and `validate-frontmatter.sh` never enforces the date prefix; also folds in the Low §1.3 re-slug of the
  8 `task-0N` discussion names (F-AESTH-01). Deferred per the user's minimal-output-fix scope for this PR.
- Also carried forward: `split-remaining-loop-skills`, `all-loops-eval-bundle-rehome`,
  `fix-backlog-anchor-refresh` (Ideation-staged), and `perspective-table-check-planning-md-coverage`
  (task-02 coverage-boundary observation, routed to backlog on its own recommendation).

## 8. Known risks + accepted exceptions

- **Single-system evaluation is provisional.** Planning iters 5-6 and all of Execution + this Wrap-up ran
  Claude-only under the explicit Codex waiver. Every PASS is provisional per
  `mistakes/verification/single-evaluator-pass-is-provisional.md`; the mitigation is that load-bearing
  claims were tool-verified, and re-running Codex on a specific commit is the recommended first step if a
  defect later surfaces.
- **The self-verification-gate defect class recurred.** Planning's guard mechanism self-contradicted
  (`guard-must-not-forbid-the-state-it-requires`), REVISE'd 4× on one axis
  (`repeated-revise-on-one-axis-means-wrong-scope-model`), and the cold-load probe was structurally
  unsatisfiable (`cold-load-probe-budget-token-ceilings-unsatisfiable`) — all "self-verification
  machinery miscalibrated against reality, caught only by running it." The terminal fix was subtraction
  of machinery (an enumerated per-consumer checklist), not more tuning.

## 9. Next-session start point

The split is complete and durably recorded; the next session's start point is **manager Stage-5 git
finalization**: review + commit the section-5 promotion writes, push branch
`claude-2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5`, and open a PR against `develop` (rebase onto
current `origin/develop` first if the 7-commit divergence conflicts). After merge, the follow-up backlog
to pick up is `split-remaining-loop-skills` (apply the same generic-SOP + local-procedure split to the
ideation / preparation / execution / wrap-up loop skills), and the low-priority docs backlogs in §7.
