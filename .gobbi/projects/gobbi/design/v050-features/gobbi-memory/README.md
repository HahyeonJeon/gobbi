# gobbi-memory — Multi-Project Memory Model

Feature description for gobbi's cross-session persistence model under `.gobbi/projects/{name}/`. Read this to understand how memory is organized per project, how `.claude/` relates to `.gobbi/` via a symlink farm, how the `gobbi install` bootstrap seeds a fresh repo, and how `gobbi project list|create|switch` manages the multi-project lifecycle. This is the design-of-record for Pass 2 redesign (session `35742566-2697-4318-bb06-558346b77b4a`), updated by **PR-FIN-2 finalization** (session `9755a2cb-0981-455b-915e-643de6de2500`, 2026-04-29) for the taxonomy expansion (`gotchas/` and `tmp/` promoted to top-level), the manifest removal (`.install-manifest.json` and 3-way merge logic dropped), the session structure simplification (`metadata.json`, `gobbi.db`, `state.json` dropped from session root), and the `memorization_eval` state-machine step addition.

---

> **Source of truth lives under `.gobbi/projects/{name}/`. `.claude/` is a symlink farm pointing into it.**

Pass 2 replaces the Pass-1 layout — where skills/agents/rules/project-docs lived under `.claude/` and `.gobbi/project/` (singular) was a secondary store — with a single-source-of-truth model. All project-scoped content (skills, agents, rules, design, learnings, notes, references, …) is tracked under `.gobbi/projects/{name}/`. `.claude/` keeps CLAUDE.md + hooks + settings + three kinds of per-file symlinks (`skills/`, `agents/`, `rules/`) back into the active project. `.gobbi/` is plural from day one: one workspace can host many projects; `projects.active` in `.gobbi/settings.json` selects which one the farm currently mirrors.

---

## Directory shape

**Updated by PR-FIN-2 finalization (2026-04-29):** `gotchas/` promoted to top-level (separated from `learnings/`); `tmp/` formalized as gitignored project-scoped scratch; `.install-manifest.json` removed (3-way merge logic dropped); session-root files reduced to `settings.json` only (`metadata.json`, `gobbi.db`, `state.json`, `state.json.backup`, `artifacts/` all dropped — operational state moves to workspace `.gobbi/gobbi.db` + `.gobbi/state.db`).

| Path | Git | Purpose |
|---|---|---|
| `.gobbi/settings.json` | gitignored | Workspace-tier settings. |
| `.gobbi/gobbi.db` | tracked | Cross-project memories projection + per-step operational metadata (sessionId, step timings, agent spawns, evaluation verdicts, artifact list). |
| `.gobbi/state.db` | gitignored | Workspace-scoped state-machine event log. Per-session `gobbi.db` and `state.json` no longer exist; this DB is the single source of state-machine truth. |
| `.gobbi/projects/` | tracked | Parent of all projects in this workspace. |
| `.gobbi/projects/{name}/` | tracked except `sessions/`, `tmp/`, `worktrees/` | Root of one project. |
| `.gobbi/projects/{name}/skills/` | tracked | Project's skill definitions; plugin-bundled and user-authored mixed; mirrored into `.claude/skills/` via per-file symlink farm. |
| `.gobbi/projects/{name}/agents/` | tracked | Project's agent definitions; same farm semantics. |
| `.gobbi/projects/{name}/rules/` | tracked | Project's rule files; same farm semantics. |
| `.gobbi/projects/{name}/design/` | tracked | Narrative design documents; sub-trees such as `v050-features/{name}/{README,scenarios,checklist,review}.md` co-locate per-feature docs. |
| `.gobbi/projects/{name}/decisions/` | tracked | Atomic ADR-style locked decisions. |
| `.gobbi/projects/{name}/scenarios/` | tracked | Cross-feature Gherkin scenarios. |
| `.gobbi/projects/{name}/checklists/` | tracked | Cross-feature verification lists. |
| `.gobbi/projects/{name}/reviews/` | tracked | Cross-pass retrospectives, DRIFT/GAP/NOTE logs. |
| `.gobbi/projects/{name}/playbooks/` | tracked | Procedural runbooks for repeatable tasks. |
| `.gobbi/projects/{name}/learnings/` | tracked | General post-mortems and learnings. **No longer holds gotchas** — those moved to top-level `gotchas/`. |
| `.gobbi/projects/{name}/gotchas/` | tracked | **NEW (PR-FIN-2)** — anti-patterns and "do not repeat this mistake" entries. Promoted from `learnings/gotchas/` to a top-level dir to reflect their distinct role. `gobbi gotcha promote` writes here. |
| `.gobbi/projects/{name}/references/` | tracked | External API docs, third-party ground truth. |
| `.gobbi/projects/{name}/backlogs/` | tracked | Deferred work items filed during sessions. |
| `.gobbi/projects/{name}/notes/` | tracked | Freeform cross-session scratch. |
| `.gobbi/projects/{name}/tmp/` | gitignored | **NEW (PR-FIN-2)** — trivial files and temporal scratch (project-scoped). |
| `.gobbi/projects/{name}/sessions/{session_id}/` | gitignored | Per-workflow-run artefacts; not durable memory. |
| `.gobbi/projects/{name}/worktrees/{branch}/` | gitignored | Project-scoped git worktrees (D6 lock). |

**Final taxonomy:** 12 narrative dirs (`design`, `decisions`, `scenarios`, `checklists`, `reviews`, `playbooks`, `learnings`, `gotchas`, `references`, `backlogs`, `notes`, `rules`) + 3 farm dirs (`skills`, `agents`, `rules` — `rules` shared with narrative) = **14 unique tracked dirs**. Plus 3 gitignored runtime dirs (`tmp/`, `sessions/`, `worktrees/`). Plus 2 root files (`README.md`, `settings.json`). Charter per dir: see `v050-overview.md §Directory Split`.

---

## The three scopes

Everything about memory and configuration decomposes across three scopes:

- **Workspace** — `.gobbi/settings.json` at the repo root. Cross-project defaults. One file; shared by every project in the workspace.
- **Project** — `.gobbi/projects/{name}/settings.json` + the 12 taxonomy subdirectories. Each project is self-contained; renaming or deleting `{name}/` does not affect its siblings.
- **Session** — `.gobbi/projects/{name}/sessions/{session_id}/`. One directory per workflow run, gitignored. Five step subdirectories (`ideation/`, `planning/`, `execution/`, `memorization/`, `handoff/`) — each holds a prose-summary `README.md` (written on `STEP_EXIT`), arbitrary freeform `*.md` topic files, a `rawdata/` directory of raw transcripts (Claude Code + subagent JSON/JSONL), and an `evaluation/` subdir for productive steps that run an `*_eval` step (`ideation`, `planning`, `execution`, `memorization`). The `README.md` at each step is **prose summary + index table**, not frontmatter — operational metadata (sessionId, step timings, agent spawns, verdicts, artifact lists) lives in `.gobbi/gobbi.db` keyed by `(session_id, step)`.

Session-to-project binding is established at `gobbi workflow init`: the command resolves the project name from `--project <name>` flag → `basename(repoRoot)` (PR-FIN-1c project resolution; the prior `projects.active` registry was removed) and writes the binding into the workspace `.gobbi/gobbi.db` `sessions` row at session creation. Mid-flight project switch is not supported.

---

## Bootstrap — `gobbi install`

**Updated by PR-FIN-2 (2026-04-29):** the 3-way merge logic and `.install-manifest.json` are removed. `gobbi install` is now a straight copy with a single overwrite policy controlled by `--force`.

A fresh repo has no `.gobbi/` directory. `gobbi install` is the one-shot bootstrap that makes the workspace usable:

1. **Detect target state** — fresh means no `.gobbi/projects/{name}/` exists for the chosen project; re-install means it does.
2. **Fresh path** — copies the plugin-bundled template tree (shipped at `node_modules/@gobbitools/cli/.gobbi/projects/gobbi/{skills,agents,rules}/`) into `.gobbi/projects/{name}/`, scaffolds the 12 narrative dirs (`design`, `decisions`, `scenarios`, `checklists`, `reviews`, `playbooks`, `learnings`, `gotchas`, `references`, `backlogs`, `notes`, `rules`) as empty placeholders, builds the `.claude/{skills,agents,rules}/` per-file symlink farm, and preserves any non-farm content that already lived in `.claude/` (NI-1 lock).
3. **Re-install path** — without `--force`, exits 2 and refuses; with `--force`, **bundle wins**: every plugin-bundled file under `skills/agents/rules/` is overwritten unconditionally. User-authored files (anything not shipped by the plugin) survive untouched. The `_-prefix` naming convention (`_git`, `_gotcha`, …) demarcates plugin-owned skills/agents from user-owned ones; user-owned files don't collide with plugin paths and so are never touched.
4. **Active-session gate** — aborts with exit 2 and a list of active session IDs if any session has a non-terminal `current_step` recorded in `.gobbi/state.db`. Prevents template churn while a workflow is mid-flight.

No manifest is written; no 3-way merge is performed. The `_-prefix` convention is the boundary between plugin-owned and user-owned content.

`gobbi install --project <name>` installs into a named project instead of the default `gobbi`.

---

## The symlink farm

`.claude/{skills,agents,rules}/` are built as per-file relative symlinks pointing into `.gobbi/projects/{active}/{skills,agents,rules}/`. Rationale: merging a directory-to-symlink transition across parallel feature branches produces unresolvable conflicts; per-file symlinks do not. The farm is rebuilt from scratch on fresh install and atomically rotated on `gobbi project switch`.

Rotation protocol — `gobbi project switch <name>` (PR-FIN-1c retired the `projects.active` registry, so the switch verb is now an ergonomic alias for "rebuild the farm into the named project"):

1. **Active-session gate** — refuse the switch if any session in the workspace has a non-terminal `current_step` row in `.gobbi/state.db`. Exit 2 with a pointer to the blocking session.
2. **Temp-location build** — materialize the new farm into `.claude.next/{skills,agents,rules}/` first. Non-farm `.claude/` content is preserved.
3. **Atomic three-kind swap** — rename `.claude/skills`, `.claude/agents`, `.claude/rules` to `.claude.old/...`; rename `.claude.next/...` into place. Best effort across kinds; on partial failure, `SwapKindsRollbackFailedError` is raised with enough context to recover by hand.
4. **Cleanup** — remove `.claude.old/`.

Non-farm `.claude/` content (CLAUDE.md, hooks, settings, plugin-installed content, user scratch) is preserved throughout. Only the three farm directories are replaced.

---

## Per-step session structure

**Updated by PR-FIN-2 (2026-04-29):** every step has a uniform shape — `README.md` (prose summary + index), freeform `*.md` topic files, `rawdata/` (raw transcripts), and (where applicable) `evaluation/` (perspective evaluator outputs).

Five step directories per session, all uniform:

| Step | `README.md` | freeform `*.md` | `rawdata/` | `evaluation/` |
|---|---|---|---|---|
| `ideation/` | yes | yes | yes | yes (`ideation_eval`) |
| `planning/` | yes | yes | yes | yes (`planning_eval`) |
| `execution/` | yes | yes | yes | yes (`execution_eval`) |
| `memorization/` | yes | yes | yes | yes (`memorization_eval` — **NEW** in PR-FIN-2) |
| `handoff/` | yes | yes | yes | no |

**`README.md` content** — prose summary of the step's outcome plus an index table listing every `*.md` topic file and every `rawdata/` artifact in the step dir with a one-line description. **No frontmatter** — operational metadata (sessionId, step timings, agent spawns, evaluation verdicts, artifact lists) lives in `.gobbi/gobbi.db` keyed by `(session_id, step)` and is queried by readers that need it. The `README.md` writer (CLI-only) renders the prose summary by reading those `gobbi.db` rows on `STEP_EXIT` and joining them with the file inventory of the step dir.

**`rawdata/`** — raw Claude Code transcript JSONL plus subagent transcript captures (one JSON/JSONL per subagent spawn). Subagents and the orchestrator's transcript both land here; this is the original-source archive for the step.

**`evaluation/`** — flat `*.md` files, one per perspective (e.g., `architecture.md`, `project.md`, `overall.md`). Authoritative inputs to the corresponding `*_eval` step's verdict.

**Memorization gets an evaluation loop (NEW):** unlike Pass 2, where memorization was a one-shot productive step, PR-FIN-2 adds `memorization_eval` to verify that the session's decisions, gotchas, learnings, and design changes actually landed in `.gobbi/gobbi.db` memories and on disk in the project's narrative dirs. The loop runs `[Memorize → memorization_eval → REVISE if not fully covered → Memorize → …]` until verdict PASS or `maxIterations` exceeded. State-machine implications are detailed in `../orchestration/README.md`.

Writing is exit-only (D4 lock); in-flight visibility is via `gobbi workflow status --step <name>` rather than a mutable README.

---

## State / event backward-compat

Pass 2 renames the state-machine literal `'plan'` to `'planning'`. PR-FIN-2 drops per-session `gobbi.db` and `state.json` entirely — workflow state lives in workspace `.gobbi/state.db` only.

- **Legacy `state.json` files** — sessions started under Pass 2 still have a `state.json` on disk. The `gobbi maintenance wipe-legacy-sessions` command deletes any session whose state row in `.gobbi/state.db` is terminal (`done`/`error`) AND has a stale on-disk layout. Active sessions are never touched.
- **Legacy per-session `gobbi.db` files** — same wipe semantics; the file is removed when the session is cleaned.

The pre-validation state normalization shim from Pass 2 is no longer needed under PR-FIN-2 because `state.json` is no longer read at all.

---

## Gotcha promotion destination

**Updated by PR-FIN-2 (2026-04-29):** `gobbi gotcha promote` writes promoted gotchas to `.gobbi/projects/{name}/gotchas/` — the new top-level `gotchas/` directory promoted out of `learnings/`. `learnings/` now holds only general post-mortems and learnings; `gotchas/` holds anti-patterns and "do not repeat" entries. Project name resolves via the same ladder as `gobbi config set` (`--project <name>` flag → `basename(repoRoot)`). Per-project gotchas under `gotchas/` apply only to that project; cross-project gotchas ship with the gobbi plugin under `.claude/skills/_gotcha/` (farm-mirrored).

---

## Template bundle discipline

The plugin bundles only three content kinds into `node_modules/@gobbitools/cli/.gobbi/projects/gobbi/`: `skills/`, `agents/`, `rules/`. Design docs, learnings, references, and other project-memory content do not ship from the plugin — they are author-originated per project. This is intentional: the plugin is the authoritative source of *how* gobbi works (skills, agents, rules); the project is the authoritative source of *what this project is* (design, decisions, learnings).

---

## `.claude/` preservation contract (NI-1)

Fresh install must preserve any non-farm content already present in `.claude/`. Only `.claude/{skills,agents,rules}/` are rewritten as farms; `.claude/CLAUDE.md`, `.claude/hooks/`, `.claude/settings/`, plugin-installed content, and user scratch survive the install untouched. The farm builder (`buildFarmIntoRoot`) enforces this — it never removes `.claude/` contents outside the three kind directories.

---

## Memory vs. configuration

Configuration (covered in `../gobbi-config/README.md`) answers "how does this workspace / project / session behave?" using `settings.json` at the three tiers. Memory (this feature) answers "what happened here and what did we learn?" using the 12 taxonomy subdirectories under each project plus a **two-tier JSON memory model** (`project.json` + `session.json`). Both share the `.gobbi/projects/{name}/` root but hold separate storage shapes and serve separate purposes.

---

## Memory storage — two-tier JSON model (PR-FIN-2 Planning lock)

**SUPERSEDES the prior `.gobbi/gobbi.db` SQLite design.** PR-FIN-2's Planning step locked a JSON-only model for cross-session memory and per-session operational metadata. The prior `.gobbi/gobbi.db` workspace SQLite file is **dropped entirely**. The `!.gobbi/gobbi.db` `.gitignore` exception is removed (no DB to track). SQLite remains in the workspace only as `.gobbi/state.db` — the gitignored runtime workflow event log.

**Why JSON, not SQLite.** Solo-developer iteration. Schema is unstable while v0.5.0 finalization is in flight. Binary-diff opacity in git makes review of every iteration commit unworkable. JSON files give text-diffable history; AJV schemas give type safety; sorted writes give stable diffs. Cross-session queries walk the filesystem on demand — at workspace scale (tens of sessions, hundreds of markdown files) this is fast enough without a materialized index.

### `project.json` — per-project, git-tracked

`/.gobbi/projects/{name}/project.json` — single source of truth for cross-session promoted memory at the project level. Schema v1 (no migration framework yet — development state). AJV-validated at boundaries.

Top-level fields:

- `schemaVersion: 1`
- `projectName`
- `projectId`
- `sessions[]` — index of every workflow session: `{sessionId, createdAt, finishedAt, task, handoffSummary?}`. Sorted by `createdAt` ascending.
- `gotchas[]` — promoted gotchas: `{path, sha256, class, promotedAt, promotedFromSession}`. Sorted by `path` alphabetically.
- `decisions[]`, `learnings[]` — analogous shape.

Writers: `gobbi gotcha promote` updates `gotchas[]`; memorization step writes session entries + decisions/learnings extracted from the session record. Sorted-rewrite (whole-file rewrite with deterministic sort) on every write so the git diff is reviewable.

### `session.json` — per-session, gitignored (lives inside `sessions/`)

`/.gobbi/projects/{name}/sessions/{session_id}/session.json` — single consolidated per-session operational metadata file. Schema v1. AJV-validated.

Top-level fields:

- `schemaVersion: 1`
- `sessionId`, `projectId`, `createdAt`, `finishedAt`, `gobbiVersion`, `task`
- `steps[]` — `{id, startedAt, finishedAt, feedbackRound, verdict?}`
- `agents[]` — subagent spawns: `{id, name, stance, model, effort, role?, specialties?, startedAt, finishedAt, transcriptSha256}`
- `agent_calls[]` — **provisional schema** (subject to revalidation when `gobbi stats` query surface lands): per-LLM-turn telemetry `{model, inputTokens, outputTokens, cacheRead, cacheWrite, durationMs, parentAgentId}`
- `evaluations[]` — `{step, perspectives[], verdict, verdictAt}`

All array fields sort by **`state.db.seq` ascending** (the workflow event-log sequence number) so parallel writers produce deterministic diffs.

Writer: memorization step writes `session.json` once at memorization-step entry by aggregating from `state.db` events + per-step rawdata transcripts. No per-step writers — single-write semantics avoid concurrency contention.

### What's gone

- **`.gobbi/gobbi.db`** — removed entirely. No workspace SQLite for memory.
- **Per-session `gobbi.db`** — removed; events route to workspace `.gobbi/state.db`.
- **`metadata.json`** — fields move into `session.json`.
- **`state.json` + `state.json.backup`** — state is derived from `state.db` events; no on-disk JSON state file.
- **Per-step `README.md` frontmatter** — operational metadata moves to `session.json`. Per-step `README.md` becomes prose summary + index table only.
- **`gobbi memory rebuild` command** — no projection to rebuild. The JSON files are the source of truth.
- **Docs metadata manifest** — no materialized index of `.md` files. Search-by-content uses ripgrep; drift detection uses git status.
- **Active-sessions detection helpers** (`findActiveSessions`, `findStateActiveSessions`) — removed for PR-FIN-2; `gobbi gotcha promote` and `gobbi maintenance wipe-legacy-sessions` no longer guard on other sessions. Will be redesigned in a future session.

### Cross-clone continuity

`project.json` is git-tracked → cross-clone state survives. `session.json` is gitignored (lives inside the gitignored `sessions/`) → per-session operational metadata is workspace-local; only the durable extracts (decisions, gotchas, learnings) survive a clone via `project.json` and the markdown narrative dirs. This is intentional: in-flight session state is not portable across clones.

### State.db — workspace event log (unchanged)

`.gobbi/state.db` remains the gitignored workspace-scoped append-only state-machine event log, partition-keyed by `(project_id, session_id)`. It powers `gobbi workflow status`, resume, and stats aggregation. The two-DB design from prior passes is now **one DB + two JSON files**: events in `state.db`, durable memory in `project.json`, in-flight session metadata in `session.json`.

See `../orchestration/README.md` §3 for the workspace event-log details and the JSON-pivot impact on the spec graph (`memorization_eval` step).

---

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [`scenarios.md`](scenarios.md) | Gherkin scenarios for bootstrap, install, project lifecycle, symlink-farm rotation, per-step README, backward-compat |
| [`checklist.md`](checklist.md) | ISTQB-tagged verification items grouped by scenario ID |
| [`review.md`](review.md) | Pass-2 DRIFT / GAP / NOTE entries with pinned commit SHAs |
| [`packages/cli/src/lib/workspace-paths.ts`](../../../../../../packages/cli/src/lib/workspace-paths.ts) | Path facade; every `.gobbi/` and farm path derives from here |
| [`packages/cli/src/commands/install.ts`](../../../../../../packages/cli/src/commands/install.ts) | 3-way-merge install implementation |
| [`packages/cli/src/commands/project/`](../../../../../../packages/cli/src/commands/project) | `list` / `create` / `switch` subcommands |
| [`packages/cli/src/lib/symlink-farm.ts`](../../../../../../packages/cli/src/lib/symlink-farm.ts) | Farm build + swap primitives |
| [`packages/cli/src/workflow/step-readme-writer.ts`](../../../../../../packages/cli/src/workflow/step-readme-writer.ts) | STEP_EXIT README generator |
| [`v050-overview.md §Directory Split`](../../v050-overview.md) | Canonical `.claude/` vs `.gobbi/` invariant |
| [`../gobbi-config/README.md`](../gobbi-config/README.md) | Three-tier settings cascade at the same scopes |
