---
loop: execution
iter: 1
artifact_type: w3t3-cluster-manifest
created_at: 2026-05-26
status: in-progress
---

# W3-T3 recovery manifest — re-home Bundle B (100 cluster md) into 7 capability features

**Task:** §1.3 row 3 + §8 cat A — re-home `features/session-foundations-bundle-b/` 100 cluster md (README deferred to W3-T5) into the capability features. Primary = `git-workflow`; route per content (§8 rule 1), default ambiguous → `git-workflow` (§8 rule 2).

**Resume protocol:** read this manifest; skip any cluster whose box is `[x]` (it is committed with the SHA shown). Process unchecked clusters in order; commit + mark `[x]` + record SHA after each.

**Routing rule (§8 LOW-16):** destination feature = the capability the file's CONTENT is about, not the sprint it shipped in. Ambiguous/two-spanning → primary (`git-workflow`). All moves are `git mv` (no-delete, no body rewrite). On move, `feature:`/`scope:` frontmatter MAY be updated to the new home; nothing else.

## Clusters (process in order)

- [x] **(a)** decisions 6 + scenarios 6 + plans 1 + changelogs 1 = **14** — SHA: f3f3e8b
- [x] **(b)** design 16 = **16** — SHA: b43b7cf
- [x] **(c)** checklists 15 = **15** — SHA: 739d166
- [x] **(d)** backlogs 15 = **15** — SHA: 947ec9f
- [x] **(e)** references 12 = **12** — SHA: PENDING-COMMIT
- [ ] **(f)** discussions 28 = **28** — SHA: ____

**Total: 100 md across 6 commits.**

## Per-cluster routing log

### Cluster (a) — 14 files — COMMITTED
decisions (6):
- `lock1-wave-ordering-not-graph-enforced` → **workflow** (Planning wave-ordering graph enforcement)
- `mirror-propagation-policy-mirror-canonical-symlinks` → **install-runtime** (skill mirror/symlink topology)
- `mirror-propagation-policy-workspace-canonical` (superseded) → **install-runtime** (same topic; kept with its successor)
- `planning-brief-mistake-load-directives-for-t1` → **workflow** (Planning brief discipline)
- `rollback-semantics-drift-from-ideation` → **git-workflow** (worktree `git rm` rollback)
- `session-commit-storage-bounds` → **git-workflow** (per-iteration MEMORIZATION commit storage)

scenarios (6):
- `branch-name-collision-recovery` → **git-workflow** (worktree branch naming)
- `consumer-mental-model-symlink-topology` → **install-runtime** (symlink topology)
- `hook-silence-no-agents-mutation-diagnostic` → **agents** (PostToolUse hook agents[] mutation)
- `mirror-policy-workspace-canonical-false-premise` → **install-runtime** (mirror/symlink topology)
- `no-issue-worktree-branch-bootstrap` → **git-workflow** (worktree branch bootstrap)
- `ssid-env-var-absent-fallback` → **git-workflow** (row 5.5 branch-name derivation)

plans (1):
- `session-foundations-bundle-b` → **git-workflow** (sprint plan; primary)

changelogs (1):
- `task-01-row-5-5-worktree-create` → **git-workflow** (worktree create)

Re-home changelogs added (4): git-workflow, workflow, install-runtime, agents.
`feature:` restamped on all 14. Breakdown: git-workflow 7, install-runtime 4, workflow 2, agents 1.

### Cluster (b) — 16 files — COMMITTED
- `d-1-worktree-row-5-5` → **git-workflow** (worktree create row 5.5)
- `d-2-qualified-git-rule` → **git-workflow** (`git/SKILL.md` rule)
- `d-3-1-hook-bash-jq-stack` → **install-runtime** (session.json agents[] capture hook stack)
- `d-3-2-reconstructor-verify-and-fix` → **install-runtime** (reconstructor algorithm)
- `d-3-3-resolver` → **install-runtime** (hook scope + session-dir resolver)
- `d-3-4-metadata-extraction` → **install-runtime** (hybrid metadata extraction)
- `d-3-5-flock-serialization` → **install-runtime** (flock on session.json)
- `d-3-6-correlation-key` → **install-runtime** (tool_use_id correlation)
- `d-3-promote-now-commit-on-branch` → **git-workflow** (preparation worktree-branch commit)
- `d-4-per-iter-session-commit` → **git-workflow** (per-iter session-memory commit cadence)
- `d-5-direct-mode-retained` → **git-workflow** (direct-mode opt-out)
- `dependency-graph-strict-wave-ordering` → **workflow** (T1→T3 wave ordering)
- `execution-intake-notes-cross-cutting` → **agents** (delegation-brief boilerplate)
- `five-locked-decisions` → **workflow** (Planning locked decisions)
- `task-decomposition-10-tasks` → **workflow** (sprint task decomposition)
- `workflow-phase-doc-set-for-per-iter-cadence` → **git-workflow** (per-iter commit-cadence doc set; AMBIGUOUS workflow/git-workflow → routed git-workflow as the per-iter commit cadence is the subject, matching d-4)

Breakdown: git-workflow 7, install-runtime 6, workflow 3, agents 1. `feature:` restamped on all 16. No new re-home changelog (all 4 features touched in cluster a).
Note: D-3-1..D-3-6 (subagent-metadata hook plumbing) → install-runtime per §1.3 "T3 subagent metadata → install-runtime" (the session-runtime hook contract), not agents.

### Cluster (c) — 15 files — COMMITTED
- `chore-label-line-citation-stale` → **git-workflow** (`git/conventions.md` citation)
- `cross-layer-drift-gate` → **guardrails** (drift gate)
- `decimal-row-numbering-55` → **git-workflow** (row 5.5 numbering)
- `dq-anchor-readability` → **workflow** (Planning artifact DQ-anchors)
- `dq-anchor-traceability` → **workflow** (Planning artifact DQ-anchors)
- `d-ref-codes-missing-inline-expansion` → **agents** (executor delegation-brief ref codes)
- `effort-field-non-canonical-schema` → **workflow** (planning task YAML schema)
- `hook-event-count-31-vs-29-docs-sync` → **guardrails** (hook-event docs sync)
- `hook-latency-bounds` → **install-runtime** (agents[] capture hook/reconstructor latency)
- `migration-smoke-test-post-merge` → **git-workflow** (worktree-first post-merge smoke test)
- `mirror-policy-empirical-verification` → **install-runtime** (mirror/symlink topology)
- `phase-doc-count-verification` → **git-workflow** (per-iter phase-doc set, matches d-4/workflow-phase-doc-set)
- `skill-md-commit-type-feat-vs-docs` → **git-workflow** (commit-type convention; no feature: key, left unstamped)
- `structured-header-migration-behavior` → **install-runtime** (session.json agents[] header field population)
- `task01-t1c-trace-overclaim` → **workflow** (Planning traceability)

Breakdown: git-workflow 6, workflow 4, install-runtime 3, guardrails 2, agents 1. NEW feature touched: guardrails → re-home changelog added. `feature:` restamped on 14 (skill-md-commit-type had no key).

### Cluster (d) — 15 files — COMMITTED
- `abort-mid-commit-partial-session` → **git-workflow** (per-iter commit abort recovery)
- `anchor-slug-4-hyphen-vs-2-hyphen` → **git-workflow** (row 5.5 → git/SKILL.md P2/P6 worktree anchors)
- `chore-label-line-citation-stale` → **git-workflow** (`git/conventions.md` citation)
- `ci-symlink-backlog-pseudocode-plumbing` → **install-runtime** (symlink-mode CI check)
- `consequences-section-unqualified-claim` → **install-runtime** (mirror-canonical decision claim)
- `dot-gobbi-project-json-bootstrap` → **install-runtime** (resolver project.json bootstrap)
- `dry-inline-jq-hook-script` → **install-runtime** (agents[] capture hook/reconstructor jq)
- `goodhart-factor-when-demanded-deferred` → **guardrails** (agents[] metric-gaming / Goodhart)
- `hook-event-count-31-vs-29-docs-sync` → **guardrails** (hook-event docs sync)
- `hook-self-failure-budget-unstated` → **install-runtime** (PostToolUseFailure capture-hook budget)
- `lock2-shared-executor-mega-task-risk` → **workflow** (execution decomposition / context budget)
- `posttooluse-failure-webfetch-verification-gap` → **guardrails** (hook-event doc verification)
- `privacy-retention-agents-metadata-deferred` → **agents** (AMBIGUOUS agents/guardrails: content is the agents[] metadata persisted → agents, not git-workflow)
- `schema-extension-agents-status-field` → **install-runtime** (session.template.json agents[] schema)
- `sidecar-lock-refinement-deferred` → **install-runtime** (flock on session.json)

Breakdown: install-runtime 7, git-workflow 3, guardrails 3, workflow 1, agents 1. `feature:` restamped on all 15. No new feature touched.

### Cluster (e) — 12 files — COMMITTED
- `autogen-pydantic-tool-schema-validation` → **agents** (agent structured-output schema validation; AMBIGUOUS w/ git-workflow commit-validation — content is agent-output validation)
- `claude-code-agent-sdk-task-output` → **agents** (Task-tool result interface)
- `claude-code-hooks-12-lifecycle-events` → **guardrails** (hook lifecycle reference)
- `claude-code-posttooluse-hook-schema` → **guardrails** (PostToolUse hook schema reference)
- `claude-code-transcript-tooluseresult-empirical` → **install-runtime** (transcript payload the agents[] capture hook parses)
- `claude-code-worktree-isolation-pattern` → **git-workflow** (worktree isolation prior art)
- `claude-jj-worktree-shim-pattern` → **git-workflow** (jj worktree shim)
- `commitlint-required-fields-validator` → **git-workflow** (commit-msg hook validation)
- `jj-workspace-isolation-revision-not-branch` → **git-workflow** (jj workspace isolation)
- `langgraph-skill-catalog-pattern` → **agents** (role × skill catalog)
- `rbac-matrix-single-source-of-truth` → **agents** (role-permission matrix)
- `worktree-scope-by-module-not-task` → **git-workflow** (worktree scoping practice)

Breakdown: git-workflow 5, agents 4, guardrails 2, install-runtime 1. NOTE: reference files use a `title:`/`source:`/`accessed:` frontmatter shape with NO `feature:` key — none restamped (body + frontmatter unchanged; frontmatter normalization is a separate category-C task). No new feature touched.

### Cluster (f) — 28 files
(pending)

## Ambiguous routings (defaulted to git-workflow)
(none yet)
