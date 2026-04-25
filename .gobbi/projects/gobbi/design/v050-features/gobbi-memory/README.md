# gobbi-memory — Multi-Project Memory Model

Feature description for gobbi's cross-session persistence model under `.gobbi/projects/{name}/`. Read this to understand how memory is organized per project, how `.claude/` relates to `.gobbi/` via a symlink farm, how the `gobbi install` bootstrap seeds a fresh repo, and how `gobbi project list|create|switch` manages the multi-project lifecycle. This is the design-of-record for Pass 2 redesign (session `35742566-2697-4318-bb06-558346b77b4a`).

---

> **Source of truth lives under `.gobbi/projects/{name}/`. `.claude/` is a symlink farm pointing into it.**

Pass 2 replaces the Pass-1 layout — where skills/agents/rules/project-docs lived under `.claude/` and `.gobbi/project/` (singular) was a secondary store — with a single-source-of-truth model. All project-scoped content (skills, agents, rules, design, learnings, notes, references, …) is tracked under `.gobbi/projects/{name}/`. `.claude/` keeps CLAUDE.md + hooks + settings + three kinds of per-file symlinks (`skills/`, `agents/`, `rules/`) back into the active project. `.gobbi/` is plural from day one: one workspace can host many projects; `projects.active` in `.gobbi/settings.json` selects which one the farm currently mirrors.

---

## Directory shape

| Path | Git | Purpose |
|---|---|---|
| `.gobbi/settings.json` | gitignored | Workspace-tier settings; includes `projects.active` + `projects.known`. |
| `.gobbi/projects/` | tracked | Parent of all projects in this workspace. |
| `.gobbi/projects/{name}/` | tracked except `sessions/`, `rawdata/`, `worktrees/` | Root of one project. |
| `.gobbi/projects/{name}/.install-manifest.json` | tracked | Baseline manifest for 3-way merge on upgrade. |
| `.gobbi/projects/{name}/skills/` | tracked | Project's skill definitions; mirrored into `.claude/skills/` via farm. |
| `.gobbi/projects/{name}/agents/` | tracked | Project's agent definitions; mirrored into `.claude/agents/` via farm. |
| `.gobbi/projects/{name}/rules/` | tracked | Project's rule files; mirrored into `.claude/rules/` via farm. |
| `.gobbi/projects/{name}/design/` | tracked | Narrative design documents; sub-trees such as `v050-features/{name}/{README,scenarios,checklist,review}.md` co-locate per-feature docs. |
| `.gobbi/projects/{name}/decisions/` | tracked | Atomic ADR-style locked decisions. |
| `.gobbi/projects/{name}/scenarios/` | tracked | Cross-feature Gherkin scenarios. |
| `.gobbi/projects/{name}/checklists/` | tracked | Cross-feature verification lists. |
| `.gobbi/projects/{name}/reviews/` | tracked | Cross-pass retrospectives, DRIFT/GAP/NOTE logs. |
| `.gobbi/projects/{name}/playbooks/` | tracked | Procedural runbooks for repeatable tasks. |
| `.gobbi/projects/{name}/learnings/` | tracked | Post-mortems + `gotchas/` subdirectory. |
| `.gobbi/projects/{name}/references/` | tracked | External API docs, third-party ground truth. |
| `.gobbi/projects/{name}/backlogs/` | tracked | Deferred work items filed during sessions. |
| `.gobbi/projects/{name}/notes/` | tracked | Freeform cross-session scratch. |
| `.gobbi/projects/{name}/sessions/{session_id}/` | gitignored | Per-workflow-run artefacts; not durable memory. |
| `.gobbi/projects/{name}/worktrees/{branch}/` | gitignored | Project-scoped git worktrees (D6 lock). |

The 11 top-level project dirs (`design`, `decisions`, `scenarios`, `checklists`, `reviews`, `playbooks`, `learnings`, `references`, `backlogs`, `notes`, `rules`) plus the three farm dirs (`skills`, `agents`, `rules`) and the session/worktree scratch form the full taxonomy. Charter per dir: see `v050-overview.md §Directory Split`.

---

## The three scopes

Everything about memory and configuration decomposes across three scopes:

- **Workspace** — `.gobbi/settings.json` at the repo root. Holds `projects.active`, `projects.known`, and cross-project defaults. One file; shared by every project in the workspace.
- **Project** — `.gobbi/projects/{name}/settings.json` + the 11 taxonomy subdirectories. Each project is self-contained; renaming or deleting `{name}/` does not affect its siblings.
- **Session** — `.gobbi/projects/{name}/sessions/{session_id}/`. One directory per workflow run, gitignored. Per-step subdirectories (`ideation/`, `planning/`, `execution/`, `memorization/`) each carry a `README.md` written on `STEP_EXIT` plus a `rawdata/` directory populated by JIT hooks.

Session-to-project binding is established at `gobbi workflow init`: the command reads `projects.active` (or `--project <name>` if passed), stamps `metadata.projectName` into `SessionMetadata`, and never re-reads `projects.active` for the life of the session. Mid-flight project switch is rejected; `gobbi project switch` refuses while any in-flight session exists.

---

## Bootstrap — `gobbi install`

A fresh repo has no `.gobbi/` directory. `gobbi install` is the one-shot bootstrap that makes the workspace usable:

1. **Detect fresh vs upgrade** — fresh means no `.gobbi/projects/` exists; upgrade means at least one project manifest already does.
2. **Fresh path** — copies the plugin-bundled template tree (shipped at `node_modules/@gobbitools/cli/dist/templates/{skills,agents,rules}/`) into `.gobbi/projects/gobbi/`, writes a baseline `.install-manifest.json` (checksum map keyed by relative path), seeds `.gobbi/settings.json` with `projects.active = "gobbi"` and `projects.known = ["gobbi"]`, builds the `.claude/{skills,agents,rules}/` per-file symlink farm pointing at the freshly-written project, and preserves any non-farm content that already lived in `.claude/` (NI-1 lock).
3. **Upgrade path** — performs a 3-way merge per tracked template file: `currentHash = sha256(.gobbi/projects/{name}/...)`; `baseHash = .install-manifest.json`; `templateHash = sha256(bundled template)`. The action classification produces six kinds: **`add`** (template has a new file the user never had), **`unchanged`** (all three hashes agree), **`template-only`** (template changed, user still matches base — apply template), **`user-only`** (user changed, template still matches base — keep user), **`converged`** (user and template both changed identically — accept), **`conflict`** (user and template both changed differently — skip file and surface for manual merge).
4. **Active-session gate** — aborts with exit 2 and a list of active session IDs if any session under `.gobbi/projects/*/sessions/` has `state.json.currentStep ∉ {done, error}`. Prevents template churn while a workflow is mid-flight.
5. **Manifest persistence** — rewrites `.install-manifest.json` with the new content's hashes after a successful run (except conflicts, which retain their prior baseline).

`gobbi install --project <name>` installs into a named project instead of the default `gobbi`. Conflicts are reported as CLI output but do not stop the run — every other action is applied, and the user resolves conflicts by hand.

---

## The symlink farm

`.claude/{skills,agents,rules}/` are built as per-file relative symlinks pointing into `.gobbi/projects/{active}/{skills,agents,rules}/`. Rationale: merging a directory-to-symlink transition across parallel feature branches produces unresolvable conflicts; per-file symlinks do not. The farm is rebuilt from scratch on fresh install and atomically rotated on `gobbi project switch`.

Rotation protocol — `gobbi project switch <name>`:

1. **Active-session gate** — refuse the switch if any session in the workspace has `state.json.currentStep ∉ {done, error}`. Exit 2 with a pointer to the blocking session.
2. **Temp-location build** — materialize the new farm into `.claude.next/{skills,agents,rules}/` first. Plugin-only symlinks from `.claude/` that are not in the farm are preserved.
3. **Atomic three-kind swap** — rename `.claude/skills`, `.claude/agents`, `.claude/rules` to `.claude.old/...`; rename `.claude.next/...` into place. Best effort across kinds; on partial failure, `SwapKindsRollbackFailedError` is raised with enough context to recover by hand.
4. **Cleanup** — remove `.claude.old/`. Update `.gobbi/settings.json:projects.active`.

Non-farm `.claude/` content (CLAUDE.md, hooks, settings, plugin-installed content, user scratch) is preserved throughout. Only the three farm directories are replaced.

---

## Per-step README on STEP_EXIT

Every workflow step writes a `README.md` into its session-step directory on `STEP_EXIT`. The writer is CLI-only; agents never write these READMEs. The content is a frontmatter block + a rendered summary derived entirely from the event store.

Frontmatter fields:

- `step` — the step id (`ideation`, `planning`, `execution`, `memorization`).
- `sessionId`, `projectName`, `stepStartedAt`, `stepEndedAt`.
- `agents` — a list of `{ name, stance?, model, effort, startedAt, endedAt, transcriptSha256? }` entries, one per subagent spawn.
- `evaluation` — `{ perspectives, verdict, verdictAt }` if evaluation ran for this step.
- `artifacts` — a list of `{ path, bytes, sha256? }` for files emitted by the step.
- `authoritative` — which artefact the next step reads as primary input.
- `nextStep`, `feedbackRound`.

Writing is exit-only (D4 lock); in-flight visibility is via `gobbi workflow status --step <name>` rather than a mutable file.

---

## State / event backward-compat

Pass 2 renames the state-machine literal `'plan'` to `'planning'`. Sessions created before the cut may still have `currentStep: 'plan'` on disk or legacy rows with `step_id = 'plan'` in `gobbi.db`. Compat is handled in two places:

- **Pre-validation state normalization** — on `state.json` read, `'plan'` is rewritten to `'planning'` before schema validation. Transparent to downstream consumers.
- **Legacy-session wipe** — `gobbi maintenance wipe-legacy-sessions` deletes inactive legacy sessions only. `findStateActiveSessions` (state-based, not heuristic) skips any session whose `currentStep ∉ {done, error}`. The current in-flight session is always protected.

After the wipe lands and legacy rows drain, the compat normalization remains as a safety net — cost is one string compare per state read.

---

## Gotcha promotion destination

`gobbi gotcha promote` writes promoted gotchas to `.gobbi/projects/{active}/learnings/gotchas/`. The destination is resolved from `projects.active` at promotion time, not the session's bound `projectName` — gotchas are project-scoped knowledge and belong to the currently-active project. Per-project gotchas under `learnings/gotchas/` apply only to that project; cross-project gotchas ship with the gobbi plugin under `.claude/skills/_gotcha/`.

---

## Template bundle discipline

The plugin bundles only three content kinds into `node_modules/@gobbitools/cli/dist/templates/`: `skills/`, `agents/`, `rules/`. Design docs, learnings, references, and other project-memory content do not ship from the plugin — they are author-originated per project. This is intentional: the plugin is the authoritative source of *how* gobbi works (skills, agents, rules); the project is the authoritative source of *what this project is* (design, decisions, learnings).

---

## `.claude/` preservation contract (NI-1)

Fresh install must preserve any non-farm content already present in `.claude/`. Only `.claude/{skills,agents,rules}/` are rewritten as farms; `.claude/CLAUDE.md`, `.claude/hooks/`, `.claude/settings/`, plugin-installed content, and user scratch survive the install untouched. The farm builder (`buildFarmIntoRoot`) enforces this — it never removes `.claude/` contents outside the three kind directories.

---

## Memory vs. configuration

Configuration (covered in `../gobbi-config/README.md`) answers "how does this workspace / project / session behave?" using `settings.json` at the three tiers. Memory (this feature) answers "what happened here and what did we learn?" using the 11 taxonomy subdirectories under each project. Both share the `.gobbi/projects/{name}/` root but hold separate storage shapes and serve separate purposes.

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
