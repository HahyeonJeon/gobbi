# Project — T07+T08 iter1

## Artifact Summary + Memory reads

**What**: Two bash+jq scripts implementing Ideation D-3:
- `.claude/hooks/post-tool-use-agents.sh` (T07, 251 lines) — PostToolUse/PostToolUseFailure hook that upserts `session.json.agents[]` per subagent spawn.
- `.claude/scripts/reconstruct-agents.sh` (T08, 241 lines) — verify-and-fix reconstructor; walks transcript JSONL and merges desired agents[] payload (idempotent, orphan-report-only).

**Why**: Bundle B success criteria 3+4+6 — populate `agents[]` with ≥ 90% field coverage on subagent spawns, record `status: "failed"` on failure events, survive concurrent fires without lost-update. Plan tasks 07+08, combined commit per LOCK #2 (single executor for shared jq snippets).

**How**: Bash + jq with POSIX `flock -x` serialization, temp file + atomic `mv`, two-tier extraction (transcript `toolUseResult` preferred, `tool_result` fallback), `tool_use_id` correlation, hybrid metadata (model from `tool_input.model`, phase/iter/sub-step from prompt structured headers via regex).

**Scope Contract**: Ideation `bundle-b-ideation-pass.md` (D-3 series, T3 implementation checklist T3-I-T3.a/.b, success criteria 3/4/6), Planning `2026-05-24-session-foundations-bundle-b.md` rows 07/08, LOCK #2 single-commit constraint.

**Downstream consumers**: T09 (settings.json registration), T10 (orchestration/SKILL.md narrative), and every future session's `agents[]` telemetry.

### Memory reads

- `.claude/skills/principles/SKILL.md` — Iron Laws (4 scope, 7 verification, 8 docs, 12 W/W/H)
- `.claude/skills/evaluation/SKILL.md` — finding schema, Stage 0-3 procedure
- `.claude/skills/execution/evaluation.md` — Project perspective seeds
- `.gobbi/projects/gobbi/mistakes/*.md` — filtered by hook/race/atomic (no direct hits; mostly evaluator/manager process)
- `sessions/.../ideation/artifacts/bundle-b-ideation-pass.md` — D-3-1..6, D-3-3-resolver, T3-E-1..5
- `sessions/.../planning/staging/plans/2026-05-24-session-foundations-bundle-b.md` — task rows 07/08
- `sessions/.../planning/staging/discussions/2026-05-24-shared-executor-tasks-07-08.md` — LOCK #2
- `.claude/skills/orchestration/templates/session.template.json` — canonical agents[] schema
- `git show 2a95824` — the change-set under evaluation
- Live transcript `~/.claude/projects/-playinganalytics-git-gobbi/1b26cf20-….jsonl` — to confirm field shapes

### W/W/H gate

What ✓ (two concrete scripts at known paths). Why ✓ (linked to Ideation D-3 series + Bundle B success criteria 3/4/6). How ✓ (bash+jq, flock-x, two-tier extraction, atomic mv all explicit). No gate finding.

## Locked Frame (Stage 1)

### Scenario P-1: Change-set matches task outputs 1:1
- [ ] `.claude/hooks/post-tool-use-agents.sh` exists
- [ ] `.claude/scripts/reconstruct-agents.sh` exists
- [ ] No other files touched in commit 2a95824

### Scenario P-2: Plan verifies pass on commit
- [ ] `bash -n` exits 0 on T07
- [ ] `bash -n` exits 0 on T08
- [ ] `echo '{}' | bash T07` graceful exit 0
- [ ] Idempotency check on T08 (re-run produces zero diff)
- [ ] shellcheck (if available)

### Scenario P-3: No file outside scope touched
- [ ] `git show 2a95824 --name-only` shows only the two scripts

### Scenario P-4: Commit message names the task and matches diff
- [ ] Commit subject references T07+T08 + D-3
- [ ] AI-Provenance-Record trailer present
- [ ] Description matches the actual two-file diff

### Scenario P-5 (adversarial): "While I was in there" cleanup
- [ ] Diff scanned for unrelated changes; none found

### Scenario P-6 (adversarial): Disclosed deviations stay in scope
- [ ] Deviation 1 (Task|Agent tool name) — justified vs Ideation
- [ ] Deviation 2 (synthetic schema fields tool_use_id/sub_step/hook_event/totalDurationMs/status) — justified vs Ideation Out-of-Scope statement

## Per-scenario per-check results

P-1: ✓ both files present (`ls .claude/hooks/post-tool-use-agents.sh .claude/scripts/reconstruct-agents.sh` both resolve). ✓ commit stat: `2 files changed, 492 insertions(+)` — exactly the two scripts.

P-2: ✓ `bash -n` exit 0 on both. ✓ `echo '{}'` → graceful exit 0 with log "stdin is not valid JSON". ✓ Idempotency confirmed: 53→54 agents (+manager) on first run; second run reports "no changes (already converged)"; `diff` produces zero delta. ✗ shellcheck NOT available in env (executor reported same; acceptable).

P-3: ✓ `git show 2a95824 --name-only` = exactly `.claude/hooks/post-tool-use-agents.sh` + `.claude/scripts/reconstruct-agents.sh`.

P-4: ✓ Subject: `feat(hooks): post-tool-use-agents.sh + reconstruct-agents.sh (T07+T08; D-3 design)`. ✓ AI-Provenance-Record trailer present + Co-Authored-By. ✓ Body lists all 6 D-3 sub-anchors implemented + verifications run; matches diff.

P-5: ✓ No "while I was in there" — diff contains only the two new files. No drive-by refactors.

P-6: ✓ Deviation 1 justified — transcript inspection (`jq -r '... | .name'` on live JSONL) returns `Agent` only; `Task` never appears. Without the `Task|Agent` pattern, hook would be a no-op in current Claude Code. Comment lines 51-58 document the empirical observation. ✓ Deviation 2 — Ideation Out-of-Scope row explicitly says: `session.template.json.agents[] status field schema extension — deferred to feature-level backlog`. The new fields (tool_use_id, sub_step, hook_event, totalDurationMs, status) are exactly the deferred extension; ideation T3-I-T3.f names this as backlog. Both deviations are inside contract.

## Typed findings

### Finding PROJ-1 — Hook matcher in settings.json (T09, out-of-scope) uses "Task" not "Task|Agent", which will block the hook from firing
- **finding-id**: proj-settings-matcher-mismatch
- **Type**: `general` (Domain: `regression`)
- **Disposition**: open
- **Confidence**: 100 (verified — `jq '.hooks.PostToolUse[].matcher' .claude/settings.json` returns `"Task"`; live transcript shows `Agent`)
- **Severity**: Low (within T07+T08 — the script itself is correct; this is T09's defect, not this commit's)
- **Evidence**: `.claude/settings.json` line in `d2fdf63` (T09 commit, OUT OF SCOPE for this evaluation). The T07 script accepts both names correctly.
- **Why it matters**: The bundle as deployed will not fire the hook because the matcher filter is upstream of the script. The cross-task drift is a Bundle-B-level Consistency concern that the T07+T08 evaluator surfaces to be addressed in T09 evaluation.
- **Suggested direction (manager-owned)**: Verify T09 evaluator flags the same issue; otherwise re-route as a separate finding.

## Per-perspective verdict

**PASS**. T07+T08 satisfy every Project-perspective scenario for this commit. Both disclosed deviations are inside the Ideation Scope Contract. The single PROJ-1 finding is a cross-task observation, not a within-scope defect.
