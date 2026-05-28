---
name: memory-redesign-remaining-waves
description: Resume anchor for the memory-system redesign: W0-rest through W5 deferred from session 2026-05-25-a10c82d6. Points to the locked 26-task plan and the design-of-record.
type: backlogs
scope: project
feature: null
status: closed
created: 2026-05-25
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory-system, migration, redesign, resume]
priority: high
disposition: resolved
project-scope: true
shipped_in: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
---

# Memory-redesign remaining waves — resume anchor

## What shipped in session 2026-05-25-a10c82d6 (W0-core)

Two commits closed the W0-core work:

- `90c46fd` — "ship memory-system standard core": Principle 13 added to `skills/principles/SKILL.md` + `.claude/CLAUDE.md` Iron Law row 13 + "13 principles" prose; `skills/memorization/rules.md` authored (131 lines) + its `.claude/skills/memorization/rules.md` symlink created; `memorization/rules.md` wired into all 5 delegation templates and `delegation/SKILL.md`.
- `309f3dc` — follow-up remediation commit (Principle 13 body + additional wiring).

## Deferred work

### W0-rest (remaining Wave 0 tasks — must run before Waves 1-3)

The W0-rest tasks update 13 skill/template propagation targets per design §7. They MUST NOT re-touch files already frozen at `90c46fd`/`309f3dc` (the re-touch guard in the plan protects against corruption):

- **W0-T1b** — change "Twelve"→"Thirteen" in `skills/principles/SKILL.md` intro prose (one line, residual from 90c46fd).
- **W0-T3** — update `skills/memorization/memory-map.md` (13 per-type-spec home pointers; `session.json.lock` row; archive typed-subdir wins; cross-ref `rules.md`; project `plans/` row to maintainer-only/NOT-loop-written; FLAG-1 follow-up note).
- **W0-T4** — update `skills/memorization/SKILL.md` (staging-field-stripping mechanism §5.3; staging-subdir list aligned to specs; per-perspective eval filename canon and Execution per-task quartet; cross-ref `rules.md`).
- **W0-T5** — align all 17 templates in `skills/memorization/templates/` to temporal-split naming, base+extension frontmatter, and scope rule per design §2.1-2.14. NOTE: `templates/rules.md` is the TEMPLATE file (distinct from the frozen `skills/memorization/rules.md` sibling).
- **W0-T6** — update `skills/wrap-up/SKILL.md` (frontmatter-allowlist-on-promotion; routing table vs 13+4 specs; non-standard-subdir cleanup doc; archive typed-subdir routing).
- **W0-T7** — update `skills/orchestration/SKILL.md` + `workflow/*.md` (canonical session tree §3.1; per-task Execution quartet §3.2; per-perspective eval filenames §3.3; `session.json.lock`; retire `state.json` refs; reflect `tmp/` removal).
- **W0-T8** — update `skills/gobbi/SKILL.md` (7-feature model + dev-vibe slugs + install-runtime note + FLAG-2 repoint), `skills/evaluation/SKILL.md` (7-perspective vocab), `skills/mistake/SKILL.md` (`mistake-candidate` staging-only/stripped).
- **W0-T10** — Wave-0 compliance verify (grep gate suite; no new edits).

### W1 — Frontmatter fixes (~25-30 memory files)

- Strip `mistake-candidate: true` + `finding-id` + `promoted-from`/`promoted-at` + eval-routing `disposition` from the 17 mistakes carrying them; add any missing base fields.
- Add base frontmatter to `rules/stub-redirect-format.md`; reword its "No frontmatter" clause to scope to stub-redirect TARGET docs only.
- Fix ad-hoc frontmatter keys in `design/session-lifecycle-worktree-boundaries.md`, `design/archive-move-on-terminal-model.md`, and `learnings/*.md` → base schema; bounded sweep of `design/`, `learnings/`, `rules/`, `backlogs/` only.

### W2 — Slug renames (all `git mv`)

- 5 `backlogs/item-N-M-*.md` → concept slugs (drop positional prefix).
- `learnings/f-aes-01-locked-wording-supersedes-readability-nit.md` → `locked-wording-supersedes-readability-nit.md` (drop finding-ID prefix).
- `features/gobbi-orchestration-workflow-improvements/decisions/` — SPLIT + rename 5 blocklist-violating files; STRAIGHT-RENAME 7 `item-a..g-*.md` design files (drop positional prefix).
- **W2-T3b** — SPLIT + rename 6 blocklist-violating files in `features/env-var-audit/` BEFORE re-homing.
- `features/session-foundations-bundle-b/` — STRAIGHT-RENAME 4 blocklist-violating files (3 discussions + `five-locked-decisions.md`).

### W3 — Feature re-homing (136 md files, all `git mv`)

- Create 7 capability feature dirs: `features/{workflow,project-memory,agents,evaluation,guardrails,git-workflow,install-runtime}/` with READMEs.
- Re-home per design §1.3 mapping + §8 routing heuristic. Sub-waved by source sprint: W3a env-var-audit, W3b Bundle A, W3c Bundle B (largest — 101 md, 6 sub-clusters), W3d Bundle C.
- W3-T5: retire the 4 sprint feature dirs to `archive/features/`.

### W4 — Session cleanup (going-forward + opportunistic only)

- Pre-inspect then remove session `tmp/` dirs where present.
- Do NOT retro-sweep the 5 closed-session `state.json` or 2 root `HANDOFF.md` (RATIFY-7 binding).

### W5 — Follow-ups + final gate

- File project-scope backlog items for FLAG-1, FLAG-2, FLAG-3 (already filed this session — see `backlogs/skills-agents-canonical-location.md` and `backlogs/claude-doc-standard-skill-missing.md`).
- Supersede/clarify `mistakes/executor-mirror-path-vs-worktree-physical-copy.md` (its real lesson is worktree branch-isolation, not `.claude↔.gobbi` doubling — needs clarifying cross-link to `mistakes/skills-mirror-symlinks-not-copies.md`).
- Final compliance sweep (grep gates).

## Key artifacts

- **Locked plan (26 tasks, 6 waves, RESUMABLE):** `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/planning/rawdata/draft-iter1.md` — includes Path/CWD convention, W0-rest re-touch guard, locked operational facts 1-5, per-task YAML with STATUS markers for DONE tasks.
- **Design-of-record:** `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md` (iter2 PASS, manager-verified) — §1.2 7 features, §2 13 type specs, §4 naming standard, §5 frontmatter standard, §7 propagation table, §8 migration strategy.

## Open question before running W2

The Final Gate (W5-T3) grep pattern `*-decisions.md` would also catch a legitimate `five-locked-architecture-choices.md` — wait, that is the renamed slug for `five-locked-decisions.md`, not an issue. The real open question: the plan's Final Gate checks ALL blocklist patterns in sprint/feature-phase context, but the `*-decisions.md` pattern would also match any future `{concept}-decisions.md` named for a pattern. Next session must clarify "bundle-decisions vs any -decisions" before running W2-T4 (whether to also enforce the `-decisions` blocklist on design/ files post-rename or only on the pre-rename violators).

## Process mistakes to internalize before resuming

- `mistakes/skills-mirror-symlinks-not-copies.md` — the `.claude/skills/` mirror is SYMLINKS, not copies; one canonical edit, no double edit. Every delegation brief in worktree mode must cite the worktree-absolute canonical path.
- `mistakes/manager-skipped-dual-system-eval.md` — self-verification does not substitute for dual-system EVALUATION sub-phase. Budget pressure never justifies skipping evaluator subagents; checkpoint instead.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/` — the memory-system-redesign session that decomposed the 26-task plan and deferred waves W0-rest through W5 to a resume.

---

**CLOSURE NOTE (2026-05-26):** All waves W0-rest through W5 completed in session a10c82d6 (resumed 2026-05-26). 42 commits total on branch `chore/session-2026-05-25-a10c82d6`. All 26 tasks are DONE. See wrap-up handoff at `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/wrap-up/artifacts/handoff.md` (iter 2, final).
