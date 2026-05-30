# Preparation — gobbi Claude Code Plugin (install-runtime) [CANONICAL]

**Loop:** preparation · **Session:** 0fd65721-c39f-4305-b296-9961aee8e1c1
**Feature:** install-runtime · **Locked idea:** `ideation/artifacts/gobbi-plugin-ideation.md`
**Verdict:** PASS (iter-2). Canonical readiness artifact — Planning Loop input.

## Evaluation Summary
- **iter-1:** Claude=PASS, Codex=REVISE → reconciled REVISE. Codex driver COD-OVERALL-001 (High/100): readiness-accounting inconsistencies (absent `claude` skill claimed present; "Generated this loop: None" vs staged files; stale proposed/open labels on ratified items). Both systems agreed the design SUBSTANCE (5 resolved items, component inventory, layout) was correct.
- **iter-2 remediation:** 8 enumerated consistency/operationalization fixes applied (accounting, cross-phase path qualification, dangling-`claude` correction, ratified-label alignment, Option-A prose scrub, fire-once `PostToolUseFailure` trigger operationalized, DD-9 omitted-skill naming, DD-7 staged decision). Manager fixed a residual staged-file count mismatch (5 decisions + 1 design = 6). Codex micro-confirmation: **VERDICT: PASS**. Reconciled iter-2 = **PASS**.
- No design re-decision occurred in remediation; the readiness substance is unchanged from iter-1.

---

## Scope reference

Locked Ideation Scope Contract: `ideation/artifacts/gobbi-plugin-ideation.md` § Scope Contract.
Two coupled deliverables: (1) a fresh bounded `gobbi` Claude Code plugin package (`.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/`) + a Claude-schema `marketplace.json`; (2) a `claude-plugin` skill (general guide + layered gobbi section). Binding locked decisions DD-1..DD-9 are retained verbatim — Preparation does NOT re-open them. The 5 items below are the Ideation-deferred design-details (STRUCT-1, F-S1/CONS-1, DD-8/R2, DD-7/F-U1, DD-9/F-P1) resolved into concrete recommendations.

---

## Readiness summary

**Verdict: READY for Planning — no blocking gaps, zero `re-ideate` triggers, zero `generate-now` skill gaps.** The locked Ideation output is internally consistent and contradiction-free. Project memory, the 6 staged Ideation references, the prior-art git history, and the live repository all corroborate the design. All 5 open design-details are now resolved with concrete recommendations + evidence; 2 of them (hook steady-state DD-8, permissions DD-9) carried a genuine user-ownable decision and were **RATIFIED by the user via AskUserQuestion on 2026-05-30** (hook = Option C dev-vs-installed split; permissions = keep project-local + verify auto-grant empirically). One **inventory correction** is surfaced and now RATIFIED (manager auto-decide 2026-05-30): the canonical tree holds **18** skill dirs, not 17 — `gobbi-hook-authoring` is canonical-only (no `.claude/skills/` mirror) — and the plugin packages all 18.

The `claude-plugin` skill is a **deliverable of Execution**, not a Preparation prerequisite — its absence is NOT a gap (confirmed: no `skills/claude-plugin/` dir exists yet; correct).

---

## Design + memory readiness

### Sub-step A — Ideation output read end-to-end
- `gobbi-plugin-ideation.md` (scope contract, framed problem, DD-1..DD-9, open issues, eval summary, directional checklist, references): **complete, final, internally consistent.**
- `resolution-log.md`: per-finding closure audit; 4 open findings carried to Planning (F-S1+CONS-1, STRUCT-1, F-U1, F-P1) — these map 1:1 to the 5 items in this brief (DD-8 is the additional Planning blocker named in the design doc).
- `ideation/artifacts/memory-reads.md`, `ideation/staging/design/gobbi-plugin-bounded-package.md`, 4 open `ideation/staging/decisions/*`, `ideation/staging/scenarios/worktree-faithful-install-path-default.md`, 2 `ideation/staging/backlogs/feature/*` (publish + codex-reconcile), 2 `ideation/staging/discussions/*`, 6 `ideation/staging/references/*`: **all present and read.** (These cross-phase pointers all live under `ideation/staging/`; `preparation/staging/` holds ONLY this loop's 5 decisions + 1 design.)
- **Contradiction findings: none.** The feature directory `features/install-runtime/` exists and is mature (README + 6 design docs + scenarios + checklists + references + decisions). No undefined component; no un-bootstrappable path.

### Sub-step B — Design + memory gap scan (against the readiness signal list)
| Signal the downstream loop needs | Where it lives | Status |
|---|---|---|
| Plugin manifest schema (plugin.json) | `ideation/staging/references/claude-code-plugin-manifest-schema.md` (code.claude.com) | READY |
| Marketplace schema + source resolution | `ideation/staging/references/marketplace-json-schema-and-skills-dir-plugins.md` | READY |
| Worktree source-resolution gotcha | `ideation/staging/references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md` | READY |
| Hook portability / `${CLAUDE_PLUGIN_ROOT}` | `ideation/staging/references/plugin-hooks-config-and-plugin-root-var.md` | READY |
| Cache symlink-dereference / path-traversal | `ideation/staging/references/plugin-cache-symlink-dereferencing-and-path-traversal.md` | READY |
| Prior gobbi-core layout (proven base) | `ideation/staging/references/prior-gobbi-core-plugin-package-history.md` + verified live via git | READY |
| Materialize-vs-symlink lesson | `mistakes/skills-mirror-symlinks-not-copies.md` + `executor-mirror-path-vs-worktree-physical-copy.md` + `edit-tool-refuses-symlink-paths.md` | READY |
| Worktree write-path discipline | `mistakes/subagent-relative-write-paths-stray-cd-doesnt-persist.md` + `executor-cwd-reset-commits-task-to-wrong-branch.md` + `session-dir-placed-outside-worktree.md` | READY |
| Hook double-registration prior design | `features/install-runtime/design/dual-hook-registration-resolver.md` (D-3-3, locked) | READY |
| Current hook registration shape | live `.claude/settings.json` (3 blocks) — verified | READY |

**Design + memory gaps: NONE that block Planning.** Every artifact a planner/executor will read is staged (under `ideation/staging/` for the references/scenarios/backlogs/discussions, under `preparation/staging/` for this loop's 5 decisions + 1 design) or in project memory. The 4 open decisions are not *missing* artifacts — they are *unresolved choices* that this draft resolves (2 of them since RATIFIED by the user).

### Sub-step B — live-repo ground truth (verified this loop)
- Canonical skills: **18 dirs** at `.gobbi/projects/gobbi/skills/` — `codex, delegation, discussion, evaluation, execution, git, gobbi, gobbi-hook-authoring, ideation, interview, memorization, mistake, orchestration, planning, preparation, principles, research, wrap-up`. (No `claude` skill exists — see Sub-step C.)
- `.claude/skills/` mirror: **17** skills, each `SKILL.md` a symlink into `../../../.gobbi/projects/gobbi/skills/...`. `gobbi-hook-authoring` is **NOT** mirrored (canonical-only). (Confirms `mistakes/skills-mirror-symlinks-not-copies.md`.)
- Canonical agents: `.gobbi/projects/gobbi/agents/` holds **5 `.md` + 5 `.toml`** (manager/leader/executor/evaluator/assistant, each with a `.toml` Codex wrapper). `.claude/agents/` mirrors only the 5 `.md` as symlinks. → confirms S1: package `agents` array enumerates the **5 `.md` only**, excludes `.toml`.
- Hook scripts: `.claude/hooks/session-start.sh` (4109 B, +x) and `.claude/hooks/post-tool-use-agents.sh` (10362 B, +x) — **real files** (not symlinks). These are the 2 scripts to materialize.
- `.claude/settings.json` hooks: 3 blocks — `SessionStart` (matcher `startup|resume|clear|compact` → session-start.sh), `PostToolUse` (matcher `Task|Agent` → post-tool-use-agents.sh), `PostToolUseFailure` (matcher `Task|Agent` → post-tool-use-agents.sh). → exactly the 2-script/3-registration shape DD-3 names.
- `.claude/settings.json` `permissions.allow`: **16 `Skill()` + 5 `Agent()` + `WebSearch`**. The 16 named skills do NOT include `codex` or `gobbi-hook-authoring`. (Material to DD-9 / RATIFIED decision 5.)
- Repo-root `.claude-plugin/` and `plugins/`: **both ABSENT** → fresh build, no collision; free to create.
- Codex side: `.agents/plugins/marketplace.json` (name `gobbi-workspace`, Codex object-source schema) + `.codex-plugin/plugin.json` (skills→`./.gobbi/.../skills/` in-place). Disjoint schema and path from the Claude side — **no collision**; reconciliation correctly backlogged.

### Sub-step B — prior-art layout verified live (git)
- `62b95a0` (#6): marketplace at repo-root `.claude-plugin/marketplace.json` (`name: gobbi`), plugin at `plugins/gobbi-core/`, `source: "./plugins/gobbi-core"`, directory-pointer manifest.
- `e083fad^` (last-live): marketplace `name: gobbi`, plugin at `plugins/gobbi/`, `source: "./plugins/gobbi"`, plugin.json `name: gobbi` + `skills: "./skills/"` + `agents: [5 .md paths]` (NO `hooks` key in that snapshot — hooks were a separate `plugins/gobbi/hooks/hooks.json`). **This is the closest proven template for the fresh build.**
- The `e083fad^` `hooks/hooks.json` was the **v0.4.x `gobbi-dev` CLI shape (28 event types)** — NOT today's markdown-driven 2-script/3-registration shape. Do **NOT** copy it; reproduce the current `.claude/settings.json` 3 blocks instead. (This is the operational meaning of "fresh build on current v0.5 structure.")

### Sub-step C — Execution skills readiness
| Skill the executor needs | Present? | Resolution |
|---|---|---|
| `gobbi-hook-authoring` (hook stack/portability) | YES (canonical) | none needed |
| `claude` (`.claude/` doc-authoring standard) | NO — known-absent dangling reference (FLAG-2) | **NOT a gap** for this task — see note below |
| `claude-plugin` (the deliverable) | NO — by design | **NOT a gap** — it is Execution's deliverable, not a prerequisite |
| `git` (branch/worktree/commit discipline) | YES | none needed |
| general TS/Bun conventions | N/A — this work is JSON manifests + shell + markdown, no TS | not required |

**Note on the absent `claude` skill (FLAG-2):** `CLAUDE.md`'s navigation table links `[claude skill](skills/claude/SKILL.md)`, but `ls .gobbi/projects/gobbi/skills/` confirms **no `claude` dir exists** (verified this loop). That link is a **known dangling reference**, not a present skill. It is NOT a `generate-now` gap for this task: the `.claude/`-doc-authoring standard this plugin work relies on is the manifest/marketplace schema (covered by the staged references), not a `claude` SKILL. The dangling reference is a pre-existing project-wide observation, recorded for awareness only (a planner may file a follow-up; do not absorb into this scope).

**Execution skills gaps: NONE.** No `generate-now` skill decision is warranted. The one skill the deliverable will create (`claude-plugin`) is the deliverable itself; staging it now would pre-empt Execution and violate scope (Iron Law 4 + the brief's explicit out-of-scope). The `claude` skill is absent-but-dangling (above), not a blocking gap for this manifest/shell/markdown work.

---

## Resolved design-details (the 5 open items)

### Item 1 — Package root path + marketplace `source` (STRUCT-1)
**Recommendation:** package root = `plugins/gobbi/` (repo-relative, top-level); manifest at `plugins/gobbi/.claude-plugin/plugin.json`; marketplace at repo-root `.claude-plugin/marketplace.json` with plugin entry `source: "./plugins/gobbi"`.
**Rationale:** This is the exact proven prior-art shape — `62b95a0` used `plugins/gobbi-core/` + `source: "./plugins/gobbi-core"`; `e083fad^` (last-live) used `plugins/gobbi/` + `source: "./plugins/gobbi"`. The bounded-cache invariant (allow-set = `{.claude-plugin/, skills/, agents/, hooks/}` only) attaches to `plugins/gobbi/`, so the R1 77M-payload regression cannot recur. `source` is a bare `"./..."` string (Claude schema), resolved relative to the marketplace root (the dir containing `.claude-plugin/` = repo root), per `ideation/staging/references/marketplace-json-schema-and-skills-dir-plugins.md`. Both `plugins/` and repo-root `.claude-plugin/` are confirmed absent today → no collision with the Codex `.agents/plugins/` marketplace.
**Evidence:** `git show e083fad^:.claude-plugin/marketplace.json` (`source: "./plugins/gobbi"`); `git show 62b95a0:.claude-plugin/marketplace.json`; live `ls plugins/ .claude-plugin/` (absent); reference `ideation/staging/references/marketplace-json-schema-and-skills-dir-plugins.md`.
**Evidence-to-change:** if a planner finds the repo already publishes a *different* Claude marketplace at repo-root `.claude-plugin/marketplace.json`, the root choice must be revisited (verified absent this loop, so no change indicated).

### Item 2 — Materialization mechanism + named re-sync trigger + drift gate (F-S1 / CONS-1)
**Recommendation:** Mechanism choice (build script vs git-tracked copies vs manual) stays Execution-level, but Planning MUST name the trigger and a mechanical gate:
- **Named re-sync trigger:** "Any commit that touches a file under `.gobbi/projects/gobbi/skills/`, `.gobbi/projects/gobbi/agents/*.md`, or `.claude/hooks/*.sh` REQUIRES a corresponding re-materialization of `plugins/gobbi/{skills,agents,hooks}/` in the same commit (and, when `plugin.json.version` is set, a version bump)."
- **Mechanical gate (recommended direction):** a `scripts/sync-plugin-package.sh` (or equivalent) that (a) re-materializes the package from canonical sources and (b) a diff/checksum check that fails when `plugins/gobbi/...` diverges from canonical — runnable locally and as the future #258 drift-detector's enforcement point.
**Rationale:** The materialized-copy model deliberately trades single-source-of-truth for install-survivability (proven necessary by #251 — escaping symlinks yield empty installs). The cost is a drift surface that the project's own history shows is reliably violated without a defined trigger (PR #260→#261 mirror repair; backlog #258). A bare "keep in sync" note repeats that exact failure. The cache-contents allow-set gate (Item-1 invariant) only checks that real files *exist*, not that they are *current* — so a separate freshness gate is required. Mechanism is left to Execution because build-script-vs-tracked-copies is an implementation trade-off, not a direction-level choice; the *trigger + gate* are direction and must be pinned now.
**Evidence:** `preparation/staging/decisions/drift-resync-trigger-and-mechanical-gate-resolved.md`; `mistakes/skills-mirror-symlinks-not-copies.md` (the symlink-mirror is one edit; the *package copy* is a genuine second copy — distinct surfaces, do not conflate); prior-art `c79d28e` #251 "editing on main now requires editing in two places."
**Evidence-to-change:** if Execution adopts within-marketplace symlinks (doc allows symlinks whose target is *inside the same marketplace* to be dereferenced-and-copied), the drift surface could be eliminated — but the cache reference warns local/`--plugin-dir` installs preserve ONLY within-own-dir symlinks, so this is fragile; real copies remain the recommended base.

### Item 3 — Hook double-registration steady-state (DD-8 / R2) → RATIFIED: Option C (dev-vs-installed split)
**USER RATIFIED 2026-05-30 (AskUserQuestion):** **Option C — dev-vs-installed split.** `.claude/settings.json` KEEPS its 3 hook-event registrations for in-repo development; the plugin's `hooks/hooks.json` serves installed users. The leader's recommended Option A (replace) was NOT chosen. Planning MUST: (a) keep `settings.json` and `hooks.json` coherent (same 2 scripts / 3 events / matcher `Task|Agent` / `${CLAUDE_PLUGIN_ROOT}` paths in the plugin copy), treating drift between them as a defect; (b) implement the fire-exactly-once validation below for the installed case; (c) document the known caveat that a machine which BOTH develops in-repo AND installs the plugin will double-fire — acceptable per user choice (bounded by flock + upsert-by-id to latency/log-noise, not corruption). See `preparation/rawdata/discussion-log.md`.
~~**Recommendation:** Option A — the plugin's `hooks/hooks.json` REPLACES the project-local `.claude/settings.json` hook block.~~ (Superseded by user ratification of Option C above.)
**Fire-exactly-once validation (Option C, installed case):** instrument each of the 3 registrations (`SessionStart`, `PostToolUse`, `PostToolUseFailure`) to write a per-fire marker (append a line to a temp log keyed by `hook_event_name` + `tool_use_id`), deterministically trigger each event once in a clean installed-only environment (plugin installed, NO in-repo `.claude/settings.json` dev registrations active — so the marker count is unambiguous), and assert exactly one marker per event. Because the same script (`post-tool-use-agents.sh`) backs both `PostToolUse` and `PostToolUseFailure`, the validation MUST key on `hook_event_name` to avoid a false double-count. **Deterministic per-event triggers (testable; Planning to task):**
- **`SessionStart`** — start a fresh Claude session (or `/clear`) in the installed environment; the `startup|resume|clear|compact` matcher fires it exactly once on session entry. Marker: one line with `hook_event_name=SessionStart`.
- **`PostToolUse`** — dispatch one Task/Agent tool call that SUCCEEDS (e.g., spawn a trivial agent that exits 0). The `Task|Agent` matcher fires `post-tool-use-agents.sh` once on success. Marker: one line with `hook_event_name=PostToolUse`.
- **`PostToolUseFailure`** — dispatch one Task/Agent tool call engineered to FAIL deterministically: spawn an agent/subtask whose body exits non-zero (e.g., a one-line agent prompt that runs a command returning a non-zero status, or a Task that references a missing required input so the tool call returns an error). The failure must still match the `Task|Agent` matcher (it is a Task/Agent tool call that failed, not a different tool). The `PostToolUseFailure` registration fires `post-tool-use-agents.sh` once. Marker: one line with `hook_event_name=PostToolUseFailure`. This is the registration hardest to trigger naturally and MUST NOT be skipped — it is precisely where an Option-C double-fire would be least visible.
**Rationale:** Option C keeps two registration sources scoped to two contexts: the in-repo `.claude/settings.json` block so hooks keep firing during dev sessions (like this one) WITHOUT requiring the plugin to be installed, and the plugin's `hooks/hooks.json` so INSTALLED users get the same behavior via `${CLAUDE_PLUGIN_ROOT}` paths. The coherence obligation is the cost of this split: `hooks.json` must mirror the live `settings.json` shape exactly (same 2 scripts, same 3 events, same `Task|Agent` matcher), and any drift between the two sources is a defect — fold it into the same re-materialize trigger as the skills/agents drift gate (Item 2). The `dual-hook-registration-resolver.md` design (D-3-3, locked) already established the single-script PostToolUse+PostToolUseFailure dual registration; BOTH sources must preserve that exact shape and not introduce a second concurrent registrant within a single context. The accepted caveat: a machine that both develops in-repo AND installs the plugin registers both sources and double-fires — bounded by `flock` + upsert-by-id to latency/log-noise, not data corruption (this double-fire safety is verified and must be preserved).
**Evidence:** `preparation/staging/decisions/hook-double-registration-steady-state-dev-vs-installed-split.md` (RATIFIED Option C); live `.claude/settings.json` 3 blocks; `features/install-runtime/design/dual-hook-registration-resolver.md`; `#256` (matcher-too-narrow) — do not over-narrow the `Task|Agent` matcher when reproducing the shape in `hooks.json`; `preparation/rawdata/discussion-log.md` (ratification record).

### Item 4 — DD-7 worktree-test default (F-U1)
**Recommendation:** **Option (a)** — commit/push the worktree branch, add the marketplace from a git-ref source pointing at that branch (or, during local dev, a temporary absolute worktree path), and assert a **worktree-only sentinel** is present in the installed cache (`~/.claude/plugins/cache/<id>/`).
**Rationale:** A naive `/plugin marketplace add ./` from the worktree resolves the relative local source against the **main checkout**, not the worktree (doc-confirmed) → tests the wrong tree (U1). Option (a) is the only one that is both worktree-faithful and consistent with the project's branch-per-session model; (b) absolute-path is viable but non-reproducible; (c) merge-to-main tests main, not the worktree. The sentinel assertion is the falsifier that proves the cache loaded worktree content.
**Evidence:** `ideation/staging/scenarios/worktree-faithful-install-path-default.md`; `preparation/staging/decisions/worktree-test-default-git-ref-source-with-sentinel.md`; reference `ideation/staging/references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md` (verbatim: "the path still points at the main checkout").
**Evidence-to-change:** this is a low-trade-off pick; Planning may ratify it directly without user escalation. Flagged as a routine Planning decision, not a contribution point.

### Item 5 — Permissions disposition (DD-9 / U2) → RATIFIED: keep project-local + verify empirically
**USER RATIFIED 2026-05-30 (AskUserQuestion):** **Treat plugin-provided invocability as UNVERIFIED (assumption_risk) and resolve empirically via the post-install invocability check; do NOT ship `permissions.allow` entries inside the plugin package** (the bounded package is `{.claude-plugin, skills, agents, hooks}` only — `settings.json` is explicitly out of the package per DD-2). Keep the `Skill()`/`Agent()` allow entries project-local in `.claude/settings.json`. If the check proves components are NOT auto-granted, a follow-up re-opens the boundary.
**Rationale:** The Claude plugin docs do NOT state that plugin-provided `Skill()`/`Agent()` components are auto-granted invocability. DD-2 already bars `settings.json` from the package, so "ship the entries with the plugin" is not even structurally available without re-opening DD-2. The conservative, always-works path is project-local entries, with the invocability check as the empirical falsifier.
**Post-install invocability check (DD-9 — names the auto-grant-testing components):** the check must invoke the components that actually TEST the auto-grant premise — i.e. the 2 skills NOT in the live `permissions.allow` list (`codex` and `gobbi-hook-authoring`), plus one agent. Invoking an *already-allowed* skill (e.g. `gobbi:git`) would NOT falsify the auto-grant question, because its allow entry already exists. Concretely: install the plugin, then **invoke `gobbi:codex` and `gobbi:gobbi-hook-authoring`** (the omitted-from-allow-list skills) and **one of the 5 agents** (e.g. `leader`). If they load without an explicit project-local allow entry, auto-grant is TRUE; if they are refused, auto-grant is FALSE and the 2 entries (`Skill(codex)`, `Skill(gobbi-hook-authoring)`) must be added project-local. **Inventory note for Planning:** the current allow-list names 16 skills and omits `codex` and `gobbi-hook-authoring` — if Execution packages those skills (it does: all 18), the project-local allow-list may need 2 added entries for them to be invocable post-install (pending the auto-grant finding).
**Evidence:** `preparation/staging/decisions/permissions-disposition-keep-project-local-verify-empirically.md`; live `.claude/settings.json` allow-list (16 Skill + 5 Agent + WebSearch, omits codex + gobbi-hook-authoring); plugin-manifest reference (no auto-grant statement).

---

## Component inventory (for Planning to task precisely)

### Skills to materialize into `plugins/gobbi/skills/` — RATIFIED: package all 18 (manager auto-decide 2026-05-30)
`codex, delegation, discussion, evaluation, execution, git, gobbi, gobbi-hook-authoring, ideation, interview, memorization, mistake, orchestration, planning, preparation, principles, research, wrap-up`.
- The brief said "17 skills"; the canonical tree has **18**. The 18th is `gobbi-hook-authoring` (canonical-only, unmirrored in `.claude/skills/`).
- **RATIFIED: package all 18** (manager auto-decide, completeness — not a trade-off). A plugin is a self-contained distribution; `gobbi-hook-authoring` is a real, load-bearing skill (the hook stack the 2 packaged hook scripts are built on). Excluding it would ship a plugin that can run the hooks but not teach how to author them. The `.claude/skills/` mirror omission is a mirror-coverage gap (a separate concern), not a signal that the skill should be excluded from the package.
- Each skill dir is materialized as **real file copies** (every file under the dir, e.g. `SKILL.md` + any child docs/templates), not symlinks (DD-2a).
- (Note: there is NO `claude` skill in the canonical tree — the `skills/claude/SKILL.md` link in `CLAUDE.md` is a known dangling reference, FLAG-2 — so the 18-skill inventory correctly does NOT include `claude`.)

### Agents to enumerate in `plugin.json.agents` (array) + materialize into `plugins/gobbi/agents/`
`./agents/manager.md`, `./agents/leader.md`, `./agents/executor.md`, `./agents/evaluator.md`, `./agents/assistant.md` — **the 5 `.md` files only**. The 5 `.toml` Codex wrappers are EXCLUDED (S1: `agents` is a file-path array that REPLACES the default; `.toml` are not Claude agents). Materialize the 5 `.md` as real copies.

### Hooks to materialize into `plugins/gobbi/hooks/` + register in `plugins/gobbi/hooks/hooks.json`
- 2 scripts: `session-start.sh`, `post-tool-use-agents.sh` — real copies, bodies UNCHANGED, `chmod +x` preserved.
- 3 registrations in `hooks.json` (reproduce the live `.claude/settings.json` shape, paths via `${CLAUDE_PLUGIN_ROOT}`):
  - `SessionStart` matcher `startup|resume|clear|compact` → `"${CLAUDE_PLUGIN_ROOT}"/hooks/session-start.sh`
  - `PostToolUse` matcher `Task|Agent` → `"${CLAUDE_PLUGIN_ROOT}"/hooks/post-tool-use-agents.sh`
  - `PostToolUseFailure` matcher `Task|Agent` → `"${CLAUDE_PLUGIN_ROOT}"/hooks/post-tool-use-agents.sh`
- Do NOT over-narrow matchers (#256 lesson); do NOT copy the deprecated `gobbi-dev`-CLI 28-event `e083fad^` hooks.json.
- Hook portability confirmed: both scripts resolve work targets from runtime payload (`$cwd`, `$CLAUDE_ENV_FILE`), not their own location — body-unchanged relocation is safe.

### Manifest (`plugins/gobbi/.claude-plugin/plugin.json`)
`name: gobbi` (required), metadata (version/description/author/license/keywords as e083fad^ template), `skills: "./skills/"` (ADDS-to, dir pointer), `agents: [5 .md paths]` (REPLACES), `hooks: "./hooks/hooks.json"`.

### Marketplace (`.claude-plugin/marketplace.json` at repo root)
`name` (kebab), `owner` (object, `name` required — use the e083fad^ owner block), `plugins: [{ name: "gobbi", source: "./plugins/gobbi", description, version }]`.

---

## Generated this loop

6 session-staged files (5 decisions + 1 design) resolving the open Ideation design-details — staged for Wrap-up promotion to `features/install-runtime/{decisions,design}/`. No `generate-now` skill or project-memory write was warranted (no missed MEMORIZATION promotion; the one absent skill, `claude-plugin`, is Execution's deliverable; the `claude` dangling reference is a pre-existing observation, not a generate-now gap). The 6 files:

- `preparation/staging/decisions/bounded-package-root-and-marketplace-source-resolved.md` — Item 1 (STRUCT-1): package root `plugins/gobbi/` + `source: "./plugins/gobbi"`.
- `preparation/staging/decisions/drift-resync-trigger-and-mechanical-gate-resolved.md` — Item 2 (F-S1/CONS-1): named re-sync trigger + `scripts/sync-plugin-package.sh` diff gate.
- `preparation/staging/decisions/hook-double-registration-steady-state-dev-vs-installed-split.md` — Item 3 (DD-8): RATIFIED Option C (dev-vs-installed split) + fire-exactly-once validation.
- `preparation/staging/decisions/permissions-disposition-keep-project-local-verify-empirically.md` — Item 5 (DD-9): RATIFIED keep project-local + verify auto-grant empirically.
- `preparation/staging/decisions/worktree-test-default-git-ref-source-with-sentinel.md` — Item 4 (DD-7): RATIFIED Option (a) — commit/push + git-ref source + worktree-sentinel assertion.
- `preparation/staging/design/gobbi-plugin-component-inventory-and-layout.md` — resolved layout + 18-skill / 5-agent / 2-script-3-registration component inventory.

---

## Out of scope gaps

- **`.claude/skills/claude-plugin/` mirror symlink + `claude-plugin` skill body** — Execution deliverable (DD-6), not a Preparation gap. No staging.
- **`claude` skill dangling reference** (FLAG-2: `CLAUDE.md` links `skills/claude/SKILL.md` but no `claude` dir exists) — pre-existing project-wide observation, unrelated to this task. Note only; do not absorb. A planner may file a follow-up.
- **`gobbi-hook-authoring` mirror-coverage gap** (canonical-only, no `.claude/skills/` symlink) — pre-existing, unrelated to this task. Note only; do not absorb. (Recorded as a project-wide observation; a planner may file a follow-up if desired.)
- **Codex `.agents/plugins/marketplace.json` ↔ Claude manifest reconciliation** — already backlogged (`ideation/staging/backlogs/feature/reconcile-codex-plugin-and-claude-plugin-manifests.md`).
- **Public/hosted marketplace publishing** — already backlogged (`ideation/staging/backlogs/feature/publish-gobbi-to-public-marketplace.md`).
- **`scripts/sync-plugin-package.sh` mechanism implementation** — Execution-level (Item 2 names the trigger + gate direction; mechanism is Execution's).

---

## Decisions log

| # | Topic | Resolution this loop | Authorizing source |
|---|---|---|---|
| A | Ideation output sound enough to proceed | YES — no contradictions; feature dir exists; all signals covered | Sub-step A scan |
| 1 | Package root + source (STRUCT-1) | `plugins/gobbi/` + `source: "./plugins/gobbi"`; marketplace at repo-root `.claude-plugin/` | prior-art e083fad^/62b95a0 + marketplace ref |
| 2 | Drift trigger + gate (F-S1/CONS-1) | Named trigger (canonical skills/agents/hooks edit → package re-materialize same commit) + recommend `scripts/sync-plugin-package.sh` diff gate; mechanism = Execution | drift-sync decision + #251/#258 |
| 3 | Hook steady-state (DD-8) | **RATIFIED: Option C (dev-vs-installed split)** — settings.json keeps dev registration, plugin hooks.json serves installed; keep coherent + fire-exactly-once validation for installed case; double-fire caveat accepted | USER AskUserQuestion 2026-05-30 |
| 4 | Worktree test default (DD-7) | **RATIFIED: Option (a)** commit/push + git-ref source + sentinel assertion | worktree scenario + worktree-resolution ref (low-trade-off Planning decision) |
| 5 | Permissions disposition (DD-9) | **RATIFIED: do not ship entries; keep project-local; verify auto-grant via post-install invocability check** (invoke the omitted `codex` + `gobbi-hook-authoring` skills + 1 agent; add Skill(codex)+Skill(gobbi-hook-authoring) allow entries if not auto-granted) | USER AskUserQuestion 2026-05-30 |
| 6 | Skill inventory count | **RATIFIED: package all 18** (incl. `gobbi-hook-authoring`) | manager auto-decide 2026-05-30 |

**Re-ideate escalations:** none.
