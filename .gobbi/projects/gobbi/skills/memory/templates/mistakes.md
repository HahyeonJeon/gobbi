# `mistakes/`

> Recurring failure patterns — things that look like they should work but reliably break. Each records the failure mode plus the correct approach so future sessions skip past it without re-failing.

**Two homes for a trap.** A trap lives in exactly one of two homes. A **cross-cutting / no-owner** trap is a FILE in the project `mistakes/` tier — the naming, frontmatter, and body schema documented in the sections immediately below. A **skill-owned** trap is a `## ` SECTION inside its owning skill's `skills/{skill}/mistakes.md` — the skill-surface schema documented in the **Skill-surface schema** section at the end of this doc. The two schemas differ: the memory-tier file carries the full 11-field memory base frontmatter and is validated by `validate-frontmatter.sh`; the skill-surface file carries a light header plus a per-section metadata strip and is validated by `validate-skill-mistakes.sh`. The rest of this doc (Core principles → Notes) governs the **memory-tier** home; the skill-surface schema is the last section.

## Core principles

> **Record the trap, its root cause, the correct approach, and the signal you are about to repeat it.**

A mistake missing the early-warning signal records history instead of preventing recurrence.

## Write it

| Field | Value |
|---|---|
| When | Immediately during any loop's RECORD when the user corrected an approach or the loop hit a non-obvious failure mode; or during Wrap-up RECORD when cross-loop patterns reveal a recurring trap. |
| Stage to | `sessions/{date}-{session-id}/{N}-{loop}/staging/decisions/{slug}.md` **with `mistake-candidate: true`** — mistakes route through `staging/decisions/` with the flag, not a dedicated subdir; the flag tells Wrap-up to promote to `mistakes/` instead of `decisions/`. |
| Promotes to | `features/{f}/mistakes/{area}/` (feature-specific trap) · `mistakes/{area}/` (project, the common case) — `{area}` from the curated trap-class allowlist, resolved by the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type) |
| Filename | `{slug}.md` — bare-slug, names the trap in ≤6 words (`bun-write-no-append.md`); no date or finding-ID prefix |

Loop RECORD stages; Wrap-up promotes ([routing](../../wrap-up/promotion.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter plus the mistakes extensions (`priority`, `domain`). The staging-only `mistake-candidate: true` flag is **stripped on promotion** ([rules §2.6](../rules.md#26-staging-field-stripping-on-promotion)) — it never appears on a promoted mistake file.

```markdown
---
name: {slug — the trap, named}
description: {one-line what reliably breaks}
type: mistakes
scope: project | feature
feature: {feature-name} | null
status: active | superseded
created: YYYY-MM-DD
session: {session-id}
tags: [process, verification]        # this type's controlled pool (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
priority: critical | high | medium | low
domain: {e.g. process, hooks, docs-sync}
supersedes: {prior mistake slug} | list[slug] | null      # plain slug; list[slug] = consolidation-merge (many→one), one→one stays scalar
superseded_by: {newer mistake slug} | null    # plain slug, not a path
---

# {Title}

## What happened
{The mistake or trap, described concretely. What was attempted, what went wrong.}

## User feedback
{If the user surfaced this correction directly, the user's wording — paraphrased or quoted.}

## Why it happens
{The underlying cause. The reason this trap exists, not just that it occurred.}

## Correct approach
{What to do instead. Concrete and actionable.}

## How to detect
{Signs that you are about to hit this trap. Helps an agent spot the situation early.}

## Related
{Navigable `[[slug]]` links to learnings, decisions, or other mistakes with shared context ([rules §2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[grep-absence-claim-needs-exact-pattern]] — a related verification trap
```

## Notes

- **`priority` enum semantics.** `critical` = breaks the environment / loses data / blocks the session (always read at session start). `high` = wrong output that looks correct (catches you only on review or in production). `medium` = produces rework. `low` = cosmetic. An agent reads `critical` + `high` before any work touching the relevant area; `medium` / `low` when time allows.
- **Not every correction graduates.** When the user corrects an approach, the assistant decides during RECORD whether it generalizes (mistake-worthy) or was a one-off (record in `notes/` or the canonical artifact only). Mistakes are for patterns that will recur.

## Skill-surface schema — `skills/{skill}/mistakes.md`

A **skill-owned** trap does not live in the memory tree. It lives as ONE `## ` section inside its owning skill's `skills/{skill}/mistakes.md`. That file is a skill-surface doc: the memory frontmatter standard ([`../rules.md`](../rules.md), scope boundary) does NOT govern it, and `validate-frontmatter.sh` never sees it. Its conformance gate is [`../../mistake/scripts/validate-skill-mistakes.sh`](../../mistake/scripts/validate-skill-mistakes.sh), which restores the structural validation and additionally resolves the `[[slug]]` + backtick bare-path references that the markdown-link guard cannot see.

**File header** (light skill-surface frontmatter, NOT the 11-field memory base):

```yaml
---
type: mistakes
skill: {owning-skill-name}      # = the dir this file lives in
description: "Recorded traps for {skill} — load before doing {skill} work"
updated: YYYY-MM-DD
---
```

**Body** — one `## ` section per trap. The heading slugifies to the trap's stable anchor, so an inbound reference resolves to `skills/{skill}/mistakes.md#{anchor}` (the Map-of-Content section-anchor model, [`../rules.md`](../rules.md) §5.2). Each ACTIVE section carries a one-line metadata strip, then the 4 mandatory elements, then an OPTIONAL `**User feedback**` line, then an optional `### Related` `[[slug]]` list. Retired sections move under a single `## Archived` heading at the file bottom and are NOT active:

```markdown
# {Skill} — Mistakes

> Load before any {skill} work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## {Trap title — names the failure}

`priority: high` · `domain: process` · `added: 2026-06-18` · `status: active` · `tags: [git, execution]`

**What happened** — {what was attempted, what broke — concrete}
**Why it happens** — {the mistaken assumption / root cause}
**How to detect** — {the early-warning signal, before you repeat it}
**Correct approach** — {what to do instead — concrete, actionable}
**User feedback** — {optional: the user's wording if they surfaced it directly}

### Related
- [[other-slug]] — why it relates

---

## Archived

## {Retired trap title}

`status: superseded` · superseded-by: [[new-slug]] · `retired: YYYY-MM-DD`
{full section body preserved; reader sees it is NOT active}
```

**The 4 mandatory elements** are the same four the memory-tier body carries (`What happened` / `Why it happens` / `How to detect` / `Correct approach`), written as bold inline labels rather than `## ` sub-headings so each trap stays one scannable `## ` section. `**User feedback**` is optional — kept because the memory-tier body carries `## User feedback`, optional because not every trap has a user quote.

**The metadata strip** is the one-line `priority:` · `domain:` · `added:` · `status:` · `tags:` row directly under the heading. `validate-skill-mistakes.sh` requires all five keys on an active section's strip.

**The `## Archived` convention (skill-tier supersession).** The skill surface has no `archive/` directory and no `git mv`-to-archive lifecycle. When a skill-owned trap is superseded, flip its section's metadata `status:` to `superseded`, then move the whole `## ` section under the single `## Archived` heading at the file bottom (or remove it when it has no historical value). A reader — and `validate-skill-mistakes.sh` — treats every `## ` section at or below `## Archived` as NON-active: it is EXEMPT from the 4-element + strip checks, but its anchor still participates in the uniqueness check and its references are still resolved. This is the co-located analog of the Map-of-Content split-on-retire rule ([`../rules.md`](../rules.md) §5.3).

**Migration is copy-the-elements, not a verbatim file copy.** When a memory-tier mistake file becomes a skill-owned section, copy its 4 elements (+ optional `User feedback`) into a `## ` section and DROP every memory-only piece — the 11-field frontmatter, and any obsolete `## Layer-2 candidate` section or `layer:` / `layer2-source:` frontmatter. The skill-surface section carries only the light strip + the elements.

**Filled example** (the real `executor-wrote-to-main-tree-not-worktree` trap rendered as a `skills/git/mistakes.md` section):

```markdown
## Executor wrote to the main tree, not the session worktree

`priority: high` · `domain: process` · `added: 2026-06-18` · `status: active` · `tags: [git, execution, verification]`

**What happened** — In the `feature-readme`→`feature.md` rename, the executor edited reference files with an absolute path rooted at the MAIN tree instead of the per-session worktree. Edits landed on the live tree; caught at the first verification gate and `git restore`'d.
**Why it happens** — CWD resets between tool calls, so a relative or main-rooted absolute path silently strays from the worktree; the write "succeeds," so nothing flags it.
**How to detect** — any write path on a worktree session lacking the `/worktrees/<branch>/` segment; a `git status` in the main tree showing unexpected edits.
**Correct approach** — pin the absolute worktree path on EVERY write surface; assert the `/worktrees/<branch>/` segment is present before the first edit.
```
