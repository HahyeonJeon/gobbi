# Promotion Manifest — Session 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245

## Header — Suspended-Promotion Mode

This Wrap-up runs in **suspended-promotion mode** per the user's explicit scope decision at the Wrap-up DISCUSSION AskUserQuestion round (session end):

> "Suspend promotion — staging stays session-scoped; only write journal + handoff (Recommended)"

**Authorization source**: Wrap-up scope AskUserQuestion, session 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245, Wrap-up DISCUSSION phase. The user selected "Recommended" option: suspend all staging → project-memory promotion.

**Rationale**: This session's work WAS the project-memory cleanup itself (pre-rebuild sweep). The 13 placeholder-subdir resets wiped prior project memory and replaced it with README.md stubs. Promoting this session's 50+ staged artifacts back into those just-placeholdered subdirs would contradict the user-locked Q2+Q-A intent (placeholder state is the intended post-session state of project memory until the bottom-up rebuild starts). The kept session dir is now tracked in git history via PR #264 commit 3 (`a371203`) + F-CX-PREP-O-02 fixup commit `42db8be`; all staging files survive under `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/`.

**Narrow exceptions (explicit user expectation)**:
1. Per-session journal at `notes/2026-05-22-pre-rebuild-sweep.md` — this IS written (Wrap-up Step 6; the audit log of the cleanup itself; user's scope decision does not suspend this).
2. `session.json` wrap-up entry — bookkeeping only.

All other staging files are documented below as `disposition: session-scoped-only`.

---

## Manifest — 67 staging files

Standard disposition fields for all 67 entries in suspended-promotion mode:

```
disposition: session-scoped-only
rationale: User-locked suspended-promotion mode per Wrap-up scope AskUserQuestion answer; project memory intentionally placeholder per Q2+Q-A locks; staging survives in git history at the kept session dir (now tracked via PR #264 commit 3 + F-CX-PREP-O-02 fixup at develop tip 42db8be).
```

### Ideation staging

---

- path: ideation/staging/decisions/aesthetics-atomic-guard-repetition.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/aesthetics-atomic-guard-repetition.md
  rationale: Suspended-promotion mode. Evaluator aesthetic finding, no feature-dir bootstrapped.

---

- path: ideation/staging/decisions/aesthetics-d11-fivefold-redundancy.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/aesthetics-d11-fivefold-redundancy.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/aesthetics-d6-row-label-drift.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/aesthetics-d6-row-label-drift.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/aesthetics-decisions-log-redundancy.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/aesthetics-decisions-log-redundancy.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/aesthetics-final-iter-frontmatter-nonstandard.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/aesthetics-final-iter-frontmatter-nonstandard.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/bare-uuid-delete-not-sequenced.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/bare-uuid-delete-not-sequenced.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/body-grep-verify-empirically-false.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/body-grep-verify-empirically-false.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/claude-md-dangling-links-post-sweep.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/claude-md-dangling-links-post-sweep.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/counterfactual-narrowly-stated.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/counterfactual-narrowly-stated.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/d2-verification-count-inconsistent.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/d2-verification-count-inconsistent.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/false-alarm-gate-trains-bypass.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/false-alarm-gate-trains-bypass.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/gh-delete-branch-local-cleanup-wording.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/gh-delete-branch-local-cleanup-wording.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/gitignore-line-cited-by-line-number.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/gitignore-line-cited-by-line-number.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/git-rm-vs-rm-rf-discipline.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/git-rm-vs-rm-rf-discipline.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/i11-d11-cite-false-squash-body-shape.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/i11-d11-cite-false-squash-body-shape.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/inline-commit-vs-fs-labels-missing.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/inline-commit-vs-fs-labels-missing.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/manager-bash-pwd-drift-from-worktree-cd.md
  artifact_type: mistake-candidate
  disposition: session-scoped-only
  destination: (would-have-been) mistakes/manager-bash-pwd-drift-from-worktree-cd.md (project-scope; frontmatter: scope: project)
  rationale: Suspended-promotion mode. NOTE: this mistake-candidate is intentionally kept session-scoped per the user-locked suspended-promotion scope. The mistake content (manager bash pwd drift from worktree cd) is preserved in the session staging. The `gobbi mistake promote` command is the normal promotion path but is not run in this mode — the mistake survives in git history.

---

- path: ideation/staging/decisions/merge-head-stability.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/merge-head-stability.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/mistake-files-in-delete-set.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/mistake-files-in-delete-set.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/optional-local-sync-step.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/optional-local-sync-step.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/per-stage-commit-labels-unclear.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/per-stage-commit-labels-unclear.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/post-merge-sweep-branch-not-deleted.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/post-merge-sweep-branch-not-deleted.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/prior-session-c676684d-not-named-in-delete-set.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/prior-session-c676684d-not-named-in-delete-set.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/sha-gate-self-referential.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/sha-gate-self-referential.md
  rationale: Suspended-promotion mode. F-CX-OV-01: Codex iter2 Critical catch — self-referential SHA gate.

---

- path: ideation/staging/decisions/single-pr-orthogonal-edits.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/single-pr-orthogonal-edits.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/stage-d-e-commit-boundary-ambiguity.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/stage-d-e-commit-boundary-ambiguity.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/stage-e-last-bullet-ambiguous.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/stage-e-last-bullet-ambiguous.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/staging-backlog-fate-post-sweep.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/staging-backlog-fate-post-sweep.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/stub-redirect-format-wrong-for-placeholders.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/stub-redirect-format-wrong-for-placeholders.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/success-criteria-commit-count-missing.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/success-criteria-commit-count-missing.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/usage-iter4-merge-commit-oid-dropped.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/usage-iter4-merge-commit-oid-dropped.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/decisions/worktrees-find-without-mindepth.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/worktrees-find-without-mindepth.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/design/d1-d5-core-sweep-architecture.md
  artifact_type: design
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/design/d1-d5-core-sweep-architecture.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/design/d6-d11-gates-codex-rebuild-deferred.md
  artifact_type: design
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/design/d6-d11-gates-codex-rebuild-deferred.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/discussions/q1-q5-q7-codebase-wipe-scope.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/q1-q5-q7-codebase-wipe-scope.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/discussions/q2-qa-project-memory-placeholder-vs-survivor.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/q2-qa-project-memory-placeholder-vs-survivor.md
  rationale: Suspended-promotion mode. Highest-value discussion: Q2+Q-A locked the placeholder-state design.

---

- path: ideation/staging/discussions/q3-single-pr-atomic-sweep.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/q3-single-pr-atomic-sweep.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/discussions/q4-qe-gitignore-policy.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/q4-qe-gitignore-policy.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/discussions/q8-qb-qd-qf-qg-branches-sessions-tags.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/q8-qb-qd-qf-qg-branches-sessions-tags.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/discussions/q-gate-redesign-non-circular-e2-gate.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/q-gate-redesign-non-circular-e2-gate.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/discussions/q-iter4-override-atomic-guard.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/q-iter4-override-atomic-guard.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/discussions/q-survivor-q-stagee-iter2-evaluator-driven.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/q-survivor-q-stagee-iter2-evaluator-driven.md
  rationale: Suspended-promotion mode.

---

- path: ideation/staging/backlogs/project/cli-regenerates-gobbi-gitignore.md
  artifact_type: project-backlog
  disposition: session-scoped-only
  destination: (would-have-been) backlogs/cli-regenerates-gobbi-gitignore.md
  rationale: Suspended-promotion mode.

---

### Preparation staging

---

- path: preparation/staging/decisions/prep-iter2-binding-constraint-phrasing.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/prep-iter2-binding-constraint-phrasing.md
  rationale: Suspended-promotion mode.

---

- path: preparation/staging/decisions/prep-iter2-task-size-implication.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/prep-iter2-task-size-implication.md
  rationale: Suspended-promotion mode.

---

- path: preparation/staging/decisions/prep-iter2-wording-staged-vs-worktree.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/prep-iter2-wording-staged-vs-worktree.md
  rationale: Suspended-promotion mode.

---

- path: preparation/staging/decisions/prep-mistake-memory-continuity.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/prep-mistake-memory-continuity.md
  rationale: Suspended-promotion mode. F-CX-PREP-O-01 (High/75): mistake-memory continuity constraint pre-routed to Planning.

---

- path: preparation/staging/decisions/prep-project-json-deletion-drift.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/prep-project-json-deletion-drift.md
  rationale: Suspended-promotion mode. F-CX-PREP-O-02 (Medium/75): project.json deletion missed from executor brief — addressed post-merge as commit 42db8be.

---

- path: preparation/staging/discussions/prep-codex-divergence-iter2.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/prep-codex-divergence-iter2.md
  rationale: Suspended-promotion mode.

---

### Planning staging

---

- path: planning/staging/checklists/planning-eval-verify-derived-summary-staleness.md
  artifact_type: checklist
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/checklists/planning-eval-verify-derived-summary-staleness.md
  rationale: Suspended-promotion mode.

---

- path: planning/staging/decisions/deferred-cosmetic-metadata-staleness.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/deferred-cosmetic-metadata-staleness.md
  rationale: Suspended-promotion mode. Low/35 cosmetic findings (F-CL3-P-01, F-CL3-R-01) — deferred-to-future-session.

---

- path: planning/staging/decisions/deferred-rollback-branch-tips-coverage.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/deferred-rollback-branch-tips-coverage.md
  rationale: Suspended-promotion mode.

---

- path: planning/staging/decisions/main-md-docs-sync-residual-iter4.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/main-md-docs-sync-residual-iter4.md
  rationale: Suspended-promotion mode.

---

- path: planning/staging/decisions/role-boundary-executor-scope-leak.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/role-boundary-executor-scope-leak.md
  rationale: Suspended-promotion mode. Critical/90 Codex finding that drove role-boundary split design.

---

- path: planning/staging/decisions/stage-d-e1-commit-boundary-ambiguity.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/stage-d-e1-commit-boundary-ambiguity.md
  rationale: Suspended-promotion mode.

---

- path: planning/staging/decisions/tag-form-annotated-to-lightweight.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/tag-form-annotated-to-lightweight.md
  rationale: Suspended-promotion mode. Codex iter3 High/85: tag changed from annotated to lightweight.

---

- path: planning/staging/decisions/worktree-remove-precheck-required.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/worktree-remove-precheck-required.md
  rationale: Suspended-promotion mode.

---

- path: planning/staging/design/atomic-guard-merge.md
  artifact_type: design
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/design/atomic-guard-merge.md
  rationale: Suspended-promotion mode.

---

- path: planning/staging/design/role-boundary-split.md
  artifact_type: design
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/design/role-boundary-split.md
  rationale: Suspended-promotion mode.

---

- path: planning/staging/design/single-executor-sweep.md
  artifact_type: design
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/design/single-executor-sweep.md
  rationale: Suspended-promotion mode.

---

- path: planning/staging/discussions/plan-iter1-d-plan-01-03-04.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/plan-iter1-d-plan-01-03-04.md
  rationale: Suspended-promotion mode.

---

- path: planning/staging/discussions/plan-iter2-revise-fix-1234.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/plan-iter2-revise-fix-1234.md
  rationale: Suspended-promotion mode.

---

- path: planning/staging/discussions/plan-iter3-revise-fix-tag-form.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/plan-iter3-revise-fix-tag-form.md
  rationale: Suspended-promotion mode.

---

- path: planning/staging/discussions/plan-iter4-revise-docs-sync.md
  artifact_type: discussion
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/discussions/plan-iter4-revise-docs-sync.md
  rationale: Suspended-promotion mode.

---

- path: planning/staging/plans/main.md
  artifact_type: plan
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/plans/2026-05-21-main.md
  rationale: Suspended-promotion mode.

---

### Execution staging (Task 02 only — Task 01 had zero staging files)

---

- path: execution/02-cleanup-sweep/staging/changelogs/02-cleanup-sweep-shipped.md
  artifact_type: changelog
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/changelogs/02-cleanup-sweep-shipped.md
  rationale: Suspended-promotion mode.

---

- path: execution/02-cleanup-sweep/staging/decisions/cleanup-followup-project-json.md
  artifact_type: decision
  disposition: session-scoped-only
  destination: (would-have-been) features/repo-reset/decisions/cleanup-followup-project-json.md
  rationale: Suspended-promotion mode. F-CX-PREP-O-02 follow-up decision: project.json deletion as post-merge commit 42db8be.

---

- path: execution/02-cleanup-sweep/staging/learnings/gitignored-content-doesnt-transfer-to-worktree.md
  artifact_type: learning
  disposition: session-scoped-only
  destination: (would-have-been) learnings/gitignored-content-doesnt-transfer-to-worktree.md
  rationale: Suspended-promotion mode. This is a high-value cross-feature learning; its content is referenced in the per-session journal and handoff summary for discoverability.

---

- path: execution/02-cleanup-sweep/staging/notes/post-merge-state-2026-05-22.md
  artifact_type: note
  disposition: session-scoped-only
  destination: (would-have-been) notes/2026-05-22-post-merge-state.md
  rationale: Suspended-promotion mode. Content synthesized into the per-session journal (notes/2026-05-22-pre-rebuild-sweep.md) which IS written as the Wrap-up Step 6 narrow exception.

---

## Summary

| Category | Count |
|----------|-------|
| Total staging files | 67 |
| disposition: session-scoped-only | 67 |
| Promoted to project memory | 0 |
| Narrow exceptions (journal + session.json) | 2 writes |

All 67 staging files are fully accounted for. No silent drops. No improvised destinations.
