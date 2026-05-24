# Preparation iter2 — Canonical Draft

Phase: preparation
Iter: 2
Verdict (pending EVALUATION): WORK complete (surgical correction round)
Bundle: `session-foundations-bundle-b` (T1 worktree-first session architecture + NEW absorbed; T3 PostToolUse hook + reconstructor; T2 deferred mid-Ideation)

iter2 entry mode: FAIL re-entry from iter1 (Claude FAIL + Codex REVISE on mirror-policy false premise). User re-locked the policy on corrected empirical evidence. iter2 budget: 1 of 2 remaining (max 3). This draft preserves iter1 substance and applies only the 5 surgical fixes specified in the iter2 brief.

---

## Scope reference

Canonical Ideation output (PASS iter3): `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/artifacts/bundle-b-ideation-pass.md`

Scope Contract — in-scope:
- T1 — worktree-first session architecture with NEW (Preparation `generate-now` symlink commit-on-worktree-branch) absorbed.
- T3 — `session.json.agents[]` PostToolUse hook + shell-script reconstructor.

Scope Contract — out-of-scope: T2 (skill-loading-discipline matrix) deferred; Codex CI dual-system; Auto-mode silence vs Always-Ask; chat-mode tiki-taka; Item 1-3 alternatives; Item 1-2 broader verifier; `session.template.json.agents[]` status field schema extension; `.gobbi/project.json` bootstrap.

Decisions locked at Ideation (15 items in the Decisions Log table of the Ideation artifact) include CP-1.3-γ (worktree-first uniform), CP-NEW-β (NEW collapses to 2-line commit), CP-4.1-α (PostToolUse hook + reconstructor), CP-4.1-β (tool_input + tool_result + transcript_path all received), iter3 Fix A branch prefix `chore/session-{date}-{ssid-short}`, Fix B PostToolUseFailure verbatim verified, Fix C `.gobbi/project.json` dormant precondition flagged + backlogged.

Sub-step A → D findings (this loop's investigation evidence): `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/rawdata/sub-steps-a-d-iter1.md`. (iter1 Sub-step A → D outputs remain valid; iter2 does NOT re-do them per the iter2 brief's scope.)

---

## Readiness summary

iter1 produced 9 base gaps + 1 mirror-propagation policy lock. iter2 corrects the mirror-propagation lock's empirical premise and re-applies it; all other iter1 decisions stand.

iter1 net split (unchanged):

- **2 generate-now** — D-3 (Planning brief Load Directives must cite 3 specific mistakes for every T1 task) + D-4 (stage a tiny design file enumerating the 5 workflow phase docs targeted by T1-I-T1.f per-iter cadence rule). The D-4 design file is **updated in iter2** to add the "Excluded files + rationale" section (Fix 5) clarifying the 5-vs-7 ambiguity flagged by both evaluators.
- **3 defer-to-backlog** — D-2 (no hooks-domain mistakes yet; capture mid-Execution) + D-6 (aggregated session-lifecycle / worktree-boundaries project design doc post-T1) + D-7 (`gobbi-hook-authoring` project skill, witness-accumulation cadence — generate when N=2 hook scripts exist).
- **4 skip** — D-1 (feature dir bootstrap deferred to Wrap-up) + D-5 (`.claude/scripts/` directory created at executor time via `mkdir -p`) + D-8 (no separate `gobbi-session-architecture` skill — T1 edits ARE the codification) + D-9 (no `gobbi-shell-script-conventions` skill at N=1).
- **0 re-Ideate.** No Ideation contradiction surfaced. The Scope Contract is workable.

iter2 net deltas vs iter1:

- **Mirror-propagation lock corrected** — iter1's "workspace canonical, mirror auto-syncs" lock was based on an incomplete empirical scan (directory-level only). Iter2 re-verification found 53 file-level symlinks under `.claude/skills/` pointing into `.gobbi/projects/gobbi/skills/`. The user re-locked via round-2 AskUserQuestion: **"mirror canonical, workspace = symlink runtime layer; no sync needed."** Both paths resolve to the same physical file. New decision file: `staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`. iter1's decision file marked `status: superseded` with `superseded_by` pointer (audit trail preserved).
- **Sync-mechanism backlog closed as moot** — the symlink layer IS the sync mechanism. No new mechanism needed; no interim manual-mirror-edit discipline needed. iter1 backlog file marked `status: superseded` with moot reason in body.
- **D-4 design file clarified** — both evaluators flagged that `workflow/` has 7 files (5 loop + `evaluation.md` + `memorization.md`) while D-4 only enumerates 5. Fix 5 appends "Excluded files + rationale" section explaining: the per-iter commit cadence applies at the LOOP level (each loop's MEMORIZATION emits the commit); sub-phase docs `evaluation.md` and `memorization.md` don't have iters themselves, so they are correctly excluded from T1-I-T1.f's targeted set.

Specific items empirical check (iter1, unchanged): 8/8 verified. One minor brief-text imprecision noted on `session.template.json` canonical path (it lives at `.claude/skills/orchestration/templates/`, not `.claude/templates/`) — flagged for Planning brief citations. iter2 re-check: no new specific items emerged.

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
| Workflow phase doc set for T1-I-T1.f cadence (5 files + 2 excluded sub-phase docs documented) | **Newly staged iter1 / updated iter2** | `staging/design/workflow-phase-doc-set-for-per-iter-cadence.md` enumerates the 5 paths explicitly AND now includes the "Excluded files + rationale" section for `evaluation.md` + `memorization.md`. Resolves Sub-step B gap B-G6 / D-4 + iter1-evaluator 5-vs-7 flag. |
| Aggregated session-lifecycle / worktree-boundaries project design doc | Deferred | Backlog item `staging/backlogs/project/session-lifecycle-worktree-boundaries-design-doc.md`. Resolves Sub-step B gap B-G3 / D-6. |
| `.claude/scripts/` directory pre-creation | Skipped | Executor `mkdir -p` is part of T3-I-T3.b. Resolves Sub-step B gap B-G7 / D-5. |

### Memory readiness

| Item | Status | Note |
|---|---|---|
| `features/session-foundations-bundle-b/` dir | Absent — expected | Wrap-up bootstraps from staged backlogs/feature/* + decisions at promotion time. Resolves Sub-step B gap B-G1 / D-1. |
| Feature-level staged backlogs (`agents[]` status field; `.gobbi/project.json` bootstrap) | Already staged in Ideation | Sub-step B gap B-G2 — no action needed. |
| Hooks-domain mistakes (`hooks` tag in `.gobbi/projects/gobbi/mistakes/`) | Absent — by design (no witnesses yet) | Backlog item `staging/backlogs/project/hooks-domain-mistakes-watchlist.md` reminds future sessions to capture mid-Execution. Resolves Sub-step B gap B-G4 / D-2. |
| Worktree / session-mechanics mistakes — Planning brief cite | **Newly staged iter1** | `staging/decisions/planning-brief-mistake-load-directives-for-t1.md` binds Planning to cite 3 specific existing mistakes in every T1 task brief's Load Directives tier 4. Resolves Sub-step B gap B-G5 / D-3. |
| All 8 existing project mistakes | Read | See Sub-step A → D findings § Adversarial-mode scan § Mistakes flagged for Execution awareness for the per-mistake relevance ratings. |

### Skills readiness

| Item | Status | Note |
|---|---|---|
| Workspace skills required for T1 / T3 (`git`, `delegation`, `execution`, `claude`, `orchestration`, `preparation`, `gobbi`, `memorization`, `principles`, `mistake`) | All present at `.claude/skills/` (resolve via symlinks into `.gobbi/projects/gobbi/skills/`) | Verified via `ls` + iter2 `find -type l` (53 file-level symlinks confirm topology). Mirror IS canonical; workspace is the symlink runtime layer. |
| `gobbi-hook-authoring` project skill | Not generated this loop — deferred | Witness count is N=1 (only `session-start.sh` exists); waits for N=2 (post-T3 ship). Backlog `staging/backlogs/project/gobbi-hook-authoring-skill.md`. Resolves Sub-step C Candidate 1 / D-7. |
| `gobbi-session-architecture` project skill | Skipped | T1's own edits to `orchestration/SKILL.md` / `git/SKILL.md` / `preparation/SKILL.md` / `gobbi/SKILL.md` ARE the codification — a separate skill would duplicate. Resolves Sub-step C Candidate 2 / D-8. |
| `gobbi-shell-script-conventions` project skill | Skipped | N=1; codify via script header comments. Re-evaluate at N≥2. Resolves Sub-step C Candidate 3 / D-9. |

---

## Generated this loop

The following session-staging artifacts were created during the iter1 + iter2 WORK phases. Wrap-up will promote them to project memory after the workflow completes (mistake-candidates and skill files have narrower paths per the routing tables in `memorization/SKILL.md` and `wrap-up/SKILL.md`; the entries below are this loop's outputs).

iter1 outputs (unchanged in iter2):

- **D-3 — Planning brief mistake-load-directives decision**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/decisions/planning-brief-mistake-load-directives-for-t1.md`
  - Template: `decisions.md` (memorization templates)
  - Body: enumerates the 3 mistake files Planning MUST cite in tier 4 of Load Directives for every T1 task brief (`codex-eval-session-write-path-nested-in-worktree.md`, `manager-rm-rf-without-investigating-tracked-files.md`, `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`).

- **D-4 — Workflow phase doc set staging design file** (updated iter2 — see Fix 5)
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/design/workflow-phase-doc-set-for-per-iter-cadence.md`
  - Template: `design.md` (memorization templates)
  - Body: enumerates the 5 workflow phase docs that T1-I-T1.f targets — `ideation.md`, `preparation.md`, `planning.md`, `execution.md`, `wrap-up.md` under `.claude/skills/orchestration/workflow/`. Each must gain the per-iter commit cadence rule per D-4 lock. **iter2 addition**: "Excluded files + rationale" section explains why `evaluation.md` + `memorization.md` are NOT in the targeted set (sub-phase docs, no iter cadence of their own).

iter2 outputs (new this iter):

- **Mirror propagation policy decision (CORRECTED LOCK — new file)**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`
  - Template: `decisions.md` (memorization templates)
  - Body: mirror at `.gobbi/projects/gobbi/skills/` IS canonical; workspace `.claude/skills/` is the symlink runtime layer; both paths resolve to the same physical file via 53 file-level symlinks; Planning briefs can cite either path (prefer the workspace path for runtime-loadability discoverability); no sync mechanism needed. Empirical evidence: `find .claude/skills/ -type l -name "*.md" | wc -l` → 53 (run 2026-05-24, this leader); sample `.claude/skills/orchestration/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md`. Cites iter2 round-2 user lock.
  - Frontmatter: `status: accepted`, `supersedes: mirror-propagation-policy-workspace-canonical.md`.

iter2 modifications (audit-trail supersessions, no deletion):

- **Mirror propagation policy decision (iter1 — superseded in place)**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/decisions/mirror-propagation-policy-workspace-canonical.md`
  - iter2 change: frontmatter `status: superseded` + `superseded_by: mirror-propagation-policy-mirror-canonical-symlinks.md`; body appended with "## Supersession reason" explaining incomplete iter1 empirical evidence, the 53 symlink correction, and the user re-lock. iter1 body preserved verbatim above the supersession note for audit.

- **Sync-mechanism backlog (iter1 — superseded as moot in place)**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/backlogs/project/workspace-to-mirror-sync-mechanism.md`
  - iter2 change: frontmatter `status: superseded` + `superseded_by: "no superseding file; backlog is closed as moot per iter2 corrected lock"`; body appended with "## Moot reason" explaining that the symlink layer IS the sync mechanism, no new mechanism is needed, all three "Suggested approach" options are obsolete, and the interim mirror-edit discipline is rescinded. iter1 body preserved verbatim above the moot note for audit.

- **D-4 design file (iter1 — updated in place per Fix 5)**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/design/workflow-phase-doc-set-for-per-iter-cadence.md`
  - iter2 change: frontmatter `status: updated-iter2`; added `decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` to `related:`; replaced the stale "manual mirror-edit OR flag drift" passage in the Approach section with the corrected statement (both paths are the same file); added "Excluded files + rationale" section enumerating `evaluation.md` + `memorization.md` with the LOOP-level cadence rationale + a recommended grep verification gate for Planning. iter1 body preserved.

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

- **~~Conditional sync-mechanism backlog~~ (CLOSED AS MOOT iter2)**
  - Path: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/backlogs/project/workspace-to-mirror-sync-mechanism.md` (file preserved, `status: superseded` as moot)
  - Reason: the symlink layer IS the sync mechanism. No mechanism to build. See file body's "## Moot reason" section + `decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`.

---

## Skipped

The following gap-resolutions require no action this loop. User confirmed via the AskUserQuestion batched-skip card (Card 6-9).

- **D-1 — Feature dir `features/session-foundations-bundle-b/` not pre-created.** Rationale: Wrap-up creates the directory during staging → project promotion. Planning + Execution do not need it pre-created. Reading existing feature dirs at Sub-step A confirmed `env-var-audit` and `gobbi-orchestration-workflow-improvements` are present (the latter is Bundle A — closely related prior session) and the new bundle's dir does not yet exist (expected).

- **D-5 — `.claude/scripts/` directory not pre-created.** Rationale: T3-I-T3.b (create `.claude/scripts/reconstruct-agents.sh`) is the moment the directory needs to exist; executor `mkdir -p .claude/scripts/` is part of that task. Empirical confirmation: `ls .claude/scripts/` returns ENOENT today.

- **D-8 — No separate `gobbi-session-architecture` project skill.** Rationale: T1's edits to `orchestration/SKILL.md` (row 5.5), `git/SKILL.md:33` (qualified rule), `preparation/SKILL.md` (narrow-exception extension), and `gobbi/SKILL.md` (Session Bootstrap Order cross-reference) **ARE the codification** of the worktree-first session-architecture pattern. Adding a separate project skill would duplicate the load-bearing surfaces and create a 2-source-of-truth drift risk. The workspace `orchestration/SKILL.md` is the post-T1 session-architecture authority.

- **D-9 — No `gobbi-shell-script-conventions` project skill at N=1.** Rationale: only one occupant of `.claude/scripts/` exists post-T3 (`reconstruct-agents.sh`). Single-witness skill extraction is Principle 10 violation. Re-evaluate at N≥2 (when a third script enters `.claude/scripts/`). Codify the conventions in the script's own header comments meanwhile.

---

## Mirror propagation policy (CORRECTED iter2 — user re-locked on full evidence)

User-locked decision (Preparation iter2, round-2 AskUserQuestion after iter1 FAIL on incomplete empirical premise): **the project mirror at `.gobbi/projects/gobbi/skills/` IS canonical (real files live there); the workspace tree at `.claude/skills/` is the symlink runtime layer (Claude Code's loader expects skills at this path; 53 file-level symlinks resolve to the canonical files in the mirror). No sync mechanism is needed because both paths resolve to the same physical file.**

Canonical decision file: `staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` (`status: accepted`, `supersedes: mirror-propagation-policy-workspace-canonical.md`).

iter1 supersession: the iter1 lock ("workspace canonical, mirror auto-syncs") was based on an incomplete empirical scan that stopped at directory-level inspection and missed the file-level symlinks. The iter1 decision file is preserved with `status: superseded` and a "## Supersession reason" body section explaining the correction. The associated `workspace-to-mirror-sync-mechanism.md` backlog is preserved with `status: superseded` and a "## Moot reason" body section (the symlink layer IS the sync mechanism; no mechanism to build).

**Empirical evidence (iter2, run by this leader):**

```
$ find /playinganalytics/git/gobbi/.claude/skills/ -type l -name "*.md" | wc -l
53

$ ls -la /playinganalytics/git/gobbi/.claude/skills/orchestration/SKILL.md
lrwxrwxrwx 1 jeonhh0061 jeonhh0061 60 May 20 16:25 \
  /playinganalytics/git/gobbi/.claude/skills/orchestration/SKILL.md \
  -> ../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md
```

**Implication for Bundle B Execution:**

- Planning task briefs touching skill files can cite **either path**; both resolve to the same physical file via the symlinks.
- Recommended convention: **cite the workspace `.claude/skills/...` path** because it matches the runtime-loadability discoverability path (the loader's read path) and most existing documentation references that form. The symlink transparently resolves to the canonical file in the mirror.
- The iter1 "manual mirror-edit recommended" interim discipline is **rescinded** — no mirror-edit is needed because a single `Edit` against either path updates the canonical file.
- Verification gates can target either path with identical results. Pick one (recommended: workspace path) for consistency.

---

## Decisions log

The 19 decisions below capture every AskUserQuestion outcome from this Preparation loop (iter1 base 15 + iter2 surgical 4) plus the gap-resolution map. Chronological order (round 1 → round 2 → iter2):

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
| 11 | Mirror propagation policy lock (iter1) | Sub-step D round 2 (post-base-9 AskUserQuestion) | **Workspace canonical only — mirror auto-syncs.** → `staging/decisions/mirror-propagation-policy-workspace-canonical.md`. SUPERSEDED iter2 (row 16). |
| 12 | Sync-mechanism check outcome (iter1 WORK phase, empirical) | iter1 WORK phase sync-mechanism scan | **No auto-sync mechanism exists** (per incomplete directory-level scan). → conditional backlog staged at `staging/backlogs/project/workspace-to-mirror-sync-mechanism.md`. Interim discipline: manual mirror-edit recommended for Bundle B T1 surfaces. SUPERSEDED AS MOOT iter2 (row 18). |
| 13 | All `generate-now` artifacts produced (iter1) | iter1 WORK Step 7 verification | 5 staging files: D-3 decision, D-4 design, D-2 backlog, D-6 backlog, D-7 backlog + mirror-policy decision + sync-mechanism backlog (conditional) = 7 total. |
| 14 | No re-Ideate triggers | Sub-step D summary | All 9 base gaps resolved without re-Ideate. Scope Contract is workable. |
| 15 | Brief-text imprecision flagged | Sub-step A → D findings § Specific items check item #2 | `session.template.json` lives at `.claude/skills/orchestration/templates/session.template.json` (not `.claude/templates/...`). Planning briefs must cite the correct path. |
| 16 | Mirror-policy iter1 decision SUPERSEDED (iter2 Fix 1) | iter2 brief, applied this WORK phase | iter1 lock had incomplete empirical premise; `staging/decisions/mirror-propagation-policy-workspace-canonical.md` now `status: superseded` + `superseded_by: mirror-propagation-policy-mirror-canonical-symlinks.md` + "## Supersession reason" body section. Audit trail preserved (iter1 body verbatim above supersession note). |
| 17 | Mirror-policy iter2 decision CREATED (iter2 Fix 2) | iter2 round-2 AskUserQuestion user re-lock | **"mirror canonical, workspace = symlink runtime layer; no sync needed."** → `staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` (`status: accepted`, `supersedes: mirror-propagation-policy-workspace-canonical.md`). Empirical anchor: `find .claude/skills/ -type l -name "*.md" \| wc -l` → 53; sample `.claude/skills/orchestration/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md`. |
| 18 | Sync-mechanism backlog CLOSED AS MOOT (iter2 Fix 3) | iter2 brief, applied this WORK phase | `staging/backlogs/project/workspace-to-mirror-sync-mechanism.md` now `status: superseded` + `superseded_by: "no superseding file; backlog is closed as moot per iter2 corrected lock"` + "## Moot reason" body section. The symlink layer IS the sync mechanism; no mechanism to build; interim manual-mirror-edit discipline rescinded. Audit trail preserved. |
| 19 | D-4 design file clarified for 5-vs-7 (iter2 Fix 5) | iter2 brief, applied this WORK phase; iter1 evaluator findings (both Claude + Codex flagged) | `staging/design/workflow-phase-doc-set-for-per-iter-cadence.md` now `status: updated-iter2`; added "Excluded files + rationale" section explaining why `evaluation.md` + `memorization.md` (the 2 extras in the 7-file workflow dir) are NOT in T1-I-T1.f's targeted set (sub-phase docs share across all 5 loops; per-iter commit cadence applies at the LOOP level — each loop's MEMORIZATION emits the commit; sub-phase docs don't have iters of their own). Includes recommended grep verification gate for Planning. iter1 body preserved. |

---

## Out of scope gaps

(Per `preparation/SKILL.md` § WORK discipline — items that surfaced but are not absorbed.)

- **`session.template.json.agents[]` status field schema extension.** Already deferred to feature-level backlog at Ideation `staging/backlogs/feature/schema-extension-agents-status-field.md`. Not absorbed this loop.
- **`.gobbi/project.json` bootstrap.** Already deferred to feature-level backlog at Ideation `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md`. The D-3-3-resolver step (ii) directory-scan is the currently active path.
- **Memory Access Matrix clarification across skills.** Multiple skills' Memory Access Matrix sections treat both `.claude/skills/` and `.gobbi/projects/gobbi/skills/` as project memory. Under the iter2 corrected mirror-policy lock the language drifts further (workspace is now the symlink runtime layer pointing into the canonical project-mirror storage). A future cleanup pass should disambiguate. Not in Bundle B scope; capture as informal follow-up only.
- **T2 — skill-loading-discipline matrix + Load-Directives validator.** Deferred mid-Ideation per the Scope Contract; backlog already at `staging/backlogs/project/item-1-2-skill-loading-discipline.md`.

---

## Notes for Planning intake

(Carried forward from Sub-step A → D findings § Notes for Planning intake — preserved here so Planning has them in the canonical Preparation output. Iter2 corrected the mirror-awareness note.)

- **Path correction**: Planning task briefs touching `session.template.json` must cite `.claude/skills/orchestration/templates/session.template.json` (NOT `.claude/templates/session.template.json` — that path does not exist).
- **Mirror awareness (iter2 corrected)**: Both `.claude/skills/` (workspace) and `.gobbi/projects/gobbi/skills/` (mirror) paths resolve to the same physical file via 53 file-level symlinks. Planning briefs can cite either; **prefer the workspace `.claude/skills/...` path** for runtime-loadability convention (matches the Claude Code loader's read path and most existing documentation references that form). No mirror-edit is needed because a single `Edit` against either path updates the canonical file. The iter1 "manual mirror-edit" interim discipline is rescinded.
- **Iron Law 7 procedural reminder**: Manager constructing Planning task briefs for this bundle MUST Read the Ideation artifact freshly when authoring any "verbatim" instruction (per `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`). Memory-only briefs from the 553-line Ideation rawdata will drift.
- **T1 task brief Load Directives tier 4 must cite 3 specific mistakes** (per `staging/decisions/planning-brief-mistake-load-directives-for-t1.md`). Planning evaluator can mechanically grep each T1 brief for the three file basenames.
- **D-4 verification gate** (added iter2): Planning's T1-I-T1.f task brief should include the dual grep gate from `staging/design/workflow-phase-doc-set-for-per-iter-cadence.md` § "Excluded files + rationale" — expect 5 matches for the cadence pattern in the 5 loop docs AND 0 matches in `evaluation.md`/`memorization.md`. Prevents accidental over-edit.
- **Bundle A handoff anchor**: `notes/2026-05-23-orch-workflow-improvements.md` "Open items carried" explicitly cites this bundle's items (1-3 + 4-1) as deferred — Bundle B is the planned successor; no surprise re-litigation needed.

---

## WORK exit checklist (iter2)

- [x] All required sections populated (Scope reference / Readiness summary / Per-category readiness / Generated this loop / Deferred / Skipped / Mirror propagation policy / Decisions log / Out of scope gaps / Notes for Planning intake).
- [x] No `TODO` / `TBD` / `<...>` placeholders.
- [x] Every `generate-now` decision has a corresponding staging artifact (D-3, D-4 [updated iter2], mirror policy [iter2 new file]).
- [x] Every `defer` decision is recorded with backlog staging path (D-2, D-6, D-7; conditional sync-mechanism now CLOSED AS MOOT).
- [x] Every `skip` decision is recorded in Skipped section with rationale (D-1, D-5, D-8, D-9).
- [x] Decisions Log cites every AskUserQuestion outcome (19 rows — iter1 base 15 + iter2 surgical 4).
- [x] No writes to project memory (`features/...` or top-level project dirs) — all artifacts in `sessions/.../preparation/staging/`.
- [x] No new content beyond DISCUSSION-approved (iter2 surgical scope is the 5 fixes from the iter2 brief).
- [x] Both superseded files have `status: superseded` + supersession/moot reason in body.
- [x] New mirror-policy decision file exists with corrected lock + 53-symlink empirical evidence + user round-2 lock citation.
- [x] D-4 design file has the 5-vs-7 clarification ("Excluded files + rationale" section + grep verification gate).
- [x] Empirical re-verification commands executed by this leader: `find .claude/skills/ -type l -name "*.md" | wc -l` → 53; `ls -la .claude/skills/orchestration/SKILL.md` → symlink target confirmed; `ls .claude/skills/orchestration/workflow/` → 7 files (5 loop + evaluation.md + memorization.md).
