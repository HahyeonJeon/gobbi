# Memory Rules

The consolidated standard for **how gobbi's memory system works** — the naming convention, the frontmatter standard, and the structure rules that govern **every memory file** under `.gobbi/projects/{project-name}/` (the typed memory directories plus the feature-subdir memory types — every file that "carries base frontmatter", §2.1). This doc is the single source of truth an agent links to when deciding how to *name* a memory file, what *frontmatter* it must carry, and which *structure* rules (scope, atomicity, temporal split) apply. The companion [`memory-map.md`](memory-map.md) maps the path-and-type semantics (which directory holds what, who writes it, when); this doc governs the rules those paths obey.
>
> **Scope boundary.** This standard governs memory files only. It does **NOT** govern the non-memory surfaces that also live under `.gobbi/projects/{project-name}/` — `skills/`, `agents/`, or session-runtime files (`sessions/`). Those follow their own authoring conventions, not this memory standard.

> **CRITICAL disambiguation — three different "rules" things. Future agents MUST NOT conflate them.**
>
> - **`memorization/rules.md`** (this file) is a **SKILL doc** documenting *how memory works* — the naming convention, the frontmatter standard, and the structure rules.
> - **`memorization/templates/rules.md`** is a **TYPE TEMPLATE** — the authoring template for files of the `rules/` memory type.
> - **`.gobbi/projects/{project-name}/rules/`** is the **project-memory `rules/` TYPE** — the directory that holds behavioral / structural invariants every agent must follow.
>
> Three distinct things, two of them sharing the filename `rules.md` at different paths. `memorization/rules.md` (this how-memory-works reference) ≠ `memorization/templates/rules.md` (the rules-type template) ≠ `rules/` (the behavioral-invariant memory type).

---

## 1. Naming standard

The naming convention keeps every memory file at a **stable, atomic, controlled-vocabulary address** so supersede / archive / promotion operate at the right granularity and agents can find a record without grep guesswork.

### 1.1 Naming rules

1. **Directory = category.** The type directory IS the controlled-vocabulary facet. Never repeat the dir / type in the filename (e.g., a file in `decisions/` is not named `decision-...`).
2. **Filename = atomic concept slug.** kebab-case, lowercase, hyphens only, **≤6 words, ≤~35 chars**. ONE record = ONE concept — no bundle files.
3. **Length proportional to sibling count, inverse to path specificity** — a narrow directory tolerates a shorter slug.
4. **Status / lifecycle never in the filename** — it lives in frontmatter, so a transition never forces a rename.
5. **Stable address ≠ mutable description** — once created, a slug is not renamed for wording polish; supersede via frontmatter + a new file instead.

### 1.2 Temporal split

A file's filename pattern is keyed to whether the content is intrinsically time-indexed:

| Mode | Types | Filename pattern |
|---|---|---|
| **Date-prefixed** (intrinsically time-indexed) | notes, reviews, reports, changelogs, decisions, plans, discussions, archive entries | `YYYY-MM-DD-{slug}.md` |
| **Bare-slug** (evergreen; date in frontmatter) | features, mistakes, rules, learnings, design, references, backlogs, scenarios, checklists | `{slug}.md` |

The four feature-subdir-only types follow the same rule: `changelogs` / `discussions` are date-prefixed; `scenarios` / `checklists` are bare-slug.

### 1.3 Slug anti-pattern blocklist (FORBIDDEN in any slug)

| # | Forbidden | Bad example | Fix |
|---|---|---|---|
| 1 | loop / phase prefix | `ideation-decisions.md` | one file per decision, concept slug |
| 2 | finding-ID prefix | `f-aes-01-locked-wording-…` | `locked-wording-supersedes-readability-nit` |
| 3 | item / task / step positional | `item-1-2-skill-loading-discipline` | `skill-loading-discipline` |
| 4 | restating the parent dir | `gobbi-install-…` inside `features/gobbi-install/` | drop the prefix |
| 5 | status words | `final-`, `locked-`, `approved-` | status → frontmatter |
| 6 | version numbers | `v2-`, `schema-v5-` | version → frontmatter |
| 7 | date in an evergreen slug | `2026-…-design.md` in `design/` | date → frontmatter |
| 8 | wording excerpts of a finding | `concern-3-coverage-ownership-cell-text` | name the concept |
| 9 | person / author names | — | omit |
| 10 | opaque auto-IDs | — | add a human component |
| 11 | bundled-scope (many topics, one file) | `iter1-user-redirects.md` | split per topic |
| 12 | uninformative generics | `misc-`, `common-`, `helper-`, `notes.md` | describe the concept |

---

## 2. Frontmatter standard

Every memory file carries base frontmatter; richer types add a small set of declared extension fields. The base is the cross-type-uniform surface tools read; extensions are the per-type refinements.

### 2.1 Shared base (every memory file)

```yaml
---
name: {slug or short title}
description: {one-line what-this-is}
type: features|notes|decisions|design|mistakes|rules|learnings|backlogs|references|plans|reviews|reports
scope: project | feature
feature: {value-feature slug — required when scope=feature (a feature README self-references its own slug); null when scope=project and not feature-bound}
status: {type-appropriate lifecycle value — see §2.2}
created: YYYY-MM-DD
session: {session-id that created this}
tags: [{...}]
---
```

**The `type` enum lists the 12 promotable content types.** `archive` is NOT in the enum — it is a lifecycle destination, not a type enum value. An archived file keeps its original `type` value (e.g., `type: decisions`) and lives under `archive/decisions/`; the directory — not the `type` field — marks it archived.

**Feature-subdir-only types — documented EXCEPTION to the enum.** Beyond the 12 promotable content types in the enum, four feature-subdir-only types exist as `features/{f}/` subdirs (`changelogs` / `discussions` / `scenarios` / `checklists`). These are a *documented exception*: they reuse the base frontmatter but set `type` to their **own name** (`type: changelogs`, `type: discussions`, `type: scenarios`, or `type: checklists`) — values that are intentionally **outside** the 12-value enum — and always carry `scope: feature`. The enum line above stays the 12 promotable types; these four are the only `type` values permitted outside it, and only on feature-subdir files.

### 2.2 Per-type extension fields + the status model

**Status model — one model, documented.** Base `status` is the **authoritative generic lifecycle field** present on every file. Where a type needs richer lifecycle vocabulary, the type-specific field (`decision_status` for decisions, `disposition` for backlogs) is a **documented refinement that mirrors and narrows the base `status`** for that type — not a competing lifecycle. The base `status` always carries the coarse state (`active` / `superseded` / `archived` / `shipped` …); the type-specific field, when present, is the fine-grained value the type's CRUD references. They never disagree: the type-specific field is the one the type's lifecycle text cites, and base `status` is the cross-type-uniform field tools read.

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

### 2.3 Staging-field stripping on promotion

Staging-only fields exist during the session and MUST be stripped when Wrap-up promotes a staged file to project memory:

- **`mistake-candidate: true`** — stripped on promotion; its *presence* is what routes the file to `mistakes/`, after which it has done its job.
- **`finding-id`, `disposition`** (when used purely as eval routing), **`promoted-from`, `promoted-at`** — session-provenance. `git log` + the base `session` field already carry provenance; the extra keys are redundant ad-hoc drift. Fold any durable provenance into base `session` + `created`; strip the rest.

**Mechanism.** Wrap-up's promotion step reads the staging frontmatter, applies the routing modifier, then writes the destination file with ONLY base + that type's extension fields (a frontmatter allowlist per type). See [`wrap-up/SKILL.md`](../wrap-up/SKILL.md) for the promotion routing.

---

## 3. Structure rules

The structure rules thread through the 13 per-type specs in [`memory-map.md`](memory-map.md); they are the conventions every type obeys.

- **Directory-as-category.** The type directory is the controlled-vocabulary facet (§1.1 rule 1). The directory name carries the type; the filename carries the concept. A record's *type* is never re-encoded in its slug.
- **One record, one concept (atomicity).** Every file holds exactly one concept — one decision, one mistake, one design topic. Bundle files (`ideation-decisions.md`, `iter1-user-redirects.md`) are forbidden because supersede / archive / promotion then operate at the wrong granularity. Split bundles into one file per concept.
- **Declared scope + promote-up.** Each type declares its scope:
  - **`features/` is its own tier.** A `features/{slug}/` directory is a durable capability dir — not a project-scoped nor feature-tagged content type like the rest of this list. Its `README.md` is the feature's identity document: it carries base frontmatter with `scope: feature` + `feature: {own-slug}` (self-referential — the README names itself). New feature dirs are created only by user-ratified value-feature addition, never by a sprint.
  - **Project-only** types: `notes`, `rules`, `learnings`, `reviews`, `reports` (and `archive` as a destination). These live only at the project root; there is no `features/{f}/` tier for them.
  - **Feature-only (loop path)** types: `plans` — the loop path writes plans only to `features/{f}/plans/`. (A project-level `plans/` may exist for maintainer-authored cross-feature roadmaps, but it is never loop-written.)
  - **Both** types: `decisions`, `design`, `mistakes`, `backlogs`, `references`. They default to feature-level and **promote up** to the project root only when the content sets a project-wide convention / cross-feature architecture (user-confirmed via AskUserQuestion at Wrap-up).
  - The four feature-subdir-only types (`changelogs`, `discussions`, `scenarios`, `checklists`) exist ONLY as `features/{f}/` subdirs.

For the authoritative per-type purpose / hard-boundary / scope / CRUD detail, see [`memory-map.md`](memory-map.md).

---

## Cross-references

- Path-and-type semantics (which directory holds what, who writes it, when, which template stamps it) → [`memory-map.md`](memory-map.md)
- The assistant's MEMORIZATION procedure and memory-tier access matrix → [`SKILL.md`](SKILL.md)
- Staging → project-memory promotion routing (including the frontmatter allowlist on promotion) → [`wrap-up/SKILL.md`](../wrap-up/SKILL.md)
- Slug + collision policy for staging files → [`evaluation/SKILL.md` § Slug + collision policy](../evaluation/SKILL.md#slug--collision-policy)
