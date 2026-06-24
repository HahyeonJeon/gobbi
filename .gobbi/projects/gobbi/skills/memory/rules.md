# Memory Rules

The consolidated standard for **how gobbi's memory system works** — the naming convention, the frontmatter standard, and the structure rules that govern **every memory file** under `.gobbi/projects/{project-name}/` (the typed memory directories plus the feature-subdir memory types — every file that "carries base frontmatter", §2.1). This doc is the single source of truth an agent links to when deciding how to *name* a memory file, what *frontmatter* it must carry, and which *structure* rules (scope, atomicity, temporal split) apply. The companion [`memory-map.md`](memory-map.md) maps the path-and-type semantics (which directory holds what, who writes it, when); this doc governs the rules those paths obey.
>
> **Scope boundary.** This standard governs memory files only. It does **NOT** govern the non-memory surfaces that also live under `.gobbi/projects/{project-name}/` — `skills/`, `agents/`, or session-runtime files (`sessions/`). Those follow their own authoring conventions, not this memory standard.

> **CRITICAL disambiguation — three different "rules" things. Future agents MUST NOT conflate them.**
>
> - **`memory/rules.md`** (this file) is a **SKILL doc** documenting *how memory works* — the naming convention, the frontmatter standard, and the structure rules.
> - **`memory/templates/rules.md`** is a **TYPE TEMPLATE** — the authoring template for files of the `rules/` memory type.
> - **`.gobbi/projects/{project-name}/rules/`** is the **memory `rules/` TYPE** — the directory that holds behavioral / structural invariants every agent must follow.
>
> Three distinct things, two of them sharing the filename `rules.md` at different paths. `memory/rules.md` (this how-memory-works reference) ≠ `memory/templates/rules.md` (the rules-type template) ≠ `rules/` (the behavioral-invariant memory type).

---

## 1. Naming standard

The naming convention keeps every memory file at a **stable, atomic, controlled-vocabulary address** so supersede / archive / promotion operate at the right granularity and agents can find a record without grep guesswork. The address has two category facets: the type directory (§1.1) and the area sub-dir under it (§1.5).

### 1.1 Naming rules

1. **Directory = category.** The type directory IS the first controlled-vocabulary facet, and a second one nests under it: every by-area type adds an **area sub-dir** (`{type}/{area}/` — see §1.5). So "directory = category" is two levels, not one: type, then area. Never repeat either facet in the filename (e.g., a file in `decisions/` is not named `decision-...`).
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

### 1.3 Slug naming preferences (name the subject, not its position)

A slug is a **stable address that names the concept**. The test: *could a reader with zero session context tell what this file is about from its name alone?* Name it the way a careful developer names a module — the subject, in clear kebab-case. The patterns below are **smells / preferences**, not a hard-enforced blocklist (no regex gate). Content-word suffixes (`-decisions`, `-discussion`, `-references`, `-rollback`) are **encouraged** — they describe the subject. Date prefixes on the date-prefixed types (§1.2) are meaningful chronology, not a smell. The smell is always a **non-descriptive position / sequence index / cryptic internal reference** — a token that addresses the record inside a session (table rows, checkpoint IDs, task codes, list positions) instead of naming what it is about.

**Anti-patterns — by failure category:**

| Category | Bad example | Why it fails the zero-context reader | Fix (name the subject) |
|---|---|---|---|
| Positional / sequence index | `task-01`, `tasks-07-08`, `d-1`, `d-3-2`, `item-1-2`, `step-2-5` | "task 01 of what plan?" — the number is an address in a vanished session, not a subject | name the work: `worktree-create-row-insertion`, `shared-executor-context-continuity` |
| Cryptic internal reference | `row-5-5`, `decimal-row-numbering-55`, `1-3`, `4-1`, `t1g`, `t1j` | table coordinates / checkpoint IDs / task codes mean nothing without the session's working state | name the topic: `state-init-before-worktree`, `direct-mode-opt-out-doc-home` |
| Uninformative generic | `main`, `misc-`, `common-`, `notes.md`, `helper-` | tells the reader nothing about the subject; "main" is a branch/file convention, not a concept | name the deliverable: `orch-workflow-improvements` |
| Loop / phase prefix (non-descriptive) | `ideation-decisions.md`, `planning-` | the workflow phase is in frontmatter; the prefix adds noise without subject | one file per concept, concept slug |
| Restating the parent dir | `gobbi-install-…` inside `features/gobbi-install/` | the directory already carries the facet (§1.1 rule 1) | drop the prefix |
| Status / version words | `final-`, `locked-`, `approved-`, `v2-`, `schema-v5-` | lifecycle / version belong in frontmatter; a transition would force a rename (§1.1 rules 4–5) | status/version → frontmatter |
| Wording excerpt of a finding | `concern-3-coverage-ownership-cell-text` | quotes the finding instead of naming its subject | name the concept |
| Bundled scope (many topics, one file) | `iter1-user-redirects.md` | violates one-record-one-concept (§3) | split per topic |
| Person / author names · opaque auto-IDs | — | not a subject; not human-readable | omit / add a human component |

**Good vs bad — real before/after (from this project's history):**

| Bad (position/index/cryptic) | Good (names the subject) | What the subject actually is |
|---|---|---|
| `2026-05-24-task-01-row-5-5-worktree-create` | `2026-05-24-worktree-create-config-step` | changelog: shipped worktree-create into the Config step procedure |
| `d-1-worktree-row-5-5` | `worktree-create-before-session-stamp` | design: create worktree before session.json stamps git fields |
| `decimal-row-numbering-55` | `config-table-row-numbering-choice` | checklist: pick integer-renumber vs decimal row in the Config table |
| `2026-05-24-t1g-direct-mode-home-orchestration-skill` | `2026-05-24-direct-mode-opt-out-doc-home` | discussion: where the direct-mode opt-out is documented |
| `reframing-1-3` | `worktree-first-vs-collapsing-strategies` | discussion: worktree-first chosen over two-surface / symlink |
| `2026-05-23-main` | `2026-05-23-orch-workflow-improvements` | plan: the orch/workflow-improvements Execution plan |

The fix is never "delete the date" or "delete a content word" — it is "replace the position / index / cryptic token with a word that names the subject."

### 1.4 Ordered-step-dir carve-out (the `{N}-` prefix is exempt)

The no-positional-index rule (§1.3) governs **memory file slugs**. It does **NOT** apply to the **session step-dir names** under `sessions/{date}-{session-id}/` — `1-ideation`, `2-preparation`, `3-planning`, `4-execution`, `5-wrap-up`, and the per-task `task-{NN}-{slug}` dirs. The leading `{N}-` ordinal on these dirs is a **carve-out**, the directory analog of the date-prefix exemption in §1.2: the number is the loop's fixed, meaningful position in the workflow (`1`=ideation … `5`=wrap-up), not a non-descriptive index into a vanished session. It orders the on-disk loop dirs so a reader sees the workflow sequence at a glance.

This carve-out is a direct consequence of the **Scope boundary** at the top of this doc: this standard governs **memory files**, not the `sessions/` runtime tree. The session step-dirs are runtime working dirs whose shape is owned by [`../record/record-map.md`](../record/record-map.md) (the single source of truth), not by §1.3. The `{N}-` prefix is mandatory on disk and must never be read as a §1.3 positional-index smell. (Note SEAM-3: the prefix lives on the **dir** only; the `workflow.{loop}` keys in `session.json` stay **bare**.)

---

### 1.5 Area namespace (the second category axis under each type)

§1.1 rule 1 establishes the type directory as the first category axis. §1.5 adds a **second axis under it: the AREA sub-dir.** Every **by-area** memory record lives one area level below its type dir, so a growing type stays scannable instead of accreting into one flat list.

**Path shape — one real subdir level.** The area is a real directory, not a filename prefix:

- **Bare-slug types** (§1.2): `{type}/{area}/{slug}.md`
- **Date-prefixed types** (§1.2): `{type}/{area}/{YYYY-MM-DD}-{slug}.md` — the date stays inside the area, after it.

Examples: `mistakes/verification/executor-git-stash-in-worktree-during-verify.md`, `decisions/memory/2026-06-21-{slug}.md`, `notes/workflow/2026-06-21-{slug}.md`.

**Eager + both-tiers-symmetric.** Every by-area record is namespaced from file 1 — there is no "flat until N files, then split" threshold. The feature tier uses the identical shape: `features/{f}/{type}/{area}/{slug}.md`. One rule, two tiers.

**No catch-all area — a no-match is a user-decision.** There is no cross-cutting bucket. Every area a record lands in is a real, listed area for its type. When a record matches no area (the selection rule below resolves nothing), the write-time agent does NOT stamp a fallback area — it surfaces a user-decision (step 3 below). Never invent a new area to dodge the decision.

**Structural exception — `features/{f}/README.md`.** A feature directory's `README.md` is the feature identity doc; the feature dir is itself the area axis, so the README is **NOT** by-area and is exempt. It is the SOLE structural exception.

#### Per-type area allowlist (controlled, like the §2.5 tag vocabulary)

The per-type area allowlist is a **closed** controlled vocabulary, parallel to the §2.5 `tags` vocabulary — an area outside a type's list is a validation failure until the list is extended (extend deliberately, the same discipline as §2.5).

**The model is flat and per-type.** Each type owns ONE independent area list. There is no cross-type shared list and no catch-all area. **The project declares each type's list in [`memory-vocabulary.json`](../../memory-vocabulary.json)** under `.types.{type}.areas`. This rule is the prose spec; the config holds the values. The validator reads `.types.{type}.areas` via jq to enforce the allowlist; the Wrap-up agent follows this prose spec (which cites the config for gobbi's instance values). A non-gobbi project ships its own copy.

The **subsystem types** (the 12 types in the table below other than `mistakes`) each declare the subsystem set; gobbi's instance is:

```
subsystem: memory · git · workflow · wrap-up · evaluation · codex · process · docs · tooling · tests
```

`mistakes` uses a curated **trap-class** allowlist instead (the trap CLASS — how it fails — is the area, not the subsystem; the `process` bucket is DISSOLVED into trap-classes, so `process` is NOT a mistakes area); gobbi's instance is:

```
mistakes: verification · refactor · tooling · assumption · git · codex · docs-sync · memory
```

`reviews` and `reports` use a **kind axis**: the area set == the kind enum, and the area resolves directly from the REQUIRED `review_kind` / `report_type` extension (§2.2, L16) — not from tags. So a valid kind value is a valid area by construction. gobbi's instances are:

```
reviews: adversarial-review · ultrareview · code-review · retrospective · security-audit · license-audit · dep-audit · other
reports: status · post-mortem · analytics · other
```

| Type | Area allowlist |
|---|---|
| `mistakes` | the curated trap-class set above (`process` dissolved) |
| `reviews` | the `review_kind` enum (kind axis — area from the REQUIRED kind value) |
| `reports` | the `report_type` enum (kind axis — area from the REQUIRED kind value) |
| `decisions` · `design` · `backlogs` · `notes` · `references` · `learnings` · `rules` · `plans` | the subsystem set |
| `changelogs` · `discussions` · `scenarios` · `checklists` | the subsystem set (within the feature) |
| `features` | n/a — STRUCTURAL EXCEPTION; `features/` IS the area axis, `README.md` exempt |
| `archive` | n/a — no config key; an archived file mirrors its source type's area |

#### Deterministic area-selection rule

The write-time agent AND Wrap-up routing both apply this rule. It is **deterministic** (priority-ordered first-match — never a tie). It is NOT total: a record may match no area, in which case step 3 routes it to a user-decision rather than a fallback.

1. **Explicit `area:` wins.** If the staged file carries `area: {x}` where `{x}` is in the type's allowlist, use `{x}`. (`area:` is a staging-only field — §2.6.) For `reviews` / `reports`, the REQUIRED `review_kind` / `report_type` value IS the area input here (the kind axis, §2.2/L16) — the kind always provides a valid area, so reviews/reports never reach steps 2-3.
2. **Else scan the type's fixed PRIORITY-ORDERED tag→area map; the FIRST area whose any mapped tag is present wins.** The order is fixed per type, so a multi-tag record still resolves to exactly one area. **The project declares one map PER TYPE in [`memory-vocabulary.json`](../../memory-vocabulary.json)** — `.tagAreaMap.{type}` (each an ordered list of `{area, tags}` entries, high → low priority). The Wrap-up agent reads `.tagAreaMap.{type}` for area RESOLUTION following this prose spec; the validator does NOT read it (it enforces the resolved area against `.types.{type}.areas`). `reviews` / `reports` have NO `.tagAreaMap` entry — they are kind-axis, resolved in step 1. A non-gobbi project ships its own. This rule fixes the priority semantics; the config holds gobbi's per-type tag→area entries.
   - **subsystem types** — `.tagAreaMap.{type}`, a specific subsystem (`wrap-up` / `git` / `evaluation`) outranks the generic `memory` / `process` bucket. Each subsystem type declares its own copy; the values coincide.
   - **mistakes** — its own `.tagAreaMap.{type}` entry, where the trap CLASS (how it fails) outranks the subsystem (where): `refactor` > `verification` > `tooling` > `git` > `codex` > `docs-sync` > `memory` > `assumption`. `domain:` is advisory/fallback input only, never the raw area key. A mistakes record carrying only a "where" tag (`process` / `planning` / `evaluation` / `execution`) matches no trap-class and correctly reaches step 3.
3. **No area matched → user-decision (NOT a fallback area).** When steps 1-2 resolve nothing, the write-time agent emits `NEEDS_CONTEXT` instead of stamping any area. The manager runs a user-decision: the user picks an existing area for that type OR creates a new one. Creating an area is an **Always-Ask edit** to [`memory-vocabulary.json`](../../memory-vocabulary.json) (append to `.types.{type}.areas`, plus a `.tagAreaMap.{type}` entry if it needs tag routing); the answer becomes the record's area. Never invent a new area silently to avoid the decision (the adversarial-proliferation guard).

**Feature-dir normalization.** When the selector input is a feature-dir name (a record promoted up from a feature), normalize it to an area FIRST, then match in step 2. **The project declares the normalization map in [`memory-vocabulary.json`](../../memory-vocabulary.json)** — `.tagAreaMap.featureDirNormalization` (the Wrap-up agent reads it for area resolution following this prose spec; the validator does not read it); gobbi's entries are `git-workflow → git` and `workflow → workflow`. This stops the dir name `git-workflow` from failing to match the `git` area.

#### Refactor procedure — split / merge / rename an area

An area is split / merged / renamed by `git mv`-ing the files and running this procedure. A move changes a file's PATH, so every inbound PATH reference must be repointed. Enumerate ALL reference classes up front — the same discipline as [`../../mistakes/refactor/plan-rename-must-enumerate-all-ref-classes.md`](../../mistakes/refactor/plan-rename-must-enumerate-all-ref-classes.md) and [`../../mistakes/refactor/label-rename-missed-in-fence-and-cross-doc.md`](../../mistakes/refactor/label-rename-missed-in-fence-and-cross-doc.md):

1. **Path refs** — the old path inside a markdown link target and relative-import forms.
2. **Prose refs** — the area / path named in running text.
3. **Skill-name refs** — `required-skills`, `Load Directives`, `Skill()` permission arrays.
4. **Inventory / list refs** — manifests, capability lists, feature-value tables.
5. **Wrapper-description refs** — agent prompt blocks that name the area / path.
6. **Pipeline-label refs** — hook scripts, sub-phase labels, comment strings.

PLUS the two label-rename classes — **in-fence example paths** (paths inside ```` ```markdown ```` example blocks) and **cross-doc** mentions — AND the inbound **`required-mistakes:` PATH refs** (a path-ref sub-class; these are PATH references, NOT plain slugs — §2.4's plain-slug set is only `supersedes` / `superseded_by` / `related` — so they DO break on a move and must be repointed). A moved record's OWN slug identity (`name`, body `[[slug]]` links, the `supersedes` / `superseded_by` / `related` slug-link fields) is rename-robust and needs no repointing.

Run both guards to zero before declaring the refactor done: [`../orchestration/scripts/check-markdown-links.sh`](../orchestration/scripts/check-markdown-links.sh) (zero new broken links) + [`../orchestration/scripts/check-residual-vocab.sh`](../orchestration/scripts/check-residual-vocab.sh) (zero residual old paths).

**Active-mistake-move carve-out (USER-APPROVED 2026-06-21).** [`../mistake/SKILL.md`](../mistake/SKILL.md) states "active mistakes never move" — that rule governs NORMAL operation (only a supersession moves a file, to `archive/`). A **namespace refactor is a distinct, sanctioned operation class** that MAY move an active mistake between areas, BECAUSE: (a) the mistake's OWN slug identity is preserved (still findable by slug and by the recursive consumer read-glob); (b) the move is procedured — it runs the full reference-repoint sweep above INCLUDING the inbound `required-mistakes:` PATH refs, so no inbound citation is left dangling; (c) both guards run to zero.

---

## 2. Frontmatter standard

Every memory file carries base frontmatter; richer types add a small set of declared extension fields. The base is the cross-type-uniform surface tools read; extensions are the per-type refinements.

> **This file is the canonical machine-readable spec.** `rules.md §2` IS the frontmatter standard — there is no separate JSON-Schema file. The bash validator at [`skills/memory/scripts/validate-frontmatter.sh`](scripts/validate-frontmatter.sh) (built separately) enforces §2: required fields, the `type` enum (§2.3), per-type `status` enums (§2.2), the controlled `tags` vocabulary (§2.5), the `feature`-by-`scope` conditional (§2.1), and the no-stray-keys check (§2.6). When §2 and the validator disagree, §2 is the spec and the validator is the bug.

### 2.1 Shared base (every memory file)

Eleven required fields, plus three optional slug-link fields any type may carry (`supersedes`, `superseded_by`, `related`):

```yaml
---
name: {stable slug — the filename without `.md` and without any `YYYY-MM-DD-` prefix}
description: {one line, ≤ ~120 chars}
type: features|notes|decisions|design|mistakes|rules|learnings|backlogs|references|plans|reviews|reports|changelogs|discussions|scenarios|checklists
scope: project | feature
feature: {feature slug when scope=feature (a feature README self-references its own slug); null when scope=project}
status: {the type's allowed status value — see §2.2}
created: YYYY-MM-DD
session: {session-id that created this}
tags: [{...}]         # each tag ∈ the controlled vocabulary (§2.5); may be empty []
keywords: [{...}]      # REQUIRED — freeform, uncontrolled escape-hatch tags; may be empty []
author: claude | codex | user   # REQUIRED — coarse provider tag (the runtime that authored the file)
supersedes: {slug | null}      # OPTIONAL (global) — the slug this file supersedes; §2.4
superseded_by: {slug | null}   # OPTIONAL (global) — the slug that supersedes this file; §2.4
related: [{slug}]              # OPTIONAL (global) — related slugs; absent or [] is fine; §2.4
---
```

| Field | YAML type | Required | Value domain |
|---|---|---|---|
| `name` | string | yes | the file's stable slug (= filename without `.md` and without any `YYYY-MM-DD-` prefix) |
| `description` | string | yes | one line, ≤ ~120 chars |
| `type` | enum | yes | one of the 16 types (§2.3) |
| `scope` | enum | yes | `project` \| `feature` |
| `feature` | string \| null | yes | feature slug when `scope: feature`; `null` when `scope: project` |
| `status` | enum | yes | the type's allowed status set (§2.2) |
| `created` | date `YYYY-MM-DD` | yes | creation date |
| `session` | string | yes | session-id that created it |
| `tags` | list[string] | yes | each tag ∈ the controlled vocabulary (§2.5); may be empty `[]` |
| `keywords` | list[string] | yes | freeform, uncontrolled escape-hatch tags; may be empty `[]` |
| `author` | enum | yes | `claude` \| `codex` \| `user` — the runtime/system that authored the file |
| `supersedes` | string \| null | **no (optional, global)** | plain slug this file supersedes; `null` / absent when none (§2.4) |
| `superseded_by` | string \| null | **no (optional, global)** | plain slug that supersedes this file; `null` / absent when none (§2.4) |
| `related` | list[slug] | **no (optional, global)** | plain slugs of related files; absent or `[]` is fine (§2.4) |

**`keywords` is required-may-be-empty.** Parallel to `tags`: the field must be present, but `[]` is a valid value. It is the freeform overflow for tags outside the §2.5 controlled vocabulary.

**`author` is a coarse provider tag.** It names the runtime/system that authored the file, stable across model versions: `claude` for Claude Code agents, `codex` for Codex agents, `user` for a human who directly authored or edited it. Wrap-up auto-stamps it at promotion from `session.json.system` (`claude-code` → `claude`, `codex` → `codex`); a human hand-edit sets `author: user`.

**`feature` is conditionally required by `scope`.** `scope: feature` ⇒ `feature` is a non-null slug. `scope: project` ⇒ `feature: null`. The validator (§2.6) enforces this conditional.

**Slug-link fields are global-optional.** `supersedes`, `superseded_by`, and `related` are **global optional base fields** — any type may carry them, because supersession and relation are universal lifecycle concepts (a mistake supersedes a mistake, a design supersedes a design, a note may relate to a decision). They are documented once here, NOT repeated as per-type extensions in §2.2. Their value form (plain slugs, never paths or `[[ ]]`) is defined in §2.4.

### 2.2 Per-type extension fields + the status model

**One `status` field per type — one unified lifecycle.** Every file carries exactly ONE `status` field. There is no second lifecycle field: the old `decision_status` (decisions) and `disposition` (backlogs) are **removed** — their meaning folds into `status`. A backlog's `open`/`deferred` distinction is now a `status` value; a decision's `proposed`/`accepted` distinction is now a `status` value. The coarse `archived` status value is **dropped**: a file is archived by living under `archive/` (the directory marks it, per the rule at §2.3 below and the archive note further down), never by a `status: archived` value.

The `status` enum is per-type — each type allows only the values in its row. The **Extensions** column lists each type's NON-link extension fields only; the three slug-link fields (`supersedes`, `superseded_by`, `related`) are **global-optional base fields (§2.1)** that any type may carry, so they are NOT repeated here. A type with no non-link extension shows `(none)` but may still carry the global slug-links.

**Required vs optional extensions.** An extension marked **(required)** below MUST be present on a file of that type — the validator FAILS a file of that type that omits it. Unmarked extensions are optional. Required: `mistakes` → `priority` + `domain`; `backlogs` → `priority` + `project-scope`; `references` → `title` + `source` + `ref_type`; `reviews` → `review_kind`; `reports` → `report_type`. The `review_kind` / `report_type` requirement is the kind axis (L16): the area resolves directly from the kind value (§1.5 step 1), so the kind must always be present.

| Type | `status` enum (unified) | Extensions on top of base (non-link only) |
|---|---|---|
| features (README) | `active` \| `retired` | `value_proposition`, `subsystems` (list) |
| notes | `active` | `features_touched` (list) (plus `loops_completed`, `shipped` — see note) |
| decisions | `proposed` \| `accepted` \| `superseded` | (none) |
| design | `active` \| `superseded` | (none) |
| mistakes | `active` \| `superseded` | `priority` **(required)**, `domain` **(required)** |
| rules | `active` \| `superseded` | `priority`, `established` (date) |
| learnings | `active` \| `superseded` | (none) |
| backlogs | `open` \| `deferred` \| `closed` | `priority` **(required)**, `project-scope` (bool) **(required)**, `shipped_in` (slug\|null) |
| references | `active` \| `superseded` | `title` **(required)**, `source` **(required)**, `accessed` (date), `ref_type` **(required)** |
| plans | `active` \| `superseded` | `task`, `task_count` (number) |
| reviews | `active` | `review_kind` **(required)**, `subject`, `verdict` |
| reports | `active` | `report_type` **(required)**, `related_reports` (list[slug]) (plus `generated_by`, `subject`, `related_reviews`, `related_decisions`) |
| changelogs | `active` | `shipped_in` (slug) |
| discussions | `active` | `outcome` |
| scenarios | `active` | (none) |
| checklists | `active` | `scenario` (slug), `item_status` (enum), `anchor` (slug \| `novel`), `implemented_in` (slug \| null) |

> **Note — `notes` and `reports` keep the richer extension set.** `notes` keeps `loops_completed` and `shipped` alongside `features_touched` — they are useful session → memory links. `reports` keeps `generated_by`, `subject`, `related_reviews`, and `related_decisions` alongside `report_type` and `related_reports`. The validator's per-type allowlist must include these. (`reports`'s `related_reports` / `related_reviews` / `related_decisions` are distinct per-type fields, NOT the global `related` slug-link.)

**Extension-field enums:**

- `priority` = `critical` \| `high` \| `medium` \| `low`
- `ref_type` = `docs` \| `blog` \| `paper` \| `rfc` \| `code` \| `book` \| `other`
- `review_kind` = `adversarial-review` \| `ultrareview` \| `code-review` \| `retrospective` \| `security-audit` \| `license-audit` \| `dep-audit` \| `other`
- `verdict` = `pass` \| `revise` \| `fail` \| `needs-attention` \| `n/a`
- `report_type` = `status` \| `post-mortem` \| `analytics` \| `other`
- `item_status` = `pending` \| `implemented` \| `deferred`

### 2.3 The complete `type` enum — 16 first-class types

There is ONE complete `type` enum. All 16 types are equal, first-class members — the 12 former "promotable" types plus the 4 former "feature-subdir-only" types (`changelogs`, `discussions`, `scenarios`, `checklists`), which are no longer an exception:

```
features | notes | decisions | design | mistakes | rules | learnings | backlogs |
references | plans | reviews | reports | changelogs | discussions | scenarios | checklists
```

**`archive` is NOT a `type`.** It is a directory destination, not an enum value. An archived file keeps its original `type` (e.g., `type: decisions`) and lives under `archive/decisions/`; the directory — not the `type` field — marks it archived.

**Placement is a `scope`/path constraint, NOT an enum split.** Which type may live where is a directory rule, not a separate enum:

- `scenarios` / `checklists` / `changelogs` / `discussions` live **only** under `features/{f}/` (always `scope: feature`).
- `notes` is **project-only**.
- `plans` is **feature-level on the loop path** (a project-level `plans/` may exist for maintainer roadmaps, but is never loop-written).
- The rest (`features`, `decisions`, `design`, `mistakes`, `backlogs`, `references`, `learnings`, `reviews`, `reports`, `rules`) live at **both** levels, defaulting to feature-level and promoting up to project when the content is cross-feature.

The enum says only WHAT a file is; `scope` and the directory say WHERE it lives. (See §3 for the full per-scope placement rules.)

### 2.4 Cross-references and the doc graph

Memory files link to each other in two distinct ways. Keep them separate.

**Lifecycle pointers in frontmatter = plain slugs.** The frontmatter fields `supersedes`, `superseded_by`, and `related` carry **plain slugs** — the target file's `name` (= filename stem), with no path and no `[[ ]]`. Plain slugs are rename-robust and machine-queryable; a path would break on a move, and Obsidian does not rename-update links inside YAML. Example: `supersedes: planning-asserted-skill-without-verifying`, `superseded_by: null`. A `related:` field is a `list[slug]`.

**Navigable graph links in the body = `[[slug]]`.** Human- and graph-navigable links live in the BODY, in a `## Related` section near the doc's end — one bullet per link in `[[slug]]` identifier-link form. Foam / Obsidian derive the graph and backlinks from these. Format:

```markdown
## Related

- [[some-other-slug]] — why it relates (one line)
- [[file-move-needs-link-resolution-check]] — why it relates
```

**Identity = the slug.** A file's identity is its slug (= `name` = filename stem). There is NO `id` / UUID field — the slug is the only identifier, in frontmatter and in `[[slug]]` body links alike.

**Feature-README exception — `name: README`.** A feature directory's `README.md` is a **fixed identity doc**, not a unique wikilink-addressed slug. Its `name` is the literal `README` (the stem of `README.md`), NOT the feature slug — the feature's identity slug lives in `feature: {own-slug}` + the directory name. Because every feature README shares `name: README`, the slug-uniqueness check **exempts `README.md` files**: a shared fixed identity name is not a collision. The `name == filename-stem` check still applies and passes (`README` == `README`). See [`templates/feature.md`](templates/feature.md) for the README frontmatter.

### 2.5 Controlled `tags` vocabulary

`tags` is a **closed** controlled vocabulary, declared **per type** — each type owns ONE independent tag pool. A tag outside its type's pool is a validation failure until that pool is extended. There is no single cross-type tag list: a tag valid for one type may be absent from another's pool (e.g. `tooling` and `assumption` live in the mistakes pool but not the decisions pool).

**The project declares each type's pool in [`memory-vocabulary.json`](../../memory-vocabulary.json)** — `.types.{type}.tags`. This rule is the prose spec; the config holds the values. The validator reads `.types.{type}.tags` via jq and checks every tag on a file against ITS type's pool. A non-gobbi project ships its own copy.

When a tag outside its type's pool is genuinely needed, use the required-may-be-empty `keywords` field (§2.1) — the uncontrolled escape-hatch — or extend that type's pool. `tags` stays controlled so it can be queried with confidence; `keywords` absorbs the freeform long tail. Extending a pool is the same deliberate discipline as extending an area list (§1.5).

### 2.6 Staging-field stripping on promotion

Staging-only fields exist during the session and MUST be stripped when Wrap-up promotes a staged file to memory:

- **`mistake-candidate: true`** — stripped on promotion; its *presence* is what routes the file to `mistakes/`, after which it has done its job.
- **`area:`** — an optional write/stage-time override input that selects the destination area (§1.5 selection rule, step 1). Stripped on promotion: once the file lands under `{type}/{area}/`, the directory encodes the resolved area, so a promoted file carries NO `area:`. Because `area:` never reaches a promoted file, it is NOT a §2.2 type extension and the validator's area checks derive the area from the PATH, not from frontmatter.
- **`finding-id`, eval-routing `disposition`, `promoted-from`, `promoted-at`** — session-routing and session-provenance. `git log` + the base `session` field already carry provenance; the extra keys are redundant ad-hoc drift. Fold any durable provenance into base `session` + `created`; strip the rest.

**Mechanism.** Wrap-up's promotion step reads the staging frontmatter, applies the routing modifier, then writes the destination file with ONLY base + that type's extension fields (a per-type frontmatter allowlist). See [`wrap-up/SKILL.md`](../wrap-up/SKILL.md) for the promotion routing.

**Enforcement.** A promoted file carrying a stray staging-only key is caught by the bash validator's **no-stray-keys** check (§2 lead note) — the validator's per-type allowlist is exactly base (§2.1) + that type's extensions (§2.2), so any key outside it is reported.

---

## 3. Structure rules

The structure rules thread through the 16 per-type specs in [`memory-map.md`](memory-map.md); they are the conventions every type obeys.

- **Directory-as-category.** The type directory is the first controlled-vocabulary facet (§1.1 rule 1). The directory name carries the type; the filename carries the concept. A record's *type* is never re-encoded in its slug.
- **Area sub-namespace.** Every by-area type nests one area level under the type dir (`{type}/{area}/`); the area is resolved by the §1.5 selection rule (explicit `area:` > priority-ordered tag→area map > user-decision on no-match), eager and symmetric on both tiers. `features/{f}/README.md` is the sole structural exception — the feature dir is itself the area axis, so the README is not by-area.
- **One record, one concept (atomicity).** Every file holds exactly one concept — one decision, one mistake, one design topic. Bundle files (`ideation-decisions.md`, `iter1-user-redirects.md`) are forbidden because supersede / archive / promotion then operate at the wrong granularity. Split bundles into one file per concept.
- **Declared scope + promote-up.** Each type declares its scope:
  - **`features/` is its own tier.** A `features/{slug}/` directory is a durable capability dir — not a project-scoped nor feature-tagged content type like the rest of this list. Its `README.md` is the feature's identity document: it carries base frontmatter with `name: README` (the fixed filename stem, NOT the feature slug — §2.4), `scope: feature`, and `feature: {own-slug}` (the `feature` field is self-referential — it names the README's own feature). New feature dirs are created only by user-ratified value-feature addition, never by a sprint.
  - **Project-only** types: `notes` (and `archive` as a destination). These live only at the project root; there is no `features/{f}/` tier for them.
  - **Feature-only (loop path)** types: `plans` — the loop path writes plans only to `features/{f}/plans/`. (A project-level `plans/` may exist for maintainer-authored cross-feature roadmaps, but it is never loop-written.)
  - **Both** types: `decisions`, `design`, `mistakes`, `backlogs`, `references`, `learnings`, `reviews`, `reports`, `rules`. Most default to feature-level and **promote up** to the project root only when the content sets a project-wide convention / cross-feature architecture (user-confirmed through the active runtime's user-decision primitive at Wrap-up). `learnings` / `reviews` / `reports` are **default-feature** like `decisions` / `design`: a feature-scoped one lives in `features/{f}/{type}/`, promoting up to project when cross-feature. `rules` are rare and load-bearing: a project-wide rule lives in `rules/`, a feature-specific rule in `features/{f}/rules/`; either tier is user-confirmed at Wrap-up.
  - The four feature-subdir-only types (`changelogs`, `discussions`, `scenarios`, `checklists`) exist ONLY as `features/{f}/` subdirs.

For the authoritative per-type purpose / hard-boundary / scope / CRUD detail, see [`memory-map.md`](memory-map.md).

---

## 4. Dev-document quality standard

§1-3 govern a file's *address* (naming), its *machine-readable header* (frontmatter), and its *placement* (structure). §4 governs the **prose quality of the body itself** — what a memory doc must read like to be worth keeping. A file can pass §1-3 (correct slug, valid frontmatter, right directory) and still be a bad memory doc if its body only makes sense to someone who sat in the session that wrote it. §4 is the positive bar that closes that gap. Memory-template bodies additionally follow [`memory/SKILL.md` § Authoring style](SKILL.md#authoring-style).

### 4.1 What a good dev-doc looks like (the positive bar)

**Definition.** A dev-document is a memory doc that a **zero-context reader understands end-to-end without the originating session.** "Zero-context reader" = a future agent (or the user) opening the file cold, months later, with no access to the conversation, the working tree state, the table rows, or the task list that the author had in front of them. If understanding the doc requires reconstructing that vanished context, the doc has failed the bar — the knowledge is trapped, not preserved.

Name the standard by what it *delivers*, not only by what it forbids. A good dev-doc:

- **Names its subject in the first line.** The `# Title` states the concept, not a session coordinate. A reader knows what the file is about before reading the body.
- **Carries its own context.** It states the situation it arose from in its own words — enough that the reader does not need the originating session to follow the reasoning.
- **Is self-contained prose.** No load-bearing reference to a session-only coordinate (a table row, a task code, a checkpoint ID, an iteration number) that the reader cannot resolve. See §4.3.
- **Obeys its type's section contract.** A decision reads like a decision (ADR shape); a mistake reads like a mistake; a learning reads like a learning. See §4.2.
- **Does one type's job.** Type-purity (§4.1.1) — one doc, one type. A doc that is half-decision, half-journal helps neither reader.

**Type-purity (4.1.1) — one doc, one type's job.** Borrowed from [Diátaxis](diataxis.fr): documentation types serve different reader needs, and mixing them in one doc serves none well. Gobbi keeps its 16 memory types (§1.2, [`memory-map.md`](memory-map.md)); this is a *prose* rule, not a re-home — each doc commits to its declared `type`'s job. A `decisions/` file states a conclusion and its rationale; it does not also narrate the session's blow-by-blow (that is a `notes/` job). A `learnings/` file teaches a transferable technique; it does not also log what shipped (that is `notes/`). When a draft tries to do two type-jobs, split it into one file per type and cross-link (§3 atomicity).

**Real before/after (from this tree).** The same positive-vs-trapped distinction §1.3 applies to slugs applies to bodies:

| Trapped (reader needs the vanished session) | Self-contained (zero-context reader follows it) | Why the fix works |
|---|---|---|
| "Per T01 row 5.5 we moved the step as discussed in iter2." | "Worktree creation moved into the Config step procedure: the worktree must exist before `session.json` stamps git fields, so the step now runs at Config-time." | Names the *what* and the *why* in the body instead of pointing at a task code + table row only the author can resolve. |
| A `decisions/` file whose body is three paragraphs of "then we tried X, then the user said Y, then we…" | A `decisions/` file with `## Context` / `## Decision` / `## Rationale` / `## Alternatives` / `## Consequences` (ADR shape, §4.2). | The narrative belongs in `notes/`; the decision body states the conclusion + rationale a future reader needs. Reclassify the narrative to `notes/` (§4.3) — never delete it. |
| `state.json` "retire per design §7" — an instruction whose meaning depended on a prior session's reading. | A `mistakes/` doc that states the live mechanism, its callers, and the misread, in its own words. | The reader can act on the doc without re-deriving what "retire" referred to. |

### 4.2 Per-type section contracts

A promoted doc obeys the same section contract its staging template (`memory/templates/{type}.md`) already encodes. The templates govern *staging*; §4.2 promotes those section shapes to a *quality rule on the promoted doc* so the contract survives promotion:

| Type | Body section contract |
|---|---|
| `decisions`, `design` | ADR-shaped: `## Context` → `## Decision` (or `## Approach`) → `## Rationale` → `## Alternatives considered` → `## Consequences`. State the conclusion and why the alternatives lost. |
| `mistakes` | `## What happened` → `## Why it happens` (the mistaken assumption) → `## Correct approach` → `## How to detect` (trigger signals before repeating). |
| `learnings` | `## Insight` → `## Context` → `## Reason` → `## How` → `## Counter-cases` (where the insight does NOT hold). |
| `notes` | `## What happened` → `## What shipped` → `## What got stuck` → `## What shifted` → `## Decisions to respect` → `## Next session`. The session journal + handoff — the home for narrative, the in-flight stuck, the standing decisions a future session must not re-litigate, and the next-session pointer. |

Other types (`features`, `rules`, `references`, `plans`, `reviews`, `reports`, `backlogs`, and the four feature-subdir types) follow their own template's section shape in [`memory/templates/`](templates/). The principle is uniform: **the promoted body matches its type's template contract**, so a reader of any doc of a given type meets a predictable shape.

### 4.3 Self-contained prose — never delete narrative, reclassify it

**Rule.** A doc body MUST NOT carry **load-bearing** references to session-only coordinates — task codes (`T01`, `t1g`), iteration markers (`iter2`, `draft-iter1`), evaluator finding IDs (`COD-3`, `F4`), table coordinates (`row-5-5`), or checkpoint IDs — where resolving the reference is *required* to understand the doc. Provenance belongs in **frontmatter** (`session` + `created` carry it; `git log` carries the rest) plus, optionally, a single `## Source` footer line pointing at the canonical session artifact for a reader who wants full detail. The body itself stands alone.

**Narrative is not a defect — mislabeling it is.** When a doc *is* a session narrative ("then we tried X, then Y broke, then the user redirected"), that content is valuable history. The fix is **never to delete it** — deleting a thing without a replacement leaves a vacuum (see [`mistakes/design-literal-retire-instruction-without-replacement.md`](../../mistakes/design-literal-retire-instruction-without-replacement.md)). The fix is to **reclassify** the narrative to `notes/` (its correct type, §4.1.1), where chronological session journals belong, and leave the evergreen type (decision/design/learning) carrying only its self-contained conclusion. Strip inline session-coordinates from the *evergreen* types only; `notes/` keeps its narrative voice.

**Grep-assistable check (advisory, not a hard gate).** A scan that surfaces *candidate* session-coordinate leaks in evergreen-type bodies — review each hit, since a literal mention inside a quote or a `## Source` footer is legitimate:

```bash
grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' \
  .gobbi/projects/gobbi/ \
  --include='*.md' \
  -l 2>/dev/null | grep -vE '/(archive|sessions|skills|agents|tmp)/'
```

### 4.4 Frontmatter conformance — the validator's per-type no-stray-keys check

§2.6 says staging-routing fields are stripped on promotion. §4.4 makes that checkable: a promoted doc carries **only** base + its type's declared extensions (§2.1, §2.2). Any leftover **staging-routing key** is a conformance leak. The check is the **validator's per-type no-stray-keys check** (`skills/memory/scripts/validate-frontmatter.sh`, §4.5), never a blanket grep — its per-type allowlist is exactly base (§2.1) + that type's extensions (§2.2), so it never strips a key that is legitimate for that doc's type/dir (the **safety invariant**). The key-sets below document *what* staging-routing residue looks like; the validator is the mechanism that enforces it.

**Illegitimate staging-routing key-set S** — enumerated in BOTH hyphen and underscore spellings, because both spellings have appeared in real staged frontmatter and both must be caught:

| Concept | Hyphen spelling | Underscore spelling |
|---|---|---|
| mistake routing flag | `mistake-candidate` | `mistake_candidate` |
| evaluator finding id | `finding-id` | `finding_id` |
| eval confidence | `confidence` | `confidence` |
| eval severity | `severity` | `severity` |
| surfacing evaluator | `surfaced-by` | `surfaced_by` |
| promotion provenance (source) | `promoted-from` | `promoted_from` |
| promotion provenance (time) | `promoted-at` | `promoted_at` |
| finding-disposition provenance | `addressed-by` | `addressed_by` |

**Session-routing residue** — session-internal coordinates that identify a file's position within a session (which loop iteration or evaluation round produced it). These coordinates have no meaning to a future reader; provenance is already carried by `session` + `created` in base frontmatter and by `git log`. Both spellings must be caught:

| Concept | Hyphen spelling | Underscore spelling |
|---|---|---|
| workflow loop phase | `loop` | `loop` (same) |
| iteration counter | `iter` | `iter` (same) |
| slug duplicate | `slug` | `slug` (same) |
| finding source label | `finding-source` | `finding_source` |
| workflow phase coordinate | `phase` | `phase` (same) |
| loop iteration counter | `loop-iter` | `loop_iter` |
| sub-step coordinate | `sub-step` | `sub_step` |
| session-id (redundant with base `session`) | `session-id` | `session_id` |

> **`task` and `scenario` are NOT residue — they are §2.2 type extensions.** `task` is a `plans` extension and `scenario` is a `checklists` extension (§2.2), so on those types they are legitimate keys, not session-routing residue. They are deliberately absent from the residue table above. The validator's per-type allowlist is the authority: it accepts `task` on `plans/` and `scenario` on `checklists/`, and reports either as a stray key on any OTHER type. Listing them as residue here (or in the §4.5 advisory grep) would wrongly flag every live `plans/` / `checklists/` file that uses its own extension.

**The KEEP set IS the validator's per-type allowlist — no separate hand-maintained list.** A key is kept (never reported stray) **iff** it is on the file type's allowlist, which is exactly:

> **base (§2.1, the 11 required — including `keywords` and `author` — + the 3 global slug-links `supersedes` / `superseded_by` / `related`) ∪ that type's §2.2 declared extensions.**

There is no second, broader keep-list. The old pre-standard keep-list enumerated keys that are NOT §2.2 extensions — `design-id`, `discussion-id`, `topic`, `category`, `project`, `last_updated`, `plan`, `artifact_ref`, and a generic `source` — as if they were always-legitimate. Under the §2.2 model they are NOT: a key is legitimate only on the type(s) whose §2.2 row declares it (e.g. `source` is a `references` extension, legitimate on `references/` and stray elsewhere). The validator enforces exactly the per-type allowlist above, so any key outside it — every key in S, every session-routing residue key, every stale ad-hoc key, and the removed `decision_status` / `disposition` — is a stray key.

> **Removed from the model.** `decision_status` (decisions) and `disposition` (backlogs) no longer exist — §2.2 folded both into the single `status` field (a decision's `proposed`/`accepted` and a backlog's `open`/`deferred` are now `status` values). They are NOT on any type's allowlist: a live file still carrying `decision_status`, or `disposition` anywhere (including `backlogs/`), fails the validator's no-stray-keys check as a stray key. The legacy-data normalization that removes them from existing files is a separate, deferred task.

**When in doubt, KEEP.** If a key is base (§2.1, including the global slug-links) or one of the doc type's declared §2.2 extensions, it is preserved without question. Any key outside that per-type allowlist — every key in S, every session-routing residue key, every stale ad-hoc key (`design-id`, `topic`, `category`, …), and the removed `decision_status` / `disposition` — is a stray key the validator reports.

**File-selection predicate P (where the conformance check operates):**

> Operate on files in `P_live`: NOT under `archive/` (frozen, §4.6), NOT under `sessions/` / `skills/` / `agents/` / `tmp/` (non-memory surfaces). For each file F, the validator reports any frontmatter key that is not in `base (§2.1) ∪ F-type-extensions (§2.2)` as a stray key. The allowlist is per-type, so a key legitimate for one type (e.g. `verdict` on `reviews/`) is correctly reported as stray on another.

**Safety invariant (locked):** never report a key that is legitimate for that doc's type/dir as stray. Base keys (`name` / `description` / `type` / `scope` / `feature` / `status` / `created` / `session` / `tags` / `keywords` / `author`), the three global slug-link base fields (`supersedes` / `superseded_by` / `related`), and the per-type extensions in §2.2 (`verdict` / `review_kind` / `subject` on `reviews/`, `priority` / `domain` on `mistakes/`, `title` / `source` / `ref_type` on `references/`, etc.) are always preserved — that per-type allowlist IS the protected set.

### 4.5 The conformance gate — the bash validator

The canonical conformance gate is the bash validator at [`skills/memory/scripts/validate-frontmatter.sh`](scripts/validate-frontmatter.sh). It is a **strict superset** of the old `find | xargs grep` leak-scan: rather than matching a hand-maintained list of leak keys, it validates every frontmatter key against the per-type allowlist (base §2.1 + that type's extensions §2.2) and also checks required fields, the 16-type enum (§2.3), the per-type `status` enum (§2.2), `scope` + the `feature` conditional (§2.1), extension enums, `name == filename stem`, and slug uniqueness. The no-stray-keys check subsumes the old leak-scan: any key outside the per-type allowlist — including session-routing residue and the removed `decision_status` / `disposition` — is reported. The validator is **archive-safe** by construction: its `P_live` prune excludes `archive/` / `sessions/` / `skills/` / `agents/` / `tmp/` / `worktrees/` (the §4.6 archive-exclusion), so a sweep never touches frozen history.

Run it over the whole live tree, or pass paths to scope it:

```bash
# Validate the whole P_live tree (default):
skills/memory/scripts/validate-frontmatter.sh

# Validate specific files:
skills/memory/scripts/validate-frontmatter.sh path/to/file.md ...
```

**Fast advisory pre-check (optional).** The old one-liner below is no longer the gate — the validator is authoritative — but it remains a quick, archive-safe, underscore-aware scan for the most common staging-routing leaks when the full validator is not at hand:

```bash
# Advisory only — lists live memory files carrying a common staging-routing key.
# The validator (above) is the authoritative gate; this is a fast pre-check.
find .gobbi/projects/gobbi -name '*.md' \
  -not -path '*/archive/*' \
  -not -path '*/sessions/*' \
  -not -path '*/skills/*' \
  -not -path '*/agents/*' \
  -not -path '*/tmp/*' \
  -print0 \
# NOTE: `task` and `scenario` are intentionally NOT in this regex — they are §2.2
# type extensions (plans / checklists), not residue; matching them here would
# false-positive on every live plans/ / checklists/ file. The authoritative gate
# (the validator) accepts them per-type; this advisory scan must not contradict it.
| xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|loop|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id|decision_status):' \
  2>/dev/null
```

A clean validator run reports no violations; any reported file is a doc to normalize so it carries only base + its type's extensions (§4.4). Note: `disposition` is no longer a backlogs extension — it folded into `status` (§2.2) — so it is now a stray key wherever it appears; the validator flags it like any other.

### 4.6 Scope edge — `archive/` is excluded

Frozen `archive/` docs are excluded from this standard, from any retrofit pass, and from the gate. An archived file is terminal history; it is not normalized or re-prosed. Every command and predicate in §4 carries the `archive/` exclusion (`-not -path '*/archive/*'` / "NOT under `archive/`") so a sweep never touches frozen history.

---

## Cross-references

- Path-and-type semantics (which directory holds what, who writes it, when, which template stamps it) → [`memory-map.md`](memory-map.md)
- The assistant's RECORD procedure and memory-tier access matrix → [`SKILL.md`](../record/SKILL.md)
- Staging → memory promotion routing (including the frontmatter allowlist on promotion) → [`wrap-up/SKILL.md`](../wrap-up/SKILL.md)
- Slug + collision policy for staging files → [`evaluation/SKILL.md` § Slug + collision policy](../evaluation/SKILL.md#slug--collision-policy)
