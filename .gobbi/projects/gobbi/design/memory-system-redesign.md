---
name: memory-system-redesign
description: Design-of-record for the gobbi memory-system redesign — 7 value-features, 13 per-type specs, naming and frontmatter standards, Principle 13, and the migration plan.
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

Full design artifact: `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md` (iter2 PASS, manager-verified 2026-05-25). This file is the durable pointer and summary — it does not duplicate the 480-line design doc.

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

Full plan: `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/planning/rawdata/draft-iter1.md`.

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
- **`five-locked-decisions.md` rename**: the W2-T4 slug must NOT end in `-decisions.md`; choose a concept slug (e.g., `five-locked-architecture-choices.md`).
