---
name: gobbi-maintenance-refactors
description: Cross-cutting maintenance session; R3+R1+R2 shipped in 6 commits removing gobbi-hook-authoring skill and relocating memory-vocabulary.json; dual-system production caught 4 real defects.
type: notes
scope: project
feature: null
status: active
created: 2026-06-27
session: b5601d38-c988-4f53-b34b-9ace12a55c25
tags: [process, refactor]
keywords: [gobbi-hook-authoring, memory-vocabulary, coding-skill, dual-system, refactor, R1, R2, R3]
author: claude
features_touched: []
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [gitignore-aware-residual-gate, frozen-history-by-doc-type-not-dir, opposite-system-peer-must-be-read-only, claude-skills-mirror-policy, validate-integration-log-spec-drift, skill-writing-dead-mistake-links]
---

# Gobbi maintenance refactors — 2026-06-27

## What happened

This was a cross-cutting maintenance session with `feature = null`. The task was to absorb the `gobbi-hook-authoring` skill into the `gobbi/` skill as a child-doc (removing it as a standalone skill), and to relocate `memory-vocabulary.json` from the memory skill root into `skills/memory/`. Three refactors shipped in 6 commits:

**R3** (1 commit, `37b15a48`): Added `.agents/skills/coding` symlink. The `coding` skill was added on 2026-06-24 but its `.agents/skills/` mirror was missing, causing `sync-plugin-package.sh --check` to report an asymmetry that would block R1's sync gate. R3 fixed this as a prerequisite.

**R1** (4 commits: `0de5d37a`, `7fd4067f`, `0c37b747`, `b8e6cf70`): Removed `gobbi-hook-authoring` as a standalone skill directory. The skill's guidance was folded into `skills/gobbi/hook-authoring.md` as a child-doc. All 13 references to `gobbi-hook-authoring` in `scripts/check-plugin-invocability.sh` were removed. A pre-existing `printf exit-2` bug in that script was fixed at the same time (user-approved scope extension under Principle 5). Docs, the agents feature README, and the `.agents/skills/` sync-check mirror were all updated.

**R2** (1 commit, `33bb8256`): Moved `memory-vocabulary.json` from `.gobbi/projects/gobbi/skills/memory/` into `skills/memory/` (i.e., one directory deeper). All references across the skill tree and orchestration scripts were repointed.

Dual-system production (`propose.mode: dual`) ran across Ideation and Preparation. The Codex proposer ran independently in parallel with the Claude producer. Four real defects were caught before they could propagate:

1. **`coding`/sync pre-existing-red gate** (Ideation): Codex flagged that the `coding` skill's sync pre-existing-red test gate must be verified before the task. Claude had not scoped this as a readiness prerequisite.
2. **FAMILY_B exact-line baseline co-touch** (Ideation): Codex identified that integration test changes co-touch the exact-line baseline. Claude had not planned for this dependency.
3. **GAP-3: runtime-broken `check-plugin-invocability.sh`** (Preparation): Codex flagged the `printf exit-2` bug and the 13 stale refs in the check script.
4. **Omitted worktree self-edit mistake candidates** (Preparation iter2 eval): The Codex evaluator caught that two known worktree pitfalls had not been staged as mistake-candidates despite being recognized corrections.

## What shipped

Memory promotions this wrap-up:
- `mistakes/verification/gitignore-aware-residual-gate.md` — residual gates in worktree sessions must use `git grep`, not plain grep
- `mistakes/assumption/frozen-history-by-doc-type-not-dir.md` — classify references by doc-type and claim-tense, not directory
- `mistakes/codex/opposite-system-peer-must-be-read-only.md` — Execution-loop Codex proposers must not modify source files
- `archive/backlogs/tooling/2026-07-21-claude-skills-mirror-policy.md` — historical mirror-policy
  backlog, closed after sync-owned per-file reconciliation shipped
- `archive/backlogs/tooling/2026-07-20-validate-integration-log-spec-drift.md` — open: reconcile Integration Log validator vs production.md spec + pipe-escape rule
- `backlogs/docs/skill-writing-dead-mistake-links.md` — open: repoint 3 dead links in skill-writing/SKILL.md

Not promoted (duplicate-covered by existing mistakes):
- `per-iter-draft-must-be-immutable` (staged) → covered by `mistakes/verification/iteration-artifact-edited-in-place-destroys-snapshot.md`
- Execution mistake 2 (Codex wrapper 0 files) → covered by `mistakes/codex/codex-wrapper-file-persistence-failure.md`

Folded into this journal (minor session records):
- `discriminator-wording-precision` — wording precision note: the active-vs-frozen discriminator in R1's operationalization was fixed in Planning; the two-step rule (doc-type + claim-tense) is the correct discriminator, not `status: active` alone.
- `gap3-printf-bug-scope-extension` — scope extension record: user approved fixing the `printf exit-2` bug in `check-plugin-invocability.sh` as part of R1's ref removal.
- `dual-system-value-at-creation-time` — value record: dual-system production at WORK time (not just eval) caught 4 real defects this session, validating that Codex independent runs at creation time are a meaningful gate for preparation/readiness tasks.

## What got stuck

Nothing is in-flight stuck. All three refactors completed. The `.claude/skills/coding` mirror gap is documented in the open backlog.

## What shifted

- GAP-3 (the `check-plugin-invocability.sh` printf bug) was added to R1's scope after Preparation analysis. Claude did not identify the script as runtime-broken; Codex flagged it.
- The `per-iter-draft-must-be-immutable` mistake was staged but turned out to be a duplicate of an existing mistake — dropped at Wrap-up to avoid fragmentation.
- Execution mistake 2 (Codex wrapper 0 files) also turned out to be covered by an existing mistake.

## Decisions to respect

- **Two-step discriminator for refactor reference classification**: (1) doc-type test — is this a time-stamped historical record? (2) claim-tense test — does it make a present-tense-live claim? Do NOT use directory or `status:` field alone.
- **`git grep` for residual gates**: All "zero residual references" criteria in a worktree session must use `git grep`, not plain `grep -rn`.
- **Codex proposers are source-read-only**: An Execution-loop Codex proposer must not modify, create, or delete any source file. The manager diffs the source tree after proposer completes and resets any unauthorized changes before the executor runs.
- **Printf bug fix was in-scope under Principle 5**: User approved the scope extension for fixing the runtime-broken `check-plugin-invocability.sh` as part of R1.

## Next session

- No active work needed to continue R1/R2/R3 — all shipped.
- Addressed: the `.claude/skills` mirror is sync-owned; the historical policy record is
  `archive/backlogs/tooling/2026-07-21-claude-skills-mirror-policy.md`.
- Open: Integration Log validator/spec drift + pipe-escape rule (`archive/backlogs/tooling/2026-07-20-validate-integration-log-spec-drift.md`)
- Open: `skill-writing/SKILL.md` dead links (`backlogs/docs/skill-writing-dead-mistake-links.md`)
- The coding skill (`skills/coding/SKILL.md`) was added 2026-06-24 but workflow wiring (how it fits into the gobbi orchestration as a loadable skill) is deferred per `archive/backlogs/evaluation/2026-07-20-layer2-skill-promotions-pending.md`.

## Related

- [[gitignore-aware-residual-gate]] — mistake promoted this session
- [[frozen-history-by-doc-type-not-dir]] — mistake promoted this session
- [[opposite-system-peer-must-be-read-only]] — mistake promoted this session
- [[claude-skills-mirror-policy]] — backlog added this session
- [[validate-integration-log-spec-drift]] — backlog added this session
- [[skill-writing-dead-mistake-links]] — backlog added this session
