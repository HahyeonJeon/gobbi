---
name: review-fix-implementation-handoff
description: "Fix-phase implementation handoff — sequences the ~162 adversarial-review findings into an executable, dependency-ordered fix campaign."
type: plans
scope: project
feature: null
status: active
created: 2026-06-29
session: 5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf
tags: [planning, process]
keywords: [adversarial-review, fix-campaign, mirror-root-cause, cluster-sequence, always-ask, handoff]
author: claude
task: Sequence the ~162 adversarial-review findings into an executable fix campaign
supersedes: null
superseded_by: null
task_count: 7
---

# Fix-phase implementation handoff — turning the review findings into fixes

## Purpose + context

The gobbi adversarial-review campaign is **complete**. Seven review dimensions (D1–D7)
ran across five PRs (#323–#327), all merged to `develop` (tip `a8a6f118`). The campaign
produced **~162 findings**. Every finding is **review-only** — the review sessions edited
**no** gobbi source. This document is the bridge from that review phase to the **fix**
phase: it turns the five fix-backlogs into one concrete, sequenced, dependency-aware plan
a fresh fix session can execute without re-reading the campaign.

A reader with no memory of the campaign can start here. The findings live in two places,
both on `develop`:

- **Source of record** (full evidence, proposed remediation, cross-system divergence,
  per-finding `Verification:` field) — the five review artifacts under
  `reviews/adversarial-review/`: the cycle-1 file `2026-06-29-gobbi-adversarial-review.md`
  (D7+D1), `…-d3-d5.md`, `…-d2.md`, `…-d4.md`, `…-d6.md`.
- **Fix queue** (per-cluster directional fix) — the five backlogs under
  `backlogs/evaluation/`: `fix-d7-d1-review-findings.md`, `fix-d3-d5-review-findings.md`,
  `fix-d2-review-findings.md`, `fix-d4-review-findings.md`, `fix-d6-review-findings.md`.

Per-dimension finding tally: D7+D1 = 40, D3+D5 = 29, D2 = 40, D4 = 46, D6 = 7
(≈ 162 total). This doc does NOT restate every finding — it groups them into fix clusters
and cites the real IDs so a fix session reads only the cluster it is taking.

> **Author's note on the brief.** The brief's "5 D4 cross-system divergences" conflates two
> facts: **D2** produced 5 substantive same-location/opposite-verdict divergences (the D2
> Always-Ask set); **D4** produced exactly **1** (D4-002). Both are carried in
> § Open adjudications below, named accurately.

## Fix-session operating model — read this before touching any source

The review phase touched nothing. The fix phase is **different**: every fix **edits gobbi
skills / agents / scripts**. That is squarely the Always-Ask category "**never edit gobbi
skills without the user's decision**". So the fix phase is gated where the review phase was
not. Each fix session MUST:

1. **Pick ONE cluster** from § Fix clusters (or a sub-set of one cluster). Do not span
   clusters in a single session — the dependency order below assumes one cluster per branch.
2. **Settle that cluster's Always-Ask design decisions FIRST**, with the user, before
   editing any source (§ Open adjudications lists which decision gates which cluster). A fix
   that depends on an unsettled decision is blocked, not started.
3. **Branch off `develop`** (all 162 findings + the five backlogs are on `develop`). One
   worktree, one branch, one PR — per the `git` skill.
4. **Run the gobbi workflow.** The fix IS the WORK sub-phase. **Dual-system EVALUATION of
   the fix is mandatory** (a Claude evaluator + a Codex evaluator, all seven perspectives) —
   the fix changes load-bearing skills, so it gets the full review the review phase used.
5. **Keep BOTH runtime mirrors in sync after ANY skill edit.** `.agents/skills/` is a
   whole-dir symlink mirror (self-healing); `.claude/skills/` is a **per-file** mirror that
   is **drift-prone** — this is the very gap D6 / D2-015 flagged. After editing a canonical
   skill, re-run the sync and the parity check (see C1). A skill edit that updates canonical
   but leaves `.claude/skills` stale is an incomplete fix.
6. **Verify against each finding's own `Verification:` field** in its review artifact — most
   D2/D4/D6 findings carry a runnable check (`find -L` / `readlink -f` / `test -e` /
   `check-markdown-links.sh` / `jq`). Re-run the named command; do not eyeball.
7. **Commit with the `AI-Provenance-Record:` trailer** (never `Co-Authored-By:`), PR
   `--base develop`. Because the base is non-default, closing keywords do not auto-fire —
   close any linked issue manually (`git` skill P5 step 6).
8. **Reconcile against the other backlogs, never re-file.** Cross-dimension overlaps are
   already deduped (D4 and D6 point their overlaps at the D2 queue). Fix an overlap through
   its owning backlog and close/supersede the narrow pre-existing entries once the
   consolidated fix lands (e.g. `backlogs/process/claude-skill-dangling-ref.md`,
   `backlogs/process/wrapup-workflow-doc-broken-delegation-link.md`,
   `backlogs/memory/preexisting-broken-markdown-links.md`).

## Fix clusters — prioritized and sequenced

Seven implementation clusters (C1–C7) plus a lower-priority / suggestion bucket. The order
is a dependency order, not a severity order: C1 is first because it is the campaign's
single highest-leverage root cause and it unblocks C2's `.claude` link fixes.

| # | Cluster | Size | Decision first? | Depends on | Lead severity |
|---|---|---|---|---|---|
| C1 | `.claude/skills` mirror root cause | M | YES (mirror mechanism + D2-032) | — | High (root) |
| C2 | Mechanical doc / link fixes | M | partial (D4-002) | C1 | High |
| C3 | Terminology + count drift | L | YES (canonical-term) | — (settle term) | High→Low |
| C4 | Dead-end-handoff class | M | YES (Always-Ask #1, #2) | decisions | Critical |
| C5 | Staging-ownership contradictions | L | YES (staging-writer model) | decisions | High |
| C6 | Stale CLI / TS-toolchain refs | S | no | — | Medium |
| C7 | Manifest / version / install hygiene | M | YES (D6-006 version policy) | — | High |

### C1 — the `.claude/skills` mirror root cause (FIRST, highest-leverage)

- **Members:** D2-015 (root) · D2-010 · D2-030 · D2-031 · D2-032 · D6-004. Fixing the root
  also unblocks the link-resolution half of D6-001 / D6-005 and relates to D2-029
  (Skill-Map row for `coding`).
- **Owner-surface:** `scripts/sync-plugin-package.sh`, the `.claude/skills/` symlink tree,
  `coding/review.md` (the stale "deferred" claim), `gobbi/SKILL.md` (Skill-Map index).
- **Size:** M — script + symlink creation + guard extension.
- **Always-Ask decision (settle first):** the **mirror mechanism** for `.claude/skills`.
  D2-015 left it open: ship **per-file** symlinks (matching the existing `.claude/skills`
  pattern) OR convert `.claude/skills` to **whole-dir** symlinks (matching `.agents/skills`).
  Plus **Always-Ask #3 (D2-032):** mirror docs only, or mirror scripts too — either way the
  fix DOCUMENTS the rule (a D2-015 corollary in skill-writing P5).
- **Dependencies:** none — it is the root. **Gates C2** (the `.claude` link-depth repoints
  only verify once the mirror targets exist).
- **Verification:** `find -L .claude/skills -type d -name scripts` returns 4 (today: 0);
  `.claude/skills/coding` resolves (today: absent); `diff <(ls .claude/skills) <(ls
  .agents/skills)` is empty (today: 21 vs 22); `scripts/sync-plugin-package.sh --check`
  exits **non-zero on drift** and **zero after the fix** (today it false-greens — it never
  inspects `.claude/skills`).
- **Rationale for position:** confirmed root cause. `sync-plugin-package.sh` manages
  `.agents/skills`, the `plugins/gobbi/` symlinks, and `.claude/hooks/*.sh` — but **never
  `.claude/skills/`**, so its `--check` exits 0 while `coding` and all `scripts/` subdirs are
  missing. Fixing this one root closes D2-010 / D2-030 / D2-031 / D2-032 + D6-004 at once —
  the largest cluster in the campaign.

### C2 — mechanical doc / link fixes

- **Members:** D2-017 · D2-022 · D2-023 · D2-024 (broken / wrong-`../`-depth links);
  D6-001 (the `.claude/{hooks,scripts}` 4-`../`-vs-5 depth bug); D4-003 · D4-007 · D4-018 ·
  D4-023 (stale line-anchors / reference rot); D6-005 (wire `check-markdown-links.sh` into
  the pre-publish gate). Cycle-1 siblings D1-006 / D1-007 fold in here.
- **Owner-surface:** `orchestration/SKILL.md`, `delegation/SKILL.md`, `git/SKILL.md`,
  `planning/mistakes.md`, `evaluation/SKILL.md`, `codex/SKILL.md`,
  `wrap-up/SKILL.md` (gate wiring).
- **Size:** M — many small, safe doc edits.
- **Decision:** partial. The `.claude`-targeted links are gated by **C1** (the targets must
  exist) and by **D4-002** (the repo-root-vs-doc-relative convention; § Open adjudications).
  The wrong-DEPTH links (D2-017 / D2-022) are NOT D4-002 — fix them as plain depth repoints.
- **Dependencies:** C1 (so `.claude` link fixes verify against the complete mirror);
  the D4-002 decision for the bare-root-path subset.
- **Verification:** `bash skills/orchestration/scripts/check-markdown-links.sh` to zero
  across the canonical tree; D6-005 then wires that guard into the plugin pre-publish gate so
  a broken deployment-path link cannot ship. Repoint stale line-anchors to **section names**
  (drift-robust), not new line numbers.
- **Rationale for position:** mostly-safe doc edits; landing after C1 lets the `.claude`
  link fixes verify against the now-complete mirror.

### C3 — terminology + count drift

- **Members (term):** D4-008 (`InProgress`→`Active`, `MEMO`→`RECORD`, `EVAL`→`EVALUATION`,
  `ITER/EXIT`) · D4-010 · D4-011 (phase-vs-sub-phase) · D4-013 · D4-014 · D4-015 · D4-016 ·
  D4-024 · D4-025 · D4-030. **(count):** D2-019 · D2-033 · D4-001 · D4-017 · D4-028 ·
  D4-029 · D4-031 · D4-032 · D4-033 · D4-038 · D4-039 · D4-041 · D4-042 · D4-045. Cycle-1
  Preparation-omission siblings D1-013 / D1-015 / D1-031 and the wrap-up-ordering items
  D1-008 / D1-017 fold in here.
- **Owner-surface:** `chat-mode.md`, `auto-mode.md`, `orchestration/SKILL.md`, the 5 loop
  `SKILL.md`, `gobbi/SKILL.md` (Glossary), plus the residual-vocab guard
  `skills/orchestration/scripts/check-residual-vocab.sh`.
- **Size:** L — high-volume, low-risk sweep.
- **Always-Ask decision (settle first):** the **canonical term** picks — `InProgress`→
  `Active`, `MEMO`→`RECORD`, and the **phase-vs-sub-phase** wording (D4-011: DISCUSSION /
  WORK / EVALUATION / RECORD are "phases" in 5 loops but "sub-phases" in the Glossary — pick
  one and sweep, or amend the Glossary). The count fixes are mechanical once the term is set.
- **Dependencies:** none hard; settle the canonical term before the sweep so it lands once.
- **Verification:** `check-residual-vocab.sh` to zero **after extending it** to catch the
  short `MEMO` token (today it matches only the longer `MEMORIZATION`, so `MEMO` slips past —
  the guard gap is part of this cluster); per-count claims re-verified against the live repo.
- **Rationale for position:** high-volume but low-risk; run after the structural clusters so
  the sweep lands once against a stable surface.

### C4 — dead-end-handoff class

- **Members:** D2-001 (Preparation PASS never loads `planning/SKILL.md`) · D2-002 (Planning
  PASS never loads `execution/SKILL.md`) · D2-003 (`coding/evaluation.md` + `review.md`
  dead-end from Execution EVALUATION) · D2-005 (Execution final-task → Wrap-up transition
  unstated) · D2-036 (narrow stale-language angle on D2-003). Cycle-1 seed D1-005
  (Ideation→Preparation handoff doc) is instance-1 of this class.
- **Owner-surface:** `preparation/SKILL.md`, `planning/SKILL.md`, `execution/SKILL.md`,
  `coding/evaluation.md`, `wrap-up/SKILL.md`.
- **Size:** M.
- **Always-Ask decision (settle first):** **#1 — is "named successor without an explicit
  load directive" a dead-end?** Codex = Critical dead-end; Claude = NAMED, no defect. The
  fix differs by verdict, and the answer also settles whether the seeded Ideation→Preparation
  gap is unique or one of three. **#2 — coding eval wiring (D2-003 vs D2-036):** wire
  `coding/evaluation.md` into Execution EVALUATION for code change-sets, OR declare it
  standalone and drop the successor expectation.
- **Dependencies:** decisions #1 and #2 first.
- **Verification:** trace each handoff — the PASS-after-RECORD step names the successor AND
  the directive to load it; manual review against each finding's `Verification:` field.
- **Rationale for position:** the D2 structural Criticals — settle the design question, then
  edit the loop skills.

### C5 — staging-ownership contradictions

- **Members:** D2-006 · D2-007 (structural root) · D2-008 · D2-011 (memory-doc root) ·
  D2-012 · D2-026. D4-005 (mistake-capture write-timing — same class, different doc) folds
  in here.
- **Owner-surface:** `record/SKILL.md`, `record/record-map.md`, `memory/memory-map.md`,
  `preparation/SKILL.md`, `wrap-up/SKILL.md`, `research/SKILL.md`, `mistake/SKILL.md`.
- **Size:** L — align ~6 docs to one model.
- **Always-Ask decision (settle first):** the **one staging-writer model** —
  **WORK-time producers** write `staging/` vs **RECORD-time assistant** writes `staging/`.
  Today the docs assert both (PASS-only vs WORK vs loop-entry), so a literal reader cannot
  satisfy them. Also fold in the `skills/` memory-classification (D2-011: project `skills/`
  is both excluded-from-memory and a memory write target).
- **Dependencies:** the staging-writer decision first; partly gated by Always-Ask #1
  (the Preparation handoff that C4 settles).
- **Verification:** re-read all aligned docs — no two give the same role opposite
  instructions for the same write surface; the record Memory Access Matrix lists every
  loop's staging surfaces consistently (incl. Preparation `staging/skills/`).
- **Rationale for position:** a cluster of mutually-incompatible instructions — best settled
  as a deliberate design decision, not spot-edits.

### C6 — stale CLI / TS-toolchain refs in agent docs

- **Members:** D4-026 (`agents/manager.md` cites a `gobbi workflow init` CLI that does not
  exist) · D4-027 (`agents/executor.md` targets an absent `packages/cli/` + `bun test` +
  "2197/0" TypeScript-Bun codebase).
- **Owner-surface:** `agents/manager.md`, `agents/executor.md`.
- **Size:** S — two files, no decision.
- **Decision:** none. The model is settled: gobbi is markdown-driven / no-CLI. Rewrite
  manager.md to the `orchestration/SKILL.md § Step 1` Configuration description (worktree +
  `init-record-map.sh` + JSON stamping); gate or remove the executor TS branch and replace
  the `bun test` example with a markdown-tree guard run
  (`skills/orchestration/scripts/` guards).
- **Dependencies:** none — can run anytime; a good early standalone win.
- **Verification:** grep the agent docs for `gobbi workflow init` / `packages/cli` /
  `bun test` returns zero; manual read confirms the replacement describes the live flow.
- **Rationale for position:** small, self-contained, decision-free — schedulable early or
  in parallel with a doc-heavy cluster.

### C7 — manifest / version / install hygiene

- **Members:** D6-002 (fire-once validator ignores the packaged `SessionEnd` hook) · D6-003
  (installed-cache allow-set rejects `.codex-plugin`) · D6-006 (version frozen at `0.5.0`) ·
  D6-007 (Codex `SessionStart` matcher trailing `.*` defeats the event filter).
- **Owner-surface:** `plugins/gobbi/hooks/hooks.json`, `plugins/gobbi/hooks/codex-hooks.json`,
  `scripts/validate-plugin-hooks-fire-once.sh`, the three `plugin.json` /
  `marketplace.json` manifests.
- **Size:** M.
- **Always-Ask decision (settle first):** **D6-006 version cadence** — adopt
  bump-on-meaningful-change (e.g. `0.5.x` patch bumps) and enforce it in the pre-publish
  gate. **Version policy is a user call — settle it before any bump.**
- **Dependencies:** none hard. D6-002/003 share the install-validation surface and can land
  together; D6-004 (the guard's `.claude/skills` coverage) belongs to **C1**.
- **Verification:** `validate-plugin-hooks-fire-once.sh` passes with `SessionEnd` in the
  marker/allow-set and `.codex-plugin` in the installed-cache allow-set; `jq` confirms the
  bumped `version` across all three manifests; the Codex `SessionStart` matcher no longer
  carries the trailing `|.*` (re-introduced match-all the project removed at PR #229).
- **Rationale for position:** deployment hygiene; gated only by the user's version-policy
  decision, otherwise independent.

### Lower-priority / suggestion bucket (D3 · D5 · D7 · residual D1)

Place the remaining findings here. Note carefully which are **committed fixes** vs
**review-only SUGGESTIONS** (charter Decision-5) that need a **design** session, NOT a fix:

- **REVIEW-ONLY SUGGESTIONS (Decision-5 — do NOT auto-build; surface for the user's design
  decision):** the **memory-staleness re-sync** (D3-005, and the cycle-1 Criticals D1-001 /
  D1-002 + the staleness-machinery cluster D1-021…D1-027) and **live-progress visibility**
  (D3-002 + the D7 cluster D7-R1…D7-R8). These were the triangulated top systemic gap (three
  dimensions flagged it independently), but the charter committed them as **suggestions
  only**. A fix session must NOT build them without a fresh user design decision; frame any
  related work as "gap observed + possible direction," never "must implement."
- **D3 capability fixes (committed, but each a larger design effort):** D3-006
  (dependency-aware planning) · D3-001 (advisory skill-discovery preflight) · D3-008
  (progressive-disclosure / staged Load-Directives) · plus the lower-priority parity items
  D3-004 / D3-007 / D3-012 / D3-013 and the pre-work refresh D3-014. **Guardrails bind every
  D3 fix:** a semantic index (D3-004) stays ADDITIVE over canonical markdown; progressive
  disclosure (D3-008) NEVER drops the dual-system load-bearing docs
  (`orchestration/workflow/production.md`, `evaluation/SKILL.md`) from the load path; no D3
  fix erodes the dual-system anti-groupthink differentiator.
- **D5 text-polish (committed — a focused doc-polish session):** the centralize set
  (D5-001…D5-008), compact set (D5-009…D5-012), and the move D5-013; D5-014 / D5-015 are
  **keep** (no fix). **SAFETY FLOOR (drop-count = 0):** keep ONE complete statement of each
  MUST-safety rule — the `worktreePath` null→error rule (D5-008), the no-delete / archive
  path (D5-009), and the degraded-mode label rule (inside D5-001). Never compact a safety
  rule into ambiguity (Principle 7 floor). D5 pairs naturally with the D3-008 work.
- **Residual D1 (committed doc fixes, fold into the clusters above):** D1-006 / D1-007 →
  C2; D1-013 / D1-015 / D1-031 / D1-008 / D1-017 → C3; D1-005 → C4; D1-003 / D1-007 /
  D1-009 → C2/C3 doc-precision sweep; D7-R5 is the PARENT fix R2/R3/R4 derive from — sequence
  it first within any D7 work.

## Open adjudications carried from the reviews

Decisions a fix session MUST put to the user **before editing**, because the fix direction
differs by the answer. Each maps to the cluster it gates.

| # | Adjudication | Source | Divergence | Gates |
|---|---|---|---|---|
| A1 | Named-successor-without-load-directive = dead-end? | D2-001 / D2-002 | Codex=Critical / Claude=no-defect | C4 |
| A2 | Wire `coding/evaluation.md` into Execution EVALUATION, or declare standalone? | D2-003 / D2-036 | Codex=Critical / Claude=Low | C4 |
| A3 | `.claude/skills` mirror docs only, or scripts too — and per-file vs whole-dir? | D2-032 / D2-015 | Codex=defect / Claude=by-design | C1 |
| A4 | Uniform operational-contract bar for 8 skills, or a stated exemption class? | D2-028 | Codex=uniform / Claude=reference-skills-exempt | C3/doc-style |
| A5 | `memory/rules.md` broken links — new finding or close via existing backlog? | D2-037 | Codex=new / Claude=backlog-tracked | C2 |
| A6 | Repo-root-vs-doc-relative path convention (the single D4 divergence) | D4-002 | Codex=per-doc defect / Claude=by-design | C2 (doc↔path subset) |
| A7 | Version cadence policy (bump-on-meaningful-change) | D6-006 | user call | C7 |
| A8 | D6-001 link-depth final severity (Critical vs High) | D6-001 | Claude=Critical / Codex=High | C2 (lead order) |
| A9 | The one staging-writer model (WORK-time vs RECORD-time) | D2-007 cluster | structural | C5 |
| A10 | Canonical-term picks (`InProgress`→`Active`, `MEMO`→`RECORD`, phase-vs-sub-phase) | D4-008 / D4-011 | term standard | C3 |

A1–A5 are the **5 D2 substantive cross-system divergences**; A6 is the **1 D4 divergence**.
Settle a cluster's adjudications, then start it — never edit ahead of the decision.

## Recommended first session — C1, the mirror root cause

Concrete step list. This is the highest-leverage single fix and it unblocks C2.

1. **Inspect the current mechanism.** Read `scripts/sync-plugin-package.sh`. Confirm it
   manages `.agents/skills/` (whole-dir symlinks), `plugins/gobbi/{skills,agents,hooks}`, and
   `.claude/hooks/*.sh` — and that it **never references `.claude/skills/`**. Confirm the
   drift: `ls .claude/skills | wc -l` = 21, `ls .agents/skills | wc -l` = 22,
   `find -L .claude/skills -type d -name scripts | wc -l` = 0.
2. **Decide the mirror mechanism with the user** (adjudication A3): per-file symlinks
   (extend the existing `.claude/skills` pattern) vs whole-dir symlinks (adopt the
   `.agents/skills` pattern); and mirror-docs-only vs mirror-scripts-too (A3 / D2-032).
3. **Implement the chosen mechanism** in `sync-plugin-package.sh` so it creates/repairs the
   `.claude/skills/` mirror for every canonical skill (incl. `coding`) and every `scripts/`
   subdir, per the decision.
4. **Extend `--check`** to assert `.claude/skills` parity — every canonical skill dir and
   every `scripts/` subdir exposed via the mirror (symlink-following `find -L`). It must exit
   **non-zero** on drift (today it false-greens).
5. **Create the missing mirrors** by running the (now-extended) sync: `.claude/skills/coding`
   and the four `scripts/` subdirs appear.
6. **Re-run the guards.** `scripts/sync-plugin-package.sh --check` exits 0;
   `find -L .claude/skills -type d -name scripts | wc -l` = 4;
   `diff <(ls .claude/skills) <(ls .agents/skills)` is empty.
7. **Verify the dependent findings resolve:** D2-010 (`coding` present), D2-030
   (`gobbi/hook-authoring.md` reachable), D2-031 (`memory/memory-vocabulary.json` reachable),
   D2-032 (scripts rule documented), D6-004 (`--check` no longer false-greens). Correct
   `coding/review.md`'s stale "deferred" claim and add the `coding` Skill-Map row
   (D2-029) in the same change.
8. **Document the mirror rule** (the A3 decision) in skill-writing P5 so the convention is
   stated, not implicit — the D2-015 corollary.
9. **Dual-system EVALUATION** of the fix (mandatory), commit with `AI-Provenance-Record:`,
   PR `--base develop`.

## Cross-cutting gotchas / proven recipe

Recipes and traps the campaign already paid for — reuse verbatim.

- **Symlink checks follow links.** Always `find -L` / `readlink -f` + `test -e` for any
  mirror/package check. Plain `find` / `ls` does NOT follow the `.agents` whole-dir symlinks
  and yields a false-negative (the iter1 error that wrongly blamed `.agents`).
- **Codex background-exec exit code is unreliable.** A detached `codex exec` reports
  `-1`/"unknown" even on success. Validate the **`-o` output file** (`test -s` + a finding
  marker), NOT the exit code. Run every Codex pass as a **background `codex exec --sandbox
  read-only --cd <WT> -o <abs-out> "$(cat prompt)" < /dev/null`** with `run_in_background:
  true` — never a foreground `timeout 1200` (the host Bash tool kills it at ~10 min).
- **Fully-expanded absolute paths in every brief.** A `WT/`-prefixed (unexpanded) write path
  lets a fresh subagent resolve it against the main-tree CWD and write to the wrong tree (the
  D2 misroute incident). Paste the fully-expanded absolute path for every write target; the
  manager verifies each artifact at the EXACT worktree path (`test -e`) after the subagent
  returns. D4 and D6 applied this and had zero misroutes.
- **`gh` 2.45 label ops:** use `gh api` for labels (the `--add-label` path is brittle on
  this version).
- **Provenance trailer:** `AI-Provenance-Record:`, never `Co-Authored-By:`.
- **Non-default base:** a PR `--base develop` does not auto-close issues — close linked
  issues manually (`git` skill P5 step 6).
- **Reconcile, never re-file** an already-deduped cross-dimension overlap — fix it through
  the owning backlog and close/supersede the narrow pre-existing entry.
- **Dual-system review recipe (if any re-review is needed):** Claude `leader` (read-only
  intent, writes findings to a fully-expanded absolute worktree path) + background Codex
  `codex exec`; MERGE by **pessimistic union** (a finding survives if either system raised
  it; conservative score + max severity); assign stable `D#-###` IDs at merge; preserve every
  cross-system divergence as the anti-groupthink signal.

## Verification strategy summary

The campaign is complete when every cluster's findings are fixed and each finding's own
`Verification:` field passes. The two campaign-wide gates: `check-markdown-links.sh` reaches
zero across the canonical tree (C2 + D6-005 wires it into the pre-publish gate), and
`sync-plugin-package.sh --check` exits non-zero on any mirror drift (C1). Each fix cluster
additionally re-runs the named per-finding command from its review artifact.

## Open issues

- The three structural clusters (C4 dead-end class, C5 staging-writer model) and the two
  Decision-5 SUGGESTIONS (staleness re-sync, live-progress visibility) are **design**
  efforts, not spot-edits — each likely its own session with an Ideation frame.
- Adjudication A8 (D6-001 severity) decides whether the link-depth fix LEADS the campaign;
  it is a manager call, since three dimensions rated the same off-by-one defect differently.

## Related

- [[fix-d2-review-findings]] — the D2 fix queue (owns the highest-leverage root, D2-015)
- [[fix-d4-review-findings]] — the D4 naming / count / doc-style fix queue
- [[fix-d6-review-findings]] — the D6 plugin-deployment fix queue
- [[fix-d3-d5-review-findings]] — the cycle-2 harness-gap + text-polish fix queue
- [[fix-d7-d1-review-findings]] — the cycle-1 live-UX + lifecycle fix queue
- [[review-campaign-complete]] — the capstone handoff this plan executes against
- [[adversarial-review-charter]] — the charter the campaign ran from
- [[run-deep-adversarial-review]] — the standing charter-execution backlog
