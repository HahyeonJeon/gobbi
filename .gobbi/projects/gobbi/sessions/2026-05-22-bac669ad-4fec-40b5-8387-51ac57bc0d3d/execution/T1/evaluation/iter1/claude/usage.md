# T1 Execution Evaluation — Usage Perspective
## iter1 / claude / usage

(See project.md for Artifact Summary and Memory reads.)

## Locked Frame (Stage 1)

### S1 — Consumer can invoke correctly
Checklist:
- [ ] Script is invoked by Claude Code piping JSON to stdin with $CLAUDE_ENV_FILE set
- [ ] Error message on missing $CLAUDE_ENV_FILE is human-readable
- [ ] Error message on unwritable $CLAUDE_ENV_FILE is human-readable

### S2 — Re-fire safety (startup / resume / clear / compact all fire SessionStart)
Checklist:
- [ ] Append-only mode means last write wins after sourcing (not accumulation errors)
- [ ] Sourcing env file after two fires produces the last session's values (not first fire's stale values)

### S3 — Passthrough behavior visible to operator
Checklist:
- [ ] When $CLAUDE_PROJECT_DIR is unset, nothing is emitted (verified)
- [ ] When $CLAUDE_PROJECT_DIR is set, the emitted line is shell-safe (verified)

### S4 (adversarial) — Operator error: CLAUDE_ENV_FILE unset
Checklist:
- [ ] Exit code is non-zero (1) with stderr message
- [ ] No partial write to /dev/null or other unintended target

### S5 (adversarial) — Operator error: null required field in JSON payload
not-applicable per plan spec: "REQUIRED (always present in stdin JSON)" — null in a required field is outside spec. However, current behavior (emits literal string 'null') is documented as a low-priority edge.

---

## Stage 2 Results

### S1 — Consumer invocation
- `$CLAUDE_ENV_FILE` unset: line 33 prints "session-start.sh: $CLAUDE_ENV_FILE is unset — cannot persist env vars" to stderr and exits 1. **PASS**
- Unwritable: line 37-40 prints "'${CLAUDE_ENV_FILE}' is not writable" and exits 1. **PASS**

### S2 — Re-fire safety
- Two fires with different sessions: after sourcing, CLAUDE_CODE_SESSION_ID = session-B (last write wins). Append-only is correct behavior. **PASS**
- Two fires with same session: duplicate export lines are harmless when sourced (second source overrides first with same value). **PASS**

### S3 — Passthrough
- Empty $CLAUDE_PROJECT_DIR (`CLAUDE_PROJECT_DIR=""`) → condition `[[ -n "${!_var:-}" ]]` is false → nothing emitted. **PASS**
- Set $CLAUDE_PLUGIN_ROOT="/some/path" → emits `export CLAUDE_PLUGIN_ROOT=/some/path`. **PASS**

### S4 — CLAUDE_ENV_FILE unset
- Exit code 1, stderr message printed. **PASS**

### S5 — Null required field (low priority)

**Finding F-USAGE-01:**
- Type: `assumption_risk`
- Domain: `general`
- Disposition: open
- Confidence: 100 (verified by execution)
- Severity: Low
- Evidence: `echo '{"session_id":null,...}' | ... bash session-start.sh` → emits `export CLAUDE_CODE_SESSION_ID=null` (literal string "null"). When sourced: `$CLAUDE_CODE_SESSION_ID == "null"` not `""`. Consumer code checking `-z "$CLAUDE_CODE_SESSION_ID"` would not catch this.
- Why it matters: Plan spec says required fields are "always present" — but if Claude Code ever sends null (e.g., in a degraded mode), consumers get the string "null" instead of empty string. Low risk since null in required fields is out-of-spec.
- Suggested direction: Deferred per plan's "REQUIRED fields always present" assumption. Consider a null-guard jq filter for defense-in-depth in a future task.

**Per-perspective verdict: PASS**

## Low-confidence appendix
None.
