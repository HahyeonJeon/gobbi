## Stage 0 — Artifact Summary + Memory reads
Artifact: `draft-iter2.md`, Ideation iter2 scope-contract/design draft for feature `session-foundations-bundle-b`.

What: T1 worktree-first session architecture with promote-now commit-on-branch, plus T3 `session.json.agents[]` hook/reconstructor telemetry capture.

Why: iter1 REVISE found branch/worktree precondition gaps, hook resolver gaps, lost-update concurrency risk, provenance trailer drift, PostToolUseFailure documentation uncertainty, metadata extraction ambiguity, path-surface confusion, and validation/observability residuals.

How: iter2 adds D-3-5 `flock -x`, D-3-3-resolver, D-3-6 jq paths, official-doc citation, canonical trailer form, input/result-side clarification, path-surface note, denominator math, performance bounds, and rollback semantics. It also chooses `session/{date}-{ssid-short}` as the row 5.5 branch name.

Memory reads:
- `draft-iter2.md` in full
- all 16 iter1 evaluation files under `iter1/{codex,claude}/`
- `.agents/skills/principles/SKILL.md`, `.agents/skills/mistake/SKILL.md`, `.agents/skills/evaluation/SKILL.md`, `.agents/skills/ideation/evaluation.md`, `.agents/skills/orchestration/workflow/evaluation.md`
- project rules and project mistakes
- `/playinganalytics/git/gobbi/.claude/skills/git/conventions.md`
- empirical transcript `~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-e826-4ce6-9e90-9e948007b068.jsonl` lines 160-170, with jq shape checks
- official Claude Code hooks doc at `https://code.claude.com/docs/en/hooks`

## Per-perspective verdict roll-up
| Perspective | Verdict | Highest open issue |
|---|---|---|
| Project | REVISE | High: `session/` branch prefix fails validator |
| Structure | REVISE | High: structural flow blocked by invalid branch prefix |
| Performance | PASS | Low: preserve lock-held timing measurement |
| Aesthetics | PASS | Low/Medium: DQ anchor readability remains imperfect |
| Usage | REVISE | High: Executor-facing branch instruction fails |
| Consistency | REVISE | High: branch design contradicts git conventions |
| Risk | REVISE | High: invalid branch prefix blocks T1 preflight |

## Fix-decision verification F1-F7
F1 — flock semantics: addressed. The design specifies exclusive `flock -x` for both hook and reconstructor, before read, on the same `session.json` file descriptor, with release on process exit. The read-read-write-write lost-update scenario is closed under advisory `flock` cooperation.

F2 — `AI-Provenance-Record` trailer: addressed. `git/conventions.md:118` confirms `AI-Provenance-Record: gobbi://session/{session-id}/task/{task-id}`. Grep over `draft-iter2.md` found no residual `loop/preparation/promote-now`.

F3 — `PostToolUseFailure` official-doc citation: addressed. The official hooks doc lists `PostToolUseFailure` as a lifecycle event for failed tool calls, and the draft now cites it.

F4 — branch naming: partial/open. The iter2 draft specifies a branch name, resolving the "missing branch name" surface, but the chosen `session/{date}-{ssid-short}` prefix fails the repo branch validator. This is the main REVISE blocker and a regression-shaped fix failure.

F5 — `.gobbi/project.json` resolver dependency: addressed. `.gobbi/project.json` is absent in the current repo, but D-3-3-resolver explicitly falls back to the single directory under `.gobbi/projects/`; empirical check found exactly `gobbi`.

F6 — D-3-4 / T3-I-3 disambiguation: addressed. D-3-4 now clearly separates input-side `tool_input.prompt`/`tool_input.model` from result-side `tool_result`/`toolUseResult` telemetry.

F7 — transcript correlation key jq paths: addressed. Empirical jq checks on transcript lines 164-165 confirmed the `tool_use` and `tool_result` selection paths.

## Cross-perspective findings
### COD-OVERALL-001 — Iter2 branch-name fix introduces a convention violation
- type: design_flaw
- domain: regression
- disposition: open
- confidence: 100
- severity: High
- surfaced-by: codex
- evidence: `draft-iter2.md:296`, `draft-iter2.md:301`, `draft-iter2.md:411`, and `draft-iter2.md:492` choose or validate `session/{date}-{ssid-short}`. `/playinganalytics/git/gobbi/.claude/skills/git/conventions.md` branch validator permits only `feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style` prefixes. Local regex verification returned `session/2026-05-23-1b26cf20 FAIL`.
- inherited-context: iter1/codex/project-COD-PROJ-001 asked the draft to specify a row 5.5 branch name. Iter2 did specify one, but the specified form does not satisfy the governing convention.
- impact: T1's first success criterion can fail immediately at worktree creation. This is High because the default workflow cannot bootstrap under its own git rules.
- verdict contribution: REVISE.

### COD-OVERALL-002 — T3 plannability substantially improved
- type: design_flaw
- domain: process
- disposition: addressed
- confidence: 100
- severity: High
- inherited-from: iter1/codex/overall-COD-OVERALL-002
- evidence: D-3-3-resolver, D-3-5, and D-3-6 address the previous resolver, concurrency, and correlation blockers. Empirical transcript and repo-structure checks validated the claims.

### COD-OVERALL-003 — Path-surface sync clarified, but needs Planning tasking
- type: design_flaw
- domain: docs-sync
- disposition: addressed
- confidence: 75
- severity: High
- inherited-from: iter1/codex/overall-COD-OVERALL-001
- evidence: CL-1 explains why `.claude/skills` is intentional for this session and identifies the Codex/plugin-facing surfaces. Risk/Consistency still recommend carrying an explicit cross-layer review task.

### COD-OVERALL-004 — DQ-anchor traceability remains a residual
- type: checklist_gap
- domain: process
- disposition: open
- confidence: 50
- severity: Medium
- inherited-from: iter1/codex/overall-COD-OVERALL-004
- evidence: F9 says DQ anchors remain in raw Sub-step D source records and are not repeated in the canonical draft. This no longer blocks because F1-F9 provide the critical fix-decision trace, but the residual is real.

### COD-OVERALL-005 — Privacy/cross-layer review residuals should carry to Planning
- type: checklist_gap
- domain: privacy
- disposition: open
- confidence: 50
- severity: Medium
- inherited-from: iter1/codex/risk-COD-RISK-003 and iter1/codex/risk-COD-RISK-004
- evidence: F9 defers privacy/retention without a backlog pointer; CL-1 and whole-file scan guidance reduce cross-layer drift risk but do not create a single explicit review gate.

## Karpathy 4 failure modes
Wrong assumptions: present. The remaining wrong assumption is that `session/` can be used as a branch type. The branch validator disproves this.

Overcomplexity: not present as a blocker. T3 complexity increased with `flock` and resolver specificity, but those additions directly answer iter1 defects and remain inside the local bash/jq pattern.

Orthogonal edits: not present as a new iter2 blocker. T1 and T3 remain separable but thematically coherent session-foundation work, and T2 stays deferred.

Imperative-over-declarative: partially present. The draft now has strong invariants for T3, but D-1 validates against a hardcoded `session/` regex expectation instead of first satisfying the declarative "branch name must pass project conventions" invariant.

## Preserve list
- Preserve D-3-5 `flock -x` on `session.json` before read for hook and reconstructor.
- Preserve D-3-3-resolver's project.json-then-single-project fallback and session-dir scan.
- Preserve D-3-6 transcript correlation paths; empirical JSONL checks validate them.
- Preserve canonical `AI-Provenance-Record: .../task/{task-id}` form.
- Preserve official-doc citation for `PostToolUseFailure`.
- Preserve D-3-4's input-side/result-side clarification.
- Preserve CL-1 path-surface explanation.
- Preserve denominator math for the 90% field-population success criterion.
- Preserve partial-promotion rollback semantics.

## Overall verdict
The iter2 draft fixes the main T3 blockers and the provenance/documentation defects, but it introduces a new High-confidence branch-convention failure in the T1 row 5.5 design. Because any High finding with confidence >= 50 drives REVISE, the overall verdict is REVISE.

Verdict: REVISE
