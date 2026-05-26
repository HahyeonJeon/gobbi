---
loop: execution
iter: 1
artifact_type: w3-dispatch-1-draft
created_at: 2026-05-26
status: draft
---

# W3 dispatch-1 executor draft — §8 cat A feature re-homing (W3-T0/T1/T2)

## Commits
- W3-T0 `efb1480` — feat(features): create 7 capability feature dirs with READMEs
- W3-T1 `449fac2` — refactor(memory): re-home env-var-audit into install-runtime
- W3-T2 `c4126c6` — refactor(memory): re-home Bundle A into workflow

Branch `chore/session-2026-05-25-a10c82d6`. Not pushed. AI-Provenance-Record trailer on all three.

## W3-T0 — 7 capability feature dirs
Created `features/{workflow,project-memory,agents,evaluation,guardrails,git-workflow,install-runtime}/README.md`, each with base frontmatter (feature/project/status/created/last_updated) + `value_proposition` + Subsystems + Subdirectories + Recent activity, `status: active`. Content sourced from design §1.2 table (one-liner → value_proposition; owned skill dirs/subsystems → Subsystems).

## W3-T1 — env-var-audit → install-runtime (all 8 → install-runtime)
Actual count: 8 non-README md (plan said ~7-12 post-split). All content is about the session-runtime contract → install-runtime (primary per §1.3). No file was purely git-workflow (transcriptPath) or workflow (Configuration) standalone — those are dimensions inside the env-var work, so per §8 rule 2 + brief default → install-runtime.

| Source file | Dest |
|---|---|
| decisions/env-file-load-semantics-decisions.md | install-runtime/decisions/ |
| decisions/pre-planning-readiness-decisions.md | install-runtime/decisions/ |
| decisions/session-start-hook-script-decisions.md | install-runtime/decisions/ |
| decisions/task-decomposition-decisions.md | install-runtime/decisions/ |
| discussions/env-var-audit-scope-discussion.md | install-runtime/discussions/ |
| references/claude-code-changelog-ccsi-version.md | install-runtime/references/ |
| references/claude-code-hooks-stdin-contract.md | install-runtime/references/ |
| archive/references/2026-05-22-ideation-references.md (superseded) | install-runtime/archive/references/ |

Changelog: `install-runtime/changelogs/2026-05-26-env-var-audit-shipped.md`. `feature:` key updated on the 5 files carrying it.

## W3-T2 — Bundle A → 5 features (content routing)
Actual count: 22 non-README md + 1 archived bundle = 23 moved (plan said 22 — matches; the +1 is the pre-existing archive bundle). Routing by §8 rule 1 (content's capability, not sprint):

| Source file | Dest feature/subdir | Reason |
|---|---|---|
| decisions/codex-exec-universal-invocation-pattern.md | evaluation/decisions/ | codex invocation |
| decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md | evaluation/decisions/ | codex dual-system topology |
| decisions/constraints-body-block-convention-deferred-to-planning.md | evaluation/decisions/ | codex skill stub convention |
| decisions/constraints-body-block-kept-per-h2-lock.md | evaluation/decisions/ | codex skill convention |
| decisions/coverage-ownership-matrix-row-text.md | evaluation/decisions/ | evaluation/SKILL.md matrix row |
| design/codex-skill-structure.md | evaluation/design/ | codex skill structure |
| design/naming-convention-enforcement.md | evaluation/design/ | adds evaluator Coverage Ownership row (artifact+mechanism = evaluation) |
| discussions/codex-invocation-priority-redirect.md | evaluation/discussions/ | codex invocation |
| references/five-type-vocabulary.md | evaluation/references/ | canonical from evaluation/SKILL.md |
| decisions/path-conventions-anchor-casing.md | project-memory/decisions/ | memorization Path conventions H3 |
| design/memorization-moment-of-capture.md | project-memory/design/ | memorization principle |
| design/memorization-delegation-hard-gate.md | agents/design/ | delegation hard gate (T03 → agents §1.3) |
| decisions/plan-diff-scope-gate-semantics-under-bundled-pr.md | git-workflow/decisions/ | git diff develop...HEAD / bundled-PR semantics |
| decisions/step-2-5-example-non-canonical-domain-value.md | workflow/decisions/ | wrap-up Step 2.5 spec (workflow loop body) |
| decisions/wrap-up-step-2-5-anchor-placement.md | workflow/decisions/ | wrap-up Step 2.5 |
| decisions/wrap-up-step-2-5-escalation-default.md | workflow/decisions/ | wrap-up Step 2.5 |
| design/drop-legacy-setup-questions.md | workflow/design/ | orchestration Configuration/setup questions |
| design/glossary-placement.md | workflow/design/ | gobbi/SKILL.md entry-point structure → primary |
| design/wrap-up-step-2-5-compliance-check.md | workflow/design/ | wrap-up Step 2.5 |
| discussions/scope-bundle-selection.md | workflow/discussions/ | Bundle A orchestration scope |
| discussions/wrap-up-step-2-5-escalation-shape.md | workflow/discussions/ | wrap-up Step 2.5 |
| plans/2026-05-23-main.md | workflow/plans/ | whole Bundle A plan (spans tasks → primary) |
| archive/decisions/2026-05-23-iter1-user-redirects.md | workflow/archive/decisions/ | superseded bundle spans codex+wrap-up → primary |

Tallies: evaluation 9, project-memory 2, agents 1, git-workflow 1, workflow 10. Changelog entry added to each of the 5 touched features. `feature:` key updated on all 22 files carrying it (archive bundle uses name/session, no feature key).

## Ambiguous-routing notes (resolved one way; manager may prefer the other)
- `naming-convention-enforcement.md`: enforces memory naming (project-memory concern) BUT does so by adding a row to evaluation/SKILL.md Coverage Ownership Matrix (evaluation mechanism). Routed to evaluation (artifact + mechanism = evaluation, §8 rule 1). Alternative: project-memory (the thing enforced).
- `drop-legacy-setup-questions.md` + `glossary-placement.md`: both edit `gobbi/SKILL.md` (the entry-point skill). Setup questions = orchestration Configuration step; routed to workflow. Alternative: install-runtime (gobbi/SKILL.md also documents session-runtime per §1.2). Chose workflow because the change is about the Configuration/setup-question mechanism of the pipeline.
- `plan-diff-scope-gate-semantics-under-bundled-pr.md`: planning-loop artifact but content is `git diff develop...HEAD` / bundled-PR semantics → git-workflow. Alternative: workflow (it's a plan verify-gate). Chose git-workflow per §8 rule 1 (content = PR diff-scope).
- env-var-audit `archive/references/...` placement: kept under destination's `archive/references/` (typed-subdir per §9 archive resolution), not a project-level archive.

## Git scope confirmation
- T0: 7 A (READMEs).
- T1: 8 R + 1 A (changelog), 0 D.
- T2: 23 R + 5 A (changelogs), 0 D.
- Main tree: clean, no edits (mistake-compliance: executor-main-tree-edit-near-miss + executor-mirror-path-vs-worktree-physical-copy — all paths worktree-absolute).
- Only untracked: pre-existing `sessions/.../state.json.bak` (not mine; out of scope).

## Out of scope (not touched)
- Bundle B + Bundle C source dirs (later dispatches).
- The 4 sprint READMEs (W3-T5 retires those — both env-var-audit/README.md and gobbi-orchestration-workflow-improvements/README.md left in place).
- No frontmatter normalization beyond the feature: key (cat C's job).
