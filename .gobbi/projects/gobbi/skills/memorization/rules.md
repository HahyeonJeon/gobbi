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

## 4. Dev-document quality standard

§1-3 govern a file's *address* (naming), its *machine-readable header* (frontmatter), and its *placement* (structure). §4 governs the **prose quality of the body itself** — what a memory doc must read like to be worth keeping. A file can pass §1-3 (correct slug, valid frontmatter, right directory) and still be a bad memory doc if its body only makes sense to someone who sat in the session that wrote it. §4 is the positive bar that closes that gap.

### 4.1 What a good dev-doc looks like (the positive bar)

**Definition.** A dev-document is a memory doc that a **zero-context reader understands end-to-end without the originating session.** "Zero-context reader" = a future agent (or the user) opening the file cold, months later, with no access to the conversation, the working tree state, the table rows, or the task list that the author had in front of them. If understanding the doc requires reconstructing that vanished context, the doc has failed the bar — the knowledge is trapped, not preserved.

Name the standard by what it *delivers*, not only by what it forbids. A good dev-doc:

- **Names its subject in the first line.** The `# Title` states the concept, not a session coordinate. A reader knows what the file is about before reading the body.
- **Carries its own context.** It states the situation it arose from in its own words — enough that the reader does not need the originating session to follow the reasoning.
- **Is self-contained prose.** No load-bearing reference to a session-only coordinate (a table row, a task code, a checkpoint ID, an iteration number) that the reader cannot resolve. See §4.3.
- **Obeys its type's section contract.** A decision reads like a decision (ADR shape); a mistake reads like a mistake; a learning reads like a learning. See §4.2.
- **Does one type's job.** Type-purity (§4.1.1) — one doc, one type. A doc that is half-decision, half-journal helps neither reader.

**Type-purity (4.1.1) — one doc, one type's job.** Borrowed from [Diátaxis](diataxis.fr): documentation types serve different reader needs, and mixing them in one doc serves none well. Gobbi keeps its 13 memory types (§1.2, [`memory-map.md`](memory-map.md)); this is a *prose* rule, not a re-home — each doc commits to its declared `type`'s job. A `decisions/` file states a conclusion and its rationale; it does not also narrate the session's blow-by-blow (that is a `notes/` job). A `learnings/` file teaches a transferable technique; it does not also log what shipped (that is `notes/`). When a draft tries to do two type-jobs, split it into one file per type and cross-link (§3 atomicity).

**Real before/after (from this tree).** The same positive-vs-trapped distinction §1.3 applies to slugs applies to bodies:

| Trapped (reader needs the vanished session) | Self-contained (zero-context reader follows it) | Why the fix works |
|---|---|---|
| "Per T01 row 5.5 we moved the step as discussed in iter2." | "Worktree creation moved into the Config step procedure: the worktree must exist before `session.json` stamps git fields, so the step now runs at Config-time." | Names the *what* and the *why* in the body instead of pointing at a task code + table row only the author can resolve. |
| A `decisions/` file whose body is three paragraphs of "then we tried X, then the user said Y, then we…" | A `decisions/` file with `## Context` / `## Decision` / `## Rationale` / `## Alternatives` / `## Consequences` (ADR shape, §4.2). | The narrative belongs in `notes/`; the decision body states the conclusion + rationale a future reader needs. Reclassify the narrative to `notes/` (§4.3) — never delete it. |
| `state.json` "retire per design §7" — an instruction whose meaning depended on a prior session's reading. | A `mistakes/` doc that states the live mechanism, its callers, and the misread, in its own words. | The reader can act on the doc without re-deriving what "retire" referred to. |

### 4.2 Per-type section contracts

A promoted doc obeys the same section contract its staging template (`memorization/templates/{type}.md`) already encodes. The templates govern *staging*; §4.2 promotes those section shapes to a *quality rule on the promoted doc* so the contract survives promotion:

| Type | Body section contract |
|---|---|
| `decisions`, `design` | ADR-shaped: `## Context` → `## Decision` (or `## Approach`) → `## Rationale` → `## Alternatives considered` → `## Consequences`. State the conclusion and why the alternatives lost. |
| `mistakes` | `## What happened` → `## Why it happens` (the mistaken assumption) → `## Correct approach` → `## How to detect` (trigger signals before repeating). |
| `learnings` | `## Insight` → `## Context` → `## Why it matters` → `## How to apply` → `## Counter-cases` (where the insight does NOT hold). |
| `notes` | `## What happened` → `## What shipped` → `## What got stuck` → `## What shifted` → `## Decisions to respect` → `## Next session`. The session journal + handoff — the home for narrative, the in-flight stuck, the standing decisions a future session must not re-litigate, and the next-session pointer. |

Other types (`features`, `rules`, `references`, `plans`, `reviews`, `reports`, `backlogs`, and the four feature-subdir types) follow their own template's section shape in [`memorization/templates/`](templates/). The principle is uniform: **the promoted body matches its type's template contract**, so a reader of any doc of a given type meets a predictable shape.

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

### 4.4 Frontmatter conformance — the type-aware allowlist (FIX-1)

§2.3 says staging-routing fields are stripped on promotion. §4.4 makes that checkable: a promoted doc carries **only** base + its type's declared extensions (§2.1, §2.2). Any leftover **staging-routing key** is a conformance leak. The strip is a **type-aware allowlist**, never a blanket grep — it must never strip a key that is legitimate for that doc's type/dir (the **safety invariant**).

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

**Session-routing residue** — session-internal coordinates that identify a file's position within a session (which task, loop iteration, or evaluation round produced it). These coordinates have no meaning to a future reader; provenance is already carried by `session` + `created` in base frontmatter and by `git log`. Both spellings must be caught:

| Concept | Hyphen spelling | Underscore spelling |
|---|---|---|
| task code / task id | `task` | `task` (same) |
| workflow loop phase | `loop` | `loop` (same) |
| scenario identifier | `scenario` | `scenario` (same) |
| iteration counter | `iter` | `iter` (same) |
| slug duplicate | `slug` | `slug` (same) |
| finding source label | `finding-source` | `finding_source` |
| workflow phase coordinate | `phase` | `phase` (same) |
| loop iteration counter | `loop-iter` | `loop_iter` |
| sub-step coordinate | `sub-step` | `sub_step` |
| session-id (redundant with base `session`) | `session-id` | `session_id` |

**KEEP — never strip:** The following keys are cross-reference/provenance/content-tag keys that carry durable meaning and MUST always be preserved: `related`, `supersedes`, `superseded_by`, `source`, `design-id`, `domain`, `priority`, `ref_type`. These are legitimate type extensions (§2.2) or cross-linking fields — they are NOT members of S.

**Conditional member — `disposition`.** `disposition` is in S (a leak, must be stripped) **ONLY when the file is NOT under a `backlogs/` directory.** On `backlogs/`, `disposition: open\|deferred` is a **legitimate type extension** (§2.2 line 110) and MUST be preserved — stripping it there violates the safety invariant.

**File-selection predicate P (where the conformance rule operates):**

> Operate on files in `P_live`: NOT under `archive/` (frozen, §4.6), NOT under `sessions/` / `skills/` / `agents/` / `tmp/` (non-memory surfaces). For each file F:
> - strip every key in `S \ {disposition}` (both spellings) unconditionally;
> - strip `disposition` from F only if F is NOT under a `backlogs/` directory.

**Safety invariant (locked):** never strip a key that is legitimate for that doc's type/dir. Base keys (`name` / `description` / `type` / `scope` / `feature` / `status` / `created` / `session` / `tags`) and the per-type extensions in §2.2 (`disposition` on `backlogs/`, `verdict` / `review_kind` / `subject` on `reviews/`, `priority` / `domain` on `mistakes/`, etc.) are always preserved. The cross-ref/provenance/content-tag keys listed in KEEP above are equally protected.

### 4.5 The archive-safe, underscore-aware grep-gate

The mechanical conformance gate scans `P_live` for any illegitimate-key leak and lists offending files. It MUST be **archive-safe** (`-not -path '*/archive/*'` — frozen archive docs are out of scope, §4.6) and **underscore-aware** (catch both hyphen and underscore spellings of every key in S):

```bash
# Lists every live memory file carrying an illegitimate staging-routing key.
# Archive-safe (skips frozen archive/) and underscore-aware (both spellings).
# Includes session-routing residue keys (task/loop/scenario/iter/slug/finding-source).
find .gobbi/projects/gobbi -name '*.md' \
  -not -path '*/archive/*' \
  -not -path '*/sessions/*' \
  -not -path '*/skills/*' \
  -not -path '*/agents/*' \
  -not -path '*/tmp/*' \
  -print0 \
| xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):' \
  2>/dev/null
```

`disposition` is intentionally **omitted** from the gate regex above: it is legitimate on `backlogs/` and only a leak elsewhere, so a blanket `disposition`-match would false-positive on every legitimate backlog file (the safety invariant, §4.4). To check the conditional `disposition` leak separately, run the same `find` and grep for `^disposition:`, then exclude `*/backlogs/*` from the path filter. A clean gate prints nothing (zero leak files); any printed path is a doc to normalize via the type-aware allowlist (§4.4).

### 4.6 Scope edge — `archive/` is excluded

Frozen `archive/` docs are excluded from this standard, from any retrofit pass, and from the gate. An archived file is terminal history; it is not normalized or re-prosed. Every command and predicate in §4 carries the `archive/` exclusion (`-not -path '*/archive/*'` / "NOT under `archive/`") so a sweep never touches frozen history.

---

## Cross-references

- Path-and-type semantics (which directory holds what, who writes it, when, which template stamps it) → [`memory-map.md`](memory-map.md)
- The assistant's MEMORIZATION procedure and memory-tier access matrix → [`SKILL.md`](SKILL.md)
- Staging → project-memory promotion routing (including the frontmatter allowlist on promotion) → [`wrap-up/SKILL.md`](../wrap-up/SKILL.md)
- Slug + collision policy for staging files → [`evaluation/SKILL.md` § Slug + collision policy](../evaluation/SKILL.md#slug--collision-policy)
