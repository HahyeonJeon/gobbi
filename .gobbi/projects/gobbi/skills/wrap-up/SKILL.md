---
name: wrap-up
description: "MUST load for Wrap-up. Promotes session staging to memory, writes the handoff, bootstraps feature dirs, and records the journal."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Wrap-up

Skill for the **Wrap-up Loop**. Defines what each of the four phases (DISCUSSION → WORK → EVALUATION → RECORD) does, which agent owns it, what inputs it consumes, and what artifacts it produces. Loaded by every agent participating in the loop — the manager for orchestration context, and each specialist for the procedural contract of the phase it owns.

The Wrap-up Loop runs **once at the end of every workflow session**. Its job is to close the session cleanly: read accumulated `staging/` directories across all prior loops (Ideation / Preparation / Planning / Execution), promote them deterministically to memory, write the handoff summary, and emit `workflow.finish`.

Wrap-up differs from the other loops in two ways:

- **DISCUSSION is manager + user only**, not leader-led. The leader's design work is locked across the prior loops' artifacts; Wrap-up's DISCUSSION is just confirming the session is ready to close, and gathering any final deferred items the user wants to log before the handoff.
- **WORK is the assistant's domain**, and Wrap-up's WORK is the **sole writer to memory for cross-loop session artifacts**. Every other loop's RECORD stages typed-finding artifacts into session record only — Wrap-up reads those staging directories and promotes them. The narrow exception is Preparation's `generate-now` skills, which the manager promotes before Planning starts so in-session consumers can load them.

The manager's orchestration of the Wrap-up Loop (when to spawn, perspective selection for EVALUATION, ITER/EXIT decision, `workflow.finish` emission) is in [`orchestration/workflow/wrap-up.md`](../orchestration/workflow/wrap-up.md). Code-changeset evaluation specifics for Wrap-up's promotions live in [`wrap-up/evaluation.md`](evaluation.md), loaded by the evaluator at Stage 0 when the workflow phase is `wrap-up`.

---

## Memory Access Matrix

The agent in the assistant role MUST observe these tier boundaries. Wrap-up's WORK has **broader write privileges** than any other loop — this is the documented Wrap-up loop exception.

| Memory tier | Path root | Access from assistant role (Wrap-up) |
|---|---|---|
| **Session record — own loop working** | `sessions/{date}-{session-id}/5-wrap-up/working/` | **READ + WRITE** — promotion-manifest, staging-inventory, pre-Wrap-up snapshot, discussion-log; during dual-system production the Codex proposer writes the frozen `proposals/codex/draft-iter{n}.md` and the assistant writes the `reconciliation-iter{n}.md` Integration Log (WORK) |
| **Session record — own loop artifacts** | `sessions/{date}-{session-id}/5-wrap-up/outputs/` | **WRITE (PASS only via RECORD)** — canonical handoff summary; same `Artifact frontmatter schema` as other loops |
| **Session record — all prior loops** | `sessions/{date}-{session-id}/{1-ideation,2-preparation,3-planning,4-execution}/{outputs,staging,evaluation,working}/` | **READ-ONLY** — required inputs: every prior loop's artifacts (what shipped), staging (what to promote), evaluation outputs (cross-loop closure audit), discussion logs |
| **Session record — `session.json`** | `sessions/{date}-{session-id}/session.json` | **READ-ONLY for triplet (`project`, `feature`, `task`); UPSERT for Wrap-up's own `workflow.wrap-up.iterations[]`** — same upsert semantics as other loops' RECORD |
| **Feature memory** | `.gobbi/projects/{project-name}/features/{feature-name}/{scenarios,checklists,decisions,references,design,discussions,backlogs,plans,mistakes,changelogs,rules,learnings,reviews,reports,README.md}/` | **WRITE + UPSERT** — Wrap-up bootstraps the feature directory lazily and promotes staging → feature memory per the routing table |
| **Memory** | `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive,skills}/` | **WRITE + UPSERT** — Wrap-up promotes project-scope staging (rules, project-wide design, project-level mistakes, learnings, reports, reviews, journal notes) |

**Delete semantics**: Wrap-up NEVER deletes any file in any tier. Supersession is recorded via frontmatter (`supersedes: <old-slug>` on the new file; `status: superseded` + `superseded_by: <new-slug>` on the old file — plain slugs, never paths, per [`memory/rules.md` § 2.4](../memory/rules.md#24-cross-references-and-the-doc-graph)). Physical deletion is forbidden. When an artifact reaches a terminal state (shipped, superseded, retired, dropped), Wrap-up moves the full file (`git mv`) to `archive/{type}/{area}/` per the move-on-terminal model in [`memory/templates/archive.md`](../memory/templates/archive.md) — the file is never deleted; the archive preserves the source area under the typed subdir. See [`record/SKILL.md` § Memory Access Matrix](../record/SKILL.md#memory-access-matrix) for the Wrap-up loop exception row.

**Idempotency**: Re-running Wrap-up on the same session produces identical memory. Promotion targets are deterministic from staging file paths; collision policy uses stable finding-IDs (overwrite same-ID re-runs) + suffix disambiguation (distinct findings) — never silently overwriting distinct content.

**Write enforcement**: any write attempted outside the WRITE rows above is a constraint violation. Notably, Wrap-up's writes to memory are bounded by the routing table below — improvised destinations are a violation and must return `NEEDS_CONTEXT` with a `user-question:` block so the manager can resolve the routing through the active runtime's user-decision primitive.

---

## Core Principles

Cross-cutting principles for every agent participating in this loop.

> **Sole owner of memory writes for cross-loop session artifacts.**

Ideation / Planning / Execution RECORD write **only** to session record under `sessions/{date}-{session-id}/{N}-{loop}/`. Wrap-up reads accumulated `staging/` directories across all loops and promotes to `.gobbi/projects/{project-name}/...`. No phase other than Preparation's narrow exception and Wrap-up writes to memory.

**Narrow exception — Preparation's generated skills:** when Preparation's EVALUATION verdicts `PASS` and the loop produced `generate-now` project-specific skills, the manager promotes those skills from `sessions/{date}-{session-id}/2-preparation/staging/skills/{slug}/SKILL.md` to `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` **before Planning starts**. This is the only pre-Wrap-up memory write in the workflow. Its scope is strictly bounded to skill files generated by Preparation's `generate-now` decision; all other Preparation staging waits for Wrap-up. Wrap-up's memory write authority is otherwise exclusive and covers all remaining session artifacts. See `preparation/SKILL.md` § Core Principles for the rationale and mechanics.

> **Mistake promotion — two homes, routed by ownership.**

Beyond promoting staging → memory, the Wrap-up assistant routes each staged mistake-candidate to one of two homes (Always-Ask, confirmed with the user during Wrap-up DISCUSSION): a **skill-owned** trap becomes a `## ` section in `skills/{skill}/mistakes.md`, loaded in that skill's context via the delegation Load-Directives companion path; a **cross-cutting / no-owner** trap stays in the project memory tier at `mistakes/{area}/{slug}.md`, loaded at session start by [`mistake/SKILL.md`](../mistake/SKILL.md) P1. The assistant proposes skill-owner-vs-project at promotion; the user confirms. No CLI command is required — the Wrap-up assistant is the sole documented promotion mechanism. Promotion does not cause context reload.

> **Deterministic routing — no improvisation.**

Every staging file has a canonical promotion destination per the [Staging → Memory routing](#staging--memory-routing) table below. The assistant applies the table mechanically; unroutable items return `NEEDS_CONTEXT` with a `user-question:` block — the manager resolves the routing through the active runtime's user-decision primitive — rather than landing in an invented destination. "I'll just put this in `notes/` because it doesn't fit anywhere else" is a constraint violation.

> **Account for every staging file — promote OR backlog OR document drop.**

Every file under `sessions/.../{N}-{loop}/staging/` across every prior loop in this session must be accounted for. Three outcomes are valid:

1. **Promote** to the routed destination
2. **Backlog** with a reason recorded in the handoff summary
3. **Drop** with an explicit rationale (e.g., "duplicate of existing feature memory at <path>")

Silent drops are forbidden. The promotion-manifest is the audit trail.

> **Promotion-inventory rule — inventory `staging/` ONLY.**

Wrap-up inventories `staging/` **only** for promotion. The other four session-tree dirs — `transcripts/`, `working/`, `evaluation/`, `outputs/` — are **never** promotion sources. Promoting a transcript (or any non-`staging/` dir) is a constraint violation. The enumerated promotion sources are:

- Every workflow loop's `staging/`: `1-ideation/staging/`, `2-preparation/staging/`, `3-planning/staging/`, `4-execution/staging/` (and each `4-execution/task-{NN}-{slug}/staging/`).
- **`interview/staging/`** — the interview bootstrap surface keeps its own shape (not swept to the flat-4-slot model), but its `staging/` **remains a valid, enumerated promotion source**. In mature-project reruns the interview writes to its `staging/`, not directly to memory, and Wrap-up must enumerate it.

**F-P2 — do not over-narrow.** The exclusion targets `transcripts/`, `working/`, `evaluation/`, and `outputs/` — it does **not** exclude all non-workflow-loop dirs. The rule is "inventory `staging/` only", not "inventory workflow-loop `staging/` only". Narrowing it to drop `interview/staging/` would lose mature-project promotions and is wrong. See [`record/record-map.md` § Wrap-up promotion-inventory rule](../record/record-map.md) for the authoritative statement.

> **Bootstrap feature directory on-demand.**

`.gobbi/projects/{project-name}/features/{feature-name}/` and its sub-directories are created **on first write per sub-directory** during Wrap-up promotion — not eagerly, not earlier. Pre-Wrap-up phases assume the feature directory may not exist (or contains only prior sessions' content). Wrap-up creates `features/{feature-name}/{scenarios,checklists,decisions,references,design,discussions,backlogs,plans,mistakes,changelogs,rules,learnings,reviews,reports}/` lazily as content requires.

> **Supersession and move-on-terminal, never deletion.**

Wrap-up NEVER deletes any memory file. When a promotion would supersede an existing file's claim, the new file carries a `supersedes: <old-slug>` frontmatter field; the old file has its `status:` flipped to `superseded` + `superseded_by: <new-slug>` added (body preserved). These pointers are plain slugs, never paths ([`memory/rules.md` § 2.4](../memory/rules.md#24-cross-references-and-the-doc-graph)). Once the artifact reaches a terminal state (shipped, superseded, retired, dropped), Wrap-up moves the full file (`git mv`) to `archive/{type}/{area}/{YYYY-MM-DD}-{slug}.md` (the archive preserves the source area under the typed subdir). Active directories show only live work; `archive/` holds the complete moved files. Physical deletion is forbidden at every step — see [`memory/templates/archive.md`](../memory/templates/archive.md) for the move-on-terminal model.

> **Idempotent promotions.**

Re-running Wrap-up on the same session produces identical memory. Promotion targets are deterministic from staging file paths, and collision policy uses suffix disambiguation (never overwrite of distinct findings, write-or-overwrite of same-finding re-runs keyed by stable finding-ID).

> **Verification before claim.**

Wrap-up's canonical handoff artifact makes claims about what was shipped, promoted, deferred, or dropped. Each claim must be backed by a verifiable artifact (commit hash, promoted file path, backlog entry). The handoff summary cites pointers, not assertions.

---

## DISCUSSION Phase (manager + user, direct)

**Purpose**
Confirm with the user that the session is ready to wrap up, gather any final deferred items the user wants logged before the handoff, and construct the assistant delegation prompt. The leader is **not** spawned at this phase — the design work is already locked across prior loops' artifacts.

**Inputs**
- `session.json` — triplet (`project`, `feature`, `task`) and prior loops' completion verdicts
- All prior loops' canonical `outputs/` — summary of what shipped
- Discussion logs across loops — for narrative context

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Manager | All prior loops' artifacts + session.json | Read each prior loop's PASS-iter artifacts; build a short session-level outcome summary (what shipped, what was deferred, evaluator verdicts) | Outcome summary |
| 2 | Manager | Outcome summary | Run the active runtime's user-decision primitive: is anything deferred / open / observed that should be added to Wrap-up before the session closes? Common categories: rules discovered mid-session, mistake candidates, backlog candidates, supersession decisions | User-added items |
| 3 | Manager | User-added items | Record additions in `sessions/{date}-{session-id}/5-wrap-up/working/discussion-log.md` | Captured additions |
| 4 | Manager | Outcome summary + additions | Construct the assistant delegation prompt per [`delegation/templates/assistant.md`](../delegation/templates/assistant.md) — wrap-up's WORK is a deterministic routing pass + handoff authoring, not narrow Q&A, but the assistant role still applies | Wrap-up delegation prompt |
| 5 | Manager | Prompt | Verify zero `<<slot>>` placeholders; every slot filled | Verified prompt |

**Outputs**
- Outcome summary (input to WORK)
- User-added items (input to WORK)
- Wrap-up delegation prompt (ready for WORK spawn)

**Exit checklist**
- [ ] Every prior loop's canonical artifact read
- [ ] User confirmed through the active runtime's user-decision primitive that the session is ready to wrap up
- [ ] User-added items (if any) captured in discussion-log.md
- [ ] Delegation prompt constructed; zero unfilled slots

---

## WORK Phase (delegated to `assistant`)

**Purpose**
Read accumulated `staging/` directories across all prior loops, promote each file to its routed memory destination, write the per-session journal, and produce the canonical handoff summary. This is the substantive work of Wrap-up — the only loop's WORK that writes to memory.

### The 5-stage pipeline

Wrap-up is a **five-stage gated pipeline**. The five stages run in fixed order, span three owners, and carry two validation gates. The session record stays worktree-local until the final stage; the irreversible git action is **last** (D8).

| # | Stage | Owner | Failure semantics |
|---|---|---|---|
| 1 | **Session-record validation** | assistant (WORK) | gap detected → auto-backfill (mechanical-class) or `NEEDS_CONTEXT` (judgment-class); **BLOCKS stage 2** until resolved |
| 2 | **Memorization** (promotion: session record → memory) | assistant (WORK) | unroutable file → `NEEDS_CONTEXT`; never improvise a destination |
| 3 | **Memory validation** (= the Wrap-up loop's dual-system EVALUATION; **NON-SKIPPABLE**) | dual-system EVALUATION | `REVISE` → re-run the promotion (stage 2); `FAIL` → escalate to the user; **BLOCKS stage 5** |
| 4 | **Handoff** (file written + shown to the session) | assistant writes `5-wrap-up/outputs/handoff.md`; manager shows it to the session | missing required section → `REVISE` |
| 5 | **Git finalization** | **manager** (git skill) | runs **only after stage 3 PASS**; **NEVER run by the assistant** |

**What WORK owns**: stages 1 + 2, plus authoring the stage-4 handoff file. Stage 3 is the loop's EVALUATION phase (a separate phase below). Stage 5 — and the act of *showing* the stage-4 handoff to the session — are the manager's, after EVALUATION passes. The detailed step table below covers WORK's stages (1, 2, and the handoff-authoring half of 4).

> **D13 — stage 3 is NON-SKIPPABLE.** Stage-3 memory validation IS the Wrap-up loop's dual-system EVALUATION (D11). No `evaluate.mode: skip` setting — and no other settings path — can remove it. It always runs, and it always gates the irreversible git stage 5. A wrap-up that consolidates wrong memory poisons every future session; the gate is paid once, the miss compounds. See § EVALUATION Phase for the gate's mechanics.

> **D8 — git is stage 5, the last stage, manager-owned.** The manager runs git finalization (commit the promotion writes, push, open / merge the PR, clean up the worktree) only after stage 3 returns `PASS`. The procedure is not duplicated here — it is [`git/SKILL.md` § P4 (Push and open PR)](../git/SKILL.md) + [§ P5 (Land PR)](../git/SKILL.md), driven by [`orchestration/workflow/wrap-up.md` § What Wrap-up commits](../orchestration/workflow/wrap-up.md). The assistant NEVER pushes, merges, or cleans up the worktree (see § Constraints). The whole `sessions/` tree is gitignored and worktree-local; it is the **memory promotion writes** (stage 2's output under `features/`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`, …) that stage 5 commits and the PR absorbs.

> **"Memorization" names stage 2, not the per-loop RECORD sub-phase (D7).** Stage 2 is literally the **Memorization** stage — the promotion of session record → memory. The word "memorization" in gobbi now names THIS wrap-up stage. The per-loop capture sub-phase is **RECORD** (see [`record/SKILL.md`](../record/SKILL.md)); it stages findings only and never writes memory. Per-loop sub-phase = RECORD; wrap-up promotion stage = memorization. Do not conflate the two.

> **Stage-2c — compaction is stage 2's final sub-step.** Within stage 2 (memorization), Wrap-up first writes its promotions — the routing + write + move-on-terminal + journal of WORK Steps 3–6 — then runs **Stage-2c memory compaction** as its last sub-step, consolidating any over-cap `{type}/{area}/` area before the Stage-3 gate. Because Stage-2c writes land inside stage 2, the non-skippable Stage-3 dual-system gate (D13) validates them. Stage-2c runs ONLY when `settings.compaction.enabled` is `true` (ships dormant). Full procedure: § Stage 2c — Memory compaction (below).

**Inputs**
- All prior loops' staging trees: `sessions/{date}-{session-id}/{1-ideation,2-preparation,3-planning,4-execution}/staging/`, plus `interview/staging/` when an interview ran this session
- All prior loops' canonical outputs (for handoff content)
- All prior loops' evaluation outputs across all iters (for cross-loop closure audit)
- Discussion logs per loop
- Existing memory state — read-only snapshot of `.gobbi/projects/{project-name}/` for collision / supersession detection
- User decisions on contribution points (carried over from DISCUSSION + the active runtime's user-decision primitive during WORK)
- The Wrap-up delegation prompt's outcome summary + user-added items

**Procedure** — seven sequential steps, grouped under pipeline stages 1, 2, and the handoff-authoring half of stage 4. The assistant runs them in order; idempotency contract holds across re-runs. The **Stage** column maps each step to its pipeline stage.

| # | Stage | Step | Action |
|---|---|---|---|
| 1 | **1 — validation** | **Snapshot pre-Wrap-up state** | Capture the current `.gobbi/projects/{project-name}/` state as the baseline. Save to `sessions/{date}-{session-id}/5-wrap-up/working/pre-wrap-up-snapshot.txt`. This is what stage-3 memory validation diffs against |
| 2 | **1 — validation** | **Enumerate all staging across all loops** | For each loop directory in `sessions/{date}-{session-id}/{1-ideation,2-preparation,3-planning,4-execution}/` **plus `interview/`** (when an interview ran this session), recursively list `staging/` — and **only** `staging/`; never `transcripts/`, `working/`, `evaluation/`, or `outputs/` (per § Promotion-inventory rule). Build a master inventory at `sessions/{date}-{session-id}/5-wrap-up/working/staging-inventory.md` — every staging file path, sized + frontmatter-extracted. **Step 2.5 runs immediately after this step** — see `### Step 2.5` below for the prior-loop RECORD compliance scan that completes stage 1 and must finish (gap → auto-backfill or `NEEDS_CONTEXT`) before stage 2 begins |
| 3 | **2 — memorization** | **Determine feature destination** | Read `session.json.feature` for the canonical feature slug `{feature-name}` (set during Ideation Sub-step B Lock Scope). If `.gobbi/projects/{project-name}/features/{feature-name}/` does not exist, plan to bootstrap it lazily at Step 5. If it exists from prior sessions, capture pre-Wrap-up state of each sub-directory for collision detection |
| 4 | **2 — memorization** | **Apply routing table to each staging file** | For every staging file in the inventory: (a) identify staging type from path; (b) look up destination in the routing table; (c) read frontmatter for `mistake-candidate: true`, `supersedes:`, `project-scope: true`, `disposition: deferred`, `area:` — these are routing modifiers; (d) **resolve the destination `{area}/` segment** for every by-area type via the §1.5 deterministic selection rule (see the area-resolution note below the routing table) — this is the single place the selection rule is APPLIED at promotion; (e) resolve final destination per modifiers + collision policy; (f) if user-confirm is required (rules / project-wide design / mistake scope / unrouted file), return `NEEDS_CONTEXT` with a `user-question:` block — the manager uses the active runtime's user-decision primitive on your behalf, then re-delegates with the confirmed routing decision; (g) record routing decision (including the resolved area) in `working/promotion-manifest.md`. **Unrouted files escalate — never improvise** |
| 5 | **2 — memorization** | **Bootstrap + write to memory** | For each routing decision: create the destination's parent directory if missing (lazy bootstrap — this creates the `{type}/{area}/` area dir too, since the resolved area is part of the destination path; no extra step is needed for the deeper level); write the file at the destination per collision policy; for first write into `features/{feature-name}/`, also create or update `features/{feature-name}/README.md` per [`memory/templates/feature.md`](../memory/templates/feature.md); stamp the appropriate template from [`memory/templates/`](../memory/templates/) for each promotion. **Move-on-terminal**: when a collision resolution or incoming frontmatter (`shipped`, `superseded`, `retired`, `dropped`) indicates the existing destination file has reached a terminal state, stamp archival frontmatter on it and move it (`git mv`) to `archive/{type}/{area}/{YYYY-MM-DD}-{slug}.md` before writing the new file — never delete it. The archive preserves the file's source area under the typed subdir. Repoint any inbound references to the archive path. See [`memory/templates/archive.md`](../memory/templates/archive.md) for the move procedure |
| 6 | **2 — memorization** | **Write per-session journal entry** | Synthesize the session's work-log narrative — what the leader investigated, what the executor implemented, what the evaluator flagged, what the user decided. Write a single journal entry at `.gobbi/projects/{project-name}/notes/{area}/{date}-{slug}.md` (the journal entry's `{area}` is resolved by the [§1.5 selection rule](../memory/rules.md#15-area-namespace-the-second-category-axis-under-each-type) like any record) per [`memory/templates/notes.md`](../memory/templates/notes.md). This is the per-session development journal — always one entry per session. It is the durable cross-session handoff (the stage-4 `handoff.md` is session-scoped and dies with the worktree; this journal entry survives in memory) |
| 7 | **4 — handoff** | **Synthesize handoff summary** | Write the canonical handoff at `sessions/{date}-{session-id}/5-wrap-up/outputs/handoff.md` (and any decomposed artifact files alongside) with required sections: Summary, Shipped, Deferred / Open, Decisions to respect, Pointers, Promotion summary. Each claim cites a verifiable artifact path. The artifact carries the [Artifact frontmatter schema](../record/SKILL.md#artifact-frontmatter-schema) with `artifact_type: handoff`. This step authors the file; the manager **shows it to the session** as the final message before `workflow.finish` (see § Stage 4 — Handoff below) — and only after stage-3 memory validation has passed |

**Outputs**

Session-record writes:
- `sessions/{date}-{session-id}/5-wrap-up/working/pre-wrap-up-snapshot.txt` — baseline for evaluation
- `sessions/{date}-{session-id}/5-wrap-up/working/staging-inventory.md` — master inventory across all loops
- `sessions/{date}-{session-id}/5-wrap-up/working/promotion-manifest.md` — append-only routing-decision log (1 entry per staging file: promote target / backlog reason / drop rationale)
- `sessions/{date}-{session-id}/5-wrap-up/outputs/handoff.md` — canonical handoff summary (plus any decomposed artifact files); written at Step 7 of WORK (also persisted at RECORD per the Artifact frontmatter schema)

Memory writes (the substantive work). Every by-area destination carries the `{area}/` segment (resolved at Step 4 per the §1.5 selection rule); the parent area dir is created lazily by Step 5's "create the destination's parent directory if missing" (the deeper `{type}/{area}/` path is handled by the same lazy-bootstrap — no extra step). `skills/` is the sole non-by-area destination.
- `.gobbi/projects/{project-name}/features/{feature-name}/{scenarios,checklists,design,discussions,backlogs,mistakes,changelogs,rules,learnings,references}/{area}/{slug}.md` — feature-scoped promotions per routing table (bare-slug types)
- `.gobbi/projects/{project-name}/features/{feature-name}/{plans,reviews,reports,decisions}/{area}/{date}-{slug}.md` — feature-scoped promotions per routing table (date-prefixed types)
- `.gobbi/projects/{project-name}/features/{feature-name}/README.md` — feature index + activity log (created or updated; the README is the structural exception — NOT by-area)
- `.gobbi/projects/{project-name}/mistakes/{area}/{slug}.md` — project-scoped mistakes (user-confirmed scope)
- `.gobbi/projects/{project-name}/rules/{area}/{slug}.md` — project rules (rare; user-confirmed)
- `.gobbi/projects/{project-name}/design/{area}/{slug}.md` — project-wide design docs (rare; user-confirmed)
- `.gobbi/projects/{project-name}/notes/{area}/{date}-{slug}.md` — per-session journal entry (always written at Step 6)
- `.gobbi/projects/{project-name}/backlogs/{area}/{slug}.md` — project-level deferrals
- `.gobbi/projects/{project-name}/learnings/{area}/{slug}.md` — project-level learnings (cross-feature; feature-scoped learnings go to `features/{feature-name}/learnings/{area}/`)
- `.gobbi/projects/{project-name}/reviews/{area}/{date}-{slug}.md` — review activity result documents
- `.gobbi/projects/{project-name}/reports/{area}/{date}-{slug}.md` — status / post-mortem / analytics reports
- `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` — project-specific skills from Preparation `generate-now` staging (NOT by-area — an authoring surface, not a memory type)
- `.gobbi/projects/{project-name}/archive/{type}/{area}/{date}-{slug}.md` — full moved artifacts (move-on-terminal model): terminal-state files moved here by `git mv` with archival frontmatter stamped; the archive preserves the source area under the typed subdir

**Exit checklist**
- [ ] Pre-Wrap-up snapshot captured at `working/pre-wrap-up-snapshot.txt`
- [ ] Every staging file in `working/staging-inventory.md` has a corresponding entry in `working/promotion-manifest.md` (promoted / backlogged / dropped with reason)
- [ ] Feature directory bootstrapped lazily (only sub-directories with promoted content)
- [ ] `features/{feature-name}/README.md` created or updated
- [ ] Per-session journal entry written at `notes/{area}/{date}-{slug}.md`
- [ ] Handoff summary written at `5-wrap-up/outputs/handoff.md` with all required sections + frontmatter
- [ ] Every routing decision applied mechanically per the table; no improvised destinations
- [ ] User-confirm requested via `NEEDS_CONTEXT` (manager used the active runtime's user-decision primitive on your behalf) for: rules promotion, project-wide design, mistake scope, unrouted staging files
- [ ] Step 2.5 prior-loop compliance scan recorded in `working/promotion-manifest.md`
- [ ] Stage-2c memory compaction run when `settings.compaction.enabled` (else skipped): every over-`softCap` `{type}/{area}/` consolidated to `live_count ≤ softCap`; merge manifest built; all inbound ref classes repointed; `check-merge-ref-integrity.sh` + `check-markdown-links.sh` + `validate-frontmatter.sh` + `check-workflow-mirror-consistency.sh` all exit 0

### WORK discipline

- **No silent drops.** Every staging file is accounted for in the promotion-manifest.
- **No improvised destinations.** The routing table is the contract; unrouted files escalate.
- **Cite the discussion.** Every routing decision that required the active runtime's user-decision primitive is traceable to the discussion log entry that authorized it.
- **Stamp templates.** Every promotion uses the appropriate template from [`memory/templates/`](../memory/templates/) — freeform writes to memory are forbidden.

### Step 2.5 — Prior-loop RECORD compliance check

**Purpose** — Before Step 3 reads `session.json.feature`, verify that every prior loop's staging output is structurally sound for promotion. This is a read-only compliance scan: it detects shape violations and type-vocabulary errors, then either auto-backfills mechanical-class findings or escalates judgment-required findings via `NEEDS_CONTEXT`.

**When it runs** — Immediately after Step 2 builds the staging inventory at `working/staging-inventory.md`. No memory writes happen until all Step 2.5 findings are resolved.

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
5. Record the disambiguation in `working/promotion-manifest.md`.

**Gap report destination** — All Step 2.5 findings (gaps detected, classification, action taken, auto-backfill result, or NEEDS_CONTEXT escalation) are appended to `sessions/{date}-{session-id}/5-wrap-up/working/promotion-manifest.md`. Each entry carries: loop name, staging path, gap category, finding type, action (auto-backfill / NEEDS_CONTEXT), result or escalation reason.

**Exit criteria for Step 2.5** — Step 3 may not begin until:
- Every `shape-mismatch` and `template-mismatch` gap with a mechanical-class type has been auto-backfilled.
- Every judgment-required finding has a recorded NEEDS_CONTEXT escalation with a manager response.
- Every `zero-staging` and `directory-absent` gap has a recorded NEEDS_CONTEXT escalation with a manager response.
- All Step 2.5 gap report entries are written to `working/promotion-manifest.md`.

### Dual-system production (Codex proposer)

When `propose.mode: dual` (the per-loop `workflow.{loop}.propose.mode` setting; default `dual`), a Codex proposer runs in parallel with the assistant during WORK — the creation-time analogue of the dual-system EVALUATION. The proposer is the `codex exec` assistant-wrapper owned by [`codex/SKILL.md` § Dual-System Production](../codex/SKILL.md); the manager orchestrates the spawn, selective integration, and gap classification per [`orchestration/workflow/production.md`](../orchestration/workflow/production.md). This section states only the per-loop boundary and does not re-derive that orchestration.

- **Codex proposal artifact.** The Codex proposer writes an independent alternative promotion / routing / supersession / skill-vs-project routing + handoff emphasis to `sessions/{date}-{session-id}/5-wrap-up/working/proposals/codex/draft-iter{n}.md` — never the canonical promotion manifest + handoff. Codex proposes; the assistant writes.
- **Two-phase freeze boundary.** The Codex proposal is **frozen** before the assistant integrates it; the canonical promotion outputs (the promotion manifest + handoff) are **frozen** before EVALUATION (stage-3 memory validation) spawns. The assistant integrates against the frozen proposal — it never races a still-writing Codex run — and the canonical outputs do not change under the evaluator. Derived from [`mistakes/verification/freeze-producer-artifact-before-evaluating.md`](../../mistakes/verification/freeze-producer-artifact-before-evaluating.md).
- **Producer selective integration.** The assistant is the default integrator. After the pre-integration freeze it reads the frozen proposal and **selects** the principle-better elements (folds in the stronger Codex element; keeps its own where stronger; **never naive-blends**), logging each delta to `sessions/{date}-{session-id}/5-wrap-up/working/reconciliation-iter{n}.md` (the Integration Log). The assistant integrates the routing decisions before finalizing the promotion manifest, and surfaces scope / skill-vs-project forks; it surfaces any LARGE gap to the manager, who adjudicates and escalates to the user. See [`orchestration/workflow/production.md`](../orchestration/workflow/production.md) for the integration + gap-classification orchestration.
- **Degraded mode.** If the Codex proposal is empty, times out, or errors, the assistant proceeds Claude-only and stamps `production_mode: claude-only` + `codex_proposal_absent_reason: <timeout|empty|error>` in the canonical handoff artifact's frontmatter. A missing Codex proposer is not a safety gate.

---

## Staging → Memory routing

The canonical promotion routing — this table is the contract for **pipeline stage 2 (memorization)**. The assistant applies it mechanically. Wrap-up evaluation (stage 3) verifies adherence (see [`evaluation.md`](evaluation.md)).

| Session staging path | Memory destination | Trigger condition |
|---|---|---|
| `sessions/.../{N}-{loop}/staging/scenarios/{slug}.md` | `features/{feature-name}/scenarios/{area}/{slug}.md` | Always |
| `sessions/.../{N}-{loop}/staging/checklists/{slug}.md` | `features/{feature-name}/checklists/{area}/{slug}.md` | Always |
| `sessions/.../{N}-{loop}/staging/decisions/{slug}.md` (no special frontmatter) | `features/{feature-name}/decisions/{area}/{date}-{slug}.md` | Default |
| `sessions/.../{N}-{loop}/staging/decisions/{slug}.md` with frontmatter `mistake-candidate: true` | `skills/{skill}/mistakes.md` `## ` section (skill-owned trap) OR the project memory tier `mistakes/{area}/{slug}.md` (cross-cutting / no-owner, project-scope) OR `features/{feature-name}/mistakes/{area}/{slug}.md` (cross-cutting, feature-scope) | Return `NEEDS_CONTEXT`; manager confirms skill-owner-vs-project routing through the active runtime's user-decision primitive |
| `sessions/.../{N}-{loop}/staging/decisions/{slug}.md` with frontmatter `disposition: deferred` | `features/{feature-name}/backlogs/{area}/{slug}.md` (feature-scope) OR `backlogs/{area}/{slug}.md` (project-scope per frontmatter `project-scope: true`) | Always — deferred findings route to backlogs |
| `sessions/.../{N}-{loop}/staging/references/{slug}.md` | `features/{feature-name}/references/{area}/{slug}.md` | Always |
| `sessions/.../{N}-{loop}/staging/design/{slug}.md` | `features/{feature-name}/design/{area}/{slug}.md` (default) OR `design/{area}/{slug}.md` (project-wide; rare) | If project-wide, return `NEEDS_CONTEXT`; manager confirms through the active runtime's user-decision primitive |
| `sessions/.../{N}-{loop}/staging/discussions/{slug}.md` | `features/{feature-name}/discussions/{area}/{slug}.md` | Always |
| `sessions/.../{N}-{loop}/staging/backlogs/feature/{slug}.md` | `features/{feature-name}/backlogs/{area}/{slug}.md` | Always |
| `sessions/.../{N}-{loop}/staging/backlogs/project/{slug}.md` | `backlogs/{area}/{slug}.md` | Always |
| `sessions/.../{N}-{loop}/staging/reviews/{slug}.md` | `features/{feature-name}/reviews/{area}/{date}-{slug}.md` (default) OR `reviews/{area}/{date}-{slug}.md` (project-wide; cross-feature) | Default feature-scope; if cross-feature / repo-wide, return `NEEDS_CONTEXT`; manager confirms through the active runtime's user-decision primitive |
| `sessions/.../{N}-{loop}/staging/reports/{slug}.md` | `features/{feature-name}/reports/{area}/{date}-{slug}.md` (default) OR `reports/{area}/{date}-{slug}.md` (project-wide; cross-feature) | Default feature-scope; if cross-feature, return `NEEDS_CONTEXT`; manager confirms through the active runtime's user-decision primitive. `{date}` is the session start date |
| `sessions/.../{N}-{loop}/staging/changelogs/{slug}.md` | `features/{feature-name}/changelogs/{area}/{slug}.md` | Always — feature-scope shipped-work changelog entries (Execution-loop typical) |
| `sessions/.../{N}-{loop}/staging/learnings/{slug}.md` | `features/{feature-name}/learnings/{area}/{slug}.md` (default) OR `learnings/{area}/{slug}.md` (project-wide; cross-feature) | Default feature-scope; if cross-feature, return `NEEDS_CONTEXT`; manager confirms through the active runtime's user-decision primitive |
| `sessions/.../{N}-{loop}/staging/notes/{slug}.md` | `notes/{area}/{date}-{slug}.md` | Always — loop-scope journal entry (rare; per-session journal is Wrap-up's direct Step 6 write) |
| `sessions/.../3-planning/staging/plans/{slug}.md` | `features/{feature-name}/plans/{area}/{date}-{slug}.md` | Always — Planning-loop output |
| `sessions/.../2-preparation/staging/skills/{slug}/SKILL.md` | `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` | Already-promoted (manifest-only) — the manager promotes these before Planning starts (see `preparation/SKILL.md` § Core Principles and `orchestration/workflow/preparation.md` § WORK Phase); Wrap-up verifies presence and records in `promotion-manifest.md` but does not re-promote unless the destination is missing. **`skills/` is NOT by-area** — it is a project authoring surface, not a memory type, so it carries no `{area}/` segment |
| Rules surfaced during session (assistant identifies from session content; not from a staging file) | `rules/{area}/{slug}.md` (project-wide) OR `features/{feature-name}/rules/{area}/{slug}.md` (feature-specific) | Return `NEEDS_CONTEXT`; manager confirms scope through the active runtime's user-decision primitive — rules are rare and load-bearing, and the tier (project-wide vs feature-specific) is user-confirmed |
| Per-session development journal entry (Wrap-up authors at session close — not from staging) | `notes/{area}/{date}-{slug}.md` | Always — one journal entry per session capturing the work-log narrative |

All destination paths are relative to `.gobbi/projects/{project-name}/`. Every by-area destination carries the `{area}/` segment between the type dir and the filename — the area is resolved at promotion by the area-resolution rule below (WORK Step 4); `skills/` is the sole non-by-area destination (an authoring surface, not a memory type). Session-staging paths stay flat (no `{area}/`) — the area is resolved only at the promotion write.

### Area resolution on promotion (the §1.5 selection rule, applied here)

This is the **single place** the area is resolved at promotion (WORK Step 4 step (d)). For every by-area staging file, Wrap-up resolves the destination `{area}/` segment via the **deterministic area-selection rule** in [`memory/rules.md` § 1.5](../memory/rules.md#15-area-namespace-the-second-category-axis-under-each-type) — the SAME rule and SAME priority order the validator's area allowlist enforces, so the written path and the validator's path-derived check agree by construction. The rule is deterministic (priority-ordered first-match); it is NOT total — a record may match no area, which surfaces a user-decision (NEEDS_CONTEXT) rather than a `_shared` fallback:

1. **Explicit `area:` wins.** If the staged file carries `area: {x}` and `{x}` is in the type's §1.5 allowlist, use `{x}`. (`area:` is staging-only — it is stripped from the promoted file per the strip table below; the resolved area lives only in the directory path.)
2. **Else scan the type's fixed priority-ordered tag→area map; the FIRST area whose any mapped tag is present wins** (each by-area type declares its OWN map in [`memory-vocabulary.json`](../../memory-vocabulary.json) `.tagAreaMap.{type}`, which Wrap-up reads for area RESOLUTION following this prose spec; the validator does NOT read `.tagAreaMap` — it enforces the resolved area against `.types.{type}.areas`; the priority semantics are in §1.5). `reviews` / `reports` have NO `.tagAreaMap` entry — their REQUIRED `review_kind` / `report_type` value IS the area (kind axis, resolved in step 1). First, **normalize a feature-dir input to an area** per the config's `.tagAreaMap.featureDirNormalization` before matching.
3. **No area matched → user-decision (NOT a fallback area).** When steps 1-2 resolve nothing, return `NEEDS_CONTEXT` with a `user-question:` block — the manager runs a user-decision through the active runtime's user-decision primitive: the user picks an existing area for that type OR creates a new one. Creating an area is an **Always-Ask edit** to [`memory-vocabulary.json`](../../memory-vocabulary.json) (append to `.types.{type}.areas`, plus a `.tagAreaMap.{type}` entry if it needs tag routing). Never invent a new area silently to dodge the decision.

The allowlist is closed (§1.5): the project declares each type's list in [`memory-vocabulary.json`](../../memory-vocabulary.json) under `.types.{type}.areas` — one independent list per by-area type, the SAME arrays the validator enforces. An area outside the type's allowlist is a validator failure. Record the resolved area in `working/promotion-manifest.md`.

### Frontmatter allowlist on promotion (strip staging-only fields)

When Wrap-up promotes a staged file, it writes the destination with **ONLY** the base frontmatter + that type's extension fields (the per-type allowlist in [`memory/rules.md` § 2`](../memory/rules.md)). Staging-only fields that existed purely to route or annotate the file during the session are **stripped** — they never persist into memory:

| Staging-only field | Disposition on promotion |
|---|---|
| `mistake-candidate: true` | **Stripped.** Its presence routed the file to `mistakes/` (see routing table); once routed, its job is done. The promoted mistake file does NOT carry it. (Currently retained on legacy mistake files — a migration target, not a promotion target.) |
| `area:` | **Stripped (Branch B).** It is an optional staging-time override that selected the destination area (area-resolution rule above, step 1). Once the file lands under `{type}/{area}/`, the directory encodes the resolved area, so the promoted file carries NO `area:` — the area is derived from the PATH, never re-read from frontmatter. (Reciprocal of [`memory/rules.md` § 2.6](../memory/rules.md#26-staging-field-stripping-on-promotion).) |
| `finding-id` | **Stripped** when used purely as eval-routing / collision-keying. The base `session` field + `git log` carry provenance. |
| `disposition` | **Stripped** when used purely as eval routing (e.g. `disposition: deferred` that routed the file to `backlogs/`). The destination's own lifecycle is its unified `status` field (e.g. a backlog's `open` / `deferred` / `closed` — `disposition` is no longer a backlogs field, per [`memory/rules.md` § 2.2](../memory/rules.md#22-per-type-extension-fields--the-status-model)), set fresh per the type spec. |
| `promoted-from`, `promoted-at` | **Dropped.** `git log` + the base `session` + `created` fields already carry provenance; these ad-hoc keys are redundant drift and are never written to memory. |

Mechanism: the promotion step reads the staging frontmatter, applies the routing modifier (e.g. `mistake-candidate` → `mistakes/`), then writes the destination file through the per-type allowlist — base + extensions only. Any field not on the allowlist for the destination type is dropped. See [`memory/rules.md` § 2.6](../memory/rules.md#26-staging-field-stripping-on-promotion) for the standard and [`record/SKILL.md` § Staging-field stripping on promotion](../record/SKILL.md#staging-field-stripping-on-promotion) for the reciprocal staging-side documentation.

**Auto-stamp the `author` + `keywords` base fields on promotion.** `author` and `keywords` are **required durable base fields** (§2.1) — NOT staging-only, so they are never stripped. When Wrap-up writes a promoted file it stamps:

- **`author`** — from `session.json.system`: `claude-code` → `author: claude`, `codex` → `author: codex`. A human hand-edit of a memory file sets `author: user`. The tag is coarse (provider, not model version), so it stays stable across model upgrades.
- **`keywords`** — default `keywords: []` when the staged file carries none; a non-empty staged `keywords` list is preserved as-is. It is the required-may-be-empty overflow for tags outside the §2.5 controlled vocabulary.

**Collision policy** when destination file already exists:

| Scenario | Action |
|---|---|
| Same `finding-id` frontmatter (stable identifier on the staging file) as existing destination | Overwrite — this is a content update for the same finding |
| Different `finding-id`, same slug | Disambiguate with numeric suffix (`-2`, `-3`); record in `promotion-manifest.md` |
| Existing destination's content is contradicted by the new content | Stamp new file with `supersedes: <existing-slug>` frontmatter (a plain slug, never a path — [`memory/rules.md` § 2.4](../memory/rules.md#24-cross-references-and-the-doc-graph)); flip the existing file's `status: superseded` + `superseded_by: <new-slug>` (body preserved); then move it (`git mv`) to `archive/{type}/{area}/{YYYY-MM-DD}-{slug}.md` per the move-on-terminal model (never delete; the archive preserves the source area); record decision in `promotion-manifest.md` |
| Cross-loop slug collision (e.g., Planning + Execution both stage a finding with same slug but different `finding-id`) | Suffix with the source loop name (`{slug}-planning.md` vs `{slug}-execution.md`) |

### Archive typed-subdir routing on terminal-state moves

When a promotion finds the destination file already terminal (incoming `status: shipped|superseded|retired|dropped`, or a supersession collision), Wrap-up stamps archival frontmatter and moves the full file (`git mv`) to `archive/{type}/{area}/{YYYY-MM-DD}-{slug}.md` — the **typed** subdir THEN the **area** sub-dir, where `{type}` is the file's ORIGINAL type and `{area}` is the file's resolved area, preserved from its active path (`archive/decisions/memory/`, `archive/backlogs/wrap-up/`, …). The area is the same segment the §1.5 selection rule resolved on the active file, so `archive/{type}/{area}/` mirrors the originating `{type}/{area}/` home (GAP-1). The moved file **keeps its original `type`** (`archive` is never a `type` value); the directory marks it archived. See [`memory/templates/archive.md`](../memory/templates/archive.md) and [`memory/rules.md` § 2.1](../memory/rules.md).

### Non-standard session-subdir cleanup (going-forward)

Wrap-up enforces the canonical session tree shape going forward (see [`orchestration/SKILL.md`](../orchestration/SKILL.md) for the canonical tree). When Wrap-up touches the active session's loop directories, these non-canonical subdirs are normalized:

- **No `followups/` dir.** A `{N}-{loop}/evaluation/followups/` directory is non-canonical — follow-ups are findings. Route each to `staging/decisions/` (deferred) or `staging/backlogs/`; do not keep an ad-hoc `followups/` dir.
- **Fold `restore/` into `working/`.** A `{N}-{loop}/working/restore/` sub-scratch tier is not sanctioned; any resume / restore scratch lives directly in `{N}-{loop}/working/`.
- **Remove `tmp/`.** No `tmp/` scratch tier exists in the canonical tree — `{N}-{loop}/working/` is the only scratch surface. A session `tmp/` dir is removed (after confirming it holds only scratch, never durable memory).

This cleanup is **going-forward + opportunistic only** — Wrap-up normalizes the shape of the session it is closing and fixes a closed session opportunistically if it is reopened. It does NOT mount a retro-sweep across all closed sessions (legacy `state.json` / root `HANDOFF.md` in closed session dirs are left untouched).

---

## Stage 2c — Memory compaction (consolidate over-cap areas)

**Stage-2c is the final sub-step of stage 2 (memorization).** It runs AFTER stage 2's promotion writes have all landed — the routing + write + move-on-terminal + journal of WORK Steps 3–6 — and BEFORE the Stage-3 memory-validation gate. Its job: hold every `{type}/{area}/` area (the §1.5 scannable unit) under its cap by folding related records, losslessly, into ONE consolidated Map-of-Content (MoC) file and `git mv`-ing the originals to `archive/{type}/{area}/`. It never hard-deletes. The standard it implements is [`memory/rules.md` § 5](../memory/rules.md); this section is the procedure, and [`check-merge-ref-integrity.sh`](../orchestration/scripts/check-merge-ref-integrity.sh) is its runnable gate.

> **Eval-emphasis — Stage-2c writes are validated by Stage-3.** Stage-2c's writes (the consolidated MoC file, the repointed inbound references, the `git mv`'d archives) land inside stage 2, so the non-skippable Stage-3 dual-system memory-validation gate (D13) validates them. Stage-2c runs before the handoff is shown and before git finalization — never after the gate.

> **Settings gate — ships dormant.** Compaction runs ONLY when `settings.compaction.enabled` is `true`. It ships `false` (dormant): a session with the flag off skips Stage-2c entirely. The per-area caps live in [`memory-vocabulary.json`](../../memory-vocabulary.json) as `compaction.softCap` / `compaction.hardCap` (gobbi: softCap 12 / hardCap 15, with optional per-type overrides — [`memory/rules.md` § 5.4](../memory/rules.md)). Auto-merges are bounded by `maxAutoActions` (under `settings.compaction`).

### Stage-2c order — (a) … (g)

Run these in order, for each capped `{type}/{area}/` area:

- **(a) Count.** Count the live records in each capped `{type}/{area}/`; flag every area whose `live_count` exceeds `softCap`.
- **(b) Terminal-archival + staleness pre-step (uniform).** Before any merge, sweep the flagged area for records already terminal (`shipped` / `superseded` / `retired` / `dropped`) and move them (`git mv`) to `archive/{type}/{area}/` per the move-on-terminal model ([`memory/templates/archive.md`](../memory/templates/archive.md)); then run an **Always-Ask staleness review** of the remaining live records (stale-but-live candidates surface through the manager's user-decision primitive). **Re-count** the area — the archival pre-step alone may bring `live_count` back to `≤ softCap`, in which case no merge is needed.
- **(c) Cluster.** Within the one over-cap area, group the related records that share a subject into a cluster — never across areas, never unrelated records lumped together.
- **(d) Merge to cap.** Merge each related cluster into one consolidated MoC file until `live_count(area) ≤ softCap`. Merging is **AUTO within the `maxAutoActions` budget for non-high-value types**, but **`mistakes` and `rules` merges are Always-Ask** — they surface through the manager's user-decision primitive before they run. If the area is over cap but holds **no related cluster**, that is **Always-Ask** too (merge a cluster / leave over-cap / raise the cap / archive an oldest-terminal item) — never force a junk merge.
- **(e) Build the merge manifest.** Record one TSV row per merged-away source (fields below) — the input to the gate.
- **(f) Repoint every inbound reference class.** Repoint ALL inbound refs that named a merged-away source onto the consolidated file. Enumerate every reference class per the [`memory/rules.md` § 1.5](../memory/rules.md) refactor procedure (path refs, prose refs, `required-mistakes:` PATH refs, inventory / table refs, wrapper-description refs, pipeline-label refs, in-fence example paths, cross-doc mentions, and body `[[slug]]` wikilinks): a **slug-ref** repoints to `consolidated_slug`; a **path-ref** repoints to the consolidated file's path; a reference that must address one source's content repoints to the split form `moc-slug#source-anchor` (the anchor == the source's own slug, [`memory/rules.md` § 5.2](../memory/rules.md)).
- **(g) Run all standing guards to zero.** Run `check-merge-ref-integrity.sh <manifest> <scan-root>` ([the merge ref-integrity gate](../orchestration/scripts/check-merge-ref-integrity.sh)) PLUS [`check-markdown-links.sh`](../orchestration/scripts/check-markdown-links.sh) PLUS [`validate-frontmatter.sh`](../memory/scripts/validate-frontmatter.sh) over the post-compaction tree, PLUS [`check-workflow-mirror-consistency.sh`](../orchestration/scripts/check-workflow-mirror-consistency.sh) (the runtime-doc mirror gate — self-locating, zero-arg; confirms every `orchestration/workflow/*` doc resolves in the `.claude/` per-file mirror, the same F1 class as a missing `production.md` symlink) — ALL must exit 0 before Stage-2c is done. (`<scan-root>` is the project dir `.gobbi/projects/{project-name}/`; the gate prunes `archive/`. `check-workflow-mirror-consistency.sh` checks the worktree `.claude/` runtime surface, not the memory tree, so it takes no `<scan-root>`.) A green frontmatter validator alone is NOT enough — the standing content-guards AND the runtime-doc mirror guard must re-run over the post-promotion tree, the same discipline a promotion's green-check owes.

### Merged-file write mechanics (Checklist 11)

When Stage-2c writes the consolidated MoC file:

1. **Stamp the type template** from [`memory/templates/`](../memory/templates/) — the consolidated file keeps the merged sources' `type`.
2. **`name` = a new subject slug** — a fresh, descriptive subject slug for the consolidation (§1.3 naming), never a source's slug and never a positional index.
3. **`tags` = the union of the sources' tags**, each tag still within that type's controlled pool (§2.5); any overflow goes to `keywords`.
4. **`supersedes: [all source slugs]`** — the list form (many→one consolidation-merge, §2.4); it MUST equal the merge's source set (the gate's Family 2 checks this both ways).
5. **One `## ` section per source, anchored by the source's own slug.** Copy each source's full type-required structure **verbatim** (a merged `mistakes` source keeps all four elements — What happened / Why it happens / Correct approach / How to detect). The heading slugifies to the source slug, so the stable anchor == the manifest's `source_anchor` ([`memory/rules.md` § 5.2](../memory/rules.md)).
6. **A `## Sources` section** listing each archived original as a `[[slug]]` wikilink plus its `archived_path` — one bullet per merged source.

Each merged source is also set `status: superseded` + `superseded_by: <consolidated-slug>` and `git mv`'d to `archive/{type}/{area}/` with `archive_reason: merged` ([`memory/rules.md` § 5.5](../memory/rules.md)).

### Merge manifest field names (must match the gate exactly)

The manifest is TSV; the field names match [`check-merge-ref-integrity.sh`](../orchestration/scripts/check-merge-ref-integrity.sh) exactly:

- **MERGE row** — one per merged-away source, the `merge` kind plus six fields: `merged_away_slug` · `merged_away_active_path` · `archived_path` · `source_anchor` · `consolidated_slug` · `consolidated_path`.
- **SPLIT row** — one per split-out section (optional), the `split` kind plus three fields: `split_out_anchor` · `consolidated_slug` · `new_home_path`.

A later split-on-retire ([`memory/rules.md` § 5.3](../memory/rules.md)) — when one merged item terminates — records a SPLIT row, so a live `moc-slug#source-anchor` reference that must follow the section to its `new_home_path` is caught by the gate's Family 1b (`STALE-ANCHOR`).

---

## Stage 4 — Handoff (file written + shown to the session)

Stage 4 has two parts with two owners:

1. **Author the file (assistant, WORK Step 7).** The assistant writes `sessions/{date}-{session-id}/5-wrap-up/outputs/handoff.md` (`artifact_type: handoff`, session-scoped, gitignored) with the required sections: Summary, Shipped, Deferred / Open, Decisions to respect, Pointers, Promotion summary. Every claim cites a verifiable artifact path. A missing required section is a stage-4 `REVISE` finding at EVALUATION.
2. **Show it to the session (manager).** After stage-3 memory validation returns `PASS`, the manager **reads `outputs/handoff.md` back to the session as the final message** before emitting `workflow.finish`. This "shown to the session" step is what closes the loop with the user — the handoff is not just filed, it is surfaced.

**Two handoffs, two lifetimes.** `outputs/handoff.md` is session-scoped: it lives in the gitignored `sessions/` tree and is removed with the worktree at stage 5 cleanup. The **durable cross-session handoff** is the per-session journal entry at `notes/{area}/{date}-{slug}.md` (WORK Step 6) — promoted to memory, it survives for the next session to read. Both are written; the file is shown now, the journal carries forward.

---

## Stage 5 — Git finalization (manager-owned; runs LAST)

Stage 5 is the manager's, and it runs **only after stage-3 memory validation returns `PASS`** (D13). The assistant NEVER performs any stage-5 action.

- **What it commits.** The session record (`sessions/...`) is gitignored and worktree-local, so it is never committed. Stage 5 commits the **stage-2 memory promotion writes** — the tracked files under `features/`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`, etc. — using the canonical `AI-Provenance-Record:` trailer.
- **The procedure is not duplicated here.** Push and PR follow [`git/SKILL.md` § P4 (Push and open PR)](../git/SKILL.md); merge and worktree cleanup follow [`git/SKILL.md` § P5 (Land PR)](../git/SKILL.md). The manager's commit-vs-session-record split is governed by [`orchestration/workflow/wrap-up.md` § What Wrap-up commits](../orchestration/workflow/wrap-up.md).
- **W-12 — push/`gh` blocked at finalization → PR deferred.** If `git push` or `gh` is unavailable when committing the stage-2 promotion writes, the manager DEFERS the PR per the [`git/SKILL.md` § Prerequisites](../git/SKILL.md#prerequisites) PR-deferred resilience model. The promotion commit still lands on the worktree branch; only the PR is deferred — opened later when `gh` / network is available. Stage 5 commits the promotion writes regardless; the deferral applies to the push/PR step only.
- **W-13 — already-open PR is reused, never duplicated.** If a PR for this session branch is ALREADY open (Execution opened it), Stage 5's promotion commits are added to that same PR — do NOT open a duplicate. The push lands the new commits on the same branch, so the existing PR carries them; reuse its number per the idempotent "reuse the open one" step in [`git/SKILL.md` § P4](../git/SKILL.md#p4--push-and-open-pr).
- **Bulk cleanup (optional).** When session close detects accumulated cruft (more than one orphaned worktree, stale merged branches, resolved-but-open issues), Stage 5 MAY offer the [`git/SKILL.md` § P8 — Retro / bulk cleanup](../git/SKILL.md#p8--retro--bulk-cleanup) audited, liveness-protected sweep. P6 covers a single orphan; P8 is the bulk companion.
- **Order is the safety property.** Git is the irreversible action (push / merge / worktree removal), so it is last — after the memory it would publish has been validated by the non-skippable stage-3 gate. A `REVISE` or `FAIL` at stage 3 means stage 5 does not run.

---

## EVALUATION Phase

**This phase IS pipeline stage 3 — memory validation.** The Wrap-up loop's dual-system EVALUATION and stage-3 memory validation are the same gate (D11). It is **NON-SKIPPABLE** (D13): no `evaluate.mode: skip` setting can remove it, and it always gates the irreversible git stage 5. `REVISE` re-runs the promotion (stage 2); `FAIL` escalates to the user; neither lets stage 5 run.

**Purpose**
Find the promotion gaps WORK missed. Two independent systems (Claude Code + Codex) evaluate the Wrap-up artifact + promotions across all seven perspectives + Overall; the manager reconciles their findings and produces a single `PASS` / `REVISE` / `FAIL` verdict. Wrap-up evaluation is **non-skippable** — see [`wrap-up/evaluation.md`](evaluation.md).

See [evaluation skill](../evaluation/SKILL.md) for the full Stage 0 / 1 / 2 / 3 procedure, [`wrap-up/evaluation.md`](evaluation.md) for the wrap-up-phase seed scenarios, and [`orchestration/workflow/evaluation.md`](../orchestration/workflow/evaluation.md) for the manager's spawn / reconciliation orchestration.

**Inputs** (consumed from the WORK phase output)
- `sessions/{date}-{session-id}/5-wrap-up/outputs/handoff.md` (and any decomposed artifact files)
- `sessions/{date}-{session-id}/5-wrap-up/working/promotion-manifest.md` — the audit trail of every routing decision
- `sessions/{date}-{session-id}/5-wrap-up/working/staging-inventory.md` — the source inventory the manifest must account for
- `sessions/{date}-{session-id}/5-wrap-up/working/pre-wrap-up-snapshot.txt` — the baseline state before promotions
- Post-Wrap-up state of `.gobbi/projects/{project-name}/` — for diff against snapshot
- All prior loops' artifacts (handoff claims must trace back to shipped work)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Manager | WORK outputs; promotion manifest; staging inventory | Spawn one evaluator per system (Claude Code + Codex); each handles all seven perspectives + Overall sequentially | Two evaluator agent instances |
| 2 | Evaluator | All step-1 inputs | Run the four-stage procedure per `evaluation/SKILL.md` with `wrap-up/evaluation.md` loaded at Stage 0 | `evaluation/iter{n}/{claude,codex}/{perspective}.md` + `evaluation/iter{n}/{claude,codex}/overall.md` |
| 3a | Manager | Both systems' per-perspective files | Cross-system reconciliation: pessimistic union of findings; severity-gated divergence handling | Reconciled findings + per-perspective verdicts |
| 3b | Manager | Major divergence (if any) | Run the active runtime's user-decision primitive | (skipped if no major divergence) |
| 3c | User | Divergence question | Decide which verdict to honor | User-confirmed verdict |
| 4 | Manager | Reconciled findings + verdicts | Record aggregated verdict: `PASS` / `REVISE` / `FAIL`. **All verdicts advance to RECORD first**. As pipeline stage 3, this verdict gates the irreversible git stage 5: after RECORD, `PASS` unblocks stage 5 (manager runs git finalization, then emits `workflow.finish`); `REVISE` re-enters DISCUSSION (rare — Wrap-up's iteration cap is typically 1) and re-runs the stage-2 promotion — stage 5 does NOT run; `FAIL` escalates through the active runtime's user-decision primitive — stage 5 does NOT run | Workflow-state verdict |

**Post-promotion standing-guard green-check (always-run — independent of `settings.compaction.enabled`)**

Stage 3 is non-skippable (D13), so this green-check runs on **EVERY** wrap-up — whether or not the dormant Stage-2c compaction ran. Before the verdict can advance to `PASS`, the manager re-runs **EVERY** standing project guard over the **post-promotion** tree, not only the frontmatter validator. A promoted mistake / journal / plan frequently DOCUMENTS the very vocabulary or pattern a guard scans for, so a promotion can add a legitimate carrier that an allowlist derived before the promotion will not recognize. Derived from [`mistakes/verification/wrap-up-green-check-must-rerun-standing-guards-post-promotion.md`](../../mistakes/verification/wrap-up-green-check-must-rerun-standing-guards-post-promotion.md).

Run ALL of these over the post-promotion project tree (`<scan-root>` = `.gobbi/projects/{project-name}/`; each prunes `archive/`) — ALL must exit 0:
- [`validate-frontmatter.sh`](../memory/scripts/validate-frontmatter.sh) `<scan-root>` — frontmatter well-formedness
- [`check-markdown-links.sh`](../orchestration/scripts/check-markdown-links.sh) `<scan-root>` — relative-link resolution
- [`check-residual-vocab.sh`](../orchestration/scripts/check-residual-vocab.sh) `<scan-root>` — residual stale-vocabulary content gate
- [`check-workflow-mirror-consistency.sh`](../orchestration/scripts/check-workflow-mirror-consistency.sh) — runtime-doc `.claude/` mirror gate (self-locating, zero-arg; checks the worktree `.claude/` runtime surface, NOT the memory tree, so it takes no `<scan-root>`)

[`check-merge-ref-integrity.sh`](../orchestration/scripts/check-merge-ref-integrity.sh) `<manifest> <scan-root>` is the ONE additional guard that runs only when Stage-2c produced a compaction merge manifest — it is enumerated in § Stage 2c step (g), not here, because it has no manifest to check on a non-compacting wrap-up. When a guard flags a legitimately-promoted carrier, extend THAT guard's allowlist using its own derive-from-a-fresh-run discipline in the SAME promotion commit (a stage-2 re-run / `REVISE`), so the guard invariant the session established stays green on the branch that ships. A green frontmatter validator alone is NOT enough — the content/vocab guards, the link checker, AND the runtime-doc mirror guard must all re-run over the post-promotion tree.

**Outputs**
- `sessions/{date}-{session-id}/5-wrap-up/evaluation/iter{n}/{claude,codex}/{perspective}.md` — one file per system × perspective
- Aggregated verdict recorded in workflow state

**Wrap-up-specific evaluation emphasis** (from [`wrap-up/evaluation.md`](evaluation.md))
- **Promotion coverage** — every staging file in the inventory has a manifest entry (promoted / backlogged / dropped)
- **Routing-table adherence** — every promotion target matches the routing table; no improvised destinations
- **Supersession integrity** — `supersedes:` + `superseded_by:` frontmatter pairs are bidirectional and resolve
- **Handoff verifiability** — every claim in `handoff.md` cites a verifiable artifact path
- **Journal completeness** — per-session journal entry captures the substantive work narrative

**Exit checklist**
- [ ] Both systems produced per-perspective files for every perspective
- [ ] Post-promotion standing-guard green-check run on EVERY wrap-up (independent of `settings.compaction.enabled`): `validate-frontmatter.sh` + `check-markdown-links.sh` + `check-residual-vocab.sh` + `check-workflow-mirror-consistency.sh` all exit 0 over the post-promotion tree; any guard flagging a legitimately-promoted carrier had its allowlist extended in the same promotion commit
- [ ] Verdict aggregated and recorded; `REVISE` increments the iteration counter, `PASS` and `FAIL` advance to RECORD

---

## RECORD Phase

> **Canonical procedure: [`record/SKILL.md`](../record/SKILL.md).** RECORD is the per-loop capture sub-phase. Its mechanics — transcript copy, `session.json` iter upsert, PASS-only `outputs/` staging, cumulative-staging, idempotency — are defined once in [`record/SKILL.md`](../record/SKILL.md). This section states only what is specific to the Wrap-up loop: RECORD seals the handoff and the promotions that WORK already wrote (Wrap-up is the one loop whose RECORD may touch memory — see [`record/SKILL.md` § Memory Access Matrix](../record/SKILL.md#memory-access-matrix)). Do not confuse the per-loop **RECORD** sub-phase with the wrap-up **memorization** stage (stage 2 of the WORK pipeline below) — they are different things.

**Purpose**
Persist Wrap-up's iteration evidence into session record and stamp the artifacts directory with the canonical handoff per the Artifact frontmatter schema. RECORD runs after **every** EVALUATION (whether `PASS`, `REVISE`, or `FAIL`).

Wrap-up's RECORD is **uniquely permitted** to write to memory (per the Wrap-up loop exception in [`record/SKILL.md` § Memory Access Matrix](../record/SKILL.md#memory-access-matrix)) — but in practice, the substantive memory writes happen during WORK (Steps 5 and 6 of the procedure above). RECORD's role is to seal those writes: stamp the handoff artifact with proper frontmatter, finalize the promotion manifest, upsert session.json.

See [record skill](../record/SKILL.md) for the every-iter / PASS-only procedure, template-stamping conventions, artifact frontmatter schema, and cumulative-staging rule. [`orchestration/workflow/record.md`](../orchestration/workflow/record.md) covers the manager's spawn / collect orchestration.

**Inputs**
- `sessions/{date}-{session-id}/5-wrap-up/outputs/handoff.md` (and any decomposed artifact files) from WORK
- `sessions/{date}-{session-id}/5-wrap-up/working/promotion-manifest.md` — the routing audit trail
- `sessions/{date}-{session-id}/5-wrap-up/evaluation/iter{m}/{claude,codex}/{perspective}.md` for `m ∈ 1..n`
- `session.json.transcriptPath` (tilde-expand `$HOME` on read) — manager-stamped transcript path; use `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env. Claude Code transcript jsonl
- `sessions/{date}-{session-id}/5-wrap-up/working/discussion-log.md`
- EVALUATION verdict for this iteration (`PASS` / `REVISE` / `FAIL`)

**Procedure** — see [record/SKILL.md § RECORD Phase](../record/SKILL.md#record-phase) for the canonical step-by-step. Wrap-up-specific notes:

- The substantive WRITE work for Wrap-up happens during WORK (Steps 5-6). RECORD's WRITE responsibility is limited to (a) sealing the handoff with proper frontmatter, (b) upserting session.json, (c) preserving the transcript.
- On PASS, mandatory artifact_types: `handoff` (the canonical handoff summary), `memory-reads` (every prior loop's evaluation file consumed by Wrap-up's promotion-routing pass), `resolution-log` (every evaluator finding across all loops with its final disposition).
- Any evaluator finding from Wrap-up's own EVALUATION that surfaces a new promotable item (mistake, learning, decision) must route through the routing table — RECORD does **not** improvise destinations. If the finding maps to an existing routing-table row, promote via that row. If it is unroutable, return `NEEDS_CONTEXT` with a `user-question:` block so the manager can confirm the routing through the active runtime's user-decision primitive. There are no ad-hoc write exceptions in RECORD; the routing table is the sole authority.
- On PASS, after RECORD completes, the manager emits `workflow.finish` and closes the session.

**Outputs**

Every iteration produces:
- `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` — preserved transcript
- `sessions/{date}-{session-id}/session.json` — upserted `workflow.wrap-up.iterations[]` entry

Only the `PASS` iteration also produces:
- `sessions/{date}-{session-id}/5-wrap-up/outputs/handoff.md` (and decomposed files) — frontmatter-sealed; same files already written during WORK
- `sessions/{date}-{session-id}/5-wrap-up/outputs/memory-reads.md` — cumulative-staging audit
- `sessions/{date}-{session-id}/5-wrap-up/outputs/resolution-log.md` — every evaluator finding across loops with final disposition
- `sessions/{date}-{session-id}/session.json` — `workflow.wrap-up.finishedAt` and `verdict: PASS` set; `workflow.finish` emitted

**Exit checklist**

Every iteration:
- [ ] Transcript jsonl preserved at session-root `transcripts/{role}-{agentId}.jsonl`
- [ ] `session.json.workflow.wrap-up.iterations[]` includes this iter's `{iter, verdict, finishedAt, evaluation_dir: "wrap-up/evaluation/iter{n}/"}`

`PASS` iteration additionally:
- [ ] `5-wrap-up/outputs/` contains `handoff.md` with valid frontmatter (`artifact_type: handoff`)
- [ ] `5-wrap-up/outputs/` contains `memory-reads.md` (`artifact_type: memory-reads`)
- [ ] `5-wrap-up/outputs/` contains `resolution-log.md` (`artifact_type: resolution-log`)
- [ ] `session.json.workflow.wrap-up.finishedAt` + final `verdict: PASS` set
- [ ] `workflow.finish` emitted; session closed

---

## Output paths

All session-record writes during the Wrap-up Loop are scoped to `sessions/{date}-{session-id}/5-wrap-up/`. Memory writes (the substantive output of WORK) follow the [Staging → Memory routing](#staging--memory-routing) table above.

**Path conventions**

- `{date}` — the session start date in `YYYY-MM-DD` format
- `{session-id}` — runtime session ID resolved by the manager during Configuration. Use `CLAUDE_CODE_SESSION_ID` for Claude Code and `CODEX_THREAD_ID` for native Codex. Do NOT read runtime env vars from spawned subagents for this value; use the parent session id supplied by the manager.
- `{project-name}` — project slug from `session.json.project`
- `{feature-name}` — feature slug from `session.json.feature` (set during Ideation Sub-step B Lock Scope)
- `{slug}` — slug for a specific artifact, set by the writer at stage time or by Wrap-up at promotion time
- `{n}` — iter number, supplied by the manager

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/5-wrap-up/working/pre-wrap-up-snapshot.txt` | assistant (WORK Step 1) | per iteration |
| `sessions/{date}-{session-id}/5-wrap-up/working/staging-inventory.md` | assistant (WORK Step 2) | per iteration |
| `sessions/{date}-{session-id}/5-wrap-up/working/promotion-manifest.md` | assistant (WORK Step 4) | per iteration — append-only routing-decision log |
| `sessions/{date}-{session-id}/5-wrap-up/working/proposals/codex/draft-iter{n}.md` | Codex proposer (`codex exec` wrapper) | per enabled WORK iter (`propose.mode: dual`) — independent proposal, frozen before integration |
| `sessions/{date}-{session-id}/5-wrap-up/working/reconciliation-iter{n}.md` | assistant (WORK) | per integration — the Integration Log (frozen-proposal selective integration) |
| `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` | assistant (RECORD) | per iter — preserved transcript window |
| `sessions/{date}-{session-id}/5-wrap-up/working/discussion-log.md` | manager (DISCUSSION) | appended per user-decision exchange |
| `sessions/{date}-{session-id}/5-wrap-up/evaluation/iter{n}/{claude,codex}/{perspective}.md` | evaluator (EVALUATION) | one per system × perspective |
| `sessions/{date}-{session-id}/5-wrap-up/outputs/handoff.md` | assistant (WORK Step 7; sealed at RECORD) | PASS only — `artifact_type: handoff` |
| `sessions/{date}-{session-id}/5-wrap-up/outputs/memory-reads.md` | assistant (RECORD) | PASS only — `artifact_type: memory-reads` |
| `sessions/{date}-{session-id}/5-wrap-up/outputs/resolution-log.md` | assistant (RECORD) | PASS only — `artifact_type: resolution-log` |
| Memory writes per routing table | assistant (WORK Steps 5-6) | per promoted staging file + per-session journal entry |
| `sessions/{date}-{session-id}/session.json` | assistant (RECORD) | loop completion timestamps, iter, verdict; `workflow.finish` on final PASS |

The session subdirectory tree at `sessions/{date}-{session-id}/5-wrap-up/{working,outputs,evaluation}/` is bootstrapped by the manager at Wrap-up Loop entry. WORK and RECORD assume the tree exists and surface an error if it does not. Memory destinations are bootstrapped lazily by WORK Step 5 as content requires.

---

## Constraints

- **MUST be the sole writer to memory for cross-loop session artifacts** — no other loop writes to `.gobbi/projects/{project-name}/{features,mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive}/`. Exception: Preparation-generated skills at `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` are promoted by the manager before Planning starts (see `preparation/SKILL.md` § Core Principles). At Wrap-up, verify the destination is present and record in `promotion-manifest.md`; do not re-promote unless the destination file is missing.
- **MUST account for every staging file** — promotion-manifest.md has 1 entry per staging file across all prior loops (promoted / backlogged / dropped with reason).
- **MUST apply the routing table mechanically** — no improvised destinations; unrouted files return `NEEDS_CONTEXT` with a `user-question:` block so the manager can use the active runtime's user-decision primitive on your behalf.
- **MUST bootstrap feature directory lazily** — create `features/{feature-name}/{sub-dir}/` on first write into that sub-directory, not eagerly.
- **MUST write the per-session journal entry** at `notes/{area}/{date}-{slug}.md` capturing the work-log narrative — one entry per session.
- **MUST be idempotent** — re-run on the same session produces identical memory state; collision policy keyed by stable `finding-id` frontmatter.
- **MUST never delete** — supersession via `supersedes:` + `superseded_by:` frontmatter pairs; physical deletion is forbidden. When an artifact reaches a terminal state, move it (never delete) to `archive/{type}/{area}/` per the move-on-terminal model in [`memory/templates/archive.md`](../memory/templates/archive.md).
- **MUST preserve session scratch** — `sessions/{date}-{session-id}/{N}-{loop}/working/`, `staging/`, `evaluation/iter{n}/` remain intact post-Wrap-up.
- **MUST request user-confirm** for rules promotion, project-wide design promotion, mistake scope (feature vs project), and unrouted staging files — return `NEEDS_CONTEXT` with a `user-question:` block; the manager uses the active runtime's user-decision primitive on your behalf.
- **MUST cite verifiable artifacts** in `5-wrap-up/outputs/` — every claim backed by a path the next session can follow.
- **MUST never write to memory during DISCUSSION** — DISCUSSION is read-only on memory; WORK Steps 5-6 are the only memory write surfaces.
- **MUST stamp templates** — every promotion uses the appropriate template from [`memory/templates/`](../memory/templates/); freeform writes to memory are forbidden.
- **MUST emit `workflow.finish`** on the final PASS iteration — after RECORD completes; the manager closes the session.
