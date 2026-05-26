---
name: 2026-05-26-memory-redesign-waves-complete
description: Session journal for the resumed memory-system redesign — all deferred waves W0-rest through W5 completed in session a10c82d6 (resumed 2026-05-26).
type: notes
scope: project
feature: project-memory
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory-system, migration, redesign, waves, journal]
features_touched:
  - project-memory
  - workflow
  - agents
  - evaluation
  - guardrails
  - git-workflow
  - install-runtime
---

# Journal — 2026-05-26 — Memory-redesign waves W0-rest through W5 complete

## Session context

Resumed session `a10c82d6` (started 2026-05-25, prior checkpoint at W0-core). The memory-system redesign's remaining 5 waves ran to completion. All 26 tasks done; 42 commits on branch `chore/session-2026-05-25-a10c82d6`.

## What the leader investigated

Re-read the locked plan (`planning/rawdata/draft-iter1.md`) and design-of-record (`ideation/artifacts/memory-system-redesign-design.md`) to establish the exact continuation point. Confirmed W0-T1/T2/T9 were already frozen at `90c46fd`/`309f3dc`; identified the re-touch guard targets. Drafted the W0-rest task sequence and the wave ordering.

## What the executor implemented

**W0-rest** (8 skill/template propagation targets): updated `memory-map.md`, `memorization/SKILL.md`, all 17 templates, `wrap-up/SKILL.md`, `orchestration/SKILL.md` + workflow docs, and the `gobbi/evaluation/mistake` skill trio. Required 3 eval iters (REVISE twice): Codex initially held a design-literal "retire state.json" view; user ratified KEEP + design amended with CORRECTION annotations.

**W1** (frontmatter fixes, ~25-30 files): stripped staging-only keys from 17 mistakes; added base frontmatter to `rules/stub-redirect-format.md` (rescoped no-frontmatter clause to TARGET docs only); migrated ad-hoc design/learnings frontmatter. W1 iter2 remediation involved recovering a misplaced main-tree commit (W1 root cause: SendMessage-continued executor cwd reset to main tree — now recorded as a mistake).

**W2** (slug renames, all `git mv`): 5 backlogs positional slugs → concept slugs; 1 learning finding-ID prefix dropped; split + de-prefix work in gobbi-orchestration-workflow-improvements, env-var-audit, and session-foundations-bundle-b. User ratified option 3 for closed-sprint logs (de-prefix, keep intact).

**W3** (feature re-homing, 136 md files, all `git mv`): created 7 capability feature dirs with READMEs; re-homed env-var-audit (W3a), Bundle A (W3b), Bundle B in 6 sub-clusters (W3c), Bundle C (W3d). Retired 4 sprint feature dirs to `archive/features/`. Restamped re-homed files with correct `scope:` + `feature:` frontmatter.

**W4** (session cleanup): removed `tmp/` dirs where present; closed sessions left untouched per RATIFY-7.

**W5** (follow-ups + final gate): filed FLAG-3 and feature-frontmatter-normalization backlogs; clarified the worktree-branch-isolation lesson in `executor-mirror-path-vs-worktree-physical-copy.md`; softened the naming-pattern blocklist from enforced rule to descriptive-slug PREFERENCE (user-ruled); ran final compliance grep gate (green).

## What the evaluator flagged (key)

- W0-rest: Codex diverged from Claude on `state.json` retirement — forced user decision; user ratified KEEP (Codex was design-literal, Claude was design-defective-aware).
- W1: eval found the archive-move `feature:null` key missing → iter2 remediation.
- W2: iter2 remediation on nav-link repointing for renamed files.
- W3: post-restamp eval confirmed all 100+ files have correct `feature:` values.
- W5: both systems PASS; naming-blocklist softening ratified by user.

## What the user decided

| Decision | Effect |
|---|---|
| KEEP `state.json` (not retire) | Design-of-record §3.4/§7#7/§8 amended with CORRECTION annotations |
| RELAX naming blocklist → PREFERENCE | `memorization/rules.md` §1.3 softened |
| Closed-sprint logs: option 3 (de-prefix, keep intact) | W2-T3b remainder committed |
| Restamp scope: restamp re-homed files with `scope: feature` + `feature:` | W3 restamp commit `2f7aeca` |

## Mistakes recorded this session

1. `mistakes/design-literal-retire-instruction-without-replacement.md` — a design "retire X" instruction without a replacement specification was executed literally; cross-check the cited witness and verify active call sites before retiring any live mechanism.
2. `mistakes/sendmessage-continued-cwd-resets-to-main-tree.md` — SendMessage-continued executor shell cwd resets to main tree; "cwd still X" is not a cd; always re-issue explicit `cd <worktree-absolute-path>` as first action.

## Open follow-ups (all filed as backlogs)

1. `backlogs/skills-agents-canonical-location.md` — FLAG-1/L8: `skills/`+`agents/` placement contradiction in memory-map vs wrap-up skill (HIGH).
2. `backlogs/claude-doc-standard-skill-missing.md` — FLAG-2: CLAUDE.md dangling link to non-existent `skills/claude/SKILL.md` (HIGH).
3. `backlogs/stub-redirect-dangling-claude-skill-ref.md` — FLAG-3: `rules/stub-redirect-format.md` references `_claude/SKILL.md` which doesn't exist; fix after FLAG-2 ships (MEDIUM).
4. `backlogs/feature-dir-frontmatter-full-normalization.md` — legacy non-base keys (`promoted_from`, `promoted_at`, etc.) in feature-dir files not stripped by current Final Gate (MEDIUM).
