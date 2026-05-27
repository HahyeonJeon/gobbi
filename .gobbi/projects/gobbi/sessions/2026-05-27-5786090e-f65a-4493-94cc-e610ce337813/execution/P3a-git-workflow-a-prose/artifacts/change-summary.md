---
loop: execution
iter: 2
artifact_type: change-summary
created_at: 2026-05-27
status: final
supersedes: []
related:
  - ../evaluation/iter1/claude/findings.md
  - ../evaluation/iter1/codex/findings.md
  - ../staging/decisions/prose-reclassification-target-is-project-level-notes.md
---

# P3a Change Summary — git-workflow A prose pass

## Task

P3a of the PROSE wave (locked plan `features/project-memory/plans/2026-05-26-dev-doc-standard-retrofit.md`). Scope: bring 20 docs under `features/git-workflow/{discussions,design,decisions}/` (11 discussions, 6 design, 3 decisions) to §4.2 COMPLETE per-type section contracts and §4.1/§4.3 self-contained prose.

## Commits

| Commit | Author | Description |
|--------|--------|-------------|
| `183dbfb` | executor | `docs(prose): P3a - features/git-workflow discussions+design+decisions §4.2 contracts + self-contained prose` — 21 paths, all under `features/git-workflow/{discussions,design,decisions,notes}/`. 20 docs reshaped to ADR/discussion contracts; 1 narrative session-journal reclassified to notes (placed at feature-level at this stage). |
| `dc0e5a9` | manager | `fix(prose): P3a - relocate reclassified note to project-level notes/ (notes is project-only)` — 2 paths (`design/workflow-phase-doc-set-for-per-iter-cadence.md` + `notes/2026-05-23-workflow-phase-doc-set-enumeration.md`). Moved the reclassified note from `features/git-workflow/notes/` to `.gobbi/projects/gobbi/notes/`; updated frontmatter (`scope: project`, `feature: null`) and repaired both cross-links. |
| `3e9c5e7` | executor (iter2) | iter2 remediation (+6/-6, 3 docs): F1 repointed lines 42+68 in `workflow-phase-doc-set-for-per-iter-cadence.md` to `../../install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md`; F2 normalized all mode-key refs to `settings.git.workflow.mode` in `design/direct-mode-retained-opt-out.md` and `discussions/2026-05-24-direct-mode-opt-out-doc-home.md`. |

## Per-type reshaping detail

### Decisions (3 docs)

All 3 docs now carry the full ADR section set: `## Context`, `## Decision`, `## Rationale`, `## Alternatives considered`, `## Consequences`, `## Related`, plus `## Source` where provenance was recorded.

- `2026-05-24-rollback-semantics-drift-from-ideation.md`
- `2026-05-24-session-commit-storage-bounds.md`
- `2026-05-24-plan-diff-scope-gate-semantics-under-bundled-pr.md`

### Design (6 docs)

All 6 docs now carry the full ADR-variant section set: `## Context`, `## Decision` or `## Approach`, `## Rationale`, `## Alternatives considered`, `## Consequences`, `## Related`, plus `## Source`.

- `direct-mode-retained-opt-out.md`
- `per-iteration-session-commit-cadence.md`
- `promote-now-commit-on-branch.md`
- `qualified-git-write-path-rule.md`
- `workflow-phase-doc-set-for-per-iter-cadence.md`
- `worktree-create-before-session-stamp.md`

### Discussions (11 docs)

All 11 docs now carry the full discussion section set: `## Context`, `## Question`, `## Options considered`, `## User decision`, `## Implication`, `## Related`. Two carry an additional topic-specific body section (preserved from original).

### Notes relocation

The narrative session-journal doc `2026-05-23-workflow-phase-doc-set-enumeration.md` was correctly identified as type `notes`, not a design/discussion document. The executor initially placed it at `features/git-workflow/notes/` (a feature-level notes directory). The manager fix `dc0e5a9` relocated it to project-level `notes/` per the memory-map rule that `notes/` is a project-only type (`features/{f}/notes/` does not exist). Frontmatter corrected to `scope: project`, `feature: null`, `features_touched: [git-workflow]`. Both cross-links repaired.

A mistake-candidate was staged for this brief-authoring error: `staging/decisions/prose-reclassification-target-is-project-level-notes.md`.

## Iter2 fixes

Dual-system evaluation (iter1) produced Claude PASS and Codex REVISE with 2 Med findings. Manager ground-truthed both as real:

- **F1** (broken cross-ref): `workflow-phase-doc-set-for-per-iter-cadence.md` lines 42+68 used a same-feature relative path `decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` that does not exist. The file lives in `install-runtime` feature. Fixed in `3e9c5e7` by repointing both lines to `../../install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md`.

- **F2** (wrong setting key): three different spellings appeared across the direct-mode docs (`git.workflow.mode`, `session.json.git.workflow.mode`, `workflow.git.mode`). Canonical is `settings.git.workflow.mode` per `orchestration/SKILL.md:446`. Fixed in `3e9c5e7` by normalizing all occurrences across `design/direct-mode-retained-opt-out.md` and `discussions/2026-05-24-direct-mode-opt-out-doc-home.md`.
