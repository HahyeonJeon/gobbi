# T2 Evaluation — Risk Perspective — iter1

Date: 2026-05-22
Perspective: risk
Evaluator: claude/sonnet-4-6
Target: commit 6a575f2 — `.claude/settings.json` SessionStart hook registration

## Stage 0 — What / Why / How

Risk perspective: what can go wrong, how bad is it, how likely? Focus on: hook failing silently, hook failing noisily and blocking sessions, permissions regression, key contamination.

## Stage 1 — Frame

Scenarios:
1. Silent hook failure (script not found or not executable)
2. Noisy hook failure (hook exits non-zero, blocks Claude Code session start)
3. Permissions / enabledPlugins regression
4. JSON syntax error breaking Claude Code startup
5. Scope contamination from other open worktrees

## Stage 2 — Sequential Evaluation

### Scenario 1: Silent hook failure

If `.claude/hooks/session-start.sh` is not found at hook-fire time (wrong cwd resolution, file not present), Claude Code's behavior for missing hook scripts is not explicitly documented as "error and stop" — most hook systems silently skip missing commands. The failure mode is that env vars are not loaded at session start without any alert to the user.

Risk: Medium. Likelihood: Low if T1 and T2 merge together; Higher if T2 is cherry-picked to a branch without T1. The feature branch has both commits (fd216fe for the script, 6a575f2 for the registration). For the merge PR, both will arrive together. Risk is managed at merge time.

### Scenario 2: Noisy hook failure (exit non-zero blocking sessions)

If the script exists but exits non-zero (e.g., malformed jq in session-start.sh, missing dependency), Claude Code may block session start or print an error. T1's script (commit 51199d6 "fail-fast on empty stdin") added a fail-fast guard — this is a hardening commit, suggesting the script was tested for the empty-stdin case. Residual risk: if `jq` is not installed or `GOBBI_SESSION_DIR` is unset, the script may fail.

This is a T1 risk, not a T2 risk. T2 only registers the path — it has no control over script behavior. Note for overall risk picture but not a T2 finding.

### Scenario 3: Permissions / enabledPlugins regression

`diff` of both keys against main-tree baseline returned empty — confirmed identical. No regression. PASS.

### Scenario 4: JSON syntax error breaking Claude Code startup

`jq -e .` passes. No trailing commas, no missing braces (the diff correctly closed the `enabledPlugins` object with `},` and added the `hooks` object). PASS.

**Specific check:** the pre-edit JSON ended with `}` after `enabledPlugins`. The diff changed the closing `}` of `enabledPlugins` to `},` and added `"hooks": { ... }`. The resulting JSON is syntactically correct (verified by jq). PASS.

### Scenario 5: Scope contamination from other open worktrees

Worktree is isolated under `.gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook/`. The `.claude/settings.json` in this worktree is a separate file from the main-tree's `/playinganalytics/git/gobbi/.claude/settings.json`. Changes in the worktree do not propagate to the main tree until the branch is merged. No contamination risk. PASS.

## Findings

No new findings beyond F-STR-01 (from structure perspective) which is the relative path assumption. Risk perspective concurs with that finding at Medium/50.

No Critical or High risk findings.

## Must-preserve

- The feature branch must merge T1 (session-start.sh) and T2 (.claude/settings.json) together — cherry-picking T2 alone to a branch without T1 would register a hook pointing at a non-existent script.

## Verdict

PASS
