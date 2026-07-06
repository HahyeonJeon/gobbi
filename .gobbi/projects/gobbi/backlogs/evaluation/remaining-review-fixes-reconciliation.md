---
name: remaining-review-fixes-reconciliation
description: Deduped, de-stale-verified backbone of both adversarial-review corpora — the durable remaining-fixes work-list so future sessions don't re-reconcile.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-06
session: 1faa4e51-9395-4d58-87b8-e7f47f59f81b
tags: [evaluation, docs-sync, process]
keywords: [adversarial-review, reconciliation, de-stale, remaining-fixes, backbone]
author: claude
priority: high
project-scope: true
shipped_in: null
---

# Remaining Review Fixes — Reconciliation Backbone

## Status (2026-07-06)

**Option A (the 20 2026-07-01 doc rows) SHIPPED 2026-07-06 (session 1faa4e51);**
**REMAINING** = R12 (native-Codex load path), R19–R27 (tooling: schema/harness + Codex
smoke/compat scripts + GEN-D7-004 chat scaffold), and the entire 2026-06-29 G2/G3 corpus
(~150 findings, NOT finding-level de-staled). This artifact is the durable backbone so
future sessions don't re-reconcile the two corpora from scratch.

## Context

Read-only reconciliation of every REMAINING (still-open) adversarial-review finding across
gobbi's two review corpora plus the named deferred items, de-stale-verified against the live
worktree tree (branched from develop `@ ed3f5287`, identical to develop HEAD). The originating
research artifact FIXED nothing; its only write was itself. This backlog preserves that
analysis as the durable work-list.

- **Tree verified at:** `ed3f5287` (`#335` merged at the start of session 1faa4e51).
- **Canonical edit target for gobbi's own skills/agents:** `.gobbi/projects/gobbi/{skills,agents}/…`.
  The `.agents/skills/…` paths the findings cite are DIRECTORY SYMLINKS to that canonical tree,
  so an edit to canonical propagates to every mirror — no physical co-touch. Root-level surfaces
  (`AGENTS.md`, `.codex/AGENTS.md`, `scripts/`, `plugins/gobbi/`, `.claude/CLAUDE.md`) live at
  worktree root and are edited in place.

## When to pick up

Any time. The remaining set is multi-session:

- **Next tractable cut:** R12 (native-Codex load path, a runtime-parameterize design choice) +
  the tooling wave R19–R27 (new validators / corpus / Codex smoke+compat scripts + the
  `chat/tasks` scaffold drift-gate). These carry real shell-script and schema-authoring cost.
- **Larger effort:** the 2026-06-29 G2/G3 corpus (~150 findings) needs a finding-level de-stale
  pass FIRST (assessed here only at cluster granularity); the S5-staleness Criticals D1-001/002
  need a **design** session, not a fix session.

## Headline

| Bucket | Count | Status |
|---|---|---|
| 2026-07-01 corpus — total unique | 38 | 9 High / 26 Med / 3 Low |
| 2026-07-01 — **ALREADY-FIXED** (dropped, evidence below) | **10** | all 9 Highs + GEN-D3-005 |
| 2026-07-01 — **OPEN** (verified this pass) | **28** | 25 Med + 3 Low |
| 2026-07-01 — OPEN after in-corpus dedup (D1-004≡D5-002) | **27 rows** | |
| Isolated tracked items spanning corpora/backlogs — OPEN | **3** | D5-012, FLAG-2/claude-skill, D1-007 |
| Deferred future-feature (NOT current work) | 1 | RI-1 / native-codex-proposer-symmetry |
| Stale backlog — **ALREADY-FIXED**, closed 2026-07-06 | 1 | layer2-references-stale |
| 2026-06-29 corpus — total | ~162 | G1 shipped (~10 closed) via #329 |
| 2026-06-29 — remaining (G2+G3), **cluster-level only** (NOT finding-level de-staled) | ~150 | see § 6 + CONCERNS |

**Bottom line:** the freshest authoritative to-do (2026-07-01) had **27–30 discrete OPEN
rows**, almost all doc-only, high file-locality — Option A shipped the ~20 doc rows this session.
The older 2026-06-29 corpus adds **~150** findings organized only at cluster granularity (G2/G3),
NOT de-stale-verified finding-by-finding — a separate multi-session effort.

## 1. Method + de-stale evidence base

- Read both review masters, the 2026-07-01 evaluation, all 8 lane docs, the 5 per-dimension fix
  queues, the #332/#333/#334/#335 commit bodies + file lists, and the 6 named deferred/overlap
  backlogs.
- De-stale = grep/read the CURRENT canonical files for each finding's offending string, using the
  finding's own Verification command where given. A finding whose defect string is gone →
  ALREADY-FIXED (dropped, with evidence). A finding whose string is still present → OPEN (with
  current file:line).
- Mistakes applied: `finding-location-understates-blast-radius` (grep the exact phrase tree-wide,
  don't trust a finding's file list), `mirror-topology-needs-inode-not-md5` (mirror = symlink →
  one canonical edit), `gobbi-worktree-git-pathspec-omits-memory-tree-prefix` (pathspecs need the
  `.gobbi/projects/gobbi/` prefix).

### Two ID namespaces — do NOT conflate

- **2026-06-29** review IDs: `D1-001`, `D2-015`, `D7-R5`, … (no `GEN-` prefix).
- **2026-07-01** review IDs: `GEN-D1-001`, `GEN-D2-002`, … (`GEN-` prefix).

So `D1-002` (2026-06-29, an S5-staleness Critical) ≠ `GEN-D1-002` (2026-07-01, a routing High,
already fixed by #334). `GEN-D5-012` is the odd one out: it is a **2026-06-29** finding
(dimension D5) isolated into its own backlog because it is the ideation-side twin of the routing
issue `#334` fixed via `GEN-D1-002`.

## 2. ALREADY-FIXED — dropped from the work-list (2026-07-01)

All 9 Highs + one Medium. Evidence = the commit that fixed it + a confirming grep.

| Finding | Sev | Fixed by | Evidence (current tree) |
|---|---|---|---|
| GEN-D1-001 RE-IDEATE not representable | High | #332 `2dea661d` | RE-IDEATE excised as a verdict; re-Ideate is a Prep DISCUSSION decision. |
| GEN-D1-002 manager routing narrows Type=general | High | #334 `bb5fac20` | manager `workflow/evaluation.md` table → canonical pointer. |
| GEN-D1-003 Chat RECORD vs Wrap-up | High | #332 `2dea661d` | Chat RECORD runs base per-slice staging; Wrap-up inventory extended to `chat/tasks/*/staging/`. **Partial tail → GEN-D7-004** (scaffold/drift-gate), still OPEN. |
| GEN-D2-001 role prompts → absent rules dir | High | #333 `6a0d747c` | 5 role prompts carry the `NO_PROJECT_RULES` fallback. |
| GEN-D3-001 bootstrap bypasses mode doc | High | #334 `bb5fac20` | `gobbi/SKILL.md` Step 6 routes through orchestration/mode doc. |
| GEN-D3-002 specialist rows → manager docs | High | #334 `bb5fac20` | two-column split (Manager refs / Specialist loads). |
| GEN-D4-003 producer templates hard-code Claude | High | #335 `ed3f5287` | dual-production block runtime-guarded; 6 files fixed. Follow-up **CO-2**/**RI-1** deferred (§ 5). |
| GEN-D7-001 resume clobbers active state | High | #332 `2dea661d` | fresh-init split from resume-rehydration. |
| GEN-D7-002 Codex null transcript = false Critical | High | #332 `2dea661d` | RECORD Step 2 runtime-branches on `session.json.system`. |
| GEN-D3-005 project-rules empty-state contract | Med | #333 `6a0d747c` | `NO_PROJECT_RULES` central contract in `memory/rules.md § Empty-state`. |

**Also ALREADY-FIXED (stale backlog, closed 2026-07-06):**
`backlogs/process/layer2-references-stale-after-system-dropped.md` (the 2026-06-29 D1-001/002
witness). Verified: `grep -niE 'layer[- ]?2'` over `wrap-up/SKILL.md`, `mistake/SKILL.md`,
`.claude/CLAUDE.md` → **0 hits**. The Layer-2 purge already landed (memory redesign).

## 3. OPEN work-list — the deduped, verified table

Rows R1–R27 are the 2026-07-01 OPEN set; R28–R30 are the isolated tracked items. Every row was
grep-verified OPEN against `ed3f5287` unless noted "gap (by-construction)". `doc` = markdown-only;
`code` = shell script / JSON template / new tooling. Locations are canonical paths (drop the
`.gobbi/projects/gobbi/` prefix for brevity; `AGENTS.md` etc. are worktree-root).

> **NOTE (2026-07-06, session 1faa4e51):** Option A SHIPPED the doc rows **R1–R11, R13–R18,
> R28, R29, R30** (plus CO-2 and two approved extensions). Still OPEN after this session:
> **R12** (native-Codex load path) and the tooling rows **R19–R27**.

| Row | Source id(s) | Corpus | Sev | doc/code | Status | Affected files (current) | Deps | Size | One-line fix |
|---|---|---|---|---|---|---|---|---|---|
| R1 | GEN-D1-004 **+** GEN-D5-002 | 07-01 | Med | doc | SHIPPED | `skills/execution/SKILL.md`; `skills/record/SKILL.md`; `skills/orchestration/SKILL.md` | — | M | Unify Execution task identity: drop `{task-id}` / `workflow.execution.tasks[{task-id}]`, use `taskNo`+`slug` + `workflow.execution.integration.tasks[]`. |
| R2 | GEN-D5-001 | 07-01 | Med | doc | SHIPPED | `skills/orchestration/chat-mode.md`; `skills/orchestration/SKILL.md` | — | S | Replace pseudo-states `taskRecord: written` / `wrapUp.state` with canonical `workflow["wrap-up"]` + `taskRecord.{path,writtenAt}`. |
| R3 | GEN-D5-006 | 07-01 | Low | doc | SHIPPED | `skills/orchestration/chat-mode.md`; `skills/orchestration/SKILL.md` | R2 | S | Keep `task-record.md` (file) vs `taskRecord.{path,writtenAt}` (metadata); never a state label. |
| R4 | GEN-D7-005 | 07-01 | Med | doc | SHIPPED | `skills/orchestration/chat-mode.md`; `templates/state.template.json` | R2 | S | Renderer uses `InProgress` (canonical is `Active`) + `currentIndex` undefined — align renderer to schema (derive the active slice, no stored cursor). |
| R5 | GEN-D7-003 | 07-01 | Med | doc+code | SHIPPED | `skills/delegation/SKILL.md`; `skills/orchestration/SKILL.md`; `templates/session.template.json` | — | S | Extend `agents[]` status from `ok\|failed` to the 4-status dispatch enum. |
| R6 | GEN-D5-003 | 07-01 | Med | doc | SHIPPED | `skills/orchestration/SKILL.md`; `skills/record/SKILL.md` | — | S | `workflow.{step}.verdict` says lowercase `pass\|fail\|skipped`; make it `PASS\|REVISE\|FAIL` + skipped = `verdict: null`. |
| R7 | GEN-D5-004 | 07-01 | Med | doc | SHIPPED | `skills/record/SKILL.md` | — | S | RECORD Step 5 source cell "Rawdata draft" → `working/draft-iter{n}.md` (retired vocab). |
| R8 | GEN-D5-005 | 07-01 | Low | doc | SHIPPED | `skills/orchestration/workflow/production.md` (+ blast-radius twins in `delegation/SKILL.md` and a cost ref) | — | S | "two producers" / "Spawning the Producers" mislabels the Codex proposer; reserve `producer` for the integrator. |
| R9 | GEN-D2-003 | 07-01 | Med | doc | SHIPPED | `AGENTS.md`; `.codex/AGENTS.md`; `skills/delegation/SKILL.md`; `skills/gobbi/SKILL.md` | — | S | Evaluation-runs-where drift: replace the short sentence/taxonomy row with the canonical lifecycle rule. |
| R10 | GEN-D2-004 | 07-01 | Med | doc | SHIPPED | `skills/agents/{leader,executor,evaluator,assistant}.md`; `skills/delegation/SKILL.md` | — | S | Role prompts don't require `SKILLS LOADED`; add the wire-format requirement to each. |
| R11 | GEN-D2-005 | 07-01 | Low | doc | SHIPPED | `AGENTS.md`; `.codex/AGENTS.md` | — | S | Role table "Codex wrapper" column points at canonical `.gobbi/…/agents/*.toml`; should be `.codex/agents/*.toml`. |
| R12 | GEN-D2-002 (incl. folded GEN-D4-002) | 07-01 | Med | doc | **OPEN** | `skills/delegation/templates/{leader,executor,evaluator,assistant}.md`; `AGENTS.md`; `skills/codex/SKILL.md` | — | M | Native-Codex load directives hard-code canonical paths; parameterize skill-root by runtime (`.agents/skills/…` for Codex). |
| R13 | GEN-D3-003 | 07-01 | Med | doc | SHIPPED | `skills/orchestration/auto-mode.md`; `skills/orchestration/chat-mode.md`; `skills/orchestration/workflow/evaluation.md`; `skills/evaluation/SKILL.md` | — | S | EVALUATION rows only link the manager `workflow/evaluation.md`; name the exact phase child `evaluation.md` per row. |
| R14 | GEN-D3-004 | 07-01 | Med | doc | SHIPPED | `skills/memory/SKILL.md`; `skills/gobbi/SKILL.md`; phase docs | — | M | Memory read guidance fragmented; add a role×phase durable-memory read map. |
| R15 | GEN-D4-001 | 07-01 | Med | doc | SHIPPED | `skills/memory/templates/*.md` (all 16) | — | M | Replace copyable `author: claude` defaults with an auto-stamp note (16 templates). |
| R16 | GEN-D4-004 | 07-01 | Med | doc | SHIPPED | `skills/memory/templates/reviews.md` | — | S | Evaluator-driven review mini-template omits `Type/Domain/finding-id/…`; reference the full finding shape. |
| R17 | GEN-D8-001 | 07-01 | Med | doc | SHIPPED (body, not frontmatter) | `skills/memory/templates/references.md` | — | S | References template lacked provenance fields; added to BODY `## Source` (frontmatter is a closed allowlist — see sibling backlog `references-provenance-frontmatter-vs-body`). |
| R18 | GEN-D8-002 | 07-01 | Med | doc | SHIPPED | `skills/skill-writing/SKILL.md`; `plugins/gobbi/.codex-plugin/plugin.json` | — | S | skill-writing models only Claude invocation frontmatter; add a Codex `openai.yaml` invocation-policy subsection. |
| R19 | GEN-D4-005 | 07-01 | Med | code | **OPEN** | `skills/record/scripts/verify-record-map.sh`; no session/state/settings validator exists | — | M | Add a schema guard for session/state/settings root JSON (required keys / enums / lifecycle fields). |
| R20 | GEN-D8-004 | 07-01 | Med | code | **OPEN** | `plans/workflow/2026-07-01-…-charter.md` | — | S | Second-pass validation is prose-only; add structured `Second-pass:` finding-schema fields + a schema check. |
| R21 | GEN-D8-003 | 07-01 | Med | code | **OPEN** | `skills/evaluation/SKILL.md`; (no fixture/corpus exists) | — | L | Add a read-only review-regression corpus format (bad artifact + expected finding class + checker). |
| R22 | GEN-D6-001 | 07-01 | Med | code | **OPEN** | `scripts/check-codex-plugin-smoke.sh`; `plugins/gobbi/.codex-plugin/plugin.json` | — | S | Smoke samples 2 skills/1 hook; enumerate all 22 `SKILL.md` + every hook command target. |
| R23 | GEN-D6-002 | 07-01 | Med | code | **OPEN** | `scripts/check-codex-plugin-smoke.sh` | R22 | S | Smoke hard-fails on missing Claude manifest, warns on missing Codex components; invert. |
| R24 | GEN-D6-003 | 07-01 | Med | code | **OPEN** | `scripts/check-codex-compatibility.sh`; `.agents/plugins/marketplace.json` | — | S | Compat gate never validates the Codex marketplace file; add name/source.path/policy checks. |
| R25 | GEN-D6-004 | 07-01 | Med | doc | **OPEN** | `AGENTS.md`; `skills/codex/SKILL.md`; `scripts/check-codex-plugin-smoke.sh` | — | S | Trust prerequisite stated but no install/verify step; add trust step + distinguish "installed" vs "trusted". |
| R26 | GEN-D6-005 | 07-01 | Med | code | **OPEN** | `scripts/check-codex-compatibility.sh`; `plugins/gobbi/hooks/codex-hooks.json` | — | S | Hook smoke runs source files directly; exercise the real command strings + `PLUGIN_ROOT` expansion. |
| R27 | GEN-D7-004 | 07-01 | Med | code | **OPEN** | `skills/record/scripts/scaffold-session-dir.sh`; `skills/record/scripts/verify-record-map.sh`; `skills/record/record-map.md` | — | M | **Tail of GEN-D1-003.** Extend scaffold + drift-gate to materialize/validate the `chat/tasks/{NN}-{slug}/{N}-{loop}` subtree. Tracked: `backlogs/process/d7-004-*.md`. |
| R28 | GEN-D5-012 (2026-06-29 D5-012) | 06-29 | Low | doc | SHIPPED | `skills/ideation/SKILL.md` | — | S | 1-line twin of the routing fix `#334`: the `general`-finding narrowed-routing sibling copy. |
| R29 | FLAG-2 / 2026-06-29 D1-006 / `claude-skill-dangling-ref` **+** `claude-doc-authoring-standard` | 06-29 + backlogs | Low | doc | SHIPPED | `.claude/CLAUDE.md` + `skills/gobbi/SKILL.md` → new `skills/claude/SKILL.md` | — | S–M | Created `skills/claude/SKILL.md` (`.claude/` authoring standard, +mirror). **TWO backlog dupes → ONE row.** |
| R30 | 2026-06-29 D1-007 / `wrapup-workflow-doc-broken-delegation-link` | 06-29 + backlog | Low | doc | SHIPPED | `skills/orchestration/workflow/wrap-up.md` | — | S | Off-by-one relative link `../delegation/…` → `../../delegation/…`. |

**Verification confidence.** R1–R18, R22–R27, R28–R30 were grep-confirmed OPEN against the tree
this pass. R19–R21 are absence/"gap" findings (no validator / no schema field / no corpus) —
confirmed OPEN by construction. No 2026-07-01 Medium/Low was incidentally fixed by the High-fix
PRs (those PRs were tightly scoped to the 9 Highs).

## 4. Dedup + overlap callouts (explicit)

- **R1** collapses **GEN-D1-004 ≡ GEN-D5-002** — both the Execution task-identity drift. One surface, one fix.
- **GEN-D4-002 folded into GEN-D2-002 (R12)** at review time (rejected D4-002 as a duplicate). Not double-counted.
- **R29 collapses FOUR references to ONE missing file**: 2026-06-29 `D1-006`, `FLAG-2`,
  `backlogs/process/claude-skill-dangling-ref.md`, AND `backlogs/docs/claude-doc-authoring-standard.md`
  — all the absent `skills/claude/SKILL.md`. Close whichever backlog(s) the fix did not become.
- **R30 = 2026-06-29 D1-007 = `backlogs/process/wrapup-workflow-doc-broken-delegation-link.md`** — one line, one row.
- **R28 = 2026-06-29 D5-012** — isolated because `#334` fixed the manager-surface variant and left the ideation copy.
- **Stale, not open:** `layer2-references-stale-after-system-dropped` — ALREADY-FIXED, closed (§ 2).
- **Not review findings (noted for the manager):** `backlogs/docs/skill-writing-dead-mistake-links.md`
  (3 dead links — folds into a broken-link sweep) and `backlogs/docs/wire-review-doc-into-workflow.md`
  (a `coding` feature follow-up, NOT adversarial-review). `backlogs/codex/native-codex-proposer-symmetry.md`
  (RI-1) is a **deferred future feature** — see § 5.

## 5. Named deferred items — disposition

| Item | Where | Disposition |
|---|---|---|
| **GEN-D7-004** | `backlogs/process/d7-004-*.md` | OPEN → **R27**. Real tooling; tail of D1-003. Interim (manager-materialized dirs) is SAFE (no data loss), not urgent. |
| **GEN-D5-012** | `features/workflow/backlogs/process/d5-012-*.md` | SHIPPED this session → **R28**. |
| **FLAG-2** (claude skill) | `backlogs/process/claude-skill-dangling-ref.md` + `backlogs/docs/claude-doc-authoring-standard.md` | SHIPPED → **R29** (deduped). |
| **RI-1** (render-time producer-label gate) | `backlogs/codex/native-codex-proposer-symmetry.md` (status `deferred`) | **NOT current work.** A follow-up gate that only becomes load-bearing once the native-Codex dual-production feature is built. Correctly deferred. |
| **CO-2** ("Claude Code bridge" sense) | folded in the same backlog / #335 eval | Low cosmetic follow-up on the D4-003 fix terminology; rode along R8/producer-naming work. |

## 6. 2026-06-29 corpus — cluster-level accounting (NOT finding-level de-staled)

The 2026-06-29 corpus (~162 findings) was restructured into 3 themed clusters. **G1 shipped**
(`#329`); **G2 + G3 not started.** The finding→cluster (C2–C6) mapping lives on an UNMERGED
`…-fixplan` branch, so on develop only the 5 per-dimension fix queues carry these findings. Full
finding-level de-stale of ~150 findings is out of one research pass — the honest cluster view:

| Cluster | Theme | Source | 2026-06-29 queues | Status |
|---|---|---|---|---|
| G1 | deploy-hygiene (C1+C7) | #329 | closed ~10 findings | **SHIPPED** |
| G2 | doc-consistency (C2+C3+C6) | — | drawn from `fix-d2` (40), `fix-d3-d5` (29), `fix-d4` (46), `fix-d6` (2 left), `fix-d7-d1` (40) | **NOT started** |
| G3 | structural (C4+C5) | — | same queues, structural subset | **NOT started** |

Queue files (source of record): `backlogs/evaluation/fix-{d2,d3-d5,d4,d6,d7-d1}-review-findings.md`.
Priority head named by the queues: 2 Criticals (D1-001/002, the S5 memory-staleness re-sync — a
**design** session, not a spot-fix) + a High doc-sweep set.

**Cross-corpus relationship:** each 2026-07-01 lane deduped against the 2026-06-29 corpus and did
not re-file known findings, so the two corpora are **largely disjoint** — 2026-07-01 filed only
NEW variants on distinct surfaces. So G2/G3 is mostly ADDITIONAL work, not a duplicate of the
27 fresh rows. The only isolated 2026-06-29 items pulled into the fresh work-list were R28
(D5-012), R29 (D1-006), R30 (D1-007), plus the now-closed layer2 witness.

## 7. Clustering + ordering the OPEN work (shared-file locality)

Group by co-located files so edits to one file land in one task. Original proposal clusters
(T-labels proposal-only; Planning owns the real decomposition):

| Cluster | Rows | Primary files | doc/code | Notes |
|---|---|---|---|---|
| **TC-1 Chat-mode schema/naming** | R2, R3, R4 (+R5 partial) | `chat-mode.md`, `orchestration/SKILL.md`, `state/session.template.json` | doc(+code) | SHIPPED. |
| **TC-2 RECORD/workflow vocab drift** | R6, R7 (+R1) | `record/SKILL.md`, `orchestration/SKILL.md`, `execution/SKILL.md` | doc | SHIPPED. |
| **TC-3 Producer/proposer naming** | R8 (+CO-2) | `production.md` | doc | SHIPPED. |
| **TC-4 Bootstrap / role-prompt contracts** | R9, R10, R11 | `AGENTS.md`, `.codex/AGENTS.md`, `agents/*.md`, `delegation/SKILL.md` | doc | SHIPPED. |
| **TC-5 Native-Codex load path** | R12 | delegation templates, `AGENTS.md`, `codex/SKILL.md` | doc | **OPEN** — design choice (runtime-parameterize); keep separate. |
| **TC-6 Docs information architecture** | R13, R14 | `auto-mode.md`, `workflow/evaluation.md`, `memory/SKILL.md`, phase docs | doc | SHIPPED. |
| **TC-7 Memory templates** | R15, R16, R17 | `memory/templates/*.md` | doc | SHIPPED. |
| **TC-8 Schema/harness tooling** | R19, R20, R21 | new validators / corpus | code | **OPEN** — new scripts; own session. |
| **TC-9 Codex smoke/compat scripts** | R22, R23, R24, R25, R26 | `scripts/check-codex-*.sh`, manifests | code(+doc) | **OPEN** — all co-located in the 2 Codex scripts. One executor. |
| **TC-10 skill-writing Codex policy** | R18 | `skill-writing/SKILL.md` | doc | SHIPPED. |
| **TC-11 Broken-link + missing-skill sweep** | R29, R30 (+ ~11 other pre-existing broken links) | `.claude/CLAUDE.md`, `wrap-up.md`, misc | doc | SHIPPED (R29/R30). |
| **TC-12 Quick twin** | R28 | `ideation/SKILL.md` | doc | SHIPPED. |

Ordering guidance for the remainder: do the tooling clusters (TC-8, TC-9) + R12 (TC-5) + R27
before the 2026-06-29 bulk. R27 (chat/tasks scaffold) belongs with the tooling wave.

## 8. Scope options (the original recommendation, for the record)

The full remaining set is **multi-session** (~27–30 fresh + ~150 legacy). Option A (the
2026-07-01 doc-consistency sweep — TC-1..TC-4, TC-6, TC-7, TC-10, TC-11, TC-12 = R1–R11, R13–R18,
R28–R30) was RECOMMENDED and SHIPPED this session. Remaining options for future sessions:

- **Option B — Tooling blocker + coherence:** D7-004 (R27) + the tooling waves.
- **Option C — Full 2026-07-01 remaining:** adds TC-9 (Codex smoke) + TC-8 (schema/harness) + R12 + R27. ~2 sessions.
- **Option D — Reconcile + first 2026-06-29 G2 cluster:** dedicate a NEXT session to 2026-06-29 finding-level de-stale + G2. The S5-staleness Criticals D1-001/002 need a **design** session.

## 9. Honest limits (CONCERNS)

- **2026-06-29 corpus NOT finding-level de-staled.** ~150 remaining findings were assessed only at
  cluster/queue granularity. Some are likely already fixed by intervening work (the layer2 witness
  proves at least one is stale). A proper finding-level de-stale of `fix-{d2,d3-d5,d4,d6,d7-d1}` is
  a separate ~1-session effort.
- **The C2–C6 cluster→finding mapping is on an unmerged branch**, so G2/G3 scoping on develop is approximate.
- R19–R21 are OPEN "by construction" (absence findings), not by a positive defect grep.
- The 13 pre-existing `check-markdown-links.sh` breaks + 1 (`CLAUDE.md`→claude skill) were counted
  but not each attributed to a review finding; R30 + FLAG-2 were two of them, the rest are general
  doc-rot (candidates for a link sweep, not necessarily corpus findings).

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-06-1faa4e51-9395-4d58-87b8-e7f47f59f81b/` — the
"2026-07-01 review doc-consistency sweep" (Option A). Source research artifact:
`1-ideation/working/research/remaining-review-fixes-reconciliation.md`.

## Related

- [[2026-07-06-review-doc-consistency-sweep-shipped]] — the session note for the sweep that shipped Option A
- [[finding-location-understates-blast-radius]] — the blast-radius mistake this reconciliation applied throughout
- [[references-provenance-frontmatter-vs-body]] — the R17 follow-up decision this backbone spun out
