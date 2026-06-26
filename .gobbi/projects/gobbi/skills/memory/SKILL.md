---
name: memory
description: "MUST load when memorizing — staging a finding/decision/mistake during a loop, or promoting it to durable memory at Wrap-up. The What/When/How of gobbi memory."
allowed-tools: Read, Grep, Glob, Bash
---

# Memory

This skill is the **main description of gobbi's durable memory** and the home of the **memorize procedure** — the What / When / How an agent follows to remember something across sessions. Memory and capture are two halves of one value-feature: [`record/SKILL.md`](../record/SKILL.md) owns the **capture / staging side** (the per-loop RECORD sub-phase that writes session staging), and this doc owns the **durable side** (what memory is, when it is written, how the staging→promotion lifecycle completes). Together they are the `memory` value-feature defined in [`gobbi/SKILL.md` § Product value-features](../gobbi/SKILL.md#product-value-features). This doc is the **procedure** — the paths, the standard, and the per-type schemas live in the siblings it points to, never restated here.

---

## What memory is — tiers and types

The **What**. Durable memory is a set of typed markdown trees under `.gobbi/projects/{project-name}/`, on two tiers:

- **Project tier** — `.gobbi/projects/{project-name}/{type}/` (e.g. `mistakes/`, `rules/`, `decisions/`, `notes/`). Knowledge that crosses features or is intentionally project-scope.
- **Feature tier** — `features/{feature-name}/...`. A `features/{slug}/` directory is its own tier — a durable-capability dir, not a tagged content type. It holds a README identity doc plus type-scoped subdirs.

Each type is project-only, feature-scoped, or both — which type sits in which bucket is owned by [`rules.md` § 3](rules.md#3-structure-rules) and the per-type homes in [`memory-map.md`](memory-map.md), not restated here. This is the conceptual shape; the enumeration is not here.

- For which type lives where, who writes it, and when → [`memory-map.md`](memory-map.md). It owns the path inventory and the per-type canonical homes — this doc never restates the path table.
- For the complete 16-type `type` enum (one flat enum — all types are first-class; placement is a `scope`/directory constraint, not an enum split) → [`rules.md` § 2.3](rules.md#23-the-complete-type-enum--16-first-class-types); for which type lives at which tier → [`rules.md` § 3](rules.md#3-structure-rules).
- For the feature dir's internal shape (the README + 14 subdirs) → [`templates/feature.md`](templates/feature.md). This doc never restates the 14 subdirs.

---

## When memorization happens

The **When**. A memorized fact moves through three beats:

1. **Staged** during a loop's RECORD sub-phase — the assistant writes the finding/decision/mistake to session staging at `sessions/.../{N}-{loop}/staging/{type}/`. Loop RECORD never writes durable memory.
2. **Promoted** to durable memory at Wrap-up — Wrap-up reads the accumulated staging across all loops and writes it to `.gobbi/projects/{project-name}/...`. Wrap-up is the **sole writer** to durable memory.
3. **Read** at the start of the next session — promoted memory is loaded back in (e.g. mistakes via the load-at-start model). This beat closes the lifecycle; building a read procedure is not this doc's job.

**Vocabulary caveat.** "Memorization" names the **Wrap-up promotion stage** (stage 2 of the WORK pipeline), not the per-loop capture sub-phase, which is **RECORD**. The two are distinct — see [`wrap-up/SKILL.md` § RECORD Phase](../wrap-up/SKILL.md#record-phase), which states the distinction; this doc does not re-explain it.

- For the staging mechanics (what RECORD writes, PASS-only, cumulative staging) → [`record/SKILL.md` § RECORD Phase](../record/SKILL.md#record-phase).
- For the promotion mechanics (the 5-stage pipeline, stage 2 "memorization") → [`wrap-up/SKILL.md` § The 5-stage pipeline](../wrap-up/SKILL.md#the-5-stage-pipeline).
- For the read-at-start model (the read beat) → [`mistake/SKILL.md` § P1](../mistake/SKILL.md#p1--load-mistakes-before-starting-work).

---

## How — the staging → promotion lifecycle

The **How**, part 1. When an agent has something worth remembering, the write flows like this:

1. **Stage** the file under the correct type at session `staging/{type}/{slug}.md` — the type you pick determines the destination, so pick it from [`memory-map.md`](memory-map.md) + [`rules.md` § 3](rules.md#3-structure-rules). See [`record/SKILL.md` § RECORD Phase](../record/SKILL.md#record-phase) for the per-loop stage step-table and idempotency.
2. **Stamp** the matching type template so the file is structured enough to promote — [`templates/{type}.md`](templates/).
3. At Wrap-up, **Wrap-up reads** the accumulated staging across all loops — [`wrap-up/SKILL.md` § The 5-stage pipeline](../wrap-up/SKILL.md#the-5-stage-pipeline).
4. Wrap-up **routes** each file deterministically to its memory destination — [`wrap-up/SKILL.md` § Staging → Memory routing](../wrap-up/SKILL.md#staging--memory-routing).
5. Wrap-up **strips** the staging-only fields, then writes through the per-type allowlist — [`wrap-up/SKILL.md` § Frontmatter allowlist on promotion](../wrap-up/SKILL.md#frontmatter-allowlist-on-promotion-strip-staging-only-fields) and [`rules.md` § 2.6](rules.md#26-staging-field-stripping-on-promotion).

This doc does **not** contain the routing table — [`wrap-up/SKILL.md`](../wrap-up/SKILL.md) owns it.

---

## How — sole writer and the access boundary

The **How**, part 2: who may write memory, and when. The invariant: a working loop's RECORD writes **only** to session staging; **Wrap-up is the sole writer** to durable memory. Two documented exceptions exist — the Interview bootstrap (empty-memory first run, [`interview/SKILL.md`](../interview/SKILL.md)) and the Preparation `generate-now` skill promotion before Planning ([`preparation/SKILL.md`](../preparation/SKILL.md)).

| Who | Writes to |
|---|---|
| Working loop (Ideation / Preparation / Planning / Execution) RECORD | session `staging/` **only** — never durable memory |
| Wrap-up | the **sole writer** to durable memory (`.gobbi/projects/{project-name}/...`) |

This is a summary, not the full matrix. The authoritative per-tier read/write matrices live in [`record/SKILL.md` § Memory Access Matrix](../record/SKILL.md#memory-access-matrix) (the assistant role's staging surfaces, including the two exception rows) and [`wrap-up/SKILL.md` § Memory Access Matrix](../wrap-up/SKILL.md#memory-access-matrix) (Wrap-up's write privileges). Do not reproduce them here.

---

## How — the standard every memorized file obeys

The **How**, part 3. Every memory write obeys one standard — naming, frontmatter, structure, and dev-doc quality — and that standard is [`rules.md`](rules.md). This section routes you there at write time; it does not teach the standard.

- **Address** (the slug / naming convention) → [`rules.md` § 1](rules.md#1-naming-standard).
- **Header** (base frontmatter + per-type extensions) → [`rules.md` § 2](rules.md#2-frontmatter-standard).
- **Placement** (scope, atomicity, tier) → [`rules.md` § 3](rules.md#3-structure-rules).
- **Prose quality** (the zero-context-reader bar, the type-aware allowlist, the §4.5 grep-gate) → [`rules.md` § 4](rules.md#4-dev-document-quality-standard).

The per-type **section contracts** each memorized file's body obeys are stamped from [`templates/`](templates/).

**Disambiguation.** `memory/rules.md` (the standard) is not `memory/templates/rules.md` (the rules-TYPE template) and not `rules/` (the rules memory type) — three distinct things, two sharing the filename. The CRITICAL disambiguation block at the top of [`rules.md`](rules.md) is the source; this doc only points at it.

---

## Memory Access Matrix

This skill is **read-only-procedural** — it teaches the memorize procedure and routes to the docs that do the writing. An agent that loads `memory/SKILL.md` gets no write authority from it.

| Memory tier | Access from a `memory/SKILL.md` loader |
|---|---|
| All memory tiers (project + feature) | **READ-ONLY** — this skill is a procedure reference; it grants no write surface |

The actual writes happen under [`record/SKILL.md` § Memory Access Matrix](../record/SKILL.md#memory-access-matrix) (staging) and [`wrap-up/SKILL.md` § Memory Access Matrix](../wrap-up/SKILL.md#memory-access-matrix) (promotion). Those are the authoritative matrices.

---

## Core Principles

> **Stage first, promote at Wrap-up.**

A working loop's RECORD writes only to session staging; Wrap-up promotes. A loop's RECORD touching durable memory is a constraint violation — see [`record/SKILL.md` § Core Principles](../record/SKILL.md#core-principles).

> **One record, one concept.**

Every memory file holds exactly one concept — one decision, one mistake, one design topic. Bundle files are forbidden because supersede / archive / promotion then operate at the wrong granularity — see [`rules.md` § 3](rules.md#3-structure-rules).

> **Supersede and move-on-terminal, never delete.**

A superseded file is flipped in place (`status: superseded` + `superseded_by:`) and, at terminal state, moved (`git mv`) to `archive/{type}/` — never deleted. The authoritative semantics live in [`wrap-up/SKILL.md` § Core Principles](../wrap-up/SKILL.md#core-principles) and [`record/SKILL.md` § Memory Access Matrix](../record/SKILL.md#memory-access-matrix).

> **Compaction is a Wrap-up operation — RECORD never compacts.**

Folding an over-cap `{type}/{area}/` directory into one consolidated Map-of-Content file is **compaction** — a durable-memory write owned by Wrap-up's promotion stage. The standard is [`rules.md` § 5](rules.md#5-memory-compaction-the-consolidated--map-of-content-carve-out); a working loop's RECORD stages only and **never compacts**. See [`record/SKILL.md` § Core Principles](../record/SKILL.md#core-principles) for the capture-side boundary.

> **A memorized file must survive its session.**

A memory doc must be understandable by a zero-context reader — a future agent opening it cold, with no access to the originating session. The bar is [`rules.md` § 4](rules.md#4-dev-document-quality-standard). A correction not recorded is a correction repeated — see [`mistake/SKILL.md`](../mistake/SKILL.md) for the mistake type's loop.

---

## Authoring style

How every memory doc and every template body is written. The bar is a dev-doc a zero-context reader scans fast — not an essay.

> **Lists and tables over prose.**

If the content is a set of fixed fields, options, or steps, use a table or a bullet list — not sentences. Prose is for the one idea a list cannot hold.

> **Short dev-vibe labels.**

Section and field labels are short nouns a developer would use. Rename narrative labels to their plain form:

| Avoid | Use |
|---|---|
| Why it applies / Why it matters | Reason |
| How to apply | How |
| When to write / Location / File naming / Lifecycle | Write it (one table) |
| Distinguishing X from neighbors | Vs other types |
| Item template | Frontmatter + body |

> **Plain, short words.**

"use" not "utilize"; "fix" not "implement a solution for". One idea per sentence. Cut filler ("just", "really", "in order to", "it's worth noting"). Principle 7.

> **Do not restate a global rule.**

The staging→promotion lifecycle, supersede-not-delete, and move-on-terminal are owned by `rules.md` / `wrap-up/SKILL.md` / `archive.md`. Link them; do not re-explain them in a template. A template carries only what is specific to its type.

> **One section per job.**

Fold type-specific guidance under a single `## Notes` list rather than a separate H2 per tip. Fewer sections, same content.

> **Core principles are a documentation discipline, shaped as a blockquote + body.**

A template's `## Core principles` section states what the `{type}/` doc must capture and how to write it so a future reader is served — never how to perform the underlying activity (write "record the conclusion", not "make the decision"). Each principle is a bold one-line directive in a blockquote — a verb that names producing or maintaining the doc (`Record`, `Write`, `Capture`, `Keep`, `State`, `Preserve`, `Carry`, …), never the underlying activity (not `Decompose` / `Assess` / `Decide`) — then a one-sentence `so [a reader gets X without redoing the work]` rationale below. A type carries 1-3 such principles — only as many as guard a real reader-failure mode.

---

## Constraints

- **MUST stage under the correct type** — the type determines the destination; pick it from [`memory-map.md`](memory-map.md) + [`rules.md` § 3](rules.md#3-structure-rules).
- **MUST stamp the matching template** — freeform writes are forbidden; see [`templates/`](templates/).
- **MUST obey the standard** — naming + frontmatter + structure + dev-doc quality per [`rules.md`](rules.md).
- **MUST NOT write durable memory from a working loop** — staging is the only write surface for Ideation / Preparation / Planning / Execution RECORD; Wrap-up promotes. See [`record/SKILL.md` § Constraints](../record/SKILL.md#constraints).
- **MUST NOT delete** — supersede via frontmatter; terminal files are moved to `archive/{type}/`. See [`wrap-up/SKILL.md` § Constraints](../wrap-up/SKILL.md#constraints).
- **MUST NOT improvise a routing destination** — every staging file has a canonical destination in the routing table; an unroutable item returns `NEEDS_CONTEXT`, never an invented home. See [`wrap-up/SKILL.md` § Staging → Memory routing](../wrap-up/SKILL.md#staging--memory-routing).

---

## Output paths

Two tier roots, nothing more here:

- **Session staging** — `sessions/{date}-{session-id}/{N}-{loop}/staging/{type}/` (where a working loop writes).
- **Durable memory** — `.gobbi/projects/{project-name}/` (where Wrap-up promotes).

For the per-path inventory — every session-record and memory location, its writer, when written, and which template stamps it → [`memory-map.md`](memory-map.md). The full path table is **not** duplicated here; `memory-map.md` owns it.

---

## Ownership-boundary table

The anti-duplication contract. Each row names the single source of truth for one thing, and what `memory/SKILL.md` points there for.

| Doc | Owns (single source of truth for) | `memory/SKILL.md` points here for |
|---|---|---|
| [`memory/SKILL.md`](SKILL.md) (this doc) | The **memorize procedure** — the What/When/How and the entry point | it points OUT; nothing points to it for detail |
| [`memory/memory-map.md`](memory-map.md) | The **path inventory** — every session-record + memory path, its writer, when, which template; per-type canonical homes; the Templates index | which path holds what / who writes it / when — never restate the path tables |
| [`memory/rules.md`](rules.md) | The **standard** — naming (§1), frontmatter (§2), structure (§3), dev-doc quality (§4), staging-field stripping (§2.6) | how to name / what frontmatter / what structure / the zero-context bar — never restate the rules |
| [`memory/templates/{type}.md`](templates/) | The **per-type schema** — required fields, when-to-write, frontmatter + body contract per type | the schema each memorized file stamps — never restate a template's fields |
| [`memory/templates/feature.md`](templates/feature.md) | The **per-feature subdir map** (README + 14 subdirs) + the feature-README identity spec | the feature dir's internal shape — never restate the 14 subdirs |
| [`record/SKILL.md`](../record/SKILL.md) | The **capture / staging side** — the RECORD sub-phase procedure, staging mechanics, cumulative staging, idempotency, the assistant-role access matrix | how a finding is staged in-loop — never restate the RECORD step-table |
| [`wrap-up/SKILL.md`](../wrap-up/SKILL.md) | The **promotion side** — the 5-stage pipeline, the Staging → Memory routing table, the frontmatter allowlist, sole-writer + lazy bootstrap, move-on-terminal | how staging is promoted / the routing table — never restate the routing table |

---

## Cross-references

- Path inventory (which directory holds what, writer, when, template) → [`memory-map.md`](memory-map.md)
- The standard (naming + frontmatter + structure + dev-doc quality) → [`rules.md`](rules.md)
- Per-type schemas (required fields, body section contracts) → [`templates/`](templates/)
- The feature dir's internal shape (README + 14 subdirs) → [`templates/feature.md`](templates/feature.md)
- Capture / staging side (the RECORD sub-phase) → [`record/SKILL.md`](../record/SKILL.md)
- Promotion / routing side (Wrap-up) → [`wrap-up/SKILL.md`](../wrap-up/SKILL.md)
- The mistake type's memorize loop (check / stage / promote) → [`mistake/SKILL.md`](../mistake/SKILL.md)
- Where the `memory` value-feature sits → [`gobbi/SKILL.md` § Product value-features](../gobbi/SKILL.md#product-value-features)
