## Artifact Summary + Memory reads
Artifact type: ideation scope-contract draft for feature `session-foundations-bundle-b`.
What: ship T1 worktree-first session architecture, with NEW promote-now commit-on-branch absorbed, and T3 `session.json.agents[]` PostToolUse hook plus shell reconstructor.
Why: prior session artifacts leaked to the wrong tree and `agents[]` stayed effectively unpopulated after many Task spawns.
How: move worktree creation into Configuration row 5.5, qualify session write routing, commit session memory per iteration, add hook/reconstructor telemetry capture, and codify prompt metadata headers.
Scope source: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/rawdata/draft-iter1.md`.
Downstream consumers: Preparation leader, Planning leader, Execution executors, Execution evaluators, Wrap-up assistant, and future managers reading session memory.
Memory reads: draft-iter1.md, sub-step-a-findings-iter1.md, sub-step-c-findings-iter1.md, sub-step-d-design-iter1.md.
Memory reads: `.claude/skills/evaluation/SKILL.md`, `.claude/skills/ideation/evaluation.md`, `.claude/skills/git/SKILL.md`, `.claude/skills/git/conventions.md`.
Memory reads: `.claude/skills/preparation/SKILL.md`, `.claude/skills/orchestration/SKILL.md`, `.claude/skills/delegation/SKILL.md`.
Memory reads: `.claude/settings.json`, `.claude/hooks/session-start.sh`, `.claude/skills/orchestration/templates/session.template.json`.
Memory reads: all eight listed project mistakes, especially codex write-path, evaluator output-file, verification-claim, and rm-rf mistakes.
Memory reads: project rule `stub-redirect-format.md`; feature README inventory under `.gobbi/projects/gobbi/features/`.
Stage 0 W/W/H gate: pass. What, Why, and How are present and specific enough to evaluate.
Stage 0 phase gate: pass. Artifact is an ideation scope-contract/design draft.
Stage 0 existence checks: referenced skill files, settings file, session-start hook, session template, and commit `1829fa3` exist.

## Locked Frame (Stage 1)
Scenario P1 - Root cause and prior witness are real.
Checklist P1.1 - The T1 root cause terminates at an actionable cause, not only a symptom.
Checklist P1.2 - The T3 root cause is supported by empirical prior-session data.
Checklist P1.3 - Prior attempts and witness commits actually exist.
Scenario P2 - Scope contract stays bounded to T1 and T3 after T2 deferral.
Checklist P2.1 - T2 absence is not penalized if it is explicitly backlogged.
Checklist P2.2 - Non-picked candidates all have backlog pointers.
Checklist P2.3 - Implementation checklist does not smuggle T2 validator work back in.
Scenario P3 - Configuration-time worktree creation has enough contract to create a valid branch. (adversarial)
Checklist P3.1 - Branch naming inputs are available before row 5.5 calls git P2.
Checklist P3.2 - GitHub issue precondition is addressed or explicitly relaxed.
Checklist P3.3 - Direct mode fallback does not contradict the locked default.
Scenario P4 - The idea can be falsified by future-session smoke tests.
Checklist P4.1 - T1 success has a concrete `jq` check.
Checklist P4.2 - T3 success has a concrete `agents[]` length/population check.
Checklist P4.3 - Failed-spawn telemetry has an observable row.
Scenario P5 - Existing project scope overlap is checked.
Checklist P5.1 - Existing feature memory does not already own the same session-foundation scope.
Checklist P5.2 - If adjacent feature overlap exists, merge/split is explicit.
Stage 1 additions: P3 created from git-skill branch/issue preconditions; this is a scenario_gap because the draft frames row 5.5 as mechanical but does not close the precondition.

## Per-scenario per-check results
P1.1 - Yes. Draft lines 77-104 frame the path-routing proxy rule and `cwd` timing as the actionable T1 cause.
P1.2 - Yes. Draft lines 110-123 cite prior-session `agents[]` length 1 after many spawns and define population success.
P1.3 - Yes. `git show 1829fa3` returned the finalize commit and its codex symlink witness body.
P2.1 - Yes. Draft lines 26 and 58 defer T2 to `staging/backlogs/project/item-1-2-skill-loading-discipline.md`.
P2.2 - Yes. `find .../ideation/staging/backlogs` lists all eight backlog files named in the draft.
P2.3 - Yes. The implementation checklist does not reintroduce the matrix/validator; T3 structured headers are scoped to telemetry.
P3.1 - No. Draft line 191 says row 5.5 creates the worktree before Ideation/Preparation, while git P2 line 159 requires a concrete `<branch-name>`.
P3.2 - No. Git skill line 49 says every task starts from a GitHub issue; orchestration row 6 says `git.issue` is stamped only if known at session start; the draft does not define the no-issue branch path.
P3.3 - Partial. Draft lines 294-296 preserve direct mode, but direct mode does not solve the default worktree-first branch derivation gap.
P4.1 - Yes. Draft line 50 and D-1 validation line 269 name `jq '.git.worktreePath'`.
P4.2 - Yes. Draft line 52 defines N+1 `agents[]` and 90 percent field population.
P4.3 - Yes as goal, partial as design. Draft line 53 names failed entries with `status`, but template/doc sync is evaluated under Consistency.
P5.1 - Partial. Feature directories exist, but the draft relies on prior session framing rather than a documented overlap scan.
P5.2 - Yes for known candidates. Alternatives and T2 are backlogged.

## Typed findings
### COD-PROJ-001 - Configuration row 5.5 lacks branch/issue preconditions
- type: design_flaw
- domain: process
- confidence: 75
- severity: High
- evidence: `.claude/skills/git/SKILL.md:49` says every task starts from a GitHub issue; `.claude/skills/git/SKILL.md:159` creates a worktree with `<branch-name>`; `draft-iter1.md:191` and `draft-iter1.md:264` move worktree creation to row 5.5 before Ideation has necessarily stamped feature/task/issue.
- surfaced-by: codex
- disposition: open
Impact: T1's first success criterion, non-null `git.worktreePath` immediately after Configuration, can fail or force invented branch names before the workflow knows the issue/task contract.
False-positive check: not out of scope; this is the core T1 mechanism.

### COD-PROJ-002 - Missing Stage 1 scenario for no-issue bootstrap
- type: scenario_gap
- domain: process
- confidence: 75
- severity: Medium
- evidence: Ideation child doc Project requires risky premises and testability; the draft scenarios include worktree creation failure but not the common no-issue/no-task-at-Configuration case.
- surfaced-by: codex
- disposition: open
Impact: Planning will likely need to invent the branch naming/issue creation sequence.
False-positive check: not merely implementation detail; git P2 cannot run without branch naming input.

## Low-confidence appendix
No suppressed Project finding exceeded 25 confidence.
Possible low-confidence concern: existing feature `gobbi-orchestration-workflow-improvements` overlaps session-foundations work, but the draft's prior-session lineage plausibly separates Bundle B from Bundle A, so this is not scored.
Verdict: REVISE
