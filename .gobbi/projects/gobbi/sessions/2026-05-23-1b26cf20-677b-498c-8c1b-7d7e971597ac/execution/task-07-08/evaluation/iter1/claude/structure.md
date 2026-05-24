# Structure — T07+T08 iter1

## Artifact Summary + Memory reads

(See `project.md` § Artifact Summary.)

## Locked Frame (Stage 1)

### Scenario S-1: Code matches Ideation directional design
- [ ] Bash + jq stack per D-3-1
- [ ] `session-start.sh` shape (set -uo pipefail, log/bail helpers, stderr diagnostics)
- [ ] Two-tier extraction per D-3-1
- [ ] Single script handles both events per D-3-3
- [ ] D-3-3-resolver: step (i) DORMANT project.json + step (ii) directory scan
- [ ] D-3-5: flock -x on every session.json mutation
- [ ] D-3-6: tool_use_id correlation
- [ ] Atomic mv via temp file (R1+R2 corrections)

### Scenario S-2: Module decomposition + reuse
- [ ] Resolver helpers (resolve_project_name / resolve_session_dir) factored cleanly
- [ ] Shared resolver pattern between T07 and T08 (executor reused snippets per LOCK #2)

### Scenario S-3: Error handling style consistent
- [ ] Hook: ALWAYS exits 0 (never blocks Claude) per ideation
- [ ] Reconstructor: exits non-zero only on argv/IO errors before any write

### Scenario S-4: Dependency surface controlled
- [ ] No new deps; bash + jq (system tools already present per session-start.sh)

### Scenario S-5: Tests / verification
- [ ] Plan verifies = `bash -n` + graceful empty + idempotency only — no unit-test infrastructure asked for
- [ ] Executor ran each verification and the results are documented in commit body

### Scenario S-6 (adversarial): New helper with one caller / premature abstraction
- [ ] `extract_header` (T07) — called 4×, justified
- [ ] `resolve_project_name`/`resolve_session_dir` (T07) — called 1× each but isolate the resolver shape
- [ ] `header` jq def (T08) — called 4×, justified
- [ ] No premature abstractions

### Scenario S-7 (adversarial): Cross-script schema parity (hook vs reconstructor)
- [ ] Identical field set written into `agents[]` by both producers
- [ ] Identical extraction semantics for header values (trim / truncation)

## Per-scenario per-check results

S-1: ✓ bash+jq stack (lines 26, 30, 36-49). ✓ session-start.sh shape — same `set -uo pipefail`, same `log()`/`bail()` idiom. ✓ Two-tier (hook lines 151-162 prefer toolUseResult; lines 178-179 fallback to tool_result). ✓ Single script handles both via `case "$hook_event"` (lines 165-167). ✓ Resolver step (i) DORMANT (lines 71-79); step (ii) ACTIVE (lines 80-94). ✓ flock -x (hook line 220; reconstructor line 199). ✓ tool_use_id correlation (hook line 154-161; reconstructor lines 117-123). ✓ Atomic temp+mv (hook lines 217-248; reconstructor lines 195-237).

S-2: ✓ Resolver helpers cleanly factored — and IDENTICAL between the two scripts (DRY would normally extract to a shared lib, but two scripts in different roles is acceptable for shell). Mild concern flagged below.

S-3: ✓ Hook: `bail() { log "$*"; exit 0; }` (line 31); every error path goes through bail. ✓ Reconstructor: `die() { log "$*"; exit 1; }` (line 32); but within the `flock` subshell, `exit 1` on jq failure (lines 219-223) — see Risk perspective for subshell semantics.

S-4: ✓ No package.json changes; bash + jq + standard coreutils (cat, grep, sed, head, basename, mktemp, cmp, mv, rm). All present in session-start.sh's environment.

S-5: ✓ Plan verifies enumerated in commit body and I reproduced them all. `shellcheck NOT AVAILABLE` is disclosed; not gameable since plan acceptance allows conditional.

S-6: ✓ `extract_header` called 4× (step/phase/iter/sub-step). ✓ resolver helpers called 1× each but encapsulate non-trivial logic — keep. ✓ jq `def header` called 4×. None are premature.

S-7: ✗ Asymmetry exists — see STRUCT-1 below.

## Typed findings

### Finding STRUCT-1 — Header truncation/trim asymmetry between hook and reconstructor
- **finding-id**: struct-header-truncation-asymmetry
- **Type**: `design_flaw` (Domain: `regression`)
- **Disposition**: open
- **Confidence**: 100 (verified by direct test)
- **Severity**: Medium
- **Evidence**:
  - Hook line 136: `| head -c 200 || true` — truncates at **200 BYTES**.
  - Reconstructor line 140: `.v | gsub("[[:space:]]+$"; "") | .[0:200]` — truncates at **200 CODEPOINTS** AND right-trims whitespace.
  - Direct test: `Your phase: ideation   ` → hook keeps trailing spaces (`ideation   `); reconstructor strips them (`ideation`).
  - On multi-byte UTF-8: `head -c 200` may split a codepoint mid-byte (cf. emoji test: `head -c 5` on `🎯🎯…` produced `f09f 8eaf f0` — incomplete fourth codepoint).
- **Why it matters**: For the SAME subagent spawn, a hook-written agents[] entry will have a different `phase`/`iter`/`sub-step` value than a reconstructor-written entry. This breaks the verify-and-fix idempotency contract on the merge path: when the reconstructor merges over a hook-written entry, it overwrites with the trimmed/codepoint-truncated value, producing a non-idempotent flip-flop on every reconstruction. It also risks JSON write failure on truncated UTF-8.
- **Suggested direction (manager-owned)**: Unify truncation semantics — either teach the hook to use `awk` / `cut -c` for codepoint-safe truncation + trim, or accept that the reconstructor is the canonical writer and document the asymmetry.

### Finding STRUCT-2 — Resolver code duplicated verbatim across two scripts
- **finding-id**: struct-resolver-duplicated
- **Type**: `design_flaw` (Domain: `general`)
- **Disposition**: open
- **Confidence**: 100 (verified — lines 68-94 of hook ≈ lines 41-65 of reconstructor)
- **Severity**: Low
- **Evidence**: Both scripts contain near-identical `resolve_project_name` (and the hook adds `resolve_session_dir`). LOCK #2's shared-executor was chosen to share jq snippets; the resolver shows the same DRY pressure but stays duplicated.
- **Why it matters**: Future resolver changes must be made in both files. A drift here would silently route session.json writes to different sessions.
- **Suggested direction (manager-owned)**: Defer — bash sourcing a shared lib adds load-order risk in hook context. Document the duplication intent in both files instead.

### Finding STRUCT-3 — Hook `set -uo pipefail` without `-e`; some failure paths rely on `|| true`
- **finding-id**: struct-no-set-e
- **Type**: `assumption_risk` (Domain: `general`)
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: T07 line 26 uses `set -uo pipefail` (no `-e`). The script bails explicitly on every error path it cares about, which is the correct choice for a "never block Claude" hook. But a future maintainer adding a `set -e` without thinking would change exit semantics.
- **Why it matters**: Intentional design (graceful never-block) that could be undone by a future "tighten error handling" patch.
- **Suggested direction (manager-owned)**: Add a single-line comment near `set -uo pipefail` explaining the deliberate omission of `-e`.

### Finding STRUCT-4 — Redundant boolean expression in tier1 jq filter
- **finding-id**: struct-tier1-redundant-filter
- **Type**: `general` (Domain: `general`)
- **Disposition**: open
- **Confidence**: 75 (close-reading verified)
- **Severity**: Low
- **Evidence**: Hook lines 156-160. Boolean: `A or (B and C)` where A = tuid-match, C = tuid-match (identical to A), B = agentId-present. By precedence, this is `A ∨ (B ∧ A)` which simplifies to `A`. The agentId-presence check is dead.
- **Why it matters**: Subtle code smell. Suggests the executor intended one filter (probably "match by tuid AND has agentId") but the precedence and duplicated subexpression collapse it to just "match by tuid".
- **Suggested direction (manager-owned)**: Simplify to `select((.message.content[]?.tool_use_id // empty) == $tuid)`. The behavior is already correct; this is readability.

## Per-perspective verdict

**REVISE**. STRUCT-1 is a Medium `design_flaw`; under threshold rules it would normally trigger REVISE only if severity is High. However STRUCT-1 directly threatens the idempotency contract that T08 was built to satisfy — flagging as REVISE with the manager. STRUCT-2/3/4 are recorded; not blocking.

## Low-confidence appendix

(none below Confidence 50)
