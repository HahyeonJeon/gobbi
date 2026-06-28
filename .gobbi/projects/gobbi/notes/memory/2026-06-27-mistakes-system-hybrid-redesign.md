---
name: mistakes-system-hybrid-redesign
description: Replaced the dual mistake-storage model (project mistakes/ + 9 Layer-2 copies) with one hybrid two-home model; 14 commits, guards green, dual-system PASS.
type: notes
scope: project
feature: null
status: active
created: 2026-06-27
session: 659a1b3f-0b70-419a-848b-a02db5dbbded
tags: [memory, refactor, docs-sync]
keywords: [mistakes, hybrid, two-home, layer2-removal, check-skill-mistakes, skill-surface]
author: claude
features_touched: [guardrails]
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [hybrid-two-home-mistake-model, verify-zero-new-against-prefeature-base, harden-skill-memory-residual-vocab-allowlist]
---

# Mistakes-system hybrid redesign

## What happened

The session replaced gobbi's dual mistake-storage model with one hybrid two-home model. Before: project mistakes lived in the memory tree at `mistakes/{area}/{slug}.md`, and "generalizable" ones were COPIED to 9 `skills/mistake/layer2-*.md` files, bridged by a `check-layer2-source.sh` guard and `layer:` / `layer2-source:` frontmatter. Two sources of truth for one trap, plus dedicated guard machinery, and even single-tier traps loaded context-blind at session start.

Ideation (2 iters, dual-system REVISE → manager-verified PASS) reframed the leader's single-home recommendation into the user's HYBRID two-home model: skill-owned traps co-locate in `skills/{skill}/mistakes.md`; cross-cutting / no-owner traps stay in the project `mistakes/{area}/` tier (home unchanged, Layer-2 residue cleaned). The dual-system evaluation caught two real defects in iter1 — Codex uniquely flagged the missed `AGENTS.md` / `.codex/AGENTS.md` Layer-2 teaching surfaces and the data-loss ghost (`layer2-verify-state-from-authoritative-source-not-proxy` had no live original); Claude uniquely flagged that `check-markdown-links.sh` cannot see backtick bare-paths or `[[slug]]` links, so the new guard had to cover them. Rules R1 (route-before-delete), R2 (ordered execution), R3 (skill-tier supersession via `## Archived`) were added in iter2.

Preparation produced a readiness manifest. Planning (1 iter, PASS) decomposed the work into ordered tasks and a per-mistake routing map, applying 2 user routing decisions, under the R2 ordered-execution rule (migrate + wire + verify-loadable BEFORE any delete). Execution (2 iters: REVISE → PASS) implemented it across 14 commits; the iter1 finding F-CONSIST-1 (the new guard was not in the wrap-up green-check) was fixed in iter2, and the markdown-links delta was dispositioned as pre-existing.

## What shipped

14 commits on branch `claude-2026-06-27-659a1b3f-0b70-419a-848b-a02db5dbbded` (oldest → newest):

- `d19b0e46` feat(mistake): add skill-surface mistakes.md template + check-skill-mistakes.sh guard
- `18c828aa` feat(mistake): add skill-owned mistakes.md homes for codex + git (T2a)
- `f1b34a49` feat(mistake): add skill-owned mistakes.md homes for memory/skill-writing/wrap-up/planning (T2b)
- `cdeccee0` feat(mistakes): add skill-surface mistakes homes for mistake/delegation/evaluation/preparation (T2c)
- `a06f062a` feat(mistakes): re-home 3 ghost lessons to new homes (T3)
- `ef72916a` docs(mistake): rewrite Layer-2 prose to hybrid model in runtime/entry docs
- `cbd83dc1` docs(wrap-up): rewrite Layer-2 model to hybrid two-home routing
- `49821141` feat(mistake): add hybrid skill-vs-project mistake mechanics
- `7e0b689e` feat(delegation): mandatory git load + per-skill mistakes companion path
- `a6596b66` refactor(mistakes): de-ref Layer-2 guards + retire 2 obsolete backlogs (T6)
- `8e553f79` refactor(mistakes): remove 29 migrated originals + repoint inbound refs (T7)
- `83eeecf9` refactor(mistakes): delete 9 layer2 copies + check-layer2-source guard (T10)
- `d63a5537` fix(mistakes): drive standing guards to green after Layer-2 removal (T11)
- `55a8d0d7` docs(wrap-up): wire check-skill-mistakes into post-promotion green-check; fix residual-vocab comment (iter2 F-CONSIST-1/2)

(`55a8d0d7` is the 14th, the Execution iter2 fix for F-CONSIST-1/F-CONSIST-2; the first 13 were captured in the execution commit-list. The Wrap-up promotion commit the manager makes after this WORK is separate and not counted in the 14.)

Promoted to memory this Wrap-up: the `hybrid-two-home-mistake-model` design + 5 references under `features/guardrails/`; 3 user-approved mistakes (2 skill-surface sections in `skills/codex/mistakes.md` + `skills/skill-writing/mistakes.md`; 1 project-tier `mistakes/verification/verify-zero-new-against-prefeature-base.md`); 1 backlog; this journal entry.

## What got stuck

Nothing blocked. One non-blocking item surfaced at evaluation: the dual-system Codex evaluator timed out on a 91-file diff across all 7 perspectives (600s cap, SIGTERM, zero output) — recorded as a skill-surface mistake so future large reviews use a tighter focused prompt.

## What shifted

The leader's single-home recommendation shifted to the user's hybrid two-home re-frame (Ideation). The "cross-cutting tier is zero-change" claim was killed in iter2 — the staying files still needed Layer-2 residue cleanup. The mirror-wiring model was corrected: `.claude/skills/{skill}/mistakes.md` is a hand-created per-file symlink; `.agents` / plugins auto-expose via whole-dir symlinks.

## Decisions to respect

- **Hybrid two-home model.** Skill-owned → `skills/{skill}/mistakes.md`; cross-cutting / no-owner → project `mistakes/{area}/`. One record per trap, never copied.
- **D1 (scoped to the skill tier only).** The skill `mistakes.md` is a skill-surface doc out of `validate-frontmatter.sh`, covered by `check-skill-mistakes.sh`. The project tier keeps full memory machinery.
- **Routing is manual at promotion (Always-Ask), primary-owner for spanning traps.**
- **Q4 graduation bar.** A lesson becomes a `principles` / `coding` rule only when it is a universal proactive imperative AND useful off-skill — "generalizes across projects" is NOT the bar.
- **R1 route-before-delete, R2 ordered execution, R3 skill-tier `## Archived` supersession.**

## Next session

Pick up the two deferred backlogs: `backlogs/tooling/harden-skill-memory-residual-vocab-allowlist.md` (file+line allowlist for `skills/memory/mistakes.md`) and `backlogs/memory/preexisting-broken-markdown-links.md` (20 pre-existing link breaks). Per-lesson mistake → rule graduation remains open against the Q4 test.

## Related

- [[hybrid-two-home-mistake-model]] — the design shipped this session
- [[verify-zero-new-against-prefeature-base]] — a verification mistake promoted this session
- [[harden-skill-memory-residual-vocab-allowlist]] — a backlog opened this session
