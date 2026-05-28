---
name: 2026-05-27-dev-doc-standard-conformance-wave
description: Per-session journal — session b0a0eaf9 authored the §4 dev-doc-level writing standard for project-memory docs and shipped the CONFORMANCE wave (T0–T11) against all 7 capability features + project-tier. PROSE wave (P1–P7b + N1) deferred to next session.
type: notes
scope: project
feature: project-memory
status: active
created: 2026-05-27
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [project-memory, dev-doc-standard, conformance, wrap-up-journal]
supersedes: null
superseded_by: null
---

# Dev-doc standard + conformance wave — session journal

Session: `b0a0eaf9-03f7-4dce-a040-c7443653a459`
Branch: `chore/session-2026-05-25-a10c82d6`
Branch tip at close: `e9c4ea7`
PR: #272 (building on branch; defer merge)

---

## What happened

This session built on PR #272's branch to author a development-document-level writing standard for all gobbi project-memory docs and execute the CONFORMANCE wave against every live doc.

**Ideation (2 iters, PASS):** Leader investigated prior art (Diátaxis, ADR shape, docs-as-code linting, frontmatter-as-schema), inventoried the 222-doc population, and produced a concrete standard design (D1–D10 + FIX-1 predicate). Decisions locked: build on PR #272 branch and defer merge; conformance-first then prose; scope the S-set as type-aware strip (not blanket), preserve KEEP list. Iter2 remediation fixed the agents/ exclusion bug in the population predicate (208 → 222 correct baseline).

**Preparation (1 iter, PASS):** Leader verified scope readiness — confirmed rules.md as the standard's home (§4), verified the 63+5 leak count, confirmed no blocking dependencies. Five decisions staged.

**Planning (2 iters, PASS):** Leader decomposed 25 executable tasks covering the conformance wave + AGENTS.md reconciliation + grep gate. Iter1 REVISE caught the `underscore_staging_key` false-clean issue and the prose-task context-ceiling risk (deferred P1–P7b + N1 to next session). Iter2 PASS with the locked plan at `planning/artifacts/task-list.md`.

**Execution (T0–T11 + fix commits, all PASS):** Executors ran under the LEDGER model (manager decision under 25-task load). Key tasks:
- **T0** — Authored §4 dev-doc quality standard in `skills/memorization/rules.md` (§4.4 S-set + KEEP list, §4.5 grep gate). Dual-system eval 2 iters, PASS.
- **T1–T4** — Conformed 4 capability features (agents, evaluation, git-workflow discussions/decisions, git-workflow remaining). All dual-system PASS.
- **T5** — Conformed guardrails (REVISE on prose-wave-reshape scope-creep; corrected + PASS).
- **T6** — Conformed install-runtime discussions/design/decisions/changelogs (PASS).
- **T6b** — Title-sweep: concept-first headings in 18 conformed docs (PASS).
- **T7** — Conformed install-runtime checklists/scenarios/references/backlogs/README (1st iter false-PASS by Claude; Codex caught content-loss; remediated + PASS).
- **T7c** — S-set extension residue sweep: extended standard + stripped session-routing residue from 31 docs across all features.
- **T7d** — Residue completion: extended standard further + stripped 4 additional keys from 16 docs.
- **T8** — Conformed features/project-memory/ (PASS; restored KEEP keys over-stripped by prior pass in T8-fix commit).
- **T9a** — Conformed features/workflow/ (2 iters: iter2 restored KEEP keys + de-crypted positional titles).
- **T9b** — Conformed project-tier high-touch docs (2 iters: iter2 de-crypted 5 Item-N positional titles). **NOTE: T9b executor's commit (T9a iter2 fix) landed on develop via cwd-reset; manager reset develop + re-ran in worktree.**
- **T9c** — Conformed project-tier remainder (35 docs). **T9c commit initially went to develop via cwd-reset; caught by dual-eval; manager reset + re-ran in worktree.**
- **T10** — Reconciled AGENTS.md to 13 principles (added P13 row); fix commit cleaned residual '12 principles' reference.
- **T11** — Wired §4.5 grep gate full-tree (0 hits confirmed). S-set comment in rules.md now lists all 10 keys.

**Grep-gate result at tip (e9c4ea7):** 0 S-set residue hits across full-tree `.gobbi/projects/gobbi/` (excluding archive/).

---

## What shipped (commits T0–T11 + fixes)

| Commit | Task | Summary |
|---|---|---|
| be43c43 | T0 | Add §4 dev-doc quality standard to rules.md |
| a258f4b | T0 fix | Reconcile notes section-contract across standard/template/design |
| 8b11740 | T0 iter2 | Align D4 notes-contract to literal heading form |
| 68c9cfd | T1 | features/agents 14 docs into §4 conformance |
| 03cfbd3 | T2 | features/evaluation 15 docs into §4 conformance |
| 2d01316 | T3 | features/git-workflow discussions/design/decisions 20 docs |
| 60cec24 | T3 fix | Repoint T3 related: to real cross-feature decision paths |
| 33340be | T4 | features/git-workflow remaining 21 docs |
| 8e6ae25 | T5 | features/guardrails (scope corrected from T5 REVISE) |
| 9f8562c | T6 | install-runtime discussions/design/decisions/changelogs |
| 6ba07a1 | T6b | Title-sweep: concept-first headings in 18 docs |
| 6f9dbf9 | T7 | install-runtime checklists/scenarios/references/backlogs/README |
| af06a1a | T7 fix | Restore lost provenance/keys in T7 install-runtime REVISE iter2 |
| 5630aa4 | T7c | Extend S-set + strip session-routing residue from 31 docs |
| 720ae9d | T7d | Extend S-set + strip 4 more keys from 16 docs |
| 54c0cde | T8 | features/project-memory/ into §4 conformance |
| dbe61c3 | T8 fix | Restore KEEP keys over-stripped by T8 in project/ |
| 1287e88 | T9a | features/workflow/ into §4 conformance |
| fc17c34 | T9a iter2 | Restore KEEP keys, de-crypt titles, codify KEEP list |
| 2e24dfe | T9b | 35 project-tier docs into §4 conformance |
| cedd0cd | T9b iter2 | De-crypt 5 Item-N positional-index titles |
| c001694 | T9c | Conform project-tier remainder (35 docs) |
| 0a8e5dd | T10 | Reconcile AGENTS.md to 13 principles |
| 3a79e8b | T10 fix | Clean residual '12 principles' ref in navigate-deeper table |
| e9c4ea7 | T11 | §4.5 comment lists all 10 S-set residue keys |

---

## What got stuck / incidents

1. **T7 Claude false-PASS** — Claude evaluator claimed deleted content "relocated to ## Source"; git showed it was deleted, no ## Source present. Codex caught it; manager git-verified. Remediated in iter2. Mistake: `evaluator-false-pass-without-diffing.md`.

2. **T9c wrong-branch commit** — Executor's `git commit` ran in main-tree cwd; committed T9c to `develop` instead of chore branch. Claude evaluator flagged wrong-branch lineage (FAIL). Manager reset develop + re-ran in worktree. Mistake: `executor-cwd-reset-commits-task-to-wrong-branch.md`.

3. **Subagent rawdata strays** — Multiple subagents (rawdata/eval writers) wrote session files to main-tree path via relative paths after cwd-reset. Manager consolidated strays into worktree. Mistake: `subagent-relative-path-write-strays-to-main-tree.md`.

4. **T5 prose-wave scope-creep** — T5 executor reshaped backlog body sections (§4.2 section contract). Evaluators caught; corrected to conformance-only scope. Mistake: `conformance-executor-pre-executed-prose-wave-reshape.md`.

---

## Decisions to respect in next session

1. **Branch**: Build on `chore/session-2026-05-25-a10c82d6` (PR #272 base). Do NOT merge to develop until prose wave is complete and user decides.
2. **Standard location**: `skills/memorization/rules.md` §4. This is the locked home — do not move or fragment.
3. **KEEP list**: §4.4 KEEP list is codified in rules.md and must be loaded before any future conformance pass to avoid over-stripping.
4. **S-set**: 10 keys defined in §4.4/§4.5. The grep gate (`grep -rn ...` across `.gobbi/projects/gobbi/`) must read 0 at any PASS checkpoint.
5. **PROSE wave is not started**: P1–P7b (per-type body-section reshaping) + N1 (notes-contract alignment) are the next session's first work. Locked plan: `features/project-memory/plans/2026-05-26-dev-doc-standard-retrofit.md`.
6. **Archive excluded**: The grep gate and all conformance passes exclude `archive/` paths. Archive docs are frozen artifacts — do not modify.

---

## Next session

Load `features/project-memory/plans/2026-05-26-dev-doc-standard-retrofit.md` for the P1–P7b + N1 task list. The prose wave conforms docs to the §4.2 per-type section contracts (body headings/structure) and applies dev-doc prose quality (§4.3) — it does NOT touch frontmatter (already conformed). Start at P1 (decisions prose).
