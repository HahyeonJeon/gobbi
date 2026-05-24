# Usage — T07+T08 iter1

## Artifact Summary + Memory reads
(See `project.md`.)

## Locked Frame (Stage 1)

### Scenario U-1: A developer reading the scripts understands intent
- [ ] Top-of-file block self-explains usage
- [ ] Reconstructor has explicit `Usage:` section showing argv variants

### Scenario U-2: Error messages are actionable
- [ ] Every bail/die message names the missing thing or the failure mode
- [ ] No generic "Error" / "failed"

### Scenario U-3: Behavior changes documented for downstream
- [ ] Commit body lists what the scripts do for the manager / orchestration consumers
- [ ] Idempotency contract explicit

### Scenario U-4: Logging conventions
- [ ] LOG_TAG prefix lets operators grep hook output in stderr stream

### Scenario U-5 (adversarial): Caller has to read implementation to use it
- [ ] Reconstructor argv contract clear from top comment alone
- [ ] Hook stdin contract clear from top comment alone

### Scenario U-6: Accessibility (operator-facing)
- [ ] Log format is scannable
- [ ] Orphan reports flag entries by id (not by index)

## Per-scenario per-check results

U-1: ✓ Both scripts have substantial header comments. T08 lines 19-23 give 3 usage variants. ✓ T07 stdin contract listed in lines 17-21.

U-2: ✓ All bail/die messages are specific: "missing tool_use_id", "session.json not found at $session_json", "resolver: $projects_dir absent", "session-dir resolver: cannot disambiguate session dir (n=$n)", "flock failed on $lock_file", "jq upsert failed", "tmp file failed JSON validation", "no session.json argument and project resolver failed". Strong.

U-3: ✓ Commit body lists T07 + T08 separately with their consumers (T09 settings + future sessions). ✓ Idempotency claimed and verified in commit body.

U-4: ✓ LOG_TAG is `post-tool-use-agents.sh` / `reconstruct-agents.sh` — operator can grep. ✓ Stderr-only (never stdout) so it doesn't pollute hook's stdout protocol with Claude Code.

U-5: ✓ Reconstructor argv: `reconstruct-agents.sh [session.json] [transcript.jsonl]` — both optional, falls back to PWD-based resolver. Clear from header. ✓ Hook stdin: JSON payload with named fields — listed in header.

U-6: ✓ Log lines start with consistent prefix, one logical event per line. ✓ Orphan report: `orphan id=$oid` (line 185) — id-keyed.

## Typed findings

### Finding USE-1 — Reconstructor's "transcript not found" path is silent on stdout AND exits 0
- **finding-id**: use-transcript-not-found-silent-success
- **Type**: `design_flaw` (Domain: `observability`)
- **Disposition**: open
- **Confidence**: 100 (verified)
- **Severity**: Medium
- **Evidence**: T08 lines 90-93. When the resolved `transcriptPath` is missing or absent from session.json, the script logs "transcript not found ($transcript_path); nothing to reconcile" and exits 0.
- **Why it matters**: An operator running `bash reconstruct-agents.sh` and getting exit 0 reasonably assumes the agents[] was reconciled. The actual behavior is "did nothing because transcript not found" — silently a no-op. Failure-mode communication is incomplete. Exit 0 is the right default for hook scope, but for the standalone reconstructor invocation it would be more honest to surface a distinct exit code (or echo a summary line to stdout).
- **Suggested direction (manager-owned)**: Consider distinguishing "no work needed" from "could not find work to do" — e.g., a `--quiet` flag for hook-runtime use, default verbose for human invocation.

### Finding USE-2 — Hook's bail() return code (always 0) hides systemic resolver failures from the operator
- **finding-id**: use-bail-always-zero
- **Type**: `assumption_risk` (Domain: `observability`)
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: Hook line 31 `bail() { log "$*"; exit 0; }`. Resolver failures (e.g., "session-dir resolver: cannot disambiguate session dir (n=$n)") log to stderr but the hook still reports success to Claude Code. If a project layout change silently breaks the resolver, no observable signal reaches the user until they check session.json and find an empty agents[].
- **Why it matters**: Designed-in trade-off (don't block Claude > strict observability), but worth documenting. The user can grep stderr in their terminal session, but in non-interactive contexts (e.g., headless agent runs) this disappears.
- **Suggested direction (manager-owned)**: Defer — the trade-off is correct for hook context. Document the operator-facing recovery: "run `reconstruct-agents.sh` to verify-and-fix at any time".

### Finding USE-3 — Reconstructor latest-session selection uses `ls | sort | tail` (lexicographic, not mtime)
- **finding-id**: use-latest-session-lexicographic
- **Type**: `assumption_risk` (Domain: `general`)
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: T08 line 74: `latest=$(ls -1d "$sessions_dir"/*/ 2>/dev/null | sort | tail -n1)`. Session dirs are `YYYY-MM-DD-SSID/` so lexicographic sort matches chronological for the YYYY-MM-DD prefix. But within the same day, the SSID is a UUID — sort order is arbitrary. If two sessions started the same day, the wrong one could be "latest".
- **Why it matters**: Rare in practice (one session per day usually). But naming-based defaults are fragile.
- **Suggested direction (manager-owned)**: Defer; the explicit argv override (`reconstruct-agents.sh <session.json>`) is the safe path. Document this in the script header.

## Per-perspective verdict

**PASS**. Strong header docs, actionable error messages, scannable logs. USE-1 is the only Medium and is deferrable.

## Low-confidence appendix

(none)
