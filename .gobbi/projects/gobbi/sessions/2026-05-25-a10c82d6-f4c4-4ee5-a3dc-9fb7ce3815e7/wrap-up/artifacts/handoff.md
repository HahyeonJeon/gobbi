---
loop: wrap-up
iter: 1
artifact_type: handoff
created_at: 2026-05-25
status: final
supersedes: []
related:
  - sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/planning/rawdata/draft-iter1.md
  - sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md
  - backlogs/memory-redesign-remaining-waves.md
---

# Handoff — session 2026-05-25-a10c82d6

## Summary

Deep Ideation + Planning for the gobbi memory-system redesign, plus W0-core Execution. The naming standard (`skills/memorization/rules.md`) and Principle 13 are live. Waves W0-rest through W5 are deferred and fully resumable from the locked plan.

## Shipped

| Artifact | Path / Commit |
|---|---|
| Principle 13 body + Iron Law row 13 | `skills/principles/SKILL.md` — commit `90c46fd` |
| `.claude/CLAUDE.md` Iron Law row 13 + "13 principles" | commit `90c46fd` |
| `skills/memorization/rules.md` (131 lines) + its `.claude` symlink | commit `90c46fd` |
| Delegation wiring (all 5 templates + SKILL.md) | commit `90c46fd` |
| Follow-up P13 wiring + remediation | commit `309f3dc` |
| Locked design (iter2 PASS) | `ideation/artifacts/memory-system-redesign-design.md` |
| Locked plan (26 tasks, 6 waves, iter2 PASS) | `planning/rawdata/draft-iter1.md` |

## Deferred / Open

| Item | Location |
|---|---|
| W0-rest + W1-W5 (main deferred work) | `backlogs/memory-redesign-remaining-waves.md` |
| FLAG-2: missing `claude` doc-standard skill | `backlogs/claude-doc-standard-skill-missing.md` |
| FLAG-1/L8: skills/agents canonical-location | `backlogs/skills-agents-canonical-location.md` |
| Final Gate `*-decisions.md` pattern question | See backlogs/memory-redesign-remaining-waves.md § Open question |
| Clarify `mistakes/executor-mirror-path-vs-worktree-physical-copy.md` wording | W5-T2 in the plan; the mistake is about worktree branch-isolation, NOT `.claude↔.gobbi` doubling — needs cross-link to `mistakes/skills-mirror-symlinks-not-copies.md` |

## Decisions to respect

All 8 locks (L1-L8) are FINAL — do not re-open. See `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/rawdata/locked-decisions.md`.

Key locks for next session:
- **L1**: 7 value-features (workflow, project-memory, agents, evaluation, guardrails, git-workflow, install-runtime) — slugs ratified by user.
- **L6**: base frontmatter on every memory file; 12-item slug blocklist; staging-only flags stripped on promotion.
- **L7**: Principle 13 is live and wired. Every doc task needs SPEC + CRUD plan.
- **L8**: `skills/` and `agents/` relocation is out of scope this session.

W0 re-touch guard (critical): W0-T1b/T3..T8 MUST NOT re-edit `principles/SKILL.md` P13 body, `.claude/CLAUDE.md`, `skills/memorization/rules.md`, or the 5 delegation files — all frozen at `90c46fd`/`309f3dc`. Re-executing those tasks would corrupt (duplicate P13 section / overwrite committed rules.md).

## Key facts

**Mirror model (critical).**
- `.claude/skills/` = 56 per-file SYMLINKS into `.gobbi/projects/gobbi/skills/`. One canonical edit reflects automatically — NO double edit.
- Canonical = `.gobbi/projects/gobbi/skills/` (57 real files, 0 symlinks).
- Exception: `gobbi-hook-authoring` is canonical-only (no `.claude` symlink).
- In worktree mode, always use worktree-absolute path: `<worktree>/.gobbi/projects/gobbi/skills/{skill}/...`. See `mistakes/skills-mirror-symlinks-not-copies.md` and `mistakes/executor-mirror-path-vs-worktree-physical-copy.md`.

**Codex invocation.** `codex exec` is the mechanism. `/codex:adversarial-review` has `disable-model-invocation:true` — the orchestrator must ask the user to type the slash command. `codex-rescue` is the model-invocable alternative.

**Feature `null` convention.** Files with `scope: project` and no feature-binding set `feature: null` (not omitted).

## 2 process mistakes promoted this session

Both are HIGH priority. Read before starting next session:

1. **`mistakes/skills-mirror-symlinks-not-copies.md`** — domain: docs-sync. The `.claude/skills/` mirror is per-file symlinks, NOT physical copies. Any brief saying "edit BOTH .claude and .gobbi copies" is wrong.

2. **`mistakes/manager-skipped-dual-system-eval.md`** — domain: process. Manager must not substitute self-verification for the mandatory dual-system EVALUATION sub-phase. If budget is tight, CHECKPOINT — never silently downgrade. `evaluate.mode` is the only legitimate switch to remove evaluation; only the user sets it.

## Pointers

| What | Path |
|---|---|
| Resume anchor | `backlogs/memory-redesign-remaining-waves.md` |
| Locked plan (26 tasks) | `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/planning/rawdata/draft-iter1.md` |
| Design-of-record | `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md` |
| Design pointer (durable) | `design/memory-system-redesign.md` |
| Session note | `notes/2026-05-25-memory-system-redesign.md` |
| 8 locked decisions | `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/rawdata/locked-decisions.md` |
| Naming + frontmatter standard | `skills/memorization/rules.md` |
| Mistake 1 | `mistakes/skills-mirror-symlinks-not-copies.md` |
| Mistake 2 | `mistakes/manager-skipped-dual-system-eval.md` |

## Promotion summary

| Source | Destination | Action |
|---|---|---|
| `ideation/staging/decisions/skills-mirror-is-symlinks-not-physical-copies.md` | `mistakes/skills-mirror-symlinks-not-copies.md` | ALREADY PRESENT (pre-promoted this session) |
| `wrap-up/staging/decisions/manager-substituted-self-verification-for-mandatory-dual-system-eval.md` | `mistakes/manager-skipped-dual-system-eval.md` | PROMOTED |
| `preparation/staging/decisions/claude-doc-standard-skill-missing.md` | `backlogs/claude-doc-standard-skill-missing.md` | PROMOTED |
| `preparation/staging/decisions/skills-agents-canonical-location.md` | `backlogs/skills-agents-canonical-location.md` | PROMOTED |
| (created) | `backlogs/memory-redesign-remaining-waves.md` | CREATED — resume anchor |
| (created) | `design/memory-system-redesign.md` | CREATED — durable design pointer |
| (created) | `notes/2026-05-25-memory-system-redesign.md` | CREATED — session journal |
