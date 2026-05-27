# T9a — Conform features/workflow/ to dev-doc standard §4

## Scope

26 non-archive docs under `features/workflow/` (ARCHIVE-SAFE: `archive/decisions/2026-05-23-iter1-user-redirects.md` untouched).

## Pre-edit baseline

§4.5 gate: 19 offenders (task-spec said 19 — confirmed exact match).

## Changes applied

### Files modified: 24 (2 already conformant, untouched)

Already conformant (no edits):
- `decisions/wrap-up-step-2-5-escalation-default.md` — had all 9 base keys, no S-set keys
- `changelogs/2026-05-26-bundle-b-rehome.md` — had all 9 base keys, no S-set keys

### S-set keys stripped (per file)

| File | Keys stripped |
|---|---|
| backlogs/lock2-shared-executor-mega-task-risk.md | loop, finding-id, confidence, severity, surfaced-by, addressed-in, type→backlogs, date→created |
| changelogs/2026-05-26-bundle-a-rehome.md | task, date→created |
| checklists/dq-anchor-readability.md | finding-id, confidence, severity, disposition (non-backlogs), date→created, type→checklists |
| checklists/dq-anchor-traceability.md | finding-id, confidence, severity, disposition (non-backlogs), date→created, type→checklists |
| checklists/effort-field-non-canonical-schema.md | scenario, finding-id, confidence, severity, surfaced-by, loop, disposition (non-backlogs), type→checklists |
| checklists/task01-t1c-trace-overclaim.md | scenario, finding-id, confidence, severity, surfaced-by, loop, disposition (non-backlogs), type→checklists |
| decisions/2026-05-24-lock1-wave-ordering-not-graph-enforced.md | loop, finding-id, confidence, severity, surfaced-by, addressed-in, disposition (non-backlogs), date→created, type→decisions |
| decisions/2026-05-24-planning-brief-mistake-load-directives-for-t1.md | date→created (no S-set keys) |
| decisions/step-2-5-example-non-canonical-domain-value.md | mistake-candidate, finding-id, loop, iter, promoted-from, promoted-at, severity, disposition (non-backlogs), date→created |
| decisions/wrap-up-step-2-5-anchor-placement.md | slug, mistake-candidate, loop, promoted-from, promoted-at, disposition (non-backlogs), project kept, type→decisions |
| design/dependency-graph-strict-wave-ordering.md | none stripped (not in 19-offenders); added missing base keys |
| design/drop-legacy-setup-questions.md | loop, iter, promoted-from, promoted-at, date→created |
| design/five-locked-decisions.md | none stripped; added missing base keys |
| design/glossary-placement.md | loop, iter, promoted-from, promoted-at, date→created |
| design/task-decomposition-10-tasks.md | none stripped; added missing base keys |
| design/wrap-up-step-2-5-compliance-check.md | loop, iter, promoted-from, promoted-at, date→created |
| discussions/2026-05-24-iter2-fix-direction-continue-this-session.md | loop, date→created |
| discussions/2026-05-24-wave-ordering-sequential-t1-t3.md | loop, date→created |
| discussions/matrix-location-ambiguity-defers-t2.md | slug, phase, sub-step, loop-iter, date→created |
| discussions/scope-bundle-selection.md | loop, iter, promoted-from, promoted-at, date→created |
| discussions/skill-loading-discipline-root-cause.md | slug, phase, sub-step, loop-iter, date→created |
| discussions/wrap-up-step-2-5-escalation-shape.md | loop, iter, promoted-from, promoted-at, date→created |
| plans/2026-05-23-orch-workflow-improvements.md | slug, loop, iter, promoted-from, promoted-at |
| README.md | none stripped; added missing base keys |

### KEEP keys preserved

All KEEP-listed keys encountered were preserved:
- `discussion-id` — preserved on matrix-location-ambiguity-defers-t2.md and skill-loading-discipline-root-cause.md
- `domain` — preserved on multiple docs (process, docs-sync, structure)
- `supersedes`, `superseded_by` — preserved on all decisions docs that had them
- `decision_status` — preserved on decisions docs
- `related` — preserved on design docs
- `topic` — preserved on design and discussions docs
- `outcome` — preserved on discussions docs
- `title` — preserved on design and plans docs that had it
- `verdict` — preserved on plans doc
- `value_proposition`, `subsystems` — preserved/added on README
- `disposition` — preserved ONLY on `backlogs/lock2-shared-executor-mega-task-risk.md`
- `project` — preserved on wrap-up-step-2-5-anchor-placement.md
- `artifact_ref` — preserved on plans doc (not in S-set, not a base key, kept per KEEP rule)
- `plan` — preserved on bundle-a-rehome (not in S-set, kept per KEEP rule)
- `last_updated` — preserved on README, effort-field and task01 checklists
- `shipped_in` — preserved on bundle-b-rehome
- `task_count` — N/A (not present)

### Title de-crypting

| File | Old title | New title |
|---|---|---|
| checklists/task01-t1c-trace-overclaim.md | "Task 01 traces-to T1-I-T1.c but the actual T1.c edit lives in Task 02" | "Task 01 traces-to overclaim — T1.c edit assigned to Task 02" |
| decisions/2026-05-24-lock1-wave-ordering-not-graph-enforced.md | "LOCK #1 T1→T3 wave ordering not graph-enforced (addressed in iter2)" | "Wave ordering not graph-enforced — T1→T3 dependency edges added" |
| decisions/2026-05-24-planning-brief-mistake-load-directives-for-t1.md | "Planning MUST cite 3 specific mistakes in every T1 task brief's Load Directives tier 4" | "Planning briefs must explicitly cite 3 mistakes in worktree-task Load Directives" |
| decisions/step-2-5-example-non-canonical-domain-value.md | "Deferred Risk: Step 2.5 Illustrative Example Uses Non-Canonical Domain Value `testing`" | "Step 2.5 example uses non-canonical domain value `testing`" |
| design/drop-legacy-setup-questions.md | "Design G — Drop Legacy Setup Questions in `gobbi/SKILL.md § 4`" | "Drop legacy setup questions — gobbi/SKILL.md session bootstrap rewrite" |
| design/glossary-placement.md | "Design F — Move Glossary Below Session Bootstrap Order in `gobbi/SKILL.md`" | "Move glossary below session bootstrap order in `gobbi/SKILL.md`" |
| design/wrap-up-step-2-5-compliance-check.md | "Design D — Wrap-up Step 2.5: Prior-Loop Memorization Compliance Check" | "Wrap-up Step 2.5 — prior-loop memorization compliance check" |
| discussions/2026-05-24-iter2-fix-direction-continue-this-session.md | "iter2 fix direction (continue-this-session)" | "Fix direction — continue this session with surgical 5-fix pass" |
| discussions/2026-05-24-wave-ordering-sequential-t1-t3.md | "T1→T3 wave ordering" | "T1→T3 wave ordering — strict sequential confirmed" |
| discussions/matrix-location-ambiguity-defers-t2.md | "T2 matrix location ambiguity — T2 deferred entirely from this session" | "Skill-loading matrix location ambiguity — T2 deferred from this session" |
| discussions/scope-bundle-selection.md | "Discussion: Bundle A Scope Selection" | "Bundle A scope selection — all 7 items chosen" |
| discussions/skill-loading-discipline-root-cause.md | "Root-cause hypothesis for T2 (skill-loading discipline) confirmed" | "Root-cause hypothesis for skill-loading discipline confirmed" |
| discussions/wrap-up-step-2-5-escalation-shape.md | "Discussion: Wrap-up Step 2.5 Escalation Shape (Post-WORK iter1 Redirect)" | "Wrap-up Step 2.5 escalation shape — hybrid auto-backfill selected" |
| backlogs/lock2-shared-executor-mega-task-risk.md | "LOCK #2 Tasks 07+08 shared-executor context-budget risk (deferred)" | "LOCK #2 Tasks 07+08 shared-executor context-budget risk" |

## Post-edit verification

1. §4.5 gate = 0 (was 19)
2. All 26 non-archive docs have 9 base keys
3. disposition: open preserved on backlogs/lock2 (only backlog)
4. 0 cryptic-led H1 titles in 26 docs
5. git diff --name-only lists only non-archive features/workflow/ paths

## Observations (out of scope)

- Several bodies still reference session-internal coordinates in `## Related` or `## Source` sections (e.g., `draft-iter2.md:276`). §4.3 only requires non-load-bearing references be tolerable; these are provenance pointers, not load-bearing. No action taken.
- `type` values for some docs were non-canonical (e.g., `assumption_risk`, `design_flaw`, `checklist_gap`) — normalized to the canonical type matching their directory.
- `status: final` normalized to `active` for design/discussions docs where `final` is not in the §2.2 type status model.
