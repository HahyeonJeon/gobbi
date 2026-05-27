---
name: memory-system-redesign
description: Design-of-record for the gobbi memory-system redesign — 7 value-features, 13 per-type specs, naming and frontmatter standards, Principle 13, and the migration plan. SHIPPED 2026-05-26 — all 6 waves complete, 42 commits.
type: design
scope: project
feature: project-memory
status: active
created: 2026-05-25
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory-system, naming-standard, frontmatter, migration, principle-13]
supersedes: null
superseded_by: null
related:
  - sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md
  - skills/memorization/rules.md
---

# Memory-System Redesign — Design-of-Record

> **STATUS (2026-05-26): COMPLETE.** All 6 waves (W0-core + W0-rest + W1-W5) shipped. 42 commits on branch `chore/session-2026-05-25-a10c82d6`. Resume anchor `backlogs/memory-redesign-remaining-waves.md` closed. No pending migration work remains.

Full design artifact: `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md`. This file is the durable pointer and summary — it does not duplicate the 480-line design doc.

## Context

Gobbi's project memory had accreted ad-hoc directory shapes, inconsistent frontmatter, and positional/cryptic file slugs that only made sense inside the originating session. The redesign set out to give the memory system a single, durable shape: a fixed set of value-features that session work promotes into, a controlled per-type naming and frontmatter standard, and a behavioral principle that forces a spec + CRUD plan before any documentation change. This doc records the locked decisions (L1–L8) and the migration that delivered them.

## Decision (the locked design)

The redesign locks eight decisions (L1–L8, enumerated below) around three pillars: (1) seven durable value-features that own all session output; (2) a consolidated naming + frontmatter standard living in `skills/memorization/rules.md`; (3) Principle 13 ("NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN"). All 13 memory types are kept; none are merged. The sections below carry the detail of each pillar.

## The 7 value-features (L1 — RATIFIED by user)

| # | Slug | One-liner |
|---|---|---|
| 1 | `workflow` | The 6-step state machine driving every unit of work (Ideation → Wrap-up). |
| 2 | `project-memory` | Cross-session durable store: decisions, designs, plans, references survive in a typed memory tree. **This redesign lands here.** |
| 3 | `agents` | Multi-agent roster with role-scoped delegation, handoffs, and per-role model selection. |
| 4 | `evaluation` | Dual-system review (Claude + Codex) across 7 perspectives, gating each deliverable. |
| 5 | `guardrails` | The 13 Iron Laws plus the mistake-capture-and-learn loop. **Principle #13 lands here.** |
| 6 | `git-workflow` | Worktree-isolated sessions and branch/PR/issue lifecycle. |
| 7 | `install-runtime` | One-command install + project bootstrap + per-session runtime contract. |

Skill ownership and sprint-to-feature mapping: design doc §1.2 and §1.3.

## Keep-all-13-types decision (L3)

All 13 project-memory types survive, each with a sharp purpose, "use-this-not-that" boundary, declared scope with a promote-up trigger, temporal naming rule (date-prefixed vs bare-slug), frontmatter schema, and CRUD lifecycle. The 4 feature-subdir-only types (`changelogs/`, `discussions/`, `scenarios/`, `checklists/`) exist only as `features/{f}/` subdirs. Full per-type specs: design doc §2.

## Naming and frontmatter standards (now live in `skills/memorization/rules.md`)

Standards are consolidated in `skills/memorization/rules.md` (canonical path; symlinked from `.claude/skills/memorization/rules.md`). Shipped in commit `90c46fd`. The canonical rules doc is the single source of truth for:

- **Naming**: ≤6 words / ≤~35-char slug; kebab-case; directory = category; status/lifecycle never in filename; stable address; 12-item slug anti-pattern blocklist.
- **Temporal split**: date-prefixed (`notes`, `decisions`, `reviews`, `reports`, `changelogs`, `plans`, `discussions`, `archive entries`) vs bare-slug (`features`, `mistakes`, `rules`, `learnings`, `design`, `references`, `backlogs`, `scenarios`, `checklists`).
- **Frontmatter base**: `name`, `description`, `type`, `scope`, `feature`, `status`, `created`, `session`, `tags` on every memory file.
- **Per-type extension fields**: see design doc §5.2.
- **Staging-field stripping on promotion**: `mistake-candidate`, `finding-id`, `promoted-from`, `promoted-at` are stripped by Wrap-up on promotion; they are session-only routing flags.

## Principle 13 (L7 — shipped in commit `90c46fd`)

"NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN." Added to `skills/principles/SKILL.md` (13th principle body + Iron Law Index row 13) and `.claude/CLAUDE.md` (Iron Law table row 13 + "13 principles" prose). Full text: design doc §6.

Procedure: before any documentation change, (1) write the SPEC (what the doc task must achieve, type of each affected file, adjacent types this content must not bleed into); (2) enumerate the CRUD plan (Create/Read/Update/Delete at file/dir/line granularity); (3) check the blast radius (every file the same change must co-touch); (4) then edit and verify.

## Migration plan summary (26 tasks, 6 waves)

Full plan: the locked 26-task migration plan in this session's `planning/` directory (see Source).

- **W0 (Standards)** — 10 tasks; W0-T1/T2/T9 shipped in `90c46fd`; W0-T1b + W0-T3..T10 remain.
- **W1 (Frontmatter fixes)** — 3 tasks; ~25-30 memory files.
- **W2 (Slug renames)** — 5 tasks; all `git mv`.
- **W3 (Feature re-homing)** — 6 tasks; 136 md files; all `git mv`.
- **W4 (Session cleanup)** — 1 task; `tmp/` dirs only.
- **W5 (Follow-ups + final gate)** — 3 tasks.

Resume anchor: `backlogs/memory-redesign-remaining-waves.md`.

## 8 locked design decisions (L1-L8)

From `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/rawdata/locked-decisions.md`:

| # | Lock |
|---|---|
| L1 | Feature = durable product value-proposition (noun), not a sprint (verb). 7 value-features ratified. |
| L2 | Session artifacts promote INTO value-features; sprints become session notes + changelogs. |
| L3 | Keep all 13 types (no merger/collapse). |
| L4 | Type scope rules: notes/rules/learnings/reviews/reports = project-only; plans = feature-only for loop path; decisions/design/mistakes/backlogs/references = both (default feature, promote-up on project-wide trigger). |
| L5 | Temporal split: date-prefixed for time-indexed types; bare-slug for evergreen types. |
| L6 | Base frontmatter on every memory file. 12-item blocklist enforced. Staging-only flags stripped on promotion. |
| L7 | Principle #13 (spec + CRUD-think for doc work) added and wired into delegation templates. |
| L8 | `skills/` and `agents/` directories are out of scope this session (relocation deferred — see `backlogs/skills-agents-canonical-location.md`). |

## Key facts every agent must know

- **Mirror = symlinks, not copies.** `.claude/skills/` is 56 symlinks into the canonical `.gobbi/projects/gobbi/skills/` tree. One canonical edit, one symlink, no double edit. Exception: `gobbi-hook-authoring` is canonical-only (no `.claude` symlink). See `mistakes/skills-mirror-symlinks-not-copies.md`.
- **Canonical write surface.** In worktree mode, always edit `<worktree>/.gobbi/projects/gobbi/skills/{skill}/...` (worktree-absolute). See `mistakes/executor-mirror-path-vs-worktree-physical-copy.md`.
- **`codex exec`** is the invocation mechanism; `codex-rescue` is the model-invocable alternative when the slash command is unavailable.
- **`five-locked-decisions.md` rename**: the slug must NOT end in `-decisions.md`; choose a concept slug (e.g., `five-locked-architecture-choices.md`).

## Rationale

Keeping all 13 types (rather than collapsing them) preserves the sharp "use-this-not-that" boundaries that let a reader and the promotion routing pick the right home for each artifact; a smaller type set would force unrelated content to share a directory and dilute the controlled vocabulary. Anchoring the naming and frontmatter standard in one canonical file (`skills/memorization/rules.md`) gives every agent a single source of truth instead of per-skill drift. Principle 13 makes the spec-plus-CRUD discipline a behavioral gate so future doc work cannot silently re-introduce the ad-hoc shapes the redesign removed.

## Alternatives considered

- **Merge or collapse the 13 memory types into a smaller set.** Rejected (L3): fewer types blur the per-type boundaries and weaken the controlled-vocabulary addressing that makes records findable without grep guesswork.
- **Treat sprints as the unit of feature organization.** Rejected (L1/L2): sprints are verbs (work episodes), not durable product value; session work now promotes INTO the seven value-features, and sprints become session notes + changelogs.
- **Relocate `skills/` and `agents/` in the same session.** Deferred (L8): out of scope to keep the migration bounded; tracked in `backlogs/skills-agents-canonical-location.md`.

## Related

- `.gobbi/projects/gobbi/skills/memorization/rules.md` — the consolidated naming + frontmatter + dev-doc standard this redesign delivered.
- `.gobbi/projects/gobbi/skills/principles/SKILL.md` — Principle 13, the doc-work gate added by this redesign.
- `.gobbi/projects/gobbi/backlogs/skills-agents-canonical-location.md` — the L8 deferral follow-up.
- `.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md` — the mirror-is-symlinks fact every agent must know before editing skills.

## Source

Originating session: `.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/`. The full design artifact is at `ideation/artifacts/memory-system-redesign-design.md`; the locked 26-task migration plan is at `planning/rawdata/draft-iter1.md`; the eight locked decisions are at `ideation/rawdata/locked-decisions.md`, all under that session directory.
