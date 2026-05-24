## Artifact Summary + Memory reads
Artifact type: Ideation scope-contract + design draft, iter2, for feature `session-foundations-bundle-b`.

What: iter2 preserves the T1 worktree-first session architecture and T3 `session.json.agents[]` hook/reconstructor design, while revising iter1 findings around branch naming, provenance trailer shape, resolver specificity, concurrency serialization, PostToolUseFailure support, metadata extraction, and transcript correlation.

Why: iter1 returned REVISE from both systems. The highest-priority gaps were a lost-update race on shared `session.json`, an invented `AI-Provenance-Record` trailer segment, unresolved branch/worktree preconditions at Configuration row 5.5, and an underspecified T3 hook resolver.

How: iter2 adds D-3-5 `flock -x`, D-3-3-resolver, D-3-6 exact transcript `jq` paths, canonical `task/{task-id}` provenance, official-doc support for `PostToolUseFailure`, and path-surface clarification CL-1. It also chooses `session/{date}-{ssid-short}` as the row 5.5 branch form.

Scope source: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/rawdata/draft-iter2.md`.

W/W/H gate: PASS. What, Why, and How are specific enough for evaluation. Phase gate: PASS. The artifact is an Ideation scope-contract/design draft.

Memory reads:
- `.agents/skills/principles/SKILL.md`
- `.agents/skills/mistake/SKILL.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/ideation/evaluation.md`
- `.agents/skills/orchestration/workflow/evaluation.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- all project mistakes under `.gobbi/projects/gobbi/mistakes/`
- all 16 iter1 files under `ideation/evaluation/iter1/{codex,claude}/`
- `/playinganalytics/git/gobbi/.claude/skills/git/conventions.md` lines 1-60 and 110-125
- `https://code.claude.com/docs/en/hooks`
- `~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-e826-4ce6-9e90-9e948007b068.jsonl` lines 160-170

## Locked Frame (Stage 1)
Scenario P1: Iter2 resolves the row 5.5 worktree creation preconditions without violating project git conventions. (adversarial)
- Check P1.1: The branch name proposed for Configuration row 5.5 passes `git/conventions.md` branch validator.
- Check P1.2: The no-issue/no-task-at-Configuration condition is covered without inventing a non-conforming branch type.
- Check P1.3: Direct-mode fallback remains explicit.

Scenario P2: Iter1 project-scope findings are inherited and assigned fresh dispositions.
- Check P2.1: `COD-PROJ-001` gets a current disposition based on the actual iter2 branch design.
- Check P2.2: `COD-PROJ-002` gets a current disposition based on iter2 no-issue/non-feature coverage.
- Check P2.3: Claude P1/P2/P3/P4 project findings get current dispositions.

Scenario P3: The Scope Contract remains bounded after iter2 revisions.
- Check P3.1: T2 stays deferred.
- Check P3.2: Iter2 does not reopen user-locked alternatives.
- Check P3.3: Fix decisions F1-F7 are within the T1/T3 scope.

Scenario P4: Success criteria are still executable by a future manager.
- Check P4.1: `git.branch` validation is executable before `git worktree add -b`.
- Check P4.2: T3 `agents[]` population remains measurable.
- Check P4.3: Failed-spawn telemetry still has an observable row.

Coverage declarations:
- Privacy/data retention: owned by Risk and Consistency.
- Licensing/IP: owned by Risk and Consistency.
- Cost/error budget: owned by Performance and Risk.
- Accessibility/I18n: owned by Usage.
- Observability: owned by Structure and Usage.

## Per-scenario per-check results
P1.1: FAIL. `/playinganalytics/git/gobbi/.claude/skills/git/conventions.md` defines branch shape as `^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/(...)$`. The allowed type prefixes table does not include `session/`. Empirical regex check returned `session/2026-05-23-1b26cf20 FAIL`.

P1.2: PARTIAL. Iter2 does address the missing branch-name input by choosing a session-id branch independent of feature/task/issue, but because the chosen prefix fails the validator, the Configuration row 5.5 worktree creation still cannot run under the documented git precondition.

P1.3: PASS. Direct mode remains preserved at D-5.

P2.1: OPEN. `COD-PROJ-001` remains unresolved in substance: the branch is now specified but invalid.

P2.2: PARTIAL. Iter2 E-2 covers non-feature sessions under the uniform lock, but the invalid prefix means the scenario still cannot pass the actual git validator.

P2.3: MIXED. Claude P1/C1 trailer drift is addressed; P2/O1 PostToolUseFailure support is addressed by official-doc verification; P3 stronger read-only-session steel-man is addressed; P4 migration smoke test is addressed. The remaining Project blocker is the new invalid branch prefix.

P3.1: PASS. T2 stays deferred in Scope, Deferred, Research, and Decisions Log.

P3.2: PASS. Iter2 does not reopen the user-locked worktree-first default or T3 mechanism.

P3.3: PASS. F1-F7 all target existing T1/T3 findings, not adjacent scopes.

P4.1: FAIL. The success criterion can be checked, and it fails against the current convention.

P4.2: PASS. The iter2 success criterion defines the 90% population denominator as 12 schema fields times N entries.

P4.3: PASS. Failed Task spawns still produce `status: "failed"` with synthetic id.

## Typed findings
### COD-PROJ-001 — Row 5.5 branch name still fails the project validator
- type: design_flaw
- domain: regression
- disposition: open
- confidence: 100
- severity: High
- inherited-from: iter1/codex/project-COD-PROJ-001
- surfaced-by: codex
- evidence: `draft-iter2.md:296` chooses `session/{date}-{ssid-short}`. `/playinganalytics/git/gobbi/.claude/skills/git/conventions.md` branch regex only permits `feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style` prefixes. `grep -n "session" conventions.md` shows no `session/` branch type in the branch naming section, only unrelated uses later in the file. A local regex check returned `session/2026-05-23-1b26cf20 FAIL`.
- impact: Configuration row 5.5 still cannot call `git worktree add -b <branch-name>` under the documented precondition. The iter2 fix moved from "no branch name specified" to "specified branch name is invalid", so Planning would hand Execution a branch creation failure.
- false-positive check: not a style preference; the validator explicitly says a mismatch is a precondition violation.

### COD-PROJ-002 — No-issue bootstrap scenario is only partially resolved
- type: scenario_gap
- domain: process
- disposition: open
- confidence: 75
- severity: Medium
- inherited-from: iter1/codex/project-COD-PROJ-002
- surfaced-by: codex
- evidence: Iter2 adds non-feature/session-id branch coverage at `draft-iter2.md:216` and D-1 at `draft-iter2.md:296`, but the same branch form fails the validator. The no-issue design therefore still lacks a valid convention-compliant creation path.
- impact: A future session without a known issue/task still needs a valid branch naming strategy before row 5.5 is executable.
- false-positive check: not out of scope because row 5.5 is the core T1 mechanism.

### CLAUDE-P1-C1 — Provenance trailer drift resolved
- type: design_flaw
- domain: process
- disposition: addressed
- confidence: 100
- severity: High
- inherited-from: iter1/claude/project-P1 and iter1/claude/consistency-C1
- evidence: `draft-iter2.md:266`, `draft-iter2.md:310`, and `draft-iter2.md:488` all use `AI-Provenance-Record: gobbi://session/{session-id}/task/{task-id}`. `grep -n "AI-Provenance-Record" draft-iter2.md` found no residual `loop/preparation/promote-now` form. `/playinganalytics/git/gobbi/.claude/skills/git/conventions.md:118` confirms the canonical `task/{task-id}` form.

### CLAUDE-P2-O1 — PostToolUseFailure support resolved
- type: assumption_risk
- domain: process
- disposition: addressed
- confidence: 75
- severity: High
- inherited-from: iter1/claude/project-P2 and iter1/claude/overall-O1
- evidence: `draft-iter2.md:189`, `draft-iter2.md:278`, `draft-iter2.md:351`, and `draft-iter2.md:490` cite the official Claude Code hooks documentation. Web verification of `https://code.claude.com/docs/en/hooks` found `PostToolUseFailure` listed as a lifecycle hook event and described as running after a tool fails.

### CLAUDE-P3-P4 — T1 counterfactual and migration witness resolved
- type: checklist_gap
- domain: process
- disposition: addressed
- confidence: 75
- severity: Medium
- inherited-from: iter1/claude/project-P3 and iter1/claude/project-P4
- evidence: `draft-iter2.md:99-104` adds the stronger read-only-session overhead steel-man and records user acceptance of uniformity. `draft-iter2.md:269` and `draft-iter2.md:411` add a concrete post-merge `jq` migration smoke test.

## Low-confidence appendix
Low-confidence note: A convention-compliant alternative such as `chore/{date}-{ssid-short}` passed the same regex shape test in a local check, but this evaluation records the defect only and does not prescribe the fix.

Verdict: REVISE
