---
type: rawdata
sub-step: WORK-remediate-promotion-strip
session: 2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459
created: 2026-05-27
status: done
---

# Promotion Strip Fix — Executor Notes

## What was fixed

23 newly-promoted durable project-memory files leaked staging frontmatter
keys because the Wrap-up assistant promoted them without applying the §2.3
strip-on-promotion rule. The §4.5 full-tree conformance gate regressed from
0 to 23 as a result.

## Files fixed (23 total)

**Backlog (1):**
- `backlogs/evaluation-perspective-for-dev-doc-quality.md` — stripped `task: null`; added `type:`, `scope: project`, `session:`, `disposition: deferred` (backlog — disposition KEPT)

**Decisions — ideation-format (4):**
- `features/project-memory/decisions/fix1-subcounts-cross-foot-cosmetic.md` — stripped `finding-id:`, `disposition:`
- `features/project-memory/decisions/type-aware-strip-disposition-not-blanket-leak.md` — stripped `finding-id:`, `disposition:`, `addressed-in:`
- `features/project-memory/decisions/population-predicate-explicit-baseline-commit.md` — stripped `finding-id:`, `disposition:`, `addressed-in:`
- `features/project-memory/decisions/agents-md-13-principles-confirm-defer-at-planning.md` — stripped `finding-id:`, `disposition:`

**Decisions — planning-eval-finding-format (9):**
- `features/project-memory/decisions/triplicate-backlog-remediated.md` — stripped `severity:`, `confidence:`, `disposition:`; added `scope: feature`
- `features/project-memory/decisions/context-budget-wave-ordering-carry-forward.md` — stripped `severity:`, `confidence:`, `disposition:`; added `scope: feature`
- `features/project-memory/decisions/t10-symlink-mismodel.md` — stripped `loop:`, `iter:`, `finding-id:`, `severity:`, `confidence:`, `disposition:`; added `scope: feature`
- `features/project-memory/decisions/codex-path-traceability.md` — stripped `severity:`, `confidence:`, `disposition:`; added `scope: feature`
- `features/project-memory/decisions/archive-glob-scope-leak.md` — stripped `loop:`, `iter:`, `finding-id:`, `severity:`, `confidence:`, `disposition:`; added `scope: feature`
- `features/project-memory/decisions/coupling-mischaracterization-deferred.md` — stripped `severity:`, `confidence:`, `disposition:`; added `scope: feature`
- `features/project-memory/decisions/underscore-staging-keys-false-clean.md` — stripped `loop:`, `iter:`, `finding-id:`, `severity:`, `confidence:`, `disposition:`; added `scope: feature`
- `features/project-memory/decisions/prose-tasks-exceed-context-ceiling.md` — stripped `loop:`, `iter:`, `finding-id:`, `severity:`, `confidence:`, `disposition:`; added `scope: feature`
- `features/project-memory/decisions/fx1-sub-count-cross-foot.md` — stripped `severity:`, `confidence:`, `disposition:`; added `scope: feature`

**Plans (1):**
- `features/project-memory/plans/2026-05-26-dev-doc-standard-retrofit.md` — stripped `task:`

**Discussions (3):**
- `features/project-memory/discussions/2026-05-26-conformance-first-then-prose.md` — stripped `loop:`
- `features/project-memory/discussions/2026-05-26-scope-spine-three-tier-priority.md` — stripped `loop:`
- `features/project-memory/discussions/2026-05-26-build-on-272-branch-defer-merge.md` — stripped `loop:`

**Scenarios (1):**
- `features/project-memory/scenarios/tier-2-3-scope-explicitly-placed.md` — stripped `finding-id:`, `disposition:`, `addressed-in:`

**Checklists (4):**
- `features/project-memory/checklists/task-count-prose-inconsistency.md` — stripped `loop:`, `iter:`, `finding-id:`, `severity:`, `confidence:`, `disposition:`; added `scope: feature`
- `features/project-memory/checklists/disposition-preservation-missing-t1-t5.md` — stripped `loop:`, `iter:`, `finding-id:`, `severity:`, `confidence:`, `disposition:`; added `scope: feature`
- `features/project-memory/checklists/symlink-edit-target-merge-back-flag.md` — stripped `scenario:`, `finding-id:`, `disposition:`, `addressed-in:`
- `features/project-memory/checklists/principle-drift-entrypoint-reconciliation.md` — stripped `scenario:`, `finding-id:`, `disposition:`, `addressed-in:`

## KEEP keys preserved

All KEEP keys retained verbatim across all 23 files:
- `type`, `scope`, `feature`, `status`, `session`, `date`/`created`, `name`/`title`, `description`,
  `tags`, `domain`, `supersedes`, `superseded_by`, `finding_ids`, `addressed-in-iter`,
  `addressed-how`, `planning-carry-forward`, `finding-iter`, `outcome`, `task_count`,
  `decision_status`, `anchor_session`, `project`.

## Bodies preserved

No body content was modified in any file. All ## sections, tables, decision text,
rationale, consequences, and related sections are intact.

## Verification evidence

1. Branch: `chore/session-2026-05-25-a10c82d6` (verified before + after commit)
2. §4.5 gate: 0 (was 23)
3. Conditional disposition-on-non-backlog: 0
4. Commit SHA: `2cd3f5f` — 23 files changed
5. diff --name-only HEAD~1 HEAD: exactly the 23 promoted files (no other files)

## Observations (out of scope — not implemented)

- The `README.md` for `features/project-memory/` has an unstaged modification from the
  prior wrap-up task (date bump + new subdirectory entries). Not in scope for this fix;
  will be picked up by the next commit in the wrap-up sequence.
- The planning-eval-finding format files (from planning staging) use `date:` rather than
  `created:` and lack `name:`, `description:`, `tags:`. Added only `scope: feature` to
  these (the one mechanical addition flagged in the brief). Full prose normalization for
  these files is a P7b / prose-quality-wave task in the retrofit plan, not this strip fix.
