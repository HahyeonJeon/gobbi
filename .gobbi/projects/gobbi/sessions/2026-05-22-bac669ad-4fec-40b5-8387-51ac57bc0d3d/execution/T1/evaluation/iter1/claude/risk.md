# T1 Execution Evaluation — Risk Perspective
## iter1 / claude / risk

(See project.md for Artifact Summary and Memory reads.)

## Locked Frame (Stage 1)

### S1 — Shell injection via env values
Checklist:
- [ ] Values from JSON are never interpolated unquoted into the shell expression
- [ ] Values containing `$(...)`, backticks, `$var`, single-quotes are handled safely
- [ ] Both @sh and printf %q output safe results when sourced (tested with metacharacters)

### S2 — Fail-closed behavior
Checklist:
- [ ] Missing $CLAUDE_ENV_FILE exits non-zero (1) with message
- [ ] Unwritable $CLAUDE_ENV_FILE exits non-zero (1) with message
- [ ] Invalid JSON stdin exits non-zero (jq error + set -e)

### S3 — Partial write risk
Checklist:
- [ ] If the script fails mid-way (e.g., jq fails on required field after some writes), the env file has partial state
- [ ] This is noted as acceptable or mitigated

### S4 (adversarial) — Empty stdin silent success
Checklist:
- [ ] Empty stdin causes non-zero exit OR at minimum causes required vars to be explicitly absent

### S5 (adversarial) — Idempotency on re-fire
Checklist:
- [ ] Append-only behavior means env file grows on re-fire
- [ ] Sourcing the file after N fires still produces correct (last-write-wins) values
- [ ] No stale value from first fire persists after re-source

### S6 — Reversibility
Checklist:
- [ ] The script is a new file only; T2 adds hook registration; rolling back T1's commit removes the hook file without affecting other functionality
- [ ] No existing behavior modified

---

## Stage 2 Results

### S1 — Shell injection
- jq @sh single-quote escaping handles spaces, single quotes (escaped as `'\''`), `$()`, backticks. Verified with `/tmp/foo bar's baz.jsonl` round-trip. **PASS**
- printf %q handles spaces, single quotes, `$(echo injected)` → `\$\(echo\ injected\)`. Verified. **PASS**
- No unquoted interpolation of user-controlled data into shell expression. **PASS**

### S2 — Fail-closed
- Missing $CLAUDE_ENV_FILE: exit 1 with message. **PASS**
- Unwritable: exit 1 with message. **PASS**
- Invalid JSON: jq exits non-zero + set -e → script exits non-zero (5 observed). **PASS**

### S3 — Partial write

**Finding F-RISK-01:**
- Type: `assumption_risk`
- Domain: `security`
- Disposition: open
- Confidence: 75 (reasoning + verified that set -e fires on jq error mid-script)
- Severity: Low
- Evidence: If jq succeeds on required fields (lines 50-54) but then fails on an optional field (e.g., malformed sub-object), the env file has CLAUDE_CODE_SESSION_ID etc written but not all values. On re-source, the partial state would be sourced. In practice, this scenario requires a partially-valid JSON payload which Claude Code would not produce.
- Why it matters: A partial env file under set -e abort is the safe behavior (set -e stops further writes), but the already-appended lines remain. Not a security issue in context; noted for completeness.
- Suggested direction: Acceptable as-is given spec assumption of well-formed payloads.

### S4 — Empty stdin silent success
See F-STRUCT-01 in structure.md. Empty stdin exits 0 with no required vars written. Medium severity.

This finding is also owned by Risk: the silent success on empty stdin means a misconfigured test harness gets no indication of failure.

**Finding F-RISK-02 (reference to F-STRUCT-01):**
- Type: `design_flaw`
- Domain: `security`
- Disposition: open
- Confidence: 100 (tool-verified)
- Severity: Medium
- Evidence: `printf '' | CLAUDE_ENV_FILE=$TMP bash session-start.sh; echo $?` → exit 0. Env file has only PASSTHROUGH vars. Required vars (CLAUDE_CODE_SESSION_ID etc) not written.
- Why it matters: Fail-open on empty stdin. A test harness or integration that accidentally provides no stdin will succeed with no session identity persisted, without any error signal.
- Suggested direction: Validate `$payload` is non-empty before the jq block. A two-line guard after line 45: `[[ -n "$payload" ]] || { printf '%s\n' "session-start.sh: empty stdin — expected JSON payload" >&2; exit 1; }`.

### S5 — Idempotency
- Two fires: env file doubles in size but sourcing yields last-write-wins correct values. **PASS** (append-only is intentional and correct)

### S6 — Reversibility
- New file only; no existing behavior modified. T1 commit is isolated and reversible via revert. **PASS**

---

**Per-perspective verdict: REVISE**

F-RISK-02 is Medium/100. Medium findings do not trigger REVISE threshold (only High/50+ does). Re-checking: the threshold is "any High with confidence ≥ 50 → REVISE". F-RISK-02 is Medium/100. **Per-perspective verdict: PASS** (Medium finding recorded).

## Low-confidence appendix
None.
