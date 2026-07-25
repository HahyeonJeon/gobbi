---
name: gobbi-entry-lighten-workflow-rename
description: Gobbi entry lightened to floor-of-five plus skill-map index; orchestration skill renamed to workflow (Claude-only, Codex usage-capped and waived)
type: notes
scope: project
feature: null
status: active
created: 2026-07-25
session: 69314d61-5a03-4ad7-9672-64031832463a
tags: [refactor, rename-sweep, docs-sync, evaluation, codex, git]
keywords: []
author: claude
features_touched: []
steps_completed: [ideation, planning, execution, wrap-up]
shipped: [rename-point-dont-restate-rule-file, plugin-version-mismatch-blocks-sync-check, sync-regenerate-blocked-by-topology-gate-and-agents-prune-gap, fix-production-md-dangling-ref]
---

# Gobbi entry lightened to floor-of-five, orchestration renamed to workflow

## 1. Outcome and agreed scope

Two coupled changes, locked by user decision in the Ideation artifact
(`1-ideation/outputs/ideation-artifact.md`, decisions D1–D4 and resolved
open decisions D-OPEN-1/2/3):

1. **Gobbi entry redesign.** `gobbi/SKILL.md` no longer always-loads the full
   `orchestration` skill on every session start/resume/`/clear`/compaction.
   It becomes a light floor-of-five (`principles`, the generic top-level
   `delegation`, `discussion`, `ideation`, `git`) plus a skill-map INDEX that
   points to the rest, including `mistake`, `workflow` (formerly
   `orchestration`), and `startup`, which are demoted from always-load to
   indexed pointers.
2. **`orchestration` → `workflow` rename.** The skill directory and its inner
   `workflow/` subdirectory rename to `workflow/` and `steps/`
   respectively, with every active reference across the repo repointed.

**Locked decisions to respect** (kept live, see §4): D1 (exact floor set),
D2 (`delegation` in the floor is the generic top-level skill, not
`workflow/delegation.md`), D3 (the rename), D4 (rename active surfaces and
references only; leave historical prose, including backlogs, untouched).
Three open decisions were resolved by the user during Ideation:
D-OPEN-1 (do not reconcile `.claude/CLAUDE.md` / `agents/manager.md` floor
semantics — an accepted, tracked inconsistency), D-OPEN-2 (`startup` is
indexed only, not gated), D-OPEN-3 (leave the `orchestration` keyword in the
plugin manifest).

**Out of scope:** reconciling the `.claude/CLAUDE.md`/`agents/manager.md`
floor-semantics gap (D-OPEN-1), adding a `startup` gate, renaming the plugin
manifest `orchestration` keyword, and any fix to the 9 pre-existing broken
agent-doc links or the pre-existing plugin version-equality mismatch — all
four are filed as backlogs (§7), not fixed in this session.

## 2. Completed or shipped work, with artifact and verification evidence

Four Execution tasks, one focused commit each, all atop base `dc5fd3c4`
(current HEAD `437c9eb9`, verified via `git log --oneline dc5fd3c4..HEAD`):

- **T1 — `7c4c15b3`** "refactor(skills): rename orchestration skill to
  workflow and repoint active references." `git mv` of
  `skills/orchestration/` → `skills/workflow/` and its inner `workflow/` →
  `steps/`, an exhaustive occurrence inventory classifying every hit as
  repoint / leave (historical) / backlog, mirror regeneration, and a
  disposition record. Evaluation: `3-execution/task-01-rename-orchestration-to-workflow/evaluation/iteration-1/claude.md`,
  verdict PASS, findings `F-CONSIST-01` (Low — backlogs correctly left per
  D4) and `F-RISK-01` (Medium — a `git rm` bypassed the sync owner per
  `synthesis.md`; the mirror end-state was verified sync-consistent and the
  gap was backlogged, non-gating).
- **T2 — `175974ac`** "refactor(gobbi): lighten entry to floor-of-five plus
  skill-map index." Rewrote `gobbi/SKILL.md` to the locked floor + index.
  Evaluation: `3-execution/task-02-rewrite-gobbi-skill/evaluation/iteration-1/claude.md`,
  verdict PASS, findings `F-USAGE-01` (Low — cold-resume bridge, non-gating)
  and `F-CONSIST-01` (Medium — the dispatched `subjectSha256` did not
  hash-match the committed bytes; subject identity was confirmed three
  independent ways, non-gating).
- **T3 — `8c5ef1e6`** "refactor(gobbi): realign scenarios/checklists/evaluation
  to light entry." Realigned `gobbi`'s three companion docs
  (`scenarios.md`, `checklists.md`, `evaluation.md`) to the new rule set.
  Evaluation: `3-execution/task-03-redesign-gobbi-children/evaluation/iteration-1/claude.md`,
  verdict PASS, findings `F-STRUCT-1` and `F-CONSIST-1` (both Low — companion
  nits, non-gating).
- **T4 — `437c9eb9`** "chore(workflow): validate rename gates and file
  deferred backlogs." Ran the full gate set on the complete T1–T3 change and
  filed the four deferred backlogs (§7). Evaluation:
  `3-execution/task-04-validate-and-backlogs/evaluation/iteration-1/claude.md`,
  verdict PASS, finding `F-CONSIST-01` (Low — the 4th backlog was
  authorized).

All four tasks passed on their first Execution evaluation iteration (no
Execution REVISE), forming a clean local commit history of 4 task commits
atop base `dc5fd3c4` at HEAD `437c9eb9`. The durable note this Wrap-up
promotes
(`notes/workflow/2026-07-25-gobbi-entry-lighten-workflow-rename.md`) is
currently untracked (`git status --short` shows one `??` line for it),
pending the manager-owned Wrap-up promotion commit at finalization (see §6).

## 3. Dual-system evaluation result, approved finding dispositions, and any waiver

**Waiver.** Codex was unavailable for the entire session: `codex exec`
returned exit 1 with a hard usage cap ("You've hit your usage limit ... try
again at Jul 28th, 2026 5:02 PM"). The user explicitly approved single-system
(Claude-only) for every step and iteration on 2026-07-24; the waiver does not
carry forward automatically — each step re-asked and recorded its own
`research/waiver.md` (verified present for ideation iteration 1, planning
iterations 1–2, all four Execution tasks' iteration 1, and this Wrap-up
iteration 1). Every evaluation cited below is a single Claude evaluator
report, not a dual-system aggregate.

**Ideation** — iteration 1, PASS. `1-ideation/evaluation/iteration-1/claude.md`,
4 Low findings (`F-STRUCT-1`, `F-PERF-1`, plus 2 more Low), no Medium/High.
`F-PERF-1` (no order-of-magnitude load-reduction estimate/measurement) is
still open — see §7.

**Planning** — iteration 1 REVISE
(`2-planning/evaluation/iteration-1/claude.md`: 1 High + 2 Medium + 1 Low,
the High being a broken-verify-command defect) → iteration 2 PASS
(`2-planning/evaluation/iteration-2/claude.md`: all iteration-1 findings
fixed, 1 new Low `F-PLAN2-01` — a bare-`workflow`-existence check — accepted
into T1/T4's verification rather than re-planned).

**Execution** — all four tasks PASS on iteration 1 (see §2 for each report
path). Finding severities: T1 `F-CONSIST-01` Low + `F-RISK-01` Medium; T2
`F-CONSIST-01` Medium (dispatched `subjectSha256` did not hash-match the
committed bytes) + `F-USAGE-01` Low (cold-resume bridge); T3 `F-STRUCT-1`
and `F-CONSIST-1`, both Low; T4 `F-CONSIST-01` Low — 5 Low + 2 Medium total,
no High. Every Medium/Low finding was non-gating (only a High-severity
finding at confidence ≥ 50 blocks a PASS verdict), so all four tasks reached
PASS on their first iteration.

**This Wrap-up** — single-system Claude WORK and RECORD; evaluation for this
handoff and the post-promotion tree is pending at the time this note is
staged (Wrap-up EVALUATION runs after this WORK candidate).

## 4. Decisions to respect

- **D1** — the floor is exactly `{principles, delegation (the generic
  top-level skill), discussion, ideation, git}`; `mistake`, `workflow`, and
  `startup` are demoted to skill-map INDEX entries, not always-loaded.
- **D2** — the floor's `delegation` is the generic top-level
  `skills/delegation/` skill, not `workflow/delegation.md`.
- **D3** — `orchestration` renamed to `workflow`; its inner `workflow/`
  subdirectory renamed to `steps/`.
- **D4** — rename active surfaces and active references only; historical
  prose, including backlog files, keeps the old name.
- **D-OPEN-1** — do NOT reconcile `.claude/CLAUDE.md` / `agents/manager.md`
  floor semantics this session; they still describe loading
  `mistake`/`workflow` as part of the always-load floor. This is an accepted,
  user-approved inconsistency between those two files and `gobbi/SKILL.md`'s
  new floor-of-five, tracked, not fixed.
- **D-OPEN-2** — `startup` is indexed only; no gate was added.
- **D-OPEN-3** — the `orchestration` keyword in the plugin manifest is left
  as-is (tracked as a backlog, §7, not renamed).
- **Concern A** (from Ideation) — accept the pre-existing plugin
  version-mismatch baseline and track it (backlog, §7); do not fix it here.
- **Concern B** (from Ideation) — broaden the `production.md` backlog to
  cover all 9 pre-existing broken links, not a subset.

## 5. Durable memory promoted or superseded

This note (`notes/workflow/2026-07-25-gobbi-entry-lighten-workflow-rename.md`)
is the only durable-memory record this Wrap-up promotes. Every step and
Execution-task typed staging directory was inventoried and found empty (§6
below in the companion promotion evidence); the user declined to promote any
additional learning or mistake this session, so staging is intentionally
empty — a valid clean result, not a gap.

Separately from this Wrap-up promotion, Execution task T4 directly committed
four backlog records to the durable project `backlogs/` tree as its own
stated deliverable (commit `437c9eb9`, verified via
`git show --stat --name-only 437c9eb9`): `backlogs/docs/rename-point-dont-restate-rule-file.md`,
`backlogs/tooling/plugin-version-mismatch-blocks-sync-check.md`,
`backlogs/tooling/sync-regenerate-blocked-by-topology-gate-and-agents-prune-gap.md`,
`backlogs/workflow/fix-production-md-dangling-ref.md`. The locked plan (`2-planning/outputs/plan.md` lines 71-74) authorized T4 to
file three backlogs — `fix-production-md-dangling-ref.md` (broadened to all
9 pre-existing broken links per Concern B), `rename-point-dont-restate-rule-file.md`,
and `plugin-version-mismatch-blocks-sync-check.md`. A fourth backlog,
`sync-regenerate-blocked-by-topology-gate-and-agents-prune-gap.md`, was added
mid-Execution to track the T1 evaluation's `F-RISK-01` finding (the sync
regenerate-mode `.agents` prune gap and the topology-gate-blocks-regenerate
issue), confirmed by the manager during that finding's disposition — an
authorized plan extension, not an unauthorized scope addition. These
four are cited here for completeness; they were not staged or promoted by
this Wrap-up.

## 6. Pre-finalization Git state and authorized finalization plan

- Branch: `claude-2026-07-24-69314d61-5a03-4ad7-9672-64031832463a`
- Worktree (absolute):
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-07-24-69314d61-5a03-4ad7-9672-64031832463a`
- Base branch: `develop`, branched from `dc5fd3c4`
- HEAD: `437c9eb9` (4 local commits ahead of `dc5fd3c4`: `7c4c15b3`,
  `175974ac`, `8c5ef1e6`, `437c9eb9`)
- Working tree: the 4 task commits (`7c4c15b3`, `175974ac`, `8c5ef1e6`,
  `437c9eb9`) form a clean local commit history atop `dc5fd3c4`; the durable
  note this Wrap-up promotes is currently untracked (`git status --short`
  shows one `??` line for it), pending the manager-owned note-promotion
  commit below.
- Configured publication: `local` (`session.json.settings.git.publication`),
  no issue, no draft pull request
- **Authorized finalization plan:** LOCAL only — retain the branch and
  worktree; the 4 verified commits already exist locally, plus one further
  local commit that promotes this handoff note. No push, no PR, no merge.
- **Divergence note:** the local `develop` branch (`733ae155`) and
  `origin/develop` (`395eccd9`) have genuinely diverged from their common
  merge-base `dc5fd3c4` — each has commits the other lacks (verified via
  `git merge-base --is-ancestor` in both directions, both negative; local
  develop carries the `study`-rename and scenario/checklist-nesting commits
  that `origin/develop` lacks, and `origin/develop` carries two commits
  local develop lacks). Merging this branch into local `develop` risks a
  content conflict that merging via `origin/develop` would avoid.

## 7. Unresolved, blocked, or deferred items with explicit reasons

- **`backlogs/workflow/fix-production-md-dangling-ref.md`** — broaden the fix
  to all 9 pre-existing dangling `production.md` links (Ideation Concern B).
  Next action: read the backlog and its enumerated link list, then fix in a
  dedicated docs-sync session.
- **`backlogs/docs/rename-point-dont-restate-rule-file.md`** — a rule-file
  slug still names the old `orchestration` concept. Next action: read the
  backlog for the exact file and rename per the point-don't-restate rule.
- **`backlogs/tooling/plugin-version-mismatch-blocks-sync-check.md`** — the
  pre-existing plugin version-equality mismatch (accepted baseline, Ideation
  Concern A, also present on `origin/develop`). Next action: read the
  backlog for the exact mismatched versions and reconcile.
- **`backlogs/tooling/sync-regenerate-blocked-by-topology-gate-and-agents-prune-gap.md`**
  — two sync-tool gaps the rename exposed. Next action: read the backlog for
  the exact topology-gate and agents-prune-gap details.
- **`F-PERF-1`** (Ideation, Low, open) — the "entry is heavy" premise carries
  no order-of-magnitude load estimate or a measured before/after signal.
  Next action: add a byte/token estimate of the removed always-loads vs. the
  new floor, and a lightweight measured success signal.
- **T3 companion nits** (`F-STRUCT-1`, `F-CONSIST-1`, both Low) — an
  atomicity split for a `ROUTE-01`-style rule and an inert 80→40 cell
  threshold in the realigned companion docs. Next action: read
  `3-execution/task-03-redesign-gobbi-children/evaluation/iteration-1/claude.md`
  for the exact recommendation and apply in a follow-up.
- **`F-USAGE-01`** (T2, Low) — the cold-resume bridge for a fresh session
  landing directly on the new floor-of-five borders D-OPEN-1 (the accepted
  `.claude/CLAUDE.md`/`agents/manager.md` inconsistency). Next action: read
  `3-execution/task-02-rewrite-gobbi-skill/evaluation/iteration-1/claude.md`
  and decide with the user whether to close this alongside D-OPEN-1 or
  separately.

## 8. Known risks and accepted exceptions

- **Floor-semantics inconsistency (accepted, D-OPEN-1).** `.claude/CLAUDE.md`
  and `agents/manager.md` still describe loading `mistake`/`workflow` as part
  of the always-load floor, while `gobbi/SKILL.md`'s floor-of-five now
  excludes them. The user explicitly declined to reconcile this in-session;
  it is tracked, not silently inconsistent.
- **9 pre-existing broken links (baseline, tracked).** Present before this
  session; filed as a backlog (§7), not introduced or worsened by this
  change.
- **Plugin version mismatch (baseline, also on `origin/develop`, tracked).**
  Pre-existing; filed as a backlog (§7).
- **Temp-flip mirror workaround.** The plugin mirror regeneration used a
  temporary flip during T1 that nets to a zero-diff committed mirror version
  — verified net-zero, not a live risk.
- **3 non-fatal `codex-smoke` WARNs.** Observed during gate runs; non-fatal,
  not blocking.
- **Local/origin `develop` divergence (§6).** Genuine, verified two-way
  divergence from the shared merge-base; affects the eventual merge path,
  not this session's completeness.
- **Backlog direct-write vs. Wrap-up-sole-writer model (accepted, flagged
  for clarification).** Execution task T4 committed the four backlog
  records directly to the durable `backlogs/` tree (commit `437c9eb9`) as a
  plan-authorized, Planning- and T4-evaluated deliverable (`plan.md`
  Sections B/D/E/F; T4 evaluation PASS). This sits in mild tension with
  `memory/rules.md` §2.6 ("No other step or stage writes durable memory" —
  Wrap-up promotion is modeled as the sole durable-memory write path).
  Accepted this session as an authorized Execution deliverable, not a
  Wrap-up defect; flagged as a future model-clarification question: whether
  to explicitly bless plan-authorized Execution-time backlog writes, or
  route all future deferred-backlog filing through Wrap-up staging →
  promotion.

## 9. Exact next-session start point: objective, required reads, current branch/worktree state, and first action

**Objective:** decide and execute publication for this branch (merge/push),
or pick one of the four filed backlogs to fix next.

**Required reads:** this note; the 4 shipped commits
(`git -C <worktree> show --stat 7c4c15b3 175974ac 8c5ef1e6 437c9eb9`); the
four backlog files under `backlogs/docs/`, `backlogs/tooling/` (×2), and
`backlogs/workflow/` listed in §7.

**Branch/worktree state:** branch
`claude-2026-07-24-69314d61-5a03-4ad7-9672-64031832463a`, worktree
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-07-24-69314d61-5a03-4ad7-9672-64031832463a`,
retained (not cleaned up) per this session's authorized local-only
finalization plan.

**First action:** decide the publication path with the user — merging via
`origin/develop` is recommended over local `develop` to avoid the verified
divergence conflict (§6) — before running any push or merge.
