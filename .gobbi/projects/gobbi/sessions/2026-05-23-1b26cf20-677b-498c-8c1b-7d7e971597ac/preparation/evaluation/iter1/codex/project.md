## Artifact Summary + Memory reads

What: Preparation iter1 evaluates readiness for Bundle B: T1 worktree-first session architecture plus T3 `session.json.agents[]` PostToolUse hook and reconstructor.
Why: Planning should not start until Ideation-derived readiness gaps are resolved, deferred with cost, skipped with rationale, or routed back to Ideation.
How: The draft uses Sub-steps A-D, user-approved gap decisions, seven staged artifacts, and a Planning intake note set.
Scope source: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/artifacts/bundle-b-ideation-pass.md`.
Primary reads: `preparation/rawdata/draft-iter1.md`; `preparation/rawdata/sub-steps-a-d-iter1.md`; all seven files under `preparation/staging/`.
Memory reads: project rule `rules/stub-redirect-format.md`; all project mistakes under `.gobbi/projects/gobbi/mistakes/`; phase child doc `.agents/skills/preparation/evaluation.md`.
V-1: `.claude/scripts/` returned ENOENT, but grep found `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/features/env-var-audit/decisions/planning-decisions.md` outside session staging.
V-2: all three D-3 mistakes exist and are active/not superseded by frontmatter read.
V-3: the five requested phase docs exist, but as symlinks from `.claude/skills/...` to `.gobbi/projects/gobbi/skills/...`.
V-4: exactly seven Preparation staging files exist, matching the prompt's expected set.

## Locked Frame (Stage 1)

Scenario P1: Scope-contract tracing for every gap.
Checklist P1.1: Each resolved gap traces to T1 or T3 in the Ideation Scope Contract.
Checklist P1.2: T2 and unrelated project-wide cleanups remain out of scope.
Checklist P1.3: The `RE-IDEATE` claim is checked against actual design premises, not asserted.
Scenario P2: User-approved resolution map.
Checklist P2.1: Every D-row has a user-approved outcome.
Checklist P2.2: Every skip has a rationale.
Checklist P2.3: Every defer has a backlog path or concrete pickup trigger.
Scenario P3 (adversarial): A mid-Preparation policy decision changes the executable scope that Planning will consume.
Checklist P3.1: The mirror-policy decision matches the repository's real topology.
Checklist P3.2: Planning notes do not direct executors toward a false write model.
Checklist P3.3: Any policy/design contradiction is routed as REVISE before Planning.
Rule coverage: `stub-redirect-format.md` is not applicable because no superseded doc stub is generated.

## Per-scenario per-check results

P1.1: Yes. D-3 and D-4 map directly to T1; D-2 and D-7 map to T3 hook authoring; D-6 maps to T1 lifecycle knowledge.
P1.2: Yes. T2, Auto-mode, chat-mode, Codex CI, and `.gobbi/project.json` bootstrap are kept out of scope or deferred.
P1.3: Mostly yes. The draft explicitly states `0 re-Ideate`; no T1/T3 premise is unworkable based on the artifacts read.
P2.1: Yes. Decisions log rows 1-15 cover advance, D-1 through D-9, mirror policy, sync scan, and no re-Ideate.
P2.2: Yes. D-1, D-5, D-8, and D-9 all include concrete reasons.
P2.3: Yes. D-2, D-6, D-7, and sync-mechanism backlog files include triggers and effort notes.
P3.1: No. The mirror decision says workspace `.claude/skills/` is canonical and the project mirror derives, but `stat`/`find -type l` show `.claude/skills/*/SKILL.md` and the five workflow docs are symlinks into `.gobbi/projects/gobbi/skills/...`.
P3.2: No. The Preparation draft tells Planning to use workspace-canonical, manual mirror-edit Option a until sync exists; this is not the actual topology for symlinked files.
P3.3: No. The contradiction is not surfaced as a blocking Preparation revision.

## Typed findings

ID: COD-PROJ-PREP1-001
Type: design_flaw
Domain: mirror-policy
Disposition: open
Confidence: 95
Severity: High
Evidence: `stat -c '%N' /playinganalytics/git/gobbi/.claude/skills/orchestration/SKILL.md` and the five workflow docs show symlinks to `.gobbi/projects/gobbi/skills/...`, contradicting `mirror-propagation-policy-workspace-canonical.md`'s workspace-canonical model.
surfaced-by: codex

ID: COD-PROJ-PREP1-002
Type: scenario_gap
Domain: mirror-policy
Disposition: open
Confidence: 90
Severity: Medium
Evidence: Stage 1 added adversarial Scenario P3 because the draft did not test the policy lock against symlink topology before making it Planning intake.
surfaced-by: codex

ID: COD-PROJ-PREP1-003
Type: general
Domain: docs-sync
Disposition: open
Confidence: 85
Severity: Low
Evidence: V-1 grep found `features/env-var-audit/decisions/planning-decisions.md` outside session staging; the finding is historical out-of-scope text, not a mechanism, but it falsifies the expected "no hits outside session staging" evidence claim.
surfaced-by: codex

## Low-confidence appendix

No low-confidence findings. The project-level blocking issue is tool-verified.

VERDICT: REVISE
