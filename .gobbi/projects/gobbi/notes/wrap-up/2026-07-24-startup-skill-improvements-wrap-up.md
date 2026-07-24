---
name: startup-skill-improvements-wrap-up
description: Wrap-up handoff for the startup skill's IP-1/IP-2/IP-3 improvements and whole-bundle scenario/checklist/evaluation SOP migration (install-runtime feature).
type: notes
scope: project
feature: null
status: active
created: 2026-07-24
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [wrap-up, memory]
keywords: [startup, install-runtime, ip1, ip2, ip3, whole-bundle-migration, promotion]
author: claude
features_touched: [install-runtime]
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [d11-cross-phase-contradiction-pass-ratified, d12-whole-bundle-sop-migration-locked, ip1-phase-doc-supplement-gate, ip2-nine-touchpoint-pacing-sweep, ip3-parent-scoped-evidence-led-probes, startup-skill-3-improvements-and-whole-bundle-sop-migration, evaluator-spawned-with-team-addressable-name, post-freeze-mutation-of-frozen-evaluation-input, zsh-exec-multidigit-fd-redirection-silent-fail, record-subagent-transcripts-not-copied, structured-enum-terminal-field-column-position, check-skill-mistakes-scope-label, t6-single-largest-task-sizing]
---

# Startup skill IP-1/IP-2/IP-3 + whole-bundle SOP migration — Wrap-up

## 1. Outcome and agreed scope

Improved the `startup` skill for the `install-runtime` feature: three improvement points (IP-1 — phase-
document supplement-and-gate; IP-2 — nine-touchpoint pacing-rule removal; IP-3 — parent-scoped evidence-led
follow-up probes), plus a user-adjudicated whole-bundle migration (D12) of the skill's entire grading bundle
(29 scenario families / 119 checklist checks → 30 families / 129 checks) onto gobbi's current
scenario/checklist SOP. Scope was locked at Ideation (D1-D16 design locks, six IP/D11/D12 decisions staged
this session) and decomposed into a nine-task plan at Planning
(`features/install-runtime/plans/workflow/2026-07-23-startup-skill-3-improvements-and-whole-bundle-sop-migration.md`).

## 2. Completed or shipped work, with artifact and verification evidence

Seven commits on branch `claude-2026-07-17-1245142c-0a76-4333-b2d3-6892a62eb359` (base `develop` @
`9f7898a3`), HEAD `6bcaef80`:

- `b4ab37a4` — IP-2: removed nine pacing touchpoints from `SKILL.md` + `topics.md` (T2).
- `3fbd8fc9` — IP-3: added evidence-led follow-up probes, reframed contrary clauses (T3).
- `c25af237` — IP-1: authored the phase-result-document contract in `recording.md` (T4).
- `280b36e9` — IP-1: wired phase-close gates + P4 synthesis + recap fold (T5).
- `801c6656` — whole-bundle: migrated `scenario.md` to the scenario SOP, added the PROJ-08 phase-doc family
  (T6).
- `ed26ee0b` — whole-bundle: migrated `checklist.md` to the checklist SOP + phase-doc grading checks (T7).
- `6bcaef80` — whole-bundle: migrated `evaluation.md` to the startup evaluation adapter + D16 reconciliation
  contract (T8).

T1 (inventory ledger) and T9 (losslessness proof) produced no source commit — their evidence is a
gitignored session working note (270-clause losslessness check, `semantic_diff=none` on 268 of 270 clauses,
zero live pacing rules remaining, zero surviving prohibition clauses, six-file lock verified, landing proof
run).

Verdicts: Ideation PASS@iter3 (dual-system); Preparation PASS@iter3 (user accept-with-deferral); Planning
PASS@iter3 (Claude-only per the Codex waiver below); Execution PASS@iter1 (Claude-only) plus the T9 capstone
proof described above.

## 3. Dual-system evaluation result, approved finding dispositions, and any waiver

**Degraded mode.** The user waived Codex for this session on 2026-07-18 (recorded in this Wrap-up's
`working/discussion-log.md`, section "Degraded note"). Planning iteration 2 onward, Execution, and this
Wrap-up ran Claude-only, each stamping a degraded-mode label. Pre-waiver Codex artifacts (Ideation,
Preparation, and Planning-iteration-1 evaluations, plus the Planning-iteration-2 fix proposal) remain valid
on-disk inputs and were read during this Wrap-up's own review.

Ideation reached PASS at iteration 3 under full dual-system evaluation (both Claude and Codex evaluators).
Planning and Execution reached PASS under the user-approved Claude-only waiver; no finding disposition from
either loop was overridden or applied without the recorded user/manager decision.

This Wrap-up's own Stage 1 (Validate & plan) surfaced two process observations, both disclosed to the user
and manager and resolved before Stage 2 proceeded (see the resolutions in `working/discussion-log.md` and
`working/promotion-manifest.md`):

- the pre-stage discussion-log's mistake-candidate register undercounted (said 5, actual staged-plus-
  described total was 8 — three additional staged candidates in `3-planning/staging/decisions/` were never
  enumerated); and
- `skills/wrap-up/compaction.md`, named in this Wrap-up's own Load Directives, does not exist on disk, and
  `memory-vocabulary.json` defines no `hardCap` value for any type/area — the always-count in §5 below ran
  with no over-cap gate to trip.

## 4. Decisions to respect

- D11/D12 and the six IP design locks are accepted decisions, not open — see
  `features/install-runtime/decisions/memory/2026-07-17-d11-cross-phase-contradiction-pass-ratified.md` and
  sibling files in the same directory.
- The nine-task, source-before-bundle, migrate-then-grade decomposition (kept-whole T6, not the alternative
  8-task re-slice) is locked — `features/install-runtime/decisions/workflow/2026-07-23-t6-keep-whole-adjudication.md`.
- The branch/PR is the atomic landing unit (not per-task commits) — `features/install-runtime/decisions/workflow/2026-07-23-per-task-commits-vs-landing-unit.md`.
- All 5+3=8 mistake-candidates from this session route to the project-level cross-cutting `mistakes/`
  tier (none skill-owned) — user-confirmed (W1, revised) and manager-confirmed (the newly-found three).

## 5. Durable memory promoted or superseded

55 non-mistake records promoted from this session's Ideation/Preparation/Planning staging into
`features/install-runtime/` (bootstrapped this Wrap-up, including its `README.md` identity doc):

- `decisions/` — 31 (10 `memory`, 2 `process`, 19 `workflow`)
- `checklists/` — 15 (1 `process`, 14 `workflow`)
- `references/` — 8 (`startup-prior-art`)
- `plans/` — 1 (`workflow`)

8 mistake-candidates promoted to the project `mistakes/` tier:

- 6 new records in `mistakes/verification/`: `evaluator-spawned-with-team-addressable-name`,
  `post-freeze-mutation-of-frozen-evaluation-input`, `record-subagent-transcripts-not-copied`,
  `structured-enum-terminal-field-column-position`, `check-skill-mistakes-scope-label`,
  `t6-single-largest-task-sizing`.
- 1 new record in `mistakes/tooling/`: `zsh-exec-multidigit-fd-redirection-silent-fail` (manager override
  of the tag-mechanical `verification` result — a deliberate shell-tooling classification).
- 1 consolidation, not a new file: `draft-integration-log-status-desync` was folded into the existing
  `mistakes/verification/manager-locked-decision-without-audit-trail-sync.md` as a new "Recurred
  2026-07-23" bullet under its `## How to detect` section (manager-confirmed) — no new file, no
  supersession, existing record's frontmatter untouched.

No supersession or archive move occurred this session. This note itself is the sole durable `notes/`
promotion (`notes/wrap-up/2026-07-24-startup-skill-improvements-wrap-up.md`).

**Post-promotion area counts (always-count; no `hardCap` configured — see §3):**

| Area | Count |
|---|---|
| `mistakes/assumption` | 14 |
| `mistakes/codex` | 10 |
| `mistakes/docs-sync` | 16 |
| `mistakes/refactor` | 9 |
| `mistakes/tooling` | 8 |
| `mistakes/verification` | 56 |
| `features/install-runtime/decisions/memory` | 10 |
| `features/install-runtime/decisions/process` | 2 |
| `features/install-runtime/decisions/workflow` | 19 |
| `features/install-runtime/checklists/process` | 1 |
| `features/install-runtime/checklists/workflow` | 14 |
| `features/install-runtime/references/startup-prior-art` | 8 |
| `features/install-runtime/plans/workflow` | 1 |

## 6. Pre-finalization Git state and authorized finalization plan

Branch `claude-2026-07-17-1245142c-0a76-4333-b2d3-6892a62eb359`, worktree
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-07-17-1245142c-0a76-4333-b2d3-6892a62eb359`,
HEAD `6bcaef80f5a9b9449ccf00d52d1b91a23329b4e5` (base `develop` @ `9f7898a3`). At the time this note was
written, this Wrap-up's promotion writes (64 new/changed files under `features/install-runtime/` and
`mistakes/`) were NOT yet committed — they exist as uncommitted worktree changes pending PASS RECORD.

Authorized finalization plan (user W2, this Wrap-up's discussion-log): after PASS RECORD, the manager
creates a verified local commit for the promotion, pushes the branch, and opens a pull request to
`develop` for user review. The user reviews and merges; the manager does not merge.

## 7. Unresolved, blocked, or deferred items with explicit reasons

None blocking. Two open findings from Ideation (`f-str3-001-set-placement-reason-gaming-symmetry`,
`semantic-union-relation-level-equivalence`, both `status: proposed`) remain promoted as open decisions in
`features/install-runtime/decisions/` for a future session to close or accept as-is — they did not block
this session's PASS verdicts and carry their own `related:` links to the mistakes/decisions that motivated
them.

## 8. Known risks and accepted exceptions

- **Degraded mode accepted by the user** (2026-07-18): Planning iteration 2+, Execution, and this Wrap-up
  ran Claude-only. The user explicitly waived Codex; no dual-system safety gate was silently bypassed.
- **Missing `compaction.md`**: this Wrap-up's Load Directives named `skills/wrap-up/compaction.md`, which
  does not exist on disk. The manager directed skipping the compaction sub-procedure and doing the
  always-count only (§5 table above). This is a process gap in the `wrap-up` skill's own file set, not a
  gap in this session's promoted content — flagged here for a future session to either author the missing
  file or remove the dangling reference from `wrap-up/SKILL.md`'s Load Directives guidance.
- **Discussion-log mistake-candidate undercount**: the pre-stage discussion-log said "5 total" mistake-
  candidates; the actual count (staged + described) was 8. Resolved this session (user + manager), but the
  undercount itself suggests the pre-stage synthesis step should recursively `grep -rl "mistake-candidate:
  true"` across every staging root rather than relying on a manually-maintained register.

## 9. Exact next-session start point: objective, required reads, current branch/worktree state, and first action

**Objective**: none queued — this feature's IP-1/IP-2/IP-3 + whole-bundle migration is complete pending
user PR review and merge.

**Required reads** (if resuming this branch): this note; `features/install-runtime/README.md`; the two
open decisions in §7 above if picking up that thread.

**Branch/worktree state**: branch `claude-2026-07-17-1245142c-0a76-4333-b2d3-6892a62eb359` at worktree
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-07-17-1245142c-0a76-4333-b2d3-6892a62eb359`,
HEAD `6bcaef80`, with this Wrap-up's promotion writes present but uncommitted, pending PASS RECORD and the
manager's authorized commit.

**First action**: manager creates the verified local commit for the promotion writes, then executes the
authorized finalization plan in §6 (push + open PR to `develop`).
