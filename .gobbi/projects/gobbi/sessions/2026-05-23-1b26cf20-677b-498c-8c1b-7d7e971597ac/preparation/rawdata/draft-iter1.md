# Preparation iter1 — Canonical Draft

Phase: preparation
Iter: 1
Verdict (pending EVALUATION): WORK complete
Bundle: `session-foundations-bundle-b` (T1 worktree-first session architecture + NEW absorbed; T3 PostToolUse hook + reconstructor; T2 deferred mid-Ideation)

---

## Scope reference

Canonical Ideation output (PASS iter3): `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/artifacts/bundle-b-ideation-pass.md`

Scope Contract — in-scope:
- T1 — worktree-first session architecture with NEW (Preparation `generate-now` symlink commit-on-worktree-branch) absorbed.
- T3 — `session.json.agents[]` PostToolUse hook + shell-script reconstructor.

Scope Contract — out-of-scope: T2 (skill-loading-discipline matrix) deferred; Codex CI dual-system; Auto-mode silence vs Always-Ask; chat-mode tiki-taka; Item 1-3 alternatives; Item 1-2 broader verifier; `session.template.json.agents[]` status field schema extension; `.gobbi/project.json` bootstrap.

Decisions locked at Ideation (15 items in the Decisions Log table of the Ideation artifact) include CP-1.3-γ (worktree-first uniform), CP-NEW-β (NEW collapses to 2-line commit), CP-4.1-α (PostToolUse hook + reconstructor), CP-4.1-β (tool_input + tool_result + transcript_path all received), iter3 Fix A branch prefix `chore/session-{date}-{ssid-short}`, Fix B PostToolUseFailure verbatim verified, Fix C `.gobbi/project.json` dormant precondition flagged + backlogged.

Sub-step A → D findings (this loop's investigation evidence): `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/rawdata/sub-steps-a-d-iter1.md`.

---

## Readiness summary

9 gaps consolidated across Sub-steps B (memory readiness, 7 items) and C (skills readiness, 3 candidate skills) into the Sub-step D resolution table. User confirmed all 9 resolutions via AskUserQuestion (two rounds, including the additional mirror-propagation-policy lock raised in round 2). Net split:

- **2 generate-now** — D-3 (Planning brief Load Directives must cite 3 specific mistakes for every T1 task) + D-4 (stage a tiny design file enumerating the 5 workflow phase docs targeted by T1-I-T1.f per-iter cadence rule).
- **3 defer-to-backlog** — D-2 (no hooks-domain mistakes yet; capture mid-Execution) + D-6 (aggregated session-lifecycle / worktree-boundaries project design doc post-T1) + D-7 (`gobbi-hook-authoring` project skill, witness-accumulation cadence — generate when N=2 hook scripts exist).
- **4 skip** — D-1 (feature dir bootstrap deferred to Wrap-up) + D-5 (`.claude/scripts/` directory created at executor time via `mkdir -p`) + D-8 (no separate `gobbi-session-architecture` skill — T1 edits ARE the codification) + D-9 (no `gobbi-shell-script-conventions` skill at N=1).
- **0 re-Ideate.** No Ideation contradiction surfaced. The Scope Contract is workable.

Specific items empirical check: 8/8 verified (see Sub-step A → D findings § Specific items check). One minor brief-text imprecision noted on `session.template.json` canonical path (it lives at `.claude/skills/orchestration/templates/`, not `.claude/templates/`) — flagged for Planning brief citations.

Mirror propagation policy locked (round-2 user lock): **workspace `.claude/skills/` is canonical; project mirror `.gobbi/projects/gobbi/skills/` derives via auto-sync**. Sync mechanism check (this WORK phase) found **no auto-sync mechanism currently exists** (no `.claude/scripts/`, no sync script, no sync-triggering hook) — conditional backlog staged at `staging/backlogs/project/workspace-to-mirror-sync-mechanism.md`. Until mechanism ships, Bundle B executors editing T1 surfaces must manually mirror-edit (recommended for T1 because its edits are load-bearing).

---

## Per-category readiness

### Design readiness

| Item | Status | Note |
|---|---|---|
| Ideation `staging/design/` | Present | 11 design staging files cover D-1 through D-3-6 plus T1 / T3 surface families. |
| Ideation `staging/decisions/` | Present | 9 decision staging files cover the locked Decisions Log table. |
| Ideation `staging/scenarios/` | Present | 2 scenario staging files cover T1 (G-1 / G-2 / E-1 / E-2 / E-3 / F-1 / F-2 / F-3 / F-4) and T3 (G-1 / G-2 / E-1 / E-5 / F-1). |
| Ideation `staging/checklists/` | Present | 9 checklist files. |
| Ideation `staging/references/` | Present | 12 external references including T1-E-1 / T1-E-2 / T1-E-4 (worktree pattern) and T3-E-1 / T3-E-5 (PostToolUse hook + PostToolUseFailure verbatim). |
| Ideation `staging/backlogs/` | Present | Feature-level (2 items) and project-level (multiple items) per Deferred section of Scope Contract. |
| Workflow phase doc set for T1-I-T1.f cadence (5 files) | **Newly staged this loop** | `staging/design/workflow-phase-doc-set-for-per-iter-cadence.md` enumerates the 5 paths explicitly. Resolves Sub-step B gap B-G6 / D-4. |
| Aggregated session-lifecycle / worktree-boundaries project design doc | Deferred | Backlog item `staging/backlogs/project/session-lifecycle-worktree-boundaries-design-doc.md`. Resolves Sub-step B gap B-G3 / D-6. |
| `.claude/scripts/` directory pre-creation | Skipped | Executor `mkdir -p` is part of T3-I-T3.b. Resolves Sub-step B gap B-G7 / D-5. |

### Memory readiness

| Item | Status | Note |
|---|---|---|
| `features/session-foundations-bundle-b/` dir | Absent — expected | Wrap-up bootstraps from staged backlogs/feature/* + decisions at promotion time. Resolves Sub-step B gap B-G1 / D-1. |
| Feature-level staged backlogs (`agents[]` status field; `.gobbi/project.json` bootstrap) | Already staged in Ideation | Sub-step B gap B-G2 — no action needed. |
| Hooks-domain mistakes (`hooks` tag in `.gobbi/projects/gobbi/mistakes/`) | Absent — by design (no witnesses yet) | Backlog item `staging/backlogs/project/hooks-domain-mistakes-watchlist.md` reminds future sessions to capture mid-Execution. Resolves Sub-step B gap B-G4 / D-2. |
| Worktree / session-mechanics mistakes — Planning brief cite | **Newly staged this loop** | `staging/decisions/planning-brief-mistake-load-directives-for-t1.md` binds Planning to cite 3 specific existing mistakes in every T1 task brief's Load Directives tier 4. Resolves Sub-step B gap B-G5 / D-3. |
| All 8 existing project mistakes | Read | See Sub-step A → D findings § Adversarial-mode scan § Mistakes flagged for Execution awareness for the per-mistake relevance ratings. |

### Skills readiness

| Item | Status | Note |
|---|---|---|
| Workspace skills required for T1 / T3 (`git`, `delegation`, `execution`, `claude`, `orchestration`, `preparation`, `gobbi`, `memorization`, `principles`, `mistake`) | All present at `.claude/skills/` | Verified via `ls`. The project mirror at `.gobbi/projects/gobbi/skills/` is also present (17 dirs) but downstream-of-canonical per the mirror policy lock. |
| `gobbi-hook-authoring` project skill | Not generated this loop — deferred | Witness count is N=1 (only `session-start.sh` exists); waits for N=2 (post-T3 ship). Backlog `staging/backlogs/project/gobbi-hook-authoring-skill.md`. Resolves Sub-step C Candidate 1 / D-7. |
| `gobbi-session-architecture` project skill | Skipped | T1's own edits to `orchestration/SKILL.md` / `git/SKILL.md` / `preparation/SKILL.md` / `gobbi/SKILL.md` ARE the codification — a separate skill would duplicate. Resolves Sub-step C Candidate 2 / D-8. |
| `gobbi-shell-script-conventions` project skill | Skipped | N=1; codify via script header comments. Re-evaluate at N≥2. Resolves Sub-step C Candidate 3 / D-9. |

---

## Generated this loop

The following session-staging artifacts were created during this WORK phase. Wrap-up will promote them to project memory after the workflow completes (mistake-candidates and skill files have narrower paths per the routing tables in `memorization/SKILL.md` and `wrap-up/SKILL.md`; the entries below are this loop's outputs).

- **D-3 — Planning brief mistake-load-directives decision**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/decisions/planning-brief-mistake-load-directives-for-t1.md`
  - Template: `decisions.md` (memorization templates)
  - Body: enumerates the 3 mistake files Planning MUST cite in tier 4 of Load Directives for every T1 task brief (`codex-eval-session-write-path-nested-in-worktree.md`, `manager-rm-rf-without-investigating-tracked-files.md`, `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`).

- **D-4 — Workflow phase doc set staging design file**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/design/workflow-phase-doc-set-for-per-iter-cadence.md`
  - Template: `design.md` (memorization templates)
  - Body: enumerates the 5 workflow phase docs that T1-I-T1.f targets — `ideation.md`, `preparation.md`, `planning.md`, `execution.md`, `wrap-up.md` under `.claude/skills/orchestration/workflow/`. Each must gain the per-iter commit cadence rule per D-4 lock.

- **Mirror propagation policy decision**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/decisions/mirror-propagation-policy-workspace-canonical.md`
  - Template: `decisions.md` (memorization templates)
  - Body: workspace `.claude/skills/` is canonical; project mirror auto-syncs. Cites round-2 AskUserQuestion exchange.

---

## Deferred

The following gap-resolutions stage as project-level backlogs. Wrap-up promotes them to `.gobbi/projects/gobbi/backlogs/`.

- **D-2 — Hooks-domain mistakes watchlist**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/backlogs/project/hooks-domain-mistakes-watchlist.md`
  - Body: hooks domain is new (T3 introduces the 2nd hook); no retrospective mistakes; capture mid-Execution as they emerge per `mistake/SKILL.md` P2. Effort: ad-hoc per execution session. Pick-up triggers: N≥2 hooks-domain mistakes accumulate OR 3rd hook author proposes a new hook.

- **D-6 — Aggregated session-lifecycle / worktree-boundaries design doc**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/backlogs/project/session-lifecycle-worktree-boundaries-design-doc.md`
  - Body: aggregate T1's distributed edits into a single project-level design doc at `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md`. Effort: medium. Pick-up trigger: after T1 ships AND N=2 sessions have exercised the worktree-first pattern end-to-end.

- **D-7 — `gobbi-hook-authoring` project skill**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/backlogs/project/gobbi-hook-authoring-skill.md`
  - Body: project skill codifying bash + jq + flock + strict-mode + guards pattern. Effort: medium. Pick-up trigger: T3 ships and `post-tool-use-agents.sh` is exercised by ≥1 real session (N=2 witness pattern; matches Bundle A design-item-e cadence).

- **Conditional sync-mechanism backlog (new this loop)**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/backlogs/project/workspace-to-mirror-sync-mechanism.md`
  - Body: empirical check found no auto-sync mechanism (no `.claude/scripts/`, no sync script, no hook). Until mechanism ships, Bundle B executors editing T1 surfaces must manually mirror-edit (Option a) per the interim discipline section. Three implementation options listed; `gobbi sync` CLI + git pre-commit recommended. Effort: medium.

---

## Skipped

The following gap-resolutions require no action this loop. User confirmed via the AskUserQuestion batched-skip card (Card 6-9).

- **D-1 — Feature dir `features/session-foundations-bundle-b/` not pre-created.** Rationale: Wrap-up creates the directory during staging → project promotion. Planning + Execution do not need it pre-created. Reading existing feature dirs at Sub-step A confirmed `env-var-audit` and `gobbi-orchestration-workflow-improvements` are present (the latter is Bundle A — closely related prior session) and the new bundle's dir does not yet exist (expected).

- **D-5 — `.claude/scripts/` directory not pre-created.** Rationale: T3-I-T3.b (create `.claude/scripts/reconstruct-agents.sh`) is the moment the directory needs to exist; executor `mkdir -p .claude/scripts/` is part of that task. Empirical confirmation: `ls .claude/scripts/` returns ENOENT today.

- **D-8 — No separate `gobbi-session-architecture` project skill.** Rationale: T1's edits to `orchestration/SKILL.md` (row 5.5), `git/SKILL.md:33` (qualified rule), `preparation/SKILL.md` (narrow-exception extension), and `gobbi/SKILL.md` (Session Bootstrap Order cross-reference) **ARE the codification** of the worktree-first session-architecture pattern. Adding a separate project skill would duplicate the load-bearing surfaces and create a 2-source-of-truth drift risk. The workspace `orchestration/SKILL.md` is the post-T1 session-architecture authority.

- **D-9 — No `gobbi-shell-script-conventions` project skill at N=1.** Rationale: only one occupant of `.claude/scripts/` exists post-T3 (`reconstruct-agents.sh`). Single-witness skill extraction is Principle 10 violation. Re-evaluate at N≥2 (when a third script enters `.claude/scripts/`). Codify the conventions in the script's own header comments meanwhile.

---

## Mirror propagation policy (NEW — user locked)

User-locked decision (Preparation iter1 Sub-step D round 2): **workspace `.claude/skills/` is the canonical source-of-truth. The project mirror at `.gobbi/projects/gobbi/skills/` derives from it via an auto-sync mechanism.**

Rationale: the Claude Code session loader reads from `.claude/skills/` at runtime; making that tree canonical aligns the read-path and the edit-path. Maintaining two equal-authority trees doubles every edit and creates persistent drift risk; with workspace-canonical the drift problem reduces to a one-direction sync (mechanical) rather than a two-direction reconciliation (judgmental).

**Empirical check (this WORK phase):**

- `ls -la /playinganalytics/git/gobbi/.claude/scripts/` → directory absent.
- `grep -rln -E "sync.*mirror|mirror.*sync" /playinganalytics/git/gobbi/.claude/ /playinganalytics/git/gobbi/.gobbi/` → no script or documented procedure found.
- `.claude/settings.json` `hooks` block → contains only `SessionStart` → `session-start.sh`. No sync-triggering hook.
- `.gobbi/projects/gobbi/skills/` is 17 real directories, NOT symlinks.

**Conclusion: no auto-sync mechanism currently exists.** This is captured at `staging/backlogs/project/workspace-to-mirror-sync-mechanism.md` (a new conditional backlog staged this loop).

**Implication for Bundle B Execution (interim discipline until mechanism ships):**

Every Bundle B executor task touching `.claude/skills/*` must do one of:

- **(a) Manually mirror-edit** — when editing a workspace file, also edit the corresponding mirror file in the same task. Verify both touched via `git diff`. **Recommended for Bundle B** because T1's edits are load-bearing session-architecture rules and mirror drift would silently misalign downstream consumers.
- **(b) Flag mirror drift as a known risk** — explicitly note in the task's verification report that the workspace was edited and the mirror was deliberately not synced this iteration. The drift accumulates as a known-debt entry.

Planning task briefs for T1 SHOULD include the mirror-edit requirement (option a) explicitly. The decision file `staging/decisions/mirror-propagation-policy-workspace-canonical.md` carries the full Context / Decision / Rationale / Alternatives / Consequences chain for permanent record.

---

## Decisions log

The 15 decisions below capture every AskUserQuestion outcome from this Preparation loop plus the gap-resolution map. Chronological order (round 1 → round 2):

| # | Decision | Source | Outcome |
|---|---|---|---|
| 1 | Sub-step A advance — Ideation output sound enough to proceed | Sub-step A confirmation | User approved advance (no re-Ideate). |
| 2 | Gap D-1 — feature dir pre-create | Sub-step D, Card 6-9 batched-skip | **Skip.** Wrap-up bootstraps. |
| 3 | Gap D-2 — hooks-domain mistakes | Sub-step D, Card 4 | **Defer to backlog.** Capture mid-Execution. → `staging/backlogs/project/hooks-domain-mistakes-watchlist.md`. |
| 4 | Gap D-3 — adjacent mistakes Planning brief cite | Sub-step D, Card 1 | **Generate-now (annotation only).** Bind Planning to cite 3 mistakes in every T1 task brief. → `staging/decisions/planning-brief-mistake-load-directives-for-t1.md`. |
| 5 | Gap D-4 — workflow phase doc set enumeration | Sub-step D, Card 2 | **Generate-now (staging design file).** Stage the 5-file list. → `staging/design/workflow-phase-doc-set-for-per-iter-cadence.md`. |
| 6 | Gap D-5 — `.claude/scripts/` directory pre-create | Sub-step D, Card 6-9 batched-skip | **Skip.** Executor `mkdir -p` at T3-I-T3.b. |
| 7 | Gap D-6 — aggregated session-lifecycle design doc | Sub-step D, Card 5 | **Defer to backlog.** Post-T1 + N=2 sessions. → `staging/backlogs/project/session-lifecycle-worktree-boundaries-design-doc.md`. |
| 8 | Gap D-7 — `gobbi-hook-authoring` project skill timing | Sub-step D, Card 3 | **Defer to backlog.** Generate post-T3 ship at N=2 witness count. → `staging/backlogs/project/gobbi-hook-authoring-skill.md`. |
| 9 | Gap D-8 — separate `gobbi-session-architecture` skill | Sub-step D, Card 6-9 batched-skip | **Skip.** T1 edits ARE the codification. |
| 10 | Gap D-9 — `gobbi-shell-script-conventions` skill | Sub-step D, Card 6-9 batched-skip | **Skip.** N=1 trap; re-evaluate at N≥2. |
| 11 | Mirror propagation policy lock | Sub-step D round 2 (post-base-9 AskUserQuestion) | **Workspace canonical only — mirror auto-syncs.** → `staging/decisions/mirror-propagation-policy-workspace-canonical.md`. |
| 12 | Sync-mechanism check outcome (this WORK phase, empirical) | WORK phase sync-mechanism scan | **No auto-sync mechanism exists.** → conditional backlog staged at `staging/backlogs/project/workspace-to-mirror-sync-mechanism.md`. Interim discipline: manual mirror-edit recommended for Bundle B T1 surfaces. |
| 13 | All `generate-now` artifacts produced | WORK Step 7 verification | 5 staging files: D-3 decision, D-4 design, D-2 backlog, D-6 backlog, D-7 backlog + mirror-policy decision + sync-mechanism backlog (conditional) = 7 total. |
| 14 | No re-Ideate triggers | Sub-step D summary | All 9 base gaps resolved without re-Ideate. Scope Contract is workable. |
| 15 | Brief-text imprecision flagged | Sub-step A → D findings § Specific items check item #2 | `session.template.json` lives at `.claude/skills/orchestration/templates/session.template.json` (not `.claude/templates/...`). Planning briefs must cite the correct path. |

---

## Out of scope gaps

(Per `preparation/SKILL.md` § WORK discipline — items that surfaced but are not absorbed.)

- **`session.template.json.agents[]` status field schema extension.** Already deferred to feature-level backlog at Ideation `staging/backlogs/feature/schema-extension-agents-status-field.md`. Not absorbed this loop.
- **`.gobbi/project.json` bootstrap.** Already deferred to feature-level backlog at Ideation `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md`. The D-3-3-resolver step (ii) directory-scan is the currently active path.
- **Memory Access Matrix clarification across skills.** Multiple skills' Memory Access Matrix sections treat both `.claude/skills/` and `.gobbi/projects/gobbi/skills/` as project memory. Under the new mirror-policy lock the language drifts (mirror is now derived, not authoritative). A future cleanup pass should disambiguate. Not in Bundle B scope; capture as informal follow-up only.
- **T2 — skill-loading-discipline matrix + Load-Directives validator.** Deferred mid-Ideation per the Scope Contract; backlog already at `staging/backlogs/project/item-1-2-skill-loading-discipline.md`.

---

## Notes for Planning intake

(Carried forward from Sub-step A → D findings § Notes for Planning intake — preserved here so Planning has them in the canonical Preparation output.)

- **Path correction**: Planning task briefs touching `session.template.json` must cite `.claude/skills/orchestration/templates/session.template.json` (NOT `.claude/templates/session.template.json` — that path does not exist).
- **Mirror awareness**: per the new mirror-policy lock, Planning task briefs for T1 surface edits should include the interim manual-mirror-edit requirement (Option a from the sync-mechanism backlog) until the sync mechanism ships.
- **Iron Law 7 procedural reminder**: Manager constructing Planning task briefs for this bundle MUST Read the Ideation artifact freshly when authoring any "verbatim" instruction (per `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`). Memory-only briefs from the 553-line Ideation rawdata will drift.
- **T1 task brief Load Directives tier 4 must cite 3 specific mistakes** (per `staging/decisions/planning-brief-mistake-load-directives-for-t1.md`). Planning evaluator can mechanically grep each T1 brief for the three file basenames.
- **Bundle A handoff anchor**: `notes/2026-05-23-orch-workflow-improvements.md` "Open items carried" explicitly cites this bundle's items (1-3 + 4-1) as deferred — Bundle B is the planned successor; no surprise re-litigation needed.

---

## WORK exit checklist

- [x] All required sections populated (Scope reference / Readiness summary / Per-category readiness / Generated this loop / Deferred / Skipped / Mirror propagation policy / Decisions log).
- [x] No `TODO` / `TBD` / `<...>` placeholders.
- [x] Every `generate-now` decision has a corresponding staging artifact (D-3, D-4, mirror policy).
- [x] Every `defer` decision is recorded with backlog staging path (D-2, D-6, D-7 + conditional sync-mechanism).
- [x] Every `skip` decision is recorded in Skipped section with rationale (D-1, D-5, D-8, D-9).
- [x] Decisions Log cites every AskUserQuestion outcome (15 rows).
- [x] No writes to project memory (`features/...` or top-level project dirs) — all artifacts in `sessions/.../preparation/staging/`.
- [x] No new content beyond DISCUSSION-approved.
- [x] Sync-mechanism check executed empirically; conditional backlog stamped because mechanism is absent.
