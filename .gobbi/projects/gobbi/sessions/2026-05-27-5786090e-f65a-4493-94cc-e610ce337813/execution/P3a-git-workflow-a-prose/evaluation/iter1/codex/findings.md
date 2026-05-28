VERDICT: REVISE

## Summary

The P3a post-image mostly satisfies the prose-wave contract: all 9 decision/design docs have the ADR-shaped section set, all 11 discussions have the full discussion section set including `## Related`, the reclassified narrative survives as a project-level `notes/` file, the feature-level `notes/` directory is gone, and the leak gate prints no files.

Two defects remain. One `## Related` entry introduced by the reshape points to a non-existent same-feature decision even though the correct cross-feature decision path is already present in frontmatter. The direct-mode docs also leave three different setting-key spellings in the reviewed post-image (`git.workflow.mode`, `session.json.git.workflow.mode`, and `workflow.git.mode`) while the canonical workflow reads `settings.git.workflow.mode`. Both violate the zero-context reader bar because a future agent cannot reliably follow the references or copy the opt-out setting without re-deriving the source of truth.

## Findings

1. [type: general] [severity Med] [confidence 93] `workflow-phase-doc-set-for-per-iter-cadence.md` has a broken `## Related` pointer for the mirror-canonical-symlinks policy.

   Evidence:
   - `.gobbi/projects/gobbi/features/git-workflow/design/workflow-phase-doc-set-for-per-iter-cadence.md:11-13` frontmatter correctly points at `features/install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md`.
   - `.gobbi/projects/gobbi/features/git-workflow/design/workflow-phase-doc-set-for-per-iter-cadence.md:42` and `:68` instead use `decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`.
   - File-existence check: `.gobbi/projects/gobbi/features/git-workflow/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` is missing; `.gobbi/projects/gobbi/features/install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md` exists.

   Why this matters: the prose reshape moved the old cross-reference into `## Related`, but left it as a same-feature relative path. A zero-context reader following the body's Related section will look in the wrong feature and fail to resolve the decision the design relies on.

2. [type: general] [severity Med] [confidence 90] The direct-mode post-image still gives future readers contradictory setting keys for the same opt-out.

   Evidence:
   - Canonical workflow source: `.gobbi/projects/gobbi/skills/orchestration/SKILL.md:102`, `:109`, and `:116` read `settings.git.workflow.mode`.
   - Reviewed design doc: `.gobbi/projects/gobbi/features/git-workflow/design/direct-mode-retained-opt-out.md:3` says `git.workflow.mode=direct`; line `:22` says the guard is `session.json.git.workflow.mode == "direct"` and also says the user sets `settings.git.workflow.mode = "direct"`; line `:35` says the skills must reference `settings.git.workflow.mode`.
   - Reviewed discussion doc: `.gobbi/projects/gobbi/features/git-workflow/discussions/2026-05-24-direct-mode-opt-out-doc-home.md:19` and `:36` say `workflow.git.mode = 'direct'`.

   Why this matters: this is not just provenance wording. The docs are meant to preserve the direct-mode opt-out contract, and a future agent could copy one of the two wrong spellings into instructions or settings. The section 4.1 zero-context bar requires the doc to carry the usable setting name without requiring a reader to reconcile three competing keys against `orchestration/SKILL.md`.

## Notes-placement check

- Project-level note exists at `.gobbi/projects/gobbi/notes/2026-05-23-workflow-phase-doc-set-enumeration.md`.
- Note frontmatter has `type: notes`, `scope: project`, `feature: null`, and `features_touched: [git-workflow]`.
- `find .gobbi/projects/gobbi/features -type d -name notes -print` printed nothing.
- Design to note link resolves: `.gobbi/projects/gobbi/features/git-workflow/design/../../../notes/2026-05-23-workflow-phase-doc-set-enumeration.md`.
- Note to design path resolves when interpreted from project root: `.gobbi/projects/gobbi/notes/../features/git-workflow/design/workflow-phase-doc-set-for-per-iter-cadence.md`.

## Verification outputs

`git show --stat --oneline 183dbfb`

```text
183dbfb docs(prose): P3a - features/git-workflow discussions+design+decisions §4.2 contracts + self-contained prose
 ...05-24-rollback-semantics-drift-from-ideation.md | 14 +++-
 .../2026-05-24-session-commit-storage-bounds.md    | 27 ++++---
 ...n-diff-scope-gate-semantics-under-bundled-pr.md | 31 ++++----
 .../design/direct-mode-retained-opt-out.md         | 25 ++++---
 .../design/per-iteration-session-commit-cadence.md | 19 +++--
 .../design/promote-now-commit-on-branch.md         | 20 ++++--
 .../design/qualified-git-write-path-rule.md        | 17 +++--
 .../workflow-phase-doc-set-for-per-iter-cadence.md | 84 ++++++----------------
 .../design/worktree-create-before-session-stamp.md | 23 ++++--
 .../2026-05-24-direct-mode-opt-out-doc-home.md     |  5 ++
 .../2026-05-24-promote-now-rollback-doc-home.md    |  5 ++
 .../discussions/branch-prefix-sub-option.md        | 28 +++++---
 .../discussions/bundle-scope-confirmation.md       | 47 ++++++++----
 .../discussions/gap-resolutions-9-batch.md         | 11 +++
 .../discussions/non-feature-session-scope.md       | 24 +++++--
 .../discussions/per-iter-commit-subject-scope.md   | 26 +++++--
 .../promote-now-depends-on-worktree-first.md       | 24 +++++--
 .../discussions/session-memory-survival.md         | 28 ++++++--
 .../worktree-first-failure-mode-confirm.md         | 25 +++++--
 .../worktree-first-vs-collapsing-strategies.md     | 25 +++++--
 ...026-05-23-workflow-phase-doc-set-enumeration.md | 50 +++++++++++++
 21 files changed, 383 insertions(+), 175 deletions(-)
```

`git show --stat --oneline dc0e5a9`

```text
dc0e5a9 fix(prose): P3a - relocate reclassified note to project-level notes/ (notes is project-only)
 .../design/workflow-phase-doc-set-for-per-iter-cadence.md    |  2 +-
 .../notes/2026-05-23-workflow-phase-doc-set-enumeration.md   | 12 ++++++------
 2 files changed, 7 insertions(+), 7 deletions(-)
```

Section-contract check:

```text
No missing sections printed.
```

D5 scan:

```text
.gobbi/projects/gobbi/features/git-workflow/discussions/per-iter-commit-subject-scope.md:34:Design Decision D-4's commit subject pattern is locked: `chore(session): record <loop> iter{n} memory` (e.g., `chore(session): record ideation iter3 memory`). All 5 workflow loop docs carry this pattern.
.gobbi/projects/gobbi/features/git-workflow/design/per-iteration-session-commit-cadence.md:29:Subject format: `chore(session): record <loop> iter{n} memory` (e.g., `chore(session): record ideation iter3 memory`).
D5_EXIT=0
```

D5 interpretation: both hits are legitimate commit-subject pattern examples, not load-bearing vanished-session coordinates.

Leak gate:

```text
LEAK_EXIT=123
```

Leak gate interpretation: no offending files printed. Exit 123 is `xargs` propagating grep's no-match status in this shell pipeline, not evidence of leaked keys.

Scope check:

```text
git diff --name-only 183dbfb^ dc0e5a9 | rg -v '^\.gobbi/projects/gobbi/features/git-workflow/(discussions|design|decisions)/|^\.gobbi/projects/gobbi/notes/2026-05-23-workflow-phase-doc-set-enumeration\.md$'

No output.
```
