VERDICT: REVISE

## Summary

The P3b prose reshape mostly satisfies the §4.2 body-section contracts: all 21 reviewed files have the expected body sections, the reference/scenario traps are covered, the D5 body scan has no body-prose hits, and the staging-key leak gate is clean. Cross-reference resolution also passed after resolving links against the feature directory, project-memory root, repo root, and skill root.

The remaining blocker is content preservation. One changelog lost a precise, existing manifest filename and now points only at the containing staging directory. That violates the prompt's highest-priority preservation gate: facts and concrete pointers may be rewritten into self-contained prose, but they cannot be deleted or weakened without relocation.

## Findings

- [type: general] [severity High] [confidence 95] The Bundle B changelog no longer preserves the exact per-cluster routing manifest path. The diff replaced `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/execution/w3/staging/w3t3-cluster-manifest.md` with only the containing directory, and the post-image now says "Full per-cluster routing logged in the originating session's execution staging" at `.gobbi/projects/gobbi/features/git-workflow/changelogs/2026-05-26-bundle-b-rehome.md:28`. The exact manifest file exists, so this is not a dead-link cleanup; it is a deleted precision pointer. `rg -n 'w3t3-cluster-manifest'` over the reviewed P3b post-images returns no hits, confirming the filename was not relocated elsewhere.

## Cross-ref resolution check

- Checked the 21 P3b files for inline path references and `## Related` entries.
- Resolved against: the source file directory, `features/git-workflow/`, `.gobbi/projects/gobbi/`, `.gobbi/projects/gobbi/skills/`, `.claude/skills/orchestration/workflow/`, and the repo root.
- Result: `path refs checked: 78`, `resolved: 78`, `missing: 0`.
- README `## Subdirectories` matches the actual live feature subdirectories: `backlogs`, `changelogs`, `checklists`, `decisions`, `design`, `discussions`, `plans`, `references`, `scenarios`.

## Verification outputs

`git show --stat --oneline de207ac`:

```text
de207ac docs(prose): P3b — features/git-workflow rest+README §4.2 contracts + self-contained prose
 .../projects/gobbi/features/git-workflow/README.md | 23 +++++++++----
 .../backlogs/abort-mid-commit-partial-session.md   | 23 ++++++-------
 .../backlogs/anchor-slug-4-hyphen-vs-2-hyphen.md   | 31 +++++++----------
 .../backlogs/chore-label-line-citation-stale.md    | 21 +++++-------
 .../2026-05-24-worktree-create-config-step.md      | 40 ++++++++++++----------
 .../changelogs/2026-05-26-bundle-a-rehome.md       | 23 ++++++++-----
 .../changelogs/2026-05-26-bundle-b-rehome.md       | 12 +++----
 .../checklists/chore-label-line-citation-stale.md  | 21 ++++++------
 .../config-table-row-numbering-choice.md           | 28 ++++++++-------
 .../checklists/migration-smoke-test-post-merge.md  |  8 ++---
 .../checklists/phase-doc-count-verification.md     |  8 ++---
 .../skill-md-commit-type-feat-vs-docs.md           | 29 ++++++++--------
 .../2026-05-24-session-foundations-bundle-b.md     | 26 +++++++-------
 .../claude-code-worktree-isolation-pattern.md      |  5 +++
 .../references/claude-jj-worktree-shim-pattern.md  |  5 +++
 .../commitlint-required-fields-validator.md        |  4 +++
 .../jj-workspace-isolation-revision-not-branch.md  |  5 +++
 .../worktree-scope-by-module-not-task.md           |  4 +++
 .../scenarios/branch-name-collision-recovery.md    |  9 +++--
 .../no-issue-worktree-branch-bootstrap.md          | 15 ++++----
 .../scenarios/ssid-env-var-absent-fallback.md      | 17 +++++----
 21 files changed, 197 insertions(+), 160 deletions(-)
```

D5 scan:

```text
.gobbi/projects/gobbi/features/git-workflow/changelogs/2026-05-24-worktree-create-config-step.md:10:tags: [worktree, orchestration, config-step, row-5-5, idempotency]
.gobbi/projects/gobbi/features/git-workflow/scenarios/no-issue-worktree-branch-bootstrap.md:10:tags: [non-feature-session, chore-branch, worktree, row-5-5]
.gobbi/projects/gobbi/features/git-workflow/scenarios/ssid-env-var-absent-fallback.md:10:tags: [env-var, ssid, branch-naming, failure-mode, row-5-5]
.gobbi/projects/gobbi/features/git-workflow/scenarios/branch-name-collision-recovery.md:10:tags: [branch-collision, worktree, failure-mode, row-5-5, p2]
```

These D5 hits are frontmatter `tags:` only, not body prose; the prompt explicitly excludes frontmatter tags from the §4.3 body-prose leak judgment.

§4.5 leak gate:

```text
<no output>
```

Section-contract checker:

```text
files checked: 21
section contract failures: 0
```

Content-preservation check for the failing path:

```text
.gobbi/projects/gobbi/features/git-workflow/changelogs/2026-05-26-bundle-b-rehome.md:28:- Full per-cluster routing logged in the originating session's execution staging (`sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/execution/w3/staging/`).
```

```text
git show de207ac -- .gobbi/projects/gobbi/features/git-workflow/changelogs/2026-05-26-bundle-b-rehome.md
-- Full per-cluster routing logged in `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/execution/w3/staging/w3t3-cluster-manifest.md`.
+ Full per-cluster routing logged in the originating session's execution staging (`sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/execution/w3/staging/`).
```
