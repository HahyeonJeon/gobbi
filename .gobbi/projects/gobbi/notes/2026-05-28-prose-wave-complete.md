---
name: 2026-05-28-prose-wave-complete
description: Per-session journal for the PROSE wave — all 12 tasks (P1-P7b + N1) completed and dual-system evaluated to PASS. 7 mistakes promoted, 2 backlogs filed, 1 closed backlog archived.
type: notes
scope: project
feature: null
status: active
created: 2026-05-28
session: 5786090e-f65a-4493-94cc-e610ce337813
tags: [prose-wave, dev-doc-standard, retrofit, complete]
features_touched: [project-memory, agents, evaluation, git-workflow, guardrails, install-runtime, workflow]
---

# PROSE Wave Complete — 2026-05-28

## What happened

Session 5786090e continued the dev-doc-standard conformance work from the prior session (b0a0eaf9), which had shipped the §4 conformance gate (PR #272, ecc17a3) but deferred the PROSE wave (P1-P7b+N1) to a fresh session with a locked plan. This session executed all 12 prose-wave tasks from start to finish, each with dual-system evaluation (Claude + Codex) and at least one remediation iteration where needed.

The prose wave's scope: applying the §4.2 per-type COMPLETE body-section contracts + §4.1/§4.3 self-contained prose requirements across 7 feature areas (agents, evaluation, git-workflow, guardrails, install-runtime, project-memory, workflow) plus project-tier mistake normalization. The prior session had already applied the conformance gate to the Python-generated files and the memory-system redesign; this session completed the human-authored markdown corpus.

A systemic issue surfaced mid-session: 4 memorization/evaluator subagent runs strayed to the main tree instead of the worktree. The fix was requiring full-absolute paths (not cd-first + relative) in every Write tool call. Four silent strays were detected at Wrap-up's staging inventory sweep and corrected before commit. The write-path discipline was updated session-wide after the first detection.

## What shipped

All 12 prose-wave tasks completed and evaluated PASS. Commits on `chore/session-2026-05-25-a10c82d6` (approximately 140 commits ahead of develop):

| Task | Area | Commits |
|---|---|---|
| P1 | features/agents prose | `999a403`, `7a6ecb4` |
| P2 | features/evaluation prose | `5c36142` |
| P3a | features/git-workflow prose (part A) | `183dbfb`, `3e9c5e7`, `dc0e5a9` |
| P3b | features/git-workflow prose (part B) | `de207ac`, `bfc46c8` |
| P4 | features/guardrails prose | `d24c61c`, `aa901e4` |
| P5a | features/install-runtime prose (part A) | `520cdb2`, `0369b7d`, `5628346` |
| P5b | features/install-runtime prose (part B) | `e94e94b` |
| P6a | features/project-memory prose — 16 type-fixes, ADR reshape | `f367095`, `ada3dd7` |
| P6b | features/project-memory prose (remainder) | `fddc040`, `baa0f8e` |
| P7a | project-tier mistakes/backlogs prose | `a04e509`, `9bc4db8` |
| P7b | project-tier mistakes normalization (31 files, arrow-order + heading-set + wording) | `a7d8253`, `456534b` |
| N1 | notes/ prose (project-level journal notes) | `3792cae`, `66bf1be` |

Wrap-up promotions (this session):
- 7 mistake-candidates promoted to `.gobbi/projects/gobbi/mistakes/`
- 2 backlogs promoted to `.gobbi/projects/gobbi/backlogs/`
- 1 closed backlog archived: `backlogs/memory-redesign-remaining-waves.md` → `archive/backlogs/2026-05-28-memory-redesign-remaining-waves.md`

## What got stuck

Four subagent write strays to the main tree (P2 memorization, P6b memorization + P6b Claude evaluator, P7a memorization, P7b memorization) were detected at Wrap-up inventory and corrected. The root cause: cd-first + relative Write paths is insufficient — Claude Code does not persist cd across tool boundaries. Corrected approach: every Write must use a full absolute worktree path. All four stray sessions were manually corrected before the final commits.

One open contradiction: `memorization/templates/design.md` uses an 8-section shape that conflicts with the §4.2:177 ADR contract for design docs. This was detected during P6a when two design docs had to be reshaped. The template/§4.2 reconciliation was out of P6a scope and backlogged as `design-template-stale-vs-adr-standard.md`.

## What shifted

Three notable standard-interpretation shifts this session:

1. **Template vs §4.2 for design docs:** §4.2:177 wins over the stale 8-section `templates/design.md`. The ADR shape (Context → Decision/Approach → Rationale → Alternatives → Consequences) is the live contract. The passed design-doc corpus confirms this.

2. **Arrow order in §4.2 is a sequence contract, not a set:** The `→` notation in §4.2's mistake-record shape declares physical document order, not just section membership. "Normalize heading set/wording" without enforcing the arrow-order leaves approximately 80% of migrated files with the wrong sequence.

3. **cd-first is insufficient for subagent Writes:** The prior remediation (subagent-stray-recurred-despite-absolute-path-instruction) required cd + verify. This session proved that is still insufficient when the Write tool is called with a relative path. The correct approach is full absolute worktree paths in every Write call, with no reliance on cwd state.

## Decisions to respect

- **Build on PR #272 / defer merge:** the prose wave commits are on `chore/session-2026-05-25-a10c82d6`; the branch is approximately 140 commits ahead of develop. Do not squash or rebase without user confirmation; the eval trail lives in the session dirs alongside the commits.
- **design docs = ADR per §4.2:177:** any new design doc must use ADR shape. `templates/design.md` needs reconciliation (backlogged) before it can be used as a template.
- **notes/ = project-only:** reclassification of narrative content targets `.gobbi/projects/gobbi/notes/{slug}.md` only; `features/{f}/notes/` is a type-placement violation.
- **Dual-system eval per prose task:** every prose-wave task required two independent evaluators; neither system catches everything the other does.
- **Full-normalize on mistakes includes arrow order:** user ratified the P7b iter2 run that enforced §4.2 arrow order across all 31 mistake records.
- **Subagent Writes must use full-absolute paths:** briefs must state this explicitly; cd-first + relative is not sufficient.

## Next session

The prose wave is complete. The branch is merge-ready (pending PR review). Outstanding before or after merge:

- `design-template-stale-vs-adr-standard.md` backlog: reconcile `templates/design.md` with the §4.2 ADR shape.
- `frontmatter-completeness-followup.md` backlog: post-prose-wave sweep of `features/*/README.md` + changelogs for `subsystems:` key + `status:` vocabulary.
- PR #272 push + review/merge: the worktree branch needs to be pushed to origin and a PR opened (or the existing PR updated).
