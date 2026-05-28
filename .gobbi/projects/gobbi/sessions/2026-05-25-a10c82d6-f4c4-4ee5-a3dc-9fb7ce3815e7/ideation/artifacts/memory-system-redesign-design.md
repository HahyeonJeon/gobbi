# Memory-System Redesign — Complete Design (Ideation draft, iter2)

Session 2026-05-25-a10c82d6. Author: leader (PI). Phase: Ideation WORK. Grounds on the 8 LOCKED decisions (L1-L8 in `rawdata/locked-decisions.md`), the factual audit (`rawdata/memory-system-audit.md`), and naming prior art (`rawdata/naming-research-synthesis.md`). Every codebase claim is path-cited and re-verified against the live tree this iteration. This is a DESIGN doc — no skill/template/memory file is edited here (that is Execution).

Status legend used below: **[RATIFY]** = needs user authority before Planning; **[AUTO]** = leader's discretion, resolvable from a lock; **[FLAG]** = out-of-scope finding surfaced for a follow-up.

## iter2 remediation log

Dual-system evaluation returned FAIL (one Critical) → REVISE. The CORE is preserved verbatim (13 type specs, naming standard, Principle #13 P8/P13 delineation, migration strategy, temporal split, archive resolution). What changed this iteration:

- **CRITICAL — mirror model corrected (manager-verified against the live main tree).** The `.claude/skills/X/` mirror is **per-file SYMLINKS into the canonical `.gobbi/projects/gobbi/skills/X/`**, not a second physical copy. `ls -la .claude/skills/memorization/` shows `SKILL.md -> ../../../.gobbi/projects/gobbi/skills/memorization/SKILL.md`. The canonical tree holds 57 real files / 0 symlinks; `.claude/skills/` holds the symlinks. Editing the canonical file is reflected through the symlink automatically — ONE edit, not two. The previous "×2 physical copies, every edit doubles" warning (old §7 intro, old §6 Principle #13 step 3) was FALSE and is removed. The mistake `executor-mirror-path-vs-worktree-physical-copy.md` was misread: its real point is that the canonical `.gobbi/.../skills/` files are *branch-isolated per worktree* (a worktree checkout materializes its own copies on its branch), NOT that the `.claude ↔ .gobbi` mirror doubles edits. Asymmetry recorded: `gobbi-hook-authoring` is canonical-only (no `.claude/skills/` symlink).
- **HIGH-1** — corrected skill inventory + 7-feature ownership to the REAL set: 17 mirrored skill dirs (the `.claude/skills/` symlink set) + `gobbi-hook-authoring` (canonical-only) = **18 canonical skill dirs**. Dropped phantoms `gobbi-install` (a CLI effort, not a skill dir) and `_claude`/`claude` (no dir exists). `install-runtime` owns `interview` only; install/runtime knowledge is documented in `gobbi/SKILL.md` + the install dir, not a created skill. `gobbi-hook-authoring` re-housed under `install-runtime` (its witnesses are session-start.sh + post-tool-use-agents.sh — the session-runtime contract).
- **HIGH-2** — added `delegation/SKILL.md` + `delegation/templates/*` to §7; the new `memorization/rules.md` standard is wired into every delegation template's Load Directives tier-3 Skills (alongside `memorization/SKILL.md`). Highest-leverage fix: without it the standard is advisory-only.
- **HIGH-3** — added §2 specs for the 4 feature-subdir-only template types (`changelogs/`, `discussions/`, `scenarios/`, `checklists/`); §7 #8 now actionable for all 17 templates.
- **HIGH-4** — `plans/` feature-only is now HARD for the loop path; project-level `plans/` is maintainer-authored cross-feature roadmaps, explicitly NOT loop-written.
- **HIGH-5** — resolved frontmatter base contradictions with `features/` (feature README scope = the feature itself) and `archive/` (`archive` removed from the `type` enum; archived files keep their ORIGINAL type + archive fields).
- **MED-6** — base `status` is the authoritative generic lifecycle field; type-specific `decision_status`/`disposition` are documented refinements (one model, documented).
- **MED-7** — sharpened reviews-vs-reports retrospective disambiguator.
- **MED-8** — P13 no longer depends on the missing `_claude` skill; references the doc standard generically + FLAG-2.
- **MED-9** — naming word-count unified to **≤6 words / ≤~35 chars** everywhere.
- **MED-10** — corrected session-cleanup counts: **5** `state.json` + **2** root `HANDOFF.md` (verified).
- **MED-11** — strengthened Bundle C primary/secondary feature evidence.
- **LOW-12** — `item-N-M` count corrected to **5** (verified) and all 5 listed in §8 cat B.
- **LOW-13** — line-number citations replaced with section-anchor references.
- **LOW-14** — added a "do nothing" counterfactual steel-man (§0.1).
- **LOW-15** — moved the 3-way `rules` disambiguation into the §4 definition.
- **LOW-16** — added a per-file routing heuristic for Category A; corrected the real count (**136** md files across the 4 sprint dirs).

---

## 0. Orientation — the model in one paragraph

A `features/{slug}/` directory is a **durable product value-feature** — a capability a user or investor would name as "what gobbi does for me" (L1), not a work-sprint and not an internal subsystem. A **session** is a unit of verb-work: its volatile loop artifacts live under `sessions/{date-id}/` and its one durable journal entry lives at `notes/{date}-{slug}.md`; the session's durable conclusions promote INTO the value-feature(s) it touched (L2). All 13 project-memory types survive, each with a sharp purpose, a "use-this-not-that" boundary, a declared scope with a promote-up trigger, a naming rule keyed to whether the content is time-indexed, a frontmatter schema, and a CRUD lifecycle (L3/L4/L5/L6). A new Principle #13 makes agents spec-and-CRUD-scope every documentation change before touching a file (L7). The `skills/` and `agents/` directories under the project are out of scope this session (L8).

### 0.1 Counterfactual — why not leave the memory system as-is (LOW-14 steel-man)

The honest "do nothing" case: the current tree already works well enough to ship features session after session (env-var-audit, Bundles A/B/C all landed); the naming and frontmatter drift is cosmetic; agents find what they need via grep; and a 136-file migration is risk and effort that a solo-user project may not repay. If the only cost were aesthetic, "leave it" would win.

Why it does not win: the drift is *not* purely cosmetic — it is **load-bearing ambiguity**. (a) Sprint-features (`session-foundations-bundle-b`) are verb-named work-logs masquerading as durable capabilities, so the next session's Ideation overlap-detection (Sub-step A) reads them as features and either re-does or mis-files work. (b) Bundle/positional filenames (`ideation-decisions.md`, `item-1-2-*`) break the one-record-one-concept contract, so supersede/archive operate on the wrong granularity. (c) No frontmatter standard means no machine-checkable promotion allowlist, so staging-only flags (`mistake-candidate` on 17 files) leak into durable memory. (d) The redesign also writes the *standard itself* into a loadable place (`memorization/rules.md` wired into every delegation template), which is the only thing that stops the drift recurring next session. The migration is a one-time cost; the drift is a recurring per-session tax. That asymmetry is the real motivator (Principle 10 witness: the audit + this session's REVISE findings).

---

## 1. Canonical feature list — gobbi's product value-propositions (L1) — [RATIFY]

### 1.1 Derivation method (the investor / product-value lens)

gobbi has no `src/` or `packages/` product code (repo root holds only `AGENTS.md`, `CHANGELOG.md`, `LICENSE`, `README.md` — verified `ls` at repo root). It is a meta-tool whose product surface is its **skills + agents + workflow machinery + install/runtime layer**. The real skill inventory (re-verified this iteration): **18 canonical skill dirs** under `.gobbi/projects/gobbi/skills/` — 17 of which are mirrored into `.claude/skills/` as per-file symlinks, plus `gobbi-hook-authoring` which is canonical-only (no `.claude/skills/` symlink). 5-role agent roster under `agents/*.md`.

**The reframe (per user).** A `features/{slug}/` directory must name a thing a *user or investor* would recognize as "what gobbi DOES for me" — a **product value-proposition**, not the subsystem that implements it. The earlier 11-bucket list (`workflow-engine`, `workflow-loops`, `delegation-system`, `discussion-system`, `session-runtime`, …) was an *implementation decomposition* — how a maintainer slices the code. The internal mechanics (delegation, discussion, the loop bodies, session runtime, hooks, the state machine) are *how* a value-feature is delivered — they fold UNDER the value-feature they serve; they are not features themselves.

**Test each value-feature must pass:** *"Would this name appear as a bullet in gobbi's README 'Features' section?"* If it names a bare mechanism rather than a durable capability, it fails and folds into the value-feature it serves.

**Naming vibe.** Slugs are **developer-subsystem nouns** the way a maintainer names a subsystem in a codebase or a README features bullet — concise, technical, kebab-case, 1-3 words. No marketing adjectives. The capability is durable and coarse (L1); a feature may share its name with its primary skill area (the feature is the broader durable capability).

**Discipline kept:** noun / durable / coarse (L1). Aim ~6-8 value-features (coarser than 11). Each owns several of the 18 canonical skill dirs + non-skill subsystems.

### 1.2 The 7 value-features

> **Naming vibe (iter1 rename pass, retained).** Slugs are **developer-subsystem** tone: the core technical noun, no marketing adjectives, kebab-case, 1-3 words. The **grouping and all skill/sprint ownership are unchanged** through the iter2 revision except for the three corrections forced by the real inventory: `gobbi-install` and `_claude`/`claude` were phantoms (dropped); `interview` is `install-runtime`'s only owned skill; `gobbi-hook-authoring` is re-housed under `install-runtime`.

| # | Feature slug | One-liner (plain technical description) | Canonical skill dirs / subsystems it owns | Sprints that map in |
|---|---|---|---|---|
| 1 | `workflow` | The Ideation → Planning → Execution → Memorization → Handoff pipeline: a gated 6-step state machine that drives every unit of work. | `orchestration` (+ `workflow/*.md`, the 6-step state machine / reducer / event store); the five loop bodies `ideation` / `preparation` / `planning` / `execution` / `wrap-up`; `research` (Ideation's investigation engine); `discussion` (the AskUserQuestion human-in-the-loop gate at each step). | **Bundle A** (primary) |
| 2 | `project-memory` | Cross-session durable store: decisions, designs, plans, and references survive in a typed, searchable memory tree. **← this redesign lands here.** | `memorization` (synthesis + staging) + `memory-map.md`; `wrap-up`'s promotion half; the 13 project-memory types + naming standard + frontmatter standard + the archive move-on-terminal model (`design/archive-move-on-terminal-model.md`). The doc-authoring standard P13 leans on is referenced generically (see [FLAG-2] — the `claude` doc-standard skill is currently absent). | Bundle C (secondary: session-lifecycle design doc) |
| 3 | `agents` | The multi-agent roster — PI, planner, executors, evaluators, scribe — with role-scoped delegation, clean handoffs, and per-role model selection. | `delegation` (per-role templates, Load Directives, status contract, model selection, spawn topology) + `delegation/templates/*`; the 5-role agent roster (`agents/*.md`). | Bundle B (primary: delegation-brief + subagent metadata) |
| 4 | `evaluation` | Dual-system review (Claude + Codex) across 7 perspectives, gating each deliverable before acceptance. | `evaluation` (4-stage procedure, 7 perspectives + Overall, finding metadata, cross-system reconciliation) + per-loop `evaluation.md` child docs; `codex` (the Codex-invocation half + the cross-model differentiator). | Bundle A (secondary: T05/T06 codex) |
| 5 | `guardrails` | The 13 Iron Laws plus the mistake-capture-and-learn loop that keep agents in scope, verifying claims, and not repeating known traps. **← Principle #13 lands here.** | `principles` (the 13 Iron Laws, incl. new #13); `mistake` (moment-of-capture, two-layer promotion, required-mistakes wiring) + the `mistakes/` tier as consumer. | Bundle C (secondary: gobbi-mistake-promote fix, hooks-domain tag) |
| 6 | `git-workflow` | Worktree-isolated sessions and a branch/PR/issue lifecycle that keep the main tree clean. | `git` (worktree-first architecture, branch/PR/issue lifecycle, the Memory Access Matrix git rules, per-iter commit cadence). | **Bundle B** (primary: worktree-first T1), **Bundle C** (primary: orchestration row reorder) |
| 7 | `install-runtime` | One-command install (stable/dev channel) + project bootstrap interview + the per-session runtime contract (env-vars, hooks, session config). | `interview` (project-bootstrap discovery) — the ONLY skill dir it owns; `gobbi-hook-authoring` (authoring SessionStart/PostToolUse hooks — its witnesses are `session-start.sh` env-file passthrough + `post-tool-use-agents.sh` agents[] upsert, both pure session-runtime). Plus non-skill subsystems documented in `gobbi/SKILL.md` + the install dir: the channel-split install (stable/dev), `.claude/`↔project mirror-sync, and the session-runtime contract (env-var persistence, SessionStart hook, `session.json` / `settings.json` lifecycle, subagent-metadata capture). | **env-var-audit** (primary), Bundle B (secondary: T3 subagent metadata) |

**Slug rationale (dev-vibe).** `workflow` — the core noun for the pipeline. `project-memory` — the durable cross-session store; kept the `project-` qualifier so it does not collide conceptually with the `memorization` skill (the *act*) or a bare "memory." `agents` — the multi-agent roster (shares its name with the `agents/` dir it owns; acceptable — the feature is the broader capability). `evaluation` — the review subsystem (shares its name with the primary `evaluation` skill; acceptable). `guardrails` — keeps `principles` + `mistake` united as one capability. `git-workflow` — names the git subsystem and stays distinct from feature #1 `workflow`. `install-runtime` — names the two technical halves (install + runtime). Note `install-runtime` owns no `gobbi-install` *skill* (install is a CLI effort whose knowledge is documented in `gobbi/SKILL.md` + the install dir, not a skill dir).

**Folding rationale (why these 7, not the old 11).** `workflow-engine` + `workflow-loops` collapse into `workflow`. `delegation-system` + the agent roster become `agents`. `discussion-system` is the human-in-the-loop *mechanism* of the workflow → folds into #1. `session-runtime` is plumbing under install/runtime → folds into #7. `mistake-system` + `principles` unite as `guardrails`. The cross-model (Claude + Codex) story is the *differentiator inside* `evaluation`, not a standalone feature.

**All 18 canonical skill dirs housed (re-verified audit).** `workflow` owns orchestration + ideation + preparation + planning + execution + wrap-up + research + discussion (**8**); `project-memory` owns memorization (**1**, plus `wrap-up`'s promotion half — shared with #1, counted once under #1); `agents` owns delegation (**1**); `evaluation` owns evaluation + codex (**2**); `guardrails` owns principles + mistake (**2**); `git-workflow` owns git (**1**); `install-runtime` owns interview + gobbi-hook-authoring (**2**, the only non-mirrored skill — `gobbi-hook-authoring` — lands here). Sum: 8 + 1 + 1 + 2 + 2 + 1 + 2 = **17 mirrored + 1 canonical-only = 18 ✓**. (`wrap-up` counted once under #1; its promotion half is the mechanism #2 consumes. There is NO `gobbi-install` skill dir and NO `_claude`/`claude` skill dir — both were phantoms in iter1.)

### 1.3 Re-mapping the 4 sprints → value-features

The four current `features/{slug}/` dirs are **work-sprints**, not value-features. Each touched one or more value-features. The migration re-homes each sprint's durable artifacts into the value-feature(s) it served, and the sprint itself becomes a **session note** (already exists in `notes/` for all four — verified `notes/` listing). Mapping (from the 4 READMEs):

| Current sprint-feature | Primary value-feature | Secondary value-features touched | Evidence |
|---|---|---|---|
| `env-var-audit` | `install-runtime` | `git-workflow` (transcriptPath stamp), `workflow` (Configuration Step 1) | README: CCSI rename, SessionStart hook, `session.json.transcriptPath`. |
| `gobbi-orchestration-workflow-improvements` (Bundle A) | `workflow` | `project-memory` (T02 moment-of-capture, T04 Step 2.5), `agents` (T03), `evaluation` (T05/T06 codex) | README §"What was shipped" 1-7. |
| `session-foundations-bundle-b` | `git-workflow` | `install-runtime` (T3 subagent metadata), `agents` (delegation brief), `workflow` | README §Overview: worktree-first + subagent metadata + satellite doc aligns. |
| `session-foundations-bundle-c` | `git-workflow` | `guardrails` (gobbi-mistake-promote fix, hooks-domain tag), `project-memory` (session-lifecycle design doc), `install-runtime` | See Bundle C evidence note below. |

**Bundle C primary/secondary evidence (MED-11, strengthened).** Bundle C's README (`features/session-foundations-bundle-c/README.md`, "Shipped items T01-T07") records its work as the **no-delete + move-on-terminal archive model** (T01, → `design/archive-move-on-terminal-model.md`, a `project-memory` artifact), the **orchestration agents[] row reorder** (a git/worktree-lifecycle change → `git-workflow`), the **gobbi-mistake-promote fix + hooks-domain tag** (→ `guardrails`), and **session-lifecycle worktree-boundary** doc work (→ `git-workflow` + `project-memory`). Primary = **`git-workflow`**: the cohering thread of Bundle C is the worktree/session-lifecycle hardening (consistent with commit `82a5137 refactor(archive): no-delete + move-on-terminal archive model (#271)` and the bundle's worktree-first lineage from Bundle B). The archive model and session-lifecycle design docs are `project-memory` secondaries (durable memory-system artifacts), and the mistake-promote fix is a `guardrails` secondary. This is the weakest of the four mappings because Bundle C is genuinely cross-cutting; the primary assignment rests on the worktree-lifecycle thread being the spine, with the memory-system artifacts as the most reusable durable output — Planning should route the archive-model design doc to `project-memory` even though the sprint's primary is `git-workflow`.

**Re-home rule.** A sprint's `decisions/`, `design/`, `scenarios/`, `checklists/`, `references/`, `changelogs/`, `discussions/`, `plans/`, `backlogs/`, `mistakes/` files move into the **primary** value-feature's matching subdir unless a given file is clearly about a secondary value-feature (then it goes there). The sprint README content becomes (a) the session note (already present) plus (b) `changelogs/` entries in each touched value-feature. This is a judgment-heavy migration — Planning decomposes the per-file routing using the heuristic in §8 (LOW-16); the leader's job is the strategy (§8).

**[RATIFY-1]** The 7 value-features, their slugs, the one-liners, the corrected skill ownership map (18 canonical dirs), and the 4-sprint→value-feature mapping all need user ratification before Planning. This is the **only** remaining open [RATIFY] item. Main open lever: **granularity** — whether `guardrails` should split back into `principles` + a `mistake-learning` feature (I unite them as one capability), and whether `install-runtime` is too broad (install + bootstrap + runtime under one roof). I recommend the 7 as listed — each survives the README-features test and none names a bare mechanism.

---

## 2. The 13 per-type specs (L3/L4/L5/L6)

Each spec uses the same field order: Purpose / Hard boundary / Scope + promote-up / Naming / Frontmatter / CRUD. The shared frontmatter base (§5) is assumed in every type; only extension fields are listed per type.

> **The four feature-subdir-only template types.** Beyond the 13 project-memory types below, `memorization/templates/` ships four templates that are NOT independent project-memory types: `changelogs/`, `discussions/`, `scenarios/`, `checklists/`. They exist ONLY as `features/{f}/` subdirs, governed by the §2.1 feature rules (scope = the feature; created via the feature's lazy bootstrap; promoted by Wrap-up). Their lightweight specs are in §2.14 so that all 17 templates have a §2 anchor and §7 #8 is actionable for every template.

### 2.1 `features/`
- **Purpose.** A durable product value-feature of gobbi (L1) — a capability the README "Features" section would list. The directory is the unit; its `README.md` is the value-feature overview, and its subdirs (`decisions/ design/ scenarios/ checklists/ references/ discussions/ backlogs/ plans/ changelogs/ mistakes/`) hold value-feature-scoped knowledge.
- **Hard boundary.** A feature is a **noun naming a lasting user-facing value**, never a verb naming a sprint, and never a bare internal subsystem. Decision rule: *"Would this name appear as a bullet in gobbi's README features list, and still describe gobbi in a year independent of any one PR?"* Yes → feature. "Did we do X in session Y?" → that is a `notes/` entry, not a feature. If a candidate maps 1:1 to a single skill file (a mechanism), it is too fine — fold it under the value-feature it serves.
- **Scope.** The feature directory IS its own tier. **Frontmatter reconciliation (HIGH-5a):** a feature README's base `scope` is `feature` and its base `feature` field names *itself* (the README is the feature's identity document, so it is feature-scoped to its own slug). The earlier "not project/feature-tagged" phrasing is dropped as contradictory with the §5 base — a feature README carries the base like every other memory file; its `scope: feature` + `feature: {own-slug}` simply self-reference. Coarse value-features only (~6-8). New features are created only by user-ratified value-feature addition, not by sprints.
- **Naming.** Bare-slug (evergreen), kebab, developer-subsystem vibe, 1-3 words, ≤~35 chars. Example: `workflow`, `evaluation`, `git-workflow`. Forbidden: sprint/version/date slugs, marketing-adjective slugs, bare-mechanism slugs (`delegation-system`).
- **Frontmatter** (on `README.md`): base + `value_proposition` (the one-liner), `subsystems` (list of skills/paths this value-feature owns), `status: active|retired`. Drop the current sprint-only keys (`pr`, `commit`, `head-commit`, `first-session`, `last-session`) from the README frontmatter — those belong in `changelogs/` entries, not the value-feature identity.
- **CRUD.** Create: user ratifies a new value-feature. Read: Ideation Sub-step A (overlap detection), any agent needing value-feature context. Update: Wrap-up appends to README's Recent-activity table (cap 20) + bootstraps subdirs lazily. Terminal: `status: retired` → move dir per move-on-terminal (`design/archive-move-on-terminal-model.md` § Move procedure).

### 2.2 `notes/`
- **Purpose.** The project's chronological development journal — one entry per session capturing the work-log narrative (L2; `templates/notes.md`).
- **Hard boundary vs decisions vs design.** `notes/` = the *running narrative of work* ("what happened this session"). `decisions/` = the *conclusion* ("we chose X over Y, here's why"). `design/` = the *architecture* ("how the thing is built"). A note may *link to* decisions/design it produced but never restates them. Test: if removing the date makes the content still true and reusable, it is not a note — it is a decision/design/learning.
- **Scope.** **Project-only** (L4). No `features/{f}/notes/` tier — feature-specific narrative is summarized in the session note and cross-linked from the feature README's activity table (`templates/notes.md` §Location).
- **Naming.** Date-prefixed `YYYY-MM-DD-{slug}` (time-indexed). Slug = session's dominant theme, ≤6 words. Example: `2026-05-25-memory-system-redesign-ideation.md`.
- **Frontmatter.** base + `session` (the session id), `features_touched` (list of value-feature slugs this session promoted into — the L2 link).
- **CRUD.** Create: Wrap-up Step 6, one per session. Read: next session's Ideation for recent context. Update: never (immutable journal). Terminal: optional opt-in archive when session dir is archived (`archive-move-on-terminal-model.md` § Terminal-state vocabulary).

### 2.3 `decisions/`
- **Purpose.** ADR-style records: what was decided, why, alternatives considered (`templates/decisions.md`).
- **Hard boundary.** vs `design/`: a decision is a *single choice with a rationale* (one record = one concept, L5); a design is the *multi-part architecture* the choices add up to. vs `notes/`: a decision is timeless-once-made; a note is dated narrative. vs `backlogs/`: a decision is settled; a backlog is deferred-open. **Anti-pattern killed (L5 atomicity):** loop-phase bundle files (`ideation-decisions.md`, `iter1-user-redirects.md` — seen in `features/gobbi-orchestration-workflow-improvements/decisions/`) are FORBIDDEN; split into one file per decision.
- **Scope.** Both (L4). Default feature-level (`features/{f}/decisions/`). Promote-up trigger: the decision sets a *project-wide convention or repo-level policy* that constrains other features → `decisions/` at project root (user-confirm via AskUserQuestion at Wrap-up).
- **Naming.** Date-prefixed `YYYY-MM-DD-{slug}`. Slug names the decision, ≤6 words. Example: `2026-05-25-drop-sqlite-for-json-memory.md`.
- **Frontmatter.** base + `supersedes` / `superseded_by` (extension), `decision_status: proposed|accepted|superseded` (a documented refinement of the base `status` — see §5.2 MED-6).
- **CRUD.** Create: Ideation/Planning/Execution MEMORIZATION stages to `staging/decisions/`; Wrap-up promotes. Read: Ideation overlap, any agent. Update: a later decision supersedes (frontmatter pair). Terminal: `superseded` → move to `archive/decisions/` (`archive-move-on-terminal-model.md` § Terminal-state vocabulary).

### 2.4 `design/`
- **Purpose.** Long-form "what we're building and why", concrete enough to plan against, abstract enough to outlive one session (`templates/design.md`).
- **Hard boundary.** vs `decisions/`: design is the *structure*; a decision is *one fork in the road within it*. A design doc may cite many decisions. vs `notes/`: design is evergreen architecture; notes are dated. **Fix the ad-hoc-key drift:** `design/session-lifecycle-worktree-boundaries.md` uses bare `title/status/feature/related` — migrate to the base schema (`type: design`).
- **Scope.** Both (L4). Default feature-level. Promote-up: cross-feature architecture (e.g., the archive model spans all types) → project `design/` (user-confirm).
- **Naming.** **Bare-slug** (evergreen — L5 temporal split puts design in the bare-slug set). Example: `archive-move-on-terminal-model.md` (already compliant). Forbidden: version/date in slug.
- **Frontmatter.** base + `supersedes` / `superseded_by`, `related` (list of related design/decision paths).
- **CRUD.** Create: Ideation MEMORIZATION (idea spec) / Planning (follow-on). Read: Planning, Execution, future Ideation. Update: supersede via new file + frontmatter pair. Terminal: `superseded` → `archive/design/`.

### 2.5 `mistakes/`
- **Purpose.** Recurring failure patterns — "looks like it should work but reliably breaks" + the correct approach. Highest-value memory (`templates/mistakes.md`; CLAUDE.md mistake mandate).
- **Hard boundary vs rules vs learnings.** **mistakes** = a *failure mode to avoid* ("doing X breaks because Y"). **rules** = an *enforceable invariant* ("X must always be done this way, period") — stronger than a mistake. **learnings** = a *positive capability gained* ("we now know how to do Z better"). Decision tree: Did something break? → mistake. Must we forbid/mandate a behavior going forward? → rule. Did we get better at something with no failure attached? → learning.
- **Scope.** Both (L4). Default project-level (mistakes usually transcend one feature). Feature-scope when the trap is value-feature-specific → `features/{f}/mistakes/`.
- **Naming.** Bare-slug (evergreen). Slug names the trap, ≤6 words. Example: `executor-mirror-path-vs-worktree-physical-copy.md` (already compliant — and note this mistake is about *worktree branch-isolation of canonical files*, NOT about the `.claude↔.gobbi` symlink mirror). Forbidden: finding-ID prefix.
- **Frontmatter.** base + `priority: critical|high|medium|low`, `domain` (e.g., `process`, `hooks`), `supersedes`/`superseded_by`. **`mistake-candidate` is a staging-only flag and MUST be stripped on promotion** (L6) — currently retained on **17 of 21** mistake files (verified `grep -rl mistake-candidate .gobbi/projects/gobbi/mistakes/` = 17; total `.md` = 21), a migration target (§8).
- **CRUD.** Create: moment-of-capture during WORK → `staging/decisions/{slug}.md` with `mistake-candidate: true`; Wrap-up promotes to `mistakes/` and strips the flag. Read: every agent at task start (P1 of mistake skill). Update: refine in place; supersede only when the trap changes. Terminal: `superseded` ONLY (an active mistake NEVER moves — `archive-move-on-terminal-model.md` § Terminal-state vocabulary).

### 2.6 `rules/`
- **Purpose.** Load-bearing project-wide behavioral/structural invariants every agent must follow (`templates/rules.md`).
- **Hard boundary.** vs mistakes: see §2.5. A rule is rarer and stronger; it is referenced by skills/agents/CLAUDE.md. If you can phrase it as "don't repeat this failure", it is a mistake; if it is "this is the law here", it is a rule. (The "two different rules things" disambiguation now lives at its source in §4 — the project-memory `rules/` TYPE here is distinct from the `memorization/rules.md` SKILL doc.)
- **Scope.** **Project-only** (L4; no feature-scoped rules tier — `templates/rules.md` §Location).
- **Naming.** Bare-slug, imperative. Example: `stub-redirect-format.md` (compliant).
- **Frontmatter.** base + `priority`, `established` (date), `supersedes`. **RESOLVED (was [RATIFY-2]):** the live `rules/stub-redirect-format.md` body says *"No frontmatter: the project uses plain markdown … frontmatter syntax is forbidden"* (verified, the file has none). L6 mandates base frontmatter on every memory file. **User decision — L6 wins:** base frontmatter IS added to every memory file, the rule file included. The rule's *content prohibition* is **rescoped to stub-redirect TARGET docs only** (the published `.claude/` redirect stubs), NOT to project-memory files. Two coupled edits: (a) add base frontmatter to `rules/stub-redirect-format.md`; (b) reword that rule's "No frontmatter" clause to scope it to stub-redirect targets. **The frontmatter standard's canonical home is the Memorization skill's `memorization/rules.md` sibling** (see §4) — cross-referenced from `memory-map.md` (§7 propagation reflects this). Settled; no longer [RATIFY].
- **CRUD.** Create: Wrap-up direct write, user-confirmed (no staging path; `templates/rules.md` §Lifecycle). Read: every agent. Update: supersede with user confirm. Terminal: `superseded` → `archive/rules/`.

### 2.7 `learnings/`
- **Purpose.** Cross-cutting positive insights gained through experience — "what we now know how to do better" (`templates/learnings.md`).
- **Hard boundary.** vs mistakes (failure) vs references (external source): a learning is *internally-derived know-how with no failure attached*. vs design/decisions: a learning is *transferable across features*; a feature-specific insight belongs in that feature's `design/` or `decisions/`.
- **Scope.** **Project-only** (cross-cutting by definition — `templates/learnings.md` §Location).
- **Naming.** Bare-slug (timeless). **Anti-pattern killed:** `learnings/f-aes-01-locked-wording-supersedes-readability-nit.md` uses a finding-ID prefix (FORBIDDEN, L5) — rename to e.g. `locked-wording-supersedes-readability-nit.md` (§8).
- **Frontmatter.** base + `supersedes`/`superseded_by`. Drop ad-hoc `discovered`/`promoted-from`/`promoted-at` keys → fold into base `created` + `session` (RATIFY-5 resolved — drop `promoted-from`/`promoted-at`).
- **CRUD.** Create: any loop MEMORIZATION stages to `staging/learnings/`; Wrap-up promotes. Read: future Ideation. Update: supersede. Terminal: `superseded` → `archive/learnings/`.

### 2.8 `backlogs/`
- **Purpose.** Deferred work items — features/tasks identified but intentionally not-now (`templates/backlogs.md`).
- **Hard boundary vs plans.** **backlog** = a *single deferred item awaiting scheduling* (open, unscheduled). **plan** = an *ordered task decomposition for work being done now* (active, sequenced). A backlog item, when picked up, becomes the input to a plan; it is never itself a plan. Test: "is this scheduled into ordered tasks?" No → backlog; Yes → plan.
- **Scope.** Both (L4). Feature-scope deferrals → `features/{f}/backlogs/`; project-scope (deferred features / cross-feature tasks) → project `backlogs/`. The staging tree already splits `backlogs/{feature,project}/` (`memorization/SKILL.md`, staging-subtree section).
- **Naming.** **Bare-slug** (L5 temporal split places backlogs in bare-slug set — they are evergreen-until-closed; the date lives in frontmatter). **Anti-pattern killed:** the **5** `item-N-M-` positional prefixes in project `backlogs/` (verified — see §8 cat B for the full list) are FORBIDDEN (L5) — rename to concept slugs (§8).
- **Frontmatter.** base + `priority`, `disposition: open|deferred` (a documented refinement of base `status` — see §5.2 MED-6), `project-scope: true|false`, `shipped_in` (on close).
- **CRUD.** Create: MEMORIZATION stages deferrals; Wrap-up promotes. Read: Ideation Sub-step A (confirm not already deferred). Update: re-prioritize. Terminal: `shipped|closed|addressed|dropped` → move to `archive/backlogs/` (`archive-move-on-terminal-model.md` § Terminal-state vocabulary; the 8 archived backlogs already follow this (verified count)).

### 2.9 `references/`
- **Purpose.** External prior-art sources confirmed during research (`templates/references.md`).
- **Hard boundary.** vs learnings (internal know-how) vs design (our architecture): a reference is an *external source* (URL/doc/library) with an extracted insight and why-it-applies. If there is no external source, it is not a reference.
- **Scope.** Both (L4). Default feature-level (research happens inside a feature's Ideation). Promote-up: cross-feature prior art → project `references/` (rare, user-confirm).
- **Naming.** Bare-slug (evergreen). Example: `claude-code-hooks-lifecycle.md`.
- **Frontmatter.** base + `title`, `source` (URL/citation), `accessed` (date), `ref_type`.
- **CRUD.** Create: leader writes to `rawdata/research/` during WORK; MEMORIZATION promotes to `staging/references/` (`memorization/SKILL.md`, staging-subtree section); Wrap-up promotes to feature. Read: Ideation/Planning design rationale. Update: rare. Terminal: `superseded` → `archive/references/`.

### 2.10 `plans/`
- **Purpose.** Ordered task decompositions produced by the Planning loop (`templates/plans.md`).
- **Hard boundary vs backlogs.** See §2.8. A plan is *now-active, ordered, with verification per task*; a backlog item is *deferred-open*.
- **Scope.** **Feature-only for the loop path (HARD — HIGH-4).** The loop path writes plans ONLY to `features/{f}/plans/` (per L4's "some types feature-only (plans)"). **RESOLVED (was [RATIFY-3]):** there is no project-level loop write of plans. A project-level `plans/` directory MAY exist for **maintainer-authored cross-feature roadmaps / release plans** (`memory-map.md` § Project-wide tiers), but it is explicitly **NOT loop-written** — no Planning-loop MEMORIZATION or Wrap-up promotion ever targets project `plans/`. If this maintainer surface is judged unnecessary, it may be dropped entirely; the loop contract does not depend on it.
- **Naming.** Date-prefixed `YYYY-MM-DD-{slug}` (a plan is intrinsically tied to the session that produced it — `memory-map.md` § Project-wide tiers / Templates index). Project-level maintainer roadmaps follow the same date-prefixed rule.
- **Frontmatter.** base + `supersedes`/`superseded_by`, `task_count`.
- **CRUD.** Create: Planning MEMORIZATION → `planning/staging/plans/`; Wrap-up promotes to `features/{f}/plans/{date}-{slug}.md` (loop path, feature-only). Read: Execution. Update: supersede on re-plan. Terminal: `superseded` → `archive/plans/`. (Project-level maintainer roadmaps: created/updated by the maintainer directly, never by a loop.)

### 2.11 `reviews/`
- **Purpose.** Result documents of review/evaluation/audit *activities* — adversarial review, ultrareview, code review, retrospective, security/license/dep audit (`templates/reviews.md`).
- **Hard boundary vs reports (sharpened — MED-7).** **reviews** = "a review/audit/evaluation *activity* took place; this is its result". **reports** = `status` summaries / `post-mortem` investigations / `analytics` outputs that are NOT themselves review activities. Sharp tests: a security *audit* → reviews (audit activity); a *post-mortem of a security incident* → reports (investigation, not a review activity); a *weekly status that cites review outcomes* → reports. **Retrospective edge:** a retrospective that is itself a *review activity over the work* (e.g., "we reviewed how the campaign went, finding-by-finding") → **reviews**; a retrospective that is a *periodic status/summary roll-up* with no review-activity ("here is where the project stands at quarter-end") → **reports**. Disambiguator: "Did someone *conduct a review/evaluation as the activity*?" Yes → reviews. "Is this a periodic summary of state?" → reports.
- **Scope.** **Project-only** (review activities are cross-cutting; feature outcomes cited from the feature README — `templates/reviews.md` §Location).
- **Naming.** Date-prefixed `YYYY-MM-DD-{slug}`; slug = review subject + kind. Example: `2026-05-24-execution-task-01-dual-system-eval.md` (compliant).
- **Frontmatter.** base + `verdict` (extension, L6), `review_kind` (adversarial|code|audit|retrospective), `subject`.
- **CRUD.** Create: a loop whose work *was* a review stages to `staging/reviews/`; Wrap-up promotes. Read: future audits. Update: append-only history (supersede via `status:`, move only if maintainer trims — `archive-move-on-terminal-model.md` § Recovery / Why no-delete stays). Terminal: optional maintainer move.

### 2.12 `reports/`
- **Purpose.** Long-form documents in three kinds via `report_type`: `status` (periodic summaries), `post-mortem` (incident/investigation), `analytics` (measurement output) (`templates/reports.md`).
- **Hard boundary vs reviews.** See §2.11. vs notes: a note is a short per-session journal entry; a report is a standalone long-form document meriting its own date-prefixed file with lasting cross-session value. vs decisions: a decision is one conclusion; a report is the full reasoning/measurement trail.
- **Scope.** **Project-only** (`templates/reports.md` §Location).
- **Naming.** Date-prefixed `YYYY-MM-DD-{slug}`. Example: `2026-05-25-iter-cap-exhaustion-postmortem.md`.
- **Frontmatter.** base + `report_type: status|post-mortem|analytics`, `related_reports` (list).
- **CRUD.** Create: any loop's deep-dive stages to `staging/reports/`; Wrap-up promotes; `status` reports authored directly by Wrap-up at period boundaries. Read: maintainer/audit. Update: append-only. Terminal: optional maintainer move. **`reports/` empty-OK [AUTO]:** the audit found zero reports — that is fine; the type is valid-but-unused, not a defect.

### 2.13 `archive/`
- **Purpose.** Holds full moved files that reached a terminal state (no-delete + move-on-terminal — `design/archive-move-on-terminal-model.md`). NOT pointers/index stubs (the index model is retired).
- **Hard boundary.** archive is **not a content type and not a `type` enum value** — it is a *lifecycle DESTINATION* for any other type once terminal. **HIGH-5b:** an artifact under `archive/{type}/` keeps its ORIGINAL `type` in frontmatter (`type: decisions`, `type: backlogs`, …) and gains the archive fields (`archived_at`, `archive_reason`); it does NOT get `type: archive`. Consequently `archive` is REMOVED from the §5.1 base `type` enum (see §5.1). The directory name `archive/` is the lifecycle marker; the `type` field never changes on a move.
- **Scope.** Project-only, organized by **typed subdirs** `archive/{type}/` (the design doc + live tree win over the memory-map's flat-slug description — **[AUTO]**, resolves the audit's contradiction #2; the live tree already uses `archive/backlogs/`, `archive/notes/`).
- **Naming.** Date-prefixed `archive/{type}/{YYYY-MM-DD}-{slug}.md` where date = archive date (`archive-move-on-terminal-model.md` § Move procedure). Live tree compliant.
- **Frontmatter.** original type's base (with the file's ORIGINAL `type`) + `archived_at` (date), `archive_reason: shipped|closed|addressed|superseded|retired|dropped|abandoned`, plus terminal `status:` + (`superseded_by:` | `shipped_in:`).
- **CRUD.** Create: Wrap-up moves a terminal file here (`git mv`). Read: history/recovery. Update: none. Delete: NEVER. Recovery: user-confirmed `git mv` back (`archive-move-on-terminal-model.md` § Recovery).

### 2.14 Feature-subdir-only template types (HIGH-3) — `changelogs/`, `discussions/`, `scenarios/`, `checklists/`

These four are NOT independent project-memory types; they are `features/{f}/` subdirs governed by §2.1's feature rules. Lightweight specs (purpose / scope / naming / frontmatter delta):

- **`changelogs/`** — Time-stamped records of *what shipped* (per `templates/changelogs.md`): each entry summarizes an Execution task's or a session's outcome inside the feature it touched. **Scope:** feature-subdir-only. **Naming:** date-prefixed `YYYY-MM-DD-{slug}` (it is in the §4.2 date-prefixed set). **Frontmatter:** base + `shipped_in` (PR/commit). CRUD: Wrap-up appends a changelog entry to each value-feature a session touched (this is where the retired sprint-README `pr`/`commit` keys land).
- **`discussions/`** — Summaries of substantive DISCUSSION-phase exchanges with the user that resolved an ambiguity / set a constraint / shifted direction (per `templates/discussions.md`). **Scope:** feature-subdir-only. **Naming:** date-prefixed `YYYY-MM-DD-{slug}` (a discussion is tied to the session that held it). **Frontmatter:** base + `session`. CRUD: staged from a loop's `staging/discussions/`, promoted by Wrap-up into the touched feature.
- **`scenarios/`** — Feature-level enumeration of situations the feature must handle — golden paths, edge cases, failure modes (per `templates/scenarios.md`). **Scope:** feature-subdir-only (accumulated across sessions). **Naming:** bare-slug (evergreen — the scenario set is durable; it is in the §4.2 bare-slug set). **Frontmatter:** base. CRUD: appended by Ideation MEMORIZATION via `staging/scenarios/`.
- **`checklists/`** — Feature-level implementation checklists, each item anchored to a scenario + a reference insight or marked `novel` (per `templates/checklists.md`). **Scope:** feature-subdir-only. **Naming:** bare-slug (evergreen). **Frontmatter:** base. CRUD: appended alongside scenarios.

---

## 3. Session-memory spec

### 3.1 Canonical session tree

```
sessions/{date}-{session-id}/
├── session.json              ← per-session telemetry (manager init + assistant UPSERT)  [CANONICAL]
├── settings.json             ← resolved session config (cascade)                          [CANONICAL]
├── session.json.lock         ← advisory lock guarding concurrent session.json writes      [CANONICAL — document it]
└── {loop}/                   ← loop ∈ ideation | preparation | planning | execution | wrap-up
    ├── rawdata/
    │   ├── draft-iter{n}.md
    │   ├── transcript-iter{n}.jsonl
    │   ├── discussion-log.md
    │   └── research/{slug}.md         ← leader research externals (WORK)
    ├── staging/{scenarios,checklists,decisions,references,design,discussions,
    │            backlogs/{feature,project},reviews,reports,changelogs,learnings,notes}/
    │   └── (planning only) plans/
    ├── evaluation/
    │   └── iter{n}/{claude,codex}/{perspective}.md   + overall.md
    └── artifacts/{free-filename}.md   ← PASS-only
```

### 3.2 Per-task Execution layout (canonical)

```
execution/
├── staging/{...}/            ← loop-level staging (cross-task)
└── task-{NN}/
    ├── rawdata/draft-iter{n}.md, transcript-iter{n}.jsonl
    ├── staging/{...}/
    ├── evaluation/iter{n}/{claude,codex}/{perspective}.md + overall.md
    └── artifacts/{free-filename}.md
```
Every task gets the full `{rawdata,staging,evaluation,artifacts}` quartet. **Deviation to fix:** in `2026-05-24-45388fa9` `task-01`/`task-02` have ONLY `evaluation/` (no rawdata/staging/artifacts) — incomplete task layout; canonical requires the quartet (or a documented reason if a task is eval-only).

### 3.3 Per-perspective evaluation file naming (canonical) — resolves audit clutter

Canonical: `evaluation/iter{n}/{system}/{perspective}.md` where `{system} ∈ {claude, codex}` and `{perspective}` is the **bare** perspective name from the fixed 7-vocab: `project`, `structure`, `performance`, `aesthetics`, `usage`, `consistency`, `risk`, plus `overall.md` (per `memory-map.md` § Per-loop subtree).

**Deviations to fix (verified in `2026-05-24-45388fa9/planning/evaluation/iter1/`):**
- Claude side uses `pN-`-prefixed names (`p1-project.md`, `p2-structure.md`) — the `pN-` prefix is non-canonical positional noise; standardize to bare `project.md`, `structure.md`.
- Codex side uses a DIFFERENT perspective vocabulary (`p3-scope.md`, `p4-specificity.md`) — divergent from the 7-vocab; must align to the same 7 perspective names so cross-system reconciliation can pair files 1:1.
- Codex side has a `codex-prompt.md` artifact inside `evaluation/iter{n}/codex/` — relocate to `rawdata/` (it is an input prompt, not a per-perspective evaluation output).

### 3.4 Non-standard subdirs — disposition

| Observed | Path / count | Disposition |
|---|---|---|
| `wrap-up/evaluation/followups/` | `2026-05-24-45388fa9` | **Non-canonical.** Follow-ups are findings → route to `staging/decisions/` (deferred) or `staging/backlogs/`. Remove the ad-hoc dir; migrate contents to staging. |
| `planning/rawdata/restore/` | two sessions | **RESOLVED (was [RATIFY-4]): fold into `rawdata/`.** Not sanctioned as a separate sub-scratch tier; any resume/restore scratch lives directly in `rawdata/`. |
| `state.json` at session root | **5 sessions** (verified `find sessions -name state.json` = 5) | ~~**Legacy.** MEMORY.md (PR-FIN-2a-iii) records `state.json` was retired in favor of `session.json`. Treat all 5 as stale artifacts to be cleaned (going-forward + opportunistic, RATIFY-7), NOT documented as canonical.~~<br>**CORRECTION 2026-05-26 (user-ratified):** This disposition was a MISREAD and is RETRACTED. The live workflow state-machine `state.json` (Step-1 row-5.5-initialized from `templates/state.template.json`, manager-updated every transition, drives `/clear` recovery + the Workflow Status Display projection) is RETAINED as canonical. The "retired" disposition referred only to the OLD SQLite-era `state.json` retired in PR-FIN-2a-iii; the current markdown-driven architecture RE-INTRODUCED `state.json` as the state-machine file. `session.json` (per-session telemetry) is NOT a replacement for it. `orchestration/SKILL.md`'s `state.json` handling is correct and unchanged. |
| `HANDOFF.md` (uppercase, root) | **2 sessions** (`2026-05-23-1b26cf20`, `2026-05-24-45388fa9` — verified) | **Non-canonical.** The handoff lives at `wrap-up/artifacts/handoff.md` (`wrap-up/SKILL.md` § handoff artifact). The root uppercase files are deviations; migrate/remove (opportunistic). |
| `.git/` at session root | worktree sessions | Worktree session git dir — expected in worktree mode; not memory, leave. |

### 3.5 Root-file documentation (fill the audit gap)
- `session.json` — per-session telemetry; manager init, assistant UPSERT (`memory-map.md` § Session root). Canonical.
- `settings.json` — resolved config via cascade (`memory-map.md` § Session root). Canonical.
- `session.json.lock` — advisory write-lock; UNDOCUMENTED in memory-map. **Add a row** documenting it (created/released by the manager around session.json writes; safe to ignore on read).

---

## 4. The memory-rules home — `memorization/rules.md` sibling (L5/L6) — RESOLVED (was [RATIFY-6])

**Home decision (RATIFY-6 — user decided).** The naming convention, the structure rules, the frontmatter standard, and other rules about how memory works are **consolidated in a single sibling doc `memorization/rules.md`**, cross-referenced from `memorization/memory-map.md`. NOT a separate `naming.md`, and NOT an inline section inside memory-map.md. Rationale: the memory rules (naming + frontmatter + structure) are a self-contained, frequently-cited reference; one consolidated `rules.md` keeps `memory-map.md` focused on the type map and lets agents link straight to the rules.

> **CRITICAL disambiguation — three different "rules" things (LOW-15, moved here to its source).** (1) `memorization/rules.md` is a **SKILL doc** documenting *how memory works* (naming convention, frontmatter standard, structure rules). (2) `memorization/templates/rules.md` is a **TYPE TEMPLATE** — the authoring template for files of the `rules/` memory type. (3) The project-memory `rules/` **TYPE** (`.gobbi/projects/{name}/rules/`, §2.6) holds behavioral invariants. Three distinct things, two of them sharing the filename `rules.md` at different paths. Future agents MUST NOT conflate them: `memorization/rules.md` (the how-memory-works reference) ≠ `memorization/templates/rules.md` (the rules-type template) ≠ `rules/` (the behavioral-invariant memory type). The §7 propagation table keeps all three paths distinct.

**No mirror doubling.** `memorization/rules.md` is authored ONCE in the canonical tree (`.gobbi/projects/gobbi/skills/memorization/rules.md`); its `.claude/skills/memorization/rules.md` symlink is created alongside the existing `SKILL.md` / `memory-map.md` symlinks so the workspace surface resolves it. One real file, one symlink — not two copies.

`memorization/rules.md` consolidates three rule-sets: §4.1-4.3 below (naming standard), §5 (frontmatter standard), and the structure rules (the per-type scope/temporal-split conventions that thread through §2). The naming standard (§4.1-4.3) is reproduced here as the authoritative content the sibling doc carries.

### 4.1 Naming rules
1. **Directory = category.** The type directory IS the controlled-vocabulary facet. Never repeat the dir/type in the filename (`naming-research-synthesis.md` principle 2).
2. **Filename = atomic concept slug.** kebab-case, lowercase, hyphens only, **≤6 words, ≤~35 chars** (MED-9 — unified). ONE record = ONE concept (no bundle files).
3. **Length proportional to sibling count, inverse to path specificity** — narrow dir → shorter slug.
4. **Status/lifecycle never in the filename** — it lives in frontmatter, so transitions never force a rename.
5. **Stable address ≠ mutable description** — once created, a slug is not renamed for wording polish; supersede via frontmatter + new file.

### 4.2 Temporal split table

| Mode | Types | Filename pattern |
|---|---|---|
| **Date-prefixed** (intrinsically time-indexed) | notes, reviews, reports, changelogs, decisions, plans, discussions, archive entries | `YYYY-MM-DD-{slug}.md` |
| **Bare-slug** (evergreen; date in frontmatter) | features, mistakes, rules, learnings, design, references, backlogs, scenarios, checklists | `{slug}.md` |

(Mirrors L5 exactly for the 13 types. The four feature-subdir-only types §2.14 are slotted by the same rule: `changelogs`/`discussions` are date-prefixed; `scenarios`/`checklists` are bare-slug.)

### 4.3 Slug anti-pattern blocklist (FORBIDDEN in any slug)

| # | Forbidden | Bad example (live) | Fix |
|---|---|---|---|
| 1 | loop/phase prefix | `ideation-decisions.md` | one file per decision, concept slug |
| 2 | finding-ID prefix | `f-aes-01-locked-wording-…` | `locked-wording-supersedes-readability-nit` |
| 3 | item/task/step positional | `item-1-2-skill-loading-discipline` | `skill-loading-discipline` |
| 4 | restating the parent dir | `gobbi-install-…` inside `features/gobbi-install/` | drop the prefix |
| 5 | status words | `final-`, `locked-`, `approved-` | status → frontmatter |
| 6 | version numbers | `v2-`, `schema-v5-` | version → frontmatter |
| 7 | date in an evergreen slug | `2026-…-design.md` in `design/` | date → frontmatter |
| 8 | wording excerpts of a finding | `concern-3-coverage-ownership-cell-text` | name the concept |
| 9 | person/author names | — | omit |
| 10 | opaque auto-IDs | — | add human component |
| 11 | bundled-scope (many topics, one file) | `iter1-user-redirects.md` | split per topic |
| 12 | uninformative generics | `misc-`, `common-`, `helper-`, `notes.md` | describe the concept |

---

## 5. The frontmatter standard (L6) — home: `memorization/rules.md` sibling

**Home decision (RESOLVED).** The frontmatter standard lives in the consolidated **`memorization/rules.md` sibling** (§4) alongside the naming + structure rules, and `memorization/SKILL.md` carries the staging-field-stripping *mechanism* (§7 propagation reflects both). This is the reciprocal of the RATIFY-2 resolution: every memory file (the `rules/` type file included) carries base frontmatter, and the consolidated memory-rules doc owns the standard.

### 5.1 Shared base (every memory file)

```yaml
---
name: {slug or short title}
description: {one-line what-this-is}
type: features|notes|decisions|design|mistakes|rules|learnings|backlogs|references|plans|reviews|reports
scope: project | feature
feature: {value-feature slug — required when scope=feature (a feature README self-references its own slug); null when scope=project and not feature-bound}
status: {type-appropriate lifecycle value — see §5.2}
created: YYYY-MM-DD
session: {session-id that created this}
tags: [{...}]
---
```

**HIGH-5b — `archive` is NOT in the `type` enum.** The enum above lists the 13 content types; `archive` is omitted deliberately. An archived file keeps its original `type` value (e.g., `type: decisions`) and lives under `archive/decisions/`; the directory, not the `type` field, marks it archived (§2.13). The four feature-subdir-only types (§2.14) reuse the base with `type` set to their own name (`changelogs`/`discussions`/`scenarios`/`checklists`) and `scope: feature`.

### 5.2 Per-type extension fields (summary) + the status model (MED-6)

**Status model (MED-6, resolved — one model, documented).** Base `status` is the **authoritative generic lifecycle field** present on every file. Where a type needs richer lifecycle vocabulary, the type-specific field (`decision_status` for decisions, `disposition` for backlogs) is a **documented refinement that mirrors and narrows the base `status`** for that type — it is not a competing lifecycle. Rule: base `status` always carries the coarse state (`active` / `superseded` / `archived` / `shipped` …); the type-specific field, when present, is the fine-grained value the type's CRUD references (e.g., a decision with `status: superseded` carries `decision_status: superseded`; a backlog with `status: active` carries `disposition: open|deferred`). They never disagree; the type-specific field is the one the type's lifecycle text cites, and base `status` is the cross-type-uniform field tools read.

| Type | base `status` values | Extensions on top of base |
|---|---|---|
| features (README) | `active`, `retired` | `value_proposition`, `subsystems` |
| notes | `active` (immutable) | `features_touched` |
| decisions | `active`, `superseded` | `supersedes`, `superseded_by`, `decision_status: proposed\|accepted\|superseded` |
| design | `active`, `superseded` | `supersedes`, `superseded_by`, `related` |
| mistakes | `active`, `superseded` | `priority`, `domain`, `supersedes`, `superseded_by` |
| rules | `active`, `superseded` | `priority`, `established`, `supersedes` |
| learnings | `active`, `superseded` | `supersedes`, `superseded_by` |
| backlogs | `active`, `closed` | `priority`, `disposition: open\|deferred`, `project-scope`, `shipped_in` |
| references | `active`, `superseded` | `title`, `source`, `accessed`, `ref_type` |
| plans | `active`, `superseded` | `supersedes`, `superseded_by`, `task_count` |
| reviews | `active` (append-only) | `verdict`, `review_kind`, `subject` |
| reports | `active` (append-only) | `report_type`, `related_reports` |
| archive (destination, not a type) | terminal `status` of the original type | original type's fields + `archived_at`, `archive_reason` |

### 5.3 Staging-field stripping on promotion (L6)

Staging-only fields exist during the session and MUST be stripped when Wrap-up promotes to project memory:
- `mistake-candidate: true` — stripped; its *presence* is what routes the file to `mistakes/` (`wrap-up/SKILL.md` § promotion routing), after which it has done its job. (Currently retained on 17/21 mistakes — migration target.)
- `finding-id`, `disposition` (when used purely as eval routing), `promoted-from`, `promoted-at` — these are session-provenance. **RESOLVED (was [RATIFY-5]): DROP `promoted-from` and `promoted-at`.** `git log` + the base `session` field already carry provenance; the extra keys are redundant ad-hoc drift. Fold any durable provenance into base `session` + `created`; strip the rest.

Mechanism: Wrap-up's promotion step reads the staging frontmatter, applies the routing modifier, then writes the destination file with ONLY base + that type's extension fields (a frontmatter allowlist per type). This belongs in the propagation edits to `wrap-up/SKILL.md` (§7).

---

## 6. Principle #13 — full text for `principles/SKILL.md` (L7)

To be added as a new `## Principle 13` section matching the existing format (Iron Law / Why / procedure / Anti-rationalizations / Mechanism), and a new row in the Iron Law Index table (`principles/SKILL.md` § Iron Law Index), and the CLAUDE.md Iron Law table.

---

```markdown
## Principle 13 — Spec + CRUD-Think for Documentation Work

**Iron Law:** NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN.

**Why:** Documentation changes fail in a characteristic way: an agent opens a file, edits the
passage in front of it, and never asks what the doc is *for*, which memory *type* it is, what it
should and should not contain, or which *other* files the same change must touch. The result is
type-confused content (a decision written as a note), half-applied co-updates (a new principle
added to principles/SKILL.md but not to the CLAUDE.md Iron Law table), and silent drift (the spec
in one file contradicts another). A documentation task is a *change with a blast radius*, not a
single edit. Before touching any file, the agent fixes two things in writing: the SPEC (what the
doc work must achieve and the type of each affected file) and the CRUD plan (every Create / Read /
Update / Delete operation at file / directory / **line** granularity). This is the change-scoping
lens — not a per-document lifecycle attribute.

**Procedure — before any documentation change:**

1. **Write the SPEC.** State, in 2-5 lines: (a) what the doc task must achieve; (b) for each
   affected file, which memory *type* it is and what it should / should-not contain; (c) the
   adjacent types this content must NOT bleed into (apply the type boundaries in
   `memorization/memory-map.md` and the conventions in `memorization/rules.md`).
2. **Enumerate the CRUD plan.** List every operation the task entails at file / dir / **line**
   granularity:
   - **Create** — new files/dirs (with path + type + naming-rule compliance).
   - **Read** — files consulted for context or consistency (so the change stays coherent with them).
   - **Update** — existing files + the specific lines/sections changed.
   - **Delete** — never a physical delete of project memory (supersede + move-on-terminal); for
     `.claude/` docs, the explicit lines/files removed.
3. **Check the blast radius — find every file the SAME change must co-touch.** A doc change is
   rarely one file. The CRUD plan MUST enumerate genuine multi-file co-updates, for example:
   - A new principle → `principles/SKILL.md` body + the `principles/SKILL.md` Iron Law Index table
     + the CLAUDE.md Iron Law table (three places, one change).
   - A new memory convention → `memorization/rules.md` + the affected `memorization/templates/*`
     + `memorization/memory-map.md` cross-reference.
   - A canonical skill that is mirror-symlinked: edit the worktree-absolute CANONICAL file under
     `.gobbi/projects/{name}/skills/X/`; the `.claude/skills/X/` symlink reflects it automatically
     — there is NO second copy to edit. (Exception: a canonical-only skill such as
     `gobbi-hook-authoring` has no `.claude/skills/` symlink at all, so confirm whether a symlink
     needs creating when adding a workspace-visible doc.)
   A blast-radius step that misses a genuine co-update file is an incomplete CRUD plan.
4. **Then edit** — and verify each CRUD line landed (P7).

**Delineation from Principle 8.** P8 (Documentation Is a Deliverable) governs *coupling*: every
implementation change ships its matching doc change in the same diff. P13 governs *scoping*: how to
structure and bound a documentation change itself — its spec, its CRUD operations, its blast
radius. P8 says "docs must ship with code"; P13 says "before you write the doc, know exactly what
it must contain, which type it is, and every file the change touches." P8 is the *when/whether*;
P13 is the *what/how-scoped*. A change can satisfy P8 (docs shipped alongside code) yet violate P13
(the doc was type-confused or a co-update file was missed) — and vice versa.

**Anti-rationalizations:**
- "It's a one-line doc fix." (one-line fixes are exactly where a co-update file gets missed)
- "I know what this doc is for." (then writing the 2-line spec costs nothing)
- "I'll find the other files as I go." (no — enumerate the CRUD plan first; discovery-as-you-go
  is how multi-file changes go half-applied)
- "CRUD is overkill for prose." (CRUD is the change-scoping lens; prose changes have blast radius too)

**Mechanism:** every documentation task — delegation prompt, plan item, or self-initiated edit —
carries an explicit SPEC block + CRUD enumeration before the first edit. Plan items for doc work
that omit either are caught at Planning EVALUATION (Project + Consistency perspectives). Doc edits
whose CRUD plan misses a genuine co-update file are rejected at review.
```

---

## 7. Propagation plan — every file to update + WHAT changes

**MIRROR MODEL (corrected — Critical fix).** The `.gobbi/projects/gobbi/skills/X/` files are CANONICAL real files; each `.claude/skills/X/...` entry is a per-file SYMLINK into the canonical file (verified: `.claude/skills/memorization/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/memorization/SKILL.md`). **Edit the worktree-absolute CANONICAL `.gobbi/.../skills/X` file ONCE; the `.claude/skills/X` symlink reflects it automatically — there is NO second edit.** The counts below are real-file edits, not doubled. Two caveats: (a) **`gobbi-hook-authoring` is canonical-only** — it has NO `.claude/skills/` symlink (verified), so a workspace-visible change there requires creating the symlink; (b) the *worktree* isolation trap (mistake `executor-mirror-path-vs-worktree-physical-copy.md`) is a SEPARATE concern — each worktree checkout has its own materialized canonical files on its branch, so always edit the worktree-absolute path, not the main-tree path.

| # | File (edit the canonical `.gobbi/.../skills/...` path; symlink reflects) | What changes |
|---|---|---|
| 1 | `principles/SKILL.md` | Add Principle 13 (§6); add row 13 to the Iron Law Index table; update the closing "Twelve principles" prose (intro) → "Thirteen". |
| 2 | `.claude/CLAUDE.md` (real file, not a skill mirror) | Add row 13 to the Iron Law table; bump "12 principles" → "13 principles" prose. (CLAUDE.md is its own file in each tree — co-update file for the new principle, per P13 blast-radius.) |
| 3 | `memorization/memory-map.md` | Add the 13 per-type specs' canonical home; add `session.json.lock` row; resolve archive flat-vs-typed (typed wins); add a cross-reference to the new `memorization/rules.md` sibling (the naming + frontmatter + structure rules move OUT to that consolidated doc — RATIFY-6); fix the project-level `plans/` row to read maintainer-authored-only / NOT-loop-written (HIGH-4); note the `skills/`-placement contradiction points to the L8 follow-up (FLAG-1). |
| 4 | `memorization/rules.md` (**NEW canonical sibling + a NEW `.claude/skills/memorization/rules.md` symlink**) | Author the consolidated memory-rules doc: the naming standard (§4.1-4.3), the frontmatter base+extensions standard (§5, incl. the §5.2 status model and the archive-not-in-enum rule), and the structure rules (per-type scope + temporal-split conventions). Cross-referenced from `memory-map.md`. **Add the three-way disambiguation note** (§4: this SKILL doc ≠ `memorization/templates/rules.md` template ≠ the `rules/` memory TYPE). Create the `.claude/skills/memorization/rules.md` symlink alongside the existing SKILL.md/memory-map.md symlinks. |
| 5 | `memorization/SKILL.md` | Carry the staging-field-stripping *mechanism* (§5.3); align the staging-subdir list with the per-type specs; add the per-perspective eval filename canon (bare perspective names) + Execution per-task quartet; cross-reference `memorization/rules.md`. |
| 6 | `wrap-up/SKILL.md` | Add the frontmatter-allowlist-on-promotion step (strip staging-only fields per type, §5.3 — incl. dropping `promoted-from`/`promoted-at` per RATIFY-5); confirm routing table matches the 13 specs + the 4 feature-subdir types; document the non-standard-subdir cleanup (no `followups/`, fold `restore/` into rawdata, remove `tmp/`); confirm archive typed-subdir routing (original type preserved). |
| 7 | `orchestration/SKILL.md` + `orchestration/workflow/*.md` | Document the canonical session tree (§3.1), per-task Execution quartet (§3.2), per-perspective eval filenames (§3.3); add `session.json.lock` to session-root docs; ~~remove/retire `state.json` references~~ **CORRECTION 2026-05-26 (user-ratified): DO NOT remove/retire `state.json`** — see the §3.4 CORRECTION. The live workflow state-machine `state.json` is RETAINED as canonical (row-5.5-initialized from `templates/state.template.json`, manager-updated every transition, drives `/clear` recovery + the Workflow Status Display); only the OLD SQLite-era `state.json` was retired in PR-FIN-2a-iii. `orchestration/SKILL.md` already handles it correctly and is left unchanged; reflect `tmp/` removal (no second scratch tier). |
| 8 | `memorization/templates/*.md` (**all 17 files**) | Per-template: align Naming to the temporal-split rule (and point to `memorization/rules.md`); align frontmatter block to base+extensions; align Location/Scope to the per-type scope rule. **All 17 are in scope:** the 13 type templates + the 4 feature-subdir templates (`changelogs.md`, `discussions.md`, `scenarios.md`, `checklists.md` — align to §2.14: feature-subdir-only scope + their temporal-split mode). For **`rules.md` template:** add base frontmatter to the template AND reword the "No frontmatter" clause to scope it to stub-redirect TARGET docs only (RATIFY-2). For `archive.md`: confirm typed-subdir + move-on-terminal + original-`type`-preserved (HIGH-5b). Highest-touch: `decisions.md` (atomicity), `mistakes.md` (strip mistake-candidate), `notes.md` (features_touched), `feature-readme.md` (value_proposition frontmatter, drop sprint keys, scope=feature self-reference), `backlogs.md` (bare-slug + project/feature scope). **NOTE:** the template `memorization/templates/rules.md` (a TYPE template) is DISTINCT from the new `memorization/rules.md` sibling (the consolidated memory-rules doc) — do not confuse the two paths. |
| 9 | `rules/stub-redirect-format.md` (memory file) | **Add base frontmatter to the rule file** (RATIFY-2: L6 wins); **reword the rule's own "No frontmatter" clause to scope it to stub-redirect TARGET docs only**, not to project-memory files. |
| 10 | `gobbi/SKILL.md` | Reflect the 7-value-feature model (dev-vibe slugs) if the skill map or any feature list references features; document the install/runtime knowledge that `install-runtime` owns as docs (not a skill — HIGH-1); align/repoint the missing `_claude`/`claude` skill reference per [FLAG-2]. |
| 11 | `evaluation/SKILL.md` | Confirm the 7-perspective vocabulary is the single source the session eval filenames must use (§3.3); if Codex perspective-vocab divergence is a brief-side issue, note the canonical-perspective requirement. |
| 12 | `mistake/SKILL.md` | Confirm `mistake-candidate` is documented as staging-only + stripped on promotion (reciprocal to the wrap-up edit). |
| 13 | `delegation/SKILL.md` + `delegation/templates/{leader,assistant,executor,evaluator}.md` (**HIGH-2 — highest-leverage**) | Wire the new `memorization/rules.md` standard into the **Load Directives tier-3 Skills** of every template that already loads `memorization/SKILL.md` (verified: leader.md, assistant.md, executor.md each have the `memorization/SKILL.md` line — add `memorization/rules.md` alongside it, "mandatory when the delegation touches project memory"). `evaluator.md` currently has NO `memorization/SKILL.md` Load Directive (verified — it mentions memorization only in passing); add the `memorization/rules.md` line to it ONLY if an evaluator delegation is given memory-context to assess against the standard. In `delegation/SKILL.md`, document that any delegation writing or evaluating project memory must load `memorization/rules.md`. **Without this edit the entire naming/frontmatter standard is advisory-only and the drift recurs next session.** |

Plus the **migration edits** to live memory files (§8) — those are content moves/renames, not skill edits, but they are part of "making the design real".

---

## 8. Migration plan (strategy + categorized inventory)

**Strategy.** Full migration this session (user-chosen). Sequence bottom-up: (1) establish the standards (skills/templates/memory-map + the new `memorization/rules.md` sibling + the delegation Load-Directive wiring) so the target shape exists; (2) re-home the 4 sprint-features into value-features; (3) rename non-compliant files; (4) fix frontmatter. Do standards-first so migrated files land in an already-correct world. Every move is `git mv` (no-delete; preserves history). Detailed per-file task decomposition is the Planning loop's job — below is the categorized inventory + rough size so the manager can scope.

**Category A per-file routing heuristic (LOW-16).** The 4 sprint dirs hold **136 `.md` files** (verified: env-var-audit 7 + Bundle A 22 + Bundle B 101 + Bundle C 6 = 136 across the four feature dirs). Per-file decomposition is Planning's job, but Planning should not guess — apply this heuristic:
1. **A file's destination feature = the capability its CONTENT is about**, not the sprint it shipped in (e.g., a Bundle-C `archive-move-on-terminal-model.md` is about the memory system → `project-memory`, even though Bundle C's primary is `git-workflow`).
2. **When the content is ambiguous or spans two**, route to the **sprint's PRIMARY value-feature** (§1.3 table).
3. **`changelogs/` entries go to EACH touched value-feature** (a sprint that touched git-workflow + project-memory gets a changelog entry in both).
4. **Bundle/positional/finding-ID files split FIRST** (cat B) before routing — route each split-out concept file individually.
5. **Session-narrative content** (the sprint README's "what happened") becomes the `notes/` entry (already present) — it does NOT move into a feature.

| Category | What | Rough size | Notes |
|---|---|---|---|
| A. Feature re-homing | Move the 4 sprint-features' subdir contents into the 7 value-features (§1.3) using the routing heuristic above; convert sprint READMEs → `changelogs/` entries + confirm session notes exist | **Large** — **136 `.md` files** across 4 feature dirs (verified); judgment-heavy per-file routing | The single biggest category. Bundle B alone holds 101 of the 136. |
| B. Slug renames | The **5** project `item-N-M-*` backlogs: `item-1-2-broader-delegation-contract-verifier.md`, `item-1-2-skill-loading-discipline.md`, `item-1-3-two-surface-collapsing-strategy.md`, `item-1-3-symlink-into-worktree-alternative.md`, `item-2-1-auto-mode-silence-vs-always-ask.md` (LOW-12 — verified 5, not 4); the `f-aes-01-*` learning (1); loop-phase decision bundles (`ideation-decisions`, `iter1-user-redirects`, `concern-N-*` in the orch feature) | **Medium** — ~12-17 renames + bundle-splits | Bundle files require SPLITTING (1 file → N), not just renaming. |
| C. Frontmatter fixes | Strip `mistake-candidate:true` from **17 of 21** mistakes; add base frontmatter to `rules/stub-redirect-format.md` + reword its no-frontmatter clause (RATIFY-2); fix `design/session-lifecycle-worktree-boundaries.md` + `design/archive-move-on-terminal-model.md` ad-hoc keys → base schema; fix `learnings/f-aes-01` ad-hoc keys; drop `promoted-from`/`promoted-at` (RATIFY-5); add base frontmatter to any file missing it | **Medium** — ~25-30 files | Mechanical once the allowlist exists; the 17 mistake strips are pure deletions of one line. |
| D. Session-memory cleanup | Remove `wrap-up/evaluation/followups/`, fold `planning/rawdata/restore/` into rawdata (RATIFY-4), ~~remove the **2** root `HANDOFF.md` + the **5** `state.json` (verified counts — MED-10)~~ **CORRECTION 2026-05-26 (user-ratified):** NO `state.json` is removed — the live workflow state-machine `state.json` is RETAINED as canonical (user-ratified; see §3.4 CORRECTION); the closed-session `state.json` + root `HANDOFF.md` files are left untouched per RATIFY-7 (W4-T1 removes only `tmp/` scratch dirs, not session-root files), remove `tmp/` (RATIFY-8), normalize eval filenames (`pN-` strip + codex-vocab align + relocate `codex-prompt.md`), backfill incomplete task quartets | **Small-Medium** — **going-forward + opportunistic only (RATIFY-7 — NO full retro-sweep of closed sessions)** | User decision: enforce the canonical session shape going-forward and fix opportunistically when a closed session is reopened; do NOT mount a retro-sweep across all closed sessions. Lowest-value category; sessions are volatile. |
| E. Standards authoring | The §7 skill/template/memory-map edits + new `memorization/rules.md` (+ its symlink) + the delegation Load-Directive wiring | **Large** — 13 propagation targets, 17 templates | This is the "make the design real" core; Planning decomposes into waves. Edited once per canonical file (no mirror doubling). |

Rough total scope signal for the manager: **two genuinely large categories (A feature re-homing at 136 files, E standards authoring)**, two medium (B, C), one small-now-that-RATIFY-7-is-resolved (D). A single session can plausibly do E + C + B; A is large and judgment-heavy enough it may warrant its own session or careful wave-splitting; D is the lowest-value and now scoped to going-forward enforcement only.

---

## 9. Auto-resolved contradictions (from the audit + locks) — [AUTO]

| Audit contradiction | Resolution | Authority |
|---|---|---|
| `skills/` placement: memory-map excludes it / wrap-up lists it as write target | Out of scope this session (L8). File a follow-up for the canonical-location contradiction; do not resolve now. | L8 |
| archive flat-slug (memory-map) vs typed-subdir (design doc + live) | **Typed-subdir wins** (`archive/{type}/`, original `type` preserved). Update memory-map to match the design doc + live tree. | `archive-move-on-terminal-model.md` |
| decisions one-per-file (template) vs loop-bundle files (live) | **One-per-file wins** (L5 atomicity). Bundle files are a migration target (cat B). | L5 |
| `tmp/` undocumented | **RESOLVED (RATIFY-8 — user confirmed): REMOVE.** The canonical session tree (§3.1) already provides `rawdata/` for scratch; a second scratch tier invites drift. Route scratch to `{loop}/rawdata/`. | user decision |
| `reports/` empty | Valid-but-unused; not a defect. No action. | leader rec |
| base `type` enum vs `archive` value | **`archive` removed from the enum** (HIGH-5b); archived files keep original `type`, the `archive/` dir is the lifecycle marker. | §2.13/§5.1 |

---

## 10. USER-AUTHORITY decisions (consolidated)

**Resolved (no longer open):**
- ~~**[RATIFY-2]**~~ **RESOLVED** — rules frontmatter: L6 wins; base frontmatter added to the rule file; the rule's "No frontmatter" clause rescoped to stub-redirect TARGET docs only; the frontmatter standard is documented in the consolidated `memorization/rules.md` sibling. (§2.6, §5, §7 #4/#8/#9.)
- ~~**[RATIFY-3]**~~ **RESOLVED** — plans are feature-only for the loop path (HARD); project `plans/` = maintainer-authored roadmaps only, never loop-written. (§2.10.)
- ~~**[RATIFY-4]**~~ **RESOLVED** — `planning/rawdata/restore/` folds into `rawdata/`; no separate sub-scratch tier. (§3.4, §8 cat D.)
- ~~**[RATIFY-5]**~~ **RESOLVED** — drop `promoted-from`/`promoted-at` provenance frontmatter; `git log` + base `session` field suffice. (§5.3, §2.7, §8 cat C.)
- ~~**[RATIFY-6]**~~ **RESOLVED (user-decided)** — memory-rules home: a dedicated `memorization/rules.md` sibling (one canonical file + one `.claude` symlink) consolidating the naming convention + frontmatter standard + structure rules, cross-referenced from memory-map.md. Three-way disambiguation note added (§4). (§4, §5, §7 #3/#4/#13.)
- ~~**[RATIFY-7]**~~ **RESOLVED** — session-memory cleanup: going-forward + opportunistic; NO full retro-sweep of closed sessions. (§8 cat D.)
- ~~**[RATIFY-8]**~~ **RESOLVED (user confirmed): REMOVE `tmp/`** — route scratch to `{loop}/rawdata/`; do not document a second scratch tier. (§9, §8 cat D.)

**Open — needs ratification before Planning (the ONLY remaining open item):**
- **[RATIFY-1]** Final sign-off on the 7 value-features and their **dev-vibe slugs** — `workflow`, `project-memory`, `agents`, `evaluation`, `guardrails`, `git-workflow`, `install-runtime` — plus their one-liners, the corrected skill-ownership map (18 canonical dirs; `install-runtime` owns `interview` + `gobbi-hook-authoring`; no `gobbi-install`/`_claude` skill), and the 4-sprint→value-feature mapping (§1). Main lever: granularity (split `guardrails` back into `principles` + a `mistake-learning` feature? is `install-runtime` too broad?). Leader rec: the 7 as listed.

## 11. Out-of-scope findings (flagged, do not fix) — [FLAG]

- **[FLAG-1]** `skills/` + `agents/` relocation and the memory-map-vs-wrap-up canonical-location contradiction (L8 — file a follow-up).
- **[FLAG-2]** The `claude` documentation-standard skill is **missing**: CLAUDE.md links `skills/claude/SKILL.md` but no such directory exists under `.claude/skills/` or `.gobbi/.../skills/` (verified `ls` — 18 canonical dirs, none named `claude`/`_claude`). The docs standard P13 references is referenced-but-absent — which is why P13 (§6) now cites the doc standard **generically** rather than naming a specific skill (MED-8). File a follow-up; relevant to P13 and to value-feature #2 `project-memory` (the doc-authoring standard's intended home). The CLAUDE.md "claude skill" navigation row is itself a dangling reference to fix under this flag.
- **[FLAG-3]** `rules/stub-redirect-format.md` references a `_claude/SKILL.md` path (tied to FLAG-2) — repoint once FLAG-2 resolves.
