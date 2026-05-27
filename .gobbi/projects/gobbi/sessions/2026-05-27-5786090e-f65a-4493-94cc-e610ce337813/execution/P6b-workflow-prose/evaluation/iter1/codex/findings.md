VERDICT: REVISE

## Summary

Commit `fddc040` mostly reshapes the touched workflow memory docs into the §4.2 prose contracts without obvious frontmatter damage or D5 body-coordinate leakage. Two defects remain: one design doc is missing the required body `## Related` section, and one changelog still carries a stale unresolved path to the retired source feature README.

## Findings

1. [checklist_gap] [High] [95] `design/task-decomposition-10-tasks.md` does not satisfy the §4.2 design/ADR body contract because it has no body `## Related` section. The current file has `## Context`, `## Decision`, `## Approach`, `## Rationale`, `## Alternatives considered`, and `## Consequences`, then ends at line 53; frontmatter `related:` is not a body section and does not satisfy the prose contract. Evidence: `.gobbi/projects/gobbi/features/workflow/design/task-decomposition-10-tasks.md:46` is the final `## Consequences` heading, and `.gobbi/projects/gobbi/features/workflow/design/task-decomposition-10-tasks.md:53` is EOF with no `## Related`.

2. [general] [Medium] [85] `changelogs/2026-05-26-bundle-a-rehome.md` keeps a stale inline path for the retired source feature README. The body points to `gobbi-orchestration-workflow-improvements/README.md`, but that path does not exist under the current project/feature roots; the existing file is at `.gobbi/projects/gobbi/archive/features/gobbi-orchestration-workflow-improvements/README.md`. Evidence: `.gobbi/projects/gobbi/features/workflow/changelogs/2026-05-26-bundle-a-rehome.md:38`.

## Cross-ref resolution check

Checked changed-file body inline path/code references against the current file directory, `features/workflow/`, `.gobbi/projects/gobbi/`, `.gobbi/projects/gobbi/skills/`, and the repository root. All substantive body references resolved except:

- `.gobbi/projects/gobbi/features/workflow/changelogs/2026-05-26-bundle-a-rehome.md:38` → `gobbi-orchestration-workflow-improvements/README.md` does not resolve; current archive target exists at `.gobbi/projects/gobbi/archive/features/gobbi-orchestration-workflow-improvements/README.md`.

Excluded from unresolved-link findings: globs/placeholders such as `workflow/*.md` and `{slug}.md`, future output paths such as `rawdata/promotion-manifest.md`, and explicit negative statements about known-missing paths such as `.claude/skills/orchestration/workflow/configuration.md`.

## Verification outputs

`git show fddc040 --stat`

```text
commit fddc040efc970eb40ecde08690595a92e710844d
Author: HahyeonJeon <jeonhh0061@gmail.com>
Date:   Wed May 27 18:39:47 2026 +0000

    docs(prose): P6b — features/workflow §4.2 contracts + self-contained prose

    AI-Provenance-Record: gobbi://session/5786090e-f65a-4493-94cc-e610ce337813/task/P6b-workflow-prose
    Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

 .gobbi/projects/gobbi/features/workflow/README.md  | 13 +++++--
 .../lock2-shared-executor-mega-task-risk.md        | 22 ++++++------
 .../changelogs/2026-05-26-bundle-a-rehome.md       |  6 ++--
 .../workflow/checklists/dq-anchor-readability.md   | 26 +++++++-------
 .../workflow/checklists/dq-anchor-traceability.md  | 26 +++++++-------
 .../effort-field-non-canonical-schema.md           | 24 +++++++------
 .../checklists/task01-t1c-trace-overclaim.md       | 24 ++++++-------
 ...05-24-lock1-wave-ordering-not-graph-enforced.md | 19 +++++-----
 ...lanning-brief-mistake-load-directives-for-t1.md | 16 ++++-----
 .../step-2-5-example-non-canonical-domain-value.md | 22 ++++++------
 .../decisions/wrap-up-step-2-5-anchor-placement.md | 30 ++++++++--------
 .../wrap-up-step-2-5-escalation-default.md         | 38 +++++++++++++-------
 .../dependency-graph-strict-wave-ordering.md       | 26 ++++++++++----
 .../workflow/design/drop-legacy-setup-questions.md | 34 +++++++++++++-----
 .../workflow/design/five-locked-decisions.md       | 41 ++++++++++++++++++----
 .../features/workflow/design/glossary-placement.md | 25 ++++++++++---
 .../workflow/design/task-decomposition-10-tasks.md | 32 +++++++++--------
 .../design/wrap-up-step-2-5-compliance-check.md    | 34 ++++++++++++++----
 ...24-iter2-fix-direction-continue-this-session.md | 14 ++++----
 .../2026-05-24-wave-ordering-sequential-t1-t3.md   |  6 ++--
 .../matrix-location-ambiguity-defers-t2.md         | 26 +++++++++-----
 .../workflow/discussions/scope-bundle-selection.md | 27 +++++++++-----
 .../skill-loading-discipline-root-cause.md         | 26 +++++++++-----
 .../wrap-up-step-2-5-escalation-shape.md           | 35 ++++++++++++------
 .../plans/2026-05-23-orch-workflow-improvements.md | 33 ++++++++---------
 25 files changed, 400 insertions(+), 225 deletions(-)
```

D5 body scan:

```text
.gobbi/projects/gobbi/features/workflow/design/five-locked-decisions.md:45:**Decision**: T3 task briefs (Tasks 07-10) cite only `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`. The other two T1 mistakes (cwd routing, rm -rf safety) are NOT extended to T3.
.gobbi/projects/gobbi/features/workflow/design/five-locked-decisions.md:76:Execution proceeds with these five choices fixed. The wave gate is graph-enforced (`05 → 07`, `06 → 07`); the manager issues one delegation for Tasks 07-08; T3 briefs cite only the Iron Law 7 mistake; rollback semantics live in `preparation/SKILL.md` and the direct-mode opt-out lives as a row-5.5 footnote in `orchestration/SKILL.md`.
.gobbi/projects/gobbi/features/workflow/design/drop-legacy-setup-questions.md:25:- Optional "customize defaults?" gate — if yes, defer to the `orchestration/SKILL.md § Step 1` row-2 walk-through.
.gobbi/projects/gobbi/features/workflow/discussions/2026-05-24-iter2-fix-direction-continue-this-session.md:2:name: iter2-fix-direction-continue-this-session
.gobbi/projects/gobbi/features/workflow/discussions/2026-05-24-iter2-fix-direction-continue-this-session.md:3:description: User confirmed to address all 5 Planning iter1 REVISE findings surgically within the same session rather than deferring to a next-session re-plan.
.gobbi/projects/gobbi/features/workflow/discussions/2026-05-24-iter2-fix-direction-continue-this-session.md:10:tags: [planning, iter2, fix-direction, evaluation]
.gobbi/projects/gobbi/features/workflow/discussions/2026-05-24-iter2-fix-direction-continue-this-session.md:11:topic: iter2 fix direction — continue-this-session vs. defer to next session
.gobbi/projects/gobbi/features/workflow/discussions/2026-05-24-iter2-fix-direction-continue-this-session.md:12:outcome: Continue this session; iter2 is a surgical 5-fix pass, not a re-do
.gobbi/projects/gobbi/features/workflow/discussions/matrix-location-ambiguity-defers-t2.md:11:discussion-id: T2-matrix-deferral
.gobbi/projects/gobbi/features/workflow/discussions/wrap-up-step-2-5-escalation-shape.md:51:The full session context is preserved in `archive/decisions/2026-05-23-iter1-user-redirects.md` (the bundle this exchange was drawn from).
.gobbi/projects/gobbi/features/workflow/checklists/dq-anchor-traceability.md:34:The Codex Overall and Consistency findings and the draft's Decisions Log are preserved in the originating session: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/rawdata/draft-iter3.md`.
.gobbi/projects/gobbi/features/workflow/checklists/dq-anchor-readability.md:34:Ideation evaluation (Codex Aesthetics) and the design-question source of truth are preserved in the originating session: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/rawdata/sub-step-d-design-iter1.md`.
.gobbi/projects/gobbi/features/workflow/decisions/wrap-up-step-2-5-escalation-default.md:49:This decision was split out of a two-decision bundle; the full session context — including the companion codex-invocation decision and the deterministically-resolved concerns — is preserved in `archive/decisions/2026-05-23-iter1-user-redirects.md`.
.gobbi/projects/gobbi/features/workflow/decisions/2026-05-24-planning-brief-mistake-load-directives-for-t1.md:34:3. `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
.gobbi/projects/gobbi/features/workflow/decisions/2026-05-24-planning-brief-mistake-load-directives-for-t1.md:58:- Sub-step A → D findings: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/rawdata/sub-steps-a-d-iter1.md` § Adversarial-mode scan § Mistakes flagged for Execution awareness
.gobbi/projects/gobbi/features/workflow/changelogs/2026-05-26-bundle-a-rehome.md:30:- 1 archived decision bundle: `archive/decisions/2026-05-23-iter1-user-redirects.md` (superseded; spans codex + wrap-up)
```

D5 survivor classification: body hits are legitimate live structural references, literal mistake filenames, or `## Source`/`## Related` provenance to existing session/archive artifacts; frontmatter hits are outside body per the prompt.

Leak gate:

```text
(no output)
```
