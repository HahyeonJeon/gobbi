---
name: 2026-05-25-memory-system-redesign
description: Session journal — memory-system redesign Ideation + Planning + W0-core Execution for session 2026-05-25-a10c82d6.
type: notes
scope: project
feature: null
status: active
created: 2026-05-25
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory-system, redesign, principle-13, naming-standard, frontmatter]
features_touched: [project-memory, guardrails]
---

# 2026-05-25 — Memory-system redesign (session a10c82d6)

## What happened

**Ideation** — Three feature-naming iterations converged on 7 value-features (workflow, project-memory, agents, evaluation, guardrails, git-workflow, install-runtime). The leader's iter1 design contained a Critical error caught by Codex evaluation: the `.claude/skills/` mirror topology was described as "two physical copies — every edit doubles." Manager verification against the live main tree confirmed the truth: `.claude/skills/` is 56 per-file symlinks into the canonical `.gobbi/projects/gobbi/skills/` tree. One canonical edit, no double edit. The design was corrected in iter2; the mistaken assumption became mistake `skills-mirror-symlinks-not-copies.md`.

A dual-system evaluation ran on iter1; the manager initially stamped PASS verdicts for subsequent phases (Ideation iter2, Preparation, Planning, Execution) via "manager-verification" notes without spawning evaluator subagents — a workflow breach caught by the user. After correction, proper dual-system evaluations ran for each phase.

**Preparation** — Readiness check confirmed the design was ready; identified FLAG-1 (skills/agents location contradiction) and FLAG-2 (missing `claude` doc-standard skill), both deferred as backlogs.

**Planning** — Decomposed the locked design into 26 tasks across 6 waves. Planning eval returned REVISE (iter1); iter2 applied H1-H3 + CN/ST/US/RK/AE remediations. Outcome: PASS (manager-verified, no dual-system eval was run on iter2 — see process mistake below).

**Execution (W0-core)** — Two commits closed the W0-core work:
- `90c46fd` — "ship memory-system standard core": Principle 13 body added to `skills/principles/SKILL.md` + Iron Law row 13 + "13 principles" to `.claude/CLAUDE.md`; `skills/memorization/rules.md` authored (131 lines); `rules.md` wired into all 5 delegation templates and `delegation/SKILL.md`. Dual-system Execution eval iter1 returned REVISE.
- `309f3dc` — follow-up remediation commit (additional P13 wiring + Execution eval iter2 PASS).

## What shipped

- **Principle 13** ("NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN") added to `skills/principles/SKILL.md` and `.claude/CLAUDE.md`. This is the 13th Iron Law; it mandates a SPEC + CRUD plan before any documentation change, with blast-radius enumeration.
- **`skills/memorization/rules.md`** — new canonical sibling (131 lines): naming convention (≤6 words/≤~35-char slug, 12-item anti-pattern blocklist), temporal split table (date-prefixed vs bare-slug for all 13 types + 4 feature-subdir types), frontmatter base+extensions per type, staging-field stripping on promotion, and the 3-way `rules` disambiguation (rules.md skill doc vs templates/rules.md type template vs rules/ memory type).
- **Delegation wiring** — all 5 delegation templates (`leader.md`, `assistant.md`, `executor.md`, `evaluator.md`) + `delegation/SKILL.md` updated to include `memorization/rules.md` in Load Directives tier-3 Skills.

## What's deferred

W0-rest (W0-T1b + W0-T3..T10) and Waves 1-5 are deferred to the next session. Resume anchor: `backlogs/memory-redesign-remaining-waves.md`. The locked 26-task plan is at `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/planning/rawdata/draft-iter1.md`.

## Decisions to respect

All 8 locks (L1-L8) from `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/rawdata/locked-decisions.md` are FINAL — do not re-open. Key locks:
- L1: features are durable value-propositions, not sprints; the 7 feature slugs are ratified.
- L6: base frontmatter on every memory file; 12-item slug blocklist enforced; staging-only flags stripped on promotion.
- L7: Principle 13 is live; every doc task needs SPEC + CRUD plan.
- L8: `skills/` and `agents/` relocation is out of scope this session.

The mirror model is symlinks, not copies — one canonical edit reflects automatically. See `mistakes/skills-mirror-symlinks-not-copies.md`.

## Next session priorities

1. Read `backlogs/memory-redesign-remaining-waves.md` for the full resume context.
2. Load `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/planning/rawdata/draft-iter1.md` — the W0-rest re-touch guard is critical; re-executing already-shipped tasks would corrupt the committed files.
3. Internalize the two process mistakes promoted this session: `mistakes/skills-mirror-symlinks-not-copies.md` and `mistakes/manager-skipped-dual-system-eval.md`.
4. Clarify the Final Gate's `*-decisions.md` pattern question before running W2-T4 (see backlogs/memory-redesign-remaining-waves.md § Open question).
