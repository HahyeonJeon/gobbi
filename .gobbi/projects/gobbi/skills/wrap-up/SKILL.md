---
name: wrap-up
description: "MUST load when entering or revising the Wrap-up Loop. Covers staging → project-memory promotion across all loops, handoff summary authoring, feature directory bootstrapping, and the per-session journal. Wrap-up is the sole writer to project memory for cross-loop session artifacts (exception: Preparation promotes its generate-now skills before Planning starts)."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Wrap-up

Skill for the **Wrap-up Loop**. Defines what each of the four phases (DISCUSSION → WORK → EVALUATION → MEMORIZATION) does, which agent owns it, what inputs it consumes, and what artifacts it produces. Loaded by every agent participating in the loop — the manager for orchestration context, and each specialist for the procedural contract of the phase it owns.

The Wrap-up Loop runs **once at the end of every workflow session**. Its job is to close the session cleanly: read accumulated `staging/` directories across all prior loops (Ideation / Preparation / Planning / Execution), promote them deterministically to project memory, write the handoff summary, and emit `workflow.finish`.

Wrap-up differs from the other loops in two ways:

- **DISCUSSION is manager + user only**, not leader-led. The leader's design work is locked across the prior loops' artifacts; Wrap-up's DISCUSSION is just confirming the session is ready to close, and gathering any final deferred items the user wants to log before the handoff.
- **WORK is the assistant's domain**, and Wrap-up's WORK is the **sole writer to project memory for cross-loop session artifacts**. Every other loop's MEMORIZATION stages typed-finding artifacts into session memory only — Wrap-up reads those staging directories and promotes them. The narrow exception is Preparation's `generate-now` skills, which the manager promotes before Planning starts so in-session consumers can load them.

The manager's orchestration of the Wrap-up Loop (when to spawn, perspective selection for EVALUATION, ITER/EXIT decision, `workflow.finish` emission) is in [`orchestration/workflow/wrap-up.md`](../orchestration/workflow/wrap-up.md). Code-changeset evaluation specifics for Wrap-up's promotions live in [`wrap-up/evaluation.md`](evaluation.md), loaded by the evaluator at Stage 0 when the workflow phase is `wrap-up`.

---

## Memory Access Matrix

The agent in the assistant role MUST observe these tier boundaries. Wrap-up's WORK has **broader write privileges** than any other loop — this is the documented Wrap-up loop exception.

| Memory tier | Path root | Access from assistant role (Wrap-up) |
|---|---|---|
| **Session memory — own loop rawdata** | `sessions/{date}-{session-id}/wrap-up/rawdata/` | **READ + WRITE** — promotion-manifest, staging-inventory, pre-Wrap-up snapshot, transcripts |
| **Session memory — own loop artifacts** | `sessions/{date}-{session-id}/wrap-up/artifacts/` | **WRITE (PASS only via MEMORIZATION)** — canonical handoff summary; same `Artifact frontmatter schema` as other loops |
| **Session memory — all prior loops** | `sessions/{date}-{session-id}/{ideation,preparation,planning,execution}/{artifacts,staging,evaluation,rawdata}/` | **READ-ONLY** — required inputs: every prior loop's artifacts (what shipped), staging (what to promote), evaluation outputs (cross-loop closure audit), discussion logs |
| **Session memory — `session.json`** | `sessions/{date}-{session-id}/session.json` | **READ-ONLY for triplet (`project`, `feature`, `task`); UPSERT for Wrap-up's own `workflow.wrap-up.iterations[]`** — same upsert semantics as other loops' MEMORIZATION |
| **Feature memory** | `.gobbi/projects/{project-name}/features/{feature-name}/{scenarios,checklists,decisions,references,design,discussions,backlogs,plans,mistakes,changelogs,README.md}/` | **WRITE + UPSERT** — Wrap-up bootstraps the feature directory lazily and promotes staging → feature memory per the routing table |
| **Project memory** | `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive,skills}/` | **WRITE + UPSERT** — Wrap-up promotes project-scope staging (rules, project-wide design, project-level mistakes, learnings, reports, reviews, journal notes) |

**Delete semantics**: Wrap-up NEVER deletes any file in any tier. Supersession is recorded via frontmatter (`supersedes: <old-path>` on the new file; `status: superseded` + `superseded_by: <new-path>` on the old file). Physical deletion is forbidden. When an artifact reaches a terminal state (shipped, superseded, retired, dropped), Wrap-up moves the full file (`git mv`) to `archive/{type}/` per the move-on-terminal model in [`memorization/templates/archive.md`](../memorization/templates/archive.md) — the file is never deleted. See [`memorization/SKILL.md` § Memory Access Matrix](../memorization/SKILL.md#memory-access-matrix) for the Wrap-up loop exception row.

**Idempotency**: Re-running Wrap-up on the same session produces identical project memory. Promotion targets are deterministic from staging file paths; collision policy uses stable finding-IDs (overwrite same-ID re-runs) + suffix disambiguation (distinct findings) — never silently overwriting distinct content.

**Write enforcement**: any write attempted outside the WRITE rows above is a constraint violation. Notably, Wrap-up's writes to project memory are bounded by the routing table below — improvised destinations are a violation and must return `NEEDS_CONTEXT` with a `user-question:` block so the manager can resolve the routing via AskUserQuestion.

---

## Core Principles

Cross-cutting principles for every agent participating in this loop.

> **Sole owner of project-memory writes for cross-loop session artifacts.**

Ideation / Planning / Execution MEMORIZATION write **only** to session memory under `sessions/{date}-{session-id}/{loop}/`. Wrap-up reads accumulated `staging/` directories across all loops and promotes to `.gobbi/projects/{project-name}/...`. No phase other than Preparation's narrow exception and Wrap-up writes to project memory.

**Narrow exception — Preparation's generated skills:** when Preparation's EVALUATION verdicts `PASS` and the loop produced `generate-now` project-specific skills, the manager promotes those skills from `sessions/{date}-{session-id}/preparation/staging/skills/{slug}/SKILL.md` to `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` **before Planning starts**. This is the only pre-Wrap-up project-memory write in the workflow. Its scope is strictly bounded to skill files generated by Preparation's `generate-now` decision; all other Preparation staging waits for Wrap-up. Wrap-up's project-memory write authority is otherwise exclusive and covers all remaining session artifacts. See `preparation/SKILL.md` § Core Principles for the rationale and mechanics.

> **Layer-2 promotion — generalizable project-mistakes to workspace-level skill storage.**

In addition to Layer-1 promotion (staging → project `mistakes/`), the Wrap-up assistant also performs Layer-2 promotion: moving generalizable project-mistakes from `.gobbi/projects/{project-name}/mistakes/` to workspace-level skill storage so they persist across all projects and future sessions. No CLI command is required — the Wrap-up assistant is the sole documented mechanism for both promotion layers. Whether a project-mistake qualifies as generalizable enough for Layer-2 promotion is confirmed with the user during Wrap-up DISCUSSION (an Always-Ask decision). Promotion does not cause context reload.

> **Deterministic routing — no improvisation.**

Every staging file has a canonical promotion destination per the [Staging → Project-memory routing](#staging--project-memory-routing) table below. The assistant applies the table mechanically; unroutable items return `NEEDS_CONTEXT` with a `user-question:` block — the manager resolves the routing via AskUserQuestion — rather than landing in an invented destination. "I'll just put this in `notes/` because it doesn't fit anywhere else" is a constraint violation.

> **Account for every staging file — promote OR backlog OR document drop.**

Every file under `sessions/.../{loop}/staging/` across every prior loop in this session must be accounted for. Three outcomes are valid:

1. **Promote** to the routed destination
2. **Backlog** with a reason recorded in the handoff summary
3. **Drop** with an explicit rationale (e.g., "duplicate of existing feature memory at <path>")

Silent drops are forbidden. The promotion-manifest is the audit trail.

> **Bootstrap feature directory on-demand.**

`.gobbi/projects/{project-name}/features/{feature-name}/` and its sub-directories are created **on first write per sub-directory** during Wrap-up promotion — not eagerly, not earlier. Pre-Wrap-up phases assume the feature directory may not exist (or contains only prior sessions' content). Wrap-up creates `features/{feature-name}/{scenarios,checklists,decisions,references,design,discussions,backlogs,plans,mistakes,changelogs}/` lazily as content requires.

> **Supersession and move-on-terminal, never deletion.**

Wrap-up NEVER deletes any project-memory file. When a promotion would supersede an existing file's claim, the new file carries a `supersedes: <old-file-path>` frontmatter field; the old file has its `status:` flipped to `superseded` + `superseded_by: <new-file-path>` added (body preserved). Once the artifact reaches a terminal state (shipped, superseded, retired, dropped), Wrap-up moves the full file (`git mv`) to `archive/{type}/{YYYY-MM-DD}-{slug}.md`. Active directories show only live work; `archive/` holds the complete moved files. Physical deletion is forbidden at every step — see [`memorization/templates/archive.md`](../memorization/templates/archive.md) for the move-on-terminal model.

> **Idempotent promotions.**

Re-running Wrap-up on the same session produces identical project memory. Promotion targets are deterministic from staging file paths, and collision policy uses suffix disambiguation (never overwrite of distinct findings, write-or-overwrite of same-finding re-runs keyed by stable finding-ID).

> **Verification before claim.**

Wrap-up's canonical handoff artifact makes claims about what was shipped, promoted, deferred, or dropped. Each claim must be backed by a verifiable artifact (commit hash, promoted file path, backlog entry). The handoff summary cites pointers, not assertions.

---

## DISCUSSION Phase (manager + user, direct)

**Purpose**
Confirm with the user that the session is ready to wrap up, gather any final deferred items the user wants logged before the handoff, and construct the assistant delegation prompt. The leader is **not** spawned at this phase — the design work is already locked across prior loops' artifacts.

**Inputs**
- `session.json` — triplet (`project`, `feature`, `task`) and prior loops' completion verdicts
- All prior loops' canonical `artifacts/` — summary of what shipped
- Discussion logs across loops — for narrative context

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Manager | All prior loops' artifacts + session.json | Read each prior loop's PASS-iter artifacts; build a short session-level outcome summary (what shipped, what was deferred, evaluator verdicts) | Outcome summary |
| 2 | Manager | Outcome summary | Run AskUserQuestion: is anything deferred / open / observed that should be added to Wrap-up before the session closes? Common categories: rules discovered mid-session, mistake candidates, backlog candidates, supersession decisions | User-added items |
| 3 | Manager | User-added items | Record additions in `sessions/{date}-{session-id}/wrap-up/rawdata/discussion-log.md` | Captured additions |
| 4 | Manager | Outcome summary + additions | Construct the assistant delegation prompt per [`delegation/templates/assistant.md`](../delegation/templates/assistant.md) — wrap-up's WORK is a deterministic routing pass + handoff authoring, not narrow Q&A, but the assistant role still applies | Wrap-up delegation prompt |
| 5 | Manager | Prompt | Verify zero `<<slot>>` placeholders; every slot filled | Verified prompt |

**Outputs**
- Outcome summary (input to WORK)
- User-added items (input to WORK)
- Wrap-up delegation prompt (ready for WORK spawn)

**Exit checklist**
- [ ] Every prior loop's canonical artifact read
- [ ] User confirmed via AskUserQuestion that the session is ready to wrap up
- [ ] User-added items (if any) captured in discussion-log.md
- [ ] Delegation prompt constructed; zero unfilled slots

---

## WORK Phase (delegated to `assistant`)

**Purpose**
Read accumulated `staging/` directories across all prior loops, promote each file to its routed project-memory destination, write the per-session journal, and produce the canonical handoff summary. This is the substantive work of Wrap-up — the only loop's WORK that writes to project memory.

**Inputs**
- All prior loops' staging trees: `sessions/{date}-{session-id}/{ideation,preparation,planning,execution}/staging/`
- All prior loops' canonical artifacts (for handoff content)
- All prior loops' evaluation outputs across all iters (for cross-loop closure audit)
- Discussion logs per loop
- Existing project memory state — read-only snapshot of `.gobbi/projects/{project-name}/` for collision / supersession detection
- User decisions on contribution points (carried over from DISCUSSION + AskUserQuestion during WORK)
- The Wrap-up delegation prompt's outcome summary + user-added items

**Procedure** — seven sequential steps. The assistant runs them in order; idempotency contract holds across re-runs.

| # | Step | Action |
|---|---|---|
| 1 | **Snapshot pre-Wrap-up state** | Capture the current `.gobbi/projects/{project-name}/` state as the baseline. Save to `sessions/{date}-{session-id}/wrap-up/rawdata/pre-wrap-up-snapshot.txt`. This is what Wrap-up evaluation diffs against |
| 2 | **Enumerate all staging across all loops** | For each loop directory in `sessions/{date}-{session-id}/{ideation,preparation,planning,execution}/`, recursively list `staging/`. Build a master inventory at `sessions/{date}-{session-id}/wrap-up/rawdata/staging-inventory.md` — every staging file path, sized + frontmatter-extracted. **Step 2.5 runs immediately after this step** — see `### Step 2.5` below for the prior-loop MEMORIZATION compliance scan that must complete before Step 3 |
| 3 | **Determine feature destination** | Read `session.json.feature` for the canonical feature slug `{feature-name}` (set during Ideation Sub-step B Lock Scope). If `.gobbi/projects/{project-name}/features/{feature-name}/` does not exist, plan to bootstrap it lazily at Step 5. If it exists from prior sessions, capture pre-Wrap-up state of each sub-directory for collision detection |
| 4 | **Apply routing table to each staging file** | For every staging file in the inventory: (a) identify staging type from path; (b) look up destination in the routing table; (c) read frontmatter for `mistake-candidate: true`, `supersedes:`, `project-scope: true`, `disposition: deferred` — these are routing modifiers; (d) resolve final destination per modifiers + collision policy; (e) if user-confirm is required (rules / project-wide design / mistake scope / unrouted file), return `NEEDS_CONTEXT` with a `user-question:` block — the manager runs AskUserQuestion on your behalf, then re-delegates with the confirmed routing decision; (f) record routing decision in `rawdata/promotion-manifest.md`. **Unrouted files escalate — never improvise** |
| 5 | **Bootstrap + write to project memory** | For each routing decision: create the destination's parent directory if missing (lazy bootstrap); write the file at the destination per collision policy; for first write into `features/{feature-name}/`, also create or update `features/{feature-name}/README.md` per [`memorization/templates/feature-readme.md`](../memorization/templates/feature-readme.md); stamp the appropriate template from [`memorization/templates/`](../memorization/templates/) for each promotion. **Move-on-terminal**: when a collision resolution or incoming frontmatter (`shipped`, `superseded`, `retired`, `dropped`) indicates the existing destination file has reached a terminal state, stamp archival frontmatter on it and move it (`git mv`) to `archive/{type}/{YYYY-MM-DD}-{slug}.md` before writing the new file — never delete it. Repoint any inbound references to the archive path. See [`memorization/templates/archive.md`](../memorization/templates/archive.md) for the move procedure |
| 6 | **Write per-session journal entry** | Synthesize the session's work-log narrative — what the leader investigated, what the executor implemented, what the evaluator flagged, what the user decided. Write a single journal entry at `.gobbi/projects/{project-name}/notes/{date}-{slug}.md` per [`memorization/templates/notes.md`](../memorization/templates/notes.md). This is the per-session development journal — always one entry per session |
| 7 | **Synthesize handoff summary** | Write the canonical handoff at `sessions/{date}-{session-id}/wrap-up/artifacts/handoff.md` (and any decomposed artifact files alongside) with required sections: Summary, Shipped, Deferred / Open, Decisions to respect, Pointers, Promotion summary. Each claim cites a verifiable artifact path. The artifact carries the [Artifact frontmatter schema](../memorization/SKILL.md#artifact-frontmatter-schema) with `artifact_type: handoff` |

**Outputs**

Session-memory writes:
- `sessions/{date}-{session-id}/wrap-up/rawdata/pre-wrap-up-snapshot.txt` — baseline for evaluation
- `sessions/{date}-{session-id}/wrap-up/rawdata/staging-inventory.md` — master inventory across all loops
- `sessions/{date}-{session-id}/wrap-up/rawdata/promotion-manifest.md` — append-only routing-decision log (1 entry per staging file: promote target / backlog reason / drop rationale)
- `sessions/{date}-{session-id}/wrap-up/artifacts/handoff.md` — canonical handoff summary (plus any decomposed artifact files); written at Step 7 of WORK (also persisted at MEMORIZATION per the Artifact frontmatter schema)

Project-memory writes (the substantive work):
- `.gobbi/projects/{project-name}/features/{feature-name}/{scenarios,checklists,decisions,references,design,discussions,backlogs,plans,mistakes,changelogs}/{slug}.md` — feature-scoped promotions per routing table
- `.gobbi/projects/{project-name}/features/{feature-name}/README.md` — feature index + activity log (created or updated)
- `.gobbi/projects/{project-name}/mistakes/{slug}.md` — project-scoped mistakes (user-confirmed scope)
- `.gobbi/projects/{project-name}/rules/{slug}.md` — project rules (rare; user-confirmed)
- `.gobbi/projects/{project-name}/design/{slug}.md` — project-wide design docs (rare; user-confirmed)
- `.gobbi/projects/{project-name}/notes/{date}-{slug}.md` — per-session journal entry (always written at Step 6)
- `.gobbi/projects/{project-name}/backlogs/{slug}.md` — project-level deferrals
- `.gobbi/projects/{project-name}/learnings/{slug}.md` — project-level learnings (cross-feature by definition)
- `.gobbi/projects/{project-name}/reviews/{date}-{slug}.md` — review activity result documents
- `.gobbi/projects/{project-name}/reports/{date}-{slug}.md` — status / post-mortem / analytics reports
- `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` — project-specific skills from Preparation `generate-now` staging
- `.gobbi/projects/{project-name}/archive/{type}/{date}-{slug}.md` — full moved artifacts (move-on-terminal model): terminal-state files moved here by `git mv` with archival frontmatter stamped

**Exit checklist**
- [ ] Pre-Wrap-up snapshot captured at `rawdata/pre-wrap-up-snapshot.txt`
- [ ] Every staging file in `rawdata/staging-inventory.md` has a corresponding entry in `rawdata/promotion-manifest.md` (promoted / backlogged / dropped with reason)
- [ ] Feature directory bootstrapped lazily (only sub-directories with promoted content)
- [ ] `features/{feature-name}/README.md` created or updated
- [ ] Per-session journal entry written at `notes/{date}-{slug}.md`
- [ ] Handoff summary written at `artifacts/handoff.md` with all required sections + frontmatter
- [ ] Every routing decision applied mechanically per the table; no improvised destinations
- [ ] User-confirm requested via `NEEDS_CONTEXT` (manager ran AskUserQuestion on your behalf) for: rules promotion, project-wide design, mistake scope, unrouted staging files
- [ ] Step 2.5 prior-loop compliance scan recorded in `rawdata/promotion-manifest.md`

### WORK discipline

- **No silent drops.** Every staging file is accounted for in the promotion-manifest.
- **No improvised destinations.** The routing table is the contract; unrouted files escalate.
- **Cite the discussion.** Every routing decision that required AskUserQuestion is traceable to the discussion log entry that authorized it.
- **Stamp templates.** Every promotion uses the appropriate template from [`memorization/templates/`](../memorization/templates/) — freeform writes to project memory are forbidden.

### Step 2.5 — Prior-loop MEMORIZATION compliance check

**Purpose** — Before Step 3 reads `session.json.feature`, verify that every prior loop's staging output is structurally sound for promotion. This is a read-only compliance scan: it detects shape violations and type-vocabulary errors, then either auto-backfills mechanical-class findings or escalates judgment-required findings via `NEEDS_CONTEXT`.

**When it runs** — Immediately after Step 2 builds the staging inventory at `rawdata/staging-inventory.md`. No project-memory writes happen until all Step 2.5 findings are resolved.

**Gap categories**

For each loop directory that appears in the staging inventory, classify any compliance gap into one of four categories:

| Category | Condition | Auto-backfill? | NEEDS_CONTEXT? |
|---|---|---|---|
| `zero-staging` | Prior loop's staging dir is empty | N/A | YES |
| `shape-mismatch` | Files exist but per-finding `{slug}.md` convention violated (bulk files / wrong shape) | mechanical-class only | judgment only |
| `template-mismatch` | Frontmatter `type:` missing or off-vocabulary | mechanical-class only | judgment only |
| `directory-absent` | Staging directory does not exist | NO | YES |

**5-Type classification** (source: [`evaluation/SKILL.md` § Type](../evaluation/SKILL.md#type-5-values))

The `type:` frontmatter field in every staging file must be one of the five values defined in `evaluation/SKILL.md`:

- `scenario_gap`
- `checklist_gap`
- `design_flaw`
- `assumption_risk`
- `general`

Mechanical-class = `{scenario_gap, checklist_gap, general}` — these map to deterministic routing destinations and auto-backfill is safe.

Judgment-required = `{design_flaw, assumption_risk}` — these carry adversarial semantics (broken invariant / unverified assumption) and require the assistant to return `NEEDS_CONTEXT` with a `user-question:` block before any backfill proceeds.

**Classification decision matrix**

| Finding `type:` | Category | Action |
|---|---|---|
| `scenario_gap` / `checklist_gap` / `general` | `shape-mismatch` or `template-mismatch` | Auto-backfill: normalize the file to the correct `{slug}.md` shape / insert the missing `type:` field. Apply Slug+collision policy (see below) before writing |
| `design_flaw` / `assumption_risk` | `shape-mismatch` or `template-mismatch` | Return `NEEDS_CONTEXT`; pause auto-backfill for this finding until the manager responds |
| any | `zero-staging` | Return `NEEDS_CONTEXT`: "Loop `{loop}` staging dir is empty — was that intentional?" |
| any | `directory-absent` | Return `NEEDS_CONTEXT`: "Loop `{loop}` staging dir does not exist — verify the loop ran" |

**Slug + collision policy** (source: [`evaluation/SKILL.md` § Slug + collision policy](../evaluation/SKILL.md#slug--collision-policy))

Before writing any auto-backfill file:

1. Slugs are kebab-case, ≤ 60 characters, derived from the finding's primary symptom.
2. Read the existing file at the target path, if any.
3. If a file exists and its `finding-id` frontmatter matches the new finding → overwrite (idempotent re-run).
4. If a file exists and its `finding-id` does NOT match → disambiguate with `-2`, `-3` numeric suffix.
5. Record the disambiguation in `rawdata/promotion-manifest.md`.

**Gap report destination** — All Step 2.5 findings (gaps detected, classification, action taken, auto-backfill result, or NEEDS_CONTEXT escalation) are appended to `sessions/{date}-{session-id}/wrap-up/rawdata/promotion-manifest.md`. Each entry carries: loop name, staging path, gap category, finding type, action (auto-backfill / NEEDS_CONTEXT), result or escalation reason.

**Exit criteria for Step 2.5** — Step 3 may not begin until:
- Every `shape-mismatch` and `template-mismatch` gap with a mechanical-class type has been auto-backfilled.
- Every judgment-required finding has a recorded NEEDS_CONTEXT escalation with a manager response.
- Every `zero-staging` and `directory-absent` gap has a recorded NEEDS_CONTEXT escalation with a manager response.
- All Step 2.5 gap report entries are written to `rawdata/promotion-manifest.md`.

---

## Staging → Project-memory routing

The canonical promotion routing. The assistant applies this table mechanically. Wrap-up evaluation verifies adherence (see [`evaluation.md`](evaluation.md)).

| Session staging path | Project-memory destination | Trigger condition |
|---|---|---|
| `sessions/.../{loop}/staging/scenarios/{slug}.md` | `features/{feature-name}/scenarios/{slug}.md` | Always |
| `sessions/.../{loop}/staging/checklists/{slug}.md` | `features/{feature-name}/checklists/{slug}.md` | Always |
| `sessions/.../{loop}/staging/decisions/{slug}.md` (no special frontmatter) | `features/{feature-name}/decisions/{slug}.md` | Default |
| `sessions/.../{loop}/staging/decisions/{slug}.md` with frontmatter `mistake-candidate: true` | `features/{feature-name}/mistakes/{slug}.md` (feature-scope) OR `mistakes/{slug}.md` (project-scope) | Return `NEEDS_CONTEXT`; manager confirms scope via AskUserQuestion |
| `sessions/.../{loop}/staging/decisions/{slug}.md` with frontmatter `disposition: deferred` | `features/{feature-name}/backlogs/{slug}.md` (feature-scope) OR `backlogs/{slug}.md` (project-scope per frontmatter `project-scope: true`) | Always — deferred findings route to backlogs |
| `sessions/.../{loop}/staging/references/{slug}.md` | `features/{feature-name}/references/{slug}.md` | Always |
| `sessions/.../{loop}/staging/design/{slug}.md` | `features/{feature-name}/design/{slug}.md` (default) OR `design/{slug}.md` (project-wide; rare) | If project-wide, return `NEEDS_CONTEXT`; manager confirms via AskUserQuestion |
| `sessions/.../{loop}/staging/discussions/{slug}.md` | `features/{feature-name}/discussions/{slug}.md` | Always |
| `sessions/.../{loop}/staging/backlogs/feature/{slug}.md` | `features/{feature-name}/backlogs/{slug}.md` | Always |
| `sessions/.../{loop}/staging/backlogs/project/{slug}.md` | `backlogs/{slug}.md` | Always |
| `sessions/.../{loop}/staging/reviews/{slug}.md` | `reviews/{date}-{slug}.md` | Always — review / evaluation / audit activity result documents (project-level only; no feature-scope variant) |
| `sessions/.../{loop}/staging/reports/{slug}.md` | `reports/{date}-{slug}.md` | Always — `status` / `post-mortem` / `analytics` reports (project-level only; no feature-scope variant). `{date}` is the session start date |
| `sessions/.../{loop}/staging/changelogs/{slug}.md` | `features/{feature-name}/changelogs/{slug}.md` | Always — feature-scope shipped-work changelog entries (Execution-loop typical) |
| `sessions/.../{loop}/staging/learnings/{slug}.md` | `learnings/{slug}.md` | Always — project-level learnings (cross-feature by definition) |
| `sessions/.../{loop}/staging/notes/{slug}.md` | `notes/{date}-{slug}.md` | Always — loop-scope journal entry (rare; per-session journal is Wrap-up's direct Step 6 write) |
| `sessions/.../planning/staging/plans/{slug}.md` | `features/{feature-name}/plans/{date}-{slug}.md` | Always — Planning-loop output |
| `sessions/.../preparation/staging/skills/{slug}/SKILL.md` | `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` | Already-promoted (manifest-only) — the manager promotes these before Planning starts (see `preparation/SKILL.md` § Core Principles and `orchestration/workflow/preparation.md` § WORK Phase); Wrap-up verifies presence and records in `promotion-manifest.md` but does not re-promote unless the destination is missing |
| Rules surfaced during session (assistant identifies from session content; not from a staging file) | `rules/{slug}.md` | Return `NEEDS_CONTEXT`; manager confirms via AskUserQuestion — rules are rare and load-bearing |
| Per-session development journal entry (Wrap-up authors at session close — not from staging) | `notes/{date}-{slug}.md` | Always — one journal entry per session capturing the work-log narrative |

All destination paths are relative to `.gobbi/projects/{project-name}/`.

**Collision policy** when destination file already exists:

| Scenario | Action |
|---|---|
| Same `finding-id` frontmatter (stable identifier on the staging file) as existing destination | Overwrite — this is a content update for the same finding |
| Different `finding-id`, same slug | Disambiguate with numeric suffix (`-2`, `-3`); record in `promotion-manifest.md` |
| Existing destination's content is contradicted by the new content | Stamp new file with `supersedes: <existing-path>` frontmatter; flip the existing file's `status: superseded` + `superseded_by: <new-path>` (body preserved); then move it (`git mv`) to `archive/{type}/{YYYY-MM-DD}-{slug}.md` per the move-on-terminal model (never delete); record decision in `promotion-manifest.md` |
| Cross-loop slug collision (e.g., Planning + Execution both stage a finding with same slug but different `finding-id`) | Suffix with the source loop name (`{slug}-planning.md` vs `{slug}-execution.md`) |

---

## EVALUATION Phase

**Purpose**
Find the promotion gaps WORK missed. Two independent systems (Claude Code + Codex) evaluate the Wrap-up artifact + promotions across all seven perspectives + Overall; the manager reconciles their findings and produces a single `PASS` / `REVISE` / `FAIL` verdict. Wrap-up evaluation is **non-skippable** — see [`wrap-up/evaluation.md`](evaluation.md).

See [evaluation skill](../evaluation/SKILL.md) for the full Stage 0 / 1 / 2 / 3 procedure, [`wrap-up/evaluation.md`](evaluation.md) for the wrap-up-phase seed scenarios, and [`orchestration/workflow/evaluation.md`](../orchestration/workflow/evaluation.md) for the manager's spawn / reconciliation orchestration.

**Inputs** (consumed from the WORK phase output)
- `sessions/{date}-{session-id}/wrap-up/artifacts/handoff.md` (and any decomposed artifact files)
- `sessions/{date}-{session-id}/wrap-up/rawdata/promotion-manifest.md` — the audit trail of every routing decision
- `sessions/{date}-{session-id}/wrap-up/rawdata/staging-inventory.md` — the source inventory the manifest must account for
- `sessions/{date}-{session-id}/wrap-up/rawdata/pre-wrap-up-snapshot.txt` — the baseline state before promotions
- Post-Wrap-up state of `.gobbi/projects/{project-name}/` — for diff against snapshot
- All prior loops' artifacts (handoff claims must trace back to shipped work)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Manager | WORK outputs; promotion manifest; staging inventory | Spawn one evaluator per system (Claude Code + Codex); each handles all seven perspectives + Overall sequentially | Two evaluator agent instances |
| 2 | Evaluator | All step-1 inputs | Run the four-stage procedure per `evaluation/SKILL.md` with `wrap-up/evaluation.md` loaded at Stage 0 | `evaluation/iter{n}/{claude,codex}/{perspective}.md` + `evaluation/iter{n}/{claude,codex}/overall.md` |
| 3a | Manager | Both systems' per-perspective files | Cross-system reconciliation: pessimistic union of findings; severity-gated divergence handling | Reconciled findings + per-perspective verdicts |
| 3b | Manager | Major divergence (if any) | Run AskUserQuestion | (skipped if no major divergence) |
| 3c | User | Divergence question | Decide which verdict to honor | User-confirmed verdict |
| 4 | Manager | Reconciled findings + verdicts | Record aggregated verdict: `PASS` / `REVISE` / `FAIL`. **All verdicts advance to MEMORIZATION first**. After MEMORIZATION, `PASS` exits the loop and emits `workflow.finish`; `REVISE` re-enters DISCUSSION (rare — Wrap-up's iteration cap is typically 1); `FAIL` escalates via AskUserQuestion | Workflow-state verdict |

**Outputs**
- `sessions/{date}-{session-id}/wrap-up/evaluation/iter{n}/{claude,codex}/{perspective}.md` — one file per system × perspective
- Aggregated verdict recorded in workflow state

**Wrap-up-specific evaluation emphasis** (from [`wrap-up/evaluation.md`](evaluation.md))
- **Promotion coverage** — every staging file in the inventory has a manifest entry (promoted / backlogged / dropped)
- **Routing-table adherence** — every promotion target matches the routing table; no improvised destinations
- **Supersession integrity** — `supersedes:` + `superseded_by:` frontmatter pairs are bidirectional and resolve
- **Handoff verifiability** — every claim in `handoff.md` cites a verifiable artifact path
- **Journal completeness** — per-session journal entry captures the substantive work narrative

**Exit checklist**
- [ ] Both systems produced per-perspective files for every perspective
- [ ] Verdict aggregated and recorded; `REVISE` increments the iteration counter, `PASS` and `FAIL` advance to MEMORIZATION

---

## MEMORIZATION Phase

**Purpose**
Persist Wrap-up's iteration evidence into session memory and stamp the artifacts directory with the canonical handoff per the Artifact frontmatter schema. MEMORIZATION runs after **every** EVALUATION (whether `PASS`, `REVISE`, or `FAIL`).

Wrap-up's MEMORIZATION is **uniquely permitted** to write to project memory (per the Wrap-up loop exception in [`memorization/SKILL.md` § Memory Access Matrix](../memorization/SKILL.md#memory-access-matrix)) — but in practice, the substantive project-memory writes happen during WORK (Steps 5 and 6 of the procedure above). MEMORIZATION's role is to seal those writes: stamp the handoff artifact with proper frontmatter, finalize the promotion manifest, upsert session.json.

See [memorization skill](../memorization/SKILL.md) for the every-iter / PASS-only procedure, template-stamping conventions, artifact frontmatter schema, and cumulative-staging rule. [`orchestration/workflow/memorization.md`](../orchestration/workflow/memorization.md) covers the manager's spawn / collect orchestration.

**Inputs**
- `sessions/{date}-{session-id}/wrap-up/artifacts/handoff.md` (and any decomposed artifact files) from WORK
- `sessions/{date}-{session-id}/wrap-up/rawdata/promotion-manifest.md` — the routing audit trail
- `sessions/{date}-{session-id}/wrap-up/evaluation/iter{m}/{claude,codex}/{perspective}.md` for `m ∈ 1..n`
- `session.json.transcriptPath` (tilde-expand `$HOME` on read) — manager-stamped transcript path; use `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env. Claude Code transcript jsonl
- `sessions/{date}-{session-id}/wrap-up/rawdata/discussion-log.md`
- EVALUATION verdict for this iteration (`PASS` / `REVISE` / `FAIL`)

**Procedure** — see [memorization/SKILL.md § MEMORIZATION Phase](../memorization/SKILL.md#memorization-phase) for the canonical step-by-step. Wrap-up-specific notes:

- The substantive WRITE work for Wrap-up happens during WORK (Steps 5-6). MEMORIZATION's WRITE responsibility is limited to (a) sealing the handoff with proper frontmatter, (b) upserting session.json, (c) preserving the transcript.
- On PASS, mandatory artifact_types: `handoff` (the canonical handoff summary), `memory-reads` (every prior loop's evaluation file consumed by Wrap-up's promotion-routing pass), `resolution-log` (every evaluator finding across all loops with its final disposition).
- Any evaluator finding from Wrap-up's own EVALUATION that surfaces a new promotable item (mistake, learning, decision) must route through the routing table — MEMORIZATION does **not** improvise destinations. If the finding maps to an existing routing-table row, promote via that row. If it is unroutable, return `NEEDS_CONTEXT` with a `user-question:` block so the manager can confirm the routing via AskUserQuestion. There are no ad-hoc write exceptions in MEMORIZATION; the routing table is the sole authority.
- On PASS, after MEMORIZATION completes, the manager emits `workflow.finish` and closes the session.

**Outputs**

Every iteration produces:
- `sessions/{date}-{session-id}/wrap-up/rawdata/transcript-iter{n}.jsonl` — preserved transcript
- `sessions/{date}-{session-id}/session.json` — upserted `workflow.wrap-up.iterations[]` entry

Only the `PASS` iteration also produces:
- `sessions/{date}-{session-id}/wrap-up/artifacts/handoff.md` (and decomposed files) — frontmatter-sealed; same files already written during WORK
- `sessions/{date}-{session-id}/wrap-up/artifacts/memory-reads.md` — cumulative-staging audit
- `sessions/{date}-{session-id}/wrap-up/artifacts/resolution-log.md` — every evaluator finding across loops with final disposition
- `sessions/{date}-{session-id}/session.json` — `workflow.wrap-up.finishedAt` and `verdict: PASS` set; `workflow.finish` emitted

**Exit checklist**

Every iteration:
- [ ] Transcript jsonl preserved at `wrap-up/rawdata/transcript-iter{n}.jsonl`
- [ ] `session.json.workflow.wrap-up.iterations[]` includes this iter's `{iter, verdict, finishedAt, evaluation_dir: "wrap-up/evaluation/iter{n}/"}`

`PASS` iteration additionally:
- [ ] `wrap-up/artifacts/` contains `handoff.md` with valid frontmatter (`artifact_type: handoff`)
- [ ] `wrap-up/artifacts/` contains `memory-reads.md` (`artifact_type: memory-reads`)
- [ ] `wrap-up/artifacts/` contains `resolution-log.md` (`artifact_type: resolution-log`)
- [ ] `session.json.workflow.wrap-up.finishedAt` + final `verdict: PASS` set
- [ ] `workflow.finish` emitted; session closed

---

## Output paths

All session-memory writes during the Wrap-up Loop are scoped to `sessions/{date}-{session-id}/wrap-up/`. Project-memory writes (the substantive output of WORK) follow the [Staging → Project-memory routing](#staging--project-memory-routing) table above.

**Path conventions**

- `{date}` — the session start date in `YYYY-MM-DD` format
- `{session-id}` — Claude Code session ID supplied by the delegation prompt's `session-id:` header field (the parent session's id). Do NOT read `$CLAUDE_CODE_SESSION_ID` for this value: in a spawned-subagent context that env-var holds the subagent's own UUID, not the parent session's.
- `{project-name}` — project slug from `session.json.project`
- `{feature-name}` — feature slug from `session.json.feature` (set during Ideation Sub-step B Lock Scope)
- `{slug}` — slug for a specific artifact, set by the writer at stage time or by Wrap-up at promotion time
- `{n}` — iter number, supplied by the manager

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/wrap-up/rawdata/pre-wrap-up-snapshot.txt` | assistant (WORK Step 1) | per iteration |
| `sessions/{date}-{session-id}/wrap-up/rawdata/staging-inventory.md` | assistant (WORK Step 2) | per iteration |
| `sessions/{date}-{session-id}/wrap-up/rawdata/promotion-manifest.md` | assistant (WORK Step 4) | per iteration — append-only routing-decision log |
| `sessions/{date}-{session-id}/wrap-up/rawdata/transcript-iter{n}.jsonl` | assistant (MEMORIZATION) | per iter — preserved transcript window |
| `sessions/{date}-{session-id}/wrap-up/rawdata/discussion-log.md` | manager (DISCUSSION) | appended per AskUserQuestion exchange |
| `sessions/{date}-{session-id}/wrap-up/evaluation/iter{n}/{claude,codex}/{perspective}.md` | evaluator (EVALUATION) | one per system × perspective |
| `sessions/{date}-{session-id}/wrap-up/artifacts/handoff.md` | assistant (WORK Step 7; sealed at MEMORIZATION) | PASS only — `artifact_type: handoff` |
| `sessions/{date}-{session-id}/wrap-up/artifacts/memory-reads.md` | assistant (MEMORIZATION) | PASS only — `artifact_type: memory-reads` |
| `sessions/{date}-{session-id}/wrap-up/artifacts/resolution-log.md` | assistant (MEMORIZATION) | PASS only — `artifact_type: resolution-log` |
| Project-memory writes per routing table | assistant (WORK Steps 5-6) | per promoted staging file + per-session journal entry |
| `sessions/{date}-{session-id}/session.json` | assistant (MEMORIZATION) | loop completion timestamps, iter, verdict; `workflow.finish` on final PASS |

The session subdirectory tree at `sessions/{date}-{session-id}/wrap-up/{rawdata,artifacts,evaluation}/` is bootstrapped by the manager at Wrap-up Loop entry. WORK and MEMORIZATION assume the tree exists and surface an error if it does not. Project-memory destinations are bootstrapped lazily by WORK Step 5 as content requires.

---

## Constraints

- **MUST be the sole writer to project memory for cross-loop session artifacts** — no other loop writes to `.gobbi/projects/{project-name}/{features,mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive}/`. Exception: Preparation-generated skills at `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` are promoted by the manager before Planning starts (see `preparation/SKILL.md` § Core Principles). At Wrap-up, verify the destination is present and record in `promotion-manifest.md`; do not re-promote unless the destination file is missing.
- **MUST account for every staging file** — promotion-manifest.md has 1 entry per staging file across all prior loops (promoted / backlogged / dropped with reason).
- **MUST apply the routing table mechanically** — no improvised destinations; unrouted files return `NEEDS_CONTEXT` with a `user-question:` block so the manager can run AskUserQuestion on your behalf.
- **MUST bootstrap feature directory lazily** — create `features/{feature-name}/{sub-dir}/` on first write into that sub-directory, not eagerly.
- **MUST write the per-session journal entry** at `notes/{date}-{slug}.md` capturing the work-log narrative — one entry per session.
- **MUST be idempotent** — re-run on the same session produces identical project-memory state; collision policy keyed by stable `finding-id` frontmatter.
- **MUST never delete** — supersession via `supersedes:` + `superseded_by:` frontmatter pairs; physical deletion is forbidden. When an artifact reaches a terminal state, move it (never delete) to `archive/{type}/` per the move-on-terminal model in [`memorization/templates/archive.md`](../memorization/templates/archive.md).
- **MUST preserve session scratch** — `sessions/{date}-{session-id}/.../rawdata/`, `staging/`, `evaluation/iter{n}/` remain intact post-Wrap-up.
- **MUST request user-confirm** for rules promotion, project-wide design promotion, mistake scope (feature vs project), and unrouted staging files — return `NEEDS_CONTEXT` with a `user-question:` block; the manager runs AskUserQuestion on your behalf.
- **MUST cite verifiable artifacts** in `wrap-up/artifacts/` — every claim backed by a path the next session can follow.
- **MUST never write to project memory during DISCUSSION** — DISCUSSION is read-only on project memory; WORK Steps 5-6 are the only project-memory write surfaces.
- **MUST stamp templates** — every promotion uses the appropriate template from [`memorization/templates/`](../memorization/templates/); freeform writes to project memory are forbidden.
- **MUST emit `workflow.finish`** on the final PASS iteration — after MEMORIZATION completes; the manager closes the session.
