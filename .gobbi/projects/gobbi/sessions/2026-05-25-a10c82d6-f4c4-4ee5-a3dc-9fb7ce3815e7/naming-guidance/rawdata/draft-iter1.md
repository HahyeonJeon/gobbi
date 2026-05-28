# naming-guidance executor — iter1 draft

**Branch:** chore/session-2026-05-25-a10c82d6 (verified before every commit)
**Commits:** 5b5b0d8 (guidance edits) + 8e42fe2 (renames + ref repoint)

## Task 1 — P13 naming-clarity clause
Inserted the design's exact clause into `skills/principles/SKILL.md` (canonical, not the
`.claude/` symlink) after Procedure step 4, before "Delineation from Principle 8". Iron Law text
and Iron Law Index row 13 left unchanged. `grep -c "## Principle 13"` == 1 (no dup).

## Task 2 — rules.md §1.3 expansion
Replaced softened §1.3 in `skills/memorization/rules.md` with positive core rule + 9-category
anti-patterns table + good-vs-bad examples table. No hard regex gate. §1.1/§1.2 and §2+ untouched.

## Task 3 — renames (28 total = briefed 12 + 16 additional)

Briefed 12 (incl. forced mirror-policy sibling 9b):
| old | new |
|---|---|
| reviews/2026-05-24-execution-task-01-dual-system-eval | reviews/2026-05-24-worktree-create-config-step-dual-system-eval |
| git-workflow/changelogs/2026-05-24-task-01-row-5-5-worktree-create | .../2026-05-24-worktree-create-config-step |
| git-workflow/design/d-1-worktree-row-5-5 | .../worktree-create-before-session-stamp |
| git-workflow/checklists/decimal-row-numbering-55 | .../config-table-row-numbering-choice |
| git-workflow/discussions/2026-05-24-t1g-direct-mode-home-orchestration-skill | .../2026-05-24-direct-mode-opt-out-doc-home |
| git-workflow/discussions/2026-05-24-t1j-rollback-home-preparation-skill | .../2026-05-24-promote-now-rollback-doc-home |
| git-workflow/discussions/reframing-1-3 | .../worktree-first-vs-collapsing-strategies |
| git-workflow/discussions/new-dependency-on-1-3 | .../promote-now-depends-on-worktree-first |
| install-runtime/discussions/mirror-policy-round-1 | .../mirror-policy-workspace-canonical-superseded |
| install-runtime/discussions/mirror-policy-round-2-re-lock | .../mirror-policy-mirror-canonical-relock |
| workflow/plans/2026-05-23-main | .../2026-05-23-orch-workflow-improvements |
| agents/discussions/2026-05-24-shared-executor-tasks-07-08 | .../2026-05-24-shared-executor-context-continuity |

Additional 16 (subject names from each file's H1 title):
| old | new |
|---|---|
| agents/discussions/reframing-1-2-broader-verifier | .../t2-scope-literal-vs-broader-verifier |
| git-workflow/design/d-2-qualified-git-rule | .../qualified-git-write-path-rule |
| git-workflow/design/d-3-promote-now-commit-on-branch | .../promote-now-commit-on-branch |
| git-workflow/design/d-4-per-iter-session-commit | .../per-iteration-session-commit-cadence |
| git-workflow/design/d-5-direct-mode-retained | .../direct-mode-retained-opt-out |
| git-workflow/discussions/cp-d-2-commit-subject-scope | .../per-iter-commit-subject-scope |
| git-workflow/discussions/failure-mode-1-3-confirm | .../worktree-first-failure-mode-confirm |
| install-runtime/design/d-3-1-hook-bash-jq-stack | .../hook-bash-jq-stack |
| install-runtime/design/d-3-2-reconstructor-verify-and-fix | .../reconstructor-verify-and-fix |
| install-runtime/design/d-3-3-resolver | .../dual-hook-registration-resolver |
| install-runtime/design/d-3-4-metadata-extraction | .../metadata-extraction-input-vs-result |
| install-runtime/design/d-3-5-flock-serialization | .../flock-serialization-on-session-json |
| install-runtime/design/d-3-6-correlation-key | .../tool-use-id-correlation-key |
| install-runtime/discussions/cp-d-1-dual-hook-registration | .../dual-hook-registration-confirm |
| install-runtime/discussions/mechanism-4-1-option-c | .../hook-plus-reconstructor-mechanism |
| workflow/discussions/root-cause-1-2-hypothesis | .../skill-loading-discipline-root-cause |

All via `git mv`. 28 R, 0 D.

## Frontmatter slug updates (20 files)
Every renamed file that carried a `slug:` mirroring its old filename had it updated to the new
basename (verified slug == basename for all 20). The 8 files without a `slug:` field
(date-prefixed reviews/changelogs/discussions + the two mirror-policy files) had none to update.
mirror-policy supersede pair: `superseded_by:` frontmatter + body cross-ref in
mirror-policy-workspace-canonical-superseded repointed to mirror-policy-mirror-canonical-relock.

## Inbound-ref repoints (live nav only)
- skills/orchestration/SKILL.md — `d-2-qualified-git-rule.md` x3 -> `qualified-git-write-path-rule.md`
- design/session-lifecycle-worktree-boundaries.md — `related:` 4 entries (also fixed stale
  `features/session-foundations-bundle-b/design/` dir -> `features/git-workflow/design/`) + body
  line 140 `d-1-worktree-row-5-5.md` -> `worktree-create-before-session-stamp.md`
- mistakes/codex-subprocess-writes-to-main-tree.md — `d-2-...` Related -> new slug + corrected dir
- mistakes/session-dir-placed-outside-worktree.md — `d-2-...` (x3) + `d-4-...` Related -> new slugs

## Deliberately LEFT (historical/staging carve-outs, per brief)
- notes/2026-05-24-session-foundations-bundle-b.md:34 — historical record of shipped review path
- features/evaluation/discussions/eval-fail-revise-escalation.md:30 — `staging/design/...` historical
  narrative + a `D-3-3-resolver` design-ID prose mention in a historical iter3 record
- mirror-policy pair lines 40/45 — `preparation/staging/discussions/...` Source records (historical)
- features/workflow/changelogs/2026-05-26-bundle-a-rehome.md:24 — changelog tracker recording the
  move; "1 plan: 2026-05-23-main". DIVERGENCE FROM DESIGN: design row-10 listed this as a repoint,
  but the brief says "leave historical records/wave-plan trackers" — a changelog recording a past
  state should not be falsified. FLAGGED for manager.

## KEPT (not offenders, per design)
- step-2-5 family (5 files) + lock2-shared-executor-mega-task-risk — stable structural coordinates
  (Wrap-up Step 2.5; LOCK #2), not vanished-session indices. Design recommends KEEP.
- cross-layer-drift-gate — already subject-named (design judgment call), untouched.

## Ambiguous names flagged
- #11 shared-executor-tasks-07-08: chose design's primary `shared-executor-context-continuity`
  (subject = why shared). Alt was `hook-and-reconstructor-shared-executor`. Picked the cleaner.
- reframing-1-2-broader-verifier -> `t2-scope-literal-vs-broader-verifier`: kept the T2 token
  because the H1 frames it as "T2 scope"; subject is the literal-vs-broader verifier scope choice.
  (T2 here is borderline-index but the H1 itself uses it as the topic anchor.)

## Scope confirmation
Only principles/SKILL.md (P13 clause), rules.md (§1.3), the 28 renames + their slug-frontmatter +
4 live inbound-ref files touched. No Iron Law Index / P13-body-beyond-clause / rules.md §2+ /
main-tree / sessions/ edits. 0 deletes.
