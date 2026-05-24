# Consistency — T07+T08 iter1

## Artifact Summary + Memory reads
(See `project.md`.)

## Locked Frame (Stage 1)

### Scenario C-1: Implementation matches Ideation D-3 series 1:1
- [ ] D-3-1 bash+jq, two-tier
- [ ] D-3-2 verify-and-fix, upsert by id, idempotent, orphan-report-only
- [ ] D-3-3 single script for both events
- [ ] D-3-3-resolver step (i) DORMANT + step (ii) directory scan
- [ ] D-3-4 hybrid metadata (model from input, phase/iter from headers)
- [ ] D-3-5 flock -x on every read-modify-write
- [ ] D-3-6 tool_use_id correlation

### Scenario C-2: Tool-name pattern matches live Claude Code surface
- [ ] Live transcript inspection — what tool_name does Claude actually emit?
- [ ] Hook accepts the actual value (or at least includes a workable alias)

### Scenario C-3: Schema fields vs session.template.json
- [ ] Canonical schema fields present
- [ ] Extra fields deliberate + within Ideation Out-of-Scope deferral

### Scenario C-4: Cross-script field parity (hook ↔ reconstructor)
- [ ] Both produce the SAME shape of agents[] entry
- [ ] Status/tokensUsed/totalDurationMs/identifying fields aligned

### Scenario C-5 (adversarial): Code passes tests but docs are misleading
- [ ] Commit body claims match the diff
- [ ] Ideation Implementation Checklist items T3-I-T3.a + T3-I-T3.b satisfied

### Scenario C-6: Settings.json registration (cross-task, T09)
- [ ] settings.json matcher matches the tool name the script accepts

## Per-scenario per-check results

C-1: ✓ D-3-1 lines 144-162 + 178-179 confirm two-tier. ✓ D-3-2 lines 222-238 confirm upsert; verified idempotent. ✓ D-3-3 lines 165-167 dual-event handling. ✓ D-3-3-resolver lines 68-94. ✓ D-3-4 lines 126-142 (hook) + 132-150 (reconstructor). ✓ D-3-5 lines 220 + 199. ✓ D-3-6 confirmed via correlation logic.

C-2: ✓ Live transcript inspection: `jq -r '... .name' transcript.jsonl | sort -u` returns `Agent` only; `Task` never appears. The script accepts both — DISCLOSED DEVIATION is necessary, not optional. Without it the hook would be a no-op in current Claude Code. Comment at lines 51-58 documents the rationale.

C-3: ✗ Schema drift — see CONS-1 below. The deviation is disclosed but the audit table needs to be explicit.

C-4: ✗ Cross-script asymmetry — see CONS-2 below.

C-5: ✓ Commit body summarizes both scripts accurately; verifies list matches what was actually run. ✓ Ideation T3-I-T3.a + T3-I-T3.b satisfied — files created at specified paths with specified behaviors.

C-6: ✗ Cross-task consistency failure — see CONS-3 below (T09 settings.json matcher uses only "Task", not "Task|Agent"; the hook will not fire).

## Typed findings

### Finding CONS-1 — agents[] schema drift vs session.template.json (deliberate; Ideation-deferred)
- **finding-id**: cons-schema-drift-vs-template
- **Type**: `general` (Domain: `docs-sync`)
- **Disposition**: open
- **Confidence**: 100 (verified by direct comparison)
- **Severity**: Low
- **Evidence**:
  - `session.template.json:agents[]` canonical keys: `id, name, type, step, phase, iter, model, system, transcriptPath, tokensUsed, startedAt, finishedAt`.
  - Hook entry keys: `id, tool_use_id, name, type, step, phase, iter, sub_step, model, status, hook_event, transcriptPath, tokensUsed, totalDurationMs, finishedAt, startedAt`.
  - Reconstructor entry keys: `id, tool_use_id, name, type, step, phase, iter, sub_step, model, status, transcriptPath, tokensUsed, totalDurationMs, startedAt, finishedAt`.
  - NEW fields (not in template): `tool_use_id`, `sub_step`, `status`, `hook_event` (hook-only), `totalDurationMs`.
  - DROPPED field: `system` — template has `"system": "claude-code"` on manager seed but hook/reconstructor never emit it; new entries silently differ from the canonical seed shape.
- **Why it matters**: Ideation Out-of-Scope row explicitly defers `session.template.json.agents[] status field schema extension to feature-level backlog`. The deviation is contract-sanctioned, but the executor also stages T3-I-T3.f for this backlog — the staging entry should be checked. The `system` field omission is also schema drift; if the canonical seed has `system: "claude-code"`, then a future reader filtering by `system` would miss every hook-written entry.
- **Suggested direction (manager-owned)**: (1) Verify T3-I-T3.f staging entry exists; (2) decide whether `system: "claude-code"` should be set by hook + reconstructor for cross-system consistency.

### Finding CONS-2 — Hook ↔ reconstructor field-set asymmetry (`hook_event` only in hook output)
- **finding-id**: cons-hook-event-field-asymmetry
- **Type**: `design_flaw` (Domain: `regression`)
- **Disposition**: open
- **Confidence**: 100 (verified by direct comparison)
- **Severity**: Medium
- **Evidence**: Hook emits `hook_event: "PostToolUse"|"PostToolUseFailure"` (line 200); reconstructor never emits this field. Merge semantics: jq's `$cur + $new` preserves keys only in `$cur` — so `hook_event` survives reconstructor passes. BUT for entries created PURELY by reconstructor (transcript-only, no hook fire), `hook_event` is missing. Result: agents[] has heterogeneous shapes — hook-touched entries have `hook_event`; reconstructor-only entries don't.
- **Why it matters**: Downstream consumers that group / filter on `hook_event` will see inconsistent buckets. Also: `status` in reconstructor is hard-coded `"ok"` or `"unknown"`, while in hook it's `"ok"` or `"failed"` — failed-status entries reconstructed from transcript-only would be mis-categorized as `"ok"` (the reconstructor never reads `.toolUseResult.status`).
- **Suggested direction (manager-owned)**: (a) Have reconstructor read `$r.status` (transcript provides `"completed"`) and propagate; (b) decide whether `hook_event` is meaningful on transcript-only entries (probably synth as `"transcript"`).

### Finding CONS-3 — Cross-task drift: T09 settings.json matcher does not include "Agent"
- **finding-id**: cons-settings-matcher-task-only
- **Type**: `design_flaw` (Domain: `regression`)
- **Disposition**: open
- **Confidence**: 100 (verified — `jq '.hooks.PostToolUse[].matcher' .claude/settings.json` → `"Task"`)
- **Severity**: HIGH (deployed bundle will not fire the hook)
- **Evidence**: `.claude/settings.json` PostToolUse/PostToolUseFailure matcher is `"Task"`. Live Claude Code emits `tool_name: "Agent"` (verified via direct transcript inspection of 53 spawns in this session — `"Task"` count = 0). Even though the T07 script DEFENSIVELY accepts both names internally, the Claude Code hook engine filters BEFORE the script runs based on the `matcher` regex. Hook script will never receive any payload.
- **Why it matters**: Bundle B success criterion #3 ("session.json.agents[] length ≥ N+1 with ≥ 90% field population") FAILS under the as-deployed configuration. Bundle ships a broken hook.
- **Scope note**: This finding is technically about T09 (commit `d2fdf63`) which is OUT OF SCOPE for the T07+T08 commit (2a95824). However, the symmetric concern — "should the T07 hook script accept both names?" — was resolved in T07's favor (accepts both). The T09 settings.json was modified by the same executor in the same session and represents a cross-task inconsistency the T07+T08 evaluator can SEE but cannot FIX.
- **Suggested direction (manager-owned)**: Spawn (or check the existing) T09 evaluator with explicit guidance to verify the matcher against the live tool_name. Pattern should be `"Task|Agent"` (regex alternation supported per Claude Code docs).

## Per-perspective verdict

**REVISE**. CONS-2 (Medium) + CONS-3 (High, but cross-task) push to REVISE. Under threshold rules: any High at confidence ≥ 50 → REVISE. CONS-3 is High/100, but scope debate matters — manager can choose to (a) treat it as in-scope for the Bundle B evaluation cycle and demand fix or (b) re-route to T09 evaluator.

## Low-confidence appendix

(none)
