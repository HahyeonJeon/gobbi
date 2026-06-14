# Memory Map

Reference of every memory path the workflow touches. Two tiers: **Session record** (volatile, per-session) and **Memory** (persistent, per-project). Use this doc as the single source of truth when deciding where a staging file goes, which template stamps a destination, or whether a path is the assistant's or Wrap-up's to write.

For the naming convention, frontmatter standard, and structure rules every memory file obeys, see [`rules.md`](rules.md). For the canonical per-session working-tree shape — the `{N}-{loop}/` ordinal map, the 4-slot loop interior, and the single session-root `transcripts/` — see [`../record/record-map.md`](../record/record-map.md), the single source of truth.

The assistant in RECORD writes **only** to the session record. Wrap-up — in its **memorization** stage — is the sole writer to memory: it promotes the session-record staging subtree to memory. Both tiers are plain markdown trees — there is no per-session SQLite (`gobbi.db` was dropped) and no per-project summary JSON (`project.json` was dropped). `session.json` is the only JSON in the session tree, and it is per-session telemetry — not durable memory.

Column legend:

- **Path** — canonical path; `{date}` / `{session-id}` / `{N}` / `{loop}` / `{role}` / `{agentId}` / `{iter-number}` / `{slug}` / `{project-name}` / `{feature-name}` / `{skill-name}` / `{agent-name}` are substitution variables (see [`SKILL.md` § Output paths](../record/SKILL.md#output-paths)). On-disk loop dirs carry the `{N}-` ordinal prefix (`1-ideation` … `5-wrap-up`); the `workflow.{loop}` keys in `session.json` stay **bare** (SEAM-3 — see [`../record/record-map.md`](../record/record-map.md))
- **Description** — what lives here and why
- **Writer** — the role that creates / updates this path during the workflow
- **When** — the workflow point at which the writer touches it
- **Template** — the template under [`templates/`](templates/) the writer stamps (or `—` if no template)

---

## Session record

Root: `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/`

Volatile per-session storage. Wrap-up promotes the `staging/` subtree to memory at end-of-session; everything else stays in the session for audit.

### Session root

| Path | Description | Writer | When | Template |
|---|---|---|---|---|
| `session.json` | Per-session telemetry — `workflow.{loop}.iterations[]`, `finishedAt`, `verdict`, project / feature / task scope. Single file generated at RECORD STEP_EXIT | manager (init) + assistant (UPSERT) | session start; every iter RECORD | [`../orchestration/templates/session.template.json`](../orchestration/templates/session.template.json) |
| `settings.json` | Session-level config (evaluate mode, git workflow). Resolved by cascade from workspace → project → session. Bootstrap loads the per-mode default file matching the user-selected mode | manager (session start) | session start (`/gobbi`) | [`../orchestration/templates/settings.chat.json`](../orchestration/templates/settings.chat.json) / [`../orchestration/templates/settings.auto.json`](../orchestration/templates/settings.auto.json) |
| `session.json.lock` | Advisory write-lock guarding concurrent `session.json` writes. Created and released by the manager around each `session.json` write; safe to ignore on read. Not memory content — a transient coordination artifact at the session root | manager | around every `session.json` write | — |
| `transcripts/{role}-{agentId}.jsonl` | **Single** session-root transcript surface — one immutable file per agent run (manager = `manager-{sessionId}.jsonl`), accumulating across all loops by distinct `agentId`. Gitignored, session-scoped, never promoted, removed at worktree cleanup. There is no per-loop `transcripts/` | manager (creates dir at Configuration) + assistant (copies files at RECORD) | session start (dir); every iter (copy) | — |

### Per-loop subtree — `{N}-{loop}/` (loop ∈ ideation / preparation / planning / execution / wrap-up; on-disk dirs carry the `{N}-` ordinal prefix — `1-ideation` … `5-wrap-up`)

The loop interior is **4 slots only** — `working/`, `evaluation/`, `staging/`, `outputs/`. There is no per-loop `transcripts/`; every agent's transcript lives in the single session-root `transcripts/` (see the Session-root table above). For the authoritative shape see [`../record/record-map.md`](../record/record-map.md).

| Path | Description | Writer | When | Template |
|---|---|---|---|---|
| `{N}-{loop}/outputs/{free-filename}.md` | Loop's PASS-iter output artifacts. Filenames and counts are free; every file carries the [Artifact frontmatter schema](../record/SKILL.md#artifact-frontmatter-schema). Collectively the next loop's briefing source. Mandatory: ≥ 1 file with `artifact_type: memory-reads` | assistant (RECORD) | `PASS` iteration only | frontmatter schema only (no body template) |
| `{N}-{loop}/working/draft-iter{n}.md` | Leader / executor draft for iter `n` — the WORK output before RECORD synthesizes | leader (Ideation, Planning) or executor (Execution) (WORK) | every iter, during WORK | per-loop draft shape (see loop's `SKILL.md`) |
| `{N}-{loop}/working/research/{slug}.md` | Pre-staging external references written during WORK when the `research` skill is loaded; promoted to `staging/references/` at RECORD | leader (WORK — research) | per confirmed external insight | [`templates/references.md`](templates/references.md) (on promotion) |
| `{N}-{loop}/working/discussion-log.md` | Manager-captured user-decision exchanges, appended one section per exchange. Preserved across iters | manager (DISCUSSION live) | every user-decision exchange | — |
| `{N}-{loop}/evaluation/iter{n}/{system}/{perspective}.md` | Per-perspective evaluation file — Artifact Summary + W/W/H + Locked Frame + Stage 2 verdicts + typed findings. `{system}` ∈ claude / codex; `{perspective}` ∈ project / structure / performance / aesthetics / usage / consistency / risk | evaluator (EVALUATION) | every iter, after WORK | — |
| `{N}-{loop}/evaluation/iter{n}/{system}/overall.md` | Stage 3 overall verdict + cross-cutting findings + Karpathy checks + Preserve list | evaluator (EVALUATION) | every iter, after Stage 2 | — |

### Per-loop staging — `{N}-{loop}/staging/` (PASS-only writes; Wrap-up promotion source)

Every staging file is stamped to its matching template. See [`SKILL.md` § Templates](../record/SKILL.md#templates) for the mapping.

| Path | Description | Writer | When | Template |
|---|---|---|---|---|
| `{N}-{loop}/staging/scenarios/{slug}.md` | `scenario_gap` finding — a scenario the artifact missed; Wrap-up promotes to feature scenarios | assistant (RECORD) | `PASS` only | [`templates/scenarios.md`](templates/scenarios.md) |
| `{N}-{loop}/staging/checklists/{slug}.md` | `checklist_gap` finding — a check item that should be in the implementation checklist | assistant (RECORD) | `PASS` only | [`templates/checklists.md`](templates/checklists.md) |
| `{N}-{loop}/staging/decisions/{slug}.md` | `design_flaw` / `assumption_risk` / `disputed` / `deferred` findings + Domain-routed `general` findings + `mistake-candidate: true` candidates | assistant (RECORD) | `PASS` only | [`templates/decisions.md`](templates/decisions.md) |
| `{N}-{loop}/staging/references/{slug}.md` | External insight from Ideation Sub-step C, or `general` finding with Domain = `dependency` | assistant (RECORD) | `PASS` only | [`templates/references.md`](templates/references.md) |
| `{N}-{loop}/staging/design/{slug}.md` | Substantive design topic distilled from the canonical artifact's Design section | assistant (RECORD) | `PASS` only | [`templates/design.md`](templates/design.md) |
| `{N}-{loop}/staging/discussions/{slug}.md` | Substantive user-decision topic from discussion-log | assistant (RECORD) | `PASS` only | [`templates/discussions.md`](templates/discussions.md) |
| `{N}-{loop}/staging/backlogs/feature/{slug}.md` | Feature-scope deferred work (task backlog within the active feature) | assistant (RECORD) | per deferral | [`templates/backlogs.md`](templates/backlogs.md) |
| `{N}-{loop}/staging/backlogs/project/{slug}.md` | Project-scope deferred work (deferred features) | assistant (RECORD) | per deferral | [`templates/backlogs.md`](templates/backlogs.md) |
| `{N}-{loop}/staging/reviews/{slug}.md` | Review / evaluation / audit activity result document staged in-session for Wrap-up promotion | assistant (RECORD) | `PASS` only when the loop included a review activity | [`templates/reviews.md`](templates/reviews.md) |
| `{N}-{loop}/staging/reports/{slug}.md` | `status` / `post-mortem` / `analytics` report staged in-session for Wrap-up promotion | assistant (RECORD) | `PASS` only when the loop produced a substantive report | [`templates/reports.md`](templates/reports.md) |
| `{N}-{loop}/staging/changelogs/{slug}.md` | Shipped-work changelog entry staged in-session for Wrap-up promotion (Execution loop typical; tracks what shipped per task) | assistant (RECORD) | `PASS` only when shipped-work occurred | [`templates/changelogs.md`](templates/changelogs.md) |
| `{N}-{loop}/staging/learnings/{slug}.md` | Durable cross-cutting insight staged in-session for Wrap-up promotion | assistant (RECORD) | `PASS` only when the loop produced an actionable learning | [`templates/learnings.md`](templates/learnings.md) |
| `{N}-{loop}/staging/notes/{slug}.md` | Loop-scope journal entry staged in-session for Wrap-up promotion. The per-session journal entry is written directly by Wrap-up; loop-scope staging here is the rare case of a substantial mid-loop work-log entry | assistant (RECORD) | `PASS` only when the loop produced a substantial work-log entry separate from the session note | [`templates/notes.md`](templates/notes.md) |
| `3-planning/staging/plans/{slug}.md` | Plan artifact for Wrap-up to promote to `features/{feature-name}/plans/{date}-{slug}.md`. **Planning loop only** — `plans/` does not appear in other loops' staging trees | assistant (Planning RECORD) | `PASS` only, Planning loop only | [`templates/plans.md`](templates/plans.md) |

---

## Memory

Root: `.gobbi/projects/{project-name}/`

Persistent, per-project, git-tracked. Durable memory. **Wrap-up is the sole writer**; loop RECORD never writes here. The directory shape below matches the canonical memory layout — see [`wrap-up/SKILL.md`](../wrap-up/SKILL.md) for the staging → destination routing table.

### Per-type canonical homes (the 13 memory types)

Each memory type has a single canonical home directory and a per-type spec (purpose / hard boundary / scope / naming / frontmatter / CRUD) in [`rules.md`](rules.md) and the design-of-record. The table below is the path index; for the full per-type semantics see [`rules.md`](rules.md):

| Type | Canonical home | Also feature-scoped? |
|---|---|---|
| `features` | `features/{feature-name}/` (the dir is its own tier; README is the identity doc) | n/a — `features/` IS the feature tier |
| `notes` | `notes/` | Project-only |
| `decisions` | `decisions/` | Both (default feature-level; promote-up to project) |
| `design` | `design/` | Both (default feature-level; promote-up to project) |
| `mistakes` | `mistakes/` | Both (default project-level; feature-scope when trap is feature-specific) |
| `rules` | `rules/` | Project-only |
| `learnings` | `learnings/` | Project-only |
| `backlogs` | `backlogs/` | Both (feature tasks vs project-scope deferrals) |
| `references` | `references/` | Both (default feature-level; promote-up rare) |
| `plans` | `features/{feature-name}/plans/` (loop path); project `plans/` is maintainer-authored only, NOT loop-written | Feature-only for the loop path |
| `reviews` | `reviews/` | Project-only |
| `reports` | `reports/` | Project-only |
| `archive` (destination, not a type) | `archive/{type}/` (typed subdirs; original `type` preserved) | Project-only |

The four feature-subdir-only template types (`changelogs`, `discussions`, `scenarios`, `checklists`) are not independent memory types — they exist only as `features/{feature-name}/` subdirs (see [`rules.md` § 3](rules.md) and the per-row entries below).

### Project root

| Path | Description | Writer | When | Template |
|---|---|---|---|---|
| `README.md` | Top-level project README — what this project is, where to look | maintainer (rare) + Wrap-up (status updates) | manual edits; Wrap-up may update activity summary | — |
| `settings.json` | Project-level config | maintainer | manual seed; persists across sessions | [`../orchestration/templates/settings.chat.json`](../orchestration/templates/settings.chat.json) / [`../orchestration/templates/settings.auto.json`](../orchestration/templates/settings.auto.json) (per-mode defaults; bootstrap loads the file matching the mode) |

### Feature-scoped — `features/{feature-name}/`

Each feature directory is bootstrapped lazily by Wrap-up on first promotion to that feature (`features/{feature-name}/` is **not** created at Lock Scope or earlier).

| Path | Description | Writer | When | Template |
|---|---|---|---|---|
| `features/{feature-name}/README.md` | Feature overview, status, subdirectory pointers, recent activity table (cap 20 entries) | Wrap-up | first promotion to this feature; subsequent activity updates | [`templates/feature-readme.md`](templates/feature-readme.md) |
| `features/{feature-name}/scenarios/{slug}.md` | Feature scenarios promoted from session staging | Wrap-up | per promotion | [`templates/scenarios.md`](templates/scenarios.md) |
| `features/{feature-name}/checklists/{slug}.md` | Feature implementation checklist items | Wrap-up | per promotion | [`templates/checklists.md`](templates/checklists.md) |
| `features/{feature-name}/decisions/{slug}.md` | Feature-scope decisions (design choices, dispute rationales, deferred risks) | Wrap-up | per promotion | [`templates/decisions.md`](templates/decisions.md) |
| `features/{feature-name}/design/{slug}.md` | Feature-scope design topics. Project-wide design escalates to `.gobbi/projects/{project-name}/design/` through the active runtime's user-decision primitive | Wrap-up | per promotion | [`templates/design.md`](templates/design.md) |
| `features/{feature-name}/discussions/{slug}.md` | Substantive user-decision topics scoped to the feature | Wrap-up | per promotion | [`templates/discussions.md`](templates/discussions.md) |
| `features/{feature-name}/references/{slug}.md` | External insight references confirmed during Ideation Sub-step C | Wrap-up | per promotion | [`templates/references.md`](templates/references.md) |
| `features/{feature-name}/plans/{date}-{slug}.md` | Plan artifacts produced by Planning loop (date-prefixed for chronological ordering) | Wrap-up | per Planning `PASS` | [`templates/plans.md`](templates/plans.md) |
| `features/{feature-name}/backlogs/{slug}.md` | Feature-scope deferred tasks | Wrap-up | per deferral | [`templates/backlogs.md`](templates/backlogs.md) |
| `features/{feature-name}/changelogs/{slug}.md` | Feature-scope changelog entries — what shipped, when | Wrap-up | per ship | [`templates/changelogs.md`](templates/changelogs.md) |
| `features/{feature-name}/mistakes/{slug}.md` | Feature-scope mistakes — corrections that apply only within this feature | Wrap-up | per `mistake-candidate: true` (user-scoped feature) | [`templates/mistakes.md`](templates/mistakes.md) |

### Project-wide tiers

These directories hold knowledge that crosses features or is intentionally project-scope. Wrap-up writes to these only after the active runtime's user-decision primitive confirms project-scope (rather than feature-scope).

| Path | Description | Writer | When | Template |
|---|---|---|---|---|
| `mistakes/{slug}.md` | Project-wide mistakes — corrections that apply across features. Highest-value knowledge in the system | Wrap-up | per `mistake-candidate: true` (user-scoped project) | [`templates/mistakes.md`](templates/mistakes.md) |
| `rules/{slug}.md` | Project rules — enforceable behavioral / structural conventions. Rare and load-bearing; user-confirm through the active runtime's user-decision primitive | Wrap-up | per session if a rule surfaced; user-confirmed | [`templates/rules.md`](templates/rules.md) |
| `design/{slug}.md` | Project-wide design documents. Feature-wide design lives under `features/{feature-name}/design/`; this tier is for cross-feature architecture | Wrap-up + maintainer | per promotion (user-confirmed) or manual authorship | [`templates/design.md`](templates/design.md) |
| `notes/{slug}.md` | Development journal entries — work-log records of what was done in a given session / day, akin to a dev diary. Distinct from `decisions/` (the conclusion) and `design/` (the architecture) — `notes/` captures the *running narrative of work* | Wrap-up | per session (typically one journal entry per session-close) | [`templates/notes.md`](templates/notes.md) |
| `backlogs/{slug}.md` | Project-wide deferred work (deferred features, project-scope tasks) | Wrap-up | per project-scope deferral | [`templates/backlogs.md`](templates/backlogs.md) |
| `references/{slug}.md` | Project-wide external references (cross-feature prior art) | Wrap-up | rare — user-confirmed cross-feature relevance | [`templates/references.md`](templates/references.md) |
| `decisions/{slug}.md` | Project-wide decisions (architectural choices, repo-level policies) | Wrap-up + maintainer | per project-scope decision | [`templates/decisions.md`](templates/decisions.md) |
| `plans/{YYYY-MM-DD}-{slug}.md` | **Maintainer-authored cross-feature roadmaps / release plans ONLY** — this tier is authored directly by the maintainer and is **NOT loop-written**. No Planning-loop RECORD or Wrap-up promotion ever targets project `plans/`; the loop path writes plans only to `features/{feature-name}/plans/`. If this maintainer surface is judged unnecessary it may be dropped entirely — the loop contract does not depend on it | maintainer (direct) | per maintainer-authored roadmap | [`templates/plans.md`](templates/plans.md) |
| `reviews/{YYYY-MM-DD}-{slug}.md` | Review / evaluation / audit activity result documents (adversarial-review, ultrareview, code review, retrospective, audit reports) | Wrap-up + maintainer | per review / audit activity completed | [`templates/reviews.md`](templates/reviews.md) |
| `reports/{YYYY-MM-DD}-{slug}.md` | Long-form report documents — `status` (periodic summaries), `post-mortem` (incident investigations), `analytics` (measurement outputs). Three types via `report_type` frontmatter | Wrap-up + maintainer | per status period close / post-mortem trigger / analytics run | [`templates/reports.md`](templates/reports.md) |
| `learnings/{slug}.md` | Project-level learnings — insights that emerge across features or sessions | Wrap-up + maintainer | per substantive learning | [`templates/learnings.md`](templates/learnings.md) |
| `archive/{type}/{YYYY-MM-DD}-{slug}.md` | Retired / superseded content moved here in full when it reaches a terminal state. Organized by **typed subdirs** — `archive/{type}/` mirrors the originating content type (`archive/decisions/`, `archive/backlogs/`, `archive/notes/`, …); the archived file keeps its ORIGINAL `type` in frontmatter (`archive` is not a `type` value) and gains `archived_at` / `archive_reason`. The directory — not the `type` field — marks it archived | Wrap-up + maintainer | per supersession / terminal-state move (`git mv`; preserves the file rather than deleting) | [`templates/archive.md`](templates/archive.md) |

Project-specific skill / agent overrides live under runtime static-knowledge paths: `.claude/skills/{skill-name}/` and `.claude/agents/{agent-name}.md` in Claude Code, `.agents/skills/{skill-name}/` and `.codex/agents/{agent-name}.toml` in Codex. These are static-knowledge paths, **not memory** in this skill's sense. The memory-map only covers paths under `.gobbi/projects/{project-name}/`; runtime overrides are authored manually by the maintainer and are out of RECORD's scope.

> **[FLAG-1] `skills/` placement contradiction — deferred follow-up (out of this redesign's scope).** This memory-map intentionally excludes `.gobbi/projects/{project-name}/skills/` from the memory type tables above (the project skills/ + agents/ trees are non-memory authoring surfaces), yet [`wrap-up/SKILL.md`](../wrap-up/SKILL.md) lists `skills/` among Wrap-up's memory write targets (the Preparation `generate-now` exception). The canonical-location question — is project `skills/` memory or a separate authoring surface — is NOT resolved here; the `skills/` + `agents/` relocation is deferred per the locked-decision L8 out-of-scope boundary. File a follow-up; do not resolve in this pass.

---

## Templates index

All templates live under [`templates/`](templates/). The index below lets you jump from a directory name (session or project) to its template, and from a template to the directories it stamps.

| Template | Stamps these directories |
|---|---|
| [`scenarios.md`](templates/scenarios.md) | `{N}-{loop}/staging/scenarios/`, `features/{feature-name}/scenarios/` |
| [`checklists.md`](templates/checklists.md) | `{N}-{loop}/staging/checklists/`, `features/{feature-name}/checklists/` |
| [`decisions.md`](templates/decisions.md) | `{N}-{loop}/staging/decisions/`, `features/{feature-name}/decisions/`, `.gobbi/projects/{project-name}/decisions/` |
| [`references.md`](templates/references.md) | `{N}-{loop}/staging/references/`, `features/{feature-name}/references/`, `.gobbi/projects/{project-name}/references/` |
| [`design.md`](templates/design.md) | `{N}-{loop}/staging/design/`, `features/{feature-name}/design/`, `.gobbi/projects/{project-name}/design/` |
| [`discussions.md`](templates/discussions.md) | `{N}-{loop}/staging/discussions/`, `features/{feature-name}/discussions/` |
| [`backlogs.md`](templates/backlogs.md) | `{N}-{loop}/staging/backlogs/{feature,project}/`, `features/{feature-name}/backlogs/`, `.gobbi/projects/{project-name}/backlogs/` |
| [`plans.md`](templates/plans.md) | `3-planning/staging/plans/`, `features/{feature-name}/plans/`, `.gobbi/projects/{project-name}/plans/` |
| [`feature-readme.md`](templates/feature-readme.md) | `features/{feature-name}/README.md` |
| [`mistakes.md`](templates/mistakes.md) | `features/{feature-name}/mistakes/`, `.gobbi/projects/{project-name}/mistakes/` |
| [`rules.md`](templates/rules.md) | `.gobbi/projects/{project-name}/rules/` |
| [`notes.md`](templates/notes.md) | `{N}-{loop}/staging/notes/`, `.gobbi/projects/{project-name}/notes/` |
| [`changelogs.md`](templates/changelogs.md) | `{N}-{loop}/staging/changelogs/`, `features/{feature-name}/changelogs/` |
| [`reviews.md`](templates/reviews.md) | `{N}-{loop}/staging/reviews/`, `.gobbi/projects/{project-name}/reviews/` |
| [`reports.md`](templates/reports.md) | `{N}-{loop}/staging/reports/`, `.gobbi/projects/{project-name}/reports/` |
| [`learnings.md`](templates/learnings.md) | `{N}-{loop}/staging/learnings/`, `.gobbi/projects/{project-name}/learnings/` |
| [`archive.md`](templates/archive.md) | `.gobbi/projects/{project-name}/archive/` |

---

## Cross-references

- Tier access permissions for the assistant role → [`SKILL.md` § Memory Access Matrix](../record/SKILL.md#memory-access-matrix)
- Staging → memory routing table → [`wrap-up/SKILL.md` § Staging → Memory routing](../wrap-up/SKILL.md#staging--memory-routing)
- Type + Domain → staging-subdir routing → [`evaluation/SKILL.md` § Finding Metadata](../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity)
- Slug + collision policy → [`evaluation/SKILL.md` § Slug + collision policy](../evaluation/SKILL.md#slug--collision-policy)
