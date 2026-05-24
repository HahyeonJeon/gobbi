---
loop: planning
iter: 2
artifact_type: plan
feature: session-foundations-bundle-b
goal: "10-task ordered decomposition of T1+T3 bundle for Execution"
created-by: 1b26cf20-677b-498c-8c1b-7d7e971597ac
created-at: 2026-05-24
status: final
verdict: PASS
iters: 2
supersedes: []
related:
  - planning/artifacts/memory-reads.md
  - planning/artifacts/resolution-log.md
  - planning/rawdata/draft-iter2.md
  - ideation/artifacts/bundle-b-ideation-pass.md
  - preparation/artifacts/preparation.md
---

# Planning canonical artifact — session-foundations-bundle-b

## Feature

`session-foundations-bundle-b` — T1 worktree-first session architecture (with NEW promote-now commit-on-branch absorbed) + T3 PostToolUse/PostToolUseFailure hook + shell-script reconstructor. T2 deferred.

## Scope Contract

- **Project**: gobbi
- **Feature**: `session-foundations-bundle-b`
- **In-scope**: T1 (10 checklist anchors: T1.a–T1.j) + T3 (8 checklist anchors: T3.a–T3.h, 2 verification-only)
- **Out-of-scope**: T2, Codex CI, Auto-mode silence, chat-mode tiki-taka, Item 1-3 alternatives, Item 1-2 broader verifier, `agents[]` status field schema extension, `.gobbi/project.json` bootstrap

## 5 Locked Decisions

| # | Lock | Decision |
|---|---|---|
| LOCK #1 | T1→T3 wave ordering | Strict sequential: T1 wave (Tasks 01-06) completes before T3 wave (Tasks 07-10) starts. Graph-enforced via `05, 06 → 07`. |
| LOCK #2 | Tasks 07+08 shared executor | Single executor delegation covering both Task 07 (hook) and Task 08 (reconstructor) back-to-back to preserve shared jq snippets. |
| LOCK #3 | T3 mistake bundle | Iron Law 7 mistake (`manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`) only for T3 briefs (Tasks 07-10). T1 tasks get full 3-mistake bundle. |
| LOCK #4 | T1.j rollback doc home | preparation/SKILL.md, co-located with narrow-exception text. Rollback = `git -C "$worktreePath" rm <copied-paths>` + AskUserQuestion per Ideation:283. |
| LOCK #5 | T1.g direct-mode opt-out home | orchestration/SKILL.md row 5.5 footnote (NOT git/SKILL.md). |

## Task Table (10 tasks)

### Task 01 — T1.a + T1.d (partial) — Configuration Step 1 row 5.5 worktree creation

```yaml
id: 01-orchestration-row-5-5-worktree-create
what: Insert row 5.5 in orchestration/SKILL.md Configuration Step 1 table — invokes git P2 to create the worktree at branch chore/session-{date}-{ssid-short} with idempotency guard.
traces-to:
  - T1-I-T1.a
  - T1-I-T1.c (P2 invocation note — actual edit lives in Task 02)
requires: []
files:
  - {path: ".gobbi/projects/gobbi/skills/orchestration/SKILL.md", op: modify}
verifies:
  - grep -E 'chore/session-\{date\}-\{ssid-short\}' .claude/skills/orchestration/SKILL.md returns ≥1 match
  - test -L .claude/skills/orchestration/SKILL.md
  - Manual: Configuration Step 1 table shows new row between row 5 and row 6
effort: Medium
```

### Task 02 — T1.b + T1.c — git/SKILL.md Memory Access Matrix qualifier + P2 invocation note

```yaml
id: 02-git-skill-worktree-path-qualifier
what: Qualify git/SKILL.md Memory Access Matrix row 31 and Critical rule paragraph — use worktreePath when set; fallback main tree when null. Add P2 invocation note.
requires: [01-orchestration-row-5-5-worktree-create]
files:
  - {path: ".gobbi/projects/gobbi/skills/git/SKILL.md", op: modify}
verifies:
  - grep -E 'worktreePath' .claude/skills/git/SKILL.md returns ≥2 matches
  - test -L .claude/skills/git/SKILL.md
effort: Small
```

### Task 03 — T1.d + T1.j — preparation/SKILL.md generate-now commit-on-branch + rollback semantics (LOCK #4)

```yaml
id: 03-preparation-generate-now-commit-on-branch
what: Extend preparation/SKILL.md narrow-exception with git -C "$worktreePath" add + commit promote-now path + AI-Provenance-Record trailer. Per LOCK #4, rollback semantics co-located: if git commit fails post-copy, manager MUST git -C "$worktreePath" rm <copied-paths> + AskUserQuestion + re-attempt-or-abort. Rollback REMOVES the copied file (not git checkout). Per Ideation:283.
requires: [01-orchestration-row-5-5-worktree-create, 02-git-skill-worktree-path-qualifier]
files:
  - {path: ".gobbi/projects/gobbi/skills/preparation/SKILL.md", op: modify}
verifies:
  - grep -E 'git -C "\$worktreePath"' .claude/skills/preparation/SKILL.md returns ≥3 matches
  - grep -E 'chore.skills.: promote' .claude/skills/preparation/SKILL.md returns ≥1 match
  - grep -E 'gobbi://session/' .claude/skills/preparation/SKILL.md returns ≥1 match
  - grep -E 'git -C "\$worktreePath" rm' .claude/skills/preparation/SKILL.md returns ≥1 match
  - grep -E 'AskUserQuestion' .claude/skills/preparation/SKILL.md returns ≥1 match co-located with rollback
  - test -L .claude/skills/preparation/SKILL.md
effort: Medium
```

### Task 04 — T1.e + T1.i — gobbi/SKILL.md cross-reference + delegation/SKILL.md main-tree audit

```yaml
id: 04-gobbi-and-delegation-cross-ref-and-audit
what: Add gobbi/SKILL.md Session Bootstrap Order cross-reference to row 5.5. Run delegation/SKILL.md grep audit for main-tree boilerplate; qualify each occurrence for worktree-active case.
requires: [01-orchestration-row-5-5-worktree-create, 02-git-skill-worktree-path-qualifier]
files:
  - {path: ".gobbi/projects/gobbi/skills/gobbi/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/delegation/SKILL.md", op: modify}
verifies:
  - grep -E 'row 5.5|Configuration Step 1' .claude/skills/gobbi/SKILL.md returns ≥1 match
  - grep -nE 'main.tree' .claude/skills/delegation/SKILL.md — every match site checked
  - test -L .claude/skills/gobbi/SKILL.md && test -L .claude/skills/delegation/SKILL.md
effort: Small
```

### Task 05 — T1.f — Per-iter commit cadence in 5 workflow phase docs

```yaml
id: 05-five-phase-docs-per-iter-cadence
what: Add per-iteration session-memory commit cadence rule to MEMORIZATION exit section of 5 loop docs (ideation, preparation, planning, execution, wrap-up). Do NOT edit evaluation.md or memorization.md.
requires: [01-orchestration-row-5-5-worktree-create, 03-preparation-generate-now-commit-on-branch]
files:
  - 5 loop docs under .gobbi/projects/gobbi/skills/orchestration/workflow/
verifies:
  - grep -l 'chore(session): record .* iter.* memory' .claude/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md returns 5 paths
  - grep -lE 'chore.session.: record .* iter' .claude/skills/orchestration/workflow/{evaluation,memorization}.md returns 0 paths
effort: Medium
```

### Task 06 — T1.g + T1.h — Direct-mode opt-out footnote + smoke-test gate (LOCK #5)

```yaml
id: 06-direct-mode-opt-out-and-smoke-test
what: Per LOCK #5, document direct-mode opt-out in orchestration/SKILL.md row 5.5 footnote. Co-locate smoke-test gate documentation — jq '.git.branch' regex. Home is orchestration/SKILL.md, NOT git/SKILL.md.
requires: [01-orchestration-row-5-5-worktree-create]
files:
  - {path: ".gobbi/projects/gobbi/skills/orchestration/SKILL.md", op: modify}
verifies:
  - grep -E 'direct.*mode|workflow.git.mode' .claude/skills/orchestration/SKILL.md returns ≥1 match co-located with row 5.5
  - grep -E 'chore/session-\[0-9\]\{4\}' .claude/skills/orchestration/SKILL.md returns ≥1 match
effort: Small
```

### Task 07 — T3.a + T3.g (partial) — post-tool-use-agents.sh hook script (LOCK #1 gate; LOCK #2 shared with Task 08)

```yaml
id: 07-post-tool-use-agents-hook-script
what: Create .claude/hooks/post-tool-use-agents.sh — bash + jq + flock -x hook script. Reads PostToolUse/PostToolUseFailure stdin; upserts session.json.agents[] by tool_use_id; D-3-3-resolver step (ii) directory scan fallback.
requires: [05-five-phase-docs-per-iter-cadence, 06-direct-mode-opt-out-and-smoke-test]
files:
  - {path: ".claude/hooks/post-tool-use-agents.sh", op: create}
verifies:
  - bash -n .claude/hooks/post-tool-use-agents.sh returns exit 0 (ALWAYS run)
  - If shellcheck available: shellcheck .claude/hooks/post-tool-use-agents.sh exit 0 OR documented suppressions; if absent, note in commit body
  - echo '{}' | bash .claude/hooks/post-tool-use-agents.sh — exits gracefully
effort: Large
```

### Task 08 — T3.b — reconstruct-agents.sh verify-and-fix reconstructor (LOCK #2 shared with Task 07)

```yaml
id: 08-reconstruct-agents-script
what: Create .claude/scripts/reconstruct-agents.sh — bash + jq + flock -x verify-and-fix reconstructor. Idempotent; orphan-report-only. Shares jq snippets with Task 07. mkdir -p .claude/scripts/ at task start.
requires: [07-post-tool-use-agents-hook-script]
files:
  - {path: ".claude/scripts/reconstruct-agents.sh", op: create}
verifies:
  - bash -n .claude/scripts/reconstruct-agents.sh returns exit 0 (ALWAYS run)
  - If shellcheck available: run conditionally (same pattern as Task 07)
  - Idempotency: re-running on complete session.json returns same N entries + 0 changes
effort: Large
```

### Task 09 — T3.c — .claude/settings.json PostToolUse + PostToolUseFailure registration

```yaml
id: 09-settings-json-hook-registration
what: Add PostToolUse Task-matcher block + PostToolUseFailure Task-matcher block to .claude/settings.json. Both invoke .claude/hooks/post-tool-use-agents.sh.
requires: [07-post-tool-use-agents-hook-script]
files:
  - {path: ".claude/settings.json", op: modify}
verifies:
  - jq -e '.hooks.PostToolUse[] | select(.matcher == "Task")' .claude/settings.json returns block
  - jq -e '.hooks.PostToolUseFailure[] | select(.matcher == "Task")' .claude/settings.json returns block
  - jq . .claude/settings.json exits 0
effort: Small
```

### Task 10 — T3.d + T3.e + T3.g (partial) — orchestration row 6 narrative + delegation structured-header convention + flock doc

```yaml
id: 10-orchestration-row-6-and-delegation-headers
what: (a) Replace orchestration/SKILL.md row 6 with hook+reconstructor narrative. (b) Add delegation/SKILL.md structured-header convention for phase/iter/step extraction. (c) Add delegation/SKILL.md flock -x doc note.
requires: [01-orchestration-row-5-5-worktree-create, 04-gobbi-and-delegation-cross-ref-and-audit, 06-direct-mode-opt-out-and-smoke-test, 07-post-tool-use-agents-hook-script, 08-reconstruct-agents-script]
files:
  - {path: ".gobbi/projects/gobbi/skills/orchestration/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/delegation/SKILL.md", op: modify}
verifies:
  - grep -E 'PostToolUse|reconstructor' .claude/skills/orchestration/SKILL.md returns ≥1 match near row 6
  - grep -E '## Phase|## Iter|## Step' .claude/skills/delegation/SKILL.md returns ≥3 matches
  - grep -E 'flock' .claude/skills/delegation/SKILL.md returns ≥1 match
effort: Medium
```

## Dependency Graph

```
01 → {02, 04, 05(via 03), 06, 10}
02 → {03, 04}
03 → 05
04 → 10
05 → 07
06 → {07, 10}
07 → {08, 09, 10}
08 → 10
```

Wave ordering (LOCK #1): Tasks 01-06 (T1 wave) strictly before Tasks 07-10 (T3 wave). Graph-enforced by `requires: [05, 06]` on Task 07.

File-overlap conflicts resolved: orchestration/SKILL.md (01→06→10), delegation/SKILL.md (04→10).

## Agent Assignments

| Task | Agent | Model | Key Tier 4 mistakes |
|---|---|---|---|
| 01 | executor | sonnet | T1 3-mistake bundle |
| 02 | executor | sonnet | T1 3-mistake bundle |
| 03 | executor | sonnet | T1 3-mistake bundle + codex-rescue |
| 04 | executor | sonnet | T1 3-mistake bundle |
| 05 | executor | sonnet | T1 3-mistake bundle |
| 06 | executor | sonnet | T1 3-mistake bundle |
| 07+08 (shared, LOCK #2) | executor | sonnet | T3 Iron Law 7 procedural mistake only |
| 09 | executor | sonnet | T3 Iron Law 7 procedural mistake only |
| 10 | executor | sonnet | T3 Iron Law 7 procedural mistake only |

**T1 3-mistake bundle** (Tasks 01-06 mandatory):
- `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `.gobbi/projects/gobbi/mistakes/manager-rm-rf-without-investigating-tracked-files.md`
- `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`

**T3 procedural extension** (Tasks 07-10 mandatory, LOCK #3):
- `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`

## Cross-cutting Execution Notes

- **Edit-tool default**: Edit tool for `.claude/skills/...` workspace paths. Forbidden: `sed -i`, `perl -i`. Bulk rewrites target canonical mirror `.gobbi/projects/gobbi/skills/...`. Post-edit gate: `test -L .claude/skills/<path>`. Restore: `rm -f .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>` (3-dot for SKILL.md depth; 4-dot for sub-dir depth; verify against adjacent symlink).
- **Branch naming**: `chore/session-{date}-{ssid-short}` (manager creates at bootstrap row 5.5).
- **Per-iter commit subject**: `chore(session): record <loop> iter{n} memory`
- **AI-Provenance-Record trailer**: `gobbi://session/{ssid}/task/{task-id}` on every Execution commit.
- **bash -n**: ALWAYS run as syntax gate for Tasks 07+08. shellcheck CONDITIONAL — only if `command -v shellcheck` succeeds; note omission in commit body if absent.

## Spec Coverage

18/18 Ideation Implementation Checklist anchors covered (16 actionable tasks + 2 verification-only: T3.f, T3.h already staged at Ideation).

## Evaluation Summary — iter1 REVISE → iter2 PASS

### iter1 (REVISE) — 5 High findings triggered surgical revision

Five High findings across iter1 dual-system evaluation (Claude + Codex) produced REVISE:

1. **F-USAGE-1 (Claude) / task09-stub-rule-in-mistake-tier (Codex)** — Task 09 cited `stub-redirect-format.md` as a tier-4 mistake; empirically confirmed absent from `mistakes/` (lives in `rules/`). Fix 3: citation removed from Task 09 brief.
2. **F-USAGE-2 (Claude) / symlink-restore-depth-wrong (Codex)** — Symlink restore recipe used `../../` (2-dot) but actual `.claude/skills/<topic>/SKILL.md` symlinks use `../../../` (3-dot). Fix 1: corrected to `../../../` with depth disclaimer and empirical witness.
3. **F-STRUCT-1 (Claude) / lock-graph-under-enforced (Codex)** — Task 07 `requires: [05]` only; permitted 06→07 interleaving, violating LOCK #1's prose-stated strict T1→T3 wave. Fix 2: Task 07 `requires` changed to `[05, 06]`.
4. **F-CONS-2 (Claude) / orchestration-shared-file-edge-missing (Codex)** — Tasks 06 and 10 both touch `orchestration/SKILL.md` with no ordering edge between them. Fix 2 collateral: Task 10 `requires` adds `06`.
5. **rollback-semantics-drift-from-ideation (Codex)** — Task 03 `what` specified `git checkout` restore which drifts from Ideation:283 requiring copied-file removal via `git rm`. Fix 4: Task 03 `what` rewritten to cite Ideation:283 verbatim.
6. **shellcheck-verifier-not-runnable (Codex)** — Tasks 07+08 `verifies` specified mandatory `shellcheck`; shellcheck empirically absent from workspace. Fix 5: shellcheck made conditional behind `command -v shellcheck`; bash -n made always-on.

### iter2 (PASS) — All 5 High findings addressed; 3 new Low findings

All 5 High findings closed with empirical evidence independently re-verified by both Claude and Codex evaluators. iter2 introduced 3 new Low findings (F2-PROJ-1 silent deferral transparency; F2-PROJ-2 `effort:` schema; F2-AESTH-1 bullet density) — all non-blocking per evaluation thresholds. 3 Medium findings carried from iter1 (F-USAGE-3 D-ref expansion; F-RISK-1 LOCK #2 boundary; F-RISK-2 hook self-failure budget) remain open and out of iter2 surgical scope.

### Cross-system reconciliation

Claude and Codex evaluators converged on all 5 High findings across both iter1 and iter2. No substantive cross-system divergence. Codex iter2 wrapper issue (see mistake-candidate `codex-wrapper-relative-path-wrong-session-write.md`): Codex's first iter2 invocation wrote to wrong session dir; re-dispatch with absolute paths + marker verification produced PASS.

### Verdict

**PASS** — per `evaluation/SKILL.md` thresholds: zero Critical findings, zero High findings (open) at iter2. Plan is Execution-ready.
