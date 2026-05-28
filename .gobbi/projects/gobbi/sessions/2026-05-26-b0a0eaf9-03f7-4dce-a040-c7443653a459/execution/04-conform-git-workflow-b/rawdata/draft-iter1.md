# T4 Execution Notes — draft-iter1

## Task
Conform features/git-workflow/ T4 subdirs (backlogs, changelogs, checklists, plans, references, scenarios + README) — 21 docs — to dev-doc standard §4.

## Files

### backlogs/ (3 files)
All 3 carry illegitimate staging keys: `finding-id`, `confidence`, `severity`, and in two files also `finding-type`, `supersedes`, `superseded_by`.
- `abort-mid-commit-partial-session.md`: strip `finding-id`, `confidence`, `severity`, `supersedes`, `superseded_by`; add `name`, `description`, `type: backlogs`, `tags`; PRESERVE `disposition: deferred`; convert `date` → `created`
- `anchor-slug-4-hyphen-vs-2-hyphen.md`: strip `finding-id`, `finding-type`, `confidence`, `severity`, `supersedes`, `superseded_by`; add `name`, `description`, `type: backlogs`, `tags`; PRESERVE `disposition: open`; convert `date` → `created`
- `chore-label-line-citation-stale.md`: strip `finding-id`, `confidence`, `severity`, `supersedes`, `superseded_by`; add `name`, `description`, `type: backlogs`, `tags`; PRESERVE `disposition: open`; convert `date` → `created`; rename `type: general` → `type: backlogs`

### changelogs/ (3 files)
- `2026-05-24-worktree-create-config-step.md`: missing 9 base keys; `task` and `plan` are non-standard staging keys; convert `date` → `created`; add `name`, `description`, `type: changelogs`, `tags`; strip `task`, `plan`; body §4.3: "Task 01" title references session-internal task code — annotate in body with self-contained expansion
- `2026-05-26-bundle-a-rehome.md`: missing 9 base keys; `task` and `plan` are non-standard staging keys; convert `date` → `created`; add `name`, `description`, `type: changelogs`, `tags`; strip `task`, `plan`
- `2026-05-26-bundle-b-rehome.md`: already has most keys; `shipped_in` is per-type extension for changelogs (acceptable); no staging S-set keys present; add missing `name` (already has), check `tags`

### checklists/ (5 files)
All carry illegitimate staging keys. `disposition` on checklists is NOT a backlogs extension — strip it.
- `chore-label-line-citation-stale.md`: strip `finding-id`, `confidence`, `severity`, `disposition`; add `name`, `description`, `type: checklists`, `status`, `created`, `session`, `tags`; rename `type: general` → `type: checklists`; convert `date` → `created`
- `config-table-row-numbering-choice.md`: strip `finding-id`, `confidence`, `severity`, `disposition`; add `name`, `description`, `type: checklists`, `status`, `created`, `session`, `tags`; rename `type: checklist_gap` → `type: checklists`; convert `date` → `created`
- `migration-smoke-test-post-merge.md`: strip `finding-id`, `confidence`, `severity`, `disposition`, `scenario`; add `name`, `description`, `type: checklists`, `status`, `created`, `session`, `tags`; rename `type: checklist_gap` → `type: checklists`; convert `last_updated` → `created`
- `phase-doc-count-verification.md`: strip `finding-id`, `confidence`, `severity`, `disposition`, `scenario`, `addressed-by`; add `name`, `description`, `type: checklists`, `status`, `created`, `session`, `tags`; rename `type: checklist_gap` → `type: checklists`; convert `last_updated` → `created`
- `skill-md-commit-type-feat-vs-docs.md`: strip `finding-id`, `finding-type`, `confidence`, `severity`, `disposition`, `source_iter`, `source_system`, `source_file`; add `name`, `description`, `type: checklists`, `status`, `created`, `session`, `tags`

### plans/ (1 file)
- `2026-05-24-session-foundations-bundle-b.md`: strip `task`; add `name`, `description`, `type: plans`, `tags`; `supersedes: null` → keep but change to valid form; convert `date` → `created`; body §4.3: T1/T3 task code refs are acceptable in a plan doc (plan is a structured listing); title references session sprint name which is self-contained enough

### README.md (1 file)
Feature README. Base keys include `name`, `description`, `type: features`, `scope: feature`, `feature: git-workflow`, `status`, `created`, `session`, `tags`. Currently missing: `name`, `description`, `type`, `session`, `tags`. Has non-standard keys: `project`, `last_updated`.
- Remove `project` and `last_updated` (not in base or type extension for features README; `value_proposition` and `subsystems` are legit per §2.2)
- Add `name`, `description`, `type: features`, `session`, `tags`

### references/ (5 files)
References type extensions per §2.2: `title`, `source`, `accessed`, `ref_type`. `tags` and `related` also appear (tags is base, related is extension for references).
- `claude-code-worktree-isolation-pattern.md`: missing base keys `name`, `description`, `type`, `status`, `created`; has `tags` and `related`; `type: docs` is wrong (that's ref_type); fix type→`references`, add ref_type; convert `session` format
- `claude-jj-worktree-shim-pattern.md`: same pattern
- `commitlint-required-fields-validator.md`: same pattern  
- `jj-workspace-isolation-revision-not-branch.md`: same pattern
- `worktree-scope-by-module-not-task.md`: same pattern

### scenarios/ (3 files)
All carry illegitimate staging keys. `disposition` on scenarios is NOT backlogs — strip it.
- `branch-name-collision-recovery.md`: strip `finding-id`, `finding-type`, `confidence`, `severity`, `disposition`, `source_iter`, `source_system`, `source_file`; rename `scenario` key and `category` key (non-standard); add `name`, `description`, `type: scenarios`, `created`, `session`, `tags`; convert `added` → `created`, drop `added_by_session`
- `no-issue-worktree-branch-bootstrap.md`: same strip pattern; convert `added` → `created`
- `ssid-env-var-absent-fallback.md`: same strip pattern; convert `added` → `created`

## Body §4.3 session-coord leaks

- changelogs/2026-05-24-worktree-create-config-step.md: title "Task 01 — Configuration Step 1 Row 5.5 Worktree Create" has session task code; body references iter2, row 5.5, R-001, R-002, S-001 finding IDs in Related section. The Related section is legitimate deferred-finding list; keep internal finding references in Deferred section (they are internal eval codes in a session changelog context; this is a changelog so session-coord references in Deferred/Related are appropriate for the type)
- plans/2026-05-24-session-foundations-bundle-b.md: "T1 wave" / "T3 wave" in body are plan-internal task references which are appropriate for the plans type
- checklists: "iter1-P4", "T1-I-T1.h", "D-4 design decision" in body are session-coord refs that need expansion
- scenarios: "finding R-002", "finding R-001" in Related sections reference session eval codes — reclassify or expand
- backlogs: "R4-iter1", "evaluation/iter1/..." references in Related — keep in backlogs as they trace to source evals

## Out-of-scope observations

1. checklists/chore-label-line-citation-stale.md body references `draft-iter3.md` lines (session-internal) — the body content describes a specific line in a staging file; this is a historical artifact acceptable in a checklist noting a specific citation issue.
2. backlogs/abort-mid-commit-partial-session.md Related section refs `evaluation/iter1/...` paths — these are session-internal. Since this is a backlog item body (not an evergreen design), keeping the tracing provenance is appropriate.
3. plans/2026-05-24-session-foundations-bundle-b.md body references T1/T3 task codes throughout — this is a plan doc, which IS a session-contextual type; the plan's task table is its primary content.
4. references/commitlint-required-fields-validator.md body mentions "T2's 'Load Directives validator'" — this is a session-internal reference but the reference explains the application context; de-crypt: replace "T2's" with the actual subject name.
